# AI Studio 游戏项目 - 开发上下文文档

## 项目概述

**项目名称**: my-tira-studio\
**项目类型**: 模拟经营游戏（AI 工作室主题），回合制时间系统\
**技术栈**: Taro 4.0.9 + React 18 + TypeScript + Zustand\
**目标平台**: H5、微信小程序、支付宝小程序等多端\
**开发状态**: 开发中

## 核心游戏机制

游戏采用回合制时间系统，每天分为早上、下午、晚上三个时段。玩家在每个时段选择一个行动，晚上结束后进行日终结算，进入下一天。

### 1. 时间系统

- **时段（TimeSlot）**: `morning` / `afternoon` / `evening`
- **游戏阶段（GamePhase）**: `action_select` / `settlement` / `day_summary` / `event`
- **流程**: 选择行动 → 时段结算 → 推进时段 → 晚上后日终结算 → 进入新一天

### 2. 资源系统

玩家管理四种核心资源：

- **gold（金币）**: 用于招募、培训、交易
- **power（体力）**: 执行行动消耗
- **reputation（声望）**: 解锁剧情，通过社交/项目获得
- **exp（经验）**: 提升等级

初始资源：gold: 1000, power: 10, reputation: 0, exp: 0

### 3. 行动系统

每个时段玩家从可用行动中选择一个执行：

| 行动   | 可用时段  | 消耗       | 效果                |
| ---- | ----- | -------- | ----------------- |
| 推进项目 | 早/午/晚 | 体力5      | 项目进度+1时段          |
| 招募员工 | 早/午   | 金币100    | 抽卡获得1名员工          |
| 培训员工 | 下午    | 金币50+体力3 | 员工随机属性+3，经验+30    |
| 休息   | 早/午/晚 | 无        | 体力+5              |
| 探索   | 早上    | 体力3      | 随机金币/声望/体力，可能触发事件 |
| 交易   | 下午    | 金币/声望    | 金币↔声望兑换（10:1）     |
| 社交   | 晚上    | 体力2      | 声望+3\~8（含沟通加成）    |

### 4. 员工系统

- **品质等级**: 传说 (5) > 史诗 (4) > 稀有 (3) > 优秀 (2) > 普通 (1)
- **颜色标识**: 金、紫、红、蓝、白
- **四维属性**: coding / design / communication / efficiency
- **状态机**: idle / working / training / exploring / resting / socializing
- **员工获取**: 招募行动（抽卡），消耗 100 金币
- **初始员工**: 白夜 tira（固定，稀有度2）

### 5. 项目系统（时段制）

- 项目以\*\*时段（slots）\*\*为进度单位，而非秒数
- `totalSlots` = 完成所需的总时段数
- `slotsSpent` = 已投入的时段数
- `deadline` = 截止天数（超过则项目失败）
- 每时段推进量 = 员工效率属性/100 × 技能匹配修正（匹配=1.0，不匹配=0.3×）
- 每时段最大推进量：3（MAX_PROJECT_PROGRESS_PER_SLOT）
- 日终结算时刷新下一天的 2\~3 个可用项目
- 难度随天数递增

### 6. 事件系统

- **稀有度**: common / rare / epic / legendary
- **触发时机**: 探索行动（按稀有度加权选择）、日终结算（40%概率）
- 每个事件有多个选项，不同选项有不同奖励/惩罚
- 部分选项需要特定品质/属性的员工才能选择

### 7. 剧情系统

- 剧情章节根据声望、金币、员工数、天数解锁
- 包含已读/未读状态管理
- 解锁条件包含 day 字段（运营天数）

### 8. 对话系统

- 对话触发条件：employees / gold / reputation / projects / level / day / custom
- 每次只触发一个对话，不会同时弹出多个
- 支持链式对话（nextDialogId）

### 9. 存档系统

- 使用 localStorage 保存游戏进度（key: `ai_studio_game_save`）
- 自动保存间隔：30 秒
- 保存内容：天数/时段/阶段、资源、员工、项目、剧情状态、对话状态、行动日志

