import React, { useEffect, useState } from "react";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import Heading from "../components/UI/Heading";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import Input from "../components/formComponent/Input";
import Tables from "../components/UI/customTable";
import DatePickerMonth from "../components/formComponent/DatePickerMonth";
import Loading from "../components/loader/Loading";
import ReactSelect from "../components/formComponent/ReactSelect";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { showWorkingDaysTHEAD } from "../components/modalComponent/Utils/HealperThead";
import { exportToExcel, ExportToExcelColor } from "../networkServices/Tools";
import { axiosInstances } from "../networkServices/axiosInstance";

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
const currentYear = currentDate.getFullYear();

const AttendanceReport = () => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [tableData1, setTableData1] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredData1, setFilteredData1] = useState([]);
  const [team, setTeam] = useState([]);
  const [subteam, setSubTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [formData, setFormData] = useState({
    // EmployeeName: [],
    EmployeeName: [
      Number(useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")),
    ]
      ? [Number(useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID"))]
      : [],

    TeamID: "",
    SubTeamID: "",
    Year: "",
    currentMonth: currentMonth,
    currentYear: currentYear,
    Month: new Date(),
    SearchType: "1",
  });

  const IsEmployee = useCryptoLocalStorage("user_Data", "get", "realname");
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );
  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name == "TeamID") {
      setFormData({
        ...formData,
        [name]: value,
      });
      getSubTeam(e);
    } else if (name == "SearchType") {
      setFormData({
        ...formData,
        [name]: value,
      });
      setTableData([]);
      setTableData1([]);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const getReporter = () => {
    axiosInstances
      .post(apiUrls.EmployeeEmail, {
        CrmEmployeeID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
      })
      .then((res) => {
        const assigntos = res?.data?.data?.map((item) => {
          return { name: item?.EmployeeName, code: item?.Employee_ID };
        });
        setEmployee(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getTeam = () => {
    axiosInstances
      .post(apiUrls.Old_Mantis_Team_Select, {})
      .then((res) => {
        const teams = res?.data.data.map((item) => {
          return { label: item?.Team, value: item?.TeamID };
        });
        setTeam(teams);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSubTeam = (item) => {
    axiosInstances
      .post(apiUrls.Old_Mantis_Sub_Team_Select, {
        TeamName: String(item?.label),
      })
      .then((res) => {
        const teams = res?.data?.data?.map((item) => {
          return { label: item?.SubTeam, value: item?.ID };
        });
        setSubTeam(teams);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMonthYearChange = (name, e) => {
    const { value } = e.target;
    const date = new Date(value);
    setFormData({
      ...formData,
      currentMonth: date.getMonth() + 1,
      currentYear: date.getFullYear(),
    });
  };

  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }

  const CrmEmployeeID = useCryptoLocalStorage(
    "user_Data",
    "get",
    "CrmEmployeeID"
  );

  const handleExport = () => {
    // if (!formData?.TeamID) {
    //   toast.error("Please Select Team");
    //   return;
    // }

    axiosInstances
      .post(apiUrls.Attendence_Report, {
        Month: String(formData?.currentMonth),
        Year: String(formData?.currentYear),
        EmployeeID: String(
          formData?.EmployeeName?.length > 0 ? formData.EmployeeName : ""
        ),
        Team: String(getlabel(formData?.TeamID, team) || ""),
        SubTeam: String(formData?.SubTeamID),
        ReportType: String("Export"),
      })
      .then((res) => {
        const htmlTable = res?.data;

        // Get 3-letter month name
        const monthIndex = parseInt(formData?.currentMonth, 10) - 1;
        const shortMonth = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][monthIndex];

        // const fileName = `AttendenceReport_${formData?.currentMonth}_${shortMonth}_${formData?.currentYear}.xls`;
        const fileName = `AttendenceReport_${shortMonth}_${formData?.currentYear}.xls`;
        const blob = new Blob([htmlTable], {
          type: "application/vnd.ms-excel",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.log("Export error:", err);
        toast.error("Export failed. Try again.");
      });
  };
  const handleExportEmployee = () => {
    axiosInstances
      .post(apiUrls.Attendence_Report, {
        Month: String(formData?.currentMonth),
        Year: String(formData?.currentYear),
        EmployeeID: String(
          Number(useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID"))
        ),
        Team: String(""),
        SubTeam: String(""),
        ReportType: String("Export"),
      })
      .then((res) => {
        const htmlTable = res?.data;

        // Get 3-letter month name
        const monthIndex = parseInt(formData?.currentMonth, 10) - 1;
        const shortMonth = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][monthIndex];

        // const fileName = `AttendenceReport_${formData?.currentMonth}_${shortMonth}_${formData?.currentYear}.xls`;
        const fileName = `AttendenceReport_${shortMonth}_${formData?.currentYear}.xls`;
        const blob = new Blob([htmlTable], {
          type: "application/vnd.ms-excel",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.log("Export error:", err);
        toast.error("Export failed. Try again.");
      });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(filteredData?.length / rowsPerPage);
  const currentData = filteredData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const [currentPage1, setCurrentPage1] = useState(1);
  const rowsPerPage1 = 15;
  const totalPages1 = Math.ceil(filteredData1?.length / rowsPerPage1);
  const currentData1 = filteredData1?.slice(
    (currentPage1 - 1) * rowsPerPage1,
    currentPage1 * rowsPerPage1
  );
  const handlePageChange1 = (newPage1) => {
    if (newPage1 > 0 && newPage1 <= totalPages1) {
      setCurrentPage1(newPage1);
    }
  };

  const [attendanceTHEAD, setAttendanceTHEAD] = useState([]);

  const handleTableSearch = () => {
    // if (!formData?.TeamID) {
    //   toast.error("Please Select Team");
    //   return;
    // }

    setLoading(true);

    const selectedMonth = formData?.currentMonth;
    const selectedYear = formData?.currentYear;

    // 1️⃣ Generate dynamic table headers (Dates for the month)
    const getAttendanceHeader = (month, year) => {
      const daysInMonth = new Date(year, month, 0).getDate();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const headers = [
        "S.No.",
        "Name",
        "Mobile",
        "TeamName",
        "SubTeam",
        "ReportingTo",
        "Type",
      ];

      // for (let day = 1; day <= daysInMonth; day++) {
      //   const formattedDay = day.toString().padStart(2, "0");
      //   headers.push(`${formattedDay}-${monthNames[month - 1]}-${year}`);
      // }

      for (let day = 1; day <= daysInMonth; day++) {
        const formattedDay = day?.toString().padStart(2, "0");
        headers.push(formattedDay);
      }

      headers.push("Total", "CLTaken", "SLTaken", "LWPTaken");
      return headers;
    };

    const dynamicHeader = getAttendanceHeader(selectedMonth, selectedYear);
    setAttendanceTHEAD(dynamicHeader); // 👈 set header

    axiosInstances
      .post(apiUrls.AttendanceReoprtTypeWise, {
        Month: String(selectedMonth),
        Year: String(selectedYear),
        SubTeam: String(formData?.SubTeamID || ""),
        Team: String(getlabel(formData?.TeamID, team) || ""),
        ReportType: String(""),
        EmployeeID: String(
          formData?.EmployeeName?.length > 0 ? formData.EmployeeName : "0"
        ),
        AttendanceType: Number(formData?.SearchType),
      })
      .then((res) => {
        // const leaveData = Array.isArray(res?.data?.dtMontReport)
        //   ? res.data.dtMontReport
        //   : [];
        const leaveData = Array.isArray(res?.data?.data) ? res.data.data : [];
        // console.log("leaveData", leaveData);
        setTableData1(leaveData);
        setFilteredData1(leaveData);
        if (res?.data?.success === true) {
          const apiData = Array.isArray(res?.data?.data) ? res.data.data : [];
          // const apiData = Array.isArray(res?.data?.dtAttReport)
          //   ? res.data.dtAttReport
          //   : [];

          const formattedRows = apiData?.map((row, index) => {
            const {
              Name,
              Mobile,
              TeamName,
              SubTeam,
              ReportingTo,
              Type,
              Total,
              CLTaken,
              SLTaken,
              LWPTaken,
              ...dateData
            } = row;

            return {
              "S.No.": index + 1,
              Name,
              Mobile,
              TeamName,
              SubTeam,
              ReportingTo,
              Type,
              ...dateData,
              Total,
              CLTaken,
              SLTaken,
              LWPTaken,
            };
          });

          setTableData(formattedRows);
          setFilteredData(formattedRows);
          // setCurrentData(formattedRows);
        } else {
          toast.error(res?.data?.message);
          setTableData([]);
          setTableData1([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleTableSearchemployee = () => {
    // if (!formData?.TeamID) {
    //   toast.error("Please Select Team");
    //   return;
    // }

    setLoading(true);

    const selectedMonth = formData?.currentMonth;
    const selectedYear = formData?.currentYear;

    // 1️⃣ Generate dynamic table headers (Dates for the month)
    const getAttendanceHeader = (month, year) => {
      const daysInMonth = new Date(year, month, 0).getDate();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const headers = [
        "S.No.",
        "Name",
        "Mobile",
        "TeamName",
        "SubTeam",
        "ReportingTo",
        "Type",
      ];

      // for (let day = 1; day <= daysInMonth; day++) {
      //   const formattedDay = day.toString().padStart(2, "0");
      //   headers.push(`${formattedDay}-${monthNames[month - 1]}-${year}`);
      // }

      for (let day = 1; day <= daysInMonth; day++) {
        const formattedDay = day?.toString().padStart(2, "0");
        headers.push(formattedDay);
      }

      headers.push("Total", "CLTaken", "SLTaken", "LWPTaken");
      return headers;
    };

    const dynamicHeader = getAttendanceHeader(selectedMonth, selectedYear);
    setAttendanceTHEAD(dynamicHeader); // 👈 set header

    axiosInstances
      .post(apiUrls.AttendanceReoprtTypeWise, {
        Month: String(selectedMonth),
        Year: String(selectedYear),
        SubTeam: String(""),
        Team: String(""),
        ReportType: String(""),
        EmployeeID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        AttendanceType: Number(formData?.SearchType),
      })
      .then((res) => {
        const leaveData = Array.isArray(res?.data?.dtMontReport)
          ? res.data.dtMontReport
          : [];
        // console.log("leaveData", leaveData);
        setTableData1(leaveData);
        setFilteredData1(leaveData);
        if (res?.data?.status === true) {
          const apiData = Array.isArray(res?.data?.dtAttReport)
            ? res.data.dtAttReport
            : [];
          // console.log("ApiData", apiData);

          const formattedRows = apiData?.map((row, index) => {
            const {
              Name,
              Mobile,
              TeamName,
              SubTeam,
              ReportingTo,
              Type,
              Total,
              CLTaken,
              SLTaken,
              LWPTaken,
              ...dateData
            } = row;

            return {
              "S.No.": index + 1,
              Name,
              Mobile,
              TeamName,
              SubTeam,
              ReportingTo,
              Type,
              ...dateData,
              Total,
              CLTaken,
              SLTaken,
              LWPTaken,
            };
          });

          setTableData(formattedRows);
          setFilteredData(formattedRows);
          // setCurrentData(formattedRows);
        } else {
          toast.error(res?.data?.message);
          setTableData([]);
          setTableData1([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getTeam();
    getReporter();
  }, []);

  const exportToExcelReport = () => {
    exportToExcel(tableData, "", "", false, "Attendance Report");
  };
  const exportToExcelReportLeave = () => {
    // exportToExcel(tableData1, "", "", false, "Leave Report");
    ExportToExcelColor(tableData1);
  };
  const exportToExcelReportEmployee = () => {
    // exportToExcel(tableData1, "", "", false, "Leave Report");
    ExportToExcelColor(tableData1);
  };

  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row m-2">
          <DatePickerMonth
            className="custom-calendar"
            id="Month"
            name="Month"
            lable="Month/Year"
            placeholder={"MM/YY"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={formData?.Month}
            handleChange={(e) => handleMonthYearChange("Month", e)}
          />
          {ReportingManager == 1 && (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="TeamID"
              placeholderName="Team"
              dynamicOptions={team}
              handleChange={handleDeliveryChange}
              value={formData?.TeamID}
            />
          )}
          {ReportingManager == 1 && (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="SubTeamID"
              placeholderName="Sub Team"
              dynamicOptions={subteam}
              handleChange={handleDeliveryChange}
              value={formData?.SubTeamID}
            />
          )}
          {ReportingManager == 1 ? (
            <MultiSelectComp
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="EmployeeName"
              placeholderName="Employee"
              dynamicOptions={employee}
              optionLabel="EmployeeName"
              className="form-control"
              handleChange={handleMultiSelectChange}
              value={formData.EmployeeName?.map((code) => ({
                code,
                name: employee.find((item) => item.code === code)?.name,
              }))}
            />
          ) : (
            <Input
              type="text"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              className="form-control"
              placeholder=" "
              lable="Employee"
              id="EmployeeName"
              name="EmployeeName"
              value={IsEmployee}
              disabled={true}
            />
          )}
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="SearchType"
            placeholderName="SearchType"
            dynamicOptions={[
              { label: "Attendance Report", value: "1" },
              { label: "Leave Report", value: "2" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData?.SearchType}
          />

          <div className="col-2 d-flex">
            {ReportingManager == 1 ? (
              <div>
                {loading ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-sm btn-info ml-2"
                    onClick={handleTableSearch}
                  >
                    Search
                  </button>
                )}
              </div>
            ) : (
              <div>
                {loading ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-sm btn-info ml-2"
                    onClick={handleTableSearchemployee}
                  >
                    Search
                  </button>
                )}
              </div>
            )}

            {tableData?.length > 0 ? (
              loading ? (
                <Loading />
              ) : (
                <div>
                  {ReportingManager == 1 ? (
                    <>
                      {formData?.EmployeeName?.length === 1 ? (
                        <button
                          className="btn btn-sm btn-info ml-2"
                          onClick={handleExport}
                        >
                          Attendance Export
                        </button>
                      ) : (
                        <button
                          onClick={exportToExcelReport}
                          className="btn btn-sm btn-primary ml-2"
                        >
                          All Attendance Export
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      className="btn btn-sm btn-info ml-2"
                      onClick={handleExportEmployee}
                    >
                      Attendance Export
                    </button>
                  )}
                </div>
              )
            ) : (
              loading && <Loading />
            )}

            {tableData1?.length > 0 ? (
              loading ? (
                <Loading />
              ) : (
                <div>
                  {ReportingManager == 1 ? (
                    <button
                      className="btn btn-sm btn-info ml-2"
                      onClick={exportToExcelReportLeave}
                    >
                      Leave Export
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-info ml-2"
                      onClick={exportToExcelReportEmployee}
                    >
                      Leave Export
                    </button>
                  )}
                </div>
              )
            ) : (
              loading && <Loading />
            )}
          </div>
        </div>
      </div>

      <>
        {tableData?.length > 0 && (
          <div className="card mt-2">
            <Heading
              title={
                <span style={{ fontWeight: "bold" }}>
                  Attendance Report Details
                </span>
              }
              secondTitle={
                <div className="d-flex">
                  <div className="d-flex flex-wrap align-items-center">
                    <div
                      className="d-flex"
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "white",
                          borderColor: "black",
                          cursor: "pointer",
                        }}
                        // onClick={() => handleSearch("Open", "0")}
                      ></div>
                      <span
                        className="legend-label ml-2"
                        style={{
                          width: "90%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("Working Day")}
                      </span>
                    </div>
                    <div
                      className="d-flex "
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "#FFFF00",
                          cursor: "pointer",
                        }}
                        // onClick={() => handleSearch("Rejected", "0")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "90%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("Sunday")}
                      </span>
                    </div>
                    <div
                      className="d-flex "
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "#f76459",
                          cursor: "pointer",
                        }}
                        // onClick={() => handleSearch("Hold", "0")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "110%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("Missing Attendance")}
                      </span>
                    </div>
                    <div
                      className="d-flex "
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "#FFC0CB",
                          cursor: "pointer",
                        }}
                        // onClick={() => handleSearch("Approved", "0")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "110%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("Leave(CL/SL/COMP-Off)")}
                      </span>
                    </div>
                    <div
                      className="d-flex "
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "#FFA500",
                          cursor: "pointer",
                        }}
                        // onClick={() => handleSearch("Sale", "0")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("Week Off")}
                      </span>
                    </div>
                    <div
                      className="d-flex "
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "red",
                          cursor: "pointer",
                        }}
                        // onClick={() => handleSearch("Dead", "0")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "98%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("LWP")}
                      </span>
                    </div>
                    <div
                      className="d-flex "
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "#FAE03C",
                          cursor: "pointer",
                        }}
                        // onClick={() => handleSearch("PartialPaid", "0")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("Holiday")}
                      </span>
                    </div>
                    <span className="mr-2 ml-5" style={{ fontWeight: "bold" }}>
                      Total Record :&nbsp; {tableData?.length}
                    </span>
                  </div>
                  {/* <div className="">
                      Showing {startEntry} to {endEntry} of {totalEntries}{" "}
                      entries
                    </div> */}
                  {/* <div
                      style={{ padding: "0px !important", marginLeft: "50px" }}
                    >
                      <Input
                        type="text"
                        className="form-control"
                        id="Name"
                        name="Name"
                        placeholder="Search By Name"
                        onChange={handleSearch}
                        value={searchQuery}
                        respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                      />
                    </div> */}
                </div>
              }
            />
            <>
              <Tables1
                thead={attendanceTHEAD}
                tbody={currentData}
                tableHeight={"tableHeight"}
              />
            </>

            <div className="pagination ml-auto">
              <div>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {tableData1?.length > 0 && (
          <div className="card mt-2">
            <Heading
              title={
                <span style={{ fontWeight: "bold" }}>Leave Report Details</span>
              }
              secondTitle={
                <div className="d-flex">
                  {/* <div className="">
                    Showing {startEntry} to {endEntry} of {totalEntries} entries
                  </div> */}
                  {/* <div
                    style={{ padding: "0px !important", marginLeft: "50px" }}
                  >
                    <Input
                      type="text"
                      className="form-control"
                      id="Name"
                      name="Name"
                      placeholder="Search By Name"
                      onChange={handleSearch}
                      value={searchQuery}
                      respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                    />
                  </div> */}
                  <span className="mr-2 ml-5" style={{ fontWeight: "bold" }}>
                    Total Record :&nbsp; {tableData1?.length}
                  </span>
                </div>
              }
            />

            <Tables
              thead={showWorkingDaysTHEAD}
              tbody={currentData1?.map((ele, index) => ({
                "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
                Name: ele?.Name,
                Designation: ele?.Designation,
                Team: ele?.TeamName,
                "Total Days:": ele?.TotalDays,
                Sundays: ele?.Sundays,
                CL: ele?.CL,
                SL: ele?.SL,
                WeekOff: ele?.WO,
                CompOff: ele?.COMPOff,
                "CL-CIR": ele?.CLCIR,
                "SL-CIR": ele?.SLCIR,
                LWP: ele?.LWP,
                "Working Days": ele?.WorkingDays,
                "Non Working Days": ele?.NonWorkingDays,
                "Missing Days": ele?.MissingDays,
                "Payable Days": ele?.PayableDays,
              }))}
              tableHeight={"tableHeight"}
            />
            <div className="pagination ml-auto">
              <div>
                <button
                  onClick={() => handlePageChange1(currentPage1 - 1)}
                  disabled={currentPage1 === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage1} of {totalPages1}
                </span>
                <button
                  onClick={() => handlePageChange1(currentPage1 + 1)}
                  disabled={currentPage1 === totalPages1}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default AttendanceReport;

const Tables1 = ({ thead = [], tbody = [], tableHeight = "" }) => {
  return (
    <div className={tableHeight} style={{ overflowX: "auto" }}>
      <table className="table table-bordered table-striped ">
        <thead>
          <tr>
            {thead.map((headCell, index) => (
              <th key={index}>{headCell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tbody) && tbody.length > 0 ? (
            tbody.map((row, rowIndex) => (
              <tr key={row?.ID || rowIndex}>
                {Object.values(row).map((cell, cellIndex) => (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    style={{ backgroundColor: getAttendanceColor(cell) }}
                    className={getAttendanceColor(cell)}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={thead.length} className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const getAttendanceColor = (value) => {
  if (value === "S") return "yellow";
  else if (value === "Y" || value === "HLComp OffY") return "#ffffff";
  else if (value === "") return "#f76459";
  else if (value === "LWP") return "red";
  else if (value === "WO") return "#FFA500";
  else if (value === "HL") return "#FAE03C";
  else if (value === "OL") return "orange";
  else if (value === "Comp Off" || value === "SL" || value === "CL")
    return "#ffc0cb";
};
