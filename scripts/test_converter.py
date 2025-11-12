#!/usr/bin/env python3
"""
测试 PCD 转换器
创建一个小的测试 PCD 文件用于测试
"""

import os
from pathlib import Path

def create_test_pcd():
    """创建一个小的测试 PCD 文件"""
    test_data = """VERSION 0.7
FIELDS x y z intensity
SIZE 4 4 4 4
TYPE F F F F
COUNT 1 1 1 1
WIDTH 100
HEIGHT 1
POINTS 100
VIEWPOINT 0 0 0 1 0 0 0
DATA ascii
"""
    
    # 生成 100 个测试点
    points = []
    for i in range(100):
        x = i * 0.1
        y = i * 0.2
        z = i * 0.3
        intensity = i * 10.0
        points.append(f"{x} {y} {z} {intensity}\n")
    
    test_content = test_data + "".join(points)
    
    # 保存到 shared/data/test-small.pcd
    output_dir = Path("shared/data")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_file = output_dir / "test-small.pcd"
    with open(output_file, 'w') as f:
        f.write(test_content)
    
    print(f"✓ 创建测试文件: {output_file}")
    print(f"  点数: 100")
    return str(output_file)

if __name__ == '__main__':
    create_test_pcd()

