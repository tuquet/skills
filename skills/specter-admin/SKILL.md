---
name: specter-admin
description: >
  Master engineering runbook and domain skill for Tuquet Admin Dashboard (Vue 3, Vite, Vben 5, Shadcn UI).
  Architectural navigation of preferences engine, 22 routes, Supabase SSOT data access, Shadcn Slate design tokens, local Tailscale preview, and pre-push gates.
  Trigger: /specter-admin, "specter admin", "preferences bug", "admin preferences", "diff upstream admin", "admin layout", "admin widgets", "admin build", "admin routes", "supabase client", "admin quality gate".
  Do NOT use for backend runner daemon (use /specter-runner) or cloud database migrations (use /specter-cloud).
argument-hint: "[preferences|routes|api|tokens|gate|test|build] [--upstream <ref>]"
license: MIT
---

# Tuquet Admin Dashboard — Master Engineering Runbook (`specter-admin`)

Master engineering runbook for Tuquet Admin Dashboard (`/root/tuquet/admin` / `admin.tuquet.com`).
Staccato cadence. Direct architecture maps, SSOT API protocols, 5 core preferences invariants, quality gates, and rapid diagnostic recipes.

---

## 1. Monorepo Topology & Crate Map

Monorepo of **39 packages** orchestrated via `turbo@2.10.13` and `pnpm@11.16.0` workspace:

```text
/root/tuquet/admin/
├── apps/
│   └── web-admin/                        # Main SPA Console (Vite 8, Vue 3.5, Pinia, Vue Router 4)
│       ├── src/
│       │   ├── api/core/                 # Data Access Layer SSOT (supabase-client, auth, fleet, tenant)
│       │   ├── router/                   # 22 Routes, navigation guards, plugin-gate, access control
│       │   ├── store/                    # Pinia stores (auth, user, tenant)
│       │   ├── views/                    # Domain views with Mobile-First Dual View
│       │   └── preferences.ts            # Default application preferences override
│       └── vite.config.ts                # Vite PWA config (registerType: 'autoUpdate', skipWaiting)
├── packages/
│   ├── @core/
│   │   ├── base/                         # Base primitives: shared (diffStrict, storage), typings, design, icons
│   │   ├── composables/                  # Low-level Vue composables (sortable, scroll, mobile)
│   │   ├── preferences/                  # State Machine (PreferenceManager, update-css-variables, use-preferences)
│   │   └── ui-kit/                       # shadcn-ui, layout-ui, form-ui, menu-ui, popup-ui, tabs-ui
│   └── effects/
│       ├── access/                       # RBAC directive v-access & useAccess
│       ├── layouts/                      # BasicLayout, AuthLayout, widget suite (Header, Drawer)
│       ├── locales/                      # vue-i18n core setup (en-US, vi-VN, default timezone GMT+7)
│       ├── plugins/                      # ECharts, VxeTable, Tiptap adapters
│       └── request/                      # Axios client adapter
├── internal/
│   ├── lint-configs/                     # oxlint (Rust), oxfmt, eslint, stylelint, commitlint
│   ├── tailwind-config/                  # Tailwind v4 theme.css (CSS variables design tokens SSOT)
│   ├── tsconfig/                         # TypeScript base, web, library, and node configs
│   └── vite-config/                      # Vite plugins suite (cssLayer, pwa, visualizer, compress)
├── docs/                                 # 4 Designated directories (AGENTS.md §10)
│   ├── architecture/                     # overview.md, styling-guide.md
│   ├── decisions/                        # 0001-routing, 0002-typography, 0003-superadmin
│   ├── routes/                           # README.md (22 routes matrix) and module route docs
│   └── specs/                            # capability-map.md and SPEC-*.md
└── scripts/
    ├── build-local.sh                    # Automated safe local build into Nginx (Zero git push)
    └── vsh/                              # Custom CLI for multi-threaded linting & circular dep audits
```

---

## 2. Route Architecture & The 22 Endpoints

