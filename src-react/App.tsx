import React from 'react'
import PotreeViewer from './components/PotreeViewer'

const App: React.FC = () => {
  console.log('[App] 组件渲染')
  
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    }}>
      <PotreeViewer />
    </div>
  )
}

export default App
