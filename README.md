<div align="center">
  <img src="https://tuquet.github.io/icons/skills.svg" width="80" height="80" alt="Tuquet Plugin Logo" />
  <h1>Tuquet Master Plugin (`tuquet`)</h1>
  <p><strong>Enterprise AI Coding Agent Tooling, Runbooks &amp; Autonomous Workflows</strong></p>

  <p>
    <a href="https://antigravity.google/"><img src="https://img.shields.io/badge/Agent-Google%20Antigravity-4285F4.svg" alt="Google Antigravity" /></a>
    <a href="https://claude.ai/"><img src="https://img.shields.io/badge/CLI-Claude%20Code-D97706.svg" alt="Claude Code" /></a>
    <a href="https://github.com/tuquet/scoop-bucket"><img src="https://img.shields.io/badge/Scoop-Available-brightgreen.svg" alt="Scoop" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" /></a>
  </p>
</div>

---

## 📌 Tổng Quan (Overview)

`tuquet` là **Master Plugin** chính thức của hệ sinh thái Tuquet dành cho các trợ lý lập trình AI (**Google Antigravity CLI/IDE**, **Anthropic Claude Code CLI**, **Cursor**, **Codex**).

Plugin đóng gói sẵn:
1. **Bộ Skills Chuẩn hóa Atomic (`tuquet-*`)**:
<!-- SKILLS_CATALOG_START -->
   - [**`specter`**](./skills/specter/SKILL.md) (`/specter`): Master orchestrator and platform health dashboard (`specter status`).
   - [**`specter-automa`**](./skills/specter-automa/SKILL.md) (`/specter-automa`): Headless automation runner and visual DAG engine for browser tasks via native CDP and local SQLite store.
   - [**`specter-bot`**](./skills/specter-bot/SKILL.md) (`/specter-bot`): Telegram ChatOps assistant daemon, server health monitoring, and GitHub Actions notification engine.
   - [**`specter-bridge`**](./skills/specter-bridge/SKILL.md) (`/specter-bridge`): Manage network bridge tunnels, SOCKS5 proxy (1080), HTTP adapter (8118), and local SSH (2222).
   - [**`specter-browser`**](./skills/specter-browser/SKILL.md) (`/specter-browser`): Manage Antidetect Chromium runtimes, hardware emulation seeds, profile sandboxes, and proxy routing.
   - [**`specter-cicd`**](./skills/specter-cicd/SKILL.md) (`/specter-cicd`): CI/CD pipeline orchestration, local pre-flight gatekeeping, semantic version tagging, and GitHub Actions budget control.
   - [**`specter-cloud`**](./skills/specter-cloud/SKILL.md) (`/specter-cloud`): Manage Tuquet Cloud control plane, device fleet enrollment, and Supabase database migrations.
   - [**`specter-faker`**](./skills/specter-faker/SKILL.md) (`/specter-faker`): Synthetic persona generator with compliant Vietnamese CCCD validation,.
   - [**`specter-help`**](./skills/specter-help/SKILL.md) (`/specter-help`): Quick-reference card and master cheatsheet for all Tuquet CLI commands, interactive shell scopes,.
   - [**`specter-runner`**](./skills/specter-runner/SKILL.md) (`/specter-runner`): Kernel-level Win32 Job Object supervisor & daemon controller (port 8765).
   - [**`specter-security`**](./skills/specter-security/SKILL.md) (`/specter-security`): Enterprise standard and autonomous runbook for cloud server hardening,.
<!-- SKILLS_CATALOG_END -->
2. **Kiến trúc Quy tắc Tự động & Di động Đa Máy (`rules/AGENTS.md`)**:
   - Tự động nạp quy tắc Single Source of Truth (SSOT tại `~/.specter/`) và guardrail phân luồng mạng (git pull đi thẳng, git push qua proxy) vào mọi phiên làm việc của AI Agent trên bất kỳ máy tính nào mà không cần cấu hình thủ công.

---

## 🚀 Hướng Dẫn Apply Plugin Cho Google Antigravity (`agy`)

Google Antigravity tự động phát hiện và nạp các plugin đặt trong thư mục cấu hình toàn cục `~/.gemini/config/plugins/`.

### 1. Kích hoạt Plugin Toàn cục (Global Activation)
Thư mục plugin này nằm tại:
```
~/.gemini/config/plugins/tuquet/
├── plugin.json       # Manifest định danh plugin ("name": "tuquet")
├── rules/
│   └── AGENTS.md     # Quy tắc kiến trúc SSOT tự động nạp vào mọi phiên làm việc
├── scripts/
│   └── link.mjs      # Công cụ đồng bộ cho Claude Code / Cursor
└── skills/
    ├── tuquet/SKILL.md
    ├── tuquet-automa/SKILL.md
    ├── tuquet-bot/SKILL.md
    ├── tuquet-bridge/SKILL.md
    ├── tuquet-browser/SKILL.md
    ├── tuquet-cicd/SKILL.md
    ├── tuquet-cloud/SKILL.md
    ├── tuquet-faker/SKILL.md
    ├── tuquet-help/SKILL.md
    ├── tuquet-runner/SKILL.md
    └── tuquet-security/SKILL.md
```

