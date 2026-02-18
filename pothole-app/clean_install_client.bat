@echo off
echo ==========================================
echo       CLEAN INSTALL (Tailwind v3 Fix)
echo ==========================================

cd /d "%~dp0\client"

echo [1/4] Removing problematic node_modules...
rd /s /q node_modules
del package-lock.json

echo [2/4] Installing correct Tailwind v3...
call npm install -D tailwindcss@3.4.17 postcss@8.4.35 autoprefixer@10.4.17 --legacy-peer-deps

echo [3/4] Installing Rest (React, Vite, etc.)...
call npm install --legacy-peer-deps

echo [4/4] Starting Dev Server...
call npm run dev
pause
