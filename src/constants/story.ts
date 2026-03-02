import type { StoryChapter } from '../types'

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'chapter_1',
    title: '第一章：新的开始',
    content: '我和最好的朋友白夜 tira 决定一起创立一家 IT 工作室。白夜 tira 是个天才开发者，他开发了一个神奇的 AI-agent 系统。这个系统可以用电力代币招募智能体员工！我们的工作室即将启航...',
    unlockRequirement: {
      reputation: 0,
      gold: 0,
      employees: 0
    },
    isUnlocked: true,
    isRead: false
  },
  {
    id: 'chapter_2',
    title: '第二章：第一个员工',
    content: '我们成功招募了第一个智能体员工！看着他忙碌的身影，我对未来充满了期待。白夜 tira 说，这个系统可以生成各种不同能力的智能体，每个都有独特的命名规则...',
    unlockRequirement: {
      employees: 1
    },
    isUnlocked: false,
    isRead: false
  },
  {
    id: 'chapter_3',
    title: '第三章：首个项目',
    content: '终于接到了第一个项目！虽然是个小项目，但这是我们工作室的第一步。智能体员工们展现出了惊人的能力，他们各司其职，高效地完成着工作...',
    unlockRequirement: {
      projects: 1
    },
    isUnlocked: false,
    isRead: false
  },
  {
    id: 'chapter_4',
    title: '第四章：团队的成长',
    content: '随着项目的完成，我们的声誉开始提升。越来越多的智能体员工加入了我们，蓝夜 tira、金夜 tira、红夜 tira... 每个员工都有自己的特长。工作室开始步入正轨...',
    unlockRequirement: {
      reputation: 100,
      employees: 5
    },
    isUnlocked: false,
    isRead: false
  },
  {
    id: 'chapter_5',
    title: '第五章：挑战与机遇',
    content: '我们开始接到更大更难的项目。白夜 tira 的 AI-agent 系统也在不断升级，现在可以招募更稀有的智能体了。这是挑战，也是机遇...',
    unlockRequirement: {
      reputation: 500,
      gold: 5000
    },
    isUnlocked: false,
    isRead: false
  }
]
