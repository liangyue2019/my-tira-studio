export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getNow(): number {
  return Date.now()
}

export function getSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

export function isToday(timestamp: number): boolean {
  const now = new Date()
  const date = new Date(timestamp)
  return (
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()
  )
}

export function getTimeDiff(seconds: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - seconds
  
  if (diff < 60) {
    return '刚刚'
  }
  if (diff < 3600) {
    return `${Math.floor(diff / 60)}分钟前`
  }
  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}小时前`
  }
  return `${Math.floor(diff / 86400)}天前`
}
