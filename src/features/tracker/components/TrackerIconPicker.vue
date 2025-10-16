<template>
  <div class="flex flex-col gap-3">
    <input
      v-model="searchQuery"
      :placeholder="searchPlaceholder"
      type="search"
      class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
    />

    <div v-if="filteredOptions.length > 0" class="grid grid-cols-4 gap-2 md:grid-cols-5">
      <button
        v-for="option in filteredOptions"
        :key="option.id"
        type="button"
        :aria-pressed="isSelected(option.id)"
        :class="[
          'group flex flex-col items-center justify-center gap-2 rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-3 text-xs font-semibold text-[color:var(--dh-panel-text)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover:border-[color:var(--dh-panel-border-strong,rgba(255,255,255,0.3))] hover:bg-[color:var(--dh-panel-border-soft,rgba(255,255,255,0.08))]',
          isSelected(option.id)
            ? 'border-violet-300 bg-violet-500/10 text-violet-100 shadow-inner hover:border-violet-300'
            : null,
        ]"
        :title="option.label"
        @click="handleSelect(option.id)"
      >
        <component
          :is="option.icon"
          class="h-7 w-7 text-[color:var(--dh-panel-text)] transition-colors duration-150 group-hover:text-[color:var(--dh-panel-text-strong,rgba(255,255,255,0.95))]"
        />
        <span class="text-[0.65rem] uppercase tracking-[0.12em] text-[color:var(--dh-panel-muted)]">
          {{ option.label }}
        </span>
      </button>
    </div>
    <p
      v-else
      class="rounded-xl border border-dashed border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-4 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--dh-panel-muted)]"
      role="status"
    >
      No icons match "{{ searchQuery }}"
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import type { TrackerIconOption } from '../registry'

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    options: TrackerIconOption[]
    searchPlaceholder?: string
  }>(),
  {
    modelValue: '',
    searchPlaceholder: 'Search icons',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const searchQuery = ref('')

const normalizedValue = computed(() => props.modelValue ?? '')

const filteredOptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return props.options
  return props.options.filter((option) => {
    const label = option.label.toLowerCase()
    const id = option.id.toLowerCase()
    return label.includes(query) || id.includes(query)
  })
})

const isSelected = (id: string) => id === normalizedValue.value

const handleSelect = (id: string) => {
  if (id === normalizedValue.value) return
  emit('update:modelValue', id)
  emit('change', id)
}
</script>
