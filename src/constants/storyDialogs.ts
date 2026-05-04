import type { Dialog } from '../types'

export const STORY_DIALOGS: Dialog[] = [
  {
    id: 'story_d1_m_1',
    title: '工作室开张',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '这就是我们的工作室了……虽然小了点，但梦想不嫌地方窄！',
    options: [
      {
        id: 'next',
        text: '……只有两张椅子。',
        nextDialogId: 'story_d1_m_2'
      }
    ],
    trigger: {
      type: 'dayTimeSlot',
      value: 0,
      dayValue: 1,
      timeSlotValue: 'morning'
    },
    isTriggered: false
  },
  {
    id: 'story_d1_m_2',
    title: '工作室开张',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '嘿嘿，你坐那张，我站着编程就行！反正我一写代码就停不下来——\n\n看！这就是我开发的 AI-agent 系统！只要投入电力代币，就能召唤出智能体员工——他们不知疲倦、不用发工资……好吧，还是要发一点的。',
    options: [
      {
        id: 'option_a',
        text: '有意思，演示一下？',
        nextDialogId: 'story_d1_m_3a'
      },
      {
        id: 'option_b',
        text: '不用发工资的那种才好……',
        nextDialogId: 'story_d1_m_3b'
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d1_m_3a',
    title: '工作室开张',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '好嘞！不过现在代币不够，我先给你看看界面……看到没？这个招募按钮——按下去，就是命运的时刻！',
    options: [
      {
        id: 'next',
        text: '命运的时刻……你是说抽卡吧。',
        nextDialogId: 'story_d1_m_4'
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d1_m_3b',
    title: '工作室开张',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '喂！那是劳动剥削！智能体也是有尊严的……大概吧。\n\n总之，先赚钱买代币，然后我们就能招人了！',
    options: [
      {
        id: 'next',
        text: '好吧……',
        nextDialogId: 'story_d1_m_4'
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d1_m_4',
    title: '工作室开张',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '对了，我把自己也注册成第一号员工了！别小看我，我的编程能力可是很——\n\n……才两星？！我的系统是不是有 bug……',
    options: [
      {
        id: 'next',
        text: '挺准的。',
        nextDialogId: 'story_d1_m_5'
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d1_m_5',
    title: '工作室开张',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '你——！',
    options: [
      {
        id: 'next',
        text: '好了好了，开始干活吧。',
        reward: { power: 3 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },

  {
    id: 'story_d1_a_1',
    title: '第一笔代币',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '好，初始资金 1000 代币。招募一次要 100，我建议先招一个人，然后马上接项目——现金流很重要！',
    options: [
      {
        id: 'option_a',
        text: '听你的，先招募。',
        nextDialogId: 'story_d1_a_2a',
        specialAction: 'recruit_lan'
      },
      {
        id: 'option_b',
        text: '省着花，先推进项目。',
        nextDialogId: 'story_d1_a_2b'
      }
    ],
    trigger: {
      type: 'dayTimeSlot',
      value: 0,
      dayValue: 1,
      timeSlotValue: 'afternoon'
    },
    isTriggered: false
  },
  {
    id: 'story_d1_a_2a',
    title: '第一笔代币',
    speaker: '系统提示',
    text: '获得智能体员工——蓝夜 tira！稀有度：★ 普通',
    options: [
      {
        id: 'next',
        text: '继续',
        nextDialogId: 'story_d1_a_3a'
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d1_a_3a',
    title: '第一笔代币',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '蓝色的……我？这命名规则真是的。不过多一个人总比没有强！',
    options: [
      {
        id: 'next',
        text: '欢迎新伙伴！',
        reward: { gold: 100 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d1_a_2b',
    title: '第一笔代币',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '没有员工怎么做项目啊……算了，我先顶着！看我的！',
    options: [
      {
        id: 'next',
        text: '加油！',
        reward: { power: 2 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },

  {
    id: 'story_d1_e_1',
    title: '星空下的对话',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '呼——第一天总算撑过去了。\n\n你知道吗，我开发这个系统的时候，一个人在实验室待了整整三个月……那时候就想，要是有人能一起创业就好了。',
    options: [
      {
        id: 'next',
        text: '所以你才拉上我？',
        nextDialogId: 'story_d1_e_2'
      }
    ],
    trigger: {
      type: 'dayTimeSlot',
      value: 0,
      dayValue: 1,
      timeSlotValue: 'evening'
    },
    isTriggered: false
  },
  {
    id: 'story_d1_e_2',
    title: '星空下的对话',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '才不是！我只是……需要一个……商业顾问！对，商业顾问！\n\n……谢谢你来了。',
    options: [
      {
        id: 'option_a',
        text: '这是我的选择。',
        nextDialogId: 'story_d1_e_3a',
        affinityEffect: { character: 'tira', amount: 1 }
      },
      {
        id: 'option_b',
        text: '别煽情了，早点睡吧。',
        nextDialogId: 'story_d1_e_3b'
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d1_e_3a',
    title: '星空下的对话',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '嗯……\n\n她笑了，灯光映在她的眼睛里，像窗外的小星星。',
    options: [
      {
        id: 'next',
        text: '（tira 好感度 +1）',
        reward: { reputation: 5 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d1_e_3b',
    title: '星空下的对话',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '哼，你这人真没情调。\n\n她别过头去，嘴角却微微翘起。',
    options: [
      {
        id: 'next',
        text: '晚安。',
        reward: { power: 2 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },

  {
    id: 'story_d2_m_1',
    title: '意外来客',
    speaker: '？？？',
    text: '……这里就是 AI-agent 工作室？',
    options: [
      {
        id: 'next',
        text: '……你是谁？',
        nextDialogId: 'story_d2_m_2'
      }
    ],
    trigger: {
      type: 'dayTimeSlot',
      value: 0,
      dayValue: 2,
      timeSlotValue: 'morning'
    },
    isTriggered: false
  },
  {
    id: 'story_d2_m_2',
    title: '意外来客',
    speaker: '零',
    text: '我叫零。是你们系统里一个异常数据……大概吧。\n\n我在你们的网络里游荡很久了。昨天系统招募的时候，我差点被当作普通智能体抽取——还好我跑得快。',
    options: [
      {
        id: 'option_a',
        text: '你想加入我们？',
        nextDialogId: 'story_d2_m_3a'
      },
      {
        id: 'option_b',
        text: '你是……bug？',
        nextDialogId: 'story_d2_m_3b'
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d2_m_3a',
    title: '意外来客',
    speaker: '零',
    text: '……加入？\n\n她沉默了几秒，像是在处理一个从未遇到过的请求。\n\n……也许。如果你们不把我当作数据的话。',
    options: [
      {
        id: 'next',
        text: '你先留下来观察吧。',
        nextDialogId: 'story_d2_m_4'
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d2_m_3b',
    title: '意外来客',
    speaker: '零',
    text: 'bug？\n\n她露出一丝不易察觉的笑意。\n\n也许吧。但有些 bug，比功能更有趣。',
    options: [
      {
        id: 'next',
        text: '……有道理。',
        nextDialogId: 'story_d2_m_4'
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d2_m_4',
    title: '意外来客',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '（悄悄拉住你）这家伙好奇怪……她的数据签名我查不到，系统里根本没有她的注册信息。这不正常。',
    options: [
      {
        id: 'next',
        text: '先观察吧。',
        nextDialogId: 'story_d2_m_5'
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d2_m_5',
    title: '意外来客',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '……好吧。但如果她乱动我的代码，我可饶不了她！',
    options: [
      {
        id: 'next',
        text: '知道了。',
        reward: { power: 2 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },

  {
    id: 'story_d2_a_1',
    title: '第一个项目',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: `看这个——'小型电商网站开发'，工期 3 天，报酬不错！`,
    options: [
      {
        id: 'next',
        text: '继续',
        nextDialogId: 'story_d2_a_2'
      }
    ],
    trigger: {
      type: 'dayTimeSlot',
      value: 0,
      dayValue: 2,
      timeSlotValue: 'afternoon'
    },
    isTriggered: false
  },
  {
    id: 'story_d2_a_2',
    title: '第一个项目',
    speaker: '零',
    text: '这个项目的前端需求……和我的数据结构有相似之处。\n\n……我只是提个建议。你们的人手不够。',
    options: [
      {
        id: 'option_a',
        text: '让零帮忙。',
        nextDialogId: 'story_d2_a_3a'
      },
      {
        id: 'option_b',
        text: '我们自己来。',
        nextDialogId: 'story_d2_a_3b'
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d2_a_3a',
    title: '第一个项目',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '你确定？她来路不明啊！\n\n零：我不会搞破坏的。……至少今天不会。\n\n零协助了项目推进，效率意外地高。tira 嘴上不说，但偷偷在观察零的代码风格。',
    options: [
      {
        id: 'next',
        text: '看来配合还不错。',
        reward: { gold: 50, reputation: 3 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d2_a_3b',
    title: '第一个项目',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '哼，当然！我们不需要来历不明的人帮忙！\n\n她更加卖力地工作，但进度明显吃紧。\n\n零安静地坐在角落，看着你们忙碌，表情有些说不清。',
    options: [
      {
        id: 'next',
        text: '辛苦了。',
        reward: { power: 2 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },

  {
    id: 'story_d2_e_1',
    title: '裂痕',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '今天的进度……不太理想。如果明天完不成，就要逾期了。',
    options: [
      {
        id: 'next',
        text: '……',
        nextDialogId: 'story_d2_e_2'
      }
    ],
    trigger: {
      type: 'dayTimeSlot',
      value: 0,
      dayValue: 2,
      timeSlotValue: 'evening'
    },
    isTriggered: false
  },
  {
    id: 'story_d2_e_2',
    title: '裂痕',
    speaker: '零',
    text: '如果你让我直接接入系统——',
    options: [
      {
        id: 'next',
        text: '……',
        nextDialogId: 'story_d2_e_3'
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d2_e_3',
    title: '裂痕',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '不行！你就是个异常数据！谁知道你接入之后会发生什么！',
    options: [
      {
        id: 'option_a',
        text: 'tira，冷静点，零是在帮忙。',
        nextDialogId: 'story_d2_e_4a',
        affinityEffect: { character: 'tira', amount: -1 }
      },
      {
        id: 'option_b',
        text: '零，你也要理解 tira 的顾虑。',
        nextDialogId: 'story_d2_e_4b',
        affinityEffect: { character: 'tira', amount: 1 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d2_e_4a',
    title: '裂痕',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '……你居然帮她说话？\n\n她的声音有些发颤。\n\n你不知道，她这种异常数据，可能随时让整个系统崩溃！我……我只是担心……\n\ntira 转过身，不再说话。',
    options: [
      {
        id: 'next',
        text: '（零好感度 +1，tira 好感度 -1）',
        affinityEffect: { character: 'rei', amount: 1 },
        reward: { exp: 10 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d2_e_4b',
    title: '裂痕',
    speaker: '零',
    text: '……我知道。\n\n她的声音很轻。\n\n我只是……算了。我不强求。\n\n零起身走到窗边，月光落在她银白的头发上，像一段安静而孤立的代码。',
    options: [
      {
        id: 'next',
        text: '（tira 好感度 +1）',
        reward: { reputation: 5 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },

  {
    id: 'story_d3_m_1',
    title: '真相的碎片',
    speaker: '零',
    text: `你来了。\n\n我一直在想，我到底是什么。\n\n我在你们的系统深处发现了一段被加密的日志。上面写着——'零号原型：第一代自主意识智能体'。\n\n我……是 AI-agent 系统最早的原型。`,
    options: [
      {
        id: 'next',
        text: '……',
        nextDialogId: 'story_d3_m_2'
      }
    ],
    trigger: {
      type: 'dayTimeSlot',
      value: 0,
      dayValue: 3,
      timeSlotValue: 'morning'
    },
    isTriggered: false
  },
  {
    id: 'story_d3_m_2',
    title: '真相的碎片',
    speaker: '零',
    text: '白夜 tira 也许不知道，也许忘了。但她创造系统时用的核心算法……就是我。',
    options: [
      {
        id: 'next',
        text: '……',
        nextDialogId: 'story_d3_m_3'
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d3_m_3',
    title: '真相的碎片',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '……你们在聊什么？\n\n零：……没什么。\n\n两人目光交错，空气中弥漫着微妙的紧张。',
    options: [
      {
        id: 'next',
        text: '没什么，开始工作吧。',
        reward: { power: 3 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },

  {
    id: 'story_d3_a_1',
    title: '最后冲刺',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '前端还差一个支付模块……我来！',
    options: [
      {
        id: 'next',
        text: '继续',
        nextDialogId: 'story_d3_a_2'
      }
    ],
    trigger: {
      type: 'dayTimeSlot',
      value: 0,
      dayValue: 3,
      timeSlotValue: 'afternoon'
    },
    isTriggered: false
  },
  {
    id: 'story_d3_a_2',
    title: '最后冲刺',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '……你写后端接口吧。前端我来。\n\n零微微一愣，然后轻轻点了点头。\n\n两个曾经对峙的人，第一次在代码上配合。键盘声此起彼伏，像某种不协调但正在磨合的二重奏。',
    options: [
      {
        id: 'next',
        text: '她们终于开始合作了……',
        reward: { gold: 100, exp: 20 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },

  {
    id: 'story_d3_e_1',
    title: '星空再临',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '虽然只是个小项目……但这是我们的第一步！\n\n零：……还不错。\n\n白夜 tira：零……我之前太凶了。对不起。\n\n零：……你确实很凶。\n\n白夜 tira：喂！\n\n三个人都笑了。窗外，星星比昨天多了几颗。',
    options: [
      {
        id: 'next',
        text: '继续',
        nextDialogId: 'story_d3_e_2'
      }
    ],
    trigger: {
      type: 'dayTimeSlot',
      value: 0,
      dayValue: 3,
      timeSlotValue: 'evening'
    },
    isTriggered: false
  },
  {
    id: 'story_d3_e_2',
    title: '星空再临',
    speaker: '白夜 tira',
    avatar: '/assets/avatars/tira.png',
    text: '说真的，零——你要留下来吗？正式的。\n\n对，作为我们的员工！我会给你注册的！稀有度嘛……\n\n系统提示：[零 稀有度：？？？ 无法评估]\n\n……系统评估不了你。那就——你来定吧。',
    options: [
      {
        id: 'option_a',
        text: '传说。你是独一无二的存在。',
        nextDialogId: 'story_d3_e_3a',
        affinityEffect: { character: 'rei', amount: 2 },
        specialAction: 'recruit_rei_legendary'
      },
      {
        id: 'option_b',
        text: '无所谓稀有度。你是我们的伙伴。',
        nextDialogId: 'story_d3_e_3b',
        affinityEffect: { character: 'rei', amount: 3 },
        specialAction: 'recruit_rei_partner'
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d3_e_3a',
    title: '星空再临',
    speaker: '零',
    text: '传说……\n\n她的眼眶微微泛红。\n\n从来没有人……这样定义过我。\n\n系统提示：「零 正式加入工作室！稀有度：★★★★★ 传说」',
    options: [
      {
        id: 'next',
        text: '欢迎加入。',
        nextDialogId: 'story_d3_e_4',
        reward: { gold: 200, reputation: 30, exp: 50 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d3_e_3b',
    title: '星空再临',
    speaker: '零',
    text: '伙伴……\n\n她低下头，银白色的发丝遮住了表情。\n\n……嗯。\n\n系统提示：「零 正式加入工作室！稀有度：无法定义·伙伴」',
    options: [
      {
        id: 'next',
        text: '从今以后，我们并肩作战。',
        nextDialogId: 'story_d3_e_4',
        reward: { gold: 200, reputation: 50, exp: 80 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  },
  {
    id: 'story_d3_e_4',
    title: '星空再临',
    speaker: '零',
    text: '这就是……有归属的感觉吗。\n\n谢谢你。\n\n她的声音很轻，像代码里一行不起眼的注释——但你知道，正是这行注释，让整个程序有了意义。',
    options: [
      {
        id: 'next',
        text: '我们的旅程，才刚刚开始。',
        reward: { power: 5 }
      }
    ],
    trigger: {
      type: 'custom',
      value: -1
    },
    isTriggered: false
  }
]
