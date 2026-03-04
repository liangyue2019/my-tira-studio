# AI Studio 游戏项目 - 开发上下文文档

## 项目概述

**项目名称**: my-tira-studio  
**项目类型**: 模拟经营游戏（AI 工作室主题）  
**技术栈**: Taro 4.0.9 + React 18 + TypeScript + Zustand  
**目标平台**: H5、微信小程序、支付宝小程序等多端  
**开发状态**: 开发中

## 核心游戏机制

### 1. 资源系统
玩家管理四种核心资源：
- **gold（金币）**: 用于抽卡、购买道具
- **power（体力）**: 执行任务消耗
- **reputation（声望）**: 解锁剧情和成就
- **exp（经验）**: 提升等级

初始资源：gold: 1000, power: 10, reputation: 0, exp: 0

### 2. 员工系统
- **品质等级**: 传说 (5) > 史诗 (4) > 稀有 (3) > 优秀 (2) > 普通 (1)
- **颜色标识**: 金、紫、红、蓝、白
- **四维属性**: 
  - coding（编程能力）
  - design（设计能力）
  - communication（沟通能力）
  - efficiency（效率）
- **员工获取**: 通过抽卡（gacha）系统获得，消耗 100 金币/次
- **初始员工**: 白夜 tira（固定初始角色）

### 3. 项目系统
- 项目有难度等级（1-5），影响需求倍数和奖励
- 项目需要分配员工完成，根据员工能力总和与项目需求对比
- 完成项目获得金币、声望、经验奖励
- 初始生成 2 个简单难度项目

### 4. 剧情系统
- 剧情章节（StoryChapter）根据声望、金币、员工数量解锁
- 包含已读/未读状态管理

### 5. 成就系统
- 成就条件类型：gold、reputation、employees、projects、level
- 解锁成就获得资源奖励
- 自动检测成就解锁条件

### 6. 存档系统
- 使用 localStorage 保存游戏进度
- 自动保存间隔：30 秒
- 保存内容：资源、员工、项目、成就、剧情状态

## 项目结构

```
src/
├── constants/          # 常量配置
│   ├── achievements.ts # 成就定义
│   ├── config.ts       # 游戏配置（抽卡概率、资源生成等）
│   ├── projects.ts     # 项目模板
│   └── story.ts        # 剧情章节
├── pages/              # 页面组件
│   ├── achievement/    # 成就页面
│   ├── employee/       # 员工管理页面
│   ├── index/          # 主页面
│   ├── project/        # 项目管理页面
│   ├── shop/           # 商店/抽卡页面
│   └── story/          # 剧情页面
├── services/           # 服务层
│   └── gameLoop.ts     # 游戏循环逻辑
├── stores/             # 状态管理（Zustand）
│   ├── employee.ts     # 员工状态
│   ├── game.ts         # 游戏全局状态
│   ├── project.ts      # 项目状态
│   └── resource.ts     # 资源状态
├── types/              # TypeScript 类型定义
│   └── index.ts        # 所有类型定义
└── utils/              # 工具函数
    ├── format.ts       # 格式化函数
    ├── random.ts       # 随机数生成
    └── time.ts         # 时间处理
```

## 状态管理架构

### Store 依赖关系
```
useGameStore (游戏主状态)
├── useResourceStore (资源状态)
├── useEmployeeStore (员工状态)
└── useProjectStore (项目状态)
```

### 各 Store 职责

#### useGameStore
- 游戏初始化、加载、保存
- 剧情章节更新
- 成就解锁检测
- 首次启动标记

#### useResourceStore
- 资源增减操作
- 资源消费检查

#### useEmployeeStore
- 员工 CRUD
- 抽卡逻辑（gacha）
- 员工生成（按稀有度）
- 初始员工生成

#### useProjectStore
- 项目 CRUD
- 项目完成处理
- 可用项目生成
- 初始项目生成

## 关键配置数据

### 抽卡概率 (GAME_CONFIG)
```typescript
gachaRates: {
  5: 0.02,  // 传说
  4: 0.08,  // 史诗
  3: 0.20,  // 稀有
  2: 0.30,  // 优秀
  1: 0.40   // 普通
}
```

### 颜色概率
```typescript
colorRates: {
  '金': 0.05,
  '紫': 0.10,
  '红': 0.20,
  '蓝': 0.35,
  '白': 0.30
}
```

### 项目难度倍数
```typescript
PROJECT_DIFFICULTY: {
  1: 1.0,   // 简单
  2: 1.5,   // 普通
  3: 2.0,   // 困难
  4: 3.0,   // 专家
  5: 5.0    // 传奇
}
```

## 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 函数组件 + React Hooks
- Zustand 进行状态管理
- Less 样式预处理

