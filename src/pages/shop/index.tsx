import React, { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import { useResourceStore } from '../../stores/resource'
import { useEmployeeStore } from '../../stores/employee'
import { GAME_CONFIG } from '../../constants/config'
import { RARITY_NAMES } from '../../types'
import { formatNumber } from '../../utils/format'
import './index.scss'

function Shop() {
  const [gachaResult, setGachaResult] = useState<{
    name: string
    color: string
    rarity: number
    abilities: any
  } | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const resources = useResourceStore((state) => state.resources)
  const spendGold = useResourceStore((state) => state.spendGold)
  const gacha = useEmployeeStore((state) => state.gacha)

  const handleGacha = () => {
    if (isAnimating) return

    const cost = GAME_CONFIG.gachaCost
    if (!spendGold(cost)) {
      showToast({ title: '金币不足', icon: 'none' })
      return
    }

    setIsAnimating(true)

    setTimeout(() => {
      const employee = gacha()
      setGachaResult({
        name: employee.name,
        color: employee.color,
        rarity: employee.rarity,
        abilities: employee.abilities
      })
      setIsAnimating(false)
    }, 1500)
  }

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

  return (
    <View className='shop'>
      <View className='header'>
        <Text className='title'>AI 招募系统</Text>
      </View>

      <View className='power-display'>
        <Text className='power-icon'>💰</Text>
        <Text className='power-value'>{formatNumber(resources.gold)}</Text>
        <Text className='power-label'>金币</Text>
      </View>

      <View className='gacha-area'>
        {isAnimating ? (
          <View className='gacha-animation'>
            <Text className='animate-text'>正在招募...</Text>
          </View>
        ) : gachaResult ? (
          <View className='gacha-result' style={{ borderColor: getColorStyle(gachaResult.color) }}>
            <Text
              className='result-rarity'
              style={{ color: getColorStyle(gachaResult.color) }}
            >
              {RARITY_NAMES[gachaResult.rarity]}
            </Text>
            <Text
              className='result-name'
              style={{ color: getColorStyle(gachaResult.color) }}
            >
              {gachaResult.name}
            </Text>
            <View className='result-abilities'>
              <Text className='ability-item'>编程：{gachaResult.abilities.coding}</Text>
              <Text className='ability-item'>设计：{gachaResult.abilities.design}</Text>
              <Text className='ability-item'>沟通：{gachaResult.abilities.communication}</Text>
              <Text className='ability-item'>效率：{gachaResult.abilities.efficiency}</Text>
            </View>
          </View>
        ) : (
          <View className='gacha-placeholder'>
            <Text className='placeholder-text'>点击招募按钮开始</Text>
            <Text className='placeholder-hint'>或在主页选择"招募员工"行动</Text>
          </View>
        )}
      </View>

      <View className='gacha-info'>
        <Text className='info-title'>招募说明</Text>
        <Text className='info-item'>消耗：{GAME_CONFIG.gachaCost} 金币/次</Text>
        <Text className='info-item'>品质：1-5 星</Text>
        <Text className='info-item'>颜色：白、蓝、红、紫、金</Text>
      </View>

      <View className='gacha-button'>
        <Button
          className='gacha-btn'
          onClick={handleGacha}
          disabled={isAnimating || resources.gold < GAME_CONFIG.gachaCost}
        >
          {isAnimating ? '招募中...' : `消耗 ${GAME_CONFIG.gachaCost} 金币招募`}
        </Button>
      </View>
    </View>
  )
}

export default Shop
