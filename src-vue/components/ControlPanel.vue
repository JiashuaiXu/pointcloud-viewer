<template>
  <div class="control-panel">
    <h3>控制面板</h3>
    
    <label class="file-input-label">
      <input 
        type="file" 
        ref="fileInputRef"
        @change="handleFileChange"
        accept=".las,.laz,.ply,.pcd,.potree"
        :disabled="isLoading"
        class="file-input"
      />
      <span class="file-input-text">选择点云文件</span>
    </label>
    
    <button 
      @click="handleResetCamera"
      :disabled="isLoading"
      class="control-button"
    >
      重置相机
    </button>
    
    <div class="tips">
      <p>支持格式: .las, .laz, .ply, .pcd, .potree</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  loadFile: [file: File]
  resetCamera: []
}>()

defineProps<{
  isLoading: boolean
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    emit('loadFile', file)
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

const handleResetCamera = () => {
  emit('resetCamera')
}
</script>

