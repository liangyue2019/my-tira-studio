import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import { showToast, showActionSheet, showModal, navigateTo } from '@tarojs/taro'
import { useEmployeeStore } from '../../stores/employee'
import { useProjectStore } from '../../stores/project'
import { RARITY_NAMES, COLOR_PREFIXES } from '../../constants/config'
import { formatNumber } from '../../utils/format'
import './index.scss'

function Employee() {
  const employees = useEmployeeStore((state) => state.employees)
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee)
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
    if (employee.isWorking) {
      showToast({
        title: '员工正在工作中',
        icon: 'none'
      })
      return
    }

    const availableProjects = projects.filter(p => !p.assignedEmployees.includes(employee.id))
    
    if (availableProjects.length === 0) {
      showToast({
        title: '没有可用项目',
        icon: 'none'
      })
      return
    }

    showActionSheet({
      itemList: availableProjects.map(p => p.name)
    }).then((res) => {
      const project = availableProjects[res.tapIndex]
      updateEmployee(employee.id, {
        isWorking: true,
        assignedProjectId: project.id
      })
      showToast({
        title: '已分配工作',
        icon: 'success'
      })
    })
  }

  const handleDismiss = (employee: any) => {
    if (employee.isWorking) {
      showToast({
        title: '工作中的员工无法解雇',
        icon: 'none'
      })
      return
    }

    showModal({
      title: '确认解雇',
      content: `确定要解雇 ${employee.name} 吗？`
    }).then((res) => {
      if (res.confirm) {
        useEmployeeStore.getState().removeEmployee(employee.id)
        showToast({
          title: '已解雇',
          icon: 'success'
        })
      }
    })
  }

  return (
    <View className='employee'>
      <View className='header'>
        <Text className='title'>员工管理</Text>
      </View>

      <View className='stats'>
        <Text className='stat-text'>员工总数：{employees.length}</Text>
        <Text className='stat-text'>
          工作中：{employees.filter(e => e.isWorking).length}
        </Text>
        <Text className='stat-text'>
          空闲：{employees.filter(e => !e.isWorking).length}
        </Text>
      </View>

      <View className='employee-list'>
        {employees.length === 0 ? (
          <View className='empty-state'>
            <Text className='empty-text'>暂无员工，快去招募吧！</Text>
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
                  {RARITY_NAMES[employee.rarity as keyof typeof RARITY_NAMES]}
                </Text>
              </View>
              
              <View className='employee-info'>
                <Text className='info-item'>等级：Lv.{employee.level}</Text>
                <Text className='info-item'>颜色：{employee.color}夜</Text>
                <Text className='info-item'>
                  状态：{employee.isWorking ? '🔒 工作中' : '✅ 空闲'}
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
                  disabled={employee.isWorking}
                >
                  {employee.isWorking ? '工作中' : '分配工作'}
                </Button>
                <Button 
                  className='action-btn danger'
                  onClick={() => handleDismiss(employee)}
                  disabled={employee.isWorking}
                >
                  解雇
                </Button>
              </View>
            </View>
          ))
        )}
      </View>

      <View className='back-button'>
        <Button 
          className='back-btn'
          onClick={() => navigateTo({ url: '/pages/index/index' })}
        >
          返回工作室
        </Button>
      </View>
    </View>
  )
}

export default Employee
