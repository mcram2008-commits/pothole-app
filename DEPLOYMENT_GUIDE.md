# 🚀 Deployment Guide - Pothole Management System

## Quick Summary
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Express)  
- **Database**: Local JSON (persistent on Render)

---

## ✅ Prerequisites

1. **GitHub Account** - https://github.com (free)
2. **Render Account** - https://render.com (free tier available)
3. **Vercel Account** - https://vercel.com (free tier available)
4. **Git installed** on your machine

---

## Step 1️⃣: Push Code to GitHub

### A. Create a GitHub Repository
1. Go to https://github.com/new
2. Create a repository named `pothole-app`
3. Choose **Public** (for easier deployment)
4. **Do NOT** initialize with README (we have our own)
5. Click **Create repository**

### B. Push Your Code
Open PowerShell/Terminal in the `vibathon` folder:

```powershell
# Configure git (if first time)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add your files
git add .
git commit -m "Initial commit: Pothole Management System"

# Add remote and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pothole-app.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your actual GitHub username

**Verify**: Visit https://github.com/YOUR_USERNAME/pothole-app to see your code

---

## Step 2️⃣: Deploy Backend to Render

### A. Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (easier)

### B. Create Web Service
1. Click **Dashboard** (top right)
2. Click **New** → **Web Service**
3. Select your GitHub repository
4. Authorize if prompted

### C. Configure Service
Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | `pothole-app-api` |
| **Region** | `Oregon` (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | `pothole-app/server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### D. Add Environment Variables
Scroll down to **Environment** section:

Click **Add Environment Variable**:
- `JWT_SECRET` = `hackathon_secret_key_123`
- `NODE_ENV` = `production`

### E. Deploy
1. Click **Create Web Service**
2. Watch the logs (should take 2-3 minutes)
3. When complete, note your URL like: `https://pothole-app-api.onrender.com`

⚠️ **Keep this URL safe - you'll need it for Vercel!**

---

## Step 3️⃣: Deploy Frontend to Vercel

### A. Update Frontend Configuration
Back in your code, update **`pothole-app/client/.env.production`**:

```env
VITE_API_URL=https://YOUR-RENDER-URL/api
```

Replace `YOUR-RENDER-URL` with your actual Render URL (e.g., `pothole-app-api`)

Example:
```env
VITE_API_URL=https://pothole-app-api.onrender.com/api
```

### B. Push Changes to GitHub
```powershell
git add pothole-app/client/.env.production
git commit -m "Update API URL for production"
git push
```

### C. Deploy on Vercel
1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Find and select `pothole-app`
5. Click **Import**

### D. Configure Project
In the "Configure Project" screen:

**Project Settings:**
- **Framework Preset**: `Vite`
- **Root Directory**: Click **Edit** and select `pothole-app/client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**Environment Variables:**
Click **Add** and create:
- `VITE_API_URL` = `https://pothole-app-api.onrender.com/api`

### E. Deploy
1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. When done, you'll get a URL like: `https://pothole-app-somedomain.vercel.app`

---

## ✅ Test Your Deployment!

### Access Your App
1. Visit your **Vercel URL** (the frontend)
2. You should see the RoadFix login page

### Login Credentials
```
Admin Account (Full Access):
Email:    admin@pothole.com
Password: admin123

Officer Account (Can resolve issues):
Email:    officer@pothole.com
Password: officer123

Citizen Account (Can report issues):
Email:    citizen@pothole.com
Password: citizen123
```

### Test Features
1. **Log in** as Citizen
2. Go to **Report Issue**
3. Submit a test report with location
4. Log in as **Officer** and mark it as resolved
5. View stats in **Admin Dashboard**

---

## 🔄 Updating After Deployment

To push updates:

```powershell
# Make your changes locally
# Then:
git add .
git commit -m "Your update message"
git push origin main
```

**Automatic redeploys**:
- ✅ Render & Vercel automatically redeploy when you push to `main`
- Takes 2-3 minutes
- Check deployment logs in their dashboards

---

## 🐛 Troubleshooting

### Issue: "CORS Error" or API not responding
**Solution**: Verify `VITE_API_URL` in Vercel environment variables matches your Render URL exactly

### Issue: Images not loading
**Solution**: Same as above - make sure the backend URL is correct

### Issue: "Backend unavailable" on first load
**Solution**: Render free tier spins down after 15 minutes of inactivity. First request takes 30 seconds. Be patient!

### Issue: Database empty after deployment
**Solution**: Normal - new database created. Login with test credentials to see auto-seeded accounts

### Issue: "Cannot find port"
**Solution**: Delete recent deployments and try again on Render dashboard

---

## 📊 Production Considerations

### Database Persistence
- ✅ Your `database.json` persists on Render
- ⚠️ If you restart Render service, database remains safe
- 💡 For 1000+ users, migrate to MongoDB (see MongoDB Atlas free tier)

### File Uploads
- ✅ Photo uploads work and persist temporarily
- ⚠️ Render destroys uploaded files on restart (ephemeral)
- 💡 For production: use AWS S3 or Cloudinary

### Performance
- ✅ Frontend CDN-cached by Vercel
- ✅ Backend on Render (may be slow on free tier)
- 💡 Upgrade tier for production apps with many requests

---

## 🚀 Next Steps (Optional)

### Add Custom Domain
- [Vercel Custom Domain](https://vercel.com/docs/concepts/projects/domains)
- [Render Custom Domain](https://render.com/docs/custom-domains)

### Enable Analytics
- Vercel has built-in analytics (free)
- View in **Analytics** tab on Vercel dashboard

### Setup CI/CD
- Both platforms auto-deploy on push
- Set up branch protection on GitHub for safety

---

## 📞 Support

Having issues?
1. Check deployment logs in Render/Vercel dashboards
2. Review this guide again
3. Check GitHub Issues in your repository

---

**🎉 Your app is now live on the internet!**
Share your Vercel URL with friends to test it out.
