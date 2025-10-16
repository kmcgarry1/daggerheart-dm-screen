<template>
  <dh-card
    :class="[
      'relative flex flex-col gap-4 transition-all duration-200',
      spanClass,
      active ? 'ring-2 ring-violet-400/70 shadow-2xl' : 'hover:-translate-y-1 hover:shadow-xl',
      widget.hidden ? 'opacity-80' : '',
    ]"
  >
    <template #title>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <input
          v-if="showTitleField && widget.editing"
          :id="`${widget.id}-title`"
          :value="widget.title"
          type="text"
          placeholder="Widget title"
          class="w-full flex-1 rounded-xl border border-violet-200/70 bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:border-violet-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          @input="onTitleInput"
        />
        <span v-else class="text-base font-semibold">
          <slot name="title" :title="displayTitle">
            {{ displayTitle }}
          </slot>
        </span>
        <div class="flex items-center gap-2">
          <slot name="actions" :widget="widget">
            <select
              v-if="widget.editing"
              :value="widget.size"
              class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-2.5 py-2 text-xs font-semibold text-[color:var(--dh-panel-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
              @change="onSizeChange"
            >
              <option v-for="option in sizeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <button
              type="button"
              class="dh-toggle px-3 py-2"
              @click="$emit('toggle-edit', widget.id)"
              :aria-label="widget.editing ? 'Save widget' : 'Edit widget'"
            >
              <span class="sr-only">{{ widget.editing ? 'Save' : 'Edit' }}</span>
              <svg
                v-if="widget.editing"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                class="h-5 w-5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.688 1.688m-2.256-0.598-9.356 9.356a2.25 2.25 0 0 0-0.636 1.236L6 18l1.924-0.32a2.25 2.25 0 0 0 1.236-0.636l9.356-9.356a1.125 1.125 0 0 0 0-1.59l-2.652-2.652a1.125 1.125 0 0 0-1.59 0Z"
                />
              </svg>
            </button>
            <button
              type="button"
              class="dh-toggle border border-rose-300/60 bg-rose-500/10 px-3 py-2 text-rose-400 hover:border-rose-300"
              @click="$emit('remove', widget.id)"
              aria-label="Delete widget"
            >
              <span class="sr-only">Delete</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L5.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 7.5-.562 48.11 48.11 0 0 1 7.5.562m-15 0L4.86 19.673A2.25 2.25 0 0 0 7.104 21.75h7.832"
                />
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6.75h3" />
              </svg>
            </button>
            <button
              v-if="!widget.hidden"
              type="button"
              class="dh-toggle px-2 py-1 text-xs"
              @click="updateWidget('hidden', true)"
              aria-label="Minimize widget"
              title="Minimize"
            >
              —
            </button>
            <button
              v-else
              type="button"
              class="dh-toggle px-2 py-1 text-xs"
              @click="updateWidget('hidden', false)"
              aria-label="Restore widget"
              title="Restore"
            >
              ◼
            </button>
          </slot>
        </div>
      </div>
    </template>
    <template #body>
      <slot />
    </template>
  </dh-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { DhCard } from '@/shared/ui'
import type { DashboardWidget, SizeOption, WidgetUpdateKey } from '@/features/dm-screen/widgets'

const props = defineProps<{
  widget: DashboardWidget
  sizeOptions: SizeOption[]
  spanClass: string
  active: boolean
  showTitleInput?: boolean
  fallbackTitle?: string
}>()

const emit = defineEmits<{
  (e: 'toggle-edit', id: string): void
  (e: 'remove', id: string): void
  (e: 'update-widget', payload: { id: string; key: WidgetUpdateKey; value: string | boolean }): void
}>()

const showTitleField = computed(() => props.showTitleInput ?? false)

const displayTitle = computed(() => {
  const trimmed = props.widget.title?.trim()
  if (trimmed && trimmed.length > 0) return trimmed
  return props.fallbackTitle ?? 'Untitled Widget'
})

const onTitleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  emit('update-widget', { id: props.widget.id, key: 'title', value: target?.value ?? '' })
}

const onSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement | null
  if (!target) return
  emit('update-widget', { id: props.widget.id, key: 'size', value: target.value })
}

const updateWidget = (key: WidgetUpdateKey, value: string | boolean) => {
  emit('update-widget', { id: props.widget.id, key, value })
}
</script>
