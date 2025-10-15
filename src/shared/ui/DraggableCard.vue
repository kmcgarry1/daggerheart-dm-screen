<template>
  <div
    ref="cardRef"
    class="absolute select-none cursor-grab transition-all duration-75 ease-linear"
    :class="dragging ? 'cursor-grabbing drop-shadow-2xl ring-2 ring-[rgba(248,184,76,0.3)]' : 'drop-shadow-lg'"
    :style="cardStyle"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @lostpointercapture="onPointerUp"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = defineProps<{
  position: { x: number; y: number }
  canvasEl: HTMLElement | null
}>()

const emit = defineEmits<{
  (e: 'update:position', payload: { x: number; y: number }): void
}>()

const cardRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const pointerOffset = ref({ x: 0, y: 0 })

const dragging = computed(() => isDragging.value)

const cardStyle = computed(() => ({
  transform: `translate(${props.position.x}px, ${props.position.y}px)`,
  touchAction: 'none',
}))

const onPointerDown = (event: PointerEvent) => {
  if (!cardRef.value) return

  event.preventDefault()
  isDragging.value = true
  cardRef.value.setPointerCapture(event.pointerId)

  const rect = cardRef.value.getBoundingClientRect()
  pointerOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

const onPointerMove = (event: PointerEvent) => {
  if (!isDragging.value || !cardRef.value || !props.canvasEl) return

  const canvasRect = props.canvasEl.getBoundingClientRect()
  const cardWidth = cardRef.value.offsetWidth
  const cardHeight = cardRef.value.offsetHeight

  let nextX = event.clientX - canvasRect.left - pointerOffset.value.x
  let nextY = event.clientY - canvasRect.top - pointerOffset.value.y

  const maxX = Math.max(0, canvasRect.width - cardWidth)
  const maxY = Math.max(0, canvasRect.height - cardHeight)

  if (nextX < 0) nextX = 0
  if (nextY < 0) nextY = 0
  if (nextX > maxX) nextX = maxX
  if (nextY > maxY) nextY = maxY

  emit('update:position', { x: nextX, y: nextY })
}

const onPointerUp = (event: PointerEvent) => {
  if (!cardRef.value) return

  isDragging.value = false
  if (cardRef.value.hasPointerCapture(event.pointerId)) {
    cardRef.value.releasePointerCapture(event.pointerId)
  }
}
</script>
