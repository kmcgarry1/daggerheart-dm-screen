import { watch } from 'vue'
import type { WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue'

interface InternalWatchOptions<T> extends WatchOptions<T> {
  debounce?: number
  maxWait?: number
  leading?: boolean
}

export function watchDebounced<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T, T | undefined>,
  options?: InternalWatchOptions<T>,
): WatchStopHandle
export function watchDebounced<T extends ReadonlyArray<unknown>>(
  source: WatchSource<T[number]>[],
  callback: WatchCallback<T, T | undefined>,
  options?: InternalWatchOptions<T>,
): WatchStopHandle
export function watchDebounced(
  source: WatchSource<unknown> | WatchSource<unknown>[],
  callback: WatchCallback<unknown, unknown> | WatchCallback<unknown[], unknown[]>,
  options: InternalWatchOptions<unknown> = {},
): WatchStopHandle {
  const { debounce = 0, maxWait, leading = false, ...watchOptions } = options
  let timer: ReturnType<typeof setTimeout> | null = null
  let maxTimer: ReturnType<typeof setTimeout> | null = null
  let hasPending = false
  let lastValue: unknown
  let lastOldValue: unknown

  const clearDebounceTimer = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  const clearMaxTimer = () => {
    if (maxTimer !== null) {
      clearTimeout(maxTimer)
      maxTimer = null
    }
  }

  const clearTimers = () => {
    clearDebounceTimer()
    clearMaxTimer()
  }

  const runCallback = (value: unknown, oldValue: unknown) => {
    ;(callback as WatchCallback<unknown, unknown>)(value, oldValue, () => {})
  }

  const flush = () => {
    clearTimers()
    hasPending = false
    runCallback(lastValue, lastOldValue)
  }

  const schedule = (value: unknown, oldValue: unknown) => {
    lastValue = value
    lastOldValue = oldValue

    if (debounce <= 0) {
      runCallback(value, oldValue)
      return
    }

    if (leading && !hasPending) {
      runCallback(value, oldValue)
    }

    hasPending = true
    clearDebounceTimer()

    timer = setTimeout(() => {
      flush()
    }, debounce)

    if (typeof maxWait === 'number' && maxWait > 0 && maxTimer === null) {
      const limit = Math.max(0, maxWait)
      maxTimer = setTimeout(() => {
        flush()
      }, limit)
    }
  }

  const stop = watch(
    source as WatchSource<unknown>,
    (value, oldValue) => {
      clearTimers()
      schedule(value, oldValue)
    },
    watchOptions as WatchOptions,
  )

  return () => {
    clearTimers()
    hasPending = false
    stop()
  }
}
