<template>
  <div class="order-result-card">
    <div class="order-result-card__header">
      <div>
        <h4 class="order-result-card__ticket">取餐號碼 {{ result.ticketId }}</h4>
        <p class="order-result-card__meta">{{ typeLabel }} | {{ result.location }}</p>
      </div>
      <span v-if="result.price" class="order-result-card__price">
        {{ formatCurrency(result.price) }}
      </span>
    </div>

    <div class="order-result-card__content">
      <p class="order-result-card__items">
        {{ result.items }}
        <span v-if="result.quantity > 0" class="order-result-card__qty">x{{ result.quantity }}</span>
      </p>
      <p v-if="result.customization" class="order-result-card__custom">
        {{ result.customization }}
      </p>
    </div>

    <p class="order-result-card__datetime">{{ result.dateTime }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderResult } from '@/types'
import { formatCurrency } from '@/utils'

interface Props {
  result: OrderResult
}

const props = defineProps<Props>()

const typeLabel = computed(() => {
  const map: Record<string, string> = {
    buffet: '自助餐',
    bento: '便當',
    setMeal: '套餐',
  }
  return map[props.result.type] || ''
})
</script>

<style scoped lang="scss">
.order-result-card {
  background: #f9fafb;
  border-radius: $radius-sm;
  padding: 16px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &__ticket {
    color: $info-color;
    font-weight: 500;
    font-size: 14px;
    margin: 0 0 4px;
  }

  &__meta {
    color: $text-secondary;
    font-size: 12px;
    margin: 0 0 8px;
  }

  &__price {
    color: $text-secondary;
    font-size: 14px;
  }

  &__content {
    margin-bottom: 8px;
  }

  &__items {
    color: $text-color;
    font-size: 14px;
    margin: 0 0 8px;
  }

  &__qty {
    color: $danger-color;
    margin-left: 4px;
  }

  &__custom {
    color: $text-secondary;
    font-size: 12px;
    margin: 0;
    white-space: pre-line;
  }

  &__datetime {
    color: $text-muted;
    font-size: 12px;
    margin: 0;
  }
}

@media (max-width: 576px) {
  .order-result-card {
    padding: 12px;

    &__header {
      flex-direction: column;
      gap: 6px;
    }
  }
}
</style>
