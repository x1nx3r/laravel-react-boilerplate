# ADR-0006: Use semantic design tokens, not a fixed visual brand

Status: accepted · Date: 2026-10-28
Builds on: ADR-0001
Relates: [DESIGN.md](../../DESIGN.md), [architecture.md](../../resources/docs/architecture.md)

## Context

The template ships a Stripe-inspired design system so a new product has a
coherent starting point. That visual identity is a starting point, not a
brand contract. A product may need a different tone, density, or palette.

What must survive a redesign is the token layer: semantic colors, spacing,
shared components, and light/dark/system behavior. Raw hex values and one-off
pixels do not survive and make the next change harder.

## Decision

- `DESIGN.md` records the current visual language.
- `resources/css/app.css` holds the semantic tokens.
- Use Tailwind semantic classes (`bg-card`, `text-muted-foreground`, `border`,
  `text-destructive`) and shared components.
- Do not use raw hex colors or ad-hoc pixel values in pages.
- A brand rework replaces `DESIGN.md`, `app.css`, and the shared components
  together.
- Check the visible shell at desktop and narrow widths after a change.

## Consequences

- A product can change its identity without rewriting every page.
- Dark mode and contrast stay consistent across screens.
- Visual drift is reviewable as a token or component change.
- The Stripe-inspired look is disposable; the token structure is not.
