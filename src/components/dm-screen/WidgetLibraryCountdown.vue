<template>
  <section class="flex flex-col gap-5">
    <header class="space-y-1">
      <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--dh-panel-muted)]">
        Countdown Widget
      </p>
      <h3 class="text-lg font-semibold text-[color:var(--dh-panel-text)]">
        Custom Countdown Tracker
      </h3>
      <p class="text-sm text-[color:var(--dh-panel-muted)]">
        Use the tracker toolkit to tune a countdown card with your own pacing, palette, and controls.
      </p>
    </header>

    <div class="glass-block flex flex-col gap-6 p-5">
      <div class="flex flex-col gap-3">
        <TrackerControl
          v-model="elapsedSteps"
          :options="trackerOptions"
          :palette="selectedPalette"
          :title="title"
          :description="description"
          :track-label="trackLabel"
          :card-variant="selectedCardVariant"
          :button-size-classes="selectedButtonSize.classes"
        />
        <p class="text-sm font-semibold text-[color:var(--dh-panel-muted)]" aria-live="polite">
          {{ remainingSteps }} steps remaining · {{ elapsedSteps }} complete
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <label
          class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
        >
          <span>Title</span>
          <select
            v-model="selectedTitleId"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            <option v-for="option in titleOptions" :key="option.id" :value="option.id">
              {{ option.label }}
            </option>
          </select>
        </label>

        <label
          class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
        >
          <span>Description</span>
          <select
            v-model="selectedDescriptionId"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            <option v-for="option in descriptionOptions" :key="option.id" :value="option.id">
              {{ option.text }}
            </option>
          </select>
        </label>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <label
          class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
        >
          <span>Palette</span>
          <select
            v-model="selectedPaletteId"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
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
            v-model="selectedIconId"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            <option v-for="option in iconOptions" :key="option.id" :value="option.id">
              {{ option.label }}
            </option>
          </select>
        </label>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <label
          class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
        >
          <span>Total Steps</span>
          <select
            v-model.number="selectedStepCount"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            <option v-for="option in stepCountOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>

        <label
          class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
        >
          <span>Current Progress</span>
          <select
            v-model.number="elapsedSteps"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            <option v-for="value in progressOptions" :key="value" :value="value">
              {{ formatProgressLabel(value, totalSteps) }}
            </option>
          </select>
        </label>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <label
          class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
        >
          <span>Card Layout</span>
          <select
            v-model="selectedCardVariantId"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
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
            v-model="selectedButtonSizeId"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            <option v-for="option in buttonSizeOptions" :key="option.id" :value="option.id">
              {{ option.label }}
            </option>
          </select>
        </label>
      </div>

      <button type="button" class="self-end dh-toggle px-3 py-2" @click="elapsedSteps = 0">
        Reset Countdown
      </button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

import TrackerControl from '../tracker/TrackerControl.vue'
import { trackerIconOptions, trackerPaletteOptions } from '../tracker/registry'
import type { TrackerCardVariant, TrackerPalette } from '../tracker/types'

type StepOption = {
  value: number
  label: string
}

type ButtonSizeOption = {
  id: string
  label: string
  classes: string
}

type CardVariantOption = {
  id: string
  label: string
  variant: TrackerCardVariant
}

type TitleOption = {
  id: string
  label: string
}

type DescriptionOption = {
  id: string
  text: string
}

const stepCountOptions: StepOption[] = [
  { value: 4, label: '4 steps' },
  { value: 6, label: '6 steps' },
  { value: 8, label: '8 steps' },
  { value: 10, label: '10 steps' },
  { value: 12, label: '12 steps' },
  { value: 20, label: '20 steps' },
]

