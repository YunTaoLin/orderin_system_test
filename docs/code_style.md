
# Code Style

## 檔案命名

| 類型 | 規則 | 範例 |
| --- | --- | --- |
| Vue 元件 | PascalCase | `OrderHeader.vue`, `SetMealCard.vue` |
| Store | `xxx.store.ts` | `order.store.ts` |
| Service | `xxx.service.ts` | `order.service.ts` |
| API | `xxx.api.ts` | `meal.api.ts` |
| Config | `xxx.config.ts` | `api.config.ts`, `nav.config.ts` |
| Mock Data | `xxx.mockData.ts` | `bento.mockData.ts` |
| Composable | `useXxx.ts` | `useLoading.ts`, `useOrderCalc.ts` |
| 型別定義 | 對應領域名稱 | `meal.ts` |

新增檔案時必須在同目錄的 `index.ts` barrel 中補上 re-export。

## 變數命名

### 通則

- 一律使用 **camelCase**
- Boolean 變數使用 `is` / `has` / `show` 開頭：`showSuccess`, `hasSelectedItems`, `isDangerHint`
- 陣列使用複數名詞：`menuList`, `orderResults`, `mealList`
- Map / Record 使用 `xxxMap` 後綴：`countMap`, `descMap`, `mealColorMap`
- Config 常數使用 `xxxConfig` 後綴：`navTabsConfig`, `buffetDeadlineConfig`
- Mock data 常數使用 `xxxMockData` 後綴：`buffetMenuMockData`, `bentoMenuMockData`

### 函式命名

| 場景 | 前綴 | 範例 |
| --- | --- | --- |
| 事件 handler | `handle` | `handleSubmit`, `handleSearch`, `handleQtyChange` |
| 取得資料 | `fetch` | `fetchBuffetMenu`, `fetchBentoMenu` |
| 組裝 / 建構 | `build` | `buildBuffetOrderResults` |
| 格式化 | `format` | `formatCurrency`, `formatCustomizationDisplay` |
| 轉換 | `to` | `toOrderMenu`, `toOrderMeals` |
| 更新 Store | `update` / `set` / `reset` | `updateParams`, `setOrderResults`, `resetParams` |

### Props & Emits

Props 和 Emits 必須使用 TypeScript interface 定義型別，不用 runtime declaration：

```typescript
interface Props {
  dayMenu: BuffetDayMenu
  counts: number[]
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'updateCount', mealIndex: number, value: number): void
}>()
```

帶預設值的 Props 使用 `withDefaults`：

```typescript
withDefaults(defineProps<Props>(), {
  min: 0,
  max: 99,
})
```

## CSS / SCSS

### BEM 命名

所有自訂樣式使用 BEM 命名規範。Block 名稱與元件名稱對應（kebab-case）：

```
.set-meal-card              → Block
.set-meal-card__name        → Element
.set-meal-card__btn--minus  → Modifier
```

不使用深層巢狀，Element 一律掛在 Block 底下，不出現 `__a__b` 這種雙層 Element。

### SCSS 巢狀寫法

利用 `&` 搭配 BEM，樣式結構與 template 結構對齊：

```scss
.number-control {
  display: inline-flex;

  &__btn {
    display: flex;

    &--minus {
      color: $text-muted;
    }

    &--plus {
      color: $info-color;
    }
  }

  &__value {
    text-align: center;
  }
}
```

### SCSS Variables

使用 `_variables.scss` 中定義的變數，禁止在元件中硬寫色碼、圓角、陰影等值：

```scss
// ✅
color: $text-secondary;
border-radius: $radius-md;
box-shadow: $shadow-sm;

// ❌
color: #6b7280;
border-radius: 12px;
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
```

### scoped 與全域樣式

- 元件樣式一律加 `scoped`
- Ant Design 元件覆寫寫在 `global.scss`，不在元件內用 `:deep()` 除非該覆寫僅限單一元件

## 元件設計

### script setup

所有元件使用 `<script setup lang="ts">`，不使用 Options API。

### import 順序

```typescript
// 1. Vue 核心
import { ref, computed, onMounted } from 'vue'

// 2. 共用元件（透過 barrel export）
import { SearchFilter, OrderHeader } from '@/components'

// 3. Store
import { useOrderStore, useSearchStore } from '@/stores'

// 4. API
import { fetchBentoMenu } from '@/api'

// 5. Service
import { buildBentoOrderResults } from '@/services'

// 6. Config
import { bentoDeadlineConfig } from '@/config'

// 7. Mock Data（僅在 View 需要常數時）
import { bentoPrepaidAmount } from '@/mockData'

// 8. Types（type-only import）
import type { BentoDayMenu } from '@/types'

// 9. 頁面專屬子元件（透過 @/components 子資料夾）
import BentoDaySection from '@/components/BentoOrder/BentoDaySection.vue'
```

### 元件結構順序

```vue
<template> ... </template>

<script setup lang="ts">
// imports
// store / composable 初始化
// ref / reactive 宣告
// computed
// onMounted / lifecycle
// functions
</script>

<style scoped lang="scss"> ... </style>
```

## Store

- 使用 Composition API 風格（setup function）
- Store 名稱使用 `useXxxStore` 並在 `defineStore` 中給予 kebab-case 或 camelCase ID
- 不在 Store 中做 API 呼叫，API 呼叫由 View 發起，Store 只負責存放狀態
- mutation 邏輯封裝為具名函式暴露（`setOrderResults`, `updateParams`），不讓 View 直接操作 ref

## Service

- 純函式，不 import Vue 的任何東西（`ref`, `computed` 等）
- 不依賴 Store，所有資料透過參數傳入
- 回傳型別必須明確標註

## API

- 每個函式的回傳型別必須明確標註 Promise 泛型
- Mock 階段使用 dynamic import 載入 mock data：`await import('@/mockData')`
- 所有 API 函式都是 async，即使目前只是回傳 mock data

## Type 定義

### 命名規則

- Interface 名稱使用 PascalCase，不加 `I` 前綴
- 與 UI 狀態耦合的擴展型別繼承自 product 型別：

```typescript
// 純資料型別
interface BentoProduct {
  id: string
  name: string
  price: number
  img: string
}

// 帶 UI 狀態的擴展
interface BentoItem extends BentoProduct {
  qty: number
}
```

### Product vs Item 區分

- `XxxProduct` — API 回傳的原始資料結構
- `XxxItem` — 加上 `qty`, `customizations` 等 UI 互動狀態的版本
- View 從 API 拿到 Product 後，透過 `toOrderXxx()` 轉換函式加上初始狀態成為 Item

## Composable

- 檔案名稱 `useXxx.ts`，匯出同名函式 `useXxx()`
- 回傳一個物件，包含 ref / computed / method
- Composable 封裝的是 **可複用的響應式邏輯**，不是業務邏輯（業務邏輯放 Service）

## Ant Design 使用

- 全量註冊（`app.use(Antd)`），template 中直接使用 `<a-xxx>` 標籤
- 主題色透過 `<a-config-provider :theme="themeConfig">` 設定，不用 CSS 覆蓋 token
- 元件 Props 使用 Ant Design 的事件命名慣例：`@update:value` 而非 `@change`