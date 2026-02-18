@echo off
echo ==========================================
echo       FINAL HACKATHON FIX (NO DB)
echo ==========================================

cd /d "%~dp0"

echo [1/3] Clearing old processes...
taskkill /F /IM node.exe >nul 2>&1

echo [2/3] Installing Dependencies (Fixing Versions)...
cd server 
call npm install express cors multer bcryptjs jsonwebtoken --legacy-peer-deps
cd ..

cd client
echo Installing Client Dependencies (ignoring peer conflicts)...
call npm install --legacy-peer-deps
REM Force install compatible react-leaflet just in case
call npm install react-leaflet@4.2.1 leaflet --legacy-peer-deps
cd ..

echo [3/3] Starting App (Zero-Config Mode)...
start "Backend (JSON DB)" cmd /k "cd server && npm start"
start "Frontend" cmd /k "cd client && npm run dev"

echo.
echo ==========================================
echo LOGIN CREDENTIALS (Auto-Created):
echo Admin: admin@pothole.com / admin123
echo ==========================================
echo Register any citizen account to test citizen flow.
echo All data is saved to 'server/database.json'.
pause
