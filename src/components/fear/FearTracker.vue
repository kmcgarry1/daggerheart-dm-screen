<template>
  <section class="fear-track dh-glass p-4 md:p-6" aria-label="Fear tracker">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <div class="space-y-1">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--dh-panel-muted)]">
          Daggerheart
        </p>
        <h1 class="text-2xl font-semibold text-[color:var(--dh-panel-text)]">Fear Tracker</h1>
      </div>
      <div class="fear-track__badge" aria-live="polite">
        <span class="fear-track__badge-label">Fear</span>
        <strong>{{ value }}</strong>
        <span class="fear-track__badge-max">/ 12</span>
      </div>
    </header>

    <div class="fear-track__stage">
      <div class="fear-track__rail" aria-hidden="true" ref="progressTrackRef">
        <div class="fear-track__fill" :style="{ width: progressWidth }"></div>
        <div class="fear-track__glow" :style="{ width: progressWidth }"></div>
      </div>

      <div class="fear-track__buttons" role="group" aria-label="Fear level buttons">
        <button
          v-for="index in totalSteps"
          :key="index"
          type="button"
          class="fear-track__btn"
          :class="{
            'fear-track__btn--active': isActive(index),
            'fear-track__btn--burst': isBurst(index),
          }"
          :ref="(el) => setButtonRef(el, index - 1)"
          :aria-pressed="isActive(index)"
          :aria-label="buttonLabel(index)"
          @click="handleClick(index)"
        >
          <span class="fear-track__skull" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                class="fear-track__skull-outline"
                d="M16 4C9.92487 4 5 8.92487 5 15C5 18.533 6.63333 20.9333 9.9 22.2L10 26C10 27.1046 10.8954 28 12 28H14V25C14 24.4477 14.4477 24 15 24H17C17.5523 24 18 24.4477 18 25V28H20C21.1046 28 22 27.1046 22 26L22.1 22.2C25.3667 20.9333 27 18.533 27 15C27 8.92487 22.0751 4 16 4Z"
              />
              <path
                class="fear-track__skull-eye"
                d="M12.5 15C13.3284 15 14 14.3284 14 13.5C14 12.6716 13.3284 12 12.5 12C11.6716 12 11 12.6716 11 13.5C11 14.3284 11.6716 15 12.5 15Z"
              />
              <path
                class="fear-track__skull-eye"
                d="M19.5 15C20.3284 15 21 14.3284 21 13.5C21 12.6716 20.3284 12 19.5 12C18.6716 12 18 12.6716 18 13.5C18 14.3284 18.6716 15 19.5 15Z"
              />
              <path
                class="fear-track__skull-nose"
                d="M16 19C17.1046 19 18 18.1046 18 17H14C14 18.1046 14.8954 19 16 19Z"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  value: number
}>()

const emit = defineEmits<{
  (e: 'update:value', payload: number): void
}>()

const totalSteps = 12

const burstIndex = ref<number | null>(null)
let burstTimer: number | null = null

const progressTrackRef = ref<HTMLDivElement | null>(null)
const buttonRefs = ref<(HTMLButtonElement | null)[]>(Array(totalSteps).fill(null))
const progressWidth = ref('0px')

const clampedValue = computed(() => Math.max(0, Math.min(totalSteps, props.value)))

const isActive = (index: number) => index <= props.value

const isBurst = (index: number) => burstIndex.value === index

const buttonLabel = (index: number) => {
  const level = index
  return `Set fear to ${level}`
}

const handleClick = (index: number) => {
  const level = index
  if (level === props.value && props.value > 0) {
    emit('update:value', level - 1)
    return
  }
  emit('update:value', level)
}

const updateProgressWidth = () => {
  if (typeof window === 'undefined') return
  const level = clampedValue.value
  const track = progressTrackRef.value
  if (!track) return

  if (level <= 0) {
    progressWidth.value = '0px'
    return
  }

  const targetButton = buttonRefs.value[level - 1]
  const firstButton = buttonRefs.value[0]
  const lastButton = buttonRefs.value[totalSteps - 1]
  if (!targetButton || !firstButton || !lastButton) return

  const trackRect = track.getBoundingClientRect()
  const targetRect = targetButton.getBoundingClientRect()
  const firstRect = firstButton.getBoundingClientRect()
  const lastRect = lastButton.getBoundingClientRect()

  const firstCenter = firstRect.left - trackRect.left + firstRect.width / 2
  const lastCenter = lastRect.left - trackRect.left + lastRect.width / 2
  const targetCenter = targetRect.left - trackRect.left + targetRect.width / 2

  const normalized =
    lastCenter === firstCenter
      ? 0
      : (targetCenter - firstCenter) / (lastCenter - firstCenter)

  const clampedNormalized = Math.max(0, Math.min(1, normalized))
  const width = firstCenter + (lastCenter - firstCenter) * clampedNormalized

  progressWidth.value = `${Math.max(0, Math.min(width, trackRect.width))}px`
}

const setButtonRef = (el: HTMLButtonElement | null, index: number) => {
  buttonRefs.value[index] = el
  void nextTick(updateProgressWidth)
}

