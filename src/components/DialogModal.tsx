import { View, Text } from '@tarojs/components'
import { useGameStore } from '../stores/game'
import type { DialogOption } from '../types'
import './DialogModal.scss'

function DialogModal() {
  const currentDialogId = useGameStore((state) => state.currentDialogId)
  const dialogs = useGameStore((state) => state.dialogs)
  const selectDialogOption = useGameStore((state) => state.selectDialogOption)
  const hideDialog = useGameStore((state) => state.hideDialog)

  if (!currentDialogId) return null

  const dialog = dialogs.find((d) => d.id === currentDialogId)
  if (!dialog) return null

  const handleOptionClick = (option: DialogOption) => {
    selectDialogOption(dialog.id, option)
  }

  return (
    <View className='dialog-modal-overlay' onClick={hideDialog}>
      <View className='dialog-modal' onClick={(e) => e.stopPropagation()}>
        <View className='dialog-header'>
          {dialog.avatar && (
            <View className='dialog-avatar'>
              <img src={dialog.avatar} alt={dialog.speaker} />
            </View>
          )}
          <View className='dialog-header-text'>
            {dialog.speaker && (
              <Text className='dialog-speaker'>{dialog.speaker}</Text>
            )}
            <Text className='dialog-title'>{dialog.title}</Text>
          </View>
        </View>
        <View className='dialog-content'>
          <Text className='dialog-text'>{dialog.text}</Text>
        </View>
        <View className='dialog-options'>
          {dialog.options.map((option) => (
            <View
              key={option.id}
              className='dialog-option'
              onClick={() => handleOptionClick(option)}
            >
              <Text className='dialog-option-text'>{option.text}</Text>
              {option.reward && (
                <View className='dialog-option-reward'>
                  {option.reward.gold && (
                    <Text className='reward-item'>💰+{option.reward.gold}</Text>
                  )}
                  {option.reward.power && (
                    <Text className='reward-item'>⚡+{option.reward.power}</Text>
                  )}
                  {option.reward.reputation && (
                    <Text className='reward-item'>🏆+{option.reward.reputation}</Text>
                  )}
                  {option.reward.exp && (
                    <Text className='reward-item'>✨+{option.reward.exp}</Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default DialogModal
