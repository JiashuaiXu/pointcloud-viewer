#!/usr/bin/env python3
"""
PCD 文件转换工具
支持将 PCD 文件转换为多种格式，供 Potree 渲染使用

使用方法:
    python scripts/pcd_converter.py <input.pcd> [--format <format>] [--output <output>]

支持的格式:
    - json: JSON 格式（简单点云数据）
    - las: LAS 格式（推荐，Potree 原生支持）
    - potree: Potree 格式（需要 PotreeConverter）
"""

import argparse
import struct
import json
import os
import sys
from pathlib import Path
from typing import List, Tuple, Dict, Any

try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    HAS_NUMPY = False
    print("警告: 未安装 numpy，某些功能可能受限。建议运行: pip install numpy")

try:
    import laspy
    HAS_LASPY = True
except ImportError:
    HAS_LASPY = False
    print("警告: 未安装 laspy，无法转换为 LAS 格式。建议运行: pip install laspy")


class PCDParser:
    """PCD 文件解析器"""
    
    def __init__(self, filepath: str):
        self.filepath = filepath
        self.version = None
        self.fields = []
        self.size = []
        self.type = []
        self.count = []
        self.width = 0
        self.height = 0
        self.viewpoint = None
        self.points = 0
        self.data_type = None
        self.data_start = 0
        
    def parse_header(self) -> None:
        """解析 PCD 文件头"""
        with open(self.filepath, 'r', encoding='utf-8', errors='ignore') as f:
            lines = []
            while True:
                line = f.readline()
                if not line:
                    break
                line = line.strip()
                if line.startswith('DATA'):
                    self.data_type = line.split()[1] if len(line.split()) > 1 else 'ascii'
                    self.data_start = f.tell()
                    break
                lines.append(line)
                
                # 解析各个字段
                if line.startswith('VERSION'):
                    self.version = line.split()[1]
                elif line.startswith('FIELDS'):
                    self.fields = line.split()[1:]
                elif line.startswith('SIZE'):
                    self.size = [int(x) for x in line.split()[1:]]
                elif line.startswith('TYPE'):
                    self.type = line.split()[1:]
                elif line.startswith('COUNT'):
                    self.count = [int(x) for x in line.split()[1:]]
                elif line.startswith('WIDTH'):
                    self.width = int(line.split()[1])
                elif line.startswith('HEIGHT'):
                    self.height = int(line.split()[1])
                elif line.startswith('POINTS'):
                    self.points = int(line.split()[1])
                elif line.startswith('VIEWPOINT'):
                    self.viewpoint = line.split()[1:]
    
    def read_points_ascii(self) -> List[List[float]]:
        """读取 ASCII 格式的点云数据"""
        points = []
        with open(self.filepath, 'r', encoding='utf-8', errors='ignore') as f:
            # 读取到 DATA 行
            while True:
                line = f.readline()
                if not line:
                    break
                if line.strip().startswith('DATA'):
                    break
            
            # 读取点数据
            for _ in range(self.points):
                line = f.readline().strip()
                if not line:
                    break
                try:
                    values = list(map(float, line.split()))
                    if len(values) >= len(self.fields):
                        points.append(values)
                except ValueError:
                    continue
        
        return points
    
    def read_points_binary(self) -> List[List[float]]:
        """读取二进制格式的点云数据"""
        if not HAS_NUMPY:
            raise RuntimeError("需要 numpy 来读取二进制格式")
        
        points = []
        with open(self.filepath, 'rb') as f:
            f.seek(self.data_start)
            
            # 计算每个点的字节数
            point_size = sum(s * c for s, c in zip(self.size, self.count))
            
            for _ in range(self.points):
                point_data = f.read(point_size)
                if len(point_data) < point_size:
                    break
                
                point = []
                offset = 0
                for field, size, type_char, count in zip(self.fields, self.size, self.type, self.count):
                    for _ in range(count):
                        if type_char == 'F':
                            value = struct.unpack('f', point_data[offset:offset+4])[0]
                        elif type_char == 'I':
                            value = struct.unpack('i', point_data[offset:offset+4])[0]
                        elif type_char == 'U':
                            value = struct.unpack('I', point_data[offset:offset+4])[0]
                        else:
                            value = 0
                        point.append(value)
                        offset += size
                
                points.append(point)
        
        return points
    
    def read_points(self) -> List[List[float]]:
        """读取点云数据（自动检测格式）"""
        self.parse_header()
        
        if self.data_type == 'ascii':
            return self.read_points_ascii()
        elif self.data_type == 'binary':
            return self.read_points_binary()
        else:
            raise ValueError(f"不支持的数据格式: {self.data_type}")


