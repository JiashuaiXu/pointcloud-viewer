import React from 'react'
import '../../shared/styles/common.css'

interface InfoPanelProps {
  pointCount: string | number
  fps: number
  isLoading: boolean
  error: string | null
}

const InfoPanel: React.FC<InfoPanelProps> = ({ pointCount, fps, isLoading, error }) => {
  return (
    <div className="info-panel">
      <h2>点云查看器</h2>
      <p>使用 Potree 渲染 (React)</p>
      <p className="info-item">
        <span className="label">点数量:</span>
        <span className="value">{pointCount}</span>
      </p>
      <p className="info-item">
        <span className="label">FPS:</span>
        <span className="value">{fps}</span>
      </p>
      {isLoading && (
        <div className="loading-indicator">
          <span>加载中...</span>
        </div>
      )}
      {error && (
        <div className="error-message">
          <span>错误: {error}</span>
        </div>
      )}
    </div>
  )
}

export default InfoPanel
