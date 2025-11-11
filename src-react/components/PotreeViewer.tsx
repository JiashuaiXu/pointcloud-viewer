import React, { useRef, useState, useEffect } from 'react'
import { usePotree } from '../hooks/usePotree'
import InfoPanel from './InfoPanel'
import ControlPanel from './ControlPanel'

const PotreeViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { viewer, pointCloud, isLoading, error, loadPointCloudFile, resetCamera } = usePotree(containerRef)
  const [fps, setFps] = useState(60)

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
    const url = URL.createObjectURL(file)
    try {
      await loadPointCloudFile(url, file.name)
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  const pointCount = pointCloud ? 'N/A' : '-'

  return (
    <div className="potree-viewer" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      
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
