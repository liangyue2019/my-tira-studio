import { useResourceStore } from '../stores/resource'
import { useEmployeeStore } from '../stores/employee'
import { useProjectStore } from '../stores/project'
import { useGameStore } from '../stores/game'
import { GAME_CONFIG } from '../constants/config'

let gameLoopInterval: NodeJS.Timeout | null = null
let powerRegenInterval: NodeJS.Timeout | null = null

export function startGameLoop(): () => void {
  console.log('启动游戏循环')
  
  gameLoopInterval = setInterval(() => {
    gameLoop()
  }, 1000)
  
  powerRegenInterval = setInterval(() => {
    powerRegenLoop()
  }, GAME_CONFIG.powerRegenInterval * 1000)
  
  return stopGameLoop
}

export function stopGameLoop() {
  if (gameLoopInterval) {
    clearInterval(gameLoopInterval)
    gameLoopInterval = null
  }
  
  if (powerRegenInterval) {
    clearInterval(powerRegenInterval)
    powerRegenInterval = null
  }
  
  console.log('游戏循环已停止')
}

function gameLoop() {
  const gameStore = useGameStore.getState()
  const projectStore = useProjectStore.getState()
  const employeeStore = useEmployeeStore.getState()
  
  gameStore.setOfflineStartTime(Date.now())
  
  const workingEmployees = employeeStore.getWorkingEmployees()
  
  workingEmployees.forEach((employee) => {
    if (employee.assignedProjectId) {
      const project = projectStore.projects.find((p) => p.id === employee.assignedProjectId)
      
      if (project && !project.isCompleted) {
        // 检查员工技能是否满足项目需求
        const skillMatch = checkSkillMatch(employee, project)
        
        if (skillMatch) {
          // 技能匹配时，正常推进进度
          const efficiency = employee.abilities.efficiency / 100
          const progressIncrement = (1 / project.duration) * efficiency
          
          const newProgress = Math.min(project.progress + progressIncrement, 1)
          
          projectStore.updateProject(project.id, {
            progress: newProgress
          })
          
          if (newProgress >= 1) {
            projectStore.completeProject(project.id)
            
            employeeStore.updateEmployee(employee.id, {
              isWorking: false,
              workProgress: 0,
              assignedProjectId: undefined
            })
          }
        } else {
          // 技能不匹配时，进度推进非常缓慢（10% 效率）
          const efficiency = (employee.abilities.efficiency / 100) * 0.1
          const progressIncrement = (1 / project.duration) * efficiency
          
          const newProgress = Math.min(project.progress + progressIncrement, 1)
          
          projectStore.updateProject(project.id, {
            progress: newProgress
          })
        }
      }
    }
  })
  
  const totalPlayTime = gameStore.totalPlayTime + 1
  Object.assign(gameStore, { totalPlayTime })
  
  gameStore.checkAchievements()
}

// 检查员工技能是否匹配项目需求
function checkSkillMatch(employee: any, project: any): boolean {
  const { abilities } = employee
  const { requirements } = project
  
  // 检查主要技能是否满足最低要求（满足 60% 以上）
  const codingMatch = abilities.coding >= requirements.coding * 0.6
  const designMatch = abilities.design >= requirements.design * 0.6
  const communicationMatch = abilities.communication >= requirements.communication * 0.6
  
  // 至少满足 2 项主要技能要求
  const matchCount = [codingMatch, designMatch, communicationMatch].filter(Boolean).length
  return matchCount >= 2
}

function powerRegenLoop() {
  const resourceStore = useResourceStore.getState()
  resourceStore.addPower(GAME_CONFIG.basePowerRegen)
  console.log('电力代币 +1')
}

export function calculateOfflineBenefits(): {
  gold: number
  exp: number
  duration: number
} {
  const gameStore = useGameStore.getState()
  const employeeStore = useEmployeeStore.getState()
  
  const now = Date.now()
  const offlineDuration = Math.floor((now - gameStore.offlineStartTime) / 1000)
  
  const maxOfflineTime = GAME_CONFIG.maxOfflineTime
  const effectiveDuration = Math.min(offlineDuration, maxOfflineTime)
  
  const workingEmployees = employeeStore.getWorkingEmployees()
  
  if (workingEmployees.length === 0) {
    return {
      gold: 0,
      exp: 0,
      duration: effectiveDuration
    }
  }
  
  const totalEfficiency = workingEmployees.reduce(
    (sum, emp) => sum + emp.abilities.efficiency,
    0
  )
  
  const baseGoldPerSecond = 10
  const baseExpPerSecond = 5
  
  const rate = GAME_CONFIG.offlineBenefitRate
  
  const gold = Math.floor(baseGoldPerSecond * effectiveDuration * (totalEfficiency / 100) * rate)
  const exp = Math.floor(baseExpPerSecond * effectiveDuration * (totalEfficiency / 100) * rate)
  
  return {
    gold,
    exp,
    duration: effectiveDuration
  }
}

export function claimOfflineBenefits() {
  const benefits = calculateOfflineBenefits()
  const resourceStore = useResourceStore.getState()
  
  if (benefits.gold > 0) {
    resourceStore.addGold(benefits.gold)
  }
  
  if (benefits.exp > 0) {
    resourceStore.addExp(benefits.exp)
  }
  
  const gameStore = useGameStore.getState()
  gameStore.setOfflineStartTime(Date.now())
  
  return benefits
}
