# ADR-0005: The locale cookie is the source of truth

Status: accepted · Date: 2026-10-28
Builds on: ADR-0002
Relates: [internationalization.md](../../resources/docs/internationalization.md)

## Context

The template supports Indonesian and English. Frontend strings, backend flash
messages, and validation messages must agree. Reading the browser language on
every request would make the active locale drift and disagree between layers.

## Decision

- The `locale` cookie is the active locale.
- `HandleLocale` resolves the cookie, then the browser language, then
  `APP_LOCALE`, and shares the result as an Inertia prop.
- Frontend strings live in `resources/js/i18n/locales/`.
- Backend strings live in `lang/<locale>/`.
- Add a locale in all four places: JSON, `HandleLocale`, `use-locale.ts`, and
  `lang/`.
- Dates and times sent to the browser are explicit strings; do not make the
  browser re-localize server times.

## Consequences

- Every page sees the same locale on the server and in React.
- A missing locale falls back predictably.
- Adding a language is a small, documented checklist.
- A product with one language may remove the switcher, but must keep the
  cookie/prop path or remove it completely, not half-remove it.
