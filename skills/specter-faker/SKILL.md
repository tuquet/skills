---
name: specter-faker
description: >
  Synthetic persona generator with compliant Vietnamese CCCD validation,
  authentic demographic addresses, credentials, and custom email domain pools.
  Trigger: /specter-faker, "specter faker", "generate user", "fake persona", "cccd generator".
argument-hint: "[generate|card|config] [-n count] [-d domain]"
license: MIT
---

# Specter Synthetic Identity Engine (`specter-faker`)

Zero latency synthetic data generation. Produces demographically valid Vietnamese CCCDs (century, gender, province code algorithm), authentic street addresses, and customized email credentials.

## The Ladder

Check state in order:
1. **Config Setup**: Verify default email domain in `~/.specter/faker/faker.json` (`specter faker config`).
2. **Interactive Inspection**: Preview rich single persona card (`specter faker card`).
3. **Batch Generation**: Export mass personas in CSV, JSON, or table format for account farming pipelines.

## Commands

```powershell
# 1. Inspect or set default email domain
$ErrorActionPreference = 'SilentlyContinue'; specter faker config --show
specter faker config -d flowup.io.vn

# 2. Preview a single persona card in terminal
specter faker card -d flowup.io.vn

# 3. Generate personas in clean terminal table
specter faker generate -n 5 -d flowup.io.vn -f table

# 4. Export batch to CSV for automation accounts
specter faker generate -n 100 -d flowup.io.vn -f csv -o accounts.csv

# 5. Output raw JSON for script piping
specter faker generate -n 1 -f json
```

## Storage Pillar

All schema configurations resolve strictly to `~/.specter/faker/`:
- Configuration: `~/.specter/faker/faker.json`
- Demographic Templates: `~/.specter/faker/templates/`

## Output Contract

Report generation status strictly:
```text
[FAKER] Generated <N> persona(s) | Domain: <domain>
• Nationality: <VN|US|JP> | Format: <table|card|json|csv>
• CCCD Algorithm: Validated (Century, sex, province code)
• Output: <output_file_or_stdout>
Verdict: Persona dataset ready for automation pipelines.
```

## Boundaries

Scope: Synthetic test persona and credential generation only. Does not inject into browser profiles directly (use `/specter-automa`). One-shot execution.
