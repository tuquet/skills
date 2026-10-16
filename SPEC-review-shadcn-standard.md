# Spec: Kỹ năng `review-shadcn-standard` — Kiểm định & Chuẩn hóa 72 Thành phần Shadcn UI

## Objective
Xây dựng kỹ năng AI Agent chuyên biệt mang tên **`review-shadcn-standard`** (`skills/review-shadcn-standard/SKILL.md`) trong hệ sinh thái `tuquet/skills`.

Mục tiêu cốt lõi:
1. **Tự động kích hoạt khi Review**: Mỗi khi người dùng gõ lệnh `review`, `/review-shadcn-standard`, `"review ui"`, `"review shadcn"`, `"audit components"`, hoặc yêu cầu rà soát giao diện, Agent sẽ tự động quét toàn bộ các component trong dự án frontend (`tuquet/admin`, `tuquet/lib`, `tuquet/automa`, `tuquet/tuquet.com`).
2. **Chuẩn hóa tuyệt đối theo Danh mục 72 Shadcn Components**: Đảm bảo mọi thành phần UI đều sử dụng đúng primitive/component chuẩn của Shadcn (`@vben-core/shadcn-ui` hoặc `@tuquet/vue-ui`) thay vì thẻ HTML thô được style thủ công hoặc component tự chế (custom ad-hoc components).
3. **Phát hiện & Lập kế hoạch/Thực thi Migration**: Phát hiện mọi component đang tự customize (ví dụ: modal tự dựng bằng `<div class="fixed inset-0">`, input search tự vẽ viền xung đột, bảng HTML `<table>` thuần, badge/button/tabs/tooltip/dropdown tự code CSS, hoặc hộp thoại tìm kiếm không dùng `Command`) và yêu cầu/thực hiện migration sang đúng 1 trong 72 chuẩn Shadcn tương ứng.

---

## Danh mục 72 Shadcn Standard Components (Canonical Registry)

Kỹ năng kiểm định và đối chiếu nghiêm ngặt theo 72 thành phần chuẩn được phân thành 7 nhóm chức năng:

| Nhóm | Danh sách Components chuẩn (72 Components) |
| :--- | :--- |
| **1. Layout & Surfaces (9)** | `Accordion`, `Aspect Ratio`, `Card`, `Collapsible`, `Item`, `Resizable`, `Scroll Area`, `Separator`, `Sidebar` |
| **2. Overlays, Modals & Menus (11)** | `Alert Dialog`, `Command`, `Context Menu`, `Dialog`, `Drawer`, `Dropdown Menu`, `Hover Card`, `Menubar`, `Navigation Menu`, `Popover`, `Sheet` |
| **3. Forms & Inputs (20)** | `Button`, `Button Group`, `Calendar`, `Checkbox`, `Combobox`, `Date Picker`, `Field`, `Form`, `Input`, `Input Group`, `Input OTP`, `Label`, `Native Select`, `Number Field`, `Pin Input`, `Radio Group`, `Range Calendar`, `Select`, `Slider`, `Switch`, `Tags Input`, `Textarea`, `Toggle`, `Toggle Group` |
| **4. Data Display & Navigation (11)** | `Avatar`, `Badge`, `Breadcrumb`, `Carousel`, `Chart`, `Data Table`, `Empty`, `Kbd`, `Pagination`, `Stepper`, `Table`, `Tabs`, `Typography` |
| **5. Feedback & Status (7)** | `Alert`, `Progress`, `Skeleton`, `Sonner`, `Spinner`, `Toast`, `Tooltip` |
| **6. AI, Chat & Conversational UI (9)** | `Attachment`, `Bubble`, `Code Block`, `Marker`, `Message`, `Message Scroller`, `Questionnaire`, `Trace` |

*(Tổng cộng đầy đủ 72 thành phần theo danh sách yêu cầu).*

---

## Tech Stack
- **Agent Skill Specification:** Antigravity / Claude Code / Agent Skills `SKILL.md` (YAML frontmatter + Staccato Markdown directives + Deterministic Output Contract).
- **Target Frontend Stack:** Vue 3.5+ (`<script setup lang="ts">`), Reka UI (`reka-ui`), Tailwind CSS v4, `@vben-core/shadcn-ui` (`admin/packages/@core/ui-kit/shadcn-ui`), `@tuquet/vue-ui` (`lib/packages/vue-ui`).
- **Static Analysis & Linting:** `git grep` / `ripgrep`, `oxlint`, `oxfmt`, `vue-tsc`.
- **Skill Distribution:** `node scripts/link.mjs --global` & `node scripts/generate-catalog.mjs` trong repo `tuquet/skills`.

---

