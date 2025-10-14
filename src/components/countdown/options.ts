import { trackerPaletteOptions } from '../tracker/registry'
import type { TrackerPaletteName } from '../tracker/palettes'

import type { ButtonSizeOption, CardVariantOption, CountdownConfig } from './types'

export const MAX_COUNTDOWN_STEPS = 20
export const MIN_COUNTDOWN_STEPS = 1
export const DEFAULT_COUNTDOWN_STEPS = 10

export const defaultTitle = 'Ritual Countdown'
export const defaultDescription = 'Track how close you are to the moment of truth.'

export const buttonSizeOptions: ButtonSizeOption[] = [
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

export const cardVariantOptions: CardVariantOption[] = [
  { id: 'square', label: 'Square', variant: { width: '100', height: '100' } },
  { id: 'landscape', label: 'Landscape', variant: { width: '100', height: '50' } },
  { id: 'portrait', label: 'Portrait', variant: { width: '50', height: '100' } },
]

export const defaultPaletteId: TrackerPaletteName =
  (trackerPaletteOptions[0]?.id as TrackerPaletteName) ?? 'fear'

export const defaultCountdownConfig: CountdownConfig = {
  title: defaultTitle,
  description: defaultDescription,
  paletteId: defaultPaletteId,
  iconId: 'hourglass',
  stepCount: DEFAULT_COUNTDOWN_STEPS,
  buttonSizeId: buttonSizeOptions[1]?.id ?? 'standard',
  cardVariantId: cardVariantOptions[0]?.id ?? 'square',
  progress: 0,
}

export const createDefaultCountdownConfig = (): CountdownConfig => ({
  ...defaultCountdownConfig,
})

export const formatPaletteLabel = (id: string) => id.charAt(0).toUpperCase() + id.slice(1)

export const formatProgressLabel = (value: number, total: number) => {
  if (value === 0) return '0 complete (fresh start)'
  if (value === total) return `${value} complete (ready to trigger)`
  return `${value} complete`
}
