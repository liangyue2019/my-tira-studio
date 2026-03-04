import { create } from 'zustand'
import type { StoryChapter, Achievement, Dialog, DialogOption } from '../types'
import { STORY_CHAPTERS } from '../constants/story'
import { ACHIEVEMENTS } from '../constants/achievements'
import { DIALOGS } from '../constants/dialogs'
import { STORAGE_KEY, SAVE_INTERVAL } from '../constants/config'
import { useResourceStore } from './resource'
import { useEmployeeStore } from './employee'
import { useProjectStore } from './project'

interface GameStore {
  resources: any
  employees: any[]
  projects: any[]
  achievements: Achievement[]
  storyChapters: StoryChapter[]
  dialogs: Dialog[]
  currentDialogId: string | null
  lastSaveTime: number
  totalPlayTime: number
  offlineStartTime: number
  isFirstLaunch: boolean
  showIntroStory: boolean
  initializeGame: () => void
  saveGame: () => void
  loadGame: () => void
  updateStoryChapter: (id: string, updates: Partial<StoryChapter>) => void
  unlockAchievement: (id: string) => void
  checkAchievements: () => void
  setOfflineStartTime: (time: number) => void
  setShowIntroStory: (show: boolean) => void
  markFirstLaunchCompleted: () => void
  showDialog: (dialogId: string) => void
  hideDialog: () => void
  selectDialogOption: (dialogId: string, option: DialogOption) => void
  checkDialogTriggers: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  resources: {
    gold: 1000,
    power: 10,
    reputation: 0,
    exp: 0
  },
  employees: [],
  projects: [],
  achievements: [],
  storyChapters: [],
  dialogs: [],
  currentDialogId: null,
  lastSaveTime: 0,
  totalPlayTime: 0,
  offlineStartTime: Date.now(),
  isFirstLaunch: true,
  showIntroStory: true,

  initializeGame: () => {
    console.log('initializeGame')
    const state = get()
    state.loadGame()

    setInterval(() => {
      get().saveGame()
    }, SAVE_INTERVAL)
  },

  saveGame: () => {
    const resources = useResourceStore.getState().resources
    const employees = useEmployeeStore.getState().employees
    const projects = useProjectStore.getState().projects

    const gameState = {
      resources,
      employees,
      projects,
      achievements: getAchievements(),
      storyChapters: getStoryChapters(),
      dialogs: getDialogs(),
      currentDialogId: get().currentDialogId,
      lastSaveTime: Date.now(),
      totalPlayTime: get().totalPlayTime,
      offlineStartTime: get().offlineStartTime,
      isFirstLaunch: get().isFirstLaunch,
      showIntroStory: get().showIntroStory
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
      set({ lastSaveTime: Date.now() })
      console.log('游戏已保存')
    } catch (e) {
      console.error('保存游戏失败:', e)
    }
  },

  loadGame: () => {
    try {
      console.log('开始加载游戏')
      const saved = localStorage.getItem(STORAGE_KEY)

      if (saved) {
        const gameState = JSON.parse(saved)

        useResourceStore.setState({ resources: gameState.resources })
        useEmployeeStore.setState({ employees: gameState.employees || [] })
        useProjectStore.setState({ projects: gameState.projects || [] })

        set({
          dialogs: gameState.dialogs || getDialogs(),
          currentDialogId: gameState.currentDialogId || null,
          lastSaveTime: gameState.lastSaveTime || 0,
          totalPlayTime: gameState.totalPlayTime || 0,
          offlineStartTime: gameState.offlineStartTime || Date.now(),
          isFirstLaunch: gameState.isFirstLaunch !== undefined ? gameState.isFirstLaunch : false,
          showIntroStory: gameState.showIntroStory !== undefined ? gameState.showIntroStory : false
        })

        console.log('游戏已加载')
      } else {
        set({
          dialogs: getDialogs(),
          currentDialogId: null,
          offlineStartTime: Date.now()
        })
        useProjectStore.getState().generateInitialProjects()
        useEmployeeStore.getState().generateInitialEmployee()
        set({ showIntroStory: true, isFirstLaunch: true })
        console.log('新游戏开始')
      }
    } catch (e) {
      console.error('加载游戏失败:', e)
      set({
        dialogs: getDialogs(),
        currentDialogId: null,
        offlineStartTime: Date.now()
      })
    }
  },

