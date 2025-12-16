import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
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
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../utils/apitools";
import { useSelector } from "react-redux";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
  // ChartDataLabels
);

const TicketByStatus = () => {
  const { memberID } = useSelector((state) => state?.loadingSlice);
  const [countData, setCountData] = useState([]);

  const handleFirstDashboardCount = () => {
  
    axiosInstances
      .post(apiUrls.DevDashboard_Welcome_PriorityID, {
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

  // Function to transform API response to Chart.js data format
  const transformData = (countData) => {
    const labels = [...new Set(countData?.map((item) => item?.dtResolved))];
    const priorities = [...new Set(countData?.map((item) => item?.Priority))];

    const backgroundColors = {
      Low: "#ecdb23",
      Normal: "#d7fbe6",
      High: "#f5977f",
      Urgent: "#c2dfff",
      Immediate: "#f6961e",
      None: "#a2a8af",
    };

    const datasets = priorities?.map((priority) => ({
      label: priority,
      data: labels?.map(
        (label) =>
          countData.find(
            (item) => item?.dtResolved === label && item?.Priority === priority
          )?.TotalTicket || 0
      ),
      backgroundColor: backgroundColors[priority] || "black",
      stack: "stack1",
    }));

    return { labels, datasets };
  };

  const chartData = transformData(countData);

  // const options = {
  //   plugins: {
  //     title: {
  //       display: false,
  //       text: "Manager/Employee",
  //     },
  //     legend: {
  //       display: true, // Display the legend
  //       labels: {
  //         font: {
  //           size: 6, // Set font size to 7px
  //         },
  //         color: "black", // Set font color
  //       },
  //     },

  //     // datalabels: {
  //     //   display: true, // Enable data labels
  //     //   color: "black", // Set the label color
  //     //   anchor: "center", // Positioning (options: 'start', 'center', 'end')
  //     //   align: "bottom",  // Alignment (options: 'start', 'center', 'end', 'top', 'bottom')
  //     //   // formatter: (value) => value,
  //     //   offset: 4,
  //     // },
  //     // padding: {
  //     //   top: 5, // Add padding at the top of each label
  //     //   bottom: 5, // Add padding at the bottom of each label
  //     // },

  //   },
  //   responsive: true,
  //   scales: {
  //     x: {
  //       stacked: true,
  //     },
  //     y: {
  //       stacked: true,
  //     },
  //   },
  // };

  const options = {
    plugins: {
      title: {
        display: false,
        text: "Manager/Employee",
      },
      legend: {
        display: true, // Display the legend
        labels: {
          font: {
            size: 8, // Adjust font size
          },
          color: "black", // Set font color
          usePointStyle: true, // Use dot instead of rectangle
          pointStyle: "circle", // Set legend symbol to a circle
        },
      },
      datalabels: {
        display: false, // 👈 disables value labels on bars
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <>
      <div style={{ width: "100%", height: "120px", marginLeft: "10px" }}>
        <Bar
          data={chartData}
          options={options}
          style={{
            display: "block",
            boxSizing: "border-box",
            height: "110px",
            width: "100% !important",
          }}
        />
      </div>
    </>
  );
};

export default TicketByStatus;
