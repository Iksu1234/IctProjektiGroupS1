import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTint } from "@fortawesome/free-solid-svg-icons";
import { getWaterTemp } from "../services/dataService";

// WaterTemperature component that acts as a visual display for the water temperature in a boiler.
const WaterTemperature = () => {
  const [temperature, setTemperature] = useState(null);

  // Fetch the water temperature data when the component loads
  useEffect(() => {
    const fetchWaterTemp = async () => {
      try {
        const data = await getWaterTemp(); // Get the temperature data from dataService.js
        setTemperature(data);
      } catch (error) {
        console.error("Virhe säätiedon hakemisessa:", error);
        setTemperature("N/A");
      }
    };

    fetchWaterTemp(); // Execute the fetch when the component loads
  }, []);

  return (
    <div className="box">
      <h4 className="boxHeader">Veden lämpötila kattilassa</h4>
      <div className="boiler-container">
        <div className="boiler">
          <div className="boilerdisplay">{temperature}°C</div>
          <div className="boilerbuttons">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <FontAwesomeIcon icon={faTint} className="boiler-icon" />
        <div className="boiler2"></div>
      </div>
    </div>
  );
};

export default WaterTemperature;
