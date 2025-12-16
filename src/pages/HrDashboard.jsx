import React, { useEffect, useState } from "react";
import AttendanceDashboard from "../components/Dashboard/AttendanceDashboard";
import { useTranslation } from "react-i18next";
import ClientDashboard from "../components/Dashboard/ClientDashboard";
import EmployeeDashboard from "../components/Dashboard/EmployeeDashboard";
import DatePickerMonth from "../components/formComponent/DatePickerMonth";
import ReactSelect from "../components/formComponent/ReactSelect";
import { apiUrls } from "../networkServices/apiEndpoints";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import AttendanceHoursDashboard from "../components/Dashboard/AttendanceHoursDashboard";
import { axiosInstances } from "../networkServices/axiosInstance";
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

const HrDashboard = () => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [hourData, setHourData] = useState([]);
  const [formData, setFormData] = useState({
    Month: new Date(),
    Year: "",
    currentMonth: currentMonth,
    currentYear: currentYear,
    WeekDays: "1",
    WeekHour: "1",
  });
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
    const newMonth = date.getMonth();
    const newYear = date.getFullYear();

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);

    // Functional update to ensure state is fresh
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      // Call API with the latest week value from `next`
      handleBreakDetail({
        month: newMonth + 1,
        year: newYear,
        week: next.WeekDays, // ensure up-to-date WeekDays value
      });

      return next;
    });
  };

  const handleMonthYearChangeHour = (name, e) => {
    const { value } = e.target;
    const date = new Date(value);
    const newMonth = date.getMonth();
    const newYear = date.getFullYear();

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);

    // Functional update to ensure state is fresh
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      // Call API with the latest week value from `next`
      handleHourDetail({
        month: newMonth + 1,
        year: newYear,
        week: next.WeekHour, // ensure up-to-date WeekDays value
      });

      return next;
    });
  };
  const handleBreakDetail = ({ month, year, week }) => {
    // const form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append(
    //   "LoginName",
    //   useCryptoLocalStorage("user_Data", "get", "realname")
    // );
    // form.append(
    //   "CrmEmpID",
    //   useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
    // );
    // form.append("Type", "1");
    // form.append("Month", month);
    // form.append("Year", year);
    // form.append("Week", week); // now always defined ✅

    // axios
    //   .post(apiUrls.WeaklyMonthlyBreakCount, form, { headers })
    axiosInstances
      .post(apiUrls?.WeaklyMonthlyBreakCount, {
        CrmEmpID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        Type: Number(1),
        Year: Number(year),
        Month: Number(month),
        Week: Number(week),
      })
      .then((res) => setTableData(res.data.data))
      .catch(console.error);
  };

  const handleHourDetail = ({ month, year, week }) => {
    // const form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append(
    //   "LoginName",
    //   useCryptoLocalStorage("user_Data", "get", "realname")
    // );
    // form.append(
    //   "CrmEmpID",
    //   useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
    // );
    // form.append("Type", "1");
    // form.append("Month", month);
    // form.append("Year", year);
    // form.append("Week", week); // now always defined ✅

    // axios
    //   .post(apiUrls.WeaklyMonthlyBreakHours, form, { headers })
    axiosInstances
      .post(apiUrls?.WeaklyMonthlyBreakHours, {
        CrmEmpID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        Type: Number(1),
        Year: Number(year),
        Month: Number(month),
        Week: Number(week),
      })
      .then((res) => setHourData(res.data.data))
      .catch(console.error);
  };
  //   const handleHourDetail = (details) => {
  //     let form = new FormData();
  //     form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
  //       form.append(
  //         "LoginName",
  //         useCryptoLocalStorage("user_Data", "get", "realname")
  //       ),
  //       form.append(
  //         "CrmEmpID",
  //         useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
  //       ),
  //       form.append("Type", "1"),
  //       form.append("Month", details ? details?.month : currentMonth),
  //       form.append("Year", details ? details?.year : currentYear),
  //       form.append("Week", formData?.WeekHour),
  //       axios
  //         .post(apiUrls?.WeaklyMonthlyBreakHours, form, { headers })
  //         .then((res) => {
  //           setHourData(res?.data?.data);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //   };
  //   const handleDeliveryChangeHour = (name, e) => {
  //     const { value } = e;
  //     handleHourDetail({
  //       month: selectedMonth + 1,
  //       year: selectedYear,
  //     });
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //   };

  const handleDeliveryChangeHour = (name, option) => {
    const { value } = option; // option = { label, value }

    // Functional update gives you the latest prev state
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      // Fire the request with the *new* week value
      handleHourDetail({
        month: selectedMonth + 1,
        year: selectedYear,
        week: value, //  <-- send it explicitly
      });

      return next; // commit state change
    });
  };
  //   const handleDeliveryChange = (name, e) => {
  //     const { value } = e;
  //     handleBreakDetail({
  //       month: selectedMonth + 1,
  //       year: selectedYear,
  //     });
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //   };

  const handleDeliveryChange = (name, option) => {
    const { value } = option; // option = { label, value }

    // Functional update gives you the latest prev state
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      // Fire the request with the *new* week value
      handleBreakDetail({
        month: selectedMonth + 1,
        year: selectedYear,
        week: value, //  <-- send it explicitly
      });

      return next; // commit state change
    });
  };

  return (
    <>
      <div className="">
        <div className="row">
          <div className="col-md-3 col-sm-6 mt-2">
            <div className="mainDashboardwrp">
              <div
                className="mainBox1 p-3"
                style={{ width: "100%", height: "165px" }}
              >
                <div className="d-flex flex-wrap mainHeader">
                  {/* <label style={{ fontWeight: "bold", margin: "0px" }}>
                    {t("Attendance")}
                  </label> */}

                  <ReactSelect
                    id="WeekDays"
                    respclass="col-5"
                    placeholderName="Select"
                    name="WeekDays"
                    value={formData?.WeekDays}
                    dynamicOptions={[
                      { label: "1st Week", value: "1" },
                      { label: "2nd Week", value: "2" },
                      { label: "3rd Week", value: "3" },
                      { label: "4th Week", value: "4" },
                      { label: "5th Week", value: "5" },
                    ]}
                    handleChange={handleDeliveryChange}
                  />
                  <DatePickerMonth
                    className="custom-calendar p-button-icon-onlycss"
                    id="Month"
                    name="Month"
                    lable="Month/Year"
                    placeholder={"MM/YY"}
                    respclass="col-xl-5 col-md-4 col-sm-6 col-12"
                    value={formData?.Month}
                    handleChange={(e) => handleMonthYearChange("Month", e)}
                  />

                  <div className="chart-container " style={{ width: "100%" }}>
                    <AttendanceDashboard data={tableData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mt-2">
            <div className="mainDashboardwrp">
              <div
                className="mainBox1 p-3"
                style={{ width: "100%", height: "165px" }}
              >
                <div className="d-flex flex-wrap mainHeader">
                  {/* <label style={{ fontWeight: "bold", margin: "0px" }}>
                    {t("Attendance")}
                  </label> */}

                  <ReactSelect
                    id="WeekHour"
                    respclass="col-5"
                    placeholderName="Select"
                    name="WeekHour"
                    value={formData?.WeekHour}
                    dynamicOptions={[
                      { label: "1st Week", value: "1" },
                      { label: "2nd Week", value: "2" },
                      { label: "3rd Week", value: "3" },
                      { label: "4th Week", value: "4" },
                      { label: "5th Week", value: "5" },
                    ]}
                    handleChange={handleDeliveryChangeHour}
                  />
                  <DatePickerMonth
                    className="custom-calendar p-button-icon-onlycss"
                    id="Month"
                    name="Month"
                    lable="Month/Year"
                    placeholder={"MM/YY"}
                    respclass="col-xl-5 col-md-4 col-sm-6 col-12"
                    value={formData?.Month}
                    handleChange={(e) => handleMonthYearChangeHour("Month", e)}
                  />
                  <div className="chart-container " style={{ width: "100%" }}>
                    <AttendanceHoursDashboard data={hourData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 mt-2">
            <div className="mainDashboardwrp">
              <div
                className="mainBox1"
                style={{ width: "100%", height: "153px" }}
              >
                <div className="d-flex flex-wrap mainHeader">
                  <label className="ml-2 mt-1 d-none">{t("Client")}</label>
                  <ClientDashboard />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 mt-2">
            <div className="mainDashboardwrp">
              <div
                className="mainBox1"
                style={{ width: "100%", height: "153px" }}
              >
                <div className="d-flex flex-wrap mainHeader">
                  <label className="ml-2 mt-1 d-none">{t("Employee")}</label>
                  <EmployeeDashboard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default HrDashboard;
