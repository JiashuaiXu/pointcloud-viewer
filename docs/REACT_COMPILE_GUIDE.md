# React 项目编译指南

本文档提供 React 项目编译的详细步骤和故障排除。

## 📋 前置条件

### 1. 检查 Node.js 版本

```bash
node --version
```

**要求：** Node.js >= 16.0.0

### 2. 检查 npm 版本

```bash
npm --version
```

**要求：** npm >= 7.0.0

## 🚀 编译步骤

### 步骤 1: 安装依赖

```bash
npm install
```

**预期输出：**
```
added 103 packages in XXs
```

**如果遇到错误：**
- 网络问题：尝试使用国内镜像 `npm config set registry https://registry.npmmirror.com`
- 权限问题：使用管理员权限运行

### 步骤 2: 检查依赖安装

```bash
npm list --depth=0
```

**应该看到：**
- react
- react-dom
- three
- potree-core
- vite
- @vitejs/plugin-react
- typescript

### 步骤 3: 启动开发服务器

```bash
npm run dev:react
```

**预期输出：**
```
VITE v5.4.21  ready in XXXX ms

➜  Local:   http://localhost:8082/
➜  Network: use --host to expose
```

### 步骤 4: 验证编译成功

1. 打开浏览器访问 http://localhost:8082
2. 应该看到点云查看器界面
3. 打开开发者工具（F12），查看 Console
4. 应该看到初始化日志，无错误

## 🔧 构建生产版本

### 开发模式（热重载）

```bash
npm run dev:react
```

### 生产构建

```bash
npm run build:react
```

**输出目录：** `dist-react/`

**构建后预览：**
```bash
npm run preview
```

## 🐛 常见问题

### 问题 1: 依赖安装失败

**错误信息：**
```
npm error code ETARGET
npm error notarget No matching version found for potree-core@^1.8.0
```

**解决方案：**
1. 检查 `package.json` 中 potree-core 版本应为 `^2.0.11`
2. 删除 `node_modules` 和 `package-lock.json`
3. 重新安装：`npm install`

### 问题 2: 端口被占用

**错误信息：**
```
Port 8082 is already in use
```

**解决方案：**
1. 查找占用端口的进程：
   ```bash
   netstat -ano | findstr :8082
   ```
2. 结束进程或修改 `vite.config.react.ts` 中的端口号

### 问题 3: TypeScript 编译错误

**错误信息：**
```
Type error: ...
```

**解决方案：**
1. 检查 `tsconfig.json` 配置
2. 检查类型定义文件 `shared/types/potree.d.ts`
3. 运行类型检查：`npx tsc --noEmit`

### 问题 4: 模块找不到

**错误信息：**
```
Cannot find module 'potree-core'
```

**解决方案：**
1. 确认依赖已安装：`npm list potree-core`
2. 如果未安装，运行：`npm install potree-core@^2.0.11`
3. 重启开发服务器

### 问题 5: 浏览器控制台错误

**常见错误：**
- `Potree is not defined` - 检查 potree-core 导入
- `Cannot read property 'scene' of null` - 检查初始化顺序
- `Failed to load resource` - 检查文件路径

**解决方案：**
1. 查看浏览器控制台的完整错误信息
2. 检查网络请求（Network 标签页）
3. 查看本文档的调试日志部分

## 📊 编译检查清单

在编译前检查：

- [ ] Node.js 版本 >= 16
- [ ] npm 版本 >= 7
- [ ] 已运行 `npm install`
- [ ] `package.json` 中 potree-core 版本为 `^2.0.11`
- [ ] 端口 8082 未被占用
- [ ] 防火墙允许访问

编译后检查：

- [ ] 开发服务器成功启动
- [ ] 浏览器可以访问 http://localhost:8082
- [ ] 控制台无错误
- [ ] 看到初始化日志
- [ ] 界面正常显示

## 🔍 调试技巧

### 1. 查看详细日志

开发服务器启动时会显示编译信息，注意：
- 编译时间
- 警告信息
- 错误信息

### 2. 浏览器开发者工具

**Console 标签页：**
- 查看 JavaScript 错误
- 查看调试日志（带 `[模块名]` 前缀）
- 执行调试命令

**Network 标签页：**
- 检查资源加载
- 查看请求状态
- 检查文件大小

**Sources 标签页：**
- 设置断点
- 单步调试
- 查看变量值

### 3. Vite 开发工具

Vite 提供了内置的开发工具：
- 热模块替换（HMR）
- 快速刷新
- 错误覆盖层

## 📝 编译命令参考

```bash
# 开发模式（推荐）
npm run dev:react

# 生产构建
npm run build:react

# 预览生产构建
npm run preview

# 类型检查
npx tsc --noEmit

# 清理并重新安装
rm -rf node_modules package-lock.json
npm install

# 查看依赖树
npm list --depth=0
```

## 🎯 快速开始

**一键启动：**
```bash
npm install && npm run dev:react
```

**如果一切正常，你应该看到：**
1. 依赖安装完成
2. Vite 服务器启动
3. 浏览器自动打开 http://localhost:8082
4. 看到点云查看器界面

## 📚 相关文档

- [测试指南](./TESTING_GUIDE.md) - 详细的测试步骤
- [编译记录](./BUILD_LOG.md) - 编译历史记录
- [Bug 记录](./bugs-react/) - 已知问题和解决方案

## 💡 提示

1. **首次编译可能较慢**：需要下载依赖和编译 TypeScript
2. **保存文件自动刷新**：Vite 支持热重载，修改代码后自动更新
3. **查看日志**：所有关键操作都有日志输出，便于调试
4. **检查控制台**：遇到问题时首先查看浏览器控制台

---

**需要帮助？** 查看 [Bug 记录](./bugs-react/) 或提交 Issue。

