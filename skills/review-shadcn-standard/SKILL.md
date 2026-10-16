---
name: review-shadcn-standard
description: >
  Audit and migrate frontend UI components across Tuquet projects to strictly enforce the 72 canonical Shadcn UI components standard.
  Detects raw HTML elements, custom-styled widgets, and ad-hoc UI patterns, outputs an actionable audit table, and migrates them to official Shadcn primitives upon user confirmation.
  Trigger: /review-shadcn-standard, "review", "review ui", "review shadcn", "review component", "review components", "shadcn standard", "audit shadcn", "migrate shadcn", "kiểm tra shadcn", "rà soát component".
  Do NOT use for pure backend Rust/SQL logic reviews that contain no UI or frontend files.
argument-hint: "[audit|migrate] [target-path] [--component <name>]"
license: MIT
---

# Shadcn 72-Component Standard Auditor & Migrator (`review-shadcn-standard`)

Enforce 100% compliance with the **72 Canonical Shadcn UI Components** across all frontend workspaces (`admin`, `lib`, `automa`, `tuquet.com`). Hunt down raw HTML controls and custom-built UI widgets, output a structured audit table, await user confirmation (`proceed`), and migrate to standard Shadcn primitives.

---

## 1. The 72 Canonical Shadcn Components Registry

Every UI element in the codebase MUST resolve to one of the **72 standard Shadcn components** below. Custom ad-hoc equivalents are strictly prohibited.

| Category | Standard Components (Total: 72) |
| :--- | :--- |
| **1. Layout & Surfaces (9)** | `Accordion`, `Aspect Ratio`, `Card`, `Collapsible`, `Item`, `Resizable`, `Scroll Area`, `Separator`, `Sidebar` |
| **2. Overlays, Modals & Menus (11)** | `Alert Dialog`, `Command`, `Context Menu`, `Dialog`, `Drawer`, `Dropdown Menu`, `Hover Card`, `Menubar`, `Navigation Menu`, `Popover`, `Sheet` |
| **3. Forms & Inputs (24)** | `Button`, `Button Group`, `Calendar`, `Checkbox`, `Combobox`, `Date Picker`, `Field`, `Form`, `Input`, `Input Group`, `Input OTP`, `Label`, `Native Select`, `Number Field`, `Pin Input`, `Radio Group`, `Range Calendar`, `Select`, `Slider`, `Switch`, `Tags Input`, `Textarea`, `Toggle`, `Toggle Group` |
| **4. Data Display & Navigation (13)** | `Avatar`, `Badge`, `Breadcrumb`, `Carousel`, `Chart`, `Data Table`, `Empty`, `Kbd`, `Pagination`, `Stepper`, `Table`, `Tabs`, `Typography` |
| **5. Feedback & Status (7)** | `Alert`, `Progress`, `Skeleton`, `Sonner`, `Spinner`, `Toast`, `Tooltip` |
| **6. AI, Chat & Conversational UI (8)** | `Attachment`, `Bubble`, `Code Block`, `Marker`, `Message`, `Message Scroller`, `Questionnaire`, `Trace` |

> **Full Reference Matrix:** Read [`references/component-migration-matrix.md`](references/component-migration-matrix.md) for the complete A–Z mapping (1 to 72), sub-component exports, anti-pattern signatures, and package availability (`@tuquet/vue-ui` vs `@vben-core/shadcn-ui`).

---

## 2. Core Invariants & Execution Protocol

1. **Two-Step Review Gate (Report First -> Wait for `proceed`):**
   - **Step 1 (Audit & Report):** When the user types `review` or `/review-shadcn-standard`, scan the target files/directory, cross-reference against the 72 Shadcn components, output the **Deterministic Audit Table**, and **STOP IMMEDIATELY** to wait for user confirmation (`proceed`).
   - **Step 2 (Migration Execution):** Only after the user replies `proceed` (or confirms specific rows), execute the code refactoring to replace custom UI with standard Shadcn components.
2. **Missing Primitive Protocol (`[THIẾU PRIMITIVE]`):**
   - Check whether the target Shadcn component already exists in the current workspace's UI package (`@vben-core/shadcn-ui` in `admin` or `@tuquet/vue-ui` in `lib`).
   - If the required component (out of the 72 standards) is **not yet present** in the current package (e.g., `Command`, `Kbd`, `Empty`, `InputGroup`, `Table` in `@vben-core/shadcn-ui`), mark its status as **`[THIẾU PRIMITIVE - HỎI Ý KIẾN]`** in the report and **ask the user for permission** before porting/creating the primitive in the UI package.
3. **Zero Visual & Functional Regression:**
   - Preserve 100% of business logic, `v-model` bindings, keyboard shortcuts, events (`emit`), i18n keys (`$t(...)`), and accessibility (`aria-*`, focus management).
   - Cross-reference `skills/rules/TYPOGRAPHY.md` for all text hierarchy and token rules (`Sentence case`, 7-tier modular font scale, semantic HSL colors).

---

## 3. Automated Detection Commands (Static Hunt)

Run these targeted scans on the target repository/directory to locate non-standard UI implementations:

