@echo off
echo 🚀 Demarrage du projet LoL Analyzer (Vite)...

echo.
echo 📡 Demarrage du serveur backend...
start "Backend API" cmd /k "cd backend && npm start"

echo.
echo ⏳ Attente de 3 secondes...
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Demarrage de Vite (React)...
npm run dev

pause