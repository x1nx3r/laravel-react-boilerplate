# ADR-0008: One UI primitive layer, shadcn/ui on radix-ui

Status: accepted · Date: 2026-10-28
Builds on: ADR-0002, ADR-0006
Relates: [architecture.md](../../resources/docs/architecture.md)

## Context

The frontend used two primitive libraries at the same time. The
`resources/js/components/ui` layer is shadcn/ui on Radix, but the Radix imports
came from two sources. Some files imported from `@radix-ui/react-*` packages.
Others imported from the consolidated `radix-ui` package. Two settings pages
used Headless UI for one fade effect. A second library adds bundle weight and
gives a future change two patterns to copy.

## Decision

Keep one primitive layer: shadcn/ui components in
`resources/js/components/ui` that import from the `radix-ui` package.

- Do not add Headless UI or a second primitive library.
- Import Radix primitives from `radix-ui`, not from `@radix-ui/react-*`
  packages.
- Let `radix-ui` own the Radix versions. The direct `@radix-ui/react-*`
  dependencies are removed.
- Build app-level behavior on the shared components in
  `resources/js/components/common`.
- Use `tw-animate-css` utilities for enter effects.

## Consequences

- One import path rules the primitive layer. A new shadcn component matches the
  existing files.
- The direct dependency list shrinks. `radix-ui` stays as the only Radix entry.
- A change of primitive library means a new decision, not a quiet exception.
