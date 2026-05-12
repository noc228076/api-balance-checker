import { ref } from 'vue'
import zhCN from './zh-CN.js'
import enUS from './en-US.js'

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

// 从 localStorage 读取语言设置，默认为中文
const savedLocale = localStorage.getItem('locale') || 'zh-CN'
const currentLocale = ref(savedLocale)

// 获取翻译文本
export function t(key, params = {}) {
  const keys = key.split('.')
  let value = messages[currentLocale.value]
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k]
    } else {
      return key // 如果找不到翻译，返回键名
    }
  }
  
  // 替换参数
  if (typeof value === 'string' && Object.keys(params).length > 0) {
    let result = value
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), paramValue)
    })
    return result
  }
  
  return value || key
}

// 切换语言
export function setLocale(locale) {
  currentLocale.value = locale
  localStorage.setItem('locale', locale)
}

// 获取当前语言
export function getLocale() {
  return currentLocale.value
}

// 获取所有支持的语言
export function getSupportedLocales() {
  return Object.keys(messages)
}

// 获取语言显示名称
export function getLocaleName(locale) {
  const names = {
    'zh-CN': '中文',
    'en-US': 'English'
  }
  return names[locale] || locale
}
