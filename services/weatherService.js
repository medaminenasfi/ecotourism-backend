const axios = require('axios');

const getWeatherByRegion = async (region) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${region},TN&appid=${apiKey}&units=metric&lang=fr`;

  try {
    const response = await axios.get(url);
    return response.data.weather[0].description;
  } catch (error) {
    console.error('Erreur lors de la récupération de la météo:', error.message);
    return null;
  }
};

const getWeatherForecast = async (region) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${region},TN&appid=${apiKey}&units=metric&lang=fr`;

  try {
    const response = await axios.get(url);
    return response.data.list;
  } catch (error) {
    console.error('Erreur lors de la récupération des prévisions météo:', error.message);
    return null;
  }
};

module.exports = { getWeatherByRegion, getWeatherForecast };
