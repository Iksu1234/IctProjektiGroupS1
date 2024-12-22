const convert = require("xml-js");

const fetchElectricityPrice = async () => {
  const dates = getAndFormatDates();

  // console.log("periodStart", dates[0]);
  // console.log("periodEnd", dates[1]);

  const apiKey = process.env.ENTSOE_API_KEY;
  const url = `https://web-api.tp.entsoe.eu/api?documentType=A44&out_Domain=10YFI-1--------U&in_Domain=10YFI-1--------U&periodStart=${dates[0]}&periodEnd=${dates[1]}&securityToken=${apiKey}`;

  const response = await fetch(url);
  const xml = await response.text();

  const jsonFormat = await parseXMLtoJSON(xml);

  console.log(
    "******************************************************************************"
  );

  const formattedPrices = await formatPriceTable(jsonFormat);

  console.log("formattedPrices", formattedPrices);
  return formattedPrices;
  //console.log(xml);
};

// Format the date to fit the API's required format "YYYYMMDDHH00"
// Includes now failsafe for testing purposes - not needed in production!
const getAndFormatDates = () => {
  const todaysDate = new Date();
  const dayAhead = new Date(todaysDate);

  todaysDate.setDate(todaysDate.getDate() - 1);
  dayAhead.setDate(dayAhead.getDate() + 1);

  const formattedDateStr = formatTimeToString(todaysDate);
  const formattedDayAheadStr = formatTimeToString(dayAhead);

  return [formattedDateStr, formattedDayAheadStr];
};

const formatTimeToString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 because getMonth() returns 0-11
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = "00"; // always 00 because api requires 00 minutes

  return `${year}${month}${day}${hours}${minutes}`;
};

const parseXMLtoJSON = async (xml) => {
  // Ensure the xml variable is not empty
  if (!xml) {
    console.error("Received empty XML string");
    return null; // or handle as needed
  }

  const json = convert.xml2js(xml, { compact: true });

  // Extract the TimeSeries data
  const timeSeries = json.Publication_MarketDocument.TimeSeries;

  // Initialize an array for points
  let points = [];

  let extractedDataTables = [];

  // Loop through each TimeSeries object if it is an array
  if (Array.isArray(timeSeries)) {
    timeSeries.forEach((series) => {
      // Check if the series has a Period

      // Extract the period start time
      let periodStart = series["Period"]["timeInterval"].start._text;

      if (series.Period) {
        // Loop through each Point in the Period
        points = series.Period.Point.map((point) => ({
          position: point.position._text,
          price: point["price.amount"]
            ? parseFloat(point["price.amount"]._text)
            : null,
        }));
      }

      // Construct the extracted data object
      let dataObject = {
        periodStart,
        points, // An array of objects containing position and price
      };

      // Push the extracted data object to the extractedDataTables array
      extractedDataTables.push(dataObject);
    });
  }

  if (extractedDataTables.length > 1) {
    //sort data by periodStart from earliest to newest data - today's prices followed by tomorrow's prices
    extractedDataTables.sort(
      (a, b) => new Date(a.periodStart) - new Date(b.periodStart)
    );
  }

  if (!isDaylightSavingTimeHelsinki()) {
    extractedDataTables = shiftPrices(extractedDataTables);
  }

  return extractedDataTables;
};

function isDaylightSavingTimeHelsinki() {
  const currentYear = new Date().getFullYear();

  // January 1st and July 1st of the current year
  const jan = new Date(currentYear, 0, 1); // January 1st
  const jul = new Date(currentYear, 6, 1); // July 1st

  // Get the timezone offsets in minutes for both dates
  const janOffset = jan.getTimezoneOffset();
  const julOffset = jul.getTimezoneOffset();

  // Determine if the current date is in daylight saving time by comparing the offsets
  const isDST =
    janOffset !== julOffset &&
    new Date().getTimezoneOffset() === Math.min(janOffset, julOffset);

  return isDST;
}

function shiftPrices(data) {
  let lastPriceOfPreviousDay = 0;

  // Iterate over each object in the data array
  data.forEach((entry, idx) => {
    const prices = entry.points.map((item) => item.price);
    prices.unshift(lastPriceOfPreviousDay); // Insert the last price of the previous day

    // Remove the last price from the array and store it for the next day
    lastPriceOfPreviousDay = prices.pop();

    // Reassign the updated prices back to the points array
    entry.points = entry.points.map((item, index) => ({
      position: item.position,
      price: prices[index],
    }));
  });
  return data;
}

// Adds missing hours and their prices and uses starting times instead of positions.
const formatPriceTable = async (extractedDataTables) => {
  let thisDaysPrices = [];
  let tomorrowsPrices = [];

  const totalPositions = 24;

  // Create a new object to hold filled price points for each date
  const filledPricePointsByDate = {};

  extractedDataTables.forEach((entry) => {
    const filledPricePoints = [];
    const pointsMap = new Map(
      entry.points.map((point) => [point.position, point.price])
    );

    let lastKnownPrice = 0.0; // Default price if no previous exists
    for (let i = 1; i <= totalPositions; i++) {
      const positionStr = i.toString();
      const price = pointsMap.has(positionStr)
        ? parseFloat(pointsMap.get(positionStr).toFixed(2))
        : lastKnownPrice;

      filledPricePoints.push({
        hour: positionStr,
        price,
      });

      if (pointsMap.has(positionStr)) {
        lastKnownPrice = pointsMap.get(positionStr);
      }
    }
    // Add the filled points to the new structure
    filledPricePointsByDate[entry.periodStart] = filledPricePoints;
  });

  const allPrices = Object.values(filledPricePointsByDate);

  thisDaysPrices = allPrices[1];
  tomorrowsPrices = allPrices[2];

  const modifiedTomorrowsPrices = modifyHourAndPrice(
    thisDaysPrices,
    tomorrowsPrices
  );

  return modifiedTomorrowsPrices;
};

const modifyHourAndPrice = (thisDaysPrices, tomorrowsPrices) => {
  // Modify the hours to be in the format "Date"

  thisDaysPrices.forEach((element) => {
    let date = new Date();
    let hour = 0;

    date.setDate(date.getDate());
    date.setHours(element.hour, hour, 0, 0);
    element.hour = date;
    hour++;

    if (element.price !== null) {
      element.price = (element.price / 10).toFixed(2);
    }
  });

  if (!tomorrowsPrices) {
    return [thisDaysPrices, []];
  }

  tomorrowsPrices.forEach((element) => {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    let hour = 0;

    date.setDate(date.getDate());
    date.setHours(element.hour, hour, 0, 0);
    element.hour = date;
    hour++;

    if (element.price !== null) {
      element.price = (element.price / 10).toFixed(2);
    }
  });

  return [thisDaysPrices, tomorrowsPrices];
};

module.exports = { fetchElectricityPrice };
