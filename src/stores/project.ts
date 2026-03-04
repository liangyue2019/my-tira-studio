import { create } from 'zustand'
import type { Project } from '../types'
import { PROJECT_TEMPLATES, PROJECT_DIFFICULTY } from '../constants/projects'
import { randomInt, generateUUID } from '../utils/random'
import { useResourceStore } from './resource'
import { useEmployeeStore } from './employee'

interface ProjectState {
  projects: Project[]
  availableProjects: Project[]
  addProject: (project: Project) => void
  removeProject: (id: string) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  assignEmployeeToProject: (projectId: string, employeeId: string) => void
  removeEmployeeFromProject: (projectId: string, employeeId: string) => void
  completeProject: (id: string) => void
  generateAvailableProject: () => Project
  generateInitialProjects: () => void
  refreshAvailableProjects: () => void
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  availableProjects: [],

  addProject: (project: Project) => {
    set((state) => ({
      projects: [...state.projects, project]
    }))
  },

  removeProject: (id: string) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id)
    }))
  },

  updateProject: (id: string, updates: Partial<Project>) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      )
    }))
  },

  assignEmployeeToProject: (projectId: string, employeeId: string) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId && !p.assignedEmployees.includes(employeeId)
          ? { ...p, assignedEmployees: [...p.assignedEmployees, employeeId] }
          : p
      )
    }))

    // 更新员工的 assignedProjectId 和 isWorking 状态
    const employeeStore = useEmployeeStore.getState()
    employeeStore.updateEmployee(employeeId, {
      assignedProjectId: projectId,
      isWorking: true
    })
  },

  removeEmployeeFromProject: (projectId: string, employeeId: string) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              assignedEmployees: p.assignedEmployees.filter((id) => id !== employeeId)
            }
          : p
      )
    }))

    // 更新员工的 assignedProjectId 和 isWorking 状态
    const employeeStore = useEmployeeStore.getState()
    employeeStore.updateEmployee(employeeId, {
      assignedProjectId: undefined,
      isWorking: false,
      workProgress: 0
    })
  },

  completeProject: (id: string) => {
    const { projects } = get()
    const project = projects.find((p) => p.id === id)

    if (project) {
      const { addGold, addReputation, addExp } = useResourceStore.getState()

      addGold(project.reward.gold)
      addReputation(project.reward.reputation)
      addExp(project.reward.exp)

      // 重置所有分配员工的状态
      const employeeStore = useEmployeeStore.getState()
      project.assignedEmployees.forEach(employeeId => {
        employeeStore.updateEmployee(employeeId, {
          assignedProjectId: undefined,
          isWorking: false,
          workProgress: 0
        })
      })

      get().removeProject(id)
    }
  },

  generateAvailableProject: () => {
    const template = PROJECT_TEMPLATES[randomInt(0, PROJECT_TEMPLATES.length - 1)]
    const difficulty = randomInt(1, 5)
    const multiplier = PROJECT_DIFFICULTY[difficulty as keyof typeof PROJECT_DIFFICULTY].multiplier

    const requirements = {
      coding: Math.floor(template.baseRequirements.coding * multiplier),
      design: Math.floor(template.baseRequirements.design * multiplier),
      communication: Math.floor(template.baseRequirements.communication * multiplier)
    }

    const reward = {
      gold: Math.floor(template.baseReward.gold * multiplier),
      reputation: Math.floor(template.baseReward.reputation * multiplier),
      exp: Math.floor(template.baseReward.exp * multiplier)
    }

    return {
      id: generateUUID(),
      name: template.name,
      client: template.client,
      requirements,
      duration: Math.floor(template.baseDuration * multiplier),
      reward,
      difficulty,
      unlockedAt: Date.now(),
      isCompleted: false,
      assignedEmployees: [],
      progress: 0
    }
  },

  refreshAvailableProjects: () => {
    const count = randomInt(2, 4)
    const newProjects: Project[] = []

    for (let i = 0; i < count; i++) {
      newProjects.push(get().generateAvailableProject())
    }

    set({ availableProjects: newProjects })
  },

  generateInitialProjects: () => {
    // 生成 2 个简单的初始项目（难度 1，持续时间短）
    const initialProjects: Project[] = []

    for (let i = 0; i < 2; i++) {
      const template = PROJECT_TEMPLATES[i % PROJECT_TEMPLATES.length]
      const difficulty = 1 // 简单难度
      const multiplier = PROJECT_DIFFICULTY[difficulty as keyof typeof PROJECT_DIFFICULTY].multiplier

      const requirements = {
        coding: Math.floor(template.baseRequirements.coding * multiplier * 0.5), // 降低要求
        design: Math.floor(template.baseRequirements.design * multiplier * 0.5),
        communication: Math.floor(template.baseRequirements.communication * multiplier * 0.5)
      }

      const reward = {
        gold: Math.floor(template.baseReward.gold * multiplier),
        reputation: Math.floor(template.baseReward.reputation * multiplier),
        exp: Math.floor(template.baseReward.exp * multiplier)
      }

      initialProjects.push({
        id: generateUUID(),
        name: template.name,
        client: template.client,
        requirements,
        duration: Math.floor(template.baseDuration * multiplier * 0.3), // 缩短时间
        reward,
        difficulty,
        unlockedAt: Date.now(),
        isCompleted: false,
        assignedEmployees: [],
        progress: 0
      })
    }

    set({ availableProjects: initialProjects })
  }
}))
