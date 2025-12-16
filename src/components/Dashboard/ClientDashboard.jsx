import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DatePickerMonth from "../formComponent/DatePickerMonth";
import ReactSelect from "../formComponent/ReactSelect";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import axios from "axios";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../utils/apitools";
import { axiosInstances } from "../../networkServices/axiosInstance";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const getDaysInMonth = (year, month) => {
  return new Array(new Date(year, month, 0).getDate())
    .fill(null)
    .map((_, index) => {
      return { date: `${month}/${index + 1}`, status: "" };
    });
};

const getStartDayOfWeek = (year, month) => {
  return new Date(year, month - 1, 1).getDay();
};

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();
const ClientDashboard = () => {
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    Month: new Date(),
    Year: "",
    currentMonth: currentMonth,
    currentYear: currentYear,
    WeekDays: "1",
    WeekHour: "1",
    SearchType: "",
  });

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [daysInMonth, setDaysInMonth] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDayOfWeek, setStartDayOfWeek] = useState(0);

  useEffect(() => {
    const updatedDays = getDaysInMonth(selectedYear, selectedMonth + 1);
    const startDay = getStartDayOfWeek(selectedYear, selectedMonth + 1);
    setDaysInMonth(updatedDays);
    setStartDayOfWeek(startDay);
  }, [selectedMonth, selectedYear]);
  const handleMonthYearChange = (name, e) => {
    const { value } = e.target;
    const date = new Date(value);
    setSelectedMonth(date.getMonth());
    setSelectedYear(date.getFullYear());
    handleDetail({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDetail = ({ month, year }) => {
    axiosInstances
      .post(apiUrls.ClientFeedbackDashboard, {
        MantisID: Number(useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")),
        Year: Number(year),
        Month: Number(month),
        SearchType: Number("3"),
      })
      .then((res) => setTableData(res.data.data))
      .catch(console.error);
  };
  const attendanceData = [
    { date: "Mon", present: 20, absent: 5 },
    { date: "Tue", present: 22, absent: 3 },
    { date: "Wed", present: 19, absent: 6 },
    { date: "Thu", present: 23, absent: 2 },
    { date: "Fri", present: 21, absent: 4 },
    { date: "Sat", present: 29, absent: 2 },
  ];

  const labels = attendanceData?.map((entry) => entry?.date);
  const presentData = attendanceData?.map((entry) => entry?.present);
  const absentData = attendanceData?.map((entry) => entry?.absent);

  const data = {
    labels,
    datasets: [
      {
        label: "Mail Sent",
        data: presentData,
        backgroundColor: "rgba(116, 251, 156, 0.6)", // Green for present
        stack: "stack1", // Enable stacking
      },
      {
        label: "Not Sent",
        data: absentData,
        backgroundColor: "rgba(232, 147, 78, 0.6)", // Red for absent
        stack: "stack1", // Same stack group
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 8, // Increased for better readability
          },
          color: "#333", // Neutral color for better theme compatibility
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true, // Enabled to show chart title
        text: "Client Feedback",
        font: {
          size: 10,
        },
        color: "#333",
      },
    },
    scales: {
      x: {
        stacked: true, // Stack bars on x-axis
      },
      y: {
        stacked: true, // Stack bars on y-axis
        beginAtZero: true, // Start y-axis at 0
        title: {
          display: false,
          text: "Number of Employees",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <>
      <div className="">
        <div className="d-flex flex-wrap mainHeader">
          <ReactSelect
            respclass="col-xl-5 col-md-4 col-sm-6 col-12"
            // respclass="width100px "
            name="SearchType"
            placeholderName="SearchType"
            dynamicOptions={[
              { label: "Select", value: "" },
              { label: "Level-I", value: 1 },
              { label: "Level-II", value: 2 },
              { label: "Level-III", value: 3 },
            ]}
            value={formData?.SearchType}
            handleChange={handleDeliveryChange}
          />
          <DatePickerMonth
            className="custom-calendar p-button-icon-onlycss mt-1"
            id="Month"
            name="Month"
            lable="Month/Year"
            placeholder={"MM/YY"}
            respclass="col-xl-5 col-md-4 col-sm-6 col-12"
            // value={formData?.Month}
            handleChange={(e) => handleMonthYearChange("Month", e)}
          />
        </div>
        <Bar data={data} options={options} />
      </div>
    </>
  );
};

export default ClientDashboard;
