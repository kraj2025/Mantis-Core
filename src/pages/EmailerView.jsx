import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import Input from "../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import DatePicker from "../components/formComponent/DatePicker";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import Tables from "../components/UI/customTable";
import ReactSelect from "../components/formComponent/ReactSelect";
import { axiosInstances } from "../networkServices/axiosInstance";
const EmailerView = () => {
  const [loading, setLoading] = useState(false);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const defaultEmail = useCryptoLocalStorage("user_Data", "get", "EmailId");
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [formData, setFormData] = useState({
    // Email: defaultEmail ? defaultEmail?.trim() : "",
    Email: "",
    FromDate: new Date(),
    ToDate: new Date(),
  });
  // console.log("logg", formData?.Email);
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name == "Email" ? value?.trim() : value,
    }));
  };

  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const handleSearch = (code) => {
    if (!formData.Email) {
      toast.error("Please Enter Valid Email.");
      return;
    }
    setLoading(true);

    let emailID = formData?.Email;
    if (typeof formData.Email === "object") {
      emailID = formData?.Email?.value;
    }

    axiosInstances
      .post(apiUrls.EmailerSearch, {
        RoleID: String(useCryptoLocalStorage("user_Data", "get", "RoleID")),
        Email: String(emailID),
        FromDate: String(formatDate(formData?.FromDate)),
        ToDate: String(formatDate(formData?.ToDate)),
        RowColor: code ? String(code) : "0",
        IsManual: 0,
      })

      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res?.data?.data?.Records);
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
          setTableData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRepush = (code) => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.RepushMail, {
        RepushID: Number(code),
        RoleID: 0,
      })

      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
  const [visible, setVisible] = useState({
    rePushVisible: false,
    showData: {},
  });

  const emailerTHEAD = [
    { name: "S.No.", width: "1%" },
    "Email Subject",
    "EmailTo",
    "EmailCC",
    { name: "Send Date", width: "6%" },
    { name: "Action", width: "5%" },
  ];

  const handleDeliveryChange = (name, selectedOption) => {
    setFormData({
      ...formData,
      [name]: selectedOption,
    });
  };

  const getEmployeeTo = async () => {
    axiosInstances
      .post(apiUrls.EmployeeEmail, {
        CrmEmployeeID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
      })
      // const form = new FormData();
      // form.append(
      //   "CrmEmployeeID",
      //   useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      // );
      // form.append(
      //   "RoleID",
      //   useCryptoLocalStorage("user_Data", "get", "RoleID")
      // );

      // await axios
      //   .post(apiUrls?.EmployeeEmail, form, { headers })
      .then((res) => {
        const options = res?.data?.data?.map((item) => ({
          label: item?.CompanyEmail?.toLowerCase(),
          value: item?.Employee_ID,
        }));

        setEmployee(options);

        const storedEmail = useCryptoLocalStorage(
          "user_Data",
          "get",
          "EmailId"
        )?.toLowerCase();

        const matchedOption = options?.find((opt) => {
          return opt?.label?.trim() == storedEmail?.trim();
        });
        if (matchedOption) {
          setFormData((prev) => ({
            ...prev,
            Email: matchedOption?.value,
          }));
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getEmployeeTo();
  }, []);

  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          {/* <Input
            type="text"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            className="form-control"
            id="Email"
            name="Email"
            lable={t("Email")}
            placeholder=""
            onChange={handleChange}
            value={formData?.Email}
            disabled={ReportingManager == 1 ? false : true}
          /> */}

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Email"
            placeholderName={"Email"}
            dynamicOptions={employee}
            value={formData?.Email}
            defaultValue={employee?.find(
              (data) => data.value == formData?.Email
            )}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
          />
          <DatePicker
            className="custom-calendar"
            id="FromDate"
            name="FromDate"
            lable={t("From Date")}
            placeholder={VITE_DATE_FORMAT}
            value={formData?.FromDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
            requiredClassName={"required-fields"}
          />
          <DatePicker
            className="custom-calendar"
            id="ToDate"
            name="ToDate"
            lable={t("To Date")}
            placeholder={VITE_DATE_FORMAT}
            value={formData?.ToDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-primary ml-2"
              onClick={() => handleSearch("")}
            >
              Search
            </button>
          )}
        </div>
      </div>

      {tableData?.length > 0 ? (
        <div className="card mt-2">
          <Heading
            title={<span style={{ fontWeight: "bold" }}>Search Details</span>}
            secondTitle={
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
                      border: "1px solid grey",
                    }}
                    onClick={() => handleSearch("30")}
                  ></div>
                  <span
                    className="legend-label ml-2"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Requested")} (
                    {tableData[0]?.PendingCount
                      ? tableData[0]?.PendingCount
                      : 0}
                    )
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
                      backgroundColor: "#84eab4",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearch("10")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Sent")} (
                    {tableData[0]?.SentCount ? tableData[0]?.SentCount : 0})
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
                      backgroundColor: "#ffb6c1",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearch("20")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Fail")} (
                    {tableData[0]?.NotSentCount
                      ? tableData[0]?.NotSentCount
                      : 0}
                    )
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
                      backgroundColor: "#7883ff",
                      cursor: "pointer",
                    }}
                    // onClick={() => handleSearch("20")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("ReSend")} (
                    {tableData[0]?.ManualCount ? tableData[0]?.ManualCount : 0})
                  </span>
                </div>
                <span className="mr-1 ml-5" style={{ fontWeight: "bold" }}>
                  Total Record :&nbsp; {tableData[0]?.TotalRecord}
                </span>
              </div>
            }
          />
          <Tables
            thead={emailerTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              "Email Subject": (
                <span
                  style={{
                    background: ele?.IsManual > 0 ? "#7883ff" : "",
                    border: "none",
                  }}
                >
                  {ele?.EmailSubject}
                </span>
              ),
              EmailTo: ele?.ToEmailAddress,
              EmailCC: ele?.CCEmailAddress,
              //   "Send Date":ele?.dtSent,
              "Send Date": new Date(ele.dtSent).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),

              Action: ele?.IsSent == 1 && (
                <button
                  className="btn btn-sm btn-primary"
                  //   onClick={() => {
                  //     setVisible({
                  //       rePushVisible: true,
                  //       ele,
                  //     });
                  //   }}
                  onClick={() => handleRepush(ele?.ID)}
                >
                  ReSend
                </button>
              ),

              colorcode: ele?.RowColor,
            }))}
            tableHeight={"tableHeight"}
          />
          <div className="pagination ml-auto ">
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
      ) : (
        <NoRecordFound />
      )}
    </>
  );
};
export default EmailerView;
