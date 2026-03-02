import type { Achievement } from '../types'

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_1',
    title: '初出茅庐',
    description: '招募第一个智能体员工',
    condition: {
      type: 'employees',
      value: 1
    },
    reward: {
      power: 5
    },
    isUnlocked: false
  },
  {
    id: 'ach_2',
    title: '团队初建',
    description: '拥有 5 名员工',
    condition: {
      type: 'employees',
      value: 5
    },
    reward: {
      gold: 500,
      power: 10
    },
    isUnlocked: false
  },
  {
    id: 'ach_3',
    title: '声名鹊起',
    description: '声誉达到 100',
    condition: {
      type: 'reputation',
      value: 100
    },
    reward: {
      gold: 1000
    },
    isUnlocked: false
  },
  {
    id: 'ach_4',
    title: '财源广进',
    description: '累计获得 10000 金币',
    condition: {
      type: 'gold',
      value: 10000
    },
    reward: {
      power: 20
    },
    isUnlocked: false
  },
  {
    id: 'ach_5',
    title: '项目达人',
    description: '完成 10 个项目',
    condition: {
      type: 'projects',
      value: 10
    },
    reward: {
      gold: 2000,
      reputation: 100
    },
    isUnlocked: false
  },
  {
    id: 'ach_6',
    title: '传奇招募',
    description: '招募到传说品质的员工',
    condition: {
      type: 'employees',
      value: 1
    },
    reward: {
      power: 50
    },
    isUnlocked: false
  }
]
