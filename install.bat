@echo off
echo 🌤️ Weather MCP Server Installation (Sydney default)
echo.

echo 📦 Installing Node.js dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Error during dependencies installation
    pause
    exit /b 1
)

echo.
echo ✅ Installation completed!
echo.
echo 🇦🇺 This server uses Sydney as default city
echo 🆓 Open-Meteo API - 100%% free, no key required!
echo.
echo 🚀 Quick test: npm start
echo 📋 Claude configuration: see README.md
echo.
echo 💡 Usage examples once configured with Claude:
echo    - "What's the weather?" (Sydney default)
echo    - "Weather in Paris"
echo    - "Week forecast"
echo.
pause
