import React, { useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useResourceStore } from '../../stores/resource'
import { useEmployeeStore } from '../../stores/employee'
import { useProjectStore } from '../../stores/project'
import { useGameStore } from '../../stores/game'
import { formatNumber } from '../../utils/format'
import './index.scss'

function Index() {
  const resources = useResourceStore((state) => state.resources)
  const employees = useEmployeeStore((state) => state.employees)
  const projects = useProjectStore((state) => state.projects)
  const showIntroStory = useGameStore((state) => state.showIntroStory)
  const setShowIntroStory = useGameStore((state) => state.setShowIntroStory)
  const markFirstLaunchCompleted = useGameStore((state) => state.markFirstLaunchCompleted)
  
  const workingCount = employees.filter((e) => e.isWorking).length
  const idleCount = employees.length - workingCount

  useEffect(() => {
    // 首次启动时显示初始剧情
    if (showIntroStory) {
      Taro.showModal({
        title: '欢迎来到 AI 工作室',
        content: '你和白夜 tira 一起创立了这家 IT 工作室。白夜 tira 开发的 AI-agent 系统可以招募智能体员工！\n\n你已经获得了：\n- 初始员工：白夜 tira\n- 初始项目任务 x2\n\n快去项目页面接受任务，让员工开始工作吧！',
        showCancel: false,
        confirmText: '开始创业'
      }).then(() => {
        setShowIntroStory(false)
        markFirstLaunchCompleted()
      })
    }
  }, [showIntroStory])

  console.log('Index page render:', {
    resources,
    employees: employees.length,
    projects: projects.length,
    showIntroStory
  })

  return (
    <View className='page-index'>
      <View className='header'>
        <Text className='title'>AI 工作室</Text>
      </View>

      <View className='resource-panel'>
        <View className='resource-item'>
          <Text className='resource-icon'>💰</Text>
          <Text className='resource-value'>{formatNumber(resources.gold)}</Text>
        </View>
        <View className='resource-item'>
          <Text className='resource-icon'>⚡</Text>
          <Text className='resource-value'>{formatNumber(resources.power)}</Text>
        </View>
        <View className='resource-item'>
          <Text className='resource-icon'>🏆</Text>
          <Text className='resource-value'>{formatNumber(resources.reputation)}</Text>
        </View>
        <View className='resource-item'>
          <Text className='resource-icon'>✨</Text>
          <Text className='resource-value'>{formatNumber(resources.exp)}</Text>
        </View>
      </View>

      <View className='stats-panel'>
        <View className='stat-item'>
          <Text className='stat-label'>员工总数</Text>
          <Text className='stat-value'>{employees.length}</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-label'>工作中</Text>
          <Text className='stat-value'>{workingCount}</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-label'>空闲</Text>
          <Text className='stat-value'>{idleCount}</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-label'>进行中项目</Text>
          <Text className='stat-value'>{projects.length}</Text>
        </View>
      </View>

      <View className='quick-actions'>
        <View 
          className='action-btn'
          onClick={() => Taro.navigateTo({ url: '/pages/shop/index' })}
        >
          <Text className='action-icon'>🎯</Text>
          <Text className='action-text'>招募员工</Text>
        </View>
        <View 
          className='action-btn'
          onClick={() => Taro.navigateTo({ url: '/pages/project/index' })}
        >
          <Text className='action-icon'>📋</Text>
          <Text className='action-text'>查看项目</Text>
        </View>
        <View 
          className='action-btn'
          onClick={() => Taro.navigateTo({ url: '/pages/employee/index' })}
        >
          <Text className='action-icon'>👥</Text>
          <Text className='action-text'>员工管理</Text>
        </View>
        <View 
          className='action-btn'
          onClick={() => Taro.navigateTo({ url: '/pages/story/index' })}
        >
          <Text className='action-icon'>📖</Text>
          <Text className='action-text'>剧情</Text>
        </View>
      </View>
    </View>
  )
}

export default Index
