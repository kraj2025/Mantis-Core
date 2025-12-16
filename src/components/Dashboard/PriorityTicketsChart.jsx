import React, { useEffect, useState } from "react";
import { headers } from "../../utils/apitools";
import { useTranslation } from "react-i18next";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { useSelector } from "react-redux";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";

const PriorityTicketsChart = () => {
  const { memberID } = useSelector((state) => state?.loadingSlice);
  const [countData, setCountData] = useState([]);

  const handleFirstDashboardCount = () => {
      axiosInstances
          .post(apiUrls.DevDashboard_Summary, {
            Title: String("Priority"),
            DeveloperID: String(memberID || "0"),
          })
        .then((res) => {
          setCountData(res?.data?.dtPriority);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  useEffect(() => {
    handleFirstDashboardCount(memberID);
 }, [memberID]);
 
  useEffect(() => {
    handleFirstDashboardCount();
  }, []);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const { t } = useTranslation();
  const dataArray = countData ? Object.values(countData) : [];
  const sortedResponse = dataArray?.sort((a, b) => a.PriorityID - b.PriorityID);
  // Extract labels (Priority) and data (TotalTicket)
  const labelss = sortedResponse?.map((item) => item?.Priority);
  // const truncatedLabels = labelss?.map((label) => label?.slice(0, 3));
  const truncatedLabels = labelss?.map((label) => label);
  const dataValues = sortedResponse?.map((item) => item?.TotalTicket);
  // console.log("truncatelabels", truncatedLabels);
  const data = {
    labels: truncatedLabels,
    datasets: [
      {
        // label: "Tickets by Priority",
        data: dataValues,
        legend: {
          display: false, // Hide the legend
        },
        borderColor: [
          "yellow",
          "lightgreen",
          "red",
          "skyblue",
          "orange",
          "gray",
        ],
        // borderWidth: 3,
        // hoverOffset: 8,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
        text: "Tickets by Priority",
      },
      legend: {
        display: false, // Display the legend
        labels: {
          font: {
            size: 6, // Set font size to 7px
          },
          color: "black", // Set font color
        },
      },
      datalabels: {
        display: false, // 👈 disables value labels on bars
      },
    },
    responsive: true,
  };
  return (
    <div className="col-sm-12" style={{ width: "100%", height: "113px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default PriorityTicketsChart;
