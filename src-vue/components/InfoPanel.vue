<template>
  <div class="info-panel">
    <h2>点云查看器</h2>
    <p>使用 Potree 渲染 (Vue 3)</p>
    <p class="info-item">
      <span class="label">点数量:</span>
      <span class="value">{{ pointCount }}</span>
    </p>
    <p class="info-item">
      <span class="label">FPS:</span>
      <span class="value">{{ fps }}</span>
    </p>
    <div v-if="isLoading" class="loading-indicator">
      <span>加载中...</span>
    </div>
    <div v-if="error" class="error-message">
      <span>错误: {{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  pointCount: string | number
  fps: number
  isLoading: boolean
  error: string | null
}>()
</script>

