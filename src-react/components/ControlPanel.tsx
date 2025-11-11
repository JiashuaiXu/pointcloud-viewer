import React, { useRef } from 'react'
import '../../shared/styles/common.css'

interface ControlPanelProps {
  isLoading: boolean
  onLoadFile: (file: File) => void
  onResetCamera: () => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({ isLoading, onLoadFile, onResetCamera }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    
    if (file) {
      onLoadFile(file)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="control-panel">
      <h3>控制面板</h3>
      
      <label className="file-input-label">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".las,.laz,.ply,.pcd,.potree"
          disabled={isLoading}
          className="file-input"
        />
        <span className="file-input-text">选择点云文件</span>
      </label>
      
      <button 
        onClick={onResetCamera}
        disabled={isLoading}
        className="control-button"
      >
        重置相机
      </button>
      
      <div className="tips">
        <p>支持格式: .las, .laz, .ply, .pcd, .potree</p>
      </div>
    </div>
  )
}

export default ControlPanel
