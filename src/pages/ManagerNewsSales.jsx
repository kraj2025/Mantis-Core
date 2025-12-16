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

const ManagerNewsSales = () => {
  const { t } = useTranslation();
  const { memberID, developerSearchType } = useSelector(
    (state) => state?.loadingSlice
  );
  const [chartData, setChartData] = useState([]);

  const handleFetchSalesData = (developerId, searchType) => {
    axiosInstances
      .post(apiUrls?.ManagerDashboard_New_Sales, {
        DeveloperID: String(developerId),
        SearchType: String(searchType == "" ? "0" : searchType),
      })
      .then((res) => {
        setChartData(res?.data?.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   handleFetchSalesData();
  // }, []);
  useEffect(() => {
      handleFetchSalesData(memberID, developerSearchType);
    }, [memberID, developerSearchType]);

  ChartJS.register(CategoryScale, LinearScale, Title, BarElement, Tooltip);
console.log("chartData11",chartData)
  const data = {
    labels: chartData.map((item) => item.SalesAmount),
    datasets: [
      {
        label: t("Total Sales"),
        borderRadius: 0,
        data: chartData.map((item) => item.SalesAmount),
        backgroundColor: "#86c3d9",
        borderColor: "#86c3d9",
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

export default ManagerNewsSales;
