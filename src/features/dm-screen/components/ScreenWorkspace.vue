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
          v-for="widget in widgets"
          :key="widget.id"
          v-memo="widgetMemo(widget)"
          :widget="widget"
          :size-options="sizeOptions"
          :span-class="spanClassForSize(widget.size)"
          :active="widget.id === activeWidgetId"
          :show-title-input="widget.type === 'note' || widget.type === 'conditions'"
          :fallback-title="widget.type === 'countdown' ? 'Countdown' : widget.type === 'conditions' ? 'Condition Rules' : 'Untitled Widget'"
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
          <ConditionsRulesWidgetCard
            v-else-if="widget.type === 'conditions'"
            :widget="widget"
            @update="(payload) => emitUpdate(widget.id, payload)"
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
import { toRefs } from 'vue'

import { CountdownWidgetCard, type CountdownConfig } from '@/features/countdown'
import { ConditionsRulesWidgetCard } from '@/features/conditions'
import type { DashboardWidget, SizeOption, WidgetSize, WidgetUpdateKey } from '@/features/dm-screen/widgets'
import WidgetCardShell from '@/features/dm-screen/components/widgets/WidgetCardShell.vue'
import NoteWidgetPanel from '@/features/dm-screen/components/widgets/NoteWidgetPanel.vue'
import SpotifyWidgetPanel from '@/features/dm-screen/components/widgets/SpotifyWidgetPanel.vue'
import YoutubeWidgetPanel from '@/features/dm-screen/components/widgets/YoutubeWidgetPanel.vue'

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

const emitUpdate = (id: string, payload: { key: WidgetUpdateKey; value: string | boolean }) => {
  emit('update-widget', { id, ...payload })
}

const widgetMemo = (widget: DashboardWidget) => {
  const base: Array<string | number | boolean | null> = [
    widget.id,
    widget.type,
    widget.size,
    widget.editing,
    Boolean(widget.hidden),
    widget.title,
  ]

  switch (widget.type) {
    case 'note':
      base.push(widget.body)
      break
    case 'countdown':
      base.push(
        widget.description,
        widget.countdown.title,
        widget.countdown.description,
        widget.countdown.paletteId,
        widget.countdown.iconId,
        widget.countdown.stepCount,
        widget.countdown.buttonSizeId,
        widget.countdown.cardVariantId,
        widget.countdown.progress,
      )
      break
    case 'conditions':
      base.push(widget.description, widget.titleColor ?? null, widget.dividerColor ?? null)
      break
    case 'youtube':
      base.push(widget.url, widget.background, widget.muted ?? null)
      break
    case 'spotify':
      base.push(widget.url)
      break
    default:
      break
  }

  return base
}
</script>
