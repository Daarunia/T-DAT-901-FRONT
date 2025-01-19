import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const PriceChart = ({ data, timeRange }) => {
  console.log("Chart Data:", data);


  const calculateTimeUnit = (data) => {
    if (data.length === 0) return "hour";

    const startDate = new Date(data[0].date);
    const endDate = new Date(data[data.length - 1].date);
    const durationInHours = (endDate - startDate) / (1000 * 60 * 60); // 

    if (durationInHours > 24) {
      return "day";
    }
    return "hour";
  };

  const timeUnit = calculateTimeUnit(data);


  const dates = data.map((entry) => entry.date);
  const prices = data.map((entry) => entry.price);


  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Crypto Price (USD)",
        data: prices,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
    ],
  };


  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: timeUnit,
          displayFormats: {
            hour: "HH:mm",
            day: "MMM d",
          },
          tooltipFormat: "PPpp",
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
        title: {
          display: true,
          text: "Time",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (USD)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default PriceChart;
