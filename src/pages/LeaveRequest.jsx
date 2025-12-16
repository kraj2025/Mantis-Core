import React, { useState, useEffect } from "react";
import Heading from "../components/UI/Heading";
import DatePickerMonth from "../components/formComponent/DatePickerMonth";
import Modal from "../components/modalComponent/Modal";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import LeaveRequestModal from "./LeaveRequestModal";
import Loading from "../components/loader/Loading";
import { axiosInstances } from "../networkServices/axiosInstance";
import ReactSelect from "../components/formComponent/ReactSelect";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
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

const LeaveRequest = ({ data }) => {
  // console.log("data check", data);
  const CRMID = useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID");
  const LoginUserName = useCryptoLocalStorage("user_Data", "get", "realname");
  const [employee, setEmployee] = useState([]);
  const [formData, setFormData] = useState({
    Month: new Date(),
    Year: "",
    currentMonth: currentMonth,
    currentYear: currentYear,
    Employee: [],
  });
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );
  const IsEmployee = useCryptoLocalStorage("user_Data", "get", "realname");
  const [CalenderDetails, setCalenderDetails] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDayOfWeek, setStartDayOfWeek] = useState(0);
  const [clickedate, setclickeddate] = useState("");

  useEffect(() => {
    const updatedDays = getDaysInMonth(selectedYear, selectedMonth + 1);
    const startDay = getStartDayOfWeek(selectedYear, selectedMonth + 1);
    setDaysInMonth(updatedDays);
    setStartDayOfWeek(startDay);
  }, [selectedMonth, selectedYear]);

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
          return { label: item?.EmployeeName, value: item?.Employee_ID };
        });
        setEmployee(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeliveryChange = (name, e) => {
    setFormData({
      ...formData,
      [name]: e?.value,
    });
  };

  const handleMonthYearChange = (name, e) => {
    const { value } = e.target;
    const date = new Date(value);
    setSelectedMonth(date.getMonth());
    setSelectedYear(date.getFullYear());
    handleLeaveRequest_BindCalender({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getStatusClass = (day, table1Data) => {
    const Table1LeaveList = table1Data?.find((d) => d.Day === day);
    // console.log("tablelist", Table1LeaveList);

    if (!Table1LeaveList) return "";

    const approvedHolidays = [
      "CL",
      "SL",
      "Comp Off",
      "COMP-Off",
      "WO",
      "LWP",
      "OL",
    ];

    const { IsApproved, HasLeave, Holiday } = Table1LeaveList;

    // Case 1: Working day (not approved, manual entry)
    if (IsApproved == 0 && HasLeave === "2") {
      return "working-day";
    }

    // Case 2: Optional leave requested but not approved
    if (IsApproved == 0 && HasLeave === "OL") {
      return "optional-leave";
    }

    // Case 3: Approved but marked as working day
    if (
      IsApproved == 1 &&
      HasLeave === "0" &&
      !approvedHolidays.includes(Holiday)
    ) {
      return "working-day";
    }

    // Case 4: Leave pending approval
    if (
      IsApproved == 0 &&
      HasLeave === "0" &&
      approvedHolidays.includes(Holiday)
    ) {
      return "pending-approval";
    }

    // Case 5: Leave approved
    if (
      IsApproved == 1 &&
      HasLeave === "0" &&
      approvedHolidays.includes(Holiday)
    ) {
      return "approved-leave";
    }

    // Case 6: Gazetted / Restricted holiday
    if (["GZ", "RT"].includes(HasLeave)) {
      return "gazetted-holiday";
    }

    // Default: Missing attendance
    return "missing-attendance";
  };

  // const renderDay = (day, index, today, table1Data) => {
  //   const { date, status } = day;
  //   const todayMidnight = new Date(today);
  //   todayMidnight.setHours(0, 0, 0, 0);
  //   const [month, dayOfMonth] = date.split("/").map(Number);
  //   const dayDate = new Date(today.getFullYear(), month - 1, dayOfMonth);
  //   // const isBeforeToday = dayDate < todayMidnight;
  //   const currentMonth = today.getMonth();
  //   const targetMonth = month - 1;
  //   const isBeforeToday = targetMonth < currentMonth;

  //   const formattedDate = dayDate?.toLocaleDateString("en-US", {
  //     month: "short",
  //     day: "numeric",
  //   });
  //   const dayDetails = table1Data?.find((d) => d?.Day === dayOfMonth);

  //   return (
  //     <td
  //       key={index}
  //       // className={`verticalTable ${isBeforeToday ? "disabled-day" : "active-day"} ${getStatusClass}`}
  //       className={`verticalTable ${isBeforeToday ? "disabled-day" : "active-day"} ${getStatusClass(dayOfMonth, table1Data)}`}
  //       onClick={() => {
  //         if (isBeforeToday) return;
  //         setVisible({
  //           showVisible: true,
  //           data: dayDate,
  //           CalenderDetails: CalenderDetails,
  //         });
  //         setclickeddate(dayDate);
  //       }}
  //       style={{
  //         cursor: isBeforeToday ? "not-allowed" : "pointer",
  //         pointerEvents: isBeforeToday ? "none" : "auto",
  //       }}
  //     >
  //       <label className="formattedDate">{formattedDate}</label>
  //       {status && <div className="day-status">{status}</div>}
  //       {dayDetails && (
  //         <div
  //           className="day-details"
  //           dangerouslySetInnerHTML={{ __html: dayDetails.Holiday }}
  //         />
  //       )}
  //     </td>
  //   );
  // };

  const renderDay = (day, index, today, table1Data) => {
    const { date, status } = day;
    const [month, dayOfMonth] = date.split("/").map(Number);
    const dayDate = new Date(today.getFullYear(), month - 1, dayOfMonth);

    const formattedDate = dayDate?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const targetMonth = month - 1;
    const targetYear = today.getFullYear(); // assuming same year context

    let isDisabled = false;

    if (ReportingManager == 1) {
      // --- Reporting Manager Logic ---
      if (
        targetYear < currentYear ||
        (targetYear === currentYear && targetMonth < currentMonth)
      ) {
        // Previous month logic
        const daysPassed = today.getDate();
        isDisabled = daysPassed > 2; // enable only first 2 days of current month
      } else if (targetYear === currentYear && targetMonth === currentMonth) {
        // Current month → always active
        isDisabled = false;
      } else {
        // Future months → disabled
        // isDisabled = true;
        isDisabled = false; // future months enabled
      }
    } else {
      // --- Normal User Logic ---
      if (
        targetYear < currentYear ||
        (targetYear === currentYear && targetMonth < currentMonth)
      ) {
        isDisabled = true; // past months disabled
      } else if (targetYear === currentYear && targetMonth === currentMonth) {
        isDisabled = false; // current month active
      } else {
        // isDisabled = true; // future months disabled
        isDisabled = false; // future months enabled
      }
    }

    const dayDetails = table1Data?.find((d) => d?.Day === dayOfMonth);

    return (
      <td
        key={index}
        className={`verticalTable ${isDisabled ? "disabled-day" : "active-day"} ${getStatusClass(dayOfMonth, table1Data)}`}
        onClick={() => {
          if (isDisabled) return;
          setVisible({
            showVisible: true,
            data: dayDate,
            CalenderDetails: CalenderDetails,
          });
          setclickeddate(dayDate);
        }}
        style={{
          cursor: isDisabled ? "not-allowed" : "pointer",
          pointerEvents: isDisabled ? "none" : "auto",
        }}
      >
        <label className="formattedDate">{formattedDate}</label>
        {status && <div className="day-status">{status}</div>}
        {dayDetails && (
          <div
            className="day-details"
            dangerouslySetInnerHTML={{ __html: dayDetails.Holiday }}
          />
        )}
      </td>
    );
  };
  const renderCalendarRows = () => {
    const weeks = [];
    const today = new Date();
    let currentWeek = new Array(startDayOfWeek).fill(null);
    daysInMonth.forEach((day) => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentWeek.push(day);
    });
    if (currentWeek.length > 0) {
      weeks.push([
        ...currentWeek,
        ...new Array(7 - currentWeek.length).fill(null),
      ]);
    }
    return weeks?.map((week, index) => (
      <tr key={index}>
        {week?.map((day, i) =>
          day ? (
            renderDay(
              day,
              i,
              today,
              CalenderDetails?.[1] ? CalenderDetails?.[1] : []
            ) // Pass today's date to the renderDay function
          ) : (
            <td key={i} className="empty-day"></td> // Render empty cells for padding
          )
        )}
      </tr>
    ));
  };

  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState({
    showVisible: false,
    showData: {},
  });

  const handleLeaveRequest_BindCalender = (details) => {
    setLoading(true);
    // let form = new FormData();
    // form.append(
    //   "ID",
    //   data?.EmployeeId ||
    //     data?.Employee_Id ||
    //     useCryptoLocalStorage("user_Data", "get", "ID")
    // );

    // form.append(
    //   "LoginName",
    //   data ? data?.Name : useCryptoLocalStorage("user_Data", "get", "realname")
    // ),
    //   form.append("CrmEmpID", data?.Employee_Id || data?.EmployeeId || CRMID),
    //   form.append("Month", details ? details?.month : currentMonth),
    //   form.append("Year", details ? details?.year : currentYear),
    //   axios
    //     .post(apiUrls?.LeaveRequest_BindCalender, form, { headers })
    axiosInstances
      .post(apiUrls.LeaveRequest_BindCalender, {
        CrmEmpID: Number(data?.Employee_Id || data?.EmployeeId || CRMID),
        Year: Number(details ? details?.year : currentYear),
        Month: Number(details ? details?.month : currentMonth),
      })
      .then((res) => {
        setCalenderDetails(res?.data?.data);

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const leaveData = CalenderDetails?.[0] || [];

  const getLeaveAvailable = (leaveType) => {
    // console.log("leavetype", leaveType);
    const leave = leaveData.find((item) => item?.LeaveType === leaveType);
    return leave ? leave.Available : "0";
  };

  useEffect(() => {
    handleLeaveRequest_BindCalender();
    getReporter();
  }, []);

  function format2Date(inputDate) {
    const date = new Date(inputDate);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return formattedDate;
  }
  const handleLeaveRequest_Approve = () => {
    setLoading(true);
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      form.append("LoginName", data?.Name),
      form.append("CrmEmpID", data?.EmployeeId),
      form.append("FromDate", data?.LeaveDate),
      form.append("LeaveType", data?.LeaveType),
      form.append("Description", data?.Description),
      form.append("StatusType", "All"),
      axios
        .post(apiUrls?.LeaveRequest_Save, form, { headers })
        .then((res) => {
          if (res?.data?.status === true) {
            toast.success(res?.data?.message);
            setLoading(false);
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
  };

  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          tableData={CalenderDetails}
          Header={`Selected Date: ${format2Date(clickedate)}`}
        >
          <LeaveRequestModal
            visible={visible}
            setVisible={setVisible}
            tableData={CalenderDetails}
            data={data}
            handleLeaveRequest_BindCalender={handleLeaveRequest_BindCalender}
          />
        </Modal>
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="card">
          <Heading title={"Attendance Calendar"} isBreadcrumb={true} />
          <div className="row g-4 m-2">
            {/* <div className="col-sm-2 "> */}
            {/* <div className="d-flex"> */}
            {/* <label className="mr-2">Name :</label>
                <span style={{ textAlign: "right" }}>
                  {data ? data?.Name : LoginUserName}
                </span> */}
            {ReportingManager == 1 ? (
              <ReactSelect
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="Employee"
                placeholderName="Employee"
                dynamicOptions={employee}
                handleChange={handleDeliveryChange}
                value={formData.Employee}
              />
            ) : (
              <Input
                type="text"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                className="form-control"
                placeholder=" "
                lable="Employee"
                id="Employee"
                name="Employee"
                value={IsEmployee}
                // onChange={handleChange}
                disabled={true}
              />
            )}
            {/* </div> */}
            {/* </div> */}
            <div className="col-sm-4 d-flex">
              <div className="">
                <label>Leave Month/Year :</label>
              </div>
              <div className="cl-sm-4">
                <DatePickerMonth
                  className="custom-calendar"
                  id="Month"
                  name="Month"
                  lable="Month/Year"
                  placeholder={"MM/YY"}
                  respclass="col-xl-12 col-md-6 col-sm-6 col-12"
                  value={formData?.Month}
                  handleChange={(e) => handleMonthYearChange("Month", e)}
                />
              </div>
            </div>
            <div className="col-sm-2"></div>

            <div className="col-sm-4">
              <div className="d-flex flex-wrap">
                <label className="mr-5">Available </label>
                <label className="mr-5">
                  CL :
                  <span style={{ color: "red" }}>
                    &nbsp;{getLeaveAvailable("CL")}
                  </span>
                </label>
                <label className="mr-5">
                  SL :
                  <span style={{ color: "red" }}>
                    &nbsp;{getLeaveAvailable("SL")}
                  </span>
                </label>
                <label className="mr-5">
                  WO :
                  <span style={{ color: "red" }}>
                    &nbsp; {getLeaveAvailable("WO")}
                  </span>
                </label>
                <label className="mr-5">
                  OL :
                  <span style={{ color: "red" }}>
                    &nbsp; {getLeaveAvailable("OL")}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="row d-flex custom-layout">
            <div className="col-md-9 calendar-container-wrapper">
              <div className="calendar-container">
                <table className="calendar">
                  <thead style={{ color: "#0099ff" }}>
                    <tr>
                      <th>Sunday</th>
                      <th>Monday</th>
                      <th>Tuesday</th>
                      <th>Wednesday</th>
                      <th>Thursday</th>
                      <th>Friday</th>
                      <th>Saturday</th>
                    </tr>
                  </thead>
                  <tbody>{renderCalendarRows()}</tbody>
                </table>
              </div>
            </div>
            <div className="col-md-3 legend-wrapper">
              {/* {data && ReportingManager == 1 && (
              <button
                className="btn btn-sm mb-2"
                style={{
                  background: "#0eb342",
                  color: "white",
                  border: "none",
                }}
                onClick={handleLeaveRequest_Approve}
              >
                Approve All
              </button>
            )} */}
              <div className="legend">
                <p>
                  <span className="pending-approval"></span> Pending Approval
                </p>
                <p>
                  <span className="approved-leave"></span> Approved Leave
                </p>
                <p>
                  <span className="gazetted-holiday"></span> Gazetted/Restricted
                  Holiday
                </p>
                <p>
                  <span className="optional-leave"></span> Optional Leave
                </p>
                <p>
                  <span className="missing-attendance"></span> Missing
                  Attendance
                </p>
                <p>
                  <span className="working-day"></span> Working Day
                </p>
              </div>
              <div>
                <span style={{ color: "red" }}>
                  <strong>Note</strong>: Pending SL will carry forward in the
                  next financial year
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaveRequest;
