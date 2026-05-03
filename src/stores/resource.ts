import { create } from 'zustand'
import type { Resources } from '../types'
import { INITIAL_RESOURCES } from '../constants/config'

interface ResourceState {
  resources: Resources
  addGold: (amount: number) => void
  addPower: (amount: number) => void
  addReputation: (amount: number) => void
  addExp: (amount: number) => void
  spendGold: (amount: number) => boolean
  spendPower: (amount: number) => boolean
  canAfford: (cost: Partial<Resources>) => boolean
  deductResources: (cost: Partial<Resources>) => boolean
  addResources: (gain: Partial<Resources>) => void
  resetResources: () => void
}

export const useResourceStore = create<ResourceState>((set, get) => ({
  resources: { ...INITIAL_RESOURCES },

  addGold: (amount: number) => {
    set((state) => ({
      resources: { ...state.resources, gold: state.resources.gold + amount }
    }))
  },

  addPower: (amount: number) => {
    set((state) => ({
      resources: { ...state.resources, power: state.resources.power + amount }
    }))
  },

  addReputation: (amount: number) => {
    set((state) => ({
      resources: { ...state.resources, reputation: state.resources.reputation + amount }
    }))
  },

  addExp: (amount: number) => {
    set((state) => ({
      resources: { ...state.resources, exp: state.resources.exp + amount }
    }))
  },

  spendGold: (amount: number): boolean => {
    const { resources } = get()
    if (resources.gold >= amount) {
      set({ resources: { ...resources, gold: resources.gold - amount } })
      return true
    }
    return false
  },

  spendPower: (amount: number): boolean => {
    const { resources } = get()
    if (resources.power >= amount) {
      set({ resources: { ...resources, power: resources.power - amount } })
      return true
    }
    return false
  },

  canAfford: (cost: Partial<Resources>): boolean => {
    const { resources } = get()
    if (cost.gold && resources.gold < cost.gold) return false
    if (cost.power && resources.power < cost.power) return false
    if (cost.reputation && resources.reputation < cost.reputation) return false
    if (cost.exp && resources.exp < cost.exp) return false
    return true
  },

  deductResources: (cost: Partial<Resources>): boolean => {
    if (!get().canAfford(cost)) return false
    set((state) => ({
      resources: {
        gold: state.resources.gold - (cost.gold || 0),
        power: state.resources.power - (cost.power || 0),
        reputation: state.resources.reputation - (cost.reputation || 0),
        exp: state.resources.exp - (cost.exp || 0)
      }
    }))
    return true
  },

  addResources: (gain: Partial<Resources>) => {
    set((state) => ({
      resources: {
        gold: state.resources.gold + (gain.gold || 0),
        power: state.resources.power + (gain.power || 0),
        reputation: state.resources.reputation + (gain.reputation || 0),
        exp: state.resources.exp + (gain.exp || 0)
      }
    }))
  },

  resetResources: () => {
    set({ resources: { ...INITIAL_RESOURCES } })
  }
}))
