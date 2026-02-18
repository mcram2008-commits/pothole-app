#!/usr/bin/env powershell
# ==============================================================
# Pothole App - One-Click Deployment Commands
# ==============================================================
# Copy & paste these commands to deploy to the cloud

# ============ STEP 1: PUSH TO GITHUB ============
Write-Host "Step 1: Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "Run these commands in PowerShell:" -ForegroundColor Green

$script = @"
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git add .
git commit -m "Production ready deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pothole-app.git
git push -u origin main
"@

Write-Host $script -ForegroundColor Yellow

Write-Host ""
Write-Host "⚠️  Replace YOUR_USERNAME with your actual GitHub username!" -ForegroundColor Red
Write-Host ""

# ============ STEP 2: RENDER BACKEND ============
Write-Host "Step 2: Deploy Backend on Render" -ForegroundColor Cyan
Write-Host "1. Go to https://render.com/dashboard" -ForegroundColor Green
Write-Host "2. Click 'New' → 'Web Service'" -ForegroundColor Green
Write-Host "3. Connect your GitHub repo" -ForegroundColor Green
Write-Host "4. Set Root Directory to: pothole-app/server" -ForegroundColor Green
Write-Host "5. Fill in:" -ForegroundColor Green
Write-Host "   - Name: pothole-app-api" -ForegroundColor Yellow
Write-Host "   - Build Command: npm install" -ForegroundColor Yellow
Write-Host "   - Start Command: npm start" -ForegroundColor Yellow
Write-Host "6. Add Environment Variables:" -ForegroundColor Green
Write-Host "   - JWT_SECRET = hackathon_secret_key_123" -ForegroundColor Yellow
Write-Host "   - NODE_ENV = production" -ForegroundColor Yellow
Write-Host "7. Click 'Create Web Service'" -ForegroundColor Green
Write-Host "8. SAVE YOUR RENDER URL!" -ForegroundColor Red

Write-Host ""

# ============ STEP 3: UPDATE FRONTEND URL ============
Write-Host "Step 3: Update Frontend Configuration" -ForegroundColor Cyan
Write-Host "Edit: pothole-app/client/.env.production" -ForegroundColor Green
Write-Host "Replace with your actual Render URL:" -ForegroundColor Yellow
Write-Host "VITE_API_URL=https://YOUR-RENDER-API.onrender.com/api" -ForegroundColor Yellow

Write-Host ""

# ============ STEP 4: PUSH UPDATED CONFIG ============
Write-Host "Step 4: Push Frontend Config Update" -ForegroundColor Cyan
$script2 = @"
git add pothole-app/client/.env.production  
git commit -m "Update production API URL"
git push
"@
Write-Host $script2 -ForegroundColor Yellow

Write-Host ""

# ============ STEP 5: VERCEL FRONTEND ============
Write-Host "Step 5: Deploy Frontend on Vercel" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor Green
Write-Host "2. Click 'Add New' → 'Project'" -ForegroundColor Green
Write-Host "3. Click 'Import Git Repository'" -ForegroundColor Green
Write-Host "4. Select pothole-app" -ForegroundColor Green
Write-Host "5. Configure:" -ForegroundColor Green
Write-Host "   - Root Directory: pothole-app/client" -ForegroundColor Yellow
Write-Host "   - Build Command: npm run build" -ForegroundColor Yellow
Write-Host "   - Output Directory: dist" -ForegroundColor Yellow
Write-Host "6. Add Environment Variable:" -ForegroundColor Green
Write-Host "   - VITE_API_URL = (your Render URL)" -ForegroundColor Yellow
Write-Host "7. Click 'Deploy'" -ForegroundColor Green

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ YOUR APP IS LIVE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login with:" -ForegroundColor Yellow
Write-Host "Email: admin@pothole.com" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
