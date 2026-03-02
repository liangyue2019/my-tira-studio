import { create } from 'zustand'
import type { GameState, StoryChapter, Achievement } from '../types'
import { STORY_CHAPTERS } from '../constants/story'
import { ACHIEVEMENTS } from '../constants/achievements'
import { STORAGE_KEY, SAVE_INTERVAL } from '../constants/config'
import { useResourceStore } from './resource'
import { useEmployeeStore } from './employee'
import { useProjectStore } from './project'

export const useGameStore = create<GameState>((set, get) => ({
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
  isInitialized: false,
  lastSaveTime: 0,
  totalPlayTime: 0,
  offlineStartTime: Date.now(),
  isFirstLaunch: true,
  showIntroStory: false,

  initializeGame: () => {
    const state = get()
    state.loadGame()
    set({ isInitialized: true } as Partial<GameState>)

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
      lastSaveTime: Date.now(),
      totalPlayTime: get().totalPlayTime,
      offlineStartTime: get().offlineStartTime,
      isFirstLaunch: get().isFirstLaunch,
      showIntroStory: get().showIntroStory
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
      set({ lastSaveTime: Date.now() } as Partial<GameState>)
      console.log('游戏已保存')
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
        useProjectStore.setState({ projects: gameState.projects || [] })

        set({
          lastSaveTime: gameState.lastSaveTime || 0,
          totalPlayTime: gameState.totalPlayTime || 0,
          offlineStartTime: gameState.offlineStartTime || Date.now(),
          isFirstLaunch: gameState.isFirstLaunch !== undefined ? gameState.isFirstLaunch : false
        })

        console.log('游戏已加载')
      } else {
        set({ offlineStartTime: Date.now() } as Partial<GameState>)
        // 新游戏：生成初始项目和初始员工
        useProjectStore.getState().generateInitialProjects()
        useEmployeeStore.getState().generateInitialEmployee()
        // 显示初始剧情
        set({ showIntroStory: true, isFirstLaunch: true } as Partial<GameState>)
        console.log('新游戏开始')
      }
    } catch (e) {
      console.error('加载游戏失败:', e)
      set({ offlineStartTime: Date.now() })
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
    set({ offlineStartTime: time } as Partial<GameState>)
  },

  setShowIntroStory: (show: boolean) => {
    set({ showIntroStory: show } as Partial<GameState>)
  },

  markFirstLaunchCompleted: () => {
    set({ isFirstLaunch: false } as Partial<GameState>)
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
