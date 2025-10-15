<template>
  <DhCard
    v-if="standaloneCard"
    v-bind="attrs"
    :width-variant="cardVariant.width"
    :height-variant="cardVariant.height"
  >
    <template v-if="title" #title>
      <span class="tracker-heading">
        {{ title }}
      </span>
    </template>

    <template #body>
      <div class="flex flex-col gap-3">
        <p
          v-if="description"
          class="tracker-subheading"
        >
          {{ description }}
        </p>

        <div class="relative px-1 pt-5 pb-1.5 md:px-2 md:pt-4 md:pb-2">
          <div
            ref="progressTrackRef"
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 transform"
          >
            <div class="relative h-[1.6rem]">
              <div
                class="absolute top-1/2 h-[0.6rem] -translate-y-1/2 rounded-full transition-colors duration-300"
                :style="{
                  left: trackStart,
                  width: trackLength,
                  background: palette.rail,
                }"
              ></div>
              <div
                class="absolute top-1/2 h-[0.6rem] -translate-y-1/2 rounded-full transition-[width] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                :style="{
                  left: trackStart,
                  width: progressWidth,
                  background: palette.fill,
                  boxShadow: `0 0 30px ${palette.glow}`,
                }"
              ></div>
              <div
                class="pointer-events-none absolute top-1/2 h-[1.6rem] -translate-y-1/2 rounded-full blur-[26px] transition-[width] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                :style="{
                  left: trackStart,
                  width: progressWidth,
                  background: `radial-gradient(circle, ${palette.glow} 0%, rgba(0, 0, 0, 0) 70%)`,
                }"
              ></div>
            </div>
          </div>

          <div
            ref="buttonRowRef"
            class="relative z-[1] flex flex-nowrap justify-start gap-[0.5rem] overflow-x-auto px-1 py-1.5 md:justify-between md:gap-[clamp(0.4rem,_0.9vw,_0.7rem)] md:px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="group"
            :aria-label="trackLabel"
          >
            <TrackerOptionButton
              v-for="(option, index) in options"
              :key="option.value"
              :active="isActive(option)"
              :burst="burstIndex === option.value"
              :palette="paletteAt(index)"
              :burst-gradient="burstGradient"
              :size-classes="buttonSizeClasses"
              @activate="handleClick(option)"
              :aria-pressed="isActive(option)"
              :aria-label="option.label"
              :data-tracker-option="index"
            >
              <component
                :is="option.icon"
                class="h-[clamp(1.2rem,_2.4vw,_1.6rem)] w-[clamp(1.2rem,_2.4vw,_1.6rem)] transition-transform duration-200 ease-out"
                :class="{ '-translate-y-px': isActive(option) }"
                v-bind="option.iconProps"
              />
            </TrackerOptionButton>
          </div>
        </div>
      </div>
    </template>
  </DhCard>
  <div v-else v-bind="attrs" class="flex flex-col gap-3">
    <p v-if="title" class="tracker-heading">
      {{ title }}
    </p>
    <p
      v-if="description"
      class="tracker-subheading"
    >
      {{ description }}
    </p>
    <div class="relative px-1 pt-5 pb-1.5 md:px-2 md:pt-4 md:pb-2">
      <div
        ref="progressTrackRef"
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 transform"
      >
        <div class="relative h-[1.6rem]">
          <div
            class="absolute top-1/2 h-[0.6rem] -translate-y-1/2 rounded-full transition-colors duration-300"
            :style="{
              left: trackStart,
              width: trackLength,
              background: palette.rail,
            }"
          ></div>
          <div
            class="absolute top-1/2 h-[0.6rem] -translate-y-1/2 rounded-full transition-[width] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            :style="{
              left: trackStart,
              width: progressWidth,
              background: palette.fill,
              boxShadow: `0 0 30px ${palette.glow}`,
            }"
          ></div>
          <div
            class="pointer-events-none absolute top-1/2 h-[1.6rem] -translate-y-1/2 rounded-full blur-[26px] transition-[width] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            :style="{
              left: trackStart,
              width: progressWidth,
              background: `radial-gradient(circle, ${palette.glow} 0%, rgba(0, 0, 0, 0) 70%)`,
            }"
          ></div>
        </div>
      </div>

      <div
        ref="buttonRowRef"
        class="relative z-[1] flex flex-nowrap justify-start gap-[0.5rem] overflow-x-auto px-1 py-1.5 md:justify-between md:gap-[clamp(0.4rem,_0.9vw,_0.7rem)] md:px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        :aria-label="trackLabel"
      >
        <TrackerOptionButton
          v-for="(option, index) in options"
          :key="option.value"
          :active="isActive(option)"
          :burst="burstIndex === option.value"
          :palette="paletteAt(index)"
          :burst-gradient="burstGradient"
          :size-classes="buttonSizeClasses"
          @activate="handleClick(option)"
          :aria-pressed="isActive(option)"
          :aria-label="option.label"
          :data-tracker-option="index"
        >
          <component
            :is="option.icon"
            class="h-[clamp(1.2rem,_2.4vw,_1.6rem)] w-[clamp(1.2rem,_2.4vw,_1.6rem)] transition-transform duration-200 ease-out"
            :class="{ '-translate-y-px': isActive(option) }"
            v-bind="option.iconProps"
          />
        </TrackerOptionButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

