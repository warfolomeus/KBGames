@echo off
chcp 65001 >nul
cd /d "%~dp0"

:: Проверка наличия npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js ne naiden!
    echo.
    echo Dlya raboty kompleksa neobhodimo ustanovit Node.js.
    echo Skachat: https://nodejs.org/
    echo.
    echo Posle ustanovki Node.js perezagruzite kompyuter i zapustite etot fail snova.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [SYSTEM] Biblioteki ne naideny. Ustanovka...
    npm install
)

echo [SYSTEM] Zapusk dev servera...
npm run dev

pause