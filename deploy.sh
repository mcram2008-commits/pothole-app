#!/bin/bash

# ========================================
# Pothole App - Production Deployment Script
# ========================================
# This script prepares your app for deployment to Render + Vercel

echo "🚀 Pothole App Deployment Setup"
echo "================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

echo "✅ Git repository detected"

# Ensure all necessary files exist
echo "📝 Checking deployment configuration files..."

FILES=(
    "pothole-app/server/Procfile"
    "pothole-app/server/.env.production"
    "pothole-app/client/.env.production"
    "pothole-app/client/vercel.json"
    "DEPLOYMENT.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
    fi
done

echo ""
echo "📋 Next Steps:"
echo "1. Create a GitHub repository"
echo "2. Push your code: git push -u origin main"
echo "3. Deploy Backend (Render):"
echo "   - Visit https://render.com"
echo "   - Connect your GitHub repo"
echo "   - Select pothole-app/server directory"
echo ""
echo "4. Deploy Frontend (Vercel):"
echo "   - Visit https://vercel.com"  
echo "   - Import your GitHub repo"
echo "   - Select pothole-app/client directory"
echo ""
echo "5. Update Vercel Environment Variables with your Render API URL"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"
