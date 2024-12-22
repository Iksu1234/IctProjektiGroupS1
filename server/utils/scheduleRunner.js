const cron = require("node-cron");
const NodeCache = require("node-cache");
const runtimeData = require("./runtimeData");
const { turnHeatingOn, isTemperatureBelowThreshold, fetchBoilerTemp } = require("./deviceCommands");

const dataCache = new NodeCache({ stdTTL: 0 });

const controlSchedule = async () => {
  dataCache.del("scheduleData");
  dataCache.set("scheduleData", runtimeData.scheduleForToday);
  console.log("Schedule set");

  // Gets the electricity price data every hour and updates the cache with the new data
  updateStatus();
  cron.schedule(
    "0 * * * *",
    () => {
      updateStatus();
    },
    {
      scheduled: true,
      timezone: "Europe/Helsinki",
    }
  );
};

//cron every hour to update status


// cron timer to update water temperature every 15 minutes
cron.schedule("*/15 * * * * ", async () => {


  let tempBelowLimit = isTemperatureBelowThreshold();

  if (tempBelowLimit) {
    turnHeatingOn(true);

    // ADD ENTRY TO DATABASE THAT HEATING WAS TURNED ON (TIME)

    console.log("Water temperature is below limit, turning heating on. Water temperature: " + runtimeData.waterTemperature);
  }
  console.log("Dummy water temperature of water boiler: " + runtimeData.waterTemperature);
});

// Updates the status of the device based on current hour.
const updateStatus = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const formatedDate = now.toLocaleDateString("fi-FI");
  const formattedTime = `${formatedDate} ${String(currentHour).padStart(
    2,
    "0"
  )}:00`;

  const cacheData = dataCache.get("scheduleData");

  const currentData = cacheData.find(
    (data) => new Date(data.hour).getUTCHours() === currentHour
  );

  if (currentData) {

    let tempIsEnough = isTemperatureBelowThreshold();

    // If device status is on, turn heating on, if device status is off and temperature is 
    // below limit, turn heating on, else turn heating off
    if (currentData.status === "on") {
      turnHeatingOn(true);
      console.log(`${formattedTime} - Laitteen tila = ${currentData.status}`);
    } else if (currentData.status === "off" && !tempIsEnough) {
      turnHeatingOn(true);
      console.log(`${formattedTime} - Laitteen tila = ${currentData.status}`);
    } else {
      turnHeatingOn(false);
      console.log(`${formattedTime} - Laitteen tila OFF`);
    }
  } else {
    console.log("No data found");
  }
};

module.exports = { controlSchedule };
