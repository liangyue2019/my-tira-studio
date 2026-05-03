import React, { useEffect } from 'react'
import { useLaunch } from '@tarojs/taro'
import { useGameStore } from './stores/game'
import './app.scss'

function App({ children }: any) {
  useLaunch(() => {
    console.log('AI 工作室游戏启动')
  })

  const { initializeGame } = useGameStore()

  useEffect(() => {
    initializeGame()
  }, [])

  return children
}

export default App