const buttonSizeOptions: ButtonSizeOption[] = [
  { id: 'compact', label: 'Compact', classes: 'h-[2.4rem] w-[2.4rem]' },
  {
    id: 'standard',
    label: 'Standard',
    classes: 'h-[clamp(2.8rem,_4vw,_3.4rem)] w-[clamp(2.8rem,_4vw,_3.4rem)]',
  },
  {
    id: 'roomy',
    label: 'Roomy',
    classes: 'h-[clamp(3.2rem,_4.6vw,_3.8rem)] w-[clamp(3.2rem,_4.6vw,_3.8rem)]',
  },
]

const cardVariantOptions: CardVariantOption[] = [
  { id: 'square', label: 'Square', variant: { width: '100', height: '100' } },
  { id: 'landscape', label: 'Landscape', variant: { width: '100', height: '50' } },
  { id: 'portrait', label: 'Portrait', variant: { width: '50', height: '100' } },
]

const titleOptions: TitleOption[] = [
  { id: 'ritual', label: 'Ritual Countdown' },
  { id: 'doom', label: 'Doom Clock' },
  { id: 'mission', label: 'Mission Timer' },
]

const descriptionOptions: DescriptionOption[] = [
  { id: 'tense', text: 'Track how close you are to the moment of truth.' },
  { id: 'ritual', text: 'Each step marks a ritual milestone on the path.' },
  { id: 'battle', text: 'Keep tension high as the timer ticks toward disaster.' },
]

const paletteOptions = trackerPaletteOptions
const iconOptions = trackerIconOptions

const defaultPaletteId = paletteOptions[0]?.id ?? 'fear'
const defaultIconId = iconOptions[0]?.id ?? 'skull'

const selectedTitleId = ref(titleOptions[0]?.id ?? '')
const selectedDescriptionId = ref(descriptionOptions[0]?.id ?? '')
const selectedPaletteId = ref(defaultPaletteId)
const selectedIconId = ref(defaultIconId)
const selectedButtonSizeId = ref(buttonSizeOptions[1]?.id ?? buttonSizeOptions[0]?.id ?? 'standard')
const selectedCardVariantId = ref(cardVariantOptions[0]?.id ?? 'square')
const selectedStepCount = ref(stepCountOptions[3]?.value ?? 10)
const elapsedSteps = ref(0)

const totalSteps = computed(() => selectedStepCount.value)

const selectedPalette = computed<TrackerPalette>(() => {
  const match = paletteOptions.find((option) => option.id === selectedPaletteId.value)
  return match?.palette ?? paletteOptions[0]?.palette ?? trackerPaletteOptions[0].palette
})

const selectedIcon = computed(() => {
  const match = iconOptions.find((option) => option.id === selectedIconId.value)
  return match?.icon ?? iconOptions[0]?.icon
})

const selectedButtonSize = computed(() => {
  const match = buttonSizeOptions.find((option) => option.id === selectedButtonSizeId.value)
  return match ?? buttonSizeOptions[0]
})

const selectedCardVariant = computed<TrackerCardVariant>(() => {
  const match = cardVariantOptions.find((option) => option.id === selectedCardVariantId.value)
  return match?.variant ?? cardVariantOptions[0]?.variant ?? { width: '100', height: '100' }
})

const title = computed(() => {
  const match = titleOptions.find((option) => option.id === selectedTitleId.value)
  return match?.label ?? titleOptions[0]?.label ?? 'Countdown'
})

const description = computed(() => {
  const match = descriptionOptions.find((option) => option.id === selectedDescriptionId.value)
  return match?.text ?? descriptionOptions[0]?.text ?? ''
})

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

const remainingSteps = computed(() => Math.max(totalSteps.value - elapsedSteps.value, 0))

const trackLabel = computed(() => `${title.value} countdown buttons`)

watch(totalSteps, (next) => {
  if (elapsedSteps.value > next) {
    elapsedSteps.value = next
  }
})

const formatPaletteLabel = (id: string) => id.charAt(0).toUpperCase() + id.slice(1)

const formatProgressLabel = (value: number, total: number) => {
  if (value === 0) return '0 complete (fresh start)'
  if (value === total) return `${value} complete (ready to trigger)`
  return `${value} complete`
}
</script>
