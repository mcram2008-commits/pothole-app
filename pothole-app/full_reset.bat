@echo off
echo ==========================================
echo       RESET ADMIN and START DB
echo ==========================================

cd /d "%~dp0"

echo [1/3] Trying to start MongoDB...
start "MongoDB" cmd /c "mongod --dbpath data/db || echo Mongo may already be running or failed."
timeout /t 5 /nobreak

echo [2/3] Resetting Admin Credentials...
cd server
call node reset_admin.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Could not connect to MongoDB.
    echo Please ensure MongoDB is installed and running!
    pause
    exit /b
)
cd ..

echo [3/3] Restarting App...
taskkill /F /IM node.exe >nul 2>&1
start "Backend" cmd /k "cd server && npm start"
start "Frontend" cmd /k "cd client && npm run dev"

echo.
echo ==========================================
echo Login Credentials:
echo Admin: admin@pothole.com / admin123
echo ==========================================
echo Register any citizen account to test citizen flow.
pause
