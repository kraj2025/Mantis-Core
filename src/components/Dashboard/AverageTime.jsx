import React, { useEffect, useState } from "react";
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
import { Line } from "react-chartjs-2";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { useSelector } from "react-redux";
import { axiosInstances } from "../../networkServices/axiosInstance";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AverageTime = () => {
  const [countData, setCountData] = useState([]);
  const [chartData, setChartData] = useState(null);

  const { memberID } = useSelector((state) => state?.loadingSlice);

  const fetchDashboardData = async () => {
    try {
    
      const response = await axiosInstances.post(
        apiUrls.DevDashboard_Welcome_AvgTime_Category,
        {
          DeveloperID: String(memberID || "0"),
        }
      );
      setCountData(response?.data?.dtPriority || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const processChartData = () => {
      const fullToShortMonth = {
        January: "Jan",
        February: "Feb",
        March: "Mar",
        April: "Apr",
        May: "May",
        June: "Jun",
        July: "Jul",
        August: "Aug",
        September: "Sep",
        October: "Oct",
        November: "Nov",
        December: "Dec",
      };

      const months = [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
      ];

      const ticketTotals = months.map(() => 0);
      const manhourTotals = months.map(() => 0);

      countData.forEach((item) => {
        const monthShort = fullToShortMonth[item.dtResolved];
        const monthIndex = months.indexOf(monthShort);
        if (monthIndex !== -1) {
          ticketTotals[monthIndex] += item.TotalTicket;
          manhourTotals[monthIndex] += item.ManHour;
        }
      });

      const datasets = [
        {
          label: "Total Tickets",
          data: ticketTotals,
          borderColor: "#36A2EB",
          backgroundColor: "#36A2EB",
          fill: false,
          tension: 0.3,
          yAxisID: "yTotalTicket",
        },
        {
          label: "Man Hours",
          data: manhourTotals,
          borderColor: "#FF6384",
          backgroundColor: "#FF6384",
          fill: false,
          tension: 0.3,
          borderDash: [5, 5],
          yAxisID: "yManHour",
        },
      ];

      setChartData({
        labels: months,
        datasets,
      });
    };

    if (countData.length) {
      processChartData();
    }
  }, [countData]);

  useEffect(() => {
    fetchDashboardData();
  }, [memberID]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: { size: 8 },
          color: "black",
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      datalabels: {
        display: false, // 👈 disables value labels on bars
      },
      title: {
        display: false,
      },
    },
    scales: {
      yTotalTicket: {
        type: "linear",
        position: "left",
        title: {
          display: false,
          text: "Total Tickets",
        },
      },
      yManHour: {
        type: "linear",
        position: "right",
        title: {
          display: false,
          text: "Man Hours",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: "100%", height: "130px", marginLeft: "10px" }}>
      <Line
        data={chartData}
        options={options}
        style={{ paddingBottom: "25px" }}
      />
    </div>
  );
};

export default AverageTime;
