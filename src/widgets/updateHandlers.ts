import type { Ref } from 'vue'

import type { DashboardWidget, WidgetSize, WidgetType } from './types'

export type WidgetUpdateKey = 'title' | 'body' | 'size' | 'url' | 'background' | 'hidden'
export type WidgetUpdateValue = string | boolean

export interface WidgetUpdatePayload {
  id: string
  key: WidgetUpdateKey
  value: WidgetUpdateValue
}

type WidgetUpdateMap = {
  [K in WidgetType]?: Partial<Record<WidgetUpdateKey, (widget: Extract<DashboardWidget, { type: K }>, value: WidgetUpdateValue, widgets: Ref<DashboardWidget[]>) => void>>
}

const booleanValue = (value: WidgetUpdateValue) => Boolean(value)

const updateStrategies: WidgetUpdateMap = {
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
}

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

  const handlers = updateStrategies[widget.type]
  const handler = handlers?.[payload.key]
  handler?.(widget as any, payload.value, widgets)
}
