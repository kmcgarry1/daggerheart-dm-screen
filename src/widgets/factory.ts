import { computed, nextTick, ref } from 'vue'
import type { Ref } from 'vue'

import { getSizeLabel, sizeOptions, widgetTypeOptions } from './options'
import { applyWidgetUpdate, widgetSpanClass } from './updateHandlers'
import type { DashboardWidget, WidgetType, WidgetSize } from './types'
import type { WidgetUpdatePayload } from './updateHandlers'
import { createDefaultCountdownConfig, defaultDescription, defaultTitle } from '../components/countdown/options'
import type { CountdownConfig } from '../components/countdown/types'

let widgetCounter = 0
const createId = () => {
  if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
    return `widget-${(crypto as any).randomUUID()}`
  }
  widgetCounter += 1
  return `widget-${Date.now()}-${widgetCounter}`
}

const createNoteWidget = (size: WidgetSize): DashboardWidget => ({
  id: createId(),
  title: '',
  body: '',
  size,
  editing: true,
  type: 'note',
  hidden: false,
})

const createCountdownWidget = (size: WidgetSize): DashboardWidget => {
  const config = createDefaultCountdownConfig()
  return {
    id: createId(),
    title: (config.title || defaultTitle).trim() || defaultTitle,
    description: (config.description || defaultDescription).trim(),
    size,
    editing: true,
    type: 'countdown',
    countdown: config,
    hidden: false,
  }
}

const defaultConditionsDescription =
  'Use this space to spotlight the ongoing effects of battle conditions, curses, or boons so the table stays aligned.'
const defaultConditionsAccent = '#a855f7'

const createConditionsWidget = (size: WidgetSize): DashboardWidget => ({
  id: createId(),
  title: 'Condition Rules',
  description: defaultConditionsDescription,
  titleColor: defaultConditionsAccent,
  dividerColor: defaultConditionsAccent,
  size,
  editing: true,
  type: 'conditions',
  hidden: false,
})

const createYoutubeWidget = (size: WidgetSize): DashboardWidget => ({
  id: createId(),
  title: 'YouTube',
  url: '',
  size,
  editing: true,
  type: 'youtube',
  background: false,
  hidden: false,
})

const createSpotifyWidget = (size: WidgetSize): DashboardWidget => ({
  id: createId(),
  title: 'Spotify',
  url: '',
  size,
  editing: true,
  type: 'spotify',
  hidden: false,
})

const widgetCreators: Record<WidgetType, (size: WidgetSize) => DashboardWidget> = {
  note: createNoteWidget,
  countdown: createCountdownWidget,
  conditions: createConditionsWidget,
  youtube: createYoutubeWidget,
  spotify: createSpotifyWidget,
}

export interface WidgetFactoryContext {
  widgets: Ref<DashboardWidget[]>
  activeWidgetId: Ref<string | null>
  focusNoteTitle: (id: string) => void
}

export function useWidgetFactory(context: WidgetFactoryContext) {
  const nextWidgetSize = ref<WidgetSize>('medium')
  const nextWidgetType = ref<WidgetType>('note')

  const nextWidgetSizeLabel = computed(() => getSizeLabel(nextWidgetSize.value))

  const addWidget = () => {
    const creator = widgetCreators[nextWidgetType.value]
    const widget = creator ? creator(nextWidgetSize.value) : createNoteWidget(nextWidgetSize.value)
    context.widgets.value = [widget, ...context.widgets.value]
    context.activeWidgetId.value = widget.id
    if (widget.type === 'note') {
      nextTick(() => context.focusNoteTitle(widget.id))
    }
  }

  const handleWidgetUpdate = (payload: WidgetUpdatePayload) => {
    applyWidgetUpdate(context.widgets, payload)
  }

  const handleCountdownUpdate = (payload: { id: string; config: CountdownConfig; title: string; description: string }) => {
    const widget = context.widgets.value.find((entry) => entry.id === payload.id)
    if (!widget || widget.type !== 'countdown') return
    widget.countdown = payload.config
    widget.title = payload.title.trim() || defaultTitle
    widget.description = payload.description.trim()
  }

  const handleSizeSelect = (size: WidgetSize) => {
    nextWidgetSize.value = size
  }

  const handleTypeSelect = (type: WidgetType) => {
    nextWidgetType.value = type
  }

  return {
    sizeOptions,
    widgetTypeOptions,
    nextWidgetSize,
    nextWidgetType,
    nextWidgetSizeLabel,
    addWidget,
    handleWidgetUpdate,
    handleCountdownUpdate,
    handleSizeSelect,
    handleTypeSelect,
    widgetSpanClass,
  }
}

export const assignWidgetIds = (widgets: DashboardWidget[]) =>
  widgets.map((widget) => ({
    ...widget,
    id: widget.id || createId(),
  }))
