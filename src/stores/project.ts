import { create } from 'zustand'
import type { Project } from '../types'
import { PROJECT_TEMPLATES, PROJECT_DIFFICULTY, CLIENT_NAMES } from '../constants/projects'
import { randomInt, randomChoice, generateUUID } from '../utils/random'

interface ProjectState {
  projects: Project[]
  availableProjects: Project[]
  completedProjectCount: number
  addProject: (project: Project) => void
  removeProject: (id: string) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  assignEmployee: (projectId: string, employeeId: string) => void
  removeEmployee: (projectId: string, employeeId: string) => void
  completeProject: (id: string) => Project | undefined
  failProject: (id: string) => void
  addProgress: (projectId: string, slots: number) => { completed: boolean; progressBefore: number; progressAfter: number }
  generateAvailableProject: (currentDay: number) => Project
  refreshAvailableProjects: (currentDay: number) => void
  generateInitialProjects: (currentDay: number) => void
  clearCompletedAndFailed: () => void
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  availableProjects: [],
  completedProjectCount: 0,

  addProject: (project: Project) => {
    set((state) => ({
      projects: [...state.projects, project],
      availableProjects: state.availableProjects.filter((p) => p.id !== project.id)
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

  assignEmployee: (projectId: string, employeeId: string) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId && !p.assignedEmployees.includes(employeeId)
          ? { ...p, assignedEmployees: [...p.assignedEmployees, employeeId] }
          : p
      )
    }))
  },

  removeEmployee: (projectId: string, employeeId: string) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? { ...p, assignedEmployees: p.assignedEmployees.filter((id) => id !== employeeId) }
          : p
      )
    }))
  },

  completeProject: (id: string) => {
    const project = get().projects.find((p) => p.id === id)
    if (!project) return undefined

    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, isCompleted: true, isFailed: false } : p
      ),
      completedProjectCount: state.completedProjectCount + 1
    }))

    return { ...project, isCompleted: true }
  },

  failProject: (id: string) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, isFailed: true, isCompleted: false } : p
      )
    }))
  },

  addProgress: (projectId: string, slots: number) => {
    const project = get().projects.find((p) => p.id === projectId)
    if (!project) return { completed: false, progressBefore: 0, progressAfter: 0 }

    const progressBefore = project.slotsSpent / project.totalSlots
    const newSlotsSpent = Math.min(project.slotsSpent + slots, project.totalSlots)
    const progressAfter = newSlotsSpent / project.totalSlots

    if (newSlotsSpent >= project.totalSlots) {
      get().completeProject(projectId)
      return { completed: true, progressBefore, progressAfter: 1 }
    }

    get().updateProject(projectId, { slotsSpent: newSlotsSpent })
    return { completed: false, progressBefore, progressAfter }
  },

  generateAvailableProject: (currentDay: number) => {
    const template = randomChoice(PROJECT_TEMPLATES)
    const maxDifficulty = Math.min(5, Math.floor(currentDay / 5) + 1)
    const difficulty = randomInt(1, maxDifficulty)
    const multiplier = PROJECT_DIFFICULTY[difficulty as keyof typeof PROJECT_DIFFICULTY].multiplier
    const client = randomChoice(CLIENT_NAMES)

    const totalSlots = Math.max(1, Math.ceil(template.baseSlots * multiplier * 0.5))
    const deadline = Math.max(currentDay + 2, Math.ceil(template.baseDeadline * multiplier * 0.5) + currentDay)

    const project: Project = {
      id: generateUUID(),
      name: template.name,
      client,
      requirements: {
        coding: Math.ceil(template.baseRequirements.coding * multiplier * 0.5),
        design: Math.ceil(template.baseRequirements.design * multiplier * 0.5),
        communication: Math.ceil(template.baseRequirements.communication * multiplier * 0.5)
      },
      totalSlots,
      slotsSpent: 0,
      reward: {
        gold: Math.ceil(template.baseReward.gold * multiplier),
        reputation: Math.ceil(template.baseReward.reputation * multiplier),
        exp: Math.ceil(template.baseReward.exp * multiplier)
      },
      difficulty,
      deadline,
      assignedEmployees: [],
      isCompleted: false,
      isFailed: false,
      createdAt: Date.now()
    }

    return project
  },

  refreshAvailableProjects: (currentDay: number) => {
    const count = randomInt(2, 3)
    const newProjects: Project[] = []
    for (let i = 0; i < count; i++) {
      newProjects.push(get().generateAvailableProject(currentDay))
    }
    set({ availableProjects: newProjects })
  },

  generateInitialProjects: (currentDay: number) => {
    const initialProjects: Project[] = []

    for (let i = 0; i < 2; i++) {
      const template = PROJECT_TEMPLATES[i]
      const totalSlots = i === 0 ? 1 : Math.ceil(template.baseSlots * 0.5)
      const deadline = i === 0 ? currentDay + 3 : currentDay + 5

      const project: Project = {
        id: generateUUID(),
        name: template.name,
        client: template.client,
        requirements: {
          coding: Math.ceil(template.baseRequirements.coding * 0.5),
          design: Math.ceil(template.baseRequirements.design * 0.5),
          communication: Math.ceil(template.baseRequirements.communication * 0.5)
        },
        totalSlots,
        slotsSpent: 0,
        reward: {
          gold: Math.ceil(template.baseReward.gold * 0.5),
          reputation: Math.ceil(template.baseReward.reputation * 0.5),
          exp: Math.ceil(template.baseReward.exp * 0.5)
        },
        difficulty: 1,
        deadline,
        assignedEmployees: [],
        isCompleted: false,
        isFailed: false,
        createdAt: Date.now()
      }

      initialProjects.push(project)
    }

    set({ projects: initialProjects, availableProjects: [], completedProjectCount: 0 })
  },

  clearCompletedAndFailed: () => {
    set((state) => ({
      projects: state.projects.filter((p) => !p.isCompleted && !p.isFailed)
    }))
  }
}))
