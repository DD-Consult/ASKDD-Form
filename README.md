# ASKDD Chatbot Onboarding Form

A professional client onboarding questionnaire system for collecting AI chatbot configuration requirements.

**🚀 Deploy in 15 minutes:** Frontend to Netlify + Backend to Railway from GitHub

## Features

- ✅ Comprehensive multi-section questionnaire
- ✅ File upload support (logos and documents)
- ✅ Email notifications with attachments to askdd@ddconsult.tech
- ✅ MongoDB database storage
- ✅ Admin dashboard for viewing submissions
- ✅ Responsive, clean design with ASKDD branding
- ✅ Form validation
- ✅ Auto-deploy from GitHub

## Tech Stack

### Frontend
- React 19
- Tailwind CSS
- Shadcn UI Components
- React Hook Form
- Axios

### Backend
- FastAPI
- MongoDB (Motor async driver)
- Python SMTP for email
- Pydantic for validation

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- Python 3.10+
- MongoDB

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Create .env file with:
MONGO_URL="mongodb://localhost:27017"
DB_NAME="client_forms_db"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_EMAIL="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
RECIPIENT_EMAIL="recipient@example.com"
CORS_ORIGINS="http://localhost:3000"

# Run server
uvicorn server:app --reload --port 8001
```

### Frontend Setup

```bash
cd frontend
yarn install

# Create .env file with:
REACT_APP_BACKEND_URL=http://localhost:8001

# Run development server
yarn start
```

## Deployment

**Quick Deploy (Recommended):** See [SIMPLE_DEPLOY.md](SIMPLE_DEPLOY.md) for step-by-step Netlify + Railway deployment (~15 minutes)

**Detailed Guide:** See [DEPLOYMENT.md](DEPLOYMENT.md) for all deployment options and troubleshooting

**Quick Reference:**
- Frontend: Deploy to Netlify from GitHub
- Backend: Deploy to Railway from same GitHub repo  
- Database: MongoDB Atlas (free tier)

## Project Structure

```
/
├── backend/
│   ├── server.py          # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── OnboardingForm.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ui/       # Shadcn UI components
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json      # Frontend dependencies
│   └── .env             # Frontend environment variables
├── netlify.toml         # Netlify configuration
├── .nvmrc              # Node version specification
└── DEPLOYMENT.md       # Deployment guide
```

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=client_forms_db
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=askdd@ddconsult.tech
SMTP_PASSWORD=your-app-password
RECIPIENT_EMAIL=askdd@ddconsult.tech
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## API Endpoints

### Public Endpoints
- `GET /api/` - Health check
- `POST /api/submissions` - Submit questionnaire
- `GET /api/submissions` - Get all submissions
- `GET /api/submissions/{id}` - Get specific submission

## Form Sections

1. **Contact Information** - Primary contact details
2. **Company Identity & Branding** - Logo, colors, chatbot name
3. **Chatbot Core Functionality** - Conversation starters
4. **Knowledge Base & System Behavior** - Documents, directives, support contact
5. **Technical Deployment** - Platform, management, technical contacts

## Admin Dashboard

Access at `/admin` to view all submissions with expandable details.

## License

Proprietary - ASKDD Chatbot

## Support

For issues or questions, contact: **askdd@ddconsult.tech**

Additional resources:
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Railway: [docs.railway.app](https://docs.railway.app)
- Render: [render.com/docs](https://render.com/docs)
- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)