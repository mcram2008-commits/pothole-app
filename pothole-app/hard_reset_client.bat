@echo off
echo ==========================================
echo       HARD RESET CLIENT (Fix v4/v3 Issue)
echo ==========================================

cd /d "%~dp0\client"

echo [1/4] Cleaning up old dependencies...
if exist "node_modules" (
    rmdir /s /q "node_modules"
)
if exist "package-lock.json" (
    del "package-lock.json"
)

echo [2/4] Installing Clean V3 Dependencies...
call npm install -D tailwindcss@3.4.17 postcss@8.4.35 autoprefixer@10.4.17 --legacy-peer-deps

echo [3/4] Installing Rest...
call npm install --legacy-peer-deps

echo [4/4] Starting Client...
call npm run dev
pause
