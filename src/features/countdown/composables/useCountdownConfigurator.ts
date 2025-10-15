import { computed } from 'vue'
import type { Ref } from 'vue'

import { trackerIconOptions, trackerPaletteOptions, type TrackerPaletteName } from '@/features/tracker'
import {
  MAX_COUNTDOWN_STEPS,
  MIN_COUNTDOWN_STEPS,
  buttonSizeOptions,
  cardVariantOptions,
  defaultTitle,
  formatPaletteLabel,
  formatProgressLabel,
} from './options'
import type { ButtonSizeOption, CardVariantOption, CountdownConfig } from './types'

const clampStepCount = (value: number) =>
  Math.max(MIN_COUNTDOWN_STEPS, Math.min(MAX_COUNTDOWN_STEPS, Math.round(value || 0)))

const normalizeConfig = (config: CountdownConfig): CountdownConfig => {
  const stepCount = clampStepCount(config.stepCount)
  const progress = Math.max(0, Math.min(config.progress ?? 0, stepCount))
  return {
    ...config,
    stepCount,
    progress,
    title: (config.title ?? '').trim(),
    description: (config.description ?? '').trim(),
  }
}

export interface CountdownConfiguratorContext {
  config: Ref<CountdownConfig>
  onCommit?: (payload: { config: CountdownConfig; title: string; description: string }) => void
}

export const paletteOptions = trackerPaletteOptions
export const iconOptions = trackerIconOptions
export {
  buttonSizeOptions,
  cardVariantOptions,
  formatPaletteLabel,
  formatProgressLabel,
  MAX_COUNTDOWN_STEPS,
  MIN_COUNTDOWN_STEPS,
}

export function useCountdownConfigurator({ config, onCommit }: CountdownConfiguratorContext) {
  const fallbackPalette = (paletteOptions[0]?.palette ?? trackerPaletteOptions[0]?.palette)!
  const fallbackIcon = (iconOptions[0]?.icon ?? trackerIconOptions[0]?.icon)!
  const fallbackButtonSize = buttonSizeOptions[0]!
  const fallbackCardVariant = cardVariantOptions[0]!

  config.value = normalizeConfig(config.value)

  const applyUpdate = (update: Partial<CountdownConfig>) => {
    const next = normalizeConfig({
      ...config.value,
      ...update,
    })
    config.value = next
    onCommit?.({
      config: next,
      title: next.title.length > 0 ? next.title : defaultTitle,
      description: next.description,
    })
  }

  const selectedPalette = computed(() => {
    const match = paletteOptions.find((option) => option.id === config.value.paletteId)
    return match?.palette ?? fallbackPalette
  })

  const selectedIcon = computed(() => {
    const match = iconOptions.find((option) => option.id === config.value.iconId)
    return match?.icon ?? fallbackIcon
  })

  const selectedButtonSize = computed<ButtonSizeOption>(() => {
    const match = buttonSizeOptions.find((option) => option.id === config.value.buttonSizeId)
    return match ?? fallbackButtonSize
  })

  const selectedCardVariant = computed<CardVariantOption>(() => {
    const match = cardVariantOptions.find((option) => option.id === config.value.cardVariantId)
    return match ?? fallbackCardVariant
  })

  const totalSteps = computed(() => clampStepCount(config.value.stepCount))

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

  const progressOptions = computed(() => Array.from({ length: totalSteps.value + 1 }, (_, index) => index))

  const setProgress = (value: number) => {
    applyUpdate({ progress: Math.max(0, Math.min(value, totalSteps.value)) })
  }

  const handleStepInput = (value: string) => {
    const parsed = Number(value)
    if (Number.isNaN(parsed)) {
      applyUpdate({ stepCount: MIN_COUNTDOWN_STEPS })
      return
    }
    applyUpdate({ stepCount: parsed })
  }

  const titleText = computed(() => {
    const raw = config.value.title?.trim()
    return raw && raw.length > 0 ? raw : defaultTitle
  })

  const descriptionText = computed(() => config.value.description?.trim() ?? '')

  const remainingSteps = computed(() => Math.max(totalSteps.value - config.value.progress, 0))

  const localProgress = computed({
    get: () => Math.max(0, Math.min(config.value.progress, totalSteps.value)),
    set: (value: number) => setProgress(value),
  })

  const setPalette = (paletteId: TrackerPaletteName) => applyUpdate({ paletteId })
  const setIcon = (iconId: string) => applyUpdate({ iconId })
  const setCardVariant = (cardVariantId: string) => applyUpdate({ cardVariantId })
  const setButtonSize = (buttonSizeId: string) => applyUpdate({ buttonSizeId })
  const setTitle = (title: string) => applyUpdate({ title })
  const setDescription = (description: string) => applyUpdate({ description })

  return {
    paletteOptions,
    iconOptions,
    buttonSizeOptions,
    cardVariantOptions,
    totalSteps,
    trackerOptions,
    progressOptions,
    selectedPalette,
    selectedIcon,
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
  }
}
