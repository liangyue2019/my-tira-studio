export const PROJECT_TEMPLATES = [
  {
    name: '企业官网',
    client: '某创业公司',
    baseRequirements: { coding: 20, design: 15, communication: 10 },
    baseSlots: 3,
    baseDeadline: 5,
    baseReward: { gold: 80, reputation: 3, exp: 8 }
  },
  {
    name: '电商平台',
    client: '某零售企业',
    baseRequirements: { coding: 50, design: 30, communication: 20 },
    baseSlots: 5,
    baseDeadline: 8,
    baseReward: { gold: 200, reputation: 8, exp: 20 }
  },
  {
    name: '移动应用',
    client: '某科技公司',
    baseRequirements: { coding: 80, design: 40, communication: 30 },
    baseSlots: 8,
    baseDeadline: 12,
    baseReward: { gold: 400, reputation: 15, exp: 40 }
  },
  {
    name: 'AI 系统',
    client: '某研究机构',
    baseRequirements: { coding: 150, design: 60, communication: 50 },
    baseSlots: 12,
    baseDeadline: 18,
    baseReward: { gold: 800, reputation: 30, exp: 80 }
  },
  {
    name: '云平台架构',
    client: '某互联网巨头',
    baseRequirements: { coding: 300, design: 100, communication: 100 },
    baseSlots: 18,
    baseDeadline: 25,
    baseReward: { gold: 1500, reputation: 50, exp: 150 }
  }
]

export const PROJECT_DIFFICULTY = {
  1: { multiplier: 1, name: '简单' },
  2: { multiplier: 1.5, name: '普通' },
  3: { multiplier: 2, name: '困难' },
  4: { multiplier: 3, name: '专家' },
  5: { multiplier: 5, name: '传奇' }
}

export const CLIENT_NAMES = [
  '某创业公司',
  '某零售企业',
  '某科技公司',
  '某金融机构',
  '某教育机构',
  '某医疗机构',
  '某制造企业',
  '某研究机构',
  '某互联网巨头',
  '某政府部门'
]
