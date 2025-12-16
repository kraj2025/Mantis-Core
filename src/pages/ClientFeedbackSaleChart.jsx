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
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
const currentYear = currentDate.getFullYear();

const ClientFeedbackSaleChart = () => {
  const { memberID } = useSelector((state) => state?.loadingSlice);
  const { developerSearchType } = useSelector((state) => state?.loadingSlice);

  const [chartRawData, setChartRawData] = useState([]);

  const fetchSalesData = () => {
   
    axiosInstances
      .post(apiUrls.ClientFeedbackStatsGraph, {
        Month: currentMonth,
        Year: currentYear,
      })
      .then((res) => {
        setChartRawData(res?.data?.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const transformData = (data) => {
    const labels = data.map((item) => item.MonthName.slice(0, 3));

    return {
      labels,
      datasets: [
        {
          label: "All Feedback",
          data: data.map((item) => item.TotalFeedbackCount),
          backgroundColor: "#85bbf1ff",
        },

        {
          label: "Pending Feedback",
          data: data.map((item) => item.NotReviveFeedbackCount),
          backgroundColor: "#f1ee99ff",
        },
        {
          label: "Received Feedback",
          data: data.map((item) => item.ReviveFeedbackCount),
          backgroundColor: "#66ffabff",
        },
        {
          label: "Negative Comments",
          data: data.map((item) => item.CommentAvailableCount),
          backgroundColor: "#f77777",
        },
      ],
    };
  };

  const chartData = transformData(chartRawData);

  const options = {
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 10,
          },
          color: "black",
          usePointStyle: false,
          pointStyle: "circle",
        },
      },
      datalabels: {
        display: false,
      },
    },
    responsive: true,
  };

  return (
    <div style={{ minHeight: "320px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ClientFeedbackSaleChart;
