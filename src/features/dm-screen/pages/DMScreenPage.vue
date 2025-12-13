<template>
  <div
    class="dh-ambient relative min-h-screen overflow-hidden text-[color:var(--dh-panel-text)] transition-colors duration-500"
    :class="{ 'motion-reduced': reduceMotion }"
    :style="screenStyle"
  >
    <ScreenBackground :layers="backgroundLayers" :base-gradient="baseGradient" />
    <ScreenVideoBackground :src="youtubeBackgroundSrc" :muted="true" />

    <div
      v-if="youtubeBackgroundSrc"
      class="pointer-events-none fixed inset-0 z-0 bg-slate-900/40 transition-opacity duration-500 ease-out"
      :style="videoOverlayStyle"
    ></div>

    <div class="relative z-10 min-h-screen px-4 py-6 md:px-10 md:py-10">
      <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div class="sticky top-4 z-10">
        <ScreenToolbar
          :dark-mode="darkMode"
          :reduce-motion="reduceMotion"
          :sidebar-collapsed="sidebarCollapsed"
          :widgets-collapsed="widgetsCollapsed"
          :fear-value="fearLevel"
          @toggle:dark="toggleDarkMode"
          @toggle:motion="toggleMotionPreference"
          @toggle:sidebar="toggleSidebar"
          @toggle:widgets="toggleWidgets"
          @update:fear="setFearLevel"
        />
      </div>

      <ScreenWorkspace
        :widgets="visibleWidgets"
        :active-widget-id="activeWidgetId"
        :size-options="sizeOptions"
        :span-class-for-size="widgetSpanClass"
        :collapsed="widgetsCollapsed"
        @toggle-edit="toggleEditing"
        @remove-widget="removeWidget"
        @update-widget="handleWidgetUpdate"
        @update-countdown="handleCountdownUpdate"
        @toggle-collapsed="toggleWidgets"
      />

      <div
        v-if="minimizedWidgets.length"
        class="fixed bottom-6 left-1/2 z-20 flex w-[min(90vw,44rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-2xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)]/90 p-2 shadow-lg backdrop-blur md:bottom-8"
      >
        <button
          v-for="m in minimizedWidgets"
          :key="m.id"
          type="button"
          class="flex items-center gap-2 rounded-full border border-[color:var(--dh-panel-border)] bg-[color:var(--dh-panel-bg)]/95 px-3 py-1.5 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[color:var(--dh-panel-bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          @click="restoreWidget(m.id)"
        >
          <span class="text-base">{{ widgetIcon(m.type) }}</span>
          <span class="max-w-[40ch] truncate">
            {{ m.type === 'countdown' ? countdownDockLabel(m) : m.title || dockLabel(m.type) }}
          </span>
        </button>
      </div>

      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ScreenSidebar
            v-if="!sidebarCollapsed"
            :size-options="sizeOptions"
            :next-widget-size="nextWidgetSize"
            :next-widget-size-label="nextWidgetSizeLabel"
            :widget-type-options="widgetTypeOptions"
            :next-widget-type="nextWidgetType"
            :widgets="widgets"
            :active-widget-id="activeWidgetId"
            :background-count="backgroundImages.length"
            :has-backgrounds="hasBackgrounds"
            :background-zoom="backgroundZoom"
            :background-zoom-min="backgroundZoomMin"
            :background-zoom-max="backgroundZoomMax"
            :video-overlay="videoOverlay"
            :video-overlay-min="videoOverlayMin"
            :video-overlay-max="videoOverlayMax"
            :video-overlay-step="videoOverlayStep"
            :video-overlay-enabled="Boolean(youtubeBackgroundSrc)"
            :reduce-motion="reduceMotion"
            @update:size="handleSizeSelect"
            @update:type="handleTypeSelect"
            @create:widget="addWidget"
            @clear-backgrounds="clearBackgrounds"
            @focus-widget="focusWidget"
            @upload-backgrounds="handleBackgroundUpload"
            @update:background-zoom="setBackgroundZoom"
            @update:video-overlay="setVideoOverlay"
            @toggle-motion="toggleMotionPreference"
            @close="toggleSidebar"
          />
        </Transition>
      </Teleport>

      <ScreenFloatingControls
        :sidebar-collapsed="sidebarCollapsed"
        :widgets-collapsed="widgetsCollapsed"
        @toggle-sidebar="toggleSidebar"
        @toggle-widgets="toggleWidgets"
      />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { watchDebounced } from '@/shared/utils'

