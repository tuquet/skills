<div align="center">
  <img src="https://tuquet.com/icons/skills.svg" width="76" height="76" alt="Skills Logo" />
  <h1>Specter Skills (`tuquet`)</h1>
  <p><strong>Standardized AI Agent Tooling, Runbooks & Model Context Protocol (MCP) Skills</strong></p>

  <p>
    <a href="https://specter.tuquet.com/skills/"><img src="https://img.shields.io/badge/Docs-VitePress%20Hub-blue.svg" alt="Documentation Hub" /></a>
    <a href="https://github.com/tuquet/scoop-bucket"><img src="https://img.shields.io/badge/Scoop-specter-brightgreen.svg" alt="Scoop" /></a>
    <a href="https://antigravity.google/"><img src="https://img.shields.io/badge/Agent-Google%20Antigravity-4285F4.svg" alt="Google Antigravity" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" /></a>
  </p>

  <p>
    <strong><a href="https://specter.tuquet.com/skills/">📖 Đọc toàn bộ tài liệu kỹ thuật tại Documentation Hub &rarr;</a></strong>
  </p>
</div>

---

## 📌 Tổng Quan (Overview)

**Specter Skills** là bộ kỹ năng (Skills & MCP Tools) chuẩn hóa dành riêng cho các trợ lý trí tuệ nhân tạo (Google Antigravity CLI/IDE, Anthropic Claude Code, Cursor, Codex). Bộ plugin cung cấp các hợp đồng thực thi tất định, giúp AI Agent tự động vận hành toàn bộ hạ tầng trình duyệt tàng hình, giám sát daemon, thiết lập proxy và giải phóng thao tác thủ công.

* **11 Atomic Skills**: `/specter`, `/specter-browser`, `/specter-runner`, `/specter-automa`, `/specter-bridge`, `/specter-faker`, `/specter-cloud`, `/specter-security`, v.v.
* **Auto-Injected Rules (`rules/AGENTS.md`)**: Tự động áp dụng quy tắc SSOT (`~/.specter/`) và guardrail mạng cho mọi phiên làm việc của AI Agent.

## ⚡ Cài Đặt Nhanh Cho AI Agent

```bash
# Plugin được tự động nhận diện tại thư mục cấu hình toàn cục:
~/.gemini/config/plugins/tuquet/
```

## 📚 Tài Liệu Kỹ Thuật Tập Trung (SSOT)

Toàn bộ danh mục 11 Skills, giao thức MCP Server, hướng dẫn tích hợp Antigravity/Claude Code và quy tắc vận hành được bảo trì duy nhất tại Documentation Hub:

👉 **[https://specter.tuquet.com/skills/](https://specter.tuquet.com/skills/)**
