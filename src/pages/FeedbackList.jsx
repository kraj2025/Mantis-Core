import React, { useEffect, useRef, useState } from "react";
import Heading from "../components/UI/Heading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import DatePickerMonth from "../components/formComponent/DatePickerMonth";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import { toast } from "react-toastify";
import { t } from "i18next";
import Input from "../components/formComponent/Input";
import Tables from "../components/UI/customTable";
import Loading from "../components/loader/Loading";
import Modal from "../components/modalComponent/Modal";
import FeedbackModal from "./FeedbackModal";
import gmaillogo from "../../src/assets/image/Gmail_Logo.png";
import whats from "../../src/assets/image/whtsapp.png";
import smss from "../../src/assets/image/smss.png";
import FeedbackWhatsappModal from "./FeedbackWhatsappModal";
import FeedbackSmsModal from "./FeedbackSmsModal";
import FeedbackGmailModal from "./FeedbackGmailModal";
import { Rating } from "react-simple-star-rating";
import FeedbackGmailDetail from "./FeedbackGmailDetail";
import Tooltip from "./Tooltip";
import { FaStar, FaRegStar } from "react-icons/fa";
import ReactSelect from "../components/formComponent/ReactSelect";

import html2canvas from "html2canvas";
import { axiosInstances } from "../networkServices/axiosInstance";

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
const currentYear = currentDate.getFullYear();

