---
name: tuquet-cloud
description: >
  Manage Tuquet Cloud control plane, device fleet enrollment, and Supabase database migrations.
  Trigger: /tuquet-cloud, "tuquet cloud", "cloud login", "cloud status", "supabase db push".
argument-hint: "[whoami|login|logout|config|db]"
license: MIT
---

# Tuquet Cloud Control Plane (`tuquet-cloud`)

Cloud control plane and fleet enrollment. Authenticates workstations, verifies tenant pairing, and executes remote Supabase migrations via 8118.

## Code & Specification Pointers (Code-as-Docs)

Read native source definitions on demand:
- Enrollment Client: [runner/src/core/enrollment.rs](../../../runner/src/core/enrollment.rs)
- Device Identity: [runner/src/core/identity.rs](../../../runner/src/core/identity.rs)
- Environment Registry: [runner/src/core/environments.rs](../../../runner/src/core/environments.rs)
- Cloud DB Migrations: [cloud/supabase/migrations/](../../../cloud/supabase/migrations/)

## Native Commands

```powershell
# 1. Check enrollment identity & tenant status
tuquet cloud whoami

# 2. Authenticate & enroll workstation into cloud fleet
tuquet cloud login --url https://<project>.supabase.co --token <enrollment_token> --name <device_name>

# 3. Disconnect workstation from cloud fleet
tuquet cloud logout

# 4. View system & cloud endpoint configuration
tuquet cloud config --show

# 5. Remote Supabase DB Migrations (Requires HTTP bridge 8118)
tuquet bridge start my-vps --http
$env:HTTP_PROXY = "http://127.0.0.1:8118"; $env:HTTPS_PROXY = "http://127.0.0.1:8118"
supabase db push
```

## Output Contract

Report status strictly:
```text
[CLOUD] Device ID: <device_id> (<name>)
• Tenant:   <tenant_id> | Endpoint: <cloud_url>
• Session:  <ENROLLED (PROD)|DISCONNECTED>
• Identity: ~/.specter/system/.identity.json
Verdict: Paired with cloud fleet. / Disconnected: run 'tuquet cloud login'.
```

## Boundaries

Scope: Cloud enrollment, identity verification, and Supabase migrations only. Do NOT touch local workflow SQLite (`~/.specter/automa/automa.sqlite`). One-shot execution.
