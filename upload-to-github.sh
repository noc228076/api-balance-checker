#!/bin/bash

echo "========================================"
echo "  API 余额查询工具 - GitHub 上传助手"
echo "========================================"
echo ""

# 检查是否已配置远程仓库
if git remote -v &>/dev/null; then
    echo "[提示] 检测到已配置的远程仓库"
    git remote -v
    echo ""
    read -p "是否继续推送？(y/n): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        exit 0
    fi
else
    echo "[提示] 尚未配置远程仓库"
    echo ""
    echo "请先在 GitHub 创建仓库，然后运行以下命令："
    echo ""
    echo "git remote add origin https://github.com/YOUR_USERNAME/api-balance-checker.git"
    echo ""
    read -p "请输入你的 GitHub 用户名: " username
    
    if [ -z "$username" ]; then
        echo "[错误] 用户名不能为空"
        exit 1
    fi
    
    echo ""
    echo "正在添加远程仓库..."
    git remote add origin "https://github.com/${username}/api-balance-checker.git"
    
    if [ $? -ne 0 ]; then
        echo "[错误] 添加远程仓库失败"
        exit 1
    fi
    echo "[成功] 远程仓库已添加"
fi

echo ""
echo "正在切换分支到 main..."
git branch -M main

echo ""
echo "正在推送到 GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  🎉 推送成功！"
    echo "========================================"
    echo ""
    echo "访问你的仓库："
    echo "https://github.com/${username}/api-balance-checker"
    echo ""
else
    echo ""
    echo "========================================"
    echo "  ❌ 推送失败"
    echo "========================================"
    echo ""
    echo "可能的原因："
    echo "1. 网络连接问题"
    echo "2. GitHub 认证失败（需要配置 SSH 或 Personal Access Token）"
    echo "3. 仓库不存在或权限不足"
    echo ""
    echo "请检查上述问题后重试"
fi