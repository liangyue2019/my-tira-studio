import React, { useEffect } from 'react'
import { useLaunch } from '@tarojs/taro'
import { useGameStore } from './stores/game'
import { useResourceStore } from './stores/resource'
import './app.scss'
import { startGameLoop } from './services/gameLoop'

function App({ children }: any) {
  console.log('AI 工作室游戏启动')
  useLaunch(() => {
    console.log('AI 工作室游戏启动')
  })

  const { initializeGame } = useGameStore()
  const { loadResources } = useResourceStore()

  useEffect(() => {
    // 初始化游戏
    initializeGame()
    // 加载资源
    loadResources()
    // 启动游戏循环
    const stopGameLoop = startGameLoop()
    
    return () => {
      stopGameLoop()
    }
  }, [])

  return children
}

export default App
