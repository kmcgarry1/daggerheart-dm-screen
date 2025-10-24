<template>
  <div
    class="dh-ambient relative min-h-screen overflow-hidden text-[color:var(--dh-panel-text)] transition-colors duration-500"
    :style="screenStyle"
  >
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

      <div
        v-if="minimizedWidgets.length"
        class="fixed bottom-4 right-4 z-20 flex max-w-[80vw] flex-wrap items-center gap-2 rounded-2xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)]/90 p-2 shadow-xl backdrop-blur"
      >
        <button
          v-for="m in minimizedWidgets"
          :key="m.id"
          type="button"
          class="flex items-center gap-2 rounded-full border border-[color:var(--dh-panel-border)] bg-[color:var(--dh-panel-bg)] px-3 py-1.5 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm hover:-translate-y-0.5 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
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
            @update:size="handleSizeSelect"
            @update:type="handleTypeSelect"
            @create:widget="addWidget"
            @clear-backgrounds="clearBackgrounds"
            @focus-widget="focusWidget"
            @upload-backgrounds="handleBackgroundUpload"
            @update:background-zoom="setBackgroundZoom"
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
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

import ScreenBackground from '@/features/dm-screen/components/ScreenBackground.vue'
import ScreenFloatingControls from '@/features/dm-screen/components/ScreenFloatingControls.vue'
import ScreenVideoBackground from '@/features/dm-screen/components/ScreenVideoBackground.vue'
import ScreenSidebar from '@/features/dm-screen/components/ScreenSidebar.vue'
import ScreenToolbar from '@/features/dm-screen/components/ScreenToolbar.vue'
import ScreenWorkspace from '@/features/dm-screen/components/ScreenWorkspace.vue'
import { useTheme } from '@/shared/composables/useTheme'
import { useBackgrounds, useFear, useWidgets } from '@/features/dm-screen/composables'
import { computeYouTubeEmbed, load, save } from '@/shared/utils'
import type { DashboardWidget, YoutubeWidget } from '@/features/dm-screen/widgets'

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

const sidebarCollapsed = ref(load<boolean>('sidebarCollapsed', false))
const widgetsCollapsed = ref(load<boolean>('widgetsCollapsed', false))

const toggleDarkMode = () => toggleTheme()

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleWidgets = () => {
  widgetsCollapsed.value = !widgetsCollapsed.value
}

watch(sidebarCollapsed, (v) => save('sidebarCollapsed', v))
watch(widgetsCollapsed, (v) => save('widgetsCollapsed', v))

const isYoutubeBackgroundWidget = (widget: DashboardWidget): widget is YoutubeWidget =>
  widget.type === 'youtube' && widget.background && Boolean(widget.url)

const youtubeBackgroundSrc = computed(() => {
  const yt = widgets.value.find(isYoutubeBackgroundWidget)
  if (!yt) return null
  const embed = computeYouTubeEmbed(yt.url)
  return embed || null
})
</script>
