<template>
  <div class="chart-panel">
    <h3 class="chart-title">额度概览</h3>
    <div class="chart-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['chart-tab', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >{{ tab.label }}</button>
    </div>
    <div class="chart-container">
      <Bar v-if="activeTab === 'bar'" :data="barData" :options="barOptions" />
      <Doughnut v-else-if="activeTab === 'doughnut'" :data="doughnutData" :options="doughnutOptions" />
      <Bar v-else :data="stackedData" :options="stackedOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const props = defineProps({
  keys: Array,
  results: Object,
  providers: Object
})

const tabs = [
  { key: 'bar', label: '柱状图' },
  { key: 'doughnut', label: '饼图' },
  { key: 'stacked', label: '堆叠图' }
]
const activeTab = ref('bar')

const validEntries = computed(() => {
  return props.keys.filter(k => props.results[k.id] && !props.results[k.id].error)
})

const labels = computed(() => validEntries.value.map(k => k.name))
const colors = computed(() => validEntries.value.map(k => props.providers[k.provider]?.color || '#8b5cf6'))

const barData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: '剩余额度',
      data: validEntries.value.map(k => props.results[k.id]?.remaining || 0),
      backgroundColor: colors.value.map(c => c + '99'),
      borderColor: colors.value,
      borderWidth: 2,
      borderRadius: 8
    },
    {
      label: '已使用',
      data: validEntries.value.map(k => props.results[k.id]?.used || 0),
      backgroundColor: 'rgba(239, 68, 68, 0.4)',
      borderColor: '#ef4444',
      borderWidth: 2,
      borderRadius: 8
    }
  ]
}))

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', usePointStyle: true } }
  },
  scales: {
    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } }
  }
}

const doughnutData = computed(() => ({
  labels: labels.value,
  datasets: [{
    data: validEntries.value.map(k => props.results[k.id]?.remaining || 0),
    backgroundColor: colors.value.map(c => c + 'cc'),
    borderColor: 'transparent',
    borderWidth: 2,
    hoverOffset: 8
  }]
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '55%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#94a3b8', usePointStyle: true, padding: 16 }
    }
  }
}

const stackedData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: '已使用',
      data: validEntries.value.map(k => props.results[k.id]?.used || 0),
      backgroundColor: 'rgba(239, 68, 68, 0.6)',
      borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 8, bottomRight: 8 }
    },
    {
      label: '剩余额度',
      data: validEntries.value.map(k => props.results[k.id]?.remaining || 0),
      backgroundColor: colors.value.map(c => c + '99'),
      borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 }
    }
  ]
}))

const stackedOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', usePointStyle: true } }
  },
  scales: {
    x: { stacked: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
    y: { stacked: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } }
  }
}
</script>

<style scoped>
.chart-panel {
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 24px;
}
.chart-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}
.chart-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.chart-tab {
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-input);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.chart-tab.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.chart-container {
  height: 300px;
  position: relative;
}
</style>
