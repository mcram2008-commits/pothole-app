@echo off
echo ==========================================
echo       Pothole App - Unattended Fixer
echo ==========================================

cd /d "%~dp0"

echo [1/3] Setting up Server...
cd server
call npm install --legacy-peer-deps
cd ..

echo [2/3] Setting up Client...
cd client
call npm install --legacy-peer-deps
call npm install react-router-dom lucide-react axios leaflet react-leaflet --legacy-peer-deps
call npm install -D tailwindcss@3.4.17 postcss@8 autoprefixer@10 --legacy-peer-deps
cd ..

echo [3/3] Starting App...
start "Backend" cmd /k "cd server && npm start"
start "Frontend" cmd /k "cd client && npm run dev"

echo App started! backend:5000, frontend:5173
echo Please ensure MongoDB is running.
pause
