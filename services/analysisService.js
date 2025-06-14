const getBestDays = (forecast) => {
  const favorableDays = forecast.reduce((acc, weather) => {
    const date = weather.dt_txt.split(' ')[0]; 
    const temp = weather.main.temp; 
    const condition = weather.weather[0].main.toLowerCase(); 

    if (temp >= 15 && temp <= 25 && (condition === 'clear' || condition === 'clouds')) {
      if (!acc[date]) acc[date] = [];
      acc[date].push(weather);
    }

    return acc;
  }, {});

  return Object.keys(favorableDays).slice(0, 3); 
};

module.exports = { getBestDays };
