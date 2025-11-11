# Point Cloud Viewer - Potree

基于 **Potree** 的点云可视化工具，提供三种实现方案：**原始简单实现**、**Vue 3 实现**和 **React 实现**。

## ✨ 特性

- 🎯 **高性能渲染**：使用 Potree 渲染大规模点云数据
- 🎨 **现代化 UI**：美观的控制面板和信息显示
- 📦 **三种实现方案**：原始实现、Vue 3、React，可根据需求选择
- ⚡ **快速开发**：使用 Vite 构建工具，开发体验优秀
- 📝 **TypeScript**：完整的类型支持
- 🎮 **交互控制**：支持文件上传、相机重置等功能
- 🔄 **共用代码**：三种实现共享核心逻辑，减少维护成本

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 运行不同版本

```bash
# 原始简单实现（Vanilla TypeScript）
npm run dev          # http://localhost:8080

# Vue 3 实现
npm run dev:vue      # http://localhost:8081

# React 实现
npm run dev:react    # http://localhost:8082
```

### 构建

```bash
# 原始实现
npm run build

# Vue 实现
npm run build:vue

# React 实现
npm run build:react
```

## 📁 项目结构

```
pointcloud-viewer/
├── src/                    # 原始简单实现（Vanilla TypeScript）
│   ├── index.html
│   └── main.ts
├── src-vue/                # Vue 3 实现
│   ├── index.html
│   ├── main.ts
│   ├── App.vue
│   ├── components/
│   └── composables/
├── src-react/              # React 实现
│   ├── index.html
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   └── hooks/
├── shared/                 # 共用文件
│   ├── types/
│   │   └── potree.d.ts     # Potree 类型定义
│   ├── styles/
│   │   └── common.css      # 共用样式
│   └── utils/
│       └── potree.ts       # Potree 管理器
├── docs/
│   └── TECHNICAL_ANALYSIS.md  # 技术方案详细分析
├── package.json
├── vite.config.ts          # 原始实现配置
├── vite.config.vue.ts      # Vue 配置
├── vite.config.react.ts    # React 配置
└── README.md
```

## 🛠️ 技术栈

### 原始实现
- TypeScript
- Vite
- Potree Core
- Three.js
- 原生 DOM API

### Vue 3 实现
- Vue 3 (Composition API)
- TypeScript
- Vite
- Potree Core
- Three.js

### React 实现
- React 18
- TypeScript
- Vite
- Potree Core
- Three.js

## 📖 使用说明

1. **加载点云文件**：点击控制面板中的"选择点云文件"按钮，选择支持的点云格式文件
2. **重置相机**：点击"重置相机"按钮恢复默认视角
3. **查看信息**：左侧信息面板显示点数量、FPS 等实时信息

### 支持的文件格式

- `.las` - LAS 格式
- `.laz` - 压缩 LAS 格式
- `.ply` - PLY 格式
- `.pcd` - PCD 格式
- `.potree` - Potree 格式

## 📚 技术方案分析

详细的技术选型分析请查看 [docs/TECHNICAL_ANALYSIS.md](./docs/TECHNICAL_ANALYSIS.md)

### 方案选择建议

#### 原始实现（Vanilla TypeScript）
- ✅ **优势**：性能最优、包体积最小、零依赖
- ⚠️ **劣势**：手动 DOM 操作、可维护性一般
- 🎯 **推荐**：小型项目、性能敏感场景、学习参考

#### Vue 3 实现
- ✅ **优势**：开发效率高、学习曲线平缓、开发体验好
- ⚠️ **劣势**：生态系统相对较小
- 🎯 **推荐**：中小型项目、快速开发、团队熟悉 Vue

#### React 实现
- ✅ **优势**：生态系统庞大、企业级应用、高度组件化
- ⚠️ **劣势**：学习曲线较陡、需要更多配置
- 🎯 **推荐**：大型项目、长期维护、需要丰富生态

## 🔧 开发

### 共用代码管理

三种实现共享以下共用文件：
- **类型定义**：`shared/types/potree.d.ts`
- **样式文件**：`shared/styles/common.css`
- **工具函数**：`shared/utils/potree.ts`

### 添加新功能

#### 原始实现
在 `src/main.ts` 中的 `PointCloudViewer` 类中添加新功能。

#### Vue 实现
在 `src-vue/composables/usePotree.ts` 中添加新的逻辑，在组件中使用。

#### React 实现
在 `src-react/hooks/usePotree.ts` 中添加新的逻辑，在组件中使用。

## 📊 方案对比

| 特性 | 原始实现 | Vue 3 | React |
|------|---------|-------|-------|
| **学习难度** | ⭐ 最简单 | ⭐⭐ 简单 | ⭐⭐⭐ 中等 |
| **开发速度** | ⭐⭐ 中等 | ⭐⭐⭐ 快 | ⭐⭐ 中等 |
| **性能** | ⭐⭐⭐ 最优 | ⭐⭐⭐ 优秀 | ⭐⭐⭐ 优秀 |
| **包体积** | ⭐⭐⭐ 最小 | ⭐⭐ 较小 | ⭐⭐ 较小 |
| **生态系统** | ⭐ 基础 | ⭐⭐ 良好 | ⭐⭐⭐ 优秀 |
| **可维护性** | ⭐⭐ 中等 | ⭐⭐⭐ 高 | ⭐⭐⭐ 高 |

## 📝 注意事项

1. **Potree 依赖**：确保 `potree-core` 包正确安装
2. **浏览器兼容性**：需要支持 WebGL 的现代浏览器
3. **点云文件**：大型点云文件可能需要较长的加载时间
4. **端口冲突**：三种实现使用不同端口（8080, 8081, 8082），可同时运行

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT

## 🙏 致谢

- [Potree](https://github.com/potree/potree) - 点云渲染库
- [Three.js](https://threejs.org/) - 3D 图形库
- [Vue](https://vuejs.org/) - 渐进式 JavaScript 框架
- [React](https://react.dev/) - UI 库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
