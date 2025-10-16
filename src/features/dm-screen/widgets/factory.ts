import { computed, nextTick, ref } from 'vue'
import type { Ref } from 'vue'

import { getSizeLabel, sizeOptions, widgetTypeOptions } from './options'
import { applyWidgetUpdate, widgetSpanClass } from './updateHandlers'
import type { DashboardWidget, WidgetType, WidgetSize } from './types'
import type { WidgetUpdatePayload } from './updateHandlers'
import {
  createDefaultCountdownConfig,
  defaultDescription,
  defaultTitle,
  type CountdownConfig,
} from '@/features/countdown'
import { createIdGenerator, reportError } from '@/shared/utils'

const createWidgetId = createIdGenerator('widget')

const createNoteWidget = (size: WidgetSize): DashboardWidget => ({
  id: createWidgetId(),
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
    id: createWidgetId(),
    title: (config.title || defaultTitle).trim() || defaultTitle,
    description: (config.description || defaultDescription).trim(),
    size,
    editing: true,
    type: 'countdown',
    countdown: config,
    hidden: false,
  }
}

export const defaultConditionsDescription =
  'Use this space to spotlight the ongoing effects of battle conditions, curses, or boons so the table stays aligned.'
const defaultConditionsAccent = '#a855f7'

const createConditionsWidget = (size: WidgetSize): DashboardWidget => ({
  id: createWidgetId(),
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
  id: createWidgetId(),
  title: 'YouTube',
  url: '',
  size,
  editing: true,
  type: 'youtube',
  background: false,
  hidden: false,
})

const createSpotifyWidget = (size: WidgetSize): DashboardWidget => ({
  id: createWidgetId(),
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

const widgetContext = (action: string) => `widget-factory:${action}`

export function useWidgetFactory(context: WidgetFactoryContext) {
  const nextWidgetSize = ref<WidgetSize>('medium')
  const nextWidgetType = ref<WidgetType>('note')

  const nextWidgetSizeLabel = computed(() => getSizeLabel(nextWidgetSize.value))

  const addWidget = () => {
    try {
      const creator = widgetCreators[nextWidgetType.value]
      const widget = creator ? creator(nextWidgetSize.value) : createNoteWidget(nextWidgetSize.value)
      context.widgets.value = [widget, ...context.widgets.value]
      context.activeWidgetId.value = widget.id
      if (widget.type === 'note') {
        nextTick(() => context.focusNoteTitle(widget.id))
      }
    } catch (error) {
      reportError('We could not create that widget.', error, {
        context: widgetContext('add'),
      })
    }
  }

  const handleWidgetUpdate = (payload: WidgetUpdatePayload) => {
    try {
      applyWidgetUpdate(context.widgets, payload)
    } catch (error) {
      reportError('We could not update that widget.', error, {
        context: widgetContext('update'),
      })
    }
  }

  const handleCountdownUpdate = (payload: { id: string; config: CountdownConfig; title: string; description: string }) => {
    try {
      const widget = context.widgets.value.find((entry) => entry.id === payload.id)
      if (!widget || widget.type !== 'countdown') {
        reportError('We could not find that countdown widget.', new Error(`Missing widget: ${payload.id}`), {
          context: widgetContext(`countdown:${payload.id}`),
          oncePerContext: true,
        })
        return
      }
      widget.countdown = payload.config
      widget.title = payload.title.trim() || defaultTitle
      widget.description = payload.description.trim()
    } catch (error) {
      reportError('We could not update that countdown.', error, {
        context: widgetContext('countdown'),
      })
    }
  }

  const handleSizeSelect = (size: WidgetSize) => {
    try {
      nextWidgetSize.value = size
    } catch (error) {
      reportError('We could not change the widget size.', error, {
        context: widgetContext('size'),
      })
    }
  }

  const handleTypeSelect = (type: WidgetType) => {
    try {
      nextWidgetType.value = type
    } catch (error) {
      reportError('We could not change the widget type.', error, {
        context: widgetContext('type'),
      })
    }
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
    id: widget.id || createWidgetId(),
  }))
