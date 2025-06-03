# 🌤️ Weather MCP Server (Free & Sydney Default)

A Model Context Protocol (MCP) server for retrieving weather data via the free Open-Meteo API. **No API key required!** Sydney is configured as the default city.

## ✨ Features

- 🆓 **100% free** - Uses Open-Meteo API (no key required)
- 🇦🇺 **Sydney by default** - Perfect for Australia  
- 🌍 **Global support** - All cities worldwide
- 🗓️ **7-day forecasts** - Detailed weather data
- 🔍 **City search** - Find coordinates easily
- 🌐 **Multi-language** - English interface with French support

## 🚀 Quick Installation

1. **Install dependencies:**
```bash
cd weather-mcp-server
npm install
```

2. **Test immediately:**
```bash
npm start
```

**That's it!** No additional configuration needed.

## 🛠️ Configuration with Claude Desktop

Add this configuration to your `claude_desktop_config.json`:

### Windows
File: `%APPDATA%\Claude\claude_desktop_config.json`

### macOS  
File: `~/Library/Application Support/Claude/claude_desktop_config.json`

### JSON Configuration
```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": [
        "C:\\Users\\iarfl\\Documents\\Workspace\\Claude\\weather-mcp-server\\src\\index.js"
      ]
    }
  }
}
```

**Note:** Adjust the path according to your installation!

## 🔧 Available Tools

### 1. `get_current_weather`
Current weather (Sydney by default)
- **city** (optional): City name (default: Sydney)
- **country** (optional): Country code (AU, FR, etc.)

### 2. `get_weather_forecast`  
7-day forecasts (Sydney by default)
- **city** (optional): City name (default: Sydney)
- **country** (optional): Country code
- **days** (optional): Number of days 1-7 (default: 7)

### 3. `get_weather_by_coordinates`
Weather by GPS coordinates (Sydney by default)
- **lat** (optional): Latitude (default: -33.8688)
- **lon** (optional): Longitude (default: 151.2093)
- **days** (optional): Number of days 1-7 (default: 1)

### 4. `search_cities`
Search cities worldwide
- **query** (required): City name to search

## 📝 Usage Examples with Claude

Once configured, you can ask Claude:

**Default weather (Sydney):**
- "What's the weather?"
- "Current weather"
- "Week forecast"

**Other cities:**
- "Weather in Paris"
- "5-day forecast for London"
- "Temperature in Tokyo"

**City search:**
- "Find cities named Melbourne"
- "Search for Springfield"

**By coordinates:**
- "Weather at coordinates 48.8566, 2.3522"

## 🌟 Open-Meteo Benefits

- ✅ **Completely free** - No reasonable usage limits
- ✅ **No registration** - Works immediately  
- ✅ **Accurate data** - Professional weather models
- ✅ **Modern API** - Simple and fast JSON
- ✅ **Reliable** - Stable European service

## 🗺️ Why Sydney as Default?

Sydney is configured as the default city because:
- 🏙️ **Major metropolis** - Representative of Australia
- 🌤️ **Varied climate** - Good weather example
- 🇦🇺 **Unique timezone** - GMT+10/+11 depending on season
- 📍 **Exact coordinates** - -33.8688°, 151.2093°

## 🐛 Troubleshooting

### "City not found"
- Check spelling
- Try with country code: "Paris, FR"
- Use `search_cities` to find the correct name

### Network error
- Check your internet connection
- Open-Meteo is sometimes temporarily unavailable

### Server won't start
- Check Node.js: `node --version` (≥16 required)
- Install dependencies: `npm install`

## 🔄 Comparison with OpenWeatherMap

| Criteria | Open-Meteo | OpenWeatherMap |
|----------|------------|----------------|
| **Price** | 🆓 Free | 🆓 Free (limited) |
| **API Key** | ❌ None | ✅ Required |
| **Registration** | ❌ None | ✅ Mandatory |
| **Forecasts** | 7 days | 5 days (free) |
| **Accuracy** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Reliability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 📦 Dependencies

- `@modelcontextprotocol/sdk`: Official MCP SDK
- `node-fetch`: HTTP client for API requests

**No heavy external dependencies!**

## 📄 License

MIT - Use freely in your projects!

---

🇦🇺 **Made with ❤️ for Sydney and the world**

---

## 🇫🇷 Version Française / French Version

# 🌤️ Serveur MCP Météo (Gratuit & Sydney par défaut)

Un serveur MCP (Model Context Protocol) pour récupérer des données météorologiques via l'API gratuite Open-Meteo. **Aucune clé API requise !** Sydney est configuré comme ville par défaut.

## ✨ Caractéristiques

