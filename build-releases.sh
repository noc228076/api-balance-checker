#!/bin/bash

# 构建 releases 脚本
# 创建不同平台的安装包

echo "🚀 开始构建 releases..."

# 创建输出目录
mkdir -p releases

# 1. 构建 Web 版本（已通过 npm run build 完成）
echo "✅ Web 版本构建完成"

# 2. 创建 ZIP 压缩包
echo "📦 创建 ZIP 压缩包..."
cd dist
zip -r ../releases/api-balance-checker-web.zip .
cd ..

# 3. 创建 Nginx 静态文件部署包
echo "🖥️ 创建 Nginx 部署包..."
mkdir -p releases/nginx-deploy
cp -r dist/* releases/nginx-deploy/
# 创建简单的 nginx 配置
cat > releases/nginx-deploy/nginx.conf << 'EOF'
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
cd releases
zip -r nginx-deploy.zip nginx-deploy
cd ..

# 4. 创建 Vercel 部署配置
echo "🚀 创建 Vercel 部署配置..."
mkdir -p releases/vercel-deploy
cat > releases/vercel-deploy/vercel.json << 'EOF'
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
cp -r dist/* releases/vercel-deploy/
cd releases
zip -r vercel-deploy.zip vercel-deploy
cd ..

# 5. 创建 Netlify 部署配置
echo "🌐 创建 Netlify 部署配置..."
mkdir -p releases/netlify-deploy
cat > releases/netlify-deploy/netlify.toml << 'EOF'
[build]
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF
cp -r dist/* releases/netlify-deploy/
cd releases
zip -r netlify-deploy.zip netlify-deploy
cd ..

# 6. 创建源代码包（排除 node_modules 和 dist）
echo "💾 创建源代码包..."
zip -r -x "node_modules/*" -x "dist/*" -x ".git/*" -x ".gitignore" api-balance-checker-source.zip .

# 7. 创建安装说明文档
cat > releases/README.md << 'EOF'
# API Balance Checker Releases

## 📦 发布包说明

### 1. api-balance-checker-web.zip
- **用途**: Web 服务器直接部署
- **包含**: 完整的前端文件
- **部署**: 解压到 Web 服务器根目录

### 2. nginx-deploy.zip
- **用途**: Nginx 服务器部署
- **包含**: 前端文件 + nginx.conf
- **部署**:
  1. 解压到 /usr/share/nginx/html
  2. 配置 nginx.conf
  3. 重启 nginx

### 3. vercel-deploy.zip
- **用途**: Vercel 部署
- **包含**: 前端文件 + vercel.json
- **部署**: 直接上传到 Vercel

### 4. netlify-deploy.zip
- **用途**: Netlify 部署
- **包含**: 前端文件 + netlify.toml
- **部署**: 直接上传到 Netlify

### 5. api-balance-checker-source.zip
- **用途**: 源代码备份
- **包含**: 完整源代码（排除 node_modules 和 dist）

## 🚀 快速部署

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### Docker 部署（可选）
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
```

## 🔗 在线部署选项

- **Vercel**: https://vercel.com
- **Netlify**: https://netlify.com
- **GitHub Pages**: https://pages.github.com
- **Railway**: https://railway.app

## 📝 注意事项

1. 确保服务器支持 SPA（单页应用）路由
2. 配置正确的 MIME 类型
3. 生产环境建议启用 HTTPS
4. 可配置 CDN 加速静态资源
EOF

echo ""
echo "🎉 Releases 构建完成！"
echo "📂 发布包位置: releases/"
echo ""
ls -la releases/