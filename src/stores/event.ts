import { create } from 'zustand'
import type { GameEvent, EventOption } from '../types'
import { GAME_EVENTS } from '../constants/events'
import { useGameStore } from './game'
import { useResourceStore } from './resource'
import { useEmployeeStore } from './employee'
import { useProjectStore } from './project'
import { randomChance } from '../utils/random'

interface EventState {
  triggeredEvents: Set<string>
  currentEvent: GameEvent | null
  setCurrentEvent: (event: GameEvent | null) => void
  resolveEvent: (optionId: string) => { rewards: Record<string, number>; penalties: Record<string, number>; message: string }
  tryTriggerExploreEvent: () => GameEvent | null
  tryTriggerDayEvent: () => GameEvent | null
  checkEventCondition: (event: GameEvent) => boolean
}

export const useEventStore = create<EventState>((set, get) => ({
  triggeredEvents: new Set(),
  currentEvent: null,

  setCurrentEvent: (event: GameEvent | null) => {
    set({ currentEvent: event })
  },

  resolveEvent: (optionId: string) => {
    const event = get().currentEvent
    if (!event) return { rewards: {}, penalties: {}, message: '没有当前事件' }

    const option = event.options.find(o => o.id === optionId)
    if (!option) return { rewards: {}, penalties: {}, message: '无效的选项' }

    const resourceStore = useResourceStore.getState()
    const result = { rewards: {} as Record<string, number>, penalties: {} as Record<string, number>, message: option.result }

    if (option.reward) {
      if (option.reward.gold) { resourceStore.addGold(option.reward.gold); result.rewards.gold = option.reward.gold }
      if (option.reward.power) { resourceStore.addPower(option.reward.power); result.rewards.power = option.reward.power }
      if (option.reward.reputation) { resourceStore.addReputation(option.reward.reputation); result.rewards.reputation = option.reward.reputation }
      if (option.reward.exp) { resourceStore.addExp(option.reward.exp); result.rewards.exp = option.reward.exp }
    }

    if (option.penalty) {
      if (option.penalty.gold && option.penalty.gold < 0) { resourceStore.addGold(option.penalty.gold); result.penalties.gold = option.penalty.gold }
      if (option.penalty.power && option.penalty.power < 0) { resourceStore.addPower(option.penalty.power); result.penalties.power = option.penalty.power }
      if (option.penalty.reputation && option.penalty.reputation < 0) { resourceStore.addReputation(option.penalty.reputation); result.penalties.reputation = option.penalty.reputation }
    }

    set((state) => {
      const newTriggered = new Set(state.triggeredEvents)
      newTriggered.add(event.id)
      return { triggeredEvents: newTriggered, currentEvent: null }
    })

    return result
  },

  tryTriggerExploreEvent: () => {
    const state = get()
    const eligibleEvents = GAME_EVENTS.filter(e =>
      !state.triggeredEvents.has(e.id) &&
      get().checkEventCondition(e)
    )

    if (eligibleEvents.length === 0) return null

    const commonEvents = eligibleEvents.filter(e => e.rarity === 'common')
    const rareEvents = eligibleEvents.filter(e => e.rarity === 'rare')
    const epicEvents = eligibleEvents.filter(e => e.rarity === 'epic')

    let event: GameEvent | null = null
    if (epicEvents.length > 0 && randomChance(0.1)) {
      event = epicEvents[Math.floor(Math.random() * epicEvents.length)]
    } else if (rareEvents.length > 0 && randomChance(0.3)) {
      event = rareEvents[Math.floor(Math.random() * rareEvents.length)]
    } else if (commonEvents.length > 0) {
      event = commonEvents[Math.floor(Math.random() * commonEvents.length)]
    }

    if (event) {
      set({ currentEvent: event })
    }
    return event
  },

  tryTriggerDayEvent: () => {
    const state = get()
    const eligibleEvents = GAME_EVENTS.filter(e =>
      !state.triggeredEvents.has(e.id) &&
      get().checkEventCondition(e)
    )

    if (eligibleEvents.length === 0) return null
    if (!randomChance(0.4)) return null

    const event = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)]
    set({ currentEvent: event })
    return event
  },

  checkEventCondition: (event: GameEvent) => {
    if (!event.triggerCondition) return true

    const gameStore = useGameStore.getState()
    const resourceStore = useResourceStore.getState()
    const employeeStore = useEmployeeStore.getState()
    const projectStore = useProjectStore.getState()

    const cond = event.triggerCondition
    switch (cond.type) {
      case 'day':
        return gameStore.day >= cond.value
      case 'reputation':
        return resourceStore.resources.reputation >= cond.value
      case 'gold':
        return resourceStore.resources.gold >= cond.value
      case 'employees':
        return employeeStore.employees.length >= cond.value
      case 'projects_completed':
        return projectStore.completedProjectCount >= cond.value
      case 'random':
        return randomChance(cond.value / 100)
      default:
        return false
    }
  }
}))
