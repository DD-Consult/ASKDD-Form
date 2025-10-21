# Email Configuration Guide

## Overview

Form submissions are automatically sent to **askdd@ddconsult.tech** via email with all form data and file attachments.

## How It Works

The email configuration is handled in the **backend**, not Netlify:

1. **Backend sends emails** using SMTP (Gmail)
2. **All form submissions** go to `askdd@ddconsult.tech`
3. **Email includes**:
   - All form field data
   - Uploaded logo (if provided)
   - Knowledge base documents (if provided)

## Configuration Location

### Backend Environment Variables

File: `backend/.env`

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_EMAIL="askdd@ddconsult.tech"
SMTP_PASSWORD="your-gmail-app-password"
RECIPIENT_EMAIL="askdd@ddconsult.tech"
```

**Important Notes:**
- `SMTP_EMAIL` = The Gmail account used to SEND emails
- `RECIPIENT_EMAIL` = Where form submissions are SENT TO (askdd@ddconsult.tech)
- `SMTP_PASSWORD` = Gmail App Password (NOT your regular Gmail password)

## Changing the Recipient Email

To send submissions to a different email address:

### For Local Development

1. Edit `backend/.env`
2. Update `RECIPIENT_EMAIL="newemail@example.com"`
3. Restart backend: `sudo supervisorctl restart backend`

### For Production (After Deployment)

**Railway:**
1. Go to your Railway project
2. Variables → Edit `RECIPIENT_EMAIL`
3. Save (auto-redeploys)

**Render:**
1. Go to your Render service
2. Environment → Edit `RECIPIENT_EMAIL`
3. Save (auto-redeploys)

**Heroku:**
```bash
heroku config:set RECIPIENT_EMAIL="newemail@example.com"
```

## Gmail App Password Setup

If you need to generate a new app password:

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification (must be enabled)
3. App passwords → Select app: "Mail"
4. Select device: "Other" → Enter "ASKDD Chatbot"
5. Click "Generate"
6. Copy the 16-character password
7. Use this as `SMTP_PASSWORD` in your environment variables

## Testing Email Configuration

### Test Locally

1. Fill out and submit the form at `http://localhost:3000`
2. Check `askdd@ddconsult.tech` inbox
3. Check backend logs: `tail -f /var/log/supervisor/backend.err.log`

Look for:
```
INFO - Email sent successfully to askdd@ddconsult.tech
```

### Test in Production

1. Visit your Netlify site
2. Submit a test form
3. Check `askdd@ddconsult.tech` inbox
4. Check backend logs in Railway/Render/Heroku dashboard

## Troubleshooting

### Emails Not Being Received

**Check 1: Spam Folder**
- Check spam/junk folder in askdd@ddconsult.tech

**Check 2: Backend Logs**
```bash
# Local
tail -n 50 /var/log/supervisor/backend.err.log | grep -i email

# Railway
railway logs

# Render
Check logs in Render dashboard

# Heroku
heroku logs --tail
```

**Check 3: SMTP Credentials**
- Verify `SMTP_EMAIL` and `SMTP_PASSWORD` are correct
- Ensure App Password is used (not regular password)
- Confirm 2-Step Verification is enabled on Gmail account

**Check 4: Gmail Security**
- Check [Google Account Activity](https://myaccount.google.com/notifications)
- Look for blocked sign-in attempts
- Confirm app password is still valid

### Email Sent But Missing Attachments

- Check file size limits (max 10MB per file)
- Verify files uploaded successfully in frontend
- Check backend logs for encoding errors

## Support

For email configuration issues, contact: **askdd@ddconsult.tech**
