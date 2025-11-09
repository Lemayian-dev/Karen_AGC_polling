# 🚀 Deploy to Vercel - Easy Guide

## 📋 Prerequisites

1. ✅ GitHub account (you already have the code pushed!)
2. ✅ Vercel account (free) - [Sign up here](https://vercel.com/signup)

## 🎯 Deployment Steps (5 Minutes!)

### Option 1: One-Click Deploy (Easiest!)

Click this button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Lemayian-dev/Karen_AGC_polling)

Then skip to Step 4 below.

---

### Option 2: Manual Deployment (Recommended for Full Control)

#### Step 1: Push Code to GitHub ✅ DONE!

Your code is already at:
`https://github.com/Lemayian-dev/Karen_AGC_polling.git`

#### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (or "Log In" if you have an account)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your repositories

#### Step 3: Import Your Repository

1. Click **"Add New Project"**
2. Find `Karen_AGC_polling` in the list
3. Click **"Import"**

#### Step 4: Configure Project

**Framework Preset:** Vite

**Root Directory:** `./` (leave as default)

**Build Settings:**
- Build Command: `npm run vercel-build`
- Output Directory: `client/dist`
- Install Command: `npm install`

**Environment Variables:** (Click "Add" for each)

```
VITE_API_URL = https://your-project-name.vercel.app
VITE_SOCKET_URL = https://your-project-name.vercel.app
```

Replace `your-project-name` with your actual Vercel project name (shown at the top).

#### Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Click **"Visit"** when done! 🎉

---

## ⚙️ Post-Deployment Configuration

### Update Environment Variables (Important!)

After first deployment, update with your actual URL:

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Update:
   ```
   VITE_API_URL = https://karen-agc-polling.vercel.app
   VITE_SOCKET_URL = https://karen-agc-polling.vercel.app
   ```
   (Use your actual Vercel URL)
4. Click **"Save"**
5. Go to **"Deployments"** tab
6. Click **"⋯"** on latest deployment → **"Redeploy"**

---

## 🌐 Your Live URLs

After deployment, you'll have:

**Main App:**
```
https://karen-agc-polling.vercel.app
```

**Admin Login:**
```
https://karen-agc-polling.vercel.app/admin/login
```

**API Endpoints:**
```
https://karen-agc-polling.vercel.app/api/polls
https://karen-agc-polling.vercel.app/api/polls/code/:code
```

---

## ⚠️ Important Notes About Vercel + WebSockets

### Known Limitation:
Vercel's serverless functions have a **10-second timeout** and don't support persistent WebSocket connections like a traditional server.

### What This Means:
- ✅ **Basic features work:** Creating polls, voting, viewing results
- ✅ **HTTP API works:** All REST endpoints functional
- ⚠️ **Real-time updates limited:** WebSocket connections may timeout
- ⚠️ **Waiting room:** May need polling fallback instead of real-time

### Solutions:

#### Option A: Use Polling Fallback (Quick Fix)
The app will automatically fall back to HTTP polling if WebSockets fail.

#### Option B: Use Alternative Hosting (Recommended for Production)

For full real-time functionality, consider these alternatives:

