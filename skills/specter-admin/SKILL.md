---
name: specter-admin
description: >
  Master engineering runbook and domain skill for Tuquet Admin Dashboard (Vue 3, Vite, Vben 5, Shadcn UI).
  Architectural navigation of preferences engine, layout widgets, upstream tracking, memory isolation, and local verification.
  Trigger: /specter-admin, "specter admin", "preferences bug", "admin preferences", "diff upstream admin", "admin layout", "admin widgets", "admin build".
  Do NOT use for backend runner daemon (use /specter-runner) or cloud database migrations (use /specter-cloud).
argument-hint: "[preferences|widgets|diff|test|build] [--upstream <ref>]"
license: MIT
---

# Tuquet Admin Dashboard & Preferences Engine (`specter-admin`)

Master engineering runbook for Tuquet Admin Dashboard (`/root/tuquet/admin`). Zero fluff. Direct architectural maps, upstream triage protocols, and hard invariants.

---

## 1. Architectural Map & Component Topology

```text
/root/tuquet/admin/
├── packages/
│   ├── @core/
│   │   ├── preferences/          # Core Preferences Engine & State Machine
│   │   │   ├── src/
│   │   │   │   ├── preferences.ts        # PreferenceManager singleton (state, deep-clone, reset, cache)
│   │   │   │   ├── config.ts             # defaultPreferences baseline object
│   │   │   │   ├── constants.ts          # STORAGE_KEYS (MAIN, THEME, LOCALE, CUSTOM)
│   │   │   │   ├── update-css-variables.ts # Pure HSL CSS generator (colorPrimary, radius, fontSize)
│   │   │   │   ├── use-preferences.ts    # Composable with diffStrict & layout state
│   │   │   │   └── types.ts              # Preferences TypeScript interfaces
│   │   │   └── __tests__/                # Vitest test suite (preferences.test.ts)
│   │   ├── ui-kit/
│   │   │   └── shadcn-ui/                # Base primitives (segmented, number-field, switch, toggle-group)
│   │   └── base/
│   │       └── shared/                   # mergeWithArrayOverride, diff, diffStrict, storage-manager
│   └── effects/
│       └── layouts/src/widgets/preferences/ # UI Presentation & Drawer Components
│           ├── preferences.vue           # Root popup wrapper & reactive binding bridge
│           ├── preferences-drawer.vue    # Drawer dialog, tabs, diff computation, reset trigger
│           └── blocks/                   # Atomic control blocks
│               ├── block.vue             # Base block wrapper (py-5, mb-5 title, border-b)
│               ├── switch-item.vue       # Toggle switch item with tooltip
│               ├── select-item.vue       # Select dropdown item
│               └── theme/
│                   ├── builtin.vue       # 3-column color grid (py-3 tile, gap-x-3 gap-y-4)
│                   ├── font-size.vue     # NumberField (min 12, max 22, px label, gap-3)
│                   ├── radius.vue        # ToggleGroup (0 to 1 radius)
│                   └── theme.vue         # Light/Dark/Auto modes + semi-dark switches
├── apps/
│   └── web-admin/                        # Application Entrypoint & Production Distribution
│       ├── vite.config.ts                # Vite PWA (autoUpdate, skipWaiting, clientsClaim)
│       └── dist/                         # Compiled bundle served by native Nginx
└── scripts/
    └── build-local.sh                    # Automated safe local build into Nginx (Zero git push)
```

---

## 2. Upstream Tracking & Triage Protocol

Tuquet Admin is maintained against upstream `vbenjs/vue-vben-admin` (`upstream/main`). Always check upstream before attempting invasive hotfixes.

### Triage Commands:
```bash
cd /root/tuquet/admin

# 1. View exact file diff against upstream main:
git diff upstream/main HEAD -- packages/@core/preferences/src/<file>
git diff upstream/main HEAD -- packages/effects/layouts/src/widgets/preferences/<file>

# 2. Inspect upstream commit history for recent bugfixes on a specific file:
git log -p upstream/main -- packages/@core/preferences/src/<file>

# 3. Check two-dot diff stat for whole package:
git diff --stat upstream/main HEAD -- packages/@core/preferences
```

