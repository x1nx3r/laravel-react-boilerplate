# Employee Management (Requirements 1–4)

The admin CRUD for employee data: create, view, update, delete. This is the
`/admin/users` module — pages, controller, validation, policies, and the
employee attribute set.

## 1. Screen map

| Page (Inertia component)  | Route                          | Purpose                                 |
| ------------------------- | ------------------------------ | --------------------------------------- |
| `admin/users/page`        | `GET /admin/users`             | List with search, 5 filters, pagination |
| `admin/users/create/page` | `GET /admin/users/create`      | Create form                             |
| `admin/users/edit/page`   | `GET /admin/users/{user}/edit` | Edit form (same `UserForm` component)   |

All three share `resources/js/pages/admin/users/user-form.tsx` and live under
the `Administration` sidebar group (permission `view_admin`; the Users entry
itself requires `manage_users`).

## 2. The employee attribute set

Defined once in `app/Concerns/UserAttributeRules.php` (validation +
extraction), used by registration, admin create, and admin edit.

**Account fields** (admin forms only):

| Field      | Rules                                      | Notes                                                |
| ---------- | ------------------------------------------ | ---------------------------------------------------- |
| name/email | required, unique email                     |                                                      |
| password   | required on create, optional blank on edit | hashed                                               |
| role       | required, exists in roles                  | superadmin only assignable by `manage_roles` holders |
| is_active  | boolean                                    | inactive accounts cannot log in                      |

**Employee profile fields**:

| Field                 | Type/Rules                                              | Used by dashboard? |
| --------------------- | ------------------------------------------------------- | ------------------ |
| employee_id           | nullable string (e.g. `EMP-00123`)                      |                    |
| nik                   | nullable string (national ID)                           |                    |
| birth_place           | nullable string                                         |                    |
| birth_date            | nullable date                                           | age chart          |
| gender                | nullable `L` \| `P`                                     | gender chart       |
| education_level       | nullable `sma` \| `smk` \| `d3` \| `s1` \| `s2` \| `s3` | education chart    |
| education_institution | nullable string                                         |                    |
| major                 | nullable string                                         |                    |
| employee_status       | nullable `kontrak` \| `tetap`                           |                    |
| department            | nullable string                                         | list filter        |
| join_date / end_date  | nullable dates, end ≥ join                              |                    |
| phone_number          | nullable string                                         |                    |
| bank_account_number   | nullable string                                         |                    |
| address               | nullable string                                         |                    |

`education_level` is stored as a plain string column (`users.education_level`)
with the same `in:` validation pattern as `gender`/`employee_status`; the
select options in both forms render the uppercase code (`SMA`, `S1`, …).

## 3. Flow: create (requirement 1)

```
admin/users/create/page ── useForm ──► POST /admin/users
   ▼
StoreUserRequest validates (account + userAttributeRules + documentRules)
   ▼
UserController@store  (authorize via UserPolicy@create)
   - User::create([...account fields, ...userAttributes($input)])
   - $user->assignRole($request->role)
   - optional: saveUserDocuments()
   ▼
redirect → admin.users.index with flash app.users.created
```

## 4. Flow: view (requirement 2)

`UserController@index` (policy `viewAny`) builds:

- `users` — paginated (10) with roles eager-loaded, `withQueryString`
- `roles` — for the role filter dropdown
- `departments` — distinct values for the department filter
- `filters` — current filter state (sticky across pagination)
- `requireRegistrationApproval` — for the settings toggle on this page

Frontend features: text search (name/email), role / approval status /
account state / department / contract filters, status badges (pending /
active / inactive), verify button for pending accounts, row edit/delete
gated by `canManage` (superadmin protection), delete confirmation dialog.

## 5. Flow: update (requirement 3)

`PUT /admin/users/{user}` → `UpdateUserRequest` → `UserController@update`:

- Guard: cannot change your own role or deactivate your own account.
- Blank password = keep existing password.
- `syncRoles([$request->role])`.

## 6. Flow: delete (requirement 4)

`DELETE /admin/users/{user}` → `UserPolicy@delete`:

- Cannot delete your own account (flash error).
- Cannot delete a superadmin unless you are superadmin.
- Hard delete; `foreignUlid(...)->restrictOnDelete()` on `user_documents`,
  `attendances`, `leave_requests` protects against orphaned related rows
  (deleting a user with attendance history is blocked at the DB level).

## 7. Supporting flows

- **Verify**: `PUT /admin/users/{user}/verify` — pending → active
  (see auth-and-rbac.md §5).
- **Documents**: `POST /admin/users/{user}/documents` uploads scans
  (KTP, ijazah, CV…, optional category, ≤ 10 MB). `SavesUserDocuments`
  stores originals on the `local` disk and generates thumbnails
  (Intervention Image). `GET /admin/users/{user}/documents/{document}`
  streams the file (or `?thumbnail=1`), `DELETE` removes it. Downloads are
  policy-guarded (`update` ability) and 404 when the document does not
  belong to the user.

## 8. Registration path (self-service)

Public registration (`/register`) collects the same employee profile fields
plus password confirmation and optional documents, then follows the flow in
auth-and-rbac.md §3. Depending on the HR-controlled approval toggle the new
account is active immediately or `pending` (blocked from login until
verified).
