<template>
  <article :style="computedStyle" class="dh-card relative flex flex-col gap-3 rounded-3xl p-6">
    <div
      aria-hidden="true"
      class="dh-card__overlay pointer-events-none absolute inset-0 rounded-3xl"
    ></div>
    <header v-if="$slots.title" class="dh-card__title relative text-base font-semibold">
      <slot name="title">Card Title</slot>
    </header>
    <div class="dh-card__body relative text-sm leading-relaxed">
      <slot name="body">Card body content goes here.</slot>
    </div>
    <footer
      v-if="$slots.footer"
      class="dh-card__footer relative mt-auto text-xs font-semibold uppercase tracking-[0.18em]"
    >
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

<style scoped>
.dh-card {
  border: 1px solid var(--dh-panel-border);
  background: var(--dh-panel-bg);
  color: var(--dh-panel-text);
  box-shadow: 0 18px 40px var(--dh-shadow);
  backdrop-filter: blur(12px) saturate(180%);
  transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.dh-card__overlay {
  background: var(--dh-card-overlay);
  opacity: 0.9;
}

.dh-card__title {
  color: var(--dh-panel-text);
}

.dh-card__body {
  color: var(--dh-panel-text);
}

.dh-card__footer {
  color: var(--dh-panel-muted);
  letter-spacing: 0.18em;
}

:global(:root) {
  --dh-card-overlay: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.55),
    rgba(255, 255, 255, 0.08)
  );
}

:global(:root[data-theme='dark']) {
  --dh-card-overlay: linear-gradient(
    135deg,
    rgba(123, 146, 220, 0.2),
    rgba(56, 73, 132, 0.12)
  );
}
</style>
