<template>
  <div class="add-key-modal" v-if="visible">
    <div class="modal-overlay" @click="$emit('close')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ editMode ? t('addModal.editTitle') : t('addModal.title') }}</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>{{ t('addModal.name') }}</label>
          <input v-model="form.name" :placeholder="t('addModal.namePlaceholder')" />
        </div>
        <div class="form-group">
          <label>{{ t('addModal.provider') }}</label>
          <div class="provider-select">
            <button
              v-for="(p, key) in providers"
              :key="key"
              :class="['provider-btn', { active: form.provider === key }]"
              :style="form.provider === key ? { borderColor: p.color, background: p.color + '15' } : {}"
              @click="form.provider = key"
            >
              <span class="provider-icon">{{ p.icon }}</span>
              <span>{{ p.name }}</span>
            </button>
          </div>
        </div>
        <div class="form-group">
          <label>{{ t('addModal.apiKey') }}</label>
          <input v-model="form.apiKey" type="password" :placeholder="t('addModal.apiKeyPlaceholder')" />
        </div>
        <div class="form-group">
          <label>{{ t('addModal.baseUrl') }} <span class="optional">({{ t('addModal.optional') || '可选，中转站需要填写' }})</span></label>
          <input v-model="form.baseUrl" :placeholder="currentProvider?.baseUrl || t('addModal.baseUrlPlaceholder')" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">{{ t('common.cancel') }}</button>
        <button class="btn-save" @click="handleSave" :disabled="!canSave">
          {{ editMode ? t('common.save') : t('nav.addKey') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import PROVIDERS from '../api/providers.js'
import { t } from '../locales/index.js'

const props = defineProps({
  visible: Boolean,
  editData: Object
})
const emit = defineEmits(['close', 'save'])

const providers = PROVIDERS

const editMode = computed(() => !!props.editData)

const form = reactive({
  name: '',
  provider: 'openai',
  apiKey: '',
  baseUrl: ''
})

// 监听 editData 变化，重置表单
watch(() => props.editData, (newData) => {
  if (newData) {
    form.name = newData.name || ''
    form.provider = newData.provider || 'openai'
    form.apiKey = newData.apiKey || ''
    form.baseUrl = newData.baseUrl || ''
  } else {
    // 重置表单
    form.name = ''
    form.provider = 'openai'
    form.apiKey = ''
    form.baseUrl = ''
  }
}, { immediate: true })

const currentProvider = computed(() => providers[form.provider])

// 生成默认名称
function getDefaultName() {
  const provider = providers[form.provider]
  const timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  return `${provider?.name || 'API'} ${timestamp}`
}

// 检查是否可以保存（只需要 API Key 和 provider）
const canSave = computed(() => form.apiKey && form.provider)

function handleSave() {
  if (!canSave.value) return
  
  // 如果没有填写名称，使用默认名称
  const saveData = {
    name: form.name || getDefaultName(),
    provider: form.provider,
    apiKey: form.apiKey,
    baseUrl: form.baseUrl
  }
  
  emit('save', saveData)
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
  width: 520px;
  max-width: 90vw;
  z-index: 1000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
  font-size: 18px;
  color: var(--text-primary);
}
.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
}
.modal-body {
  padding: 24px;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
.optional {
  font-weight: 400;
  color: var(--text-secondary);
  font-size: 12px;
}
.form-group input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.form-group input:focus {
  border-color: var(--accent);
}
.provider-select {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.provider-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 2px solid var(--border);
  background: var(--bg-input);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.provider-btn:hover {
  border-color: var(--text-secondary);
}
.provider-btn.active {
  font-weight: 600;
}
.provider-icon {
  font-size: 18px;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}
.btn-cancel, .btn-save {
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel {
  background: var(--bg-input);
  color: var(--text-secondary);
}
.btn-save {
  background: var(--accent);
  color: #fff;
}
.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
