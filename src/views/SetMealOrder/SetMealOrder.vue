<template>
  <div class="set-meal-order">
    <SearchFilter
      show-time-fields
      :deadline-text="'*注意：套餐送出後不可編輯、取消！'"
      is-danger-hint
      @search="handleSearch"
    />

    <OrderHeader
      :prepaid-amount="setMealPrepaidAmount"
      :phone="phone"
      show-phone
      @update:phone="phone = $event"
      @submit="handleSubmit"
    />

    <div class="set-meal-order__grid">
      <SetMealCard
        v-for="(meal, idx) in mealList"
        :key="meal.id"
        :meal="meal"
        @open-customization="openCustomModal(idx, -1)"
        @edit-customization="(cIdx) => openCustomModal(idx, cIdx)"
        @update-qty="(val) => handleQtyChange(idx, val)"
      />
    </div>

    <CustomizationModal
      :visible="customModalVisible"
      :meal-name="activeMealName"
      :meal-price="activeMealPrice"
      :options="customizationOptions"
      :initial-data="activeCustomData"
      @save="handleCustomSave"
      @cancel="customModalVisible = false"
    />

    <SuccessModal
      :visible="orderStore.showSuccess"
      :prepaid-amount="setMealPrepaidAmount"
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
import { ref, onMounted } from 'vue'
import { SearchFilter, OrderHeader, SuccessModal, OrderResultCard } from '@/components'
import { useOrderStore, useSearchStore } from '@/stores'
import { fetchSetMealMenu } from '@/api'
import { buildSetMealOrderResults } from '@/services'
import { setMealPrepaidAmount } from '@/mockData'
import type { SetMealItem, CustomizationOption, SetMealCustomization, SetMealProduct } from '@/types'
import SetMealCard from '@/components/SetMealOrder/SetMealCard.vue'
import CustomizationModal from '@/components/SetMealOrder/CustomizationModal.vue'

const orderStore = useOrderStore()
const searchStore = useSearchStore()

const mealList = ref<SetMealItem[]>([])
const customizationOptions = ref<CustomizationOption[]>([])
const phone = ref('')

const customModalVisible = ref(false)
const activeMealIndex = ref(-1)
const activeCustomIndex = ref(-1)
const activeMealName = ref('')
const activeMealPrice = ref(0)
const activeCustomData = ref<SetMealCustomization>({
  options: [],
  drink: '',
  sugar: '',
  ice: '',
})

function toOrderMeals(products: SetMealProduct[]): SetMealItem[] {
  return products.map(p => ({ ...p, qty: 0, customizations: [] }))
}

onMounted(async () => {
  const data = await fetchSetMealMenu()
  mealList.value = toOrderMeals(data.meals)
  customizationOptions.value = data.customizationOptions
})

function handleSearch() {
  // reserved
}

function openCustomModal(mealIdx: number, customIdx: number) {
  const meal = mealList.value[mealIdx]
  if (!meal) return

  activeMealIndex.value = mealIdx
  activeCustomIndex.value = customIdx
  activeMealName.value = meal.name
  activeMealPrice.value = meal.price

  if (customIdx >= 0 && meal.customizations[customIdx]) {
    activeCustomData.value = { ...meal.customizations[customIdx] }
  } else {
    activeCustomData.value = { options: [], drink: '', sugar: '', ice: '' }
  }

  customModalVisible.value = true
}

function handleCustomSave(data: SetMealCustomization) {
  const meal = mealList.value[activeMealIndex.value]
  if (!meal) return

  if (activeCustomIndex.value >= 0) {
    meal.customizations[activeCustomIndex.value] = data
  } else {
    meal.customizations.push(data)
    meal.qty++
  }

  customModalVisible.value = false
}

function handleQtyChange(mealIdx: number, val: number) {
  const meal = mealList.value[mealIdx]
  if (!meal) return

  if (val > meal.qty) {
    openCustomModal(mealIdx, -1)
  } else if (val < meal.qty) {
    meal.customizations.pop()
    meal.qty = val
  }
}

function handleSubmit() {
  const dateStr = searchStore.params.date
    ? searchStore.params.date.format('YYYY/MM/DD (dd)')
    : '2026/02/02 (一)'
  const timeStr = searchStore.params.pickupTime
    ? searchStore.params.pickupTime.format('HH:mm')
    : '08:15'

  const results = buildSetMealOrderResults(
    searchStore.params.location,
    mealList.value,
    `${dateStr} ${timeStr}`,
  )

  orderStore.setOrderResults(results, setMealPrepaidAmount)
}
</script>

<style scoped lang="scss">
.set-meal-order {
  max-width: 1152px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .set-meal-order {
    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }
  }
}

@media (max-width: 576px) {
  .set-meal-order {
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
