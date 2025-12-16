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
import { apiUrls } from "../../networkServices/apiEndpoints";
import { useSelector } from "react-redux";
import { axiosInstances } from "../../networkServices/axiosInstance";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceChart = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const { memberID } = useSelector((state) => state?.loadingSlice);

  const fetchPerformanceData = async () => {
    try {
    
      const response = await axiosInstances.post(apiUrls.DevDashboard_Summary, {
        Title: String("MonthlyDeveloperPerformance"),
        DeveloperID: String(memberID || "0"),
      });
      const rawData = response?.data?.dtOverAllMonthlyPerformance || [];
      // Filter out null values and sort months correctly
      const validData = rawData.filter(
        (item) => item.Month && item.Values !== null
      );

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
      ];

      const labels = monthOrder.map((month) => t(month));
      const dataValues = monthOrder.map((month) => {
        const monthData = validData.find((item) => item.Month === month);
        return monthData ? monthData.Values : 0;
      });

      setChartData({
        labels,
        datasets: [
          {
            label: t("Monthly Performance"),
            data: dataValues,
            backgroundColor: "rgba(2, 146, 242, 0.5)",
            borderColor: "rgba(2, 146, 242, 1)",
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };
  useEffect(() => {
    fetchPerformanceData(memberID);
  }, [memberID]);
  useEffect(() => {
    fetchPerformanceData();
  }, []);

  return (
    <div className="row">
      <div
        style={{
          width: "100%",
          textAlign: "center",
          height: "130px",
          marginLeft: "10px",
        }}
      >
        {chartData.datasets.length > 0 ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false, text: t("Developer Performance") },
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
                y: { beginAtZero: true },
              },
            }}
          />
        ) : (
          <p>{t("Loading data...")}</p>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;
