import React, { useRef, useState, useEffect } from 'react'
import { usePotree } from '../hooks/usePotree'
import InfoPanel from './InfoPanel'
import ControlPanel from './ControlPanel'

const PotreeViewer: React.FC = () => {
  console.log('[PotreeViewer] 组件渲染')
  
  const containerRef = useRef<HTMLDivElement>(null)
  const { pointCloud, isLoading, error, loadPointCloudFile, resetCamera } = usePotree(containerRef)
  const [fps, setFps] = useState(60)
  
  console.log('[PotreeViewer] 状态', { 
    pointCloud: !!pointCloud, 
    isLoading, 
    error,
    containerRef: !!containerRef.current 
  })

  // FPS 计算
  useEffect(() => {
    let lastTime = performance.now()
    let frameCount = 0
    
    const calculateFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        setFps(frameCount)
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(calculateFPS)
    }
    
    calculateFPS()
  }, [])

  const handleLoadFile = async (file: File) => {
    console.log('[PotreeViewer] handleLoadFile 调用', { 
      fileName: file.name, 
      fileSize: file.size, 
      fileType: file.type 
    })
    
    const url = URL.createObjectURL(file)
    console.log('[PotreeViewer] 创建对象 URL', { url })
    
    try {
      await loadPointCloudFile(url, file.name)
      console.log('[PotreeViewer] 文件加载成功')
    } catch (err) {
      console.error('[PotreeViewer] 文件加载失败', err)
    } finally {
      URL.revokeObjectURL(url)
      console.log('[PotreeViewer] 清理对象 URL')
    }
  }

  const pointCount = pointCloud ? 'N/A' : '-'
  
  console.log('[PotreeViewer] 渲染', { pointCount, fps, isLoading, error })

  return (
    <div 
      className="potree-viewer" 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        background: '#1a1a1a'
      }}
    >
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }} 
      />
      
      <InfoPanel 
        pointCount={pointCount}
        fps={fps}
        isLoading={isLoading}
        error={error}
      />
      
      <ControlPanel
        isLoading={isLoading}
        onLoadFile={handleLoadFile}
        onResetCamera={resetCamera}
      />
    </div>
  )
}

export default PotreeViewer
