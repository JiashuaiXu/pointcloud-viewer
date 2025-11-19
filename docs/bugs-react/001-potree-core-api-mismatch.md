# Bug #001: Potree Core API 不匹配

**发现时间：** 2025-11-19

**环境：** React + TypeScript + Vite

**问题描述：**
- 初始代码使用的是 potree-core 1.8.0 的 API（Viewer 类）
- 实际安装的 potree-core 2.0.11 使用完全不同的 API
- potree-core 2.0.11 没有 Viewer 类，需要手动创建 Three.js 场景、相机、渲染器

**错误信息：**
```
npm error notarget No matching version found for potree-core@^1.8.0
```

**解决方案：**
1. 更新 package.json 使用 potree-core@^2.0.11
2. 重写 `shared/utils/potree.ts` 适配新 API
3. 更新类型定义 `shared/types/potree.d.ts`
4. 更新 React hook `src-react/hooks/usePotree.ts`

**新 API 使用方式：**
```typescript
// 创建 Potree 实例
const potree = new Potree()
potree.pointBudget = 1_000_000

// 加载点云
const pointCloud = await potree.loadPointCloud(url, baseUrl)

// 在渲染循环中更新
potree.updatePointClouds([pointCloud], camera, renderer)
```

**状态：** ✅ 已解决

**相关文件：**
- `package.json` - 更新依赖版本
- `shared/utils/potree.ts` - 重写实现
- `shared/types/potree.d.ts` - 更新类型定义
- `src-react/hooks/usePotree.ts` - 更新 hook

