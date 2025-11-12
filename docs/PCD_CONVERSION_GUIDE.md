# PCD 文件转换指南

本文档说明如何将 PCD 文件转换为 Potree 可用的格式，并在 Vue/React 项目中显示。

## 📋 目录

1. [PCD 文件格式说明](#pcd-文件格式说明)
2. [转换工具使用](#转换工具使用)
3. [在项目中使用转换后的文件](#在项目中使用转换后的文件)
4. [常见问题](#常见问题)

---

## PCD 文件格式说明

### PCD 文件结构

PCD (Point Cloud Data) 文件是 PCL (Point Cloud Library) 使用的标准格式。

**文件头示例：**
```
VERSION 0.7
FIELDS x y z intensity
SIZE 4 4 4 4
TYPE F F F F
COUNT 1 1 1 1
WIDTH 50000000
HEIGHT 1
POINTS 50000000
DATA ascii
```

**字段说明：**
- `VERSION`: PCD 版本号
- `FIELDS`: 字段名称（通常包含 x, y, z, intensity 等）
- `SIZE`: 每个字段的字节数
- `TYPE`: 数据类型（F=float, I=int, U=unsigned int）
- `COUNT`: 每个字段的元素数量
- `WIDTH`: 点云宽度
- `HEIGHT`: 点云高度（通常为 1）
- `POINTS`: 点的总数
- `DATA`: 数据格式（ascii 或 binary）

### 数据格式

**ASCII 格式：**
```
x1 y1 z1 intensity1
x2 y2 z2 intensity2
...
```

**Binary 格式：**
- 二进制数据，需要按照 SIZE 和 TYPE 解析

---

## 转换工具使用

### 安装依赖

转换工具需要以下 Python 库：

```bash
# 基础库（必需）
pip install numpy

# LAS 格式转换（推荐）
pip install laspy

# 如果使用 PotreeConverter（可选）
# 需要下载 PotreeConverter: https://github.com/potree/PotreeConverter
```

### 使用方法

#### 1. 转换为 JSON 格式（推荐用于测试）

```bash
# 基本转换
python scripts/pcd_converter.py shared/data/test-5000w.pcd --format json

# 指定输出文件
python scripts/pcd_converter.py shared/data/test-5000w.pcd --format json --output public/test-5000w.json

# 采样转换（如果点太多）
python scripts/pcd_converter.py shared/data/test-5000w.pcd --format json --sample 100000
```

**输出格式：**
```json
{
  "version": "1.0",
  "points": 100000,
  "fields": ["x", "y", "z", "intensity"],
  "data": [
    {
      "x": 1.23,
      "y": 4.56,
      "z": 7.89,
      "intensity": 100.0
    },
    ...
  ]
}
```

#### 2. 转换为 LAS 格式（推荐用于生产）

```bash
# 转换为 LAS（Potree 原生支持）
python scripts/pcd_converter.py shared/data/test-5000w.pcd --format las

# 指定输出文件
python scripts/pcd_converter.py shared/data/test-5000w.pcd --format las --output public/test-5000w.las
```

**优势：**
- Potree 原生支持 LAS 格式
- 支持 LOD（细节层次）
- 性能最优
- 支持压缩（LAZ）

#### 3. 转换为简单 JSON 格式（用于快速测试）

```bash
# 转换为简单 JSON（自动采样 10 万点）
python scripts/pcd_converter.py shared/data/test-5000w.pcd --format simple-json

# 自定义采样大小
python scripts/pcd_converter.py shared/data/test-5000w.pcd --format simple-json --sample 50000
```

**输出格式：**
```json
{
  "points": [
    [1.23, 4.56, 7.89],
    [2.34, 5.67, 8.90],
    ...
  ]
}
```

### 转换选项说明

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--format` | 输出格式：json, las, simple-json | json |
| `--output` | 输出文件路径 | 输入文件名.格式 |
| `--sample` | 采样大小（仅 JSON 格式） | 不采样 |

---

## 在项目中使用转换后的文件

### 方法一：使用 LAS 格式（推荐）

1. **转换文件：**
   ```bash
   python scripts/pcd_converter.py shared/data/test-5000w.pcd --format las --output public/data/test-5000w.las
   ```

2. **在 Vue 项目中使用：**
   ```vue
   <script setup lang="ts">
   import { onMounted } from 'vue'
   import { usePotree } from '../composables/usePotree'
   
   const containerRef = ref<HTMLElement | null>(null)
   const { loadPointCloudFile } = usePotree(containerRef)
   
   onMounted(async () => {
     // 加载转换后的 LAS 文件
     await loadPointCloudFile('/data/test-5000w.las', 'Test Point Cloud')
   })
   </script>
   ```

3. **在 React 项目中使用：**
   ```tsx
   useEffect(() => {
     loadPointCloudFile('/data/test-5000w.las', 'Test Point Cloud')
   }, [])
   ```

### 方法二：使用 JSON 格式（测试用）

1. **转换文件：**
   ```bash
   python scripts/pcd_converter.py shared/data/test-5000w.pcd --format json --sample 100000 --output public/data/test-5000w.json
   ```

2. **创建加载器：**
   需要创建一个 JSON 加载器来解析 JSON 格式的点云数据。

### 方法三：直接在浏览器中解析 PCD（高级）

可以创建一个浏览器端的 PCD 解析器，直接读取 PCD 文件。

---

## 文件组织建议

```
pointcloud-viewer/
├── shared/
│   └── data/              # 原始 PCD 文件
│       └── test-5000w.pcd
├── public/
│   └── data/              # 转换后的文件（供前端使用）
│       ├── test-5000w.las
│       └── test-5000w.json
└── scripts/
    └── pcd_converter.py    # 转换脚本
```

---

## 常见问题

### Q1: 转换失败，提示缺少库

**A:** 安装必需的 Python 库：
```bash
pip install numpy laspy
```

### Q2: 文件太大，转换很慢

**A:** 使用采样选项：
```bash
python scripts/pcd_converter.py input.pcd --format json --sample 100000
```

### Q3: 二进制格式的 PCD 无法读取

**A:** 确保安装了 numpy：
```bash
pip install numpy
```

### Q4: Potree 无法加载转换后的文件

**A:** 
- 确保使用 LAS 格式（Potree 原生支持）
- 检查文件路径是否正确
- 检查文件是否在 `public/` 目录下

### Q5: 5000 万点太多，浏览器卡死

**A:** 
- 使用采样功能减少点数
- 使用 LAS 格式，Potree 会自动进行 LOD 优化
- 考虑使用 PotreeConverter 转换为八叉树格式

---

## 性能优化建议

### 1. 采样策略

对于超大规模点云（如 5000 万点），建议：

```bash
# 采样到 100 万点
python scripts/pcd_converter.py test-5000w.pcd --format las --sample 1000000
```

### 2. 使用 PotreeConverter（推荐）

PotreeConverter 可以将点云转换为八叉树格式，支持 LOD：

```bash
# 安装 PotreeConverter（需要单独下载）
# https://github.com/potree/PotreeConverter

# 先转换为 LAS
python scripts/pcd_converter.py test-5000w.pcd --format las --output temp.las

# 使用 PotreeConverter 转换
PotreeConverter temp.las -o public/pointclouds/
```

### 3. 压缩格式

使用 LAZ（压缩 LAS）格式可以大幅减少文件大小：

```bash
# 转换为 LAS 后，使用 laszip 压缩
laszip -i test-5000w.las -o test-5000w.laz
```

---

## 转换示例

### 完整工作流

```bash
# 1. 转换 PCD 为 LAS（采样到 100 万点）
python scripts/pcd_converter.py shared/data/test-5000w.pcd \
  --format las \
  --output public/data/test-5000w.las \
  --sample 1000000

# 2. 在 Vue 项目中加载
# 在 src-vue/components/PotreeViewer.vue 中：
onMounted(async () => {
  await loadPointCloudFile('/data/test-5000w.las', 'Test Cloud')
})
```

---

## 相关文档

- [Potree 官方文档](https://github.com/potree/potree)
- [PCL PCD 格式说明](http://pointclouds.org/documentation/tutorials/pcd_file_format.php)
- [LAS 格式规范](https://www.asprs.org/divisions-committees/lidar-division/laser-las-file-format-exchange-activities)

