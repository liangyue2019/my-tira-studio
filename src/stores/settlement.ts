import type { SettlementResult, DaySettlementResult, TimeSlot, ActionParams, GameEvent } from '../types'
import { useGameStore } from './game'
import { useResourceStore } from './resource'
import { useEmployeeStore } from './employee'
import { useProjectStore } from './project'
import { useEventStore } from './event'
import { GAME_CONFIG, SKILL_MATCH_THRESHOLD, SKILL_MATCH_MIN_COUNT, SKILL_MISMATCH_PENALTY, MAX_PROJECT_PROGRESS_PER_SLOT } from '../constants/config'
import { ACTIONS } from '../constants/actions'
import { randomInt, randomFloat } from '../utils/random'

export function executeAction(actionId: string, params?: ActionParams): SettlementResult {
  const action = ACTIONS.find(a => a.id === actionId)
  if (!action) {
    return createEmptyResult(actionId, '未知行动')
  }

  const gameStore = useGameStore.getState()
  const resourceStore = useResourceStore.getState()
  const employeeStore = useEmployeeStore.getState()
  const projectStore = useProjectStore.getState()

  const result: SettlementResult = {
    actionId: action.id,
    actionName: action.name,
    timeSlot: gameStore.timeSlot,
    day: gameStore.day,
    rewards: {},
    costs: { ...action.cost } || {},
    events: [],
    messages: []
  }

  if (action.cost && !resourceStore.deductResources(action.cost)) {
    result.messages.push('资源不足，无法执行该行动')
    return result
  }

  switch (action.type) {
    case 'work_project':
      settleWorkProject(result, params)
      break
    case 'recruit':
      settleRecruit(result)
      break
    case 'train':
      settleTrain(result, params)
      break
    case 'rest':
      settleRest(result)
      break
    case 'explore':
      settleExplore(result)
      break
    case 'trade':
      settleTrade(result, params)
      break
    case 'social':
      settleSocial(result)
      break
  }

  result.messages.unshift(`${action.icon} ${action.name}`)
  return result
}

function settleWorkProject(result: SettlementResult, params?: ActionParams) {
  const projectStore = useProjectStore.getState()
  const employeeStore = useEmployeeStore.getState()
  const resourceStore = useResourceStore.getState()

  const project = params?.projectId
    ? projectStore.projects.find(p => p.id === params.projectId)
    : projectStore.projects.find(p => !p.isCompleted && !p.isFailed)

  if (!project) {
    result.messages.push('没有可推进的项目')
    return
  }

  if (!params?.projectId) {
    result.messages.push(`自动选择了项目：${project.name}`)
  }

  const assignedEmployees = project.assignedEmployees
    .map(id => employeeStore.getEmployeeById(id))
    .filter(e => e !== undefined)

  if (assignedEmployees.length === 0) {
    result.messages.push('该项目没有分配员工，没有进展')
    return
  }

  let totalProgressSlots = 0
  const progressBefore = project.slotsSpent / project.totalSlots

  for (const emp of assignedEmployees) {
    const skillMatch = checkSkillMatch(emp, project)
    const efficiency = emp.abilities.efficiency / 100
    let slots = skillMatch ? efficiency : efficiency * SKILL_MISMATCH_PENALTY
    slots = Math.min(slots, MAX_PROJECT_PROGRESS_PER_SLOT)
    totalProgressSlots += slots

    employeeStore.setEmployeeStatus(emp.id, 'working', 'work_project')
  }

  totalProgressSlots = Math.max(1, Math.round(totalProgressSlots))

  const progressResult = projectStore.addProgress(project.id, totalProgressSlots)

  if (progressResult.completed) {
    const completedProject = projectStore.projects.find(p => p.id === project.id) || project
    resourceStore.addResources(completedProject.reward)
    result.rewards = { ...completedProject.reward }
    result.messages.push(`🎉 项目「${project.name}」已完成！`)
    result.messages.push(`奖励：💰${completedProject.reward.gold} 🏆${completedProject.reward.reputation} ✨${completedProject.reward.exp}`)

    for (const emp of assignedEmployees) {
      employeeStore.resetEmployeeStatus(emp.id)
    }

    employeeStore.resetAllEmployeeStatus()
  } else {
    result.messages.push(`项目「${project.name}」进度：${Math.round(progressResult.progressBefore * 100)}% → ${Math.round(progressResult.progressAfter * 100)}%`)
  }

  result.projectProgress = {
    projectId: project.id,
    projectName: project.name,
    progressBefore: Math.round(progressResult.progressBefore * 100),
    progressAfter: Math.round(progressResult.progressAfter * 100)
  }
}

