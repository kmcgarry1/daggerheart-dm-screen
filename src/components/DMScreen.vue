<template>
  <div
    class="relative min-h-screen overflow-hidden text-[color:var(--dh-panel-text)] transition-colors duration-500"
    :style="screenStyle"
  >
    <ScreenBackground :layers="backgroundLayers" :base-gradient="baseGradient" />

    <div class="relative flex min-h-screen flex-col gap-6 px-4 py-6 md:px-10 md:py-10">
      <div class="sticky top-4 z-10">
        <ScreenToolbar
          :dark-mode="darkMode"
          :sidebar-collapsed="sidebarCollapsed"
          :widgets-collapsed="widgetsCollapsed"
          :fear-value="fearLevel"
          @toggle:dark="toggleDarkMode"
          @toggle:sidebar="toggleSidebar"
          @toggle:widgets="toggleWidgets"
          @update:fear="setFearLevel"
        />
      </div>

      <div :class="gridClasses">
        <Transition
          enter-active-class="transition duration-400 transform"
          enter-from-class="-translate-x-4 opacity-0"
          enter-to-class="translate-x-0 opacity-100"
          leave-active-class="transition duration-300 transform"
          leave-from-class="translate-x-0 opacity-100"
          leave-to-class="-translate-x-4 opacity-0"
        >
          <ScreenSidebar
            v-if="!sidebarCollapsed"
            :size-options="sizeOptions"
            :next-widget-size="nextWidgetSize"
            :next-widget-size-label="nextWidgetSizeLabel"
            :widgets="widgets"
            :active-widget-id="activeWidgetId"
            :background-count="backgroundImages.length"
            :has-backgrounds="hasBackgrounds"
            @update:size="handleSizeSelect"
            @create:widget="addWidget"
            @clear-backgrounds="clearBackgrounds"
            @focus-widget="focusWidget"
            @upload-backgrounds="handleBackgroundUpload"
          />
        </Transition>

        <ScreenWorkspace
          :widgets="widgets"
          :active-widget-id="activeWidgetId"
          :size-options="sizeOptions"
          :span-class-for-size="widgetSpanClass"
          :collapsed="widgetsCollapsed"
          @toggle-edit="toggleEditing"
          @remove-widget="removeWidget"
          @update-widget="handleWidgetUpdate"
          @toggle-collapsed="toggleWidgets"
        />
      </div>

      <ScreenFloatingControls
        :sidebar-collapsed="sidebarCollapsed"
        :widgets-collapsed="widgetsCollapsed"
        @toggle-sidebar="toggleSidebar"
        @toggle-widgets="toggleWidgets"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import ScreenBackground from './dm-screen/ScreenBackground.vue'
import ScreenFloatingControls from './dm-screen/ScreenFloatingControls.vue'
import ScreenSidebar from './dm-screen/ScreenSidebar.vue'
import ScreenToolbar from './dm-screen/ScreenToolbar.vue'
import ScreenWorkspace from './dm-screen/ScreenWorkspace.vue'

type WidgetSize = 'small' | 'medium' | 'large'

type SizeOption = {
  value: WidgetSize
  label: string
  columns: number
}

type DashboardWidget = {
  id: string
  title: string
  body: string
  size: WidgetSize
  editing: boolean
}

type BackgroundSlide = {
  id: string
  url: string
}

type BackgroundLayer = {
  id: string
  url: string
}

const sizeOptions: SizeOption[] = [
  { value: 'small', label: 'Compact', columns: 1 },
  { value: 'medium', label: 'Wide', columns: 2 },
  { value: 'large', label: 'Showcase', columns: 3 },
]

const createId = () => `widget-${Math.random().toString(36).slice(2, 8)}`
const createBackgroundId = () => `bg-${Math.random().toString(36).slice(2, 8)}`

const darkMode = ref(false)
const fearLevel = ref(0)
const widgets = ref<DashboardWidget[]>([
  {
    id: createId(),
    title: 'Session Beats',
    body: 'Key NPC motivations, surprises to reveal, and challenges to escalate.',
    size: 'medium',
    editing: false,
  },
  {
    id: createId(),
    title: 'Initiative Tracker',
    body: 'Pendry, Rowan, Syl, Maeve, Hunters x3',
    size: 'small',
    editing: false,
  },
])

const nextWidgetSize = ref<WidgetSize>('medium')
const activeWidgetId = ref<string | null>(null)
const sidebarCollapsed = ref(false)
const widgetsCollapsed = ref(false)

const backgroundImages = ref<BackgroundSlide[]>([])
const activeBackgroundIndex = ref(0)
const backgroundLayers = ref<BackgroundLayer[]>([])

