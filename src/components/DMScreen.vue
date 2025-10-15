<template>
  <div class="relative min-h-screen overflow-hidden text-[color:var(--dh-panel-text)] transition-colors duration-500" :style="screenStyle">
    <ScreenBackground :layers="backgroundLayers" :base-gradient="baseGradient" />
    <ScreenVideoBackground :src="youtubeBackgroundSrc" :muted="true" />

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
            :widget-type-options="widgetTypeOptions"
            :next-widget-type="nextWidgetType"
            :widgets="widgets"
            :active-widget-id="activeWidgetId"
            :background-count="backgroundImages.length"
            :has-backgrounds="hasBackgrounds"
            @update:size="handleSizeSelect"
            @update:type="handleTypeSelect"
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
          @update-countdown="handleCountdownUpdate"
          @toggle-collapsed="toggleWidgets"
        />

        <div v-if="minimizedWidgets.length"
          class="fixed bottom-4 right-4 z-20 flex max-w-[80vw] flex-wrap items-center gap-2 rounded-2xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)]/90 p-2 shadow-xl backdrop-blur">
          <button v-for="m in minimizedWidgets" :key="m.id" type="button"
            class="flex items-center gap-2 rounded-full border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-1.5 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm hover:-translate-y-0.5 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            @click="restoreWidget(m.id)">
            <span class="text-base">{{ widgetIcon(m.type) }}</span>
            <span class="max-w-[40ch] truncate">{{ m.type === 'countdown' ? countdownDockLabel(m) : (m.title || dockLabel(m.type)) }}</span>
          </button>
        </div>
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
import { computed, ref } from 'vue'

import ScreenBackground from './dm-screen/ScreenBackground.vue'
import ScreenFloatingControls from './dm-screen/ScreenFloatingControls.vue'
import ScreenVideoBackground from './dm-screen/ScreenVideoBackground.vue'
import ScreenSidebar from './dm-screen/ScreenSidebar.vue'
import ScreenToolbar from './dm-screen/ScreenToolbar.vue'
import ScreenWorkspace from './dm-screen/ScreenWorkspace.vue'
import { useTheme } from '../composables/useTheme'
import { useFear } from '../composables/useFear'
import { useBackgrounds } from '../composables/useBackgrounds'
import { useWidgets } from '../composables/useWidgets'
import { computeYouTubeEmbed } from '../utils/embeds'

const { darkMode, toggleDarkMode: toggleTheme, applyTheme } = useTheme()
const { fearLevel, setFearLevel } = useFear()
const {
  backgroundImages,
  activeBackgroundIndex,
  backgroundLayers,
  baseGradient,
  currentSlide,
  screenStyle,
  hasBackgrounds,
  handleBackgroundUpload,
  clearBackgrounds,
} = useBackgrounds()

const {
  widgets,
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
} = useWidgets()

const sidebarCollapsed = ref(false)
const widgetsCollapsed = ref(false)

const toggleDarkMode = () => toggleTheme()

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleWidgets = () => {
  widgetsCollapsed.value = !widgetsCollapsed.value
}

const youtubeBackgroundSrc = computed(() => {
  const yt = widgets.value.find((w) => (w as any).type === 'youtube' && (w as any).background && (w as any).url)
  if (!yt) return null as any
  const embed = computeYouTubeEmbed((yt as any).url)
  return embed || null
})

const gridClasses = computed(
  () =>
    [
      'grid gap-6 transition-all duration-500',
      sidebarCollapsed.value ? 'lg:grid-cols-1' : 'lg:grid-cols-[320px_minmax(0,1fr)]',
    ].join(' '),
)
</script>
