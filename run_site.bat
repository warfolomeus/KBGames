@echo off
cd /d "%~dp0"

:: Проверка наличия npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js не найден!
    echo.
    echo Для работы комплекса необходимо установить Node.js.
    echo Скачать: https://nodejs.org/
    echo.
    echo После установки Node.js перезагрузите компьютер и запустите этот файл снова.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [SYSTEM] Libraries not found. Installing...
    npm install
)

echo [SYSTEM] Starting dev server...
npm run dev

pause