#### Quản lý bằng lệnh Antigravity CLI (`agy`):
```powershell
# Liệt kê danh sách plugin đã cài đặt
agy plugin list

# Bật plugin nếu đang ở trạng thái tắt
agy plugin enable tuquet

# Kiểm tra trạng thái plugin
agy plugin status tuquet
```

> [!NOTE]
> Mặc định trong Antigravity, mọi plugin nằm trong `~/.gemini/config/plugins/` đều được **bật tự động (enabled by default)** trừ khi được cấu hình `"disabled": true` trong `config.json`.

---

### 2. Cài đặt trên máy tính mới (Multi-PC Universal Setup)
Khi chuyển sang một máy tính mới, chỉ cần chạy 1 lệnh duy nhất để tự động thiết lập toàn bộ hệ sinh thái Skills, Plugins và Native MCP Server cho tất cả Agent (Antigravity, Claude Code, Cursor):

```bash
# Clone repository skills:
git clone https://github.com/tuquet/skills.git
cd skills

# Chạy lệnh thiết lập toàn diện tự động (Zero Dependency):
pnpm setup   # Hoặc: npm run setup / node scripts/setup.mjs
```

**Quá trình trên sẽ tự động thực hiện:**
1. **Gemini / Antigravity Plugins**: Liên kết plugin `tuquet` & `specter` vào `~/.gemini/config/plugins/`.
2. **Addy Osmani Agent Skills**: Tự động clone & kích hoạt plugin `agent-skills` (25 production skills và các custom command `/review`, `/ship`, `/spec`,...).
3. **Specter MCP Server**: Đăng ký MCP server `specter` vào `~/.gemini/config/mcp_config.json`.
4. **Specter MCP Schemas**: Cài đặt 9 schema công cụ (`specter_*`) vào `~/.gemini/antigravity/mcp/specter/`.
5. **Universal Agent Linking**: Đồng bộ toàn bộ skills sang `~/.gemini/config/skills/`, `~/.claude/skills/`, `~/.cursor/skills/`, và `~/.agents/skills/`.

---

### 3. Cách Antigravity Thực Thi Skills & Rules
- **Tự động áp dụng Rules**: File `rules/AGENTS.md` đi kèm plugin sẽ được nạp trực tiếp vào ngữ cảnh của Agent, đảm bảo mọi thao tác đọc/ghi file và gọi lệnh tuân thủ 100% chuẩn SSOT `~/.specter/`.
- **Cơ chế Progressive Disclosure**: Antigravity không nhồi nhét toàn bộ nội dung skill vào context ngay từ đầu để tiết kiệm token. Hệ thống chỉ nạp `name` và `description`. Khi bạn đưa ra yêu cầu liên quan (ví dụ: *"check bridge status"*, *"chạy workflow automa"*), agent sẽ tự động kích hoạt skill tương ứng.

---

## 🚀 Hướng Dẫn Apply Plugin Cho Claude Code CLI (`claude`)

Anthropic Claude Code CLI hỗ trợ nạp custom skills thông qua thư mục `~/.claude/skills/` (toàn cục) hoặc `.claude/skills/` (theo dự án). Thư mục `tuquet` đã tích hợp sẵn công cụ phân phối tự động không phụ thuộc bên ngoài (`scripts/link.mjs`).

---

### 1. Link Toàn Cục Vào Claude Code (Global Link)
Mở PowerShell hoặc Bash tại thư mục plugin và chạy:

```powershell
# Link toàn bộ skills của Tuquet vào Claude Code (~/.claude/skills/)
node scripts/link.mjs --agent claude --global
```

*Trên Windows, script tự động tạo các NTFS Junction point mà không cần cấp quyền Administrator.*

Kiểm tra thư mục đích sau khi link:
```
~/.claude/skills/
├── tuquet/SKILL.md
└── tuquet-security/SKILL.md
```

---

### 2. Link Vào Riêng Một Dự Án (Project-Scoped Link)
Để chỉ cấp quyền cho một thư mục dự án làm việc cụ thể:

```powershell
# Link toàn bộ skills vào thư mục dự án
node scripts/link.mjs --agent claude --project C:\path\to\your-project

# Hoặc chỉ link riêng lẻ skill 'tuquet':
node scripts/link.mjs --agent claude --project C:\path\to\your-project --skill tuquet
```

---

## 🛠️ Chi Tiết Lệnh Công Cụ Linker (`scripts/link.mjs`)

Script `scripts/link.mjs` hỗ trợ đồng bộ đa nền tảng cho nhiều coding agent:

