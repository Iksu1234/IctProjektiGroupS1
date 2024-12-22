//This class is used to store all the data that the application provides.

class RuntimeData {
  constructor() {
    this._todaysElectricityPrices = [];
    this._tomorrowsElectricityPrices = [];
    this._weatherInfo = [];
    this._scheduleForToday = [];
    this._scheduleForTomorrow = [];
    this._waterTemperature = 69.0;
  }

  // Getters
  get todaysElectricityPrices() {
    return this._todaysElectricityPrices;
  }

  get tomorrowsElectricityPrices() {
    return this._tomorrowsElectricityPrices;
  }

  get weatherInfo() {
    return this._weatherInfo;
  }

  get scheduleForToday() {
    return this._scheduleForToday;
  }

  get scheduleForTomorrow() {
    return this._scheduleForTomorrow;
  }

  get waterTemperature() {
    return this._waterTemperature;
  }

  // Setters
  set todaysElectricityPrices(prices) {
    this._todaysElectricityPrices = prices;
  }

  set tomorrowsElectricityPrices(prices) {
    this._tomorrowsElectricityPrices = prices;
  }

  set weatherInfo(info) {
    this._weatherInfo = info;
  }

  set scheduleForToday(schedule) {
    this._scheduleForToday = schedule;
  }

  set scheduleForTomorrow(schedule) {
    this._scheduleForTomorrow = schedule;
  }

  set waterTemperature(temp) {
    this._waterTemperature = temp;
  }
}

module.exports = new RuntimeData();
