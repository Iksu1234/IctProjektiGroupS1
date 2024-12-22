import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTint,
  faTemperatureThreeQuarters,
} from "@fortawesome/free-solid-svg-icons";
import { getWeatherInfo, getWaterTemp } from "../services/dataService";

const Navbar = () => {
  const [temperature, setTemperature] = useState(null);
  const [waterTemp, setWaterTemp] = useState(null);

  // Fetch the weather data when the component loads
  useEffect(() => {
    const fetchWeatherInfo = async () => {
      try {
        const data = await getWeatherInfo(); // Get the temperature data from dataService.js
        setTemperature(data.temperature);
      } catch (error) {
        console.error("Virhe säätiedon hakemisessa:", error);
      }
    };

    fetchWeatherInfo(); // Execute the fetch when the component loads
  }, []);

  // Fetch the water temperature data when the component loads
  useEffect(() => {
    const fetchWaterTemp = async () => {
      try {
        const data = await getWaterTemp(); // Get the temperature data from dataService.js
        setWaterTemp(data);
      } catch (error) {
        console.error("Virhe säätiedon hakemisessa:", error);
        setWaterTemp("N/A");
      }
    };

    fetchWaterTemp(); // Execute the fetch when the component loads
  }, []);

  return (
    <nav>
      <ul className="navbar">
        <li className="navbar-item">
          <Link to="/">Etusivu</Link>
        </li>
        <li className="navbar-item">
          <Link to="/electricity">Pörssisähkö</Link>
        </li>
        <li className="navbar-item">
          <Link to="/reports">Raportit</Link>
        </li>
        <li className="navbar-weather-temperature">
          <a
            style={{ padding: "0 7px" }}
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Weather data by Open-Meteo.com
          </a>
          <FontAwesomeIcon
            icon={faTemperatureThreeQuarters}
            className="temperature-icon"
          />
          {temperature && <span>{temperature}°C</span>}
        </li>
        <li className="navbar-temperature">
          <FontAwesomeIcon icon={faTint} className="drop-icon" />
          <span>{waterTemp}°C</span>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
