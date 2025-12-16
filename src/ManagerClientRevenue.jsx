import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useCryptoLocalStorage } from "./utils/hooks/useCryptoLocalStorage";
import { apiUrls } from "./networkServices/apiEndpoints";
import { headers } from "./utils/apitools";
import { axiosInstances } from "./networkServices/axiosInstance";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function ManagerClientRevenue({ selectedDate, memberID }) {
  const { t } = useTranslation();
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const datefrom = moment(selectedDate).format("YYYY-MM-DD");
  
    axiosInstances
      .post(apiUrls?.ManagerDashboard_Top_Client_Amount, {
        DeveloperID: String(useCryptoLocalStorage("user_Data", "get", "ID")),
        SearchType: "",
      })
      .then((res) => {
        setRevenueData(res?.data?.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Use a predefined or generated color palette
  const generateColors = (length) => {
    const palette = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#C9CBCF",
      "#8DD17E",
      "#D65DB1",
      "#FF6F91",
    ];
    return Array.from({ length }, (_, i) => palette[i % palette.length]);
  };

  const labels = revenueData.map((item) => item.ProjectName);
  const dataValues = revenueData.map((item) => item.total_amount);
  const hasData = dataValues.some((val) => val > 0);
  const adjustedDataValues = hasData
    ? dataValues
    : new Array(dataValues.length).fill(1);
  const backgroundColors = hasData
    ? generateColors(dataValues.length)
    : new Array(dataValues.length).fill("lightgray");

  const data = {
    labels,
    datasets: [
      {
        data: adjustedDataValues,
        borderColor: ["white"],
        borderWidth: 1,
        hoverOffset: 8,
        backgroundColor: backgroundColors,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false, // <-- disables legend labels
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        display: false, // 👈 disables value labels on bars
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "150px" }}>
      <Doughnut
        data={data}
        options={options}
        style={{ marginBottom: "40px" }}
      />
    </div>
  );
}

export default ManagerClientRevenue;
