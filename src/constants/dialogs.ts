import type { Dialog } from '../types'

export const DIALOGS: Dialog[] = [
  {
    id: 'intro',
    title: '欢迎来到 AI 工作室',
    speaker: '白夜 tira',
    text: '你和我一起创立了这家 IT 工作室！我开发的 AI-agent 系统可以招募智能体员工！\n\n你已经获得了初始员工和初始项目，快去让他们开始工作吧！',
    options: [
      {
        id: 'start',
        text: '开始创业！',
        reward: {
          gold: 500,
          power: 5
        }
      }
    ],
    trigger: {
      type: 'custom',
      value: 0
    },
    isTriggered: false
  },
  {
    id: 'first_employee',
    title: '第一个员工',
    speaker: '系统提示',
    text: '恭喜！你成功招募了第一个员工！这是你工作室的重要一步。',
    options: [
      {
        id: 'great',
        text: '太棒了！',
        reward: {
          reputation: 10,
          exp: 20
        }
      }
    ],
    trigger: {
      type: 'employees',
      value: 1
    },
    isTriggered: false
  },
  {
    id: 'first_project_completed',
    title: '项目完成！',
    speaker: '客户',
    text: '非常感谢你们的出色工作！这个项目完成得太棒了！期待下次合作！',
    options: [
      {
        id: 'thanks',
        text: '谢谢您的认可！',
        reward: {
          gold: 1000,
          reputation: 50,
          exp: 100
        }
      }
    ],
    trigger: {
      type: 'projects',
      value: 1
    },
    isTriggered: false
  },
  {
    id: 'gold_10000',
    title: '财富积累',
    speaker: '白夜 tira',
    text: '哇！我们已经有 10000 金币了！工作室的发展越来越好！',
    options: [
      {
        id: 'celebrate',
        text: '继续努力！',
        reward: {
          power: 10,
          exp: 50
        }
      }
    ],
    trigger: {
      type: 'gold',
      value: 10000
    },
    isTriggered: false
  },
  {
    id: 'reputation_100',
    title: '小有名气',
    speaker: '行业媒体',
    text: '你们的工作室在业内开始崭露头角！继续保持！',
    options: [
      {
        id: 'keep_going',
        text: '我们会的！',
        reward: {
          gold: 2000,
          reputation: 20
        }
      }
    ],
    trigger: {
      type: 'reputation',
      value: 100
    },
    isTriggered: false
  },
  {
    id: 'employees_5',
    title: '团队壮大',
    speaker: '白夜 tira',
    text: '太棒了！我们现在有 5 个员工了！团队越来越强大！',
    options: [
      {
        id: 'team_grow',
        text: '一起加油！',
        reward: {
          exp: 100,
          power: 15
        }
      }
    ],
    trigger: {
      type: 'employees',
      value: 5
    },
    isTriggered: false
  }
]
