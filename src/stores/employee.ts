import { create } from 'zustand'
import type { Employee, EmployeeColor } from '../types'
import { GAME_CONFIG, BASE_ABILITIES, COLOR_PREFIXES, BASE_SUFFIX } from '../constants/config'
import { randomInt, generateUUID } from '../utils/random'

interface EmployeeState {
  employees: Employee[]
  addEmployee: (employee: Employee) => void
  removeEmployee: (id: string) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  generateEmployee: (rarity?: number) => Employee
  generateInitialEmployee: () => void
  gacha: () => Employee
  getWorkingEmployees: () => Employee[]
  getIdleEmployees: () => Employee[]
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],

  addEmployee: (employee: Employee) => {
    set((state) => ({
      employees: [...state.employees, employee]
    }))
  },

  removeEmployee: (id: string) => {
    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id)
    }))
  },

  updateEmployee: (id: string, updates: Partial<Employee>) => {
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id ? { ...emp, ...updates } : emp
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
      isWorking: false,
      workProgress: 0,
      createdAt: Date.now()
    }
  },

  gacha: () => {
    const employee = get().generateEmployee()
    get().addEmployee(employee)
    return employee
  },

  getWorkingEmployees: () => {
    const { employees } = get()
    return employees.filter((emp) => emp.isWorking)
  },

  getIdleEmployees: () => {
    const { employees } = get()
    return employees.filter((emp) => !emp.isWorking)
  },

  generateInitialEmployee: () => {
    // 生成一个初始的白夜 tira 员工
    const initialEmployee = {
      id: generateUUID(),
      name: '白夜 tira',
      color: '白' as EmployeeColor,
      rarity: 2, // 优秀品质
      abilities: {
        coding: 15,
        design: 12,
        communication: 10,
        efficiency: 12
      },
      level: 1,
      exp: 0,
      isWorking: false,
      workProgress: 0,
      createdAt: Date.now()
    }
    
    set({ employees: [initialEmployee] })
  }
}))

function calculateRarity(): number {
  const rand = Math.random()
  let cumulative = 0
  
  for (let rarity = 5; rarity >= 1; rarity--) {
    cumulative += GAME_CONFIG.gachaRates[rarity as keyof typeof GAME_CONFIG.gachaRates]
    if (rand <= cumulative) {
      return rarity
    }
  }
  
  return 1
}

function calculateColor(_rarity: number): EmployeeColor {
  const rand = Math.random()
  let cumulative = 0
  
  const colors: EmployeeColor[] = ['金', '紫', '红', '蓝', '白']
  
  for (const color of colors) {
    cumulative += GAME_CONFIG.colorRates[color]
    if (rand <= cumulative) {
      return color
    }
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
