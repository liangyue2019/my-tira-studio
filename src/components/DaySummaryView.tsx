import { View, Text } from '@tarojs/components'
import type { DaySettlementResult } from '../types'
import { TIME_SLOT_LABELS, TIME_SLOT_ICONS } from '../types'
import './DaySummaryView.scss'

interface Props {
  result: DaySettlementResult
  onContinue: () => void
}

function DaySummaryView({ result, onContinue }: Props) {
  return (
    <View className='day-summary'>
      <View className='summary-header'>
        <Text className='summary-icon'>📅</Text>
        <Text className='summary-title'>第 {result.day} 天 · 日终报告</Text>
      </View>

      <View className='summary-body'>
        <View className='summary-section'>
          <Text className='section-label'>今日行动</Text>
          {result.actionResults.length > 0 ? (
            result.actionResults.map((action, i) => (
              <View key={i} className='action-result'>
                <Text className='action-slot'>
                  {TIME_SLOT_ICONS[action.timeSlot]} {TIME_SLOT_LABELS[action.timeSlot]}
                </Text>
                <Text className='action-name'>{action.actionName}</Text>
              </View>
            ))
          ) : (
            <Text className='empty-text'>今天没有执行任何行动</Text>
          )}
        </View>

        {(result.dailyIncome.gold || result.dailyIncome.power || result.dailyIncome.reputation) && (
          <View className='summary-section'>
            <Text className='section-label'>📈 日收入</Text>
            <View className='income-row'>
              {result.dailyIncome.gold && <Text className='income-item'>💰+{result.dailyIncome.gold}</Text>}
              {result.dailyIncome.power && <Text className='income-item'>⚡+{result.dailyIncome.power}</Text>}
              {result.dailyIncome.reputation && <Text className='income-item'>🏆+{result.dailyIncome.reputation}</Text>}
            </View>
          </View>
        )}

        {(result.dailyExpense.gold || result.dailyExpense.power) && (
          <View className='summary-section'>
            <Text className='section-label'>📉 日支出</Text>
            <View className='expense-row'>
              {result.dailyExpense.gold && <Text className='expense-item'>💰-{result.dailyExpense.gold}</Text>}
              {result.dailyExpense.power && <Text className='expense-item'>⚡-{result.dailyExpense.power}</Text>}
            </View>
          </View>
        )}

        {result.projectDeadlines.length > 0 && (
          <View className='summary-section'>
            <Text className='section-label'>📋 项目动态</Text>
            {result.projectDeadlines.map((dl, i) => (
              <View key={i} className={`deadline-item ${dl.isFailed ? 'failed' : ''}`}>
                <Text className='deadline-name'>{dl.projectName}</Text>
                {dl.isFailed ? (
                  <Text className='deadline-status failed'>已超时失败</Text>
                ) : (
                  <Text className='deadline-status warning'>剩余{dl.remainingDays}天</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {result.messages.length > 0 && (
          <View className='summary-section'>
            <Text className='section-label'>📝 消息</Text>
            {result.messages.map((msg, i) => (
              <Text key={i} className='summary-message'>{msg}</Text>
            ))}
          </View>
        )}
      </View>

      <View className='summary-footer'>
        <View className='next-day-btn' onClick={onContinue}>
          <Text className='next-day-text'>进入第 {result.day + 1} 天 →</Text>
        </View>
      </View>
    </View>
  )
}

export default DaySummaryView
