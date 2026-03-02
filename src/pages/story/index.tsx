import React, { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useGameStore } from '../../stores/game'
import { STORY_CHAPTERS } from '../../constants/story'
import './index.scss'

function Story() {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const chapters = STORY_CHAPTERS

  const handleReadChapter = (chapter: any) => {
    if (!chapter.isUnlocked) {
      Taro.showToast({
        title: '尚未解锁',
        icon: 'none'
      })
      return
    }
    setSelectedChapter(chapter.id)
  }

  const handleBack = () => {
    setSelectedChapter(null)
  }

  return (
    <View className="story">
      <View className="header">
        <Text className="title">剧情模式</Text>
      </View>

      {!selectedChapter ? (
        <View className="chapter-list">
          {chapters.map((chapter) => (
            <View
              key={chapter.id}
              className={`chapter-item ${chapter.isUnlocked ? 'unlocked' : 'locked'}`}
              onClick={() => handleReadChapter(chapter)}
            >
              <Text className="chapter-title">{chapter.title}</Text>
              <Text className="chapter-status">
                {chapter.isUnlocked ? '🔓 已解锁' : '🔒 未解锁'}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View className="chapter-content">
          {chapters
            .filter((c) => c.id === selectedChapter)
            .map((chapter) => (
              <View key={chapter.id}>
                <Text className="content-title">{chapter.title}</Text>
                <View className="content-text">
                  {chapter.content.split('\n').map((paragraph, index) => (
                    <Text key={index} className="paragraph">
                      {paragraph}
                    </Text>
                  ))}
                </View>
                <Button className="back-btn" onClick={handleBack}>
                  返回章节列表
                </Button>
              </View>
            ))}
        </View>
      )}

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

export default Story
