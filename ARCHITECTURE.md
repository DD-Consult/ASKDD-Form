# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User's Browser                            │
│                   (Your Netlify Site)                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTPS Requests
                            │ (Form Submissions)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                        │
│                   github.com/you/askdd-chatbot                   │
│                                                                   │
│  ┌────────────────────┐              ┌────────────────────┐    │
│  │     frontend/       │              │     backend/       │    │
│  │   (React App)      │              │   (FastAPI)        │    │
│  │   - Forms          │              │   - API Routes     │    │
│  │   - Admin          │              │   - Email          │    │
│  │   - Validation     │              │   - File Upload    │    │
│  └────────────────────┘              └────────────────────┘    │
└───────────┬───────────────────────────────────┬─────────────────┘
            │                                   │
            │ Auto-deploy on push               │ Auto-deploy on push
            │                                   │
            ▼                                   ▼
┌──────────────────────┐           ┌──────────────────────────┐
│      Netlify         │  API      │       Railway            │
│    (Frontend Host)   │◄─────────►│    (Backend Host)        │
│                      │  Calls    │                          │
│  - Serves React App  │           │  - Runs FastAPI          │
│  - CDN Distribution  │           │  - Handles Form Data     │
│  - HTTPS/SSL         │           │  - Sends Emails          │
│  - Custom Domain     │           │  - File Processing       │
└──────────────────────┘           └────────┬─────────────────┘
                                            │
                                            │ Database
                                            │ Connection
                                            ▼
                                   ┌────────────────────┐
                                   │   MongoDB Atlas    │
                                   │   (Database)       │
                                   │                    │
                                   │  - Store Forms     │
                                   │  - Store Files     │
                                   │  - Submissions     │
                                   └────────────────────┘
                                            │
                                            │ Email via
                                            │ SMTP
                                            ▼
                                   ┌────────────────────┐
                                   │   Gmail SMTP       │
                                   │  (Email Service)   │
                                   │                    │
                                   │  Sends to:         │
                                   │  askdd@            │
                                   │  ddconsult.tech    │
                                   └────────────────────┘
```

---

## Data Flow

### Form Submission Flow:

```
1. User fills form on Netlify site
   │
   ├─ Frontend validates input
   │
2. User clicks "Submit Questionnaire"
   │
   ├─ React sends POST to Railway backend
   │  URL: https://your-app.railway.app/api/submissions
   │
3. Railway backend receives request
   │
   ├─ Validates data with Pydantic
   ├─ Saves to MongoDB Atlas
   ├─ Prepares email with attachments
   │
4. Sends email via Gmail SMTP
   │
   ├─ To: askdd@ddconsult.tech
   ├─ Includes: All form data + file attachments
   │
5. Returns success to frontend
   │
   └─ Frontend shows success toast
   └─ Form reloads
```

### Admin Dashboard Flow:

```
1. User visits /admin on Netlify
   │
   ├─ React fetches data from Railway
   │  URL: https://your-app.railway.app/api/submissions
   │
2. Railway queries MongoDB Atlas
   │
   ├─ Returns all submissions
   │
3. Frontend displays submissions
   │
   └─ User can expand to view details
```

---

## Environment Variables

### Netlify (Frontend)
```
REACT_APP_BACKEND_URL = https://your-app.railway.app
```

### Railway (Backend)
```
MONGO_URL = mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME = client_forms_db
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_EMAIL = askdd@ddconsult.tech
SMTP_PASSWORD = [app password]
RECIPIENT_EMAIL = askdd@ddconsult.tech
CORS_ORIGINS = https://your-site.netlify.app
```

---

## Security Features

✅ **HTTPS/SSL** - Automatic on both Netlify and Railway
✅ **CORS Protection** - Configured to only allow your Netlify domain
✅ **Input Validation** - Pydantic models validate all data
✅ **MongoDB Atlas** - Network access controls
✅ **Environment Variables** - Secrets stored securely
✅ **File Size Limits** - Logo max 5MB, docs max 10MB

---

## Deployment Pipeline

```
Local Changes
     ↓
git commit & push
     ↓
GitHub Repository
     ↓
     ├──────────────────┬──────────────────┐
     ↓                  ↓                  ↓
Netlify Deploy    Railway Deploy    (No action)
     ↓                  ↓                  ↓
Build React       Run FastAPI       MongoDB Atlas
     ↓                  ↓              (already running)
     ↓                  ↓                  ↓
Deploy to CDN     Deploy to Cloud        Ready
     ↓                  ↓                  ↓
     └──────────────────┴──────────────────┘
                  ↓
            Live Production
            ✅ Frontend updated
            ✅ Backend updated
            ✅ Zero downtime
```

---

## Scaling

### Current Setup (Free Tier):
- **Netlify:** 100 GB bandwidth/month
- **Railway:** $5 credit/month (~20 days uptime)
- **MongoDB:** 512 MB storage, shared RAM

### When to Upgrade:

**Netlify (Frontend):**
- Need more than 100GB bandwidth
- Need more build minutes
- Upgrade: ~$19/month for Pro

**Railway (Backend):**
- App sleeps after inactivity (free tier)
- Need 24/7 uptime
- Upgrade: $5/month minimum usage

**MongoDB Atlas:**
- Need more than 512MB storage
- Need dedicated resources
- Upgrade: ~$9/month for M10

---

## Backup Strategy

### Automatic Backups:
1. **Code:** Git version control on GitHub
2. **Database:** MongoDB Atlas automatic backups (paid tier)
3. **Deployments:** Netlify keeps deploy history
4. **Backend:** Railway keeps deploy history

### Manual Backups:
```bash
# Export MongoDB data
mongodump --uri="mongodb+srv://..." --out=backup/

# Backup to GitHub
git push origin main
```

---

## Monitoring

### Netlify:
- Build logs
- Deploy history
- Bandwidth usage
- Form submissions (Analytics Pro)

### Railway:
- Application logs
- Resource usage
- Deploy history
- Uptime monitoring

### MongoDB Atlas:
- Connection metrics
- Database size
- Query performance
- Alerts

---

## Cost Optimization Tips

1. **Use Free Tiers:** Current setup uses only free tiers
2. **CDN Caching:** Netlify automatically caches static assets
3. **MongoDB Indexing:** Index frequently queried fields
4. **Image Optimization:** Compress logos before upload
5. **Railway Sleep:** Free tier sleeps after inactivity (acceptable for low-traffic)

---

## Support

For architecture questions or deployment help:
**Email:** askdd@ddconsult.tech
