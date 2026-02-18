@echo off
echo ==========================================
echo        UPDATING DEPENDENCIES
echo ==========================================
cd client
call npm install lucide-react react-router-dom@6.22.3 --legacy-peer-deps
echo Done.
pause
