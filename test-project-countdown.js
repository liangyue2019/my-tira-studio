// 测试函数
function testCalculateRemainingTime() {
  console.log('=== 测试倒计时计算功能 ===')
  
  // 测试场景 1: 单个员工工作，效率100%
  console.log('测试场景 1: 单个员工工作，效率100%')
  const project1 = testProjects[0]
  const employees1 = testEmployees.filter(e => e.assignedProjectId === project1.id && e.isWorking)
  const result1 = calculateRemainingTime(project1, employees1)
  console.log(`项目: ${project1.name}`)
  console.log(`基础时间: ${project1.duration}秒`)
  console.log(`当前进度: ${project1.progress * 100}%`)
  console.log(`分配员工: ${employees1.length}人`)
  console.log(`总效率: ${employees1.reduce((sum, e) => sum + e.abilities.efficiency, 0)}%`)
  console.log(`计算结果: ${result1}秒`)
  console.log(`预期结果: ~60秒`)
  console.log(`测试通过: ${result1 >= 55 && result1 <= 65}`)
  console.log('---')
  
  // 测试场景 2: 两个员工工作，总效率250%
  console.log('测试场景 2: 两个员工工作，总效率250%')
  const project2 = testProjects[1]
  const employees2 = testEmployees.filter(e => e.assignedProjectId === project2.id && e.isWorking)
  const result2 = calculateRemainingTime(project2, employees2)
  console.log(`项目: ${project2.name}`)
  console.log(`基础时间: ${project2.duration}秒`)
  console.log(`当前进度: ${project2.progress * 100}%`)
  console.log(`分配员工: ${employees2.length}人`)
  console.log(`总效率: ${employees2.reduce((sum, e) => sum + e.abilities.efficiency, 0)}%`)
  console.log(`计算结果: ${result2}秒`)
  console.log(`预期结果: ~24秒 (120 * 0.5 / 2.5)`)
  console.log(`测试通过: ${result2 >= 20 && result2 <= 28}`)
  console.log('---')
  
  // 测试场景 3: 没有员工工作
  console.log('测试场景 3: 没有员工工作')
  const project3 = { ...testProjects[0], assignedEmployees: [] }
  const employees3 = testEmployees.filter(e => e.assignedProjectId === project3.id && e.isWorking)
  const result3 = calculateRemainingTime(project3, employees3)
  console.log(`项目: ${project3.name}`)
  console.log(`基础时间: ${project3.duration}秒`)
  console.log(`当前进度: ${project3.progress * 100}%`)
  console.log(`分配员工: ${employees3.length}人`)
  console.log(`计算结果: ${result3}秒`)
  console.log(`预期结果: 60秒`)
  console.log(`测试通过: ${result3 === 60}`)
  console.log('---')
  
  // 测试场景 4: 项目接近完成
  console.log('测试场景 4: 项目接近完成')
  const project4 = { ...testProjects[0], progress: 0.9 }
  const employees4 = testEmployees.filter(e => e.assignedProjectId === project4.id && e.isWorking)
  const result4 = calculateRemainingTime(project4, employees4)
  console.log(`项目: ${project4.name}`)
  console.log(`基础时间: ${project4.duration}秒`)
  console.log(`当前进度: ${project4.progress * 100}%`)
  console.log(`分配员工: ${employees4.length}人`)
  console.log(`计算结果: ${result4}秒`)
  console.log(`预期结果: ~6秒 (60 * 0.1)`)
  console.log(`测试通过: ${result4 >= 4 && result4 <= 8}`)
  console.log('---')
  
  console.log('=== 测试完成 ===')
}

// 倒计时计算函数
function calculateRemainingTime(project, employees) {
  const assignedEmployees = employees
  if (assignedEmployees.length === 0) {
    return project.duration
  }
  
  const totalEfficiency = assignedEmployees.reduce((sum, emp) => sum + emp.abilities.efficiency, 0)
  const baseTime = project.duration
  const adjustedTime = baseTime / (totalEfficiency / 100)
  const remainingProgress = 1 - project.progress
  return Math.floor(adjustedTime * remainingProgress)
}

// 模拟测试数据
const testProjects = [
  {
    id: 'test1',
    name: '测试项目 1',
    duration: 60, // 1分钟
    progress: 0,
    assignedEmployees: ['emp1']
  },
  {
    id: 'test2',
    name: '测试项目 2',
    duration: 120, // 2分钟
    progress: 0.5, // 已完成50%
    assignedEmployees: ['emp1', 'emp2']
  }
]

const testEmployees = [
  {
    id: 'emp1',
    name: '测试员工 1',
    isWorking: true,
    assignedProjectId: 'test1',
    abilities: {
      coding: 20,
      design: 15,
      communication: 10,
      efficiency: 100 // 100% 效率
    }
  },
  {
    id: 'emp2',
    name: '测试员工 2',
    isWorking: true,
    assignedProjectId: 'test2',
    abilities: {
      coding: 30,
      design: 25,
      communication: 20,
      efficiency: 150 // 150% 效率
    }
  },
  {
    id: 'emp3',
    name: '测试员工 3',
    isWorking: false,
    assignedProjectId: undefined,
    abilities: {
      coding: 10,
      design: 5,
      communication: 5,
      efficiency: 50 // 50% 效率
    }
  }
]

// 运行测试
testCalculateRemainingTime()