  updateStoryChapter: (id: string, updates: Partial<StoryChapter>) => {
    const chapters = getStoryChapters()
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === id ? { ...chapter, ...updates } : chapter
    )

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const gameState = JSON.parse(saved)
        gameState.storyChapters = updatedChapters
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
      }
    } catch (e) {
      console.error('更新剧情失败:', e)
    }
  },

  unlockAchievement: (id: string) => {
    const achievements = getAchievements()
    const achievement = achievements.find((a) => a.id === id)

    if (achievement && !achievement.isUnlocked) {
      achievement.isUnlocked = true
      achievement.unlockedAt = Date.now()

      if (achievement.reward.gold) {
        useResourceStore.getState().addGold(achievement.reward.gold)
      }
      if (achievement.reward.power) {
        useResourceStore.getState().addPower(achievement.reward.power)
      }
      if (achievement.reward.reputation) {
        useResourceStore.getState().addReputation(achievement.reward.reputation)
      }

      console.log(`解锁成就：${achievement.title}`)
    }
  },

  checkAchievements: () => {
    const employees = useEmployeeStore.getState().employees
    const resources = useResourceStore.getState().resources
    const projects = useProjectStore.getState().projects

    const achievements = getAchievements()

    achievements.forEach((achievement) => {
      if (!achievement.isUnlocked) {
        let unlocked = false

        switch (achievement.condition.type) {
          case 'employees':
            unlocked = employees.length >= achievement.condition.value
            break
          case 'gold':
            unlocked = resources.gold >= achievement.condition.value
            break
          case 'reputation':
            unlocked = resources.reputation >= achievement.condition.value
            break
          case 'projects':
            unlocked = projects.filter((p) => p.isCompleted).length >= achievement.condition.value
            break
          case 'level':
            unlocked = employees.some((e) => e.level >= achievement.condition.value)
            break
        }

        if (unlocked) {
          get().unlockAchievement(achievement.id)
        }
      }
    })
  },

  setOfflineStartTime: (time: number) => {
    set({ offlineStartTime: time })
  },

  setShowIntroStory: (show: boolean) => {
    set({ showIntroStory: show })
  },

  markFirstLaunchCompleted: () => {
    set({ isFirstLaunch: false })
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const gameState = JSON.parse(saved)
        gameState.isFirstLaunch = false
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
      }
    } catch (e) {
      console.error('标记首次启动失败:', e)
    }
  },

  showDialog: (dialogId: string) => {
    set({ currentDialogId: dialogId })
  },

  hideDialog: () => {
    set({ currentDialogId: null })
  },

  selectDialogOption: (dialogId: string, option: DialogOption) => {
    if (option.reward) {
      if (option.reward.gold) {
        useResourceStore.getState().addGold(option.reward.gold)
      }
      if (option.reward.power) {
        useResourceStore.getState().addPower(option.reward.power)
      }
      if (option.reward.reputation) {
        useResourceStore.getState().addReputation(option.reward.reputation)
      }
      if (option.reward.exp) {
        useResourceStore.getState().addExp(option.reward.exp)
      }
    }

    const dialogs = get().dialogs.map((d) =>
      d.id === dialogId ? { ...d, isTriggered: true, triggerTime: Date.now() } : d
    )
    set({ dialogs, currentDialogId: null })

    if (option.nextDialogId) {
      set({ currentDialogId: option.nextDialogId })
    }
  },

  checkDialogTriggers: () => {
    const employees = useEmployeeStore.getState().employees
    const resources = useResourceStore.getState().resources
    const projects = useProjectStore.getState().projects
    const dialogs = get().dialogs
    const currentDialogId = get().currentDialogId

    if (currentDialogId) {
      return
    }

    for (const dialog of dialogs) {
      if (dialog.isTriggered) {
        continue
      }

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
          shouldTrigger = projects.filter((p) => p.isCompleted).length >= dialog.trigger.value
          break
        case 'level':
          shouldTrigger = employees.some((e) => e.level >= dialog.trigger.value)
          break
      }

      if (shouldTrigger) {
        get().showDialog(dialog.id)
        break
      }
    }
  }
}))

function getStoryChapters(): StoryChapter[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const gameState = JSON.parse(saved)
      return gameState.storyChapters || STORY_CHAPTERS
    }
  } catch (e) {
    console.error('获取剧情失败:', e)
  }
  return STORY_CHAPTERS
}

function getAchievements(): Achievement[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const gameState = JSON.parse(saved)
      return gameState.achievements || ACHIEVEMENTS
    }
  } catch (e) {
    console.error('获取成就失败:', e)
  }
  return ACHIEVEMENTS
}

function getDialogs(): Dialog[] {
  console.log('getDialogs')
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const gameState = JSON.parse(saved)
      return gameState.dialogs || DIALOGS
    }
  } catch (e) {
    console.error('获取对话失败:', e)
  }
  return DIALOGS
}
