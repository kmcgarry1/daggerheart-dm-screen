import { ref, watch } from 'vue'

import { load, reportError, save } from '@/shared/utils'
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

  const widgets = ref<DashboardWidget[]>(load<DashboardWidget[]>('widgets', initialWidgets))

  watch(
    widgets,
    (value) => {
      save('widgets', value)
    },
    { deep: true },
  )

  return { widgets }
}
