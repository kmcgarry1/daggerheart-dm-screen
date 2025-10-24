import { ref } from 'vue'

import { load, reportError, save, watchDebounced } from '@/shared/utils'
import type { DashboardWidget } from './types'

export type WidgetInitializer = () => DashboardWidget[]

export function useWidgetPersistence(createInitialWidgets: WidgetInitializer) {
  let initialWidgets: DashboardWidget[] = []
  try {
    initialWidgets = createInitialWidgets().map((widget) => ({ ...widget }))
  } catch (error) {
    reportError('We could not prepare default widgets.', error, {
      context: 'widgets:persistence:initial',
    })
    initialWidgets = []
  }

  const normalizeWidget = (widget: DashboardWidget): DashboardWidget => ({
    ...widget,
    editing: false,
  })

  const widgets = ref<DashboardWidget[]>(
    load<DashboardWidget[]>('widgets', initialWidgets).map((widget) => normalizeWidget({ ...widget })),
  )

  watchDebounced(
    widgets,
    (value) => {
      const persistable = value.map((widget) => normalizeWidget({ ...widget }))
      save('widgets', persistable)
    },
    { deep: true, debounce: 250, maxWait: 1000 },
  )

  return { widgets }
}
