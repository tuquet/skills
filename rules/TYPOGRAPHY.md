# Canonical Typography & Design Tokens Standard (SSOT)

> **Scope**: Governs all Tuquet/Specter user interfaces, including Web Admin (`apps/web-admin`), Tauri Desktop (`desktop`), documentation, and extensions. AI agents and developers MUST cross-reference this document before writing, modifying, or reviewing UI components.

---

## 1. Font Family Architecture

### Sans-Serif Stack (Zero Google CDN Dependency)
All interface typography resolves through the local `--font-family` CSS variable. Remote external Google CDN links are strictly prohibited. The system self-hosts 2 primary Google Fonts sans-serif families (`Inter` and `Roboto`) with `font-display: swap`:

1. **`Inter` (Default / Recommended)**:
   - Primary international & Vietnamese neutral sans-serif (Google Fonts Inter WOFF2 with `vietnamese` + `latin` subsets) optimized for dense data tables, financial figures, and clean micro-layouts.
   - Stack: `'Inter', 'Google Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
2. **`Roboto` (Google Classic)**:
   - Classic geometric sans-serif for traditional enterprise admin ergonomics.
   - Stack: `'Roboto', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`
3. **`System UI` (Native OS)**:
   - Zero-download native system font fallback.
   - Stack: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`

### Monospace Stack (`font-mono`)
Mandatory for machine IDs, UUIDs, git hashes, cron expressions, IP addresses, JSON metadata, and token counters:
- Stack: `'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
- Tailwind: `font-mono`

---

## 2. 7-Tier Modular Font-Size Scale

| Token | Tailwind Class | Size (px / rem) | Line Height | Usage Scope |
| :--- | :--- | :---: | :---: | :--- |
| `2xs` | `text-2xs` | 10px / 0.625rem | 14px (1.4) | Micro tags, dense table badges, byte indicators, dot labels |
| `xs` | `text-xs` | 12px / 0.75rem | 16px (1.33) | Table headers, secondary metadata, badge labels, timestamps |
| `sm` | `text-sm` | 14px / 0.875rem | 20px (1.43) | **Standard UI baseline**: table cells, inputs, navigation, buttons |
| `base` | `text-base` | 16px / 1.0rem | 24px (1.5) | Card titles, modal titles, body copy, toast messages |
| `lg` | `text-lg` | 18px / 1.125rem | 28px (1.55) | Section headers, drawer titles, subheadings |
| `xl` | `text-xl` | 20px / 1.25rem | 28px (1.4) | Page headers (h1 on desktop), prominent sub-stats |
| `2xl` | `text-2xl` | 24px / 1.5rem | 32px (1.33) | Hero dashboard KPI numbers, platform superadmin banner headers |

> [!CAUTION]
> **Prohibition of Arbitrary Sizes**: Never write one-off pixel utility classes such as `text-[11px]`, `text-[13px]`, `text-[15px]`. Always snap to the nearest standard token (`text-2xs`, `text-xs`, `text-sm`, `text-base`).

---

## 3. Font Weight & Style Semantics

- **`font-normal` (400)**: Standard table cell data, body text, item descriptions, and empty states.
- **`font-medium` (500)**: Form labels, interactive buttons, active tab indicators, and emphasized rows.
- **`font-semibold` (600)**: Section titles, card headers, table column headers, and modal titles.
- **`font-bold` (700)**: Reserved strictly for Page H1 titles and top-level KPI metrics.
- **Italic Rule**: `italic` is **PROHIBITED** on UI navigation, buttons, and headers. Permitted only for placeholder hints, user quotations, or subtle empty state descriptions.

---

## 4. Component Typography Matrix (AI Agent Contract)

Every component built or reviewed MUST adhere strictly to this class matrix:

### 1. Data Tables
- **Header Columns**: `text-xs font-semibold uppercase tracking-wider text-muted-foreground`
- **Body Cells (Standard Text)**: `text-sm font-normal text-foreground`
- **Body Cells (IDs / Hashes / IPs)**: `font-mono text-xs text-muted-foreground`
- **Row Counters / Badges**: `font-mono text-xs` or `text-xs font-medium`

### 2. Cards & KPI Metrics
- **Card Title**: `text-base font-semibold tracking-tight text-foreground`
- **Card Subtitle / Hint**: `text-xs text-muted-foreground`
- **KPI Number**: `text-2xl font-bold tracking-tight text-foreground`
- **KPI Delta Indicator**: `text-xs font-medium` (with green/red color token)

### 3. Forms & Inputs
- **Field Label**: `text-sm font-medium text-foreground`
- **Input Text**: `text-sm font-normal text-foreground`
- **Helper Description**: `text-xs text-muted-foreground`
- **Validation Error Message**: `text-xs font-medium text-destructive`

### 4. Page Headers & Modals
- **Page Title (H1)**: `text-lg font-semibold tracking-tight text-foreground sm:text-xl`
- **Breadcrumb Link**: `text-xs font-medium text-muted-foreground hover:text-foreground`
- **Modal / Drawer Title**: `text-base font-semibold tracking-tight sm:text-lg`
- **Modal Description**: `text-sm text-muted-foreground`

---

## 5. Agent Verification Checklist
When reviewing or implementing UI changes, confirm:
1. [ ] Zero external fonts imported via CDN in HTML or CSS.
2. [ ] Font sizes use only canonical tokens (`text-2xs` to `text-2xl`).
3. [ ] Monospace is used for all machine-generated identifiers, timestamps, and hashes.
4. [ ] Table headers are uppercase `text-xs font-semibold tracking-wider`.
5. [ ] No decorative italic styles on standard UI controls.
