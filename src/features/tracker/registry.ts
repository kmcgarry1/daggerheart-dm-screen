import type { Component } from 'vue'

import { BellIcon, BoltIcon, ClockIcon, FlameIcon, GemIcon, HourglassIcon, SkullIcon, StarIcon } from './icons'
import { trackerPalettes } from './palettes'

export type TrackerIconOption = {
  id: string
  label: string
  icon: Component
}

export const trackerIconOptions: TrackerIconOption[] = [
  { id: 'hourglass', label: 'Hourglass', icon: HourglassIcon },
  { id: 'skull', label: 'Skull', icon: SkullIcon },
  { id: 'flame', label: 'Flame', icon: FlameIcon },
  { id: 'gem', label: 'Gem', icon: GemIcon },
  { id: 'bolt', label: 'Bolt', icon: BoltIcon },
  { id: 'bell', label: 'Bell', icon: BellIcon },
  { id: 'star', label: 'Star', icon: StarIcon },
  { id: 'clock', label: 'Clock', icon: ClockIcon },
]

export const trackerPaletteOptions = Object.entries(trackerPalettes).map(([id, palette]) => ({
  id,
  palette,
}))
