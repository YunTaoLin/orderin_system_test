<template>
  <div class="order-header">
    <div class="order-header__prepaid">
      <span class="order-header__prepaid-label">預付金額</span>
      <span class="order-header__prepaid-value">{{ formatCurrency(prepaidAmount) }}</span>
    </div>
    <div class="order-header__actions">
      <div v-if="showPhone" class="order-header__phone">
        <span class="order-header__required">*</span>
        <span class="order-header__phone-label">分機或聯絡電話</span>
        <a-input
          :value="phone"
          placeholder="#5311"
          class="order-header__phone-input"
          @update:value="(val: string) => $emit('update:phone', val)"
        />
      </div>
      <a-button type="primary" class="order-header__submit" @click="$emit('submit')">
        送出報餐
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '@/utils'

interface Props {
  prepaidAmount: number
  showPhone?: boolean
  phone?: string
}

withDefaults(defineProps<Props>(), {
  showPhone: true,
  phone: '',
})

defineEmits<{
  (e: 'submit'): void
  (e: 'update:phone', value: string): void
}>()
</script>

<style scoped lang="scss">
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: $bg-white;
  padding: 16px;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  border: 1px solid #f3f4f6;
  margin-bottom: 32px;

  &__prepaid {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__prepaid-label {
    color: $text-secondary;
  }

  &__prepaid-value {
    color: $info-color;
    font-weight: 700;
    font-size: 20px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  &__phone {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__phone-input {
    width: 140px;
  }

  &__required {
    color: $danger-color;
    font-size: 14px;
  }

  &__phone-label {
    color: $text-color;
    font-size: 14px;
    white-space: nowrap;
  }

  &__submit {
    background-color: $primary-color !important;
    border-color: $primary-color !important;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 24px;

    &__actions {
      width: 100%;
      justify-content: space-between;
      gap: 12px;
    }

    &__prepaid-value {
      font-size: 18px;
    }
  }

  @media (max-width: 576px) {
    &__phone {
      width: 100%;
      flex-wrap: wrap;
      gap: 6px;
    }

    &__phone-input {
      width: 100%;
    }

    &__submit {
      width: 100%;
    }
  }
}
</style>
