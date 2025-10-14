<template>
  <DhCard :width-variant="cardVariant.width" :height-variant="cardVariant.height">
    <template v-if="title" #title>
      {{ title }}
    </template>

    <template #body>
      <div class="flex flex-col gap-3">
        <p v-if="description" class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {{ description }}
        </p>

        <div class="relative px-1 pt-5 pb-1.5 md:px-2 md:pt-4 md:pb-2">
          <div
            ref="progressTrackRef"
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 top-1/2 h-[0.6rem] -translate-y-1/2 transform overflow-hidden rounded-full transition-colors duration-300"
            :style="{
              background: palette.rail,
            }"
          >
            <div
              class="absolute left-0 top-0 h-full rounded-full transition-[width] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              :style="{
                width: progressWidth,
                background: palette.fill,
                boxShadow: `0 0 30px ${palette.glow}`,
              }"
            ></div>
            <div
              class="pointer-events-none absolute left-0 -top-[40%] h-[180%] rounded-full blur-[26px] transition-[width] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              :style="{
                width: progressWidth,
                background: `radial-gradient(circle, ${palette.glow} 0%, rgba(0, 0, 0, 0) 70%)`,
              }"
            ></div>
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
              :palette="optionPalettes[index]"
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
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

const burstIndex = ref<number | null>(null)
let burstTimer: number | null = null

const progressTrackRef = ref<HTMLDivElement | null>(null)
const buttonRowRef = ref<HTMLDivElement | null>(null)
const progressWidth = ref('0px')

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
  const level = clampedValue.value
  const track = progressTrackRef.value
  if (!track) return

  if (level <= 0) {
    progressWidth.value = '0px'
    return
  }

  const buttons = buttonRowRef.value?.querySelectorAll<HTMLButtonElement>('button[data-tracker-option]')
  if (!buttons || buttons.length === 0) return

  const targetButton = buttons[level - 1]
  const firstButton = buttons[0]
  const lastButton = buttons[buttons.length - 1]
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
