<template>
  <div class="bento-day">
    <h3 class="bento-day__date">{{ dayMenu.date }} ({{ dayMenu.weekday }})</h3>

    <p v-if="dayMenu.notice" class="bento-day__notice">{{ dayMenu.notice }}</p>

    <a-collapse
      v-if="dayMenu.periods.length"
      v-model:activeKey="activeKey"
      accordion
      expand-icon-position="end"
      class="bento-collapse"
      :style="{ width: '700px' }"
    >
      <a-collapse-panel
        v-for="(period, idx) in dayMenu.periods"
        :key="`${dayMenu.date}-${idx}-${period.key}`"
        class="bento-day__panel"
      >
        <template #header>
          <div>
            <h4 class="bento-day__period-label">{{ period.label }}</h4>
            <p class="bento-day__summary">{{ periodSummary(period) }}</p>
          </div>
        </template>
        <template #extra>
          <span class="bento-day__total">{{
            formatCurrency(periodTotal(period))
          }}</span>
        </template>

        <div class="bento-day__items">
          <BentoItemRow
            v-for="item in period.items"
            :key="item.id"
            :item="item"
            @update-qty="(val) => $emit('updateQty', dayMenu.date, period.key, item.id, val)"
          />
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { BentoDayMenu, BentoPeriod } from "@/types";
import { formatCurrency } from "@/utils";
import BentoItemRow from "./BentoItemRow.vue";

interface Props {
  dayMenu: BentoDayMenu;
}

defineProps<Props>();
defineEmits<{
  (
    e: "updateQty",
    dayDate: string,
    periodKey: string,
    itemId: string,
    val: number,
  ): void;
}>();

const activeKey = ref<string>();

function periodSummary(period: BentoPeriod): string {
  return period.items
    .filter((item) => item.qty > 0)
    .map((item) => `${item.name}x${item.qty}`)
    .join("、");
}

function periodTotal(period: BentoPeriod): number {
  return period.items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
</script>

<style scoped lang="scss">
.bento-day {
  border-bottom: 1px solid $border-color;
  padding-bottom: 24px;

  &__panel{
    width: 340px;
    align-self: flex-start;
  }

  &__date {
    color: $info-color;
    font-weight: 500;
    margin-bottom: 16px;
    font-size: 16px;
  }

  &__notice {
    color: $text-secondary;
    font-size: 14px;
  }

  &__period-label {
    color: $info-color;
    font-weight: 500;
    font-size: 14px;
    margin: 0;
  }

  &__summary {
    color: $text-color;
    font-size: 14px;
    margin: 4px 0 0;
  }

  &__total {
    color: $text-secondary;
    font-size: 14px;
    font-weight: 500;
    margin-right: 8px;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
.bento-collapse {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}
</style>
