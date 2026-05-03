import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import { showToast, showModal } from '@tarojs/taro'
import { useEmployeeStore } from '../../stores/employee'
import { useProjectStore } from '../../stores/project'
import { EMPLOYEE_STATUS_LABELS, EMPLOYEE_STATUS_ICONS, RARITY_NAMES } from '../../types'
import { formatNumber } from '../../utils/format'
import './index.scss'

function Employee() {
  const employees = useEmployeeStore((state) => state.employees)
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee)
  const removeEmployee = useEmployeeStore((state) => state.removeEmployee)
  const resetEmployeeStatus = useEmployeeStore((state) => state.resetEmployeeStatus)
  const assignEmployee = useProjectStore((state) => state.assignEmployee)
  const removeEmployeeFromProject = useProjectStore((state) => state.removeEmployee)
  const projects = useProjectStore((state) => state.projects)

  const getColorStyle = (color: string) => {
    const colors: Record<string, string> = {
      '金': '#FFD700',
      '紫': '#9370DB',
      '红': '#FF6B6B',
      '蓝': '#4A90E2',
      '白': '#CCCCCC'
    }
    return colors[color] || '#CCCCCC'
  }

  const handleAssignProject = (employee: any) => {
    if (employee.status !== 'idle') {
      showToast({ title: '员工正在忙碌中', icon: 'none' })
      return
    }

    const activeProjects = projects.filter(p => !p.isCompleted && !p.isFailed && !p.assignedEmployees.includes(employee.id))
    if (activeProjects.length === 0) {
      showToast({ title: '没有可分配的项目', icon: 'none' })
      return
    }

    import('@tarojs/taro').then(({ showActionSheet }) => {
      showActionSheet({
        itemList: activeProjects.map(p => p.name)
      }).then((res) => {
        const project = activeProjects[res.tapIndex]
        assignEmployee(project.id, employee.id)
        updateEmployee(employee.id, {
          status: 'working',
          assignedProjectId: project.id
        })
        showToast({ title: '已分配工作', icon: 'success' })
      })
    })
  }

  const handleDismiss = (employee: any) => {
    if (employee.status !== 'idle') {
      showToast({ title: '忙碌中的员工无法解雇', icon: 'none' })
      return
    }

    showModal({
      title: '确认解雇',
      content: `确定要解雇 ${employee.name} 吗？`
    }).then((res) => {
      if (res.confirm) {
        removeEmployee(employee.id)
        showToast({ title: '已解雇', icon: 'success' })
      }
    })
  }

  const handleResetStatus = (employee: any) => {
    if (employee.assignedProjectId) {
      removeEmployeeFromProject(employee.assignedProjectId, employee.id)
    }
    resetEmployeeStatus(employee.id)
    showToast({ title: '已重置状态', icon: 'success' })
  }

  return (
    <View className='employee'>
      <View className='header'>
        <Text className='title'>员工管理</Text>
      </View>

      <View className='stats'>
        <Text className='stat-text'>总数：{employees.length}</Text>
        <Text className='stat-text'>
          空闲：{employees.filter(e => e.status === 'idle').length}
        </Text>
        <Text className='stat-text'>
          工作中：{employees.filter(e => e.status === 'working').length}
        </Text>
      </View>

      <View className='employee-list'>
        {employees.length === 0 ? (
          <View className='empty-state'>
            <Text className='empty-text'>暂无员工，在主页选择招募！</Text>
          </View>
        ) : (
          employees.map((employee) => (
            <View
              key={employee.id}
              className='employee-card'
              style={{ borderColor: getColorStyle(employee.color) }}
            >
              <View className='card-header'>
                <Text
                  className='employee-name'
                  style={{ color: getColorStyle(employee.color) }}
                >
                  {employee.name}
                </Text>
                <Text
                  className='employee-rarity'
                  style={{ color: getColorStyle(employee.color) }}
                >
                  {RARITY_NAMES[employee.rarity]}
                </Text>
              </View>

              <View className='employee-info'>
                <Text className='info-item'>Lv.{employee.level}</Text>
                <Text className='info-item'>
                  {EMPLOYEE_STATUS_ICONS[employee.status]} {EMPLOYEE_STATUS_LABELS[employee.status]}
                </Text>
              </View>

              <View className='abilities'>
                <View className='ability-row'>
                  <Text className='ability-label'>编程:</Text>
                  <Text className='ability-value'>{employee.abilities.coding}</Text>
                </View>
                <View className='ability-row'>
                  <Text className='ability-label'>设计:</Text>
                  <Text className='ability-value'>{employee.abilities.design}</Text>
                </View>
                <View className='ability-row'>
                  <Text className='ability-label'>沟通:</Text>
                  <Text className='ability-value'>{employee.abilities.communication}</Text>
                </View>
                <View className='ability-row'>
                  <Text className='ability-label'>效率:</Text>
                  <Text className='ability-value'>{employee.abilities.efficiency}</Text>
                </View>
              </View>

              <View className='card-actions'>
                <Button
                  className='action-btn'
                  onClick={() => handleAssignProject(employee)}
                  disabled={employee.status !== 'idle'}
                >
                  分配工作
                </Button>
                {employee.status !== 'idle' && (
                  <Button
                    className='action-btn'
                    onClick={() => handleResetStatus(employee)}
                  >
                    重置状态
                  </Button>
                )}
                <Button
                  className='action-btn danger'
                  onClick={() => handleDismiss(employee)}
                  disabled={employee.status !== 'idle'}
                >
                  解雇
                </Button>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  )
}

export default Employee
