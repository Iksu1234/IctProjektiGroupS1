const express = require("express");
const router = express.Router();
const runtimeController = require("../controllers/runtimeController");

//GET electricityPriceToday from runtimeData
router.get("/rtd/priceToday", runtimeController.getPriceToday);

// GET electricityPriceTomorrow from runtimeData
router.get("/rtd/priceTomorrow", runtimeController.getPriceTomorrow);

// GET weatherInfo from runtimeData
router.get("/rtd/weatherInfo", runtimeController.getWeatherinfo);

// GET scheduleForToday from runtimeData
router.get("/rtd/scheduleToday", runtimeController.getScheduleToday);

// GET scheduleForTomorrow from runtimeData
router.get("/rtd/scheduleTomorrow", runtimeController.getScheduleTomorrow);

// GET waterTemperature from runtimeData
router.get("/rtd/waterTemp", runtimeController.getWaterTemp);

module.exports = router;
