import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { useTranslation } from "react-i18next";


// Register chart components globally
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const BarChart = ({ state }) => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!state || state.length === 0) return;

    const labels = state.map((item) => t(item.StatusNew));
    const data = state.map((item) => item.Ticket);

    setChartData({
      labels,
      datasets: [
        {
          label: t("Tickets"),
          data,
          backgroundColor: [
            "rgba(252, 186, 3, 0.6)",
            "rgba(99, 104, 116, 0.6)",
            "rgba(51, 122, 183, 0.6)",
            "rgba(237, 21, 21, 0.6)",
            "rgba(25, 163, 18, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(75, 192, 192, 0.6)",
          ],
          borderColor: [
            "rgba(252, 186, 3, 1)",
            "rgba(99, 104, 116, 1)",
            "rgba(51, 122, 183, 1)",
            "rgba(237, 21, 21, 1)",
            "rgba(25, 163, 18, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    });
  }, [state, t]);

  return (
    <div style={{ width: "90%", height: "100%", paddingBottom: "30px" }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: false },
          },
          scales: {
            y: { beginAtZero: true },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
