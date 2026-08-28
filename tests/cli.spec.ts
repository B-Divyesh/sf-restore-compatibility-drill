import { test, expect } from '@playwright/test';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdtempSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '..');

function fakeRuntime(dir: string, name = 'fake-docker'): { path: string; log: string } {
  const bin = join(dir, name);
  const log = join(dir, 'runtime.log');
  writeFileSync(bin, `#!/bin/sh
printf '%s\\n' "$*" >> "$FAKE_RUNTIME_LOG"
case "$1" in
  run) echo fake-container; exit 0 ;;
  rm) exit 0 ;;
  exec)
    case "$*" in
      *pg_isready*) exit 0 ;;
      *pg_available_extensions*) echo plpgsql; exit 0 ;;
      *"SELECT extname"*) echo plpgsql; exit 0 ;;
      *"SELECT rolname"*) echo restore_reader; exit 0 ;;
      *"SELECT nspname"*) if [ "$FAKE_SCHEMAS" != "__EMPTY__" ]; then echo "\${FAKE_SCHEMAS:-restore_ready}"; fi; exit 0 ;;
      *"SELECT schemaname"*) echo public.restore_probe; exit 0 ;;
      *"--set ON_ERROR_STOP=on"*) cat >/dev/null; exit 0 ;;
      *pg_restore*) exit 0 ;;
    esac
    ;;
esac
exit 1
`);
  chmodSync(bin, 0o755);
  return { path: bin, log };
}

function buildCli(): string {
  execFileSync('cargo', ['build', '--quiet'], { cwd: repo });
  return join(repo, 'target/debug/restore-drill');
}

test('@claim:isolated-container @claim:backup-local @claim:ci-mode runs the real orchestration with an isolated read-only mount', () => {
  const dir = mkdtempSync(join(tmpdir(), 'restore-drill-claim-'));
  const fake = fakeRuntime(dir);
  const receipt = join(dir, 'receipt.json');
  const backup = join(dir, 'backup.sql');
  const original = readFileSync(join(repo, 'examples/sample-backup.sql'));
  writeFileSync(backup, original);
  const result = spawnSync(buildCli(), [
    '--json', 'run', '--dump', backup, '--postgres', '15',
    '--expect-extension', 'plpgsql', '--expect-role', 'restore_reader',
    '--expect-schema', 'restore_ready', '--expect-table', 'public.restore_probe',
    '--runtime', 'fake-docker', '--receipt', receipt,
  ], {
    cwd: repo,
    encoding: 'utf8',
    env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, FAKE_RUNTIME_LOG: fake.log },
  });
  expect(result.status, result.stderr).toBe(0);
  const log = readFileSync(fake.log, 'utf8');
  expect(log).toContain('--network none');
  expect(log).toContain('--tmpfs /var/lib/postgresql/data:rw,noexec,nosuid,size=2g');
  expect(log).toContain(`${backup}:/drill/input:ro`);
  expect(log).not.toContain('-p ');
  expect(readFileSync(backup)).toEqual(original);
  expect(JSON.parse(readFileSync(receipt, 'utf8')).status).toBe('pass');
});

test('@claim:schema-readiness reports present and missing required schemas', () => {
  const dir = mkdtempSync(join(tmpdir(), 'restore-drill-schema-'));
  const fake = fakeRuntime(dir);
  const commonArgs = [
    '--json', 'run', '--dump', join(repo, 'examples/sample-backup.sql'), '--postgres', '15',
    '--expect-schema', 'restore_ready', '--runtime', 'fake-docker',
  ];
  const environment = { ...process.env, PATH: `${dir}:${process.env.PATH}`, FAKE_RUNTIME_LOG: fake.log };
  const passResult = spawnSync(buildCli(), [...commonArgs, '--receipt', join(dir, 'pass.json')], {
    cwd: repo, encoding: 'utf8', env: environment,
  });
  expect(passResult.status, passResult.stderr).toBe(0);
  const passReceipt = JSON.parse(passResult.stdout);
  expect(passReceipt.checks).toEqual(expect.arrayContaining([
    expect.objectContaining({ id: 'schemas:restore_ready', status: 'pass' }),
  ]));

  const failResult = spawnSync(buildCli(), [...commonArgs, '--receipt', join(dir, 'fail.json')], {
    cwd: repo, encoding: 'utf8', env: { ...environment, FAKE_SCHEMAS: '__EMPTY__' },
  });
  expect(failResult.status, failResult.stderr).toBe(2);
  const failReceipt = JSON.parse(failResult.stdout);
  expect(failReceipt.checks).toEqual(expect.arrayContaining([
    expect.objectContaining({ id: 'schemas:restore_ready', status: 'fail', detail: expect.stringContaining('is missing') }),
  ]));
});