**1. Railway.app** (Recommended)
- ✅ Full WebSocket support
- ✅ Free tier available
- ✅ Easy deployment
- [Deploy to Railway](https://railway.app)

**2. Render.com**
- ✅ Full WebSocket support
- ✅ Free tier
- ✅ Auto-deploy from GitHub
- [Deploy to Render](https://render.com)

**3. Heroku**
- ✅ Full WebSocket support
- ✅ $5/month (no free tier anymore)
- [Deploy to Heroku](https://heroku.com)

---

## 🔧 Alternative: Deploy to Railway (Better for Real-Time)

### Quick Railway Deployment:

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Choose **"Deploy from GitHub repo"**
4. Select `Karen_AGC_polling`
5. Railway auto-detects Node.js
6. Click **"Deploy"**
7. Set environment variables:
   ```
   PORT = 3001
   ```
8. Get your Railway URL (e.g., `https://karen-agc-polling-production.up.railway.app`)
9. Update `client/.env` with Railway URL
10. Redeploy!

**Result:** Full real-time functionality with WebSockets! ✅

---

## 📱 Testing Your Deployment

### 1. Home Page
Visit: `https://your-app.vercel.app`
- Should see KAGC branding
- "Create Poll" and "Join Poll" buttons

### 2. Admin Login
Visit: `https://your-app.vercel.app/admin/login`
- Login: `admin` / `kagc2024`
- Should redirect to dashboard

### 3. Create Poll
- Create a test poll
- Set 2-minute duration
- Get poll code

### 4. Join Poll
- Open in incognito/another device
- Join with poll code
- Enter name
- See waiting room

### 5. Test Real-Time
- Admin starts poll
- Users should auto-transition to voting
- Vote and check results

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch"
**Solution:**
- Check environment variables are set correctly
- Ensure URLs match your Vercel deployment
- Redeploy after changing env vars

### Issue: "Waiting room not updating"
**Solution:**
- WebSocket timeout on Vercel
- Consider Railway/Render for production
- Or implement polling fallback

### Issue: "404 on API routes"
**Solution:**
- Check `vercel.json` is in root directory
- Verify routes configuration
- Check Vercel build logs

### Issue: "Build failed"
**Solution:**
- Check `package.json` has `vercel-build` script
- Verify all dependencies installed
- Check Vercel build logs for errors

---

## 🔄 Update Deployment (Push Changes)

After making code changes:

1. Commit changes:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```

2. Vercel auto-deploys! 🎉
   - Watch deployment at vercel.com
   - Live in 2-3 minutes

---

## 🎨 Custom Domain (Optional)

1. Go to Vercel project → **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter your domain (e.g., `polls.kagchurch.com`)
4. Follow DNS instructions
5. Wait for verification
6. Update environment variables with new domain

---

## 📊 Monitoring Your App

### Vercel Dashboard:
- **Analytics:** Visitor stats, page views
- **Logs:** Server logs, errors
- **Speed Insights:** Performance metrics

### Monitor:
- Active polls
- Total votes
- Real-time connections
- Error rates

---

## 💡 Pro Tips

### 1. Enable Preview Deployments
Every branch gets a preview URL automatically!

### 2. Set Up Alerts
Get notified of deployment failures:
- Vercel Dashboard → Settings → Notifications

### 3. Optimize Performance
- Enable edge caching
- Use Vercel Image Optimization
- Minimize bundle size

### 4. Secure Your App
- Add rate limiting (Vercel Edge Middleware)
- Use environment secrets
- Enable HTTPS (automatic on Vercel)

---

## 🆘 Need Help?

### Vercel Support:
- [Vercel Docs](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Discord](https://vercel.com/discord)

### Project Issues:
- GitHub Issues: `https://github.com/Lemayian-dev/Karen_AGC_polling/issues`

---

## ✅ Deployment Checklist

Before going live:

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables set
- [ ] First deployment successful
- [ ] Updated env vars with real URL
- [ ] Redeployed with correct URLs
- [ ] Tested admin login
- [ ] Tested poll creation
- [ ] Tested voting flow
- [ ] Tested on mobile devices
- [ ] Set up custom domain (optional)
- [ ] Monitoring enabled

---

## 🎉 You're Live!

Your KAGC Polling Software is now accessible worldwide! 🌍

Share your app:
```
https://karen-agc-polling.vercel.app
```

**For church events:**
1. Display QR code on screens
2. Announce URL
3. Create polls on the fly
4. Engage your congregation! 🙏

---

## 🚀 Next Steps

1. **Test thoroughly** with small group first
2. **Run pilot event** with leadership team
3. **Gather feedback** and iterate
4. **Go live** with congregation!
5. **Monitor and improve** based on usage

**Happy Polling!** 🎊