### 命名约定
- 类型：PascalCase (interface, type)
- 变量/函数：camelCase
- 常量：UPPER_SNAKE_CASE
- 文件：kebab-case 或 camelCase

### 状态更新模式
所有 Zustand store 的 `set()` 调用需要使用 `as Partial<StateType>` 类型断言：

```typescript
// ✅ 正确
set({ key: value } as Partial<GameState>)

// ❌ 错误
set({ key: value })
```

### Store 接口定义
所有 store 方法必须在 interface 中声明：

```typescript
interface EmployeeState {
  employees: Employee[]
  addEmployee: (employee: Employee) => void
  generateEmployee: (rarity?: number) => Employee
  generateInitialEmployee: () => void  // 必须声明
}
```

## 常见问题与解决方案

### 1. Zustand 类型错误
**问题**: `set()` 调用时类型不匹配  
**解决**: 使用 `as Partial<StateType>` 断言

### 2. Store 方法未定义
**问题**: `Property 'xxx' does not exist on type 'State'`  
**解决**: 在 store 的 interface 中添加方法声明

### 3. 未使用变量警告
**问题**: TypeScript 报错未使用变量  
**解决**: 
- 删除未使用的导入/变量
- 对于必需但未使用的参数，使用前缀 `_`（如 `_rarity`）

### 4. GameState 缺少属性
**问题**: store 初始化对象缺少 GameState 定义的属性  
**解决**: 在 create<GameState>() 的初始对象中包含所有必需属性

## 开发命令

```bash
# H5 开发
pnpm dev:h5

# 微信小程序开发
pnpm dev:weapp

# H5 构建
pnpm build:h5

# 微信小程序构建
pnpm build:weapp
```

## 数据流示例

### 新项目流程
1. `useProjectStore.generateAvailableProject()` 生成项目
2. 项目添加到 `availableProjects` 数组
3. 玩家在项目页面查看并选择项目
4. 分配员工到项目（`assignEmployeeToProject`）
5. 游戏循环处理项目进度
6. 项目完成（`completeProject`）
7. 发放奖励（调用 `useResourceStore.addGold/Reputation/Exp`）

### 抽卡流程
1. 检查金币是否足够（100 金币）
2. `useResourceStore.spendGold(100)` 消耗金币
3. `useEmployeeStore.gacha()` 执行抽卡
4. 根据概率计算稀有度和颜色
5. 生成员工并添加到员工列表
6. 返回抽卡结果（包含是否为新角色）

## 待开发功能

- [ ] 离线收益计算
- [ ] 体力自动恢复（每 60 秒恢复 1 点）
- [ ] 员工升级系统
- [ ] 项目进度可视化
- [ ] 成就解锁通知
- [ ] 剧情阅读界面
- [ ] 设置界面（音效、存档管理等）

## 重要注意事项

1. **跨端兼容性**: 使用 Taro API，避免直接使用浏览器 API
2. **性能优化**: 大量员工/项目时注意渲染性能
3. **存档兼容性**: 修改数据结构时需考虑旧存档兼容
4. **概率验证**: 抽卡概率需要前端验证和后端校验（上线时）
5. **状态同步**: 多个 store 之间的状态变更需要保持一致性

## 最近修复（2026-03-04）

### 2026-03-04 修复
- ✅ 修复员工分配到工作的问题
  - 修改 `assignEmployeeToProject` 方法，确保同时更新员工的 `assignedProjectId` 和 `isWorking` 状态
  - 修改 `removeEmployeeFromProject` 方法，确保员工从项目移除时正确重置状态
  - 修改 `completeProject` 方法，确保项目完成时重置所有分配员工的状态
  - 添加 `useEmployeeStore` 导入到 project.ts 文件

### 2026-03-02 修复
已修复的类型错误：
- ✅ 移除未使用的 `Resources` 导入
- ✅ 添加缺失的 store 属性（employees, projects, achievements, storyChapters）
- ✅ 所有 `set()` 调用添加类型断言
- ✅ 修复方法调用名称（generateInitialEmployee）
- ✅ 更新 store 接口定义（添加 generateInitialProjects, generateInitialEmployee）
- ✅ 修复未使用参数警告（calculateColor 函数的 _rarity）
- ✅ 移除 project.ts 中未使用的 Employee 导入

所有 store 文件现在通过 TypeScript 类型检查，无编译错误。

## 联系与协作

当在新设备上打开此项目时：
1. 首先阅读此文档了解项目整体架构
2. 查看 `src/types/index.ts` 了解所有数据类型
3. 查看 `src/constants/config.ts` 了解游戏配置
4. 运行 `pnpm install` 安装依赖
5. 运行 `pnpm dev:h5` 启动开发服务器
6. 如有类型错误，运行 `npx tsc --noEmit` 检查