## Commands
```bash
# 1. Kiểm tra danh sách skills hiện có và tạo liên kết (symlink/junction) toàn cục
node scripts/link.mjs --list
node scripts/link.mjs --global --skill review-shadcn-standard

# 2. Quét phát hiện các anti-pattern tự customize UI trong dự án (ví dụ trên tuquet/admin)
git -C ../admin grep -n "<table" apps/web-admin/src/ packages/
git -C ../admin grep -n "<select" apps/web-admin/src/ packages/
git -C ../admin grep -n "<input" apps/web-admin/src/ packages/
git -C ../admin grep -n "<textarea" apps/web-admin/src/ packages/
git -C ../admin grep -n "<kbd" apps/web-admin/src/ packages/

# 3. Kiểm tra kiểu dữ liệu (Typecheck) và Lint sau khi migrate sang Shadcn
pnpm --dir ../admin run check:type
npx --prefix ../admin oxlint ../admin/apps/web-admin/src/
```

---

## Project Structure
```text
skills/
├── SPEC-review-shadcn-standard.md              # Tài liệu đặc tả kỹ thuật (file này)
├── rules/
│   ├── AGENTS.md                               # Quy tắc kiến trúc toàn cục (cập nhật tham chiếu skill)
│   └── TYPOGRAPHY.md                           # Quy chuẩn Typography đối chiếu với component Typography
├── scripts/
│   ├── generate-catalog.mjs                    # Script đồng bộ danh mục skill
│   └── link.mjs                                # Công cụ gắn symlink vào ~/.gemini/config/skills
└── skills/
    └── review-shadcn-standard/
        ├── SKILL.md                            # Nội dung chính của skill review-shadcn-standard
        └── references/
            └── component-migration-matrix.md   # Bảng ánh xạ chi tiết 72 components: Dấu hiệu tự chế -> Cách migrate chuẩn
```

---

## Code Style & Detection/Migration Blueprint

### 1. YAML Frontmatter của `SKILL.md`
```yaml
---
name: review-shadcn-standard
description: >
  Audit and migrate frontend UI components to strictly enforce the 72 canonical Shadcn UI components standard.
  Detects ad-hoc HTML primitives, custom-styled widgets, and non-standard overrides, and migrates them to official Shadcn primitives.
  Trigger: /review-shadcn-standard, "review", "review ui", "review shadcn", "shadcn standard", "audit shadcn", "migrate shadcn", "review component".
  Do NOT use for backend Rust/SQL code reviews without UI components.
argument-hint: "[audit|migrate|check] [target-path] [--component <name>]"
license: MIT
---
```

### 2. Mẫu phát hiện Custom UI & Migration sang Shadcn (Before vs. After)

**Before (Vi phạm — Tự customize Search Modal, Input thô & Kbd thô):**
```vue
<!-- ❌ Anti-pattern: Tự dùng <input> thô với border xung đột, tự vẽ phím tắt bằng <kbd> và div rời rạc -->
<div class="flex items-center">
  <Search class="mr-2 size-4 text-muted-foreground" />
  <input
    v-model="keyword"
    class="w-[80%] rounded-md border border-none p-2 pl-0 text-sm"
  />
</div>
<span class="rounded-sm border bg-background px-1.5 py-1 text-xs">
  Ctrl <kbd>K</kbd>
</span>
```

**After (Chuẩn hóa Shadcn — Dùng `Command` / `InputGroup` và `Kbd`):**
```vue
<!-- ✅ Chuẩn Shadcn: Sử dụng CommandDialog / CommandInput / Kbd chuẩn từ thư viện UI -->
<script setup lang="ts">
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Kbd,
} from '@tuquet/vue-ui';
</script>

<template>
  <CommandDialog v-model:open="open">
    <CommandInput v-model="keyword" :placeholder="$t('ui.widgets.search.searchNavigate')" />
    <CommandList>
      <CommandEmpty>{{ $t('ui.widgets.search.noRecent') }}</CommandEmpty>
      <CommandGroup :heading="$t('ui.widgets.search.recent')">
        <CommandItem v-for="item in results" :key="item.path" :value="item.name">
          <span>{{ item.name }}</span>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
  <Kbd>Ctrl K</Kbd>
</template>
```

### 3. Định dạng Báo cáo Kiểm định Bắt buộc (Deterministic Output Contract)
Mỗi lần chạy review, Agent phải xuất bảng báo cáo chuẩn:

| File & Dòng | Thành phần hiện tại (Vi phạm / Custom) | Shadcn Component Chuẩn (trong 72 chuẩn) | Trạng thái | Hướng xử lý / Migration |
| :--- | :--- | :--- | :--- | :--- |
| `global-search.vue:L108` | `<Modal>` + `<input>` + `<ul>` tự chế | `Command` (`CommandDialog`, `CommandInput`, `CommandList`, `Kbd`) | `[CẦN MIGRATE]` | Thay thế bằng bộ primitive `Command` và `Kbd` |
| `audit-logs/index.vue:L84` | `<div class="animate-spin ...">` | `Spinner` / `Skeleton` | `[CẦN MIGRATE]` | Dùng `<Spinner />` hoặc `<Skeleton />` |

