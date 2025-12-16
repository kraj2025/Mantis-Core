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

const CoordinatoeTotalPending = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const { memberID, developerSearchType } = useSelector(
    (state) => state?.loadingSlice
  );

  const handleFirstDashboardCount = (developerId, searchType) => {
       axiosInstances
      .post(apiUrls.CoorDashboard_Total_Pending, {
        CoordinatorID: Number(useCryptoLocalStorage("user_Data", "get", "ID")),
        DeveloperID: Number(developerId),
        SearchType: Number(searchType == "" ? "0" : searchType),
      })
      .then((res) => {
        const response = res?.data?.data;

        if (Array.isArray(response) && response.length > 0) {
            const labels = response.map((item) => {
              const [month, year] = item.Month_Year.split("-");
              const shortMonth = new Date(`${month} 1, ${year}`).toLocaleString("default", {
                month: "short",
              });
              return `${shortMonth}-${year.slice(-2)}`;
            });
          
            const totalData = response.map((item) => item.Total);
            const receivedData = response.map((item) => item.Received);
            const balanceData = response.map((item) => item.BalanceAmount);
          
            const datasets = [
              {
                label: "Total",
                data: totalData,
                backgroundColor: "#7f8bf5",
                borderColor: "#fff",
                borderWidth: 1,
              },
              {
                label: "Received",
                data: receivedData,
                backgroundColor: "#9bed95",
                borderColor: "#fff",
                borderWidth: 1,
              },
              {
                label: "Balance",
                data: balanceData,
                backgroundColor: "#fc7ea6",
                borderColor: "#fff",
                borderWidth: 1,
              },
            ];
          
            setChartLabels(labels);
            setChartData(datasets);
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
    datasets: chartData,
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        position: "top",
        labels: {
          font: {
            size: 8,
          },
          color: "black",
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      datalabels: {
        display: false, // 👈 disables value labels on bars
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "130px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CoordinatoeTotalPending;
