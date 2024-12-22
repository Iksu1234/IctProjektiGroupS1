import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import "../index.css";
import { getScheduleToday, getScheduleTomorrow } from "../services/dataService";

// ClockSchedule component that shows the heating schedule for today and tomorrow.
const ClockSchedule = () => {
  const [selectedDay, setSelectedDay] = useState("Tänään");
  const [scheduleData, setScheduleData] = useState({
    todaysSchedule: [],
    tomorrowsSchedule: [],
  });

  // Fetches the schedule for today and tomorrow when the component is mounted
  useEffect(() => {
    async function fetchData() {
      const todaysSchedule = await getScheduleToday();
      const tomorrowsSchedule = await getScheduleTomorrow();

      setScheduleData({
        todaysSchedule: todaysSchedule,
        tomorrowsSchedule: tomorrowsSchedule,
      });
    }
    fetchData();
  }, []);

  // Handles the button click event to change the selected day
  const handleButtonClick = (day) => {
    setSelectedDay(day);
  };

  const selectedData =
    selectedDay === "Tänään"
      ? scheduleData.todaysSchedule
      : scheduleData.tomorrowsSchedule;

  // Maps 24 hours with status based on the selected schedule
  const hours = Array.from({ length: 24 }, (_, index) => ({
    hour: index,
    status: selectedData.some(
      (entry, entryIndex) => entryIndex === index && entry.status === "on"
    )
      ? "on"
      : "off",
  }));

  return (
    <div className="box">
      <button
        className={`daySelector ${selectedDay === "Tänään" ? "selected" : ""}`}
        onClick={() => handleButtonClick("Tänään")}
      >
        Tänään
      </button>
      <button
        className={`daySelector ${
          selectedDay === "Huomenna" ? "selected" : ""
        }`}
        onClick={() => handleButtonClick("Huomenna")}
      >
        Huomenna
      </button>
      <div className="schedule-container">
        {hours.map((timeSlot, index) => (
          <div
            key={index}
            className={`clock-hour ${timeSlot.status === "on" ? "active" : ""}`}
            style={{
              transform: `rotate(${index * 15 - 180}deg) translate(0, -190px)`,
            }}
          >
            <span
              className="hour-label"
              style={{
                transform: `rotate(${180 - index * 15}deg)`,
              }}
            >
              {timeSlot.hour === 0
                ? "00:00"
                : timeSlot.hour === 12
                ? "12:00"
                : `${timeSlot.hour}:00`}
            </span>
          </div>
        ))}
        {scheduleData.tomorrowsSchedule.length === 0 &&
        selectedDay === "Huomenna" ? (
          <p> Aikataulua ei vielä saatavilla </p> // Sets the message if the schedule for tomorrow is not available
        ) : (
          <div>
            <FontAwesomeIcon icon={faSun} className="sunIcon" />
            <FontAwesomeIcon icon={faMoon} className="moonIcon" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClockSchedule;
