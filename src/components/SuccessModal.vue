<template>
  <a-modal
    :open="visible"
    :footer="null"
    width="min(400px, calc(100vw - 24px))"
    @cancel="$emit('close')"
  >
    <template #title>
      <div class="success-modal__title">
        <svg class="success-modal__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>報餐成功！</span>
      </div>
    </template>

    <div class="success-modal__body">
      <slot />
    </div>

    <div v-if="showFooter" class="success-modal__footer">
      <span class="success-modal__salary-note">*薪水給付</span>
      <div class="success-modal__total">
        預付金額
        <span class="success-modal__total-value">{{ formatCurrency(prepaidAmount) }}</span>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { formatCurrency } from '@/utils'

interface Props {
  visible: boolean
  prepaidAmount: number
  showFooter?: boolean
}

withDefaults(defineProps<Props>(), {
  showFooter: true,
})
defineEmits<{ (e: 'close'): void }>()
</script>

<style scoped lang="scss">
.success-modal {
  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: $primary-color;
  }

  &__icon {
    width: 20px;
    height: 20px;
  }

  &__title span {
    color: $text-color;
    font-weight: 700;
  }

  &__body {
    max-height: 50vh;
    overflow-y: auto;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__footer {
    padding-top: 16px;
    border-top: 1px solid #f3f4f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__salary-note {
    color: $primary-color;
    font-size: 14px;
  }

  &__total {
    color: $text-secondary;
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  &__total-value {
    color: $info-color;
    font-weight: 700;
    font-size: 20px;
    margin-left: 8px;
  }
}

@media (max-width: 576px) {
  .success-modal {
    &__footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    &__total-value {
      font-size: 18px;
    }
  }
}
</style>
