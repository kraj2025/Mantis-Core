"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  CreditCard,
  History,
  LogOut,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";
import "./dashboard.css";
// import logo from "../../assets/image/logo.png";
import logo from "../../../assets/image/logo-itdose.png";
import {
  AIClientLedgerAPI,
  AIClientOpeningAPI,
  AIReportsAIClientDetails,
} from "../chatapi";
import axios from "axios";

import moment from "moment";
import Modal from "../../../components/modalComponent/Modal";
import PatientVisitAI from "./Modals/PatientVisitAI";
import TransactionHistory from "./Modals/TransactionHistory";
import AddCreditsModal from "./Modals/AddCreditsModal";
import SettingsModal from "./Modals/SettingsModal";
import RateCardMasterModal from "./Modals/RateCardMasterModal";

import DatePicker from "../../../components/formComponent/DatePicker";
import { RateCardSVg } from "../../../utils/SVGICON";

const HospitalDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(15);
  const [fromDate, setFromDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 15))
  );
  // e2d141b29e54b236424a42d7282fa415
  const [toDate, setToDate] = useState(new Date());
  const [apiURL, setApiURL] = useState("");
  const [dashboardDetail, setDashboardDetail] = useState({
    clientCode: "617c6783237cce08f9198d57cbb0a90b",
  });
  const [dashboardData, setDashboardData] = useState({});

  const periods = [
    { name: "Current Date", value: 0 },
    { name: "Last 7 Days", value: 7 },
    { name: "Last 15 Days", value: 15 },
    { name: "Last 30 Days", value: 30 },
  ];

  const [modalData, setModalData] = useState({
    show: false,
    component: null,
    size: null,
    header: null,
    footer: <></>,
  });

  const getAPIURL = async (clientCode = "617c6783237cce08f9198d57cbb0a90b") => {
    const apiResp = await AIReportsAIClientDetails(clientCode);
    debugger;
    if (apiResp?.success) {
      setDashboardData((val) => ({
        ...val,
        ClientName: apiResp?.data[0]?.ClientName,
        PerCreditTokenCost: apiResp?.data[0]?.PerCreditTokenCost,
        IsOpenQuestionAllow: apiResp?.data[0]?.IsOpenQuestionAllow,
        MaximumQuestionAllow: apiResp?.data[0]?.MaximumQuestionAllow,
        // PerCreditTokenCost: apiResp?.data[0]?.PerCreditTokenCost,
      }));
      setApiURL(apiResp?.data[0]?.EndPointURL);
      // setApiURL("http://175.176.185.254:2001/");
    }
    return apiResp?.data[0];
  };

  const openCreditHistory = async () => {
    setModalData({
      show: true,
      component: (
        <TransactionHistory
          apiType={2}
          clientCode={"617c6783237cce08f9198d57cbb0a90b"}
          setModalData={setModalData}
        />
      ),
      size: "90vw",
      header: "Transaction History",
      footer: <></>,
    });
  };

  const handleCloseModal = () => {
    getAIClientOpeningAPI();
    setModalData({ show: false });
  };
  const openCredit = async () => {
    // debugger
    setModalData({
      show: true,
      component: (
        <AddCreditsModal
          clientCode={"617c6783237cce08f9198d57cbb0a90b"}
          PerCreditTokenCost={dashboardData?.PerCreditTokenCost}
          setModalData={handleCloseModal}
        />
      ),
      size: "35vw",
      header: "Add Credits",
      footer: <></>,
    });
  };

  const getAIClientOpeningAPI = async () => {
    const creditPayload = {
      clientCode: "617c6783237cce08f9198d57cbb0a90b",
      asOnDate: moment(new Date()).format("YYYY-MM-DD"),
      isCurrent: 1,
    };
    const apiResp = await AIClientOpeningAPI(creditPayload);
    if (apiResp?.success) {
      setDashboardData((val) => ({ ...val, Credit: apiResp?.data }));
    }
  };

  useEffect(() => {
    getAPIURL();
    getAIClientOpeningAPI();
  }, []);

  async function AIClientDashboardAPI(type, from = fromDate, to = toDate) {
    // type=1,2,4,5 only pass clientCode and date
    // type=3 patientid dynamic, query=""
    // type=6  query dynamic , patientid=""
    const payload = {
      type: type,
      clientCode: "617c6783237cce08f9198d57cbb0a90b",
      requestID: "",
      patientID: "",
      fromDate: moment(from).format("YYYY-MM-DD"),
      toDate: moment(to).format("YYYY-MM-DD"),
      queryRequest: "",
    };
    const apiResp = await axios.post(
      `${apiURL}LabReport/AIClientDashboard`,
      payload
    );
    return apiResp?.data;
  }

  useEffect(() => {
    async function fetchData() {
      if (!apiURL) return;

      const apiResp = await AIClientDashboardAPI(1, new Date(), new Date());

      if (apiResp?.success) {
        setDashboardDetail((val) => ({
          ...val,
          Type01: apiResp?.data,
        }));
      }
      const apiResp2 = await AIClientDashboardAPI(1, fromDate, toDate);

      if (apiResp2?.success) {
        setDashboardDetail((val) => ({
          ...val,
          Type02: apiResp2?.data,
        }));

        const apiResp3 = await AIClientDashboardAPI(4, new Date(), new Date());
        if (apiResp3?.success) {
          setDashboardDetail((val) => ({
            ...val,
            Type03: apiResp3?.data,
          }));
        }

        const apiResp4 = await AIClientDashboardAPI(4, fromDate, toDate);
        if (apiResp4?.success) {
          setDashboardDetail((val) => ({
            ...val,
            Type04: apiResp4?.data,
          }));
        }
      }
    }

    fetchData();
  }, [apiURL, fromDate, toDate]);

  return (
    <div className="hospital-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-container">
          <div className="hospital-branding">
            <div className="hospital-logo">
              <div className="">
                <div className="">
                  <img
                    // src="../../../public/img/MOH.png"
                    src={logo}
                    alt="Logo"
                    height={"30vh"}
                  />
                </div>
              </div>
            </div>
            <div>
              <h1 className="hospital-title">{dashboardData?.ClientName}</h1>
              <p className="hospital-subtitle">AI Dashboard</p>
            </div>
          </div>

          <div className="header-actions">
            <div className="credit-display">
              Credit: {dashboardData?.Credit ? dashboardData?.Credit : 0}
            </div>
            <button className="action-button" onClick={openCredit}>
              <CreditCard size={16} />
              Add Credit
            </button>
            <button className="action-button" onClick={openCreditHistory}>
              <History size={16} />
              Credit History
            </button>
            <button
              className="action-button"
              onClick={() =>
                setModalData({
                  show: true,
                  component: (
                    <SettingsModal
                      dashboardData={dashboardData}
                      getAPIURL={getAPIURL}
                      clientCode={dashboardDetail?.clientCode}
                    />
                  ),
                  size: "50vw",
                  header: "Settings",
                  footer: <></>,
                })
              }
            >
              <Settings size={16} />
              Settings
            </button>
            <button
              className="action-button"
              onClick={() =>
                setModalData({
                  show: true,
                  component: (
                    <RateCardMasterModal
                      dashboardData={dashboardData}
                      getAPIURL={getAPIURL}
                      clientCode={dashboardDetail?.clientCode}
                    />
                  ),
                  size: "35vw",
                  header: "Rate Card",
                  footer: <></>,
                })
              }
            >
              <RateCardSVg />
              Rate Card
            </button>
          </div>
        </div>
      </header>

      {/* Date Filter Section */}
      <div className="date-filter-section">
        <div className="filter-container">
          {periods.map((period) => (
            <button
              key={period?.value}
              onClick={() => (
                setSelectedPeriod(period?.value),
                setFromDate(
                  new Date(
                    new Date().setDate(new Date().getDate() - period?.value)
                  )
                ),
                setToDate(new Date())
              )}
              className={`period-button ${
                selectedPeriod === period?.value
                  ? "period-button-active"
                  : "period-button-inactive"
              }`}
            >
              {period?.name}
            </button>
          ))}

          <div className="date-picker-group">
            <DatePicker
              className="custom-calendar"
              placeholder=""
              lable="From Date" // Corrected to "lable"
              name="fromDate"
              id="From"
              value={fromDate}
              handleChange={(e) => setFromDate(e.target.value)}
            />
            <DatePicker
              className="custom-calendar"
              placeholder=""
              lable="To Date" // Corrected to "lable"
              name="toDate"
              id="toDate"
              value={toDate}
              handleChange={(e) => setToDate(e.target.value)}
            />
            {/* <span className="date-label">From</span>
                        <div className="date-input-wrapper">
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="date-input"
                                placeholder="Pick a date"
                            />
                            <Calendar size={16} className="date-icon" />
                        </div> */}

            {/* <span className="date-label">To</span>
                        <div className="date-input-wrapper">
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="date-input"
                                placeholder="Pick a date"
                            />
                            <Calendar size={16} className="date-icon" />
                        </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content-dashboard">
        {/* Section 1: Patient Visit in AI */}
        <section className="dashboard-section">
          <div className="section-header section-header-cyan">
            <h2 className="section-title">1. Patient Visit in AI</h2>
          </div>

          <div className="metrics-grid">
            <button
              className="metric-card"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setModalData({
                  show:
                    dashboardDetail?.Type01?.[0]?.TotalVisit > 0 ? true : false,
                  component: (
                    <PatientVisitAI
                      apiURL={apiURL}
                      apiType={2}
                      dashboardDetail={dashboardDetail}
                      fromDate={new Date()}
                      toDate={new Date()}
                      title="Today's Patients in AI"
                    />
                  ),
                  size: "70vw",
                  header: "Today's Patients in AI",
                  footer: <></>,
                });
                dashboardDetail?.Type01?.[0]?.TotalVisit <= 0
                  ? notify("No data available for today", "warn")
                  : null;
              }}
            >
              <div className="card-content">
                <div className="card-info">
                  <h3 className="card-title card-title-blue">
                    Today's Patients in AI
                  </h3>
                  <div className="card-metric">
                    {dashboardDetail?.Type01?.[0]?.TotalVisit ?? 0}
                  </div>
                  <p className="card-description card-description-blue">
                    Total AI patient visits for today. Click to view details.
                  </p>
                </div>
                <div className="card-icon card-icon-blue">
                  <Users size={20} className="card-title-blue" />
                </div>
              </div>
            </button>

            <button
              className="metric-card"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setModalData({
                  show:
                    dashboardDetail?.Type02?.[0]?.TotalVisit > 0 ? true : false,
                  component: (
                    <PatientVisitAI
                      apiURL={apiURL}
                      apiType={2}
                      dashboardDetail={dashboardDetail}
                      fromDate={fromDate}
                      toDate={toDate}
                      title="Range Period Patients in AI"
                    />
                  ),
                  size: "70vw",
                  header: "Range Period Patients in AI",
                  footer: <></>,
                });
                dashboardDetail?.Type02?.[0]?.TotalVisit <= 0
                  ? notify("No data available for today", "warn")
                  : null;
              }}
            >
              <div className="card-content">
                <div className="card-info">
                  <h3 className="card-title card-title-blue">
                    Range Period Patients in AI
                  </h3>
                  <div className="card-metric">
                    {dashboardDetail?.Type02?.[0]?.TotalVisit || 0}
                  </div>
                  <p className="card-description card-description-blue">
                    Total AI patient visits for Range Period. Click to view
                    details.
                  </p>
                </div>
                <div className="card-icon card-icon-blue">
                  <Users size={20} className="card-title-blue" />
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Section 2: Total Patient Question */}
        <section className="dashboard-section">
          <div className="section-header section-header-green">
            <h2 className="section-title">2. Total Patient Question</h2>
          </div>

          <div className="metrics-grid">
            <button
              className="metric-card"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setModalData({
                  show:
                    dashboardDetail?.Type03?.[0]?.TotalVisit > 0 ? true : false,
                  component: (
                    <PatientVisitAI
                      apiURL={apiURL}
                      apiType={5}
                      dashboardDetail={dashboardDetail}
                      fromDate={new Date()}
                      toDate={new Date()}
                      title="Today's Questions in AI"
                    />
                  ),
                  size: "large",
                  header: "Today's Questions in AI",
                  footer: <></>,
                });
                dashboardDetail?.Type03?.[0]?.TotalVisit <= 0
                  ? notify("No data available for today", "warn")
                  : null;
              }}
            >
              <div className="card-content">
                <div className="card-info">
                  <h3 className="card-title card-title-green">
                    Today's Questions in AI
                  </h3>
                  <div className="card-metric">
                    {dashboardDetail?.Type03?.[0]?.TotalVisit || 0}
                  </div>
                  <p className="card-description card-description-green">
                    Total questions asked today. Click to view details.
                  </p>
                </div>
                <div className="card-icon card-icon-green">
                  <MessageSquare size={20} className="card-title-green" />
                </div>
              </div>
            </button>

            <button
              className="metric-card"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setModalData({
                  show:
                    dashboardDetail?.Type04?.[0]?.TotalVisit > 0 ? true : false,
                  component: (
                    <PatientVisitAI
                      apiURL={apiURL}
                      apiType={5}
                      dashboardDetail={dashboardDetail}
                      fromDate={fromDate}
                      toDate={toDate}
                      title="Range Period Questions in AI"
                    />
                  ),
                  size: "large",
                  header: "Range Period Questions in AI",
                  footer: <></>,
                });
                dashboardDetail?.Type04?.[0]?.TotalVisit <= 0
                  ? notify("No data available for today", "warn")
                  : null;
              }}
            >
              <div className="card-content">
                <div className="card-info">
                  <h3 className="card-title card-title-green">
                    Range Period Questions in AI
                  </h3>
                  <div className="card-metric">
                    {dashboardDetail?.Type04?.[0]?.TotalVisit || 0}
                  </div>
                  <p className="card-description card-description-green">
                    Total Range Period asked for yesterday. Click to view
                    details.
                  </p>
                </div>
                <div className="card-icon card-icon-green">
                  <MessageSquare size={20} className="card-title-green" />
                </div>
              </div>
            </button>
          </div>
        </section>
      </div>
      {
        <Modal
          visible={modalData?.show}
          setVisible={() =>
            setModalData({
              show: false,
              component: null,
              size: null,
            })
          }
          modalWidth={modalData?.size}
          Header={modalData?.header}
          buttonName={modalData?.buttonName}
          modalData={modalData?.modalData}
          footer={modalData?.footer}
          handleAPI={modalData?.handleAPI}
        >
          {modalData?.component}
        </Modal>
      }
    </div>
  );
};

export default HospitalDashboard;
