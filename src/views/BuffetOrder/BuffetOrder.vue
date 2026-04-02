<template>
  <div class="buffet-order">
    <SearchFilter :deadline-text="deadlineText" @search="handleSearch" />

    <div class="buffet-order__submit-row">
      <a-button type="primary" class="buffet-order__submit-btn" size="large" @click="handleSubmit">
        送出報餐
      </a-button>
    </div>

    <div class="buffet-order__list">
      <BuffetDaySection
        v-for="(day, dayIdx) in menuList"
        :key="day.date"
        :day-menu="day"
        :counts="dayCounts[dayIdx]"
        @update-count="(mealIdx, val) => updateMealCount(dayIdx, mealIdx, val)"
      />
    </div>

    <SuccessModal
      :visible="orderStore.showSuccess"
      :prepaid-amount="0"
      :show-footer="false"
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
import { SearchFilter, SuccessModal, OrderResultCard } from '@/components'
import { useOrderStore, useSearchStore } from '@/stores'
import { fetchBuffetMenu } from '@/api'
import { buildBuffetOrderResults } from '@/services'
import { buffetDeadlineConfig } from '@/config'
import type { BuffetDayMenu } from '@/types'
import BuffetDaySection from '@/components/BuffetOrder/BuffetDaySection.vue'

const orderStore = useOrderStore()
const searchStore = useSearchStore()

const menuList = ref<BuffetDayMenu[]>([])
const dayCounts = ref<number[][]>([])

const deadlineText = `自助餐報餐截止時間：\n${buffetDeadlineConfig.map(d => `${d.period}：${d.description}`).join(' | ')}`

onMounted(async () => {
  const data = await fetchBuffetMenu()
  menuList.value = data
  dayCounts.value = data.map(day => day.meals.map(() => 0))
})

function updateMealCount(dayIdx: number, mealIdx: number, val: number) {
  if (dayCounts.value[dayIdx]) {
    dayCounts.value[dayIdx][mealIdx] = val
  }
}

function handleSearch() {
  // reserved
}

function handleSubmit() {
  const countMap: Record<string, number> = {}
  const descMap: Record<string, string> = {}
  const dateMap: Record<string, string> = {}

  menuList.value.forEach((day, dayIdx) => {
    day.meals.forEach((meal, mealIdx) => {
      const key = `d${dayIdx}_${mealIdx}`
      const count = dayCounts.value[dayIdx]?.[mealIdx] ?? 0
      if (count > 0) {
        countMap[key] = count
        descMap[key] = meal.description
        dateMap[key] = `2026/${day.date} (${day.weekday}) 11:00-13:30`
      }
    })
  })

  const results = buildBuffetOrderResults(
    searchStore.params.location,
    countMap,
    descMap,
    dateMap,
  )

  orderStore.setOrderResults(results, 0)
}
</script>

<style scoped lang="scss">
.buffet-order {
  &__submit-row {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 24px;
  }

  &__submit-btn {
    background-color: $primary-color !important;
    border-color: $primary-color !important;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
}
</style>
