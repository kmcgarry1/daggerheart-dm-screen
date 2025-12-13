<template>
  <DhCard
    v-if="standaloneCard"
    v-bind="attrs"
    :width-variant="cardVariantComputed.width"
    :height-variant="cardVariantComputed.height"
  >
    <template v-if="title" #title>
      <span
        class="text-[clamp(1.05rem,2.2vw,1.35rem)] uppercase tracking-[0.16em] text-gray-100 dark:text-white font-bold drop-shadow-sm"
      >
        {{ title }}
      </span>
    </template>

    <template #body>
      <div class="flex flex-col gap-3">
        <p
          v-if="description"
          class="text-[clamp(0.8rem,1.4vw,0.95rem)] uppercase tracking-[0.22em] text-gray-200 dark:text-gray-300 font-semibold drop-shadow-sm"
        >
          {{ description }}
        </p>
        <TrackerControlCore
          v-bind="coreBindings"
          @update:modelValue="forwardUpdate"
          @change="forwardChange"
        />
      </div>
    </template>
  </DhCard>
  <div v-else v-bind="attrs" class="flex flex-col gap-3">
    <p
      v-if="title"
      class="text-[clamp(1.05rem,2.2vw,1.35rem)] uppercase tracking-[0.16em] text-gray-100 dark:text-white font-bold drop-shadow-sm"
    >
      {{ title }}
    </p>
    <p
      v-if="description"
      class="text-[clamp(0.8rem,1.4vw,0.95rem)] uppercase tracking-[0.22em] text-gray-200 dark:text-gray-300 font-semibold drop-shadow-sm"
    >
      {{ description }}
    </p>
    <TrackerControlCore
      v-bind="coreBindings"
      @update:modelValue="forwardUpdate"
      @change="forwardChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from 'vue'

import { DhCard } from '@/shared/ui'
import TrackerControlCore from '@/features/tracker/components/TrackerControlCore.vue'
import type { TrackerCardVariant, TrackerOption, TrackerPalette } from '@/features/tracker'

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

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

const attrs = useAttrs()

const cardVariantComputed = computed(() => props.cardVariant ?? { width: '100', height: '100' })

const coreBindings = computed(() => ({
  modelValue: props.modelValue,
  options: props.options,
  palette: props.palette,
  trackLabel: props.trackLabel,
  buttonSizeClasses: props.buttonSizeClasses,
}))

const forwardUpdate = (value: number) => {
  emit('update:modelValue', value)
}

const forwardChange = (value: number) => {
  emit('change', value)
}
</script>
