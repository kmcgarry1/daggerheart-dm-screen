import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { load, remove, save } from '@/shared/utils'
import { installMockStorage, uninstallMockStorage } from '@/__tests__/test-utils/mockStorage'

describe('storage utilities', () => {
  beforeEach(() => {
    installMockStorage()
  })

  afterEach(() => {
    uninstallMockStorage()
  })

  it('serializes values with namespace and version', () => {
    save('theme', 'dark')
    const raw = globalThis.localStorage.getItem('dh-screen:theme')
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!)).toEqual({ v: 1, data: 'dark' })
  })

  it('loads stored values and falls back when missing', () => {
    globalThis.localStorage.setItem('dh-screen:widgets', JSON.stringify({ v: 1, data: ['a'] }))
    expect(load('widgets', [] as string[])).toEqual(['a'])
    expect(load('missing', 42)).toBe(42)
  })

  it('returns fallback when localStorage is unavailable', () => {
    const original = globalThis.localStorage
    uninstallMockStorage()
    expect(load('anything', 7)).toBe(7)
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      writable: true,
      value: original,
    })
  })

  it('ignores malformed payloads', () => {
    globalThis.localStorage.setItem('dh-screen:fearLevel', '{ invalid json')
    expect(load('fearLevel', 0)).toBe(0)
  })

  it('removes stored keys safely', () => {
    save('sidebarCollapsed', true)
    remove('sidebarCollapsed')
    expect(globalThis.localStorage.getItem('dh-screen:sidebarCollapsed')).toBeNull()
  })
})
