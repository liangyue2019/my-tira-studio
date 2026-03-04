# 常量配置说明文档

本文档详细说明 `src/constants` 文件夹下的所有配置变量、属性名及其用途。

## 目录

- [1. achievements.ts](#1-achievementsts)
- [2. config.ts](#2-configts)
- [3. dialogs.ts](#3-dialogsts)
- [4. projects.ts](#4-projectsts)
- [5. story.ts](#5-storyts)

## 1. achievements.ts

### 导出变量

| 变量名 | 类型 | 描述 |
|-------|------|------|
| `ACHIEVEMENTS` | `Achievement[]` | 成就列表，包含所有游戏成就 |

### Achievement 类型属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `id` | `string` | 成就唯一标识符 |
| `title` | `string` | 成就标题 |
| `description` | `string` | 成就描述 |
| `condition` | `object` | 解锁条件 |
| `condition.type` | `string` | 条件类型（employees、reputation、gold、projects） |
| `condition.value` | `number` | 条件值 |
| `reward` | `object` | 解锁奖励 |
| `reward.gold` | `number` (可选) | 金币奖励 |
| `reward.power` | `number` (可选) | 电力奖励 |
| `reward.reputation` | `number` (可选) | 声望奖励 |
| `isUnlocked` | `boolean` | 是否已解锁 |

### 成就列表

1. **初出茅庐** - 招募第一个智能体员工
2. **团队初建** - 拥有 5 名员工
3. **声名鹊起** - 声誉达到 100
4. **财源广进** - 累计获得 10000 金币
5. **项目达人** - 完成 10 个项目
6. **传奇招募** - 招募到传说品质的员工

## 2. config.ts

### 导出变量

| 变量名 | 类型 | 描述 |
|-------|------|------|
| `GAME_CONFIG` | `GameConfig` | 游戏核心配置 |
| `INITIAL_RESOURCES` | `object` | 初始资源配置 |
| `COLOR_PREFIXES` | `object` | 员工颜色前缀映射 |
| `BASE_SUFFIX` | `string` | 员工名字基础后缀 |
| `RARITY_NAMES` | `object` | 稀有度名称映射 |
| `ABILITY_NAMES` | `object` | 能力名称映射 |
| `BASE_ABILITIES` | `object` | 不同稀有度的基础能力范围 |
| `LEVEL_UP_EXP` | `object` | 升级所需经验值 |
| `PROJECT_DIFFICULTY` | `object` | 项目难度配置 |
| `STORAGE_KEY` | `string` | 本地存储键名 |
| `SAVE_INTERVAL` | `number` | 自动保存间隔（毫秒） |

### GAME_CONFIG 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `gachaCost` | `number` | 抽卡消耗（电力代币） |
| `gachaRates` | `object` | 抽卡概率（稀有度 -> 概率） |
| `colorRates` | `object` | 颜色概率（颜色 -> 概率） |
| `basePowerRegen` | `number` | 基础电力恢复量 |
| `powerRegenInterval` | `number` | 电力恢复间隔（秒） |
| `offlineBenefitRate` | `number` | 离线收益倍率 |
| `maxOfflineTime` | `number` | 最大离线时间（秒） |

### INITIAL_RESOURCES 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `gold` | `number` | 初始金币 |
| `power` | `number` | 初始电力 |
| `reputation` | `number` | 初始声望 |
| `exp` | `number` | 初始经验 |

### COLOR_PREFIXES 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `金` | `string` | 金色员工前缀 |
| `紫` | `string` | 紫色员工前缀 |
| `红` | `string` | 红色员工前缀 |
| `蓝` | `string` | 蓝色员工前缀 |
| `白` | `string` | 白色员工前缀 |

### RARITY_NAMES 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `1` | `string` | 普通稀有度名称 |
| `2` | `string` | 优秀稀有度名称 |
| `3` | `string` | 稀有稀有度名称 |
| `4` | `string` | 史诗稀有度名称 |
| `5` | `string` | 传说稀有度名称 |

### ABILITY_NAMES 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `coding` | `string` | 编程能力名称 |
| `design` | `string` | 设计能力名称 |
| `communication` | `string` | 沟通能力名称 |
| `efficiency` | `string` | 效率能力名称 |

### BASE_ABILITIES 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `1` | `object` | 普通稀有度能力范围 |
| `1.min` | `number` | 普通稀有度最小能力值 |
| `1.max` | `number` | 普通稀有度最大能力值 |
| `2` | `object` | 优秀稀有度能力范围 |
| `3` | `object` | 稀有稀有度能力范围 |
| `4` | `object` | 史诗稀有度能力范围 |
| `5` | `object` | 传说稀有度能力范围 |

### LEVEL_UP_EXP 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `1` | `number` | 1级升2级所需经验 |
| `2` | `number` | 2级升3级所需经验 |
| `3` | `number` | 3级升4级所需经验 |
| `4` | `number` | 4级升5级所需经验 |
| `5` | `number` | 5级升6级所需经验 |

### PROJECT_DIFFICULTY 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `1` | `object` | 简单难度配置 |
| `1.name` | `string` | 简单难度名称 |
| `1.multiplier` | `number` | 简单难度倍率 |
| `2` | `object` | 普通难度配置 |
| `3` | `object` | 困难难度配置 |
| `4` | `object` | 专家难度配置 |
| `5` | `object` | 传奇难度配置 |

## 3. dialogs.ts

### 导出变量

| 变量名 | 类型 | 描述 |
|-------|------|------|
| `DIALOGS` | `Dialog[]` | 对话框列表，包含所有游戏对话框 |

### Dialog 类型属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `id` | `string` | 对话框唯一标识符 |
| `title` | `string` | 对话框标题 |
| `speaker` | `string` | 说话者 |
| `text` | `string` | 对话框内容 |
| `options` | `DialogOption[]` | 对话框选项 |
| `trigger` | `object` | 触发条件 |
| `trigger.type` | `string` | 触发类型 |
| `trigger.value` | `number` | 触发值 |
| `isTriggered` | `boolean` | 是否已触发 |

### DialogOption 类型属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `id` | `string` | 选项唯一标识符 |
| `text` | `string` | 选项文本 |
| `reward` | `object` (可选) | 选项奖励 |
| `reward.gold` | `number` (可选) | 金币奖励 |
| `reward.power` | `number` (可选) | 电力奖励 |
| `reward.reputation` | `number` (可选) | 声望奖励 |
| `reward.exp` | `number` (可选) | 经验奖励 |
| `nextDialogId` | `string` (可选) | 下一个对话框ID |
| `action` | `string` (可选) | 执行动作 |

### 对话框列表

1. **intro** - 游戏欢迎对话框
2. **first_employee** - 招募第一个员工时的对话框
3. **first_project_completed** - 完成第一个项目时的对话框
4. **gold_10000** - 金币达到10000时的对话框
5. **reputation_100** - 声望达到100时的对话框
6. **employees_5** - 拥有5个员工时的对话框

## 4. projects.ts

### 导出变量

| 变量名 | 类型 | 描述 |
|-------|------|------|
| `PROJECT_TEMPLATES` | `object[]` | 项目模板列表 |
| `PROJECT_DIFFICULTY` | `object` | 项目难度配置 |
| `CLIENT_NAMES` | `string[]` | 客户名称列表 |

### PROJECT_TEMPLATES 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `name` | `string` | 项目名称 |
| `client` | `string` | 客户名称 |
| `baseRequirements` | `object` | 基础技能要求 |
| `baseRequirements.coding` | `number` | 编程技能要求 |
| `baseRequirements.design` | `number` | 设计技能要求 |
| `baseRequirements.communication` | `number` | 沟通技能要求 |
| `baseDuration` | `number` | 基础持续时间（秒） |
| `baseReward` | `object` | 基础奖励 |
| `baseReward.gold` | `number` | 金币奖励 |
| `baseReward.reputation` | `number` | 声望奖励 |
| `baseReward.exp` | `number` | 经验奖励 |

### 项目模板列表

1. **企业官网** - 基础项目，要求较低
2. **电商平台** - 进阶级项目，要求中等
3. **移动应用** - 高级项目，要求较高
4. **AI 系统** - 专家级项目，要求很高
5. **云平台架构** - 传奇级项目，要求极高

### PROJECT_DIFFICULTY 属性

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `1` | `object` | 简单难度配置 |
| `1.multiplier` | `number` | 简单难度倍率 |
| `2` | `object` | 普通难度配置 |
| `3` | `object` | 困难难度配置 |
| `4` | `object` | 专家难度配置 |
| `5` | `object` | 传奇难度配置 |

### CLIENT_NAMES

包含10个客户名称，用于随机生成项目时使用。

## 5. story.ts

### 导出变量

| 变量名 | 类型 | 描述 |
|-------|------|------|
| `STORY_CHAPTERS` | `StoryChapter[]` | 剧情章节列表 |

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
| `isUnlocked` | `boolean` | 是否已解锁 |
| `isRead` | `boolean` | 是否已阅读 |

### 剧情章节列表

1. **第一章：新的开始** - 初始章节，无需解锁条件
2. **第二章：第一个员工** - 招募1名员工后解锁
3. **第三章：首个项目** - 完成1个项目后解锁
4. **第四章：团队的成长** - 声望100+5名员工后解锁
5. **第五章：挑战与机遇** - 声望500+5000金币后解锁

## 总结

本文档详细说明了 `src/constants` 文件夹下所有配置文件的变量和属性，便于开发者理解和修改游戏配置。如需调整游戏参数，可直接修改对应文件中的配置值。