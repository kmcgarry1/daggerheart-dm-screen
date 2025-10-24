import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import type { CSSProperties } from 'vue'

import { createIdGenerator, load, save, reportError } from '@/shared/utils'

export type BackgroundSlide = { id: string; url: string }
export type BackgroundLayer = {
  id: string
  url: string
  panFromX: number
  panFromY: number
  panToX: number
  panToY: number
  durationMs: number
  scale: number
}

const createBackgroundId = createIdGenerator('bg')

const backgroundContext = (action: string) => `backgrounds:${action}`

const releaseObjectUrl = (url: string, action: string) => {
  try {
    URL.revokeObjectURL(url)
  } catch (error) {
    reportError('We could not release a background image.', error, {
      context: backgroundContext(action),
      oncePerContext: true,
      tone: 'warning',
    })
  }
}

export function useBackgrounds() {
  const backgroundImages = ref<BackgroundSlide[]>(load<BackgroundSlide[]>('backgroundImages', []))
  const activeBackgroundIndex = ref(load<number>('activeBackgroundIndex', 0))
  const backgroundLayers = ref<BackgroundLayer[]>([])

  const baseGradient = computed(() => 'var(--dh-backdrop)')

  const currentSlide = computed(() => backgroundImages.value[activeBackgroundIndex.value] ?? null)

  const screenStyle = computed<CSSProperties>(() => {
    const gradient = baseGradient.value
    const slide = currentSlide.value
    if (!slide) {
      return {
        backgroundImage: gradient,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }
    }
    return {
      backgroundImage: `${gradient}, url('${slide.url}')`,
      backgroundSize: 'cover, cover',
      backgroundPosition: 'center, center',
      backgroundRepeat: 'no-repeat, no-repeat',
    }
  })

  let backgroundTimer: number | null = null
  const fadeTimers = new Map<string, number>()
  const crossfadeMs = 700

  const clearFadeTimers = () => {
    if (typeof window === 'undefined') return
    fadeTimers.forEach((timer) => window.clearTimeout(timer))
    fadeTimers.clear()
  }

  const stopBackgroundTimer = () => {
    if (backgroundTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(backgroundTimer)
      backgroundTimer = null
    }
  }

  const startBackgroundTimer = () => {
    stopBackgroundTimer()
    if (typeof window === 'undefined') return
    if (backgroundImages.value.length <= 1) return
    backgroundTimer = window.setInterval(() => {
      activeBackgroundIndex.value = (activeBackgroundIndex.value + 1) % backgroundImages.value.length
    }, 12000)
  }

  const handleBackgroundUpload = (files: File[]) => {
    if (!files.length) return
    try {
      const nextSlides = files.map((file) => ({ id: createBackgroundId(), url: URL.createObjectURL(file) }))
      backgroundImages.value = [...nextSlides, ...backgroundImages.value]
      activeBackgroundIndex.value = 0
      startBackgroundTimer()
    } catch (error) {
      reportError('We could not load those background images.', error, {
        context: backgroundContext('upload'),
        tone: 'warning',
      })
    }
  }

  const clearBackgrounds = () => {
    backgroundImages.value.forEach((slide) => releaseObjectUrl(slide.url, 'revoke'))
    backgroundImages.value = []
    activeBackgroundIndex.value = 0
    stopBackgroundTimer()
    clearFadeTimers()
    backgroundLayers.value = []
  }

  const hasBackgrounds = computed(() => backgroundImages.value.length > 0)

  watch(
    () => backgroundImages.value.length,
    (length) => {
      if (length === 0) {
        activeBackgroundIndex.value = 0
      } else {
        activeBackgroundIndex.value = Math.min(activeBackgroundIndex.value, length - 1)
      }
      if (length > 1) startBackgroundTimer()
      else stopBackgroundTimer()
    },
  )

  watch(backgroundImages, (v) => save('backgroundImages', v), { deep: true })
  watch(activeBackgroundIndex, (v) => save('activeBackgroundIndex', v))

  watch(
    currentSlide,
    (next) => {
      if (!next) {
        clearFadeTimers()
        backgroundLayers.value = []
        return
      }
      const newLayer: BackgroundLayer = (() => {
        const angle = Math.random() * Math.PI * 2
        const distance = 4 + Math.random() * 6
        const offsetX = Math.cos(angle) * distance
        const offsetY = Math.sin(angle) * distance
        const durationMs = 70000 + Math.random() * 40000
        const scale = 1.06 + Math.random() * 0.04

        return {
          id: `${next.id}-${Date.now()}`,
          url: next.url,
          panFromX: -offsetX,
          panFromY: -offsetY,
          panToX: offsetX,
          panToY: offsetY,
          durationMs,
          scale,
        }
      })()
      const previous = backgroundLayers.value[0]
      backgroundLayers.value = previous ? [newLayer, ...backgroundLayers.value] : [newLayer]
      if (previous && typeof window !== 'undefined') {
        if (fadeTimers.has(previous.id)) {
          window.clearTimeout(fadeTimers.get(previous.id)!)
        }
        try {
          const timer = window.setTimeout(() => {
            try {
              backgroundLayers.value = backgroundLayers.value.filter((layer) => layer.id !== previous.id)
              fadeTimers.delete(previous.id)
            } catch (error) {
              reportError('We could not update the background transition.', error, {
                context: backgroundContext('transition'),
                tone: 'warning',
              })
            }
          }, crossfadeMs)
          fadeTimers.set(previous.id, timer)
        } catch (error) {
          reportError('We could not update the background transition.', error, {
            context: backgroundContext('transition'),
            tone: 'warning',
          })
        }
      }
      if (backgroundLayers.value.length > 2) {
        const extras = backgroundLayers.value.slice(2)
        if (typeof window !== 'undefined') {
          extras.forEach((layer) => {
            if (fadeTimers.has(layer.id)) {
              window.clearTimeout(fadeTimers.get(layer.id)!)
              fadeTimers.delete(layer.id)
            }
          })
        }
        backgroundLayers.value = backgroundLayers.value.slice(0, 2)
      }
    },
    { immediate: true },
  )

  onMounted(() => {
    if (backgroundImages.value.length > 1) startBackgroundTimer()
  })
  onBeforeUnmount(() => {
    stopBackgroundTimer()
    backgroundImages.value.forEach((slide) => releaseObjectUrl(slide.url, 'teardown'))
    clearFadeTimers()
  })

  return {
    backgroundImages,
    activeBackgroundIndex,
    backgroundLayers,
    baseGradient,
    currentSlide,
    screenStyle,
    hasBackgrounds,
    handleBackgroundUpload,
    clearBackgrounds,
  }
}