## 项目结构

```
src/
├── components/          # 组件
│   ├── DaySummaryView   # 日终报告组件
│   ├── DialogModal      # 对话弹窗组件
│   ├── EventModal       # 事件弹窗组件
│   └── SettlementView   # 时段结算组件
├── constants/           # 常量配置
│   ├── actions.ts       # 行动定义（7种行动及可用时段）
│   ├── config.ts        # 游戏配置（抽卡概率、行动消耗、技能匹配等）
│   ├── dialogs.ts       # 对话事件定义
│   ├── events.ts        # 随机事件定义（8个事件）
│   ├── projects.ts      # 项目模板（5种）+ 难度倍数 + 客户名
│   └── story.ts         # 剧情章节（6章）
├── pages/               # 页面组件
│   ├── index/           # 主页面（行动选择 + 时间指示器）
│   ├── employee/        # 员工管理页面
│   ├── project/         # 项目管理页面
│   ├── shop/            # 商店/抽卡页面
│   └── story/           # 剧情页面
├── stores/              # 状态管理（Zustand）
│   ├── employee.ts      # 员工状态（含状态机）
│   ├── event.ts         # 事件状态
│   ├── game.ts          # 游戏全局状态（时间/时段/存档/对话）
│   ├── project.ts       # 项目状态（时段制）
│   ├── resource.ts      # 资源状态
│   └── settlement.ts    # 结算逻辑（行动执行 + 日终结算）
├── types/               # TypeScript 类型定义
│   └── index.ts         # 所有类型定义 + 常量映射
└── utils/               # 工具函数
    ├── format.ts        # 数字格式化
    ├── random.ts        # 随机数/UUID
    └── time.ts          # 时间处理
```

## 状态管理架构

### Store 依赖关系

```
useGameStore (游戏主状态：时间/阶段/存档/对话)
├── useResourceStore (资源状态)
├── useEmployeeStore (员工状态 + 状态机)
├── useProjectStore (项目状态：时段制)
├── useEventStore (事件状态)
└── settlement.ts (结算逻辑，非 store，被 gameStore 调用)
```

### 各 Store 职责

#### useGameStore

- 时间管理：天数、时段、游戏阶段
- 行动选择与时段推进
- 日终结算触发
- 存档加载/保存/重置
- 对话触发与选项处理
- 剧情章节更新

#### useResourceStore

- 资源增减操作（addGold/spendGold 等）
- 批量资源操作（addResources/deductResources/canAfford）

#### useEmployeeStore

- 员工 CRUD
- 员工状态机管理（setEmployeeStatus/resetEmployeeStatus）
- 抽卡逻辑（gacha）
- 员工生成（按稀有度/颜色）
- 初始员工生成

#### useProjectStore

- 项目 CRUD（时段制：totalSlots/slotsSpent）
- 员工分配/移除（双向同步）
- 项目完成/失败处理
- 进度推进（addProgress）
- 可用项目生成与刷新
- 初始项目生成

#### useEventStore

- 事件触发判定（探索/日终）
- 事件选项解决（发放奖励/惩罚）
- 事件条件检查

#### settlement.ts（纯函数，非 Store）

- executeAction() — 执行行动并返回结算结果
- settleDay() — 日终结算（薪资、体力恢复、deadline检查、项目刷新）

## 关键配置数据

### 抽卡概率

```typescript
gachaRates: { 5: 0.02, 4: 0.08, 3: 0.20, 2: 0.30, 1: 0.40 }
```

### 颜色概率

```typescript
colorRates: { '金': 0.05, '紫': 0.10, '红': 0.20, '蓝': 0.35, '白': 0.30 }
```

### 项目难度倍数

```typescript
PROJECT_DIFFICULTY: { 1: 1.0, 2: 1.5, 3: 2.0, 4: 3.0, 5: 5.0 }
```

