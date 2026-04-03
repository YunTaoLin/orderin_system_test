<template>
  <a-date-picker
    picker="week"
    :value="value"
    :allow-clear="false"
    :format="formatWeekLabel"
    class="week-picker"
    @update:value="handleUpdateValue"
  />
</template>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'

interface Props {
  value: Dayjs | null
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: Dayjs | null): void
}>()

function handleUpdateValue(value: Dayjs | null) {
  emit('update:value', value)
}

function formatWeekLabel(value: Dayjs): string {
  const year = value.year()
  const month = value.month() + 1
  const weekOfMonth = Math.ceil(value.date() / 7)

  return `${year}/${month}月/第${weekOfMonth}週`
}
</script>

<style scoped lang="scss">
.week-picker {
  width: 100%;

  :deep(.ant-picker) {
    width: 100%;
    border: 1px solid transparent;
    border-radius: $radius-md;
    background-color: $info-border;
    box-shadow: none;
  }

  :deep(.ant-picker-input > input) {
    color: $text-color;
    font-weight: 600;
  }

  :deep(.ant-picker-suffix) {
    color: $text-muted;
  }
}
</style>