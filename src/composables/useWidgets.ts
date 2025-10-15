import { computed, nextTick, ref, watch } from 'vue'
import { load, save } from '../utils/storage'
import { createDefaultCountdownConfig, defaultDescription, defaultTitle } from '../components/countdown/options'
import type { CountdownConfig } from '../components/countdown/types'

type WidgetSize = 'small' | 'medium' | 'large'

export type NoteWidget = {
  id: string
  title: string
  body: string
  size: WidgetSize
  editing: boolean
  type: 'note'
  hidden?: boolean
}

export type CountdownWidget = {
  id: string
  title: string
  description: string
  size: WidgetSize
  editing: boolean
  type: 'countdown'
  countdown: CountdownConfig
  hidden?: boolean
}

export type YoutubeWidget = {
  id: string
  title: string
  url: string
  size: WidgetSize
  editing: boolean
  type: 'youtube'
  background: boolean
  muted?: boolean
  hidden?: boolean
}

export type SpotifyWidget = {
  id: string
  title: string
  url: string
  size: WidgetSize
  editing: boolean
  type: 'spotify'
  hidden?: boolean
}

export type DashboardWidget = NoteWidget | CountdownWidget | YoutubeWidget | SpotifyWidget

export type SizeOption = { value: WidgetSize; label: string; columns: number }
export type WidgetTypeOption = { value: DashboardWidget['type']; label: string; description: string }

let widgetCounter = 0
const createId = () => {
  if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
    return `widget-${(crypto as any).randomUUID()}`
  }
  widgetCounter += 1
  return `widget-${Date.now()}-${widgetCounter}`
}

