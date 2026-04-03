<template>
  <div class="bento-order">
    <SearchFilter date-picker-type="week" :deadline-text="deadlineText" @search="handleSearch" />

    <OrderHeader
      :prepaid-amount="prepaidAmount"
      :disabled="!canSubmit"
      :phone="phone"
      :show-phone="false"
      @update:phone="phone = $event"
      @submit="handleSubmit"
    />

    <div class="bento-order__list">
      <BentoDaySection
        v-for="day in menuList"
        :key="`${day.date}-${collapseResetVersion}`"
        :day-menu="day"
        @update-qty="handleUpdateQty"
      />
    </div>

    <SuccessModal
      :visible="orderStore.showSuccess"
      :prepaid-amount="orderStore.prepaidAmount"
      @close="orderStore.closeSuccess()"
    >
      <OrderResultCard
        v-for="(result, idx) in orderStore.orderResults"
        :key="idx"
        :result="result"
      />
    </SuccessModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import {
  SearchFilter,
  OrderHeader,
  SuccessModal,
  OrderResultCard,
} from "@/components";
import { useOrderStore, useSearchStore } from "@/stores";
import { fetchBentoMenu } from "@/api";
import { buildBentoOrderResults } from "@/services";
import { bentoDeadlineConfig } from "@/config";
import type { BentoDayMenu, BentoProductDayMenu } from "@/types";
import BentoDaySection from "@/components/BentoOrder/BentoDaySection.vue";

const orderStore = useOrderStore();
const searchStore = useSearchStore();

const menuList = ref<BentoDayMenu[]>([]);
const phone = ref("");
const collapseResetVersion = ref(0);

const prepaidAmount = computed(() =>
  menuList.value.reduce(
    (sum, day) =>
      sum +
      day.periods.reduce(
        (periodSum, period) =>
          periodSum +
          period.items.reduce((itemSum, item) => itemSum + item.qty * item.price, 0),
        0,
      ),
    0,
  ),
);

const canSubmit = computed(() =>
  menuList.value.some((day) =>
    day.periods.some((period) => period.items.some((item) => item.qty > 0)),
  ),
);

const deadlineText = `便當報餐截止時間：\n${bentoDeadlineConfig.map((d) => `${d.period}：${d.description}`).join(" | ")}`;

function toOrderMenu(products: BentoProductDayMenu[]): BentoDayMenu[] {
  return products.map((day) => ({
    ...day,
    periods: day.periods.map((period) => ({
      ...period,
      items: period.items.map((item) => ({ ...item, qty: 0 })),
    })),
  }));
}

onMounted(async () => {
  const data = await fetchBentoMenu();
  menuList.value = toOrderMenu(data);
});

function handleSearch() {
  // reserved
}

function handleUpdateQty(
  dayDate: string,
  periodKey: string,
  itemId: string,
  val: number,
) {
  for (const day of menuList.value) {
    if (day.date !== dayDate) continue;

    for (const period of day.periods) {
      if (period.key === periodKey) {
        const item = period.items.find((i) => i.id === itemId);
        if (item) item.qty = val;
      }
    }
  }
}

function handleSubmit() {
  if (!canSubmit.value) return;

  const allItems: Array<{ name: string; qty: number; price: number }> = [];

  menuList.value.forEach((day) => {
    day.periods.forEach((period) => {
      period.items.forEach((item) => {
        if (item.qty > 0) {
          allItems.push({ name: item.name, qty: item.qty, price: item.price });
        }
      });
    });
  });

  const results = buildBentoOrderResults(searchStore.params.location, allItems);
  orderStore.setOrderResults(results, prepaidAmount.value);

  for (const day of menuList.value) {
    for (const period of day.periods) {
      for (const item of period.items) {
        item.qty = 0;
      }
    }
  }

  collapseResetVersion.value++;
}
</script>

<style scoped lang="scss">
.bento-order {
  &__list {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
}

@media (max-width: 768px) {
  .bento-order {
    &__list {
      gap: 20px;
    }
  }
}
</style>
