# Deploy to Netlify with Netlify Forms

Your form is now configured to work with Netlify's built-in form handling with **FULL SUPPORT FOR MULTIPLE DOCUMENT UPLOADS**!

---

## What Changed (Fixed for Multiple Files)

✅ Form now submits to Netlify Forms (no separate backend needed)
✅ **Logo uploads work** - single file
✅ **Multiple document uploads now work** - each document gets a unique field name (document-1, document-2, etc.)
✅ Netlify will capture all form submissions with ALL files
✅ You'll get download links for every uploaded file

---

## How Multiple Files Work

Instead of using one field for all documents (which Netlify doesn't support well), we now:
- Create unique field names: `document-1`, `document-2`, `document-3`, etc.
- Support up to 10 documents
- Each file gets its own download link in the email notification

---

## Deployment Steps

### 1. Push to GitHub

```bash
cd /app
git add .
git commit -m "Fix: Multiple document uploads for Netlify Forms"
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
- ✅ Include download links for **logo AND all uploaded documents**
- ✅ Store all files securely

### 4. View Submissions

- Go to Netlify Dashboard → Forms → Your form
- See all submissions with ALL uploaded files
- Download any file individually
- Export as CSV if needed

---

## File Upload Details

### Logo
- Field name: `logo`
- Single file upload
- Download link provided in email

### Documents
- Field names: `document-1`, `document-2`, `document-3`, etc.
- Up to 10 documents supported
- Each gets its own download link in email
- Count field shows how many documents were uploaded

### Example Email
```
Logo: [Download logo.png]
Documents (3 files):
- document-1: [Download FAQ.pdf]
- document-2: [Download manual.docx]
- document-3: [Download guide.csv]
```

---

## Important Notes

### File Size Limits
- Each file: Max 10MB
- Works with: PDF, DOC, DOCX, CSV, PNG, SVG, JPG

### Download Links
- Files hosted on Netlify's secure servers
- Links expire after 30 days (configurable in Netlify settings)
- Files accessible from Netlify dashboard indefinitely

### If You Need File Attachments Instead
If you prefer files as email attachments (not download links), you'll need to:
1. Deploy the backend to Railway (see DEPLOY_NOW.md)
2. Update form to use backend API
3. Files will be base64 encoded and attached to emails

---

## Testing

1. Visit your deployed Netlify URL
2. Fill out the form
3. **Upload a logo AND multiple documents** (test with 2-3 files)
4. Submit
5. Check Netlify Dashboard → Forms
6. Check email at amrit@ddconsult.tech
7. Verify all files have download links
8. Visit `/thank-you` page after submission

---

## Troubleshooting

### "Form not found" error
- Redeploy the site after pushing the latest changes
- Clear browser cache

### Not all documents appearing
- Check that files are under 10MB each
- Make sure you're using the latest deployed version
- Verify all `document-1` through `document-10` fields are in form.html

### Not receiving emails
- Check Netlify Dashboard → Forms → Settings
- Verify email notification is enabled
- Check spam folder
- Email may take a few minutes to arrive

---

## Cost

✅ **FREE** - Netlify Forms free tier includes:
- 100 form submissions/month
- File uploads included (all files)
- Email notifications included

For more submissions, upgrade to Netlify Pro ($19/month for 1000 submissions)

---

## What's Fixed

✅ **Before**: Only logo was captured, documents were ignored
✅ **Now**: Logo + all documents (up to 10) are captured and sent via email

---

## Need Help?

Contact: **askdd@ddconsult.tech**
