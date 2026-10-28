# ADR-0011: Pages use the full width

Status: accepted · Date: 2026-10-29
Builds on: ADR-0006
Supersedes: the container tier of [ADR-0009](0009-page-anatomy-and-containers.md)
Relates: [DESIGN.md](../../DESIGN.md), [architecture.md](../../resources/docs/architecture.md)

## Context

ADR-0009 fixed a wide-screen bug by centering app content in `max-w-7xl` and
capping form pages at `max-w-4xl`. That removed the stretch but replaced it
with a blog-like centered column. On a 1920px display, table and form pages
sat in a narrow strip with large empty gutters. This is a data application,
not a reading site.

## Decision

- The app shell is fluid. Content fills the space beside the sidebar with page
  padding. No page-level max width.
- Width is controlled by content grids, not page containers. Form panels are
  containers and their grids use `@lg:grid-cols-2 @3xl:grid-cols-3`, and stat
  rows add columns at breakpoints.
- Tables, calendars, and charts take the full width.
- Auth pages keep a narrow centered card. A login form is the one place where
  a narrow column is correct.
- The page anatomy from ADR-0009 (PageHeader, rhythm, one title) stands.

## Consequences

- Data-dense pages use the screen they are given.
- Inputs stay readable because the grid adds columns instead of stretching
  fields.
- A product that wants a capped reading surface must add it on purpose; it
  does not inherit one from the template.
