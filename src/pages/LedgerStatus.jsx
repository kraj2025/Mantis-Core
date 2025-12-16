import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import ReactSelect from "../components/formComponent/ReactSelect";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import axios from "axios";
import Tables from "../components/UI/customTable";
import Modal from "../components/modalComponent/Modal";
import UnlockClientLedgerStatus from "../components/UI/customTable/UnlockClientLedgerStatus";
import DatePicker from "../components/formComponent/DatePicker";
import Input from "../components/formComponent/Input";
import UnlockClientLog from "../components/UI/customTable/UnlockClientLog";
import excelimg from "../../src/assets/image/excel.png";
import pdf from "../../src/assets/image/pdf.png";
import { useTranslation } from "react-i18next";
import Loading from "../components/loader/Loading";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import { useNavigate } from "react-router-dom";
import SeeMoreIconInTable from "../components/SearchableTable/SeeMoreIconInTable";
import { toast } from "react-toastify";
import Tooltip from "./Tooltip";
import { PageSize } from "../utils/constant";
import CustomPagination from "../utils/CustomPagination";
import { ExportToPDF } from "../networkServices/Tools";
import AmountSubmissionSeeMoreList from "../networkServices/AmountSubmissionSeeMoreList";
import SeeMoreSlideScreen from "../components/SearchableTable/SeeMoreSlideScreen";
import SlideScreen from "./SlideScreen";
import gmaillogo from "../../src/assets/image/Gmail_Logo.png";
import GmailLedgerModal from "../components/UI/customTable/GmailLedgerModal";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const LedgerStatus = () => {
  const [t] = useTranslation();
  const AllowLockUnLock = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowLockUnLock"
  );
  // console.log("AllowLockUnLock", AllowLockUnLock);
  const ledgerstatusThead = [
    t("S.No."),
    t("Team"),
    t("SalesManager"),
    t("POC-1"),
    t("Project Name"),
    t("Opening Balance"),
    t("Current Sale"),
    t("Received Amount"),
    t("Closing Balance"),
    t("Last Received Amount"),
    t("Last Received Date"),
    t("Ageing"),
    t("LiveDate"),
    t("City"),
    t("SPOC"),
    t("Mobile"),
    t("Email"),
    t("Ledger Status"),
    t("Lock/UnLockReason"),
    // t("Last Paid Amount"),
    // t("Last Paid Date"),

    // t("Age(Last Paid Date)"),
    t("Log"),
  ];
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [tableData, setTableData] = useState([]);
  console.log("tableDta", tableData);
  const [vertical, setVertical] = useState([]);
  const [project, setProject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);
  const [poc1, setPoc1] = useState([]);
  const [poc2, setPoc2] = useState([]);
  const [poc3, setPoc3] = useState([]);
  const [secondThead, setSecondThead] = useState([]);
  const [listVisible, setListVisible] = useState(false);
  const [city, setCity] = useState([]);
  const [manager, setManager] = useState([]);
  const [formData, setFormData] = useState({
    ProjectName: "",
    ProjectID: [],
    VerticalID: [],
    TeamID: [],
    WingID: [],
    POC1: [],
    FromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    ToDate: new Date(),
    POC2: [],
    POC3: [],
    Status: "ALL",
    DateType: "",
    City: "",
    SalesManager: "",
    isDue: "",
    PageSize: 50,
    PageNo: "",
    FollowupStatus: "",
  });
  function capitalizeFirstLetter(sentence) {
    if (!sentence) return "";
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
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

  const handleCheckBox = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleReset = () => {
    setFormData({
      ...formData,
      ProjectName: "",
      ProjectID: [],
      VerticalID: [],
      TeamID: [],
      WingID: [],
      POC1: [],
      FromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      ToDate: new Date(),
      POC2: [],
      POC3: [],
      Status: "ALL",
      DateType: "",
      City: "",
      SalesManager: "",
    });
  };
  const getVertical = () => {
    axiosInstances
      .post(apiUrls.Vertical_Select, {})
      // let form = new FormData();
      // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   axios
      //     .post(apiUrls?.Vertical_Select, form, { headers })
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
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   axios
      //     .post(apiUrls?.Team_Select, form, { headers })
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
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   axios
      //     .post(apiUrls?.Wing_Select, form, { headers })
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
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   axios
      //     .post(apiUrls?.POC_1_Select, form, { headers })
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
  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const getPOC2 = () => {
    axiosInstances
      .post(apiUrls.POC_2_Select, {})
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   axios
      //     .post(apiUrls?.POC_2_Select, form, { headers })
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
  const getPOC3 = () => {
    axiosInstances
      .post(apiUrls.POC_3_Select, {})
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   axios
      //     .post(apiUrls?.POC_3_Select, form, { headers })
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

  const handleSaveFilter = () => {
    localStorage.setItem("formData", JSON.stringify(formData));
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    axiosInstances
      .post(apiUrls.SaveFilterDataSubmission, {
        Type: "LedgerStatus",
        FilterData: String(savedData),
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append("Type", "LedgerStatus"),
      //   form.append("FilterData", savedData),
      //   axios
      //     .post(apiUrls?.SaveFilterDataSubmission, form, { headers })
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log("save data", formData);
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
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   axios
      //     .post(apiUrls?.ProjectSelect, form, { headers })
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
  const getCity = () => {
    axiosInstances
      .post(apiUrls.GetCity, {
        CountryID: "14",
        StateID: "0",
        DistrictID: "0",
      })
      // let form = new FormData();
      // form.append("CountryID", "14"),
      //   form.append("StateID", ""),
      //   form.append("DistrictID", ""),
      //   axios
      //     .post(apiUrls?.GetCity, form, {
      //       headers,
      //     })
      .then((res) => {
        const states = res?.data.data.map((item) => {
          return { label: item?.City, value: item?.ID };
        });
        setCity(states);
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
  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };
  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const shortenName = (name) => {
    return name?.length > 15 ? name?.substring(0, 25) + "..." : name;
  };
  // console.log("tabledata tabledata",tableData)
  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
  const handleSearch = (page) => {
    setLoading(true);
    const payload = {
      SalesManager: formData?.SalesManager
        ? String(formData?.SalesManager)
        : "",
      Status: formData?.Status ? formData?.Status : "",
      City: formData?.City ? String(formData?.City) : "",
      DtFrom: formData?.FromDate ? formData.FromDate : null,
      DtTo: formData?.ToDate ? formData.ToDate : null,
      IsExcel: false,
      OnlyDue: formData?.isDue === 1 ? true : false,
      PageSize: formData?.PageSize ? formData?.PageSize : 0,
      PageNo: page ?? currentPage - 1,
      ProjectIDs: formData?.ProjectID ? formData.ProjectID : [],
      VerticalIDs: formData?.VerticalID ? formData.VerticalID : [],
      TeamIDs: formData?.TeamID ? formData.TeamID : [],
      WingIDs: formData?.WingID ? formData.WingID : [],
      POC1s: formData?.POC1 ? formData.POC1 : [],
      POC2s: formData?.POC2 ? formData.POC2 : [],
      POC3s: formData?.POC3 ? formData.POC3 : [],
    };

    axiosInstances
      .post(apiUrls.LedgerStatus, payload)

      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res?.data?.data);
          const dataTotal = res?.data?.data[0];

          const formattedOpeningAmount = Number(
            dataTotal?.TotalOpeningAmount || 0
          ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          const formattedCurrentSale = Number(
            dataTotal?.TotalCurrentSale || 0
          ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          const formattedReceivedAmount = Number(
            dataTotal?.TotalReceivedAmount || 0
          ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          const formattedClosingBalance = Number(
            dataTotal?.TotalClosingBalance || 0
          ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          const formattedLastReceivedAmount = Number(
            dataTotal?.TotalLastReceivedAmount || 0
          ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          setSecondThead([
            "#",
            "#",
            "#",
            "#",
            "#",
            formattedOpeningAmount,
            formattedCurrentSale,
            formattedReceivedAmount,
            formattedClosingBalance,
            formattedLastReceivedAmount,
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
          ]);

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
  const handleExcel = () => {
    setLoading(true);
    const payload = {
      SalesManager: formData?.SalesManager
        ? String(formData?.SalesManager)
        : "",
      Status: formData?.Status ? formData?.Status : "",
      City: formData?.City ? String(formData?.City) : "",
      DtFrom: formData?.FromDate ? formData.FromDate : null,
      DtTo: formData?.ToDate ? formData.ToDate : null,
      IsExcel: true,
      OnlyDue: true,
      PageSize: 0,
      PageNo: 0,
      ProjectIDs: formData?.ProjectID ? formData.ProjectID : [],
      VerticalIDs: formData?.VerticalID ? formData.VerticalID : [],
      TeamIDs: formData?.TeamID ? formData.TeamID : [],
      WingIDs: formData?.WingID ? formData.WingID : [],
      POC1s: formData?.POC1 ? formData.POC1 : [],
      POC2s: formData?.POC2 ? formData.POC2 : [],
      POC3s: formData?.POC3 ? formData.POC3 : [],
    };

    axiosInstances
      .post(apiUrls.LedgerStatus, payload)
      .then((res) => {
        const datas = res?.data?.data;

        if (!datas || datas.length === 0) {
          console.error("No data available for download.");
          toast.error("No data available for download.");
          setLoading(false);
          return;
        }

        const username =
          useCryptoLocalStorage("user_Data", "get", "realname") || "User";
        const now = new Date();
        const currentDate = now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const currentTime = now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const titleRow = [
          { title: `${username} - ${currentDate} ${currentTime}` },
        ];
        const dataWithTitle = [...titleRow, ...datas];
        const fileType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const ws = XLSX.utils.json_to_sheet(datas, { skipHeader: false });
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "array",
        });
        const data = new Blob([excelBuffer], { type: fileType });

        // Save the file with the title as username, current date, and time
        FileSaver.saveAs(
          data,
          `${username}_${currentDate}_${currentTime}` + fileExtension
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error downloading the file:", err);
        alert("Failed to download the file. Please try again.");
        setLoading(false);
      });
  };
  const handleSearchFilter = () => {
    axiosInstances
      .post(apiUrls.SearchFilterDataSubmission, {
        Type: "LedgerStatus",
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append("Type", "LedgerStatus"),
      //   // form.append("FilterData", savedData),
      //   axios
      //     .post(apiUrls?.SearchFilterDataSubmission, form, { headers })
      .then((res) => {
        // console.log("Response data:", res?.data?.data);
        setFormData({
          ProjectID: res?.data?.ProjectID || [],
          VerticalID: res?.data?.VerticalID || [],
          TeamID: res?.data?.TeamID || [],
          WingID: res?.data?.WingID || [],
          POC1: res?.data?.POC1 || [],
          POC2: res?.data?.POC2 || [],
          POC3: res?.data?.POC3 || [],
          Status: res?.data?.Status || "All",
          DateType: res?.data?.DateType || "EntryDate",
          FromDate: new Date(res?.data?.FromDate),
          ToDate: new Date(res?.data?.ToDate),
          ReceivedDate: res?.data?.ReceivedDate || "",
          PaymentMode: res?.data?.PaymentMode || "",
          Remark: res?.data?.Remark || "",
          EntryDate: res?.data?.EntryDate || "",
          PageSize: res?.data?.PageSize || 50,
          PageNo: res?.data?.PageNo || "",
          isDue: res?.data?.isDue || 0,
          SalesManager: res?.data?.SalesManager || "",
          City: res?.data?.City || "",
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log("save data", formData);
  };
  useEffect(() => {
    getProject();
    getVertical();
    getTeam();
    getWing();
    getPOC1();
    getPOC2();
    getPOC3();
    getCity();
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const [visible, setVisible] = useState({
    showVisible: false,
    showLog: false,
    gmailVisible: false,
    showData: {},
  });

  const handleFormatlabel = (name, label, rest) => {
    return (
      <div
        style={{
          backgroundColor: rest?.rowColor,
          margin: "-8px -12px",
          padding: "8px 12px",
          boxSizing: "border-box",
        }}
      >
        {label}
      </div>
    );
  };

  const [currentPage, setCurrentPage] = useState(1);
  const totalRecords = parseInt(tableData[0]?.TotalRecord);
  const totalPages = Math.ceil(totalRecords / formData?.PageSize);
  const currentData = tableData;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    handleSearch(undefined, newPage - 1);
  };

  // const handlePageChange = (newPage) => {
  //   if (newPage > 0 && newPage <= totalPages) {
  //     setCurrentPage(newPage);
  //   }
  // };

  const navigate = useNavigate();
  const handlePageGoTo = () => {
    navigate("/AmountSubmission");
  };

  // const handleExport = () => {
  //   const element = document.getElementById("elementId");

  //   if (!element) {
  //     console.error("Element with ID 'elementId' not found.");
  //     return;
  //   }

  //   exportHtmlToPDF("elementId", tableData);
  // };

  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"500px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Unlock Client")}
        >
          <UnlockClientLedgerStatus visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.showLog && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Show Log Details")}
        >
          <UnlockClientLog visible={visible} setVisible={setVisible} />
        </Modal>
      )}

      {visible?.gmailVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Ledger Status Email Details")}
        >
          <GmailLedgerModal
            visible={visible}
            setVisible={setVisible}
            edit={true}
          />
        </Modal>
      )}
      <div className="card">
        <Heading title={t("Ledger Status")} isBreadcrumb={true} />
        <div className="row m-2">
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="ProjectID"
            placeholderName={t("Project")}
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
            value={formData.VerticalID.map((code) => ({
              code,
              name: vertical.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="TeamID"
            placeholderName={t("Team")}
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
            placeholderName={t("Wing")}
            dynamicOptions={wing}
            handleChange={handleMultiSelectChange}
            value={formData.WingID.map((code) => ({
              code,
              name: wing.find((item) => item.code === code)?.name,
            }))}
          />
          {/* <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="City"
            placeholderName="City"
            dynamicOptions={city}
            handleChange={handleDeliveryChange}
            value={formData.City}
          /> */}
          <Input
            type="text"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            className="form-control"
            id="City"
            name="City"
            lable={t("City")}
            placeholder=""
            onChange={handleChange}
            value={formData?.City}
          />
          <Input
            type="text"
            className="form-control"
            id="SalesManager"
            name="SalesManager"
            lable={t("Sales Manager")}
            placeholder=""
            onChange={handleChange}
            value={formData?.SalesManager}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
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
          {/* <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="SalesManager"
            placeholderName="SalesManager"
            dynamicOptions={manager}
            handleChange={handleDeliveryChange}
            value={formData.SalesManager}
          /> */}
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="POC1"
            placeholderName={t("POC-I")}
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
            placeholderName={t("POC-II")}
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
            placeholderName={t("POC-III")}
            dynamicOptions={poc3}
            handleChange={handleMultiSelectChange}
            value={formData.POC3.map((code) => ({
              code,
              name: poc3.find((item) => item.code === code)?.name,
            }))}
          />

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Status"
            placeholderName={t("Status")}
            dynamicOptions={[
              { label: "ALL", value: "ALL", rowColor: "white" },
              {
                label: "Manual-Lock",
                value: "Manual-Lock",
                rowColor: "#FFFF00",
              },
              {
                label: "Open By MaxExpiry",
                value: "Open By MaxExpiry",
                rowColor: "#3399FF",
              },
              { label: "Auto-Lock", value: "Auto-Lock", rowColor: "#00FFFF" },
              { label: "Open", value: "Open", rowColor: "#90EE90" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.Status}
            handleFormatlabel={handleFormatlabel}
          />

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="FollowupStatus"
            placeholderName="Followup Status"
            dynamicOptions={[{ label: "FollowupDate", value: "FollowupDate" }]}
            handleChange={handleDeliveryChange}
            value={formData.FollowupStatus}
            // requiredClassName={"required-fields"}
          />
          <ReactSelect
            respclass="col-xl-2 mt-1 col-md-4 col-sm-6 col-12"
            name="PageSize"
            placeholderName={t("PageSize")}
            dynamicOptions={PageSize}
            value={formData?.PageSize}
            // defaultValue={status.find((option) => option.value === "resolved")}
            handleChange={handleDeliveryChange}
            // requiredClassName={"required-fields"}
          />
          <div className="search-col" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="isDue"
                  checked={formData?.isDue ? 1 : 0}
                  onChange={handleCheckBox}
                />
                <span className="slider"></span>
              </label>
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "5px",
                  fontSize: "12px",
                }}
              >
                {t("isDue")}
              </span>
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-success ml-2"
              // onClick={() => handleSearch(formData?.Status)}
              onClick={() => handleSearch(undefined, "0")}
            >
              {t("Search")}
            </button>
          )}
          <button
            className="btn btn-sm btn-danger ml-2"
            onClick={handleSaveFilter}
          >
            {t("Save Filter")}
          </button>
          <button
            className="btn btn-sm btn-danger ml-2"
            onClick={handleSearchFilter}
          >
            {t("Search Filter")}
          </button>
          <button className="btn btn-sm btn-danger ml-2" onClick={handleReset}>
            {t("Reset Filter")}
          </button>
          {loading ? (
            <Loading />
          ) : (
            <img
              src={excelimg}
              className="ml-3"
              style={{ width: "28px", height: "24px", cursor: "pointer" }}
              onClick={handleExcel}
            ></img>
          )}
          {/* {tableData?.length > 0 && (
            <img
              src={pdf}
              className=" ml-2"
              style={{
                width: "28px",
                height: "25px",
                cursor: "pointer",
                marginRight: "5px",
              }}
              onClick={() => ExportToPDF(tableData)}
            ></img>
          )} */}
          {/* <div
          style={{ cursor: "pointer" }}
          onClick={() => exportHtmlToPDF(tableData)}
          // onClick={() => exportHtmlToPDF("hidden-template", tableData)}
        >
          <IconsColor ColorCode={"PDF"} />
        </div> */}
          {tableData?.length > 0 && (
            <div className="col-sm-4 ml-2">
              <div className="row">
                <div className="d-flex flex-wrap align-items-center">
                  {/* Manual-Lock */}
                  <div
                    className="d-flex align-items-center mr-4 ml-3"
                    style={{ cursor: "pointer" }}
                    // onClick={() => handleSearch("Manual-Lock")}
                  >
                    <div
                      className="cssledger"
                      style={{
                        backgroundColor: "#FFFF00",
                        borderColor: "#FFFF00",
                      }}
                    ></div>
                    <span className="ledgerfontcl ml-2">
                      {t("Manual-Lock")}
                    </span>
                  </div>

                  {/* Open By MaxExpiry */}
                  <div
                    className="d-flex align-items-center mr-4"
                    style={{ cursor: "pointer" }}
                    // onClick={() => handleSearch("Open By MaxExpiry", "0")}
                  >
                    <div
                      className="cssledger"
                      style={{
                        backgroundColor: "#3399FF",
                        borderColor: "#3399FF",
                      }}
                    ></div>
                    <span className="ledgerfontcl ml-2">
                      {t("Open By MaxExpiry")}
                    </span>
                  </div>

                  {/* Auto-Lock */}
                  <div
                    className="d-flex align-items-center mr-4"
                    style={{ cursor: "pointer" }}
                    // onClick={() => handleSearch("Auto-Lock", "0")}
                  >
                    <div
                      className="cssledger"
                      style={{ backgroundColor: "#00FFFF" }}
                    ></div>
                    <span className="ledgerfontcl ml-2">{t("Auto-Lock")}</span>
                  </div>

                  {/* Open */}
                  <div
                    className="d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    // onClick={() => handleSearch("Open", "0")}
                  >
                    <div
                      className="cssledger"
                      style={{ backgroundColor: "#90EE90" }}
                    ></div>
                    <span className="ledgerfontcl ml-2">{t("Open")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {tableData?.length > 0 ? (
        <div className="card mt-2">
          <Heading
            title={
              <span style={{ fontWeight: "bold" }}>{t("Search Details")}</span>
            }
          />
          <Tables
            thead={ledgerstatusThead}
            secondHead={secondThead}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (
                <>
                  <div
                    className="d-flex"
                    style={{
                      justifyContent: "space-between",
                      margin: "0px",
                      padding: "0px",
                    }}
                  >
                    <span>{index + 1}</span>
                    <span className="ledger-span">
                      <AmountSubmissionSeeMoreList
                        ModalComponent={ModalComponent}
                        // isShowDropDown={false}
                        setSeeMore={setSeeMore}
                        data={{ ...ele, type: "LedgerStatus" }}
                        setVisible={() => {
                          setListVisible(false);
                        }}
                        handleBindFrameMenu={[
                          {
                            FileName: "Amount Submission",
                            URL: "AmountSubmission",
                            FrameName: "AmountSubmission",
                            Description: "AmountSubmission",
                          },
                          {
                            FileName: "Sales Booking",
                            URL: "SalesBooking",
                            FrameName: "SalesBooking",
                            Description: "SalesBooking",
                          },
                          {
                            FileName: "Sales Booking Search ",
                            URL: "SearchSalesBooking",
                            FrameName: "SearchSalesBooking",
                            Description: "SearchSalesBooking",
                          },
                          {
                            FileName: "Quotation Booking",
                            URL: "QuotationBooking",
                            FrameName: "QuotationBooking",
                            Description: "QuotationBooking",
                          },
                          {
                            FileName: "Quotation Booking Search ",
                            URL: "SearchQuotationBooking",
                            FrameName: "SearchQuotationBooking",
                            Description: "SearchQuotationBooking",
                          },
                          {
                            FileName: "Connector Request",
                            URL: "ConnectorRequest",
                            FrameName: "ConnectorRequest",
                            Description: "ConnectorRequest",
                          },
                          {
                            FileName: "Search Connector Request",
                            URL: "SearchConnectorRequest",
                            FrameName: "SearchConnectorRequest",
                            Description: "SearchConnectorRequest",
                          },
                          {
                            FileName: "Tax Invoice Request",
                            URL: "TaxInvoiceRequest",
                            FrameName: "TaxInvoiceRequest",
                            Description: "TaxInvoiceRequest",
                          },
                          {
                            FileName: "Tax Invoice View",
                            URL: "TaxInvoiceView",
                            FrameName: "TaxInvoiceView",
                            Description: "TaxInvoiceView",
                          },
                          {
                            FileName: "FollowUp Status",
                            URL: "LedgerFollowupStatus",
                            FrameName: "LedgerFollowupStatus",
                            Description: "LedgerFollowupStatus",
                          },
                        ]}
                        isShowPatient={true}
                      />
                    </span>
                  </div>
                </>
              ),

              Team: ele?.Team,
              SalesManager: ele?.SalesManager,
              "POC-1": ele?.POC_1,
              "Project Name": (
                <Tooltip label={ele?.ProjectName}>
                  <span
                    id={`projectName-${index}`}
                    targrt={`projectName-${index}`}
                    style={{ textAlign: "center" }}
                  >
                    {shortenName(ele?.ProjectName)}
                  </span>
                </Tooltip>
              ),
              "Opening Balance": ele?.OpeningAmount,
              "Current Sale": ele?.CurrentSale,
              "Received Amount": ele?.ReceivedAmount,
              "Closing Balance": ele?.ClosingBalance,
              "Last Received Amount": ele?.LastReceivedAmount,
              "Last Received Date": ele?.LastReceivedDate,
              Ageing: ele?.Ageing,
              LiveDate: ele?.LiveDate,
              City: ele?.City,
              SPOC: capitalizeFirstLetter(ele?.Owner_Name),
              Mobile: ele?.Owner_Mobile,
              Email: (
                // ele?.TaxInvoiceNo !=="" &&
                <img
                  src={gmaillogo}
                  height={"10px"}
                  onClick={() => {
                    setVisible({
                      gmailVisible: true,
                      showData: ele,
                    });
                  }}
                  title="Click to Gmail."
                  style={{ marginLeft: "12px" }}
                ></img>
              ),
              // FollowUp: (
              //   <button className="btn btn-sm btn-primary">FollowUp</button>
              // ),
              "Ledger Status": (
                <div className="d-flex justify-content-between">
                  {ele?.LedgerStatus == "Open" ? (
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() => {
                        setVisible({ showVisible: true, showData: ele });
                      }}
                    >
                      {t("Open")}
                    </button>
                  ) : (
                    // <i className="fa fa-print"></i>
                    ""
                  )}
                </div>
              ),
              "Lock/UnLockReason": capitalizeFirstLetter(ele?.LockUnLockReason),
              // "Last Paid Amount": ele?.LastPaidAmount,
              // "Last Paid Date": ele?.LastPaidDate,

              // "Age(Last Paid Date)": ele?.AgeLastPaidDate,
              Log: (
                <>
                  {AllowLockUnLock == "1" && (
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() => {
                        setVisible({ showLog: true, showData: ele });
                      }}
                    >
                      {t("Log")}
                    </button>
                  )}
                </>
              ),
              colorcode: ele?.RowColor,
            }))}
            tableHeight={"tableHeight"}
          />
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
          <div className="ml-auto">
            <CustomPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <>
          <NoRecordFound />
        </>
      )}
    </>
  );
};

export default LedgerStatus;
