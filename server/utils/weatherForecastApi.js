/*
Method returns current time and tempature: 
Current weather data: { time: '00.04', temperature: '+3.1' }
*/

const getWeather = async () => {
  // Get current time
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  // Define the URL for the weather API request
  const url = `https://api.open-meteo.com/v1/forecast?latitude=62.6012&longitude=29.7632&hourly=temperature_2m&timezone=auto&start=${currentTime.toISOString()}&end=${currentTime.toISOString()}`;

  const response = await fetch(url);
  const json = await response.json();

  // Find the closest hour to the current time
  const closestHourData = json.hourly.temperature_2m.find((temp, index) => {
    const time = new Date(json.hourly.time[index]);
    return time.getHours() === currentHour; // Compare hour
  });

  if (!closestHourData) {
    console.error("Current temperature not found.");
    return;
  }

  // Format temperature to ensure it includes + or - sign
  const formattedTemperature =
    closestHourData >= 0
      ? `+${closestHourData.toFixed(1)}`
      : `${closestHourData.toFixed(1)}`;

  // Return the current weather data
  return {
    time: currentTime.toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: formattedTemperature, // Formatted with + or - sign
  };
};

// Export the getWeather function for use in other modules
module.exports = { getWeather };
