<template>
  <div class="set-meal-card">
    <div class="set-meal-card__top">
      <div class="set-meal-card__info">
        <div class="set-meal-card__img-wrap">
          <img :src="meal.img" class="set-meal-card__img" alt="" />
        </div>
        <div>
          <h4 class="set-meal-card__name">{{ meal.name }}</h4>
          <p class="set-meal-card__price">{{ formatCurrency(meal.price) }}</p>
        </div>
      </div>
      <div @click.stop="handleCountClick">
        <NumberControl
          :model-value="meal.qty"
          @update:model-value="handleQtyChange"
        />
      </div>
    </div>

    <div v-if="meal.customizations.length" class="set-meal-card__customs">
      <div
        v-for="(c, idx) in meal.customizations"
        :key="idx"
        class="set-meal-card__custom-tag"
        @click="$emit('editCustomization', idx)"
      >
        {{ displayCustomization(c) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SetMealItem, SetMealCustomization } from '@/types'
import { NumberControl } from '@/components'
import { formatCurrency } from '@/utils'
import { formatCustomizationDisplay } from '@/services'

interface Props {
  meal: SetMealItem
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'openCustomization'): void
  (e: 'editCustomization', index: number): void
  (e: 'updateQty', val: number): void
}>()

function displayCustomization(c: SetMealCustomization): string {
  return formatCustomizationDisplay(c)
}

function handleCountClick() {
  emit('openCustomization')
}

function handleQtyChange(val: number) {
  emit('updateQty', val)
}
</script>

<style scoped lang="scss">
.set-meal-card {
  background: $bg-white;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  padding: 16px;
  box-shadow: $shadow-sm;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: $shadow-md;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  &__info {
    display: flex;
    gap: 12px;
    min-width: 0;
  }

  &__img-wrap {
    width: 48px;
    height: 48px;
    background: #f3f4f6;
    border-radius: $radius-sm;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__name {
    color: $text-color;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.3;
    margin: 0;
    word-break: break-word;
  }

  &__price {
    color: $text-secondary;
    font-size: 12px;
    margin: 4px 0 0;
  }

  &__customs {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__custom-tag {
    background: #f9fafb;
    padding: 8px;
    border-radius: 4px;
    font-size: 12px;
    color: $text-secondary;
    white-space: pre-line;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
      background: #f3f4f6;
    }
  }
}

@media (max-width: 576px) {
  .set-meal-card {
    padding: 12px;

    &__top {
      gap: 10px;
    }

    &__info {
      gap: 10px;
    }
  }
}
</style>
