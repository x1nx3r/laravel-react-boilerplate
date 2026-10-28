# ADR-0001: Record architecture decisions

Status: accepted · Date: 2026-10-28
Relates: `AGENTS.md`, `README.md`, `resources/docs/README.md`

## Context

The template carries product documentation under `resources/docs/`. Those
pages say how the current HR application works, but not why the baseline is
shaped that way. When an agent reworks the boilerplate, that rationale is
lost and the same trade-offs are rediscovered.

## Decision

Record cross-cutting and irreversible decisions as ADRs under `docs/adr/`.
Keep product behavior in `resources/docs/` and link the two.

An ADR is a small, durable record: context, decision, consequences. It is not
a second copy of the feature documentation. A later decision supersedes an
older ADR instead of editing it.

## Consequences

- Agents can explain a baseline before changing it.
- Product documentation stays readable by users and testers.
- Cross-cutting changes add one small file and one index update.
- Accepted decisions do not silently drift when the product changes.
