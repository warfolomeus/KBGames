@echo off
cd /d "%~dp0"

if not exist "node_modules\" (
    echo [SYSTEM] Libraries not found. Installing...
    npm install
)

echo [SYSTEM] Starting dev server...
npm run dev

pause