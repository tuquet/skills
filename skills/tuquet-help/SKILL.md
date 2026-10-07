---
name: tuquet-help
description: >
  Quick-reference card and master cheatsheet for all Tuquet CLI commands, interactive shell scopes,
  and canonical SSOT microservice pillars under ~/.specter/. One-shot display.
  Trigger: /tuquet-help, "tuquet help", "what tuquet commands", "how do I use tuquet", "tuquet cheatsheet".
argument-hint: ""
license: MIT
---

# Tuquet Master Cheatsheet & Help Card (`tuquet-help`)

One card. Zero fluff. All commands, interactive REPL scopes, and SSOT pillars. Display this reference card when invoked. One-shot, changes nothing.

## Available Skills (All 5 Pillars Covered)

<!-- SKILLS_CATALOG_START -->
| Skill | Trigger | Argument Hint | Scope & Purpose |
| :--- | :--- | :--- | :--- |
| **tuquet** | `/tuquet` | `[status\|dashboard]` | Master orchestrator and platform health dashboard (`tuquet status`). |
| **tuquet-automa** | `/tuquet-automa` | `[run\|list\|inspect\|studio] [workflow.json]` | Headless automation runner and visual DAG engine for browser tasks via native CDP and local SQLite store. |
| **tuquet-bot** | `/tuquet-bot` | `[status\|logs\|restart\|test\|run\|deploy]` | Telegram ChatOps assistant daemon, server health monitoring, and GitHub Actions notification engine. |
| **tuquet-bridge** | `/tuquet-bridge` | `[status\|start\|stop\|deploy\|check] [server]` | Manage network bridge tunnels, SOCKS5 proxy (1080), HTTP adapter (8118), and local SSH (2222). |
| **tuquet-browser** | `/tuquet-browser` | `[status\|install\|list\|use\|clean\|path]` | Manage Antidetect Chromium runtimes, hardware emulation seeds, profile sandboxes, and proxy routing. |
| **tuquet-cicd** | `/tuquet-cicd` | `[preflight\|plan\|tag\|status\|dispatch] [repo] [version]` | CI/CD pipeline orchestration, local pre-flight gatekeeping, semantic version tagging, and GitHub Actions budget control. |
| **tuquet-cloud** | `/tuquet-cloud` | `[whoami\|login\|logout\|config\|db]` | Manage Tuquet Cloud control plane, device fleet enrollment, and Supabase database migrations. |
| **tuquet-faker** | `/tuquet-faker` | `[generate\|card\|config] [-n count] [-d domain]` | Synthetic persona generator with compliant Vietnamese CCCD validation,. |
| **tuquet-help** | `/tuquet-help` | *(None)* | Quick-reference card and master cheatsheet for all Tuquet CLI commands, interactive shell scopes,. |
| **tuquet-runner** | `/tuquet-runner` | `[status\|start\|stop\|restart\|logs\|probe]` | Kernel-level Win32 Job Object supervisor & daemon controller (port 8765). |
| **tuquet-security** | `/tuquet-security` | `[audit\|harden\|check-ports]` | Enterprise standard and autonomous runbook for cloud server hardening,. |
<!-- SKILLS_CATALOG_END -->

## CLI Cheatsheet

