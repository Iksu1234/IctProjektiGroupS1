const url = "http://localhost:3000";

//GET todays schedule, contains hour in ISO form, price and status
export function getScheduleToday() {
  return fetch(url + "/rtd/scheduleToday").then((data) => data.json());
}

//GET todays schedule and format into Hour and Price
export function getHourPriceToday() {
  return fetch(url + "/rtd/priceToday").then((data) => data.json());
}

//GET tomorrows schedule, contains hour in ISO form, price and status
export function getScheduleTomorrow() {
  return fetch(url + "/rtd/scheduleTomorrow").then((data) => data.json());
}

//GET tomorrows schedule and format into Hour and Price
export function getHourPriceTomorrow() {
  return fetch(url + "/rtd/priceTomorrow").then((data) => data.json());
}

//GET weather info
export function getWeatherInfo() {
  return fetch(url + "/rtd/weatherInfo").then((data) => data.json());
}

//GET water temps
export function getWaterTemp() {
  return fetch(url + "/rtd/waterTemp").then((data) => data.json());
}
