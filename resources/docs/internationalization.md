# Internationalization (id / en)

Two fully mirrored locales — Indonesian (default) and English — covering
both the frontend strings and the backend flash messages. A language switch
mid-session flips the entire UI instantly.

## 1. How locale is determined and switched

```
cookie 'locale' ──► HandleLocale middleware ──► app locale
                                                     │
                              HandleInertiaRequests shares props.locale
                                                     ▼
                        app.tsx: i18n.changeLanguage(props.locale)
                                                     ▼
                        react-i18next renders t() in that language
```

- The user-menu language switcher (`components/user/user-menu-content.tsx`)
  uses the `use-locale.ts` hook: writes the `locale` cookie, calls
  `i18n.changeLanguage`, and reloads shared props — the backend picks the
  cookie up on the next request, so backend flash messages switch too.
- `resources/js/i18n/index.ts` configures i18next with both locale files
  inlined; fallback locale: `en`.
- Backend translations live in `lang/en/app.php` and `lang/id/app.php`
  (mirrored key structure; used for all controller flash messages and
  validation-adjacent strings).

## 2. Where strings live

| Kind                            | File                                        |
| ------------------------------- | ------------------------------------------- |
| Frontend UI strings             | `resources/js/i18n/locales/{en,id}.json`    |
| Backend flash / status messages | `lang/{en,id}/app.php`                      |
| Calendar weekday & month names  | generated via `Intl` with the active locale |

Top-level sections in the JSON files (identical in both): `common`, `nav`,
`dashboard`, `auth`, `settings`, `errors`, `users` (employees), `roles`,
`attendance`, `leaves`, `pagination`, `menu`.

## 3. Conventions

- Every user-facing string goes through `t('section.key')`; no hardcoded
  UI text. Interpolation: `t('attendance.today.checked_in_at', { time })`.
- Keys are namespaced by feature (`attendance.today.*`, `leaves.review.*`,
  `dashboard.stats.*`).
- The two locale files must stay structurally identical — same keys, both
  files, always edited together.
- Both admin CRUD labels use employee terminology: `nav.users` →
  "Employees" / "Pegawai".
- Calendar weekday/month names come from
  `new Date(...).toLocaleDateString(i18n.language, …)` — locale-aware
  without extra keys.
- Form selects render stored codes via `level.toUpperCase()`
  (`SMA`, `S1`, …) or translated labels via keys (`users.form.male`).

## 4. Adding a new string (checklist)

1. Add the key to `resources/js/i18n/locales/en.json` **and** `id.json`
   (same path in both).
2. Use `t('your.key')` in the component (const `{ t } = useTranslation()`).
3. If a backend flash message needs a string: add it to **both**
   `lang/en/app.php` and `lang/id/app.php`, then
   `back()->with('success', __('app.your.key'))`.
4. Verify by switching language in the user menu and re-visiting the page.

## 5. Linting

Two layers keep the bundles honest, and both run in `make lint`.

**ESLint (per file)** — local plugin in `eslint-rules/i18n`:

- `i18n/no-missing-key` — every `t('key')`, ``t(`key`)`` and
  `<Trans i18nKey="key">` must exist in `en.json` and `id.json`. Keys with
  `${}` interpolation are skipped here; the parity script covers their
  families.
- `i18n/no-literal-string` — flags visible text in JSX and string values for
  `placeholder`, `title`, `alt`, `aria-label`, `aria-description`,
  `aria-placeholder`, and `label`. Text without letters (`—`, `·`, numbers)
  is allowed, as is text inside `<Trans>`, `<code>`, and `<pre>`.
  `resources/js/components/ui/**` is excluded: it is the shadcn registry
  layer.

**Key check (whole project)** — `npm run lint:i18n`
(`scripts/check-i18n.mjs`):

- locale parity: `en` and `id` must have the same key set
- unused keys: a key must be referenced as `t('key')`, `<Trans i18nKey>`, a
  dynamic ``t(`prefix.${…}`)``, or appear as a plain string literal
  (navigation and table config). `--allow-unused` downgrades unused keys to
  a warning.
