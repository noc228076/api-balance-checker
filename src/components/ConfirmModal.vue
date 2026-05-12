<template>
  <div class="confirm-modal" v-if="visible">
    <div class="modal-overlay" @click="$emit('cancel')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <span class="modal-icon">⚠️</span>
        <h3>{{ title }}</h3>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('cancel')">取消</button>
        <button class="btn-confirm" @click="$emit('confirm')">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: '确认操作'
  },
  message: {
    type: String,
    default: '确定要执行此操作吗？'
  }
})

defineEmits(['confirm', 'cancel'])
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
  width: 400px;
  max-width: 90vw;
  z-index: 1000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}
.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 16px;
}
.modal-icon {
  font-size: 28px;
}
.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}
.modal-body {
  padding: 0 24px 24px;
}
.modal-body p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}
.btn-cancel, .btn-confirm {
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel {
  border: 1px solid var(--border);
  background: var(--bg-input);
  color: var(--text-primary);
}
.btn-cancel:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.btn-confirm {
  border: none;
  background: #ef4444;
  color: #fff;
}
.btn-confirm:hover {
  background: #dc2626;
  transform: translateY(-1px);
}
</style>