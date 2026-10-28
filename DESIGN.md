---
version: alpha
name: Manus Operations
description: "A light-first operations interface for HR and attendance work: deep navy ink, an indigo primary, quiet blue-gray canvas, hairline borders, and tabular figures for records. The system is inspired by Stripe's dashboard language, not by its marketing gradients."
source:
  name: Stripe Inspired DESIGN.md
  url: https://www.shadcn.io/design/stripe/raw
  note: Adapted for an internal Laravel + Inertia + React operations app. Not an official Stripe design system.

colors:
  primary: "#4f46e5"
  primary-hover: "#4338ca"
  primary-pressed: "#3730a3"
  primary-soft: "#eef2ff"
  on-primary: "#ffffff"
  ink: "#0d253d"
  ink-strong: "#081a2b"
  ink-muted: "#64748b"
  ink-subtle: "#94a3b8"
  canvas: "#f6f8fb"
  surface: "#ffffff"
  surface-muted: "#f1f5f9"
  surface-raised: "#ffffff"
  hairline: "#e2e8f0"
  hairline-strong: "#cbd5e1"
  success: "#0f766e"
  success-soft: "#ecfdf5"
  warning: "#b45309"
  warning-soft: "#fffbeb"
  danger: "#b42318"
  danger-soft: "#fef2f2"
  info: "#1d4ed8"
  info-soft: "#eff6ff"
  sidebar: "#0f1b2d"
  sidebar-foreground: "#e2e8f0"
  sidebar-muted: "#94a3b8"
  sidebar-active: "#1e293b"
  sidebar-primary: "#a5b4fc"
  dark-canvas: "#0b1220"
  dark-surface: "#111a2b"
  dark-raised: "#172238"
  dark-hairline: "#263348"

typography:
  display:
    fontFamily: Instrument Sans
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.6px
  headline:
    fontFamily: Instrument Sans
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.35px
  title:
    fontFamily: Instrument Sans
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.2px
  body:
    fontFamily: Instrument Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-strong:
    fontFamily: Instrument Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: Instrument Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  data:
    fontFamily: Instrument Sans
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
    fontFeature: tnum

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 12px
  pill: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px

components:
  app-shell:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
  sidebar:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.sidebar-foreground}"
    width: 264px
  header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    height: 56px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.xl}"
    padding: 24px
  table-header:
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    borderColor: "{colors.hairline}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline-strong}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline-strong}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  badge:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.sm}"
    padding: 2px 8px
---

## Overview

Manus Operations is the visual language for the internal HR and attendance app. It
should read as a calm, precise operations tool: a light blue-gray canvas, white
working surfaces, deep navy text, and one indigo action color. The app is dense
with records, approvals, dates, and people. Hierarchy comes from spacing, hairlines,
and type weight — not from decorative gradients or a rainbow of status colors.

The system is **Stripe-inspired** in structure: navy ink, indigo primary, tabular
numbers, restrained shadows, and clear surfaces. It does not copy Stripe's
marketing gradients, giant display type, or pill-button language. The product UI
is the reference, not the marketing page.

## Color

| Role | Light | Use |
|---|---|---|
| Canvas | `#f6f8fb` | App background |
| Surface | `#ffffff` | Cards, dialogs, tables, inputs |
| Ink | `#0d253d` | Primary text; never pure black |
| Muted ink | `#64748b` | Labels, helper text, table headers |
| Hairline | `#e2e8f0` | Default dividers and borders |
| Primary | `#4f46e5` | One primary action per region; focus rings |
| Primary soft | `#eef2ff` | Selected rows, soft badges, active navigation |
| Success | `#0f766e` | Approved, active, present |
| Warning | `#b45309` | Pending, missing checkout, needs review |
| Danger | `#b42318` | Destructive actions and failed states |
| Info | `#1d4ed8` | Informational, neutral notices |
| Sidebar | `#0f1b2d` | Persistent navigation surface |

Dark mode uses `#0b1220` canvas, `#111a2b` surfaces, `#172238` raised surfaces,
`#263348` hairlines, and a lighter indigo `#a5b4fc` for focus and primary action.

Do not use raw Tailwind color families in screens. Use the semantic tokens:
`bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`,
`border-border`, `text-success`, `text-warning`, `text-destructive`, `text-info`.
If a new state color is necessary, add a semantic token first.

## Typography

Use Instrument Sans everywhere. The app already loads it; do not add another font.

- Page title: 24–30px, weight 600, tracking tight.
- Section/card title: 16–18px, weight 600.
- Body and controls: 14px, weight 400.
- Dense data and table numbers: 13px, weight 500, `font-variant-numeric: tabular-nums`.
- Captions and labels: 12px, weight 400, muted ink.
- Avoid all-caps except small eyebrow labels and table headers.

## Spacing and layout

Use a 4px base. Page sections use 24–32px vertical rhythm. Cards use 24px padding.
Page shells use a centered max width, 24–32px gutters, and a 16–24px app gap.
Tables should be dense but readable: 12–16px horizontal cell padding and 12px
vertical padding.

## Shape and elevation

Use 6px inputs, 8px buttons, 10px small surfaces, 12px cards. Use hairline borders
and a very small shadow. Do not use large drop shadows or floating pill cards.
Reserve fully rounded shapes for avatars, status dots, and filter chips.

## Components

### App shell

The sidebar is a permanent dark navy rail. The header is a white strip with a
hairline bottom edge. The active navigation item uses a soft indigo surface and
the sidebar primary color. The main content is a light canvas with cards, not a
single huge white panel.

### Cards and metrics

Cards group a single job. Use the card title for the job, a muted description for
context, and the data below. Metric cards show a label, a large tabular number,
and an optional trend/context line. Do not put unrelated metrics in one card.

### Tables

Table headers are muted, small, and uppercase-tracked. Rows separate with a
hairline, hover with `bg-muted/40`, and keep numeric columns tabular. Status
badges are compact and semantic. Avoid zebra striping and heavy borders.

### Forms

Labels sit above controls. Inputs use white surfaces and a visible hairline.
Focus is a 3px indigo ring. Errors use the danger token with a concise message.
Group related fields with a section heading and 16px gaps.

### Badges

Badges are small, squared, and semantic. Use soft background plus a strong text
color. Do not use color as the only signal; keep the label.

### Auth

Auth screens use a clean card on the blue-gray canvas, or a split layout with the
dark navy brand rail. No gradient mesh, no bouncing decorative circles, no oversized
marketing typography.

## Do

- Use one indigo primary action per region.
- Use tabular numbers for counts, money, dates, and balances.
- Keep cards on the canvas with 12px corners and hairline borders.
- Use `text-muted-foreground` for labels and secondary copy.
- Use semantic tokens for every status color.
- Keep the dark sidebar consistent across light and dark themes.
- Check every screen at desktop and narrow widths.

## Do not

- Do not add gradients, glow effects, or decorative mesh backgrounds to app screens.
- Do not use raw `text-neutral-*`, `bg-green-*`, `bg-amber-*`, `bg-blue-*`, or `bg-red-*` classes.
- Do not use pure black or pure white text.
- Do not use pill buttons for normal actions.
- Do not invent a second accent color.
- Do not use color alone to communicate status.
- Do not add a second font family.
