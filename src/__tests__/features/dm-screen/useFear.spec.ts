import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { useFear } from '@/features/dm-screen'
import { installMockStorage, uninstallMockStorage } from '@/__tests__/test-utils/mockStorage'

describe('useFear', () => {
  beforeEach(() => {
    const storage = installMockStorage()
    storage.setItem('dh-screen:fearLevel', JSON.stringify({ v: 1, data: 5 }))
  })

  afterEach(() => {
    uninstallMockStorage()
  })

  it('loads the persisted fear level', () => {
    const { fearLevel } = useFear()
    expect(fearLevel.value).toBe(5)
  })

  it('clamps the fear level between 0 and 12', async () => {
    const { fearLevel, setFearLevel } = useFear()
    setFearLevel(20)
    expect(fearLevel.value).toBe(12)
    await nextTick()
    expect(JSON.parse(globalThis.localStorage.getItem('dh-screen:fearLevel')!)).toEqual({ v: 1, data: 12 })

    setFearLevel(-3)
    expect(fearLevel.value).toBe(0)
    await nextTick()
    expect(JSON.parse(globalThis.localStorage.getItem('dh-screen:fearLevel')!)).toEqual({ v: 1, data: 0 })
  })

  it('persists updates to localStorage', async () => {
    const { setFearLevel } = useFear()
    setFearLevel(7)
    await nextTick()
    expect(JSON.parse(globalThis.localStorage.getItem('dh-screen:fearLevel')!)).toEqual({ v: 1, data: 7 })
  })
})
