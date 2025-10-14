import type { Component } from 'vue'

import { FlameIcon, GemIcon, SkullIcon } from './icons'
import { trackerPalettes } from './palettes'

export type TrackerIconOption = {
  id: string
  label: string
  icon: Component
}

export const trackerIconOptions: TrackerIconOption[] = [
  { id: 'skull', label: 'Skull', icon: SkullIcon },
  { id: 'flame', label: 'Flame', icon: FlameIcon },
  { id: 'gem', label: 'Gem', icon: GemIcon },
]

export const trackerPaletteOptions = Object.entries(trackerPalettes).map(([id, palette]) => ({
  id,
  palette,
}))
