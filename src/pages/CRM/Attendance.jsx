import React, { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";
import DatePicker from "../../components/formComponent/DatePicker";
import ReactSelect from "../../components/formComponent/ReactSelect";
import Input from "../../components/formComponent/Input";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import Loading from "../../components/loader/Loading";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import Modal from "../../components/modalComponent/Modal";
import { useTranslation } from "react-i18next";
import SlideScreen from "../SlideScreen";
import SeeMoreSlideScreen from "../../components/SearchableTable/SeeMoreSlideScreen";
import LeaveRequestList from "../LeaveRequestList";
import ShortBreakModal from "../ShortBreakModal";
import LongBreakModal from "../LongBreakModal";
import ShortBreakLogModal from "../ShortBreakLogModal";
import LongBreakLogModal from "../LongBreakLogModal";
import ShortLongBreakModal from "../ShortLongBreakModal";
import ReactSelectIcon from "../../components/formComponent/ReactSelectIcon";
import { axiosInstances } from "../../networkServices/axiosInstance";
const Attendance = () => {
  const [t] = useTranslation();
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );
  const [reporter, setReporter] = useState([]);
  const [assignto, setAssignedto] = useState([]);
  const IsEmployee = useCryptoLocalStorage("user_Data", "get", "realname");
  const CRMID = useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID");
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  // console.log("isLogin", isLogin);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    Team: "",
    SubTeam: "",
    Name: "",
    Remarks: "",
    VerticalID: [],
    TeamID: [],
    WingID: [],
    Latitude: "",
    Longitude: "",
    LocationID: "",
    AssignedTo: useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      ? useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      : "",
    ReportingTo: "",
  });

  const locationOptions = [
    { label: "Noida Office", value: "Noida Office" },
    { label: "Client Site", value: "Client Site" },
    { label: "Work From Home", value: "Work From Home" },
    { label: "Office+Client", value: "Office+Client" },
  ];

  const getAssignTo = () => {
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
        setAssignedto(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [notFound, setNotFound] = useState("");
  const LoginLogoutButton = () => {
    axiosInstances
      .post(apiUrls.Attendence_Select, {
        EmailID: String(useCryptoLocalStorage("user_Data", "get", "EmailId")),
        SearchType: String("LogInStatus"),
      })
      .then((res) => {
        console.log("data data data", res?.data?.message);
        const data = res?.data?.data;
        // console.log("data data", data);
        // setNotFound(res?.data?.message == "Found");
        if (data?.IsLoggedIn === 1 && data?.IsLogout === 0) {
          setIsLogin(true);
          localStorage.setItem("isLogin", "true");
          handleTableSearch();
        } else {
          setIsLogin(false);
          localStorage.setItem("isLogin", "false");
          handleTableSearch();
        }
      })
      .catch((err) => {
        console.error("Error fetching login/logout status", err);
      });
  };

  useEffect(() => {
    LoginLogoutButton();
    getAssignTo();
    getReporter();
  }, []);

  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const handleTableSearch = (code) => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.Attendence_Search, {
        EmployeeID: Number(formData?.AssignedTo),
        SearchType: String(code ? code : "0"),
        Date: String(formatDate(formData?.FromDate)),
        ManagerID: Number(formData?.ReportingTo),
      })
      .then((res) => {
        const data = res?.data?.data;
        if (res?.data?.success === true) {
          const updatedData = data?.map((ele, index) => {
            return {
              ...ele,
              index: index,
              IsActive: "0",

              ShortLogDropDown: "",
              ShortLogResolve: false,
              ShortLogDropDownValue: "",

              BreakLogDropDown: "",
              BreakLogResolve: false,
              BreakLogDropDownValue: "",

              ShortDropDown: "",
              ShortResolve: false,
              ShortDropDownValue: "",

              LongDropDown: "",
              LongResolve: false,
              LongDropDownValue: "",
            };
          });
          setTableData(updatedData);
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
          // setTableData([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleTableSearchEmployee = (code) => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.Attendence_Search, {
        EmployeeID: Number(formData?.AssignedTo),
        SearchType: String(code ? code : "0"),
        Date: String(formatDate(formData?.FromDate)),
        ManagerID: Number(formData?.ReportingTo ? formData?.ReportingTo : "0"),
      })
      .then((res) => {
        setTableData(res?.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleDateChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name == "ReportingTo") {
      setFormData({
        ...formData,
        [name]: value,
      });
      // getAssignTo(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(formattedTime);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(tableData?.length / rowsPerPage);
  const currentData = tableData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getIconColor = (orderSequence) => {
    switch (orderSequence) {
      case 0:
        return "orange"; // Leave
      case 1:
        return "red"; // Offline
      case 2:
        return "purple"; // Missing Attendance
      case 3:
        return "green"; // Online
      case 4:
        return "#17a2b8"; // Short Attendance
      case 5:
        return "#007bff"; // Forcefully Short Attendance
      case 6:
        return "#ffc107"; // Long Break
      case 7:
        return "#6610f2"; // Forcefully Long Break

      default:
        return "gray"; // Default color if no match
    }
  };

  const getIconDetails = (orderSequence) => {
    switch (orderSequence) {
      case 0:
        return { color: "orange", label: "Leave" };
      case 1:
        return { color: "red", label: "Offline" };
      case 2:
        return { color: "purple", label: "Missing Attendance" };
      case 3:
        return { color: "green", label: "Online" };
      case 4:
        return { color: "#17a2b8", label: "Short Attendance" };
      case 5:
        return { color: "#007bff", label: "Forcefully Short Attendance" };
      case 6:
        return { color: "#ffc107", label: "Long Break" };
      case 7:
        return { color: "#6610f2", label: "Forcefully Long Break" };
      default:
        return { color: "gray", label: "Unknown" };
    }
  };

  const calculateStatusCounts = (data) => {
    let total = data.length;
    let online = data.filter((member) => member.OrderSequence === 3).length;
    let offline = data.filter((member) => member.OrderSequence === 1).length;
    let leave = data.filter((member) => member.OrderSequence === 0).length;
    let missingAttendance = data.filter(
      (member) => member.OrderSequence === 2
    ).length;
    let shortAttendance = data.filter(
      (member) => member.OrderSequence === 4
    ).length;
    let forcefullyShortAttendance = data.filter(
      (member) => member.OrderSequence === 5
    ).length;
    let longBreak = data.filter((member) => member.OrderSequence === 6).length;
    let forcefullyLongBreak = data.filter(
      (member) => member.OrderSequence === 7
    ).length;
    return {
      total,
      online,
      offline,
      leave,
      missingAttendance,
      shortAttendance,
      forcefullyShortAttendance,
      longBreak,
      forcefullyLongBreak,
    };
  };

  const statusCounts = calculateStatusCounts(tableData);

  const getReporter = () => {
    axiosInstances
      .post(apiUrls.GetReportingTo_Employee, {})
      .then((res) => {
        const reporters = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.Employee_ID };
        });
        setReporter(reporters);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const RoleID = useCryptoLocalStorage("user_Data", "get", "RoleID");

  const handleLogin = async () => {
    // if (!formData?.LocationID) {
    //   toast.error("Location is required");
    //   return;
    // }
    setLoading(true);
    try {
      const res = await axiosInstances.post(apiUrls.Attendence_Login, {
        CrmEmpID: Number(CRMID),
        Location: String(formData?.LocationID || ""),
        Latitude: String(formData?.Latitude || ""),
        Longitude: String(formData?.Longitude || ""),
        Remarks: String(formData?.Remarks || ""),
        StatusType: String("LogIn"),
      });
      if (res?.data?.success === true) {
        toast.success(res?.data?.message);
        setIsLogin(true);
        localStorage.setItem("isLogin", "true");
        LoginLogoutButton();
        setLoading(false);
      } else {
        toast.error(res?.data?.message);
        setLoading(false);
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleLogout = async () => {
    // if (!formData?.LocationID) {
    //   toast.error("Location is required");
    //   return;
    // }
    setLoading(true);
    try {
      const res = await axiosInstances.post(apiUrls.Attendence_Login, {
        CrmEmpID: Number(CRMID),
        Location: String(formData?.LocationID || ""),
        Latitude: String(formData?.Latitude || ""),
        Longitude: String(formData?.Longitude || ""),
        Remarks: String(formData?.Remarks || ""),
        StatusType: String("LogOut"),
      });
      if (res?.data?.success === true) {
        toast.success(res?.data?.message);
        setIsLogin(false);
        localStorage.setItem("isLogin", "false");
        LoginLogoutButton();
        setLoading(false);
      } else {
        toast.error(res?.data?.message);
        setLoading(false);
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    const loginState = localStorage.getItem("isLogin");
    setIsLogin(loginState === "true");
    LoginLogoutButton();
  }, []);

  const [visible, setVisible] = useState({
    ShowCalendar: false,
    ShowShort: false,
    ShowLong: false,
    shortVisible: false,
    longVisible: false,
    showData: {},
  });
  useEffect(() => {
    handleTableSearch("");
  }, []);

  const handleDeliveryChangeValue = (name, value, index, ele) => {
    tableData?.map((val, ind) => {
      if (index !== ind) {
        val["TableStatus"] = null;
      }
      return val;
    });

    const data = [...tableData];
    data[index]["TableStatus"] = value;
    if (value === "LongBreakLog") {
      data[index]["BreakLogResolve"] = true;
      setTableData(data);
      setVisible({
        shortVisible: false,
        longVisible: true,
        ShowShort: false,
        ShowLong: false,
        showData: data[index],
      });
    } else if (value === "ShortAttendanceLog") {
      data[index]["ShortLogResolve"] = true;
      setTableData(data);
      setVisible({
        shortVisible: true,
        longVisible: false,
        ShowShort: false,
        ShowLong: false,
        showData: data[index],
      });
    } else if (value === "Short") {
      data[index]["ShortResolve"] = true;
      setTableData(data);
      setVisible({
        shortVisible: false,
        longVisible: false,
        ShowShort: true,
        ShowLong: false,
        showData: data[index],
      });
    } else if (value === "Long") {
      data[index]["LongResolve"] = true;
      setTableData(data);
      setVisible({
        shortVisible: false,
        longVisible: false,
        ShowShort: false,
        ShowLong: true,
        showData: data[index],
      });
    } else {
      setTableData(data);
      setVisible({
        shortVisible: false,
        longVisible: false,
        ShowShort: false,
        ShowLong: false,
        showData: {},
      });
    }
  };

  const [listVisible, setListVisible] = useState(false);
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const ModalComponent = (name, component) => {
    setListVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };
  const [seeMore, setSeeMore] = useState([]);

  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };
  return (
    <>
      {/* {visible?.ShowCalendar && ""} */}
      {visible?.ShowShort && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Short Attendance Details"
        >
          <ShortBreakModal
            visible={visible}
            setVisible={setVisible}
            handleTableSearch={handleTableSearch}
          />
        </Modal>
      )}
      {visible?.ShowLong && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Long Break Details"
        >
          <LongBreakModal
            visible={visible}
            setVisible={setVisible}
            handleTableSearch={handleTableSearch}
          />
        </Modal>
      )}

      {visible?.shortVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Short Attendance Log"
        >
          <ShortBreakLogModal
            visible={visible}
            setVisible={setVisible}
            handleTableSearch={handleTableSearch}
          />
        </Modal>
      )}
      {visible?.longVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Long Break Log"
        >
          <LongBreakLogModal
            visible={visible}
            setVisible={setVisible}
            handleTableSearch={handleTableSearch}
          />
        </Modal>
      )}
      <div className="card">
        <Heading
          title={<span style={{ fontWeight: "bold" }}>Attendance</span>}
          secondTitle={
            <div>
              {tableData?.length > 0 && (
                <div
                  className="attendance-status"
                  style={{ fontWeight: "bold" }}
                >
                  <div
                    className="status-item online"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTableSearch("1")}
                  >
                    <span className="dot status-online"></span>
                    Online : {statusCounts.online}
                  </div>

                  <div
                    className="status-item offline"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTableSearch("2")}
                  >
                    <span className="dot status-offline"></span>
                    Offline : {statusCounts.offline}
                  </div>

                  <div
                    className="status-item leave"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTableSearch("3")}
                  >
                    <span className="dot status-leave"></span>
                    Leave/Off : {statusCounts.leave}
                  </div>

                  <div
                    className="status-item missing"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTableSearch("4")}
                  >
                    <span className="dot status-missing"></span>
                    Missing Attendance : {statusCounts.missingAttendance}
                  </div>

                  <div
                    className="status-item total"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTableSearch("5")}
                  >
                    <span className="dot status-short"></span>
                    Short Attendance : {statusCounts?.shortAttendance}
                  </div>

                  <div
                    className="status-item total"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTableSearch("6")}
                  >
                    <span className="dot status-force-short"></span>
                    Forcefully Short Attendance :{" "}
                    {statusCounts?.forcefullyShortAttendance}
                  </div>

                  <div
                    className="status-item total"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTableSearch("7")}
                  >
                    <span className="dot status-long"></span>
                    Long Break : {statusCounts?.longBreak}
                  </div>

                  <div
                    className="status-item total"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTableSearch("8")}
                  >
                    <span className="dot status-force-long"></span>
                    Forcefully Long Break : {statusCounts?.forcefullyLongBreak}
                  </div>

                  <div className="status-item total">
                    Total Record : {tableData?.length}
                  </div>
                </div>
              )}
            </div>
          }
        />
        <div className="row m-2">
          <DatePicker
            className="custom-calendar"
            id="FromDate"
            name="FromDate"
            lable="Date"
            placeholder={VITE_DATE_FORMAT}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={formData?.FromDate}
            handleChange={handleDateChange}
          />
          {[3, 4, 5, 15].includes(RoleID) && (
            <ReactSelect
              name="ReportingTo"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholderName="Reporting Manager"
              dynamicOptions={reporter}
              value={formData?.ReportingTo}
              handleChange={handleDeliveryChange}
            />
          )}
          {ReportingManager == 1 ? (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="AssignedTo"
              placeholderName={t("Employee")}
              dynamicOptions={[{ label: "Select", value: "0" }, ...assignto]}
              handleChange={handleDeliveryChange}
              value={formData?.AssignedTo}
            />
          ) : (
            <Input
              type="text"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              className="form-control"
              placeholder=" "
              lable="Employee"
              id="AssignedTo"
              name="AssignedTo"
              value={IsEmployee}
              disabled={true}
            />
          )}

          {/* {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-primary"
              onClick={handleTableSearch}
            >
              Search
            </button>
          )} */}

          {ReportingManager == 1 ? (
            <div>
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={() => handleTableSearch("")}
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
                  onClick={() => handleTableSearchEmployee("")}
                >
                  Search
                </button>
              )}
            </div>
          )}

          {/* <button
            className="btn btn-sm btn-primary ml-5"
            onClick={() => {
              setVisible({
                showVisible: true,
              });
            }}
          >
            Closure Details
          </button> */}
        </div>
      </div>

      {tableData?.length > 0 ? (
        <div className="card mt-1">
          <div className="row" style={{ height: "auto", width: "100%" }}>
            <table
              className="styled-table ml-2"
              style={{ height: "auto", width: "100%" }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      fontWeight: "900",
                      marginLeft: "10px",
                    }}
                  >
                    Name
                  </th>
                  <th style={{ textAlign: "left" }}>Login</th>
                  <th style={{ textAlign: "left" }}>Location</th>
                  <th style={{ textAlign: "left" }}> Logout</th>
                  <th style={{ textAlign: "left" }}>Location</th>
                  <th style={{ textAlign: "left" }}>Leave</th>
                  <th style={{ textAlign: "left" }}>Status</th>
                  <th style={{ textAlign: "left" }}>Action</th>
                  {/* <th style={{ textAlign: "left" }}>Log</th> */}
                </tr>
              </thead>
              <tbody>
                {currentData?.map((member, index) => (
                  <tr key={index}>
                    <td>
                      <div className="team-member">
                        <span className="team-member-id ml-3">
                          {((currentPage - 1) * rowsPerPage + index + 1)
                            .toString()
                            .padStart(2, "0")}
                        </span>
                        <span
                          className="team-member-icon"
                          style={{
                            background: getIconColor(member?.OrderSequence),
                          }}
                        >
                          {member?.EmpSymbol?.charAt(0)}
                        </span>
                        <span className="team-member-name">{member.Name}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {member?.LoginTime || " "}
                    </td>
                    <td style={{ textAlign: "left" }}>{member?.Location}</td>
                    <td style={{ textAlign: "left" }}>
                      {member?.LogoutLocation}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {member?.LogoutTime || " "}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      <div>
                        {member?.LoginTime == "" && (
                          <LeaveRequestList
                            ModalComponent={ModalComponent}
                            isShowDropDown={false}
                            setSeeMore={setSeeMore}
                            data={member}
                            setVisible={() => {
                              setListVisible(false);
                            }}
                            handleBindFrameMenu={[
                              {
                                FileName: "Leave Request",
                                URL: "LeaveRequest",
                                FrameName: "LeaveRequest",
                                Description: "LeaveRequest",
                              },
                            ]}
                            isShowPatient={true}
                          />
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: "left" }}>
                      <span
                        className=""
                        style={{
                          color: getIconDetails(member?.OrderSequence).color,
                          fontWeight: "bold",
                        }}
                      >
                        {getIconDetails(member?.OrderSequence).label}
                      </span>
                    </td>
                    <td style={{ width: "10%" }}>
                      <div>
                        <ReactSelect
                          style={{ width: "80%" }}
                          name="TableStatus"
                          id="TableStatus"
                          respclass="width110px"
                          placeholderName="Status"
                          // dynamicOptions={[
                          //   { label: "Short Attendance", value: "Short" },
                          //   { label: "Long Break", value: "Long" },
                          //   {
                          //     label: "Short Attendance Log",
                          //     value: "ShortAttendanceLog",
                          //   },
                          //   { label: "Long Break Log", value: "LongBreakLog" },
                          // ]}
                          dynamicOptions={[
                            ...(member?.isShort === 1
                              ? [{ label: "Short Attendance", value: "Short" }]
                              : []),
                            ...(member?.isBreak === 1
                              ? [{ label: "Long Break", value: "Long" }]
                              : []),
                            ...(member?.isShortLog === 1
                              ? [
                                  {
                                    label: "Short Attendance Log",
                                    value: "ShortAttendanceLog",
                                  },
                                ]
                              : []),
                            ...(member?.isBreakLog === 1
                              ? [
                                  {
                                    label: "Long Break Log",
                                    value: "LongBreakLog",
                                  },
                                ]
                              : []),
                          ]}
                          value={member?.TableStatus}
                          handleChange={(name, value) => {
                            const ind = (currentPage - 1) * rowsPerPage + index;
                            handleDeliveryChangeValue(
                              name,
                              value?.value,
                              ind,
                              member
                            );
                          }}
                        />

                        {/* <AmountSubmissionSeeMoreList
                          ModalComponent={ModalComponent}
                          isShowDropDown={true}
                          setSeeMore={setSeeMore}
                          data={member}
                          setVisible={() => {
                            setListVisible(false);
                          }}
                          handleBindFrameMenu={[
                            {
                              FileName: "Attendance Calendar",
                              URL: "LeaveRequest",
                              FrameName: "LeaveRequest",
                              Description: "LeaveRequest",
                            },
                            {
                              FileName: "Short Break",
                              URL: "ShortBreakModal",
                              FrameName: "ShortBreakModal",
                              Description: "ShortBreakModal",
                            },
                            {
                              FileName: "Long Break",
                              URL: "LongBreakModal",
                              FrameName: "LongBreakModal",
                              Description: "LongBreakModal",
                            },
                          ]}
                          isShowPatient={true}
                        /> */}
                      </div>
                    </td>
                    {/* <td style={{ width: "5%" }}>
                      <i
                        className="fa fa-eye"
                        style={{ color: "black", cursor: "pointer" }}
                        title="Click to Log Details"
                        onClick={() => {
                          setVisible({
                            shortVisible: true,
                            showData: member,
                            member,
                          });
                        }}
                      ></i>

                      {member?.isBreakLog == 0 && (
                          <i
                            className="fa fa-eye"
                            style={{ color: "red", cursor: "pointer" }}
                            title="Click to Long Break Details"
                            onClick={() => {
                              setVisible({
                                longVisible: true,
                                showData: member,
                                member
                              });
                            }}
                          ></i>
                        )}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          <NoRecordFound />
        </>
      )}
      <SlideScreen
        visible={listVisible}
        setVisible={() => {
          setListVisible(false);
          setRenderComponent({
            name: null,
            component: null,
          });
        }}
        Header={
          <SeeMoreSlideScreen
            name={renderComponent?.name}
            seeMore={seeMore}
            handleChangeComponent={handleChangeComponent}
          />
        }
      >
        {renderComponent?.component}
      </SlideScreen>
      <div className="card mt-1">
        <div className="row g-4 m-2 d-flex">
          <ReactSelect
            className="form-control"
            name="LocationID"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="Location"
            id="LocationID"
            dynamicOptions={locationOptions}
            value={formData?.LocationID}
            handleChange={handleDeliveryChange}
          />
          <Input
            type="text"
            className="form-control"
            id="Remarks"
            name="Remarks"
            lable="Remarks"
            onChange={handleDateChange}
            value={formData?.Remarks}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <div>
            <select
              style={{ height: "24px", borderRadius: "2px", color: "black" }}
              disabled
            >
              <option value={currentTime}>{currentTime}</option>
            </select>
          </div>
          <div className="col-2">
            {/* {!isLogin ? (
              <button
                className="btn btn-sm mr-2"
                style={{ backgroundColor: "green", color: "white" }}
                onClick={handleLogin}
                disabled={!notFound}
              >
                Login
              </button>
            ) : (
              <button
                className="btn btn-sm mr-2"
                style={{ backgroundColor: "red", color: "white" }}
                onClick={handleLogout}
              >
                Logout
              </button>
            )} */}
            {!isLogin ? (
              <>
                {loading ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-sm mr-2"
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      borderColor: "green",
                    }}
                    onClick={handleLogin}
                    // disabled={!notFound}
                  >
                    Login
                  </button>
                )}
              </>
            ) : (
              <>
                {loading ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-sm mr-2"
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      borderColor: "red",
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                )}
              </>
            )}
          </div>

          <div
            className="pagination ml-auto"
            style={{ marginTop: "0px !important" }}
          >
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
      </div>
    </>
  );
};
export default Attendance;

// const MyLocation = () => {
//   return new Promise((resolve, reject) => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           resolve(`Lat: ${latitude}, Lon: ${longitude}`);
//         },
//         (error) => {
//           reject(`Error: ${error.message}`);
//         }
//       );
//     } else {
//       reject("Geolocation is not supported by this browser.");
//     }
//   });
// };

const MyLocation = async () => {
  try {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by this browser.");
    }

    return await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`Lat: ${latitude}, Lon: ${longitude}`);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              reject("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              reject("The request to get user location timed out.");
              break;
            default:
              reject("An unknown error occurred.");
          }
        }
      );
    });
  } catch (error) {
    return error.message;
  }
};
