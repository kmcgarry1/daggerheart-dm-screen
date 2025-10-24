import { computed, ref, shallowRef, watch, onMounted, onBeforeUnmount } from 'vue'
import type { CSSProperties } from 'vue'

import { watchDebounced, createIdGenerator, load, save, reportError } from '@/shared/utils'

export type BackgroundSlide = { id: string; url: string }
export type BackgroundLayer = {
  id: string
  url: string
  panFromX: number
  panFromY: number
  panToX: number
  panToY: number
  durationMs: number
  delayMs: number
  scaleFrom: number
  scaleTo: number
}

type BackgroundAnimationDescriptor = {
  id: string
  slideId: string
  panFromX: number
  panFromY: number
  panToX: number
  panToY: number
  durationMs: number
  zoomVariance: number
  reverseZoom: boolean
  delayMs: number
}

const createBackgroundId = createIdGenerator('bg')

const backgroundContext = (action: string) => `backgrounds:${action}`

const DEFAULT_ZOOM = 1.08
const ZOOM_MIN = 1
const ZOOM_MAX = 1.4

const clampZoom = (value: number) => {
  if (!Number.isFinite(value)) return DEFAULT_ZOOM
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value))
}

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

const isPersistableSlide = (slide: BackgroundSlide | null | undefined): slide is BackgroundSlide => {
  if (!slide) return false
  return typeof slide.id === 'string' && typeof slide.url === 'string' && slide.id.length > 0 && slide.url.length > 0
}

const hydrateSlides = (slides: BackgroundSlide[]) => slides.filter(isPersistableSlide).map((slide) => ({ ...slide }))

const serializeSlides = (slides: BackgroundSlide[]) =>
  slides
    .filter((slide) => isPersistableSlide(slide) && !slide.url.startsWith('blob:'))
    .map((slide) => ({ id: slide.id, url: slide.url }))

const slidesEqual = (a: BackgroundSlide[], b: BackgroundSlide[]) => {
  if (a.length !== b.length) return false
  return a.every((slide, index) => {
    const other = b[index]
    return other !== undefined && other.id === slide.id && other.url === slide.url
  })
}

