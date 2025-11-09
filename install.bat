@echo off
echo ========================================
echo Church Polling Software - Installation
echo ========================================
echo.

echo [1/3] Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Installing frontend dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo ========================================
echo Installation Complete! ✓
echo ========================================
echo.
echo To start the application, run:
echo   npm run dev
echo.
echo Or run start.bat for easy startup
echo.
pause
