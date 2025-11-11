<template>
  <div class="potree-viewer">
    <div ref="containerRef" class="viewer-container"></div>
    
    <InfoPanel 
      :point-count="pointCount"
      :fps="fps"
      :is-loading="isLoading"
      :error="error"
    />
    
    <ControlPanel
      :is-loading="isLoading"
      @load-file="handleLoadFile"
      @reset-camera="handleResetCamera"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePotree } from '../composables/usePotree'
import InfoPanel from './InfoPanel.vue'
import ControlPanel from './ControlPanel.vue'

const containerRef = ref<HTMLElement | null>(null)
const { viewer, pointCloud, isLoading, error, loadPointCloudFile, resetCamera } = usePotree(containerRef)

const pointCount = computed(() => {
  return pointCloud.value ? 'N/A' : '-'
})

const fps = ref(60)

// FPS 计算
onMounted(() => {
  let lastTime = performance.now()
  let frameCount = 0
  
  const calculateFPS = () => {
    frameCount++
    const currentTime = performance.now()
    
    if (currentTime >= lastTime + 1000) {
      fps.value = frameCount
      frameCount = 0
      lastTime = currentTime
    }
    
    requestAnimationFrame(calculateFPS)
  }
  
  calculateFPS()
})

const handleLoadFile = async (file: File) => {
  const url = URL.createObjectURL(file)
  try {
    await loadPointCloudFile(url, file.name)
  } finally {
    URL.revokeObjectURL(url)
  }
}

const handleResetCamera = () => {
  resetCamera()
}
</script>

<style scoped>
.potree-viewer {
  width: 100%;
  height: 100%;
  position: relative;
}

.viewer-container {
  width: 100%;
  height: 100%;
}
</style>

