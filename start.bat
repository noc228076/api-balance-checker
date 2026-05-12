@echo off
echo ===========================================
echo      API 余额查询工具 - 一键启动
echo ===========================================
echo.

:: 获取项目目录
set PROJECT_DIR=%~dp0
set LOG_FILE=%PROJECT_DIR%logs\start.log

:: 创建日志目录
if not exist "%PROJECT_DIR%logs" mkdir "%PROJECT_DIR%logs"

:: 记录启动信息
echo [%DATE% %TIME%] 启动 API 余额查询工具 >> "%LOG_FILE%"

:: 检查 Node.js 是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未安装 Node.js。
    echo 请前往下载安装 Node.js：https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 检查是否存在项目目录
if not exist "%PROJECT_DIR%package.json" (
    echo 错误：未找到 package.json 文件。
    echo 请确保在项目目录下运行此脚本。
    echo.
    pause
    exit /b 1
)

echo 正在安装依赖，请稍候（首次运行较慢）...
call npm install

if %errorlevel% neq 0 (
    echo 错误：依赖安装失败！
    echo 请检查网络连接或手动运行 npm install
    echo.
    pause
    exit /b 1
)

echo.
echo 正在启动开发服务器...
echo.
echo 如果浏览器没有自动打开，请手动访问：
echo http://localhost:5173
echo.
echo 按 Ctrl+C 停止服务器
echo.

:: 启动开发服务器
call npm run dev

pause