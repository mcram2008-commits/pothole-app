# Pothole Management System Deployment Guide

## Prerequisites
- GitHub Account
- Render Account (https://render.com)
- Vercel Account (https://vercel.com)

## Deploy Backend to Render

1. **Initialize Git & Push to GitHub**
   ```bash
   cd pothole-app/server
   git init
   git add .
   git commit -m "Initial server commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pothole-app.git
   git push -u origin main
   ```

2. **Go to Render Dashboard**
   - Sign in at https://render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repository

3. **Configure Render**
   - **Name**: pothole-app-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `JWT_SECRET`: hackathon_secret_key_123
     - `NODE_ENV`: production

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (will take 2-3 minutes)
   - Copy your Render URL (e.g., https://pothole-app-api.onrender.com)

## Deploy Frontend to Vercel

1. **Update API URL in .env.production**
   - Update client/.env.production with your Render URL
   ```bash
   VITE_API_URL=https://pothole-app-api.onrender.com/api
   ```

2. **Push to GitHub**
   ```bash
   cd pothole-app/client
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

3. **Go to Vercel & Connect**
   - Sign in at https://vercel.com
   - Click "Add New" → "Project"
   - Import from Git
   - Select your repository

4. **Configure Vercel**
   - **Root Directory**: pothole-app/client
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: https://pothole-app-api.onrender.com/api

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)

## Test Your Deployment

Once both are deployed:

1. Visit your Vercel URL
2. Login with test credentials:
   - Admin: admin@pothole.com / admin123
   - Officer: officer@pothole.com / officer123
   - Citizen: citizen@pothole.com / citizen123

## Database Notes

- The app uses a local `database.json` file
- On Render, this will persist in the server's file system
- For production, consider migrating to MongoDB or PostgreSQL
- Each Render restart will preserve the database (stored persistently)

## Troubleshooting

**CORS Issues**: Backend already has CORS enabled in index.js
**Image Uploads Not Showing**: Ensure VITE_API_URL is correct in Vercel environment
**JWT Errors**: Verify JWT_SECRET matches on Render