const FeedbackList = () => {
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );

  const [loading, setLoading] = useState(false);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [tableData, setTableData] = useState([]);
  const [vertical, setVertical] = useState([]);
  const [project, setProject] = useState([]);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);
  const [poc1, setPoc1] = useState([]);
  const [poc2, setPoc2] = useState([]);
  const [poc3, setPoc3] = useState([]);
  const [formData, setFormData] = useState({
    ProjectID: [],
    VerticalID: [],
    TeamID: [],
    WingID: [],
    POC1: [],
    POC2: [],
    POC3: [],
    currentMonth: currentMonth,
    currentYear: currentYear,
    MonthYear: "",
    PageSize: 50,
    PageNo: "",
    Month: new Date(),
    SearchType: "0",
  });

  ////////////////////////////
  const componentRef = useRef();

  const handleFullPageScreenshot = () => {
    // Capture the whole page including header, footer, and scrollable content
    html2canvas(document.body, {
      useCORS: true,
      scale: 2, // for better quality
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Download image
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "full-page-screenshot.png";
      link.click();
    });
  };

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const getVertical = () => {
    axiosInstances
      .post(apiUrls.Vertical_Select, {})

      .then((res) => {
        const verticals = res?.data.data.map((item) => {
          return { name: item?.Vertical, code: item?.VerticalID };
        });
        setVertical(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getTeam = () => {
    axiosInstances
      .post(apiUrls.Team_Select, {})

      .then((res) => {
        const teams = res?.data.data.map((item) => {
          return { name: item?.Team, code: item?.TeamID };
        });
        setTeam(teams);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getWing = () => {
    axiosInstances
      .post(apiUrls.Wing_Select, {})

      .then((res) => {
        const wings = res?.data.data.map((item) => {
          return { name: item?.Wing, code: item?.WingID };
        });
        setWing(wings);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getPOC1 = () => {
    axiosInstances
      .post(apiUrls.POC_1_Select, {})

      .then((res) => {
        const poc1s = res?.data.data.map((item) => {
          return { name: item?.POC_1_Name, code: item?.POC_1_ID };
        });
        setPoc1(poc1s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getPOC2 = () => {
    axiosInstances
      .post(apiUrls.POC_2_Select, {})

      .then((res) => {
        const poc2s = res?.data.data.map((item) => {
          return { name: item?.POC_2_Name, code: item?.POC_2_ID };
        });
        setPoc2(poc2s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const shortenName = (name) => {
    return name?.length > 15 ? name?.substring(0, 25) + "..." : name;
  };
  const getPOC3 = () => {
    axiosInstances
      .post(apiUrls.POC_3_Select, {})

      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { name: item?.POC_3_Name, code: item?.POC_3_ID };
        });
        setPoc3(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        ProjectID: 0,
        IsMaster: "0",
        VerticalID: 0,
        TeamID: 0,
        WingID: 0,
      })

      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { name: item?.Project, code: item?.ProjectId };
        });
        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
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
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 13;
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
    "ProjectName",
    "FeedbackBy",
    "Feedback Rating",
    "Feedback Comment",
    "Feedback Date",
    "Email",
    "Mobile",
    "Content",
    { name: "Log Details", width: "4%" },
    { name: "Action", width: "5%" },
  ];

  const handleSearchFeedback = (code) => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.ClientFeedbackSearch, {
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID") || 0,
        ProjectID: String(formData?.ProjectID),
        VerticalID: String(formData?.VerticalID),
        TeamID: String(formData?.TeamID),
        WingID: String(formData?.WingID),
        POC1: String(formData?.POC1),
        POC2: String(formData?.POC2),
        POC3: String(formData?.POC3),
        Year: Number(formData?.currentYear),
        Month: Number(formData?.currentMonth),
        RowColor: code ? Number(code) : 0,
        RatingType: Number(formData?.SearchType),
      })

      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res?.data?.data);
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
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
      .post(apiUrls.ClientFeedbackSearch, {
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
        ProjectID: String(formData?.ProjectID),
        VerticalID: String(formData?.VerticalID),
        TeamID: String(formData?.TeamID),
        WingID: String(formData?.WingID),
        POC1: String(formData?.POC1),
        POC2: String(formData?.POC2),
        POC3: String(formData?.POC3),
        Year: String(formData?.currentYear),
        Month: String(formData?.currentMonth),
        RowColor: code ? String(code) : "0",
        RatingType: String(formData?.SearchType),
      })

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
  const [visible, setVisible] = useState({
    ShowFeedback: false,
    gmailVisible: false,
    whatsappVisible: false,
    smsVisible: false,
    gmailDetailVisible: false,
    showData: {},
  });

  const renderStars = (count, size = 15) => {
    const getColor = (count) => {
      switch (count) {
        case (count = "1"):
          return "red"; // Very Bad
        case (count = "2"):
          return "orange"; // Bad
        case (count = "3"):
          return "yellow"; // Okay
        case (count = "4"):
          return "pink"; // Good
        case (count = "5"):
          return "green"; // Excellent
        default:
          return "gray";
      }
    };

    const color = getColor(count); // Single color for filled stars
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= count ? (
          <FaStar key={i} color={color} size={size} />
        ) : (
          <FaRegStar key={i} color="gray" size={size} />
        )
      );
    }
    return stars;
  };

  const getLabel = (count) => {
    switch (count) {
      case (count = "1"):
        return "Very Bad";
      case (count = "2"):
        return "Bad";
      case (count = "3"):
        return "Okay";
      case (count = "4"):
        return "Good";
      case (count = "5"):
        return "Excellent";
      default:
        return "No Rating";
    }
  };

  useEffect(() => {
    getProject();
    getVertical();
    getTeam();
    getWing();
    getPOC1();
    getPOC2();
    getPOC3();
  }, []);
  return (
    <>
      {visible?.ShowFeedback && (
        <Modal
          modalWidth={"500px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Feedback Details")}
        >
          <FeedbackModal
            visible={visible}
            setVisible={setVisible}
            handleSearchFeedback={handleSearchFeedback}
            handleSearchEmployee={handleSearchEmployee}
          />
        </Modal>
      )}
      {visible?.whatsappVisible && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("WhatsApp Details")}
        >
          <FeedbackWhatsappModal
            visible={visible}
            setVisible={setVisible}
            handleSearchFeedback={handleSearchFeedback}
            handleSearchEmployee={handleSearchEmployee}
          />
        </Modal>
      )}
      {visible?.smsVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Feedback Comment Details")}
        >
          <FeedbackSmsModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.gmailVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Gmail Details")}
        >
          <FeedbackGmailModal
            visible={visible}
            setVisible={setVisible}
            handleSearchFeedback={handleSearchFeedback}
            handleSearchEmployee={handleSearchEmployee}
          />
        </Modal>
      )}
      {visible?.gmailDetailVisible && (
        <Modal
          modalWidth={"700px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Feedback Log Details")}
        >
          <FeedbackGmailDetail
            visible={visible}
            setVisible={setVisible}
            handleSearchFeedback={handleSearchFeedback}
            handleSearchEmployee={handleSearchEmployee}
          />
        </Modal>
      )}
      <div className="card" ref={componentRef}>
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="ProjectID"
            placeholderName="Project"
            dynamicOptions={project}
            handleChange={handleMultiSelectChange}
            value={formData.ProjectID.map((code) => ({
              code,
              name: project.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="VerticalID"
            placeholderName="Vertical"
            dynamicOptions={vertical}
            optionLabel="VerticalID"
            className="VerticalID"
            handleChange={handleMultiSelectChange}
            value={formData.VerticalID.map((code) => ({
              code,
              name: vertical.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="TeamID"
            placeholderName="Team"
            dynamicOptions={team}
            handleChange={handleMultiSelectChange}
            value={formData.TeamID.map((code) => ({
              code,
              name: team.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="WingID"
            placeholderName="Wing"
            dynamicOptions={wing}
            handleChange={handleMultiSelectChange}
            value={formData.WingID.map((code) => ({
              code,
              name: wing.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="POC1"
            placeholderName="POC-I"
            dynamicOptions={poc1}
            handleChange={handleMultiSelectChange}
            value={formData.POC1.map((code) => ({
              code,
              name: poc1.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="POC2"
            placeholderName="POC-II"
            dynamicOptions={poc2}
            handleChange={handleMultiSelectChange}
            value={formData.POC2.map((code) => ({
              code,
              name: poc2.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="POC3"
            placeholderName="POC-III"
            dynamicOptions={poc3}
            handleChange={handleMultiSelectChange}
            value={formData.POC3.map((code) => ({
              code,
              name: poc3.find((item) => item.code === code)?.name,
            }))}
          />
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
          <ReactSelect
            className="form-control"
            name="SearchType"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="Search Type"
            id="SearchType"
            dynamicOptions={[
              { label: "Select", value: "0" },
              { label: "1 Star Rating", value: "1" },
              { label: "2 Star Rating", value: "1" },
              { label: "3 Star Rating", value: "3" },
              { label: "4 Star Rating", value: "4" },
              { label: "5 Star Rating", value: "5" },
            ]}
            value={formData?.SearchType}
            handleChange={handleDeliveryChange}
          />
          {ReportingManager == 1 ? (
            <div>
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={() => handleSearchFeedback("")}
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

          <i
            className="fa fa-plus-circle fa-sm new_record_pluse mt-2 ml-3"
            onClick={() => {
              setVisible({ ShowFeedback: true, showData: "" });
            }}
            title="Click to Feedback"
            style={{ cursor: "pointer" }}
          ></i>
        </div>
      </div>

      {tableData?.length > 0 ? (
        <div className="card mt-2" ref={componentRef}>
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
                    onClick={() => handleSearchFeedback("10")}
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
                    {tableData[0]?.NotSendCount
                      ? tableData[0]?.NotSendCount
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
                    onClick={() => handleSearchFeedback("20")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{
                      width: "110%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Send/Pending")} (
                    {tableData[0]?.SendCount ? tableData[0]?.SendCount : 0})
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
                    onClick={() => handleSearchFeedback("30")}
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
                    {tableData[0]?.ReceivedCount
                      ? tableData[0]?.ReceivedCount
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
              ProjectName: (
                <Tooltip label={ele?.ProjectName}>
                  <span
                    id={`Content-${index}`}
                    targrt={`Content-${index}`}
                    style={{ textAlign: "center" }}
                  >
                    {shortenName(ele?.ProjectName)}
                  </span>
                </Tooltip>
              ),

              FeedbackBy: ele?.FeedbackBy,
              "Feedback Rating": (
                // <Rating
                //   size={20}
                //   initialValue={ele?.FeedbackRate}
                //   readonly
                // />
                // renderStars(ele?.FeedbackRate),
                <>
                  <div style={{ display: "flex" }}>
                    {renderStars(ele?.FeedbackRate)}
                    <span className="ml-4" style={{ fontWeight: "bold" }}>
                      {getLabel(ele?.FeedbackRate)}
                    </span>
                  </div>{" "}
                </>
              ),
              "Feedback Comment": (
                <>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Tooltip label={ele?.FeedbackComment}>
                      <span
                        id={`Content-${index}`}
                        targrt={`Content-${index}`}
                        style={{ textAlign: "center" }}
                      >
                        {shortenName(ele?.FeedbackComment)}
                      </span>
                    </Tooltip>
                    {ele?.FeedbackComment && (
                      <i
                        className="fa fa-eye"
                        onClick={() => {
                          setVisible({
                            smsVisible: true,
                            showData: ele,
                            ele,
                          });
                        }}
                      ></i>
                    )}
                  </div>
                </>
              ),
              "Feedback Date": ele.dtFeedback
                ? new Date(ele.dtFeedback).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "",
              Email: ele?.ToEmailID,
              Mobile: ele?.MobileNo,
              Content: ele?.Content,
              "Log Details": (
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
              Action: ele?.IsFeedback !== 1 && (
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
export default FeedbackList;
