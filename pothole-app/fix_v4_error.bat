@echo off
echo ==========================================
echo       Fixing Tailwind v4 Error...
echo ==========================================

cd /d "%~dp0"

echo [1/5] Stopping any running node processes...
taskkill /F /IM node.exe >nul 2>&1

echo [2/5] Cleaning Client Dependencies...
cd client
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del "package-lock.json"

echo [3/5] Installing Correct Tailwind v3...
call npm install -D tailwindcss@3.4.17 postcss@8.4.35 autoprefixer@10.4.17 --legacy-peer-deps

echo [4/5] Installing Client Dependencies...
call npm install --legacy-peer-deps
cd ..

echo [5/5] Starting App...
start "Backend Server" cmd /k "cd server && npm start"
start "Frontend Client" cmd /k "cd client && npm run dev"

echo Done! Browser should open shortly at http://localhost:5173
pause
