#!/bin/bash

echo "=========================================="
echo "     API 余额查询工具 - 一键启动"
echo "=========================================="
echo ""

# 设置项目目录
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="$PROJECT_DIR/logs/start.log"

# 创建日志目录
mkdir -p "$PROJECT_DIR/logs"

# 记录启动信息
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 启动 API 余额查询工具" >> "$LOG_FILE"

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "错误：未安装 Node.js！"
    echo "请先下载并安装 Node.js：https://nodejs.org/"
    echo ""
    read -p "按 Enter 键退出..."
    exit 1
fi

# 检查是否在项目目录
if [ ! -f "$PROJECT_DIR/package.json" ]; then
    echo "错误：未找到 package.json 文件！"
    echo "请在正确的项目目录下运行此脚本。"
    echo ""
    read -p "按 Enter 键退出..."
    exit 1
fi

echo "正在安装依赖（第一次运行会下载）..."
npm install

if [ $? -ne 0 ]; then
    echo "错误：依赖安装失败！"
    echo "请检查网络连接或手动运行 npm install"
    echo ""
    read -p "按 Enter 键退出..."
    exit 1
fi

echo ""
echo "启动开发服务器..."
echo ""
echo "服务器将在浏览器中自动打开"
echo "如果浏览器没有自动打开，请手动访问："
echo "http://localhost:5173"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 尝试自动打开浏览器
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:5173" &
elif command -v open &> /dev/null; then
    open "http://localhost:5173" &
elif command -v start &> /dev/null; then
    start "http://localhost:5173" &
fi

# 启动开发服务器
npm run dev