test('@claim:data-tmpfs-size sends a bounded selected disk size to the runtime and receipt', () => {
  const dir = mkdtempSync(join(tmpdir(), 'restore-drill-tmpfs-'));
  const fake = fakeRuntime(dir);
  const receipt = join(dir, 'receipt.json');
  const environment = { ...process.env, PATH: `${dir}:${process.env.PATH}`, FAKE_RUNTIME_LOG: fake.log };
  const result = spawnSync(buildCli(), [
    '--json', 'run', '--dump', join(repo, 'examples/sample-backup.sql'), '--postgres', '15',
    '--data-tmpfs-size', '8g', '--runtime', 'fake-docker', '--receipt', receipt,
  ], { cwd: repo, encoding: 'utf8', env: environment });
  expect(result.status, result.stderr).toBe(0);
  expect(readFileSync(fake.log, 'utf8')).toContain('--tmpfs /var/lib/postgresql/data:rw,noexec,nosuid,size=8g');
  expect(JSON.parse(readFileSync(receipt, 'utf8')).data_tmpfs_size).toBe('8g');

  for (const invalid of ['511m', '65g', '2gb']) {
    const rejected = spawnSync(buildCli(), [
      'run', '--dump', join(repo, 'examples/sample-backup.sql'), '--postgres', '15',
      '--data-tmpfs-size', invalid,
    ], { cwd: repo, encoding: 'utf8' });
    expect(rejected.status, invalid).toBe(3);
  }
});

test('@claim:cli-demo copies and runs the bundled sample in its isolated output directory', () => {
  const dir = mkdtempSync(join(tmpdir(), 'restore-drill-demo-'));
  const outputDir = join(dir, 'demo-output');
  const fake = fakeRuntime(dir);
  const original = readFileSync(join(repo, 'examples/sample-backup.sql'));
  const result = spawnSync(buildCli(), [
    '--json', 'demo', '--postgres', '15', '--runtime', 'fake-docker', '--output-dir', outputDir,
  ], {
    cwd: repo, encoding: 'utf8',
    env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, FAKE_RUNTIME_LOG: fake.log },
  });
  expect(result.status, result.stderr).toBe(0);
  expect(readFileSync(join(outputDir, 'sample-backup.sql'))).toEqual(original);
  expect(readFileSync(join(repo, 'examples/sample-backup.sql'))).toEqual(original);
  expect(existsSync(join(outputDir, 'receipt-signing.key'))).toBe(true);
  const receipt = JSON.parse(readFileSync(join(outputDir, 'restore-drill-receipt.json'), 'utf8'));
  expect(receipt.status).toBe('pass');
  expect(receipt.checks).toEqual(expect.arrayContaining([
    expect.objectContaining({ id: 'schemas:restore_ready', status: 'pass' }),
    expect.objectContaining({ id: 'roles:restore_reader', status: 'pass' }),
    expect.objectContaining({ id: 'tables:public.restore_probe', status: 'pass' }),
  ]));
});

