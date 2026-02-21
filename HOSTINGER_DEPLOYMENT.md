# Hostinger Deployment Guide

## Overview
This guide helps you deploy the B2B Nexus Marketplace to Hostinger using their upload format requirements.

## Step 1: Prepare Your Deployment Package

### A. Create Frontend Build
```bash
npm run build
```
This generates the optimized frontend in the `dist/` folder.

### B. Prepare Backend Files
Ensure your backend is ready in the `backend/` folder with:
- `src/` - source code
- `package.json` - dependencies
- `.env` - environment variables (don't include in zip, configure on server)

### C. Database
You already have `schema.sql` which contains your database structure.

## Step 2: Create Deployment Package

### Option A: Create .zip Package (Recommended)

Create the following structure in a zip file:

```
deployment.zip
├── public/                    # Frontend static files
├── dist/                      # Frontend build output
├── backend/                   # Backend source
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── uploads/                   # User uploads directory
├── database.sql               # Your schema.sql (renamed)
├── .htaccess                  # Apache routing config
└── package.json               # Root package.json
```

### Step 3: Essential Files to Include

#### .htaccess (for Apache routing)
Create this file in the root of your zip:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

#### package.json (root level)
```json
{
  "name": "b2b-nexus-marketplace",
  "version": "1.0.0",
  "scripts": {
    "build": "npm run build --prefix backend",
    "start": "node backend/src/index.js",
    "postinstall": "npm install --prefix backend"
  },
  "engines": {
    "node": "18.x"
  }
}
```

## Step 4: Upload to Hostinger

### Using Hostinger Dashboard:
1. Go to **Files** → **Upload**
2. Select your `.zip` file
3. Hostinger will extract automatically
4. Choose deployment/build method

### Environment Variables Setup:
Configure these on Hostinger:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Authentication secret
- `GEMINI_API_KEY` - Google Gemini API key
- `NODE_ENV` - Set to "production"

## Step 5: Database Setup

1. Create PostgreSQL database in Hostinger
2. Upload `database.sql` or `schema.sql` via Hostinger's DB manager
3. Configure `DATABASE_URL` with Hostinger's connection details

## Step 6: Post-Deployment Checklist

- [ ] Build completes without errors
- [ ] Environment variables are set
- [ ] Database is connected and initialized
- [ ] Frontend routes properly (SPA rewrites configured)
- [ ] Backend API endpoints respond
- [ ] Upload directory has write permissions
- [ ] SSL/HTTPS enabled
- [ ] Domain configured

## Troubleshooting

### Frontend Routes Not Working
- Ensure `.htaccess` is in root directory
- Check Apache `mod_rewrite` is enabled

### Database Connection Failed
- Verify `DATABASE_URL` format
- Check Hostinger firewall allows connections
- Confirm database user permissions

### Node Modules Not Installed
- Check `postinstall` scripts run
- Verify `package.json` in correct location

## File Size Limits
- Zip file: Depends on Hostinger plan (usually 500MB-1GB)
- Individual files: Check Hostinger upload limits
- Database: PostgreSQL backups have size limits

## Additional Resources
- [Hostinger Node.js Deployment](https://www.hostinger.com/)
- Your project: `BACKEND_INTEGRATION.md`
- Setup docs: `SETUP_COMPLETE.md`