- 🆓 **100% gratuit** - Utilise l'API Open-Meteo (pas de clé requise)
- 🇦🇺 **Sydney par défaut** - Parfait pour l'Australie  
- 🌍 **Support mondial** - Toutes les villes du monde
- 🗓️ **Prévisions 7 jours** - Météo détaillée
- 🔍 **Recherche de villes** - Trouve les coordonnées facilement
- 🌐 **Interface française** - Descriptions en français

## 🚀 Installation rapide

1. **Installer les dépendances :**
```bash
cd weather-mcp-server
npm install
```

2. **Tester immédiatement :**
```bash
npm start
```

**C'est tout !** Aucune configuration supplémentaire nécessaire.

## 🛠️ Configuration avec Claude Desktop

Ajoutez cette configuration dans votre `claude_desktop_config.json` :

### Windows
Fichier : `%APPDATA%\Claude\claude_desktop_config.json`

### macOS  
Fichier : `~/Library/Application Support/Claude/claude_desktop_config.json`

### Configuration JSON
```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": [
        "C:\\Users\\iarfl\\Documents\\Workspace\\Claude\\weather-mcp-server\\src\\index.js"
      ]
    }
  }
}
```

**Note :** Adaptez le chemin selon votre installation !

## 🔧 Outils disponibles

### 1. `get_current_weather`
Météo actuelle (Sydney par défaut)
- **city** (optionnel) : Nom de la ville (défaut: Sydney)
- **country** (optionnel) : Code pays (AU, FR, etc.)

### 2. `get_weather_forecast`  
Prévisions sur 7 jours (Sydney par défaut)
- **city** (optionnel) : Nom de la ville (défaut: Sydney)
- **country** (optionnel) : Code pays
- **days** (optionnel) : Nombre de jours 1-7 (défaut: 7)

### 3. `get_weather_by_coordinates`
Météo par coordonnées GPS (Sydney par défaut)
- **lat** (optionnel) : Latitude (défaut: -33.8688)
- **lon** (optionnel) : Longitude (défaut: 151.2093)
- **days** (optionnel) : Nombre de jours 1-7 (défaut: 1)

### 4. `search_cities`
Recherche de villes dans le monde
- **query** (requis) : Nom de la ville à rechercher

## 📝 Exemples d'utilisation avec Claude

Une fois configuré, vous pouvez demander à Claude :

**Météo par défaut (Sydney) :**
- "Quelle est la météo ?"
- "Météo actuelle"
- "Prévisions de la semaine"

**Autres villes :**
- "Météo à Paris"
- "Prévisions pour Londres sur 5 jours"
- "Température à Tokyo"

**Recherche de villes :**
- "Trouve les villes appelées Melbourne"
- "Cherche Springfield"

**Par coordonnées :**
- "Météo aux coordonnées 48.8566, 2.3522"

## 🌟 Avantages d'Open-Meteo

- ✅ **Totalement gratuit** - Pas de limite d'usage raisonnable
- ✅ **Pas d'inscription** - Fonctionne immédiatement  
- ✅ **Données précises** - Modèles météo professionnels
- ✅ **API moderne** - JSON simple et rapide
- ✅ **Fiable** - Service européen stable

## 🗺️ Pourquoi Sydney par défaut ?

Sydney est configuré comme ville par défaut car :
- 🏙️ **Grande métropole** - Représentative de l'Australie
- 🌤️ **Climat varié** - Bon exemple météorologique
- 🇦🇺 **Fuseau unique** - GMT+10/+11 selon saison
- 📍 **Coordonnées exactes** - -33.8688°, 151.2093°

## 🐛 Dépannage

### "Ville non trouvée"
- Vérifiez l'orthographe
- Essayez avec le code pays : "Paris, FR"
- Utilisez `search_cities` pour trouver le bon nom

### Erreur de réseau
- Vérifiez votre connexion internet
- Open-Meteo est parfois temporairement indisponible

### Le serveur ne démarre pas
- Vérifiez Node.js : `node --version` (≥16 requis)
- Installez les dépendances : `npm install`

## 🔄 Comparaison avec OpenWeatherMap

| Critère | Open-Meteo | OpenWeatherMap |
|---------|------------|----------------|
| **Prix** | 🆓 Gratuit | 🆓 Gratuit (limité) |
| **Clé API** | ❌ Aucune | ✅ Requise |
| **Inscription** | ❌ Aucune | ✅ Obligatoire |
| **Prévisions** | 7 jours | 5 jours (gratuit) |
| **Précision** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Fiabilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 📦 Dépendances

- `@modelcontextprotocol/sdk` : SDK officiel MCP
- `node-fetch` : Client HTTP pour les requêtes API

**Pas de dépendance externe lourde !**

## 📄 Licence

MIT - Utilisez librement dans vos projets !

---

🇦🇺 **Fait avec ❤️ pour Sydney et le monde entier**
