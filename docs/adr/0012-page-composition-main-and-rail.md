# ADR-0012: Every page has a main zone and a context rail

Status: accepted · Date: 2026-10-29
Builds on: ADR-0006, ADR-0009
Relates: [DESIGN.md](../../DESIGN.md), [architecture.md](../../resources/docs/architecture.md)

## Context

The pages were single columns: a header and cards stacked top to bottom. At
wide viewports that shape leaves the right side and the lower page empty. The
layout fixes before this one only changed width; they did not give pages a
second zone, so the vacancy stayed.

## Decision

Give each page a main zone and, at `xl` and up, a context rail.

- Three archetypes: workbench (browse data), record (one entity), task
  (create or act). Auth and error pages are the only exceptions.
- Grid: `grid gap-6 xl:grid-cols-12`. Main zone `xl:col-span-8`, rail
  `xl:col-span-4`. Below `xl`, the rail stacks under the main zone.
- The rail carries real content: summary, guidance, history, or secondary
  actions. Never filler stats or decoration.
- Cards earn their space. One-line cards are merged or enriched.
- Empty states carry one sentence and one action.
- Exemplars: the employee edit page (summary rail) and the employee create
  page (guidance rail).

The rules live in `DESIGN.md` under "Page Composition".

## Consequences

- Pages have a known shape for a new screen to copy.
- The right side of a wide screen carries information, not emptiness.
- A page that has nothing useful for a rail stays single-zone; the archetype
  table marks which pages need one.