defineOptions({
  inheritAttrs: false,
})

import DhCard from '../core/DhCard.vue'
import TrackerOptionButton from './TrackerOptionButton.vue'
import type {
  TrackerCardVariant,
  TrackerOption,
  TrackerPalette,
  TrackerButtonPalette,
} from './types'

const props = withDefaults(
  defineProps<{
    modelValue: number
    options: TrackerOption[]
    palette: TrackerPalette
    title?: string
    description?: string
    trackLabel?: string
    cardVariant?: TrackerCardVariant
    buttonSizeClasses?: string
    standaloneCard?: boolean
  }>(),
  {
    title: undefined,
    description: undefined,
    trackLabel: 'Tracker options',
    cardVariant: () => ({
      width: '100',
      height: '100',
    }),
    buttonSizeClasses: 'h-[clamp(2.8rem,_4vw,_3.4rem)] w-[clamp(2.8rem,_4vw,_3.4rem)]',
    standaloneCard: true,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

const attrs = useAttrs()

const burstIndex = ref<number | null>(null)
let burstTimer: number | null = null

const progressTrackRef = ref<HTMLDivElement | null>(null)
const buttonRowRef = ref<HTMLDivElement | null>(null)
const progressWidth = ref('0px')
const trackStart = ref('0px')
const trackLength = ref('0px')

const burstGradient = computed(
  () => `radial-gradient(circle, ${props.palette.burst} 0%, rgba(0, 0, 0, 0) 70%)`,
)

const cardVariant = computed(() => props.cardVariant ?? { width: '100', height: '100' })

const buttonSizeClasses = computed(() => props.buttonSizeClasses)

const totalSteps = computed(() => props.options.length)

const clampedValue = computed(() =>
  Math.max(0, Math.min(totalSteps.value, props.modelValue)),
)

const mergePalette = (
  base: TrackerButtonPalette,
  override?: Partial<TrackerButtonPalette>,
): TrackerButtonPalette => {
  if (!override) return base
  return {
    base: {
      ...base.base,
      ...(override.base ?? {}),
    },
    active: {
      ...base.active,
      ...(override.active ?? {}),
    },
  }
}

const optionPalettes = computed(() =>
  props.options.map((option) => mergePalette(props.palette.button, option.paletteOverride)),
)

const paletteAt = (index: number) => optionPalettes.value[index] ?? props.palette.button

const isActive = (option: TrackerOption) => option.value <= props.modelValue

const handleClick = (option: TrackerOption) => {
  const level = option.value
  if (level === props.modelValue && props.modelValue > 0) {
    emit('update:modelValue', level - 1)
    emit('change', level - 1)
    return
  }
  emit('update:modelValue', level)
  emit('change', level)
}

const updateProgressWidth = () => {
  if (typeof window === 'undefined') return
  const track = progressTrackRef.value
  if (!track) return

  const buttons = buttonRowRef.value?.querySelectorAll<HTMLButtonElement>('button[data-tracker-option]')
  if (!buttons || buttons.length === 0) {
    progressWidth.value = '0px'
    trackStart.value = '0px'
    trackLength.value = '0px'
    return
  }

  const firstButton = buttons[0]
  const lastButton = buttons[buttons.length - 1]
  if (!firstButton || !lastButton) return

  const trackRect = track.getBoundingClientRect()
  const firstRect = firstButton.getBoundingClientRect()
  const lastRect = lastButton.getBoundingClientRect()

  const firstCenter = firstRect.left - trackRect.left + firstRect.width / 2
  const lastCenter = lastRect.left - trackRect.left + lastRect.width / 2
  const start = Math.min(firstCenter, lastCenter)
  const end = Math.max(firstCenter, lastCenter)
  const length = Math.max(0, end - start)

  trackStart.value = `${start}px`
  trackLength.value = `${length}px`

  const clampedLevel = Math.max(0, Math.min(buttons.length, Math.floor(clampedValue.value)))

  if (length <= 0 || clampedLevel <= 0) {
    progressWidth.value = '0px'
    return
  }

  const targetIndex = Math.min(clampedLevel - 1, buttons.length - 1)
  const targetButton = buttons[targetIndex]
  if (!targetButton) {
    progressWidth.value = '0px'
    return
  }

  const targetRect = targetButton.getBoundingClientRect()
  const targetCenter = targetRect.left - trackRect.left + targetRect.width / 2
  const clampedCenter = Math.max(start, Math.min(targetCenter, end))
  const progress = Math.max(0, Math.min(clampedCenter - start, length))

  progressWidth.value = `${progress}px`
}

watch(
  () => props.modelValue,
  (next, prev = 0) => {
    if (typeof window === 'undefined') return
    if (next > prev) {
      const clamped = Math.min(next, totalSteps.value)
      burstIndex.value =
        clamped > 0 ? props.options[clamped - 1]?.value ?? null : null
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

watch(
  () => props.options.length,
  () => {
    void nextTick(updateProgressWidth)
  },
)
</script>

<style scoped>
.tracker-heading {
  font-size: clamp(1.05rem, 2.2vw, 1.35rem);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--dh-panel-text, rgba(255, 255, 255, 0.95));
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
}

.tracker-subheading {
  font-size: clamp(0.8rem, 1.4vw, 0.95rem);
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--dh-panel-muted-strong, rgba(255, 255, 255, 0.75));
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}
</style>
