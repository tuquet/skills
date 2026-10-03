<div align="center">
  <img src="https://tuquet.github.io/icons/skills.svg" width="76" height="76" alt="Skills Logo" />
  <h1>Skills</h1>
  <p><strong>Enterprise AI Coding Agent Tooling, Runbooks &amp; Autonomous Workflows</strong></p>

  <p>
    <a href="https://github.com/tuquet/scoop-bucket"><img src="https://img.shields.io/badge/Scoop-Available-brightgreen.svg" alt="Scoop" /></a>
    <img src="https://img.shields.io/badge/Agent-Google%20Antigravity-blue.svg" alt="Google Antigravity" />
    <img src="https://img.shields.io/badge/CLI-Claude%20Code-orange.svg" alt="Claude Code" />
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" /></a>
  </p>
</div>

---

> **Enterprise AI Coding Agent Tooling, Runbooks & Autonomous Workflows**  
> Curated collection of skills, automation runbooks, and infrastructure optimizations for AI Coding Agents (Google Antigravity, Claude Code, Cursor, Codex).

## 💎 Enterprise Business Value

The solutions in this repository are designed following core software engineering principles: **High ROI**, **Zero-Touch Automation**, **Sandbox Security**, and **KISS & YAGNI** (Keep It Simple, Stupid & You Aren't Gonna Need It):

1. **Operational Cost Reduction & Infinite Quota**:
   - Eliminates 100% of direct API token costs for coding agents by leveraging existing Google Antigravity enterprise OAuth quotas.
   - Saves engineering teams hundreds to thousands of dollars per month while retaining access to premier frontier models (Claude 3.7 Sonnet, Opus 4.6 Thinking, Gemini 3.8 Flash).

2. **System Resource Conservation (Zero RAM Leakage)**:
   - **On-Demand Proxy Lifecycle**: Reverse proxy launches strictly when the developer begins an agent session and **auto-terminates cleanly on exit** (`0MB RAM idle lingering`). No lingering background daemons draining system memory.

3. **CI/CD & Headless Container Readiness**:
   - Bypasses root permission prompts and interactive trust confirmation dialogs (`IS_SANDBOX=1` + `bypassPermissionsModeAccepted`), enabling unattended agent execution in Docker, GitHub Actions runners, Kubernetes pods, and headless Linux servers.

4. **Cross-Platform Zero-Touch Deployment**:
   - Single-command setup across **Linux** servers and fresh **Windows 10/11** developer workstations.
   - Automatically provisions environments, downloads binaries, synchronizes OAuth tokens, and exposes global system commands.

---

## 📚 Skills Catalog

| Skill | Business Value & Technical Features | Platform | Status |
| :--- | :--- | :---: | :---: |
| [**`claude-agy`**](./skills/claude-agy/SKILL.md) | **Claude Code CLI Bridge to Google Antigravity OAuth (`claude-agy`)**:<br>• Zero API token cost via Google Antigravity OAuth.<br>• Automated root permission & trust dialog bypass.<br>• Rate-limit filter mitigating upstream Google Cloud 429 errors.<br>• Intelligent proxy lifecycle (auto-kill on session termination).<br>• Dynamic model discovery via `/model` command (KISS & YAGNI). | 🐧 Linux<br>🪟 Windows 10/11 | ✅ Production Ready |

---

## 🚀 1-Click Installation Guide

### 🌟 Universal 1-File Setup (Cross-Platform: Windows, Linux, macOS)
Since Claude Code CLI requires **Node.js (>= 18)**, install via a **single universal JavaScript script**:

```bash
# Run directly from cloned repo
node skills/claude-agy/scripts/setup.mjs
```

Or install via one-line network execution:
```bash
# Runs natively on Windows (PowerShell/CMD), Linux, and macOS
curl -fsSL https://raw.githubusercontent.com/tuquet/skills/main/skills/claude-agy/scripts/setup.mjs | node
```

---

### 🪟 Windows via Scoop (Recommended for Developers)
If you use [Scoop](https://scoop.sh), this is the cleanest, isolated distribution channel:

```powershell
# 1. Add Tuquet Scoop Bucket
scoop bucket add tuquet https://github.com/tuquet/scoop-bucket

# 2. Install Claude-Agy
scoop install claude-agy
```
*Automatically installs Node.js LTS dependency, configures shims, bypasses trust dialogs, and persists tokens & configurations across version updates (`scoop update claude-agy`).*

---

### 🪟 Windows (Direct PowerShell Script)
Open **PowerShell** and run:
```powershell
irm https://raw.githubusercontent.com/tuquet/skills/main/skills/claude-agy/scripts/setup.ps1 | iex
```

### 🐧 Linux / Ubuntu / Debian / WSL
Open a terminal and run:
```bash
curl -fsSL https://raw.githubusercontent.com/tuquet/skills/main/skills/claude-agy/scripts/setup.sh | bash
```

---

## 🔌 Google Antigravity Integration (Global Skills)

Enable the Google Antigravity AI assistant to automatically discover and execute the `claude-agy` skill across all working sessions:

```bash
mkdir -p ~/.gemini/config/skills
ln -sf ~/Repository/tuquet/skills/skills/claude-agy ~/.gemini/config/skills/claude-agy
```

---

## 💡 Design Philosophy: KISS & YAGNI

The system strictly follows **KISS** (Keep It Simple, Stupid) and **YAGNI** (You Aren't Gonna Need It) principles:
- **Zero Redundant Aliases**: Avoids dozens of phantom alias layers that create configuration drift.
- **Natural Model Discovery**: When running `claude-agy`, simply use `/model` to interactively view and switch between all upstream models provided by Google Antigravity.
- **Engineered for Reliability**: Minimalist configuration retaining only essential parameters (proxy port, 429 quota filters, auth paths).

---

## 🛠️ Contributing New Skills

Standard directory structure for a skill:
```text
skills/<skill-name>/
├── SKILL.md          # Primary instruction with YAML frontmatter (name, description)
├── scripts/          # Automation scripts (setup.sh, setup.ps1, uninstaller)
├── references/       # Architecture documents and technical specs
└── examples/         # Reference implementations and usage patterns
```

---

## 🌐 Ecosystem

Part of the **Automation & Agent Ecosystem**:

- [Automa](https://github.com/tuquet/automa) — Native Chrome/Edge Desktop UI Automation Browser.
- [Runner](https://github.com/tuquet/runner) — High-Performance Distributed Process Supervision Engine in Rust.
- [Browser](https://github.com/tuquet/browser) — High-Performance Headless Web Scraping & Stealth Automation Core.
- [Cloud](https://github.com/tuquet/cloud) — Enterprise Orchestration & Real-time Task Control Plane.
- [CLI](https://github.com/tuquet/cli) — Developer Ergonomic CLI & Unified Command Center.
- [Lib](https://github.com/tuquet/lib) — Monorepo for Shared Enterprise UI & Utilities (`vue-ui`, `vue-table`, `md-export`, `extension-runner`, `lunar`).
- [Scoop Bucket](https://github.com/tuquet/scoop-bucket) — Official Windows Scoop Distribution Channel.

---

## 📄 License

Distributed under the [MIT License](LICENSE).

---

<div align="center">
  <samp>
    <a href="https://tuquet.github.io">Portfolio</a> •
    <a href="https://tuquet.github.io/cv">CV &amp; Resume</a> •
    <a href="https://tuquet.github.io/automa">Automa Studio</a> •
    <a href="https://tuquet.github.io/lib">Component Lab</a> •
    <a href="https://github.com/tuquet/scoop-bucket">Scoop Bucket</a>
  </samp>
</div>
