const createHeatingSchedule = async (electricityPrices_) => {
  // Create a copy of the electricity prices
  let electricityPrices = electricityPrices_.map((element) => ({ ...element }));

  // Access the inner array of price objects
  if (Array.isArray(electricityPrices) && Array.isArray(electricityPrices[0])) {
    electricityPrices = electricityPrices[0];
  }

  // Sort by price
  const sortedHours = electricityPrices.sort(function (a, b) {
    return a.price - b.price;
  });

  let markedHours = [];
  let counter = 0;

  // Mark the first 12 hours as on and the rest as off
  sortedHours.forEach((element) => {
    if (counter < 12) {
      markedHours.push({
        hour: element.hour,
        price: element.price,
        status: "on",
      });
      counter++;
    } else {
      markedHours.push({
        hour: element.hour,
        price: element.price,
        status: "off",
      });
    }
  });

  // Sort the array by hour
  const heatingScedule = markedHours.sort(function (a, b) {
    return a.hour - b.hour;
  });

  markedHours = [];
  counter = 0;
  let lastElementStatus;

  // If the heating is off for more than 3 hours in a row, the next hour will be marked as on.
  // This ensures that the heating will not be off for more than 3 hours in a row.
  heatingScedule.forEach((element) => {
    if (counter === 3) {
      markedHours.push({
        hour: element.hour,
        price: element.price,
        status: "on",
      });
      lastElementStatus = element.status;
      counter = 0;
    } else if (element.status === "on") {
      lastElementStatus = element.status;
      markedHours.push({
        hour: element.hour,
        price: element.price,
        status: "on",
      });
      counter = 0;
    } else if (element.status === "off") {
      lastElementStatus = element.status;
      markedHours.push({
        hour: element.hour,
        price: element.price,
        status: "off",
      });
      counter++;
    }
  });

  return markedHours;
};

module.exports = { createHeatingSchedule };
