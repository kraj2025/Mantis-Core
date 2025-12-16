import React, { useEffect, useRef, useState } from "react";
import Heading from "../components/UI/Heading";
import Welcome from "../components/WelComeCard/Welcome";
import SpeedometerChart from "../components/Dashboard/SpeedometerChart";
import Marque from "../components/UI/Marque";
import Loading from "../components/loader/Loading";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { toast } from "react-toastify";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import NewsDataDashboard from "./NewsDataDashboard";
import PerformanceByMonth from "../components/Dashboard/AttendanceDashboard";
import TaskChart from "../components/Dashboard/TaskChart";
import DeveloperTask from "../components/Dashboard/DeveloperTask";
import PendingAmountChart from "../components/Dashboard/PendingAmountChart";
import RecoveryChart from "./RecoveryChart";
import NewSalesChart from "./NewSalesChart";
import FeedbackMonthChart from "./FeedbackMonthChart";
import FeedbackByMonth from "./FeedbackByMonth";
import ConversionChart from "../components/Dashboard/ConversionChart";
import OldSaleChart from "./OldSaleChart";
import DashboardAgeingSheet from "./DashboardAgeingSheet";
import Modal from "../components/modalComponent/Modal";
import ReactSelect from "../components/formComponent/ReactSelect";
import BirthdayWishModal from "../components/UI/customTable/BirthdayWishModal";
import TicketsToWorkChart from "./TicketsToWorkChart";
import SpeedometerTable from "./SpeedometerTable";
import PerformanceVariationTable from "./PerformanceVariationTable";
import { useTranslation } from "react-i18next";
import PaidRequestChart from "../components/Dashboard/PaidRequestChart";
import FinancialOverviewChart from "./FinancialOverviewChart";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import TopClientRecoveryChart from "./TopClientRecoveryChart";
import FeedbackByQuarterChart from "./FeedbackByQuarterChart";
import DatePickerMonth from "../components/formComponent/DatePickerMonth";
import QuotationChartMonth from "../components/Dashboard/QuotationChartMonth";
import CurrentMonthChart from "./CurrentMonthChart";
import CoordinatoeTotalPending from "./CoordinatoeTotalPending";
import LandingVideoModal from "./LandingVideoModal";
import { useDispatch } from "react-redux";
import FlashPageModule from "./FlashPageModule";
import { axiosInstances } from "../networkServices/axiosInstance";

