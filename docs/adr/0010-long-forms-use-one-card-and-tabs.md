# ADR-0010: Long forms use one card and tabs

Status: accepted · Date: 2026-10-28
Builds on: ADR-0006, ADR-0009
Relates: [DESIGN.md](../../DESIGN.md), [architecture.md](../../resources/docs/architecture.md)

## Context

The create and edit employee screens stacked four bordered section cards
inside a page-level card. Every section carried a second border and padding
level, so the form read as boxes inside a box. The form also stretched across
the full shell width, and the section list made the page long.

## Decision

Long forms use one surface with tabs.

- The form is one `Card` that fills the page width. No wrapper card.
- Sections become tabs. A segmented `TabsList` sits in a bordered strip at
  the top of the card, and each `TabsContent` holds one section with its own
  heading and description.
- All fields stay in one form and submit together. Tabs hide sections, they
  do not split validation or persistence.
- A failed submit switches to the first tab that has an error. Tabs with
  errors show a destructive dot.
- One footer holds Cancel and the primary action.

The rules live in `DESIGN.md` under "Inputs & Forms".

## Consequences

- The form has one border and one submit path. Sections are navigation, not
  chrome.
- A section can be added without lengthening the page.
- A wizard was rejected: it adds per-step validation and a progress model
  that a single form submit does not need.
