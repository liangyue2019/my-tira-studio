import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useProjectStore } from '../../stores/project'
import { useEmployeeStore } from '../../stores/employee'
import { formatNumber, formatTime } from '../../utils/format'
import './index.scss'

function Project() {
  const projects = useProjectStore((state) => state.projects)
  const availableProjects = useProjectStore((state) => state.availableProjects)
  const addProject = useProjectStore((state) => state.addProject)
  const employees = useEmployeeStore((state) => state.employees)
  const idleEmployees = employees.filter(e => !e.isWorking)

  const handleAcceptProject = (project: any) => {
    addProject(project)
    Taro.showToast({
      title: '已接受项目',
      icon: 'success'
    })
  }

  const getColorByDifficulty = (difficulty: number) => {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0']
    return colors[difficulty - 1] || '#999'
  }

  return (
    <View className="project">
      <View className="header">
        <Text className="title">项目任务</Text>
      </View>

      <View className="section">
        <Text className="section-title">进行中项目 ({projects.length})</Text>
        {projects.length === 0 ? (
          <View className="empty-state">
            <Text className="empty-text">暂无进行中项目</Text>
          </View>
        ) : (
          projects.map((project) => (
            <View 
              key={project.id} 
              className="project-card"
              style={{ borderLeftColor: getColorByDifficulty(project.difficulty) }}
            >
              <Text className="project-name">{project.name}</Text>
              <Text className="project-client">客户：{project.client}</Text>
              <View className="project-requirements">
                <Text className="req-item">编程：{project.requirements.coding}</Text>
                <Text className="req-item">设计：{project.requirements.design}</Text>
                <Text className="req-item">沟通：{project.requirements.communication}</Text>
              </View>
              <View className="project-progress">
                <View className="progress-bar">
                  <View 
                    className="progress-fill"
                    style={{ width: `${project.progress * 100}%` }}
                  />
                </View>
                <Text className="progress-text">{(project.progress * 100).toFixed(1)}%</Text>
              </View>
              <View className="project-reward">
                <Text className="reward-item">💰 {formatNumber(project.reward.gold)}</Text>
                <Text className="reward-item">🏆 {formatNumber(project.reward.reputation)}</Text>
                <Text className="reward-item">✨ {formatNumber(project.reward.exp)}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View className="section">
        <Text className="section-title">可接受项目 ({availableProjects.length})</Text>
        {availableProjects.length === 0 ? (
          <View className="empty-state">
            <Text className="empty-text">暂无可用项目</Text>
          </View>
        ) : (
          availableProjects.map((project) => (
            <View 
              key={project.id} 
              className="available-card"
              style={{ borderLeftColor: getColorByDifficulty(project.difficulty) }}
            >
              <Text className="project-name">{project.name}</Text>
              <Text className="project-client">客户：{project.client}</Text>
              <Text className="project-difficulty">
                难度：{'★'.repeat(project.difficulty)}
              </Text>
              <View className="project-requirements">
                <Text className="req-item">编程：{project.requirements.coding}</Text>
                <Text className="req-item">设计：{project.requirements.design}</Text>
                <Text className="req-item">沟通：{project.requirements.communication}</Text>
              </View>
              <View className="project-reward">
                <Text className="reward-item">💰 {formatNumber(project.reward.gold)}</Text>
                <Text className="reward-item">🏆 {formatNumber(project.reward.reputation)}</Text>
                <Text className="reward-item">✨ {formatNumber(project.reward.exp)}</Text>
              </View>
              <Button 
                className="accept-btn"
                onClick={() => handleAcceptProject(project)}
              >
                接受项目
              </Button>
            </View>
          ))
        )}
      </View>

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

export default Project