const CoordinatorDashboard = () => {
  const { memberID, developerSearchType, setToggleModal, ToggleModal } =
    useSelector((state) => state?.loadingSlice);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(setToggleModal(true));
  };
  const [selectedButton, setSelectedButton] = useState();
  const localdata = useLocalStorage("userData", "get");
  const [birthDayData, setBirthDayData] = useState([]);
  const [countData, setCountData] = useState([]);
  const [userWiseDashBoard, setUserWiseDashBoard] = useState([]);
  const [anniversary, setAnniverssary] = useState([]);
  const [newslist, setNewsList] = useState([]);
  const [tsalist, setTSAList] = useState([]);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [newsLetter, setNewsLetter] = useState([]);
  const [headSetName, setHeadSetName] = useState([]);
  const [payloadData, setPayLoadData] = useState({
    fromDate: new Date(),
    toDate: new Date(),
    selectDate: "1",
  });

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    viewType: "",
    chart: "Pie Chart",
    priorityType: "",
    isShow: false,
    App_ID: "",
    ApiData: [],
    Header: "",
    TimeDuration: null,
    component: null,
    modalWidth: null,
    viewTypeMonthWeek: "",
    FromDate: new Date(),
    Month: new Date(),
  });
  const { clientId } = useSelector((state) => state?.loadingSlice);

  const handleMonthYearChange = (name, e) => {
    const { value } = e.target;
    const date = new Date(value);
    const firstDateOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    setFormData({
      ...formData,
      currentMonth: firstDateOfMonth.getMonth() + 1,
      currentYear: firstDateOfMonth.getFullYear(),
    });

    handleMultiChart(firstDateOfMonth, memberID, developerSearchType);
  };
  const [t] = useTranslation();
  const [listVisible, setListVisible] = useState(false);
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });

  useEffect(() => {
    const today = new Date();
    const firstDateOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    handleMultiChart(firstDateOfMonth, memberID, developerSearchType);
  }, [memberID]);

  const handleDateChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

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

  const tooltipRef = useRef(false);
  const [registerModal, setRegisterModal] = useState({
    isShow: false,
    App_ID: "",
    ApiData: [],
    Header: "",
    TimeDuration: null,
    component: null,
    modalWidth: null,
  });
  const toggleLabels = () => {
    setShowLabels(!showLabels);
  };
  const date = new Date();
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-GB", options)
    .format(date)
    .replace(/\s/g, "-");
  const handleClickOutside = (event) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
      setShowLabels(false); // Close the tooltip if click is outside
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();
  const [show, setShow] = useState({
    MyView: false,
    ViewIssues: false,
    Reportissue: false,
  });
  const generateRandomColor = (numColors) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  };
  const handleHeightOfBirthDaycard = () => {
    return (
      document.getElementById("welcome_wrp")?.getBoundingClientRect().height -
      document.getElementById("birthdayHead")?.getBoundingClientRect().height
    );
  };
  // console.log("birtdatyfadaadaddaad", birthDayData);
  const handleHeightOfBirthDaycardApi = () => {
    axiosInstances
      .post(apiUrls.Birthday_Anniversary_Interface_Search, {
        searchType: String("Search"),
      })
      .then((res) => {
        setBirthDayData(res?.data?.data);
        // setBirthDayData(res?.data?.dt);
        setAnniverssary(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFirstDashboardCount = () => {
    axiosInstances
      .post(apiUrls.DevDashboard_Summary, {
        Title: String("Heads"),
        DeveloperID: String(memberID || "0"),
      })
      .then((res) => {
        setCountData(res.data.data.dtSummary[0]);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Wents wrong"
        );
      });
  };

  const [showLabels, setShowLabels] = useState(false);

  const [visible, setVisible] = useState({
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    show6: false,
    birthdayShow: false,
    speedometerShow: false,
    variationShow: false,
    ageingShow: false,
    oldSale: false,
    newSale: false,
    developerSale: false,
    recoverySale: false,
    showData: {},
  });

  // function getPosition() {
  //   if (state === "Pie Chart") {
  //     return { top: "10px", left: "25px" };
  //   } else {
  //     return { top: "10px", left: "60%" };
  //   }
  // }
  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const [filterdata, setFilterData] = useState([]);

  const handleMultiChart = (value, developerId, searchType) => {
    const lotus = moment(value).format("YYYY-MM-DD");

    const payload = {
      dtFrom: String(lotus || ""),
      DeveloperID: Number(developerId || ""),
      SearchType: Number(searchType === "" ? "0" : searchType),
    };

    axiosInstances
      .post(apiUrls?.CoorDashboard_Quotation_Month, payload)
      .then((res) => {
        setFilterData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // console.log("filterdara", filterdata);
  const getChart = (s, filterdata) => {
    // console.log("Pie Chart", s, filterdata);
    switch (s) {
      case "Pie Chart":
        return <QuotationChartMonth state={filterdata} />;
        break;
    }
  };

  const handleNews = () => {
    axiosInstances
      .post(apiUrls.Circular_News, {
        // IsFlash: String("0"),
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
      })
      .then((res) => {
        const data = res?.data?.data;
        setNewsList(res?.data?.data);
        if (data.some((item) => item.IsView === 0)) {
          setVisible(true); // Modal khol do
        } else {
          setVisible(false); // Modal band rakho
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTSAMarque = () => {
    // const form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append(
    //   "LoginName",
    //   useCryptoLocalStorage("user_Data", "get", "realname")
    // );

    // axios
    //   .post(apiUrls?.TSAMarque, form, { headers })
    axiosInstances
      .post(apiUrls.TSAMarque, {
        IsMaster: String(""),
      })
      .then((res) => {
        const response = res?.data?.data;

        setTSAList(response);
      })
      .catch((err) => {
        console.error("API Error:", err);
      });
  };

  const handleNewsModal = (item) => {
    // console.log(item);
    setRegisterModal((prev) => ({
      ...prev,
      isShow: true,
      Header: <>News</>,
      modalWidth: "60vw",
      component: <NewsDataDashboard data={item} />,
    }));
    handleCircularRead(item?.CircularUserID);
  };
  const [isClicked, setIsClicked] = useState(false);
  const handleThumbClick = (item1, item2, item3, item4, item5, item) => {
    if (isClicked) {
      toast.error("You already wished.");
      return;
    }
    // if ( item > 0) {
    //   toast.error("You already wished.");
    //   return;
    // }
    setLoading(true);

    axiosInstances
      .post(apiUrls.Birthday_Anniversary_Interface_Search, {
        searchType: String("WishesInsert"),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setIsClicked(true);
          handleHeightOfBirthDaycardApi();
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
  const handleCircularRead = (eleid) => {
    axiosInstances
      .post(apiUrls.GetTeamMember, {
        ID: Number(useCryptoLocalStorage("user_Data", "get", "ID")),
        CircularUserID: Number(eleid),
      })
      .then((res) => {
        // toast.success(res?.data?.message);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    handleFirstDashboardCount(memberID);
  }, [memberID]);

  useEffect(() => {
    handleHeightOfBirthDaycardApi();
    handleFirstDashboardCount();
    handleNews();
    handleTSAMarque();
  }, []);
  const [score, setScore] = useState([]);
  const getItem = (item) => {
    setScore(item);
  };

  const shouldShowModal = newslist.some((item) => item.IsView === 0);
  return (
    <>
      {/* {!ToggleModal && <LandingVideoModal onClose={() => handleClose()} />} */}

      {shouldShowModal && !ToggleModal && (
        <Modal
          modalWidth={"500px"}
          visible={visible}
          setVisible={setVisible}
          Header="New Module Details"
          closable={false}
        >
          <FlashPageModule
            visible={visible}
            setVisible={setVisible}
            onCloseInnerModal={handleNews}
          />
        </Modal>
      )}

      {registerModal.isShow && (
        <Modal
          visible={registerModal?.isShow}
          setVisible={() => {
            setRegisterModal({
              isShow: false,
              App_ID: "",
              ApiData: [],
              Header: "",
              TimeDuration: null,
              component: null,
            });
          }}
          modalWidth={registerModal?.modalWidth}
          Header={registerModal?.Header}
          footer={<></>}
        >
          {registerModal?.component}
        </Modal>
      )}
      {visible?.birthdayShow && (
        <Modal
          modalWidth={"300px"}
          visible={visible}
          setVisible={setVisible}
          tableData={birthDayData}
          Header="🎉 Heartfelt Wishes of Birthday & Anniversary 🎂"
        >
          <BirthdayWishModal
            visible={visible}
            setVisible={setVisible}
            tableData={birthDayData}
          />
        </Modal>
      )}
      {visible?.ageingShow && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="AgeingSheet Details"
        >
          <DashboardAgeingSheet visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.oldSale && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Open Sale/Dead Sale (Last 6 Month)"
        >
          <OldSaleChart visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.newSale && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="New Sale(Current Month)"
        >
          <NewSalesChart visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.developerSale && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Developer Avaibility Next 10 Days Planning"
        >
          <DeveloperTask visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.recoverySale && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Recovery Details"
        >
          <RecoveryChart visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.speedometerShow && (
        <Modal
          modalWidth={"700px"}
          visible={visible?.speedometerShow}
          setVisible={setVisible}
          tableData={visible?.showData}
          Header={t("Performance Details")}
        >
          <SpeedometerTable
            visible={visible?.speedometerShow}
            setVisible={setVisible}
            tableData={visible?.showData}
          />
        </Modal>
      )}
      {visible?.variationShow && (
        <Modal
          modalWidth={"400px"}
          visible={visible?.variationShow}
          setVisible={setVisible}
          tableData={visible?.showData}
          Header={t("Performance Variation Details")}
        >
          <PerformanceVariationTable
            visible={visible?.variationShow}
            setVisible={setVisible}
            tableData={visible?.showData}
          />
        </Modal>
      )}
      <div className="">
        {/* <Heading title={"Coordinator Dashboard"} isBreadcrumb={true} /> */}
        <div className="row">
          <div className="col-md-3 col-sm-6">
            <Welcome />
          </div>
          <div className="col-md-3 col-sm-6 mt-1">
            <div className="mainDashboardwrp">
              <div
                className="mainBox1"
                style={{ width: "100%", height: "auto", textAlign: "center" }}
              >
                <div
                  className="mainBox1"
                  style={{
                    width: "100%",
                    height: "144px",
                    textAlign: "center",
                  }}
                >
                  <div className="d-flex flex-wrap mainHeader">
                    <label className="ml-2 mt-1">
                      {t("Coordinator Performance")}
                    </label>
                    <label className="ml-2 mt-1">Score: {score}</label>
                    <i
                      className="fa fa-eye mr-1"
                      onClick={() => {
                        setVisible({ speedometerShow: true, showData: "" });
                      }}
                      title="Click to Show Performance"
                      style={{ cursor: "pointer" }}
                    ></i>
                    <div style={{ textAlign: "center", marginLeft: "33px" }}>
                      {/* <SpeedometerChart getItem={getItem} /> */}
                      <span>Coming Soon...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {tsalist[0]?.IsMarque == 0 ? (
            <div className="col-md-3 col-sm-6 d-flex birthDay-Box">
              <div className="row">
                <div className="col-sm-6" style={{ height: "142px" }}>
                  <div
                    className="birthdayHead d-flex justify-content-between"
                    id="birthdayHead"
                  >
                    <span style={{ fontWeight: 700, color: "red" }}>
                      {t("News List")}
                    </span>
                    {/* ({moment(payloadData?.fromDate).format("DD-MMM-YYYY")} -{" "}
                {moment(payloadData?.toDate).format("DD-MMM-YYYY")} ) */}
                  </div>
                  <div
                    style={{
                      padding: "2px",
                    }}
                  >
                    <Marque height={handleHeightOfBirthDaycard()}>
                      {newslist?.map((item, index) => (
                        <div
                          className="birthdayBody mt-2"
                          key={index}
                          onClick={() => handleNewsModal(item)}
                        >
                          <div
                            className="thread"
                            style={{
                              backgroundColor: generateRandomColor(),
                              fontSize: "10px",
                              padding: "2px 5px",
                              borderRadius: "0px 5px 5px 0px",
                              display: "inline",
                              color: "black",
                              fontWeight: "600",
                            }}
                          >
                            {item?.Subject}
                          </div>
                          <div className="d-flex justify-content-between p-2">
                            <div className="deatils">
                              <div style={{ fontWeight: 800 }}>
                                <svg
                                  width="20"
                                  height="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="12"
                                    cy="8"
                                    r="4"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                  <path
                                    d="M4 20C4 15.5817 7.58172 12 12 12C16.4183 12 20 15.5817 20 20"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                </svg>{" "}
                                {item?.CreatedBy}
                              </div>
                              <div style={{ color: "green" }}>
                                <svg
                                  width="24"
                                  height="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13h-1v6h6v-1h-5z"
                                    fill="currentColor"
                                  />
                                </svg>
                                {item?.dtEntry}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: "blue" }}>
                                <svg
                                  width="24"
                                  height="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13h-1v6h6v-1h-5z"
                                    fill="currentColor"
                                  />
                                </svg>{" "}
                                {/* {item?.dtFrom} */}
                              </div>
                              <div style={{ color: "red" }}>
                                <svg
                                  width="24"
                                  height="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13h-1v6h6v-1h-5z"
                                    fill="currentColor"
                                  />
                                </svg>
                                {/* {item?.dtTo} */}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Marque>
                  </div>
                </div>
                <div className="col-sm-6 birthDay " style={{ height: "142px" }}>
                  <div
                    className="birthdayHead d-flex justify-content-between"
                    id="birthdayHead"
                  >
                    <span style={{ fontWeight: 700, color: "blue" }}>
                      {t("TSA")}
                    </span>
                    {/* ({moment(payloadData?.fromDate).format("DD-MMM-YYYY")} -{" "}
                {moment(payloadData?.toDate).format("DD-MMM-YYYY")} ) */}
                  </div>
                  <div
                    style={{
                      padding: "2px",
                    }}
                  >
                    <Marque height={handleHeightOfBirthDaycard()}>
                      {tsalist?.map((item, index) => (
                        <div
                          className="birthdayBody mt-2"
                          key={index}
                          onClick={() => handleNewsModal(item)}
                        >
                          <div
                            className="thread"
                            style={{
                              backgroundColor: generateRandomColor(),
                              fontSize: "10px",
                              padding: "2px 5px",
                              borderRadius: "0px 5px 5px 0px",
                              display: "inline",
                              color: "black",
                              fontWeight: "600",
                              wordBreak: "break-word", // Helps wrap words in case needed
                              maxWidth: "100%", // Ensure wrapping works within container
                              whiteSpace: "pre-wrap", // Keeps line breaks
                            }}
                          >
                            {item?.Message?.match(/.{1,10}/g)?.join("")}
                          </div>
                        </div>
                      ))}
                    </Marque>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-md-3 col-sm-6 birthDay-Box">
              <div
                className="birthdayHead d-flex justify-content-between"
                id="birthdayHead"
              >
                <span style={{ fontWeight: 700, color: "red" }}>
                  {t("News List")}
                </span>
                ({" "}
                {moment(payloadData?.fromDate)
                  .startOf("month")
                  .format("DD-MMM-YYYY")}
                - {moment(payloadData?.toDate).format("DD-MMM-YYYY")} )
              </div>
              <div
                style={{
                  padding: "2px",
                }}
              >
                <Marque height={handleHeightOfBirthDaycard()}>
                  {newslist?.map((item, index) => (
                    <div
                      className="birthdayBody mt-2"
                      key={index}
                      onClick={() => handleNewsModal(item)}
                    >
                      <div
                        className="thread"
                        style={{
                          backgroundColor: generateRandomColor(),
                          fontSize: "10px",
                          padding: "2px 5px",
                          borderRadius: "0px 5px 5px 0px",
                          display: "inline",
                          color: "black",
                          fontWeight: "600",
                        }}
                      >
                        {item?.Subject}
                      </div>
                      <div className="d-flex justify-content-between p-2">
                        <div className="deatils">
                          <div style={{ fontWeight: 800 }}>
                            <svg
                              width="20"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="12"
                                cy="8"
                                r="4"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                              />
                              <path
                                d="M4 20C4 15.5817 7.58172 12 12 12C16.4183 12 20 15.5817 20 20"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                              />
                            </svg>{" "}
                            {item?.CreatedBy}
                          </div>
                          <div style={{ color: "green" }}>
                            <svg
                              width="24"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13h-1v6h6v-1h-5z"
                                fill="currentColor"
                              />
                            </svg>
                            {item?.dtEntry}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: "blue" }}>
                            <svg
                              width="24"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13h-1v6h6v-1h-5z"
                                fill="currentColor"
                              />
                            </svg>{" "}
                            {item?.dtFrom}
                          </div>
                          <div style={{ color: "red" }}>
                            <svg
                              width="24"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13h-1v6h6v-1h-5z"
                                fill="currentColor"
                              />
                            </svg>
                            {item?.dtTo}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Marque>
              </div>
            </div>
          )}

          <div className="col-md-3 col-sm-6">
            <div className="birthDay-Box" style={{ height: "142px" }}>
              <div
                className="birthdayHead d-flex justify-content-between"
                id="birthdayHead"
              >
                <span style={{ fontWeight: 900, color: "#f224b4" }}>
                  {t("BirthDay List / Work Anniversary")}
                </span>
                ({formattedDate})
              </div>
              <div
                style={{
                  padding: "2px",
                  display: "flex",
                }}
              >
                <Marque height={handleHeightOfBirthDaycard()}>
                  {birthDayData?.map((item, index) => (
                    <div className="birthdayBody mt-2" key={index}>
                      <div
                        className="thread"
                        style={{
                          backgroundColor: generateRandomColor(),
                          fontSize: "10px",
                          padding: "2px 5px",
                          borderRadius: "0px 5px 5px 0px",
                          display: "inline",
                          color: "black",
                          fontWeight: "600",
                        }}
                      >
                        {item?.Designation}
                      </div>
                      <div
                        className="thread"
                        style={{
                          backgroundColor: generateRandomColor(),
                          fontSize: "10px",
                          padding: "2px 5px",
                          borderRadius: "0px 5px 5px 0px",
                          display: "inline",
                          color: "black",
                          fontWeight: "600",
                        }}
                      >
                        {item?.Type}
                      </div>
                      <div className="d-flex justify-content-between p-2">
                        <div className="deatils d-flex">
                          <div style={{ fontWeight: 800 }}>{item?.EmpName}</div>
                          <div className="ml-1">
                            {item?.Birthday}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 64 64"
                              width="20"
                              height="20"
                            >
                              <rect
                                x="10"
                                y="30"
                                width="44"
                                height="20"
                                rx="4"
                                ry="4"
                                fill="#FFB74D"
                              />

                              <path
                                d="M10 30 Q16 24, 22 30 T32 30 T42 30 T54 30"
                                fill="#FFCC80"
                              />

                              <rect
                                x="18"
                                y="16"
                                width="4"
                                height="14"
                                fill="#90CAF9"
                              />
                              <rect
                                x="30"
                                y="16"
                                width="4"
                                height="14"
                                fill="#90CAF9"
                              />
                              <rect
                                x="42"
                                y="16"
                                width="4"
                                height="14"
                                fill="#90CAF9"
                              />

                              <circle cx="20" cy="14" r="2" fill="#FFEB3B" />
                              <circle cx="32" cy="14" r="2" fill="#FFEB3B" />
                              <circle cx="44" cy="14" r="2" fill="#FFEB3B" />

                              <rect
                                x="10"
                                y="40"
                                width="44"
                                height="4"
                                fill="#F57C00"
                              />
                              <rect
                                x="10"
                                y="44"
                                width="44"
                                height="6"
                                fill="#EF6C00"
                              />

                              <rect
                                x="8"
                                y="50"
                                width="48"
                                height="4"
                                rx="2"
                                ry="2"
                                fill="#BDBDBD"
                              />
                            </svg>
                          </div>
                          {loading ? (
                            <Loading />
                          ) : (
                            <>
                              <div style={{ display: "flex" }}>
                                <i
                                  className="fa fa-thumbs-up ml-4 mt-1"
                                  style={{
                                    width: "17px",
                                    height: "17px",
                                    cursor: "pointer",
                                    color: isClicked ? "#0866ff" : "gray",
                                  }}
                                  onClick={() =>
                                    handleThumbClick(
                                      item?.Employee_ID,
                                      item?.EmpName,
                                      item?.CompanyEmail,
                                      item?.Type,
                                      item?.dtWish,
                                      item?.WishesCount
                                    )
                                  }
                                ></i>
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    marginLeft: "0px",
                                    border: "1px solid white",
                                    padding: "1px",
                                  }}
                                >
                                  {item.WishesCount}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              setVisible({
                                birthdayShow: true,
                                showData: "",
                              });
                            }}
                            className="btn btn-sm btn-primary"
                          >
                            {t("Wish")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </Marque>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 mt-1">
            <div className="mainDashboardwrp">
              <div
                className="mainBox1"
                style={{ width: "100%", height: "153px" }}
              >
                <div className="d-flex flex-wrap mainHeader">
                  {/* <label className="ml-2 mt-1">Recovery</label>
                  <i
                    className="fa fa-eye mr-2"
                    onClick={() => {
                      setVisible({ recoverySale: true, showData: "" });
                    }}
                  ></i> */}
                  <label className="ml-2 mt-1">{t("Recovery Chart")}</label>
                  <RecoveryChart />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 mt-1">
            <div className="mainDashboardwrp">
              <div
                className="mainBox1"
                style={{ width: "100%", height: "153px" }}
              >
                <div className="d-flex flex-wrap mainHeader">
                  <label className="ml-2">{t("New Sale")}</label>
                  <NewSalesChart />
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
                  <label className="ml-2">{t("Open Sale/Dead Sale")}</label>
                  <OldSaleChart />
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
                  <label className="ml-2">{t("Ageing Sheet")}</label>
                  <DashboardAgeingSheet />
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
                  <label className="ml-2 mt-1">
                    {t("Paid Request Status")}
                  </label>
                  <PaidRequestChart />
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
                  <label className="ml-2 ">Tickets To be Work</label>
                  <TicketsToWorkChart />
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
                  <label className="ml-2 ">Financial Year Summary</label>
                  <FinancialOverviewChart />
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
                  <label className="ml-2 ">Top Client Recovery</label>
                  <TopClientRecoveryChart />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 mt-3">
            <div className="mainDashboardwrp">
              <div
                className="mainBox1"
                style={{ width: "100%", height: "153px" }}
              >
                <div className="d-flex flex-wrap mainHeader">
                  <label className="ml-2 mt-1">Current Month Summary</label>
                  <CurrentMonthChart />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 mt-3">
            <div className="mainDashboardwrp">
              <div
                className="mainBox1"
                style={{ width: "100%", height: "153px" }}
              >
                <div className="d-flex flex-wrap mainHeader">
                  <label className="ml-2 ">Feedback By Quarter</label>
                  <FeedbackByQuarterChart />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 mt-3">
            <div
              className="mainDashboardwrp"
              style={{
                height: "153px",
                background: "white",
                borderRadius: "5px",
              }}
            >
              <div className="d-flex justify-content-between p-2">
                <label style={{ fontWeight: "bold", margin: "0px" }}>
                  {t("Quotation Chart")}
                </label>

                <DatePickerMonth
                  className="custom-calendar p-button-icon-onlycss"
                  id="Month"
                  name="Month"
                  lable="Month/Year"
                  placeholder={"MM/YY"}
                  respclass="col-xl-6 col-md-4 col-sm-6 col-12"
                  value={formData?.Month}
                  handleChange={(e) => handleMonthYearChange("Month", e)}
                />
              </div>
              <div className="d-flex px-2 pb-2">
                {/* <i
                    className="fa fa-eye"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setVisible({
                        ticketstatusShow: true,
                        showData: filterdata,
                      });
                    }}
                  ></i> */}
                <div
                  className="col-sm-12"
                  style={{
                    height: "140px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {getChart(formData?.chart, filterdata)}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-12 mt-3">
            <div className="mainDashboardwrp">
              <div
                className="mainBox1"
                style={{ width: "100%", height: "153px" }}
              >
                <div className="d-flex flex-wrap mainHeader">
                  <DeveloperTask />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 mt-1 d-none">
            <div className="mainDashboardwrp">
              <div
                className="mainBox1"
                style={{ width: "100%", height: "153px" }}
              >
                <div className="d-flex flex-wrap mainHeader">
                  {/* <label className="ml-2 mt-1">Pending Amount</label> */}
                  <PendingAmountChart />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-12 mt-1 d-none">
            <div className="mainDashboardwrp">
              <div
                className="mainBox1"
                style={{ width: "100%", height: "153px" }}
              >
                <div className="d-flex flex-wrap mainHeader">
                  <label className="ml-2 mt-1">Feedback Current Month</label>
                  <FeedbackMonthChart />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-12 mt-1 d-none">
            <div className="mainDashboardwrp">
              <div
                className="mainBox1"
                style={{ width: "100%", height: "153px" }}
              >
                <div className="d-flex flex-wrap mainHeader">
                  <label className="ml-2 mt-1">Feedback by Month</label>
                  <FeedbackByMonth />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 mt-1 d-none">
            <div className="mainDashboardwrp">
              <div
                className="mainBox1"
                style={{ width: "100%", height: "153px" }}
              >
                <div className="d-flex flex-wrap mainHeader">
                  <label className="ml-2 mt-1">Conversion by Quarter</label>
                  <ConversionChart />
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
                  <label className="ml-2 mt-1">
                    {t("Total Pending Balance")}
                  </label>
                  <CoordinatoeTotalPending />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CoordinatorDashboard;
