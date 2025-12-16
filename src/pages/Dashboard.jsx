import { useEffect, useRef, useState } from "react";
import Welcome from "../components/WelComeCard/Welcome";
import moment from "moment";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import Marque from "../components/UI/Marque";
import Modal from "../components/modalComponent/Modal";
import TodaysDeliveryList from "./TodaysDeliveryList";
import Chat2 from "../components/Dashboard/Chat2";
import TATBarChart from "../components/Dashboard/TatBarchart";
import PriorityTicketsChart from "../components/Dashboard/PriorityTicketsChart";
import ReopenedTicketList from "./ReopenedTicketList";
import DelayList from "./DelayList";
import TicketByStatus from "../components/Dashboard/TicketByStatus";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import OpenBugsList from "./OpenBugsList";
import SpeedometerChart from "../components/Dashboard/SpeedometerChart";
import NewsDataDashboard from "./NewsDataDashboard";
import { toast } from "react-toastify";
import ManagerEmployee from "../components/Dashboard/ManagerEmployee";
import AverageTime from "../components/Dashboard/AverageTime";
import BarChart from "../components/Dashboard/BarChart";
import RadarChart from "../components/Dashboard/RadarChart";
import PolarAreaChart from "../components/Dashboard/PolarAreaChart";
import Linechart from "../components/Dashboard/LineChart";
import SlideScreen from "./SlideScreen";
import SeeMoreSlideScreen from "../components/SearchableTable/SeeMoreSlideScreen";
import AmountSubmissionSeeMoreList from "../networkServices/AmountSubmissionSeeMoreList";
import PerformanceChart from "../components/Dashboard/PerformanceChart";
import DatePickerMonth from "../components/formComponent/DatePickerMonth";
import BirthdayWishModal from "../components/UI/customTable/BirthdayWishModal";
import { useSelector } from "react-redux";
import SpeedometerTable from "./SpeedometerTable";
import PerformanceVariationTable from "./PerformanceVariationTable";
import Loading from "../components/loader/Loading";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import TicketStatusTableDetails from "./TicketStatusTableDetails";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import LandingVideoModal from "./LandingVideoModal";
import { useDispatch } from "react-redux";
import FlashPageModule from "./FlashPageModule";
import { axiosInstances } from "../networkServices/axiosInstance";
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
const currentYear = currentDate.getFullYear();

