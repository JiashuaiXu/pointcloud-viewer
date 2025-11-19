declare module 'potree-core' {
  import * as THREE from 'three'
  import { RequestManager } from 'potree-core/dist/loading2/RequestManager'

  export class Potree {
    pointBudget: number
    loadPointCloud(
      url: string,
      baseUrl: string | RequestManager
    ): Promise<PointCloudOctree>
    updatePointClouds(
      pointClouds: PointCloudOctree[],
      camera: THREE.Camera,
      renderer: THREE.WebGLRenderer
    ): void
  }

  export class PointCloudOctree extends THREE.Object3D {
    potree: Potree
    pcoGeometry: any
    boundingBox: THREE.Box3
    boundingSphere: THREE.Sphere
    material: any
    visible: boolean
  }
}
