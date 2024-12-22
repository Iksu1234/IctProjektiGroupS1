import { useEffect, useState, useMemo } from "react";
import {
  getScheduleToday,
  getHourPriceToday,
  getScheduleTomorrow,
  getHourPriceTomorrow,
  getWeatherInfo,
  getWaterTemp,
} from "../services/dataService";

// ErrorReports component that fetches data from the API and displays the fetch status of each data type
const ErrorReports = () => {
  // State for the fetch status of each data type fetched from the API
  const [fetchStatus, setFetchStatusState] = useState({
    scheduleToday: null,
    hourPriceToday: null,
    scheduleTomorrow: null,
    hourPriceTomorrow: null,
    weatherInfo: null,
    waterTemp: null,
  });

  // Configurations for fetching data from the API and validating the data type after fetching
  const fetchConfigs = useMemo(
    // useMemo is used to memorize the fetchConfigs array to prevent unnecessary re-renders
    () => [
      {
        key: "Aikataulu tänään",
        fetcher: getScheduleToday,
        validator: Array.isArray,
      },
      {
        key: "Sähköhinnat tänään",
        fetcher: getHourPriceToday,
        validator: Array.isArray,
      },
      {
        key: "Aikataulu huomenna",
        fetcher: getScheduleTomorrow,
        validator: Array.isArray,
      },
      {
        key: "Sähköhinnat huomenna",
        fetcher: getHourPriceTomorrow,
        validator: Array.isArray,
      },
      {
        key: "Säätiedot",
        fetcher: getWeatherInfo,
        validator: (data) => data !== null && data !== "", // Validates that the data is not null or an empty string
      },
      {
        key: "Kattilan lämpötila",
        fetcher: getWaterTemp,
        validator: (data) => data !== null && data !== "", // Validates that the data is not null or an empty string
      },
    ],
    []
  );

  // Fetches data from the API and updates the fetch status state
  useEffect(() => {
    const fetchData = async () => {
      const statusUpdates = {};
      const results = await Promise.allSettled(
        fetchConfigs.map(({ fetcher }) => fetcher()) // Maps the fetcher functions from the fetchConfigs array and fetches the data from the API
      );
      // Updates the fetch status state based on the fetched data and the validation results from the fetchConfigs array
      results.forEach((result, index) => {
        const { key, validator } = fetchConfigs[index];
        if (result.status === "fulfilled") {
          statusUpdates[key] = validator(result.value);
        } else {
          statusUpdates[key] = false;
        }
      });
      setFetchStatusState(statusUpdates);
    };
    fetchData();
  }, [fetchConfigs]); // Executes the fetch when the fetchConfigs array changes

  return (
    <div>
      <ul>
        {fetchConfigs.map(({ key }) => (
          <li key={key}>
            {key}:{" "}
            <span
              style={{
                color:
                  fetchStatus[key] === true
                    ? "green"
                    : fetchStatus[key] === false
                    ? "red"
                    : "gray",
              }}
            >
              {fetchStatus[key] === true
                ? "Success"
                : fetchStatus[key] === false
                ? "Failed"
                : "Loading..."}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorReports;
