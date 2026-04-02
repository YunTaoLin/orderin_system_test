
# 專案架構

## 技術棧

| 類別 | 技術 |
| --- | --- |
| Framework | Vue 3.5 + TypeScript |
| Build Tool | Vite 6 |
| State | Pinia |
| UI Library | ant-design-vue 4.2.6（全量註冊） |
| Router | vue-router 4（History Mode） |
| Date | dayjs |
| CSS | SCSS + BEM + 全域 SCSS Variables |

## 分層架構

```
View → Composable / Store → Service → API → Utils
```

每一層只能呼叫同層或下層，禁止反向依賴。

| Layer | 職責 | 目錄 |
| --- | --- | --- |
| **View** | 頁面組裝、事件綁定、template 渲染 | `views/`, `components/` |
| **Composable** | 封裝可複用的響應式邏輯（loading、modal、計算） | `composables/` |
| **Store** | 跨元件共享狀態（搜尋條件、訂單結果） | `stores/` |
| **Service** | 純業務邏輯，不依賴 Vue 響應式系統 | `services/` |
| **API** | 資料取得層，負責呼叫後端或回傳 mock data | `api/` |
| **Utils** | 無狀態的純函式工具 | `utils/` |
| **Config** | 靜態設定值（截止時間、導覽列、色彩映射） | `config/` |
| **Types** | TypeScript 介面與型別定義 | `types/` |

### 層與層的呼叫範例

```
SetMealOrder.vue（View）
  ├── useOrderStore（Store）     → 管理訂單結果 modal 狀態
  ├── useSearchStore（Store）    → 讀取搜尋條件
  ├── fetchSetMealMenu（API）    → 取得菜單資料
  ├── buildSetMealOrderResults（Service） → 組裝訂單結果
  └── setMealPrepaidAmount（MockData）    → 預付金額常數
```

## 目錄結構

```
src/
├── api/                  # 資料取得層
│   ├── meal.api.ts       # 所有餐點相關的 fetch function
│   └── index.ts
├── components/           # 共用元件（全域 + 各頁面子元件）
│   ├── BentoOrder/
│   │   ├── BentoDaySection.vue
│   │   ├── BentoItemRow.vue
│   │   └── index.ts
│   ├── BuffetOrder/
│   │   ├── BuffetDaySection.vue
│   │   ├── BuffetMealCard.vue
│   │   └── index.ts
│   ├── SetMealOrder/
│   │   ├── CustomizationModal.vue
│   │   ├── SetMealCard.vue
│   │   └── index.ts
│   ├── NumberControl.vue
│   ├── SearchFilter.vue
│   ├── OrderHeader.vue
│   ├── OrderResultCard.vue
│   ├── SuccessModal.vue
│   └── index.ts
├── composables/          # Vue Composition Functions
│   ├── useLoading.ts
│   ├── useModal.ts
│   ├── useOrderCalc.ts
│   └── index.ts
├── config/               # 靜態設定
│   ├── api.config.ts     # mock 開關、延遲時間
│   ├── meal.config.ts    # 截止規則、色彩、選項
│   ├── nav.config.ts     # 頁籤導覽定義
│   └── index.ts
├── mockData/             # Mock 資料
│   ├── buffet.mockData.ts
│   ├── bento.mockData.ts
│   ├── setMeal.mockData.ts
│   └── index.ts
├── router/
│   └── index.ts          # 路由定義，全部 lazy-load
├── services/             # 業務邏輯
│   ├── order.service.ts  # 訂單結果組裝、客製化格式化
│   └── index.ts
├── stores/               # Pinia Stores
│   ├── order.store.ts    # 訂單結果與成功彈窗
│   ├── search.store.ts   # 搜尋條件
│   └── index.ts
├── styles/
│   ├── _variables.scss   # SCSS 變數（顏色、圓角、陰影）
│   └── global.scss       # 全域樣式、Ant Design 覆寫
├── types/
│   ├── meal.ts           # 所有型別定義
│   └── index.ts
├── utils/
│   ├── common.ts         # sleep, deepClone
│   ├── format.ts         # formatCurrency, generateTicketId
│   └── index.ts
└── views/
    ├── BuffetOrder/
    │   └── BuffetOrder.vue
    ├── BentoOrder/
    │   └── BentoOrder.vue
    └── SetMealOrder/
        └── SetMealOrder.vue
```

### 元件歸屬原則

- `src/components/` — 所有元件統一放置於此。
  - 根目錄下為跨頁面共用元件（`NumberControl`, `SearchFilter` 等）。
  - 頁面專屬子元件放在以頁面同名的子資料夾下（`BentoOrder/`, `BuffetOrder/`, `SetMealOrder/`），並透過各自的 `index.ts` 做 barrel export。
- `src/views/XxxOrder/` — 僅保留頁面層級的 `.vue` 檔，不再有 `components/` 子目錄。

## Barrel Export 機制

每個功能目錄都有 `index.ts` 做 re-export，外部統一從目錄路徑引入：

