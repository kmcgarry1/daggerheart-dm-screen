<template>
  <div class="fear-tracker">
    <div v-if="!collapsed" class="fear-tracker__card">
      <TrackerControl
        :model-value="value"
        :options="options"
        :palette="palette"
        title="Fear"
        description="Track rising dread across the table."
        track-label="Fear level buttons"
        :card-variant="{ width: '100', height: '100' }"
        @update:modelValue="handleUpdate"
      />
      <button type="button" class="fear-tracker__collapse" @click="collapsed = true">
        Collapse
      </button>
    </div>
    <button v-else type="button" class="fear-tracker__compact" @click="collapsed = false">
      <span class="fear-tracker__compact-icon" aria-hidden="true">
        <SkullIcon />
      </span>
      <span class="fear-tracker__compact-text">
        <span class="fear-tracker__compact-label">Fear</span>
        <span class="fear-tracker__compact-value">{{ value }}</span>
      </span>
      <span class="fear-tracker__compact-hint">Tap to expand</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { TrackerControl, SkullIcon, fearPalette } from '@/features/tracker'

const props = defineProps<{
  value: number
}>()

const value = computed(() => props.value)
const collapsed = ref(false)

const emit = defineEmits<{
  (e: 'update:value', value: number): void
}>()

const totalSteps = 12
const palette = fearPalette

const options = computed(() =>
  Array.from({ length: totalSteps }, (_, index) => {
    const level = index + 1
    return {
      value: level,
      label: `Set fear to ${level}`,
      icon: SkullIcon,
    }
  }),
)

const handleUpdate = (value: number) => {
  emit('update:value', value)
}
</script>

<style scoped>
.fear-tracker {
  width: 100%;
}

.fear-tracker__card {
  position: relative;
  width: 100%;
}

.fear-tracker__collapse {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border-radius: 9999px;
  border: 1px solid var(--fear-btn-border);
  background: var(--fear-btn-bg);
  color: var(--fear-btn-icon);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.35rem 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  box-shadow: 0 6px 16px var(--fear-btn-hover-shadow);
}

.fear-tracker__collapse:hover {
  border-color: var(--fear-btn-hover-border);
}

.fear-tracker__collapse:active {
  background: var(--fear-btn-active-bg);
  border-color: var(--fear-btn-active-border);
  color: var(--fear-btn-icon-active);
}

.fear-tracker__compact {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-radius: 9999px;
  border: 1px solid var(--fear-btn-border);
  background: var(--fear-btn-bg);
  padding: 0.9rem 1.4rem;
  color: var(--fear-btn-icon);
  font-weight: 600;
  box-shadow: 0 12px 26px var(--fear-btn-hover-shadow);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease,
    color 0.2s ease;
}

.fear-tracker__compact:hover {
  border-color: var(--fear-btn-hover-border);
}

.fear-tracker__compact:active {
  background: var(--fear-btn-active-bg);
  border-color: var(--fear-btn-active-border);
  color: var(--fear-btn-icon-active);
}

.fear-tracker__compact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 9999px;
  background: var(--fear-chip-bg);
  color: var(--fear-btn-icon-accent);
  box-shadow: inset 0 0 0 1px var(--fear-border);
}

.fear-tracker__compact-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
}

.fear-tracker__compact-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--fear-chip-text);
}

.fear-tracker__compact-value {
  font-size: clamp(1.2rem, 4vw, 1.6rem);
  color: var(--fear-btn-icon);
}

.fear-tracker__compact-hint {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--fear-chip-text);
}

@media (max-width: 640px) {
  .fear-tracker__compact {
    padding-inline: 1rem;
  }

  .fear-tracker__compact-value {
    font-size: clamp(1rem, 6vw, 1.4rem);
  }
}
</style>