---

## Testing Strategy
1. **Kiểm tra nhận diện Skill (Skill Discovery Test):**
   - Chạy `node scripts/link.mjs --global` và kiểm tra symlink tại `~/.gemini/config/skills/review-shadcn-standard/SKILL.md`.
2. **Kiểm tra thực chiến (Dry-run Audit Test):**
   - Thực thi quy trình quét của skill trên `admin/packages/effects/layouts/src/widgets/global-search/` và `admin/apps/web-admin/src/views/` để xác minh khả năng phát hiện chính xác các chỗ đang tự customize (như `global-search.vue` tự dựng bằng `Modal` + `<input>` thay vì `Command` + `Kbd`).
3. **Kiểm tra biên dịch khi Migration (Post-Migration Gate):**
   - Mọi thao tác migration thực tế trên dự án phải vượt qua `pnpm run check:type` (`vue-tsc`) và `oxlint` với 0 lỗi.

---

## Boundaries
- **Always do:**
  - Đối chiếu mọi thành phần giao diện với đúng danh mục 72 Shadcn components chuẩn.
  - **Cổng xác nhận 2 bước (Two-Step Review Gate):** Khi chạy `review`, luôn xuất bảng báo cáo kiểm định chi tiết trước và **dừng lại chờ người dùng xác nhận (`proceed`)** rồi mới tiến hành sửa code / migrate.
  - Giữ nguyên toàn bộ logic nghiệp vụ, phím tắt, sự kiện (`emit`, `v-model`), đa ngôn ngữ (`$t`) và khả năng truy cập (a11y) khi thực hiện migration.
  - Tuân thủ quy chuẩn `skills/rules/TYPOGRAPHY.md` và biến màu thiết kế (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`).
- **Ask first:**
  - Khi phát hiện 1 trong 72 component chuẩn **chưa có sẵn** trong package hiện tại (ví dụ chưa được export tại `@vben-core/shadcn-ui` của `tuquet/admin`): phải đánh dấu `[THIẾU PRIMITIVE]` trong báo cáo và hỏi ý kiến người dùng trước khi thêm/port primitive mới vào package.
  - Khi migration đòi hỏi cài đặt thêm dependency npm mới chưa có trong `package.json` của workspace.
  - Khi thay đổi cấu trúc DOM làm ảnh hưởng đến E2E selector hoặc API props công khai của một shared package.
- **Never do:**
  - Không bao giờ tự ý sửa code ngay trong bước `review` khi chưa xuất báo cáo và chưa có xác nhận `proceed` từ người dùng.
  - Không bao giờ chấp nhận các thẻ HTML thô (`<button>`, `<input>`, `<select>`, `<table>`, `<kbd>`, `<progress>`, `<hr>`) được viết kèm hàng chục class Tailwind thủ công để giả lập component có sẵn trong danh sách 72 chuẩn.
  - Không bao giờ tự ý `git push` khi chưa có yêu cầu rõ ràng từ người dùng.
  - Không bao giờ dùng màu hardcode (`bg-slate-800`, `text-gray-400`) thay vì semantic tokens của Shadcn.

---

## Success Criteria
1. File `skills/skills/review-shadcn-standard/SKILL.md` và `skills/skills/review-shadcn-standard/references/component-migration-matrix.md` được khởi tạo hoàn chỉnh, bao phủ toàn bộ **72/72 components** trong danh sách của người dùng.
2. Frontmatter của `SKILL.md` có đầy đủ trigger (`review`, `/review-shadcn-standard`, `"review ui"`, `"review shadcn"`) để tự động kích hoạt mỗi khi người dùng gõ `review`.
3. Skill được gắn symlink thành công vào cấu hình Agent toàn cục thông qua `node scripts/link.mjs --global`.
4. Có bảng đối chiếu (Migration Matrix) rõ ràng cho cả 72 components: tên chuẩn, sub-components, dấu hiệu nhận biết code tự chế (anti-patterns), và mẫu code thay thế chuẩn.

---

## Resolved Decisions (Approved by User)
1. **Chế độ thực thi khi gõ `review`**: Chỉ xuất bảng báo cáo kiểm định trước, chờ người dùng xác nhận (`proceed`) rồi mới tiến hành sửa code / migrate.
2. **Xử lý khi thiếu Primitive trong package hiện tại**: Báo cáo rõ component nào trong 72 chuẩn chưa có sẵn trong package hiện tại (`[THIẾU PRIMITIVE]`) và hỏi ý kiến người dùng trước khi port/thêm primitive mới.

