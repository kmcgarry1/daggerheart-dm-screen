<template>
  <div class="flex flex-col gap-4">
    <TrackerControl
      v-model="localProgress"
      :options="trackerOptions"
      :palette="selectedPalette"
      :description="descriptionText"
      :track-label="`${titleText} countdown buttons`"
      :card-variant="selectedCardVariant.variant"
      :button-size-classes="selectedButtonSize.classes"
      :standalone-card="false"
    />

    <p class="text-sm font-semibold text-[color:var(--dh-panel-muted)]" aria-live="polite">
      {{ remainingSteps }} steps remaining - {{ localProgress }} complete
    </p>

    <div v-if="editing" class="grid gap-4 md:grid-cols-2">
      <label
        class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
      >
        <span>Title</span>
        <input
          :value="localConfig.title"
          type="text"
          placeholder="Countdown title"
          class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          @input="updateConfig({ title: ($event.target as HTMLInputElement).value })"
        />
      </label>

      <label
        class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
      >
        <span>Description</span>
        <input
          :value="localConfig.description"
          type="text"
          placeholder="Describe what the countdown tracks"
          class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          @input="updateConfig({ description: ($event.target as HTMLInputElement).value })"
        />
      </label>

      <label
        class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
      >
        <span>Palette</span>
        <select
          :value="localConfig.paletteId"
          class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          @change="
            updateConfig({
              paletteId: ($event.target as HTMLSelectElement).value as TrackerPaletteName,
            })
          "
        >
          <option v-for="option in paletteOptions" :key="option.id" :value="option.id">
            {{ formatPaletteLabel(option.id) }}
          </option>
        </select>
      </label>

      <label
        class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
      >
        <span>Icon</span>
        <select
          :value="localConfig.iconId"
          class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          @change="updateConfig({ iconId: ($event.target as HTMLSelectElement).value })"
        >
          <option v-for="option in iconOptions" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label
        class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
      >
        <span>Total Steps</span>
        <input
          :value="localConfig.stepCount"
          type="number"
          :min="minSteps"
          :max="maxSteps"
          class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          @input="handleStepInput(($event.target as HTMLInputElement).value)"
        />
      </label>

      <label
        class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
      >
        <span>Current Progress</span>
        <select
          :value="localProgress"
          class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          @change="setProgress(Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="value in progressOptions" :key="value" :value="value">
            {{ formatProgressLabel(value, totalSteps) }}
          </option>
        </select>
      </label>

      <label
        class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
      >
        <span>Card Layout</span>
        <select
          :value="localConfig.cardVariantId"
          class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          @change="updateConfig({ cardVariantId: ($event.target as HTMLSelectElement).value })"
        >
          <option v-for="option in cardVariantOptions" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label
        class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
      >
        <span>Button Size</span>
        <select
          :value="localConfig.buttonSizeId"
          class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          @change="updateConfig({ buttonSizeId: ($event.target as HTMLSelectElement).value })"
        >
          <option v-for="option in buttonSizeOptions" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <button
      v-if="editing"
      type="button"
      class="self-end dh-toggle px-3 py-2"
      @click="setProgress(0)"
    >
      Reset Countdown
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'

import TrackerControl from '../tracker/TrackerControl.vue'
import { trackerIconOptions, trackerPaletteOptions } from '../tracker/registry'
import type { TrackerPaletteName } from '../tracker/palettes'

import {
  MAX_COUNTDOWN_STEPS,
  MIN_COUNTDOWN_STEPS,
  buttonSizeOptions,
  cardVariantOptions,
  defaultTitle,
  formatPaletteLabel,
  formatProgressLabel,
} from './options'
import type { ButtonSizeOption, CountdownConfig } from './types'

const props = defineProps<{
  config: CountdownConfig
  editing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:config', payload: { config: CountdownConfig; title: string; description: string }): void
}>()

const paletteOptions = trackerPaletteOptions
const iconOptions = trackerIconOptions
const fallbackPalette = (paletteOptions[0]?.palette ?? trackerPaletteOptions[0]?.palette)!
const fallbackIcon = (iconOptions[0]?.icon ?? trackerIconOptions[0]?.icon)!
const fallbackButtonSize = buttonSizeOptions[0]!
const fallbackCardVariant = cardVariantOptions[0]!

const localConfig = computed(() => props.config)

const totalSteps = computed(() =>
  Math.max(
    MIN_COUNTDOWN_STEPS,
    Math.min(MAX_COUNTDOWN_STEPS, Math.round(localConfig.value.stepCount || MIN_COUNTDOWN_STEPS)),
  ),
)

const selectedPalette = computed(() => {
  const match = paletteOptions.find((option) => option.id === localConfig.value.paletteId)
  return match?.palette ?? fallbackPalette
})

const selectedIcon = computed(() => {
  const match = iconOptions.find((option) => option.id === localConfig.value.iconId)
  return match?.icon ?? fallbackIcon
})

const selectedButtonSize = computed<ButtonSizeOption>(() => {
  const match = buttonSizeOptions.find((option) => option.id === localConfig.value.buttonSizeId)
  return match ?? fallbackButtonSize
})

const selectedCardVariant = computed(() => {
  const match = cardVariantOptions.find((option) => option.id === localConfig.value.cardVariantId)
  return match ?? fallbackCardVariant
})

const titleText = computed(() => {
  const raw = localConfig.value.title?.trim()
  return raw && raw.length > 0 ? raw : defaultTitle
})

const descriptionText = computed(() => localConfig.value.description?.trim() ?? '')

const maxSteps = MAX_COUNTDOWN_STEPS
const minSteps = MIN_COUNTDOWN_STEPS

const clampStepCount = (value: number) =>
  Math.max(MIN_COUNTDOWN_STEPS, Math.min(MAX_COUNTDOWN_STEPS, Math.round(value || 0)))

const trackerOptions = computed(() =>
  Array.from({ length: totalSteps.value }, (_, index) => {
    const step = index + 1
    return {
      value: step,
      label: `Mark step ${step} complete`,
      icon: selectedIcon.value,
    }
  }),
)

const progressOptions = computed(() =>
  Array.from({ length: totalSteps.value + 1 }, (_, index) => index),
)

const localProgress = computed({
  get: () => Math.max(0, Math.min(localConfig.value.progress, totalSteps.value)),
  set: (value: number) => {
    setProgress(value)
  },
})

const remainingSteps = computed(() => Math.max(totalSteps.value - localProgress.value, 0))

const handleStepInput = (value: string) => {
  const parsed = Number(value)
  if (Number.isNaN(parsed)) {
    updateConfig({ stepCount: MIN_COUNTDOWN_STEPS })
    return
  }
  updateConfig({ stepCount: parsed })
}

const updateConfig = (update: Partial<CountdownConfig>) => {
  const next: CountdownConfig = {
    ...localConfig.value,
    ...update,
  }

  next.stepCount = clampStepCount(next.stepCount)
  next.progress = Math.max(0, Math.min(next.progress ?? 0, next.stepCount))
  next.title = (next.title ?? '').trim()
  next.description = (next.description ?? '').trim()

  emit('update:config', {
    config: next,
    title: next.title.length > 0 ? next.title : defaultTitle,
    description: next.description,
  })
}

const setProgress = (value: number) => {
  updateConfig({ progress: Math.max(0, Math.min(value, totalSteps.value)) })
}

watch(
  () => localConfig.value.stepCount,
  (next) => {
    if (localConfig.value.progress > next) {
      updateConfig({ progress: next })
    }
  },
)
</script>
