import * as THREE from 'three'
import { Potree, PointCloudOctree } from 'potree-core'

export interface PotreeManager {
  scene: THREE.Scene | null
  camera: THREE.PerspectiveCamera | null
  renderer: THREE.WebGLRenderer | null
  potree: Potree | null
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
  scene: THREE.Scene | null = null
  camera: THREE.PerspectiveCamera | null = null
  renderer: THREE.WebGLRenderer | null = null
  potree: Potree | null = null
  pointCloud: PointCloudOctree | null = null
  isLoading: boolean = false
  error: string | null = null
  private animationFrameId: number | null = null
  private controls: any = null

  initViewer(container: HTMLElement): void {
    console.log('[PotreeManager] initViewer 开始', { container: !!container })
    
    if (!container) {
      this.error = '容器元素未找到'
      console.error('[PotreeManager] 错误: 容器元素未找到')
      return
    }

    try {
      console.log('[PotreeManager] 创建 Three.js 场景')
      // 创建场景
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0x1a1a1a)

      // 创建相机
      const width = container.clientWidth || 800
      const height = container.clientHeight || 600
      console.log('[PotreeManager] 创建相机', { width, height })
      this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
      this.camera.position.set(0, 0, 1000)

      console.log('[PotreeManager] 创建渲染器')
      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(width, height)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      container.appendChild(this.renderer.domElement)

      console.log('[PotreeManager] 创建 Potree 实例')
      // 创建 Potree 实例
      this.potree = new Potree()
      this.potree.pointBudget = 1_000_000
      console.log('[PotreeManager] Potree 实例创建成功', { pointBudget: this.potree.pointBudget })

      // 创建轨道控制器（需要安装 three/examples/jsm/controls/OrbitControls）
      // 暂时先不使用控制器，后续可以添加

      // 处理窗口大小变化
      const handleResize = () => {
        if (!this.camera || !this.renderer || !container) return
        const width = container.clientWidth
        const height = container.clientHeight
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
      }
      window.addEventListener('resize', handleResize)

      this.error = null

      console.log('[PotreeManager] 初始化完成，启动渲染循环')
      // 启动渲染循环
      this.startRenderLoop()
      console.log('[PotreeManager] 渲染循环已启动')
    } catch (err) {
      this.error = err instanceof Error ? err.message : '初始化查看器失败'
      console.error('[PotreeManager] 初始化错误:', err)
    }
  }

  async loadPointCloudFile(url: string, name: string = 'PointCloud'): Promise<void> {
    console.log('[PotreeManager] loadPointCloudFile 开始', { url, name })
    
    if (!this.potree || !this.scene) {
      this.error = '查看器未初始化'
      console.error('[PotreeManager] 错误: 查看器未初始化', { potree: !!this.potree, scene: !!this.scene })
      return
    }

    this.isLoading = true
    this.error = null

    try {
      // 移除之前的点云
      if (this.pointCloud) {
        console.log('[PotreeManager] 移除之前的点云')
        this.scene.remove(this.pointCloud)
        this.pointCloud = null
      }

      console.log('[PotreeManager] 开始加载点云', { url })
      // 加载点云
      // potree-core 需要 cloud.js 文件路径
      // 如果传入的是 .las 或其他格式，需要先转换为 potree 格式
      const pointCloud = await this.potree.loadPointCloud(url, (url) => {
        console.log('[PotreeManager] 请求点云资源', { url })
        return url
      })
      
      console.log('[PotreeManager] 点云加载成功', { pointCloud: !!pointCloud, boundingBox: !!pointCloud.boundingBox })
      this.scene.add(pointCloud)
      this.pointCloud = pointCloud

      // 调整相机位置以适应点云
      if (this.camera && pointCloud.boundingBox) {
        const box = pointCloud.boundingBox
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = this.camera.fov * (Math.PI / 180)
        const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
        
        console.log('[PotreeManager] 调整相机位置', { center, size, maxDim, cameraZ })
        this.camera.position.set(center.x, center.y, center.z + cameraZ)
        this.camera.lookAt(center)
      } else {
        console.warn('[PotreeManager] 无法调整相机位置', { camera: !!this.camera, boundingBox: !!pointCloud.boundingBox })
      }
      
      console.log('[PotreeManager] 点云加载完成')
    } catch (err) {
      this.error = err instanceof Error ? err.message : '加载点云失败'
      console.error('[PotreeManager] 点云加载错误:', err)
      if (err instanceof Error) {
        console.error('[PotreeManager] 错误堆栈:', err.stack)
      }
    } finally {
      this.isLoading = false
      console.log('[PotreeManager] loadPointCloudFile 完成', { isLoading: this.isLoading, error: this.error })
    }
  }

  resetCamera(): void {
    if (!this.camera || !this.pointCloud) return

    if (this.pointCloud.boundingBox) {
      const box = this.pointCloud.boundingBox
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const fov = this.camera.fov * (Math.PI / 180)
      const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
      
      this.camera.position.set(center.x, center.y, center.z + cameraZ)
      this.camera.lookAt(center)
    } else {
      this.camera.position.set(0, 0, 1000)
      this.camera.lookAt(0, 0, 0)
    }
  }

  update(): void {
    if (!this.scene || !this.camera || !this.renderer || !this.potree) {
      // 静默返回，避免日志过多
      return
    }

    // 更新点云
    if (this.pointCloud) {
      this.potree.updatePointClouds([this.pointCloud], this.camera, this.renderer)
    }

    // 渲染场景
    this.renderer.render(this.scene, this.camera)
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

    if (this.renderer && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
    }

    if (this.pointCloud) {
      this.pointCloud.dispose?.()
    }

    this.scene = null
    this.camera = null
    this.renderer = null
    this.potree = null
    this.pointCloud = null
  }
}
