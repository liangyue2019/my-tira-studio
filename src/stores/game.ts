import { create } from 'zustand'
import type { TimeSlot, GamePhase, StoryChapter, Dialog, DialogOption, SettlementResult, DaySettlementResult, GameEvent, ActionParams } from '../types'
import { STORY_CHAPTERS } from '../constants/story'
import { DIALOGS } from '../constants/dialogs'
import { STORAGE_KEY, SAVE_INTERVAL } from '../constants/config'
import { useResourceStore } from './resource'
import { useEmployeeStore } from './employee'
import { useProjectStore } from './project'
import { executeAction, settleDay } from './settlement'

interface GameStore {
  day: number
  timeSlot: TimeSlot
  phase: GamePhase
  storyChapters: StoryChapter[]
  dialogs: Dialog[]
  currentDialogId: string | null
  currentEvent: GameEvent | null
  actionLog: SettlementResult[]
  dayHistory: DaySettlementResult[]
  lastSettlementResult: SettlementResult | null
  lastDayResult: DaySettlementResult | null
  lastSaveTime: number
  isFirstLaunch: boolean
  showIntroStory: boolean

  initializeGame: () => void
  saveGame: () => void
  loadGame: () => void
  selectAction: (actionId: string, params?: ActionParams) => SettlementResult | null
  advanceTimeSlot: () => void
  settleDayEnd: () => DaySettlementResult
  setPhase: (phase: GamePhase) => void
  setShowIntroStory: (show: boolean) => void
  markFirstLaunchCompleted: () => void
  showDialog: (dialogId: string) => void
  hideDialog: () => void
  selectDialogOption: (dialogId: string, option: DialogOption) => void
  checkDialogTriggers: () => void
  updateStoryChapter: (id: string, updates: Partial<StoryChapter>) => void
  setCurrentEvent: (event: GameEvent | null) => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  day: 1,
  timeSlot: 'morning',
  phase: 'action_select',
  storyChapters: STORY_CHAPTERS.map(s => ({ ...s })),
  dialogs: DIALOGS.map(d => ({ ...d })),
  currentDialogId: null,
  currentEvent: null,
  actionLog: [],
  dayHistory: [],
  lastSettlementResult: null,
  lastDayResult: null,
  lastSaveTime: 0,
  isFirstLaunch: true,
  showIntroStory: true,

  initializeGame: () => {
    const state = get()
    state.loadGame()

    setInterval(() => {
      get().saveGame()
    }, SAVE_INTERVAL)
  },

  saveGame: () => {
    const resources = useResourceStore.getState().resources
    const employees = useEmployeeStore.getState().employees
    const projectState = useProjectStore.getState()

    const gameState = {
      day: get().day,
      timeSlot: get().timeSlot,
      phase: get().phase,
      resources,
      employees,
      projects: projectState.projects,
      availableProjects: projectState.availableProjects,
      completedProjectCount: projectState.completedProjectCount,
      storyChapters: get().storyChapters,
      dialogs: get().dialogs,
      currentDialogId: get().currentDialogId,
      actionLog: get().actionLog,
      dayHistory: get().dayHistory,
      lastSaveTime: Date.now(),
      isFirstLaunch: get().isFirstLaunch,
      showIntroStory: get().showIntroStory
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
      set({ lastSaveTime: Date.now() })
    } catch (e) {
      console.error('保存游戏失败:', e)
    }
  },

  loadGame: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const gameState = JSON.parse(saved)

        useResourceStore.setState({ resources: gameState.resources })
        useEmployeeStore.setState({ employees: gameState.employees || [] })
        useProjectStore.setState({
          projects: gameState.projects || [],
          availableProjects: gameState.availableProjects || [],
          completedProjectCount: gameState.completedProjectCount || 0
        })

