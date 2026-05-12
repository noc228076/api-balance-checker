<template>
  <div class="app" :class="{ 'dark-mode': isDark }">
    <header class="app-header">
      <div class="header-left">
        <h1 class="app-title">
          <span class="title-icon">🔑</span>
          API 余额查询
        </h1>
        <span class="app-subtitle">多平台 Token 额度管理工具</span>
      </div>
      <div class="header-right">
        <button class="theme-toggle" @click="isDark = !isDark" :title="isDark ? '切换亮色' : '切换暗色'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
        <button class="btn-settings" @click="showSettings = true" title="设置">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
        <button class="btn-add" @click="showModal = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          添加 Key
        </button>
      </div>
    </header>

    <!-- 统计栏 -->
    <div class="stats-bar" v-if="hasResults">
      <div class="stat-item">
        <span class="stat-value">{{ store.keys.length }}</span>
        <span class="stat-label">API Keys</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${{ totalRemaining }}</span>
        <span class="stat-label">总剩余额度</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${{ totalUsed }}</span>
        <span class="stat-label">总已使用</span>
      </div>
      <button class="btn-refresh-all" @click="refreshAll">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        全部刷新
      </button>
    </div>

    <!-- 卡片网格 -->
    <div class="cards-grid" v-if="store.keys.length">
      <BalanceCard
        v-for="key in store.keys"
        :key="key.id"
        :key-data="key"
        :result="store.results[key.id]"
        :is-loading="!!store.loading[key.id]"
        @refresh="queryBalance(key)"
        @edit="editKey(key)"
        @delete="removeKey(key.id)"
      />
    </div>

    <!-- 空状态 -->
    <div class="empty-state" v-else>
      <div class="empty-icon">🔑</div>
      <h2>还没有添加任何 API Key</h2>
      <p>点击右上角「添加 Key」按钮开始管理你的 API 额度</p>
      <button class="btn-add-empty" @click="showModal = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        添加第一个 Key
      </button>
    </div>

    <!-- 图表 -->
    <BalanceChart
      v-if="hasResults"
      :keys="store.keys"
      :results="store.results"
      :providers="PROVIDERS"
    />

    <!-- 添加/编辑弹窗 -->
    <AddKeyModal
      :visible="showModal"
      :edit-data="editingKey"
      @close="() => { showModal = false; editingKey = null }"
      @save="handleAddKey"
    />

    <!-- 设置弹窗 -->
    <SettingsModal
      :visible="showSettings"
      :is-dark="isDark"
      @close="showSettings = false"
      @toggle-theme="isDark = !isDark"
    />

    <!-- 确认弹窗 -->
    <ConfirmModal
      :visible="showConfirm"
      :title="confirmData.title"
      :message="confirmData.message"
      @confirm="handleConfirm"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { store } from './stores/keyStore.js'
import PROVIDERS from './api/providers.js'
import BalanceCard from './components/BalanceCard.vue'
import BalanceChart from './components/BalanceChart.vue'
import AddKeyModal from './components/AddKeyModal.vue'
import SettingsModal from './components/SettingsModal.vue'
import ConfirmModal from './components/ConfirmModal.vue'

const showModal = ref(false)
const showSettings = ref(false)
const showConfirm = ref(false)
const isDark = ref(false)
const editingKey = ref(null)
const confirmCallback = ref(null)
const confirmData = ref({ title: '', message: '' })

const hasResults = computed(() => {
  return store.keys.some(k => store.results[k.id] && !store.results[k.id].error)
})

const totalRemaining = computed(() => {
  let sum = 0
  for (const k of store.keys) {
    const r = store.results[k.id]
    if (r && !r.error) sum += r.remaining || 0
  }
  return sum.toFixed(4)
})

const totalUsed = computed(() => {
  let sum = 0
  for (const k of store.keys) {
    const r = store.results[k.id]
    if (r && !r.error) sum += r.used || 0
  }
  return sum.toFixed(4)
})

function handleAddKey(data) {
  if (editingKey.value) {
    // 编辑模式
    store.updateKey(editingKey.value.id, data)
    const key = store.keys.find(k => k.id === editingKey.value.id)
    if (key) queryBalance(key)
    editingKey.value = null
  } else {
    // 添加模式
    store.addKey(data)
    const key = store.keys[store.keys.length - 1]
    queryBalance(key)
  }
  showModal.value = false
}

async function queryBalance(key) {
  const provider = PROVIDERS[key.provider]
  if (!provider) return

  store.setLoading(key.id, true)
  try {
    const result = await provider.queryBalance(key.apiKey, key.baseUrl)
    store.setResult(key.id, result)
  } catch (e) {
    store.setResult(key.id, { error: e.message || '查询失败' })
  } finally {
    store.setLoading(key.id, false)
  }
}

function editKey(keyData) {
  editingKey.value = { ...keyData }
  showModal.value = true
}

function removeKey(id) {
  const key = store.keys.find(k => k.id === id)
  confirmData.value = {
    title: '确认删除',
    message: `确定要删除 API Key "${key?.name || '未命名'}" 吗？此操作不可恢复。`
  }
  confirmCallback.value = () => {
    store.removeKey(id)
    showConfirm.value = false
  }
  showConfirm.value = true
}

function handleConfirm() {
  if (confirmCallback.value) {
    confirmCallback.value()
    confirmCallback.value = null
  }
}

function refreshAll() {
  store.keys.forEach(k => queryBalance(k))
}

onMounted(() => {
  if (store.keys.length) {
    store.keys.forEach(k => queryBalance(k))
  }
})
</script>

<style>
:root {
  --bg-body: #f0f2f5;
  --bg-card: #ffffff;
  --bg-input: #f5f7fa;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border: #e2e8f0;
  --accent: #6366f1;
}
.dark-mode {
  --bg-body: #0a0e1a;
  --bg-card: #1a1f2e;
  --bg-input: #252b3d;
  --text-primary: #e2e8f0;
  --text-secondary: #a0aec0;
  --border: #2d3748;
  --accent: #818cf8;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: var(--bg-body);
  color: var(--text-primary);
  min-height: 100vh;
}
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.app-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
}
.title-icon {
  font-size: 30px;
}
.app-subtitle {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.theme-toggle:hover {
  border-color: var(--accent);
}
.btn-settings {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-settings:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.btn-add {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-add:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.stats-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.stat-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 24px;
  flex: 1;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: var(--accent);
}
.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}
.btn-refresh-all {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid var(--accent);
  background: var(--bg-card);
  color: var(--accent);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 140px;
  height: auto;
}
.btn-refresh-all:hover {
  background: var(--accent);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}
.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}
.empty-state h2 {
  font-size: 22px;
  margin-bottom: 8px;
  color: var(--text-primary);
}
.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}
.btn-add-empty {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 12px;
  border: none;
  background: var(--accent);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-add-empty:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .cards-grid {
    grid-template-columns: 1fr;
  }
  .stats-bar {
    flex-direction: column;
  }
}
</style>
