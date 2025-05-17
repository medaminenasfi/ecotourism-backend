const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL, 
});

exports.recommendCircuit = async (req, res) => {
  const { preferences } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct", 
      messages: [
        {
          role: "system",
          content: "Tu es un assistant touristique spécialisé en circuits écotouristiques en Tunisie.",
        },
        {
          role: "user",
          content: `Voici les préférences de l'utilisateur : ${JSON.stringify(preferences)}. Que recommandes-tu ?`,
        },
      ],
    });

    const result = response.choices[0].message.content;
    res.status(200).json({ recommendation: result });
  } catch (error) {
    console.error("Erreur OpenRouter :", error.message);
    res.status(500).json({ error: "Erreur IA via OpenRouter." });
  }
};
