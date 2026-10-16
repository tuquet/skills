---
name: specter-help
description: >
  Quick-reference card and master cheatsheet for all Specter CLI commands, interactive shell scopes,
  and canonical SSOT microservice pillars under ~/.specter/. One-shot display.
  Trigger: /specter-help, "specter help", "what specter commands", "how do I use specter", "specter cheatsheet".
argument-hint: ""
license: MIT
---

# Specter Master Cheatsheet & Help Card (`specter-help`)

One card. Zero fluff. All commands, interactive REPL scopes, and SSOT pillars. Display this reference card when invoked. One-shot, changes nothing.

## Available Skills (All 5 Pillars Covered)

<!-- SKILLS_CATALOG_START -->
| Skill | Trigger | Argument Hint | Scope & Purpose |
| :--- | :--- | :--- | :--- |
| **specter** | `/specter` | `[status\|dashboard]` | Master orchestrator and platform health dashboard (`specter status`). |
| **addy-api-and-interface-design** | `/addy-api-and-interface-design` | *(None)* | Guides stable API and interface design. |
| **addy-browser-testing-with-devtools** | `/addy-browser-testing-with-devtools` | *(None)* | Tests in real browsers via Chrome DevTools MCP. |
| **addy-code-review-and-quality** | `/addy-code-review-and-quality` | *(None)* | Conducts multi-axis code review. |
| **addy-context-engineering** | `/addy-context-engineering` | *(None)* | Optimizes agent context setup. |
| **addy-debugging-and-error-recovery** | `/addy-debugging-and-error-recovery` | *(None)* | Guides systematic root-cause debugging. |
| **addy-frontend-ui-engineering** | `/addy-frontend-ui-engineering` | *(None)* | Builds production-quality, accessible, responsive user-facing UIs. |
| **addy-performance-optimization** | `/addy-performance-optimization` | *(None)* | Optimizes application performance across frontend, backend, queries, and databases. |
| **addy-planning-and-task-breakdown** | `/addy-planning-and-task-breakdown` | *(None)* | Breaks work into ordered tasks. |
| **addy-security-and-hardening** | `/addy-security-and-hardening` | *(None)* | Hardens code against vulnerabilities. |
| **addy-test-driven-development** | `/addy-test-driven-development` | *(None)* | Drives development with tests using the red-green-refactor loop. |
| **antfu-create-pr** | `/antfu-create-pr` | *(None)* | Create a reviewable GitHub pull request from the current branch with a Conventional Commits title, a concise evidence-based body, and before/after screenshots for UI changes. |
| **automa-core** | `/automa-core` | *(None)* | Architecture, Axum REST/SSE/WS endpoints, OpenAPI utoipa annotations, SQLite database-first state, disk scenario conventions (apps/vault), anti-detect browser managers, and execution coordinator for Automa Core Rust Daemon. |
| **automa-monorepo** | `/automa-monorepo` | *(None)* | Monorepo architecture, Turborepo DAG invariants, workspace package resolution (packages/types, packages/ui), build/lint/test verification, real-time log tracking, and 4-step cleanup SOP. |
| **automa-shadcn** | `/automa-shadcn` | *(None)* | Design system, 19 Shadcn-Vue atomic primitives, Theme Variable Inversion (tokens.css), Dark Mode iframe synchronization, and Radical Minimalism UX audit standards (Rule of 1-3 Words, 4-tier layout) for the Automa Ecosystem (@automa/ui). |
| **automa-webe** | `/automa-webe` | *(None)* | Architecture, Standalone Web Studio Canvas (dist/studio), Headless Execution Engine (dist/cli-runner), VueFlow graph authoring rules (Nanoid, handles, loops), and Chromium extension injection protocols for Automa Web Extension (automa-webe). |
| **pinia** | `/pinia` | *(None)* | Pinia official Vue state management library, type-safe and extensible. |
| **pnpm** | `/pnpm` | *(None)* | Node.js package manager with strict dependency resolution. |
| **ponytail** | `/ponytail` | `[lite\|full\|ultra\|off]` | Lazy senior dev mode: the smallest change that fully solves the task, and a. |
| **ponytail-audit** | `/ponytail-audit` | *(None)* | Quality audit of a whole repo: bugs, security holes, what breaks under real. |
| **ponytail-debt** | `/ponytail-debt` | *(None)* | List every `shortcut:` comment (and older `ponytail:` ones) as a debt ledger. |
| **ponytail-gain** | `/ponytail-gain` | *(None)* | Show ponytail's measured savings (code, cost, speed) from the benchmark. |
| **ponytail-review** | `/ponytail-review` | *(None)* | Quality review of a change: is the logic right, is it safe, does it hold. |
| **review-shadcn-standard** | `/review-shadcn-standard` | `[audit\|migrate] [target-path] [--component <name>]` | Audit and migrate frontend UI components across Tuquet projects to strictly enforce the 72 canonical Shadcn UI components standard. |
| **specter-automa** | `/specter-automa` | `[run\|list\|inspect\|studio] [workflow.json]` | Headless automation runner and visual DAG engine for browser tasks via native CDP and local SQLite store. |
| **specter-bot** | `/specter-bot` | `[status\|logs\|restart\|test\|run\|deploy]` | Telegram ChatOps assistant daemon, server health monitoring, and GitHub Actions notification engine. |
| **specter-bridge** | `/specter-bridge` | `[status\|start\|stop\|deploy\|check] [server]` | Manage network bridge tunnels, SOCKS5 proxy (1080), HTTP adapter (8118), and local SSH (2222). |
| **specter-browser** | `/specter-browser` | `[status\|install\|list\|use\|clean\|path]` | Manage Antidetect Chromium runtimes, hardware emulation seeds, profile sandboxes, and proxy routing. |
| **specter-cicd** | `/specter-cicd` | `[preflight\|plan\|tag\|status\|dispatch] [repo] [version]` | CI/CD pipeline orchestration, local pre-flight gatekeeping, semantic version tagging, and GitHub Actions budget control. |
| **specter-cloud** | `/specter-cloud` | `[whoami\|login\|logout\|config\|db]` | Manage Specter Cloud control plane, device fleet enrollment, and Supabase database migrations. |
| **specter-desktop** | `/specter-desktop` | `[dev\|build\|doctor\|clean\|audit]` | Manage Tuquet Tauri Desktop runtime lifecycle, in-process Axum bridge daemon,. |
| **specter-dev** | `/specter-dev` | `[dev\|preview\|stop\|status\|tailscale] [admin\|automa\|web\|docs] [--port <port>]` | Orchestrate local development and preview servers with LAN and Tailscale mesh port exposure (--host 0.0.0.0) for live browser inspection on phone and workstation. |
| **specter-faker** | `/specter-faker` | `[generate\|card\|config] [-n count] [-d domain]` | Synthetic persona generator with compliant Vietnamese CCCD validation,. |
| **specter-help** | `/specter-help` | *(None)* | Quick-reference card and master cheatsheet for all Specter CLI commands, interactive shell scopes,. |
| **specter-runner** | `/specter-runner` | `[status\|start\|stop\|restart\|logs\|probe]` | Kernel-level Win32 Job Object supervisor & daemon controller (port 8765). |
| **specter-security** | `/specter-security` | `[audit\|harden\|check-ports]` | Enterprise standard and autonomous runbook for cloud server hardening,. |
| **vite** | `/vite` | *(None)* | Vite build tool configuration, plugin API, SSR, and Vite 8 Rolldown migration. |
| **vitest** | `/vitest` | *(None)* | Vitest fast unit testing framework powered by Vite with Jest-compatible API. |
| **vue** | `/vue` | *(None)* | Vue 3 Composition API, script setup macros, reactivity system, and built-in components. |
<!-- SKILLS_CATALOG_END -->

