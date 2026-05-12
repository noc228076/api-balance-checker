@echo off
setlocal enabledelayedexpansion

echo Building release packages...

:: Create output directory
if not exist "releases" mkdir releases

:: 1. Build the project
echo [1/4] Building project...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

:: 2. Create web deployment package
echo [2/4] Creating web deployment package...
powershell -Command "Compress-Archive -Path 'dist\*' -DestinationPath 'releases\api-balance-checker-web.zip' -Force"

:: 3. Create source code package
echo [3/4] Creating source code package...
powershell -Command "Get-ChildItem -Path . -Exclude 'node_modules','dist','.git','releases' | Compress-Archive -DestinationPath 'releases\api-balance-checker-source.zip' -Force"

:: 4. Create deployment configs
echo [4/4] Creating deployment configurations...

:: Create nginx.conf
(
echo server {
echo     listen 80;
echo     server_name localhost;
echo     root /usr/share/nginx/html;
echo     index index.html;
echo.
echo     ^# Handle Vue Router history mode
echo     location / {
echo         try_files $uri $uri/ /index.html;
echo     }
echo.
echo     ^# Static assets cache
echo     location /assets/ {
echo         expires 1y;
echo         add_header Cache-Control "public, immutable";
echo     }
echo }
) > "releases\nginx.conf"

:: Create vercel.json
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
) > "releases\vercel.json"

:: Create netlify.toml
(
echo [build]
echo   publish = "dist"
echo.
echo [[redirects]]
echo   from = "/*"
echo   to = "/index.html"
echo   status = 200
) > "releases\netlify.toml"

echo.
echo SUCCESS! Release packages created in 'releases' directory:
echo   - api-balance-checker-web.zip
echo   - api-balance-checker-source.zip
echo   - nginx.conf
echo   - vercel.json
echo   - netlify.toml
echo.
echo Upload these files to GitHub Release.