<template>
  <TrackerControl
    :model-value="value"
    :options="options"
    :palette="palette"
    title="Fear"
    description="Track rising dread across the table."
    track-label="Fear level buttons"
    :card-variant="{ width: '100', height: '100' }"
    @update:modelValue="handleUpdate"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import TrackerControl from '../tracker/TrackerControl.vue'
import { fearPalette } from '../tracker/palettes'
import { SkullIcon } from '../tracker/icons'

const props = defineProps<{
  value: number
}>()

const emit = defineEmits<{
  (e: 'update:value', value: number): void
}>()

const totalSteps = 12
const palette = fearPalette

const options = computed(() =>
  Array.from({ length: totalSteps }, (_, index) => {
    const level = index + 1
    return {
      value: level,
      label: `Set fear to ${level}`,
      icon: SkullIcon,
    }
  }),
)

const handleUpdate = (value: number) => {
  emit('update:value', value)
}
</script>
