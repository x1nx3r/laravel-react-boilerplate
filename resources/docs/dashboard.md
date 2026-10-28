# Employee-Data Dashboard (Requirement 5)

The landing page (`/`) for admins: total headcount plus three bar charts —
gender comparison, last education, and employee ages. Regular users never
see it: `/` redirects them straight to their attendance page, and the
sidebar entry is hidden for them.

## 1. Flow

```
GET /  →  DashboardController@index
   ▼
user has view_admin permission?
   ├── yes → employeeStats() aggregates  → dashboard/page (charts view)
   └── no  → redirect to /attendance
```

The gate is enforced in the controller — non-admins are redirected before
any data is computed, so the aggregate payload is never sent to them. The
React component only ever renders the charts view (`employeeStats` is
non-null by construction).

## 2. Data pipeline (`employeeStats()`)

Private method on `app/Http/Controllers/DashboardController.php`. Three
independent aggregations over the `users` table:

**Gender** — SQL `groupBy`:

```sql
select gender, count(*) from users where gender is not null group by gender
```

Returned as `[{label: 'L', total}, {label: 'P', total}]`. The frontend maps
labels through i18n (`dashboard.stats.gender.L` → "Male"/"Laki-laki").

**Education** — same pattern over `education_level`, rendered in a fixed
order `sma, smk, d3, s1, s2, s3` with uppercase labels (`SMA`, `S1`, …),
including zero-count levels so the axis is stable.

**Ages** — computed in PHP from `birth_date` (Carbon `->age`), bucketed:

| Bin     | Meaning       |
| ------- | ------------- |
| `<25`   | age < 25      |
| `25-34` | 25 ≤ age < 35 |
| `35-44` | 35 ≤ age < 45 |
| `45-54` | 45 ≤ age < 55 |
| `55+`   | age ≥ 55      |

Every bin is always present in the payload (zero-filled). Users without a
birth date or gender or education level are excluded from the respective
chart (the three named demo accounts intentionally have none of these so
you can see the exclusion behavior; the 24 seeded demo employees do).

**Total** — `User::count()` for the headcount card.

## 3. Payload shape

```ts
type ChartDatum = { label: string; total: number };

interface EmployeeStats {
    total: number;
    gender: ChartDatum[];
    education: ChartDatum[]; // labels SMA/SMK/D3/S1/S2/S3
    ages: ChartDatum[]; // labels <25, 25-34, 35-44, 45-54, 55+
}
```

The prop is always present on this page — the controller guarantees it for
every render.

## 4. Frontend

`resources/js/pages/dashboard/page.tsx`:

- A `StatsBarChart` helper wraps recharts (`BarChart` + `CartesianGrid` +
  `Tooltip` + axes) in a fixed-height `ResponsiveContainer`. Bars use
  `var(--primary)` so they follow the active theme (light/dark).
- Layout: headcount card, then a `lg:grid-cols-3` grid of chart cards.
- All titles/descriptions come from `dashboard.stats.*` i18n keys
  (see internationalization.md).

## 5. Extending

To add a chart (e.g. employees per department):

1. Aggregate in `employeeStats()` (SQL groupBy for strings, PHP bucketing
   for ranges), zero-fill the fixed category order, uppercase/clean labels.
2. Add the `ChartDatum[]` field to the TS interface.
3. Add a card using `StatsBarChart` with a new `dashboard.stats.*` key pair
   in both `en.json` and `id.json`.
