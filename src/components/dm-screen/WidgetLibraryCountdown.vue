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
          {{ remainingSteps }} steps remaining - {{ elapsedSteps }} complete
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <label
          class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
        >
          <span>Title</span>
          <input
            v-model.trim="titleInput"
            type="text"
            placeholder="Countdown title"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          />
        </label>

        <label
          class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
        >
          <span>Description</span>
          <input
            v-model.trim="descriptionInput"
            type="text"
            placeholder="Describe what the countdown tracks"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          />
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
          <input
            :value="stepCount"
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

import {
  MAX_COUNTDOWN_STEPS,
  MIN_COUNTDOWN_STEPS,
  buttonSizeOptions,
  cardVariantOptions,
  createDefaultCountdownConfig,
  defaultDescription,
  defaultTitle,
  formatPaletteLabel,
  formatProgressLabel,
} from '../countdown/options'

const paletteOptions = trackerPaletteOptions
const iconOptions = trackerIconOptions
const fallbackPalette = (paletteOptions[0]?.palette ?? trackerPaletteOptions[0]?.palette)!
const fallbackIcon = (iconOptions[0]?.icon ?? trackerIconOptions[0]?.icon)!
const fallbackButtonSize = buttonSizeOptions[0]!
const fallbackCardVariant = cardVariantOptions[0]!

const baseConfig = createDefaultCountdownConfig()

const titleInput = ref(baseConfig.title)
const descriptionInput = ref(baseConfig.description)
const selectedPaletteId = ref(baseConfig.paletteId)
const selectedIconId = ref(baseConfig.iconId)
const selectedButtonSizeId = ref(baseConfig.buttonSizeId)
const selectedCardVariantId = ref(baseConfig.cardVariantId)
const stepCount = ref(baseConfig.stepCount)
const elapsedSteps = ref(baseConfig.progress)

const maxSteps = MAX_COUNTDOWN_STEPS
const minSteps = MIN_COUNTDOWN_STEPS

const clampStepCount = (value: number) =>
  Math.max(MIN_COUNTDOWN_STEPS, Math.min(MAX_COUNTDOWN_STEPS, Math.round(value || 0)))

const totalSteps = computed(() => clampStepCount(stepCount.value))

const selectedPalette = computed<TrackerPalette>(() => {
  const match = paletteOptions.find((option) => option.id === selectedPaletteId.value)
  return match?.palette ?? fallbackPalette
})

const selectedIcon = computed(() => {
  const match = iconOptions.find((option) => option.id === selectedIconId.value)
  return match?.icon ?? fallbackIcon
})

const selectedButtonSize = computed(() => {
  const match = buttonSizeOptions.find((option) => option.id === selectedButtonSizeId.value)
  return match ?? fallbackButtonSize
})

const selectedCardVariant = computed<TrackerCardVariant>(() => {
  const match = cardVariantOptions.find((option) => option.id === selectedCardVariantId.value)
  return match?.variant ?? fallbackCardVariant.variant
})

const title = computed(() => titleInput.value.trim() || defaultTitle)
const description = computed(() => descriptionInput.value.trim() || defaultDescription)

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

const handleStepInput = (value: string) => {
  const parsed = Number(value)
  if (Number.isNaN(parsed)) {
    stepCount.value = MIN_COUNTDOWN_STEPS
    return
  }
  stepCount.value = clampStepCount(parsed)
}

watch(stepCount, (next) => {
  const clamped = clampStepCount(next)
  if (clamped !== next) {
    stepCount.value = clamped
  }
})

watch(totalSteps, (next) => {
  if (elapsedSteps.value > next) {
    elapsedSteps.value = next
  }
})

watch(elapsedSteps, (next) => {
  if (Number.isNaN(next) || next < 0) {
    elapsedSteps.value = 0
  } else if (next > totalSteps.value) {
    elapsedSteps.value = totalSteps.value
  }
})
</script>
