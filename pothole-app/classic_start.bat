@echo off
echo ==========================================
echo        CLASSIC STACK - START
echo ==========================================
cd /d "%~dp0"

echo [1/2] Installing SQLite (Required)...
cd server && call npm install sqlite3 --no-audit >nul 2>&1
cd ..

echo [2/2] Starting Server...
start "Classic Server (Port 5000)" cmd /k "cd server && node index.js"

echo.
echo ==========================================
echo     APP RUNNING ON CLASSIC STACK
echo ==========================================
echo Access the site at:
echo http://localhost:5000
echo.
echo Login with:
echo Admin: admin@pothole.com / admin123
echo Officer: officer@pothole.com / officer123
echo Citizen: citizen@pothole.com / citizen123
echo ==========================================
pause
