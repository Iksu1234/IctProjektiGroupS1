import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Registers chart components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// WatertempChart component that shows a line chart of the water temperature in a boiler.
const WatertempChart = () => {
  const waterTemperatureData = [
    { hour: "00:00", temperature: 120.0 },
    { hour: "01:00", temperature: 118.3 },
    { hour: "02:00", temperature: 118.1 },
    { hour: "03:00", temperature: 118.0 },
    { hour: "04:00", temperature: 117.8 },
    { hour: "05:00", temperature: 117.6 },
    { hour: "06:00", temperature: 117.5 },
    { hour: "07:00", temperature: 117.7 },
    { hour: "08:00", temperature: 116.0 },
    { hour: "09:00", temperature: 115.4 },
    { hour: "10:00", temperature: 110.9 },
    { hour: "11:00", temperature: 110.3 },
    { hour: "12:00", temperature: 105.7 },
    { hour: "13:00", temperature: 90.0 },
    { hour: "14:00", temperature: 90.3 },
    { hour: "15:00", temperature: 90.6 },
    { hour: "16:00", temperature: 80.8 },
    { hour: "17:00", temperature: 81.0 },
    { hour: "18:00", temperature: 80.7 },
    { hour: "19:00", temperature: 80.3 },
    { hour: "20:00", temperature: 80.0 },
    { hour: "21:00", temperature: 79.7 },
    { hour: "22:00", temperature: 76.3 },
    { hour: "23:00", temperature: 75.9 },
  ];

  // Chart data
  const chartData = {
    labels: waterTemperatureData.map((entry) => entry.hour),
    datasets: [
      {
        label: "Water Temperature (°C)",
        data: waterTemperatureData.map((entry) => entry.temperature),
        borderColor: "blue",
        backgroundColor: "rgba(173, 216, 230, 0.5)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Kattilan veden lämpötila (24h)",
        font: {
          size: 24,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tunti",
        },
      },
      y: {
        title: {
          display: true,
          text: "Lämpötila (°C)",
        },
        beginAtZero: false,
      },
    },
  };

  return <Line data={chartData} options={options} />; // Returns the Line chart component with data and options
};

export default WatertempChart;
