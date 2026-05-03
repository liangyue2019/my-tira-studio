import { create } from 'zustand'
import type { Employee, EmployeeColor, EmployeeStatus } from '../types'
import { GAME_CONFIG, BASE_ABILITIES, COLOR_PREFIXES, BASE_SUFFIX } from '../constants/config'
import { randomInt, generateUUID } from '../utils/random'

interface EmployeeState {
  employees: Employee[]
  addEmployee: (employee: Employee) => void
  removeEmployee: (id: string) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  setEmployeeStatus: (id: string, status: EmployeeStatus, action?: string) => void
  resetEmployeeStatus: (id: string) => void
  generateEmployee: (rarity?: number) => Employee
  generateInitialEmployee: () => void
  gacha: () => Employee
  getEmployeesByStatus: (status: EmployeeStatus) => Employee[]
  getWorkingEmployees: () => Employee[]
  getIdleEmployees: () => Employee[]
  getEmployeeById: (id: string) => Employee | undefined
  resetAllEmployeeStatus: () => void
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],

  addEmployee: (employee: Employee) => {
    set((state) => ({ employees: [...state.employees, employee] }))
  },

  removeEmployee: (id: string) => {
    set((state) => ({ employees: state.employees.filter((emp) => emp.id !== id) }))
  },

  updateEmployee: (id: string, updates: Partial<Employee>) => {
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id ? { ...emp, ...updates } : emp
      )
    }))
  },

  setEmployeeStatus: (id: string, status: EmployeeStatus, action?: string) => {
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id
          ? { ...emp, status, currentAction: action as any, assignedProjectId: status === 'working' ? emp.assignedProjectId : undefined }
          : emp
      )
    }))
  },

  resetEmployeeStatus: (id: string) => {
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id
          ? { ...emp, status: 'idle' as EmployeeStatus, currentAction: undefined, assignedProjectId: undefined }
          : emp
      )
    }))
  },

  generateEmployee: (rarity?: number) => {
    const finalRarity = rarity || calculateRarity()
    const color = calculateColor(finalRarity)
    const abilities = generateAbilities(finalRarity)
    const name = `${COLOR_PREFIXES[color]}${BASE_SUFFIX}_${generateUUID().substring(0, 4)}`

    return {
      id: generateUUID(),
      name,
      color,
      rarity: finalRarity,
      abilities,
      level: 1,
      exp: 0,
      status: 'idle' as EmployeeStatus,
      createdAt: Date.now()
    }
  },

  gacha: () => {
    const employee = get().generateEmployee()
    get().addEmployee(employee)
    return employee
  },

  getEmployeesByStatus: (status: EmployeeStatus) => {
    return get().employees.filter((emp) => emp.status === status)
  },

  getWorkingEmployees: () => {
    return get().employees.filter((emp) => emp.status === 'working')
  },

  getIdleEmployees: () => {
    return get().employees.filter((emp) => emp.status === 'idle')
  },

  getEmployeeById: (id: string) => {
    return get().employees.find((emp) => emp.id === id)
  },

  generateInitialEmployee: () => {
    const initialEmployee: Employee = {
      id: generateUUID(),
      name: '白夜 tira',
      color: '白' as EmployeeColor,
      rarity: 2,
      abilities: {
        coding: 15,
        design: 12,
        communication: 10,
        efficiency: 12
      },
      level: 1,
      exp: 0,
      status: 'idle',
      createdAt: Date.now()
    }
    set({ employees: [initialEmployee] })
  },

  resetAllEmployeeStatus: () => {
    set((state) => ({
      employees: state.employees.map((emp) => ({
        ...emp,
        status: 'idle' as EmployeeStatus,
        currentAction: undefined,
        assignedProjectId: undefined
      }))
    }))
  }
}))

function calculateRarity(): number {
  const rand = Math.random()
  let cumulative = 0
  for (let rarity = 5; rarity >= 1; rarity--) {
    cumulative += GAME_CONFIG.gachaRates[rarity]
    if (rand <= cumulative) return rarity
  }
  return 1
}

function calculateColor(_rarity: number): EmployeeColor {
  const rand = Math.random()
  let cumulative = 0
  const colors: EmployeeColor[] = ['金', '紫', '红', '蓝', '白']
  for (const color of colors) {
    cumulative += GAME_CONFIG.colorRates[color]
    if (rand <= cumulative) return color
  }
  return '白'
}

function generateAbilities(rarity: number) {
  const range = BASE_ABILITIES[rarity as keyof typeof BASE_ABILITIES]
  return {
    coding: randomInt(range.min, range.max),
    design: randomInt(range.min, range.max),
    communication: randomInt(range.min, range.max),
    efficiency: randomInt(range.min, range.max)
  }
}
