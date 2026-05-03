import type { GameEvent } from '../types'

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'evt_lucky_find',
    title: '意外发现',
    description: '在整理旧设备时，发现了一批还能用的硬件！',
    rarity: 'common',
    triggerCondition: { type: 'random', value: 20 },
    options: [
      {
        id: 'sell',
        text: '卖掉换钱',
        result: '你把这些硬件卖了个好价钱！',
        reward: { gold: 80 }
      },
      {
        id: 'keep',
        text: '留着升级设备',
        result: '你用这些硬件升级了工作室，效率提升！',
        reward: { power: 5, exp: 10 }
      }
    ]
  },
  {
    id: 'evt_client_visit',
    title: '客户来访',
    description: '一位潜在客户对你们的工作室很感兴趣，特地来参观。',
    rarity: 'rare',
    triggerCondition: { type: 'random', value: 10 },
    options: [
      {
        id: 'impress',
        text: '展示项目成果',
        result: '客户对你的项目成果赞不绝口！',
        reward: { reputation: 15, gold: 200 },
        requireEmployee: { minRarity: 3 }
      },
      {
        id: 'chat',
        text: '友好交谈',
        result: '虽然没能签单，但客户留下了好印象。',
        reward: { reputation: 5 }
      }
    ]
  },
  {
    id: 'evt_tech_breakthrough',
    title: '技术突破',
    description: '你的团队在项目中实现了一个技术突破！',
    rarity: 'epic',
    triggerCondition: { type: 'random', value: 5 },
    options: [
      {
        id: 'patent',
        text: '申请专利',
        result: '专利获批！工作室声名大振！',
        reward: { reputation: 30, gold: 500 }
      },
      {
        id: 'apply',
        text: '应用到项目中',
        result: '新技术让项目效率大幅提升！',
        reward: { exp: 100, power: 15 }
      }
    ]
  },
  {
    id: 'evt_investor',
    title: '投资人青睐',
    description: '一位投资人看中了你们的工作室，愿意投资！',
    rarity: 'legendary',
    triggerCondition: { type: 'random', value: 2 },
    options: [
      {
        id: 'accept',
        text: '接受投资',
        result: '投资到账！你们有了充足的资金！',
        reward: { gold: 2000, reputation: 20 }
      },
      {
        id: 'decline',
        text: '婉拒，保持独立',
        result: '虽然少了资金，但赢得了业界尊重。',
        reward: { reputation: 50 }
      }
    ]
  },
  {
    id: 'evt_employee_conflict',
    title: '员工冲突',
    description: '两名员工在项目方向上产生了分歧，气氛紧张。',
    rarity: 'common',
    triggerCondition: { type: 'random', value: 15 },
    options: [
      {
        id: 'mediate',
        text: '亲自调解',
        result: '你成功化解了矛盾，团队更加团结！',
        reward: { reputation: 5, exp: 15 }
      },
      {
        id: 'ignore',
        text: '让他们自己解决',
        result: '问题拖延了，效率受到了一些影响。',
        penalty: { power: -3 }
      }
    ]
  },
  {
    id: 'evt_market_boom',
    title: '市场繁荣',
    description: '行业进入繁荣期，项目需求激增！',
    rarity: 'rare',
    triggerCondition: { type: 'random', value: 8 },
    options: [
      {
        id: 'expand',
        text: '趁机扩张',
        result: '你抓住了机遇，收入大增！',
        reward: { gold: 500, reputation: 10 }
      },
      {
        id: 'conservative',
        text: '稳步发展',
        result: '稳扎稳打，虽然赚得少但很安全。',
        reward: { gold: 100, exp: 20 }
      }
    ]
  },
  {
    id: 'evt_old_friend',
    title: '老友重逢',
    description: '你以前的同事找上门来，想加入你的工作室。',
    rarity: 'rare',
    triggerCondition: { type: 'employees', value: 3 },
    options: [
      {
        id: 'welcome',
        text: '欢迎加入！',
        result: '老朋友的加入让团队更有活力了！',
        reward: { power: 10, reputation: 5 }
      },
      {
        id: 'decline_friend',
        text: '暂时不需要',
        result: '你委婉地拒绝了，但送了他一份礼物。',
        penalty: { gold: -50 },
        reward: { reputation: 10 }
      }
    ]
  },
  {
    id: 'evt_power_outage',
    title: '停电事故',
    description: '突然停电了！所有正在进行的设备都停了下来。',
    rarity: 'common',
    triggerCondition: { type: 'random', value: 10 },
    options: [
      {
        id: 'generator',
        text: '启动备用发电机',
        result: '及时启动了发电机，损失不大。',
        penalty: { gold: -30 }
      },
      {
        id: 'wait',
        text: '等待恢复',
        result: '等了几个小时才恢复，进度耽搁了。',
        penalty: { power: -5 }
      }
    ]
  }
]

export function getEventsByRarity(rarity: 'common' | 'rare' | 'epic' | 'legendary'): GameEvent[] {
  return GAME_EVENTS.filter(e => e.rarity === rarity)
}

export function getTriggerableEvents(): GameEvent[] {
  return GAME_EVENTS.filter(e => e.triggerCondition !== undefined)
}
