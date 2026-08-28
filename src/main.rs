use anyhow::{Context, Result, anyhow, bail};
use clap::{Args, Parser, Subcommand};
use hmac::{Hmac, Mac};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::env;
use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::process::{Command, ExitCode, Stdio};
use std::thread;
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

type HmacSha256 = Hmac<Sha256>;

#[derive(Parser, Debug)]
#[command(name = "restore-drill", version, about, long_about = None)]
struct Cli {
    /// Print the final result as JSON for scripts.
    #[arg(long, global = true)]
    json: bool,

    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand, Debug)]
enum Commands {
    /// Restore a backup in an isolated disposable Postgres container.
    Run(RunArgs),
    /// Run the bundled sample backup and print its receipt path.
    Demo(DemoArgs),
    /// Verify that a receipt matches its local signing key.
    VerifyReceipt(VerifyArgs),
}

#[derive(Args, Debug, Clone)]
struct RunArgs {
    /// Plain SQL, custom, tar, or directory-format pg_dump backup.
    #[arg(long)]
    dump: PathBuf,

    /// Exact disposable Postgres image tag, such as 15.8 or 17.
    #[arg(long)]
    postgres: String,

    /// Extension that must exist after restore. Repeat for more.
    #[arg(long = "expect-extension")]
    expected_extensions: Vec<String>,

    /// Role that must exist after restore. Repeat for more.
    #[arg(long = "expect-role")]
    expected_roles: Vec<String>,

    /// Schema-qualified table that must exist. Repeat for more.
    #[arg(long = "expect-table")]
    expected_tables: Vec<String>,

    /// JSON receipt output path.
    #[arg(long, default_value = "restore-drill-receipt.json")]
    receipt: PathBuf,

    /// HMAC key path. Created with mode 0600 when absent.
    #[arg(long)]
    signing_key: Option<PathBuf>,

    /// Container runtime command: docker or podman.
    #[arg(long, default_value = "docker")]
    runtime: String,

    /// Maximum restore time before the disposable container is stopped.
    #[arg(long, default_value_t = 1200)]
    timeout_seconds: u64,
}

#[derive(Args, Debug)]
struct DemoArgs {
    /// Postgres image tag used for the sample drill.
    #[arg(long, default_value = "15")]
    postgres: String,

    /// Container runtime command: docker or podman.
    #[arg(long, default_value = "docker")]
    runtime: String,

    /// Put demo files in this directory instead of a new temp directory.
    #[arg(long)]
    output_dir: Option<PathBuf>,
}

#[derive(Args, Debug)]
struct VerifyArgs {
    #[arg(long)]
    receipt: PathBuf,