```typescript
// ✅
import { useOrderStore, useSearchStore } from '@/stores'
import { formatCurrency, generateTicketId } from '@/utils'

// ❌ 不直接引用檔案
import { useOrderStore } from '@/stores/order.store'
```

頁面專屬子元件統一透過 `@/components` 路徑引入：

```typescript
import BuffetDaySection from '@/components/BuffetOrder/BuffetDaySection.vue'
```

## Mock Data 機制

### 設計理念

API 層使用 **dynamic import** 載入 mock data，而非直接在 API 函式頂部 import。這確保未來替換為真實 API 時，mock data 不會被打包進 production bundle。

### 運作方式

`api.config.ts` 控制 mock 行為：

```typescript
export const ENABLE_MOCK_API = true
export const MOCK_API_LATENCY = 300
```

API 函式統一使用 `mockDelay()` 模擬網路延遲：

```typescript
async function mockDelay() {
  if (ENABLE_MOCK_API) await sleep(MOCK_API_LATENCY)
}

export async function fetchBentoMenu(): Promise<BentoProductDayMenu[]> {
  const { bentoMenuMockData } = await import('@/mockData')
  await mockDelay()
  return bentoMenuMockData
}
```

### Mock Data 檔案結構

每個餐點類型對應一個 `.mockData.ts` 檔案，export 具名常數：

| 檔案 | 匯出 |
| --- | --- |
| `buffet.mockData.ts` | `buffetMenuMockData` |
| `bento.mockData.ts` | `bentoMenuMockData`, `bentoPrepaidAmount` |
| `setMeal.mockData.ts` | `setMealMockData`, `customizationOptionsMockData`, `setMealPrepaidAmount` |

Mock data 的型別必須與 `types/` 中定義的介面一致。

### 切換至真實 API

替換步驟：

1. 將 `ENABLE_MOCK_API` 設為 `false`
2. 在 API 函式中把 `await import('@/mockData')` 替換為實際 HTTP 請求
3. 函式簽名與回傳型別維持不變，View 層不需要任何修改

```typescript
// 替換前
export async function fetchBentoMenu(): Promise<BentoProductDayMenu[]> {
  const { bentoMenuMockData } = await import('@/mockData')
  await mockDelay()
  return bentoMenuMockData
}

// 替換後
export async function fetchBentoMenu(): Promise<BentoProductDayMenu[]> {
  const res = await fetch('/api/bento/menu')
  return res.json()
}
```

## Store 設計

兩個 Store 都使用 **Composition API 風格**（`setup` function）。

### search.store

全域搜尋條件，供 `SearchFilter` 寫入、各頁面讀取：

- `params` — 響應式搜尋參數（location, date, timeSlot, pickupTime）
- `updateParams()` — 局部更新
- `resetParams()` — 重置預設值

### order.store

訂單提交結果，驅動 `SuccessModal` 顯示：

- `showSuccess` — 控制彈窗可見性
- `orderResults` — 訂單結果陣列
- `prepaidAmount` — 預付金額
- `setOrderResults()` — 設定結果並開啟彈窗
- `closeSuccess()` — 關閉彈窗並清除資料

## Service 設計

Service 層是 **純函式**，接收參數、回傳結果，不依賴 Vue 響應式系統或 Store。

目前 `order.service.ts` 提供三種訂單類型的結果組裝函式：

| 函式 | 用途 |
| --- | --- |
| `buildBuffetOrderResults` | 將自助餐數量 map 轉為 `OrderResult[]` |
| `buildBentoOrderResults` | 將便當品項轉為 `OrderResult[]` |
| `buildSetMealOrderResults` | 將套餐品項含客製化轉為 `OrderResult[]` |
| `formatCustomizationDisplay` | 將客製化資料格式化為顯示文字 |

## Composable 設計

| Composable | 用途 | 回傳 |
| --- | --- | --- |
| `useLoading` | 封裝 async 操作的 loading 狀態 | `{ loading, withLoading }` |
| `useModal` | 封裝 modal 開關狀態 | `{ visible, open, close, toggle }` |
| `useOrderCalc` | 計算品項的總金額、總數量、是否有選取 | `{ totalAmount, totalQuantity, hasSelectedItems }` |

## 路由

所有頁面路由使用 lazy-load（`() => import(...)`），根路徑 redirect 至 `/buffet`。

導覽頁籤由 `nav.config.ts` 的 `navTabsConfig` 驅動，`disabled` 的頁籤不會觸發路由跳轉。

## 全域樣式

### SCSS Variables

`_variables.scss` 透過 Vite 的 `additionalData` 自動注入所有 SCSS 檔案，無需手動 `@use`：

```typescript
// vite.config.ts
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `@use "@/styles/variables" as *;`,
    },
  },
}
```

### Ant Design 覆寫

Ant Design 的主題色透過 `a-config-provider` 的 `theme` prop 設定。元件層級的樣式覆寫寫在 `global.scss` 中，使用無 scoped 的全域選擇器。