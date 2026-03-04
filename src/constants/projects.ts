export const PROJECT_TEMPLATES = [
  {
    name: '企业官网',
    client: '某创业公司',
    baseRequirements: { coding: 20, design: 15, communication: 10 },
    baseDuration: 60,
    baseReward: { gold: 50, reputation: 2, exp: 5 }
  },
  {
    name: '电商平台',
    client: '某零售企业',
    baseRequirements: { coding: 50, design: 30, communication: 20 },
    baseDuration: 90,
    baseReward: { gold: 120, reputation: 5, exp: 12 }
  },
  {
    name: '移动应用',
    client: '某科技公司',
    baseRequirements: { coding: 80, design: 40, communication: 30 },
    baseDuration: 120,
    baseReward: { gold: 250, reputation: 10, exp: 25 }
  },
  {
    name: 'AI 系统',
    client: '某研究机构',
    baseRequirements: { coding: 150, design: 60, communication: 50 },
    baseDuration: 150,
    baseReward: { gold: 500, reputation: 20, exp: 50 }
  },
  {
    name: '云平台架构',
    client: '某互联网巨头',
    baseRequirements: { coding: 300, design: 100, communication: 100 },
    baseDuration: 180,
    baseReward: { gold: 1000, reputation: 40, exp: 125 }
  }
]

export const PROJECT_DIFFICULTY = {
  1: { multiplier: 1 },
  2: { multiplier: 1.5 },
  3: { multiplier: 2 },
  4: { multiplier: 3 },
  5: { multiplier: 5 }
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
