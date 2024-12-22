const Database = require("better-sqlite3");
const testData = require("./testdata");
const db = new Database("boiler_status.db");
const data = require("./testdata");

// create tables
db.prepare(
  "CREATE TABLE IF NOT EXISTS boiler_status (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE NOT NULL DEFAULT (CURRENT_TIMESTAMP), boiler_temperature REAL, boiler_state TEXT)"
).run();

db.prepare(
  "CREATE TABLE IF NOT EXISTS electricity_prices (id INTEGER PRIMARY KEY AUTOINCREMENT, hour DATE, price REAL)"
).run();

db.prepare(
  "CREATE TABLE IF NOT EXISTS schedule (id INTEGER PRIMARY KEY AUTOINCREMENT, hour TEXT, price REAL, status TEXT)"
).run();

db.prepare(
  "CREATE TABLE IF NOT EXISTS weather_forecast (id INTEGER PRIMARY KEY AUTOINCREMENT, forecast_hour TEXT, temperature_outside REAL, date DATE NOT NULL DEFAULT (CURRENT_TIMESTAMP))"
).run();

db.prepare(
  "CREATE TABLE IF NOT EXISTS temperature_limit_error (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE NOT NULL DEFAULT (CURRENT_TIMESTAMP), error_type TEXT)"
).run();


// crud operations


/**
 * Checks the boiler temperature and logs an error if it is out of bounds.
 *
 * @param {number} boiler_temperature - The current temperature of the boiler.
 * @returns {void} This function does not return a value.
 */
function checkTemperatureLimits(boiler_temperature) {
  if (boiler_temperature <= 72) {
    db.prepare('INSERT INTO temperature_limit_error(error_type) VALUES (?)').run('tempLimitLow');
  } else if (boiler_temperature > 98) {
    db.prepare('INSERT INTO temperature_limit_error(error_type) VALUES (?)').run('tempLimitHigh');
  }
}


// insert data
/**
 * Inserts a new boiler state record into the boiler_status table.
 *
 * @param {number} boiler_temperature - The temperature of the boiler.
 * @param {string} boiler_state - The current state of the boiler (e.g., "on", "off").
 * @returns {void} This function does not return a value.
 */
function insertBoilerState(boiler_temperature, boiler_state) {
  db.prepare('INSERT INTO boiler_status(boiler_temperature, boiler_state) VALUES (?, ?)').run(boiler_temperature, boiler_state);
}


/**
 * Inserts a new electricity price record into the electricity_prices table.
 *
 * @param {string} hour - The specific datetime hour as string for which the electricity price is recorded.
 * @param {number} price - The price of electricity for the specified hour.
 * @returns {void} This function does not return a value.
 */
function insertElectricityPrice(hour, price) {
  db.prepare('INSERT INTO electricity_prices(hour, price) VALUES (?, ?)').run(hour, price);
}


/**
 * Inserts a new schedule record into the schedule table.
 *
 * @param {string} hour - The specific datetime hour as string for which the schedule is recorded.
 * @param {number} price - The price associated with the schedule for the specified hour.
 * @param {string} status - The status of the schedule (e.g., "active", "inactive").
 * @returns {void} This function does not return a value.
 */
function insertSchedule(hour, price, status) {
  db.prepare('INSERT INTO schedule(hour, price, status) VALUES (?, ?, ?)').run(hour, price, status);
}


/**
 * Inserts a new weather forecast record into the weather_forecast table.
 *
 * @param {number} temperature_outside - The forecasted temperature outside.
 * @param {string} forecast_hour - The specific datetime hour as a string for which the weather forecast is recorded.
 * @returns {void} This function does not return a value.
 */
function insertWeatherForecast(forecast_hour, temperature_outside) {
  db.prepare('INSERT INTO weather_forecast(forecast_hour, temperature_outside) VALUES (?, ?)').run(forecast_hour, temperature_outside);
}


// read data

/**
 * Retrieves schedule records from the schedule table for a specific hour.
 *
 * @param {Date} date - The specific hour for which the schedule records are retrieved.
 * @returns {Array} An array of schedule records matching the specified hour.
 */
function readSchedule(date) {
  return db.prepare("SELECT * FROM schedule WHERE hour = ?").all(date);
}

/**
 * Retrieves all records from the schedule table.
 *
 * @returns {void} This function does not return a value.
 */
function readFullSchedule() {
  return db.prepare("SELECT * FROM schedule").all();
}

/**
 * Retrieves all records from the electricity_prices table.
 *
 * @returns {void} This function does not return a value.
 */
function readAllElectricityPrices() {
  return db.prepare("SELECT * FROM electricity_prices").all();
}

/**
 * Retrieves all records from the weather_forecast table.
 *
 * @returns {void} This function does not return a value.
 */
function readAllWeatherForecast() {
  return db.prepare("SELECT * FROM weather_forecast").all();
}


// delete data

/**
 * Deletes all records from the schedule table.
 *
 * @returns {void} This function does not return a value.
 */
function deleteSchedule() {
  db.prepare("DELETE FROM schedule").run();
}


/**
 * Deletes all records from the electricity_prices table.
 *
 * @returns {void} This function does not return a value.
 */
function deleteElectricityPrices() {
  db.prepare("DELETE FROM electricity_prices").run();
}


/**
 * Deletes all records from the weather_forecast table.
 *
 * @returns {void} This function does not return a value.
 */
function deleteWeatherForecast() {
  db.prepare("DELETE FROM weather_forecast").run();
}


/**
 * Deletes all records from the boiler_status table.
 *
 * @returns {void} This function does not return a value.
 */
function deleteBoilerStatus() {
  db.prepare("DELETE FROM boiler_status").run();
}

module.exports = db;
module.exports = {
  // ... existing exports
  checkTemperatureLimits,
  insertBoilerState,
  insertElectricityPrice,
  insertSchedule,
  insertWeatherForecast,
  readSchedule,
  readFullSchedule,
  readAllElectricityPrices,
  readAllWeatherForecast
}