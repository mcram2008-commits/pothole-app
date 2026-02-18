@echo off
echo ==========================================
echo       Restarting Pothole App (Auth Added)
echo ==========================================

cd /d "%~dp0"

echo [1/3] Killing old processes...
taskkill /F /IM node.exe >nul 2>&1

echo [2/3] Installing new Auth Dependencies...
cd server && call npm install bcryptjs jsonwebtoken && cd ..
cd client && call npm install jwt-decode react-hook-form --legacy-peer-deps && cd ..

echo [3/3] Starting App...
start "Backend Server" cmd /k "cd server && npm start"
start "Frontend Client" cmd /k "cd client && npm run dev"

echo Done! The app now has Login/Register.
echo Default Admin: admin@pothole.com / admin123
pause
