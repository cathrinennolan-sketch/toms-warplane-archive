@echo off
echo ================================================
echo  Tom's Warplane Archive - First-Time Setup
echo ================================================
echo.

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install from https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js found
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found.
    pause
    exit /b 1
)
echo [OK] npm found
echo.

:: Install dependencies
echo Installing project dependencies (this may take a minute)...
npm install
if errorlevel 1 (
    echo ERROR: npm install failed.
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

:: Install Firebase CLI globally
echo Installing Firebase CLI...
npm install -g firebase-tools
echo [OK] Firebase CLI installed
echo.

echo ================================================
echo  Setup complete!
echo ================================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser.
echo.
echo To deploy to Firebase, run:
echo   firebase deploy
echo.
pause
