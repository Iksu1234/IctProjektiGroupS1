const express = require("express");
const cors = require("cors");
const router = require("./routes/router.js");
require("dotenv").config();
const { fetchElectricityPrice } = require("./utils/electricityPriceApi.js");
const { controlSchedule } = require("./utils/scheduleRunner.js");
const cron = require("node-cron");
const { getWeather } = require("./utils/weatherForecastApi.js");
const { createHeatingSchedule } = require("./utils/scheduleGenerator.js");
const runtimeData = require("./utils/runtimeData");
const { getDummyTemp } = require("./utils/deviceCommands.js");
const db = require("./database/database.js");

const app = express();

// cors options
// origin: "*" = allow all origins ! change to specific origin when deploying !
const corsOptions = {
  origin: "*",
  methods: "GET",
  optionsSuccessStatus: 200,
};

// use cors with options, use router from router.js in router folder
app.use(cors(corsOptions));
app.use("/", router);

// Initialization function which is run when server is started, and is run
// when recovering from a crash.
const initializeServer = async () => {
  await getElectricityPrices();

  // Get weather info from api
  await getWeatherInfo();

  //setup schedule for boiler
  await generateSchedule(runtimeData.todaysElectricityPrices);
  if (runtimeData.tomorrowsElectricityPrices.length > 1) {
    await generateSchedule(runtimeData.tomorrowsElectricityPrices);
  }

  await controlSchedule(runtimeData.scheduleForToday);
};

// populate runtimeData with weather info
const getWeatherInfo = async () => {
  try {
    const weatherData = await getWeather();

    // SAVE WEATHER TEMPERATURE TO DATABASE
    const time = weatherData.time;
    db.insertWeatherForecast(time, weatherData.temperature);

    // FOR TESTING DATA FROM DATABASE
    // const weather = await db.readAllWeatherForecast();
    // weather.forEach((item) => {
    //   console.log("data from db:" + item.forecast_hour + " " + item.temperature_outside);
    // });

    runtimeData.weatherInfo = weatherData;
    console.log("Uudet säätiedot:", weatherData); //testing
  } catch (error) {
    console.error("Virhe säätiedot haettaessa:", error);
  }
};

// cron timer to update weather temperature every hour
cron.schedule("0 * * * *", async () => {
  console.log("Update weather info every hour:");
  
  await getWeatherInfo();
});

// populate runtimeData with electricity prices
const getElectricityPrices = async () => {
  try {
    const prices = await fetchElectricityPrice();

    // SAVE PRICES TO DATABASE
    prices[0].forEach((item) => {
      const hour = item.hour.toString();
      db.insertElectricityPrice(hour, item.price);
    });

    // FOR TESTING DATA FROM DATABASE
    // const test = await db.readAllElectricityPrices();
    // test.forEach((item) => {
    //   console.log("data from db:" + item.hour + " " + item.price);
    // });

    runtimeData.todaysElectricityPrices = prices[0];

    runtimeData.tomorrowsElectricityPrices = prices[1];
  } catch (error) {
    console.error("Error fetching electricity prices", error);
  }
};

// Create heating schedule for today and tomorrow
const generateSchedule = async () => {
  try {
    runtimeData.scheduleForToday = await createHeatingSchedule(
      runtimeData.todaysElectricityPrices
    );

    // SAVE SCHEDULES TO DATABASE
    const schedule = runtimeData.scheduleForToday;
    schedule.forEach((item) => {
      const hour = item.hour.toString();
      db.insertSchedule(hour, item.price, item.status);
    });

    // FOR TESTING DATA FROM DATABASE
    // const test = await db.readFullSchedule();
    // test.forEach((item) => {
    //   console.log("data from db:" + item.hour + " " + item.price + " " + item.status);
    // });

    console.log("scheduleForToday: ", runtimeData.scheduleForToday);

    runtimeData.scheduleForTomorrow = await createHeatingSchedule(
      runtimeData.tomorrowsElectricityPrices
    );
    console.log("scheduleForTomorrow: ", runtimeData.scheduleForTomorrow);
  } catch (error) {
    console.error("Error generating schedules:", error);
  }
};

// cron timer to update electricity prices at 15:00 every day helsinkitime
cron.schedule("0 15 * * *", async () => {
  await getElectricityPrices();
  await generateSchedule();
});

// Cron schedule to shift prices and schedules to next day at 00:00.
cron.schedule(
  "0 0 * * *",
  async () => {
    runtimeData.scheduleForToday = runtimeData.scheduleForTomorrow;
    runtimeData.todaysElectricityPrices =
      runtimeData.tomorrowsElectricityPrices;
    runtimeData.scheduleForTomorrow = [];
    runtimeData.tomorrowsElectricityPrices = [];
    await controlSchedule(runtimeData.scheduleForToday); // sets the schedule for today
    console.log("Schedule and prices shifted to next day");
  },
  {
    scheduled: true,
    timezone: "Europe/Helsinki",
  }
);

initializeServer(); // RUNS FIRST

// get the port from the environment variable or use 3000 if undefined
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running cors enabled on port ${PORT}`);
});
