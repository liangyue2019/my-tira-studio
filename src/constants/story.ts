import type { StoryChapter } from '../types'

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'chapter_1',
    title: '第一章：起点',
    content: '我和最好的朋友白夜 tira 决定一起创立一家 IT 工作室。白夜 tira 是个天才开发者，她开发了一个神奇的 AI-agent 系统。这个系统可以用电力代币招募智能体员工！\n\n虽然工作室只有一张桌子和两把椅子，但梦想不嫌地方窄——她如是说。\n\n第一天，我们就这样开始了。她把自己注册成第一号员工，虽然系统只给了两星评价……',
    unlockRequirement: {
      day: 1
    },
    isUnlocked: true,
    isRead: false
  },
  {
    id: 'chapter_2',
    title: '第二章：波折',
    content: '第二天，一个自称"零"的神秘少女出现在工作室门口。她说自己是系统里的异常数据，差点被当作普通智能体抽取。\n\n白夜 tira 对她充满戒心——查不到数据签名，没有注册信息，一切都不正常。\n\n但零似乎对我们心怀善意。在项目推进时，她主动帮忙，效率意外地高。\n\n晚上，两人发生了争执。零想要接入系统帮忙，tira 坚决反对。气氛骤然紧张……',
    unlockRequirement: {
      day: 2
    },
    isUnlocked: false,
    isRead: false
  },
  {
    id: 'chapter_3',
    title: '第三章：选择',
    content: `第三天早上，零告诉我一个秘密——她在系统深处发现了一段加密日志：'零号原型：第一代自主意识智能体'。\n\n她是 AI-agent 系统最早的原型。白夜 tira 创造系统时用的核心算法，就是她。\n\n下午，tira 主动让零写后端接口。两个曾经对峙的人，第一次在代码上配合。\n\n晚上，项目完成了。tira 向零道歉，并邀请她正式加入工作室。\n\n系统无法评估零的稀有度。但我知道——她是独一无二的。`,
    unlockRequirement: {
      day: 3
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
  },
  {
    id: 'chapter_6',
    title: '第六章：行业新星',
    content: '一个月过去了，我们的工作室已经在业内小有名气。白夜 tira 说，AI-agent 系统还能进化，也许未来我们能看到更不可思议的智能体...',
    unlockRequirement: {
      day: 30,
      reputation: 100
    },
    isUnlocked: false,
    isRead: false
  }
]
