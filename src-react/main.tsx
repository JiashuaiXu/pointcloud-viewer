import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@shared/styles/common.css'

console.log('[main.tsx] 开始初始化 React 应用')

const rootElement = document.getElementById('app')
if (!rootElement) {
  console.error('[main.tsx] 错误: 找不到 #app 元素')
  throw new Error('找不到 #app 元素')
}

console.log('[main.tsx] 找到 #app 元素，开始渲染')

const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

console.log('[main.tsx] React 应用已渲染')
