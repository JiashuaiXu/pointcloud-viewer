import React, { useRef } from 'react'
import '@shared/styles/common.css'

interface ControlPanelProps {
  isLoading: boolean
  onLoadFile: (file: File) => void
  onResetCamera: () => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({ isLoading, onLoadFile, onResetCamera }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  console.log('[ControlPanel] 组件渲染', { isLoading })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    
    console.log('[ControlPanel] 文件选择', { file: file ? { name: file.name, size: file.size, type: file.type } : null })
    
    if (file) {
      onLoadFile(file)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="control-panel" style={{ 
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.8)',
      padding: '15px',
      borderRadius: '8px',
      minWidth: '250px',
      color: 'white'
    }}>
      <h3 style={{ marginBottom: '15px', fontSize: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', paddingBottom: '8px' }}>
        控制面板
      </h3>
      
      <label 
        className="file-input-label" 
        style={{ 
          display: 'block', 
          margin: '10px 0', 
          cursor: 'pointer' 
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".las,.laz,.ply,.pcd,.potree,.js"
          disabled={isLoading}
          className="file-input"
          style={{ display: 'none' }}
        />
        <span 
          className="file-input-text"
          style={{
            display: 'block',
            padding: '10px',
            background: isLoading ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.5)',
            border: '1px solid rgba(76, 175, 80, 0.8)',
            borderRadius: '4px',
            textAlign: 'center',
            transition: 'all 0.3s',
            opacity: isLoading ? 0.5 : 1
          }}
        >
          {isLoading ? '加载中...' : '📁 选择点云文件'}
        </span>
      </label>
      
      <button 
        onClick={onResetCamera}
        disabled={isLoading}
        className="control-button"
        style={{
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          margin: '10px 0',
          width: '100%',
          fontSize: '14px',
          opacity: isLoading ? 0.5 : 1
        }}
      >
        重置相机
      </button>
      
      <div className="tips" style={{ 
        marginTop: '15px', 
        paddingTop: '15px', 
        borderTop: '1px solid rgba(255, 255, 255, 0.2)', 
        fontSize: '12px', 
        opacity: 0.7 
      }}>
        <p style={{ margin: 0 }}>支持格式: .las, .laz, .ply, .pcd, .potree, .js</p>
      </div>
    </div>
  )
}

export default ControlPanel
