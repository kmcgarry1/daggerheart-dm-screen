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
          v-model="localProgress"
          :options="trackerOptions"
          :palette="selectedPalette"
          :title="titleText"
          :description="descriptionText"
          :track-label="`${titleText} countdown buttons`"
          :card-variant="selectedCardVariant.variant"
          :button-size-classes="selectedButtonSize.classes"
        />
        <CountdownStatusLine :remaining="remainingSteps" :completed="localProgress" />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <label
          class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
        >
          <span>Title</span>
          <input
            :value="config.title"
            type="text"
            placeholder="Countdown title"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            @input="setTitle(($event.target as HTMLInputElement).value)"
          />
        </label>

        <label
          class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
        >
          <span>Description</span>
          <input
            :value="config.description"
            type="text"
            placeholder="Describe what the countdown tracks"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            @input="setDescription(($event.target as HTMLInputElement).value)"
          />
        </label>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <label
          class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
        >
          <span>Palette</span>
          <select
            :value="config.paletteId"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            @change="setPalette(($event.target as HTMLSelectElement).value as TrackerPaletteName)"
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
          <TrackerIconPicker v-model="selectedIconId" :options="availableIconOptions" />
        </label>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <label
          class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
        >
          <span>Total Steps</span>
          <input
            :value="config.stepCount"
            type="number"
            :min="MIN_COUNTDOWN_STEPS"
            :max="MAX_COUNTDOWN_STEPS"
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
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <label
          class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
        >
          <span>Card Layout</span>
          <select
            :value="config.cardVariantId"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            @change="setCardVariant(($event.target as HTMLSelectElement).value)"
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
            :value="config.buttonSizeId"
            class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            @change="setButtonSize(($event.target as HTMLSelectElement).value)"
          >
            <option v-for="option in buttonSizeOptions" :key="option.id" :value="option.id">
              {{ option.label }}
            </option>
          </select>
        </label>
      </div>

      <button type="button" class="self-end dh-toggle px-3 py-2" @click="setProgress(0)">
        Reset Countdown
      </button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { TrackerControl, TrackerIconPicker, trackerIconOptions, type TrackerPaletteName } from '@/features/tracker'
import {
  CountdownStatusLine,
  MAX_COUNTDOWN_STEPS,
  MIN_COUNTDOWN_STEPS,
  buttonSizeOptions,
  cardVariantOptions,
  createDefaultCountdownConfig,
  formatPaletteLabel,
  formatProgressLabel,
  paletteOptions,
  useCountdownConfigurator,
} from '@/features/countdown'

const baseConfig = createDefaultCountdownConfig()
const config = ref(baseConfig)

const {
  trackerOptions,
  progressOptions,
  selectedPalette,
  selectedButtonSize,
  selectedCardVariant,
  titleText,
  descriptionText,
  remainingSteps,
  localProgress,
  setProgress,
  handleStepInput,
  setPalette,
  setIcon,
  setCardVariant,
  setButtonSize,
  setTitle,
  setDescription,
  totalSteps,
} = useCountdownConfigurator({ config })

const availableIconOptions = trackerIconOptions

const selectedIconId = computed({
  get: () => config.value.iconId ?? availableIconOptions[0]?.id ?? '',
  set: (value: string) => setIcon(value),
})
</script>
