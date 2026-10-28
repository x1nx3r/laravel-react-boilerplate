# Architecture Decision Records

`resources/docs/` explains how the current application works. This directory
records why the baseline exists and which parts must survive a rework.

A feature document can change with the product. An accepted ADR changes only
when a later ADR supersedes it.

## When to write one

Write an ADR before code when a change is:

- cross-cutting (auth, data, routing, i18n, design system)
- irreversible or expensive to undo
- a deliberate departure from the current template
- likely to be questioned again by a future agent

Small fixes and ordinary feature work do not need an ADR. Update the relevant
page under `resources/docs/` instead.

## Rules

- One decision per file.
- File name: `NNNN-kebab-case-title.md`.
- Status: `proposed`, `accepted`, `superseded`, or `rejected`.
- Use `Context`, `Decision`, and `Consequences`.
- Link the product document and the code the decision governs.
- Do not rewrite an accepted ADR. Add a new one and mark the old one
  superseded.
- Update the index below in the same commit.

## Index

| ADR                                                  | Decision                                              | Product documentation                                                                 |
| ---------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [0001](0001-record-architecture-decisions.md)        | Record decisions as ADRs                              | This index, `AGENTS.md`                                                               |
| [0002](0002-laravel-inertia-react-baseline.md)       | Laravel + Inertia + React is the application baseline | [architecture.md](../../resources/docs/architecture.md)                               |
| [0003](0003-postgres-only-local-database.md)         | PostgreSQL is the only local database                 | [architecture.md](../../resources/docs/architecture.md), `Makefile`                   |
| [0004](0004-authorization-belongs-to-the-backend.md) | Authorization belongs to the backend                  | [auth-and-rbac.md](../../resources/docs/auth-and-rbac.md)                             |
| [0005](0005-locale-cookie-is-the-source-of-truth.md) | The locale cookie is the single source of truth       | [internationalization.md](../../resources/docs/internationalization.md)               |
| [0006](0006-semantic-design-tokens.md)               | Use semantic design tokens, not a fixed visual brand  | [DESIGN.md](../../DESIGN.md), [architecture.md](../../resources/docs/architecture.md) |
| [0007](0007-boilerplate-is-a-scaffold.md)            | The boilerplate is a scaffold, not the product        | [README.md](../../README.md), [AGENTS.md](../../AGENTS.md)                            |
| [0008](0008-one-ui-primitive-layer.md)               | One UI primitive layer, shadcn/ui on radix-ui         | [architecture.md](../../resources/docs/architecture.md)                               |
| [0009](0009-page-anatomy-and-containers.md)          | One page anatomy and container tiers                  | [DESIGN.md](../../DESIGN.md)                                                          |
| [0010](0010-long-forms-use-one-card-and-tabs.md)     | Long forms use one card and tabs                      | [DESIGN.md](../../DESIGN.md)                                                          |
| [0011](0011-pages-use-the-full-width.md)             | Pages use the full width                              | [DESIGN.md](../../DESIGN.md)                                                          |
| [0012](0012-page-composition-main-and-rail.md)       | Every page has a main zone and a context rail         | [DESIGN.md](../../DESIGN.md)                                                          |
| [0013](0013-preview-dev-proxy.md)                    | Preview uses an app-side dev proxy for Vite HMR       | [architecture.md](../../resources/docs/architecture.md), `vite.config.ts`             |