### 行动消耗

```typescript
actionCosts: {
  work_project: { power: 5 },
  recruit: { gold: 100 },
  train: { gold: 50, power: 3 },
  rest: {},
  explore: { power: 3 },
  trade: {},
  social: { power: 2 }
}
```

### 技能匹配

- 匹配阈值：60%（员工能力 >= 项目需求 × 0.6）
- 最低匹配项数：2/3
- 匹配成功效率：1.0×（即员工效率属性/100）
- 匹配失败效率：0.3×

## 数据流

### 每日流程

```
1. 新一天开始（早上）
2. 玩家看到可用行动列表（根据时段过滤）
3. 玩家选择行动 → selectAction()
4. executeAction() 执行行动 → 返回 SettlementResult
5. 显示结算界面 → 玩家点击"继续"
6. advanceTimeSlot() → 早上→下午→晚上
7. 晚上"继续" → settleDayEnd()
   - 支付员工日薪
   - 体力自然恢复
   - 检查项目 deadline（超时则失败）
   - 清理已完成/失败项目
   - 可能触发日终事件
   - 刷新可用项目
   - 重置所有员工状态为 idle
   - 自动保存
8. 显示日终报告 → 玩家点击"进入新一天"
9. day+1, timeSlot='morning', 回到步骤2
```

### 项目流程

```
1. 每天早上 refreshAvailableProjects() 生成 2~3 个可用项目
2. 玩家在项目页面点击"接受项目" → addProject()
3. 玩家在项目页面分配员工 → assignEmployee() + updateEmployee()
4. 玩家在主页选择"推进项目"行动 → settleWorkProject()
5. 计算总推进量 → addProgress()
6. 项目完成 → completeProject() 发放奖励 + 重置员工
7. 项目超时 → failProject() + 重置员工
```

### 事件流程

```
1. 探索/日终结算时 → tryTriggerExploreEvent() / tryTriggerDayEvent()
2. 检查事件条件 → checkEventCondition()
3. 按稀有度加权随机选择事件
4. 设置 currentEvent → phase='event'
5. EventModal 显示事件和选项
6. 玩家选择 → resolveEvent() → 发放奖励/惩罚
7. 事件标记为已触发
```

## 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 函数组件 + React Hooks
- Zustand 进行状态管理
- SCSS 样式预处理

### 命名约定

- 类型：PascalCase (interface, type)
- 变量/函数：camelCase
- 常量：UPPER\_SNAKE\_CASE
- 文件：kebab-case 或 camelCase

### Store 接口定义

所有 store 方法必须在 interface 中声明。

## 开发命令

```bash
# H5 开发（推荐使用 npx）
npx taro build --type h5 --watch

# H5 开发（pnpm）
pnpm dev:h5

# 微信小程序开发
pnpm dev:weapp

# H5 构建
pnpm build:h5

# 微信小程序构建
pnpm build:weapp
```

## 重要注意事项

1. **跨端兼容性**: 使用 Taro API（如 showModal），避免直接使用浏览器 API（localStorage 除外）
2. **存档兼容性**: 修改数据结构时需考虑旧存档兼容，必要时在 loadGame 中做迁移
3. **员工状态同步**: 分配/移除员工时需同时更新 projectStore 和 employeeStore
4. **时段制设计**: 项目进度以时段为单位，不再使用秒数/实时循环
5. **结算逻辑集中**: 所有行动执行和日终结算逻辑在 settlement.ts 中

## 待开发功能

- [ ] 员工升级系统（level/exp 已定义，培训增加经验，但无升级逻辑）
- [ ] 培训行动选择具体员工（当前自动选择第一个空闲员工）
- [ ] 推进项目行动选择具体项目（当前自动选择第一个活跃项目）
- [ ] 交易行动 UI（当前只有基础逻辑，无交互界面）
- [ ] 项目分配员工优化（从项目页分配后需同步回主页显示）
- [ ] 设置界面（音效、存档管理等）