### 2.1. Routing Topology & Guards Flow
1. **`coreRoutes`** ([`src/router/routes/index.ts`](../../admin/apps/web-admin/src/router/routes/index.ts)): Root, Profile, `/auth/*` cluster, 404 fallback. Bypasses access checks.
2. **`accessRoutes`**: Modules loaded dynamically via `import.meta.glob`:
   - `dashboard.ts`: `/dashboard/analytics` + navigation shortcuts.
   - `tenants.ts`: `/tenants`, `/tenants/:id`.
   - `fleet.ts`: `/fleet/devices`, `/fleet/browsers`, `/fleet/proxies`.
   - `automation.ts`: `/automation/workflows`, `/automation/runs`, `/automation/runs/:id`.
   - `system.ts`: `/system/plugins`, `/system/plans`, `/system/users`, `/system/audit-logs`, `/system/subscriptions`, `/system/roles`.
3. **Plugin Gating (`plugin-gate.ts`)**: Pure filter `filterRoutesByPlugins(routes, installedPlugins)` prunes routes whose `meta.plugin` is not `installed` in `public.system_plugins`. Automatically prunes parent menus when all children are filtered out.
4. **Access Control (`access.ts`)**:
   - **Platform Superadmin:** JWT `app_metadata.platform_role = 'superadmin'` receives platform wildcard, granting 100% route access and bypassing database RLS via `public.is_platform_admin()`.
   - **Tenant Roles:** Dynamic role permissions flattened via `flattenMemberships()` into `<module>:<action>` codes.
   - **Access Promise Cache:** Single-flight cache `effectiveAccessPromise` avoids redundant roundtrips; purged on logout via `clearAccessCache()`.

### 2.2. Complete 22 Routes Matrix

