@echo off
echo Starting Pothole Reporting App...

REM Attempt to start MongoDB (if installed and not running as service)
start "MongoDB" cmd /k "mongod --dbpath data/db || echo Mongo may already be running or not found. Check service."

start "Server" cmd /k "cd server && npm start"
timeout /t 5 /nobreak
start "Client" cmd /k "cd client && npm run dev"

echo App is running!
echo Server: http://localhost:5000
echo Client: http://localhost:5173
echo.
echo Make sure MongoDB is running for data persistence.
pause
