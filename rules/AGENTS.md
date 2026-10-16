# Tuquet Repository Architectural Rules

## Single Source of Truth (SSOT) & Microservice Pillars Architecture
- **Single Canonical Root:** All Tuquet ecosystem services, data, runtimes, and local storage MUST resolve to a single canonical root: `~/.specter/`.
- **Modular Microservice Pillars Layout:** Storage under `~/.specter/` is strictly organized into dedicated microservice domains:
  - `~/.specter/system/`: Machine identity (`.machine_id`, `.identity.json`), CLI history (`history.txt`), update cache (`update_check.json`), credentials.
  - `~/.specter/automa/`: Workflow definitions (`workflows/*.json`), execution database (`automa.sqlite`), runner daemon data.
  - `~/.specter/browser/`: Dedicated Chromium runtimes (`runtimes/chromium-win64`), browser profiles (`profiles/`), extensions (`extensions/ublock`).
  - `~/.specter/bridge/`: Multi-VPS mesh configuration (`bridge.json`), background daemon PIDs (`pids/<server>.json`), proxy configurations.
  - `~/.specter/faker/`: Faker schema generator definitions, mock templates (`faker.json`).
  - `~/.specter/desktop/`: Desktop preferences (`desktop.json`), window bounds state (`window-state.json`), local crash dumps, session cache.
- **Anti-Fragmentation & No Dual Paths:**
  - Strictly prohibit flat root-level clutter (e.g., do not save directly to `~/.specter/workflows`; use the microservice domain `~/.specter/automa/workflows`).
  - Strictly prohibit fragmented legacy external directories (e.g., no fallback lookups to `~/.automa`).
  - Error messages, logs, CLI outputs, and documentation must reference exclusively the exact microservice pillar path under `~/.specter/<pillar>/`.
- **KISS & YAGNI Principle:** Eliminate obsolete backward compatibility shims, hidden aliases, or dual fallback layers.

## Golden Rules for Specter AI Agent Skills (Ponytail Standard)
- **Atomic Naming & Namespace:** Always name skills using the `specter-<action>` convention (or root `specter`). Strictly adhere to the Single Responsibility Principle (SRP). One skill = one domain or action.
- **Actionable Frontmatter:** Always include `argument-hint` (e.g. `"[start|stop|probe] [server]"`), explicit trigger phrases, slash commands (`/specter-*`), and negative triggers ("Do NOT use for...").
- **The No-Bullshit Imperative:** Eliminate marketing prose, enterprise whitepaper fluff, and long paragraphs in skills. Use direct, imperative commands (staccato cadence: *Scan, Hunt, Check, Route, Ship*). Keep lead directives under 1-2 sharp sentences.
- **Deterministic Output Contract:** Always define an explicit, parseable output schema (e.g., `[SERVICE] <metric>: <status>`) to prevent verbose, drifting LLM responses.
- **Strict Negative Scoping (Boundaries):** Always define a `## Boundaries` section explicitly forbidding out-of-scope actions (e.g., changes nothing, does not touch host browsers, does not proxy direct git pull).

## BFF Architecture & Contract Invariants
- **Frontend NEVER Queries Supabase Directly:**
  - Strictly prohibit importing or using `@supabase/supabase-js` or direct Supabase REST/GraphQL calls in any frontend codebase (`desktop/src`, web extensions, web studio).
  - All data queries, state mutations, and workflow dispatches MUST route exclusively through the local Rust BFF daemon at `http://127.0.0.1:8765/api/v1`.
- **Local-First Speed & Silent Cloud Synchronization:**
  - All reads and writes resolve instantly against local SQLite (`~/.specter/automa/automa.sqlite`) with sub-millisecond latency and offline autonomy.
  - Synchronization with the Supabase Cloud Control Plane is handled asynchronously in the background by the native Rust daemon (`runner::core::enrollment`, `cli::api::handlers::system`).
- **Contract-First OpenAPI Requirement:**
  - Every new or updated endpoint in `cli/src/api/` MUST include the `#[utoipa::path(...)]` attribute macro with explicit schemas and status codes.
  - All endpoints and models MUST be registered in `ApiDoc` (`cli/src/api/routes.rs`) to guarantee `http://127.0.0.1:8765/api-docs/openapi.json` is 100% complete and up to date.
  - Frontend TypeScript types, SDK clients, and React Query hooks MUST be auto-generated from this OpenAPI schema (`orval` / `@hey-api/openapi-ts`), never manually written.
