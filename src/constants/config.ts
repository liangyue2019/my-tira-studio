import type { GameConfig, ActionType } from '../types'

export const GAME_CONFIG: GameConfig = {
  gachaCost: 100,
  gachaRates: {
    5: 0.02,
    4: 0.08,
    3: 0.20,
    2: 0.30,
    1: 0.40
  },
  colorRates: {
    '金': 0.05,
    '紫': 0.10,
    '红': 0.20,
    '蓝': 0.35,
    '白': 0.30
  },
  actionCosts: {
    work_project: { power: 5 },
    recruit: { gold: 100 },
    train: { gold: 50, power: 3 },
    rest: {},
    explore: { power: 3 },
    trade: {},
    social: { power: 2 }
  },
  basePowerRegenPerDay: 5,
  projectRefreshPerDay: 3,
  employeeSalaryPerDay: 20,
  trainingExpGain: 30,
  trainingAbilityGain: 3,
  exploreRewardRange: {
    gold: [20, 100],
    reputation: [1, 10],
    power: [1, 5]
  },
  socialReputationRange: [3, 8],
  tradeRate: 10
}

export const INITIAL_RESOURCES = {
  gold: 1000,
  power: 10,
  reputation: 0,
  exp: 0
}

export const COLOR_PREFIXES = {
  '金': '金夜',
  '紫': '紫夜',
  '红': '红夜',
  '蓝': '蓝夜',
  '白': '白夜'
}

export const BASE_SUFFIX = 'tira'

export const BASE_ABILITIES = {
  1: { min: 5, max: 10 },
  2: { min: 10, max: 20 },
  3: { min: 20, max: 35 },
  4: { min: 35, max: 50 },
  5: { min: 50, max: 70 }
}

export const LEVEL_UP_EXP = {
  1: 100,
  2: 200,
  3: 350,
  4: 500,
  5: 750
}

export const PROJECT_DIFFICULTY = {
  1: { name: '简单', multiplier: 1.0 },
  2: { name: '普通', multiplier: 1.5 },
  3: { name: '困难', multiplier: 2.0 },
  4: { name: '专家', multiplier: 3.0 },
  5: { name: '传奇', multiplier: 5.0 }
}

export const SKILL_MATCH_THRESHOLD = 0.6
export const SKILL_MATCH_MIN_COUNT = 2
export const SKILL_MISMATCH_PENALTY = 0.3
export const MAX_PROJECT_PROGRESS_PER_SLOT = 3

export const STORAGE_KEY = 'ai_studio_game_save'
export const SAVE_INTERVAL = 30000

export const ABILITY_NAMES: Record<string, string> = {
  coding: '编程',
  design: '设计',
  communication: '沟通',
  efficiency: '效率'
}