```powershell
# Health, Diagnostics & Dependencies
tuquet doctor                          # Full dependency check (Scoop, Cloudflared, SSH, Antidetect Chromium)
tuquet status                          # Holistic ecosystem health dashboard (Cloud, Bridge, Browser, Runner)

# Cloud Control Plane & Fleet Pairing
tuquet cloud whoami                    # Inspect paired device identity & tenant
tuquet cloud login --name "Node-1"     # Pair workstation with Tuquet Cloud fleet
supabase db push                       # Apply remote schema migrations (requires bridge --http)

# Network Bridge & Tunnels
tuquet bridge status                   # Check active tunnels & ports (1080, 8118, 2222)
tuquet bridge start [server]           # Start SOCKS5 proxy on 127.0.0.1:1080
tuquet bridge start [server] --http    # Start with embedded HTTP adapter (8118)
tuquet bridge stop [server | all]      # Terminate active tunnels cleanly
tuquet bridge check                    # Validate bridge.json schema against conflicts

# Process Supervisor & Daemon (Port 8765)
tuquet runner status                   # Check worker daemon on port 8765
tuquet runner start -d                 # Spawn background worker daemon (Detached Process)
tuquet runner logs -f                  # Stream worker execution traces in real-time
tuquet runner stop                     # Gracefully terminate supervisor & child process tree
tuquet runner probe                    # Query hardware specs and driver capabilities

# Antidetect Chromium Runtime
tuquet browser status                  # Inspect Antidetect engine, active version & path
tuquet browser list                    # List installed versions with active badge (148, LTS)
tuquet browser search                  # Query upstream manifest releases & stability status
tuquet browser use <ver>               # Switch active Antidetect version (e.g. 148, lts)
tuquet browser install [ver]           # Download & install Antidetect Chromium (defaults to 148)
tuquet browser path                    # Print binary path for CDP automation drivers
tuquet browser clean                   # Reclaim disk space by purging runtime binaries

# Automa Workflow Engine
tuquet automa list                     # List locally registered workflows
tuquet automa run <flow.json>          # Execute workflow headlessly (--headless --timeout 60)
tuquet automa inspect <flow.json>      # Validate workflow DAG syntax without browser
tuquet automa studio                   # Launch visual Web Studio in browser

# Synthetic Persona & Identity (Faker)
tuquet faker card                      # Display rich identity card with valid CCCD
tuquet faker generate -n 10 -f table   # Generate 10 personas in clean terminal table
tuquet faker generate -n 100 -f csv -o seed.csv  # Export personas to CSV
tuquet faker config -d flowup.io.vn    # Update default email domain pool

# Universal & System
tuquet upgrade                         # Update CLI to latest release via Scoop
tuquet mcp                             # Start Model Context Protocol (MCP) stdio server
tuquet shell [scope]                   # Launch interactive REPL directly in target scope
```

## Interactive Scoped REPL

Launch interactive shell: `tuquet`
```text
tuquet> use bridge        # Switch to bridge scope
tuquet(bridge)> start     # Start default VPS bridge
tuquet(bridge)> back      # Return to root shell
tuquet> exit              # Exit shell
```

### REPL Shortcuts
| Command / Key | Target / Behavior | Example |
| :--- | :--- | :--- |
| `use <scope>` | Switch active service context | `use bridge`, `use automa`, `use faker` |
| `<scope>` | Direct switch shortcut at Global scope | `bridge`, `automa`, `runner`, `cloud`, `browser`, `faker` |
| `back` / `cd ..` | Return to previous / Global scope | `back` (from `tuquet(bridge)>` to `tuquet(global)>`) |
| `exit` / `quit` | Exit sub-scope (or exit CLI if in Global) | `exit` or `Ctrl+D` |
| `clear` / `cls` | Clear terminal screen | `clear` |
| `Tab` | Context-aware autocompletion | Auto-scans workflows in `~/.specter/automa/workflows/` |
| **Prefix Tolerance** | Inside `tuquet(bridge)>`, both `status` and `bridge status` work identically |

## SSOT 5 Pillars (`~/.specter/`)

All ecosystem data resolves strictly to:
- `~/.specter/system/`: Machine ID (`.machine_id`), device token (`.identity.json`), CLI history.
- `~/.specter/bridge/`: Multi-VPS mesh configuration (`bridge.json`), daemon PIDs (`pids/`).
- `~/.specter/browser/`: Chromium binaries (`runtimes/`), sandboxed profiles (`profiles/`).
- `~/.specter/automa/`: Workflow definitions (`workflows/`), execution DB (`automa.sqlite`).
- `~/.specter/faker/`: Synthetic data schemas (`faker.json`), demographic templates.

## Boundaries

One-shot report, changes nothing. Do not write flags, alter files, or modify system configuration.
