# PCD 转换脚本

## 安装依赖

```bash
pip install -r scripts/requirements.txt
```

或者单独安装：

```bash
pip install numpy laspy
```

## 使用方法

```bash
# 转换为 JSON 格式
python scripts/pcd_converter.py shared/data/test-5000w.pcd --format json

# 转换为 LAS 格式（推荐）
python scripts/pcd_converter.py shared/data/test-5000w.pcd --format las

# 转换为简单 JSON（自动采样）
python scripts/pcd_converter.py shared/data/test-5000w.pcd --format simple-json
```

详细说明请查看 [docs/PCD_CONVERSION_GUIDE.md](../docs/PCD_CONVERSION_GUIDE.md)

