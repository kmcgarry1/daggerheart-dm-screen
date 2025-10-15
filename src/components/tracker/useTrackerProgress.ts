import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

import type { TrackerOption } from './types'

export function useTrackerProgress(modelValue: Ref<number>, options: Ref<TrackerOption[]>) {
  const progressTrackRef = ref<HTMLDivElement | null>(null)
  const buttonRowRef = ref<HTMLDivElement | null>(null)
  const progressWidth = ref('0px')

  const updateProgressWidth = () => {
    if (typeof window === 'undefined') return
    const track = progressTrackRef.value
    if (!track) return

    const level = Math.max(0, Math.min(modelValue.value, options.value.length))

    if (level <= 0) {
      progressWidth.value = '0px'
      return
    }

    const buttons = buttonRowRef.value?.querySelectorAll<HTMLButtonElement>('button[data-tracker-option]')
    if (!buttons || buttons.length === 0) return

    const targetButton = buttons[level - 1]
    const firstButton = buttons[0]
    const lastButton = buttons[buttons.length - 1]
    if (!targetButton || !firstButton || !lastButton) return

    const trackRect = track.getBoundingClientRect()
    const targetRect = targetButton.getBoundingClientRect()
    const firstRect = firstButton.getBoundingClientRect()
    const lastRect = lastButton.getBoundingClientRect()

    const firstCenter = firstRect.left - trackRect.left + firstRect.width / 2
    const lastCenter = lastRect.left - trackRect.left + lastRect.width / 2
    const targetCenter = targetRect.left - trackRect.left + targetRect.width / 2

    const normalized = lastCenter === firstCenter ? 0 : (targetCenter - firstCenter) / (lastCenter - firstCenter)
    const clampedNormalized = Math.max(0, Math.min(1, normalized))
    const width = firstCenter + (lastCenter - firstCenter) * clampedNormalized

    progressWidth.value = `${Math.max(0, Math.min(width, trackRect.width))}px`
  }

  watch(
    options,
    () => {
      void nextTick(updateProgressWidth)
    },
    { deep: true },
  )

  onMounted(() => {
    void nextTick(updateProgressWidth)
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateProgressWidth)
    }
  })

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateProgressWidth)
    }
  })

  return {
    progressTrackRef,
    buttonRowRef,
    progressWidth,
    updateProgressWidth,
  }
}