| # | Route Path | Route Name | Plugin | Access Authority | Layout | Component File | Supabase Table / Source |
|---|---|---|---|---|---|---|---|
| 1 | `/dashboard/analytics` | `Analytics` | `core-iam` | Authenticated | `BasicLayout` | [`views/dashboard/analytics/index.vue`](../../admin/apps/web-admin/src/views/dashboard/analytics/index.vue) | `public.tenants`, `system_plugins` |
| 2 | `/tenants` | `Tenants` | `core-iam` | `['superadmin', 'tenants:read']` | `BasicLayout` | [`views/tenants/index.vue`](../../admin/apps/web-admin/src/views/tenants/index.vue) | `public.tenants` |
| 3 | `/tenants/:id` | `TenantDetail` | `core-iam` | `['superadmin', 'tenants:read']` | `BasicLayout` | [`views/tenants/detail.vue`](../../admin/apps/web-admin/src/views/tenants/detail.vue) | `public.tenants`, `tenant_members` |
| 4 | `/fleet/devices` | `FleetDevices` | `runners` | `['superadmin', 'runners:devices:read']` | `BasicLayout` | [`views/fleet/devices/index.vue`](../../admin/apps/web-admin/src/views/fleet/devices/index.vue) | `runners.devices` |
| 5 | `/fleet/browsers` | `FleetBrowsers` | `runners` | `['superadmin', 'runners:browsers:read']` | `BasicLayout` | [`views/fleet/browsers/index.vue`](../../admin/apps/web-admin/src/views/fleet/browsers/index.vue) | `runners.browsers` |
| 6 | `/fleet/proxies` | `FleetProxies` | `runners` | `['superadmin', 'runners:proxies:read']` | `BasicLayout` | [`views/fleet/proxies/index.vue`](../../admin/apps/web-admin/src/views/fleet/proxies/index.vue) | `runners.proxies` |
| 7 | `/automation/workflows` | `AutomationWorkflows` | `automa` | `['superadmin', 'automa:workflows:read']` | `BasicLayout` | [`views/automation/workflows/index.vue`](../../admin/apps/web-admin/src/views/automation/workflows/index.vue) | `automa.workflows` |
| 8 | `/automation/runs` | `AutomationRuns` | `automa` | `['superadmin', 'automa:campaigns:read']` | `BasicLayout` | [`views/automation/runs/index.vue`](../../admin/apps/web-admin/src/views/automation/runs/index.vue) | `automa.campaign_runs` |
| 9 | `/automation/runs/:id` | `AutomationRunDetail` | `automa` | `['superadmin', 'automa:logs:read']` | `BasicLayout` | [`views/automation/runs/detail.vue`](../../admin/apps/web-admin/src/views/automation/runs/detail.vue) | `automa.execution_logs` (3s poll) |
| 10 | `/system/plugins` | `SystemPlugins` | `core-iam` | `['superadmin', 'plugins:read']` | `BasicLayout` | [`views/system/plugins/index.vue`](../../admin/apps/web-admin/src/views/system/plugins/index.vue) | `public.system_plugins` |
| 11 | `/system/plans` | `SystemPlans` | `subscriptions` | `['superadmin', 'subscriptions:read']` | `BasicLayout` | [`views/system/plans/index.vue`](../../admin/apps/web-admin/src/views/system/plans/index.vue) | `billing.plans` |
| 12 | `/system/users` | `SystemUsers` | `core-iam` | `['superadmin']` | `BasicLayout` | [`views/system/users/index.vue`](../../admin/apps/web-admin/src/views/system/users/index.vue) | `public.profiles` |
| 13 | `/system/audit-logs` | `SystemAuditLogs` | `core-iam` | `['superadmin']` | `BasicLayout` | [`views/system/audit-logs/index.vue`](../../admin/apps/web-admin/src/views/system/audit-logs/index.vue) | `public.audit_logs` |
| 14 | `/system/subscriptions` | `SystemSubscriptions` | `subscriptions` | `['superadmin']` | `BasicLayout` | [`views/system/subscriptions/index.vue`](../../admin/apps/web-admin/src/views/system/subscriptions/index.vue) | `billing.subscriptions` |
| 15 | `/system/roles` | `SystemRoles` | `core-iam` | `['superadmin']` | `BasicLayout` | [`views/system/roles/index.vue`](../../admin/apps/web-admin/src/views/system/roles/index.vue) | `public.roles`, `permissions` |
| 16 | `/auth/login` | `Login` | Core | Public | `AuthPageLayout` | [`views/_core/authentication/login.vue`](../../admin/apps/web-admin/src/views/_core/authentication/login.vue) | Supabase GoTrue + Turnstile |
| 17 | `/auth/register` | `Register` | Core | Public | `AuthPageLayout` | [`views/_core/authentication/register.vue`](../../admin/apps/web-admin/src/views/_core/authentication/register.vue) | Supabase GoTrue |
| 18 | `/auth/forget-password` | `ForgetPassword` | Core | Public | `AuthPageLayout` | [`views/_core/authentication/forget-password.vue`](../../admin/apps/web-admin/src/views/_core/authentication/forget-password.vue) | Supabase GoTrue |
| 19 | `/auth/reset-password` | `ResetPassword` | Core | Public | `AuthPageLayout` | [`views/_core/authentication/reset-password.vue`](../../admin/apps/web-admin/src/views/_core/authentication/reset-password.vue) | Supabase GoTrue |
| 20 | `/auth/callback` | `AuthCallback` | Core | Public | `AuthPageLayout` | [`views/_core/authentication/callback.vue`](../../admin/apps/web-admin/src/views/_core/authentication/callback.vue) | Supabase OAuth (GitHub/Google) |
| 21 | `/auth/desktop` | `DesktopBridge` | Core | Authenticated | `AuthPageLayout` | [`views/_core/authentication/desktop-bridge.vue`](../../admin/apps/web-admin/src/views/_core/authentication/desktop-bridge.vue) | Desktop Loopback SSO (:8765) |
| 22 | `/profile` | `Profile` | Core | Authenticated | `BasicLayout` | [`views/_core/profile/index.vue`](../../admin/apps/web-admin/src/views/_core/profile/index.vue) | `public.profiles` |

### 2.3. Intra-Page Navigation & Route Transition Architecture

When navigating between routes:
1. **Inter-Page Navigation (`from.path !== to.path`):**
   - Triggers page entry/exit animations (`fade-slide` via `<Transition>`).
   - Resets layout container scroll and viewport to `top: 0` (or restores `savedPosition` on browser history back/forward).
2. **Intra-Page Navigation (`from.path === to.path`, e.g. query tab changes `?tab=...`, filter changes `?status=...`, pagination):**
   - **Tab Key Stability:** `getTabKey(route)` returns `route.path` (unless `meta: { fullPathKey: true }`), preserving component `:key` so Vue patches the VNode in place without unmounting.
   - **Transition Suppression:** `useLayoutHook()` detects `isSamePathNavigation` via `router.beforeEach` and returns `undefined` for `getTransitionName(route)`. `<Transition :css="Boolean(getTransitionName(route))">` disables all CSS transition classes and prevents `.page-route-leave-active` (`position: absolute`) from attaching.
   - **Scroll Preservation:** `useLayoutScroll()` checks `isSamePath = Boolean(from?.matched?.length && to.path === from.path)` and bypasses `scrollElement.scrollTo({ top: 0 })`. `router.scrollBehavior` returns `false` to instruct Vue Router not to scroll the window.

