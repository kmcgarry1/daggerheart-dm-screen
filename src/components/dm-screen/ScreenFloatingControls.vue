<template>
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
      @click="$emit('toggle-sidebar')"
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
      @click="$emit('toggle-widgets')"
    >
      Show Widgets
    </button>
  </Transition>
</template>

<script lang="ts" setup>
defineProps<{
  sidebarCollapsed: boolean
  widgetsCollapsed: boolean
}>()

defineEmits<{
  (e: 'toggle-sidebar'): void
  (e: 'toggle-widgets'): void
}>()
</script>
