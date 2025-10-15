<template>
  <DhCard
    v-if="standaloneCard"
    v-bind="attrs"
    :width-variant="cardVariantComputed.width"
    :height-variant="cardVariantComputed.height"
  >
    <template v-if="title" #title>
      {{ title }}
    </template>

    <template #body>
      <TrackerControlCore
        v-bind="coreBindings"
        @update:modelValue="onUpdate"
        @change="onChange"
      />
    </template>
  </DhCard>
  <TrackerControlCore
    v-else
    v-bind="{ ...attrs, ...coreBindings }"
    @update:modelValue="onUpdate"
    @change="onChange"
  />
</template>

<script lang="ts" setup>
import { computed, useAttrs } from 'vue'

import DhCard from '../core/DhCard.vue'
import TrackerControlCore from './TrackerControlCore.vue'
import type { TrackerCardVariant, TrackerOption, TrackerPalette } from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    modelValue: number
    options: TrackerOption[]
    palette: TrackerPalette
    title?: string
    description?: string
    trackLabel?: string
    cardVariant?: TrackerCardVariant
    buttonSizeClasses?: string
    standaloneCard?: boolean
  }>(),
  {
    title: undefined,
    description: undefined,
    trackLabel: 'Tracker options',
    cardVariant: () => ({
      width: '100',
      height: '100',
    }),
    buttonSizeClasses: 'h-[clamp(2.8rem,_4vw,_3.4rem)] w-[clamp(2.8rem,_4vw,_3.4rem)]',
    standaloneCard: true,
  },
)

const emit = defineEmits<{ (e: 'update:modelValue', value: number): void; (e: 'change', value: number): void }>()

const attrs = useAttrs()

const cardVariantComputed = computed(() => props.cardVariant ?? { width: '100', height: '100' })

const coreBindings = computed(() => ({
  modelValue: props.modelValue,
  options: props.options,
  palette: props.palette,
  description: props.description,
  trackLabel: props.trackLabel,
  buttonSizeClasses: props.buttonSizeClasses,
}))

const onUpdate = (value: number) => {
  emit('update:modelValue', value)
}

const onChange = (value: number) => {
  emit('change', value)
}
</script>
