export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/employee/index',
    'pages/project/index',
    'pages/shop/index',
    'pages/achievement/index',
    'pages/story/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#667eea',
    navigationBarTitleText: 'AI 工作室',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#667eea',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '工作室'
      },
      {
        pagePath: 'pages/employee/index',
        text: '员工'
      },
      {
        pagePath: 'pages/project/index',
        text: '项目'
      },
      {
        pagePath: 'pages/shop/index',
        text: '商店'
      },
      {
        pagePath: 'pages/achievement/index',
        text: '成就'
      }
    ]
  }
})