- **Zero-Secret Frontend & Native Token Delegation:**
  - Supabase JWTs, refresh tokens, machine identities, and Tenant RLS tokens are managed strictly within the Rust layer (`~/.specter/system/.identity.json`).
  - Frontend code NEVER stores or forwards cloud secrets. Tenant context and authentication headers are injected silently by the Rust BFF.

## Quality Bar & Engineering Constraints
- Read `CONSTRAINTS.md` before writing code. Do not weaken it to make a change pass.
- Prohibit running `cargo build --release` on VPS; keep disk usage ≤ 85% and run `cargo clean` post-test.
- **Tauri Desktop Invariants:**
  - *In-Process Embedding:* `desktop/src-tauri` MUST depend on library crates (`automa_core`, `specter-browser`, `specter-runner`) directly. NEVER spawn `specter.exe` as an untracked external sidecar.
  - *Zero-Zombie Guarantee:* On app exit or window close, all child Chromium processes, proxy bridges, and CDP sessions MUST terminate synchronously via `command-group` / Windows Job Object.
  - *Dual-Channel IPC:* Local Axum Bridge (`127.0.0.1:8765`) for domain queries & SSE; Tauri IPC (`tauri::command`) strictly for native OS functions.
- **Local-First Verification & Zero-Unsolicited-Push Invariant:**
  - Strictly prohibit executing `git push` or triggering remote GitHub Actions CI/CD workflows unless the user explicitly requests to "push", "deploy", "release", or "ship".
  - Always verify code and UI changes locally first using `specter-dev` with LAN / Tailscale mesh port binding (`--host 0.0.0.0`) so the user can inspect live in browser on phone or workstation before any remote git push.
- **Tuquet Admin & Preferences Invariants:**
  - *Deep-Clone Baseline Isolation:* Never share object references between `this.initialPreferences` and reactive `this.state`. Always use `this.cloneValue()`.
  - *Runtime Viewport State Preservation on Reset:* Never allow `resetPreferences()` to overwrite dynamic runtime hardware/viewport state (`this.state.app.isMobile`) with static default `false`. `diffPreference` must exclude runtime viewport state so mobile screens never trigger false diffs. `isMobile` must be sanitized from `localStorage` caches.
  - *Zero-Mutation in Helpers:* Never mutate reactive preference objects inside CSS variable generators (`update-css-variables.ts`) or calculation helpers.
  - *Pristine Cache Purge on Reset:* On `resetPreferences()`, cleanly purge `STORAGE_KEYS.MAIN` and `STORAGE_KEYS.CUSTOM` from `localStorage` so subsequent F5 page reloads never restore stale user overrides.
  - *Enterprise Typography & Sentence Case Invariant:* Standardize on `Sentence case` for all page titles, descriptions, table cells, and status badges (e.g. "Platform analytics", "Active", "Operational", "Quản trị workspace", "Hoạt động tốt"). Strictly prohibit Title Case in Vietnamese (no capitalization of every word). Strictly prohibit `uppercase` on Page Header Badges, Status Badges, and large KPI metric values (`text-2xl`). `uppercase` is restricted exclusively to: (1) Technical acronyms $\le 4$ chars (`API`, `CPU`, `IP`, `UUID`), (2) Table Column Headers with mandatory tracking (`text-2xs font-semibold uppercase tracking-wider text-muted-foreground`), and (3) Micro-category overlines with `tracking-widest`. Never place decorative static noun badges adjacent to `H1` page titles.
  - *UI Brevity & Anti-Verbosity Invariant:* UI section titles, card headers, and subtitles MUST be crisp, concise, and scannable (e.g. "Phân bổ plugins" instead of verbose descriptive phrases like "Phân Bổ Plugins Cốt Lõi (Kernel vs Module)", "6 đang hoạt động" instead of "6 đã kích hoạt"). Do not place parenthetical implementation details or architectural explanations into UI card headings or subtitles.
  - *PWA & Nginx Header Invariant:* Always serve `sw.js`, `manifest.webmanifest`, and `_app-config-*.js` with `Cache-Control: no-cache, no-store, must-revalidate; Expires: 0`. PWA options must enforce `registerType: 'autoUpdate'`, `workbox.skipWaiting: true`, and `workbox.clientsClaim: true`.
  - *Intra-Page Navigation & Scroll Preservation Invariant:* Tab keys MUST default to `route.path` rather than `fullPath` (`rawKey = fullPathKey === true ? (fullPath ?? path) : path`). Intra-page query parameter changes (`?tab=...`, `?status=...`, `?page=...`) MUST NOT change the component `:key` or cause component destruction/remounting unless explicitly configured with `meta: { fullPathKey: true }`. Page route transition animations (`fade-slide`, `fade`) MUST be suppressed (`getTransitionName` returns `undefined` and `:css="false"`) and viewport/container scroll MUST be preserved (zero scroll-to-top) whenever navigating within the same route path (`from.matched?.length && to.path === from.path`).
  - *Local Build & Zero-Push:* Always run `pnpm run build:local` in `/root/tuquet/admin` to test on Tailscale (`http://100.68.217.61/`). NEVER run `git push`.