## CLI Cheatsheet

```powershell
# Health, Diagnostics & Dependencies
specter doctor                          # Full dependency check (Scoop, Cloudflared, SSH, Antidetect Chromium)
specter status                          # Holistic ecosystem health dashboard (Cloud, Bridge, Browser, Runner)

# Cloud Control Plane & Fleet Pairing
specter cloud whoami                    # Inspect paired device identity & tenant
specter cloud login --name "Node-1"     # Pair workstation with Tuquet Cloud fleet
supabase db push                       # Apply remote schema migrations (requires bridge --http)

# Network Bridge & Tunnels
specter bridge status                   # Check active tunnels & ports (1080, 8118, 2222)
specter bridge start [server]           # Start SOCKS5 proxy on 127.0.0.1:1080
specter bridge start [server] --http    # Start with embedded HTTP adapter (8118)
specter bridge stop [server | all]      # Terminate active tunnels cleanly
specter bridge check                    # Validate bridge.json schema against conflicts

# Process Supervisor & Daemon (Port 8765)
specter runner status                   # Check worker daemon on port 8765
specter runner start -d                 # Spawn background worker daemon (Detached Process)
specter runner logs -f                  # Stream worker execution traces in real-time
specter runner stop                     # Gracefully terminate supervisor & child process tree
specter runner probe                    # Query hardware specs and driver capabilities

# Antidetect Chromium Runtime
specter browser status                  # Inspect Antidetect engine, active version & path
specter browser list                    # List installed versions with active badge (148, LTS)
specter browser search                  # Query upstream manifest releases & stability status
specter browser use <ver>               # Switch active Antidetect version (e.g. 148, lts)
specter browser install [ver]           # Download & install Antidetect Chromium (defaults to 148)
specter browser path                    # Print binary path for CDP automation drivers
specter browser clean                   # Reclaim disk space by purging runtime binaries

# Automa Workflow Engine
specter automa list                     # List locally registered workflows
specter automa run <flow.json>          # Execute workflow headlessly (--headless --timeout 60)
specter automa inspect <flow.json>      # Validate workflow DAG syntax without browser
specter automa studio                   # Launch visual Web Studio in browser

# Synthetic Persona & Identity (Faker)
specter faker card                      # Display rich identity card with valid CCCD
specter faker generate -n 10 -f table   # Generate 10 personas in clean terminal table
specter faker generate -n 100 -f csv -o seed.csv  # Export personas to CSV
specter faker config -d flowup.io.vn    # Update default email domain pool

# Universal & System
specter upgrade                         # Update CLI to latest release via Scoop
specter mcp                             # Start Model Context Protocol (MCP) stdio server
specter shell [scope]                   # Launch interactive REPL directly in target scope
```

