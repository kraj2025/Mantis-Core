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

const AttendanceHoursDashboard = ({ data = [] }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data?.length) return;

    /* ---------- X‑axis ---------- */
    const labels = data?.map(({ Day }) => Day.slice(0, 3)); // "Mon", "Tue", …

    /* ---------- Y‑axis ---------- */
    const breakMinutes = data?.map(({ BreakDuration }) => {
      const [h, m, s] = BreakDuration?.split(":").map(Number);
      return h * 60 + m + s / 60; // total minutes (float)
    });

    /* ---------- Style points ≥ 1 h ---------- */
    const pointColors = breakMinutes.map((min) => (min >= 60 ? "red" : "pink"));

    setChartData({
      labels,
      datasets: [
        {
          label: "Break Duration (min)",
          data: breakMinutes,
          borderColor: "pink",
          backgroundColor: "rgba(255,192,203,.3)",
          pointBackgroundColor: pointColors,
          pointBorderColor: pointColors,
          tension: 0.3,
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
      tooltip: {
        callbacks: {
          /* Show HH:MM:SS in tooltip */
          label: ({ raw }) => {
            const totalSeconds = Math.round(raw * 60);
            const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
            const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
              2,
              "0"
            );
            const ss = String(totalSeconds % 60).padStart(2, "0");
            return `Break Duration: ${hh}:${mm}:${ss}`;
          },
        },
      },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          /* 75 → "1h 15m" */
          callback: (val) => `${Math.floor(val / 60)}h ${val % 60}m`,
        },
        title: {
          display: false,
          text: "Break (min)",
        },
      },
    },
  };

  if (!chartData) return <div>No Data Found..</div>;

  return (
    <div style={{ width: "100%", height: "auto" }}>
      <Line data={chartData} options={options} style={{ paddingBottom: 20 }} />
    </div>
  );
};

export default AttendanceHoursDashboard;