        set({
          day: gameState.day || 1,
          timeSlot: gameState.timeSlot || 'morning',
          phase: gameState.phase || 'action_select',
          storyChapters: gameState.storyChapters || STORY_CHAPTERS.map(s => ({ ...s })),
          dialogs: gameState.dialogs || DIALOGS.map(d => ({ ...d })),
          currentDialogId: gameState.currentDialogId || null,
          actionLog: gameState.actionLog || [],
          dayHistory: gameState.dayHistory || [],
          isFirstLaunch: gameState.isFirstLaunch !== undefined ? gameState.isFirstLaunch : false,
          showIntroStory: gameState.showIntroStory !== undefined ? gameState.showIntroStory : false
        })
      } else {
        useProjectStore.getState().generateInitialProjects(1)
        useEmployeeStore.getState().generateInitialEmployee()
        set({
          day: 1,
          timeSlot: 'morning',
          phase: 'action_select',
          storyChapters: STORY_CHAPTERS.map(s => ({ ...s })),
          dialogs: DIALOGS.map(d => ({ ...d })),
          showIntroStory: true,
          isFirstLaunch: true
        })
      }
    } catch (e) {
      console.error('加载游戏失败:', e)
      useProjectStore.getState().generateInitialProjects(1)
      useEmployeeStore.getState().generateInitialEmployee()
    }
  },

  selectAction: (actionId: string, params?: ActionParams) => {
    const state = get()
    if (state.phase !== 'action_select') return null

    const result = executeAction(actionId, params)

    set((state) => ({
      actionLog: [...state.actionLog, result],
      lastSettlementResult: result,
      phase: 'settlement'
    }))

    get().checkDialogTriggers()

    return result
  },

  advanceTimeSlot: () => {
    const { day, timeSlot } = get()

    if (timeSlot === 'morning') {
      set({ timeSlot: 'afternoon', phase: 'action_select' })
    } else if (timeSlot === 'afternoon') {
      set({ timeSlot: 'evening', phase: 'action_select' })
    } else {
      get().settleDayEnd()
    }
  },

  settleDayEnd: () => {
    const dayResult = settleDay()

    set((state) => ({
      day: state.day + 1,
      timeSlot: 'morning',
      phase: 'day_summary',
      dayHistory: [...state.dayHistory, dayResult],
      lastDayResult: dayResult,
      actionLog: []
    }))

    get().checkDialogTriggers()
    get().saveGame()

    return dayResult
  },

  setPhase: (phase: GamePhase) => {
    set({ phase })
  },

  setShowIntroStory: (show: boolean) => {
    set({ showIntroStory: show })
  },

  markFirstLaunchCompleted: () => {
    set({ isFirstLaunch: false })
  },

  showDialog: (dialogId: string) => {
    set({ currentDialogId: dialogId })
  },

  hideDialog: () => {
    set({ currentDialogId: null })
  },

  selectDialogOption: (dialogId: string, option: DialogOption) => {
    if (option.reward) {
      const resourceStore = useResourceStore.getState()
      if (option.reward.gold) resourceStore.addGold(option.reward.gold)
      if (option.reward.power) resourceStore.addPower(option.reward.power)
      if (option.reward.reputation) resourceStore.addReputation(option.reward.reputation)
      if (option.reward.exp) resourceStore.addExp(option.reward.exp)
    }

    set((state) => ({
      dialogs: state.dialogs.map((d) =>
        d.id === dialogId ? { ...d, isTriggered: true, triggerTime: Date.now() } : d
      ),
      currentDialogId: null
    }))

    const dialog = get().dialogs.find(d => d.id === dialogId)
    if (option.nextDialogId) {
      set({ currentDialogId: option.nextDialogId })
    }
  },

  checkDialogTriggers: () => {
    const employees = useEmployeeStore.getState().employees
    const resources = useResourceStore.getState().resources
    const projectStore = useProjectStore.getState()
    const dialogs = get().dialogs
    const currentDialogId = get().currentDialogId
    const day = get().day

    if (currentDialogId) return

    for (const dialog of dialogs) {
      if (dialog.isTriggered) continue

      let shouldTrigger = false
      switch (dialog.trigger.type) {
        case 'employees':
          shouldTrigger = employees.length >= dialog.trigger.value
          break
        case 'gold':
          shouldTrigger = resources.gold >= dialog.trigger.value
          break
        case 'reputation':
          shouldTrigger = resources.reputation >= dialog.trigger.value
          break
        case 'projects':
          shouldTrigger = projectStore.completedProjectCount >= dialog.trigger.value
          break
        case 'level':
          shouldTrigger = employees.some((e) => e.level >= dialog.trigger.value)
          break
        case 'day':
          shouldTrigger = day >= dialog.trigger.value
          break
      }

      if (shouldTrigger) {
        get().showDialog(dialog.id)
        break
      }
    }
  },

  updateStoryChapter: (id: string, updates: Partial<StoryChapter>) => {
    set((state) => ({
      storyChapters: state.storyChapters.map(chapter =>
        chapter.id === id ? { ...chapter, ...updates } : chapter
      )
    }))
  },

  setCurrentEvent: (event: GameEvent | null) => {
    set({ currentEvent: event, phase: event ? 'event' : 'action_select' })
  },

  resetGame: () => {
    localStorage.removeItem(STORAGE_KEY)

    useResourceStore.getState().resetResources()
    useEmployeeStore.getState().generateInitialEmployee()
    useProjectStore.getState().generateInitialProjects(1)

    set({
      day: 1,
      timeSlot: 'morning',
      phase: 'action_select',
      storyChapters: STORY_CHAPTERS.map(s => ({ ...s })),
      dialogs: DIALOGS.map(d => ({ ...d, isTriggered: false, triggerTime: undefined })),
      currentDialogId: null,
      currentEvent: null,
      actionLog: [],
      dayHistory: [],
      lastSettlementResult: null,
      lastDayResult: null,
      lastSaveTime: 0,
      isFirstLaunch: true,
      showIntroStory: true
    })
  }
}))
