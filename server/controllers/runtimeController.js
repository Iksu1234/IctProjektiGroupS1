const runtimeData = require("../utils/runtimeData");

// Get electricity price today
exports.getPriceToday = async (req, res) => {
  try {
    const data = runtimeData.todaysElectricityPrices;
    res.json(data);
  } catch (err) {
    console.log("error: " + err);
    res.status(500).send("Internal Server Error");
  }
};

// Get electricity price tomorrow
exports.getPriceTomorrow = async (req, res) => {
  try {
    const data = runtimeData.tomorrowsElectricityPrices;
    res.json(data);
  } catch (err) {
    console.log("error: " + err);
    res.status(500).send("Internal Server Error");
  }
};

// Get weatherInfo from runtimeData
exports.getWeatherinfo = async (req, res) => {
  try {
    const data = runtimeData.weatherInfo;
    res.json(data);
  } catch (err) {
    console.log("error: " + err);
  }
};

// Get scheduleForToday from runtimeData
exports.getScheduleToday = async (req, res) => {
  try {
    const data = runtimeData.scheduleForToday;
    res.json(data);
  } catch (err) {
    console.log("error: " + err);
  }
};

// Get scheduleForTomorrow from runtimeData
exports.getScheduleTomorrow = async (req, res) => {
  try {
    const data = runtimeData.scheduleForTomorrow;
    res.json(data);
  } catch (err) {
    console.log("error: " + err);
  }
};

// Get waterTemperature from runtimeData
exports.getWaterTemp = async (req, res) => {
  try {
    const data = runtimeData.waterTemperature;
    res.json(data);
  } catch (err) {
    console.log("error: " + err);
  }
};
