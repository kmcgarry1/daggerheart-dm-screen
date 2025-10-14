import type { Component } from 'vue'

export type TrackerButtonState = {
  background: string
  border: string
  color: string
  shadow?: string
  iconAccent?: string
  iconFill?: string
}

export type TrackerButtonPalette = {
  base: TrackerButtonState & {
    hoverBorder?: string
    hoverShadow?: string
  }
  active: TrackerButtonState
}

export type TrackerPalette = {
  rail: string
  fill: string
  glow: string
  burst: string
  button: TrackerButtonPalette
}

export type TrackerOption = {
  value: number
  label: string
  icon: Component
  paletteOverride?: Partial<TrackerButtonPalette>
  iconProps?: Record<string, unknown>
}

export type TrackerCardVariant = {
  width?: '20' | '40' | '50' | '100'
  height?: '20' | '40' | '50' | '100'
}
