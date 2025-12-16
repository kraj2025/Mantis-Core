import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { useSelector } from "react-redux";
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

const FinancialOverviewChart = () => {
  const { memberID, developerSearchType } = useSelector(
    (state) => state?.loadingSlice
  );
  const [chartRawData, setChartRawData] = useState([]);
  const [xAxisKeys, setXAxisKeys] = useState(["financial_year_start", "today"]);

  const fetchSalesData = (developerId, searchType) => {
    axiosInstances
      .post(apiUrls.CoorDashboard_Financial_Recovery_Quotation, {
        CoordinatorID: Number(useCryptoLocalStorage("user_Data", "get", "ID")),
        DeveloperID: Number(developerId),
        SearchType: Number(searchType == "" ? "0" : searchType),
      })
      .then((res) => {
        const data = res?.data?.data || [];
        setChartRawData(data);

        // Dynamically get the x-axis label key (fallback to default if needed)
        if (data.length > 0) {
          const keys = Object.keys(data[0]);
          const fyKey = keys.find((key) =>
            key.toLowerCase().includes("financial_year")
          );
          const todayKey = keys.find((key) =>
            key.toLowerCase().includes("today")
          );
          if (fyKey && todayKey) {
            setXAxisKeys([fyKey, todayKey]);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchSalesData(memberID, developerSearchType);
  }, [memberID, developerSearchType]);

  //   const transformData = (data, key) => {
  //     const labels = data.map((item) => item[key]);

  //     return {
  //       labels,
  //       datasets: [
  //         {
  //           label: "Total Quotation",
  //           data: data.map((item) => item.total_quotation || 0),
  //           backgroundColor: "#dcabf5",
  //         },
  //         {
  //           label: "Total Amount",
  //           data: data.map((item) => item.total_amount || 0),
  //           backgroundColor: "#bcf7de",
  //         },
  //       ],
  //     };
  //   };

  const transformData = (data, key1, key2) => {
    const labels = data.map((item) => `${item[key1]} - ${item[key2] || ""}`);

    return {
      labels,
      datasets: [
        {
          label: "Total Quotation",
          data: data.map((item) => item.total_quotation || 0),
          backgroundColor: "#dcabf5",
        },
        {
          label: "Total Amount",
          data: data.map((item) => item.total_amount || 0),
          backgroundColor: "#bcf7de",
        },
      ],
    };
  };

  const chartData = transformData(chartRawData, xAxisKeys[0], xAxisKeys[1]);

  const options = {
    plugins: {
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
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        title: {
          display: false,
          text: xAxisKeys
            .map((key) =>
              key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
            )
            .join(" - "),
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: false,
          text: "Amount / Quotation",
        },
        ticks: {
          callback: (value) => {
            return Number.isInteger(value) ? `${value}` : null;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "127px", marginLeft: "10px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};
export default FinancialOverviewChart;
