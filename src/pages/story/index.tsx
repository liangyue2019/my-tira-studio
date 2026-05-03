import React, { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import { useGameStore } from '../../stores/game'
import { useResourceStore } from '../../stores/resource'
import { useEmployeeStore } from '../../stores/employee'
import { useProjectStore } from '../../stores/project'
import './index.scss'

function Story() {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const storyChapters = useGameStore((state) => state.storyChapters)
  const updateStoryChapter = useGameStore((state) => state.updateStoryChapter)
  const day = useGameStore((state) => state.day)
  const resources = useResourceStore((state) => state.resources)

  const checkUnlock = (chapter: any) => {
    const req = chapter.unlockRequirement
    if (req.day && day < req.day) return false
    if (req.reputation && resources.reputation < req.reputation) return false
    if (req.gold && resources.gold < req.gold) return false
    if (req.employees) {
      const employees = useEmployeeStore.getState().employees
      if (employees.length < req.employees) return false
    }
    if (req.projects) {
      const completedCount = useProjectStore.getState().completedProjectCount
      if (completedCount < req.projects) return false
    }
    return true
  }

  const handleReadChapter = (chapter: any) => {
    if (!chapter.isUnlocked) {
      const nowUnlocked = checkUnlock(chapter)
      if (nowUnlocked) {
        updateStoryChapter(chapter.id, { isUnlocked: true })
        setSelectedChapter(chapter.id)
      } else {
        showToast({ title: '尚未解锁', icon: 'none' })
      }
      return
    }
    setSelectedChapter(chapter.id)
    if (!chapter.isRead) {
      updateStoryChapter(chapter.id, { isRead: true })
    }
  }

  const handleBack = () => {
    setSelectedChapter(null)
  }

  return (
    <View className='story'>
      <View className='header'>
        <Text className='title'>剧情模式</Text>
      </View>

      {!selectedChapter ? (
        <View className='chapter-list'>
          {storyChapters.map((chapter) => (
            <View
              key={chapter.id}
              className={`chapter-item ${chapter.isUnlocked ? 'unlocked' : 'locked'}`}
              onClick={() => handleReadChapter(chapter)}
            >
              <Text className='chapter-title'>{chapter.title}</Text>
              <Text className='chapter-status'>
                {chapter.isUnlocked ? (chapter.isRead ? '📖 已读' : '🆕 未读') : '🔒 未解锁'}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View className='chapter-content'>
          {storyChapters
            .filter((c) => c.id === selectedChapter)
            .map((chapter) => (
              <View key={chapter.id}>
                <Text className='content-title'>{chapter.title}</Text>
                <View className='content-text'>
                  {chapter.content.split('\n').map((paragraph, index) => (
                    <Text key={index} className='paragraph'>
                      {paragraph}
                    </Text>
                  ))}
                </View>
                <Button className='back-btn' onClick={handleBack}>
                  返回章节列表
                </Button>
              </View>
            ))}
        </View>
      )}
    </View>
  )
}

export default Story
