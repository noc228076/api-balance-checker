#!/bin/bash

# Release 准备脚本
# 这个脚本会构建项目并创建发布包，但不会提交到 git

set -e

echo "🚀 准备 API Balance Checker Release..."

# 创建临时目录
TEMP_DIR="./release-temp"
mkdir -p "$TEMP_DIR"

# 1. 构建项目
echo "📦 构建项目..."
npm run build

# 2. 复制构建文件到临时目录
echo "📁 准备发布文件..."
cp -r dist/* "$TEMP_DIR/"

# 3. 创建部署配置
echo "⚙️ 创建部署配置..."

# Nginx 配置
cat > "$TEMP_DIR/nginx.conf" << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # 处理 Vue Router 的 history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Vercel 配置
cat > "$TEMP_DIR/vercel.json" << 'EOF'
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
EOF

# Netlify 配置
cat > "$TEMP_DIR/netlify.toml" << 'EOF'
[build]
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

# 4. 创建 README
cat > "$TEMP_DIR/README.md" << 'EOF'
# API Balance Checker - 部署说明

## 🚀 快速部署

### 本地运行
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### Web 服务器部署
将所有文件上传到你的 Web 服务器即可。

### Nginx 部署
1. 复制所有文件到 /usr/share/nginx/html
2. 配置 nginx.conf
3. 重启 nginx

### Vercel 部署
1. 上传所有文件到 Vercel
2. vercel.json 会自动配置构建和路由

### Netlify 部署
1. 上传所有文件到 Netlify
2. netlify.toml 会自动配置构建和重定向

## 📋 支持的平台
- OpenAI
- Claude
- Gemini
- DeepSeek
- 硅基流动
- 智谱AI
- 自定义 API

## 🔗 项目地址
https://github.com/noc228076/api-balance-checker
EOF

# 5. 创建发布包
echo "📦 创建发布包..."

# Web 版本
cd "$TEMP_DIR"
zip -r "../api-balance-checker-web.zip" .
cd ..

# 源代码包（不包括 node_modules 和 dist）
cd ..
zip -r "api-balance-checker-source.zip" . -x "node_modules/*" "dist/*" ".git/*" "release-temp/*" ".gitignore" "releases/*"
cd release-temp

# 清理
cd ..
rm -rf "$TEMP_DIR"

echo ""
echo "✅ Release 准备完成！"
echo "📁 生成的文件："
echo "   - api-balance-checker-web.zip"
echo "   - api-balance-checker-source.zip"
echo ""
echo "📝 上传到 GitHub Release："