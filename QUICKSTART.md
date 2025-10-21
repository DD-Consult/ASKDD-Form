# Quick Start: Deploy to Netlify from GitHub

## Step 1: Prepare Your Repository

1. **Initialize Git (if not already done)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ASKDD Chatbot"
   ```

2. **Create GitHub Repository**
   - Go to [github.com](https://github.com)
   - Click "+" → "New repository"
   - Name it: `askdd-chatbot` (or your preferred name)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/askdd-chatbot.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy Frontend to Netlify

### Automatic Deployment (Recommended)

1. **Sign in to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your repositories
   - Select `askdd-chatbot` repository

3. **Configure Build Settings**
   Netlify will auto-detect settings from `netlify.toml`:
   - Base directory: `frontend/`
   - Build command: `yarn build`
   - Publish directory: `frontend/build`
   - Node version: 20 (from netlify.toml)

4. **Add Environment Variable**
   - Before deploying, click "Add environment variables"
   - Add: `REACT_APP_BACKEND_URL` = `https://your-backend-url.com` (you'll update this after backend deployment)
   - For now, you can use a placeholder: `https://placeholder.com`

5. **Deploy**
   - Click "Deploy askdd-chatbot"
   - Wait for build to complete (2-3 minutes)
   - Your site will be live at `https://random-name-123.netlify.app`

6. **Custom Domain (Optional)**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Follow DNS configuration instructions

## Step 3: Deploy Backend

Choose one of these options:

### Option A: Railway (Easiest)

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `askdd-chatbot` repository
5. Click "Add variables" and add:
   ```
   MONGO_URL=<your-mongodb-atlas-url>
   DB_NAME=client_forms_db
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=askdd@ddconsult.tech
   SMTP_PASSWORD=<your-gmail-app-password>
   RECIPIENT_EMAIL=askdd@ddconsult.tech
   CORS_ORIGINS=https://your-netlify-site.netlify.app
   ```
6. Set "Root Directory" to `/backend`
7. Deploy
8. Copy your Railway app URL (e.g., `https://askdd-backend.up.railway.app`)

### Option B: Render

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Configure:
   - Name: `askdd-chatbot-backend`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
6. Add environment variables (same as Railway)
7. Deploy
8. Copy your Render URL

## Step 4: Update Frontend Environment Variable

1. Go back to Netlify
2. Site settings → Environment variables
3. Update `REACT_APP_BACKEND_URL` with your actual backend URL
4. Trigger redeploy: Deploys → Trigger deploy → Deploy site

## Step 5: Setup MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
5. Get connection string
6. Update backend environment variable `MONGO_URL` with connection string

## Step 6: Test Your Deployment

1. Visit your Netlify URL
2. Fill out and submit the form
3. Check email at `askdd@ddconsult.tech`
4. Check admin dashboard at `https://your-site.netlify.app/admin`

## Auto-Deploy on Git Push

Both Netlify and your backend will auto-deploy when you push to main:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

## Troubleshooting

**Build fails on Netlify:**
- Check build logs in Netlify dashboard
- Ensure Node version is 20
- Verify all dependencies in package.json

**Cannot connect to backend:**
- Verify `REACT_APP_BACKEND_URL` is correct
- Check backend is running
- Verify CORS is configured with Netlify URL

**Form submission fails:**
- Check MongoDB connection
- Verify SMTP credentials
- Check backend logs

## Need Help?

**Contact:** askdd@ddconsult.tech

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions and troubleshooting.
