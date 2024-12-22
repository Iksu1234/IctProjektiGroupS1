import { useState, useEffect } from "react";
import "../styles/ElectricityTable.css";
import {
  getHourPriceToday,
  getHourPriceTomorrow,
} from "../services/dataService";

// ElectricityTable component that shows the electricity prices for today and tomorrow.
function ElectricityTable() {
  const [prices, setPrices] = useState({ today: [], tomorrow: [] });

  // Array of 24 hours in HH:00 format (00:00 - 23:00)
  const hours = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, "0")}:00`
  );

  // Fetches the electricity prices for today and tomorrow when the component is mounted
  useEffect(() => {
    const ShowPrices = async () => {
      const todayPrices = await getHourPriceToday();
      const tomorrowPrices = await getHourPriceTomorrow();
      setPrices({ today: todayPrices, tomorrow: tomorrowPrices });
    };
    ShowPrices();
  }, []);

  return (
    <div className="tables-container">
      <div className="price-table">
        <h2>Tämän päivän hinnat</h2>
        <table>
          <thead>
            <tr>
              <th>Aika</th>
              <th>Hinta (snt/kWh)</th>
            </tr>
          </thead>
          <tbody>
            {prices.today.map((item, index) => (
              <tr key={index}>
                <td>{hours[index]}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="price-table">
        <h2>Huomisen hinnat</h2>
        {prices.tomorrow.length > 1 ? (
          <table>
            <thead>
              <tr>
                <th>Aika</th>
                <th>Hinta (snt/kWh)</th>
              </tr>
            </thead>
            <tbody>
              {prices.tomorrow.map((item, index) => (
                <tr key={index}>
                  <td>{hours[index]}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>
            Huomisen hinnat eivät ole vielä saatavilla. Ne julkaistaan yleensä
            Suomen aikaa klo 14:00 jälkeen (kun päivänsisäinen markkina on
            sulkeutunut).
          </p>
        )}
      </div>
    </div>
  );
}

export default ElectricityTable;
