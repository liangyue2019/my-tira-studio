import React, { useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { showModal } from '@tarojs/taro'
import { useResourceStore } from '../../stores/resource'
import { useEmployeeStore } from '../../stores/employee'
import { useProjectStore } from '../../stores/project'
import { useGameStore } from '../../stores/game'
import { useEventStore } from '../../stores/event'
import { formatNumber } from '../../utils/format'
import { ACTIONS, getActionsForSlot } from '../../constants/actions'
import { GAME_CONFIG } from '../../constants/config'
import type { TimeSlot, ActionParams, GameEvent, SettlementResult, DaySettlementResult } from '../../types'
import { TIME_SLOT_LABELS, TIME_SLOT_ICONS } from '../../types'
import DialogModal from '../../components/DialogModal'
import EventModal from '../../components/EventModal'
import SettlementView from '../../components/SettlementView'
import DaySummaryView from '../../components/DaySummaryView'
import './index.scss'

function Index() {
  const resources = useResourceStore((state) => state.resources)
  const employees = useEmployeeStore((state) => state.employees)
  const projects = useProjectStore((state) => state.projects)
  const availableProjects = useProjectStore((state) => state.availableProjects)
  const day = useGameStore((state) => state.day)
  const timeSlot = useGameStore((state) => state.timeSlot)
  const phase = useGameStore((state) => state.phase)
  const showIntroStory = useGameStore((state) => state.showIntroStory)
  const setShowIntroStory = useGameStore((state) => state.setShowIntroStory)
  const markFirstLaunchCompleted = useGameStore((state) => state.markFirstLaunchCompleted)
  const showDialog = useGameStore((state) => state.showDialog)
  const selectAction = useGameStore((state) => state.selectAction)
  const advanceTimeSlot = useGameStore((state) => state.advanceTimeSlot)
  const setPhase = useGameStore((state) => state.setPhase)
  const resetGame = useGameStore((state) => state.resetGame)
  const lastSettlementResult = useGameStore((state) => state.lastSettlementResult)
  const lastDayResult = useGameStore((state) => state.lastDayResult)
  const actionLog = useGameStore((state) => state.actionLog)

  const canAfford = useResourceStore((state) => state.canAfford)

  useEffect(() => {
    if (showIntroStory) {
      showDialog('intro')
      setShowIntroStory(false)
      markFirstLaunchCompleted()
    }
  }, [showIntroStory])

  const handleSelectAction = (actionId: string, params?: ActionParams) => {
    selectAction(actionId, params)
  }

  const handleContinueAfterSettlement = () => {
    advanceTimeSlot()
    setPhase('action_select')
  }

  const handleContinueAfterDaySummary = () => {
    setPhase('action_select')
  }

  const handleResetGame = () => {
    showModal({
      title: '重置游戏',
      content: '确定要重置所有数据吗？此操作不可撤销！',
      confirmText: '确定重置',
      cancelText: '取消',
      confirmColor: '#ff4d4f'
    }).then((res) => {
      if (res.confirm) {
        resetGame()
      }
    })
  }

  const availableActions = getActionsForSlot(timeSlot)

  const isActionAvailable = (actionId: string): boolean => {
    const action = ACTIONS.find(a => a.id === actionId)
    if (!action) return false
    if (!action.availableSlots.includes(timeSlot)) return false
    if (action.cost && !canAfford(action.cost)) return false

    if (actionId === 'work_project' && projects.filter(p => !p.isCompleted && !p.isFailed).length === 0) return false

    return true
  }

  const getActionDisabledReason = (actionId: string): string => {
    const action = ACTIONS.find(a => a.id === actionId)
    if (!action) return ''
    if (!action.availableSlots.includes(timeSlot)) return `${TIME_SLOT_LABELS[timeSlot]}不可用`
    if (action.cost && !canAfford(action.cost)) return '资源不足'
    if (actionId === 'work_project' && projects.filter(p => !p.isCompleted && !p.isFailed).length === 0) return '没有进行中项目'
    return ''
  }

  if (phase === 'day_summary' && lastDayResult) {
    return (
      <View className='page-index'>
        <DaySummaryView result={lastDayResult} onContinue={handleContinueAfterDaySummary} />
      </View>
    )
  }

  if (phase === 'settlement' && lastSettlementResult) {
    return (
      <View className='page-index'>
        <SettlementView result={lastSettlementResult} onContinue={handleContinueAfterSettlement} />
      </View>
    )
  }

  return (
    <View className='page-index'>
      <DialogModal />
      <EventModal />

      <View className='time-header'>
        <Text className='day-text'>📅 第 {day} 天</Text>
        <View className='timeslot-indicator'>
          <Text className='timeslot-icon'>{TIME_SLOT_ICONS[timeSlot]}</Text>
          <Text className='timeslot-text'>{TIME_SLOT_LABELS[timeSlot]}</Text>
        </View>
      </View>

      <View className='resource-panel'>
        <View className='resource-item'>
          <Text className='resource-icon'>💰</Text>
          <Text className='resource-label'>金币</Text>
          <Text className='resource-value'>{formatNumber(resources.gold)}</Text>
        </View>
        <View className='resource-item'>
          <Text className='resource-icon'>⚡</Text>
          <Text className='resource-label'>体力</Text>
          <Text className='resource-value'>{formatNumber(resources.power)}</Text>
        </View>
        <View className='resource-item'>
          <Text className='resource-icon'>🏆</Text>
          <Text className='resource-label'>声望</Text>
          <Text className='resource-value'>{formatNumber(resources.reputation)}</Text>
        </View>
        <View className='resource-item'>
          <Text className='resource-icon'>✨</Text>
          <Text className='resource-label'>经验</Text>
          <Text className='resource-value'>{formatNumber(resources.exp)}</Text>
        </View>
      </View>

      <View className='stats-panel'>
        <View className='stat-item'>
          <Text className='stat-label'>员工</Text>
          <Text className='stat-value'>{employees.length}</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-label'>空闲</Text>
          <Text className='stat-value'>{employees.filter(e => e.status === 'idle').length}</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-label'>项目</Text>
          <Text className='stat-value'>{projects.filter(p => !p.isCompleted && !p.isFailed).length}</Text>
        </View>
      </View>

      {actionLog.length > 0 && (
        <View className='today-log'>
          <Text className='log-title'>今日行动</Text>
          {actionLog.map((log, i) => (
            <View key={i} className='log-item'>
              <Text className='log-slot'>{TIME_SLOT_ICONS[log.timeSlot]} {TIME_SLOT_LABELS[log.timeSlot]}</Text>
              <Text className='log-action'>{log.actionName}</Text>
            </View>
          ))}
        </View>
      )}

      <View className='action-section'>
        <Text className='section-title'>选择本时段的行动</Text>
        <View className='action-grid'>
          {availableActions.map((action) => {
            const available = isActionAvailable(action.id)
            const reason = getActionDisabledReason(action.id)
            return (
              <View
                key={action.id}
                className={`action-card ${available ? '' : 'disabled'}`}
                onClick={() => available && handleSelectAction(action.id)}
              >
                <Text className='action-icon'>{action.icon}</Text>
                <Text className='action-name'>{action.name}</Text>
                {action.cost && (action.cost.gold || action.cost.power) && (
                  <Text className='action-cost'>
                    {action.cost.gold && `💰${action.cost.gold} `}
                    {action.cost.power && `⚡${action.cost.power}`}
                  </Text>
                )}
                {!available && reason && (
                  <Text className='action-reason'>{reason}</Text>
                )}
              </View>
            )
          })}
        </View>
      </View>

      {projects.filter(p => !p.isCompleted && !p.isFailed).length > 0 && (
        <View className='projects-preview'>
          <Text className='section-title'>进行中项目</Text>
          {projects.filter(p => !p.isCompleted && !p.isFailed).map(project => (
            <View key={project.id} className='project-mini-card'>
              <Text className='project-mini-name'>{project.name}</Text>
              <View className='project-mini-progress'>
                <View className='mini-progress-bar'>
                  <View
                    className='mini-progress-fill'
                    style={{ width: `${(project.slotsSpent / project.totalSlots) * 100}%` }}
                  />
                </View>
                <Text className='mini-progress-text'>
                  {project.slotsSpent}/{project.totalSlots}
                </Text>
              </View>
              <Text className='project-mini-deadline'>
                剩余{project.deadline - day}天
              </Text>
            </View>
          ))}
        </View>
      )}

      <View className='reset-btn' onClick={handleResetGame}>
        <Text className='reset-text'>🔄 重置游戏</Text>
      </View>
    </View>
  )
}

export default Index
