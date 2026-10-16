# Task Breakdown: `review-shadcn-standard` Skill

- [x] Task 1: Tạo bảng đối chiếu 72 Shadcn Components (`references/component-migration-matrix.md`)
  - Acceptance: Đầy đủ 72/72 components theo danh sách yêu cầu, có cột Sub-components, Dấu hiệu Anti-pattern tự chế, Trạng thái package (`@tuquet/vue-ui`, `@vben-core/shadcn-ui`), và Hướng dẫn migrate.
  - Verify: Kiểm tra số lượng đủ 72 mục và không chứa đường dẫn tuyệt đối của máy trạm.
  - Files: `skills/review-shadcn-standard/references/component-migration-matrix.md`

- [x] Task 2: Khởi tạo file kỹ năng chính (`skills/review-shadcn-standard/SKILL.md`)
  - Acceptance: Có YAML frontmatter chuẩn Ponytail Standard, trigger cho `review` và `/review-shadcn-standard`, quy trình 2 bước (Báo cáo trước -> Chờ `proceed` -> Migrate), quy tắc báo cáo `[THIẾU PRIMITIVE]` hỏi ý kiến trước khi thêm primitive mới, bộ lệnh quét tĩnh, và Deterministic Output Contract.
  - Verify: Kiểm tra cú pháp frontmatter và đầy đủ 72 components.
  - Files: `skills/review-shadcn-standard/SKILL.md`

- [x] Task 3: Cập nhật quy tắc toàn cục (`rules/AGENTS.md`) và gắn Symlink (`scripts/link.mjs`)
  - Acceptance: `rules/AGENTS.md` ghi nhận quy tắc Shadcn 72-Component Standard Review Gate; chạy `node scripts/link.mjs --global --skill review-shadcn-standard` thành công.
  - Verify: Chạy `node scripts/link.mjs --list` và kiểm tra file symlink tồn tại.
  - Files: `rules/AGENTS.md`
