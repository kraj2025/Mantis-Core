import React, { useEffect, useState } from "react";
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
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AttendanceDashboard = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data?.length) return;

    const labels = data?.map((d) => d?.Day?.substring(0, 3)); // x‑axis labels
    const breakCounts = data?.map((d) => d?.BreakCount); // y‑axis values

    setChartData({
      labels,
      datasets: [
        {
          label: "Break Count",
          data: breakCounts,
          borderColor: "skyblue",
          backgroundColor: "skyblue",
          tension: 0.3, // smooth curve
          pointRadius: 4,
        },
      ],
    });
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: { size: 10 },
          color: "black",
          usePointStyle: true,
          pointStyle: "circle",
        },
        datalabels: {
          display: false, // 👈 disables value labels on bars
        },
      },

      title: { display: false },
    },
    scales: {
      y: {
        title: { display: false },
        beginAtZero: true,
        ticks: { precision: 0 }, // show whole numbers
      },
    },
  };

  if (!chartData) return <div>No Data Found..</div>;

  return (
    <div style={{ width: "100%", height: "auto", marginLeft: 0 }}>
      <Line data={chartData} options={options} style={{ paddingBottom: 25 }} />
    </div>
  );
};

export default AttendanceDashboard;
