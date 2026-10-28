# ADR-0004: Authorization belongs to the backend

Status: accepted · Date: 2026-10-28
Builds on: ADR-0002
Relates: [auth-and-rbac.md](../../resources/docs/auth-and-rbac.md), `app/Support/Rbac.php`, `app/Policies`

## Context

The template has roles, permissions, and permission-aware navigation. A UI
that hides a button is useful, but it is not an access control. If the only
check lives in React, a direct request bypasses it.

## Decision

- `app/Support/Rbac.php` is the single source of truth for roles and
  permissions.
- Route middleware is the coarse gate.
- Policies are the per-action gate.
- React may hide or disable actions for clarity, but never as enforcement.
- Every protected mutation and read path needs a backend test that proves the
  anonymous and unauthorized cases fail.

## Consequences

- A hidden control is a hint, not a security boundary.
- Adding a role or permission starts in `Rbac.php`, then middleware, policies,
  tests, navigation, and docs.
- Role escalation is checked on the server, including the `superadmin` role.
- A product that removes roles must also remove the middleware, policies,
  navigation filtering, and tests in the same change.
