import React, { useEffect, useState } from "react";
import Tables from "../../components/UI/customTable";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import DatePicker from "../../components/formComponent/DatePicker";
import { useTranslation } from "react-i18next";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import Loading from "../../components/loader/Loading";
import Heading from "../../components/UI/Heading";
import ReactSelect from "../../components/formComponent/ReactSelect";
import Input from "../../components/formComponent/Input";
import { axiosInstances } from "../../networkServices/axiosInstance";
const LoginDetailModal = () => {
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );
  const [assignto, setAssignedto] = useState([]);
  const IsEmployee = useCryptoLocalStorage("user_Data", "get", "realname");
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [breakData, setBreakData] = useState([]);
  const [loading, setLoading] = useState(false);
  const loginTHEAD = ["S.No.", "BreakIn", "BreakOut", "BreakDuration"];
  const transTHEAD = ["S.No.", "Date", "IN", "OUT", "Time Difference"];
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    AssignedTo: useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      ? useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      : "",
  });

  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const getAssignTo = () => {
    axiosInstances
      .post(apiUrls.EmployeeBind, {
        CrmEmployeeID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
      })
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { label: item?.EmployeeName, value: item?.Employee_ID };
        });
        setAssignedto(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEmployeeAverage = () => {
    axiosInstances
      .post(apiUrls.GetEmployeeTransactions, {
        CrmEmpID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        Date: String(new Date(formData?.FromDate).toISOString()),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res?.data?.transactions);
          setBreakData(res?.data?.breaks);
          setLoading(false);
        } else {
          setTableData([]);
          setBreakData([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSearch = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.GetEmployeeTransactions, {
        CrmEmpID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        Date: String(new Date(formData?.FromDate).toISOString()),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res?.data?.transactions);
          setBreakData(res?.data?.breaks);
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
          setTableData([]);
          setBreakData([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleEmployee = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.GetEmployeeTransactions, {
        CrmEmpID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        Date: String(new Date(formData?.FromDate).toISOString()),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res?.data?.transactions);
          setBreakData(res?.data?.breaks);
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
          setTableData([]);
          setBreakData([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Function to convert HH:mm:ss to seconds
  const timeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const [hrs, mins, secs] = timeStr.split(":").map(Number);
    return (hrs || 0) * 3600 + (mins || 0) * 60 + (secs || 0);
  };

  // Function to convert total seconds to HH:mm:ss
  const secondsToTime = (totalSeconds) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // Calculate total break duration in seconds
  const totalBreakSeconds = breakData?.reduce((acc, ele) => {
    return acc + timeToSeconds(ele?.BreakDuration);
  }, 0);

  // Convert to HH:mm:ss
  const totalBreakTime = secondsToTime(totalBreakSeconds);

  ///////////////////////////////////

  // ⬆️ keep the rest of your component unchanged

  // 1️⃣  — total up all row durations (in ms)
  const getCurrentTempLogoutTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  const totalDiffMs =
    tableData?.reduce((acc, ele) => {
      // ignore rows that are missing times
      if (!ele?.LoginTime || !ele?.LogoutTime) return acc;

      const login = new Date(`${ele.LogDate}T${ele.LoginTime}`);
      const logout = new Date(`${ele.LogDate}T${ele.LogoutTime}`);

      const diff = logout - login; // ms

      return acc + (isNaN(diff) ? 0 : diff); // guard against bad dates
    }, 0) ?? 0;

  // 2️⃣  — convert ms → hh:mm:ss
  const totalHrs = String(Math.floor(totalDiffMs / 3_600_000)).padStart(2, "0");
  const totalMin = String(
    Math.floor((totalDiffMs % 3_600_000) / 60_000)
  ).padStart(2, "0");
  const totalSec = String(Math.floor((totalDiffMs % 60_000) / 1_000)).padStart(
    2,
    "0"
  );

  const totalWorkingTime = `${totalHrs}:${totalMin}:${totalSec}`;

  useEffect(() => {
    handleEmployeeAverage();
    getAssignTo();
  }, []);
  return (
    <>
      {tableData?.length > 0 && (
        <div className="card">
          <div className="row p-2">
            <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
              Employee Code:- {tableData[0]?.EmpCode}
            </span>
          </div>
        </div>
      )}
      <div className="card mt-2">
        <div className="row">
          {ReportingManager == 1 ? (
            <ReactSelect
              respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-1 ml-1"
              name="AssignedTo"
              placeholderName={t("Employee")}
              dynamicOptions={assignto}
              handleChange={handleDeliveryChange}
              value={formData?.AssignedTo}
            />
          ) : (
            <Input
              type="text"
              respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-1 ml-1"
              className="form-control"
              placeholder=" "
              lable="Employee"
              id="AssignedTo"
              name="AssignedTo"
              value={IsEmployee}
              disabled={true}
            />
          )}
          <DatePicker
            className="custom-calendar"
            id="FromDate"
            name="FromDate"
            lable={t("Date")}
            placeholder={VITE_DATE_FORMAT}
            value={formData?.FromDate}
            respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-1"
            handleChange={searchHandleChange}
            requiredClassName={"required-fields"}
          />
          {ReportingManager == 1 ? (
            <div>
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2 mt-1"
                  onClick={handleSearch}
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
                  className="btn btn-sm btn-info ml-2 mt-1"
                  onClick={handleEmployee}
                >
                  Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Heading
        title={
          <span style={{ fontWeight: "bold", marginTop: "10px" }}>
            Break Details
          </span>
        }
        secondTitle={
          <>
            <span style={{ marginLeft: "auto", fontWeight: "bold" }}>
              Break Count: {breakData?.length}
            </span>
          </>
        }
      />
      {breakData?.length > 0 ? (
        <div className="card ">
          <Tables
            thead={loginTHEAD}
            tbody={breakData?.map((ele, index) => ({
              "S.No.": index + 1,
              BreakIn: ele?.BreakIn ?? "",
              BreakOut: ele?.BreakOut ?? "",
              BreakDuration: ele?.BreakDuration ?? "",
            }))}
            tableHeight={"tableHeight"}
          />
          <div
            style={{
              marginTop: "0px",
              fontWeight: "bold",
              marginLeft: "auto",
              marginRight: "108px",
            }}
          >
            Total Break Duration :{" "}
            <span
              style={{ color: totalBreakTime > "01:00:00" ? "red" : "green" }}
            >
              {totalBreakTime}
            </span>
          </div>
        </div>
      ) : (
        <div className="card">
          <div
            className="row p-2"
            style={{
              color: "red",
              fontWeight: "bold",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            No Records Found..
          </div>
        </div>
      )}
      <div className="card d-none">
        <Heading
          title={<span style={{ fontWeight: "bold" }}>Attendance Details</span>}
        />
        <div className="row p-2 d-flex">
          <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
            Login Time: {tableData[0]?.LoginTime}
          </span>
          &nbsp; &nbsp; &nbsp; &nbsp;{" "}
          <span
            style={{
              fontWeight: "bold",
              marginLeft: "10px",
              // color: tableData[0]?.LogoutTime > "09:00:00" ? "red" : "black",
            }}
          >
            Logout Time:{" "}
            {tableData[0]?.LogoutTime ? tableData[0]?.LogoutTime : "00:00:00"}
          </span>{" "}
        </div>
      </div>
      <Heading
        title={<span style={{ fontWeight: "bold" }}>In-Out Details</span>}
      />
      {tableData?.length > 0 ? (
        <>
          <div className="card mt-0">
            <Tables
              thead={transTHEAD}
              tbody={tableData?.map((ele, index) => {
                const login = new Date(`${ele.LogDate}T${ele.LoginTime}`);
                const logout = new Date(`${ele.LogDate}T${ele.LogoutTime}`);
                const diffMs = logout - login;

                const diffHrs = String(
                  Math.floor(diffMs / (1000 * 60 * 60))
                ).padStart(2, "0");
                const diffMin = String(
                  Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
                ).padStart(2, "0");
                const diffSec = String(
                  Math.floor((diffMs % (1000 * 60)) / 1000)
                ).padStart(2, "0");

                return {
                  "S.No.": index + 1,
                  Date: ele?.LogDate
                    ? (() => {
                        const date = new Date(ele.LogDate);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const year = date.getFullYear();
                        return `${day}-${month}-${year}`;
                      })()
                    : "",
                  IN: ele?.LoginTime,
                  OUT: ele?.LogoutTime,
                  "Time Difference": `${isNaN(diffHrs) ? "00" : diffHrs}:${isNaN(diffMin) ? "00" : diffMin}:${isNaN(diffSec) ? "00" : diffSec}`,
                };
              })}
              tableHeight={"tableHeight"}
            />
            <div
              style={{
                textAlign: "right",
                marginTop: "0px",
                fontWeight: 600,
                marginRight: "88px",
              }}
            >
              Total Working Hours :
              <span
                style={{
                  color: totalWorkingTime < "08:00:00" ? "red" : "green",
                }}
              >
                &nbsp;{totalWorkingTime}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <div
            className="row p-2"
            style={{
              color: "red",
              fontWeight: "bold",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            No Records Found..
          </div>
        </div>
      )}
    </>
  );
};
export default LoginDetailModal;
