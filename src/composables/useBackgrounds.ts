import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { load, save } from '../utils/storage'

export type BackgroundSlide = { id: string; url: string }
export type BackgroundLayer = { id: string; url: string }

let bgCounter = 0
const createBackgroundId = () => {
  if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
    return `bg-${(crypto as any).randomUUID()}`
  }
  bgCounter += 1
  return `bg-${Date.now()}-${bgCounter}`
}

export function useBackgrounds() {
  const backgroundImages = ref<BackgroundSlide[]>(load<BackgroundSlide[]>('backgroundImages', []))
  const activeBackgroundIndex = ref(load<number>('activeBackgroundIndex', 0))
  const backgroundLayers = ref<BackgroundLayer[]>([])

  const baseGradient = computed(() => 'var(--dh-backdrop)')

  const currentSlide = computed(() => backgroundImages.value[activeBackgroundIndex.value] ?? null)

  const screenStyle = computed(() => {
    const gradient = baseGradient.value
    const slide = currentSlide.value
    if (!slide) {
      return {
        backgroundImage: gradient,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      } as any
    }
    return {
      backgroundImage: `${gradient}, url('${slide.url}')`,
      backgroundSize: 'cover, cover',
      backgroundPosition: 'center, center',
      backgroundRepeat: 'no-repeat, no-repeat',
    } as any
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
    const nextSlides = files.map((file) => ({ id: createBackgroundId(), url: URL.createObjectURL(file) }))
    backgroundImages.value = [...nextSlides, ...backgroundImages.value]
    activeBackgroundIndex.value = 0
    startBackgroundTimer()
  }

  const clearBackgrounds = () => {
    backgroundImages.value.forEach((slide) => URL.revokeObjectURL(slide.url))
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
      const newLayer: BackgroundLayer = { id: `${next.id}-${Date.now()}`, url: next.url }
      const previous = backgroundLayers.value[0]
      backgroundLayers.value = previous ? [newLayer, ...backgroundLayers.value] : [newLayer]
      if (previous && typeof window !== 'undefined') {
        if (fadeTimers.has(previous.id)) {
          window.clearTimeout(fadeTimers.get(previous.id)!)
        }
        const timer = window.setTimeout(() => {
          backgroundLayers.value = backgroundLayers.value.filter((layer) => layer.id !== previous.id)
          fadeTimers.delete(previous.id)
        }, crossfadeMs)
        fadeTimers.set(previous.id, timer)
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
    backgroundImages.value.forEach((slide) => URL.revokeObjectURL(slide.url))
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
