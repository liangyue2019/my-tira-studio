import type { Action, TimeSlot } from '../types'

export const ACTIONS: Action[] = [
  {
    id: 'work_project',
    type: 'work_project',
    name: '推进项目',
    description: '指派员工推进一个进行中的项目',
    icon: '📋',
    availableSlots: ['morning', 'afternoon', 'evening'],
    cost: { power: 5 }
  },
  {
    id: 'recruit',
    type: 'recruit',
    name: '招募员工',
    description: '消耗金币招募一名新的智能体员工',
    icon: '🎯',
    availableSlots: ['morning', 'afternoon'],
    cost: { gold: 100 }
  },
  {
    id: 'train',
    type: 'train',
    name: '培训员工',
    description: '花费金币和体力提升员工能力',
    icon: '📚',
    availableSlots: ['afternoon'],
    cost: { gold: 50, power: 3 }
  },
  {
    id: 'rest',
    type: 'rest',
    name: '休息',
    description: '恢复体力，为下一个时段养精蓄锐',
    icon: '😴',
    availableSlots: ['morning', 'afternoon', 'evening'],
    cost: {}
  },
  {
    id: 'explore',
    type: 'explore',
    name: '探索',
    description: '外出探索，可能获得金币、声望或触发事件',
    icon: '🔍',
    availableSlots: ['morning'],
    cost: { power: 3 }
  },
  {
    id: 'trade',
    type: 'trade',
    name: '交易',
    description: '在市场上买卖资源',
    icon: '💰',
    availableSlots: ['afternoon'],
    cost: {}
  },
  {
    id: 'social',
    type: 'social',
    name: '社交',
    description: '拓展人脉，提升声望',
    icon: '🤝',
    availableSlots: ['evening'],
    cost: { power: 2 }
  }
]

export function getActionsForSlot(slot: TimeSlot): Action[] {
  return ACTIONS.filter(a => a.availableSlots.includes(slot))
}
