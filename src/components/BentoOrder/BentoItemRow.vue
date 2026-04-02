<template>
  <div class="bento-item-row">
    <div class="bento-item-row__left">
      <img :src="item.img" class="bento-item-row__img" alt="" />
      <div class="bento-item-row__info">
        <p class="bento-item-row__name">{{ item.name }}</p>
        <p class="bento-item-row__price">{{ formatCurrency(item.price) }}</p>
      </div>
    </div>
    <NumberControl :model-value="item.qty" @update:model-value="$emit('updateQty', $event)" />
  </div>
</template>

<script setup lang="ts">
import type { BentoItem } from '@/types'
import { NumberControl } from '@/components'
import { formatCurrency } from '@/utils'

interface Props {
  item: BentoItem
}

defineProps<Props>()
defineEmits<{ (e: 'updateQty', val: number): void }>()
</script>

<style scoped lang="scss">
.bento-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: $radius-sm;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  &__info {
    min-width: 0;
  }

  &__img {
    width: 48px;
    height: 48px;
    border-radius: 4px;
    object-fit: cover;
    border: 1px solid $border-color;
  }

  &__name {
    color: $text-color;
    font-size: 14px;
    margin: 0;
    word-break: break-word;
  }

  &__price {
    color: $text-secondary;
    font-size: 12px;
    margin: 0;
  }
}

@media (max-width: 576px) {
  .bento-item-row {
    align-items: flex-start;
    gap: 10px;

    &__left {
      gap: 8px;
      flex: 1;
    }

    &__img {
      width: 42px;
      height: 42px;
    }
  }
}
</style>
