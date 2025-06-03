@echo off
echo 🌤️ Installation du serveur MCP Météo (Sydney par défaut)
echo.

echo 📦 Installation des dépendances Node.js...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo.
echo ✅ Installation terminée !
echo.
echo 🇦🇺 Ce serveur utilise Sydney comme ville par défaut
echo 🆓 API Open-Meteo - 100%% gratuite, aucune clé requise !
echo.
echo 🚀 Test rapide : npm start
echo 📋 Configuration Claude : voir README.md
echo.
echo 💡 Exemples d'usage une fois configuré avec Claude :
echo    - "Quelle est la météo ?" (Sydney par défaut)
echo    - "Météo à Paris"
echo    - "Prévisions de la semaine"
echo.
pause
