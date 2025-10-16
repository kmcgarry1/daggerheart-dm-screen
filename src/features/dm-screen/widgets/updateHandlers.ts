import type { Ref } from 'vue'

import type { DashboardWidget, WidgetSize, WidgetType } from './types'

export type WidgetUpdateKey =
  | 'title'
  | 'body'
  | 'description'
  | 'titleColor'
  | 'dividerColor'
  | 'size'
  | 'url'
  | 'background'
  | 'hidden'
export type WidgetUpdateValue = string | boolean

export interface WidgetUpdatePayload {
  id: string
  key: WidgetUpdateKey
  value: WidgetUpdateValue
}

type WidgetUpdateHandler<K extends WidgetType> = (
  widget: Extract<DashboardWidget, { type: K }>,
  value: WidgetUpdateValue,
  widgets: Ref<DashboardWidget[]>,
) => void

type WidgetUpdateMap = {
  [K in WidgetType]: Partial<Record<WidgetUpdateKey, WidgetUpdateHandler<K>>>
}

const booleanValue = (value: WidgetUpdateValue) => Boolean(value)
const stringValue = (value: WidgetUpdateValue) => String(value)

const updateStrategies = {
  note: {
    title: (widget, value) => {
      widget.title = String(value)
    },
    body: (widget, value) => {
      widget.body = String(value)
    },
    hidden: (widget, value) => {
      widget.hidden = booleanValue(value)
    },
  },
  countdown: {
    title: (widget, value) => {
      widget.title = String(value)
    },
    hidden: (widget, value) => {
      widget.hidden = booleanValue(value)
    },
  },
  conditions: {
    title: (widget, value) => {
      widget.title = stringValue(value)
    },
    description: (widget, value) => {
      widget.description = stringValue(value)
    },
    titleColor: (widget, value) => {
      widget.titleColor = stringValue(value)
    },
    dividerColor: (widget, value) => {
      widget.dividerColor = stringValue(value)
    },
    hidden: (widget, value) => {
      widget.hidden = booleanValue(value)
    },
  },
  youtube: {
    title: (widget, value) => {
      widget.title = String(value)
    },
    url: (widget, value) => {
      widget.url = String(value)
    },
    background: (widget, value, widgets) => {
      const next = booleanValue(value)
      if (next) {
        widgets.value = widgets.value.map((entry) =>
          entry.type === 'youtube'
            ? {
                ...entry,
                background: entry.id === widget.id,
              }
            : entry,
        )
      } else {
        widget.background = false
      }
    },
    hidden: (widget, value) => {
      widget.hidden = booleanValue(value)
    },
  },
  spotify: {
    title: (widget, value) => {
      widget.title = String(value)
    },
    url: (widget, value) => {
      widget.url = String(value)
    },
    hidden: (widget, value) => {
      widget.hidden = booleanValue(value)
    },
  },
} satisfies WidgetUpdateMap

export const widgetSpanClass = (size: WidgetSize) => {
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

export function applyWidgetUpdate(widgets: Ref<DashboardWidget[]>, payload: WidgetUpdatePayload) {
  const widget = widgets.value.find((entry) => entry.id === payload.id)
  if (!widget) return

  if (payload.key === 'size') {
    widget.size = payload.value as WidgetSize
    return
  }

  const invoke = <K extends WidgetType>(
    type: K,
    target: Extract<DashboardWidget, { type: K }>,
  ) => {
    const handlers = updateStrategies[type] as Partial<Record<WidgetUpdateKey, WidgetUpdateHandler<K>>>
    const handler = handlers[payload.key as WidgetUpdateKey]
    if (typeof handler === 'function') {
      handler(target, payload.value, widgets)
    }
  }

  switch (widget.type) {
    case 'note':
      invoke('note', widget)
      break
    case 'countdown':
      invoke('countdown', widget)
      break
    case 'conditions':
      invoke('conditions', widget)
      break
    case 'youtube':
      invoke('youtube', widget)
      break
    case 'spotify':
      invoke('spotify', widget)
      break
    default:
      break
  }
}
