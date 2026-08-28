--
-- PostgreSQL database dump
-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8
--

CREATE ROLE restore_reader NOLOGIN;
CREATE TABLE public.restore_probe (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    checked_at timestamp with time zone NOT NULL DEFAULT now(),
    note text NOT NULL
);
INSERT INTO public.restore_probe (note) OVERRIDING SYSTEM VALUE
VALUES ('Bundled sample restore completed');
GRANT SELECT ON public.restore_probe TO restore_reader;
