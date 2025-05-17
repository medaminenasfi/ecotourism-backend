const axios = require('axios');

const getWeatherByRegion = async (region) => {
  const apiKey = process.env.WEATHER_API_KEY;
  console.log("Clé API récupérée depuis .env :", apiKey); // ✅ ici, c’est accessible
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${region},TN&appid=${apiKey}&units=metric&lang=fr`;

  try {
    const response = await axios.get(url);
    return response.data.weather[0].description; // Exemple : "ciel dégagé"
  } catch (error) {
    console.error('Erreur lors de la récupération de la météo:', error.message);
    return null;
  }
};

module.exports = { getWeatherByRegion };
