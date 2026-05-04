import { View, Text } from '@tarojs/components'
import type { SettlementResult } from '../types'
import { TIME_SLOT_LABELS, TIME_SLOT_ICONS } from '../types'
import './SettlementView.scss'

interface Props {
  result: SettlementResult
  onContinue: () => void
  onBack: () => void
}

function SettlementView({ result, onContinue, onBack }: Props) {
  return (
    <View className='settlement-view'>
      <View className='settlement-header'>
        <Text className='settlement-icon'>{TIME_SLOT_ICONS[result.timeSlot]}</Text>
        <Text className='settlement-title'>{TIME_SLOT_LABELS[result.timeSlot]}结算</Text>
      </View>

      <View className='settlement-body'>
        <View className='settlement-action'>
          <Text className='action-label'>执行行动：</Text>
          <Text className='action-name'>{result.actionName}</Text>
        </View>

        {result.projectProgress && (
          <View className='settlement-section'>
            <Text className='section-label'>📊 项目进度</Text>
            <Text className='project-name'>{result.projectProgress.projectName}</Text>
            <Text className='progress-change'>
              {result.projectProgress.progressBefore}% → {result.projectProgress.progressAfter}%
            </Text>
          </View>
        )}

        {result.employeeTrained && (
          <View className='settlement-section'>
            <Text className='section-label'>📚 培训成果</Text>
            <Text className='train-employee'>{result.employeeTrained.employeeName}</Text>
            <Text className='train-result'>
              {result.employeeTrained.abilityImproved} +{result.employeeTrained.amountImproved}
            </Text>
          </View>
        )}

        {result.recruited && (
          <View className='settlement-section'>
            <Text className='section-label'>🎯 新员工</Text>
            <Text className='recruit-name'>{result.recruited.employeeName}</Text>
            <Text className='recruit-rarity'>{result.recruited.rarity}星</Text>
          </View>
        )}

        {(result.rewards.gold || result.rewards.power || result.rewards.reputation || result.rewards.exp) && (
          <View className='settlement-section'>
            <Text className='section-label'>📈 获得</Text>
            <View className='rewards-row'>
              {result.rewards.gold && <Text className='reward-item'>💰+{result.rewards.gold}</Text>}
              {result.rewards.power && <Text className='reward-item'>⚡+{result.rewards.power}</Text>}
              {result.rewards.reputation && <Text className='reward-item'>🏆+{result.rewards.reputation}</Text>}
              {result.rewards.exp && <Text className='reward-item'>✨+{result.rewards.exp}</Text>}
            </View>
          </View>
        )}

        {(result.costs.gold || result.costs.power) && (
          <View className='settlement-section'>
            <Text className='section-label'>📉 消耗</Text>
            <View className='costs-row'>
              {result.costs.gold && <Text className='cost-item'>💰-{result.costs.gold}</Text>}
              {result.costs.power && <Text className='cost-item'>⚡-{result.costs.power}</Text>}
            </View>
          </View>
        )}

        {result.messages.length > 0 && (
          <View className='settlement-messages'>
            {result.messages.map((msg, i) => (
              <Text key={i} className='message-item'>{msg}</Text>
            ))}
          </View>
        )}
      </View>

      <View className='settlement-footer'>
        <View className='back-btn' onClick={onBack}>
          <Text className='back-text'>← 返回</Text>
        </View>
        <View className='continue-btn' onClick={onContinue}>
          <Text className='continue-text'>继续 →</Text>
        </View>
      </View>
    </View>
  )
}

export default SettlementView
