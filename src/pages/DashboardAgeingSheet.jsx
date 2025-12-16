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

const DashboardAgeingSheet = () => {
  const { memberID } = useSelector((state) => state?.loadingSlice);
  const { developerSearchType } = useSelector((state) => state?.loadingSlice);

  const [chartRawData, setChartRawData] = useState([]);

  const fetchSalesData = (developerId, searchType) => {
  
    axiosInstances
      .post(apiUrls.CoorDashboard_Ageing_Sheet_Pending_Recovery, {
        CoordinatorID: Number(useCryptoLocalStorage("user_Data", "get", "ID")),
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
          label: "1 Month",
          data: data.map((item) => item.Age_1_Month),
          backgroundColor: "#3399FF",
        },
        {
          label: "2 Month",
          data: data.map((item) => item.Age_2_Month),
          backgroundColor: "#7373bd",
        },
        {
          label: "3 Month",
          data: data.map((item) => item.Age_3_Month),
          backgroundColor: "#f5b371",
        },
        {
          label: ">3 Month",
          data: data.map((item) => item.More_Than_3_Month),
          backgroundColor: "#bf71bf",
        },
        // {
        //   label: "Total",
        //   data: data.map((item) => item.Total),
        //   backgroundColor: "#FF66CC",
        // },
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
            size: 7,
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
          // label: (context) => `${context.dataset.label}: ${context.raw}M`,
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        title: {
          display: false,
          text: "Priority",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: false,
          text: "1Month, 2Month, 3Month, >3Month and Total",
        },
        // ticks: {
        //   callback: (value) => `${value}L`,
        // },
        ticks: {
          callback: (value) => {
            return Number.isInteger(value) ? `${value}` : null;
            // return Number.isInteger(value) ? `${value}L` : null;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "127px", marginLeft: "20px" }}>
      <Bar
        data={chartData}
        options={options}
        // style={{
        //   height: "120px",
        //   width: "100%",
        // }}
      />
    </div>
  );
};

export default DashboardAgeingSheet;
