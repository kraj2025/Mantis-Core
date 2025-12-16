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
import ReactSelect from "../components/formComponent/ReactSelect";
import DatePickerMonth from "../components/formComponent/DatePickerMonth";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { toast } from "react-toastify";
import { axiosInstances } from "../networkServices/axiosInstance";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PointwiseResolutionDayWise = () => {
  const [chartData, setChartData] = useState(null);
  const [reporter, setReporter] = useState([]);

  const [formData, setFormData] = useState({
    Month: new Date(),
    Year: "",
    Reporter: Number(useCryptoLocalStorage("user_Data", "get", "ID"))
        ? Number(useCryptoLocalStorage("user_Data", "get", "ID"))
        : "",
        SearchType:"1"
  });

  const handleDeliveryChange = (name, e) => {
    setFormData({
      ...formData,
      [name]: e.value,
    });
  };

  const getReporter = () => {
    axiosInstances
        .post(apiUrls.Reporter_Select, {
          ID: useCryptoLocalStorage("user_Data", "get", "ID"),
          IsMaster: "1",
          RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
        })
      .then((res) => {
        const reporters = res?.data?.data?.map((item) => ({
          label: item?.NAME,
          value: item?.ID,
        }));
        setReporter(reporters);
      })
      .catch(console.error);
  };

  useEffect(() => {
    getReporter();
  }, []);

  const handleMonthYearChange = (name, e) => {
    const date = new Date(e.target.value);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    setFormData({
      ...formData,
      [name]: e.target.value,
    });

    handleDetail({ month, year });
  };

  const handleDetail = ({ month, year }) => {
    const form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    form.append(
      "LoginName",
      useCryptoLocalStorage("user_Data", "get", "realname")
    );
    form.append("DeveloperID", formData?.Reporter);
    form.append("Type", "3");
    form.append("Week", formData?.SearchType);
    form.append("Month", month);
    form.append("Year", year);

    axios
      .post(apiUrls.WeaklyMonthlyDeveloperFreeManMinute, form, { headers })
      .then((res) => {
        if (res.data.status === true) {
          const apiData = res?.data?.data || [];
          const labels = apiData.map((item) =>
            item?.Day ? item.Day.slice(0, 3) : ""
          );
          const tickets = apiData.map((item) => Number(item?.TotalCount || 0));
          const manminutes = apiData.map((item) =>
            Number(item?.TotalDManMinute || 0)
          );

          setChartData({
            labels,
            datasets: [
              {
                label: "Tickets",
                data: tickets,
                borderColor: "rgba(220, 136, 241, 0.9)",
                backgroundColor: "rgba(220, 136, 241, 0.9)",
                tension: 0.4,
              },
              {
                label: "ManMinutes",
                data: manminutes,
                borderColor: "#37b2dbe6",
                backgroundColor: "#37b2dbe6",
                tension: 0.4,
              },
            ],
          });
        } else {
          toast.error(
            "Please Select User, WeekType and Month/Year to view data."
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    handleDetail({ month, year });
  }, []);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
        datalabels: {
        display: false, // 👈 disables value labels on bars
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            const label = tooltipItems[0]?.label;
            if (!label) return "";
            return `${label} Week`;
          },
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
          },
        },
      },
    },

    scales: {
      x: { title: { display: false } },
      y: {
        beginAtZero: true,
        title: { display: false },
      },
    },
  };

  return (
    <div>
      <div className="d-flex ml-2">
        <ReactSelect
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          name="Reporter"
          placeholderName="User"
          dynamicOptions={reporter}
          value={formData?.Reporter}
          handleChange={handleDeliveryChange}
        />
        <ReactSelect
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          name="SearchType"
          placeholderName="Week"
          dynamicOptions={[
            { label: "1st Week", value: "1" },
            { label: "2nd Week", value: "2" },
            { label: "3rd Week", value: "3" },
            { label: "4th Week", value: "4" },
            { label: "5th Week", value: "5" },
          ]}
          value={formData?.SearchType}
          handleChange={handleDeliveryChange}
        />
        <DatePickerMonth
          className="custom-calendar p-button-icon-onlycss"
          id="Month"
          name="Month"
          lable="Month/Year"
          placeholder="MM/YY"
             value={formData?.Month}
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          handleChange={(e) => handleMonthYearChange("Month", e)}
        />
      </div>

      <div style={{ width: "100%", height: "120px", marginLeft: "25px" }}>
        {chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <p className="text-center mt-4">
            Please Select User, WeekType and Month/Year <br></br> to view data
          </p>
        )}
      </div>
    </div>
  );
};

export default PointwiseResolutionDayWise;
