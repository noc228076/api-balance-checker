<template>
  <div class="balance-card" :style="{ '--card-accent': providerInfo.color }">
    <div class="card-header">
      <div class="card-title-row">
        <span class="card-icon">{{ providerInfo.icon }}</span>
        <div class="card-title-info">
          <h3 class="card-name">{{ keyData.name }}</h3>
          <span class="card-provider" :style="{ color: providerInfo.color }">{{ providerInfo.name }}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="action-btn refresh" @click="$emit('refresh')" :disabled="isLoading" :title="t('card.refresh')">
          <svg :class="{ spinning: isLoading }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        </button>
        <button class="action-btn edit" @click="$emit('edit')" :title="t('card.edit')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="action-btn delete" @click="$emit('delete')" :title="t('card.delete')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="card-loading">
      <div class="loading-spinner"></div>
      <span>{{ t('card.querying') }}</span>
    </div>

    <!-- Error State -->
    <div v-else-if="result?.error" class="card-error">
      <span class="error-icon">⚠️</span>
      <div class="error-content">
        <span class="error-text">{{ result.error }}</span>
        <span v-if="keyData.provider === 'openai' && result.error.includes('403')" class="error-hint" v-html="t('errors.openai403Hint')">
        </span>
        <span v-else-if="keyData.provider === 'siliconflow'" class="error-hint">
          {{ t('card.siliconflowHint') }}
        </span>
        <span v-else-if="keyData.provider === 'zhipuai'" class="error-hint">
          {{ t('card.zhipuaiHint') }}
        </span>
      </div>
    </div>

    <!-- Result -->
    <div v-else-if="result" class="card-result">
      <div class="balance-overview">
        <div class="balance-main">
          <span class="balance-label">{{ t('card.remaining') }}</span>
          <span class="balance-value" :style="{ color: providerInfo.color }">
            {{ currencySymbol }}{{ formatNum(result.remaining) }}
          </span>
        </div>
        <div class="balance-ring-container">
          <svg class="balance-ring" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" stroke-width="6"/>
            <circle cx="40" cy="40" r="34" fill="none"
              :stroke="providerInfo.color"
              stroke-width="6"
              stroke-linecap="round"
              :stroke-dasharray="ringCircumference"
              :stroke-dashoffset="ringOffset"
              transform="rotate(-90 40 40)"
              class="ring-progress"
            />
          </svg>
          <span class="ring-text">{{ usagePercent }}%</span>
        </div>
      </div>

      <div class="balance-details">
        <div class="detail-item">
          <span class="detail-label">{{ t('card.total') }}</span>
          <span class="detail-value">{{ currencySymbol }}{{ formatNum(result.total) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ t('card.used') }}</span>
          <span class="detail-value used">{{ currencySymbol }}{{ formatNum(result.used) }}</span>
        </div>
        <div class="detail-item" v-if="result.expiresAt">
          <span class="detail-label">{{ t('card.expiresAt') }}</span>
          <span class="detail-value">{{ result.expiresAt }}</span>
        </div>
      </div>

      <div class="balance-bar">
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: usagePercent + '%', background: providerInfo.color }"></div>
        </div>
        <div class="bar-labels">
          <span>{{ t('card.usedPercent', { percent: usagePercent }) }}</span>
          <span>{{ t('card.remainingPercent', { percent: remainPercent }) }}</span>
        </div>
      </div>

      <div class="card-footer">
        <span>{{ t('card.lastUpdate') }} {{ result.queriedAt || t('card.never') }}</span>
      </div>
      
      <!-- 余额为 0 的提示 -->
      <div v-if="result.remaining === 0 && result.total > 0" class="zero-balance-note">
        {{ t('errors.balanceZeroNote') }}
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card-empty">
      <span>{{ t('card.noData') }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PROVIDERS from '../api/providers.js'
import { useI18n } from '../locales/index.js'

const { t } = useI18n()

const props = defineProps({
  keyData: Object,
  result: Object,
  isLoading: Boolean
})

defineEmits(['refresh', 'edit', 'delete'])

const providerInfo = computed(() => PROVIDERS[props.keyData.provider] || PROVIDERS.custom)

const currencySymbol = computed(() => {
  const c = props.result?.currency
  if (c === 'CNY') return '¥'
  if (c === 'EUR') return '€'
  return '$'
})

const ringCircumference = 2 * Math.PI * 34

const usagePercent = computed(() => {
  if (!props.result || !props.result.total) return 0
  return Math.min(100, Math.round((props.result.used / props.result.total) * 100))
})

const remainPercent = computed(() => 100 - usagePercent.value)

const ringOffset = computed(() => {
  const pct = props.result?.total ? (props.result.remaining / props.result.total) : 0
  return ringCircumference * (1 - Math.min(1, pct))
})

function formatNum(n) {
  if (n == null) return '0.0000'
  return Number(n).toFixed(4)
}
</script>

<style scoped>
.balance-card {
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.balance-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--card-accent);
  border-radius: 16px 16px 0 0;
}
.balance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}
.card-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.card-icon {
  font-size: 28px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-accent);
  background: color-mix(in srgb, var(--card-accent) 15%, transparent);
  border-radius: 12px;
}
.card-name {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}
.card-provider {
  font-size: 12px;
  font-weight: 600;
}
.card-actions {
  display: flex;
  gap: 6px;
}
.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-input);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.action-btn:hover {
  color: var(--text-primary);
  border-color: var(--text-secondary);
}
.action-btn.delete:hover {
  color: #ef4444;
  border-color: #ef4444;
}
.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.spinning {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Loading */
.card-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 30px 0;
  color: var(--text-secondary);
}
.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--card-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Error */
.card-error {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 16px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 10px;
  color: #ef4444;
  font-size: 13px;
}
.error-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.error-text {
  line-height: 1.5;
}
.error-hint {
  font-size: 12px;
  color: #f87171;
  opacity: 0.9;
}

/* Result */
.balance-overview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.balance-label {
  font-size: 13px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 4px;
}
.balance-value {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -1px;
}
.balance-ring-container {
  position: relative;
  width: 72px;
  height: 72px;
}
.balance-ring {
  width: 100%;
  height: 100%;
}
.ring-progress {
  transition: stroke-dashoffset 0.6s ease;
}
.ring-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.balance-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}
.detail-item {
  background: var(--bg-body);
  padding: 10px 14px;
  border-radius: 10px;
}
.detail-label {
  font-size: 11px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 2px;
}
.detail-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}
.detail-value.used {
  color: #ef4444;
}

.balance-bar {
  margin-bottom: 12px;
}
.bar-track {
  height: 8px;
  background: var(--bg-body);
  border-radius: 4px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}
.bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 6px;
}

.query-time {
  font-size: 11px;
  color: var(--text-secondary);
  text-align: right;
}

.card-empty {
  text-align: center;
  padding: 30px 0;
  color: var(--text-secondary);
}

.zero-balance-note {
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(99, 102, 241, 0.1);
  border-left: 3px solid var(--accent);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
