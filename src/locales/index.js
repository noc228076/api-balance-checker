import { ref, computed } from 'vue'
import zhCN from './zh-CN.js'
import enUS from './en-US.js'

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

// 从 localStorage 读取语言设置，默认为中文
const savedLocale = localStorage.getItem('locale') || 'zh-CN'
const currentLocale = ref(savedLocale)

// 获取翻译文本的核心函数
function translate(key, params = {}) {
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

// 创建响应式的翻译函数 - 用于组件中使用
export function useI18n() {
  // 创建一个计算属性，当 currentLocale 变化时自动重新计算
  const t = (key, params = {}) => {
    // 访问 currentLocale.value 以建立响应式依赖
    const _locale = currentLocale.value
    return translate(key, params)
  }
  
  return { t, currentLocale }
}

// 非响应式版本 - 用于不需要响应式的场景
export function t(key, params = {}) {
  return translate(key, params)
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
