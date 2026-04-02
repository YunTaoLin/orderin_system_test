<template>
  <a-modal
    :open="visible"
    :closable="false"
    :footer="null"
    width="min(600px, calc(100vw - 24px))"
    @cancel="handleCancel"
  >
    <template #title>
      <div class="custom-modal__header">
        <h3 class="custom-modal__title">{{ mealName }}/{{ formatCurrency(mealPrice) }}</h3>
        <div class="custom-modal__actions">
          <a-button type="primary" class="custom-modal__save" @click="handleSave">儲存</a-button>
          <a-button type="primary" danger @click="handleCancel">取消</a-button>
        </div>
      </div>
    </template>

    <div class="custom-modal__body">
      <div
        v-for="option in options"
        :key="option.key"
        class="custom-modal__section"
        :class="{ 'custom-modal__section--disabled': isOptionDisabled(option.key) }"
      >
        <h4 class="custom-modal__section-title">{{ option.label }}</h4>

        <a-checkbox-group
          v-if="option.type === 'checkbox'"
          :value="(formData[option.key] as string[])"
          @change="(val: any) => updateField(option.key, val)"
        >
          <a-checkbox v-for="choice in option.choices" :key="choice" :value="choice">
            {{ choice }}
          </a-checkbox>
        </a-checkbox-group>

        <a-radio-group
          v-else
          :value="(formData[option.key] as string)"
          :disabled="isOptionDisabled(option.key)"
          @change="(e: any) => updateField(option.key, e.target.value)"
        >
          <a-radio v-for="choice in option.choices" :key="choice" :value="choice">
            {{ choice }}
          </a-radio>
        </a-radio-group>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import type { CustomizationOption, SetMealCustomization } from '@/types'
import { formatCurrency } from '@/utils'
import { deepClone } from '@/utils'

interface Props {
  visible: boolean
  mealName: string
  mealPrice: number
  options: CustomizationOption[]
  initialData?: SetMealCustomization
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({
    options: [],
    drink: '',
    sugar: '',
    ice: '',
  }),
})

const emit = defineEmits<{
  (e: 'save', data: SetMealCustomization): void
  (e: 'cancel'): void
}>()

const formData = reactive<SetMealCustomization>({
  options: [],
  drink: '',
  sugar: '',
  ice: '',
})

watch(
  () => props.visible,
  (val) => {
    if (val && props.initialData) {
      const clone = deepClone(props.initialData)
      Object.assign(formData, clone)
    }
  },
)

function updateField(key: keyof SetMealCustomization, value: string | string[]) {
  ;(formData[key] as typeof value) = value
}

const isDrinkSelected = computed(() => !!formData.drink)

function isOptionDisabled(key: keyof SetMealCustomization): boolean {
  return (key === 'sugar' || key === 'ice') && !isDrinkSelected.value
}

function handleSave() {
  emit('save', deepClone(formData))
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped lang="scss">
.custom-modal {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: -8px;
    gap: 12px;
  }

  &__title {
    color: $text-color;
    font-weight: 700;
    font-size: 18px;
    margin: 0;
  }

  &__actions {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
  }

  &__save {
    background-color: $primary-color !important;
    border-color: $primary-color !important;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-top: 8px;
  }

  &__section-title {
    color: $text-color;
    font-weight: 500;
    margin-bottom: 12px;
  }

  &__section--disabled {
    opacity: 0.45;
    pointer-events: none;
  }
}

@media (max-width: 576px) {
  .custom-modal {
    &__header {
      flex-direction: column;
      align-items: flex-start;
      margin-right: 0;
    }

    &__actions {
      width: 100%;

      .ant-btn {
        flex: 1;
      }
    }
  }
}
</style>
