import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useGameStore } from '../../stores/game'
import { ACHIEVEMENTS } from '../../constants/achievements'
import { formatNumber } from '../../utils/format'
import './index.scss'

function Achievement() {
  const achievements = ACHIEVEMENTS

  const getConditionText = (achievement: any) => {
    const texts = {
      employees: '拥有员工',
      gold: '累计金币',
      reputation: '声誉达到',
      projects: '完成项目',
      level: '员工等级'
    }
    return `${texts[achievement.condition.type as keyof typeof texts]} ${achievement.condition.value}`
  }

  const getRewardText = (achievement: any) => {
    const rewards = []
    if (achievement.reward.gold) rewards.push(`💰 ${formatNumber(achievement.reward.gold)}`)
    if (achievement.reward.power) rewards.push(`⚡ ${formatNumber(achievement.reward.power)}`)
    if (achievement.reward.reputation) rewards.push(`🏆 ${formatNumber(achievement.reward.reputation)}`)
    return rewards.join(' ') || '无'
  }

  return (
    <View className="achievement">
      <View className="header">
        <Text className="title">成就系统</Text>
      </View>

      <View className="achievement-list">
        {achievements.map((achievement) => (
          <View
            key={achievement.id}
            className={`achievement-item ${achievement.isUnlocked ? 'unlocked' : 'locked'}`}
          >
            <View className="achievement-header">
              <Text className="achievement-title">{achievement.title}</Text>
              <Text className="achievement-badge">
                {achievement.isUnlocked ? '✅' : '🔒'}
              </Text>
            </View>
            
            <Text className="achievement-description">{achievement.description}</Text>
            
            <View className="achievement-condition">
              <Text className="condition-label">条件：</Text>
              <Text className="condition-value">{getConditionText(achievement)}</Text>
            </View>
            
            <View className="achievement-reward">
              <Text className="reward-label">奖励：</Text>
              <Text className="reward-value">{getRewardText(achievement)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="back-button">
        <Button
          className="back-btn"
          onClick={() => Taro.navigateTo({ url: '/pages/index/index' })}
        >
          返回工作室
        </Button>
      </View>
    </View>
  )
}

export default Achievement
