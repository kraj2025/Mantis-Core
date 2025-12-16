
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

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FeedbackByQuarterChart = () => {
  const { memberID, developerSearchType } = useSelector((state) => state?.loadingSlice);
  const [chartRawData, setChartRawData] = useState([]);

  const fetchSalesData = (developerId, searchType) => {
      axiosInstances
      .post(apiUrls.CoorDashboard_Ticket_Close_Assign, {
        // CoordinatorID: Number(useCryptoLocalStorage("user_Data", "get", "ID")),
        DeveloperID: Number(developerId),
        SearchType: Number(searchType == "" ? "0" : searchType),
      })
      .then((res) => {
        setChartRawData(res?.data?.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchSalesData(memberID, developerSearchType);
  }, [memberID, developerSearchType]);

  const transformData = (data) => {
    const labels = data.map((item) => item.Priority);

    return {
      labels,
      datasets: [
        {
          label: "Quarter",
          data: data.map((item) => item.TotalProject),
          backgroundColor: "#3399FF",
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
          font: { size: 7 },
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
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: false,
          text: "Quarterly",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: false,
          text: "Projects",
        },
        ticks: {
          callback: (value) => (Number.isInteger(value) ? `${value}` : null),
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "127px", marginLeft: "0px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default FeedbackByQuarterChart;