function settleRecruit(result: SettlementResult) {
  const employeeStore = useEmployeeStore.getState()
  const employee = employeeStore.gacha()

  result.recruited = {
    employeeId: employee.id,
    employeeName: employee.name,
    rarity: employee.rarity
  }
  result.messages.push(`🎉 招募到了新员工：${employee.name}（${employee.rarity}星）`)
}

function settleTrain(result: SettlementResult, params?: ActionParams) {
  const employeeStore = useEmployeeStore.getState()
  const resourceStore = useResourceStore.getState()

  const idleEmployees = employeeStore.getIdleEmployees()
  if (idleEmployees.length === 0) {
    result.messages.push('没有空闲的员工可以培训')
    return
  }

  const employee = params?.employeeId
    ? idleEmployees.find(e => e.id === params.employeeId)
    : idleEmployees[0]

  if (!employee) {
    result.messages.push('找不到可培训的员工')
    return
  }

  const abilities = ['coding', 'design', 'communication', 'efficiency'] as const
  const abilityToImprove = abilities[randomInt(0, abilities.length - 1)]
  const gain = GAME_CONFIG.trainingAbilityGain

  employeeStore.updateEmployee(employee.id, {
    exp: employee.exp + GAME_CONFIG.trainingExpGain,
    abilities: {
      ...employee.abilities,
      [abilityToImprove]: employee.abilities[abilityToImprove] + gain
    },
    status: 'training',
    currentAction: 'train'
  })

  const abilityName = { coding: '编程', design: '设计', communication: '沟通', efficiency: '效率' }[abilityToImprove]

  result.rewards = { exp: GAME_CONFIG.trainingExpGain }
  result.employeeTrained = {
    employeeId: employee.id,
    employeeName: employee.name,
    abilityImproved: abilityName,
    amountImproved: gain
  }
  result.messages.push(`📚 ${employee.name} 完成培训：${abilityName}+${gain}，经验+${GAME_CONFIG.trainingExpGain}`)
}

function settleRest(result: SettlementResult) {
  const resourceStore = useResourceStore.getState()
  const powerGain = 5
  resourceStore.addPower(powerGain)
  result.rewards = { power: powerGain }
  result.messages.push(`😴 休息恢复体力 +${powerGain}`)
}

function settleExplore(result: SettlementResult) {
  const resourceStore = useResourceStore.getState()
  const range = GAME_CONFIG.exploreRewardRange

  const goldGain = randomInt(range.gold[0], range.gold[1])
  const reputationGain = randomInt(range.reputation[0], range.reputation[1])
  const powerGain = randomInt(range.power[0], range.power[1])

  resourceStore.addGold(goldGain)
  resourceStore.addReputation(reputationGain)
  resourceStore.addPower(powerGain)

  result.rewards = { gold: goldGain, reputation: reputationGain, power: powerGain }
  result.messages.push(`🔍 探索收获：💰${goldGain} 🏆${reputationGain} ⚡${powerGain}`)

  const eventStore = useEventStore.getState()
  const event = eventStore.tryTriggerExploreEvent()
  if (event) {
    result.events.push(event)
    result.messages.push(`⚡ 触发事件：${event.title}`)
  }
}

function settleTrade(result: SettlementResult, params?: ActionParams) {
  const resourceStore = useResourceStore.getState()
  const tradeType = params?.tradeType || 'gold_to_reputation'

  if (tradeType === 'gold_to_reputation') {
    const goldAmount = params?.tradeGold || 100
    if (resourceStore.spendGold(goldAmount)) {
      const reputationGain = Math.floor(goldAmount / GAME_CONFIG.tradeRate)
      resourceStore.addReputation(reputationGain)
      result.costs = { gold: goldAmount }
      result.rewards = { reputation: reputationGain }
      result.messages.push(`💰 用 ${goldAmount} 金币换取了 ${reputationGain} 声望`)
    } else {
      result.messages.push('金币不足')
    }
  } else {
    const reputationAmount = 10
    if (resourceStore.resources.reputation >= reputationAmount) {
      resourceStore.spendPower(0)
      const goldGain = reputationAmount * GAME_CONFIG.tradeRate
      resourceStore.addGold(goldGain)
      result.costs = { reputation: reputationAmount }
      result.rewards = { gold: goldGain }
      result.messages.push(`🏆 用 ${reputationAmount} 声望换取了 ${goldGain} 金币`)
    } else {
      result.messages.push('声望不足')
    }
  }
}

