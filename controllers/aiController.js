const { OpenAI } = require("openai");
const { getWeatherByRegion, getWeatherForecast } = require("../services/weatherService");
const { getBestDays } = require("../services/analysisService");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

exports.recommendCircuit = async (req, res) => {
  const { preferences } = req.body;

  try {
    const realWeather = await getWeatherByRegion(preferences.region);
    const forecast = await getWeatherForecast(preferences.region);

    const bestDays = forecast ? getBestDays(forecast) : [];
    const period = bestDays.length
      ? `Les jours idéaux pour visiter seraient : ${bestDays.join(', ')}.`
      : "Toute l'année, car le ciel dégagé pourrait offrir une expérience agréable.";

    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "system",
          content: "Tu es un assistant touristique spécialisé en circuits écotouristiques en Tunisie.",
        },
        {
          role: "user",
          content: `Voici les préférences de l'utilisateur : ${JSON.stringify(preferences)}. 
          La météo réelle à ${preferences.region} est : ${realWeather}. 
          En te basant sur les prévisions météo et ces éléments, recommande un circuit écotouristique idéal en Tunisie.

          ❗Format attendu :
          - 📍 Région :
          - 📅 Durée totale :
          - 📆 Période idéale : ${period}
          - 🗓️ Plan Jour par jour : (Jour 1 : ..., Jour 2 : ..., etc.)
          - 🌦️ Remarque météo :`,
        },
      ],
    });

    const result = response.choices[0].message.content;
    res.status(200).json({ recommendation: result });
  } catch (error) {
    console.error("Erreur OpenRouter :", error.message);
    res.status(500).json({ error: "Erreur lors de la génération de la recommandation." });
  }
};
