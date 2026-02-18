@echo off
echo ==========================================
echo    FORCE START - RESTORING REACT APP
echo ==========================================

cd /d "%~dp0"

echo [1/3] Killing processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo [2/3] Starting Backend (Port 5000)...
start "Backend Window" cmd /k "cd server && npm start"
timeout /t 5 >nul

echo [3/3] Starting Frontend (React/Vite)...
start "Frontend Window" cmd /k "cd client && npm run dev"

echo.
echo ==========================================
echo App restored to previous REACT version.
echo Access at: http://localhost:5173
echo.
echo IF LOGIN FAILS, USE:
echo Admin: admin@pothole.com / admin123
echo Officer: officer@pothole.com / officer123
echo ==========================================
pause
