# Deploy ASKDD Chatbot to Netlify + Railway

This guide shows you how to deploy your full-stack app in under 15 minutes.

- **Frontend** → Netlify (from GitHub)
- **Backend** → Railway (from same GitHub repo)
- **Database** → MongoDB Atlas (free tier)

---

## Prerequisites

- GitHub account
- Netlify account (free)
- Railway account (free) 
- MongoDB Atlas account (free)

---

## Step 1: Push to GitHub (5 minutes)

```bash
# Initialize git if not done
git init
git add .
git commit -m "Initial commit: ASKDD Chatbot"

# Create a new repository on GitHub
# Then push:
git remote add origin https://github.com/YOUR-USERNAME/askdd-chatbot.git
git branch -M main
git push -u origin main
```

---

## Step 2: Setup MongoDB Atlas (3 minutes)

1. Go to [mongodb.com/cloud/atlas/register](https://mongodb.com/cloud/atlas/register)
2. Create free account → Create free cluster (M0)
3. **Database Access** → Add Database User:
   - Username: `askdd`
   - Password: Generate secure password (save it!)
4. **Network Access** → Add IP Address:
   - Click "Allow access from anywhere" → `0.0.0.0/0`
5. **Connect** → Drivers → Copy connection string
   - Replace `<password>` with your database password
   - Save this connection string!

Example: `mongodb+srv://askdd:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

---

## Step 3: Deploy Backend to Railway (3 minutes)

1. Go to [railway.app](https://railway.app)
2. **Sign up with GitHub**
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `askdd-chatbot` repository
6. Railway will start deploying - **WAIT**, we need to configure first!

### Configure Railway:

1. Click on your deployment
2. **Settings** → Root Directory → Set to: `backend`
3. **Variables** → Add these environment variables:

```
MONGO_URL=mongodb+srv://askdd:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=client_forms_db
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=askdd@ddconsult.tech
SMTP_PASSWORD=cypr jiti jwwm rozd
RECIPIENT_EMAIL=askdd@ddconsult.tech
CORS_ORIGINS=*
```

4. Click **"Redeploy"** (or wait for auto-deploy)
5. Go to **Settings** → **Networking** → **Generate Domain**
6. **Copy your Railway URL** (e.g., `https://askdd-chatbot-production.up.railway.app`)

---

## Step 4: Deploy Frontend to Netlify (2 minutes)

1. Go to [netlify.com](https://netlify.com)
2. **Sign up/Login with GitHub**
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **GitHub** → Authorize → Select `askdd-chatbot`
5. Netlify auto-detects settings from `netlify.toml` ✅

### Add Environment Variable:

Before clicking Deploy, add:
- **Key:** `REACT_APP_BACKEND_URL`
- **Value:** Your Railway URL from Step 3 (e.g., `https://askdd-chatbot-production.up.railway.app`)

6. Click **"Deploy askdd-chatbot"**
7. Wait 2-3 minutes for build
8. Your site is live! 🎉

---

## Step 5: Update Backend CORS (1 minute)

1. Go back to **Railway**
2. **Variables** → Edit `CORS_ORIGINS`
3. Change from `*` to your Netlify URL:
   ```
   CORS_ORIGINS=https://your-site-name.netlify.app
   ```
4. Save (auto-redeploys)

---

## Step 6: Test Everything (1 minute)

1. Visit your Netlify site
2. Fill out the form and submit
3. Check email at `askdd@ddconsult.tech`
4. Check admin dashboard at `/admin`

✅ **Done!** Everything should be working.

---

## What You Just Deployed

```
┌─────────────────────────────────────┐
│  GitHub Repository (Source)         │
│  github.com/you/askdd-chatbot       │
└────────┬────────────────────┬───────┘
         │                    │
         │                    │
    ┌────▼────────┐    ┌──────▼─────┐
    │   Netlify   │    │  Railway   │
    │  (Frontend) │    │ (Backend)  │
    │             │    │            │
    │  React App  │◄───┤  FastAPI   │
    │             │    │            │
    └─────────────┘    └──────┬─────┘
                              │
                       ┌──────▼─────────┐
                       │ MongoDB Atlas  │
                       │   (Database)   │
                       └────────────────┘
```

---

## Auto-Deploy on Git Push

Once set up, both deploy automatically:

```bash
git add .
git commit -m "Update something"
git push origin main
```

- Netlify rebuilds frontend ✅
- Railway rebuilds backend ✅

---

## Custom Domain (Optional)

### For Netlify (Frontend):
1. Netlify → Domain Settings → Add custom domain
2. Follow DNS instructions

### For Railway (Backend):
1. Railway → Settings → Networking → Custom Domain
2. Add your backend subdomain (e.g., `api.yourdomain.com`)
3. Update `REACT_APP_BACKEND_URL` in Netlify

---

## Troubleshooting

### Frontend loads but form submission fails

**Check:**
1. Railway backend is running (check Railway dashboard)
2. `REACT_APP_BACKEND_URL` in Netlify matches Railway URL exactly
3. Railway `CORS_ORIGINS` includes your Netlify URL
4. Open browser console for error messages

### Emails not sending

**Check:**
1. Railway logs for email errors
2. SMTP credentials are correct
3. Check spam folder at askdd@ddconsult.tech

### MongoDB connection errors

**Check:**
1. MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Database user password is correct in connection string
3. Railway logs for connection errors

---

## Costs

- **Netlify:** Free (100GB bandwidth/month)
- **Railway:** Free tier ($5 credit/month) - enough for this app
- **MongoDB Atlas:** Free (M0 cluster, 512MB storage)

**Total Monthly Cost:** $0 (Free tier sufficient)

---

## Support

**Issues or questions?** Contact: **askdd@ddconsult.tech**

---

## Next Steps

- [ ] Test form submission
- [ ] Test file uploads
- [ ] Check email delivery
- [ ] Test admin dashboard
- [ ] Add custom domain (optional)
- [ ] Configure email alerts (optional)

**Congratulations!** 🎉 Your ASKDD Chatbot is live!
