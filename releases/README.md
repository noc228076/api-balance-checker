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