    #[arg(long)]
    signing_key: PathBuf,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
enum Status {
    Pass,
    Fail,
    Error,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Check {
    id: String,
    status: Status,
    detail: String,
    remedy: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Signature {
    algorithm: String,
    key_fingerprint: String,
    value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Receipt {
    schema_version: u8,
    drill_id: String,
    created_at_unix: u64,
    duration_ms: u128,
    status: Status,
    postgres_target: String,
    source_version: Option<String>,
    backup_sha256: String,
    runtime: String,
    isolation: String,
    checks: Vec<Check>,
    signature: Option<Signature>,
}

fn main() -> ExitCode {
    let cli = Cli::parse();
    let json = cli.json;
    match execute(cli) {
        Ok(code) => ExitCode::from(code),
        Err(error) => {
            if json {
                println!(
                    "{}",
                    serde_json::json!({
                        "status": "error",
                        "error": format!("{error:#}"),
                        "next_step": "Check the path and container runtime, then run the command again."
                    })
                );
            } else {
                eprintln!("Restore Drill could not start: {error:#}");
                eprintln!(
                    "Next step: check the path and container runtime, then run the command again."
                );
            }
            ExitCode::from(3)
        }
    }
}

fn execute(cli: Cli) -> Result<u8> {
    match cli.command {
        Commands::Run(args) => run_drill(args, cli.json),
        Commands::Demo(args) => run_demo(args, cli.json),
        Commands::VerifyReceipt(args) => verify_receipt_command(args, cli.json),
    }
}

fn run_demo(args: DemoArgs, json: bool) -> Result<u8> {
    let dir = args
        .output_dir
        .unwrap_or_else(|| env::temp_dir().join(format!("restore-drill-demo-{}", now_unix())));
    fs::create_dir_all(&dir).with_context(|| format!("create {}", dir.display()))?;
    let dump = dir.join("sample-backup.sql");
    fs::write(&dump, include_bytes!("../examples/sample-backup.sql"))?;
    if !json {
        println!("Demo — bundled sample data; the source backup is not changed.");
        println!("Files: {}", dir.display());
    }
    run_drill(
        RunArgs {
            dump,
            postgres: args.postgres,
            expected_extensions: vec!["plpgsql".into()],
            expected_roles: vec!["restore_reader".into()],
            expected_tables: vec!["public.restore_probe".into()],
            receipt: dir.join("restore-drill-receipt.json"),
            signing_key: Some(dir.join("receipt-signing.key")),
            runtime: args.runtime,
            timeout_seconds: 1200,
        },
        json,
    )
}

fn run_drill(args: RunArgs, json: bool) -> Result<u8> {
    validate_args(&args)?;
    let started = Instant::now();
    let created_at = now_unix();
    let drill_id = format!("rd-{created_at}-{}", std::process::id());
    let dump = args
        .dump
        .canonicalize()
        .with_context(|| format!("backup {} was not found", args.dump.display()))?;
    let backup_hash = hash_path(&dump)?;
    let scan = scan_plain_dump(&dump)?;
    let mut checks = preflight_checks(&scan, &args.postgres);
    let container_name = format!("restore-drill-{created_at}-{}", std::process::id());

    if !json {
        println!("RESTORE DRILL  {drill_id}");
        println!("Target         postgres:{}", args.postgres);
        println!("Isolation      no network · no published port · tmpfs data");
        println!("Backup hash    {}", &backup_hash[..12]);
    }

    let has_preflight_failure = checks.iter().any(|c| c.status == Status::Fail);
    if !has_preflight_failure {
        match Container::start(&args.runtime, &container_name, &dump, &args.postgres) {
            Ok(container) => {
                let ready = container.wait_ready(Duration::from_secs(45));
                match ready {
                    Ok(()) => checks.push(pass(
                        "container-ready",
                        "Disposable Postgres accepted connections.",
                    )),
                    Err(error) => checks.push(error_check(
                        "container-ready",
                        format!("Disposable Postgres did not become ready: {error}"),
                        "Confirm the image exists locally or let the runtime pull it, then retry.",
                    )),
                }

                if !checks.iter().any(|c| c.status == Status::Error) {
                    match container.check_available_extensions(&args.expected_extensions) {
                        Ok(result) => checks.extend(result),
                        Err(error) => checks.push(error_check(
                            "extension-query",
                            format!("Available extensions could not be read: {error}"),
                            "Read the container logs, confirm Postgres is still running, and retry.",
                        )),
                    }
                    if checks.iter().all(|c| c.status == Status::Pass) {
                        checks.push(
                            container.restore(&dump, Duration::from_secs(args.timeout_seconds)),
                        );
                    }
                    if !checks.iter().any(|c| c.status != Status::Pass) {
                        let queries = [
                            (
                                "extensions",
                                "SELECT extname FROM pg_extension ORDER BY 1",
                                &args.expected_extensions,
                            ),
                            (
                                "roles",
                                "SELECT rolname FROM pg_roles ORDER BY 1",
                                &args.expected_roles,
                            ),
                            (
                                "tables",
                                "SELECT schemaname || '.' || tablename FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema') ORDER BY 1",
                                &args.expected_tables,
                            ),
                        ];
                        for (prefix, sql, expected) in queries {
                            match container.check_values(prefix, sql, expected) {
                                Ok(result) => checks.extend(result),
                                Err(error) => checks.push(error_check(
                                    format!("{prefix}-query"),
                                    format!("Post-restore {prefix} could not be read: {error}"),
                                    "Read the container logs and run a new drill.",
                                )),
                            }
                        }
                    }
                }
            }
            Err(error) => checks.push(error_check(
                "container-start",
                format!("The disposable container did not start: {error:#}"),
                "Start Docker or Podman, then run the same drill again.",
            )),
        }
    }

    let status = overall_status(&checks);
    let mut receipt = Receipt {
        schema_version: 1,
        drill_id,
        created_at_unix: created_at,
        duration_ms: started.elapsed().as_millis(),
        status: status.clone(),
        postgres_target: args.postgres,
        source_version: scan.source_version,
        backup_sha256: backup_hash,
        runtime: args.runtime,
        isolation: "container network=none; no published ports; database data on tmpfs; backup mounted read-only".into(),
        checks,
        signature: None,
    };
    let key_path = args
        .signing_key
        .unwrap_or_else(|| sibling_key_path(&args.receipt));
    let key = load_or_create_key(&key_path)?;
    sign_receipt(&mut receipt, &key)?;
    write_receipt(&args.receipt, &receipt)?;

    if json {
        println!("{}", serde_json::to_string(&receipt)?);
    } else {
        print_receipt(&receipt, &args.receipt, &key_path);
    }
    Ok(match status {
        Status::Pass => 0,
        Status::Fail => 2,
        Status::Error => 3,
    })
}

fn validate_args(args: &RunArgs) -> Result<()> {
    if args.timeout_seconds == 0 || args.timeout_seconds > 86_400 {
        bail!("--timeout-seconds must be between 1 and 86400");
    }
    validate_version(&args.postgres)?;
    if args.runtime.contains('/') || args.runtime.contains('\\') || args.runtime.trim().is_empty() {
        bail!("--runtime must be a command name such as docker or podman");
    }
    for value in args.expected_extensions.iter().chain(&args.expected_roles) {
        validate_identifier(value)?;
    }
    for table in &args.expected_tables {
        let Some((schema, name)) = table.split_once('.') else {
            bail!("expected table {table:?} must be schema-qualified, for example public.accounts");
        };
        validate_identifier(schema)?;
        validate_identifier(name)?;
    }
    Ok(())
}

fn validate_version(value: &str) -> Result<()> {
    let valid = !value.is_empty()
        && value.len() <= 20
        && value
            .split('.')
            .all(|part| !part.is_empty() && part.bytes().all(|b| b.is_ascii_digit()));
    if !valid {
        bail!("Postgres version {value:?} is invalid; use a numeric image tag such as 15.8 or 17");
    }
    Ok(())
}

fn validate_identifier(value: &str) -> Result<()> {
    let mut chars = value.chars();
    let first = chars
        .next()
        .ok_or_else(|| anyhow!("expected names cannot be empty"))?;
    if !(first == '_' || first.is_ascii_alphabetic())
        || !chars.all(|c| c == '_' || c == '$' || c.is_ascii_alphanumeric())
    {
        bail!("expected name {value:?} is invalid; use an unquoted Postgres identifier");
    }
    Ok(())
}

struct Container {
    runtime: String,
    name: String,
}

impl Container {
    fn start(runtime: &str, name: &str, dump: &Path, version: &str) -> Result<Self> {
        let mount = format!("{}:/drill/input:ro", dump.display());
        let output = Command::new(runtime)
            .args([
                "run",
                "-d",
                "--rm",
                "--name",
                name,
                "--network",
                "none",
                "--tmpfs",
                "/var/lib/postgresql/data:rw,noexec,nosuid,size=2g",
                "--tmpfs",
                "/var/run/postgresql:rw,nosuid,size=16m",
                "-e",
                "POSTGRES_PASSWORD=restore-drill-local-only",
                "-e",
                "POSTGRES_DB=restore_drill",
                "-v",
                &mount,
                &format!("postgres:{version}"),
            ])
            .output()
            .with_context(|| format!("run {runtime}"))?;
        if !output.status.success() {
            bail!("{}", concise_stderr(&output.stderr));
        }
        Ok(Self {
            runtime: runtime.into(),
            name: name.into(),
        })
    }

    fn wait_ready(&self, timeout: Duration) -> Result<()> {
        let started = Instant::now();
        while started.elapsed() < timeout {
            let status = Command::new(&self.runtime)
                .args([
                    "exec",
                    &self.name,
                    "pg_isready",
                    "-U",
                    "postgres",
                    "-d",
                    "restore_drill",
                ])
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .status();
            if matches!(status, Ok(value) if value.success()) {
                return Ok(());
            }
            thread::sleep(Duration::from_millis(500));
        }
        bail!("timed out after {} seconds", timeout.as_secs())
    }

    fn restore(&self, dump: &Path, timeout: Duration) -> Check {
        let plain = is_plain_sql(dump).unwrap_or(false);
        let mut command = Command::new(&self.runtime);
        command.args(["exec"]);
        if plain {
            command.arg("-i");
        }
        command.arg(&self.name);
        if plain {
            command.args([
                "psql",
                "--set",
                "ON_ERROR_STOP=on",
                "-U",
                "postgres",
                "-d",
                "restore_drill",
            ]);
            match File::open(dump) {
                Ok(file) => {
                    command.stdin(Stdio::from(file));
                }
                Err(error) => {
                    return error_check(
                        "restore",
                        format!("Backup could not be opened: {error}"),
                        "Check the backup file permissions, then retry.",
                    );
                }
            }
        } else {
            command.args([
                "pg_restore",
                "--exit-on-error",
                "--no-owner",
                "--no-privileges",
                "-U",
                "postgres",
                "-d",
                "restore_drill",
                "/drill/input",
            ]);
        }
        command.stdout(Stdio::piped()).stderr(Stdio::piped());
        match run_with_timeout(command, timeout) {
            Ok(output) if output.status.success() => {
                pass("restore", "The backup restored without a database error.")
            }
            Ok(output) => fail(
                "restore",
                format!(
                    "Postgres rejected the backup: {}",
                    concise_stderr(&output.stderr)
                ),
                "Read the first database error, fix the version or extension mismatch, and run a new drill.",
            ),
            Err(error) => error_check(
                "restore",
                format!("The restore process stopped: {error}"),
                "Check the runtime and retry with a longer timeout if the backup is large.",
            ),
        }
    }

    fn query(&self, sql: &str) -> Result<Vec<String>> {
        let output = Command::new(&self.runtime)
            .args([
                "exec",
                &self.name,
                "psql",
                "-At",
                "-U",
                "postgres",
                "-d",
                "restore_drill",
                "-c",
                sql,
            ])
            .output()?;
        if !output.status.success() {
            bail!("{}", concise_stderr(&output.stderr));
        }
        Ok(String::from_utf8_lossy(&output.stdout)
            .lines()
            .map(str::to_owned)
            .collect())
    }

    fn check_available_extensions(&self, expected: &[String]) -> Result<Vec<Check>> {
        if expected.is_empty() {
            return Ok(vec![]);
        }
        let available = self.query("SELECT name FROM pg_available_extensions ORDER BY 1")?;
        Ok(compare_expected(
            "extension-available",
            "extension",
            expected,
            &available,
            "Use a Postgres image that includes this extension, or remove it from the backup before the next drill.",
        ))
    }

    fn check_values(&self, prefix: &str, sql: &str, expected: &[String]) -> Result<Vec<Check>> {
        let actual = self.query(sql)?;
        Ok(compare_expected(
            prefix,
            prefix.trim_end_matches('s'),
            expected,
            &actual,
            "Add the missing object to the backup or correct the expected name, then run a new drill.",
        ))
    }
}

impl Drop for Container {
    fn drop(&mut self) {
        let _ = Command::new(&self.runtime)
            .args(["rm", "-f", &self.name])
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .status();
    }
}

fn compare_expected(
    prefix: &str,
    noun: &str,
    expected: &[String],
    actual: &[String],
    remedy: &str,
) -> Vec<Check> {
    if expected.is_empty() {
        return vec![pass(
            format!("{prefix}-none"),
            format!("No {noun} expectations were set."),
        )];
    }
    expected
        .iter()
        .map(|item| {
            if actual.iter().any(|value| value == item) {
                pass(
                    format!("{prefix}:{item}"),
                    format!("Expected {noun} {item} exists."),
                )
            } else {
                fail(
                    format!("{prefix}:{item}"),
                    format!("Expected {noun} {item} is missing."),
                    remedy,
                )
            }
        })
        .collect()
}

#[derive(Default)]
struct DumpScan {
    source_version: Option<String>,
    has_transaction_timeout: bool,
}

fn scan_plain_dump(path: &Path) -> Result<DumpScan> {
    if !path.is_file() || !is_plain_sql(path)? {
        return Ok(DumpScan::default());
    }
    let mut file = File::open(path)?;
    let mut buffer = vec![0; 1024 * 1024];
    let count = file.read(&mut buffer)?;
    let text = String::from_utf8_lossy(&buffer[..count]);
    let source_version = text.lines().find_map(|line| {
        line.strip_prefix("-- Dumped from database version ")
            .map(|rest| rest.split_whitespace().next().unwrap_or(rest).to_owned())
    });
    Ok(DumpScan {
        source_version,
        has_transaction_timeout: text.contains("transaction_timeout"),
    })
}

fn preflight_checks(scan: &DumpScan, target: &str) -> Vec<Check> {
    let mut checks = vec![];
    if let Some(source) = &scan.source_version {
        let source_major = major(source);
        let target_major = major(target);
        if source_major > target_major {
            checks.push(fail(
                "source-target-version",
                format!("The dump reports Postgres {source}, newer than target {target}."),
                "Choose the same or a newer target major version, or create the dump with the target version of pg_dump.",
            ));
        } else {
            checks.push(pass(
                "source-target-version",
                format!("Dump version {source} is not newer than target {target}."),
            ));
        }
    } else {
        checks.push(Check {
            id: "source-version".into(), status: Status::Pass,
            detail: "The source version was not present in the readable dump header; the live restore remains authoritative.".into(), remedy: None,
        });
    }
    if scan.has_transaction_timeout && major(target) < 17 {
        checks.push(fail(
            "transaction-timeout-setting",
            format!("The dump sets transaction_timeout, which target Postgres {target} does not support."),
            "Use Postgres 17 or remove that setting from a reviewed plain SQL dump before retrying.",
        ));
    }
    checks
}

fn major(version: &str) -> u32 {
    version
        .split('.')
        .next()
        .and_then(|v| v.parse().ok())
        .unwrap_or(0)
}

fn is_plain_sql(path: &Path) -> Result<bool> {
    if path.is_dir() {
        return Ok(false);
    }
    match path
        .extension()
        .and_then(|value| value.to_str())
        .unwrap_or("")
    {
        "sql" => return Ok(true),
        "dump" | "backup" | "tar" => return Ok(false),
        _ => {}
    }
    let mut file = File::open(path)?;
    let mut head = [0u8; 512];
    let count = file.read(&mut head)?;
    if head[..count].starts_with(b"PGDMP") || head[..count.min(2)] == [0x1f, 0x8b] {
        return Ok(false);
    }
    Ok(!head[..count].contains(&0) && std::str::from_utf8(&head[..count]).is_ok())
}

fn hash_path(path: &Path) -> Result<String> {
    let mut hasher = Sha256::new();
    if path.is_dir() {
        let mut entries: Vec<_> = fs::read_dir(path)?.collect::<std::io::Result<_>>()?;
        entries.sort_by_key(|entry| entry.file_name());
        for entry in entries {
            if entry.path().is_file() {
                hasher.update(entry.file_name().to_string_lossy().as_bytes());
                hash_file_into(&entry.path(), &mut hasher)?;
            }
        }
    } else {
        hash_file_into(path, &mut hasher)?;
    }
    Ok(hex::encode(hasher.finalize()))
}

fn hash_file_into(path: &Path, hasher: &mut Sha256) -> Result<()> {
    let mut file = File::open(path)?;
    let mut buffer = [0u8; 64 * 1024];
    loop {
        let count = file.read(&mut buffer)?;
        if count == 0 {
            break;
        }
        hasher.update(&buffer[..count]);
    }
    Ok(())
}

fn run_with_timeout(mut command: Command, timeout: Duration) -> Result<std::process::Output> {
    let mut child = command.spawn()?;
    let started = Instant::now();
    loop {
        if child.try_wait()?.is_some() {
            return child.wait_with_output().map_err(Into::into);
        }
        if started.elapsed() >= timeout {
            child.kill()?;
            let _ = child.wait();
            bail!("timed out after {} seconds", timeout.as_secs());
        }
        thread::sleep(Duration::from_millis(100));
    }
}

fn load_or_create_key(path: &Path) -> Result<Vec<u8>> {
    if path.exists() {
        return read_key(path);
    }
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }
    let mut key = [0u8; 32];
    File::open("/dev/urandom")?.read_exact(&mut key)?;
    let mut options = fs::OpenOptions::new();
    options.write(true).create_new(true);
    #[cfg(unix)]
    {
        use std::os::unix::fs::OpenOptionsExt;
        options.mode(0o600);
    }
    let mut file = options.open(path)?;
    writeln!(file, "{}", hex::encode(key))?;
    Ok(key.to_vec())
}

fn read_key(path: &Path) -> Result<Vec<u8>> {
    let value =
        fs::read_to_string(path).with_context(|| format!("read signing key {}", path.display()))?;
    let key = hex::decode(value.trim()).context("signing key must contain hex bytes")?;
    if key.len() < 32 {
        bail!("signing key must contain at least 32 bytes");
    }
    Ok(key)
}

fn sign_receipt(receipt: &mut Receipt, key: &[u8]) -> Result<()> {
    receipt.signature = None;
    let bytes = serde_json::to_vec(receipt)?;
    let mut mac = HmacSha256::new_from_slice(key).map_err(|_| anyhow!("invalid signing key"))?;
    mac.update(&bytes);
    let fingerprint = hex::encode(Sha256::digest(key));
    receipt.signature = Some(Signature {
        algorithm: "HMAC-SHA256".into(),
        key_fingerprint: fingerprint[..16].into(),
        value: hex::encode(mac.finalize().into_bytes()),
    });
    Ok(())
}

fn receipt_signature_valid(receipt: &Receipt, key: &[u8]) -> Result<bool> {
    let Some(signature) = receipt.signature.clone() else {
        return Ok(false);
    };
    let mut unsigned = receipt.clone();
    unsigned.signature = None;
    let mut mac = HmacSha256::new_from_slice(key).map_err(|_| anyhow!("invalid signing key"))?;
    mac.update(&serde_json::to_vec(&unsigned)?);
    let supplied = hex::decode(signature.value).context("receipt signature is not valid hex")?;
    Ok(mac.verify_slice(&supplied).is_ok())
}

fn verify_receipt_command(args: VerifyArgs, json: bool) -> Result<u8> {
    let receipt: Receipt = serde_json::from_slice(&fs::read(&args.receipt)?)?;
    let key = read_key(&args.signing_key)?;
    let valid = receipt_signature_valid(&receipt, &key)?;
    if json {
        println!(
            "{{\"valid\":{valid},\"drill_id\":{}}}",
            serde_json::to_string(&receipt.drill_id)?
        );
    } else if valid {
        println!(
            "PASS  Receipt {} has a valid HMAC-SHA256 signature.",
            receipt.drill_id
        );
    } else {
        println!("FAIL  The receipt signature does not match this key.");
        println!(
            "Next step: use the key created beside the receipt, or treat the receipt as changed."
        );
    }
    Ok(if valid { 0 } else { 2 })
}

fn write_receipt(path: &Path, receipt: &Receipt) -> Result<()> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }
    fs::write(
        path,
        format!("{}\n", serde_json::to_string_pretty(receipt)?),
    )?;
    Ok(())
}

fn sibling_key_path(receipt: &Path) -> PathBuf {
    receipt
        .parent()
        .unwrap_or_else(|| Path::new("."))
        .join(".restore-drill-signing.key")
}

fn overall_status(checks: &[Check]) -> Status {
    if checks.iter().any(|check| check.status == Status::Error) {
        Status::Error
    } else if checks.iter().any(|check| check.status == Status::Fail) {
        Status::Fail
    } else {
        Status::Pass
    }
}

fn print_receipt(receipt: &Receipt, receipt_path: &Path, key_path: &Path) {
    println!();
    for check in &receipt.checks {
        let mark = match check.status {
            Status::Pass => "PASS",
            Status::Fail => "FAIL",
            Status::Error => "ERROR",
        };
        println!("{mark:<5} {}", check.detail);
        if let Some(remedy) = &check.remedy {
            println!("      Next: {remedy}");
        }
    }
    println!();
    println!(
        "RESULT  {:?} in {:.1}s",
        receipt.status,
        receipt.duration_ms as f64 / 1000.0
    );
    println!("Receipt {}", receipt_path.display());
    println!("Key     {}", key_path.display());
}

fn pass(id: impl Into<String>, detail: impl Into<String>) -> Check {
    Check {
        id: id.into(),
        status: Status::Pass,
        detail: detail.into(),
        remedy: None,
    }
}

fn fail(id: impl Into<String>, detail: impl Into<String>, remedy: impl Into<String>) -> Check {
    Check {
        id: id.into(),
        status: Status::Fail,
        detail: detail.into(),
        remedy: Some(remedy.into()),
    }
}

fn error_check(
    id: impl Into<String>,
    detail: impl Into<String>,
    remedy: impl Into<String>,
) -> Check {
    Check {
        id: id.into(),
        status: Status::Error,
        detail: detail.into(),
        remedy: Some(remedy.into()),
    }
}

fn concise_stderr(stderr: &[u8]) -> String {
    let text = String::from_utf8_lossy(stderr);
    text.lines()
        .find(|line| !line.trim().is_empty())
        .unwrap_or("no error detail was returned")
        .chars()
        .take(300)
        .collect()
}

fn now_unix() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn catches_newer_source_major() {
        let scan = DumpScan {
            source_version: Some("17.6".into()),
            has_transaction_timeout: false,
        };
        let checks = preflight_checks(&scan, "15.8");
        assert_eq!(checks[0].status, Status::Fail);
        assert!(checks[0].detail.contains("newer than target"));
    }

