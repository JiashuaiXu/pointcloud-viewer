import React from 'react'
import '@shared/styles/common.css'

interface InfoPanelProps {
  pointCount: string | number
  fps: number
  isLoading: boolean
  error: string | null
}

const InfoPanel: React.FC<InfoPanelProps> = ({ pointCount, fps, isLoading, error }) => {
  console.log('[InfoPanel] 组件渲染', { pointCount, fps, isLoading, error })
  
  return (
    <div className="info-panel" style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      zIndex: 1000,
      minWidth: '250px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
    }}>
      <h2 style={{ marginBottom: '10px', fontSize: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', paddingBottom: '8px' }}>
        点云查看器
      </h2>
      <p style={{ margin: '8px 0', fontSize: '14px' }}>使用 Potree 渲染 (React)</p>
      <p className="info-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
        <span className="label" style={{ fontWeight: 500, opacity: 0.8 }}>点数量:</span>
        <span className="value" style={{ fontWeight: 'bold', color: '#4CAF50' }}>{pointCount}</span>
      </p>
      <p className="info-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
        <span className="label" style={{ fontWeight: 500, opacity: 0.8 }}>FPS:</span>
        <span className="value" style={{ fontWeight: 'bold', color: '#4CAF50' }}>{fps}</span>
      </p>
      {isLoading && (
        <div className="loading-indicator" style={{
          marginTop: '10px',
          padding: '8px',
          background: 'rgba(76, 175, 80, 0.2)',
          borderRadius: '4px',
          textAlign: 'center',
          fontSize: '12px'
        }}>
          <span>加载中...</span>
        </div>
      )}
      {error && (
        <div className="error-message" style={{
          marginTop: '10px',
          padding: '8px',
          background: 'rgba(244, 67, 54, 0.2)',
          borderRadius: '4px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#ff6b6b'
        }}>
          <span>错误: {error}</span>
        </div>
      )}
    </div>
  )
}

export default InfoPanel
