import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  BarElement,
  Tooltip,
} from "chart.js";
import { useTranslation } from "react-i18next";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../utils/apitools";
import axios from "axios";
import { useSelector } from "react-redux";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";
const TATBarChart = () => {
  const { t } = useTranslation();
  const { memberID } = useSelector((state) => state?.loadingSlice);
  const [countData, setCountData] = useState([]);
  const handleFirstDashboardCount = () => {
    axiosInstances
      .post(apiUrls.DevDashboard_Summary, {
        Title: String("Delayed"),
        DeveloperID: String(memberID || "0"),
      })
      .then((res) => {
        setCountData(res?.data?.dtDelayed[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    handleFirstDashboardCount();
  }, []);
  useEffect(() => {
    handleFirstDashboardCount(memberID);
  }, [memberID]);
  ChartJS.register(CategoryScale, LinearScale, Title, BarElement, Tooltip);

  const data = {
    labels: [t("15 Days"), t("30 Days"), t("45 Days")],

    datasets: [
      {
        // label: "TAT Tickets",
        borderRadius: 10,
        data: [
          countData?.Delayed_15,
          countData?.Delayed_15_30,
          countData?.Delayed_30,
        ],
        // data:[30,60,50],
        borderColor: ["#ecdb23", "#f6961e", "#FF4500"],
        borderWidth: 2,
        hoverOffset: 8,
        backgroundColor: ["#ecdb23", "#f6961e", "#FF4500"],
      },
    ],
  };

  return (
    <div style={{ width: "100%", height: "115px" }}>
      <Bar
        data={data}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            title: {
              display: false,
              text: "Tat Tickets",
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
          },
        }}
      />
    </div>
  );
};
export default TATBarChart;