const Dashboard = () => {
  const [t] = useTranslation();
  const localdata = useLocalStorage("userData", "get");
  const [birthDayData, setBirthDayData] = useState([]);
  const [countData, setCountData] = useState([]);

  const [anniversary, setAnniverssary] = useState([]);
  const [newslist, setNewsList] = useState([]);
  const { VITE_DATE_FORMAT } = import.meta.env;
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
    AssignedTo: "",
  });
  const { setToggleModal, ToggleModal } = useSelector(
    (state) => state?.loadingSlice
  );
  const [loader, setLoader] = useState(false);

  const handleMonthYearChange = (name, e) => {
    const { value } = e.target;
    const date = new Date(value);
    const firstDateOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    setFormData({
      ...formData,
      currentMonth: firstDateOfMonth.getMonth() + 1,
      currentYear: firstDateOfMonth.getFullYear(),
    });

    handleMultiChart(firstDateOfMonth, memberID);
  };

  const [listVisible, setListVisible] = useState(false);
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });

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
      setShowLabels(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleHeightOfBirthDaycardApi = () => {
    axiosInstances
      .post(apiUrls.Birthday_Anniversary_Interface_Search, {
        SearchType: String("Search"),
      })
      .then((res) => {
        setBirthDayData(res?.data?.data);
        // setBirthDayData(res?.data?.dt);
        setAnniverssary(res?.data?.dtAnniversary);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const { memberID } = useSelector((state) => state?.loadingSlice);

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
    ticketstatusShow: false,
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

  const handleMultiChart = (value, memberID) => {
    const datefrom = moment(value).format("YYYY-MM-DD");
    axiosInstances
      .post(apiUrls.DevDashboard_Welcome_Status_Count, {
        DeveloperID: String(memberID || "0"),
        dtFrom: String(datefrom),
      })
      .then((res) => {
        setFilterData(res?.data?.dtStatus);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getChart = (s, filterdata) => {
    switch (s) {
      case "Pie Chart":
        return <Chat2 state={filterdata} />;
        break;
      case "PolarArea Chart":
        return <PolarAreaChart state={filterdata} />;
        break;
      case "Radar Chart":
        return <RadarChart state={filterdata} />;
        break;
      case "Line Chart":
        return <Linechart state={filterdata} />;
        break;
      case "Bar Chart":
        return <BarChart state={filterdata} />;
        break;
    }
  };

  const handleNews = () => {
    axiosInstances
      .post(apiUrls.Circular_News, {
        // IsFlash: String("0"),
        // RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
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
        SearchType: String("WishesInsert"),
        ToEmployeeID: String(item1),
        ToEmployeeName: String(item2),
        ToEMailID: String(item3).toLowerCase(),
        WishesType: String(item4),
        Subject: String(
          `Greeting from ${useCryptoLocalStorage("user_Data", "get", "realname")}`
        ),
        Message: String(
          item4 == "Birthday" ? "Happy Birthday!" : "Happy Work Anniversary!"
        ),
        dtBirthday: String(item5),
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
      .post(apiUrls.Circular_Read, {
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
    const today = new Date();
    const firstDateOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    handleMultiChart(firstDateOfMonth, memberID);
  }, [memberID]);

  useEffect(() => {
    handleHeightOfBirthDaycardApi();
    handleFirstDashboardCount();
    handleNews();

    // handleCircularRead();

    // handleMultiChart()
  }, []);

  // useEffect(() => {
  //   const today = new Date();
  //   const firstDateOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  //   console.log("kamal",firstDateOfMonth)
  //   handleMultiChart(firstDateOfMonth);
  // }, []);

  const [score, setScore] = useState([]);

  const getItem = (item) => {
    setScore(item);
  };
  const RoleID = useCryptoLocalStorage("user_Data", "get", "RoleID");
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(setToggleModal(true));
  };
  const shouldShowModal = newslist.some((item) => item.IsView === 0);

  return (
    <>
      {/* <FlashPage /> */}
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
      {visible?.show1 && (
        <Modal
          modalWidth={"1000px"}
          visible={visible?.show1}
          setVisible={setVisible}
          tableData={visible?.showData}
          Header="Today's Delivery List"
        >
          <TodaysDeliveryList
            visible={visible?.show1}
            setVisible={setVisible}
            tableData={visible?.showData}
          />
        </Modal>
      )}
      {visible?.show2 && (
        <Modal
          modalWidth={"1000px"}
          visible={visible?.show2}
          setVisible={setVisible}
          tableData={visible?.showData}
          Header="Reopened List"
        >
          <ReopenedTicketList
            visible={visible?.show2}
            setVisible={setVisible}
            tableData={visible?.showData}
          />
        </Modal>
      )}
      {visible?.show3 && (
        <Modal
          modalWidth={"1000px"}
          visible={visible?.show3}
          setVisible={setVisible}
          tableData={visible?.showData}
          Header="Delayed List"
        >
          <DelayList
            visible={visible?.show3}
            setVisible={setVisible}
            tableData={visible?.showData}
          />
        </Modal>
      )}
      {/* {visible?.show4 && (
        <Modal
          modalWidth={"1000px"}
          visible={visible?.show4}
          setVisible={setVisible}
          tableData={visible?.showData}
          Header="Planned List"
        >
          <PlannedList
            visible={visible?.show4}
            setVisible={setVisible}
            tableData={visible?.showData}
          />
        </Modal>
      )} */}
      {/* {visible?.show5 && (
        <Modal
          modalWidth={"1000px"}
          visible={visible?.show5}
          setVisible={setVisible}
          tableData={visible?.showData}
          Header="Done On UAT List"
        >
          <DoneOnUatList
            visible={visible?.show5}
            setVisible={setVisible}
            tableData={visible?.showData}
          />
        </Modal>
      )} */}
      {visible?.show6 && (
        <Modal
          modalWidth={"1000px"}
          visible={visible?.show6}
          setVisible={setVisible}
          tableData={visible?.showData}
          Header="Open Bugs List"
        >
          <OpenBugsList
            visible={visible?.show6}
            setVisible={setVisible}
            tableData={visible?.showData}
          />
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
      {visible?.speedometerShow && (
        <Modal
          modalWidth={"700px"}
          visible={visible?.speedometerShow}
          setVisible={setVisible}
          tableData={visible?.showData}
          Header={t("Developer Performance")}
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
      {visible?.ticketstatusShow && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          tableData={filterdata}
          Header={t("Ticket Status Details")}
        >
          <TicketStatusTableDetails
            visible={visible}
            setVisible={setVisible}
            tableData={filterdata}
          />
        </Modal>
      )}

      {RoleID == 7 ? (
        <div className="col-12">
          <Welcome />
        </div>
      ) : (
        <div>
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
                  <div className="d-flex flex-wrap mainHeader">
                    <label className="ml-2 mt-1">
                      {t("Developer Performance")}
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
                  </div>
                  <div style={{ textAlign: "center", marginLeft: "33px" }}>
                    <SpeedometerChart getItem={getItem} />
                    {/* <SpeedometerChart  /> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="birthDay-Box" style={{ height: "142px" }}>
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
                  {/* ({moment().format("dddd, MMMM Do YYYY")}) */}
                </div>
                {/* {anniversary?.length>0 ? */}
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
                {/* : <div style={{textAlign:"center" ,height:"50px",widows:"200px"}}><img src={anniversary1} ></img></div>} */}
              </div>
            </div>

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
                {/* {birthDayData?.length>0 ?  */}
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
                            <div style={{ fontWeight: 800 }}>
                              {item?.EmpName}
                            </div>
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
                                      color:
                                        item?.WishesCount > 0
                                          ? "#0866ff"
                                          : "gray",
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
                                    {item?.WishesCount}
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
          </div>

          <div className="row">
            <div className="col-md-3 col-sm-12 ">
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
                    {t("Ticket Status")}
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
                  <i
                    className="fa fa-eye"
                    style={{ cursor: "pointer" }}
                    // onClick={toggleLabels}
                    onClick={() => {
                      setVisible({
                        ticketstatusShow: true,
                        showData: filterdata,
                      });
                    }}
                  ></i>

                  <div
                    className="col-sm-12"
                    style={{
                      height: "140px",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {/* {getChart(formData?.chart, filterdata)} */}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-sm-12">
              <div className="mainDashboardwrp">
                <div
                  className="mainBox1 p-3"
                  style={{ width: "100%", height: "153px" }}
                >
                  <div className="d-flex flex-wrap mainHeader">
                    <label style={{ fontWeight: "bold", margin: "0px" }}>
                      {t("Delay TAT Tickets")}
                    </label>
                    <div
                      className="chart-container mt-2"
                      style={{ width: "100%" }}
                    >
                      <TATBarChart />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {loader && memberID !== 0 && <Loading />}
            <div className="col-md-3 col-sm-12">
              <div className="mainDashboardwrp ">
                <div className="mainBox1" id="sda" style={{ height: "153px" }}>
                  <div className="mainBoxes">
                    <div
                      className="box1 box2d mt-2"
                      style={{ backgroundColor: "rgb(194, 223, 255)" }}
                    >
                      <div className="d-flex align-items-center justify-content-between mt-1">
                        <h4
                          style={{ color: "rgb(0, 0, 0)", fontWeight: "900" }}
                        >
                          {t("Delivery")}
                        </h4>

                        {/* <i
                          className="pi pi-list"
                          style={{
                            color: "red",
                            backgroundColor: "rgb(255, 245, 245)",
                            margin: "0px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setVisible({ show1: true, showData: "" });
                          }}
                          title="Click to Show List."
                        ></i> */}
                        {countData?.TodayDeliveryCount > 0 && (
                          <span style={{ height: "0px" }}>
                            <AmountSubmissionSeeMoreList
                              ModalComponent={ModalComponent}
                              isShowDropDown={false}
                              setSeeMore={setSeeMore}
                              data={{
                                ...countData,
                                type: "Delivery",
                                fiveDate: "5",
                                assigntovalue: "AssignCheck",
                                LotusAssign: memberID,
                              }}
                              setVisible={() => {
                                setListVisible(false);
                              }}
                              handleBindFrameMenu={[
                                {
                                  FileName: "View Issues",
                                  URL: "ViewIssues",
                                  FrameName: "ViewIssues",
                                  Description: "ViewIssues",
                                },
                              ]}
                              isShowPatient={true}
                            />
                          </span>
                        )}
                      </div>

                      <div className="align-items-center justify-content-between">
                        <h4 style={{ color: "rgb(0, 0, 0)" }}>
                          {t("Count")}:&nbsp;{countData?.TodayDeliveryCount}
                        </h4>
                        <h4 style={{ color: "rgb(0, 0, 0)" }}>
                          {t("Done")}:&nbsp;
                          {countData?.TodayDoneDeliveryCount ?? 0}
                        </h4>
                      </div>
                    </div>
                    <div
                      className="box1 box2d"
                      style={{ backgroundColor: "rgba(53, 234, 132, 0.2)" }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <h4 style={{ color: "rgb(0, 0, 0)" }}>{t("ReOpen")}</h4>
                        {/* <i
                          className="pi pi-list"
                          style={{
                            color: "red",
                            backgroundColor: "rgb(255, 245, 245)",
                            margin: "0px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setVisible({ show2: true, showData: "" });
                          }}
                          title="Click to Show List."
                        ></i> */}
                        {countData?.ReOpend > 0 && (
                          <span style={{ height: "0px" }}>
                            <AmountSubmissionSeeMoreList
                              ModalComponent={ModalComponent}
                              setSeeMore={setSeeMore}
                              data={{
                                ...countData,
                                type: "Reopen",
                                LotusAssign: memberID,
                              }}
                              setVisible={() => {
                                setListVisible(false);
                              }}
                              handleBindFrameMenu={[
                                {
                                  FileName: "View Issues",
                                  URL: "ViewIssues",
                                  FrameName: "ViewIssues",
                                  Description: "ViewIssues",
                                },
                              ]}
                              isShowPatient={true}
                            />
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="nameIcon d-flex align-items-center justify-content-between">
                          <h4 style={{ color: "rgb(0, 0, 0)" }}>
                            {t("Count")}:&nbsp;{countData?.ReOpend ?? 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div
                      className="box1 box2d"
                      style={{ backgroundColor: "#fcd5f5" }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <h4 style={{ color: "rgb(0, 0, 0)" }}>
                          {t("Delayed")}
                        </h4>
                        {/* <i
                          className="pi pi-list"
                          style={{
                            color: "red",
                            backgroundColor: "rgb(255, 245, 245)",
                            margin: "0px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setVisible({ show3: true, showData: "" });
                          }}
                          title="Click to Show List."
                        ></i> */}
                        {countData?.DelayDeliveryCount > 0 && (
                          <span style={{ height: "0px" }}>
                            <AmountSubmissionSeeMoreList
                              ModalComponent={ModalComponent}
                              isShowDropDown={false}
                              setSeeMore={setSeeMore}
                              data={{
                                ...countData,
                                type: "Delay",
                                DelayDate: "4",
                                assigntovalue: "AssignCheck",
                                LotusAssign: memberID,
                              }}
                              setVisible={() => {
                                setListVisible(false);
                              }}
                              handleBindFrameMenu={[
                                {
                                  FileName: "View Issues",
                                  URL: "ViewIssues",
                                  FrameName: "ViewIssues",
                                  Description: "ViewIssues",
                                },
                              ]}
                              isShowPatient={true}
                            />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="nameIcon d-flex align-items-center justify-content-between">
                          <h4 style={{ color: "rgb(0, 0, 0)" }}>
                            {t("Count")}:&nbsp;
                            {countData?.DelayDeliveryCount ?? 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div
                      className="box1 box2d"
                      style={{ backgroundColor: "hsl(22, 83.20%, 79.00%)" }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <h4 style={{ color: "rgb(0, 0, 0)" }}>
                          {t("Planned")}
                        </h4>
                        {/* <i
                          className="pi pi-list"
                          style={{
                            color: "red",
                            backgroundColor: "rgb(255, 245, 245)",
                            margin: "0px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setVisible({ show4: true, showData: "" });
                          }}
                          title="Click to Show List."
                        ></i> */}
                        {countData?.PlannedDeliveryCount > 0 && (
                          <span style={{ height: "0px" }}>
                            <AmountSubmissionSeeMoreList
                              isShowDropDown={false}
                              ModalComponent={ModalComponent}
                              setSeeMore={setSeeMore}
                              data={{
                                ...countData,
                                type: "Planned",
                                PlannedDate: "7",
                                assigntovalue: "AssignCheck",
                                LotusAssign: memberID,
                              }}
                              setVisible={() => {
                                setListVisible(false);
                              }}
                              handleBindFrameMenu={[
                                {
                                  FileName: "View Issues",
                                  URL: "ViewIssues",
                                  FrameName: "ViewIssues",
                                  Description: "ViewIssues",
                                },
                              ]}
                              isShowPatient={true}
                            />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="nameIcon d-flex align-items-center justify-content-between">
                          <h4 style={{ color: "rgb(0, 0, 0)" }}>
                            {t("Count")}:&nbsp;
                            {countData?.PlannedDeliveryCount ?? 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div
                      className="box1 box2d"
                      style={{ backgroundColor: "#9bfaf4" }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <h4 style={{ color: "rgb(0, 0, 0)" }}>
                          {t("DoneUAT")}
                        </h4>
                        {/* <i
                          className="pi pi-list"
                          style={{
                            color: "red",
                            backgroundColor: "rgb(255, 245, 245)",
                            margin: "0px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setVisible({ show5: true, showData: "" });
                          }}
                          title="Click to Show List."
                        ></i> */}
                        {countData?.DoneOnUATCount > 0 && (
                          <span style={{ height: "0px" }}>
                            <AmountSubmissionSeeMoreList
                              ModalComponent={ModalComponent}
                              isShowDropDown={false}
                              setSeeMore={setSeeMore}
                              data={{
                                ...countData,
                                type: "DoneUat",
                                LotusAssign: memberID,
                              }}
                              setVisible={() => {
                                setListVisible(false);
                              }}
                              handleBindFrameMenu={[
                                {
                                  FileName: "View Issues",
                                  URL: "ViewIssues",
                                  FrameName: "ViewIssues",
                                  Description: "ViewIssues",
                                },
                              ]}
                              isShowPatient={true}
                            />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="nameIcon d-flex align-items-center justify-content-between">
                          <h4 style={{ color: "rgb(0, 0, 0)" }}>
                            {t("Count")}:&nbsp;{countData?.DoneOnUATCount ?? 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div
                      className="box1 box2d"
                      style={{ backgroundColor: "rgb(255, 192, 203)" }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <h4 style={{ color: "rgb(0, 0, 0)" }}>{t("Bugs")}</h4>
                        {/* <i
                          className="pi pi-list"
                          style={{
                            color: "red",
                            backgroundColor: "rgb(255, 245, 245)",
                            margin: "0px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setVisible({ show6: true, showData: "" });
                          }}
                          title="Click to Show List."
                        ></i> */}
                        {countData?.OpenBugs > 0 && (
                          <span style={{ height: "0px" }}>
                            <AmountSubmissionSeeMoreList
                              ModalComponent={ModalComponent}
                              isShowDropDown={false}
                              setSeeMore={setSeeMore}
                              data={{
                                ...countData,
                                type: "OpenBugs",
                                assigntovalue: "AssignCheck",
                                LotusAssign: memberID,
                              }}
                              setVisible={() => {
                                setListVisible(false);
                              }}
                              handleBindFrameMenu={[
                                {
                                  FileName: "View Issues",
                                  URL: "ViewIssues",
                                  FrameName: "ViewIssues",
                                  Description: "ViewIssues",
                                },
                              ]}
                              isShowPatient={true}
                            />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="nameIcon d-flex align-items-center justify-content-between">
                          <h4 style={{ color: "rgb(0, 0, 0)" }}>
                            {t("Count")}:&nbsp;{countData?.OpenBugs ?? 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            </div>

            <div className="col-md-3 col-sm-12">
              <div className="mainDashboardwrp">
                <div
                  className="mainBox1 p-3"
                  style={{ width: "100%", height: "153px" }}
                >
                  <div className="d-flex flex-wrap mainHeader">
                    <label style={{ fontWeight: "bold", margin: "0px" }}>
                      {t("Open Tickets by Priority")}
                    </label>
                    {/* <ReactSelect
                      id="priorityType"
                      respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                      placeholderName="Type"
                      name="priorityType"
                      value={formData?.priorityType}
                      dynamicOptions={[
                        { label: "Weekly", value: "Weekly" },
                        { label: "Monthly", value: "Monthly" },
                      ]}
                      handleChange={handleDeliveryChange}
                    /> */}
                    <div
                      className="chart-container mt-2"
                      style={{ width: "100%" }}
                    >
                      <PriorityTicketsChart />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3 col-sm-6 mt-2">
              <div className="mainDashboardwrp">
                <div
                  className="mainBox1 p-3"
                  // style={{ width: "100%", height: "153px" }}
                >
                  <div className="d-flex flex-wrap mainHeader">
                    <label style={{ fontWeight: "bold", margin: "0px" }}>
                      {t("Month Vs Priority Resolution")}
                    </label>
                    <div
                    // className="chart-container mt-2"
                    // style={{ width: "100%" }}
                    >
                      <TicketByStatus />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mt-2">
              <div className="mainDashboardwrp">
                <div className="mainBox1 p-3">
                  <div className="d-flex flex-wrap mainHeader">
                    <label style={{ fontWeight: "bold", margin: "0px" }}>
                      {t("Month Vs Category Resolution")}
                    </label>
                    <div>
                      <ManagerEmployee />
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
                    <label style={{ fontWeight: "bold", margin: "0px" }}>
                      {t("Total Ticket Vs Total Working Hour")}
                    </label>
                    {/* <ReactSelect
                  id="viewTypeMonthWeek"
                  respclass="col-5"
                  placeholderName="Select"
                  name="viewTypeMonthWeek"
                  value={formData?.viewTypeMonthWeek}
                  dynamicOptions={[
                    { label: "Week Wise", value: "day" },
                    { label: "Month Wise", value: "month" },
                  ]}
                  handleChange={handleDeliveryChange}
                /> */}
                    <div
                      className="chart-container mt-2"
                      style={{ width: "100%" }}
                    >
                      <AverageTime />
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
                  <div className=" flex-wrap mainHeader">
                    <label style={{ fontWeight: "bold", margin: "0px" }}>
                      {t("Performance Variation")}
                    </label>
                    <i
                      className="fa fa-eye mr-4"
                      onClick={() => {
                        setVisible({ variationShow: true, showData: "" });
                      }}
                      title="Click to Show Performance"
                      style={{ cursor: "pointer" }}
                    ></i>
                    <div
                      className="chart-container mt-2"
                      style={{ width: "100%" }}
                    >
                      <PerformanceChart />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
