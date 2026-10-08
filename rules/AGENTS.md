# Tuquet Repository Architectural Rules

## Single Source of Truth (SSOT) & Microservice Pillars Architecture
- **Single Canonical Root:** All Tuquet ecosystem services, data, runtimes, and local storage MUST resolve to a single canonical root: `~/.specter/`.
- **Modular Microservice Pillars Layout:** Storage under `~/.specter/` is strictly organized into dedicated microservice domains:
  - `~/.specter/system/`: Machine identity (`.machine_id`, `.identity.json`), CLI history (`history.txt`), update cache (`update_check.json`), credentials.
  - `~/.specter/automa/`: Workflow definitions (`workflows/*.json`), execution database (`automa.sqlite`), runner daemon data.
  - `~/.specter/browser/`: Dedicated Chromium runtimes (`runtimes/chromium-win64`), browser profiles (`profiles/`), extensions (`extensions/ublock`).
  - `~/.specter/bridge/`: Multi-VPS mesh configuration (`bridge.json`), background daemon PIDs (`pids/<server>.json`), proxy configurations.
  - `~/.specter/faker/`: Faker schema generator definitions, mock templates (`faker.json`).
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

## Quality Bar & Engineering Constraints
- Read `CONSTRAINTS.md` before writing code. Do not weaken it to make a change pass.
- Prohibit running `cargo build --release` on VPS; keep disk usage ≤ 85% and run `cargo clean` post-test.