watch(
  () => props.value,
  (next, prev = 0) => {
    if (typeof window === 'undefined') return
    if (next > prev) {
      burstIndex.value = Math.min(next, totalSteps)
      if (burstTimer !== null) {
        window.clearTimeout(burstTimer)
      }
      burstTimer = window.setTimeout(() => {
        burstIndex.value = null
        burstTimer = null
      }, 450)
    } else {
      burstIndex.value = null
      if (burstTimer !== null) {
        window.clearTimeout(burstTimer)
        burstTimer = null
      }
    }
    void nextTick(updateProgressWidth)
  },
)

onMounted(() => {
  void nextTick(updateProgressWidth)
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateProgressWidth)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateProgressWidth)
  }
  if (burstTimer !== null && typeof window !== 'undefined') {
    window.clearTimeout(burstTimer)
    burstTimer = null
  }
})
</script>

<style scoped>
.fear-track {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.fear-track__badge {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  border-radius: 999px;
  border: 1px solid var(--fear-border);
  background: var(--fear-chip-bg);
  color: var(--fear-chip-text);
  padding: 0.55rem 1.15rem;
  box-shadow: 0 14px 30px var(--dh-shadow);
  transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

.fear-track__badge strong {
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  line-height: 1;
  letter-spacing: -0.03em;
}

.fear-track__badge-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.22em;
}

.fear-track__badge-max {
  font-size: 0.85rem;
  opacity: 0.7;
}

.fear-track__stage {
  position: relative;
  padding: 1rem 0.3rem 0.45rem;
}

.fear-track__rail {
  position: absolute;
  inset: 50% 0 auto 0;
  height: 0.6rem;
  border-radius: 999px;
  transform: translateY(-50%);
  background: var(--fear-rail);
  overflow: hidden;
  transition: background 0.3s ease;
}

.fear-track__fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--fear-fill);
  box-shadow: 0 0 30px var(--fear-glow);
  transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease;
}

.fear-track__glow {
  position: absolute;
  inset: -40% 0;
  border-radius: inherit;
  background: radial-gradient(circle, var(--fear-glow) 0%, rgba(0, 0, 0, 0) 70%);
  filter: blur(26px);
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease;
}

.fear-track__buttons {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: clamp(0.4rem, 0.9vw, 0.7rem);
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 0.3rem 0.4rem;
  scrollbar-width: none;
}

.fear-track__buttons::-webkit-scrollbar {
  display: none;
}

.fear-track__btn {
  position: relative;
  flex: 0 0 auto;
  width: clamp(2.8rem, 4vw, 3.4rem);
  height: clamp(2.8rem, 4vw, 3.4rem);
  border-radius: 999px;
  border: 2px solid var(--fear-btn-border);
  background: var(--fear-btn-bg);
  color: var(--fear-btn-icon);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
    border-color 0.22s ease,
    box-shadow 0.25s ease,
    background 0.22s ease,
    color 0.22s ease;
}

.fear-track__btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.55) 0%, rgba(167, 139, 250, 0) 70%);
  opacity: 0;
  transform: scale(0.6);
  pointer-events: none;
}

.fear-track__btn:hover {
  transform: translateY(-4px);
  border-color: var(--fear-btn-hover-border);
  box-shadow: 0 20px 34px var(--fear-btn-hover-shadow);
}

.fear-track__btn--active {
  background: var(--fear-btn-active-bg);
  border-color: var(--fear-btn-active-border);
  color: var(--fear-btn-icon-active);
  box-shadow: 0 22px 38px var(--fear-btn-hover-shadow);
}

.fear-track__btn--active .fear-track__skull svg {
  transform: translateY(-1px);
}

.fear-track__btn--burst::after {
  animation: fear-burst 0.55s ease-out forwards;
}

.fear-track__skull {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.fear-track__skull svg {
  width: clamp(1.2rem, 2.4vw, 1.6rem);
  height: clamp(1.2rem, 2.4vw, 1.6rem);
  transition: transform 0.18s ease, filter 0.22s ease;
}

.fear-track__skull-outline {
  stroke: currentColor;
  stroke-width: 1.5;
  fill: rgba(255, 255, 255, 0.85);
  transition: fill 0.22s ease, stroke 0.22s ease;
}

.fear-track__skull-eye,
.fear-track__skull-nose {
  fill: currentColor;
  transition: fill 0.22s ease;
}

.fear-track__btn--active .fear-track__skull-outline {
  fill: rgba(255, 255, 255, 0.94);
  stroke: rgba(255, 255, 255, 0.98);
}

.fear-track__btn--active .fear-track__skull-eye,
.fear-track__btn--active .fear-track__skull-nose {
  fill: var(--fear-btn-icon-accent);
}

@keyframes fear-burst {
  0% {
    opacity: 0.9;
    transform: scale(0.4);
  }
  40% {
    opacity: 1;
    transform: scale(1.2);
  }
  70% {
    opacity: 0.6;
    transform: scale(1.35);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}

@media (max-width: 768px) {
  .fear-track__stage {
    padding: 1.25rem 0.2rem 0.4rem;
  }

  .fear-track__buttons {
    justify-content: flex-start;
    gap: 0.5rem;
  }
}
</style>
