import HeatingChart from "../components/HeatingChart";
import WaterTempChart from "../components/WaterTempChart";
import ErrorReports from "../components/ErrorReports";
import "../styles/Reportpage.css";

// Reportspage component that displays heating, water temperature, and error reports.
const Reportspage = () => {
  return (
    <div className="pages">
      <h2 className="pageHeader">Raportit</h2>
      <p className="headersText">
        Aiempien lämmitysohjauksien, kattilan lämpötilan ja virheilmoitusten
        tarkastelu.
      </p>
      <div className="chartContainer">
        <HeatingChart />
      </div>
      <div className="chartContainer">
        <WaterTempChart />
      </div>
      <div>
        <h4 className="reportHeader">Vikatila raportti</h4>
        <ErrorReports />
      </div>
    </div>
  );
};

export default Reportspage;
