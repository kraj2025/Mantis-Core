import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function Chat2({ state }) {
  console.log("chat2 data",state)
  const { t } = useTranslation();
  // console.log("state state lotus",state)
  // Define color mapping for different status labels
  const colorMap = {
    Total_Resolved: "rgb(177, 244, 180)",
    Planned_Resolved: "rgb(207, 238, 144)",
    Delayed_Resolved: "rgb(240, 142, 238)",
    ReOpen_1: "rgb(173, 216, 230)",
    ReOpen_2: "rgb(236, 166, 200)",
    ReOpen_More: "rgb(249, 144, 144)",
    DeliveryDateChange: "rgb(255, 140, 0)",
    DoneOnUAt: "#9bfaf4",
  };

  // Process API response to extract labels and data
  const labels = state?.map((item) => t(item.StatusNew.replace(/_/g, " ")));
  const dataValues = state.map((item) => item.Ticket);
  const backgroundColors = state.map(
    (item) => colorMap[item.StatusNew] || "gray"
  );

  // Ensure at least one non-zero value for display
  const hasData = dataValues.some((val) => val > 0);
  const adjustedDataValues = hasData
    ? dataValues
    : new Array(dataValues.length).fill(1);
  const adjustedBackgroundColors = hasData
    ? backgroundColors
    : new Array(dataValues.length).fill("lightgray");

  const data = {
    labels,
    datasets: [
      {
        data: adjustedDataValues,
        borderColor: ["white"],
        borderWidth: 1,
        hoverOffset: 8,
        backgroundColor: adjustedBackgroundColors,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false, // Ensure legend is visible
        position: "bottom",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "135px" }}>
      <Doughnut
        data={data}
        options={options}
        style={{ marginBottom: "40px", height: "80px" }}
      />
    </div>
  );
}

export default Chat2;
