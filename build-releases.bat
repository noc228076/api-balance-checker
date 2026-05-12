@echo off
setlocal

echo 🚀 开始构建 releases...

:: 创建输出目录
if not exist "releases" mkdir releases

:: 1. 构建 Web 版本
echo ✅ 构建Web版本...
call npm run build

if errorlevel 1 (
    echo ❌ 构建失败！
    pause
    exit /b 1
)

:: 2. 创建 ZIP 压缩包
echo 📦 创建 ZIP 压缩包...
powershell -Command "Compress-Archive -Path 'dist\*' -DestinationPath 'releases\api-balance-checker-web.zip' -Force"

:: 3. 创建 Nginx 静态文件部署包
echo 🖥️ 创建 Nginx 部署包...
if not exist "releases\nginx-deploy" mkdir releases\nginx-deploy
xcopy "dist\*" "releases\nginx-deploy\" /E /I /Y

:: 创建 nginx 配置
(
echo server {
echo     listen 80;
echo     server_name localhost;
echo     root /usr/share/nginx/html;
echo     index index.html;
echo.
echo     ^# 处理 Vue Router 的 history 模式
echo     location / {
echo         try_files $uri $uri/ /index.html;
echo     }
echo.
echo     ^# 静态资源缓存
echo     location /assets/ {
echo         expires 1y;
echo         add_header Cache-Control "public, immutable";
echo     }
echo }
) > "releases\nginx-deploy\nginx.conf"

:: 压缩 Nginx 部署包
powershell -Command "Compress-Archive -Path 'releases\nginx-deploy\*' -DestinationPath 'releases\nginx-deploy.zip' -Force"

:: 4. 创建 Vercel 部署配置
echo 🚀 创建 Vercel 部署包...
if not exist "releases\vercel-deploy" mkdir releases\vercel-deploy

:: 创建 vercel.json
(
echo {
echo   "builds": [
echo     {
echo       "src": "package.json",
echo       "use": "@vercel/static-build",
echo       "config": {
echo         "distDir": "dist"
echo       }
echo     }
echo   ],
echo   "routes": [
echo     {
echo       "src": "/(.*)",
echo       "dest": "/index.html"
echo     }
echo   ]
echo }
) > "releases\vercel-deploy\vercel.json"

xcopy "dist\*" "releases\vercel-deploy\" /E /I /Y
powershell -Command "Compress-Archive -Path 'releases\vercel-deploy\*' -DestinationPath 'releases\vercel-deploy.zip' -Force"

:: 5. 创建 Netlify 部署配置
echo 🌐 创建 Netlify 部署包...
if not exist "releases\netlify-deploy" mkdir releases\netlify-deploy

:: 创建 netlify.toml
(
echo [build]
echo   publish = "dist"
echo.
echo [[redirects]]
echo   from = "/*"
echo   to = "/index.html"
echo   status = 200
) > "releases\netlify-deploy\netlify.toml"

xcopy "dist\*" "releases\netlify-deploy\" /E /I /Y
powershell -Command "Compress-Archive -Path 'releases\netlify-deploy\*' -DestinationPath 'releases\netlify-deploy.zip' -Force"

:: 6. 创建源代码包
echo 💾 创建源代码包...
powershell -Command "Compress-Archive -Path '*' -DestinationPath 'releases\api-balance-checker-source.zip' -PathExclude 'node_modules','dist','.git','releases' -Force"

:: 7. 创建安装说明文档
(
echo # API Balance Checker Releases
echo.
echo ## ^^^^^ 发布包说明
echo.
echo ### 1. api-balance-checker-web.zip
echo - ^^^^: Web 服务器直接部署
echo - ^^^^: 完整的前端文件
echo - ^^^^: 解压到 Web 服务器根目录
echo.
echo ### 2. nginx-deploy.zip
echo - ^^^^: Nginx 服务器部署
echo - ^^^^: 前端文件 + nginx.conf
echo - ^^^^^:
echo   1. 解压到 /usr/share/nginx/html
echo   2. 配置 nginx.conf
echo   3. 重启 nginx
echo.
echo ### 3. vercel-deploy.zip
echo - ^^^^: Vercel 部署
echo - ^^^^: 前端文件 + vercel.json
echo - ^^^^: 直接上传到 Vercel
echo.
echo ### 4. netlify-deploy.zip
echo - ^^^^: Netlify 部署
echo - ^^^^: 前端文件 + netlify.toml
echo - ^^^^: 直接上传到 Netlify
echo.
echo ### 5. api-balance-checker-source.zip
echo - ^^^^: 源代码备份
echo - ^^^^: 完整源代码（排除 node_modules 和 dist）
echo.
echo ## ^^^^^^ 快速部署
echo.
echo ### 本地开发
echo ```bash
echo ^# 安装依赖
echo npm install
echo.
echo ^# 启动开发服务器
echo npm run dev
echo.
echo ^# 构建生产版本
echo npm run build
echo ```
echo.
echo ### Docker 部署（可选）
echo ```dockerfile
echo FROM nginx:alpine
echo COPY dist/ /usr/share/nginx/html/
echo ```
echo.
echo ## ^^^^ 在线部署选项
echo.
echo - ^^^^^^: https://vercel.com
echo - ^^^^^^: https://netlify.com
echo - ^^^^^^: https://pages.github.com
echo - ^^^^^^: https://railway.app
echo.
echo ## ^^^^^^ 注意事项
echo.
echo 1. 确保服务器支持 SPA（单页应用）路由
echo 2. 配置正确的 MIME 类型
echo 3. 生产环境建议启用 HTTPS
echo 4. 可配置 CDN 加速静态资源
) > "releases\README.md"

echo.
echo 🎉 Releases 构建完成！
echo 📂 发布包位置: releases\
echo.

:: 显示生成的文件
dir /B "releases\"

echo.
pause