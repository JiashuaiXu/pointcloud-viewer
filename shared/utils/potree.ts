import { Viewer, PointCloudOctree, loadPointCloud } from 'potree-core'

export interface PotreeManager {
  viewer: Viewer | null
  pointCloud: PointCloudOctree | null
  isLoading: boolean
  error: string | null
  initViewer: (container: HTMLElement) => void
  loadPointCloudFile: (url: string, name?: string) => Promise<void>
  resetCamera: () => void
  update: () => void
  destroy: () => void
}

export class PotreeManagerImpl implements PotreeManager {
  viewer: Viewer | null = null
  pointCloud: PointCloudOctree | null = null
  isLoading: boolean = false
  error: string | null = null
  private animationFrameId: number | null = null

  initViewer(container: HTMLElement): void {
    if (!container) {
      this.error = '容器元素未找到'
      return
    }

    try {
      const potreeViewer = new Viewer(container)
      
      // 配置查看器
      potreeViewer.setEDLEnabled(true)
      potreeViewer.setFOV(60)
      potreeViewer.setPointBudget(1_000_000)
      potreeViewer.loadSettingsFromURL()

      this.viewer = potreeViewer
      this.error = null

      // 启动渲染循环
      this.startRenderLoop()
    } catch (err) {
      this.error = err instanceof Error ? err.message : '初始化查看器失败'
      console.error('Potree viewer initialization error:', err)
    }
  }

  async loadPointCloudFile(url: string, name: string = 'PointCloud'): Promise<void> {
    if (!this.viewer) {
      this.error = '查看器未初始化'
      return
    }

    this.isLoading = true
    this.error = null

    try {
      await new Promise<void>((resolve, reject) => {
        loadPointCloud(url, name, (event) => {
          try {
            const scene = this.viewer!.scene
            scene.addPointCloud(event.pointcloud)
            this.pointCloud = event.pointcloud
            resolve()
          } catch (err) {
            reject(err)
          }
        })
      })
    } catch (err) {
      this.error = err instanceof Error ? err.message : '加载点云失败'
      console.error('Point cloud loading error:', err)
    } finally {
      this.isLoading = false
    }
  }

  resetCamera(): void {
    if (!this.viewer) return

    this.viewer.camera.position.set(0, 0, 1000)
    this.viewer.camera.lookAt(0, 0, 0)
    
    if (this.viewer.controls) {
      this.viewer.controls.reset()
    }
  }

  update(): void {
    if (this.viewer) {
      this.viewer.update()
    }
  }

  private startRenderLoop(): void {
    const render = () => {
      this.update()
      this.animationFrameId = requestAnimationFrame(render)
    }
    render()
  }

  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this.viewer = null
    this.pointCloud = null
  }
}

