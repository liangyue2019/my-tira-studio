# 常量配置说明文档

本文档详细说明 `src/constants` 文件夹下的所有配置变量、属性名及其用途。

> **注意**：`RARITY_NAMES`、`EMPLOYEE_STATUS_ICONS` 等映射常量定义在 `src/types/index.ts` 中，不在 constants/ 目录下。

## 目录

- [1. actions.ts](#1-actionsts)
- [2. config.ts](#2-configts)
- [3. dialogs.ts](#3-dialogsts)
- [4. events.ts](#4-eventsts)
- [5. projects.ts](#5-projectsts)
- [6. story.ts](#6-storyts)

## 1. actions.ts

### 导出变量

| 变量名 | 类型 | 描述 |
|-------|------|------|
| `ACTIONS` | `Action[]` | 7 种行动定义列表 |
| `getActionsForSlot(slot)` | `function` | 根据时段返回可用行动 |

### Action 类型属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `id` | `string` | 行动唯一标识符 |
| `type` | `ActionType` | 行动类型（同 id） |
| `name` | `string` | 行动显示名称 |
| `description` | `string` | 行动描述 |
| `icon` | `string` | 行动图标（emoji） |
| `availableSlots` | `TimeSlot[]` | 可用时段列表 |
| `cost` | `Partial<Resources>` | 行动消耗 |

### 行动列表

| id | 名称 | 可用时段 | 消耗 |
|----|------|----------|------|
| `work_project` | 推进项目 | 早/午/晚 | 体力5 |
| `recruit` | 招募员工 | 早/午 | 金币100 |
| `train` | 培训员工 | 下午 | 金币50+体力3 |
| `rest` | 休息 | 早/午/晚 | 无 |
| `explore` | 探索 | 早上 | 体力3 |
| `trade` | 交易 | 下午 | 无 |
| `social` | 社交 | 晚上 | 体力2 |

## 2. config.ts

### 导出变量

| 变量名 | 类型 | 描述 |
|-------|------|------|
| `GAME_CONFIG` | `GameConfig` | 游戏核心配置 |
| `INITIAL_RESOURCES` | `object` | 初始资源配置 |
| `COLOR_PREFIXES` | `object` | 员工颜色前缀映射 |
| `BASE_SUFFIX` | `string` | 员工名字基础后缀 |
| `BASE_ABILITIES` | `object` | 不同稀有度的基础能力范围 |
| `LEVEL_UP_EXP` | `object` | 升级所需经验值 |
| `PROJECT_DIFFICULTY` | `object` | 项目难度配置 |
| `SKILL_MATCH_THRESHOLD` | `number` | 技能匹配阈值（0.6） |
| `SKILL_MATCH_MIN_COUNT` | `number` | 最低匹配项数（2） |
| `SKILL_MISMATCH_PENALTY` | `number` | 匹配失败效率惩罚（0.3） |
| `MAX_PROJECT_PROGRESS_PER_SLOT` | `number` | 每时段最大项目推进量（3） |
| `STORAGE_KEY` | `string` | 本地存储键名 |
| `SAVE_INTERVAL` | `number` | 自动保存间隔（30000ms = 30秒） |
| `ABILITY_NAMES` | `Record<string, string>` | 能力名称映射 |

### GAME_CONFIG 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `gachaCost` | `number` | 抽卡消耗（100 金币） |
| `gachaRates` | `object` | 抽卡概率（稀有度 -> 概率） |
| `colorRates` | `object` | 颜色概率（颜色 -> 概率） |
| `actionCosts` | `object` | 各行动消耗（key=ActionType, value=Partial<Resources>） |
| `basePowerRegenPerDay` | `number` | 每日基础体力恢复量（5） |
| `projectRefreshPerDay` | `number` | 每日刷新可用项目数（3） |
| `employeeSalaryPerDay` | `number` | 员工日薪（20 金币） |
| `trainingExpGain` | `number` | 培训获得经验值（30） |
| `trainingAbilityGain` | `number` | 培训属性提升量（3） |
| `exploreRewardRange` | `object` | 探索奖励范围（gold/reputation/power 各有 min/max） |
| `socialReputationRange` | `[number, number]` | 社交声望范围（[3, 8]） |
| `tradeRate` | `number` | 交易汇率（10 金币 = 1 声望） |

### INITIAL_RESOURCES 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `gold` | `number` | 初始金币（1000） |
| `power` | `number` | 初始体力（10） |
| `reputation` | `number` | 初始声望（0） |
| `exp` | `number` | 初始经验（0） |

### COLOR_PREFIXES 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `金` | `string` | 金色员工前缀（"金夜"） |
| `紫` | `string` | 紫色员工前缀（"紫夜"） |
| `红` | `string` | 红色员工前缀（"红夜"） |
| `蓝` | `string` | 蓝色员工前缀（"蓝夜"） |
| `白` | `string` | 白色员工前缀（"白夜"） |

### BASE_ABILITIES 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `1` | `object` | 普通稀有度能力范围（5~10） |
| `1.min` | `number` | 普通稀有度最小能力值 |
| `1.max` | `number` | 普通稀有度最大能力值 |
| `2` | `object` | 优秀稀有度能力范围（10~20） |
| `3` | `object` | 稀有稀有度能力范围（20~35） |
| `4` | `object` | 史诗稀有度能力范围（35~50） |
| `5` | `object` | 传说稀有度能力范围（50~70） |

### LEVEL_UP_EXP 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `1` | `number` | 1级升2级所需经验（100） |
| `2` | `number` | 2级升3级所需经验（200） |
| `3` | `number` | 3级升4级所需经验（350） |
| `4` | `number` | 4级升5级所需经验（500） |
| `5` | `number` | 5级升6级所需经验（750） |

### PROJECT_DIFFICULTY 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `1` | `object` | 简单（name:"简单", multiplier:1.0） |
| `2` | `object` | 普通（name:"普通", multiplier:1.5） |
| `3` | `object` | 困难（name:"困难", multiplier:2.0） |
| `4` | `object` | 专家（name:"专家", multiplier:3.0） |
| `5` | `object` | 传奇（name:"传奇", multiplier:5.0） |

### ABILITY_NAMES 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `coding` | `string` | 编程能力名称（"编程"） |
| `design` | `string` | 设计能力名称（"设计"） |
| `communication` | `string` | 沟通能力名称（"沟通"） |
| `efficiency` | `string` | 效率能力名称（"效率"） |

## 3. dialogs.ts

### 导出变量

| 变量名 | 类型 | 描述 |
|-------|------|------|
| `DIALOGS` | `Dialog[]` | 对话列表，包含所有游戏对话（7个） |

### Dialog 类型属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `id` | `string` | 对话唯一标识符 |
| `title` | `string` | 对话标题 |
| `speaker` | `string` | 说话者 |
| `avatar` | `string` (可选) | 说话者头像路径 |
| `text` | `string` | 对话内容 |
| `options` | `DialogOption[]` | 对话选项 |
| `trigger` | `DialogTrigger` | 触发条件 |
| `trigger.type` | `string` | 触发类型（reputation/gold/employees/projects/level/day/custom） |
| `trigger.value` | `number` | 触发值 |
| `trigger.customCheck` | `function` (可选) | 自定义触发检查函数 |
| `isTriggered` | `boolean` | 是否已触发 |
| `triggerTime` | `number` (可选) | 触发时间戳 |

### DialogOption 类型属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `id` | `string` | 选项唯一标识符 |
| `text` | `string` | 选项文本 |
| `reward` | `object` (可选) | 选项奖励 |
| `reward.gold` | `number` (可选) | 金币奖励 |
| `reward.power` | `number` (可选) | 体力奖励 |
| `reward.reputation` | `number` (可选) | 声望奖励 |
| `reward.exp` | `number` (可选) | 经验奖励 |
| `nextDialogId` | `string` (可选) | 下一个对话ID（链式对话） |
| `action` | `string` (可选) | 执行动作 |

### 对话列表

1. **intro** - 游戏欢迎对话（custom 触发，首次启动）
2. **first_employee** - 招募第一个员工时（employees >= 1）
3. **first_project_completed** - 完成第一个项目时（projects >= 1）
4. **gold_10000** - 金币达到10000时（gold >= 10000）
5. **reputation_100** - 声望达到100时（reputation >= 100）
6. **employees_5** - 拥有5个员工时（employees >= 5）
7. **day_7** - 一周纪念（day >= 7）

## 4. events.ts

### 导出变量

| 变量名 | 类型 | 描述 |
|-------|------|------|
| `GAME_EVENTS` | `GameEvent[]` | 随机事件列表（8个） |
| `getEventsByRarity(rarity)` | `function` | 按稀有度筛选事件 |
| `getTriggerableEvents()` | `function` | 获取可触发事件列表 |

### GameEvent 类型属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `id` | `string` | 事件唯一标识符 |
| `title` | `string` | 事件标题 |
| `description` | `string` | 事件描述 |
| `rarity` | `EventRarity` | 稀有度（common/rare/epic/legendary） |
| `triggerCondition` | `EventCondition` (可选) | 触发条件 |
| `triggerCondition.type` | `string` | 条件类型（day/reputation/gold/employees/projects_completed/random） |
| `triggerCondition.value` | `number` | 条件值 |
| `options` | `EventOption[]` | 事件选项 |

### EventOption 类型属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `id` | `string` | 选项唯一标识符 |
| `text` | `string` | 选项文本 |
| `result` | `string` | 选项结果描述 |
| `reward` | `Partial<Resources>` (可选) | 选项奖励 |
| `penalty` | `Partial<Resources>` (可选) | 选项惩罚 |
| `requireEmployee` | `object` (可选) | 员工条件限制 |
| `requireEmployee.minRarity` | `number` (可选) | 最低稀有度要求 |
| `requireEmployee.minAbility` | `Partial<EmployeeAbilities>` (可选) | 最低能力要求 |

### 事件列表

| id | 标题 | 稀有度 | 触发条件 | 选项数 |
|----|------|--------|----------|--------|
| `evt_lucky_find` | 意外发现 | common | random:20% | 2 |
| `evt_client_visit` | 客户来访 | rare | random:10% | 2（1个需3星员工） |
| `evt_tech_breakthrough` | 技术突破 | epic | random:5% | 2 |
| `evt_investor` | 投资人青睐 | legendary | random:2% | 2 |
| `evt_employee_conflict` | 员工冲突 | common | random:15% | 2（1个有惩罚） |
| `evt_market_boom` | 市场繁荣 | rare | random:8% | 2 |
| `evt_old_friend` | 老友重逢 | rare | employees>=3 | 2 |
| `evt_power_outage` | 停电事故 | common | random:10% | 2（均有惩罚） |

## 5. projects.ts

### 导出变量

| 变量名 | 类型 | 描述 |
|-------|------|------|
| `PROJECT_TEMPLATES` | `object[]` | 项目模板列表（5种） |
| `PROJECT_DIFFICULTY` | `object` | 项目难度配置（与 config.ts 中重复导出） |
| `CLIENT_NAMES` | `string[]` | 客户名称列表（10个） |

### PROJECT_TEMPLATES 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `name` | `string` | 项目名称 |
| `client` | `string` | 客户名称 |
| `baseRequirements` | `object` | 基础技能要求 |
| `baseRequirements.coding` | `number` | 编程技能要求 |
| `baseRequirements.design` | `number` | 设计技能要求 |
| `baseRequirements.communication` | `number` | 沟通技能要求 |
| `baseSlots` | `number` | 完成所需基础时段数 |
| `baseDeadline` | `number` | 基础截止天数 |
| `baseReward` | `object` | 基础奖励 |
| `baseReward.gold` | `number` | 金币奖励 |
| `baseReward.reputation` | `number` | 声望奖励 |
| `baseReward.exp` | `number` | 经验奖励 |

### 项目模板列表

| 名称 | 编程/设计/沟通要求 | 时段数 | 截止天数 | 金币/声望/经验奖励 |
|------|-------------------|--------|----------|-------------------|
| 企业官网 | 20/15/10 | 3 | 5 | 80/3/8 |
| 电商平台 | 50/30/20 | 5 | 8 | 200/8/20 |
| 移动应用 | 80/40/30 | 8 | 12 | 400/15/40 |
| AI 系统 | 150/60/50 | 12 | 18 | 800/30/80 |
| 云平台架构 | 300/100/100 | 18 | 25 | 1500/50/150 |

### CLIENT_NAMES

包含10个客户名称，用于随机生成项目时使用：某创业公司、某零售企业、某科技公司、某金融机构、某教育机构、某医疗机构、某制造企业、某研究机构、某互联网巨头、某政府部门。

## 6. story.ts

### 导出变量

| 变量名 | 类型 | 描述 |
|-------|------|------|
| `STORY_CHAPTERS` | `StoryChapter[]` | 剧情章节列表（6章） |

### StoryChapter 类型属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `id` | `string` | 章节唯一标识符 |
| `title` | `string` | 章节标题 |
| `content` | `string` | 章节内容 |
| `unlockRequirement` | `object` | 解锁条件 |
| `unlockRequirement.reputation` | `number` (可选) | 声望要求 |
| `unlockRequirement.gold` | `number` (可选) | 金币要求 |
| `unlockRequirement.employees` | `number` (可选) | 员工数量要求 |
| `unlockRequirement.projects` | `number` (可选) | 项目完成要求 |
| `unlockRequirement.day` | `number` (可选) | 运营天数要求 |
| `isUnlocked` | `boolean` | 是否已解锁 |
| `isRead` | `boolean` | 是否已阅读 |

### 剧情章节列表

| 章节 | 标题 | 解锁条件 |
|------|------|----------|
| chapter_1 | 第一章：新的开始 | day: 1（默认解锁） |
| chapter_2 | 第二章：第一个员工 | employees: 1 |
| chapter_3 | 第三章：首个项目 | projects: 1 |
| chapter_4 | 第四章：团队的成长 | reputation: 100, employees: 5 |
| chapter_5 | 第五章：挑战与机遇 | reputation: 500, gold: 5000 |
| chapter_6 | 第六章：行业新星 | day: 30, reputation: 100 |

## 总结

本文档详细说明了 `src/constants` 文件夹下所有 6 个配置文件的变量和属性，便于开发者理解和修改游戏配置。如需调整游戏参数，可直接修改对应文件中的配置值。
