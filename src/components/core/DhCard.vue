<template>
  <article
    :style="computedStyle"
    class="relative flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/70 p-6 text-slate-700 shadow-xl backdrop-blur-2xl"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/50 via-transparent to-white/10"
    ></div>
    <header v-if="$slots.title" class="relative text-base font-semibold text-slate-800">
      <slot name="title">Card Title</slot>
    </header>
    <div class="relative text-sm leading-relaxed">
      <slot name="body">Card body content goes here.</slot>
    </div>
    <footer v-if="$slots.footer" class="relative mt-auto text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
      <slot name="footer"></slot>
    </footer>
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

type SizeVariant = '20' | '40' | '50' | '100'

const props = withDefaults(
  defineProps<{
    widthVariant?: SizeVariant
    heightVariant?: SizeVariant
  }>(),
  {
    widthVariant: '100',
    heightVariant: '100',
  },
)

const percentMap: Record<SizeVariant, string> = {
  '20': '20%',
  '40': '40%',
  '50': '50%',
  '100': '100%',
}

const computedStyle = computed(() => ({
  width: percentMap[props.widthVariant as SizeVariant],
  height: percentMap[props.heightVariant as SizeVariant],
}))
</script>
