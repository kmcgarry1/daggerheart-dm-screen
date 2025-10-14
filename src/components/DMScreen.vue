<template>
  <div
    class="relative min-h-screen overflow-hidden text-[color:var(--dh-panel-text)] transition-colors duration-500"
    :style="screenStyle"
  >
    <div class="absolute inset-0 -z-20 bg-cover bg-center" style="background: var(--dh-backdrop)"></div>
    <TransitionGroup
      name="dh-bg-fade"
      tag="div"
      class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        v-for="layer in backgroundLayers"
        :key="layer.id"
        class="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url('${layer.url}')` }"
      ></div>
    </TransitionGroup>

    <div class="relative flex min-h-screen flex-col gap-6 px-4 py-6 md:px-10 md:py-10">
      <div class="sticky top-4 z-10">
        <div class="dh-glass relative overflow-hidden p-4 md:p-6">
          <div class="flex flex-wrap items-center justify-end gap-2">
            <button type="button" class="dh-toggle" @click="toggleDarkMode">
              <span>{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</span>
              <span aria-hidden="true">{{ darkMode ? '☀' : '☾' }}</span>
            </button>
            <button type="button" class="dh-toggle" @click="toggleSidebar">
              <span>{{ sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar' }}</span>
            </button>
            <button type="button" class="dh-toggle" @click="toggleWidgets">
              <span>{{ widgetsCollapsed ? 'Show Widgets' : 'Hide Widgets' }}</span>
            </button>
          </div>
          <fear-tracker
            class="mt-4"
            :value="fearLevel"
            @update:value="setFearLevel"
          />
        </div>
      </div>

      <div
        :class="[
          'grid gap-6 transition-all duration-500',
          sidebarCollapsed ? 'lg:grid-cols-1' : 'lg:grid-cols-[320px_minmax(0,1fr)]',
        ]"
      >
        <Transition
          enter-active-class="transition duration-400 transform"
          enter-from-class="-translate-x-4 opacity-0"
          enter-to-class="translate-x-0 opacity-100"
          leave-active-class="transition duration-300 transform"
          leave-from-class="translate-x-0 opacity-100"
          leave-to-class="-translate-x-4 opacity-0"
        >
          <aside
            v-if="!sidebarCollapsed"
            class="dh-glass sticky top-28 flex h-fit flex-col gap-8 p-6"
          >
            <section class="flex flex-col gap-4">
              <header class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--dh-panel-muted)]">
                  Widget Library
                </p>
                <h2 class="text-xl font-semibold">Create Dashboard Widget</h2>
              </header>
              <p class="text-sm text-[color:var(--dh-panel-muted)]">
                Pick a size, then drop in a new card. Everything stays editable directly on the board.
              </p>
              <div class="flex flex-col gap-3" role="tablist" aria-label="Widget size presets">
                <button
                  v-for="option in sizeOptions"
                  :key="option.value"
                  type="button"
                  class="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                  :class="[
                    option.value === nextWidgetSize
                      ? 'border-transparent bg-gradient-to-r from-violet-500/90 to-sky-500/80 text-white shadow-xl'
                      : 'border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] text-[color:var(--dh-panel-text)]',
                  ]"
                  @click="nextWidgetSize = option.value"
                >
                  <span>{{ option.label }}</span>
                  <span
                    class="text-xs font-medium"
                    :class="option.value === nextWidgetSize ? 'opacity-80' : 'text-[color:var(--dh-panel-muted)]'"
                  >
                    {{ option.columns }} columns
                  </span>
                </button>
              </div>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                @click="addWidget"
              >
                + New {{ nextWidgetSizeLabel }} Widget
              </button>
            </section>

            <section class="flex flex-col gap-4">
              <header class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--dh-panel-muted)]">
                  Atmosphere
                </p>
                <h2 class="text-xl font-semibold">Dashboard Backdrop</h2>
              </header>
              <p class="text-sm text-[color:var(--dh-panel-muted)]">
                Upload a collection of images to cycle softly behind your command center.
              </p>
              <input
                ref="backgroundInputRef"
                class="hidden"
                type="file"
                accept="image/*"
                multiple
                @change="onBackgroundUpload"
              />
              <div class="flex flex-col gap-3">
                <button
                  type="button"
                  class="dh-toggle justify-center"
                  @click="triggerBackgroundUpload"
                >
                  Upload Background Images
                </button>
                <button
                  v-if="hasBackgrounds"
                  type="button"
                  class="dh-pill text-center"
                  @click="clearBackgrounds"
                >
                  Clear ({{ backgroundImages.length }})
                </button>
              </div>
            </section>

            <section class="flex flex-col gap-4" aria-live="polite">
              <header class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--dh-panel-muted)]">
                  Dashboard Content
                </p>
                <h2 class="text-xl font-semibold">
                  {{ widgets.length }} Widget{{ widgets.length === 1 ? '' : 's' }}
                </h2>
              </header>
              <ul class="flex flex-col gap-2">
                <li v-for="widget in widgets" :key="widget.id">
                  <button
                    type="button"
                    class="flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                    :class="[
                      widget.id === activeWidgetId
                        ? 'border-transparent bg-gradient-to-r from-violet-500/90 to-indigo-500/80 text-white shadow-xl'
                        : 'border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] text-[color:var(--dh-panel-text)] shadow-sm hover:shadow-lg',
                    ]"
                    @click="focusWidget(widget.id)"
                  >
                    <span>
                      <span class="block text-sm font-semibold">{{ widget.title || 'Untitled Widget' }}</span>
                      <span
                        class="block text-xs font-medium"
                        :class="widget.id === activeWidgetId ? 'opacity-80' : 'text-[color:var(--dh-panel-muted)]'"
                      >
                        {{ sizeLabel(widget.size) }}
                      </span>
                    </span>
                    <span
                      class="text-xs font-semibold uppercase tracking-wide"
                      :class="widget.id === activeWidgetId ? 'opacity-85' : 'text-[color:var(--dh-panel-muted)]'"
                    >
                      {{ widget.editing ? 'Editing' : 'View' }}
                    </span>
                  </button>
                </li>
                <li
                  v-if="widgets.length === 0"
                  class="rounded-2xl border border-dashed border-[color:var(--dh-panel-border)] px-3 py-4 text-center text-sm text-[color:var(--dh-panel-muted)]"
                >
                  No widgets yet. Create one to get started.
                </li>
              </ul>
            </section>
          </aside>
        </Transition>

        <Transition
          enter-active-class="transition duration-400 transform"
          enter-from-class="translate-y-2 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-300 transform"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-2 opacity-0"
          mode="out-in"
        >
          <section
            v-if="!widgetsCollapsed"
            key="widgets-open"
            class="flex flex-col gap-6"
            aria-label="Dashboard workspace"
          >
            <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <dh-card
                v-for="widget in widgets"
                :key="widget.id"
                :class="[
                  'relative flex flex-col gap-4 transition-all duration-200',
                  widgetSpanClass(widget.size),
                  widget.id === activeWidgetId
                    ? 'ring-2 ring-violet-400/70 shadow-2xl'
                    : 'hover:-translate-y-1 hover:shadow-xl',
                ]"
              >
                <template #title>
                  <div class="flex flex-wrap items-center justify-between gap-3">
                    <input
                      v-if="widget.editing"
                      v-model="widget.title"
                      :id="`${widget.id}-title`"
                      type="text"
                      placeholder="Widget title"
                      class="w-full flex-1 rounded-xl border border-violet-200/70 bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:border-violet-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                    />
                    <span v-else class="text-base font-semibold">
                      {{ widget.title || 'Untitled Widget' }}
                    </span>
                    <div class="flex items-center gap-2">
                      <select
                        v-if="widget.editing"
                        v-model="widget.size"
                        class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-2.5 py-2 text-xs font-semibold text-[color:var(--dh-panel-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                      >
                        <option v-for="option in sizeOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                      <button
                        type="button"
                        class="dh-toggle px-3 py-2"
                        @click="toggleEditing(widget.id)"
                        :aria-label="widget.editing ? 'Save widget' : 'Edit widget'"
                      >
                        {{ widget.editing ? 'Save' : 'Edit' }}
                      </button>
                      <button
                        type="button"
                        class="dh-toggle border border-rose-300/60 bg-rose-500/10 px-3 py-2 text-rose-400 hover:border-rose-300"
                        @click="removeWidget(widget.id)"
                        aria-label="Delete widget"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </template>
                <template #body>
                  <textarea
                    v-if="widget.editing"
                    v-model="widget.body"
                    rows="4"
                    placeholder="Notes, trackers, reminders..."
                    class="w-full rounded-xl border border-violet-200/70 bg-[var(--dh-panel-bg)] px-3 py-3 text-sm text-[color:var(--dh-panel-text)] shadow-sm focus:border-violet-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                  ></textarea>
                  <p v-else class="text-sm leading-relaxed text-[color:var(--dh-panel-muted)]">
                    {{ widget.body || 'Add notes or quick references for your session.' }}
                  </p>
                </template>
              </dh-card>
            </div>
          </section>
          <div
            v-else
            key="widgets-collapsed"
            class="dh-glass flex min-h-[280px] flex-col items-center justify-center gap-4 p-6 text-center"
          >
            <p class="text-sm text-[color:var(--dh-panel-muted)]">
              Widgets are hidden. Bring them back whenever you need them.
            </p>
            <button type="button" class="dh-toggle" @click="toggleWidgets">
              Show Widgets
            </button>
          </div>
        </Transition>
      
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-400 transform"
      enter-from-class="translate-y-6 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-300 transform"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <button
        v-if="sidebarCollapsed"
        type="button"
        class="dh-toggle fixed left-5 bottom-5 z-40 px-4 py-2 shadow-2xl"
        @click="toggleSidebar"
      >
        Show Sidebar
      </button>
    </Transition>

    <Transition
      enter-active-class="transition duration-400 transform"
      enter-from-class="translate-y-6 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-300 transform"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <button
        v-if="widgetsCollapsed"
        type="button"
        class="dh-toggle fixed right-5 bottom-5 z-40 px-4 py-2 shadow-2xl"
        @click="toggleWidgets"
      >
        Show Widgets
      </button>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import DhCard from './core/DhCard.vue'
import FearTracker from './fear/FearTracker.vue'

type WidgetSize = 'small' | 'medium' | 'large'

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

const sizeOptions = [
  { value: 'small' as WidgetSize, label: 'Compact', columns: 1 },
  { value: 'medium' as WidgetSize, label: 'Wide', columns: 2 },
  { value: 'large' as WidgetSize, label: 'Showcase', columns: 3 },
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

const backgroundInputRef = ref<HTMLInputElement | null>(null)
const backgroundImages = ref<BackgroundSlide[]>([])
const activeBackgroundIndex = ref(0)
let backgroundTimer: number | null = null

type BackgroundLayer = { id: string; url: string }
const backgroundLayers = ref<BackgroundLayer[]>([])
const fadeTimers = new Map<string, number>()
const crossfadeMs = 700

const currentSlide = computed(() => backgroundImages.value[activeBackgroundIndex.value] ?? null)

const screenStyle = computed(() => {
  const gradient = 'var(--dh-backdrop)'
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

const hasBackgrounds = computed(() => backgroundImages.value.length > 0)

const applyTheme = () => {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = darkMode.value ? 'dark' : 'light'
}

const clearFadeTimers = () => {
  if (typeof window !== 'undefined') {
    fadeTimers.forEach((timer) => window.clearTimeout(timer))
  }
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

const triggerBackgroundUpload = () => {
  backgroundInputRef.value?.click()
}

const onBackgroundUpload = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (!target?.files?.length) return

  const nextSlides = Array.from(target.files).map((file) => ({
    id: createBackgroundId(),
    url: URL.createObjectURL(file),
  }))

  backgroundImages.value = [...nextSlides, ...backgroundImages.value]
  activeBackgroundIndex.value = 0
  startBackgroundTimer()

  target.value = ''
}

const clearBackgrounds = () => {
  backgroundImages.value.forEach((slide) => URL.revokeObjectURL(slide.url))
  backgroundImages.value = []
  activeBackgroundIndex.value = 0
  stopBackgroundTimer()
  clearFadeTimers()
  backgroundLayers.value = []
  if (backgroundInputRef.value) {
    backgroundInputRef.value.value = ''
  }
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
