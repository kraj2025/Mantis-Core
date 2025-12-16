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

const ManagerTicketCategoryAnalysis = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const { memberID, developerSearchType } = useSelector(
    (state) => state?.loadingSlice
  );

  const handleFirstDashboardCount = (developerId, searchType) => {
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append("DeveloperID", developerId);
    // form.append("SearchType", searchType === "" ? "0" : searchType);

    // axios
    //   .post(apiUrls?.ManagerDashboard_Ticket_Category_Analysis, form, { headers })
    axiosInstances
      .post(apiUrls?.ManagerDashboard_Ticket_Category_Analysis, {
        DeveloperID:String(developerId),
        SearchType:String(searchType === "" ? "0" : searchType)
      })
      .then((res) => {
        const response = res?.data?.data;

        if (Array.isArray(response) && response.length > 0) {
          const intervalKeys = ["1-7", ">7-15", ">15-30", ">30"];

          const filteredData = response.filter(
            (item) => item.CategoryName !== "Total"
          );

          const datasets = filteredData.map((category, idx) => ({
            label: category.CategoryName,
            data: intervalKeys.map((key) => category[key]),
            backgroundColor: ["#AEB297", "#F4D0D0", "#E1B562", "#B0C4DE"][
              idx % 4
            ],
            borderColor: "#fff",
            borderWidth: 1,
          }));

          setChartLabels(intervalKeys);
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
    // indexAxis: "y", // 🔴 Remove this line for vertical chart
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
    <div style={{ width: "100%", height: "120px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ManagerTicketCategoryAnalysis;
