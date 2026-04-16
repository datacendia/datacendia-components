@echo off
title Datacendia Platform
color 0B
echo.
echo     ____        __                           ___     
echo    / __ \____ _/ /_____ _________  ____  ____/ (_)___ _
echo   / / / / __ `/ __/ __ `/ ___/ _ \/ __ \/ __  / / __ `/
echo  / /_/ / /_/ / /_/ /_/ / /__/  __/ / / / /_/ / / /_/ / 
echo /_____/\__,_/\__/\__,_/\___/\___/_/ /_/\__,_/_/\__,_/  
echo.
echo   Enterprise Decision Intelligence Platform
echo   (c) 2024-2026 Datacendia, LLC. All Rights Reserved.
echo.
echo ========================================
echo   Starting Datacendia Platform...
echo ========================================
echo.

:: Start backend in a new window
echo Starting Backend (port 3001)...
start "Datacendia Backend" cmd /k "cd /d %~dp0backend && npm run dev"

:: Small delay to let backend initialize
timeout /t 3 /nobreak >nul

:: Start frontend in a new window
echo Starting Frontend (port 5173)...
start "Datacendia Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo   Both servers starting!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3001
echo ========================================
echo.
echo You can close this window.
timeout /t 5
