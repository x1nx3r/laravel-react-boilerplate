# ADR-0009: One page anatomy and container tiers

Status: accepted · Date: 2026-10-28 · Container tier superseded by [ADR-0011](0011-pages-use-the-full-width.md)
Builds on: ADR-0006, ADR-0008
Relates: [DESIGN.md](../../DESIGN.md), [architecture.md](../../resources/docs/architecture.md)

## Context

Pages inside the app shell each invented their own layout. The sidebar shell
had no width container, so content stretched edge to edge on wide screens.
Headers were hand-rolled per page with different alignment and heading levels.
Settings rendered two stacked page headings. Section spacing changed from page
to page with no rule.

## Decision

Standardize the app shell page layout.

- The sidebar shell centers page content in a `max-w-7xl` container.
- Every page starts with `PageHeader`
  (`resources/js/components/common/page-header.tsx`). It renders the page
  `h1`, an optional description, and right-aligned actions. Pages do not
  render a second title block.
- Page sections use `space-y-6`. Groups inside a section use `space-y-4`.
- Settings content caps at `lg:max-w-2xl`. Other pages use the shell width.
- The rules live in `DESIGN.md` under "App Shell & Page Anatomy".

## Consequences

- A new page starts from one known shape instead of copying a neighbor.
- Wide screens no longer stretch tables and cards to unreadable widths.
- The layout rules have one home. A brand rework replaces the container and
  the shared header together.
