# Spec: Nâng cấp Kỹ năng `specter-admin` Tối ưu Tốc độ Phát triển Frontend

## Objective
Nâng cấp và hoàn thiện toàn diện kỹ năng `specter-admin` (`skills/specter-admin/SKILL.md`) trở thành **Cẩm nang Tăng tốc Phát triển Frontend** (Frontend Accelerator Runbook) cho Tuquet Admin Dashboard (`apps/web-admin` và `packages/`).

Kỹ năng được trang bị đầy đủ các khuôn mẫu thành phần (Component Blueprints), hướng dẫn import UI chuẩn (`@tuquet/vue-ui`, `@lucide/vue`), mẫu kết nối API chuẩn qua BFF (`@vben/request`), quy chuẩn Tailwind v4, giải pháp cho các lỗi UI kinh điển (như modal không căn giữa trên mobile), cùng quy trình build & test cục bộ siêu tốc (Zero-Push).

Mục tiêu cốt lõi: Giảm thời gian khởi tạo tính năng mới từ hàng giờ xuống còn vài phút, triệt tiêu hoàn toàn tình trạng mò mẫm code, tra cứu sai thư viện hoặc gây lỗi ô nhiễm bộ nhớ.

---

## Tech Stack
- **Framework:** Vue 3.5+ (Composition API, `<script setup lang="ts">`, `defineModel`, `defineProps`, `defineEmits`).
- **UI Component Primitives:** `@tuquet/vue-ui` (Shadcn-Vue based: `Button`, `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `Input`, `Badge`, `Table`, `TableCell`, `TableHeader`, `TableRow`, `Tabs`, `toast`), `@lucide/vue`.
- **Styling Engine:** Tailwind CSS v4 (`@tailwindcss/vite`), biến HSL theme tokens (`bg-background`, `text-foreground`, `border-border/40`, `text-muted-foreground`, `bg-accent`).
- **State Management:** Pinia (`@vben/stores`, `@vben/preferences`).
- **HTTP Client:** `@vben/request` (`RequestClient`, tự động chèn token từ `useAccessStore` và baseURL qua `useAppConfig`).
- **Build & Monorepo:** Vite 6 / `@vben/vite-config`, Turborepo, `pnpm` workspaces.
- **Web Server:** Nginx trên mạng Tailscale Mesh (`http://100.68.217.61:80`, `127.0.0.1:80`).

---

## Commands
```bash
# 1. Kiểm tra an toàn đĩa trước khi thao tác
df -h /

# 2. Chạy TypeCheck toàn bộ packages
pnpm run check:type

# 3. Chạy Unit Test Preferences & Core Stores
pnpm test:unit packages/@core/preferences/__tests__/preferences.test.ts

# 4. Biên dịch và nạp trực tiếp vào Nginx trên Tailscale (Không push git)
pnpm run build:local

# 5. So sánh diff với code gốc Upstream (vbenjs/vue-vben-admin)
git diff upstream/main HEAD -- <đường_dẫn_tệp>

# 6. Kiểm tra phản hồi header từ Nginx cục bộ
curl -I http://127.0.0.1/sw.js
curl -s http://127.0.0.1/.build-meta.json
```

---

## Project Structure
```text
/root/tuquet/admin/
├── apps/
│   └── web-admin/src/
│       ├── api/                 # API client & endpoint definitions
│       │   ├── request.ts       # Central requestClient configuration & interceptors
│       │   └── core/            # Authentication & base system APIs
│       ├── views/               # Page views (Feature modules)
│       │   ├── dashboard/       # Analytics & system metrics
│       │   ├── fleet/           # Devices, Nodes & Runner supervision
│       │   └── tenants/         # Workspaces, Quotas, Members & Settings
│       ├── router/              # Vue Router route declarations & guards
│       └── store/               # Application-specific Pinia stores (auth, etc.)
├── packages/
│   ├── @core/
│   │   ├── preferences/         # Preferences state machine & CSS variable generators
│   │   └── ui-kit/shadcn-ui/    # Base headless & Radix/Reka UI primitives
│   └── effects/
│       └── layouts/             # Dashboard layouts, sidebar, header & preferences drawer
```

---

## Code Style & Canonical Blueprints

### 1. Mẫu Page View Chuẩn (Table + Search + Action Header + Dialog Trigger)
```vue
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { Plus, RefreshCw, Search } from '@lucide/vue';
import {
  Badge,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from '@tuquet/vue-ui';
import CreateItemModal from './components/create-item-modal.vue';

defineOptions({ name: 'FleetDeviceList' });

const loading = ref(false);
const searchQuery = ref('');
const isModalOpen = ref(false);
const items = ref<Array<{ id: string; name: string; status: 'active' | 'offline' }>>([]);

async function fetchData() {
  loading.value = true;
  try {
    // Gọi API qua module api chuẩn
    // items.value = await getDevicesApi();
  } catch (err: any) {
    toast.error(err?.message || 'Không thể tải danh sách thiết bị');
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <!-- Header Actions -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Thiết bị Fleet</h1>
        <p class="text-sm text-muted-foreground">Quản lý và giám sát các node runner đang kết nối</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" :disabled="loading" @click="fetchData">
          <RefreshCw class="size-4 mr-1.5" :class="{ 'animate-spin': loading }" />
          Làm mới
        </Button>
        <Button size="sm" @click="isModalOpen = true">
          <Plus class="size-4 mr-1.5" />
          Thêm thiết bị
        </Button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="rounded-md border border-border/40 bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên Thiết bị</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead class="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in items" :key="item.id">
            <TableCell class="font-medium">{{ item.name }}</TableCell>
            <TableCell>
              <Badge :variant="item.status === 'active' ? 'default' : 'secondary'">
                {{ item.status }}
              </Badge>
            </TableCell>
            <TableCell class="text-right">
              <Button variant="ghost" size="sm">Chi tiết</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <CreateItemModal v-model:open="isModalOpen" @success="fetchData" />
  </div>
</template>
```

### 2. Mẫu Dialog / Modal Chuẩn (Căn giữa chuẩn Mobile & Desktop)
```vue
<script lang="ts" setup>
import { ref, watch } from 'vue';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  toast,
} from '@tuquet/vue-ui';

interface Props {
  open: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:open', val: boolean): void;
  (e: 'success'): void;
}>();

const loading = ref(false);
const name = ref('');

watch(
  () => props.open,
  (val) => {
    if (val) name.value = '';
  },
);

async function handleSubmit() {
  if (!name.value.trim()) {
    toast.warning('Vui lòng nhập tên thiết bị');
    return;
  }
  loading.value = true;
  try {
    // await createDeviceApi({ name: name.value.trim() });
    toast.success('Đã thêm thiết bị thành công');
    emit('update:open', false);
    emit('success');
  } catch (err: any) {
    toast.error(err?.message || 'Có lỗi xảy ra');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <!-- Class fixed inset-0 flex items-center justify-center bảo đảm modal luôn căn giữa trên cả điện thoại -->
    <DialogContent class="sm:max-w-[425px] w-[92vw] max-w-[95vw] p-6">
      <DialogHeader>
        <DialogTitle>Thêm Thiết bị Mới</DialogTitle>
      </DialogHeader>

      <div class="py-4">
        <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
          Tên thiết bị
        </label>
        <Input v-model="name" placeholder="vd: VPS-Tokyo-Node-01" :disabled="loading" />
      </div>

      <DialogFooter class="flex flex-row justify-end gap-2 pt-2">
        <Button variant="outline" :disabled="loading" @click="emit('update:open', false)">Hủy</Button>
        <Button :disabled="loading" @click="handleSubmit">Xác nhận</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

### 3. Mẫu Khai báo API Chuẩn (BFF Token Delegation)
```ts
// apps/web-admin/src/api/fleet.ts
import { requestClient } from './request';

export interface DeviceItem {
  id: string;
  name: string;
  ip: string;
  status: 'active' | 'offline';
  lastPing: string;
}

export function getDevicesApi() {
  return requestClient.get<DeviceItem[]>('/fleet/devices');
}

export function createDeviceApi(data: { name: string }) {
  return requestClient.post<DeviceItem>('/fleet/devices', data);
}
```

---

## Testing Strategy
- **Unit Tests:** Kiểm thử trạng thái logic bằng Vitest (`pnpm test:unit`).
- **Kiểm tra Kiểu (Static Typing):** Chạy `pnpm run check:type` (sử dụng `vue-tsc --noEmit`).
- **Kiểm chứng Trực quan Cục bộ:** Build bản phân phối qua `pnpm run build:local` và kiểm tra trên trình duyệt qua IP Tailscale: `http://100.68.217.61/`.

---

## Boundaries
- **Luôn luôn làm (Always):**
  - Dùng component primitives từ `@tuquet/vue-ui` và icon từ `@lucide/vue`.
  - Luôn kiểm tra giao diện trên cả tỷ lệ màn hình điện thoại (mobile viewport $\le 640px$) và máy tính.
  - Sử dụng lệnh `pnpm run build:local` để xuất bản và kiểm tra kết quả ngay trên Nginx.
  - Deep clone `this.initialPreferences` qua `this.cloneValue` trong Preferences engine.
- **Hỏi ý kiến người dùng trước khi làm (Ask first):**
  - Thêm package dependencies mới vào `package.json`.
  - Thay đổi cấu trúc routing cấp cao hoặc layout mặc định của dashboard.
  - Tái cấu trúc các module API cốt lõi (`request.ts`, `core/`).
- **Tuyệt đối không làm (Never):**
  - Tuyệt đối không chạy `git push` hoặc kích hoạt remote GitHub Actions CI/CD workflows.
  - Không import `@supabase/supabase-js` trực tiếp trong frontend; mọi thao tác dữ liệu phải đi qua Rust BFF.
  - Không chạy `cargo build --release` trên VPS; giữ dung lượng ổ cứng $\le 85\%$.
  - Không mutate trực tiếp object reactive preferences trong các hàm tiện ích hoặc biến CSS.

---

## Success Criteria
1. Tệp kỹ năng `skills/specter-admin/SKILL.md` được cập nhật đầy đủ, ngắn gọn, chứa các bản thiết kế chuẩn (Blueprints) cho Page View, Modal/Dialog, Form, API Service, và Preferences Widget.
2. Tài liệu giải thích rõ ràng kiến trúc thư mục, các alias đường dẫn (`#/api`, `#/store`), và cơ chế giao tiếp qua Nginx trên Tailscale.
3. Kỹ năng có Frontmatter chuẩn xác, phản hồi đúng trigger `/specter-admin`, có hợp đồng đầu ra rõ ràng và tuân thủ tiêu chuẩn Ponytail.
4. Kiểm thử Preferences Unit Tests chạy thành công 28/28 tests.
5. Cập nhật được lưu trữ trong Git local với commit nguyên tử, working tree sạch sẽ, **Zero Git Push**.

---

## Open Questions
> [!NOTE]
> 1. Ngoài `@tuquet/vue-ui`, bạn có muốn bổ sung thêm các mẫu bảng biểu phức tạp dạng `vxe-table` (dành cho bảng dữ liệu lớn hàng chục nghìn dòng) vào cẩm nang kỹ năng `specter-admin` không?
> 2. Có cần bổ sung thêm các mẫu kiểm thử component E2E (Playwright) vào cẩm nang trong giai đoạn này không, hay ưu tiên Vitest unit test và kiểm tra giao diện qua Tailscale Nginx?