---

## 3. Data Access & Supabase REST SSOT

### 3.1. Single Source of Truth (`supabaseRequest`)
- File: [`apps/web-admin/src/api/core/supabase-client.ts`](../../admin/apps/web-admin/src/api/core/supabase-client.ts)
- **Zero-Direct-Supabase Rule:** Strictly prohibit importing `@supabase/supabase-js` in client-side code. All queries route through `supabaseRequest<T>()`.
- **PostgREST Schema Profile Switching:**
  - GET / HEAD: Injects `Accept-Profile: <schema>`.
  - POST / PUT / PATCH / DELETE: Injects `Content-Profile: <schema>`.
  - Valid schemas: `'automa' | 'billing' | 'events' | 'media' | 'public' | 'runners'`.

```typescript
import { supabaseRequest } from '#/api/core/supabase-client';

export async function getFleetDevicesApi(status?: string) {
  const query = new URLSearchParams({
    select: 'id,machine_id,name,status,tags,cpu_usage,memory_usage,last_heartbeat_at',
    order: 'last_heartbeat_at.desc',
  });
  if (status) query.append('status', `eq.${status}`);

  return supabaseRequest<FleetDevice[]>({
    path: `/rest/v1/devices?${query.toString()}`,
    options: {
      method: 'GET',
      schema: 'runners', // BẮT BUỘC: tự động gửi Accept-Profile: runners
    },
  });
}
```

### 3.2. Private Network Access (PNA) Loopback Standard
- Function: `probeLocalDaemonApi(port = 8765)` in [`apps/web-admin/src/api/core/fleet.ts`](../../admin/apps/web-admin/src/api/core/fleet.ts).
- Calls local Rust daemon: `fetch('http://127.0.0.1:8765/api/v1/status', { method: 'GET', mode: 'no-cors', signal })`.
- Timeout: Hard limit $\le 1200\text{ms}$ via `AbortController`.
- Non-blocking: Caught inside try-catch. If blocked by Chromium PNA prompt, UI remains responsive and marks daemon offline without freezing.

---

## 4. Shadcn Slate Design Tokens & UI Rules

### 4.1. Semantic Tokens SSOT (`internal/tailwind-config/src/theme.css`)
- Colors resolve to HSL CSS variables: `--background`, `--foreground`, `--card`, `--primary`, `--border`, `--radius`.
- **Prohibit hardcoded static colors:** Never write `bg-[#0f172a]`, `text-black`, `border-gray-200`. Always write:
  - Surfaces: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`.
  - Accents: `bg-primary`, `text-primary-foreground`, `border-border/60`.
  - Corners: `rounded-xl` (12px container/cards), `rounded-lg` (8px inputs/buttons).

### 4.2. Lucide Icons Only Invariant
- **Rule:** Strictly use `@lucide/vue`.
- **Zero Emojis:** Never use unicode emojis (🏢, 🧩, ⚡, 📡, ✓) as functional icons.
- Standard sizes: Header actions `size-4`, Metric badge `size-5`, Status indicators `size-3.5`.

### 4.3. Mobile-First Dual View Standard
Every view with a data table must implement Dual View:
```vue
<!-- Desktop View: Hidden on mobile, shown on desktop -->
<div class="hidden rounded-xl border border-border/60 bg-card md:block">
  <table class="w-full text-left text-sm text-foreground">...</table>
</div>

<!-- Mobile View: Touch cards on mobile, hidden on desktop -->
<div class="block space-y-3 md:hidden">
  <Card v-for="item in items" :key="item.id" class="p-4 border-border/60">
    <!-- Touch targets >= 40px -->
    <Button class="mt-3 w-full h-10" variant="outline">Action</Button>
  </Card>