## Interactive Scoped REPL

Launch interactive shell: `specter`
```text
specter> use bridge        # Switch to bridge scope
specter(bridge)> start     # Start default VPS bridge
specter(bridge)> back      # Return to root shell
specter> exit              # Exit shell
```

### REPL Shortcuts
| Command / Key | Target / Behavior | Example |
| :--- | :--- | :--- |
| `use <scope>` | Switch active service context | `use bridge`, `use automa`, `use faker` |
| `<scope>` | Direct switch shortcut at Global scope | `bridge`, `automa`, `runner`, `cloud`, `browser`, `faker` |
| `back` / `cd ..` | Return to previous / Global scope | `back` (from `specter(bridge)>` to `specter(global)>`) |
| `exit` / `quit` | Exit sub-scope (or exit CLI if in Global) | `exit` or `Ctrl+D` |
| `clear` / `cls` | Clear terminal screen | `clear` |
| `Tab` | Context-aware autocompletion | Auto-scans workflows in `~/.specter/automa/workflows/` |
| **Prefix Tolerance** | Inside `specter(bridge)>`, both `status` and `bridge status` work identically |

## SSOT 5 Pillars (`~/.specter/`)

All ecosystem data resolves strictly to:
- `~/.specter/system/`: Machine ID (`.machine_id`), device token (`.identity.json`), CLI history.
- `~/.specter/bridge/`: Multi-VPS mesh configuration (`bridge.json`), daemon PIDs (`pids/`).
- `~/.specter/browser/`: Chromium binaries (`runtimes/`), sandboxed profiles (`profiles/`).
- `~/.specter/automa/`: Workflow definitions (`workflows/`), execution DB (`automa.sqlite`).
- `~/.specter/faker/`: Synthetic data schemas (`faker.json`), demographic templates.

## 📖 Full Documentation Portal

Comprehensive installation SOPs, architecture deep-dives, and complete 68-command reference:
👉 **[https://docs.tuquet.com/en/specter/commands/](https://docs.tuquet.com/en/specter/commands/)**

## Boundaries

One-shot report, changes nothing. Do not write flags, alter files, or modify system configuration.

