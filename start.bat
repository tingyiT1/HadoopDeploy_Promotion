@echo off
chcp 65001 >nul
echo ========================================
echo    HadoopDeploy_tool 宣传网站启动器
echo ========================================
echo.

:: 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] 检测到Python，使用Python启动服务器...
    echo [INFO] 网站将在 http://localhost:8000 启动
    echo [INFO] 按 Ctrl+C 停止服务器
    echo.
    python -m http.server 8000
    goto :end
)

:: 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] 检测到Node.js，使用npx serve启动服务器...
    echo [INFO] 网站将在 http://localhost:8000 启动
    echo [INFO] 按 Ctrl+C 停止服务器
    echo.
    npx serve -p 8000
    goto :end
)

:: 如果都没有安装，提示用户
echo [ERROR] 未检测到Python或Node.js
echo [INFO] 请安装以下任一工具：
echo       1. Python: https://www.python.org/downloads/
echo       2. Node.js: https://nodejs.org/
echo.
echo [INFO] 或者手动打开 index.html 文件
echo.
pause

:end 