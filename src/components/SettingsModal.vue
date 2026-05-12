<template>
  <div class="settings-modal" v-if="visible">
    <div class="modal-overlay" @click="$emit('close')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3>⚙️ {{ t('settings.title') }}</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      
      <div class="modal-body">
        <!-- 主题设置 -->
        <div class="setting-section">
          <h4 class="section-title">🎨 {{ t('settings.appearance') }}</h4>
          
          <!-- 语言切换 -->
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">🌐 {{ t('settings.language') || '语言' }}</span>
              <span class="setting-desc">{{ t('settings.languageDesc') || '切换显示语言' }}</span>
            </div>
            <select class="language-select" :value="currentLocale" @change="handleLocaleChange">
              <option value="zh-CN">中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">{{ t('settings.darkMode') }}</span>
              <span class="setting-desc">{{ t('settings.darkModeDesc') }}</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" :checked="isDark" @change="$emit('toggle-theme')" />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <!-- 数据管理 -->
        <div class="setting-section">
          <h4 class="section-title">💾 {{ t('settings.dataManagement') }}</h4>
          
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">{{ t('settings.exportConfig') }}</span>
              <span class="setting-desc">{{ t('settings.exportConfigDesc') }}</span>
            </div>
            <button class="btn-action" @click="exportData">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {{ t('common.save') }}
            </button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">{{ t('settings.importConfig') }}</span>
              <span class="setting-desc">{{ t('settings.importConfigDesc') }}</span>
            </div>
            <button class="btn-action" @click="triggerImport">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {{ t('settings.importConfig') }}
            </button>
            <input type="file" ref="fileInput" accept=".json" @change="importData" style="display: none" />
          </div>

          <div class="setting-item danger">
            <div class="setting-info">
              <span class="setting-label">{{ t('settings.clearData') }}</span>
              <span class="setting-desc">{{ t('settings.clearDataDesc') }}</span>
            </div>
            <button class="btn-action btn-danger" @click="clearAllData">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              {{ t('common.delete') }}
            </button>
          </div>
        </div>

        <!-- 关于信息 -->
        <div class="setting-section">
          <h4 class="section-title">ℹ️ {{ t('settings.about') }}</h4>
          <div class="about-info">
            <div class="about-item">
              <span class="about-label">{{ t('settings.appName') }}</span>
              <span class="about-value">{{ t('app.title') }}</span>
            </div>
            <div class="about-item">
              <span class="about-label">{{ t('settings.version') }}</span>
              <span class="about-value">v1.0.0</span>
            </div>
            <div class="about-item">
              <span class="about-label">{{ t('settings.supportedPlatforms') }}</span>
              <span class="about-value platforms">
                OpenAI, Claude, Gemini, DeepSeek, SiliconFlow, ZhipuAI, OpenRouter, MiniMax, GitHub, Kimi, Mimo
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-close" @click="$emit('close')">{{ t('common.close') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { store } from '../stores/keyStore.js'
import { useI18n, setLocale } from '../locales/index.js'

const { t, currentLocale } = useI18n()

const props = defineProps({
  visible: Boolean,
  isDark: Boolean
})

const emit = defineEmits(['close', 'toggle-theme'])

const fileInput = ref(null)

function handleLocaleChange(event) {
  const newLocale = event.target.value
  setLocale(newLocale)
}

function exportData() {
  try {
    const data = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      keys: store.keys
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `api-balance-config-${new Date().getTime()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    alert('✅ 配置导出成功！')
  } catch (error) {
    console.error('导出失败:', error)
    alert('❌ 导出失败：' + error.message)
  }
}

function triggerImport() {
  fileInput.value?.click()
}

function importData(event) {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      if (!data.keys || !Array.isArray(data.keys)) {
        throw new Error('无效的配置文件格式')
      }

      if (confirm(`确定要导入 ${data.keys.length} 个 API Key 吗？这将覆盖现有配置。`)) {
        // 清除现有数据
        store.keys.splice(0, store.keys.length)
        Object.keys(store.results).forEach(key => delete store.results[key])
        Object.keys(store.loading).forEach(key => delete store.loading[key])
        
        // 导入新数据
        data.keys.forEach(key => {
          store.addKey(key)
        })
        
        alert('✅ 配置导入成功！')
        emit('close')
      }
    } catch (error) {
      console.error('导入失败:', error)
      alert('❌ 导入失败：' + error.message)
    }
  }
  reader.readAsText(file)
  
  // 清空 input，允许重复选择同一文件
  event.target.value = ''
}

function clearAllData() {
  if (confirm('⚠️ 确定要清除所有数据吗？此操作不可恢复！')) {
    if (confirm('再次确认：这将删除所有 API Key 和查询结果，是否继续？')) {
      store.keys.splice(0, store.keys.length)
      Object.keys(store.results).forEach(key => delete store.results[key])
      Object.keys(store.loading).forEach(key => delete store.loading[key])
      localStorage.clear()
      alert('✅ 已清除所有数据')
      emit('close')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
}
.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg-card);
  border-radius: 16px;
  width: 600px;
  max-width: 90vw;
  max-height: 85vh;
  z-index: 1000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}
.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: var(--text-primary);
}
.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: var(--text-secondary);
  cursor: pointer;
  line-height: 1;
}
.close-btn:hover {
  color: var(--text-primary);
}
.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}
.setting-section {
  margin-bottom: 28px;
}
.setting-section:last-child {
  margin-bottom: 0;
}
.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--border);
}
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}
.setting-item:last-child {
  border-bottom: none;
}
.setting-item.danger {
  background: rgba(239, 68, 68, 0.05);
  margin: 0 -12px;
  padding: 14px 12px;
  border-radius: 8px;
}
.setting-info {
  flex: 1;
  margin-right: 16px;
}
.setting-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.setting-desc {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
}
.btn-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-action:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.btn-danger {
  border-color: #ef4444;
  color: #ef4444;
}
.btn-danger:hover {
  background: #ef4444;
  color: #fff;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border);
  transition: 0.3s;
  border-radius: 26px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: var(--accent);
}
input:checked + .slider:before {
  transform: translateX(24px);
}

/* Language Select */
.language-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}
.language-select:hover {
  border-color: var(--accent);
}
.language-select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* About Info */
.about-info {
  background: var(--bg-input);
  border-radius: 10px;
  padding: 16px;
}
.about-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
}
.about-item:last-child {
  border-bottom: none;
}
.about-label {
  font-size: 13px;
  color: var(--text-secondary);
}
.about-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: right;
  max-width: 60%;
}
.about-value.platforms {
  font-size: 11px;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}
.btn-close {
  padding: 10px 24px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-close:hover {
  border-color: var(--accent);
  color: var(--accent);
}
</style>