const createAnimationDescriptor = (slideId: string): BackgroundAnimationDescriptor => {
  const randomOffset = () => {
    const angle = Math.random() * Math.PI * 2
    const distance = 3.5 + Math.random() * 5.5
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    }
  }

  let from = randomOffset()
  let to = randomOffset()
  let attempts = 0
  while (Math.hypot(to.x - from.x, to.y - from.y) < 2.4 && attempts < 5) {
    to = randomOffset()
    attempts += 1
  }

  const durationMs = Math.round(24000 + Math.random() * 16000)
  const zoomVariance = 0.12 + Math.random() * 0.1
  const initialProgress = Math.random()
  const delayMs = -Math.round(initialProgress * durationMs)

  return {
    id: `${slideId}-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    slideId,
    panFromX: from.x,
    panFromY: from.y,
    panToX: to.x,
    panToY: to.y,
    durationMs,
    zoomVariance,
    reverseZoom: Math.random() > 0.5,
    delayMs,
  }
}

export function useBackgrounds() {
  const persistedSlides = ref<BackgroundSlide[]>(hydrateSlides(load<BackgroundSlide[]>('backgroundImages', [])))
  const backgroundImages = ref<BackgroundSlide[]>(persistedSlides.value.map((slide) => ({ ...slide })))
  const activeBackgroundIndex = ref(load<number>('activeBackgroundIndex', 0))
  const animationQueue = shallowRef<BackgroundAnimationDescriptor[]>([])
  const backgroundZoom = ref(clampZoom(load<number>('backgroundZoom', DEFAULT_ZOOM)))

  const baseGradient = computed(() => 'var(--dh-backdrop)')

  const currentSlide = computed(() => backgroundImages.value[activeBackgroundIndex.value] ?? null)

  const screenStyle = computed<CSSProperties>(() => {
    const gradient = baseGradient.value
    const slide = currentSlide.value
    const hasLayers = animationQueue.value.length > 0
    const baseStyle: CSSProperties = {
      backgroundImage: gradient,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }
    if (!slide) return baseStyle
    if (!hasLayers) {
      return {
        ...baseStyle,
        backgroundImage: `${gradient}, url('${slide.url}')`,
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
      }
    }
    return {
      ...baseStyle,
    }
  })

  const hasBackgrounds = computed(() => backgroundImages.value.length > 0)

  const slidesById = computed(() => {
    const map = new Map<string, BackgroundSlide>()
    for (const slide of backgroundImages.value) {
      map.set(slide.id, slide)
    }
    return map
  })

  const backgroundLayers = computed<BackgroundLayer[]>(() => {
    if (animationQueue.value.length === 0) return []
    const map = slidesById.value
    const baseScale = clampZoom(backgroundZoom.value)
    return animationQueue.value
      .map((descriptor) => {
        const slide = map.get(descriptor.slideId)
        if (!slide) return null
        const halfDelta = Math.abs(descriptor.zoomVariance) / 2
        let scaleStart = baseScale - halfDelta
        let scaleEnd = baseScale + halfDelta
        if (descriptor.reverseZoom) {
          ;[scaleStart, scaleEnd] = [scaleEnd, scaleStart]
        }

        const maxOffsetX = Math.max(Math.abs(descriptor.panFromX), Math.abs(descriptor.panToX))
        const maxOffsetY = Math.max(Math.abs(descriptor.panFromY), Math.abs(descriptor.panToY))
        const maxOffset = Math.max(maxOffsetX, maxOffsetY)
        const minScaleForOffsets = Math.min(ZOOM_MAX, 1 + maxOffset / 50)

        const currentMin = Math.min(scaleStart, scaleEnd)
        if (currentMin < minScaleForOffsets) {
          const increase = minScaleForOffsets - currentMin
          scaleStart += increase
          scaleEnd += increase
        }

        const currentMax = Math.max(scaleStart, scaleEnd)
        if (currentMax > ZOOM_MAX) {
          const overshoot = currentMax - ZOOM_MAX
          scaleStart -= overshoot
          scaleEnd -= overshoot
        }

        scaleStart = clampZoom(scaleStart)
        scaleEnd = clampZoom(scaleEnd)

        const adjustedMin = Math.min(scaleStart, scaleEnd)
        if (adjustedMin < minScaleForOffsets) {
          const delta = Math.min(
            minScaleForOffsets - adjustedMin,
            Math.max(0, ZOOM_MAX - Math.max(scaleStart, scaleEnd)),
          )
          scaleStart = clampZoom(scaleStart + delta)
          scaleEnd = clampZoom(scaleEnd + delta)
          const finalMin = Math.min(scaleStart, scaleEnd)
          if (finalMin < minScaleForOffsets) {
            scaleStart = clampZoom(Math.max(scaleStart, minScaleForOffsets))
            scaleEnd = clampZoom(Math.max(scaleEnd, minScaleForOffsets))
          }
        }

        return {
          id: descriptor.id,
          url: slide.url,
          panFromX: descriptor.panFromX,
          panFromY: descriptor.panFromY,
          panToX: descriptor.panToX,
          panToY: descriptor.panToY,
          durationMs: descriptor.durationMs,
          delayMs: descriptor.delayMs,
          scaleFrom: scaleStart,
          scaleTo: scaleEnd,
        }
      })
      .filter((layer): layer is BackgroundLayer => layer !== null)
  })

  let backgroundTimer: number | null = null
  const fadeTimers = new Map<string, number>()
  const crossfadeMs = 700

  const clearFadeTimers = () => {
    if (typeof window === 'undefined') return
    fadeTimers.forEach((timer) => window.clearTimeout(timer))
    fadeTimers.clear()
  }

  const cancelFadeTimer = (id: string) => {
    if (typeof window === 'undefined') return
    if (!fadeTimers.has(id)) return
    window.clearTimeout(fadeTimers.get(id)!)
    fadeTimers.delete(id)
  }

  const removeAnimationDescriptor = (id: string) => {
    animationQueue.value = animationQueue.value.filter((descriptor) => descriptor.id !== id)
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

  const syncPersistedSlides = (slides: BackgroundSlide[]) => {
    const serialized = serializeSlides(slides)
    if (!slidesEqual(serialized, persistedSlides.value)) {
      persistedSlides.value = serialized
    }
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
    backgroundImages.value = []
    activeBackgroundIndex.value = 0
    stopBackgroundTimer()
    clearFadeTimers()
    animationQueue.value = []
  }

  const scheduleFadeOut = (id: string) => {
    if (typeof window === 'undefined') return
    cancelFadeTimer(id)
    try {
      const timer = window.setTimeout(() => {
        try {
          removeAnimationDescriptor(id)
        } catch (error) {
          reportError('We could not update the background transition.', error, {
            context: backgroundContext('transition'),
            tone: 'warning',
          })
        } finally {
          cancelFadeTimer(id)
        }
      }, crossfadeMs)
      fadeTimers.set(id, timer)
    } catch (error) {
      reportError('We could not update the background transition.', error, {
        context: backgroundContext('transition'),
        tone: 'warning',
      })
    }
  }

  const pushAnimationForSlide = (slideId: string) => {
    const descriptor = createAnimationDescriptor(slideId)
    const previous = animationQueue.value[0]
    const updated = [descriptor, ...animationQueue.value]
    const trimmed = updated.slice(0, 2)
    const extras = updated.slice(2)
    extras.forEach((extra) => cancelFadeTimer(extra.id))
    animationQueue.value = trimmed
    if (previous) {
      scheduleFadeOut(previous.id)
    }
  }

  watch(
    backgroundImages,
    (slides, previousSlides = []) => {
      syncPersistedSlides(slides)

      const previousMap = new Map(previousSlides.map((slide) => [slide.id, slide]))
      for (const slide of slides) {
        previousMap.delete(slide.id)
      }

      if (previousMap.size > 0) {
        const removedIds = new Set<string>()
        previousMap.forEach((slide, id) => {
          removedIds.add(id)
          if (slide.url.startsWith('blob:')) {
            releaseObjectUrl(slide.url, 'remove')
          }
        })
        animationQueue.value = animationQueue.value.filter((descriptor) => {
          if (removedIds.has(descriptor.slideId)) {
            cancelFadeTimer(descriptor.id)
            return false
          }
          return true
        })
      }

      if (slides.length === 0) {
        activeBackgroundIndex.value = 0
        stopBackgroundTimer()
        return
      }

      if (activeBackgroundIndex.value >= slides.length) {
        activeBackgroundIndex.value = slides.length - 1
      }

      if (slides.length > 1) startBackgroundTimer()
      else stopBackgroundTimer()
    },
    { immediate: true },
  )

  watch(
    currentSlide,
    (next) => {
      if (!next) {
        clearFadeTimers()
        animationQueue.value = []
        return
      }
      pushAnimationForSlide(next.id)
    },
    { immediate: true },
  )

  onMounted(() => {
    if (backgroundImages.value.length > 1) startBackgroundTimer()
  })
  onBeforeUnmount(() => {
    stopBackgroundTimer()
    backgroundImages.value.forEach((slide) => {
      if (slide.url.startsWith('blob:')) {
        releaseObjectUrl(slide.url, 'teardown')
      }
    })
    clearFadeTimers()
  })

  watch(
    backgroundZoom,
    (value) => {
      const clamped = clampZoom(value)
      if (clamped !== value) {
        backgroundZoom.value = clamped
      }
    },
    { immediate: true },
  )

  watchDebounced(
    persistedSlides,
    (value) => {
      save(
        'backgroundImages',
        value.map((slide) => ({ id: slide.id, url: slide.url })),
      )
    },
    { deep: true, debounce: 300, maxWait: 1500 },
  )

  watchDebounced(activeBackgroundIndex, (value) => save('activeBackgroundIndex', value), {
    debounce: 200,
    maxWait: 1000,
  })

  watchDebounced(
    backgroundZoom,
    (value) => {
      save('backgroundZoom', clampZoom(value))
    },
    { debounce: 250, maxWait: 1500 },
  )

  const setBackgroundZoom = (value: number) => {
    backgroundZoom.value = clampZoom(value)
  }

  return {
    backgroundImages,
    backgroundLayers,
    baseGradient,
    currentSlide,
    screenStyle,
    hasBackgrounds,
    handleBackgroundUpload,
    clearBackgrounds,
    backgroundZoom,
    backgroundZoomMin: ZOOM_MIN,
    backgroundZoomMax: ZOOM_MAX,
    setBackgroundZoom,
  }
}
