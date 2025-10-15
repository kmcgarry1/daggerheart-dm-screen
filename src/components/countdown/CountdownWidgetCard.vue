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

    <CountdownStatusLine :remaining="remainingSteps" :completed="localProgress" />

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
          @input="setTitle(($event.target as HTMLInputElement).value)"
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
          @input="setDescription(($event.target as HTMLInputElement).value)"
        />
      </label>

      <label
        class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
      >
        <span>Palette</span>
        <select
          :value="localConfig.paletteId"
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
        <select
          :value="localConfig.iconId"
          class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          @change="setIcon(($event.target as HTMLSelectElement).value)"
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

      <label
        class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
      >
        <span>Card Layout</span>
        <select
          :value="localConfig.cardVariantId"
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
          :value="localConfig.buttonSizeId"
          class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          @change="setButtonSize(($event.target as HTMLSelectElement).value)"
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
import { ref, watch, toRaw } from 'vue'

import TrackerControl from '../tracker/TrackerControl.vue'
import CountdownStatusLine from './CountdownStatusLine.vue'
import {
  MAX_COUNTDOWN_STEPS,
  MIN_COUNTDOWN_STEPS,
  formatPaletteLabel,
  formatProgressLabel,
  useCountdownConfigurator,
  paletteOptions,
  iconOptions,
  buttonSizeOptions,
  cardVariantOptions,
} from './useCountdownConfigurator'
import type { CountdownConfig } from './types'
import type { TrackerPaletteName } from '../tracker/palettes'

const props = defineProps<{
  config: CountdownConfig
  editing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:config', payload: { config: CountdownConfig; title: string; description: string }): void
}>()

const cloneConfig = (config: CountdownConfig): CountdownConfig => {
  const rawConfig = toRaw(config)

  if (typeof structuredClone === 'function') {
    return structuredClone(rawConfig)
  }

  return JSON.parse(JSON.stringify(rawConfig))
}
const localConfig = ref<CountdownConfig>(cloneConfig(props.config))

watch(
  () => props.config,
  (next) => {
    localConfig.value = cloneConfig(next)
  },
  { deep: true },
)

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
} = useCountdownConfigurator({
  config: localConfig,
  onCommit: (payload) => emit('update:config', payload),
})
</script>
