import { reactive, watch } from 'vue'

const STORAGE_KEY = 'api-balance-keys'

function loadKeys() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveKeys(keys) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
}

export const store = reactive({
  keys: loadKeys(),
  results: {},
  loading: {},

  addKey(entry) {
    entry.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    this.keys.push(entry)
    saveKeys(this.keys)
  },

  removeKey(id) {
    this.keys = this.keys.filter(k => k.id !== id)
    delete this.results[id]
    delete this.loading[id]
    saveKeys(this.keys)
  },

  updateKey(id, updates) {
    const idx = this.keys.findIndex(k => k.id === id)
    if (idx !== -1) {
      Object.assign(this.keys[idx], updates)
      saveKeys(this.keys)
    }
  },

  setResult(id, result) {
    this.results[id] = { ...result, queriedAt: new Date().toLocaleString() }
  },

  setLoading(id, val) {
    this.loading[id] = val
  }
})

watch(() => store.keys, () => saveKeys(store.keys), { deep: true })
