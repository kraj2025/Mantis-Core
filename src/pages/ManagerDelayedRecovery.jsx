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

ChartJS.register(CategoryScale, LinearScale, Title, BarElement, Tooltip);

const ManagerDelayedRecovery = () => {
  const { t } = useTranslation();
  const { memberID, developerSearchType } = useSelector(
    (state) => state?.loadingSlice
  );
  const [chartData, setChartData] = useState([]);

  const handleFetchSalesData = () => {
    axiosInstances
      .post(apiUrls?.ManagerDashboard_Delay_Recovery, {
        DeveloperID: String(useCryptoLocalStorage("user_Data", "get", "ID")),
        SearchType: "",
      })

      .then((res) => {
        setChartData(res?.data?.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleFetchSalesData();
  }, []);

  const data = {
    labels: chartData.map((item) => item.DelayCategory),
    datasets: [
      {
        label: t("Recovery Amount"),
        borderRadius: 0,
        data: chartData.map((item) => item.Recovery),
        backgroundColor: "#fc8de3",
        borderColor: "#fc8de3",
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
        display: false,
      },
      datalabels: {
        display: false, // 👈 disables value labels on bars
      },
    },
    scales: {
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

export default ManagerDelayedRecovery;
