# PCD 文件使用快速指南

## 🚀 快速开始

### 1. 转换 PCD 文件

```bash
# 安装 Python 依赖
pip install numpy laspy

# 转换文件（推荐 LAS 格式）
python scripts/pcd_converter.py shared/data/test-5000w.pcd \
  --format las \
  --output public/data/test-5000w.las \
  --sample 1000000
```

### 2. 在项目中使用

转换后的文件会自动放在 `public/data/` 目录，可以通过以下方式加载：

**Vue 项目：**
```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { usePotree } from '../composables/usePotree'

const containerRef = ref<HTMLElement | null>(null)
const { loadPointCloudFile } = usePotree(containerRef)

onMounted(async () => {
  await loadPointCloudFile('/data/test-5000w.las', 'Test Cloud')
})
</script>
```

**React 项目：**
```tsx
useEffect(() => {
  loadPointCloudFile('/data/test-5000w.las', 'Test Cloud')
}, [])
```

## 📖 详细文档

- [PCD 转换完整指南](./docs/PCD_CONVERSION_GUIDE.md)
- [实现方法详解](./docs/IMPLEMENTATION_GUIDE.md)
- [编译记录](./docs/BUILD_LOG.md)

## ⚠️ 注意事项

1. **大文件处理**：5000 万点建议采样到 100-500 万点
2. **格式选择**：推荐使用 LAS 格式（Potree 原生支持）
3. **文件位置**：转换后的文件必须放在 `public/data/` 目录

