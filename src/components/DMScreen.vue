<template>
  <div class="flex min-h-screen w-screen flex-col bg-[var(--dh-bg)] text-[var(--dh-ivory)]">
    <floating-header>
      <h1 class="text-xl font-semibold uppercase tracking-[0.2em] text-dh-accent">
        DMScreen
      </h1>
    </floating-header>

    <main class="flex flex-1 flex-col gap-6 overflow-hidden p-6 lg:flex-row lg:gap-8 lg:p-10">
      <section class="flex flex-1">
        <div
          ref="canvasRef"
          class="relative flex-1 overflow-hidden rounded-2xl border-2 border-dashed shadow-inner"
          :style="canvasStyle"
        >
          <draggable-card
            v-for="card in cards"
            :key="card.id"
            :position="card.position"
            :canvas-el="canvasRef"
            @update:position="(pos) => updateCardPosition(card.id, pos)"
          >
            <dh-card>
              <template #image v-if="card.image">
                <img
                  :src="card.image"
                  :alt="`${card.title} artwork`"
                  class="h-full w-full object-cover"
                />
              </template>
              <template #title>
                <span class="text-lg font-semibold text-dh-accent">{{ card.title }}</span>
              </template>
              <template #body>
                <p class="text-sm leading-relaxed text-dh-muted">{{ card.body }}</p>
              </template>
              <template #footer v-if="card.footer">
                <span class="text-xs uppercase tracking-wide text-dh-highlight">{{ card.footer }}</span>
              </template>
            </dh-card>
          </draggable-card>
        </div>
      </section>

      <dh-column class="w-full space-y-4 lg:w-[320px]">
        <dh-card>
          <template #title>
            <span class="text-lg font-semibold text-dh-accent">Canvas Tips</span>
          </template>
          <template #body>
            <ul class="space-y-2 text-sm text-dh-muted">
              <li>Drag cards anywhere on the grid to match your table’s flow.</li>
              <li>Use different cards for encounters, initiatives, or lore snippets.</li>
              <li>Future updates will let you save different layouts per session.</li>
            </ul>
          </template>
        </dh-card>
      </dh-column>
    </main>

    <floating-footer>
      <template #default>
        <p class="text-xs uppercase tracking-[0.2em] text-dh-muted">
          Ac 2024 Daggerheart. All rights reserved.
        </p>
      </template>
    </floating-footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import FloatingFooter from './basic-screen/FloatingFooter.vue'
import FloatingHeader from './basic-screen/FloatingHeader.vue'
import DhColumn from './core/DhColumn.vue'
import DhCard from './core/DhCard.vue'
import DraggableCard from './core/DraggableCard.vue'

type CanvasCard = {
  id: string
  title: string
  body: string
  footer?: string
  image?: string
  position: { x: number; y: number }
}

export default defineComponent({
  name: 'DMScreen',
  components: {
    FloatingFooter,
    FloatingHeader,
    DhColumn,
    DhCard,
    DraggableCard,
  },
  setup() {
    const canvasRef = ref<HTMLElement | null>(null)
    const cards = ref<CanvasCard[]>([
      {
        id: 'card-1',
        title: 'Encounter Notes',
        body: 'Track enemy tactics, terrain twists, and surprise beats queued for the party.',
        footer: 'Last updated: moments ago',
        image: 'https://via.placeholder.com/400x180',
        position: { x: 48, y: 48 },
      },
      {
        id: 'card-2',
        title: 'Initiative Order',
        body: 'Player 1 → Player 2 → NPC 1 → NPC 2',
        position: { x: 340, y: 280 },
      },
    ])

    const canvasStyle = computed(() => ({
      borderColor: 'rgba(248, 184, 76, 0.35)',
      backgroundColor: 'var(--dh-surface)',
      backgroundImage:
        'linear-gradient(0deg, rgba(248,184,76,0.08) 1px, transparent 1px), ' +
        'linear-gradient(90deg, rgba(248,184,76,0.08) 1px, transparent 1px)',
      backgroundSize: '56px 56px',
    }))

    const updateCardPosition = (id: string, position: { x: number; y: number }) => {
      const target = cards.value.find((card) => card.id === id)
      if (!target) return
      target.position = {
        x: Math.round(position.x),
        y: Math.round(position.y),
      }
    }

    return {
      canvasRef,
      cards,
      canvasStyle,
      updateCardPosition,
    }
  },
})
</script>
