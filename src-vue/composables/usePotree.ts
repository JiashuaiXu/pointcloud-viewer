import { ref, onMounted, onUnmounted } from 'vue'
import { PotreeManagerImpl } from '../../shared/utils/potree'
import type { Ref } from 'vue'

export interface UsePotreeReturn {
  viewer: Ref<any>
  pointCloud: Ref<any>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  loadPointCloudFile: (url: string, name?: string) => Promise<void>
  resetCamera: () => void
  update: () => void
}

export function usePotree(containerRef: Ref<HTMLElement | null>): UsePotreeReturn {
  const manager = new PotreeManagerImpl()
  const viewer = ref(manager.viewer)
  const pointCloud = ref(manager.pointCloud)
  const isLoading = ref(manager.isLoading)
  const error = ref(manager.error)
  let animationFrameId: number | null = null

  const initViewer = () => {
    if (!containerRef.value) {
      error.value = '容器元素未找到'
      return
    }

    manager.initViewer(containerRef.value)
    viewer.value = manager.viewer
    pointCloud.value = manager.pointCloud
    error.value = manager.error

    // 启动渲染循环
    startRenderLoop()
  }

  const loadPointCloudFile = async (url: string, name: string = 'PointCloud') => {
    isLoading.value = true
    error.value = null

    try {
      await manager.loadPointCloudFile(url, name)
      viewer.value = manager.viewer
      pointCloud.value = manager.pointCloud
      error.value = manager.error
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载点云失败'
    } finally {
      isLoading.value = manager.isLoading
    }
  }

  const resetCamera = () => {
    manager.resetCamera()
  }

  const update = () => {
    manager.update()
  }

  const startRenderLoop = () => {
    const render = () => {
      update()
      animationFrameId = requestAnimationFrame(render)
    }
    render()
  }

  const stopRenderLoop = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    manager.destroy()
  }

  onMounted(() => {
    initViewer()
  })

  onUnmounted(() => {
    stopRenderLoop()
  })

  return {
    viewer,
    pointCloud,
    isLoading,
    error,
    loadPointCloudFile,
    resetCamera,
    update,
  }
}