</div>
```

### 4.4. Enterprise Typography & Capitalization Standards (Sentence Case & Strict Uppercase Boundaries)
Follow global enterprise standards (Stripe, GitHub Primer, Vercel, Linear, Apple HIG):

1. **Strict Sentence Case Rule:**
   - Always use `Sentence case` for all UI titles, descriptions, table cells, metric labels, and status badges (e.g. "Platform analytics", "Active", "Operational", "Quản trị workspace", "Hoạt động tốt").
   - Strictly prohibit Title Case in Vietnamese (no capitalization of every word like "Phân Tích Nền Tảng").
2. **Strict Negative Scoping on `uppercase`:**
   - **Bouma / Word Shape Preservation:** All-caps converts distinct word shapes into identical rectangular blocks, reducing reading speed by 10-15%.
   - **Vietnamese Stacked Diacritics Protection:** All-caps on Vietnamese text (`Ể, Ổ, Ặ, Ở, Ự`) causes severe vertical diacritic collisions, breaking vertical rhythm and badge padding.
   - **Accessibility (A11y):** Screen readers spell out all-caps text letter-by-letter as acronyms ("O-P-E-R-A-T-I-O-N-A-L").
   - Strictly PROHIBIT `uppercase` on Page Header Badges, Status Badges, large KPI metrics (`text-2xl`), and prose.
3. **The 3 Allowed Uppercase Exceptions:**
   - **Technical Acronyms ($\le 4$ chars):** `API`, `CPU`, `RAM`, `IP`, `UUID` (`font-mono text-xs`).
   - **Table Column Headers (10-11px):** `text-2xs font-semibold uppercase tracking-wider text-muted-foreground` (MUST include `tracking-wider`).
   - **Micro-Category Overlines:** `text-2xs font-medium uppercase tracking-widest text-muted-foreground`.
4. **Clean Page Header Invariant:**
   - `H1` titles must be clean, semantic, and unencumbered. Prohibit placing decorative static noun badges adjacent to `H1` (e.g. do not put `<Badge>REAL-TIME METRICS</Badge>` next to "Platform analytics"). Use a clean subtitle `<p class="text-xs text-muted-foreground">` instead.
5. **UI Brevity & Anti-Verbosity Standard:**
   - Section headers, card titles, and subtitles must be concise and scannable (e.g. "Phân bổ plugins" instead of verbose descriptive phrases like "Phân Bổ Plugins Cốt Lõi (Kernel vs Module)", "6 đang hoạt động" instead of "6 đã kích hoạt").
   - Prohibit dumping backend architectural jargon or parenthetical explanations into card titles and badges.

### 4.5. VxeTable & Component Adapter Architecture

The VxeTable ecosystem in Tuquet Admin operates across 4 coordinated tiers:

1. **Global Configuration (`apps/web-admin/src/adapter/vxe-table.ts`):**
   - Initialized via `setupVbenVxeTable({ configVxeTable, useVbenForm })`.
   - Global defaults: `border: false`, `round: true`, `size: 'small'`, `showOverflow: true`.
   - **Form Invariant:** VXE native form is disabled (`formConfig: { enabled: false }`) in favor of Vben's unified reactive `formOptions`.
   - **Global Renderers:** Custom cell formatters registered via `vxeUI.renderer.add('CellImage', ...)` and `vxeUI.renderer.add('CellLink', ...)`.
2. **Search Form Component Adapter (`apps/web-admin/src/adapter/component/index.ts`):**
   - Bridges `@tuquet/vue-ui` components (Input, Select, DatePicker, Checkbox, Switch) into Vben Form.
   - Wraps components with `withDefaultPlaceholder` for localized placeholder injection.
3. **Usage Patterns in Views:**
   - **Pattern A: Manual / Client-Side Data Loading (`views/system/users/index.vue`):**
     ```ts
     const [Grid, gridApi] = useVbenVxeGrid<ItemType>({
       gridOptions: {
         columns: [
           { field: 'name', title: 'Tên', slots: { default: 'name-cell' } },
           { field: 'status', title: 'Trạng thái', slots: { default: 'status-cell' } },
         ],
       },
     });
     // Update: gridApi.setGridOptions({ data });
     // Loading: gridApi.setLoading(true / false);
     ```
   - **Pattern B: Server-Side Proxy & Pagination (`proxyConfig`):**
     ```ts
     const [Grid, gridApi] = useVbenVxeGrid({
       formOptions: { schema: [...] },
       gridOptions: {
         pagerConfig: { pageSize: 20 },
         proxyConfig: {
           ajax: {
             query: async ({ page }, formValues) => {
               const res = await fetchApi({
                 page: page.currentPage,
                 pageSize: page.pageSize,
                 ...formValues,
               });
               return { items: res.data, total: res.total };
             },
           },
         },
         columns: [...],
       },
     });
     ```

---

## 5. Preferences Engine & The 7 Core Invariants

Managed by `PreferenceManager` singleton ([`packages/@core/preferences/src/preferences.ts`](../../admin/packages/@core/preferences/src/preferences.ts)):

1. **Zero-Mutation in Helpers:** In `update-css-variables.ts`, NEVER assign `preferences.theme.colorPrimary = ...`. Compute local values purely for CSS variable injection.
2. **Deep-Clone Baseline Isolation:** `defu` only copies shallow references. `this.initialPreferences` MUST always be deeply cloned using `this.cloneValue()`. `getInitialPreferences()` must return a deep clone.
3. **Pristine Cache Purge on Reset (Consistent F5 Guarantee):** On `resetPreferences()`, deeply restore initial state and cleanly purge storage keys `MAIN` (`preferences`), `CUSTOM` (`preferences-custom`), `LOCALE`, and `THEME`. On subsequent F5 reload, `loadFromCache()` returns null for `MAIN`, guaranteeing pristine defaults.
4. **Runtime Viewport State Preservation on Reset:** In `resetPreferences()`, preserve `currentIsMobile = this.state.app.isMobile` across the reset assignment so mobile devices never have `isMobile` clobbered to `false` (which would abruptly unmount drawer and toggle desktop sidebar on mobile). Sanitize `isMobile` before saving to `localStorage` or loading from cache. In `use-preferences.ts`, `diffPreference` must exclude runtime `isMobile` from baseline comparison so mobile viewports never trigger false diffs (false blue active dot).
5. **No Immediate Watchers:** In `builtin.vue` and control blocks, never pass `{ immediate: true }` to watchers that dispatch debounced updates on mount.
6. **PWA & Nginx Anti-Cache Headers:** In Nginx configuration, `sw.js`, `workbox-*.js`, `manifest.webmanifest`, and `_app-config-*.js` MUST serve `Cache-Control: no-cache, no-store, must-revalidate; Expires: 0`. In `vite.config.ts`, PWA options MUST set `registerType: 'autoUpdate'`, `workbox.skipWaiting: true`, and `workbox.clientsClaim: true`.
7. **Anti-Lockout Invariant:** In `use-preferences.ts`, if the header is disabled/hidden while preferences button is positioned in the header, automatically fall back to floating fixed button (`fixed: true`).

---

## 6. Pre-Push Quality Gate & Zero-Waste CI

> [!CAUTION]
> GitHub Actions minutes are strictly rationed. NEVER push code to remote without passing all 4 local checks.

### 6.1. The 4-Step Local Gate
```bash
cd /root/tuquet/admin

