import "../styles/Reportpage.css";
import { prices } from "../data/prices";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registers chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// HeatingChart component that shows a line chart of the heating status (ON/OFF).
const HeatingChart = () => {
  // Chart data for the heating status
  const chartData = {
    labels: prices.map((item) => {
      const date = new Date(item.hour);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`; // Formats the time to HH:MM format
    }),
    datasets: [
      {
        label: "Heating Status (ON/OFF)",
        data: prices.map((item) => (item.status === "on" ? 1 : 0)), // 1 for "on", 0 for "off"
        fill: false,
        borderColor: "blue",
        tension: 0.1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return value === 1 ? "ON" : "OFF"; // Displays 'ON' and 'OFF' on the y-axis
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Tunnit",
        },
        ticks: {
          autoSkip: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Lämmityksen aikataulu eilen",
        font: {
          size: 24,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />; // Returns the Line chart component with data and options
};

export default HeatingChart;
