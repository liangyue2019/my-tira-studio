export type TimeSlot = 'morning' | 'afternoon' | 'evening'

export type GamePhase = 'action_select' | 'project_assign' | 'settlement' | 'day_summary' | 'event'

export type EmployeeStatus = 'idle' | 'working' | 'training' | 'exploring' | 'resting' | 'socializing'

export type ActionType =
  | 'work_project'
  | 'recruit'
  | 'train'
  | 'rest'
  | 'explore'
  | 'trade'
  | 'social'

export type EventRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Resources {
  gold: number
  power: number
  reputation: number
  exp: number
}

export type EmployeeColor = '蓝' | '金' | '红' | '紫' | '白'

export interface EmployeeAbilities {
  coding: number
  design: number
  communication: number
  efficiency: number
}

export interface Employee {
  id: string
  name: string
  color: EmployeeColor
  rarity: number
  abilities: EmployeeAbilities
  level: number
  exp: number
  status: EmployeeStatus
  assignedProjectId?: string
  currentAction?: ActionType
  createdAt: number
}

export interface ProjectRequirements {
  coding: number
  design: number
  communication: number
}

export interface ProjectReward {
  gold: number
  reputation: number
  exp: number
}

export interface Project {
  id: string
  name: string
  client: string
  requirements: ProjectRequirements
  totalSlots: number
  slotsSpent: number
  reward: ProjectReward
  difficulty: number
  deadline: number
  assignedEmployees: string[]
  isCompleted: boolean
  isFailed: boolean
  createdAt: number
}

export interface Action {
  id: string
  type: ActionType
  name: string
  description: string
  icon: string
  availableSlots: TimeSlot[]
  cost?: Partial<Resources>
}

export interface ActionParams {
  projectId?: string
  employeeId?: string
  tradeGold?: number
  tradeType?: 'gold_to_reputation' | 'reputation_to_gold'
}

export interface SettlementResult {
  actionId: string
  actionName: string
  timeSlot: TimeSlot
  day: number
  rewards: Partial<Resources>
  costs: Partial<Resources>
  events: GameEvent[]
  projectProgress?: {
    projectId: string
    projectName: string
    progressBefore: number
    progressAfter: number
  }
  employeeTrained?: {
    employeeId: string
    employeeName: string
    abilityImproved: string
    amountImproved: number
  }
  recruited?: {
    employeeId: string
    employeeName: string
    rarity: number
  }
  messages: string[]
}

export interface DaySettlementResult {
  day: number
  actionResults: SettlementResult[]
  dailyIncome: Partial<Resources>
  dailyExpense: Partial<Resources>
  events: GameEvent[]
  projectDeadlines: {
    projectId: string
    projectName: string
    remainingDays: number
    isFailed: boolean
  }[]
  messages: string[]
}

export interface GameEvent {
  id: string
  title: string
  description: string
  rarity: EventRarity
  triggerCondition?: EventCondition
  options: EventOption[]
}

export interface EventCondition {
  type: 'day' | 'reputation' | 'gold' | 'employees' | 'projects_completed' | 'random'
  value: number
}

export interface EventOption {
  id: string
  text: string
  result: string
  reward?: Partial<Resources>
  penalty?: Partial<Resources>
  requireEmployee?: {
    minRarity?: number
    minAbility?: Partial<EmployeeAbilities>
  }
}

export interface StoryChapter {
  id: string
  title: string
  content: string
  unlockRequirement: {
    reputation?: number
    gold?: number
    employees?: number
    projects?: number
    day?: number
  }
  isUnlocked: boolean
  isRead: boolean
}

export interface AffinityEffect {
  character: string
  amount: number
}

export interface DialogOption {
  id: string
  text: string
  reward?: Partial<Resources>
  nextDialogId?: string
  action?: string
  affinityEffect?: AffinityEffect
  specialAction?: string
}

export interface DialogTrigger {
  type: 'reputation' | 'gold' | 'employees' | 'projects' | 'level' | 'day' | 'custom' | 'dayTimeSlot'
  value: number
  dayValue?: number
  timeSlotValue?: TimeSlot
  customCheck?: () => boolean
}

export interface Dialog {
  id: string
  title: string
  speaker?: string
  avatar?: string
  text: string
  options: DialogOption[]
  trigger: DialogTrigger
  isTriggered: boolean
  triggerTime?: number
}

export interface CharacterAffinity {
  tira: number
  rei: number
}

export interface GameState {
  day: number
  timeSlot: TimeSlot
  phase: GamePhase
  resources: Resources
  employees: Employee[]
  projects: Project[]
  availableProjects: Project[]
  completedProjectCount: number
  storyChapters: StoryChapter[]
  dialogs: Dialog[]
  currentDialogId: string | null
  currentEvent: GameEvent | null
  actionLog: SettlementResult[]
  dayHistory: DaySettlementResult[]
  lastSaveTime: number
  isFirstLaunch: boolean
  showIntroStory: boolean
  characterAffinity: CharacterAffinity
}

export interface GachaResult {
  employee: Employee
  isNew: boolean
}

export interface GameConfig {
  gachaCost: number
  gachaRates: Record<number, number>
  colorRates: Record<string, number>
  actionCosts: Record<ActionType, Partial<Resources>>
  basePowerRegenPerDay: number
  projectRefreshPerDay: number
  employeeSalaryPerDay: number
  trainingExpGain: number
  trainingAbilityGain: number
  exploreRewardRange: { gold: [number, number]; reputation: [number, number]; power: [number, number] }
  socialReputationRange: [number, number]
  tradeRate: number
}

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  morning: '早上',
  afternoon: '下午',
  evening: '晚上'
}

export const TIME_SLOT_ICONS: Record<TimeSlot, string> = {
  morning: '🌅',
  afternoon: '🌞',
  evening: '🌙'
}

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  idle: '空闲',
  working: '工作中',
  training: '培训中',
  exploring: '探索中',
  resting: '休息中',
  socializing: '社交中'
}

export const EMPLOYEE_STATUS_ICONS: Record<EmployeeStatus, string> = {
  idle: '✅',
  working: '🔧',
  training: '📚',
  exploring: '🔍',
  resting: '😴',
  socializing: '🤝'
}

export const RARITY_NAMES: Record<number, string> = {
  1: '普通',
  2: '优秀',
  3: '稀有',
  4: '史诗',
  5: '传说'
}

export const EVENT_RARITY_LABELS: Record<EventRarity, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说'
}

export const EVENT_RARITY_COLORS: Record<EventRarity, string> = {
  common: '#9E9E9E',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FF9800'
}