# 1. Typecheck: vue-tsc --noEmit --skipLibCheck across 39 packages (0 errors)
pnpm run check:type

# 2. Linting & Formatting: oxlint + oxfmt + eslint + stylelint (0 errors)
pnpm run lint

# 3. Headless Browser Console & Runtime Gate: 22/22 routes verified in headless Chrome (0 Vue/i18n/router warnings, 0 page errors)
pnpm run check:console

# 4. Web Admin Production Build: Vite packaging bundle (0 errors)
pnpm run build:admin
```

### 6.2. Dependency Catalog & Commits
- Always use `"catalog:"` in workspace `package.json` files for external libraries.
- For documentation or non-code changes (`*.md`, `scratch/`), always append `[skip ci]` to the commit message:
  `docs: update engineering runbook [skip ci]`
- Prohibit micro-pushes. Batch related commits and push only once.

---

## 7. Local Deployment & Tailscale Mesh Verification

### 7.1. Safe Local Build Script (`scripts/build-local.sh`)
```bash
# Execute local verification build (disk check + vitest + vite build + nginx reload)
pnpm run build:local
```

### 7.2. Live Verification Endpoints (Zero WAN Exposure)
- **Localhost:** `http://127.0.0.1/`
- **Tailscale Mesh IP:** `http://100.68.217.61/` (inspect directly from phone or workstation)
- **Telemetry Check:** `curl -s http://127.0.0.1/.build-meta.json`
- **Service Worker Headers Check:** `curl -I http://127.0.0.1/sw.js` (must show `Cache-Control: no-cache, no-store`)

---

## 8. Diagnostic Recipes & Troubleshooting

