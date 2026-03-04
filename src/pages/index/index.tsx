import React, { useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { useResourceStore } from '../../stores/resource'
import { useEmployeeStore } from '../../stores/employee'
import { useProjectStore } from '../../stores/project'
import { useGameStore } from '../../stores/game'
import { formatNumber } from '../../utils/format'
import DialogModal from '../../components/DialogModal'
import './index.scss'

function Index() {
  const resources = useResourceStore((state) => state.resources)
  const employees = useEmployeeStore((state) => state.employees)
  const projects = useProjectStore((state) => state.projects)
  const showIntroStory = useGameStore((state) => state.showIntroStory)
  const setShowIntroStory = useGameStore((state) => state.setShowIntroStory)
  const markFirstLaunchCompleted = useGameStore((state) => state.markFirstLaunchCompleted)
  const showDialog = useGameStore((state) => state.showDialog)

  const workingCount = employees.filter((e) => e.isWorking).length
  const idleCount = employees.length - workingCount

  useEffect(() => {
    console.log('showIntroStory', showIntroStory)
    if (showIntroStory) {
      showDialog('intro')
      setShowIntroStory(false)
      markFirstLaunchCompleted()
    }
  }, [showIntroStory])

  return (
    <View className='page-index'>
      <DialogModal />
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
          onClick={() => navigateTo({ url: '/pages/shop/index' })}
        >
          <Text className='action-icon'>🎯</Text>
          <Text className='action-text'>招募员工</Text>
        </View>
        <View
          className='action-btn'
          onClick={() => navigateTo({ url: '/pages/project/index' })}
        >
          <Text className='action-icon'>📋</Text>
          <Text className='action-text'>查看项目</Text>
        </View>
        <View
          className='action-btn'
          onClick={() => navigateTo({ url: '/pages/employee/index' })}
        >
          <Text className='action-icon'>👥</Text>
          <Text className='action-text'>员工管理</Text>
        </View>
        <View
          className='action-btn'
          onClick={() => navigateTo({ url: '/pages/story/index' })}
        >
          <Text className='action-icon'>📖</Text>
          <Text className='action-text'>剧情</Text>
        </View>
      </View>
    </View>
  )
}

export default Index
