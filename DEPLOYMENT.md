# ASKDD Chatbot Deployment Guide

## Overview
This application consists of two parts:
1. **Frontend (React)** - Deployed on Netlify
2. **Backend (FastAPI)** - Needs separate hosting

---

## Frontend Deployment (Netlify)

### Prerequisites
- GitHub account
- Netlify account (free tier works)
- Repository pushed to GitHub

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and authorize
   - Select your repository
   - Netlify will auto-detect settings from `netlify.toml`
   - Click "Deploy site"

3. **Configure Environment Variables**
   - Go to Site settings → Environment variables
   - Add the following:
     - `REACT_APP_BACKEND_URL` = Your backend URL (see Backend Deployment section)

4. **Custom Domain (Optional)**
   - Go to Domain settings
   - Add your custom domain
   - Follow DNS configuration instructions

---

## Backend Deployment Options

Your FastAPI backend needs to be hosted separately. Here are recommended options:

### Option A: Railway.app (Recommended - Easy)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will detect the Python backend

3. **Configure**
   - Add environment variables:
     ```
     MONGO_URL=<your-mongodb-connection-string>
     DB_NAME=client_forms_db
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_EMAIL=askdd@ddconsult.tech
     SMTP_PASSWORD=<your-app-password>
     RECIPIENT_EMAIL=askdd@ddconsult.tech
     CORS_ORIGINS=https://your-netlify-site.netlify.app
     ```
   - Set root directory to `/backend`
   - Railway will auto-deploy

4. **Get Backend URL**
   - Copy the generated Railway URL
   - Add this to Netlify environment variables as `REACT_APP_BACKEND_URL`

### Option B: Render.com (Free Tier Available)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `askdd-chatbot-backend`
     - Root Directory: `backend`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables**
   - Same as Railway option above

4. **Deploy**
   - Click "Create Web Service"
   - Copy the generated URL
   - Add to Netlify as `REACT_APP_BACKEND_URL`

### Option C: Heroku

1. **Create Heroku Account**
   - Go to [heroku.com](https://heroku.com)

2. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from heroku.com
   ```

3. **Deploy**
   ```bash
   cd backend
   heroku login
   heroku create askdd-chatbot-backend
   git subtree push --prefix backend heroku main
   ```

4. **Configure**
   ```bash
   heroku config:set MONGO_URL=<your-mongo-url>
   heroku config:set DB_NAME=client_forms_db
   heroku config:set SMTP_HOST=smtp.gmail.com
   heroku config:set SMTP_PORT=587
   heroku config:set SMTP_EMAIL=askdd@ddconsult.tech
   heroku config:set SMTP_PASSWORD=<your-password>
   heroku config:set RECIPIENT_EMAIL=askdd@ddconsult.tech
   ```

---

## Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to your backend hosting

3. **Create Database User**
   - Database Access → Add New Database User
   - Save username and password

4. **Whitelist IP**
   - Network Access → Add IP Address
   - Allow access from anywhere (0.0.0.0/0) for cloud deployments

5. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Use this as your `MONGO_URL` environment variable

---

## Post-Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] MongoDB Atlas is configured and connected
- [ ] Frontend environment variable `REACT_APP_BACKEND_URL` is set
- [ ] Backend CORS is configured with frontend URL
- [ ] Email SMTP credentials are working
- [ ] Test form submission end-to-end
- [ ] Admin dashboard accessible at `/admin`

---

## Troubleshooting

### Frontend Issues

**"Cannot connect to backend"**
- Check `REACT_APP_BACKEND_URL` in Netlify environment variables
- Ensure backend URL includes `/api` prefix for routes
- Verify backend is running and accessible

**"Build failed"**
- Check Node version is 20 (configured in netlify.toml)
- Review build logs in Netlify dashboard
- Ensure all dependencies are in package.json

### Backend Issues

**"Cannot connect to MongoDB"**
- Verify `MONGO_URL` is correct
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

**"Email not sending"**
- Verify SMTP credentials
- Check Gmail app password is correct (not regular password)
- Review backend logs for email errors

**"CORS errors"**
- Ensure `CORS_ORIGINS` includes your Netlify URL
- Check backend logs for CORS configuration

---

## Continuous Deployment

Once set up, both Netlify and your backend hosting will auto-deploy on git push:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

- Netlify will rebuild frontend automatically
- Backend hosting (Railway/Render/Heroku) will rebuild automatically

---

## Support

For deployment issues or questions, contact: **askdd@ddconsult.tech**

Additional resources:
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Railway: [docs.railway.app](https://docs.railway.app)
- Render: [render.com/docs](https://render.com/docs)
- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)