### Recipe 1: White Screen / Hydration Flash on F5 Reload
- **Cause:** Stale user overrides in `localStorage` diverging from updated defaults.
- **Fix:** In console or code, trigger clean cache purge:
  ```ts
  await preferenceManager.cache.removeItem('specter-preferences');
  await preferenceManager.cache.removeItem('specter-preferences-custom');
  ```

### Recipe 2: Mobile Modal Dialog Off-Screen
- **Cause:** Hardcoded `translate(-50%, -50%)` conflicting with draggable `translate(offsetX, offsetY)`.
- **Fix:** In `modal.vue` and `use-modal-draggable.ts`, use compound transform:
  `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`.
  Ensure container uses `max-w-[calc(100vw-2rem)] sm:w-130`.

### Recipe 3: Out of Memory During Local Build
- **Cause:** Node heap exhaustion on resource-constrained VPS during Rollup DTS generation.
- **Fix:** Set `export NODE_OPTIONS="--max-old-space-size=4096"` before building. `build:local` sets this automatically.

### Recipe 4: Circular Dependency Detected
- **Cause:** Cyclic import across `@core/*` and `effects/*`.
- **Fix:** Run `pnpm run check:circular`. Trace imports and extract common interfaces into `@vben-core/typings` or `@vben-core/shared`.

### Recipe 5: Stale PWA Service Worker Cache Lock
- **Cause:** Browser retaining old chunk hashes.
- **Fix:** Verify `vite.config.ts` has `workbox.skipWaiting: true` and `workbox.clientsClaim: true`. Check `curl -I http://127.0.0.1/sw.js` returns `Cache-Control: no-cache`.

### Recipe 6: Query Parameter Change Causes Page Transition / Component Remount
- **Cause:** `getTabKey` defaulting to `fullPath`, mutating `:key="getTabKey(route)"` on query changes (`?tab=...`, `?status=...`) and triggering `<Transition>` unmount/remount.
- **Fix:** Ensure `tabbar.ts` uses `rawKey = fullPathKey === true ? (fullPath ?? path) : path`, and `useLayoutHook()` returns `undefined` for `getTransitionName` when `from.matched?.length && to.path === from.path`.

### Recipe 7: Mobile Scroll Resets to Top 0 on Query/Filter Change
- **Cause:** `use-layout-scroll.ts` calling `scrollElement.scrollTo({ top: 0 })` and `router.scrollBehavior` returning `{ left: 0, top: 0 }` unconditionally on query navigations.
- **Fix:** In `use-layout-scroll.ts`, guard with `if (!isSamePath) scrollElement.scrollTo({ top: 0 })` where `isSamePath = Boolean(from?.matched?.length && to.path === from.path)`. In `router/index.ts`, return `false` from `scrollBehavior` when `from?.matched?.length && to.path === from.path`.

---

## 9. Upstream Tracking & Triage

Tracked against `vbenjs/vue-vben-admin` (`upstream/main`):
```bash
# Check diff against upstream for a specific component:
git diff upstream/main HEAD -- packages/@core/preferences/src/<file>
git diff upstream/main HEAD -- packages/effects/layouts/src/widgets/<file>

# Check recent upstream bugfixes:
git log -p upstream/main -- packages/@core/preferences/src/<file>
```

---

## 10. Deterministic Output Contract

When reporting admin status or diffs:
```text
[ADMIN] Module: <routes|api|preferences|layout|build> | State: <CLEAN|DIRTY>
• 22 Routes Integrity: <PASS (22/22 verified) | FAIL>
• Supabase Client:     <SSOT COMPLIANT | DIRECT LEAK DETECTED>
• Quality Gate:        <PASS (typecheck 0, lint 0) | FAIL>
• Local Verification:  http://100.68.217.61/ (Nginx port 80)
• Git Push Guard:      LOCKED (Zero remote push executed)
```

---

## Boundaries

- Changes nothing in backend runner daemon (`/root/tuquet/cli`) or database migrations (`/root/tuquet/cloud`).
- Does NOT execute `git push` or trigger remote GitHub Actions CI/CD workflows unless explicitly ordered.
- Does NOT expose public WAN firewall ports (operates exclusively on localhost and Tailscale mesh).
- Does NOT import `@supabase/supabase-js` into client bundles.
- Does NOT introduce mock data or unicode emojis into UI.