```bash
# 1. Hunt raw HTML form controls & inputs bypassing Shadcn primitives
git grep -n "<button" -- "*.vue" "*.tsx"
git grep -n "<input" -- "*.vue" "*.tsx"
git grep -n "<select" -- "*.vue" "*.tsx"
git grep -n "<textarea" -- "*.vue" "*.tsx"
git grep -n "<label" -- "*.vue" "*.tsx"

# 2. Hunt raw HTML tables, separators, progress bars, and keyboard tags
git grep -n "<table" -- "*.vue" "*.tsx"
git grep -n "<hr" -- "*.vue" "*.tsx"
git grep -n "<progress" -- "*.vue" "*.tsx"
git grep -n "<kbd" -- "*.vue" "*.tsx"
git grep -n "<details" -- "*.vue" "*.tsx"

# 3. Hunt ad-hoc custom badges, cards, spinners, skeletons, and empty states
git grep -n "animate-spin" -- "*.vue" "*.tsx"
git grep -n "animate-pulse" -- "*.vue" "*.tsx"
git grep -n "rounded-full.*px-2.*text-xs" -- "*.vue" "*.tsx"
git grep -n "fixed inset-0" -- "*.vue" "*.tsx"

# 4. Hunt arbitrary font sizes & non-semantic colors (Typography violations)
git grep -nE "text-\[[0-9]+px\]" -- "*.vue" "*.tsx"
git grep -nE "(bg|text|border)-(slate|gray|zinc|neutral|stone)-[0-9]+" -- "*.vue" "*.tsx"
```

---

## 4. High-Frequency Migration Patterns

### Pattern A: Custom Search Input with Icon -> `InputGroup` or `Command`
- **Violation:** `<div class="relative"><Search class="absolute..." /><input class="pl-9 border..." /></div>` or `<Modal>` + `<input>` + `<ul>`.
- **Standard Migration:**
  - For inline search/filter bars: Use `InputGroup`, `InputGroupAddon`, `InputGroupInput`.
  - For search modals / command palettes (`Ctrl+K`): Use `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandShortcut`, and `Kbd`.

### Pattern B: Raw HTML `<table>` -> `Table` or `DataTable`
- **Violation:** `<table class="w-full"><thead class="..."><tr><th>...`
- **Standard Migration:**
  - Simple/medium tabular views: Use `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`.
  - Complex views with sorting, column visibility, row selection, pagination: Use `DataTable` + `Pagination`.

### Pattern C: Raw `<select>` or Custom Filter Buttons -> `Select` / `ToggleGroup`
- **Violation:** `<select class="border border-input rounded-md...">` or multiple `<button :class="active === x ? ...">` for view/time-range switching.
- **Standard Migration:**
  - Dropdown selection: Use `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` (or `NativeSelect` when native mobile picker is explicitly desired).
  - Segmented mode/range switcher (e.g., `7d | 30d | 90d` or `Table | Card`): Use `ToggleGroup` and `ToggleGroupItem`.

### Pattern D: Ad-hoc Empty & Loading States -> `Empty`, `Skeleton`, `Spinner`
- **Violation:** `<div v-if="!items.length" class="py-12 text-center">No data</div>` or `<Loader2 class="animate-spin" />`.
- **Standard Migration:**
  - Empty state: Use `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`.
  - Loading placeholder: Use `Skeleton` or `Spinner`.

---

## 5. Deterministic Output Contract

Every execution of `review` / `/review-shadcn-standard` in **Step 1** MUST output this exact Markdown structure and then pause for user confirmation:

```markdown
## Báo Cáo Kiểm Định Chuẩn Shadcn UI (72-Component Standard)

**Phạm vi quét:** `<target-repo-or-path>`
**Tổng số điểm phát hiện:** `<N>` (`<X>` sẵn sàng migrate, `<Y>` thiếu primitive cần hỏi ý kiến)

| # | Vị trí (`File:Line`) | Hiện trạng (Custom / Raw HTML) | Shadcn Component Chuẩn (1–72) | Trạng thái Package | Đề xuất Migration |
| :-: | :--- | :--- | :--- | :---: | :--- |
| 1 | `path/to/file.vue:L42` | `<select class="border...">` | **Select** (`Select`, `SelectTrigger`, `SelectContent`, `SelectItem`) | `[SẴN SÀNG]` | Thay thẻ `<select>` thô bằng bộ primitive `Select` |
| 2 | `path/to/search.vue:L108` | `<Modal>` + `<input>` + `<kbd>` | **Command** & **Kbd** (`CommandDialog`, `CommandInput`, `Kbd`) | `[THIẾU PRIMITIVE]` | Hỏi ý kiến port `Command` & `Kbd` từ `@tuquet/vue-ui` sang `@vben-core/shadcn-ui` rồi migrate |

---
👉 **Hành động tiếp theo:**
- Gõ **`proceed`** để tiến hành migrate các mục `[SẴN SÀNG]`.
- Đối với các mục **`[THIẾU PRIMITIVE]`**, vui lòng xác nhận có đồng ý thêm/port primitive chuẩn vào package UI hiện tại hay không.
```

---

## 6. Boundaries

- **Always do:**
  - Audit every UI component against the complete 72 Shadcn Standard Components list in [`references/component-migration-matrix.md`](references/component-migration-matrix.md).
  - Output the audit report table first and **wait for the user to confirm (`proceed`)** before modifying any source files.
  - Run `check:type` (`vue-tsc`) and `oxlint` after completing any approved migration.
- **Ask first:**
  - Before adding or porting any missing primitive (marked `[THIẾU PRIMITIVE]`) into `@vben-core/shadcn-ui` or `@tuquet/vue-ui`.
  - Before installing any new npm package dependency in `package.json`.
- **Never do:**
  - Never modify or refactor code immediately during Step 1 (`review`) without user confirmation.
  - Never leave raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<table>`, `<kbd>`, `<progress>`, or `<hr>` with ad-hoc Tailwind classes unflagged during a UI review.
  - Never run `git push` without an explicit push command from the user.
