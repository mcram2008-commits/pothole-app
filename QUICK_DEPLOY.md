# 🎯 Quick Deployment Checklist

## Before You Start
- [ ] GitHub account created
- [ ] Render account created  
- [ ] Vercel account created
- [ ] Git configured on your machine

## Step 1: GitHub Push (5 minutes)
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git add .
git commit -m "Pothole app ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pothole-app.git
git push -u origin main
```

## Step 2: Deploy Backend on Render (5-10 minutes)
1. Go to https://render.com/dashboard
2. Click **New** → **Web Service**
3. Select your GitHub repo
4. Select **Root Directory**: `pothole-app/server`
5. Fill form:
   - Name: `pothole-app-api`
   - Build: `npm install`
   - Start: `npm start`
6. Add Environment Variables:
   - `JWT_SECRET`: `hackathon_secret_key_123`
   - `NODE_ENV`: `production`
7. Click **Deploy**
8. **Copy your URL** (e.g., `https://pothole-app-api.onrender.com`)

## Step 3: Update Frontend Config (2 minutes)
Update **`pothole-app/client/.env.production`**:
```env
VITE_API_URL=https://YOUR-RENDER-API-URL/api
```

Then push:
```bash
git add pothole-app/client/.env.production
git commit -m "Update API URL"
git push
```

## Step 4: Deploy Frontend on Vercel (5-10 minutes)
1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. **Import** your GitHub repo
4. Click **Edit** next to Root Directory
5. Select: `pothole-app/client`
6. Add Environment Variable:
   - `VITE_API_URL`: Your Render URL
7. Click **Deploy**

## ✅ Testing
- Visit your Vercel URL
- Login with:
  - Email: `admin@pothole.com`
  - Password: `admin123`
- Test reporting & viewing issues

## 🎉 Done!
Your app is now live! Share the Vercel URL.

---

## 📌 Keep These URLs Safe
- **Render Backend**: `https://pothole-app-api.onrender.com`
- **Vercel Frontend**: `https://your-app.vercel.app`

## 🔄 Updating In The Future
```bash
git add .
git commit -m "Your changes"
git push origin main
# Both services auto-redeploy!
```

---

**Questions?** See `DEPLOYMENT_GUIDE.md` for full documentation.
