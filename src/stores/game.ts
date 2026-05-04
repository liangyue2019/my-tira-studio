import { create } from 'zustand'
import type { TimeSlot, GamePhase, StoryChapter, Dialog, DialogOption, SettlementResult, DaySettlementResult, GameEvent, ActionParams, CharacterAffinity } from '../types'
import { STORY_CHAPTERS } from '../constants/story'
import { DIALOGS } from '../constants/dialogs'
import { STORY_DIALOGS } from '../constants/storyDialogs'
import { STORAGE_KEY, SAVE_INTERVAL } from '../constants/config'
import { useResourceStore } from './resource'
import { useEmployeeStore } from './employee'
import { useProjectStore } from './project'
import { executeAction, settleDay } from './settlement'

const ALL_DIALOGS: Dialog[] = [...DIALOGS, ...STORY_DIALOGS]

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
  characterAffinity: CharacterAffinity
  hasActedThisSlot: boolean
  _actionSnapshot: {
    resources: any
    employees: any
    projects: any
    availableProjects: any
    completedProjectCount: number
    actionLog: SettlementResult[]
  } | null

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
  checkStoryDialogTriggers: () => void
  updateStoryChapter: (id: string, updates: Partial<StoryChapter>) => void
  updateAffinity: (character: string, amount: number) => void
  setCurrentEvent: (event: GameEvent | null) => void
  undoLastAction: () => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  day: 1,
  timeSlot: 'morning',
  phase: 'action_select',
  storyChapters: STORY_CHAPTERS.map(s => ({ ...s })),
  dialogs: ALL_DIALOGS.map(d => ({ ...d })),
  currentDialogId: null,
  currentEvent: null,
  actionLog: [],
  dayHistory: [],
  lastSettlementResult: null,
  lastDayResult: null,
  lastSaveTime: 0,
  isFirstLaunch: true,
  showIntroStory: true,
  characterAffinity: { tira: 0, rei: 0 },
  hasActedThisSlot: false,
  _actionSnapshot: null,

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
      showIntroStory: get().showIntroStory,
      characterAffinity: get().characterAffinity
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
          dialogs: gameState.dialogs || ALL_DIALOGS.map(d => ({ ...d })),
          currentDialogId: gameState.currentDialogId || null,
          actionLog: gameState.actionLog || [],
          dayHistory: gameState.dayHistory || [],
          isFirstLaunch: gameState.isFirstLaunch !== undefined ? gameState.isFirstLaunch : false,
          showIntroStory: gameState.showIntroStory !== undefined ? gameState.showIntroStory : false,
          characterAffinity: gameState.characterAffinity || { tira: 0, rei: 0 }
        })
      } else {
        useProjectStore.getState().generateInitialProjects(1)
        useEmployeeStore.getState().generateInitialEmployee()
        set({
          day: 1,
          timeSlot: 'morning',
          phase: 'action_select',
          storyChapters: STORY_CHAPTERS.map(s => ({ ...s })),
          dialogs: ALL_DIALOGS.map(d => ({ ...d })),
          showIntroStory: true,
          isFirstLaunch: true,
          characterAffinity: { tira: 0, rei: 0 }
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
    if (state.phase !== 'action_select' && state.phase !== 'project_assign') return null

    if (actionId === 'work_project') {
      const projectStore = useProjectStore.getState()
      const activeProjects = projectStore.projects.filter((p: any) => !p.isCompleted && !p.isFailed)
      if (activeProjects.length === 0) return null
    }

    const snapshot = {
      resources: { ...useResourceStore.getState().resources },
      employees: useEmployeeStore.getState().employees.map((e: any) => ({ ...e, abilities: { ...e.abilities } })),
      projects: useProjectStore.getState().projects.map((p: any) => ({ ...p, requirements: { ...p.requirements }, reward: { ...p.reward }, assignedEmployees: [...p.assignedEmployees] })),
      availableProjects: useProjectStore.getState().availableProjects.map((p: any) => ({ ...p, requirements: { ...p.requirements }, reward: { ...p.reward }, assignedEmployees: [...p.assignedEmployees] })),
      completedProjectCount: useProjectStore.getState().completedProjectCount,
      actionLog: [...state.actionLog]
    }

    const result = executeAction(actionId, params)

    set((state) => ({
      actionLog: [...state.actionLog, result],
      lastSettlementResult: result,
      phase: 'settlement',
      hasActedThisSlot: true,
      _actionSnapshot: snapshot
    }))

    get().checkDialogTriggers()

    return result
  },

  advanceTimeSlot: () => {
    const { day, timeSlot } = get()

    if (timeSlot === 'morning') {
      set({ timeSlot: 'afternoon', phase: 'action_select', hasActedThisSlot: false, _actionSnapshot: null })
    } else if (timeSlot === 'afternoon') {
      set({ timeSlot: 'evening', phase: 'action_select', hasActedThisSlot: false, _actionSnapshot: null })
    } else {
      get().settleDayEnd()
      return
    }

    get().checkStoryDialogTriggers()
  },

  settleDayEnd: () => {
    const dayResult = settleDay()

    set((state) => ({
      day: state.day + 1,
      timeSlot: 'morning',
      phase: 'day_summary',
      dayHistory: [...state.dayHistory, dayResult],
      lastDayResult: dayResult,
      actionLog: [],
      hasActedThisSlot: false
    }))

    get().checkDialogTriggers()
    get().checkStoryDialogTriggers()
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

    if (option.affinityEffect) {
      get().updateAffinity(option.affinityEffect.character, option.affinityEffect.amount)
    }

    if (option.specialAction) {
      handleSpecialAction(option.specialAction)
    }

    set((state) => ({
      dialogs: state.dialogs.map((d) =>
        d.id === dialogId ? { ...d, isTriggered: true, triggerTime: Date.now() } : d
      ),
      currentDialogId: null
    }))

    if (option.nextDialogId) {
      set({ currentDialogId: option.nextDialogId })
    } else {
      setTimeout(() => {
        get().checkDialogTriggers()
        get().checkStoryDialogTriggers()
      }, 300)
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
      if (dialog.trigger.type === 'dayTimeSlot') continue

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

  checkStoryDialogTriggers: () => {
    const { day, timeSlot, dialogs, currentDialogId } = get()

    if (currentDialogId) return

    for (const dialog of dialogs) {
      if (dialog.isTriggered) continue
      if (dialog.trigger.type !== 'dayTimeSlot') continue

      if (dialog.trigger.dayValue === day && dialog.trigger.timeSlotValue === timeSlot) {
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

  updateAffinity: (character: string, amount: number) => {
    set((state) => ({
      characterAffinity: {
        ...state.characterAffinity,
        [character]: (state.characterAffinity[character as keyof CharacterAffinity] || 0) + amount
      }
    }))
  },

  setCurrentEvent: (event: GameEvent | null) => {
    set({ currentEvent: event, phase: event ? 'event' : 'action_select' })
  },

  undoLastAction: () => {
    const state = get()
    const snapshot = state._actionSnapshot
    if (!snapshot) {
      set({ phase: 'action_select', hasActedThisSlot: false, lastSettlementResult: null })
      return
    }

    useResourceStore.setState({ resources: snapshot.resources })
    useEmployeeStore.setState({ employees: snapshot.employees })
    useProjectStore.setState({
      projects: snapshot.projects,
      availableProjects: snapshot.availableProjects,
      completedProjectCount: snapshot.completedProjectCount
    })

    set({
      phase: 'action_select',
      hasActedThisSlot: false,
      lastSettlementResult: null,
      actionLog: snapshot.actionLog,
      _actionSnapshot: null
    })
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
      dialogs: ALL_DIALOGS.map(d => ({ ...d, isTriggered: false, triggerTime: undefined })),
      currentDialogId: null,
      currentEvent: null,
      actionLog: [],
      dayHistory: [],
      lastSettlementResult: null,
      lastDayResult: null,
      lastSaveTime: 0,
      isFirstLaunch: true,
      showIntroStory: true,
      characterAffinity: { tira: 0, rei: 0 },
      hasActedThisSlot: false,
      _actionSnapshot: null
    })
  }
}))

function handleSpecialAction(action: string) {
  const employeeStore = useEmployeeStore.getState()

  switch (action) {
    case 'recruit_lan':
      employeeStore.addSpecialEmployee(
        '蓝夜 tira',
        1,
        { coding: 8, design: 6, communication: 5, efficiency: 7 },
        '蓝' as any
      )
      break
    case 'recruit_rei_legendary':
      employeeStore.addSpecialEmployee(
        '零',
        5,
        { coding: 70, design: 55, communication: 40, efficiency: 65 },
        '白' as any
      )
      break
    case 'recruit_rei_partner':
      employeeStore.addSpecialEmployee(
        '零',
        5,
        { coding: 55, design: 45, communication: 60, efficiency: 50 },
        '白' as any
      )
      break
  }
}
