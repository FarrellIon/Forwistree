<script setup lang="ts">
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import type { DatePickerDate, DatePickerRangeObject } from 'v-calendar/dist/types/src/use/datePicker'
import 'v-calendar/dist/style.css'

const props = defineProps({
  modelValue: {
    type: [Date, Object] as PropType<DatePickerDate | DatePickerRangeObject | null>,
    default: null
  },
  type: {
    type: String,
    required: false
  }
})

const emit = defineEmits(['update:model-value', 'close'])

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value)
    emit('close')
  }
})

const attrs = {
  transparent: true,
  borderless: true,
  color: 'primary',
  'is-dark': { selector: 'html', darkClass: 'dark' },
  'first-day-of-week': 2,
}
</script>

<template>
  <VCalendarDatePicker v-if="type == 'single'" v-model="date" v-bind="{ ...attrs, ...$attrs }" />
  <VCalendarDatePicker v-else v-model.range="date" :columns="2" v-bind="{ ...attrs, ...$attrs }" />
</template>

<style>
:root {
  --vc-gray-50: rgb(var(--color-gray-50));
  --vc-gray-100: rgb(var(--color-gray-100));
  --vc-gray-200: rgb(var(--color-gray-200));
  --vc-gray-300: rgb(var(--color-gray-300));
  --vc-gray-400: rgb(var(--color-gray-400));
  --vc-gray-500: rgb(var(--color-gray-500));
  --vc-gray-600: rgb(var(--color-gray-600));
  --vc-gray-700: rgb(var(--color-gray-700));
  --vc-gray-800: rgb(var(--color-gray-800));
  --vc-gray-900: rgb(var(--color-gray-900));
}

.vc-primary {
  --vc-accent-50: rgb(235, 248, 252);
  --vc-accent-100: rgb(207, 237, 246);
  --vc-accent-200: rgb(179, 226, 240);
  --vc-accent-300: rgb(150, 215, 234);
  --vc-accent-400: rgb(122, 204, 228);
  --vc-accent-500: rgb(15, 114, 146);
  --vc-accent-600: rgb(13, 102, 131);
  --vc-accent-700: rgb(11, 89, 115);
  --vc-accent-800: rgb(9, 77, 100);
  --vc-accent-900: rgb(7, 64, 84); 
}
</style>
