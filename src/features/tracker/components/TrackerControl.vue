<template>
  <DhCard
    v-if="standaloneCard"
    v-bind="attrs"
    :width-variant="cardVariantComputed.width"
    :height-variant="cardVariantComputed.height"
  >
    <template v-if="title" #title>
      <span class="tracker-heading">
        {{ title }}
      </span>
    </template>

    <template #body>
      <div class="flex flex-col gap-3">
        <p v-if="description" class="tracker-subheading">
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
    <p v-if="title" class="tracker-heading">
      {{ title }}
    </p>
    <p v-if="description" class="tracker-subheading">
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

<style scoped>
.tracker-heading {
  font-size: clamp(1.05rem, 2.2vw, 1.35rem);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--dh-panel-text, rgba(255, 255, 255, 0.95));
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
}

.tracker-subheading {
  font-size: clamp(0.8rem, 1.4vw, 0.95rem);
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--dh-panel-muted-strong, rgba(255, 255, 255, 0.75));
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}
</style>
