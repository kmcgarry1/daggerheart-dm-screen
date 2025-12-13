<template>
  <div v-bind="attrs" class="flex flex-col gap-3">
    <p
      v-if="description"
      class="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--dh-panel-muted)]"
    >
      {{ description }}
    </p>
    <TrackerBar
      :model-value="modelValue"
      :options="options"
      :palette="palette"
      :track-label="trackLabel"
      :button-size-classes="buttonSizeClasses"
      @update:modelValue="emit('update:modelValue', $event)"
      @change="emit('change', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { useAttrs } from 'vue'

import TrackerBar from '@/features/tracker/components/TrackerBar.vue'
import type { TrackerOption, TrackerPalette } from '@/features/tracker'

const props = withDefaults(
  defineProps<{
    modelValue: number
    options: TrackerOption[]
    palette: TrackerPalette
    trackLabel?: string
    description?: string
    buttonSizeClasses?: string
  }>(),
  {
    trackLabel: 'Tracker options',
    description: undefined,
    buttonSizeClasses: 'h-[clamp(2.8rem,_4vw,_3.4rem)] w-[clamp(2.8rem,_4vw,_3.4rem)]',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

const attrs = useAttrs()
</script>
