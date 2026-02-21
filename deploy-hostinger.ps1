# Hostinger Deployment Package Creator
# This script packages your B2B Nexus Marketplace for Hostinger upload

param(
    [string]$OutputPath = ".\deployment",
    [switch]$SkipBuild = $false
)

Write-Host "========================================" -ForegroundColor Green
Write-Host "Hostinger Deployment Package Creator" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Create deployment directory
if (Test-Path $OutputPath) {
    Write-Host "Cleaning existing deployment folder..." -ForegroundColor Yellow
    Remove-Item $OutputPath -Recurse -Force -ErrorAction SilentlyContinue
}

New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
Write-Host "[OK] Created deployment directory: $OutputPath" -ForegroundColor Green

# Step 1: Build Frontend
if (-not $SkipBuild) {
    Write-Host "`n[1/6] Building frontend..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Frontend build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] Frontend built successfully" -ForegroundColor Green
}
else {
    Write-Host "[1/6] Skipping frontend build (--SkipBuild)" -ForegroundColor Yellow
}

# Step 2: Copy Frontend Files
Write-Host "`n[2/6] Copying frontend files..." -ForegroundColor Cyan
if (Test-Path ".\dist") {
    Copy-Item -Path ".\dist" -Destination "$OutputPath\public" -Recurse
    Write-Host "[OK] Frontend files copied" -ForegroundColor Green
}
else {
    Write-Host "[ERROR] dist/ folder not found. Run 'npm run build' first!" -ForegroundColor Red
    exit 1
}

# Step 3: Copy Backend Files
Write-Host "`n[3/6] Copying backend files..." -ForegroundColor Cyan
Copy-Item -Path ".\backend" -Destination "$OutputPath\backend" -Recurse -Exclude "node_modules", ".env", ".git", "*.pyc", "__pycache__"
Write-Host "[OK] Backend files copied" -ForegroundColor Green

# Step 4: Copy Database Schema
Write-Host "`n[4/6] Copying database schema..." -ForegroundColor Cyan
if (Test-Path ".\schema.sql") {
    Copy-Item -Path ".\schema.sql" -Destination "$OutputPath\database.sql"
    Write-Host "[OK] Database schema copied as database.sql" -ForegroundColor Green
}
else {
    Write-Host "[WARN] schema.sql not found (optional)" -ForegroundColor Yellow
}

# Step 5: Create .htaccess for routing
Write-Host "`n[5/6] Creating .htaccess routing file..." -ForegroundColor Cyan
$htaccess = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [QSA,L]
</IfModule>
"@
Set-Content -Path "$OutputPath\.htaccess" -Value $htaccess
Write-Host "[OK] .htaccess created for SPA routing" -ForegroundColor Green

# Step 6: Create Root package.json
Write-Host "`n[6/6] Creating root package.json..." -ForegroundColor Cyan
$packageJson = @{
    "name" = "b2b-nexus-marketplace"
    "version" = "1.0.0"
    "type" = "module"
    "scripts" = @{
        "build" = "npm run build --prefix backend"
        "start" = "node backend/src/index.ts"
        "postinstall" = "npm install --prefix backend"
    }
    "engines" = @{
        "node" = "18.x"
    }
} | ConvertTo-Json -Depth 10
Set-Content -Path "$OutputPath\package.json" -Value $packageJson
Write-Host "[OK] Root package.json created" -ForegroundColor Green

# Create Zip File
Write-Host "`n[FINAL] Creating deployment.zip..." -ForegroundColor Cyan
$zipPath = ".\deployment.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($OutputPath, $zipPath, 'Optimal', $true)

Write-Host "[OK] Deployment package created: $zipPath" -ForegroundColor Green

# Summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Deployment Package Ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Package Contents:" -ForegroundColor Cyan
Write-Host "  [1] public/           (Frontend files)" -ForegroundColor Gray
Write-Host "  [2] backend/          (Backend source)" -ForegroundColor Gray
Write-Host "  [3] database.sql      (Database schema)" -ForegroundColor Gray
Write-Host "  [4] .htaccess         (SPA routing)" -ForegroundColor Gray
Write-Host "  [5] package.json      (Root config)" -ForegroundColor Gray
Write-Host ""
Write-Host "Next Steps for Hostinger:" -ForegroundColor Yellow
Write-Host "  1. Go to Hostinger Dashboard" -ForegroundColor White
Write-Host "  2. Select Files -> Upload" -ForegroundColor White
Write-Host "  3. Upload: $zipPath" -ForegroundColor White
Write-Host "  4. Hostinger will extract and deploy" -ForegroundColor White
Write-Host ""
Write-Host "Environment Variables to Set:" -ForegroundColor Yellow
Write-Host "  * DATABASE_URL (PostgreSQL connection)" -ForegroundColor Gray
Write-Host "  * JWT_SECRET (Authentication)" -ForegroundColor Gray
Write-Host "  * GEMINI_API_KEY (AI Service)" -ForegroundColor Gray
Write-Host "  * NODE_ENV = production" -ForegroundColor Gray
Write-Host ""
Write-Host "File Size: $([Math]::Round((Get-Item $zipPath).Length / 1MB, 2)) MB" -ForegroundColor Cyan
Write-Host ""
