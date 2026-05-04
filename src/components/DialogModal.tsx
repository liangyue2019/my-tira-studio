import { View, Text } from '@tarojs/components'
import { useGameStore } from '../stores/game'
import type { DialogOption } from '../types'
import './DialogModal.scss'

const CHARACTER_LABELS: Record<string, string> = {
  tira: '白夜 tira',
  rei: '零'
}

function DialogModal() {
  const currentDialogId = useGameStore((state) => state.currentDialogId)
  const dialogs = useGameStore((state) => state.dialogs)
  const selectDialogOption = useGameStore((state) => state.selectDialogOption)
  const hideDialog = useGameStore((state) => state.hideDialog)
  const characterAffinity = useGameStore((state) => state.characterAffinity)

  if (!currentDialogId) return null

  const dialog = dialogs.find((d) => d.id === currentDialogId)
  if (!dialog) return null

  const isStoryDialog = dialog.id.startsWith('story_')

  const handleOptionClick = (option: DialogOption) => {
    selectDialogOption(dialog.id, option)
  }

  const getAffinityText = (character: string, amount: number) => {
    const label = CHARACTER_LABELS[character] || character
    if (amount > 0) return `${label} 好感度 +${amount}`
    if (amount < 0) return `${label} 好感度 ${amount}`
    return ''
  }

  return (
    <View className='dialog-modal-overlay' onClick={hideDialog}>
      <View className={`dialog-modal ${isStoryDialog ? 'story-dialog' : ''}`} onClick={(e) => e.stopPropagation()}>
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
              <View className='dialog-option-effects'>
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
                {option.affinityEffect && option.affinityEffect.amount !== 0 && (
                  <Text className={`affinity-item ${option.affinityEffect.amount > 0 ? 'positive' : 'negative'}`}>
                    💝 {getAffinityText(option.affinityEffect.character, option.affinityEffect.amount)}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
        {isStoryDialog && (
          <View className='dialog-affinity-bar'>
            <Text className='affinity-label'>好感度</Text>
            <View className='affinity-chars'>
              <Text className='affinity-char'>💝 白夜 tira: {characterAffinity.tira}</Text>
              <Text className='affinity-char'>💝 零: {characterAffinity.rei}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default DialogModal