function settleSocial(result: SettlementResult) {
  const resourceStore = useResourceStore.getState()
  const employeeStore = useEmployeeStore.getState()

  const socialEmployees = employeeStore.getIdleEmployees()
  const baseReputation = randomInt(GAME_CONFIG.socialReputationRange[0], GAME_CONFIG.socialReputationRange[1])
  const communicationBonus = socialEmployees.length > 0
    ? Math.floor(socialEmployees.reduce((sum, e) => sum + e.abilities.communication, 0) / socialEmployees.length / 20)
    : 0

  const totalReputation = baseReputation + communicationBonus
  resourceStore.addReputation(totalReputation)

  result.rewards = { reputation: totalReputation }
  result.messages.push(`🤝 社交获得声望 +${totalReputation}${communicationBonus > 0 ? `（含沟通加成 +${communicationBonus}）` : ''}`)
}

function checkSkillMatch(employee: any, project: any): boolean {
  const { abilities } = employee
  const { requirements } = project
  const codingMatch = abilities.coding >= requirements.coding * SKILL_MATCH_THRESHOLD
  const designMatch = abilities.design >= requirements.design * SKILL_MATCH_THRESHOLD
  const communicationMatch = abilities.communication >= requirements.communication * SKILL_MATCH_THRESHOLD
  const matchCount = [codingMatch, designMatch, communicationMatch].filter(Boolean).length
  return matchCount >= SKILL_MATCH_MIN_COUNT
}

function createEmptyResult(actionId: string, actionName: string): SettlementResult {
  const gameStore = useGameStore.getState()
  return {
    actionId,
    actionName,
    timeSlot: gameStore.timeSlot,
    day: gameStore.day,
    rewards: {},
    costs: {},
    events: [],
    messages: ['无效的行动']
  }
}

export function settleDay(): DaySettlementResult {
  const gameStore = useGameStore.getState()
  const resourceStore = useResourceStore.getState()
  const employeeStore = useEmployeeStore.getState()
  const projectStore = useProjectStore.getState()
  const eventStore = useEventStore.getState()

  const dayResult: DaySettlementResult = {
    day: gameStore.day,
    actionResults: [...gameStore.actionLog],
    dailyIncome: {},
    dailyExpense: {},
    events: [],
    projectDeadlines: [],
    messages: []
  }

  const salaryPerEmployee = GAME_CONFIG.employeeSalaryPerDay
  const totalSalary = employeeStore.employees.length * salaryPerEmployee
  if (totalSalary > 0) {
    resourceStore.spendGold(totalSalary)
    dayResult.dailyExpense = { gold: totalSalary }
    dayResult.messages.push(`💰 支付员工薪资：-${totalSalary} 金币`)
  }

  const powerRegen = GAME_CONFIG.basePowerRegenPerDay
  resourceStore.addPower(powerRegen)
  dayResult.dailyIncome = { power: powerRegen }
  dayResult.messages.push(`⚡ 体力自然恢复：+${powerRegen}`)

  const currentDay = gameStore.day
  const activeProjects = projectStore.projects.filter(p => !p.isCompleted && !p.isFailed)
  for (const project of activeProjects) {
    const remainingDays = project.deadline - currentDay
    if (remainingDays <= 0) {
      projectStore.failProject(project.id)
      dayResult.projectDeadlines.push({
        projectId: project.id,
        projectName: project.name,
        remainingDays: 0,
        isFailed: true
      })
      dayResult.messages.push(`❌ 项目「${project.name}」已超时失败！`)

      for (const empId of project.assignedEmployees) {
        employeeStore.resetEmployeeStatus(empId)
      }
    } else {
      dayResult.projectDeadlines.push({
        projectId: project.id,
        projectName: project.name,
        remainingDays,
        isFailed: false
      })
      if (remainingDays <= 2) {
        dayResult.messages.push(`⚠️ 项目「${project.name}」还剩 ${remainingDays} 天到期！`)
      }
    }
  }

  projectStore.clearCompletedAndFailed()

  const dayEvent = eventStore.tryTriggerDayEvent()
  if (dayEvent) {
    dayResult.events.push(dayEvent)
    dayResult.messages.push(`⚡ 触发事件：${dayEvent.title}`)
  }

  projectStore.refreshAvailableProjects(currentDay + 1)

  employeeStore.resetAllEmployeeStatus()

  return dayResult
}