let backgroundTimer: number | null = null
const fadeTimers = new Map<string, number>()
const crossfadeMs = 700

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
    }
  }

  return {
    backgroundImage: `${gradient}, url('${slide.url}')`,
    backgroundSize: 'cover, cover',
    backgroundPosition: 'center, center',
    backgroundRepeat: 'no-repeat, no-repeat',
  }
})

const gridClasses = computed(
  () =>
    [
      'grid gap-6 transition-all duration-500',
      sidebarCollapsed.value ? 'lg:grid-cols-1' : 'lg:grid-cols-[320px_minmax(0,1fr)]',
    ].join(' '),
)

const hasBackgrounds = computed(() => backgroundImages.value.length > 0)

const applyTheme = () => {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = darkMode.value ? 'dark' : 'light'
}

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
    activeBackgroundIndex.value =
      (activeBackgroundIndex.value + 1) % backgroundImages.value.length
  }, 12000)
}

const handleBackgroundUpload = (files: File[]) => {
  if (!files.length) return

  const nextSlides = files.map((file) => ({
    id: createBackgroundId(),
    url: URL.createObjectURL(file),
  }))

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

const setFearLevel = (value: number) => {
  const next = Math.max(0, Math.min(12, value))
  fearLevel.value = next
}

const addWidget = () => {
  const widget: DashboardWidget = {
    id: createId(),
    title: '',
    body: '',
    size: nextWidgetSize.value,
    editing: true,
  }
  widgets.value = [widget, ...widgets.value]
  activeWidgetId.value = widget.id

  nextTick(() => {
    if (typeof window === 'undefined') return
    const firstInput = window.document.querySelector<HTMLInputElement>(`#${widget.id}-title`)
    firstInput?.focus()
  })
}

const toggleEditing = (id: string) => {
  const widget = widgets.value.find((entry) => entry.id === id)
  if (!widget) return
  widget.editing = !widget.editing
  activeWidgetId.value = id
  if (widget.editing) {
    nextTick(() => {
      if (typeof window === 'undefined') return
      const input = window.document.querySelector<HTMLInputElement>(`#${id}-title`)
      input?.focus()
    })
  }
}

const handleWidgetUpdate = (payload: { id: string; key: 'title' | 'body' | 'size'; value: string }) => {
  const widget = widgets.value.find((entry) => entry.id === payload.id)
  if (!widget) return
  if (payload.key === 'size') {
    widget.size = payload.value as WidgetSize
    return
  }
  if (payload.key === 'title') {
    widget.title = payload.value
  } else {
    widget.body = payload.value
  }
}

const removeWidget = (id: string) => {
  widgets.value = widgets.value.filter((widget) => widget.id !== id)
  if (activeWidgetId.value === id) {
    activeWidgetId.value = widgets.value[0]?.id ?? null
  }
}

const focusWidget = (id: string) => {
  activeWidgetId.value = id
  const widget = widgets.value.find((entry) => entry.id === id)
  if (!widget) return
  if (!widget.editing) {
    widget.editing = true
  }
  nextTick(() => {
    if (typeof window === 'undefined') return
    const input = window.document.querySelector<HTMLInputElement>(`#${id}-title`)
    input?.focus()
  })
}

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleWidgets = () => {
  widgetsCollapsed.value = !widgetsCollapsed.value
}

const handleSizeSelect = (size: WidgetSize) => {
  nextWidgetSize.value = size
}

const sizeLabel = (size: WidgetSize) => {
  const match = sizeOptions.find((option) => option.value === size)
  return match ? match.label : size
}

const widgetSpanClass = (size: WidgetSize) => {
  switch (size) {
    case 'small':
      return 'sm:col-span-1'
    case 'medium':
      return 'sm:col-span-2'
    case 'large':
      return 'sm:col-span-2 xl:col-span-3'
    default:
      return 'sm:col-span-1'
  }
}

const nextWidgetSizeLabel = computed(() => sizeLabel(nextWidgetSize.value))

watch(darkMode, applyTheme, { immediate: true })

watch(
  () => backgroundImages.value.length,
  (length) => {
    if (length === 0) {
      activeBackgroundIndex.value = 0
    } else {
      activeBackgroundIndex.value = Math.min(activeBackgroundIndex.value, length - 1)
    }

    if (length > 1) {
      startBackgroundTimer()
    } else {
      stopBackgroundTimer()
    }
  },
)

watch(
  currentSlide,
  (next) => {
    if (!next) {
      clearFadeTimers()
      backgroundLayers.value = []
      return
    }

    const newLayer: BackgroundLayer = {
      id: `${next.id}-${Date.now()}`,
      url: next.url,
    }

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
  applyTheme()
  if (backgroundImages.value.length > 1) {
    startBackgroundTimer()
  }
})

onBeforeUnmount(() => {
  stopBackgroundTimer()
  backgroundImages.value.forEach((slide) => URL.revokeObjectURL(slide.url))
  clearFadeTimers()
})
</script>
