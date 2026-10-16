# Implementation Plan: `review-shadcn-standard` Skill

## 1. Major Components & Dependencies
1. **Reference Matrix (`skills/review-shadcn-standard/references/component-migration-matrix.md`)**:
   - Đóng vai trò SSOT tra cứu chi tiết cho toàn bộ **72 Shadcn Standard Components**.
   - Mỗi component định nghĩa: Tên chuẩn, Sub-components chuẩn, Dấu hiệu nhận diện code tự chế (Anti-patterns / Raw HTML), Trạng thái có sẵn trong `@tuquet/vue-ui` vs `@vben-core/shadcn-ui`, và Mẫu thay thế chuẩn.
2. **Core Skill (`skills/review-shadcn-standard/SKILL.md`)**:
   - Phụ thuộc vào `component-migration-matrix.md` và `rules/TYPOGRAPHY.md`.
   - Chứa Frontmatter kích hoạt tự động khi gõ `review`, `/review-shadcn-standard`, `"review ui"`, `"review shadcn"`.
   - Quy định quy trình **Two-Step Review Gate**: Quét & Xuất bảng báo cáo kiểm định trước -> Dừng chờ lệnh `proceed` -> Thực thi Migration.
   - Quy định giao thức **`[THIẾU PRIMITIVE]`**: Báo cáo và hỏi ý kiến người dùng trước khi thêm/port primitive chưa có trong package hiện tại.
3. **Global Rules & Symlink Integration (`rules/AGENTS.md`, `scripts/link.mjs`)**:
   - Cập nhật `rules/AGENTS.md` để neo quy tắc kích hoạt `review-shadcn-standard` mỗi khi người dùng yêu cầu `review` UI/component.
   - Chạy `node scripts/link.mjs --global --skill review-shadcn-standard` để gắn symlink vào `~/.gemini/config/skills/`, `~/.claude/skills/`, `~/.cursor/skills/`, `~/.agents/skills/`.

## 2. Implementation Order
```text
[1. component-migration-matrix.md] ──→ [2. SKILL.md] ──→ [3. rules/AGENTS.md] ──→ [4. Global Symlink & Verification]
```

## 3. Risks & Mitigations
- **Rủi ro 1:** Danh sách 72 components lớn, dễ bị sót hoặc nhầm lẫn giữa primitive có sẵn trong `@vben-core/shadcn-ui` (37 components) và `@tuquet/vue-ui` (58 components).
  - *Giảm thiểu:* Liệt kê chính xác cả 72 components đánh số từ 1 đến 72 và ghi rõ trạng thái sẵn có trong từng package để Agent nhận biết ngay khi nào cần gắn nhãn `[THIẾU PRIMITIVE]`.
- **Rủi ro 2:** Agent tự ý sửa code ngay khi người dùng mới gõ `review`.
  - *Giảm thiểu:* Thiết lập quy tắc cứng trong `SKILL.md` (`## The Invariants` và `## Boundaries`): Bước 1 chỉ quét và in bảng báo cáo, bắt buộc dừng lượt chờ người dùng xác nhận `proceed`.
