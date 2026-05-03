import { View, Text } from '@tarojs/components'
import { useGameStore } from '../stores/game'
import { useEventStore } from '../stores/event'
import { useEmployeeStore } from '../stores/employee'
import type { EventOption } from '../types'
import { EVENT_RARITY_LABELS, EVENT_RARITY_COLORS } from '../types'
import './EventModal.scss'

function EventModal() {
  const currentEvent = useGameStore((state) => state.currentEvent)
  const setCurrentEvent = useGameStore((state) => state.setCurrentEvent)
  const resolveEvent = useEventStore((state) => state.resolveEvent)
  const employees = useEmployeeStore((state) => state.employees)

  if (!currentEvent) return null

  const handleOptionClick = (option: EventOption) => {
    if (option.requireEmployee) {
      const hasMatch = employees.some(emp => {
        if (option.requireEmployee.minRarity && emp.rarity < option.requireEmployee.minRarity) return false
        if (option.requireEmployee.minAbility) {
          const abilities = option.requireEmployee.minAbility
          if (abilities.coding && emp.abilities.coding < abilities.coding) return false
          if (abilities.design && emp.abilities.design < abilities.design) return false
          if (abilities.communication && emp.abilities.communication < abilities.communication) return false
          if (abilities.efficiency && emp.abilities.efficiency < abilities.efficiency) return false
        }
        return true
      })
      if (!hasMatch) return
    }

    resolveEvent(option.id)
    setCurrentEvent(null)
  }

  const isOptionAvailable = (option: EventOption): boolean => {
    if (!option.requireEmployee) return true
    return employees.some(emp => {
      if (option.requireEmployee.minRarity && emp.rarity < option.requireEmployee.minRarity) return false
      if (option.requireEmployee.minAbility) {
        const abilities = option.requireEmployee.minAbility
        if (abilities.coding && emp.abilities.coding < abilities.coding) return false
        if (abilities.design && emp.abilities.design < abilities.design) return false
        if (abilities.communication && emp.abilities.communication < abilities.communication) return false
        if (abilities.efficiency && emp.abilities.efficiency < abilities.efficiency) return false
      }
      return true
    })
  }

  const rarityColor = EVENT_RARITY_COLORS[currentEvent.rarity]
  const rarityLabel = EVENT_RARITY_LABELS[currentEvent.rarity]

  return (
    <View className='event-modal-overlay' onClick={() => setCurrentEvent(null)}>
      <View className='event-modal' onClick={(e) => e.stopPropagation()}>
        <View className='event-header' style={{ borderBottomColor: rarityColor }}>
          <Text className='event-rarity' style={{ color: rarityColor }}>
            {rarityLabel}
          </Text>
          <Text className='event-title'>{currentEvent.title}</Text>
        </View>

        <View className='event-content'>
          <Text className='event-description'>{currentEvent.description}</Text>
        </View>

        <View className='event-options'>
          {currentEvent.options.map((option) => {
            const available = isOptionAvailable(option)
            return (
              <View
                key={option.id}
                className={`event-option ${available ? '' : 'locked'}`}
                onClick={() => available && handleOptionClick(option)}
              >
                <Text className='option-text'>{option.text}</Text>
                {!available && (
                  <Text className='option-locked'>需要特定员工</Text>
                )}
                <View className='option-effects'>
                  {option.reward && (
                    <View className='option-rewards'>
                      {option.reward.gold && <Text className='effect-item gain'>💰+{option.reward.gold}</Text>}
                      {option.reward.power && <Text className='effect-item gain'>⚡+{option.reward.power}</Text>}
                      {option.reward.reputation && <Text className='effect-item gain'>🏆+{option.reward.reputation}</Text>}
                      {option.reward.exp && <Text className='effect-item gain'>✨+{option.reward.exp}</Text>}
                    </View>
                  )}
                  {option.penalty && (
                    <View className='option-penalties'>
                      {option.penalty.gold && <Text className='effect-item loss'>💰{option.penalty.gold}</Text>}
                      {option.penalty.power && <Text className='effect-item loss'>⚡{option.penalty.power}</Text>}
                    </View>
                  )}
                </View>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

export default EventModal
