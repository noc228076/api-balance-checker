@echo off
setlocal

echo 🚀 准备 API Balance Checker Release...

:: 创建临时目录
set TEMP_DIR=release-temp
if exist "%TEMP_DIR%" rmdir /s /q "%TEMP_DIR%"
mkdir "%TEMP_DIR%"

:: 1. 构建项目
echo 📦 构建项目...
call npm run build

if errorlevel 1 (
    echo ❌ 构建失败！
    pause
    exit /b 1
)

:: 2. 复制构建文件到临时目录
echo 📁 准备发布文件...
xcopy "dist\*" "%TEMP_DIR%\" /E /I /Y

:: 3. 创建部署配置
echo ⚙️ 创建部署配置...

:: Nginx 配置 (
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
) > "%TEMP_DIR%\nginx.conf"

:: Vercel 配置
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
) > "%TEMP_DIR%\vercel.json"

:: Netlify 配置
(
echo [build]
echo   publish = "dist"
echo.
echo [[redirects]]
echo   from = "/*"
echo   to = "/index.html"
echo   status = 200
) > "%TEMP_DIR%\netlify.toml"

:: 4. 创建 README
(
echo # API Balance Checker - ^^^^ ^^^^
echo.
echo ## ^^^^^ ^^^^^
echo.
echo ### ^^^^ ^^^^^
echo ```bash
echo ^# ^^^^ ^^^^
echo npm install
echo.
echo ^# ^^^^ ^^^^^ ^^^^
echo npm run dev
echo.
echo ^# ^^^^ ^^^^^ ^^^^
echo npm run build
echo ```
echo.
echo ### ^^^^ ^^^^ ^^^^
echo ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^
echo 1. ^^^^ ^^^^ ^^^^ ^^^^ /usr/share/nginx/html
echo 2. ^^^^ nginx.conf
echo 3. ^^^^ ^^^^ nginx
echo.
echo ### ^^^^ ^^^^ ^^^^
echo 1. ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ Vercel
echo 2. ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^
echo.
echo ### ^^^^ ^^^^ ^^^^
echo 1. ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ Netlify
echo 2. ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^ ^^^^
echo.
echo ## ^^^^ ^^^^ ^^^^
echo - ^^^^^^
echo - ^^^^^
echo - ^^^^^^
echo - ^^^^^^^^
echo - ^^^^^^^^^^^^
echo - ^^^^^^^^^^
echo - ^^^^^^ ^^^^ ^^^^
echo.
echo ## ^^^^ ^^^^ ^^^^
echo https://github.com/noc228076/api-balance-checker
) > "%TEMP_DIR%\README.md"

:: 5. 创建发布包
echo 📦 创建发布包...

:: Web 版本
powershell -Command "Compress-Archive -Path '%TEMP_DIR%\*' -DestinationPath 'api-balance-checker-web.zip' -Force"

:: 源代码包
powershell -Command "Get-ChildItem -Path . -Exclude 'node_modules','dist','.git','release-temp','releases' | Compress-Archive -DestinationPath 'api-balance-checker-source.zip' -Force"

:: 清理
rmdir /s /q "%TEMP_DIR%"

echo.
echo ✅ Release 准备完成！
echo 📁 生成的文件：
echo    - api-balance-checker-web.zip
echo    - api-balance-checker-source.zip
echo.
echo 📝 上传到 GitHub Release：
echo    1. 访问 https://github.com/noc228076/api-balance-checker/releases
echo    2. 点击 "Create a new release"
echo    3. 上传这两个 ZIP 文件
echo.

pause