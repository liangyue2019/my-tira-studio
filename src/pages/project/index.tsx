import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import { useProjectStore } from '../../stores/project'
import { useEmployeeStore } from '../../stores/employee'
import { useGameStore } from '../../stores/game'
import { formatNumber } from '../../utils/format'
import { PROJECT_DIFFICULTY } from '../../constants/projects'
import { EMPLOYEE_STATUS_LABELS } from '../../types'
import './index.scss'

function Project() {
  const day = useGameStore((state) => state.day)
  const projects = useProjectStore((state) => state.projects)
  const availableProjects = useProjectStore((state) => state.availableProjects)
  const addProject = useProjectStore((state) => state.addProject)
  const assignEmployee = useProjectStore((state) => state.assignEmployee)
  const removeEmployee = useProjectStore((state) => state.removeEmployee)
  const employees = useEmployeeStore((state) => state.employees)

  const activeProjects = projects.filter(p => !p.isCompleted && !p.isFailed)
  const idleEmployees = employees.filter(e => e.status === 'idle')

  const handleAcceptProject = (project: any) => {
    addProject(project)
    showToast({ title: '已接受项目', icon: 'success' })
  }

  const handleAssignEmployee = (projectId: string, employeeId: string) => {
    assignEmployee(projectId, employeeId)
    useEmployeeStore.getState().updateEmployee(employeeId, {
      status: 'working',
      assignedProjectId: projectId
    })
    showToast({ title: '已分配员工', icon: 'success' })
  }

  const handleRemoveEmployee = (projectId: string, employeeId: string) => {
    removeEmployee(projectId, employeeId)
    useEmployeeStore.getState().resetEmployeeStatus(employeeId)
    showToast({ title: '已移除员工', icon: 'success' })
  }

  const getColorByDifficulty = (difficulty: number) => {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0']
    return colors[difficulty - 1] || '#999'
  }

  return (
    <View className='project'>
      <View className='header'>
        <Text className='title'>项目任务</Text>
        <Text className='day-info'>第 {day} 天</Text>
      </View>

      <View className='section'>
        <Text className='section-title'>进行中项目 ({activeProjects.length})</Text>
        {activeProjects.length === 0 ? (
          <View className='empty-state'>
            <Text className='empty-text'>暂无进行中项目</Text>
          </View>
        ) : (
          activeProjects.map((project) => (
            <View
              key={project.id}
              className='project-card'
              style={{ borderLeftColor: getColorByDifficulty(project.difficulty) }}
            >
              <Text className='project-name'>{project.name}</Text>
              <Text className='project-client'>客户：{project.client}</Text>
              <Text className='project-difficulty'>
                难度：{'★'.repeat(project.difficulty)}
              </Text>
              <View className='project-requirements'>
                <Text className='req-item'>编程：{project.requirements.coding}</Text>
                <Text className='req-item'>设计：{project.requirements.design}</Text>
                <Text className='req-item'>沟通：{project.requirements.communication}</Text>
              </View>
              <View className='project-progress'>
                <View className='progress-bar'>
                  <View
                    className='progress-fill'
                    style={{ width: `${(project.slotsSpent / project.totalSlots) * 100}%` }}
                  />
                </View>
                <Text className='progress-text'>
                  {project.slotsSpent}/{project.totalSlots} 时段
                </Text>
              </View>
              <Text className='project-deadline'>
                截止：第 {project.deadline} 天（剩余 {project.deadline - day} 天）
              </Text>

              <View className='project-employees'>
                <Text className='employees-label'>已分配员工：</Text>
                {project.assignedEmployees.length === 0 ? (
                  <Text className='no-employees'>未分配</Text>
                ) : (
                  project.assignedEmployees.map(empId => {
                    const emp = employees.find(e => e.id === empId)
                    return emp ? (
                      <View key={empId} className='assigned-employee'>
                        <Text className='emp-name'>{emp.name}</Text>
                        <Text
                          className='emp-remove'
                          onClick={() => handleRemoveEmployee(project.id, empId)}
                        >
                          ✕
                        </Text>
                      </View>
                    ) : null
                  })
                )}
              </View>

              {idleEmployees.length > 0 && (
                <View className='assign-section'>
                  <Text className='assign-label'>分配空闲员工：</Text>
                  <View className='assign-list'>
                    {idleEmployees.map(emp => (
                      <View
                        key={emp.id}
                        className='assign-emp-btn'
                        onClick={() => handleAssignEmployee(project.id, emp.id)}
                      >
                        <Text className='assign-emp-text'>{emp.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View className='project-reward'>
                <Text className='reward-item'>💰 {formatNumber(project.reward.gold)}</Text>
                <Text className='reward-item'>🏆 {formatNumber(project.reward.reputation)}</Text>
                <Text className='reward-item'>✨ {formatNumber(project.reward.exp)}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View className='section'>
        <Text className='section-title'>可接受项目 ({availableProjects.length})</Text>
        {availableProjects.length === 0 ? (
          <View className='empty-state'>
            <Text className='empty-text'>暂无可用项目，每天早上会刷新</Text>
          </View>
        ) : (
          availableProjects.map((project) => (
            <View
              key={project.id}
              className='available-card'
              style={{ borderLeftColor: getColorByDifficulty(project.difficulty) }}
            >
              <Text className='project-name'>{project.name}</Text>
              <Text className='project-client'>客户：{project.client}</Text>
              <Text className='project-difficulty'>
                难度：{'★'.repeat(project.difficulty)} ({PROJECT_DIFFICULTY[project.difficulty as keyof typeof PROJECT_DIFFICULTY]?.name})
              </Text>
              <View className='project-requirements'>
                <Text className='req-item'>编程：{project.requirements.coding}</Text>
                <Text className='req-item'>设计：{project.requirements.design}</Text>
                <Text className='req-item'>沟通：{project.requirements.communication}</Text>
              </View>
              <Text className='project-slots'>需要 {project.totalSlots} 个时段</Text>
              <Text className='project-deadline'>截止：第 {project.deadline} 天</Text>
              <View className='project-reward'>
                <Text className='reward-item'>💰 {formatNumber(project.reward.gold)}</Text>
                <Text className='reward-item'>🏆 {formatNumber(project.reward.reputation)}</Text>
                <Text className='reward-item'>✨ {formatNumber(project.reward.exp)}</Text>
              </View>
              <Button
                className='accept-btn'
                onClick={() => handleAcceptProject(project)}
              >
                接受项目
              </Button>
            </View>
          ))
        )}
      </View>
    </View>
  )
}

export default Project
