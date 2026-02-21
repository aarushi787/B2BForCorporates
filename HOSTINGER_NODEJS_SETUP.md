# Hostinger Node.js Deployment Guide

## ⚠️ Important: Use Node.js Hosting, NOT File Migration

Your project is a **Node.js + React application**, not PHP/WordPress. Hostinger's file migration tool rejects this because it detects TypeScript and Python files.

**Solution:** Deploy using **Hostinger's Node.js Hosting** (VPS or Premium plans).

---

## Step 1: Prepare for Hostinger Node.js

### Option A: Via Git (RECOMMENDED)

1. **Push to GitHub/GitLab**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/b2b-nexus-marketplace.git
   git push -u origin main
   ```

2. **Connect in Hostinger:**
   - Go to **Hosting** → **Git Repositories**
   - Click **Connect Repository**
   - Authorize GitHub and select your repo
   - Branch: `main`
   - App Root: `/` (or `/backend` for API only)

### Option B: Manual Upload (Skip File Migration Tool)

Use **SFTP** or **File Manager**, NOT the migration tool:

1. In Hostinger Dashboard: **Files** → **File Manager** (NOT Upload)
2. Create folders:
   ```
   public_html/
   ├── backend/
   ├── dist/
   ├── package.json
   └── .htaccess
   ```
3. Upload files manually using File Manager

---

## Step 2: Configure Node.js Environment

In Hostinger Dashboard → **Node.js Settings**:

```
Node.js Version: 18.x LTS
Package Manager: npm
```

### Set Environment Variables

Go to **Node.js** → **Environment Variables**:

```
DATABASE_URL=<your_postgres_connection_string>
JWT_SECRET=<your_jwt_secret>
GEMINI_API_KEY=<your_api_key>
NODE_ENV=production
```

### Configure Build & Start Commands

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npm start
```

---

## Step 3: Database Setup

1. In Hostinger: **Databases** → **Create Database**
   - Type: PostgreSQL
   - Name: `b2b_nexus`
   - Note the connection string

2. **Import Schema**
   - Go to **Database Management**
   - Use phpPgAdmin or similar
   - Import `schema.sql` file

3. **Update DATABASE_URL** in environment variables with the connection details

---

## Step 4: Deploy

### If Using Git:
- Hostinger auto-deploys on push to `main` branch
- Check **Deployments** tab for status
- View logs under **Logs**

### If Using File Manager:
1. Upload all files via File Manager
2. Install dependencies: `npm install`
3. Build frontend: `npm run build`
4. Restart Node.js app

---

## Step 5: Configure Domain & SSL

1. **Domain** → Connect your domain
2. **SSL** → Enable free SSL certificate (AutoSSL)
3. Set up redirects (www → non-www or vice versa)

---

## Troubleshooting

### Build Fails: "Cannot find module"
- Run: `npm install` in File Manager terminal or via Git
- Check Node version matches (18.x)

### Database Connection Error
- Verify DATABASE_URL format: `postgres://user:password@host:port/database`
- Check PostgreSQL connection limits (may need upgrade)
- Test connection in **Databases** tab

### Frontend Routes 404
- Ensure `.htaccess` is in `public_html/` root
- May need custom routing if serving from subdirectory

### Port Issues
- Hostinger assigns port automatically
- Don't hardcode port 3000 or 5000
- Use `process.env.PORT` in your code

---

## Full Directory Structure for Hostinger

```
public_html/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── tsconfig.json
├── dist/
│   ├── index.html
│   ├── assets/
│   └── ...
├── package.json
├── .htaccess
└── uploads/ (create manually)
```

---

## What NOT to Deploy

- ❌ `.venv/` folder (Python virtual environment)
- ❌ `node_modules/` (reinstalled by npm)
- ❌ `.env` (use Hostinger settings instead)
- ❌ `.git/` folder (unless needed)
- ❌ Build artifacts if already included

---

## Recommended Hostinger Plan

- **Premium or Business** for Node.js support
- PostgreSQL database included
- Sufficient resources for marketplace app
- 24/7 support

---

## Alternative: Use Vercel + Separate Backend

If Hostinger is problematic:

**Frontend:** Deploy to Vercel (free)
```bash
npm install -g vercel
vercel
```

**Backend:** Deploy to Heroku, Railway, or Render
- Scales independently
- Better for APIs

Then connect them via API_URL environment variable.

---

## Support & Resources

- **Hostinger Docs:** https://support.hostinger.com/
- **Node.js Guide:** Support Dashboard → Knowledge Base
- **PostgreSQL Admin:** phpPgAdmin or DBeaver with SSH tunnel
