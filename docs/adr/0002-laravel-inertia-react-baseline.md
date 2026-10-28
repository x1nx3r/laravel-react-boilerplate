# ADR-0002: Laravel + Inertia + React is the application baseline

Status: accepted · Date: 2026-10-28
Builds on: ADR-0001
Relates: [architecture.md](../../resources/docs/architecture.md), [auth-and-rbac.md](../../resources/docs/auth-and-rbac.md)

## Context

The template is a full-stack starting point. It needs server-owned routing,
validation, authentication, and persistence, and a reactive UI without a
second hand-written API contract.

Laravel, Inertia, and React already supply that path. A separate SPA API would
be a second contract to keep in sync, and a second place to enforce
authorization.

## Decision

Keep Laravel as the application server, Inertia as the page protocol, and
React as the view layer.

- Laravel owns routes, validation, authentication, authorization, and
  persistence.
- Controllers return Inertia props. React renders those props.
- Mutations redirect back with a flash message.
- Use Wayfinder-generated routes/actions. Do not hand-write URLs.
- Do not add a second JSON API unless the product explicitly needs one.

## Consequences

- A page has one source of truth for its data and its access rules.
- Frontend state stays local to the page; there is no separate API cache.
- Wayfinder files regenerate on dev/build and are never edited by hand.
- An API-only product may remove Inertia and React. That is a new decision,
  not a quiet exception.
