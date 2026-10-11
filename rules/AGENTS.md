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


