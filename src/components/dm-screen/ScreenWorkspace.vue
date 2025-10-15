<template>
  <section class="flex flex-col gap-6" aria-label="Dashboard workspace">
    <Transition
      enter-active-class="transition duration-400 transform"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-300 transform"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
      mode="out-in"
    >
      <div
        v-if="!collapsed"
        key="workspace-grid"
        class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        <WidgetCardShell
          v-for="widget in renderedWidgets"
          :key="widget.id"
          :widget="widget"
          :size-options="sizeOptions"
          :span-class="spanClassForSize(widget.size)"
          :active="widget.id === activeWidgetId"
          :show-title-input="widget.type === 'note'"
          :fallback-title="widget.type === 'countdown' ? 'Countdown' : 'Untitled Widget'"
          @toggle-edit="$emit('toggle-edit', widget.id)"
          @remove="$emit('remove-widget', widget.id)"
          @update-widget="(payload) => emitUpdate(widget.id, payload)"
        >
          <NoteWidgetPanel
            v-if="widget.type === 'note'"
            :widget="widget"
            @update-body="(value) => emitUpdate(widget.id, { key: 'body', value })"
          />
          <CountdownWidgetCard
            v-else-if="widget.type === 'countdown'"
            :config="widget.countdown"
            :editing="widget.editing"
            @update:config="$emit('update-countdown', { id: widget.id, ...$event })"
          />
          <YoutubeWidgetPanel
            v-else-if="widget.type === 'youtube'"
            :widget="widget"
            @update="(payload) => emitUpdate(widget.id, payload)"
          />
          <SpotifyWidgetPanel
            v-else-if="widget.type === 'spotify'"
            :widget="widget"
            @update="(payload) => emitUpdate(widget.id, payload)"
          />
        </WidgetCardShell>
      </div>
    </Transition>
  </section>
</template>

<script lang="ts" setup>
import { computed, toRefs } from 'vue'

import CountdownWidgetCard from '../countdown/CountdownWidgetCard.vue'
import type { CountdownConfig } from '../countdown/types'
import WidgetCardShell from './widgets/WidgetCardShell.vue'
import NoteWidgetPanel from './widgets/NoteWidgetPanel.vue'
import SpotifyWidgetPanel from './widgets/SpotifyWidgetPanel.vue'
import YoutubeWidgetPanel from './widgets/YoutubeWidgetPanel.vue'
import type { DashboardWidget, SizeOption, WidgetSize } from '../../widgets/types'
import type { WidgetUpdateKey } from '../../widgets/updateHandlers'

const props = defineProps<{
  widgets: DashboardWidget[]
  activeWidgetId: string | null
  sizeOptions: SizeOption[]
  spanClassForSize: (size: WidgetSize) => string
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-edit', id: string): void
  (e: 'remove-widget', id: string): void
  (e: 'update-widget', payload: { id: string; key: WidgetUpdateKey; value: string | boolean }): void
  (
    e: 'update-countdown',
    payload: { id: string; config: CountdownConfig; title: string; description: string },
  ): void
}>()

const { widgets, activeWidgetId, sizeOptions, spanClassForSize, collapsed } = toRefs(props)

const renderedWidgets = computed(() => widgets.value.filter((widget) => !widget.hidden))

const emitUpdate = (id: string, payload: { key: WidgetUpdateKey; value: string | boolean }) => {
  emit('update-widget', { id, ...payload })
}
</script>
