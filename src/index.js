#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';

// APIs gratuites sans authentification
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// Coordonnées par défaut pour Sydney
const DEFAULT_LOCATION = {
  name: 'Sydney',
  latitude: -33.8688,
  longitude: 151.2093,
  country: 'Australia'
};

class WeatherServer {
  constructor() {
    this.server = new Server(
      {
        name: 'weather-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Gestion des erreurs
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // Liste des outils disponibles
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_current_weather',
          description: 'Récupère la météo actuelle pour une ville (Sydney par défaut)',
          inputSchema: {
            type: 'object',
            properties: {
              city: {
                type: 'string',
                description: 'Nom de la ville (optionnel, Sydney par défaut)',
                default: 'Sydney'
              },
              country: {
                type: 'string',
                description: 'Code pays optionnel (ex: AU, FR, US)',
              }
            },
            required: [],
          },
        },
        {
          name: 'get_weather_forecast',
          description: 'Récupère les prévisions météo sur 7 jours (Sydney par défaut)',
          inputSchema: {
            type: 'object',
            properties: {
              city: {
                type: 'string',
                description: 'Nom de la ville (optionnel, Sydney par défaut)',
                default: 'Sydney'
              },
              country: {
                type: 'string',
                description: 'Code pays optionnel',
              },
              days: {
                type: 'number',
                description: 'Nombre de jours de prévision (1-7)',
                default: 7,
                minimum: 1,
                maximum: 7
              }
            },
            required: [],
          },
        },
        {
          name: 'get_weather_by_coordinates',
          description: 'Récupère la météo selon les coordonnées géographiques',
          inputSchema: {
            type: 'object',
            properties: {
              lat: {
                type: 'number',
                description: 'Latitude (-33.8688 pour Sydney par défaut)',
                default: -33.8688
              },
              lon: {
                type: 'number',
                description: 'Longitude (151.2093 pour Sydney par défaut)',
                default: 151.2093
              },
              days: {
                type: 'number',
                description: 'Nombre de jours de prévision (1-7)',
                default: 1,
                minimum: 1,
                maximum: 7
              }
            },
            required: [],
          },
        },
        {
          name: 'search_cities',
          description: 'Recherche des villes par nom pour obtenir leurs coordonnées',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Nom de la ville à rechercher'
              }
            },
            required: ['query'],
          },
        },
      ],
    }));

    // Gestionnaire d'appel d'outils
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_current_weather':
            return await this.getCurrentWeather(args.city || 'Sydney', args.country);
          
          case 'get_weather_forecast':
            return await this.getWeatherForecast(args.city || 'Sydney', args.country, args.days || 7);
          
          case 'get_weather_by_coordinates':
            return await this.getWeatherByCoordinates(
              args.lat || DEFAULT_LOCATION.latitude, 
              args.lon || DEFAULT_LOCATION.longitude, 
              args.days || 1
            );
          
          case 'search_cities':
            return await this.searchCities(args.query);
          
          default:
            throw new Error(`Outil inconnu: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Erreur lors de la récupération des données météo: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async getCoordinates(city, country) {
    const query = country ? `${city}, ${country}` : city;
    const url = `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=1&language=fr&format=json`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data.results || data.results.length === 0) {
      throw new Error(`Ville "${query}" non trouvée`);
    }

    return data.results[0];
  }

  async getCurrentWeather(city, country) {
    let location;
    
    if (city.toLowerCase() === 'sydney' && !country) {
      location = DEFAULT_LOCATION;
    } else {
      location = await this.getCoordinates(city, country);
    }

    const url = `${WEATHER_API}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de la météo');
    }

    const current = data.current;
    const weatherDesc = this.getWeatherDescription(current.weather_code);
    const windDir = this.getWindDirection(current.wind_direction_10m);
    
    return {
      content: [
        {
          type: 'text',
          text: `🌤️ Météo actuelle à ${location.name || location.admin1 || 'Localisation'}${location.country ? `, ${location.country}` : ''}

📍 **Localisation:** ${location.latitude}°, ${location.longitude}°
🌡️ **Température:** ${Math.round(current.temperature_2m)}°C
🤔 **Ressenti:** ${Math.round(current.apparent_temperature)}°C
☁️ **Conditions:** ${weatherDesc} ${current.is_day ? '☀️' : '🌙'}
💧 **Humidité:** ${current.relative_humidity_2m}%
🌬️ **Vent:** ${Math.round(current.wind_speed_10m)} km/h ${windDir}
💨 **Rafales:** ${Math.round(current.wind_gusts_10m)} km/h
🔽 **Pression:** ${Math.round(current.pressure_msl)} hPa
☁️ **Couverture nuageuse:** ${current.cloud_cover}%

${current.precipitation > 0 ? `🌧️ **Précipitations:** ${current.precipitation} mm` : ''}
${current.rain > 0 ? `🌧️ **Pluie:** ${current.rain} mm` : ''}
${current.snowfall > 0 ? `❄️ **Neige:** ${current.snowfall} cm` : ''}

⏰ **Dernière mise à jour:** ${new Date(current.time).toLocaleString('fr-FR')}`,
        },
      ],
    };
  }

  async getWeatherForecast(city, country, days) {
    let location;
    
    if (city.toLowerCase() === 'sydney' && !country) {
      location = DEFAULT_LOCATION;
    } else {
      location = await this.getCoordinates(city, country);
    }

    const url = `${WEATHER_API}?latitude=${location.latitude}&longitude=${location.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto&forecast_days=${days}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des prévisions');
    }

    const daily = data.daily;
    let forecastText = `🗓️ Prévisions météo ${days} jours pour ${location.name || location.admin1}${location.country ? `, ${location.country}` : ''}\n\n`;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(daily.time[i]);
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
      const dateStr = date.toLocaleDateString('fr-FR');
      const weatherDesc = this.getWeatherDescription(daily.weather_code[i]);
      const windDir = this.getWindDirection(daily.wind_direction_10m_dominant[i]);
      
      forecastText += `📅 **${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dateStr}**\n`;
      forecastText += `🌡️ ${Math.round(daily.temperature_2m_min[i])}°C → ${Math.round(daily.temperature_2m_max[i])}°C\n`;
      forecastText += `🤔 Ressenti: ${Math.round(daily.apparent_temperature_min[i])}°C → ${Math.round(daily.apparent_temperature_max[i])}°C\n`;
      forecastText += `☁️ ${weatherDesc}\n`;
      forecastText += `🌬️ Vent: ${Math.round(daily.wind_speed_10m_max[i])} km/h ${windDir}\n`;
      
      if (daily.precipitation_sum[i] > 0) {
        forecastText += `🌧️ Précipitations: ${daily.precipitation_sum[i]}mm\n`;
      }
      
      forecastText += `🌅 Lever: ${new Date(daily.sunrise[i]).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}\n`;
      forecastText += `🌇 Coucher: ${new Date(daily.sunset[i]).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}\n\n`;
    }

    return {
      content: [
        {
          type: 'text',
          text: forecastText.trim(),
        },
      ],
    };
  }

  async getWeatherByCoordinates(lat, lon, days) {
    const currentUrl = `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&timezone=auto`;
    
    if (days === 1) {
      const response = await fetch(currentUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la météo');
      }

      const current = data.current;
      const weatherDesc = this.getWeatherDescription(current.weather_code);
      const windDir = this.getWindDirection(current.wind_direction_10m);
      
      return {
        content: [
          {
            type: 'text',
            text: `🌤️ Météo actuelle aux coordonnées ${lat}°, ${lon}°

🌡️ **Température:** ${Math.round(current.temperature_2m)}°C
🤔 **Ressenti:** ${Math.round(current.apparent_temperature)}°C
☁️ **Conditions:** ${weatherDesc} ${current.is_day ? '☀️' : '🌙'}
💧 **Humidité:** ${current.relative_humidity_2m}%
🌬️ **Vent:** ${Math.round(current.wind_speed_10m)} km/h ${windDir}
🔽 **Pression:** ${Math.round(current.pressure_msl)} hPa
☁️ **Couverture nuageuse:** ${current.cloud_cover}%

⏰ **Dernière mise à jour:** ${new Date(current.time).toLocaleString('fr-FR')}`,
          },
        ],
      };
    } else {
      // Prévisions multi-jours
      const forecastUrl = `${WEATHER_API}?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=${days}`;
      const response = await fetch(forecastUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des prévisions');
      }

      const daily = data.daily;
      let forecastText = `🗓️ Prévisions ${days} jours aux coordonnées ${lat}°, ${lon}°\n\n`;
      
      for (let i = 0; i < days; i++) {
        const date = new Date(daily.time[i]);
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
        const dateStr = date.toLocaleDateString('fr-FR');
        const weatherDesc = this.getWeatherDescription(daily.weather_code[i]);
        
        forecastText += `📅 **${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dateStr}**\n`;
        forecastText += `🌡️ ${Math.round(daily.temperature_2m_min[i])}°C → ${Math.round(daily.temperature_2m_max[i])}°C\n`;
        forecastText += `☁️ ${weatherDesc}\n`;
        if (daily.precipitation_sum[i] > 0) {
          forecastText += `🌧️ ${daily.precipitation_sum[i]}mm\n`;
        }
        forecastText += `\n`;
      }

      return {
        content: [
          {
            type: 'text',
            text: forecastText.trim(),
          },
        ],
      };
    }
  }

  async searchCities(query) {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=10&language=fr&format=json`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data.results) {
      throw new Error(`Aucune ville trouvée pour "${query}"`);
    }

    let resultText = `🔍 Villes trouvées pour "${query}":\n\n`;
    
    data.results.forEach((city, index) => {
      resultText += `${index + 1}. **${city.name}**\n`;
      resultText += `   📍 ${city.latitude}°, ${city.longitude}°\n`;
      if (city.admin1) resultText += `   🏛️ ${city.admin1}\n`;
      if (city.country) resultText += `   🌍 ${city.country}\n`;
      if (city.population) resultText += `   👥 ${city.population.toLocaleString()} habitants\n`;
      resultText += `\n`;
    });

    return {
      content: [
        {
          type: 'text',
          text: resultText.trim(),
        },
      ],
    };
  }

  getWeatherDescription(code) {
    const descriptions = {
      0: 'Ciel dégagé',
      1: 'Principalement dégagé',
      2: 'Partiellement nuageux',
      3: 'Couvert',
      45: 'Brouillard',
      48: 'Brouillard givrant',
      51: 'Bruine légère',
      53: 'Bruine modérée',
      55: 'Bruine dense',
      56: 'Bruine verglaçante légère',
      57: 'Bruine verglaçante dense',
      61: 'Pluie légère',
      63: 'Pluie modérée',
      65: 'Pluie forte',
      66: 'Pluie verglaçante légère',
      67: 'Pluie verglaçante forte',
      71: 'Neige légère',
      73: 'Neige modérée',
      75: 'Neige forte',
      77: 'Grains de neige',
      80: 'Averses légères',
      81: 'Averses modérées',
      82: 'Averses violentes',
      85: 'Averses de neige légères',
      86: 'Averses de neige fortes',
      95: 'Orage',
      96: 'Orage avec grêle légère',
      99: 'Orage avec grêle forte'
    };
    
    return descriptions[code] || 'Conditions inconnues';
  }

  getWindDirection(degrees) {
    if (degrees === null || degrees === undefined) return '';
    
    const directions = [
      'N', 'NNE', 'NE', 'ENE',
      'E', 'ESE', 'SE', 'SSE',
      'S', 'SSO', 'SO', 'OSO',
      'O', 'ONO', 'NO', 'NNO'
    ];
    
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🌤️ Serveur MCP Météo démarré (Sydney par défaut, aucune clé API requise)');
  }
}

const server = new WeatherServer();
server.run().catch(console.error);
