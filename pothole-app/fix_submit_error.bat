@echo off
echo ==========================================
echo       Fixing "Failed to Submit" Error
echo ==========================================

cd /d "%~dp0"

echo [1/3] Ensuring Uploads Folder Exists...
if not exist "server\uploads" (
    mkdir "server\uploads"
    echo Created uploads directory.
)

echo [2/3] Restarting Backend with Fixes...
taskkill /F /IM node.exe >nul 2>&1

start "Backend Server" cmd /k "cd server && npm start"
start "Frontend Client" cmd /k "cd client && npm run dev"

echo Done! The "Failed to Submit" error happens when the
echo backend isn't running or the uploads folder is missing.
echo Both should be fixed now.
pause
