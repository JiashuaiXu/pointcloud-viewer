import '../shared/styles/common.css'
import { PotreeManagerImpl } from '../shared/utils/potree'

class PointCloudViewer {
  private container: HTMLElement
  private potreeManager: PotreeManagerImpl
  private fps: number = 60
  private fpsLastTime: number = performance.now()
  private fpsFrameCount: number = 0

  constructor() {
    this.container = document.getElementById('viewer-container')!
    this.potreeManager = new PotreeManagerImpl()
    this.init()
  }

  private init(): void {
    // 初始化 Potree 查看器
    this.potreeManager.initViewer(this.container)

    // 绑定事件
    this.bindEvents()

    // 启动 FPS 计算
    this.startFPSCalculation()

    // 启动渲染循环
    this.startRenderLoop()
  }

  private bindEvents(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    const resetCameraBtn = document.getElementById('reset-camera') as HTMLButtonElement

    fileInput.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        this.loadFile(file)
      }
    })

    resetCameraBtn.addEventListener('click', () => {
      this.potreeManager.resetCamera()
    })
  }

  private async loadFile(file: File): Promise<void> {
    const url = URL.createObjectURL(file)
    const loadingIndicator = document.getElementById('loading-indicator')!
    const errorMessage = document.getElementById('error-message')!
    const errorText = document.getElementById('error-text')!

    loadingIndicator.style.display = 'block'
    errorMessage.style.display = 'none'

    try {
      await this.potreeManager.loadPointCloudFile(url, file.name)
      this.updatePointCount()
    } catch (error) {
      errorText.textContent = error instanceof Error ? error.message : '加载失败'
      errorMessage.style.display = 'block'
    } finally {
      loadingIndicator.style.display = 'none'
      URL.revokeObjectURL(url)
    }
  }

  private updatePointCount(): void {
    const pointCountEl = document.getElementById('point-count')!
    pointCountEl.textContent = this.potreeManager.pointCloud ? 'N/A' : '-'
  }

  private startFPSCalculation(): void {
    const fpsEl = document.getElementById('fps')!

    const calculateFPS = () => {
      this.fpsFrameCount++
      const currentTime = performance.now()

      if (currentTime >= this.fpsLastTime + 1000) {
        this.fps = this.fpsFrameCount
        fpsEl.textContent = this.fps.toString()
        this.fpsFrameCount = 0
        this.fpsLastTime = currentTime
      }

      requestAnimationFrame(calculateFPS)
    }

    calculateFPS()
  }

  private startRenderLoop(): void {
    const render = () => {
      this.potreeManager.update()
      requestAnimationFrame(render)
    }
    render()
  }

  public destroy(): void {
    this.potreeManager.destroy()
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new PointCloudViewer()
})
