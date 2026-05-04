import React, { useEffect } from 'react'
import { useLaunch } from '@tarojs/taro'
import { useGameStore } from './stores/game'
import { useResourceStore } from './stores/resource'
import { useEmployeeStore } from './stores/employee'
import { useProjectStore } from './stores/project'
import { useEventStore } from './stores/event'
import './app.scss'

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__stores = {
    game: useGameStore,
    resource: useResourceStore,
    employee: useEmployeeStore,
    project: useProjectStore,
    event: useEventStore,
  }
}

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
