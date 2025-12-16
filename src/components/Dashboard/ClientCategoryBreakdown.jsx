import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import ChartDataLabels from "chartjs-plugin-datalabels"; // ✅ Add this

// ✅ Register Chart.js components + plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const ClientCategoryBreakdown = ({ state = [] }) => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (!state || state.length === 0) return;

    // ✅ Define month order (Apr to Feb cycle)
    const monthOrder = [
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
    ];

    // ✅ Prepare labels & values
    const labels = monthOrder.map((month) => t(month));
    const dataValues = monthOrder.map((month) => {
      const found = state.find((item) => item.MonthName?.startsWith(month));
      return found ? Number(found.FeedbackRate) : 0;
    });

    // ✅ Update chart data
    setChartData({
      labels,
      datasets: [
        {
          label: t("Rating"),
          data: dataValues,
          backgroundColor: "rgba(2, 146, 242, 0.2)",
          borderColor: "rgba(165, 212, 244, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(165, 212, 244, 1)",
          fill: true,
          tension: 0.3,
        },
      ],
    });
  }, [state, t]);

  return (
    <div style={{ minHeight: "310px" }}>
      {chartData.datasets.length > 0 ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
              datalabels: {
                color: "#000",
                anchor: "end",
                align: "top",
                font: { weight: "bold", size: 10 },
                formatter: (value) => value.toFixed(1),
              },
            },
            
            scales: {
              x: {
                ticks: {
                  autoSkip: false,
                  maxRotation: 90,
                  minRotation: 45,
                  font: { size: 10 },
                },
              },
              y: {
                beginAtZero: true,
                suggestedMin: 1,
                suggestedMax: 5,
                ticks: {
                  stepSize: 1, // ✅ increments by 1
                  callback: function (value) {
                    return Number.isInteger(value) ? value : null; // ✅ show only integers
                  },
                },
              },
            },
          }}
        />
      ) : (
        <p>{t("No data available")}</p>
      )}
    </div>
  );
};

export default ClientCategoryBreakdown;
