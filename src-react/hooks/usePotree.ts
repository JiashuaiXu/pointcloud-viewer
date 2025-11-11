import { useState, useEffect, useRef, useCallback } from 'react'
import { PotreeManagerImpl } from '../../shared/utils/potree'

export interface UsePotreeReturn {
  viewer: any
  pointCloud: any
  isLoading: boolean
  error: string | null
  loadPointCloudFile: (url: string, name?: string) => Promise<void>
  resetCamera: () => void
}

export function usePotree(containerRef: React.RefObject<HTMLDivElement>): UsePotreeReturn {
  const managerRef = useRef<PotreeManagerImpl | null>(null)
  const [viewer, setViewer] = useState<any>(null)
  const [pointCloud, setPointCloud] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const animationFrameIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) {
      setError('容器元素未找到')
      return
    }

    const manager = new PotreeManagerImpl()
    managerRef.current = manager
    manager.initViewer(containerRef.current)
    
    setViewer(manager.viewer)
    setPointCloud(manager.pointCloud)
    setError(manager.error)

    // 启动渲染循环
    const render = () => {
      manager.update()
      animationFrameIdRef.current = requestAnimationFrame(render)
    }
    render()

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
      manager.destroy()
    }
  }, [containerRef])

  const loadPointCloudFile = useCallback(async (url: string, name: string = 'PointCloud') => {
    if (!managerRef.current) {
      setError('查看器未初始化')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await managerRef.current.loadPointCloudFile(url, name)
      setViewer(managerRef.current.viewer)
      setPointCloud(managerRef.current.pointCloud)
      setError(managerRef.current.error)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载点云失败')
    } finally {
      setIsLoading(managerRef.current.isLoading)
    }
  }, [])

  const resetCamera = useCallback(() => {
    if (!managerRef.current) return
    managerRef.current.resetCamera()
  }, [])

  return {
    viewer,
    pointCloud,
    isLoading,
    error,
    loadPointCloudFile,
    resetCamera,
  }
}