## Typography & UI Design Tokens Guardrails
- **Canonical Typography SSOT:** All UI typography across Web Admin and Desktop MUST cross-reference and comply with `skills/rules/TYPOGRAPHY.md`.
- **Zero Remote Font CDN Calls:** Strictly prohibit `<link>` tags to Google Fonts CDN (`fonts.googleapis.com` / `fonts.gstatic.com`). Fonts must be self-hosted locally (WOFF2) with `font-display: swap`.
- **Sans-Serif Stack & Dynamic Preferences:** UI font family stack resolves through `--font-family` (Inter, Roboto, System UI) configurable via Preferences Extension.
- **7-Tier Modular Scale:** Use only standardized font sizes (`text-2xs` 10px to `text-2xl` 24px). Prohibit arbitrary pixel classes (`text-[13px]`, `text-[15px]`).
- **Component Typography Matrix Enforcement:**
  - Table Headers: `text-xs font-semibold uppercase tracking-wider text-muted-foreground`
  - Table Data: `text-sm font-normal text-foreground` (or `text-xs` for IDs, hashes, IPs)
  - Card Titles: `text-base font-semibold tracking-tight`
  - Hero KPI Stats: `text-2xl font-bold tracking-tight`

## Shadcn 72-Component Standard Review Gate (`review-shadcn-standard`)
- **Mandatory Trigger on `review`:** Whenever the user types `review`, `/review-shadcn-standard`, `"review ui"`, or `"review shadcn"` in a frontend workspace, ALWAYS activate `skills/skills/review-shadcn-standard/SKILL.md` and cross-reference `skills/skills/review-shadcn-standard/references/component-migration-matrix.md`.
- **72 Canonical Components Enforcement:** Every UI component MUST use one of the 72 standard Shadcn components (`Accordion`, `Alert`, `Alert Dialog`, `Aspect Ratio`, `Attachment`, `Avatar`, `Badge`, `Breadcrumb`, `Bubble`, `Button`, `Button Group`, `Calendar`, `Card`, `Carousel`, `Chart`, `Checkbox`, `Code Block`, `Collapsible`, `Combobox`, `Command`, `Context Menu`, `Data Table`, `Date Picker`, `Dialog`, `Drawer`, `Dropdown Menu`, `Empty`, `Field`, `Form`, `Hover Card`, `Input`, `Input Group`, `Input OTP`, `Item`, `Kbd`, `Label`, `Marker`, `Menubar`, `Message`, `Message Scroller`, `Native Select`, `Navigation Menu`, `Number Field`, `Pagination`, `Pin Input`, `Popover`, `Progress`, `Questionnaire`, `Radio Group`, `Range Calendar`, `Resizable`, `Scroll Area`, `Select`, `Separator`, `Sheet`, `Sidebar`, `Skeleton`, `Slider`, `Sonner`, `Spinner`, `Stepper`, `Switch`, `Table`, `Tabs`, `Tags Input`, `Textarea`, `Toast`, `Toggle`, `Toggle Group`, `Tooltip`, `Trace`, `Typography`).
- **Two-Step Review Gate:**
  1. Output the structured audit report table first and **wait for user confirmation (`proceed`)** before editing any code.
  2. If a required component from the 72 standards is not yet available in the current project's UI package, mark it as `[THIẾU PRIMITIVE]` in the report and ask the user for approval before adding/porting the primitive.

## Skills Scope & Project Isolation Invariant
- **Global Cross-Project Skills Only (`skills/skills/`):** Only universal cross-project standards (such as `review-shadcn-standard`) reside in `skills/skills/` and are linked to global agent directories (`~/.gemini/config/skills/`).
- **Project-Scoped Domain Skills (`<project>/skills/`):** All `specter*` domain skills MUST reside inside their respective sub-repository (`admin/skills/specter-admin`, `automa/skills/specter-automa`, `bot/skills/specter-bot`, `browser/skills/specter-browser`, `cloud/skills/specter-cloud`, `faker/skills/specter-faker`, `runner/skills/specter-runner`, and `cli/skills/specter*`) registered via `.agents/skills.json`. Never install project-specific `specter*` skills into global `~/.gemini/config/skills/`.
