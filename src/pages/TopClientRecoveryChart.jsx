import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  BarElement,
  Tooltip,
} from "chart.js";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { useSelector } from "react-redux";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

const TopClientRecoveryChart = () => {
  const { t } = useTranslation();
  const { memberID, developerSearchType } = useSelector(
    (state) => state?.loadingSlice
  );
  const [chartData, setChartData] = useState([]);

  const handleFetchSalesData = (developerId, searchType) => {
      axiosInstances
          .post(apiUrls.CoorDashboard_Top_Client_Amount, {
            // CoordinatorID: Number(useCryptoLocalStorage("user_Data", "get", "ID")),
            DeveloperID: Number(developerId),
            SearchType: Number(searchType == "" ? "0" : searchType),
          })
      .then((res) => {
        setChartData(res?.data?.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleFetchSalesData(memberID, developerSearchType);
  }, [memberID, developerSearchType]);

  ChartJS.register(CategoryScale, LinearScale, Title, BarElement, Tooltip);

  const data = {
    labels: chartData.map(() => ""), // Blank labels
    datasets: [
      {
        label: t("Project With Amount"),
        borderRadius: 0,
        data: chartData.map((item) => item.total_amount),
        backgroundColor: "#fa98bf",
        borderColor: "#fa98bf",
        borderWidth: 1,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: true,
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
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const projectName = chartData[index]?.ProjectName || "";
            const amount = context.raw;
            return [`Project: ${projectName}`, `Amount: ${amount}`];
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: false, // Hide X-axis labels
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
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

export default TopClientRecoveryChart;
