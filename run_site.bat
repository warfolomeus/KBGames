@echo off
cd /d "%~dp0"

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo After installation, restart your computer and run this file again.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [SYSTEM] Installing dependencies...
    npm install
)

echo [SYSTEM] Starting dev server...
npm run dev

pause