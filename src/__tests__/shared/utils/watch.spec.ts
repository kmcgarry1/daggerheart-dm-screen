import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { watchDebounced } from '@/shared/utils'

describe('watchDebounced', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces successive updates', async () => {
    const source = ref(0)
    const spy = vi.fn()

    const stop = watchDebounced(source, spy, { debounce: 100 })

    source.value = 1
    await nextTick()
    await vi.advanceTimersByTimeAsync(50)
    expect(spy).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(50)
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(1, 0, expect.any(Function))

    source.value = 2
    await nextTick()
    await vi.advanceTimersByTimeAsync(100)
    await nextTick()

    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenLastCalledWith(2, 1, expect.any(Function))

    stop()
  })

  it('flushes after maxWait even when debounce keeps resetting', async () => {
    const source = ref(0)
    const spy = vi.fn()

    const stop = watchDebounced(source, spy, { debounce: 200, maxWait: 500 })

    source.value = 1
    await nextTick()
    await vi.advanceTimersByTimeAsync(150)

    source.value = 2
    await nextTick()
    await vi.advanceTimersByTimeAsync(150)

    source.value = 3
    await nextTick()
    await vi.advanceTimersByTimeAsync(199)
    expect(spy).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(3, 2, expect.any(Function))

    stop()
  })
})
