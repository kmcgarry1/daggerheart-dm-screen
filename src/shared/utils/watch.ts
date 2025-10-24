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
  options: InternalWatchOptions<T> = {},
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

  const clearTimers = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    if (maxTimer !== null) {
      clearTimeout(maxTimer)
      maxTimer = null
    }
  }

  const runCallback = (value: unknown, oldValue: unknown) => {
    ;(callback as WatchCallback<unknown, unknown>)(value, oldValue, () => {})
  }

  const flush = (value: unknown, oldValue: unknown) => {
    clearTimers()
    hasPending = false
    runCallback(value, oldValue)
  }

  const schedule = (value: unknown, oldValue: unknown) => {
    if (debounce <= 0) {
      flush(value, oldValue)
      return
    }

    if (leading && !hasPending) {
      runCallback(value, oldValue)
    }

    hasPending = true
    clearTimers()

    timer = setTimeout(() => {
      flush(value, oldValue)
    }, debounce)

    if (typeof maxWait === 'number' && maxWait > 0) {
      const limit = Math.max(0, maxWait)
      maxTimer = setTimeout(() => {
        flush(value, oldValue)
      }, limit)
    }
  }

  const stop = watch(
    source as WatchSource<unknown>,
    (value, oldValue) => {
      clearTimers()
      schedule(value, oldValue)
    },
    watchOptions as WatchOptions<unknown>,
  )

  return () => {
    clearTimers()
    hasPending = false
    stop()
  }
}
