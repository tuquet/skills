# Tuquet Skills

A collection of [Agent Skills](https://agentskills.io/home) reflecting Tuquet's engineering standards, quality benchmarks, and best practices for AI coding agents.

> [!IMPORTANT]
> This repository hosts curated, battle-tested agent skills for autonomous development workflows across Antigravity, Claude Code, Cursor, and Codex.

## Installation

### Install via Skills CLI (Recommended)

To install all skills from this repository into your current project, run:

```bash
npx skills add tuquet/skills --skill='*'
```

Or install all of them globally for all projects on your machine:

```bash
npx skills add tuquet/skills --skill='*' -g
```

To install an individual skill:

```bash
npx skills add tuquet/skills --skill=ponytail
npx skills add tuquet/skills --skill=review-shadcn-standard
```

---

## Skills

This repository organizes skills by scope, mindset, and domain.

### Tuquet Engineering Standards

Hand-crafted and curated to enforce strict design systems and platform consistency.

| Skill | Description |
|-------|-------------|
| [review-shadcn-standard](skills/review-shadcn-standard) | Audit and migrate frontend UI components across projects to strictly enforce the 72 canonical Shadcn UI components standard. |

### Senior Dev Mindset (Radical Simplicity)

Curated from [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail). Makes your AI agent think like the laziest senior developer in the room—the best code is the code you never wrote.

| Skill | Description |
|-------|-------------|
| [ponytail](skills/ponytail) | Lazy senior dev mode: the smallest change that fully solves the task, written clearly and concisely. |
| [ponytail-review](skills/ponytail-review) | Deep quality review of a change: correctness, safety, load resilience, test coverage, and removing bloat. |
| [ponytail-audit](skills/ponytail-audit) | Quality audit of a whole codebase: bugs, security risks, slow paths, dead code, and safe deletion targets. |
| [ponytail-debt](skills/ponytail-debt) | Track deferred shortcuts and tech debt items across the codebase. |
| [ponytail-gain](skills/ponytail-gain) | Measure code reduction, token economy, and performance savings achieved through simplification. |

### Modern Web Frameworks & Tooling

Curated from [antfu/skills](https://github.com/antfu/skills). Standards for modern TypeScript, Vue Composition API, build tools, and git workflows.

| Skill | Description |
|-------|-------------|
| [vue](skills/vue) | Vue 3 core: Composition API, script setup macros, reactivity, and performance best practices. |
| [vitest](skills/vitest) | Vitest: Fast unit testing framework powered by Vite with Jest-compatible APIs and mocking. |
| [vite](skills/vite) | Vite build tool: Configuration, plugin API, SSR, and library mode. |
| [pnpm](skills/pnpm) | pnpm: Fast, disk-space-efficient package manager, workspaces, and catalog management. |
| [pinia](skills/pinia) | Pinia: Intuitive, type-safe state management for Vue 3 applications. |
| [antfu-create-pr](skills/antfu-create-pr) | Create reviewable PRs with Conventional Commits, evidence-based descriptions, and gh screenshots. |

### Production Engineering & Reliability

Curated from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills). Production-grade engineering runbooks and verification patterns.

| Skill | Description |
|-------|-------------|
| [addy-code-review-and-quality](skills/addy-code-review-and-quality) | Conducts multi-axis code review before merging changes. |
| [addy-browser-testing-with-devtools](skills/addy-browser-testing-with-devtools) | Test in real browsers via Chrome DevTools protocol to inspect DOM, network, and console errors. |
| [addy-performance-optimization](skills/addy-performance-optimization) | Optimize application performance across frontend, backend, queries, and rendering lifecycles. |
| [addy-security-and-hardening](skills/addy-security-and-hardening) | Harden code against vulnerabilities (OWASP Top 10, sanitization, authentication, zero-trust). |
| [addy-frontend-ui-engineering](skills/addy-frontend-ui-engineering) | Build accessible, responsive, production-quality user interfaces meeting WCAG standards. |
| [addy-test-driven-development](skills/addy-test-driven-development) | Drive feature development and bug fixes using the red-green-refactor loop. |
| [addy-debugging-and-error-recovery](skills/addy-debugging-and-error-recovery) | Systematic root-cause debugging for unexpected runtime errors and build failures. |
| [addy-api-and-interface-design](skills/addy-api-and-interface-design) | Design stable, future-proof APIs, module boundaries, and type contracts. |
| [addy-planning-and-task-breakdown](skills/addy-planning-and-task-breakdown) | Break complex engineering requirements into ordered, verifiable atomic tasks. |
| [addy-context-engineering](skills/addy-context-engineering) | Optimize agent context setup, prompt engineering, and rule configurations. |

---

## Submodule Architecture & Synchronization

This repository uses **Git Submodules** in `vendors/` to track upstream repositories directly. This ensures skills stay up-to-date with upstream changes without manual copy-pasting.

- `vendors/addyosmani-agent-skills`: Tracks [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- `vendors/dietrichgebert-ponytail`: Tracks [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)

### Updating Skills from Upstream

To pull the latest upstream revisions and sync curated skills into `skills/`:

```bash
pnpm install
pnpm run sync
```

---

## FAQ

### Why use Agent Skills instead of huge system prompts?

Skills are **on-demand** and **progressive**.

Instead of stuffing thousands of lines of documentation and rules into every agent prompt (which wastes tokens and causes hallucination), skills are discovered dynamically. The agent only loads the full skill when triggered by the relevant task, scaling far beyond what any fixed context window could fit at once.

### Supported Coding Agents

These skills comply with the Open [Agent Skills](https://agentskills.io) specification and work natively with:
- **Google Antigravity** (CLI & IDE)
- **Anthropic Claude Code**
- **Cursor**
- **Windsurf**
- **Codex**
- **Amp** / **Cline** / **Neovate**

---

## License

Skills and curation scripts in this repository are licensed under the [MIT License](LICENSE).
