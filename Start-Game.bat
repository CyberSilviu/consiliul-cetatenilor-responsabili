@echo off
echo ========================================
echo  Starting Director Game Web App
echo ========================================
echo.

REM Change to the game-app directory
cd /d "%~dp0"

echo [1/3] Setting execution policy...
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"

echo [2/3] Installing dependencies (if needed)...
call npm install

echo [3/3] Starting development server...
echo.
echo The game will open in your browser at: http://localhost:5173
echo.
echo To stop the server, close this window or press Ctrl+C
echo.

REM Start the dev server and open browser
start http://localhost:5173
call npm run dev

pause
