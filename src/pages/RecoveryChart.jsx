import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RecoveryChart = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const { memberID, developerSearchType } = useSelector(
    (state) => state?.loadingSlice
  );

  const handleFirstDashboardCount = (developerId, searchType) => {
   
    axiosInstances
      .post(apiUrls.CoorDashboard_Received_Recovery, {
        CoordinatorID: Number(useCryptoLocalStorage("user_Data", "get", "ID")),
        DeveloperID: Number(developerId),
        SearchType: Number(searchType == "" ? "0" : searchType),
      })
      .then((res) => {
        const response = res?.data?.data;
        if (Array.isArray(response) && response.length > 0) {
          // Sort by month if necessary
          const sortedData = response.sort(
            (a, b) =>
              new Date(`01-${a.RecoveryMonth}`) -
              new Date(`01-${b.RecoveryMonth}`)
          );

          const labels = sortedData.map((item) => item.RecoveryMonth);
          const amounts = sortedData.map((item) => item.RecoveryAmount);

          setChartLabels(labels);
          setChartData(amounts);
        }
      })
      .catch((err) => {
        console.error("API error:", err);
      });
  };

  useEffect(() => {
    handleFirstDashboardCount(memberID, developerSearchType);
  }, [memberID, developerSearchType]);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        borderRadius: 0,
        data: chartData,
        borderColor: ["#AEB297", "#F4D0D0", "#E1B562"],
        backgroundColor: ["#AEB297", "#F4D0D0", "#E1B562"],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: false, // 👈 disables value labels on bars
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "120px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default RecoveryChart;
