# AI Studio - 项目参考索引

本文档为项目参考目录，详细说明请查阅对应的参考文档。

## 参考指引

| 需要了解的内容         | 参考位置                          |
| ---------------- | ----------------------------- |
| 项目概述与技术栈        | README.md → 项目概述             |
| 核心游戏机制（时间/资源/行动/员工/项目/事件/剧情/对话/存档） | README.md → 核心游戏机制 |
| 项目目录结构          | README.md → 项目结构             |
| 状态管理架构与各 Store 职责 | README.md → 状态管理架构          |
| 关键配置数据（抽卡概率/颜色概率/难度倍数/行动消耗/技能匹配） | README.md → 关键配置数据 |
| 常量配置详细说明（各常量文件的变量、属性、类型及用途） | [SRC_CONSTANTS_DOC.md](./SRC_CONSTANTS_DOC.md) |
| 各页面 UI 布局说明 | 各页面目录下的 `page.md`（如 `src/pages/index/page.md`） |
| 数据流（每日流程/项目流程/事件流程） | README.md → 数据流    |
| 开发规范与命名约定       | README.md → 开发规范             |
| 开发命令            | README.md → 开发命令             |
| 重要注意事项          | README.md → 重要注意事项           |
| 待开发功能           | README.md → 待开发功能            |
| 剧情脚本（3天 Galgame 风格对话剧情） | [docs/story_script_3days.md](./docs/story_script_3days.md) |
| E2E 剧情自动化测试（Playwright 浏览器自动化，从剧情开始到结束） | [`.trae/skills/e2e-story-test/SKILL.md`](./.trae/skills/e2e-story-test/SKILL.md) |

## 快速备忘

- **技术栈**: Taro 4.0.9 + React 18 + TypeScript + Zustand
- **时间系统**: 回合制，每天 3 时段（早上/下午/晚上），每时段选 1 行动
- **存档 key**: `ai_studio_game_save`（localStorage）
- **结算逻辑**: `src/stores/settlement.ts`（纯函数，非 Store）
- **员工状态同步**: 分配/移除员工时需同时更新 projectStore 和 employeeStore
- **E2E 测试**: `npm run test:e2e:story`（Playwright，通过 `window.__stores` 驱动游戏状态）