export function useWidgets() {
  const sizeOptions: SizeOption[] = [
    { value: 'small', label: 'Compact', columns: 1 },
    { value: 'medium', label: 'Wide', columns: 2 },
    { value: 'large', label: 'Showcase', columns: 3 },
  ]

  const widgetTypeOptions: WidgetTypeOption[] = [
    { value: 'note', label: 'Notes Card', description: 'Write reminders, NPC motives, or scene beats.' },
    {
      value: 'countdown',
      label: 'Countdown Tracker',
      description: 'Configurable step tracker with palette, icon, and pacing options.',
    },
    { value: 'youtube', label: 'YouTube Embed', description: 'Embed a YouTube video; can set as background.' },
    { value: 'spotify', label: 'Spotify Embed', description: 'Embed a Spotify track, album, or playlist.' },
  ]

  const widgets = ref<DashboardWidget[]>(load<DashboardWidget[]>('widgets', [
    {
      id: createId(),
      title: 'Session Beats',
      body: 'Key NPC motivations, surprises to reveal, and challenges to escalate.',
      size: 'medium',
      editing: false,
      type: 'note',
      hidden: false,
    },
    {
      id: createId(),
      title: 'Initiative Tracker',
      body: 'Pendry, Rowan, Syl, Maeve, Hunters x3',
      size: 'small',
      editing: false,
      type: 'note',
      hidden: false,
    },
  ]))

  const nextWidgetSize = ref<WidgetSize>('medium')
  const nextWidgetType = ref<DashboardWidget['type']>('note')
  const activeWidgetId = ref<string | null>(null)

  const nextWidgetSizeLabel = computed(() => sizeLabel(nextWidgetSize.value))

  const sizeLabel = (size: WidgetSize) => {
    const match = sizeOptions.find((option) => option.value === size)
    return match ? match.label : size
  }

  const widgetSpanClass = (size: WidgetSize) => {
    switch (size) {
      case 'small':
        return 'sm:col-span-1'
      case 'medium':
        return 'sm:col-span-2'
      case 'large':
        return 'sm:col-span-2 xl:col-span-3'
      default:
        return 'sm:col-span-1'
    }
  }

  const addWidget = () => {
    const type = nextWidgetType.value
    let widget: DashboardWidget
    if (type === 'countdown') {
      const config = createDefaultCountdownConfig()
      widget = {
        id: createId(),
        title: (config.title || defaultTitle).trim() || defaultTitle,
        description: (config.description || defaultDescription).trim(),
        size: nextWidgetSize.value,
        editing: true,
        type: 'countdown',
        countdown: config,
        hidden: false,
      }
    } else if (type === 'youtube') {
      widget = {
        id: createId(),
        title: 'YouTube',
        url: '',
        size: nextWidgetSize.value,
        editing: true,
        type: 'youtube',
        background: false,
        hidden: false,
      }
    } else if (type === 'spotify') {
      widget = {
        id: createId(),
        title: 'Spotify',
        url: '',
        size: nextWidgetSize.value,
        editing: true,
        type: 'spotify',
        hidden: false,
      }
    } else {
      widget = {
        id: createId(),
        title: '',
        body: '',
        size: nextWidgetSize.value,
        editing: true,
        type: 'note',
        hidden: false,
      }
    }
    widgets.value = [widget, ...widgets.value]
    activeWidgetId.value = widget.id
    nextTick(() => {
      if (typeof window === 'undefined') return
      if (widget.type === 'note') {
        const firstInput = window.document.querySelector<HTMLInputElement>(`#${widget.id}-title`)
        firstInput?.focus()
      }
    })
  }

  const toggleEditing = (id: string) => {
    const widget = widgets.value.find((entry) => entry.id === id)
    if (!widget) return
    widget.editing = !widget.editing
    activeWidgetId.value = id
    if (widget.editing) {
      nextTick(() => {
        if (typeof window === 'undefined') return
        if (widget.type === 'note') {
          const input = window.document.querySelector<HTMLInputElement>(`#${id}-title`)
          input?.focus()
        }
      })
    }
  }

  // Persist widgets state
  watch(widgets, (v) => save('widgets', v), { deep: true })

  const handleWidgetUpdate = (payload: {
    id: string
    key: 'title' | 'body' | 'size' | 'url' | 'background' | 'hidden'
    value: string | boolean
  }) => {
    const widget = widgets.value.find((entry) => entry.id === payload.id)
    if (!widget) return
    if (payload.key === 'size') {
      ;(widget as any).size = payload.value as WidgetSize
      return
    }
    if (widget.type === 'note') {
      if (payload.key === 'title') (widget as any).title = payload.value as string
      else if (payload.key === 'body') (widget as any).body = payload.value as string
      else if (payload.key === 'hidden') (widget as any).hidden = Boolean(payload.value)
      return
    }
    if (widget.type === 'youtube') {
      if (payload.key === 'title') widget.title = payload.value as string
      else if (payload.key === 'url') widget.url = payload.value as string
      else if (payload.key === 'background') {
        const next = Boolean(payload.value)
        if (next) {
          widgets.value = widgets.value.map((w) =>
            (w as any).type === 'youtube' ? ({ ...(w as any), background: w.id === widget.id } as any) : w,
          )
        } else {
          ;(widget as any).background = false
        }
      } else if (payload.key === 'hidden') (widget as any).hidden = Boolean(payload.value)
      return
    }
    if (widget.type === 'spotify') {
      if (payload.key === 'title') widget.title = payload.value as string
      else if (payload.key === 'url') widget.url = payload.value as string
      else if (payload.key === 'hidden') (widget as any).hidden = Boolean(payload.value)
      return
    }
    if (widget.type === 'countdown') {
      if (payload.key === 'title') widget.title = payload.value as string
      else if (payload.key === 'hidden') (widget as any).hidden = Boolean(payload.value)
      return
    }
  }

  const handleCountdownUpdate = (
    payload: { id: string; config: CountdownConfig; title: string; description: string },
  ) => {
    const widget = widgets.value.find((entry) => entry.id === payload.id)
    if (!widget || widget.type !== 'countdown') return
    widget.countdown = payload.config
    widget.title = payload.title.trim() || defaultTitle
    widget.description = payload.description.trim()
  }

  const removeWidget = (id: string) => {
    widgets.value = widgets.value.filter((w) => w.id !== id)
    if (activeWidgetId.value === id) activeWidgetId.value = widgets.value[0]?.id ?? null
  }

  const focusWidget = (id: string) => {
    activeWidgetId.value = id
    const widget = widgets.value.find((entry) => entry.id === id)
    if (!widget) return
    if (!widget.editing) widget.editing = true
    nextTick(() => {
      if (typeof window === 'undefined') return
      if (widget.type === 'note') {
        const input = window.document.querySelector<HTMLInputElement>(`#${id}-title`)
        input?.focus()
      }
    })
  }

  const handleSizeSelect = (size: WidgetSize) => {
    nextWidgetSize.value = size
  }
  const handleTypeSelect = (type: DashboardWidget['type']) => {
    nextWidgetType.value = type
  }

  const minimizedWidgets = computed(() => widgets.value.filter((w) => (w as any).hidden))

  const restoreWidget = (id: string) => {
    const w = widgets.value.find((x) => x.id === id)
    if (!w) return
    ;(w as any).hidden = false
    activeWidgetId.value = id
  }

  const dockLabel = (type: DashboardWidget['type']) => {
    switch (type) {
      case 'note':
        return 'Note'
      case 'countdown':
        return 'Countdown'
      case 'youtube':
        return 'YouTube'
      case 'spotify':
        return 'Spotify'
      default:
        return 'Widget'
    }
  }

  const widgetIcon = (type: DashboardWidget['type']) => {
    switch (type) {
      case 'note':
        return '📝'
      case 'countdown':
        return '⏱️'
      case 'youtube':
        return '▶️'
      case 'spotify':
        return '🎵'
      default:
        return '📦'
    }
  }

  const countdownDockLabel = (w: DashboardWidget) => {
    if ((w as any).type !== 'countdown') return (w as any).title || 'Countdown'
    const steps = (w as any).countdown?.steps ?? []
    const current = steps.filter((s: any) => s.active).length
    const total = steps.length || 0
    return `${(w as any).title || 'Countdown'} (${current}/${total})`
  }

  return {
    widgets,
    sizeOptions,
    widgetTypeOptions,
    nextWidgetSize,
    nextWidgetSizeLabel,
    nextWidgetType,
    activeWidgetId,
    addWidget,
    toggleEditing,
    handleWidgetUpdate,
    handleCountdownUpdate,
    removeWidget,
    focusWidget,
    handleSizeSelect,
    handleTypeSelect,
    widgetSpanClass,
    minimizedWidgets,
    restoreWidget,
    dockLabel,
    widgetIcon,
    countdownDockLabel,
  }
}
