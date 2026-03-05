/**
 * 资源接口 - 游戏核心资源
 */
export interface Resources {
  gold: number         // 金币 - 用于抽卡、购买道具
  power: number        // 体力 - 执行任务消耗
  reputation: number   // 声望 - 解锁剧情和成就
  exp: number          // 经验 - 提升等级
}

/**
 * 员工颜色类型 - 对应不同稀有度的视觉标识
 */
export type EmployeeColor = '蓝' | '金' | '红' | '紫' | '白'

/**
 * 员工能力接口 - 员工的四维属性
 */
export interface EmployeeAbilities {
  coding: number          // 编程能力
  design: number          // 设计能力
  communication: number   // 沟通能力
  efficiency: number      // 效率
}

/**
 * 员工接口 - 员工信息
 */
export interface Employee {
  id: string                  // 员工唯一ID
  name: string                // 员工姓名
  color: EmployeeColor        // 员工颜色
  rarity: number              // 稀有度等级 (1-5)
  abilities: EmployeeAbilities // 员工能力
  level: number               // 员工等级
  exp: number                 // 员工经验
  isWorking: boolean          // 是否正在工作
  workProgress: number        // 工作进度
  assignedProjectId?: string  // 分配的项目ID
  createdAt: number           // 创建时间戳
}

/**
 * 项目需求接口 - 项目对能力的要求
 */
export interface ProjectRequirements {
  coding: number          // 编程需求
  design: number          // 设计需求
  communication: number   // 沟通需求
}

/**
 * 项目奖励接口 - 完成项目获得的奖励
 */
export interface ProjectReward {
  gold: number         // 金币奖励
  reputation: number   // 声望奖励
  exp: number          // 经验奖励
}

/**
 * 项目接口 - 项目信息
 */
export interface Project {
  id: string                   // 项目唯一ID
  name: string                 // 项目名称
  client: string               // 客户名称
  requirements: ProjectRequirements // 项目需求
  duration: number             // 项目持续时间
  reward: ProjectReward        // 项目奖励
  difficulty: number           // 项目难度 (1-5)
  unlockedAt: number           // 解锁时间戳
  isCompleted?: boolean        // 是否完成
  assignedEmployees: string[]  // 分配的员工ID列表
  progress: number             // 项目进度
}

/**
 * 剧情章节接口 - 游戏剧情内容
 */
export interface StoryChapter {
  id: string                 // 章节ID
  title: string              // 章节标题
  content: string            // 章节内容
  unlockRequirement: {
    reputation?: number      // 声望要求
    gold?: number            // 金币要求
    employees?: number       // 员工数量要求
    projects?: number        // 项目完成要求
  }
  isUnlocked: boolean        // 是否已解锁
  isRead: boolean            // 是否已阅读
}

/**
 * 对话选项接口 - 对话的选择项
 */
export interface DialogOption {
  id: string                  // 选项ID
  text: string                // 选项文本
  reward?: Partial<Resources>  // 选择该选项的奖励
  nextDialogId?: string       // 下一个对话ID
  action?: string             // 执行的动作
}

/**
 * 对话触发条件接口 - 触发对话的条件
 */
export interface DialogTrigger {
  type: 'reputation' | 'gold' | 'employees' | 'projects' | 'level' | 'custom' // 触发类型
  value: number                // 触发值
  customCheck?: () => boolean  // 自定义检查函数
}

/**
 * 对话接口 - 游戏对话内容
 */
export interface Dialog {
  id: string            // 对话ID
  title: string         // 对话标题
  speaker?: string      // 发言者
  avatar?: string       // 发言者头像
  text: string          // 对话文本
  options: DialogOption[] // 对话选项
  trigger: DialogTrigger // 触发条件
  isTriggered: boolean  // 是否已触发
  triggerTime?: number  // 触发时间戳
}

/**
 * 成就接口 - 游戏成就
 */
export interface Achievement {
  id: string                 // 成就ID
  title: string              // 成就标题
  description: string        // 成就描述
  condition: {
    type: 'gold' | 'reputation' | 'employees' | 'projects' | 'level' // 条件类型
    value: number            // 条件值
  }
  reward: {
    gold?: number            // 金币奖励
    power?: number           // 体力奖励
    reputation?: number      // 声望奖励
  }
  isUnlocked: boolean        // 是否已解锁
  unlockedAt?: number        // 解锁时间戳
}

/**
 * 游戏状态接口 - 游戏全局状态
 */
export interface GameState {
  resources: Resources           // 游戏资源
  employees: Employee[]          // 员工列表
  projects: Project[]            // 项目列表
  achievements: Achievement[]    // 成就列表
  storyChapters: StoryChapter[]  // 剧情章节列表
  dialogs: Dialog[]              // 对话列表
  currentDialogId: string | null // 当前对话ID
  lastSaveTime: number           // 上次保存时间
  totalPlayTime: number          // 总游戏时间
  offlineStartTime: number       // 离线开始时间
  isFirstLaunch: boolean         // 是否首次启动
  showIntroStory: boolean        // 是否显示介绍剧情
}

/**
 * 抽卡结果接口 - 抽卡返回结果
 */
export interface GachaResult {
  employee: Employee  // 获得的员工
  isNew: boolean      // 是否为新角色
}

/**
 * 游戏配置接口 - 游戏全局配置
 */
export interface GameConfig {
  gachaCost: number             // 抽卡消耗
  gachaRates: {
    5: number                   // 传说级概率
    4: number                   // 史诗级概率
    3: number                   // 稀有级概率
    2: number                   // 优秀级概率
    1: number                   // 普通级概率
  }
  colorRates: {
    '金': number                // 金色概率
    '紫': number                // 紫色概率
    '红': number                // 红色概率
    '蓝': number                // 蓝色概率
    '白': number                // 白色概率
  }
  basePowerRegen: number         // 基础体力恢复量
  powerRegenInterval: number     // 体力恢复间隔
  offlineBenefitRate: number     // 离线收益倍率
  maxOfflineTime: number         // 最大离线时间
}
