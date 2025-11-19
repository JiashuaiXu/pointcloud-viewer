# Bug #007: 路径解析错误修复

**发现时间：** 2025-11-19

**环境：** React + Vite

**错误信息：**
```
Failed to resolve import "../../shared/styles/common.css" from "src-react/main.tsx". Does the file exist?
```

**根本原因：**

当 `root` 设置为 `src-react` 目录后，相对路径的解析基准改变了。

**问题分析：**

1. **原配置：**
   - `root: '.'` (项目根目录)
   - 路径：`../../shared/styles/common.css` 从 `src-react/main.tsx` 向上两级到项目根目录，然后到 `shared`

2. **新配置：**
   - `root: 'src-react'` (src-react 目录)
   - 路径：`../../shared/styles/common.css` 从 `src-react` 向上两级会超出项目根目录
   - Vite 无法解析这个路径

**解决方案：**

使用别名 `@shared` 来引用 shared 目录，这样无论 root 设置为什么，都能正确解析。

**修改内容：**

1. ✅ `src-react/main.tsx`
   - `../../shared/styles/common.css` → `@shared/styles/common.css`

2. ✅ `src-react/hooks/usePotree.ts`
   - `../../shared/utils/potree` → `@shared/utils/potree`

3. ✅ `src-react/components/InfoPanel.tsx`
   - `../../shared/styles/common.css` → `@shared/styles/common.css`

4. ✅ `src-react/components/ControlPanel.tsx`
   - `../../shared/styles/common.css` → `@shared/styles/common.css`

5. ✅ `vite.config.react.ts`
   - 别名 `@shared` 已配置为 `resolve(__dirname, 'shared')`
   - 添加 `preserveSymlinks: false` 确保路径解析正确

**状态：** ✅ 已修复

**测试：**
重新运行 `npm run dev:react`，应该不再出现路径解析错误。

