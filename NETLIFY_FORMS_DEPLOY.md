# Deploy to Netlify with Netlify Forms

Your form is now configured to work with Netlify's built-in form handling!

---

## What Changed

✅ Form now submits to Netlify Forms (no separate backend needed for basic functionality)
✅ Netlify will capture all form submissions
✅ File uploads will be stored by Netlify
✅ You can set up email notifications in Netlify dashboard

---

## Deployment Steps

### 1. Push to GitHub (if not done)

```bash
cd /app
git add .
git commit -m "Configure Netlify Forms"
git push origin main
```

### 2. Deploy to Netlify

1. Go to https://netlify.com
2. Sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub → Select your repository
5. Netlify will auto-detect settings from `netlify.toml`
6. Click "Deploy site"
7. Wait 2-3 minutes

### 3. Enable Form Notifications

Once deployed:

1. Go to your Netlify site dashboard
2. Click **"Forms"** in the left sidebar
3. You'll see "askdd-chatbot-onboarding" form listed
4. Click **"Settings and usage"**
5. Scroll to **"Form notifications"**
6. Click **"Add notification"**
7. Choose **"Email notification"**
8. Add email: **amrit@ddconsult.tech**
9. Choose "New form submission"
10. Save

Now every form submission will:
- ✅ Be captured in Netlify Forms dashboard
- ✅ Send email notification to amrit@ddconsult.tech
- ✅ Store uploaded files (you'll get download links in the email)

### 4. View Submissions

- Go to Netlify Dashboard → Forms → Your form
- See all submissions with uploaded files
- Export as CSV if needed

---

## Important Notes

### File Uploads

With Netlify Forms:
- Files are uploaded to Netlify's servers
- You'll receive download links in the email notification
- Files are NOT sent as email attachments
- Files are accessible from Netlify dashboard

If you need files as email attachments instead, you'll need to:
1. Deploy the backend to Railway (see DEPLOY_NOW.md)
2. Update form to use backend API

### Spam Protection

Netlify Forms includes built-in spam protection with:
- Honeypot field (already added)
- reCAPTCHA (optional - can enable in Netlify dashboard)

---

## Testing

1. Visit your deployed Netlify URL
2. Fill out and submit the form
3. Check Netlify Dashboard → Forms
4. Check email at amrit@ddconsult.tech
5. Visit `/thank-you` page after submission

---

## Troubleshooting

### "Form not found" error
- Make sure form has `data-netlify="true"` attribute ✅ (already added)
- Ensure `name="askdd-chatbot-onboarding"` is set ✅ (already added)
- Redeploy the site

### Not receiving emails
- Check Netlify Dashboard → Forms → Settings
- Verify email notification is enabled
- Check spam folder
- Email may take a few minutes to arrive

### Files not uploading
- Netlify Forms supports files up to 10MB
- Multiple files are supported
- Files are stored in Netlify, not sent as attachments

---

## Cost

✅ **FREE** - Netlify Forms free tier includes:
- 100 form submissions/month
- File uploads included
- Email notifications included

For more submissions, upgrade to Netlify Pro ($19/month for 1000 submissions)

---

## Next Steps

1. Deploy to Netlify (5 minutes)
2. Enable email notifications (2 minutes)
3. Test the form
4. Monitor submissions in Netlify Dashboard

---

## Need Help?

Contact: **askdd@ddconsult.tech**
