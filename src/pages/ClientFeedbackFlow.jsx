import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import { Button } from "react-bootstrap";
import Input from "../components/formComponent/Input";
import ReactSelect from "../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Loading from "../components/loader/Loading";
import "./ClientFeedbackFlow.css";
import ClientFeedbackSaleChart from "./ClientFeedbackSaleChart";
import { headers } from "../utils/apitools";
import ClientCategoryBreakdown from "../components/Dashboard/ClientCategoryBreakdown";
import {
  FaUser,
  FaBuilding,
  FaPhone,
  FaHashtag,
  FaStar,
  FaRegStar,
  FaRegCommentDots,
} from "react-icons/fa";
import DatePicker from "../components/formComponent/DatePicker";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import { apiUrls } from "../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import { inputBoxValidation } from "../utils/utils";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../utils/constant";
import moment from "moment";
import ClientFeddbackMsgModal from "./ClientFeddbackMsgModal";
import Modal from "../components/modalComponent/Modal";
import Tooltip from "./Tooltip";
import { axiosInstances } from "../networkServices/axiosInstance";

const ClientFeedbackFlow = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableReceiveFeedback, setTableReceivedFeedback] = useState([]);
  const [tableGoodFeedback3Month, settableGoodFeedback3Month] = useState([]);
  const [tableImogi, setTableImogi] = useState([]);
  const [tablereceived, setTableReceived] = useState([]);
  const [tableNotreceived, setTableNotReceived] = useState([]);

  const [formData, setFormData] = useState({
    RatingType: "0",
    CustomerName: "",
    CustomerPhone: "",
    CustomerEmail: "",
    Category: "0",
    SearchBy: "Last30Days",
    FromDate: "",
    ToDate: "",
    ProjectID: [],
    ProjectIDA: "",
    CustomerSearchBy: "",
    VerticalID:[],
    POC3:[]
  });

  const [project, setProject] = useState([]);
  const [projectA, setProjectA] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [vertical, setVertical] = useState([]);
  const [poc3, setPoc3] = useState([]);
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value };
      if (value === "1") {
        updatedData.CustomerPhone = "";
        updatedData.CustomerEmail = "";
      } else if (value === "2") {
        updatedData.CustomerName = "";
        updatedData.CustomerEmail = "";
      } else if (value === "3") {
        updatedData.CustomerName = "";
        updatedData.CustomerPhone = "";
      } else if (value === "Today") {
        setTableData([]);
        setTableImogi([]);
        setTableReceivedFeedback([]);
      } else if (value === "Last7Days") {
        setTableData([]);
        setTableImogi([]);
        setTableReceivedFeedback([]);
      } else if (value === "Last30Days") {
        setTableData([]);
        setTableImogi([]);
        setTableReceivedFeedback([]);
      } else if (value === "DateRange") {
        setTableData([]);
        setTableImogi([]);
        setTableReceivedFeedback([]);
      }
      return updatedData;
    });
  };

  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const shortenName = (name) => {
    return name?.length > 65 ? name?.substring(0, 55) + "..." : name;
  };
  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {})
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
  const renderStars = (count, size = 15) => {
    const getColor = (count) => {
      switch (count) {
        case (count = "1"):
          return "#F88379"; // Very Bad
        case (count = "2"):
          return "#FFB343"; // Bad
        case (count = "3"):
          return "#FBEC5D"; // Okay
        case (count = "4"):
          return "#FFD1DC"; // Good
        case (count = "5"):
          return "#80EF80"; // Excellent
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
          // <FaRegStar key={i} color="gray" size={size} />
          ""
        )
      );
    }
    return stars;
  };

  const [rowHandler, setRowHandler] = useState({
    overview: true,
    analysis: false,
    allfeedback: false,
    GoodFeedback3Month: false,
  });

  const handleOverview = () => {
    setRowHandler((prev) => ({
      overview: !prev.overview,
      analysis: false,
      allfeedback: false,
      GoodFeedback3Month: false,
    }));
    setTableImogi([]);
    setTableReceivedFeedback([]);
  };

  const handleAnalysis = () => {
    setRowHandler((prev) => ({
      overview: false,
      analysis: !prev.analysis,
      allfeedback: false,
      GoodFeedback3Month: false,
    }));
    setTableImogi([]);
    setTableReceivedFeedback([]);
  };

  const handleAllFeedback = () => {
    setRowHandler((prev) => ({
      overview: false,
      analysis: false,
      allfeedback: !prev.allfeedback,
      GoodFeedback3Month: false,
    }));
    handleSearchTable();
  };

  const handleGoodFeedback3Month = () => {
    setRowHandler((prev) => ({
      overview: false,
      analysis: false,
      allfeedback: false,
      GoodFeedback3Month: !prev.GoodFeedback3Month,
    }));
    handleGoodFeedback3MonthTable();
  };
  const handleGoodFeedback3MonthTable = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.ThreeMonthClientGoodFeedbackList, {
        DateType: String(formData?.SearchBy),
        ProjectID: String(formData?.ProjectID),
        StartDate: moment(formData?.FromDate).isValid()
          ? moment(formData?.FromDate).format("YYYY-MM-DD")
          : "",
        EndDate: moment(formData?.EndDate).isValid()
          ? moment(formData?.EndDate).format("YYYY-MM-DD")
          : "",
        SearchBy: String(
          formData?.CustomerName ||
            formData?.CustomerPhone ||
            formData?.CustomerEmail
        ),
        Rating: String(formData?.RatingType),
        Category: String(formData?.Category),
        Type: String("GoodFeedback3Month"),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          settableGoodFeedback3Month(res.data.data);
          setLoading(false);
        } else {
          toast.error(res.data.message);
          settableGoodFeedback3Month([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const mpnthTHEAD = [
    "S.No.",
    "Month",
    "Total Submissions",
    "Average Rating",
    "Change vs. Prev. Month",
  ];

  const monthlyData = [
    {
      month: "May 2025",
      submissions: 35,
      rating: 2.8,
      changeSubs: 0,
      changeRating: 0,
    },
    {
      month: "June 2025",
      submissions: 57,
      rating: 3.2,
      changeSubs: 22,
      changeRating: 0.4,
    },
    {
      month: "July 2025",
      submissions: 54,
      rating: 3.2,
      changeSubs: -3,
      changeRating: 0,
    },
    {
      month: "August 2025",
      submissions: 4,
      rating: 4.5,
      changeSubs: -50,
      changeRating: 1.3,
    },
  ];

  const classMap = {
    5: "#B2FBA5",
    4: "#FFD1DC",
    3: "#FBEC5D",
    2: "#FFB343",
    1: "#F88379",
  };

  const getFeedbackDisplay = (rating) => {
    const feedbackMap = {
      5: "Excellent 😍",
      4: "Okay 😐",
      3: "Good 🙂",
      2: "Bad ☹️",
      1: "VeryBad 😡",
    };
    return feedbackMap[rating] || "";
  };

  const handleFileClick = () => {
    handleSearchTable();
    // setTableReceivedFeedback([]);
    setTableReceived([]);
    setTableImogi([]);
    setTableNotReceived([]);
    settableGoodFeedback3Month([]);
  };
  const handleReceivedFeedback = () => {
    handleReceivedTable();
    setTableReceivedFeedback([]);
    // setTableReceived([]);
    setTableImogi([]);
    setTableNotReceived([]);
    settableGoodFeedback3Month([]);
  };
  const handleNotReceivedFeedback = () => {
    handleNotReceivedTable();
    setTableReceivedFeedback([]);
    setTableReceived([]);
    setTableImogi([]);
    // setTableNotReceived([]);
    settableGoodFeedback3Month([]);
  };
  const handleImogiClick = () => {
    handleSearchTableImogi();
    setTableReceivedFeedback([]);
    setTableReceived([]);
    setTableNotReceived([]);
    settableGoodFeedback3Month([]);
    // setTableImogi([])
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };

  const handleSearch = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.ClientFeedbackAggregates, {
        DateType: String(formData?.SearchBy),
        ProjectID: String(formData?.ProjectID),
        VerticalID: String(formData?.VerticalID),
        POC3: String(formData?.POC3),
        StartDate: moment(formData?.FromDate).isValid()
          ? moment(formData?.FromDate).format("YYYY-MM-DD")
          : "",
        EndDate: moment(formData?.EndDate).isValid()
          ? moment(formData?.EndDate).format("YYYY-MM-DD")
          : "",
        SearchBy: String(
          formData?.CustomerName ||
            formData?.CustomerPhone ||
            formData?.CustomerEmail
        ),
        Rating: String(formData?.RatingType),
        Category: String(formData?.Category),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res.data.data);
          setLoading(false);
          setFormData({
            ...formData,
            CustomerSearchBy: "",
          });
        } else {
          toast.error(res.data.message);
          setTableData([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleSearchTable = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.ClientFeedbackList, {
        DateType: String(formData?.SearchBy),
        ProjectID: String(formData?.ProjectID),
        StartDate: moment(formData?.FromDate).isValid()
          ? moment(formData?.FromDate).format("YYYY-MM-DD")
          : "",
        EndDate: moment(formData?.EndDate).isValid()
          ? moment(formData?.EndDate).format("YYYY-MM-DD")
          : "",
        SearchBy: String(
          formData?.CustomerName ||
            formData?.CustomerPhone ||
            formData?.CustomerEmail
        ),
        Rating: String(formData?.RatingType),
        Category: String(formData?.Category),
        Type: String("All"),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableReceivedFeedback(res.data.data);
          setLoading(false);
        } else {
          toast.error(res.data.message);
          setTableReceivedFeedback([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleReceivedTable = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.ClientFeedbackList, {
        DateType: String(formData?.SearchBy),
        ProjectID: String(formData?.ProjectID),
        StartDate: moment(formData?.FromDate).isValid()
          ? moment(formData?.FromDate).format("YYYY-MM-DD")
          : "",
        EndDate: moment(formData?.EndDate).isValid()
          ? moment(formData?.EndDate).format("YYYY-MM-DD")
          : "",
        SearchBy: String(
          formData?.CustomerName ||
            formData?.CustomerPhone ||
            formData?.CustomerEmail
        ),
        Rating: String(formData?.RatingType),
        Category: String(formData?.Category),
        Type: String("ReceviedFeedback"),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableReceived(res.data.data);
          setLoading(false);
        } else {
          toast.error(res.data.message);
          setTableReceived([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleNotReceivedTable = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.ClientFeedbackList, {
        DateType: String(formData?.SearchBy),
        ProjectID: String(formData?.ProjectID),
        StartDate: moment(formData?.FromDate).isValid()
          ? moment(formData?.FromDate).format("YYYY-MM-DD")
          : "",
        EndDate: moment(formData?.EndDate).isValid()
          ? moment(formData?.EndDate).format("YYYY-MM-DD")
          : "",
        SearchBy: String(
          formData?.CustomerName ||
            formData?.CustomerPhone ||
            formData?.CustomerEmail
        ),
        Rating: String(formData?.RatingType),
        Category: String(formData?.Category),
        Type: String("NotReceviedFeedback"),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableNotReceived(res.data.data);
          setLoading(false);
        } else {
          toast.error(res.data.message);
          setTableNotReceived([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleSearchTableImogi = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.ClientFeedbackList, {
        DateType: String(formData?.SearchBy),
        ProjectID: String(formData?.ProjectID),
        StartDate: moment(formData?.FromDate).isValid()
          ? moment(formData?.FromDate).format("YYYY-MM-DD")
          : "",
        EndDate: moment(formData?.EndDate).isValid()
          ? moment(formData?.EndDate).format("YYYY-MM-DD")
          : "",
        SearchBy: String(
          formData?.CustomerName ||
            formData?.CustomerPhone ||
            formData?.CustomerEmail
        ),
        Rating: String(formData?.RatingType),
        Category: String(formData?.Category),
        Type: String("LowCommentFeedback"),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableImogi(res.data.data);
          setLoading(false);
        } else {
          toast.error(res.data.message);
          setTableImogi([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getProjectA = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {})
      .then((res) => {
        const datas = res?.data.data;
        const poc3s = datas.map((item) => {
          return { label: item?.Project, value: item?.ProjectId };
        });
        setProjectA(poc3s);
        if (datas.length > 0) {
          const singleProject = datas[0]?.ProjectId;
          setFormData((prev) => ({
            ...prev,
            ProjectIDA: singleProject,
          }));
          // handleProjectChart(singleProject);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeliveryChangeProject = (name, e) => {
    const { value } = e;
    if (name == "ProjectIDA") {
      setFormData({
        ...formData,
        [name]: value,
      });
      handleProjectChart(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleProjectChart = (value) => {
    axiosInstances
      .post(apiUrls.ClientFeedbackRatingGraph, {
        ProjectID: String(value),
      })
      .then((res) => {
        if (res.data.success === true) {
          setFilterData(res?.data?.data);
        } else {
          setFilterData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    handleProjectChart(formData?.ProjectIDA);
  }, [formData?.ProjectIDA]);

  useEffect(() => {
    getProject();
    getVertical();
    getPOC3();
    handleSearch();
    getProjectA();
  }, []);

  const [visible, setVisible] = useState({
    showVisible: false,
    showData: {},
  });
  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header="AMC Percent"
        >
          <ClientFeddbackMsgModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      <div className="card">
        {/* <Heading title={"Client Feedback"} isBreadcrumb={false} /> */}
        <div className="row m-2">
          <div className="d-flex ">
            <Button
              onClick={handleOverview}
              style={{
                backgroundColor: rowHandler?.overview === true ? "#4cd07d" : "",
                color: "white",
                border: "#4cd07d",
              }}
            >
              Overview
            </Button>
            <Button
              className="ml-2"
              onClick={handleAnalysis}
              style={{
                backgroundColor: rowHandler?.analysis === true ? "#4cd07d" : "",
                color: "white",
                border: "#4cd07d",
              }}
            >
              Analytics
            </Button>
            <Button
              className="ml-2"
              onClick={handleAllFeedback}
              style={{
                backgroundColor:
                  rowHandler?.allfeedback === true ? "#4cd07d" : "",
                color: "white",
                border: "#4cd07d",
              }}
            >
              All Feedback
            </Button>
            <Button
              className="ml-2"
              onClick={handleGoodFeedback3Month}
              style={{
                backgroundColor:
                  rowHandler?.GoodFeedback3Month === true ? "#4cd07d" : "",
                color: "white",
                border: "#4cd07d",
              }}
            >
              Good Feedback (3 Months)
            </Button>
          </div>
        </div>
      </div>

      {rowHandler?.overview && (
        <>
          <div className="card">
            <div className="row m-2">
              <ReactSelect
                className="form-control"
                name="SearchBy"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                placeholderName="Date Type"
                id="SearchBy"
                dynamicOptions={[
                  { label: "Select", value: "0" },
                  { label: "Today", value: "Today" },
                  { label: "Last 7 Days", value: "Last7Days" },
                  { label: "Last 30 Days", value: "Last30Days" },
                  { label: "Date Range", value: "DateRange" },
                ]}
                value={formData?.SearchBy}
                handleChange={handleDeliveryChange}
              />
              {["DateRange"].includes(formData?.SearchBy) && (
                <>
                  <DatePicker
                    className="custom-calendar"
                    id="FromDate"
                    name="FromDate"
                    lable={t("From Date")}
                    placeholder={VITE_DATE_FORMAT}
                    value={formData?.FromDate}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    handleChange={searchHandleChange}
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
                  />{" "}
                </>
              )}

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
                placeholderName={t("Vertical")}
                dynamicOptions={vertical}
                optionLabel="VerticalID"
                className="VerticalID"
                handleChange={handleMultiSelectChange}
                value={formData?.VerticalID?.map((code) => ({
                  code,
                  name: vertical.find((item) => item.code === code)?.name,
                }))}
              />
              <MultiSelectComp
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="POC3"
                placeholderName={t("POC-III")}
                dynamicOptions={poc3}
                handleChange={handleMultiSelectChange}
                value={formData?.POC3?.map((code) => ({
                  code,
                  name: poc3.find((item) => item.code === code)?.name,
                }))}
              />
              <ReactSelect
                className="form-control"
                name="CustomerSearchBy"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                placeholderName="Cutomer Search By"
                id="CustomerSearchBy"
                dynamicOptions={[
                  { label: "Select", value: "0" },
                  { label: "Name", value: "1" },
                  { label: "Mobile", value: "2" },
                  { label: "Email", value: "3" },
                ]}
                value={formData?.CustomerSearchBy}
                handleChange={handleDeliveryChange}
              />
              {formData?.CustomerSearchBy == "1" && (
                <Input
                  type="text"
                  className="form-control"
                  id="CustomerName"
                  name="CustomerName"
                  lable="Customer Name"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.CustomerName}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                />
              )}
              {formData?.CustomerSearchBy == "2" && (
                <Input
                  type="number"
                  className="form-control"
                  id="CustomerPhone"
                  name="CustomerPhone"
                  lable="Customer Mobile"
                  placeholder=" "
                  onChange={(e) => {
                    inputBoxValidation(
                      MOBILE_NUMBER_VALIDATION_REGX,
                      e,
                      handleSelectChange
                    );
                  }}
                  value={formData?.CustomerPhone}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                />
              )}
              {formData?.CustomerSearchBy == "3" && (
                <Input
                  type="text"
                  className="form-control"
                  id="CustomerEmail"
                  name="CustomerEmail"
                  lable="Customer Email"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.CustomerEmail}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                />
              )}
              <ReactSelect
                className="form-control"
                name="RatingType"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                placeholderName="Rating"
                id="RatingType"
                dynamicOptions={[
                  { label: "All Rating", value: "0" },
                  { label: "1 Star Rating", value: "1" },
                  { label: "2 Star Rating", value: "2" },
                  { label: "3 Star Rating", value: "3" },
                  { label: "4 Star Rating", value: "4" },
                  { label: "5 Star Rating", value: "5" },
                ]}
                value={formData?.RatingType}
                handleChange={handleDeliveryChange}
              />
              <ReactSelect
                className="form-control"
                name="Category"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                placeholderName="Category"
                id="Category"
                dynamicOptions={[
                  { label: "All", value: "0" },
                  {
                    label: "Support And Services",
                    value: "Support And Services",
                  },
                  { label: "Delivery", value: "Delivery" },
                ]}
                value={formData?.Category}
                handleChange={handleDeliveryChange}
              />
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-primary ml-2 mt-0"
                  onClick={handleSearch}
                >
                  <i className="fa fa-search mr-1" aria-hidden="true"></i>{" "}
                  Search
                </button>
              )}
              <button className="btn btn-sm btn-primary ml-2 mt-0">
                <i className="fa fa-download mr-1" aria-hidden="true"></i>{" "}
                Export
              </button>
            </div>
          </div>
          <div
            className="row row-cols-lg-5 row-cols-md-2 row-cols-1"
            style={{
              overflowX: "auto",
              marginLeft: "2px",
              width: "100%",
              paddingBottom: "5px",
              marginTop: "10px",
            }}
          >
            {/* All Feedback */}
            <div className="col-xl-2.5 col-md-3 col-sm-6 col-12">
              <div className="clientDashboardWrp">
                <div className="mainBox1 p-3">
                  <div className="d-flex flex-wrap mainHeader">
                    <label className="titlefont">{t("All Feedback")}</label>
                    <i
                      className="fa fa-comment cursorpointer"
                      aria-hidden="true"
                      onClick={handleFileClick}
                    ></i>
                  </div>
                  <div className="Newfeedback55">
                    {tableData?.TotalFeedbackCount || 0}
                  </div>
                  <div className="textfontSize">
                    Total submissions in period
                  </div>
                </div>
              </div>
            </div>

            {/* Not Received Feedback */}
            <div className="col-xl-2.5 col-md-3 col-sm-6 col-12">
              <div className="clientDashboardWrp">
                <div className="mainBox1 p-3">
                  <div className="d-flex flex-wrap mainHeader">
                    <label className="titlefont">{t("Pending Feedback")}</label>
                    <i
                      className="fa fa-hourglass-end cursorpointer"
                      onClick={handleNotReceivedFeedback}
                    ></i>
                  </div>
                  <div className="Newfeedback55">
                    {tableData?.NotReceivedFeedbackCount || 0}
                  </div>
                  <div className="textfontSize">
                    Pending submissions in period
                  </div>
                </div>
              </div>
            </div>
            {/* Received Feedback */}
            <div className="col-xl-2.5 col-md-3 col-sm-6 col-12">
              <div className="clientDashboardWrp">
                <div className="mainBox1 p-3">
                  <div className="d-flex flex-wrap mainHeader">
                    <label className="titlefont">
                      {t("Received Feedback")}
                    </label>
                    <i
                      className="far fa-file-alt cursorpointer"
                      onClick={handleReceivedFeedback}
                    ></i>
                  </div>
                  <div className="Newfeedback55">
                    {tableData?.ReceivedFeedbackCount || 0}
                  </div>
                  <div className="textfontSize">
                    Received submissions in period
                  </div>
                </div>
              </div>
            </div>
            {/* Average Rating */}
            <div className="col-xl-2.5 col-md-3 col-sm-6 col-12">
              <div className="clientDashboardWrp">
                <div className="mainBox1 p-3">
                  <div className="d-flex flex-wrap mainHeader">
                    <label className="titlefont">{t("Average Rating")}</label>
                    <i className="far fa-star"></i>
                  </div>
                  <div className="Newfeedback55">
                    {tableData?.AverageRating?.toFixed(1) || 0} / 5
                  </div>
                  <div className="textfontSize">Based on ratings in period</div>
                </div>
              </div>
            </div>

            {/* Flagged Comments */}
            <div className="col-xl-2.5 col-md-3 col-sm-6 col-12">
              <div className="clientDashboardWrp">
                <div className="mainBox1 p-3">
                  <div className="d-flex flex-wrap mainHeader">
                    <label className="titlefont">{t("Flagged Comments")}</label>
                    <i
                      className="fa fa-frown cursorpointer"
                      onClick={handleImogiClick}
                      aria-hidden="false"
                    ></i>
                  </div>
                  <div className="Newfeedback55">
                    {tableData?.CommentAvailableCount || 0}
                  </div>
                  <div className="textfontSize">
                    Negative comments in period
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="card">
            <div className="row m-2">
              <i className="fa fa-paperclip mr-2 mt-1"></i>
              <span className="keyFeedbackTopics">Key Feedback Topics</span>
            </div>
          </div> */}
          {tableReceiveFeedback?.length > 0 && (
            <>
              <div className="card mt-1">
                <div className="row m-2">
                  <div className="col">
                    <span className="keyFeedbackTopics mr-1">
                      All Feedback Submissions
                    </span>
                  </div>
                  <span className="keyFeedbackTopics ml-auto">
                    Total Record : {tableReceiveFeedback?.length}
                  </span>
                </div>
              </div>

              <div className="mt-0 p-0 bg-light rounded shadow-sm">
                <table className="table table-hover table-bordered">
                  <thead className="custom-thead">
                    <tr>
                      <th>Customer</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Sentiment</th>
                      <th>FeedbackDate</th>
                      {/* <th>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {tableReceiveFeedback.map((row, index) => (
                      <tr key={index}>
                        <td>
                          {" "}
                          <div>
                            <FaUser className="ml-2" />{" "}
                            <strong style={{ color: "#3D5DA9" }}>
                              {row.OwnerName}
                            </strong>{" "}
                            {/* <span>🏅</span> */}
                          </div>
                          <div>
                            <FaBuilding className="ml-2" /> {row.ProjectName}
                          </div>
                          <div>
                            <FaPhone className="ml-2" /> {row.MobileNo}
                          </div>
                          <div>
                            <FaHashtag className="ml-2" /> {row.Content}
                          </div>
                        </td>
                        <td>{renderStars(row.FeedbackRate)}</td>
                        <td>
                          {/* {row.FeedbackComment} */}
                          <Tooltip label={row?.FeedbackComment}>
                            <span
                              id={`Content-${index}`}
                              targrt={`Content-${index}`}
                              style={{ textAlign: "center" }}
                            >
                              {shortenName(row?.FeedbackComment)}
                            </span>
                          </Tooltip>
                        </td>
                        <td>
                          {
                            <span
                              className="badge"
                              style={{
                                backgroundColor: classMap[row.FeedbackRate],
                              }}
                            >
                              {getFeedbackDisplay(row.FeedbackRate)}
                            </span>
                          }
                        </td>

                        <td>
                          {new Date(row.FeedbackDate)
                            .toISOString()
                            .split("T")[0] == "1970-01-01"
                            ? ""
                            : new Date(row.FeedbackDate)
                                .toISOString()
                                .split("T")[0]}
                        </td>
                        {/* <td>
                          {
                            <i
                              className="far fa-comment"
                              style={{
                                fontSize: "20px !important",
                                marginLeft: "10px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setVisible({
                                  showVisible: true,
                                  showData: row,
                                  row,
                                });
                              }}
                            ></i>
                          }
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {tableImogi?.length > 0 && (
            <>
              <div className="card mt-1">
                <div className="row m-2">
                  <div className="col">
                    <span className="keyFeedbackTopics mr-1">
                      Flagged Comment Feedback
                    </span>
                  </div>
                  <span className="keyFeedbackTopics ml-auto">
                    Total Record : {tableImogi?.length}
                  </span>
                </div>
              </div>

              <div className="mt-0 p-0 bg-light rounded shadow-sm">
                <table className="table table-hover table-bordered">
                  <thead className="custom-thead">
                    <tr>
                      <th>Customer</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Sentiment</th>
                      <th>FeedbackDate</th>
                      {/* <th>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {tableImogi.map((row, index) => (
                      <tr key={index}>
                        <td>
                          {" "}
                          <div>
                            <FaUser className="ml-2" />{" "}
                            <strong style={{ color: "#3D5DA9" }}>
                              {row.OwnerName}
                            </strong>{" "}
                            {/* <span>🏅</span> */}
                          </div>
                          <div>
                            <FaBuilding className="ml-2" /> {row.ProjectName}
                          </div>
                          <div>
                            <FaPhone className="ml-2" /> {row.MobileNo}
                          </div>
                          <div>
                            <FaHashtag className="ml-2" /> {row.Content}
                          </div>
                        </td>
                        <td>{renderStars(row.FeedbackRate)}</td>
                        <td>
                          {/* {row.FeedbackComment} */}
                          <Tooltip label={row?.FeedbackComment}>
                            <span
                              id={`Content-${index}`}
                              targrt={`Content-${index}`}
                              style={{ textAlign: "center" }}
                            >
                              {shortenName(row?.FeedbackComment)}
                            </span>
                          </Tooltip>
                        </td>
                        <td>
                          {
                            <span
                              className="badge"
                              style={{
                                backgroundColor: classMap[row.FeedbackRate],
                              }}
                            >
                              {getFeedbackDisplay(row.FeedbackRate)}
                            </span>
                          }
                        </td>

                        <td>
                          {new Date(row.FeedbackDate)
                            .toISOString()
                            .split("T")[0] == "1970-01-01"
                            ? ""
                            : new Date(row.FeedbackDate)
                                .toISOString()
                                .split("T")[0]}
                        </td>
                        {/* <td>
                          {
                            <i
                              className="far fa-comment"
                              style={{
                                fontSize: "20px !important",
                                marginLeft: "10px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setVisible({
                                  showVisible: true,
                                  showData: row,
                                  row,
                                });
                              }}
                            ></i>
                          }
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {tablereceived?.length > 0 && (
            <>
              <div className="card mt-1">
                <div className="row m-2">
                  <div className="col">
                    <span className="keyFeedbackTopics mr-1">
                      Received Feedback Submissions
                    </span>
                  </div>
                  <span className="keyFeedbackTopics ml-auto">
                    Total Record : {tablereceived?.length}
                  </span>
                </div>
              </div>

              <div className="mt-0 p-0 bg-light rounded shadow-sm">
                <table className="table table-hover table-bordered">
                  <thead className="custom-thead">
                    <tr>
                      <th>Customer</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Sentiment</th>
                      <th>FeedbackDate</th>
                      {/* <th>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {tablereceived.map((row, index) => (
                      <tr key={index}>
                        <td>
                          {" "}
                          <div>
                            <FaUser className="ml-2" />{" "}
                            <strong style={{ color: "#3D5DA9" }}>
                              {row.OwnerName}
                            </strong>{" "}
                            {/* <span>🏅</span> */}
                          </div>
                          <div>
                            <FaBuilding className="ml-2" /> {row.ProjectName}
                          </div>
                          <div>
                            <FaPhone className="ml-2" /> {row.MobileNo}
                          </div>
                          <div>
                            <FaHashtag className="ml-2" /> {row.Content}
                          </div>
                        </td>
                        <td>{renderStars(row.FeedbackRate)}</td>
                        <td>
                          {/* {row.FeedbackComment} */}
                          <Tooltip label={row?.FeedbackComment}>
                            <span
                              id={`Content-${index}`}
                              targrt={`Content-${index}`}
                              style={{ textAlign: "center" }}
                            >
                              {shortenName(row?.FeedbackComment)}
                            </span>
                          </Tooltip>
                        </td>
                        <td>
                          {
                            <span
                              className="badge"
                              style={{
                                backgroundColor: classMap[row.FeedbackRate],
                              }}
                            >
                              {getFeedbackDisplay(row.FeedbackRate)}
                            </span>
                          }
                        </td>

                        <td>
                          {new Date(row.FeedbackDate)
                            .toISOString()
                            .split("T")[0] == "1970-01-01"
                            ? ""
                            : new Date(row.FeedbackDate)
                                .toISOString()
                                .split("T")[0]}
                        </td>
                        {/* <td>
                          {
                            <i
                              className="far fa-comment"
                              style={{
                                fontSize: "20px !important",
                                marginLeft: "10px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setVisible({
                                  showVisible: true,
                                  showData: row,
                                  row,
                                });
                              }}
                            ></i>
                          }
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {tableNotreceived?.length > 0 && (
            <>
              <div className="card mt-1">
                <div className="row m-2">
                  <div className="col">
                    <span className="keyFeedbackTopics mr-1">
                      Pending Feedback Submissions
                    </span>
                  </div>
                  <span className="keyFeedbackTopics ml-auto">
                    Total Record : {tableNotreceived?.length}
                  </span>
                </div>
              </div>

              <div className="mt-0 p-0 bg-light rounded shadow-sm">
                <table className="table table-hover table-bordered">
                  <thead className="custom-thead">
                    <tr>
                      <th>Customer</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Sentiment</th>
                      <th>FeedbackDate</th>
                      {/* <th>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {tableNotreceived.map((row, index) => (
                      <tr key={index}>
                        <td>
                          {" "}
                          <div>
                            <FaUser className="ml-2" />{" "}
                            <strong style={{ color: "#3D5DA9" }}>
                              {row.OwnerName}
                            </strong>{" "}
                            {/* <span>🏅</span> */}
                          </div>
                          <div>
                            <FaBuilding className="ml-2" /> {row.ProjectName}
                          </div>
                          <div>
                            <FaPhone className="ml-2" /> {row.MobileNo}
                          </div>
                          <div>
                            <FaHashtag className="ml-2" /> {row.Content}
                          </div>
                        </td>
                        <td>{renderStars(row.FeedbackRate)}</td>
                        <td>
                          {/* {row.FeedbackComment} */}
                          <Tooltip label={row?.FeedbackComment}>
                            <span
                              id={`Content-${index}`}
                              targrt={`Content-${index}`}
                              style={{ textAlign: "center" }}
                            >
                              {shortenName(row?.FeedbackComment)}
                            </span>
                          </Tooltip>
                        </td>
                        <td>
                          {
                            <span
                              className="badge"
                              style={{
                                backgroundColor: classMap[row.FeedbackRate],
                              }}
                            >
                              {getFeedbackDisplay(row.FeedbackRate)}
                            </span>
                          }
                        </td>

                        <td>
                          {new Date(row.FeedbackDate)
                            .toISOString()
                            .split("T")[0] == "1970-01-01"
                            ? ""
                            : new Date(row.FeedbackDate)
                                .toISOString()
                                .split("T")[0]}
                        </td>
                        {/* <td>
                          {
                            <i
                              className="far fa-comment"
                              style={{
                                fontSize: "20px !important",
                                marginLeft: "10px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setVisible({
                                  showVisible: true,
                                  showData: row,
                                  row,
                                });
                              }}
                            ></i>
                          }
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
      {rowHandler?.analysis && (
        <>
          <div className="row m-1">
            <div className="col-md-6 col-sm-12 mt-2">
              <div className="clientDashboardWrp">
                <div className="mainBox1">
                  <div className="">
                    <label className="ml-2 Newfeedback55">
                      {t("Feedback Trends")}
                    </label>
                    <div>
                      <ClientFeedbackSaleChart />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 mt-2">
              <div className="clientDashboardWrp">
                <div className="mainBox1">
                  <div className="d-flex justify-content-between p-2">
                    <label
                      style={{ marginTop: "0px" }}
                      className="Newfeedback55"
                    >
                      {t("Feedback Rating")}
                    </label>

                    <ReactSelect
                      respclass="col-xl-5 col-md-4 col-sm-6 col-12"
                      name="ProjectIDA"
                      placeholderName={t("Project")}
                      dynamicOptions={projectA}
                      value={formData?.ProjectIDA}
                      handleChange={handleDeliveryChangeProject}
                    />
                  </div>
                  <div>
                    <ClientCategoryBreakdown state={filterdata} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="card mt-3">
            <div className="row m-2">
            
              <span className="keyFeedbackTopics mr-1">Monthly Comparison</span>
              <span
                style={{
                  color: "#3D5DA9",
                  fontWeight: "bold",
                  marginTop: "2px",
                }}
              >
                (A month-over-month look at feedback submissions and average
                ratings.)
              </span>
            </div>
          </div>
        
          <div className="mt-0 p-0 bg-light rounded shadow-sm">
            <table className="table table-hover table-bordered">
              <thead className="custom-thead">
                <tr>
                  <th>Month</th>
                  <th>Total Submissions</th>
                  <th>Average Rating</th>
                  <th>Change vs. Prev. Month</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.month}</td>
                    <td>{row.submissions}</td>
                    <td>{row.rating}</td>
                    <td>
                      <span
                        className={`${getChangeColor(row.changeSubs)} me-3`}
                      >
                        {row.changeSubs === 0
                          ? "0 subs"
                          : `${row.changeSubs > 0 ? "↗" : "↘"} ${Math.abs(row.changeSubs)} subs`}
                      </span>
                      <span className={getChangeColor(row.changeRating)}>
                        {row.changeRating === 0
                          ? "0.00 rating"
                          : `↗ +${row.changeRating.toFixed(2)} rating`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
        </>
      )}
      {rowHandler?.allfeedback && (
        <>
          <div className="card mt-1">
            <div className="row m-2">
              <div className="col">
                <span className="keyFeedbackTopics mr-1">
                  All Feedback Submissions
                </span>
              </div>
              <span className="keyFeedbackTopics ml-auto">
                Total Record : {tableReceiveFeedback?.length}
              </span>
            </div>
          </div>

          <div className="mt-0 p-0 bg-light rounded shadow-sm">
            <table className="table table-hover table-bordered">
              <thead className="custom-thead">
                <tr>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Sentiment</th>
                  <th>FeedbackDate</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {tableReceiveFeedback.map((row, index) => (
                  <tr key={index}>
                    <td>
                      {" "}
                      <div>
                        <FaUser className="ml-2" />{" "}
                        <strong style={{ color: "#3D5DA9" }}>
                          {row.OwnerName}
                        </strong>{" "}
                        {/* <span>🏅</span> */}
                      </div>
                      <div>
                        <FaBuilding className="ml-2" /> {row.ProjectName}
                      </div>
                      <div>
                        <FaPhone className="ml-2" /> {row.MobileNo}
                      </div>
                      <div>
                        <FaHashtag className="ml-2" /> {row.Content}
                      </div>
                    </td>
                    <td>{renderStars(row.FeedbackRate)}</td>
                    <td>
                      {/* {row.FeedbackComment} */}
                      <Tooltip label={row?.FeedbackComment}>
                        <span
                          id={`Content-${index}`}
                          targrt={`Content-${index}`}
                          style={{ textAlign: "center" }}
                        >
                          {shortenName(row?.FeedbackComment)}
                        </span>
                      </Tooltip>
                    </td>
                    <td>
                      {
                        <span
                          className="badge"
                          style={{
                            backgroundColor: classMap[row.FeedbackRate],
                          }}
                        >
                          {getFeedbackDisplay(row.FeedbackRate)}
                        </span>
                      }
                    </td>

                    <td>
                      {" "}
                      {new Date(row.FeedbackDate).toISOString().split("T")[0]}
                    </td>
                    {/* <td>
                      {
                        <i
                          className="far fa-comment"
                          style={{
                            fontSize: "20px !important",
                            marginLeft: "10px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setVisible({
                              showVisible: true,
                              showData: row,
                              row,
                            });
                          }}
                        ></i>
                      }
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {rowHandler?.GoodFeedback3Month && (
        <>
          <div className="card mt-1">
            <div className="row m-2">
              <div className="col">
                <span className="keyFeedbackTopics mr-1">
                  Good Feedback 3 Month
                </span>
              </div>
              <span className="keyFeedbackTopics ml-auto">
                Total Record : {tableGoodFeedback3Month?.length}
              </span>
            </div>
          </div>

          <div className="mt-0 p-0 bg-light rounded shadow-sm">
            <table className="table table-hover table-bordered">
              <thead className="custom-thead">
                <tr>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Sentiment</th>
                  <th>FeedbackDate</th>
                  <th>AMC Discount</th>
                </tr>
              </thead>
              <tbody>
                {tableGoodFeedback3Month.map((row, index) => (
                  <tr key={index}>
                    <td>
                      {" "}
                      <div>
                        <FaUser className="ml-2" />{" "}
                        <strong style={{ color: "#3D5DA9" }}>
                          {row.OwnerName}
                        </strong>{" "}
                        {/* <span>🏅</span> */}
                      </div>
                      <div>
                        <FaBuilding className="ml-2" /> {row.ProjectName}
                      </div>
                      <div>
                        <FaPhone className="ml-2" /> {row.MobileNo}
                      </div>
                      <div>
                        <FaHashtag className="ml-2" /> {row.Content}
                      </div>
                    </td>
                    <td>{renderStars(row.FeedbackRate)}</td>
                    <td>
                      {/* {row.FeedbackComment} */}
                      <Tooltip label={row?.FeedbackComment}>
                        <span
                          id={`Content-${index}`}
                          targrt={`Content-${index}`}
                          style={{ textAlign: "center" }}
                        >
                          {shortenName(row?.FeedbackComment)}
                        </span>
                      </Tooltip>
                    </td>
                    <td>
                      {
                        <span
                          className="badge"
                          style={{
                            backgroundColor: classMap[row.FeedbackRate],
                          }}
                        >
                          {getFeedbackDisplay(row.FeedbackRate)}
                        </span>
                      }
                    </td>

                    <td>
                      {" "}
                      {new Date(row.FeedbackDate).toISOString().split("T")[0]}
                    </td>
                    <td>
                      {
                        <i
                          className="fa fa-percent"
                          style={{
                            fontSize: "20px !important",
                            marginLeft: "10px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setVisible({
                              showVisible: true,
                              showData: row,
                              row,
                            });
                          }}
                        ></i>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};
export default ClientFeedbackFlow;
