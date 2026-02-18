@echo off
echo ==========================================
echo        RESETTING ADMINISTRATOR ACCOUNT
echo ==========================================
cd server
node -e "const fs=require('fs'); const bcrypt=require('bcryptjs'); const path='database.json'; if(fs.existsSync(path)){ const db=JSON.parse(fs.readFileSync(path)); db.users = []; db.reports = []; fs.writeFileSync(path, JSON.stringify(db,null,2)); console.log('Database Cleared.'); } else { console.log('No DB found, will be created on start.'); }"
echo.
echo Database has been wiped to ensure a clean slate.
echo Restarting the app will recreate the Admin account:
echo.
echo    Email: admin@pothole.com
echo    Pass:  admin123
echo.
pause
