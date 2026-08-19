@echo off
echo ========================================
echo  MedTutor ECN - Deployment Guide
echo ========================================
echo.

REM Check if git is installed
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed. Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo [1/4] Git is installed ✓
echo.

REM Get GitHub username (optional, for display)
echo [2/4] Please create a GitHub repository:
echo.
echo     1. Go to https://github.com/new
echo     2. Create a new public repository named "med-tutor-ecn"
echo     3. Do NOT initialize with README
echo.
pause

echo.
echo [3/4] Run these commands to push your code:
echo.
echo     cd C:\Users\Marc Hopf\med-tutor\med-tutor
echo.
echo     git remote add origin https://github.com/YOUR_USERNAME/med-tutor-ecn.git
echo     git push -u origin main
echo.
pause

echo.
echo [4/4] Deploy to Vercel:
echo.
echo     vercel --prod
echo.
echo     Or connect your GitHub repo at https://vercel.com
echo.
pause

echo.
echo ========================================
echo  Done! Your site will be live at:
echo  https://med-tutor-ecn.vercel.app
echo ========================================
pause
