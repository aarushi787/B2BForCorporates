@echo off
REM Hostinger Deployment Package Creator - Batch Wrapper
REM This script runs the PowerShell deployment script

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Hostinger Deployment Package Creator
echo ========================================
echo.

REM Check if PowerShell is available
where powershell >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: PowerShell is required but not found
    pause
    exit /b 1
)

REM Run the PowerShell script
powershell -NoProfile -ExecutionPolicy Bypass -File ".\deploy-hostinger.ps1" %*

echo.
pause
