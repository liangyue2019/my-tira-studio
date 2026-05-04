import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useProjectStore } from '../stores/project'
import { useEmployeeStore } from '../stores/employee'
import { useGameStore } from '../stores/game'
import { useResourceStore } from '../stores/resource'
import { PROJECT_DIFFICULTY } from '../constants/projects'
import { SKILL_MATCH_THRESHOLD, SKILL_MATCH_MIN_COUNT, SKILL_MISMATCH_PENALTY, MAX_PROJECT_PROGRESS_PER_SLOT } from '../constants/config'
import './ProjectAssignView.scss'

interface Props {
  onConfirm: (projectId: string) => void
  onBack: () => void
}

function ProjectAssignView({ onConfirm, onBack }: Props) {
  const day = useGameStore((state) => state.day)
  const projects = useProjectStore((state) => state.projects)
  const employees = useEmployeeStore((state) => state.employees)
  const resources = useResourceStore((state) => state.resources)
  const assignEmployee = useProjectStore((state) => state.assignEmployee)
  const removeEmployee = useProjectStore((state) => state.removeEmployee)
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee)
  const resetEmployeeStatus = useEmployeeStore((state) => state.resetEmployeeStatus)

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const activeProjects = projects.filter(p => !p.isCompleted && !p.isFailed)
  const idleEmployees = employees.filter(e => e.status === 'idle')

  const canAffordAction = resources.power >= 5

  const getColorByDifficulty = (difficulty: number) => {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0']
    return colors[difficulty - 1] || '#999'
  }

  const checkSkillMatch = (emp: any, project: any): boolean => {
    const { abilities } = emp
    const { requirements } = project
    const codingMatch = abilities.coding >= requirements.coding * SKILL_MATCH_THRESHOLD
    const designMatch = abilities.design >= requirements.design * SKILL_MATCH_THRESHOLD
    const commMatch = abilities.communication >= requirements.communication * SKILL_MATCH_THRESHOLD
    const matchCount = [codingMatch, designMatch, commMatch].filter(Boolean).length
    return matchCount >= SKILL_MATCH_MIN_COUNT
  }

  const estimateProgress = (project: any): number => {
    const assigned = project.assignedEmployees
      .map((id: string) => employees.find((e: any) => e.id === id))
      .filter(Boolean)
    let total = 0
    for (const emp of assigned) {
      const match = checkSkillMatch(emp, project)
      const efficiency = emp.abilities.efficiency / 100
      let slots = match ? efficiency : efficiency * SKILL_MISMATCH_PENALTY
      slots = Math.min(slots, MAX_PROJECT_PROGRESS_PER_SLOT)
      total += slots
    }
    return Math.max(1, Math.round(total))
  }

  const handleAssignEmployee = (projectId: string, employeeId: string) => {
    assignEmployee(projectId, employeeId)
    updateEmployee(employeeId, {
      status: 'working',
      assignedProjectId: projectId
    })
  }

  const handleRemoveEmployee = (projectId: string, employeeId: string) => {
    removeEmployee(projectId, employeeId)
    resetEmployeeStatus(employeeId)
  }

  const handleProjectClick = (projectId: string) => {
    if (selectedProjectId === projectId) {
      const project = activeProjects.find(p => p.id === projectId)
      if (project && project.assignedEmployees.length > 0 && canAffordAction) {
        onConfirm(projectId)
      }
    } else {
      setSelectedProjectId(projectId)
    }
  }

  const handleEmployeeClick = (employeeId: string) => {
    if (!selectedProjectId) return
    const project = activeProjects.find(p => p.id === selectedProjectId)
    if (!project) return
    if (project.assignedEmployees.includes(employeeId)) {
      handleRemoveEmployee(selectedProjectId, employeeId)
    } else {
      handleAssignEmployee(selectedProjectId, employeeId)
    }
  }

  const handleConfirmClick = () => {
    if (!selectedProjectId) return
    const project = activeProjects.find(p => p.id === selectedProjectId)
    if (!project || project.assignedEmployees.length === 0 || !canAffordAction) return
    onConfirm(selectedProjectId)
  }

  return (
    <View className='project-assign-view'>
      <View className='pa-header'>
        <View className='pa-back-btn' onClick={onBack}>
          <Text className='pa-back-text'>← 返回</Text>
        </View>
        <Text className='pa-title'>📋 推进项目</Text>
        <Text className='pa-cost'>消耗 ⚡5</Text>
      </View>

      <View className='pa-body'>
        <View className='pa-section'>
          <Text className='pa-section-title'>项目列表</Text>
          {activeProjects.length === 0 ? (
            <View className='pa-empty'>
              <Text className='pa-empty-text'>暂无进行中项目</Text>
            </View>
          ) : (
            activeProjects.map(project => {
              const isSelected = selectedProjectId === project.id
              const estimated = estimateProgress(project)
              const progressPct = Math.round((project.slotsSpent / project.totalSlots) * 100)
              return (
                <View
                  key={project.id}
                  className={`pa-project-card ${isSelected ? 'selected' : ''}`}
                  style={{ borderLeftColor: getColorByDifficulty(project.difficulty) }}
                  onClick={() => handleProjectClick(project.id)}
                >
                  <View className='pa-project-header'>
                    <Text className='pa-project-name'>{project.name}</Text>
                    {isSelected && <Text className='pa-selected-badge'>✓ 已选中</Text>}
                  </View>
                  <Text className='pa-project-client'>客户：{project.client}</Text>
                  <View className='pa-project-progress'>
                    <View className='pa-progress-bar'>
                      <View
                        className='pa-progress-fill'
                        style={{ width: `${progressPct}%` }}
                      />
                    </View>
                    <Text className='pa-progress-text'>
                      {project.slotsSpent}/{project.totalSlots}
                    </Text>
                  </View>
                  <Text className='pa-project-deadline'>
                    剩余{project.deadline - day}天
                  </Text>

                  {project.assignedEmployees.length > 0 && (
                    <View className='pa-assigned-list'>
                      {project.assignedEmployees.map(empId => {
                        const emp = employees.find(e => e.id === empId)
                        if (!emp) return null
                        const match = checkSkillMatch(emp, project)
                        return (
                          <View key={empId} className={`pa-assigned-emp ${match ? 'matched' : 'mismatched'}`}>
                            <Text className='pa-emp-name'>{emp.name}</Text>
                            <Text className='pa-emp-match'>{match ? '✅匹配' : '⚠️偏移'}</Text>
                            <Text
                              className='pa-emp-remove'
                              onClick={(e) => { e.stopPropagation && e.stopPropagation(); handleRemoveEmployee(project.id, empId) }}
                            >✕</Text>
                          </View>
                        )
                      })}
                    </View>
                  )}

                  {isSelected && project.assignedEmployees.length > 0 && (
                    <View className='pa-estimate'>
                      <Text className='pa-estimate-text'>
                        预估推进：+{estimated} 格 → {Math.min(project.slotsSpent + estimated, project.totalSlots)}/{project.totalSlots}
                      </Text>
                    </View>
                  )}
                </View>
              )
            })
          )}
        </View>

        <View className='pa-section'>
          <Text className='pa-section-title'>
            可用员工 {selectedProjectId ? '（点击分配/移除）' : '（请先选择项目）'}
          </Text>
          {idleEmployees.length === 0 && activeProjects.every(p => p.assignedEmployees.length === 0) ? (
            <View className='pa-empty'>
              <Text className='pa-empty-text'>无可用员工</Text>
            </View>
          ) : (
            <View className='pa-employee-grid'>
              {employees.map(emp => {
                const isIdle = emp.status === 'idle'
                const isAssigned = emp.status === 'working' && emp.assignedProjectId
                return (
                  <View
                    key={emp.id}
                    className={`pa-emp-card ${isIdle ? 'idle' : isAssigned ? 'assigned' : 'busy'}`}
                    onClick={() => {
                      if (isIdle && selectedProjectId) {
                        handleEmployeeClick(emp.id)
                      } else if (isAssigned && selectedProjectId === emp.assignedProjectId) {
                        handleEmployeeClick(emp.id)
                      }
                    }}
                  >
                    <Text className='pa-emp-card-name'>{emp.name}</Text>
                    <Text className='pa-emp-card-stars'>{'★'.repeat(emp.rarity)}</Text>
                    <View className='pa-emp-abilities'>
                      <Text className='pa-ability'>编码{emp.abilities.coding}</Text>
                      <Text className='pa-ability'>设计{emp.abilities.design}</Text>
                      <Text className='pa-ability'>沟通{emp.abilities.communication}</Text>
                    </View>
                    <Text className={`pa-emp-status ${isIdle ? 'status-idle' : isAssigned ? 'status-assigned' : 'status-busy'}`}>
                      {isIdle ? '空闲' : isAssigned ? '已分配' : '忙碌'}
                    </Text>
                  </View>
                )
              })}
            </View>
          )}
        </View>
      </View>

      <View className='pa-footer'>
        <View
          className={`pa-confirm-btn ${selectedProjectId && activeProjects.find(p => p.id === selectedProjectId)?.assignedEmployees.length > 0 && canAffordAction ? '' : 'disabled'}`}
          onClick={handleConfirmClick}
        >
          <Text className='pa-confirm-text'>
            {selectedProjectId
              ? activeProjects.find(p => p.id === selectedProjectId)?.assignedEmployees.length > 0
                ? canAffordAction
                  ? `确认推进「${activeProjects.find(p => p.id === selectedProjectId)?.name}」`
                  : '体力不足'
                : '请先分配员工'
              : '请选择项目'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default ProjectAssignView
