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
        <dh-card
          v-for="widget in widgets"
          :key="widget.id"
          :class="[
            'relative flex flex-col gap-4 transition-all duration-200',
            spanClassForSize(widget.size),
            widget.id === activeWidgetId
              ? 'ring-2 ring-violet-400/70 shadow-2xl'
              : 'hover:-translate-y-1 hover:shadow-xl',
          ]"
        >
          <template #title>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <input
                v-if="widget.editing"
                :value="widget.title"
                type="text"
                placeholder="Widget title"
                class="w-full flex-1 rounded-xl border border-violet-200/70 bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:border-violet-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                @input="updateWidget(widget.id, 'title', ($event.target as HTMLInputElement).value)"
              />
              <span v-else class="text-base font-semibold">
                {{ widget.title || 'Untitled Widget' }}
              </span>
              <div class="flex items-center gap-2">
                <select
                  v-if="widget.editing"
                  :value="widget.size"
                  class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-2.5 py-2 text-xs font-semibold text-[color:var(--dh-panel-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                  @change="updateWidget(widget.id, 'size', ($event.target as HTMLSelectElement).value)"
                >
                  <option
                    v-for="option in sizeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <button
                  type="button"
                  class="dh-toggle px-3 py-2"
                  @click="$emit('toggle-edit', widget.id)"
                  :aria-label="widget.editing ? 'Save widget' : 'Edit widget'"
                >
                  {{ widget.editing ? 'Save' : 'Edit' }}
                </button>
                <button
                  type="button"
                  class="dh-toggle border border-rose-300/60 bg-rose-500/10 px-3 py-2 text-rose-400 hover:border-rose-300"
                  @click="$emit('remove-widget', widget.id)"
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
              :value="widget.body"
              rows="4"
              placeholder="Notes, trackers, reminders..."
              class="w-full rounded-xl border border-violet-200/70 bg-[var(--dh-panel-bg)] px-3 py-3 text-sm text-[color:var(--dh-panel-text)] shadow-sm focus:border-violet-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
              @input="updateWidget(widget.id, 'body', ($event.target as HTMLTextAreaElement).value)"
            ></textarea>
            <p v-else class="text-sm leading-relaxed text-[color:var(--dh-panel-muted)]">
              {{ widget.body || 'Add notes or quick references for your session.' }}
            </p>
          </template>
        </dh-card>
      </div>
      <div
        v-else
        key="workspace-collapsed"
        class="dh-glass flex min-h-[280px] flex-col items-center justify-center gap-4 p-6 text-center"
      >
        <p class="text-sm text-[color:var(--dh-panel-muted)]">
          Widgets are hidden. Bring them back whenever you need them.
        </p>
        <button type="button" class="dh-toggle" @click="$emit('toggle-collapsed')">
          Show Widgets
        </button>
      </div>
    </Transition>
  </section>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'

import DhCard from '../core/DhCard.vue'

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
  (e: 'update-widget', payload: { id: string; key: 'title' | 'body' | 'size'; value: string }): void
  (e: 'toggle-collapsed'): void
}>()

const updateWidget = (id: string, key: 'title' | 'body' | 'size', value: string) => {
  emit('update-widget', { id, key, value })
}

const { widgets, activeWidgetId, sizeOptions, spanClassForSize, collapsed } = toRefs(props)
</script>
