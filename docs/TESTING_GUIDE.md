# 测试指南

## 🧪 React 项目测试步骤

### 1. 启动开发服务器

```bash
npm run dev:react
```

服务器将在 http://localhost:8082 启动

### 2. 打开浏览器

1. 打开浏览器（推荐 Chrome 或 Firefox）
2. 访问 http://localhost:8082
3. 打开开发者工具（F12 或 Ctrl+Shift+I）
4. 切换到 Console 标签页

### 3. 检查初始化日志

应该看到以下日志序列：

```
[PotreeViewer] 组件渲染
[PotreeViewer] 状态 { pointCloud: false, isLoading: false, error: null, containerRef: false }
[usePotree] useEffect 执行 { containerRef: true }
[usePotree] 创建 PotreeManagerImpl
[usePotree] 初始化查看器
[PotreeManager] initViewer 开始 { container: true }
[PotreeManager] 创建 Three.js 场景
[PotreeManager] 创建相机 { width: ..., height: ... }
[PotreeManager] 创建渲染器
[PotreeManager] 创建 Potree 实例
[PotreeManager] Potree 实例创建成功 { pointBudget: 1000000 }
[PotreeManager] 初始化完成，启动渲染循环
[PotreeManager] 渲染循环已启动
[usePotree] 初始化完成 { pointCloud: false, error: null }
[PotreeViewer] 渲染 { pointCount: '-', fps: 60, isLoading: false, error: null }
```

### 4. 测试点云加载

#### 方法一：使用文件选择器

1. 点击"选择点云文件"按钮
2. 选择一个 Potree 格式的点云文件（cloud.js）
3. 观察控制台日志

**预期日志：**
```
[PotreeViewer] handleLoadFile 调用 { fileName: '...', fileSize: ..., fileType: '...' }
[PotreeViewer] 创建对象 URL { url: 'blob:...' }
[usePotree] loadPointCloudFile 调用 { url: 'blob:...', name: '...' }
[usePotree] 开始加载点云文件
[PotreeManager] loadPointCloudFile 开始 { url: 'blob:...', name: '...' }
[PotreeManager] 开始加载点云 { url: 'blob:...' }
[PotreeManager] 请求点云资源 { url: '...' }
[PotreeManager] 点云加载成功 { pointCloud: true, boundingBox: true }
[PotreeManager] 调整相机位置 { center: {...}, size: {...}, maxDim: ..., cameraZ: ... }
[PotreeManager] 点云加载完成
[PotreeManager] loadPointCloudFile 完成 { isLoading: false, error: null }
[usePotree] 点云文件加载完成 { pointCloud: true, error: null }
[usePotree] loadPointCloudFile 完成 { isLoading: false }
[PotreeViewer] 文件加载成功
[PotreeViewer] 清理对象 URL
```

#### 方法二：直接加载 URL

在浏览器控制台执行：
```javascript
// 需要先获取 manager 实例（这需要修改代码暴露出来）
// 或者通过组件的方法
```

### 5. 常见问题排查

#### 问题 1: 容器元素未找到

**日志：**
```
[usePotree] 错误: 容器元素未找到
```

**原因：** React 组件渲染时容器还未挂载

**解决：** 检查 `containerRef.current` 是否在 useEffect 执行时已存在

#### 问题 2: 查看器未初始化

**日志：**
```
[PotreeManager] 错误: 查看器未初始化 { potree: false, scene: false }
```

**原因：** initViewer 未成功执行

**解决：** 检查初始化过程中的错误日志

#### 问题 3: 点云加载失败

**日志：**
```
[PotreeManager] 点云加载错误: ...
[PotreeManager] 错误堆栈: ...
```

**可能原因：**
- 文件格式不支持（需要 Potree 格式）
- 文件路径错误
- 网络请求失败

**解决：** 查看错误堆栈，确认具体错误原因

### 6. 性能监控

观察以下指标：
- **FPS**: 应该保持在 30-60 之间
- **内存使用**: 在浏览器任务管理器中查看
- **网络请求**: 在 Network 标签页查看点云资源加载

### 7. 测试检查清单

- [ ] 页面正常加载
- [ ] 控制台无错误
- [ ] 查看器初始化成功
- [ ] 渲染循环运行正常
- [ ] FPS 显示正常
- [ ] 文件选择器工作正常
- [ ] 点云加载功能（如果有测试文件）
- [ ] 相机重置功能
- [ ] 错误提示显示正常

## 📝 日志说明

所有日志都带有模块前缀，便于过滤：

- `[PotreeViewer]` - React 组件层
- `[usePotree]` - React Hook 层
- `[PotreeManager]` - 核心管理器层

在浏览器控制台可以使用过滤器：
```
[PotreeManager]  // 只显示管理器日志
[usePotree]      // 只显示 Hook 日志
错误              // 只显示错误日志
```

## 🔍 调试技巧

1. **使用浏览器断点**：在关键日志处设置断点
2. **网络监控**：检查点云资源请求
3. **性能分析**：使用 Performance 标签页分析渲染性能
4. **内存分析**：使用 Memory 标签页检查内存泄漏

