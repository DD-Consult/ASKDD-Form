# ASKDD Chatbot Deployment Steps

Follow these steps to deploy your form to Netlify with full functionality.

---

## Step 1: Push to GitHub (2 minutes)

```bash
# Navigate to your project directory
cd /app

# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit: ASKDD Chatbot Form"

# Create new repo on GitHub at: https://github.com/new
# Name it: askdd-chatbot

# Push to GitHub
git remote add origin https://github.com/YOUR-USERNAME/askdd-chatbot.git
git branch -M main
git push -u origin main
```

---

## Step 2: Setup MongoDB Atlas (3 minutes)

1. Go to https://mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Create a **free cluster** (M0)
4. **Database Access** → Add Database User:
   - Username: `askdd`
   - Password: (generate and save it!)
5. **Network Access** → Add IP Address:
   - Click "Allow access from anywhere" → `0.0.0.0/0`
6. **Connect** → Drivers → Copy connection string
   - It looks like: `mongodb+srv://askdd:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/`
   - **Save this!** You'll need it in Step 3

---

## Step 3: Deploy Backend to Railway (5 minutes)

1. Go to https://railway.app
2. **Sign up with GitHub**
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `askdd-chatbot` repository
6. Wait for initial deploy (will fail - that's ok!)

### Configure Railway:

Click on your project → **Settings**:
- **Root Directory**: Set to `backend`
- Click "Save"

Click **Variables** → Add these:

```
MONGO_URL=mongodb+srv://askdd:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/
DB_NAME=client_forms_db
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=amrit@ddconsult.tech
SMTP_PASSWORD=cypr jiti jwwm rozd
RECIPIENT_EMAIL=amrit@ddconsult.tech
CORS_ORIGINS=*
```

*(Replace YOUR_PASSWORD with your MongoDB password from Step 2)*

7. Click **"Redeploy"** or wait for auto-deploy
8. Once deployed, go to **Settings** → **Networking** → **Generate Domain**
9. **COPY YOUR RAILWAY URL** (e.g., `https://askdd-chatbot-production.up.railway.app`)

---

## Step 4: Deploy Frontend to Netlify (3 minutes)

1. Go to https://netlify.com
2. **Sign in with GitHub**
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **GitHub**
5. Select your `askdd-chatbot` repository
6. Netlify will auto-detect settings ✅

### IMPORTANT - Add Environment Variable:

Before clicking Deploy:
- Click **"Show advanced"** or **"Add environment variables"**
- Add:
  - **Key:** `REACT_APP_BACKEND_URL`
  - **Value:** Your Railway URL from Step 3 (e.g., `https://askdd-chatbot-production.up.railway.app`)

7. Click **"Deploy askdd-chatbot"**
8. Wait 2-3 minutes for build
9. Your site will be live at `https://YOUR-SITE-NAME.netlify.app`

---

## Step 5: Update CORS (1 minute)

Go back to **Railway** → Your project → **Variables**:
- Edit `CORS_ORIGINS`
- Change from `*` to your Netlify URL:
  ```
  CORS_ORIGINS=https://YOUR-SITE-NAME.netlify.app
  ```
- Save (will auto-redeploy)

---

## Step 6: Test Your Form ✅

1. Visit your Netlify URL
2. Fill out the form
3. Upload a test file
4. Submit
5. Check email at **amrit@ddconsult.tech**
6. Check admin dashboard at `/admin`

---

## Troubleshooting

### "Cannot connect to backend"
- Check `REACT_APP_BACKEND_URL` in Netlify matches Railway URL exactly
- Verify Railway backend is running (green status)
- Check Railway logs for errors

### "Email not sending"
- Verify Railway has all environment variables
- Check SMTP credentials are correct
- View Railway logs for email errors

### "Database connection error"
- Verify MongoDB connection string is correct
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Ensure database user password is correct

---

## Quick Links

- **Your Netlify Dashboard:** https://app.netlify.com/
- **Your Railway Dashboard:** https://railway.app/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com/

---

## Cost

- ✅ Netlify: **FREE** (100GB bandwidth/month)
- ✅ Railway: **FREE** ($5 credit/month - enough for this app)
- ✅ MongoDB Atlas: **FREE** (512MB storage)

**Total: $0/month**

---

## Need Help?

Contact: **askdd@ddconsult.tech**

---

## What You're Deploying

```
GitHub (your code)
    ↓
    ├──→ Netlify (Frontend) ──→ Users see the form
    │
    └──→ Railway (Backend) ──→ Handles submissions & emails
              ↓
         MongoDB Atlas (Database) ──→ Stores submissions
```

Once deployed, every time you `git push` to GitHub, both Netlify and Railway will auto-deploy your updates! 🚀