import ScreenBackground from '@/features/dm-screen/components/ScreenBackground.vue'
import ScreenFloatingControls from '@/features/dm-screen/components/ScreenFloatingControls.vue'
import ScreenVideoBackground from '@/features/dm-screen/components/ScreenVideoBackground.vue'
import ScreenSidebar from '@/features/dm-screen/components/ScreenSidebar.vue'
import ScreenToolbar from '@/features/dm-screen/components/ScreenToolbar.vue'
import ScreenWorkspace from '@/features/dm-screen/components/ScreenWorkspace.vue'
import { useTheme } from '@/shared/composables/useTheme'
import { useBackgrounds, useFear, useWidgets } from '@/features/dm-screen/composables'
import { load, save } from '@/shared/utils'

const { darkMode, toggleDarkMode: toggleTheme } = useTheme()
const { fearLevel, setFearLevel } = useFear()
const {
  backgroundImages,
  backgroundLayers,
  baseGradient,
  screenStyle,
  hasBackgrounds,
  handleBackgroundUpload,
  clearBackgrounds,
  backgroundZoom,
  backgroundZoomMin,
  backgroundZoomMax,
  setBackgroundZoom,
} = useBackgrounds()

const {
  widgets,
  visibleWidgets,
  sizeOptions,
  widgetTypeOptions,
  nextWidgetSize,
  nextWidgetSizeLabel,
  nextWidgetType,
  activeWidgetId,
  addWidget,
  toggleEditing,
  handleWidgetUpdate,
  handleCountdownUpdate,
  removeWidget,
  focusWidget,
  handleSizeSelect,
  handleTypeSelect,
  widgetSpanClass,
  minimizedWidgets,
  restoreWidget,
  dockLabel,
  widgetIcon,
  countdownDockLabel,
  youtubeBackgroundSrc,
} = useWidgets()

const sidebarCollapsed = ref(load<boolean>('sidebarCollapsed', false))
const widgetsCollapsed = ref(load<boolean>('widgetsCollapsed', false))
const reduceMotion = ref(load<boolean>('reduceMotion', false))
const videoOverlay = ref(load<number>('videoOverlay', 0.4))

const videoOverlayMin = 0
const videoOverlayMax = 0.8
const videoOverlayStep = 0.05

const toggleDarkMode = () => toggleTheme()

const toggleMotionPreference = () => {
  reduceMotion.value = !reduceMotion.value
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleWidgets = () => {
  widgetsCollapsed.value = !widgetsCollapsed.value
}

const clampOverlay = (value: number) => {
  if (Number.isNaN(value)) return videoOverlayMin
  return Math.min(Math.max(value, videoOverlayMin), videoOverlayMax)
}

const setVideoOverlay = (value: number) => {
  videoOverlay.value = clampOverlay(value)
}

const videoOverlayStyle = computed(() => ({
  backgroundColor: `rgba(15, 23, 42, ${videoOverlay.value.toFixed(2)})`,
}))

watchDebounced(sidebarCollapsed, (value) => save('sidebarCollapsed', value), {
  debounce: 200,
  maxWait: 1000,
})
watchDebounced(widgetsCollapsed, (value) => save('widgetsCollapsed', value), {
  debounce: 200,
  maxWait: 1000,
})
watchDebounced(reduceMotion, (value) => save('reduceMotion', value), {
  debounce: 200,
  maxWait: 1000,
})
watchDebounced(videoOverlay, (value) => save('videoOverlay', value), {
  debounce: 200,
  maxWait: 1000,
})
</script>
