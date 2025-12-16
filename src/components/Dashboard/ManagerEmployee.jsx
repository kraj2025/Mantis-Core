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
import { apiUrls } from "../../networkServices/apiEndpoints";
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
);

const ManagerEmployee = () => {
  const { memberID } = useSelector((state) => state?.loadingSlice);
  const [countData, setCountData] = useState([]);
  const handleFirstDashboardCount = () => {
    axiosInstances
      .post(apiUrls.DevDashboard_Welcome_Category, {
        developerID: String(memberID || "0"),
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

  const processData = (countData) => {
    const groupedData = {};

    // Group data by dtResolved and Category
    countData?.forEach(({ dtResolved, Category, TotalTicket }) => {
      if (!groupedData[dtResolved]) {
        groupedData[dtResolved] = {};
      }
      if (!groupedData[dtResolved][Category]) {
        groupedData[dtResolved][Category] = 0;
      }
      groupedData[dtResolved][Category] += TotalTicket;
    });

    return groupedData;
  };

  // Assign unique colors for each category
  const assignColors = (categories) => {
    const colorPalette = [
      "#e3a5da",
      "#c2dfff",
      "#d7fbe6",
      "#ffa500",
      "#c694e9",
      "teal",
      "#e3a5da",
      "#dcd695",
      "#b59681",
      "#e3a5da",
      "#c2dfff",
      "#d7fbe6",
      "#ffa500",
      "#c694e9",
      "teal",
      "#e3a5da",
      "#dcd695",
      "#b59681",
    ];
    const categoryColors = {};
    categories?.forEach((category, index) => {
      categoryColors[category] = colorPalette[index % colorPalette.length];
    });
    return categoryColors;
  };

  const buildChartData = (groupedData) => {
    const categories = Array.from(
      new Set(countData?.map((item) => item?.Category))
    ); // Unique categories
    const labels = Object.keys(groupedData); // Months
    const categoryColors = assignColors(categories); // Assign colors to categories

    const datasets = categories?.map((category) => {
      return {
        label: category,
        data: labels?.map((month) => groupedData[month][category] || 0),
        backgroundColor: categoryColors[category], // Assign unique colors
        stack: "default",
      };
    });

    return {
      labels,
      datasets,
    };
  };

  const groupedData = processData(countData);
  const chartData = buildChartData(groupedData);

  const options = {
    plugins: {
      title: {
        display: false,
        text: "Manager/Employee",
      },
      datalabels: {
        display: false, // 👈 disables value labels on bars
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
      <div style={{ width: "100%", height: "120px", marginLeft: "20px" }}>
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

export default ManagerEmployee;
