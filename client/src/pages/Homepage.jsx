import "../styles/Homepage.css";
import ClockSchedule from "../components/ClockSchedule";
import WaterTemperature from "../components/WaterTemperature";

const Homepage = () => {
  return (
    <div className="homepage">
      <ClockSchedule />
      <WaterTemperature />
    </div>
  );
};

export default Homepage;
