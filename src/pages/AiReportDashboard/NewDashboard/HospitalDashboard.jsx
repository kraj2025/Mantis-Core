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
import { AIReportsAIClientDetails } from "../chatapi";
import moment from "moment";
import PatientVisitAI from "./Modals/PatientVisitAI";
import TransactionHistory from "./Modals/TransactionHistory";
import AddCreditsModal from "./Modals/AddCreditsModal";
import SettingsModal from "./Modals/SettingsModal";
import RateCardMasterModal from "./Modals/RateCardMasterModal";
import DatePicker from "../../../components/formComponent/DatePicker";
import { RateCardSVg } from "../../../utils/SVGICON";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import Modal from "../../../components/modalComponent/Modal";
import PatientVisitAIToday from "./Modals/PatientVisitAIToday";
import PatientVisitAIRangePeriod from "./Modals/PatientVisitAIRangePeriod";
import PatientVisitAIQuestionPeriod from "./Modals/PatientVisitAIQuestionPeriod";
import { axiosInstances } from "../../../networkServices/axiosInstance";
const HospitalDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(15);
  const [fromDate, setFromDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 15))
  );
  // e2d141b29e54b236424a42d7282fa415
  const [toDate, setToDate] = useState(new Date());
  const [apiURL, setApiURL] = useState("");
  const [dashboardData, setDashboardData] = useState([]);

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

  const [tableData, setTableData] = useState([]);

  const handleAiDetails = () => {
    axiosInstances
      .post(apiUrls.AIClientDashboard, {
        clientCode: "REACT2025e8d7c6b5a4f3e2d1c0b",
      })
      .then((res) => {
        setTableData(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const getAIClientOpeningAPI = () => {
    axiosInstances
      .post(apiUrls.AIClientOpening, {
        clientCode: "REACT2025e8d7c6b5a4f3e2d1c0b",
        asOnDate: moment(new Date()).format("YYYY-MM-DD"),
        isCurrent: "1",
      })
      .then((res) => {
        setDashboardData(res.data.data);
      })
      .catch((err) => console.log(err));
  };
  const [type1, setType1] = useState([]);
  const [type2, setType2] = useState([]);
  const [type3, setType3] = useState([]);
  const [type4, setType4] = useState([]);

  const AIClientDashboardAPIType1 = () => {
    axiosInstances
      .post(apiUrls.AIClientDashboard, {
        clientCode: "REACT2025e8d7c6b5a4f3e2d1c0b",
        type: "1",
        requestID: "1",
        patientID: "1",
        fromDate: moment(fromDate).format("YYYY-MM-DD"),
        toDate: moment(toDate).format("YYYY-MM-DD"),
        queryRequest: "1",
      })
      .then((res) => {
        setType1(res.data.data);
      })
      .catch((err) => console.log(err));
  };
  const AIClientDashboardAPIType2 = () => {
    axiosInstances
      .post(apiUrls.AIClientDashboard, {
        clientCode: "REACT2025e8d7c6b5a4f3e2d1c0b",
        type: "2",
        requestID: "1",
        patientID: "1",
        fromDate: moment(fromDate).format("YYYY-MM-DD"),
        toDate: moment(toDate).format("YYYY-MM-DD"),
        queryRequest: "1",
      })
      .then((res) => {
        setType2(res.data.data);
      })
      .catch((err) => console.log(err));
  };
  const AIClientDashboardAPIType3 = () => {
    axiosInstances
      .post(apiUrls.AIClientDashboard, {
        clientCode: "REACT2025e8d7c6b5a4f3e2d1c0b",
        type: "3",
        requestID: "1",
        patientID: "1",
        fromDate: moment(fromDate).format("YYYY-MM-DD"),
        toDate: moment(toDate).format("YYYY-MM-DD"),
        queryRequest: "1",
      })
      .then((res) => {
        setType3(res.data.data);
      })
      .catch((err) => console.log(err));
  };
  const AIClientDashboardAPIType4 = () => {
    axiosInstances
      .post(apiUrls.AIClientDashboard, {
        clientCode: "REACT2025e8d7c6b5a4f3e2d1c0b",
        type: "4",
        requestID: "1",
        patientID: "1",
        fromDate: moment(fromDate).format("YYYY-MM-DD"),
        toDate: moment(toDate).format("YYYY-MM-DD"),
        queryRequest: "1",
      })
      .then((res) => {
        setType4(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    handleAiDetails();
    getAIClientOpeningAPI();
    // AIClientDashboardAPIType1();
    // AIClientDashboardAPIType2();
    // AIClientDashboardAPIType3();
    // AIClientDashboardAPIType4();
  }, []);
  const [visible, setVisible] = useState({
    showVisible: false,
    removeVisible: false,
    gmailVisible: false,
    emailVisible: false,
    creditVisible: false,
    transactionVisible: false,
    settingsVisible: false,
    ratecardVisible: false,
    showData: {},
  });

  useEffect(() => {
    if (fromDate) {
      AIClientDashboardAPIType1(fromDate);
      AIClientDashboardAPIType2(fromDate);
      AIClientDashboardAPIType3(fromDate);
      AIClientDashboardAPIType4(fromDate);
    }
  }, [fromDate]);
  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Today's Patients in AI"
        >
          <PatientVisitAIToday
            visible={visible}
            setVisible={setVisible}
            type2={type2}
            fromDate={fromDate}
            toDate={toDate}
          />
        </Modal>
      )}
      {visible?.removeVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Range Period Patients in AI"
        >
          <PatientVisitAIRangePeriod
            visible={visible}
            setVisible={setVisible}
            fromDate={fromDate}
            toDate={toDate}
          />
        </Modal>
      )}
      {visible?.gmailVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Today's Questions in AI"
        >
          <PatientVisitAI
            visible={visible}
            setVisible={setVisible}
            fromDate={fromDate}
            toDate={toDate}
          />
        </Modal>
      )}
      {visible?.emailVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Range Period Questions in AI"
        >
          <PatientVisitAIQuestionPeriod
            visible={visible}
            setVisible={setVisible}
            fromDate={fromDate}
            toDate={toDate}
          />
        </Modal>
      )}
      {visible?.creditVisible && (
        <Modal
          modalWidth={"500px"}
          visible={visible}
          setVisible={setVisible}
          Header="Add Credits"
        >
          <AddCreditsModal
            visible={visible}
            setVisible={setVisible}
            clientCode={"617c6783237cce08f9198d57cbb0a90b"}
            PerCreditTokenCost={dashboardData?.PerCreditTokenCost}
          />
        </Modal>
      )}
      {visible?.transactionVisible && (
        <Modal
          modalWidth={"1000px"}
          visible={visible}
          setVisible={setVisible}
          Header="Transaction History"
        >
          <TransactionHistory visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.settingsVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Settings"
        >
          <SettingsModal
            visible={visible}
            setVisible={setVisible}
            handleAiDetails={handleAiDetails}
          />
        </Modal>
      )}
      {visible?.ratecardVisible && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header="Rate Card"
        >
          <RateCardMasterModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
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
                      height={"20vh"}
                      width={"40vh"}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h1 className="hospital-title">{tableData[0]?.name}</h1>
                <p className="hospital-subtitle">AI Dashboard</p>
              </div>
            </div>

            <div className="header-actions">
              <div className="credit-display">
                Credit :{" "}
                <span className="ml-0">
                  {dashboardData ? dashboardData : 0}
                </span>
              </div>
              <button
                className="action-button"
                onClick={() => {
                  setVisible({
                    creditVisible: true,
                  });
                }}
                style={{
                  marginLeft: "10px",
                  color: "red",
                  cursor: "pointer",
                }}
              >
                <CreditCard size={16} />
                Add Credit
              </button>
              <button
                className="action-button"
                onClick={() => {
                  setVisible({
                    transactionVisible: true,
                  });
                }}
                style={{
                  marginLeft: "10px",
                  color: "red",
                  cursor: "pointer",
                }}
              >
                <History size={16} />
                Credit History
              </button>
              <button
                className="action-button"
                onClick={() => {
                  setVisible({
                    settingsVisible: true,
                  });
                }}
                style={{
                  marginLeft: "10px",
                  color: "red",
                  cursor: "pointer",
                }}
              >
                <Settings size={16} />
                Settings
              </button>
              <button
                className="action-button"
                onClick={() => {
                  setVisible({
                    ratecardVisible: true,
                  });
                }}
                style={{
                  marginLeft: "10px",
                  color: "red",
                  cursor: "pointer",
                }}
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
              <button className="metric-card">
                <div className="card-content">
                  <div className="card-info">
                    <h3 className="card-title card-title-blue">
                      Today's Patients in AI
                    </h3>

                    <div className="card-metric">
                      {type1[0]?.TotalVisit || 0}
                    </div>
                    <p className="card-description card-description-blue">
                      Total AI patient visits for today. Click to view details.
                    </p>
                  </div>
                  <div className="card-icon card-icon-blue">
                    <Users
                      size={20}
                      className="card-title-blue mr-2"
                      onClick={() => {
                        setVisible({
                          showVisible: true,
                        });
                      }}
                      style={{
                        marginLeft: "10px",
                        color: "red",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>
              </button>

              <button className="metric-card">
                <div className="card-content">
                  <div className="card-info">
                    <h3 className="card-title card-title-blue">
                      Range Period Patients in AI
                    </h3>
                    <div className="card-metric">
                      {type2[0]?.TotalVisit || 0}
                    </div>
                    <p className="card-description card-description-blue">
                      Total AI patient visits for Range Period. Click to view
                      details.
                    </p>
                  </div>
                  <div className="card-icon card-icon-blue">
                    <Users
                      size={20}
                      className="card-title-blue mr-2"
                      onClick={() => {
                        setVisible({
                          removeVisible: true,
                        });
                      }}
                      style={{
                        marginLeft: "10px",
                        color: "red",
                        cursor: "pointer",
                      }}
                    />
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
              <button className="metric-card">
                <div className="card-content">
                  <div className="card-info">
                    <h3 className="card-title card-title-green">
                      Today's Questions in AI
                    </h3>
                    <div className="card-metric">
                      {type3[0]?.TotalVisit || 0}
                    </div>
                    <p className="card-description card-description-green">
                      Total questions asked today. Click to view details.
                    </p>
                  </div>
                  <div className="card-icon card-icon-green">
                    <MessageSquare
                      size={20}
                      className="card-title-green mr-2"
                      onClick={() => {
                        setVisible({
                          gmailVisible: true,
                        });
                      }}
                      style={{
                        marginLeft: "10px",
                        color: "red",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>
              </button>

              <button className="metric-card">
                <div className="card-content">
                  <div className="card-info">
                    <h3 className="card-title card-title-green">
                      Range Period Questions in AI
                    </h3>
                    <div className="card-metric">
                      {type4[0]?.TotalVisit || 0}
                    </div>
                    <p className="card-description card-description-green">
                      Total Range Period asked for yesterday. Click to view
                      details.
                    </p>
                  </div>
                  <div className="card-icon card-icon-green">
                    <MessageSquare
                      size={20}
                      className="card-title-green mr-2"
                      onClick={() => {
                        setVisible({
                          emailVisible: true,
                        });
                      }}
                      style={{
                        marginLeft: "10px",
                        color: "red",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default HospitalDashboard;