### Upstream Alignment Rule:
- When fixing an admin bug, verify if upstream already solved it cleanly.
- Never invent speculative workarounds that mutate reactive state or introduce eager watchers.

---

## 3. The 5 Core Invariants of Preferences Engine

1. **Zero-Mutation in Calculations & Helpers:**
   - In [`update-css-variables.ts`](file:///root/tuquet/admin/packages/@core/preferences/src/update-css-variables.ts), NEVER assign or mutate `preferences.theme.colorPrimary = ...`.
   - Calculate effective colors purely as local constants for CSS HSL injection without modifying the underlying state heap.

2. **Deep-Clone Baseline Isolation:**
   - `defu` (`merge`) and `Object.assign` only perform shallow copies of nested objects (`theme`, `sidebar`, `app`).
   - In [`preferences.ts`](file:///root/tuquet/admin/packages/@core/preferences/src/preferences.ts), `this.initialPreferences` MUST always be deeply cloned using `this.cloneValue()`.
   - `getInitialPreferences()` MUST return a deep clone so consumers never accidentally mutate the baseline.

3. **Pristine Cache Purge on Reset (Consistent F5 Guarantee):**
   - On `resetPreferences()`, deeply restore pristine values into `reactive(this.state)`.
   - Purge user overrides from storage:
     ```ts
     await this.cache.removeItem(STORAGE_KEYS.MAIN);
     await this.cache.removeItem(STORAGE_KEYS.CUSTOM);
     ```
   - Only preserve `STORAGE_KEYS.THEME` and `STORAGE_KEYS.LOCALE` so `index.html` inline loading scripts avoid white screen flash during hydration.
   - On subsequent F5 reload, `loadFromCache()` returns null for `MAIN`, ensuring pristine defaults are evaluated with zero stale overrides.

4. **No Unintended Immediate Watchers:**
   - In [`builtin.vue`](file:///root/tuquet/admin/packages/effects/layouts/src/widgets/preferences/blocks/theme/builtin.vue), never add `{ immediate: true }` to watchers that dispatch debounced saves or updates on mount.

5. **PWA & Nginx Header Invariant:**
   - In [`/etc/nginx/sites-available/tuquet-admin.conf`](file:///etc/nginx/sites-available/tuquet-admin.conf), `sw.js`, `workbox-*.js`, `manifest.webmanifest`, and `_app-config-*.js` MUST have:
     ```nginx
     add_header Cache-Control "no-cache, no-store, must-revalidate";
     add_header Pragma "no-cache";
     add_header Expires "0";
     ```
   - In [`vite.config.ts`](file:///root/tuquet/admin/apps/web-admin/vite.config.ts), PWA options MUST set `registerType: 'autoUpdate'`, `workbox.skipWaiting: true`, and `workbox.clientsClaim: true`.

---

## 4. Standard Commands & Verification

### Run Preferences Unit Tests:
```bash
cd /root/tuquet/admin
pnpm test:unit packages/@core/preferences/__tests__/preferences.test.ts
```

### Execute Safe Local Build (Zero Push):
```bash
cd /root/tuquet/admin
pnpm run build:local
```

### Verify Live Endpoints:
```bash
# Check build metadata:
curl -s http://127.0.0.1/.build-meta.json

# Check non-cached Service Worker headers:
curl -I http://127.0.0.1/sw.js

# Live UI Inspection via Tailscale Mesh:
# http://100.68.217.61/
```

---

## 5. Deterministic Output Contract

When reporting admin status or diffs:
```text
[ADMIN] Module: <preferences|widgets|layout> | State: <CLEAN|DIRTY>
• Upstream Diff:    <N files diverged>
• Preferences Test: <PASS (N/N tests) | FAIL>
• Local Preview:    http://100.68.217.61/ (Nginx port 80)
• Git Push Guard:   LOCKED (Zero remote push executed)
```

---

## Boundaries

- Changes nothing in backend runner daemon or ports other than port 80.
- Does NOT execute `git push` or trigger remote GitHub Actions CI/CD workflows.
- Does NOT expose public WAN firewall ports.