| Tùy chọn (Flag) | Mô tả ngắn |
| :--- | :--- |
| `-g`, `--global` | Link vào cấu hình toàn cục (`~/.gemini/config/skills`, `~/.claude/skills`, `~/.agents/skills`) |
| `-p`, `--project [dir]` | Link vào thư mục dự án hiện tại hoặc đường dẫn chỉ định |
| `-a`, `--agent <list>` | Chỉ định agent đích: `antigravity`, `claude`, `cursor`, `agents`, hoặc `all` |
| `-s`, `--skill <name>` | Chỉ định chính xác 1 hoặc nhiều skill cần link (ví dụ: `--skill tuquet`) |
| `-u`, `--unlink` | Gỡ bỏ symlink/junction đã tạo |
| `-l`, `--list` | Liệt kê toàn bộ skills sẵn có trong plugin |
| `--copy` | Copy file trực tiếp thay vì tạo symlink/junction |

### Ví dụ Thực Tế:
```powershell
# 1. Liệt kê skills sẵn có:
node scripts/link.mjs --list

# 2. Link cho cả Antigravity và Claude cùng lúc:
node scripts/link.mjs --agent antigravity,claude --global

# 3. Gỡ liên kết sạch sẽ khi không sử dụng:
node scripts/link.mjs --agent claude --unlink --global
```

---

## 📚 Danh Mục Skills Trong Plugin

| Skill | Module Code | Khả Năng & Kịch Bản Sử Dụng |
| :--- | :---: | :--- |
| [**`tuquet`**](./skills/tuquet/SKILL.md) | `cli/` | Master orchestrator, platform health dashboard (`tuquet status`) và interactive shell. |
| [**`tuquet-automa`**](./skills/tuquet-automa/SKILL.md) | `automa/` | Headless visual DAG engine, kiểm tra workflows JSON và SQLite local store. |
| [**`tuquet-bot`**](./skills/tuquet-bot/SKILL.md) | `bot/` | Telegram ChatOps daemon lifecycle, giám sát tài nguyên VPS, và GitHub Actions alerts. |
| [**`tuquet-bridge`**](./skills/tuquet-bridge/SKILL.md) | `cli/` | Điều khiển mesh tunnel đa VPS, proxy SOCKS5 (1080), HTTP (8118) và phân luồng Git. |
| [**`tuquet-browser`**](./skills/tuquet-browser/SKILL.md) | `browser/` | Quản lý Chromium LTS runtime, profile sandboxing cô lập và anti-detect defenses. |
| [**`tuquet-cloud`**](./skills/tuquet-cloud/SKILL.md) | `cloud/` | Điều phối cloud control plane, fleet device enrollment và Supabase migrations. |
| [**`tuquet-faker`**](./skills/tuquet-faker/SKILL.md) | `faker/` | Sinh dữ liệu danh tính mẫu (Mock Persona), định danh thuật toán Modulo 11 và email pool. |
| [**`tuquet-cicd`**](./skills/tuquet-cicd/SKILL.md) | Standard | Điều phối pipeline CI/CD, gatekeeper kiểm thử cục bộ và tối ưu hóa thời gian build. |
| [**`tuquet-runner`**](./skills/tuquet-runner/SKILL.md) | `runner/` | Giám sát tiến trình daemon nền cổng 8765, cam kết Zero-Zombie qua Win32 Job Object. |
| [**`tuquet-security`**](./skills/tuquet-security/SKILL.md) | Security | Hardening máy chủ, Zero-Trust network offloading và tự động phòng ngừa tràn ổ cứng. |
| [**`tuquet-help`**](./skills/tuquet-help/SKILL.md) | Help | Tra cứu nhanh cheatsheet toàn bộ lệnh CLI và 5 Pillars microservice SSOT. |
| [**`herdr`**](./herdr/SKILL.md) | Agent Runtime | Terminal multiplexer cho AI Agent: điều khiển layout workspace/tab/pane và giám sát lifecycle (`idle`, `working`, `blocked`, `done`). |

### 🖥️ Kỹ Năng Terminal Multiplexer & Agent Runtime (`herdr`)

Tài liệu hướng dẫn chi tiết tại [📖 `skills/herdr/SKILL.md`](./herdr/SKILL.md).

`herdr` biến AI Coding Agent thành bộ điều khiển Terminal Multiplexer chuyên sâu:
- **Tổ chức Layout Đa Nhiệm**: Điều phối terminals thành `workspace`, `tab`, và `pane`. Hỗ trợ chia tách màn hình, gửi lệnh stdin, đọc stdout và kiểm tra tiến trình nền độc lập.
- **Giám sát Trạng thái Vòng Đời Agent**: Phân tích chính xác trạng thái của agent chạy trong pane (`idle`, `working`, `blocked`, `done`, `unknown`), cho phép phối hợp nhiều agent cùng lúc mà không bị nghẽn lệnh.
- **Guardrail An Toàn Tuyệt Đối**: Tự động xác thực biến môi trường `HERDR_ENV=1` trước khi điều khiển; chỉ kích hoạt khi người dùng chỉ định rõ ràng nhằm tránh rủi ro xung đột terminal ngoài ý muốn.

---

## 📄 License
Phát hành theo giấy phép **[MIT License](LICENSE)**.
