@echo off
echo ==========================================
echo       Last Minute Fix Server
echo ==========================================

cd /d "%~dp0"

echo Restarting Server...
taskkill /F /IM node.exe >nul 2>&1

start "Backend" cmd /k "cd server && npm start"
start "Frontend" cmd /k "cd client && npm run dev"

echo App is running. If client shows 'Vite' ready, refresh browser.
pause
