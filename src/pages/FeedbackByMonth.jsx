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
import { useSelector } from "react-redux";
const FeedbackByMonth = () => {
  const { t } = useTranslation();
  const { memberID } = useSelector((state) => state?.loadingSlice);
  const [countData, setCountData] = useState([]);

 



  ChartJS.register(CategoryScale, LinearScale, Title, BarElement, Tooltip);

  const data = {
    labels: [t("Dec"), t("Jan"), t("Feb")],

    datasets: [
      {
        // label: "TAT Tickets",
        borderRadius: 10,
        // data: [
        //   countData?.Delayed_15,
        //   countData?.Delayed_15_30,
        //   countData?.Delayed_30,
        // ],
        // data:[30,60,50],
        borderColor: ["pink", "Orange", "skyblue"],
        borderWidth: 2,
        hoverOffset: 8,
        backgroundColor: ["pink", "Orange", "skyblue"],
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
export default FeedbackByMonth;
