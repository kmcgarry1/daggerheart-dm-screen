import { describe, expect, it } from 'vitest'

import {
  createDefaultCountdownConfig,
  defaultCountdownConfig,
  defaultDescription,
  defaultTitle,
  formatPaletteLabel,
  formatProgressLabel,
} from '@/features/countdown'

describe('countdown config helpers', () => {
  it('creates isolated default config instances', () => {
    const configA = createDefaultCountdownConfig()
    const configB = createDefaultCountdownConfig()

    expect(configA).toEqual(defaultCountdownConfig)
    expect(configB).toEqual(defaultCountdownConfig)
    expect(configA).not.toBe(configB)
  })

  it('provides readable default copy', () => {
    expect(defaultTitle).toBe('Ritual Countdown')
    expect(defaultDescription).toContain('moment of truth')
  })

  it('formats palette ids and progress labels', () => {
    expect(formatPaletteLabel('fear')).toBe('Fear')
    expect(formatProgressLabel(0, 10)).toBe('0 complete (fresh start)')
    expect(formatProgressLabel(10, 10)).toBe('10 complete (ready to trigger)')
    expect(formatProgressLabel(3, 10)).toBe('3 complete')
  })
})
