# Bug #006: 404 错误分析和修复

**发现时间：** 2025-11-19

**环境：** React + Vite

**问题描述：**
- Vite 服务器成功启动在 http://localhost:8084/
- 但访问该 URL 返回 404 Not Found
- 终端显示页面重载，但浏览器无法访问

**根本原因：**

Vite 在开发模式下，默认会在 `root` 目录下查找 `index.html` 文件。

**问题分析：**

1. **原配置：**
   - `root: '.'` (项目根目录)
   - HTML 文件在 `src-react/index.html`
   - Vite 在根目录查找 `index.html`，找不到 → 404

2. **rollupOptions.input 只在构建时有效**
   - 开发模式下，Vite 不会使用 `rollupOptions.input`
   - 它会在 `root` 目录查找 `index.html`

**解决方案：**

将 `root` 设置为 `src-react` 目录，这样 Vite 就能找到 `index.html` 了。

**修改内容：**

1. ✅ `vite.config.react.ts`
   - 将 `root` 从 `'.'` 改为 `resolve(__dirname, 'src-react')`
   - 更新 `publicDir` 和 `outDir` 为绝对路径

2. ✅ `src-react/index.html`
   - 将脚本路径从 `/src-react/main.tsx` 改为 `/main.tsx`
   - 因为 root 是 src-react，所以路径相对于该目录

3. ✅ 修复所有导入路径
   - `src-react/main.tsx`: `../shared/styles/common.css`
   - `src-react/hooks/usePotree.ts`: `../shared/utils/potree`
   - `src-react/components/InfoPanel.tsx`: `../shared/styles/common.css`
   - `src-react/components/ControlPanel.tsx`: `../shared/styles/common.css`

**测试步骤：**

1. 停止当前服务器（Ctrl+C）
2. 重新运行 `npm run dev:react`
3. 访问显示的 URL（应该是 http://localhost:8082 或自动分配的端口）
4. 应该能正常访问，不再出现 404

**状态：** ✅ 已修复
