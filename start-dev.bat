@echo off
title Lynmeto's Blog - 本地实时预览服务
cd /d "%~dp0"

echo ==================================================
echo 正在启动博客本地实时预览服务...
echo 预览地址: http://localhost:4321
echo 提示：只要保持此窗口开启，在 Obsidian 里保存文章即刻实时预览！
echo ==================================================
echo.

call npm run dev
pause
