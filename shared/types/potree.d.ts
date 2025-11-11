declare module 'potree-core' {
  import * as THREE from 'three'

  export class Viewer {
    constructor(container: HTMLElement)
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    controls: any
    setEDLEnabled(enabled: boolean): void
    setFOV(fov: number): void
    setPointBudget(budget: number): void
    loadSettingsFromURL(): void
    update(): void
  }

  export class PointCloudOctree {
    constructor()
    material: any
    visible: boolean
    position: THREE.Vector3
    rotation: THREE.Euler
    scale: THREE.Vector3
  }

  export function loadPointCloud(
    url: string,
    name: string,
    callback: (event: { pointcloud: PointCloudOctree }) => void
  ): void

  export const PointCloudTree: any
}

