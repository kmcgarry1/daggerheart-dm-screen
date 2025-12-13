import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import {
  assignWidgetIds,
  applyWidgetUpdate,
  useWidgetDock,
  useWidgetFactory,
  widgetSpanClass,
} from '@/features/dm-screen/widgets'
import { createDefaultCountdownConfig } from '@/features/countdown'
import type { DashboardWidget } from '@/features/dm-screen/widgets'

describe('widget helpers', () => {
  let ids: string[]
  let randomSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    ids = ['alpha', 'beta', 'gamma']
    randomSpy = vi.spyOn(globalThis.crypto, 'randomUUID').mockImplementation(() => ids.shift() ?? 'fallback')
  })

  afterEach(() => {
    randomSpy.mockRestore()
  })

  it('assigns ids to widgets without overwriting existing ids', () => {
    const widgets = [
      {
        id: '',
        title: 'Session Beats',
        body: 'notes',
        size: 'medium',
        editing: false,
        type: 'note' as const,
      },
      {
        id: 'keep-id',
        title: 'Existing',
        body: 'keep me',
        size: 'medium',
        editing: false,
        type: 'note' as const,
      },
    ]

    const assigned = assignWidgetIds(widgets)
    expect(assigned[0].id).toBe('widget-alpha')
    expect(assigned[1].id).toBe('keep-id')
  })

  it('maps widget size to responsive span classes', () => {
    expect(widgetSpanClass('small')).toBe('sm:col-span-1')
    expect(widgetSpanClass('medium')).toBe('sm:col-span-2')
    expect(widgetSpanClass('large')).toBe('sm:col-span-2 xl:col-span-3')
  })

  it('applies updates to widget fields and handles background exclusivity', () => {
    const widgets = ref<DashboardWidget[]>(
      assignWidgetIds([
        {
          id: '',
          title: 'Note',
          body: 'body',
          size: 'small',
          editing: false,
          type: 'note' as const,
        },
        {
          id: '',
          title: 'YT A',
          size: 'small',
          editing: false,
          type: 'youtube' as const,
          url: '',
          background: false,
        },
        {
          id: '',
          title: 'YT B',
          size: 'small',
          editing: false,
          type: 'youtube' as const,
          url: '',
          background: false,
        },
      ]) as DashboardWidget[],
    )

    const [note, youtubeA, youtubeB] = widgets.value

    applyWidgetUpdate(widgets, { id: note.id, key: 'title', value: 'Updated' })
    expect(widgets.value.find((entry) => entry.id === note.id)?.title).toBe('Updated')

    applyWidgetUpdate(widgets, { id: note.id, key: 'size', value: 'large' })
    expect(widgets.value.find((entry) => entry.id === note.id)?.size).toBe('large')

    applyWidgetUpdate(widgets, { id: youtubeB.id, key: 'background', value: true })
    const updatedA = widgets.value.find((entry) => entry.id === youtubeA.id)
    const updatedB = widgets.value.find((entry) => entry.id === youtubeB.id)
    expect(updatedB?.background).toBe(true)
    expect(updatedA?.background).toBe(false)

    applyWidgetUpdate(widgets, { id: youtubeB.id, key: 'background', value: false })
    expect(widgets.value.find((entry) => entry.id === youtubeB.id)?.background).toBe(false)
  })
})

describe('useWidgetFactory', () => {
  let ids: string[]
  let randomSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    ids = ['factory-alpha', 'factory-beta', 'factory-gamma']
    randomSpy = vi.spyOn(globalThis.crypto, 'randomUUID').mockImplementation(() => ids.shift() ?? 'factory-fallback')
  })

  afterEach(() => {
    randomSpy.mockRestore()
  })

  it('creates new widgets and focuses note titles', async () => {
    const widgets = ref<DashboardWidget[]>([])
    const activeWidgetId = ref<string | null>(null)
    const focusNoteTitle = vi.fn()

    const factory = useWidgetFactory({ widgets, activeWidgetId, focusNoteTitle })
    factory.addWidget()
    await nextTick()

    expect(widgets.value).toHaveLength(1)
    expect(widgets.value[0]?.type).toBe('note')
    expect(widgets.value[0]?.editing).toBe(true)
    expect(activeWidgetId.value).toBe(widgets.value[0]?.id)
    expect(focusNoteTitle).toHaveBeenCalledWith(widgets.value[0]?.id)
  })

  it('respects size and type selections and updates countdown widgets', async () => {
    const widgets = ref<DashboardWidget[]>([])
    const activeWidgetId = ref<string | null>(null)
    const focusNoteTitle = vi.fn()

    const factory = useWidgetFactory({ widgets, activeWidgetId, focusNoteTitle })
    factory.handleSizeSelect('large')
    factory.handleTypeSelect('countdown')
    factory.addWidget()
    await nextTick()

    const countdown = widgets.value[0]
    expect(countdown.type).toBe('countdown')
    expect(countdown.size).toBe('large')

    const config = createDefaultCountdownConfig()
    config.progress = 3

    factory.handleCountdownUpdate({
      id: countdown.id,
      config,
      title: '  Custom Countdown  ',
      description: '  Trimmed description  ',
    })

    expect(countdown.countdown).toStrictEqual(config)
    expect(countdown.title).toBe('Custom Countdown')
    expect(countdown.description).toBe('Trimmed description')
  })
})

describe('useWidgetDock', () => {
  it('returns hidden widgets and restores focus when requested', () => {
    const widgets = ref<DashboardWidget[]>([
      {
        id: 'one',
        title: 'Note',
        body: 'body',
        size: 'small',
        editing: false,
        type: 'note',
        hidden: false,
      },
      {
        id: 'two',
        title: 'Playlist',
        size: 'small',
        editing: false,
        type: 'spotify',
        url: '',
        hidden: true,
      },
    ])

    const focus = vi.fn()
    const dock = useWidgetDock(widgets, focus)

    expect(dock.minimizedWidgets.value).toHaveLength(1)
    expect(dock.minimizedWidgets.value[0]?.id).toBe('two')
    expect(dock.dockLabel('spotify')).toBe('Spotify Embed')
    expect(dock.widgetIcon('spotify')).toBe('SP')

    dock.restoreWidget('two')
    expect(focus).toHaveBeenCalledWith('two')
    expect(widgets.value[1]?.hidden).toBe(false)
  })

  it('creates informative countdown dock labels', () => {
    const config = createDefaultCountdownConfig()
    config.stepCount = 6
    config.progress = 3

    const widgets = ref<DashboardWidget[]>([
      {
        id: 'count',
        title: 'Ritual',
        type: 'countdown',
        description: 'desc',
        countdown: config,
        editing: false,
        size: 'small',
      },
    ])

    const dock = useWidgetDock(widgets)
    expect(dock.countdownDockLabel(widgets.value[0]!)).toBe('Ritual (3/6)')
  })
})
