const runtimeData = require("./runtimeData");

//Auth_key and URI from Shelly Cloud
const auth = process.env.SHELLY_AUTH;
//Shelly käyttäjän host:n määrittää Shelly Cloud. Tieto hostista tarvitaan URIa varten, ja se voi muuttua.

const serverUri = process.env.SHELLY_SERVER_URI;
const deviceId = process.env.SHELLY_DEVICE_ID;

// Changing this value will change the temperature treshold for turning heating on
const treshold = 72;

// Returns the boiler temperatures from the sensors
const fetchBoilerTemp = async () => {
  const url = `${serverUri}/device/status`;
  const body = `id=${deviceId}&auth_key=${auth}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }

    const data = await response.json();

    // Depends on the installed temperature sensors and what device you are using
    const temperature101 = data.data.device_status["temperature:101"];
    const temperature102 = data.data.device_status["temperature:102"];
    const temperature100 = data.data.device_status["temperature:100"];

    // Return the temperature that is needed, this is just a placeholder
    return temperature101;

    // Add return when you know which temperature is needed and the right one.
  } catch (error) {
    console.error("Error fetching boiler temperature: ");
    throw error;
  }
};

// Control dimmer to either 0 (heating off) or 100 (heating on)
// Boolean true/false --> brightness 100/0
// Device status is "on" and channel is 0, make sure channel is correct
// Comment out the fetch when testing without devices
const turnHeatingOn = async (bool) => {
  const status = "on";
  const brightness = bool ? 100 : 0;

  // const url = `${serverUri}/device/light/control`;
  // const body = `channel=0&turn=${status}&brightness=${brightness}id=${deviceId}&auth_key=${auth}`;

  // try {
  //   const response = await fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: body,
  //   });
  //   if (!response.ok) {
  //     throw new Error("HTTP error " + response.status);
  //   }

  //   const data = await response.json();
  //   console.log(data);
  //   console.log("Heating turned on");
  //   return data;
  // } catch (error) {
  //   console.error("Error turning heating on: ", error);
  //   throw error;
  // }
};


// *******************TESTING WITHOUT DEVICES*******************
// Gives a random temperature between 69 and 100
function getDummyTemp() {
  let temp = randomInt(69, 100);
  return temp;
}

// Min included, max excluded - for testing purposes
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
// *******************END TESTING WITHOUT DEVICES*******************


// This can call turnHeatingOn function if boiler temperature is below treshold
function isTemperatureBelowThreshold() {
  // Checks temperature
  runtimeData.waterTemperature = getDummyTemp(); // When testing without devices, call getDummyTemp() instead of fetchBoilerTemp()
  if (runtimeData.waterTemperature <= treshold) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  fetchBoilerTemp,
  isTemperatureBelowThreshold,
  turnHeatingOn,
};
