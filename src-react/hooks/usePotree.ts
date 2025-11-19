import { useState, useEffect, useRef, useCallback } from 'react'
import { PotreeManagerImpl } from '@shared/utils/potree'

export interface UsePotreeReturn {
  pointCloud: any
  isLoading: boolean
  error: string | null
  loadPointCloudFile: (url: string, name?: string) => Promise<void>
  resetCamera: () => void
}

export function usePotree(containerRef: React.RefObject<HTMLDivElement>): UsePotreeReturn {
  const managerRef = useRef<PotreeManagerImpl | null>(null)
  const [pointCloud, setPointCloud] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('[usePotree] useEffect 执行', { containerRef: !!containerRef.current })
    
    if (!containerRef.current) {
      console.error('[usePotree] 错误: 容器元素未找到')
      setError('容器元素未找到')
      return
    }

    console.log('[usePotree] 创建 PotreeManagerImpl')
    const manager = new PotreeManagerImpl()
    managerRef.current = manager
    
    console.log('[usePotree] 初始化查看器')
    manager.initViewer(containerRef.current)
    
    console.log('[usePotree] 初始化完成', { 
      pointCloud: !!manager.pointCloud, 
      error: manager.error 
    })
    setPointCloud(manager.pointCloud)
    setError(manager.error)

    return () => {
      console.log('[usePotree] 清理: 销毁管理器')
      manager.destroy()
    }
  }, [containerRef])

  const loadPointCloudFile = useCallback(async (url: string, name: string = 'PointCloud') => {
    console.log('[usePotree] loadPointCloudFile 调用', { url, name })
    
    if (!managerRef.current) {
      console.error('[usePotree] 错误: 查看器未初始化')
      setError('查看器未初始化')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('[usePotree] 开始加载点云文件')
      await managerRef.current.loadPointCloudFile(url, name)
      console.log('[usePotree] 点云文件加载完成', {
        pointCloud: !!managerRef.current.pointCloud,
        error: managerRef.current.error
      })
      setPointCloud(managerRef.current.pointCloud)
      setError(managerRef.current.error)
    } catch (err) {
      console.error('[usePotree] 加载点云文件失败', err)
      setError(err instanceof Error ? err.message : '加载点云失败')
    } finally {
      setIsLoading(managerRef.current.isLoading)
      console.log('[usePotree] loadPointCloudFile 完成', { isLoading: managerRef.current.isLoading })
    }
  }, [])

  const resetCamera = useCallback(() => {
    if (!managerRef.current) return
    managerRef.current.resetCamera()
  }, [])

  return {
    pointCloud,
    isLoading,
    error,
    loadPointCloudFile,
    resetCamera,
  }
}
