<template>
  <div class="search-filter">
    <div class="search-filter__row">
      <div class="search-filter__field">
        <span class="search-filter__label">用餐地點</span>
        <a-select
          :value="searchStore.params.location"
          class="search-filter__control search-filter__control--md"
          :options="locationOptions"
          @update:value="(val: string) => searchStore.updateParams({ location: val })"
        />
      </div>

      <div class="search-filter__field">
        <span class="search-filter__label">用餐日期</span>
        <WeekPicker
          v-if="datePickerType === 'week'"
          :value="searchStore.params.date"
          class="search-filter__control search-filter__control--md"
          @update:value="(val) => searchStore.updateParams({ date: val })"
        />
        <a-date-picker
          v-else
          :value="searchStore.params.date"
          class="search-filter__control search-filter__control--md"
          @update:value="(val: any) => searchStore.updateParams({ date: val })"
        />
      </div>

      <template v-if="showTimeFields">
        <div class="search-filter__field">
          <span class="search-filter__label">時段</span>
          <a-select
            :value="searchStore.params.timeSlot"
            class="search-filter__control search-filter__control--sm"
            :options="timeSlotOptions"
            @update:value="(val: string) => searchStore.updateParams({ timeSlot: val })"
          />
        </div>
        <div class="search-filter__field">
          <span class="search-filter__label">取餐時間</span>
          <a-time-picker
            :value="searchStore.params.pickupTime"
            format="HH:mm"
            class="search-filter__control search-filter__control--sm"
            @update:value="(val: any) => searchStore.updateParams({ pickupTime: val })"
          />
        </div>
      </template>

      <div class="search-filter__action">
        <a-button type="primary" ghost @click="$emit('search')">搜尋</a-button>
      </div>
    </div>

    <p v-if="deadlineText" class="search-filter__hint" :class="{ 'search-filter__hint--danger': isDangerHint }">
      {{ deadlineText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import WeekPicker from '@/components/WeekPicker.vue'
import { useSearchStore } from '@/stores'
import { locationOptions, timeSlotOptions } from '@/config'

interface Props {
  showTimeFields?: boolean
  datePickerType?: 'date' | 'week'
  deadlineText?: string
  isDangerHint?: boolean
}

withDefaults(defineProps<Props>(), {
  showTimeFields: false,
  datePickerType: 'date',
  deadlineText: '',
  isDangerHint: false,
})

defineEmits<{ (e: 'search'): void }>()

const searchStore = useSearchStore()
</script>

<style scoped lang="scss">
.search-filter {
  background: $bg-white;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  border: 1px solid #f3f4f6;
  padding: 16px;
  margin-bottom: 24px;

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
  }

  &__field {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1 1 180px;
  }

  &__control {
    width: 100%;

    &--md {
      max-width: 180px;
    }

    &--sm {
      max-width: 120px;
    }
  }

  &__label {
    color: $text-secondary;
    font-size: 14px;
    white-space: nowrap;
  }

  &__action {
    margin-left: auto;
  }

  &__hint {
    margin-top: 16px;
    margin-bottom: 0;
    font-size: 12px;
    color: $text-secondary;
    line-height: 1.8;
    white-space: pre-line;

    &--danger {
      color: $danger-color;
    }
  }

  @media (max-width: 768px) {
    &__row {
      gap: 12px;
    }

    &__field {
      flex: 1 1 calc(50% - 6px);
      min-width: 0;
    }

    &__control {
      &--md,
      &--sm {
        max-width: none;
      }
    }

    &__action {
      margin-left: 0;
      width: 100%;

      .ant-btn {
        width: 100%;
      }
    }
  }

  @media (max-width: 576px) {
    &__field {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      width: 100%;
      flex-basis: 100%;
    }

    &__control {
      width: 100%;
    }

    &__hint {
      margin-top: 12px;
      line-height: 1.6;
    }
  }
}
</style>
