import type { TrackerCardVariant } from '../tracker/types'
import type { TrackerPaletteName } from '../tracker/palettes'

export type CountdownConfig = {
  title: string
  description: string
  paletteId: TrackerPaletteName
  iconId: string
  stepCount: number
  buttonSizeId: string
  cardVariantId: string
  progress: number
}

export type ButtonSizeOption = {
  id: string
  label: string
  classes: string
}

export type CardVariantOption = {
  id: string
  label: string
  variant: TrackerCardVariant
}
