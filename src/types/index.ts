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
  isWorking: boolean
  workProgress: number
  assignedProjectId?: string
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
  duration: number
  reward: ProjectReward
  difficulty: number
  unlockedAt: number
  isCompleted?: boolean
  assignedEmployees: string[]
  progress: number
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
  }
  isUnlocked: boolean
  isRead: boolean
}

export interface DialogOption {
  id: string
  text: string
  reward?: Partial<Resources>
  nextDialogId?: string
  action?: string
}

export interface DialogTrigger {
  type: 'reputation' | 'gold' | 'employees' | 'projects' | 'level' | 'custom'
  value: number
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

export interface Achievement {
  id: string
  title: string
  description: string
  condition: {
    type: 'gold' | 'reputation' | 'employees' | 'projects' | 'level'
    value: number
  }
  reward: {
    gold?: number
    power?: number
    reputation?: number
  }
  isUnlocked: boolean
  unlockedAt?: number
}

export interface GameState {
  resources: Resources
  employees: Employee[]
  projects: Project[]
  achievements: Achievement[]
  storyChapters: StoryChapter[]
  dialogs: Dialog[]
  currentDialogId: string | null
  lastSaveTime: number
  totalPlayTime: number
  offlineStartTime: number
  isFirstLaunch: boolean
  showIntroStory: boolean
}

export interface GachaResult {
  employee: Employee
  isNew: boolean
}

export interface GameConfig {
  gachaCost: number
  gachaRates: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  colorRates: {
    '金': number
    '紫': number
    '红': number
    '蓝': number
    '白': number
  }
  basePowerRegen: number
  powerRegenInterval: number
  offlineBenefitRate: number
  maxOfflineTime: number
}
