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

const OldSaleChart = () => {
  const { memberID, developerSearchType } = useSelector(
    (state) => state?.loadingSlice
  );
  const [chartRawData, setChartRawData] = useState([]);

  const fetchSalesData = (developerId, searchType) => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append("DeveloperID", developerId);
    // form.append("SearchType", searchType == "" ? "0" : searchType);
    // axios
    //   .post(apiUrls?.CoorDashboard_Open_Dead_Sales, form, { headers })
    axiosInstances
      .post(apiUrls.CoorDashboard_Open_Dead_Sales, {
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
    const labels = data.map((item) => item.MonthYear);

    return {
      labels,
      datasets: [
        {
          label: "Open Amount",
          data: data.map((item) => item.OpenAmount),
          backgroundColor: "#faf084",
        },
        {
          label: "Dead Amount",
          data: data.map((item) => item.DeadAmount),
          backgroundColor: "#d7fbe6",
        },
      ],
    };
  };

  const chartData = transformData(chartRawData);

  const options = {
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: true,
        labels: {
          font: {
            size: 6,
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
    responsive: true,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "126px", marginLeft: "10px" }}>
      <Bar
        data={chartData}
        options={options}
        // style={{
        //   height: "80%",
        //   width: "100%",
        // }}
      />
    </div>
  );
};

export default OldSaleChart;