    #[test]
    fn catches_transaction_timeout_on_old_target() {
        let scan = DumpScan {
            source_version: Some("17.6".into()),
            has_transaction_timeout: true,
        };
        let checks = preflight_checks(&scan, "16");
        assert!(
            checks
                .iter()
                .any(|c| c.id == "transaction-timeout-setting" && c.status == Status::Fail)
        );
    }

    #[test]
    fn signs_and_detects_receipt_changes() {
        let mut receipt = Receipt {
            schema_version: 1,
            drill_id: "rd-test".into(),
            created_at_unix: 1,
            duration_ms: 4,
            status: Status::Pass,
            postgres_target: "15".into(),
            source_version: Some("15".into()),
            backup_sha256: "abc".into(),
            runtime: "docker".into(),
            isolation: "network none".into(),
            checks: vec![pass("restore", "restored")],
            signature: None,
        };
        let key = [7u8; 32];
        sign_receipt(&mut receipt, &key).unwrap();
        assert!(receipt_signature_valid(&receipt, &key).unwrap());
        receipt.postgres_target = "16".into();
        assert!(!receipt_signature_valid(&receipt, &key).unwrap());
    }

    #[test]
    fn validates_image_tags_and_names() {
        assert!(validate_version("15.8").is_ok());
        assert!(validate_version("latest").is_err());
        assert!(validate_identifier("app_user").is_ok());
        assert!(validate_identifier("app; DROP TABLE x").is_err());
    }
}
