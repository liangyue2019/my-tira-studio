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
  loadResources: () => void
}

export const useResourceStore = create<ResourceState>((set, get) => ({
  resources: { ...INITIAL_RESOURCES },

  addGold: (amount: number) => {
    set((state) => ({
      resources: {
        ...state.resources,
        gold: state.resources.gold + amount
      }
    }))
  },

  addPower: (amount: number) => {
    set((state) => ({
      resources: {
        ...state.resources,
        power: state.resources.power + amount
      }
    }))
  },

  addReputation: (amount: number) => {
    set((state) => ({
      resources: {
        ...state.resources,
        reputation: state.resources.reputation + amount
      }
    }))
  },

  addExp: (amount: number) => {
    set((state) => ({
      resources: {
        ...state.resources,
        exp: state.resources.exp + amount
      }
    }))
  },

  spendGold: (amount: number): boolean => {
    const { resources } = get()
    if (resources.gold >= amount) {
      set({
        resources: {
          ...resources,
          gold: resources.gold - amount
        }
      })
      return true
    }
    return false
  },

  spendPower: (amount: number): boolean => {
    const { resources } = get()
    if (resources.power >= amount) {
      set({
        resources: {
          ...resources,
          power: resources.power - amount
        }
      })
      return true
    }
    return false
  },

  loadResources: () => {
    set({
      resources: { ...INITIAL_RESOURCES }
    })
  }
}))
