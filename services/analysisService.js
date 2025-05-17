const getBestDays = (forecast) => {
  const favorableDays = forecast.reduce((acc, weather) => {
    const date = weather.dt_txt.split(' ')[0]; // Extrait la date
    const temp = weather.main.temp; // Température
    const condition = weather.weather[0].main.toLowerCase(); // Ex. "clear", "clouds"

    // Conditions idéales : Température entre 15 et 25°C, ciel dégagé ou partiellement nuageux
    if (temp >= 15 && temp <= 25 && (condition === 'clear' || condition === 'clouds')) {
      if (!acc[date]) acc[date] = [];
      acc[date].push(weather);
    }

    return acc;
  }, {});

  return Object.keys(favorableDays).slice(0, 3); // Limite aux 3 meilleurs jours
};

module.exports = { getBestDays };
