<template>
  <div class="buffet-day">
    <h3 class="buffet-day__date">{{ dayMenu.date }} ({{ dayMenu.weekday }})</h3>
    <p v-if="dayMenu.notice" class="buffet-day__notice">{{ dayMenu.notice }}</p>
    <div v-if="dayMenu?.meals.length > 0" class="buffet-day__meals">
      <BuffetMealCard
        v-for="(meal, idx) in dayMenu.meals"
        :key="idx"
        :meal="meal"
        :count="getCount(idx)"
        @update:count="(val) => $emit('updateCount', idx, val)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BuffetDayMenu } from "@/types";
import BuffetMealCard from "./BuffetMealCard.vue";

interface Props {
  dayMenu: BuffetDayMenu;
  counts: number[];
}

const props = defineProps<Props>();
defineEmits<{ (e: "updateCount", mealIndex: number, value: number): void }>();

function getCount(idx: number): number {
  return props.counts[idx] ?? 0;
}
</script>

<style scoped lang="scss">
.buffet-day {
  border-bottom: 1px solid $border-color;
  padding-bottom: 24px;

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

  &__meals {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
}
</style>