class PCDConverter:
    """PCD 转换器"""
    
    def __init__(self, input_file: str):
        self.parser = PCDParser(input_file)
        self.points = None
        
    def convert_to_json(self, output_file: str, sample_size: int = None) -> None:
        """
        转换为 JSON 格式
        
        Args:
            output_file: 输出文件路径
            sample_size: 采样大小（如果点太多，可以采样）
        """
        if self.points is None:
            self.points = self.parser.read_points()
        
        # 采样（如果指定）
        if sample_size and len(self.points) > sample_size:
            import random
            self.points = random.sample(self.points, sample_size)
            print(f"采样: {len(self.points)} 个点")
        
        # 构建 JSON 数据
        data = {
            "version": "1.0",
            "points": len(self.points),
            "fields": self.parser.fields,
            "data": []
        }
        
        # 提取 x, y, z 坐标（假设前三个字段是 x, y, z）
        x_idx = self.parser.fields.index('x') if 'x' in self.parser.fields else 0
        y_idx = self.parser.fields.index('y') if 'y' in self.parser.fields else 1
        z_idx = self.parser.fields.index('z') if 'z' in self.parser.fields else 2
        
        for point in self.points:
            data["data"].append({
                "x": float(point[x_idx]),
                "y": float(point[y_idx]),
                "z": float(point[z_idx]),
                "intensity": float(point[3]) if len(point) > 3 else 0.0
            })
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        
        print(f"✓ 已转换为 JSON: {output_file}")
        print(f"  点数: {len(self.points)}")
    
    def convert_to_las(self, output_file: str) -> None:
        """
        转换为 LAS 格式
        
        Args:
            output_file: 输出文件路径
        """
        if not HAS_LASPY:
            raise RuntimeError("需要 laspy 库。安装: pip install laspy")
        
        if not HAS_NUMPY:
            raise RuntimeError("需要 numpy 库。安装: pip install numpy")
        
        if self.points is None:
            self.points = self.parser.read_points()
        
        # 转换为 numpy 数组
        points_array = np.array(self.points)
        
        # 创建 LAS 文件
        header = laspy.LasHeader(point_format=1, version="1.2")
        header.x_scale = 0.01
        header.y_scale = 0.01
        header.z_scale = 0.01
        
        # 计算边界
        x_idx = self.parser.fields.index('x') if 'x' in self.parser.fields else 0
        y_idx = self.parser.fields.index('y') if 'y' in self.parser.fields else 1
        z_idx = self.parser.fields.index('z') if 'z' in self.parser.fields else 2
        
        x_coords = points_array[:, x_idx]
        y_coords = points_array[:, y_idx]
        z_coords = points_array[:, z_idx]
        
        header.min = [float(np.min(x_coords)), float(np.min(y_coords)), float(np.min(z_coords))]
        header.max = [float(np.max(x_coords)), float(np.max(y_coords)), float(np.max(z_coords))]
        
        las = laspy.LasData(header)
        las.x = x_coords
        las.y = y_coords
        las.z = z_coords
        
        # 如果有 intensity 字段
        if 'intensity' in self.parser.fields:
            intensity_idx = self.parser.fields.index('intensity')
            las.intensity = points_array[:, intensity_idx].astype(np.uint16)
        
        las.write(output_file)
        print(f"✓ 已转换为 LAS: {output_file}")
        print(f"  点数: {len(self.points)}")
    
    def convert_to_simple_json(self, output_file: str, sample_size: int = 100000) -> None:
        """
        转换为简单的 JSON 格式（用于测试，只包含坐标）
        
        Args:
            output_file: 输出文件路径
            sample_size: 采样大小（默认 10 万点）
        """
        if self.points is None:
            self.points = self.parser.read_points()
        
        # 采样
        if len(self.points) > sample_size:
            import random
            sampled_points = random.sample(self.points, sample_size)
            print(f"采样: {sample_size} 个点（原始: {len(self.points)} 个点）")
        else:
            sampled_points = self.points
        
        # 提取坐标
        x_idx = self.parser.fields.index('x') if 'x' in self.parser.fields else 0
        y_idx = self.parser.fields.index('y') if 'y' in self.parser.fields else 1
        z_idx = self.parser.fields.index('z') if 'z' in self.parser.fields else 2
        
        data = {
            "points": [
                [float(p[x_idx]), float(p[y_idx]), float(p[z_idx])]
                for p in sampled_points
            ]
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f)
        
        print(f"✓ 已转换为简单 JSON: {output_file}")
        print(f"  点数: {len(sampled_points)}")


def main():
    parser = argparse.ArgumentParser(description='PCD 文件转换工具')
    parser.add_argument('input', help='输入的 PCD 文件路径')
    parser.add_argument('--format', choices=['json', 'las', 'simple-json'], 
                       default='json', help='输出格式（默认: json）')
    parser.add_argument('--output', help='输出文件路径（默认: 输入文件名.格式）')
    parser.add_argument('--sample', type=int, help='采样大小（仅用于 JSON 格式）')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.input):
        print(f"错误: 文件不存在: {args.input}")
        sys.exit(1)
    
    # 确定输出文件路径
    if args.output:
        output_file = args.output
    else:
        input_path = Path(args.input)
        if args.format == 'json':
            output_file = str(input_path.with_suffix('.json'))
        elif args.format == 'las':
            output_file = str(input_path.with_suffix('.las'))
        elif args.format == 'simple-json':
            output_file = str(input_path.with_suffix('.simple.json'))
    
    try:
        converter = PCDConverter(args.input)
        
        if args.format == 'json':
            converter.convert_to_json(output_file, args.sample)
        elif args.format == 'las':
            converter.convert_to_las(output_file)
        elif args.format == 'simple-json':
            converter.convert_to_simple_json(output_file, args.sample or 100000)
        
        print(f"\n转换完成！")
        print(f"输入: {args.input}")
        print(f"输出: {output_file}")
        
    except Exception as e:
        print(f"错误: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()