test('@claim:default-signing-key creates the adjacent Unix key with private permissions', () => {
  const dir = mkdtempSync(join(tmpdir(), 'restore-drill-default-key-'));
  const receipt = join(dir, 'weekly.json');
  const key = join(dir, '.restore-drill-signing.key');
  const result = spawnSync(buildCli(), [
    'run', '--dump', join(repo, 'examples/incompatible-backup.sql'), '--postgres', '15', '--receipt', receipt,
  ], { cwd: repo, encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(2);
  expect(existsSync(key)).toBe(true);
  if (process.platform !== 'win32') expect(statSync(key).mode & 0o777).toBe(0o600);
  const verified = spawnSync(buildCli(), [
    '--json', 'verify-receipt', '--receipt', receipt, '--signing-key', key,
  ], { encoding: 'utf8' });
  expect(verified.status, verified.stderr).toBe(0);
  expect(JSON.parse(verified.stdout).valid).toBe(true);
});

test('@claim:podman-runtime selects Podman with the same isolation boundary', () => {
  const dir = mkdtempSync(join(tmpdir(), 'restore-drill-podman-'));
  const fake = fakeRuntime(dir, 'podman');
  const result = spawnSync(buildCli(), [
    'run', '--dump', join(repo, 'examples/sample-backup.sql'), '--postgres', '15',
    '--runtime', 'podman', '--receipt', join(dir, 'receipt.json'),
  ], {
    cwd: repo, encoding: 'utf8',
    env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, FAKE_RUNTIME_LOG: fake.log },
  });
  expect(result.status, result.stderr).toBe(0);
  const log = readFileSync(fake.log, 'utf8');
  expect(log).toContain('run -d --rm');
  expect(log).toContain('--network none');
  expect(log).toContain('--tmpfs /var/lib/postgresql/data:rw,noexec,nosuid,size=2g');
  expect(log).toContain(':/drill/input:ro');
  expect(log).not.toContain('-p ');
});

test('@claim:newer-version catches a newer dump before a container starts', () => {
  const dir = mkdtempSync(join(tmpdir(), 'restore-drill-version-'));
  const receipt = join(dir, 'receipt.json');
  const result = spawnSync(buildCli(), [
    '--json', 'run', '--dump', join(repo, 'examples/incompatible-backup.sql'),
    '--postgres', '15.8', '--runtime', 'runtime-that-must-not-run', '--receipt', receipt,
  ], { cwd: repo, encoding: 'utf8' });
  expect(result.status).toBe(2);
  const body = JSON.parse(result.stdout);
  expect(body.status).toBe('fail');
  expect(body.checks.map((check: { id: string }) => check.id)).toContain('source-target-version');
  expect(body.checks.map((check: { id: string }) => check.id)).toContain('transaction-timeout-setting');
});

test('@claim:signed-receipt signs a failure receipt and detects a changed receipt', () => {
  const dir = mkdtempSync(join(tmpdir(), 'restore-drill-signature-'));
  const receipt = join(dir, 'receipt.json');
  const key = join(dir, 'receipt.key');
  spawnSync(buildCli(), [
    'run', '--dump', join(repo, 'examples/incompatible-backup.sql'), '--postgres', '15',
    '--receipt', receipt, '--signing-key', key,
  ], { cwd: repo, encoding: 'utf8' });
  const valid = spawnSync(buildCli(), ['--json', 'verify-receipt', '--receipt', receipt, '--signing-key', key], { encoding: 'utf8' });
  expect(valid.status).toBe(0);
  expect(JSON.parse(valid.stdout).valid).toBe(true);
  const body = JSON.parse(readFileSync(receipt, 'utf8'));
  expect(body.signature.algorithm).toBe('HMAC-SHA256');
  body.postgres_target = '16';
  writeFileSync(receipt, JSON.stringify(body));
  const changed = spawnSync(buildCli(), ['--json', 'verify-receipt', '--receipt', receipt, '--signing-key', key], { encoding: 'utf8' });
  expect(changed.status).toBe(2);
  expect(JSON.parse(changed.stdout).valid).toBe(false);
});

test('@claim:dump-formats sends a custom-format archive through pg_restore', () => {
  const dir = mkdtempSync(join(tmpdir(), 'restore-drill-format-'));
  const fake = fakeRuntime(dir);
  const archive = join(dir, 'backup.dump');
  writeFileSync(archive, Buffer.from('PGDMP\u0001\u000f sample archive'));
  const result = spawnSync(buildCli(), [
    'run', '--dump', archive, '--postgres', '15', '--runtime', 'fake-docker',
    '--receipt', join(dir, 'receipt.json'),
  ], {
    cwd: repo, encoding: 'utf8',
    env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, FAKE_RUNTIME_LOG: fake.log },
  });
  expect(result.status, result.stderr).toBe(0);
  expect(readFileSync(fake.log, 'utf8')).toContain('pg_restore --exit-on-error --no-owner --no-privileges');
});

test('@claim:no-production-url @claim:no-telemetry exposes no remote database option or network client', () => {
  const binary = buildCli();
  const help = spawnSync(binary, ['run', '--help'], { encoding: 'utf8' });
  expect(help.status).toBe(0);
  expect(help.stdout).not.toContain('database-url');
  expect(help.stdout).not.toContain('host');
  const rejected = spawnSync(binary, ['run', '--database-url', 'postgres://production.invalid/db'], { encoding: 'utf8' });
  expect(rejected.status).not.toBe(0);
  expect(readFileSync(join(repo, 'Cargo.lock'), 'utf8')).not.toMatch(/name = "(reqwest|ureq|hyper)"/);
});
