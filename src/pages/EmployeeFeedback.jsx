import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import ReactSelect from "../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Modal from "../components/modalComponent/Modal";
import EmployeeFeedbackCreate from "./EmployeeFeedbackCreate";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import Tables from "../components/UI/customTable";
import { Rating } from "react-simple-star-rating";
import gmaillogo from "../../src/assets/image/Gmail_Logo.png";
import whats from "../../src/assets/image/whtsapp.png";
import smss from "../../src/assets/image/smss.png";
import EmployeeFeedbackLogDetail from "./EmployeeFeedbackLogDetail";
import EmployeeFeedbackWhatsapp from "./EmployeeFeedbackWhatsapp";
import EmployeeFeedbackGmail from "./EmployeeFeedbackGmail";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import Input from "../components/formComponent/Input";
import EmployeeFeedbackDetails from "./EmployeeFeedbackDetails";
import excelimg from "../../src/assets/image/excel.png";
import { ExportToExcel } from "../networkServices/Tools";
import { FaStar, FaRegStar } from "react-icons/fa";
import { axiosInstances } from "../networkServices/axiosInstance";
const EmployeeFeedback = ({ data }) => {
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );

  useEffect(() => {
    if (data) {
      ReportingManager == 1 ? handleSearchList("") : handleSearchEmployee("");
    }
  }, [data]);

  const IsEmployee = useCryptoLocalStorage("user_Data", "get", "realname");

  const [loading, setLoading] = useState(false);
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [assignto, setAssignedto] = useState([]);
  const [columnConfig, setColumnConfig] = useState([]);
  const [formData, setFormData] = useState({
    AssignedTo: "0",
  });

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getAssignTo = () => {
    axiosInstances
      .post(apiUrls.EmployeeFeebackBind, {
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

  const handleSearchList = (code) => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.EmployeeFeedbackSearch, {
        CrmEmployeeID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        EmployeeID: formData?.AssignedTo ? Number(formData.AssignedTo) : 0,
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
        RowColor: code ? Number(code) : 0,
      })
      // const form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append("RoleID", useCryptoLocalStorage("user_Data", "get", "RoleID")),
      //   form.append(
      //     "CrmEmployeeID",
      //     useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      //   ),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append(
      //     "EmployeeID",
      //     formData?.AssignedTo ? formData.AssignedTo : "0"
      //   );
      // form.append("RowColor", code ? code : "0"),
      // axios
      //   .post(apiUrls?.EmployeeFeedbackSearch, form, { headers })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res?.data?.data);
          setLoading(false);
        } else {
          toast.error("No Record Found.");
          setLoading(false);
          setTableData([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleSearchEmployee = (code) => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.EmployeeFeedbackSearch, {
        CrmEmployeeID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        EmployeeID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
        RowColor: code ? Number(code) : 0,
      })
      // const form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append("RoleID", useCryptoLocalStorage("user_Data", "get", "RoleID")),
      //   form.append(
      //     "CrmEmployeeID",
      //     useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      //   ),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append(
      //     "EmployeeID",
      //     useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      //   );
      // form.append("RowColor", code ? code : "0"),
      //   axios
      //     .post(apiUrls?.EmployeeFeedbackSearch, form, { headers })
      .then((res) => {
        if (res?.data?.status === true) {
          setTableData(res?.data?.data);
          setLoading(false);
        } else {
          toast.error("No Record Found.");
          setLoading(false);
          setTableData([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const [visible, setVisible] = useState({
    ShowFeedback: false,
    gmailDetailVisible: false,
    smsVisible: false,
    whatsappVisible: false,
    gmailVisible: false,
    logVisible: false,
    showData: {},
  });

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
  const centreTHEAD = [
    { name: "S.No.", width: "2%" },
    "Employee Name",
    "Employee Email",
    "Created Date",
    "FeedbackBy",
    "Feedback Date",
    { name: "Feedback Result", width: "4%" },
    "Feedback Rating",
    { name: "Log Details", width: "4%" },
    { name: "Action", width: "5%" },
  ];

  useEffect(() => {
    getAssignTo();
  }, []);

  const renderStars = (count, size = 15) => {
    const getColor = (count) => {
      switch (count) {
        case 1:
          return "red"; // Very Bad
        case 2:
          return "orange"; // Bad
        case 3:
          return "yellow"; // Okay
        case 4:
          return "pink"; // Good
        case 5:
          return "green"; // Excellent
        default:
          return "gray";
      }
    };

    const color = getColor(Number(count)); // Convert to number
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Number(count) ? (
          <FaStar key={i} color={color} size={size} />
        ) : (
          <FaRegStar key={i} color="gray" size={size} />
        )
      );
    }
    return stars;
  };

  const getLabel = (count) => {
    switch (Number(count)) {
      case 1:
        return "Very Bad";
      case 2:
        return "Bad";
      case 3:
        return "Okay";
      case 4:
        return "Good";
      case 5:
        return "Excellent";
      default:
        return "No Rating";
    }
  };
  return (
    <>
      {visible?.ShowFeedback && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Feedback Details")}
        >
          <EmployeeFeedbackCreate
            visible={visible}
            setVisible={setVisible}
            handleSearchList={handleSearchList}
            handleSearchEmployee={handleSearchEmployee}
          />
        </Modal>
      )}
      {visible?.gmailDetailVisible && (
        <Modal
          modalWidth={"1000px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Feedback Details")}
        >
          <EmployeeFeedbackLogDetail
            visible={visible}
            setVisible={setVisible}
            handleSearchList={handleSearchList}
            handleSearchEmployee={handleSearchEmployee}
          />
        </Modal>
      )}
      {visible?.logVisible && (
        <Modal
          modalWidth={"1000px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Log Details")}
        >
          <EmployeeFeedbackDetails
            visible={visible}
            setVisible={setVisible}
            handleSearchList={handleSearchList}
            handleSearchEmployee={handleSearchEmployee}
          />
        </Modal>
      )}
      {visible?.whatsappVisible && (
        <Modal
          modalWidth={"350px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Whatsapp Details")}
        >
          <EmployeeFeedbackWhatsapp
            visible={visible}
            setVisible={setVisible}
            handleSearchList={handleSearchList}
            handleSearchEmployee={handleSearchEmployee}
          />
        </Modal>
      )}
      {visible?.gmailVisible && (
        <Modal
          modalWidth={"500px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Gmail Details")}
        >
          <EmployeeFeedbackGmail
            visible={visible}
            setVisible={setVisible}
            handleSearchList={handleSearchList}
            handleSearchEmployee={handleSearchEmployee}
          />
        </Modal>
      )}
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
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

          {ReportingManager == 1 ? (
            <div>
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={() => handleSearchList("")}
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
                  onClick={() => handleSearchEmployee("")}
                >
                  Search
                </button>
              )}
            </div>
          )}
          {ReportingManager == 1 && (
            <i
              className="fa fa-plus-circle fa-sm new_record_pluse mt-2 ml-3"
              onClick={() => {
                setVisible({ ShowFeedback: true, showData: "" });
              }}
              title="Click to Create Employee Feedback"
              style={{ cursor: "pointer" }}
            ></i>
          )}

          {tableData?.length > 0 && (
            <img
              src={excelimg}
              className="ml-3"
              style={{ width: "28px", height: "24px", cursor: "pointer" }}
              onClick={() => ExportToExcel(tableData)}
            ></img>
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
                      backgroundColor: "#f78f88",
                      borderColor: "black",
                      cursor: "pointer",
                    }}
                    // onClick={() => handleSearchList("10")}
                  ></div>
                  <span
                    className="legend-label ml-2"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Not Send")} (
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
                      backgroundColor: "#b9dafa",
                      cursor: "pointer",
                    }}
                    // onClick={() => handleSearchList("20")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Send")} (
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
                      backgroundColor: "#a8dea4",
                      cursor: "pointer",
                    }}
                    // onClick={() => handleSearchList("30")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{
                      width: "110%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Received Feedback")} (
                    {tableData[0]?.FeedbackCount
                      ? tableData[0]?.FeedbackCount
                      : 0}
                    )
                  </span>
                </div>

                <span className="mr-1 ml-5" style={{ fontWeight: "bold" }}>
                  Total Record :&nbsp; {tableData[0]?.TotalRecord}
                </span>
              </div>
            }
          />
          <Tables
            thead={centreTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              "Employee Name": ele?.EmployeeName,
              "Employee Email": ele?.EmployeeEmail,
              "Created Date": new Date(ele.dtEntry).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              ),
              FeedbackBy: ele?.FeedbackSubmittedBy,
              "Feedback Date": ele.dtFeedback
                ? new Date(ele.dtFeedback).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "",
              "Feedback Result": ele?.dtFeedback && (
                <i
                  className="fa fa-eye ml-4"
                  onClick={() => {
                    setVisible({
                      gmailDetailVisible: true,
                      showData: ele,
                    });
                  }}
                ></i>
              ),
              "Feedback Rating": (
                // <Rating size={20} initialValue={ele?.Result} readonly />
                <>
                  <div style={{ display: "flex" }}>
                    {renderStars(ele?.Result)}
                    <span className="ml-4" style={{ fontWeight: "bold" }}>
                      {getLabel(ele?.Result)}
                    </span>
                  </div>{" "}
                </>
              ),
              "Log Details": (
                <i
                  className="fa fa-eye ml-4"
                  onClick={() => {
                    setVisible({
                      logVisible: true,
                      showData: ele,
                    });
                  }}
                ></i>
              ),
              Action: ReportingManager == 1 && (
                <div className="d-flex">
                  <img
                    src={gmaillogo}
                    height={"13px"}
                    weight={"13px"}
                    onClick={() => {
                      setVisible({
                        gmailVisible: true,
                        showData: ele,
                      });
                    }}
                    title="Click to Gmail."
                    style={{ marginLeft: "10px" }}
                  ></img>
                  <img
                    src={whats}
                    height={"18px"}
                    weight={"18px"}
                    onClick={() => {
                      setVisible({
                        whatsappVisible: true,
                        showData: ele,
                      });
                    }}
                    title="Click to Whatsapp."
                    style={{ marginLeft: "12px" }}
                  ></img>
                </div>
              ),
              colorcode: ele?.rowColor,
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
export default EmployeeFeedback;
