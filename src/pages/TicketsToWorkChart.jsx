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

const TicketsToWorkChart = () => {
  const { memberID } = useSelector((state) => state?.loadingSlice);
  const { developerSearchType } = useSelector((state) => state?.loadingSlice);

  const [chartRawData, setChartRawData] = useState([]);

  const fetchSalesData = (developerId, searchType) => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append("DeveloperID", developerId);
    // form.append("SearchType", searchType == "" ? "0" : searchType);

    // axios
    //   .post(apiUrls?.CoorDashboard_Ticket_Close_Assign, form, {
    //     headers,
    //   })
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
          label: "Project",
          data: data.map((item) => item.TotalProject),
          backgroundColor: "#3399FF",
        },

        {
          label: "YetToAssign",
          data: data.map((item) => item.ToBeAssigned),
          backgroundColor: "#b4d5fa",
        },
        {
          label: "YetToClose",
          data: data.map((item) => item.ToBeClosed),
          backgroundColor: "#f77777",
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
          text: "Project, YetToAssign,YetToClose",
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

export default TicketsToWorkChart;
