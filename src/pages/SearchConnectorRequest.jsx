import React, { useEffect, useState } from "react";
import { headers } from "../utils/apitools";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import Heading from "../components/UI/Heading";
import ReactSelect from "../components/formComponent/ReactSelect";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import DatePicker from "../components/formComponent/DatePicker";
import { Link, useNavigate } from "react-router-dom";
import Tables from "../components/UI/customTable";
import { toast } from "react-toastify";
import ConnectorSettlementModal from "../components/UI/customTable/ConnectorSettlementModal";
import Modal from "../components/modalComponent/Modal";
import ConnectorDiscountModal from "../components/UI/customTable/ConnectorDiscountModal";
import ConnectorApproveModal from "../components/UI/customTable/ConnectorApproveModal";
import ConnectorIssueModal from "../components/UI/customTable/ConnectorIssueModal";
import ConnectorRejectModal from "../components/UI/customTable/ConnectorRejectModal";
import Loading from "../components/loader/Loading";
import { PageSize } from "../utils/constant";
import CustomPagination from "../utils/CustomPagination";
import excelimg from "../../src/assets/image/excel.png";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import Tooltip from "./Tooltip";
import { useTranslation } from "react-i18next";
import pdf from "../../src/assets/image/pdf.png";
import { ExportToPDF } from "../../src/networkServices/Tools";
import gmaillogo from "../../src/assets/image/Gmail_Logo.png";
import GmailConnecterModal from "../components/UI/customTable/GmailConnecterModal";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const SearchConnectorRequest = ({ data }) => {
  // console.log("jsjshjshj", data);
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [users, setUsers] = useState([]);
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);
  const [poc1, setPoc1] = useState([]);
  const [poc2, setPoc2] = useState([]);
  const [project, setProject] = useState([]);
  const [poc3, setPoc3] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionChangeDetail, setActionChangeDetail] = useState({
    showVisible: false,
    discountVisible: false,
    editVisible: false,
    approveVisible: false,
    issueVisible: false,
    rejectVisible: false,
    receiptVisible: false,
    gmailVisible: false,
    data: "",
  });
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    ProjectID: [],
    VerticalID: [],
    TeamID: [],
    WingID: [],
    Users: [],
    POC1: [],
    POC2: [],
    POC3: [],
    Status: "All",
    DateType: "EntryDate",
    FromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    ToDate: new Date(),
    ActionChange: "",
    PageSize: "50",
    PageNo: "",
  });
  useEffect(() => {
    // console.log("data", data);
    if (data) {
      const projectID = data?.ProjectID;
      // console.log("[data?.ProjectID]", [data?.ProjectID]);
      setFormData((prevData) => ({
        ...prevData,
        ProjectID: [projectID],
      }));
      handleSearch("", "", [data?.ProjectID]); // Pass ProjectID directly
    }
  }, [data]);
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleReset = () => {
    setFormData({
      ...formData,
      ProjectID: [],
      VerticalID: [],
      TeamID: [],
      WingID: [],
      Users: [],
      POC1: [],
      POC2: [],
      POC3: [],
      Status: "All",
      DateType: "EntryDate",
      FromDate: new Date(),
      ToDate: new Date(),
      ActionChange: "",
      PageSize: "5",
      PageNo: "",
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
  "Type": "AmountSubmission",
  "FilterData": String(savedData)
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("Type", "AmountSubmission"),
    //   form.append("FilterData", savedData),
    //   axios
    //     .post(apiUrls?.SaveFilterDataSubmission, form, { headers })
        .then((res) => {
          toast.success(res?.data?.message);
          setFormData({
            ...formData,
            ProjectID: [],
            VerticalID: [],
            TeamID: [],
            WingID: [],
            Users: [],
            POC1: [],
            POC2: [],
            POC3: [],
            Status: "All",
            DateType: "EntryDate",
            FromDate: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ),
            ToDate: new Date(),
            ActionChange: "",
            PageSize: "50",
            PageNo: "",
          });
        })
        .catch((err) => {
          console.log(err);
        });

    // console.log("save data", formData);
  };

  const handleSearchFilter = () => {
    axiosInstances
      .post(apiUrls.SearchFilterDataSubmission, {
  "Type": "AmountSubmission"
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("Type", "AmountSubmission"),
    //   // form.append("FilterData", savedData),
    //   axios
    //     .post(apiUrls?.SearchFilterDataSubmission, form, { headers })
        .then((res) => {
          console.log("Response data:", res?.data);

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
          });
          console.log("check formdata", formData);
          // if (res?.data) {
          //   console.log("kamaldata:", res?.data);
          // } else {
          //   console.error("No data found in the response.");
          // }
        })
        .catch((err) => {
          console.log(err);
        });

    // console.log("save data", formData);
  };
  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };
  const searchHandleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  const getMultiReporter = () => {
    axiosInstances
      .post(apiUrls.Reporter_Select, {
  "IsMaster": 0,
  "RoleID": 0,
  "OnlyItdose": 0
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.Reporter_Select, form, { headers })
        .then((res) => {
          const reporters = res?.data.data.map((item) => {
            return { name: item?.NAME, code: item?.ID };
          });
          setUsers(reporters);
        })
        .catch((err) => {
          console.log(err);
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
  const getProject = () => {
     axiosInstances
      .post(apiUrls.ProjectSelect, {
  "ProjectID": 0,
  "IsMaster": "0",
  "VerticalID": 0,
  "TeamID": 0,
  "WingID": 0
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname")),
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

  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  const handleSearch = (code, page, project) => {
    if (formData?.DateType == "") {
      toast.error("Please Select DateType.");
    } else if (formData?.Status == "") {
      toast.error("Please Select Status.");
    } else {
      setLoading(true);
       axiosInstances
      .post(apiUrls.Connector_Search, {
  "ConnectorID": 0,
  "DateType": String(formData?.DateType),
  "FromDate": String(formatDate(formData?.FromDate)),
  "ToDate": String(formatDate(formData?.ToDate)),
  "Status": String(formData?.Status),
  "rowColor": String(code ? code : ""),
  "PageSize": Number(formData?.PageSize),
  "PageNo": Number(page ?? currentPage - 1),
  "IsExcel": 0,
  "ProjectID": String(project?.length > 0 && project !== "0" ? project : formData?.ProjectID),
  "VerticalID": String(formData?.VerticalID),
  "TeamID":String(formData?.TeamID),
  "WingID": String(formData?.WingID),
  "POC1":String(formData?.POC1),
  "POC2": String(formData?.POC2),
  "POC3": String(formData?.POC3),
})
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname")),
      //   form.append(
      //     "ProjectID",
      //     project?.length > 0 && project !== "0" ? project : formData?.ProjectID
      //   ),
      //   form.append("VerticalID", formData?.VerticalID),
      //   form.append("TeamID", formData?.TeamID),
      //   form.append("WingID", formData?.WingID),
      //   form.append("POC1", formData?.POC1),
      //   form.append("POC2", formData?.POC2),
      //   form.append("POC3", formData?.POC3),
      //   form.append("Status", formData?.Status),
      //   form.append("DateType", formData?.DateType),
      //   form.append("FromDate", formatDate(formData?.FromDate)),
      //   form.append("ToDate", formatDate(formData?.ToDate)),
      //   form.append("ConnectorID", ""),
      //   form.append("IsExcel", "0"),
      //   form.append("rowColor", code ? code : ""),
      //   form.append("PageSize", formData?.PageSize),
      //   form.append("PageNo", page ?? currentPage - 1),
      //   axios
      //     .post(apiUrls?.Connector_Search, form, { headers })
          .then((res) => {
            const data = res?.data?.data;
            if (data?.length == 0) {
              setShownodata(true);
            }
            const updatedData = data?.map((ele, index) => {
              return {
                ...ele,
                index: index,
                edit: true,
                url: `${res?.data.Url}${ele?.ID}`,
                Amount25PinFemale: ele?.Amount25PinFemale,
                Amount25PinMale: ele?.Amount25PinMale,
                Amount9PinFemale: ele?.Amount9PinFemale,
                Amount9PinMale: ele?.Amount9PinMale,
                Quantity25Female: ele?.Quantity25Female,
                Quantity25Male: ele?.Quantity25Male,
                Quantity9Female: ele?.Quantity9Female,
                Quantity9Male: ele?.Quantity9Male,
              };
            });
            setTableData(updatedData);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
    }
  };
  const handleExcel = () => {
    setLoading(true);
     axiosInstances
      .post(apiUrls.Connector_Search, {
  ConnectorID: formData?.ConnectorID ? Number(formData.ConnectorID) : 0,
  DateType: formData?.DateType ? String(formData.DateType) : "",
  FromDate: formData?.FromDate ? String(formatDate(formData.FromDate)) : "",
  ToDate: formData?.ToDate ? String(formatDate(formData.ToDate)) : "",
  Status: formData?.Status ? String(formData.Status) : "",
  rowColor: formData?.rowColor ? String(formData.rowColor) : "",
  PageSize: formData?.PageSize ? Number(formData.PageSize) : 0,
  PageNo: formData?.PageNo ? Number(formData.PageNo) : 0,
  IsExcel: formData?.IsExcel ? Number(formData.IsExcel) : 0,
  ProjectID: formData?.ProjectID ? String(formData.ProjectID) : "",
  VerticalID: formData?.VerticalID ? String(formData.VerticalID) : "",
  TeamID: formData?.TeamID ? String(formData.TeamID) : "",
  WingID: formData?.WingID ? String(formData.WingID) : "",
  POC1: formData?.POC1 ? String(formData.POC1) : "",
  POC2: formData?.POC2 ? String(formData.POC2) : "",
  POC3: formData?.POC3 ? String(formData.POC3) : ""
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname")),
    //   form.append("ProjectID", formData?.ProjectID),
    //   form.append("VerticalID", formData?.VerticalID),
    //   form.append("TeamID", formData?.TeamID),
    //   form.append("WingID", formData?.WingID),
    //   form.append("POC1", formData?.POC1),
    //   form.append("POC2", formData?.POC2),
    //   form.append("POC3", formData?.POC3),
    //   form.append("Status", formData?.Status),
    //   form.append("DateType", formData?.DateType),
    //   form.append("FromDate", formatDate(formData?.FromDate)),
    //   form.append("ToDate", formatDate(formData?.ToDate)),
    //   form.append("ConnectorID", ""),
    //   form.append("IsExcel", "1"),
    //   form.append("PageSize", formData?.PageSize),
    //   axios
    //     .post(apiUrls?.Connector_Search, form, { headers })
        .then((res) => {
          console.log("dataatata", res?.data?.data);
          const datas = res?.data?.data;

          if (!datas || datas.length === 0) {
            console.error("No data available for download.");
            alert("No data available for download.");
            setLoading(false);
            return;
          }

          const username = useCryptoLocalStorage("user_Data", "get", "realname") || "User";
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
  const [currentPage, setCurrentPage] = useState(1);
  const totalRecords = parseInt(tableData[0]?.TotalRecord);
  const totalPages = Math.ceil(totalRecords / formData?.PageSize);
  const currentData = tableData;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    handleSearch(undefined, newPage - 1);
  };

  const handleDeliveryChangeValue = (name, value, index, ele) => {
    if (name === "ActionChange") {
      const connectdata = [...tableData];
      connectdata[index]["ActionChange"] = value;
      setTableData(connectdata);

      if (value === "Settlement") {
        setActionChangeDetail({
          showVisible: true,
          discountVisible: false,
          connectdata: connectdata[index],
        });
      } else if (value === "Discount") {
        setActionChangeDetail({
          showVisible: false,
          discountVisible: true,
          connectdata: connectdata[index],
        });
      } else if (value === "Edit") {
        setActionChangeDetail({
          showVisible: false,
          discountVisible: false,
          editVisible: true,
          connectdata: connectdata[index],
          ele: ele?.ID,
        });
        navigate("/ConnectorRequest", {
          state: { connectdata: connectdata[index], ele: ele?.ID, edit: true },
        });
      } else if (value === "Approve") {
        setActionChangeDetail({
          showVisible: false,
          discountVisible: false,
          editVisible: false,
          approveVisible: true,
          connectdata: connectdata[index],
        });
      } else if (value === "Issue") {
        setActionChangeDetail({
          showVisible: false,
          discountVisible: false,
          editVisible: false,
          approveVisible: false,
          issueVisible: true,
          connectdata: connectdata[index],
        });
      } else if (value === "Reject") {
        setActionChangeDetail({
          showVisible: false,
          discountVisible: false,
          editVisible: false,
          approveVisible: false,
          issueVisible: false,
          rejectVisible: true,
          connectdata: connectdata[index],
        });
      } else if (value === "Receipt") {
        setActionChangeDetail({
          showVisible: false,
          discountVisible: false,
          editVisible: false,
          approveVisible: false,
          issueVisible: false,
          rejectVisible: false,
          receiptVisible: true,
          connectdata: connectdata[index],
          ele: ele,
        });
        window.open(ele?.ConnectorReceiptURL);
      } else {
        setActionChangeDetail({
          showVisible: false,
          discountVisible: false,
          editVisible: false,
          approveVisible: false,
          issueVisible: false,
          rejectVisible: false,
          receiptVisible: false,
        });
      }
    }
  };

  useEffect(() => {
    getVertical();
    getTeam();
    getWing();
    getMultiReporter();
    getPOC1();
    getPOC2();
    getPOC3();
    getProject();
  }, []);

  const shortenName = (name) => {
    return name?.length > 20 ? name?.substring(0, 35) + "..." : name;
  };

  const connectorSearchTHEAD = [
    { name: t("S.No."), width: "5%" },
    t("Issue No"),
    // t("IssueBy"),
    t("ClientName"),
    t("25 Pin Male"),
    t("25 Pin Female"),
    t("9 Pin Male"),
    t("9 Pin Female"),
    t("Gross Amount"),
    t("Discount Amount"),
    t("Net Amount"),
    t("Paid Amount"),
    t("Balance Amount"),
    t("Created Date"),
    t("Print"),
    t("Email"),
    t("Action Change"),
    // t("Approve"),
    // t("Issue"),
    // t("Reject"), // dropdown
    // t("Receipt"),
    // t("Settlement"),
    // t("Discount"),
    // t("Edit"),
  ];
  
  return (
    <>
      {actionChangeDetail?.gmailVisible && (
        <Modal
          modalWidth={"600px"}
          visible={actionChangeDetail}
          setVisible={setActionChangeDetail}
          Header={t("Connector Request Email Details")}
        >
          <GmailConnecterModal
            visible={actionChangeDetail}
            setVisible={setActionChangeDetail}
            edit={true}
          />
        </Modal>
      )}

      {actionChangeDetail?.showVisible && (
        <Modal
          modalWidth={"800px"}
          visible={actionChangeDetail}
          setVisible={setActionChangeDetail}
          Header={t("Settlement Details")}
        >
          <ConnectorSettlementModal
            visible={actionChangeDetail}
            setVisible={setActionChangeDetail}
            data={actionChangeDetail?.data}
          />
        </Modal>
      )}

      {actionChangeDetail?.discountVisible && (
        <Modal
          modalWidth={"800px"}
          visible={actionChangeDetail}
          setVisible={setActionChangeDetail}
          Header={t("Discount Details")}
        >
          <ConnectorDiscountModal
            visible={actionChangeDetail}
            setVisible={setActionChangeDetail}
            data={actionChangeDetail?.data}
          />
        </Modal>
      )}
      {actionChangeDetail?.approveVisible && (
        <Modal
          modalWidth={"600px"}
          visible={actionChangeDetail}
          setVisible={setActionChangeDetail}
          Header={t("Approve Request")}
        >
          <ConnectorApproveModal
            visible={actionChangeDetail}
            setVisible={setActionChangeDetail}
            data={actionChangeDetail?.data}
          />
        </Modal>
      )}
      {actionChangeDetail?.issueVisible && (
        <Modal
          modalWidth={"600px"}
          visible={actionChangeDetail}
          setVisible={setActionChangeDetail}
          Header={t("Issue Request")}
        >
          <ConnectorIssueModal
            visible={actionChangeDetail}
            setVisible={setActionChangeDetail}
            data={actionChangeDetail?.data}
          />
        </Modal>
      )}
      {actionChangeDetail?.rejectVisible && (
        <Modal
          modalWidth={"600px"}
          visible={actionChangeDetail}
          setVisible={setActionChangeDetail}
          Header={t("Reject Request")}
        >
          <ConnectorRejectModal
            visible={actionChangeDetail}
            setVisible={setActionChangeDetail}
            data={actionChangeDetail?.data}
          />
        </Modal>
      )}
      <div className="card">
        <Heading
          title={
            <span style={{ fontWeight: "bold" }}>
              {t("Search Connector Request")}
            </span>
          }
        />
        <div className="row g-4 m-2">
          {/* <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Users"
            placeholderName="User"
            dynamicOptions={users}
            optionLabel="Users"
            className="Users"
            handleChange={handleMultiSelectChange}
            value={formData.Users.map((code) => ({
              code,
              name: users.find((item) => item.code === code)?.name,
            }))}
          /> */}
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
            name="DateType"
            placeholderName={t("Date Type")}
            dynamicOptions={[
              { label: "IssueDate", value: "IssueDate" },
              { label: "EntryDate", value: "EntryDate" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.DateType}
            requiredClassName={"required-fields"}
          />
          <DatePicker
            className="custom-calendar"
            id="FromDate"
            name="FromDate"
            lable={t("From Date")}
            // maxDate={formData?.ToDate}
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
            // minDate={formData?.FromDate}
            placeholder={VITE_DATE_FORMAT}
            value={formData?.ToDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Status"
            placeholderName={t("Status")}
            dynamicOptions={[
              { label: "All", value: "All" },
              { label: "Settled", value: "Settled" },
              { label: "Pending", value: "pending" },
              { label: "PartialSettled", value: "PartialSettled" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.Status}
            requiredClassName={"required-fields"}
          />

          <ReactSelect
            respclass="col-xl-2 mt-1 col-md-4 col-sm-6 col-12"
            name="PageSize"
            placeholderName={t("PageSize")}
            dynamicOptions={PageSize}
            value={formData?.PageSize}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
          />
          <div className="ml-2">
            {loading ? (
              <Loading />
            ) : (
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleSearch(undefined, "0")}
              >
                {t("Search")}
              </button>
            )}
            <button
              className="btn btn-sm btn-danger ml-2"
              onClick={handleReset}
            >
              {t("Reset Filter")}
            </button>
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
            <img
              src={excelimg}
              className="ml-3"
              style={{ width: "28px", height: "24px", cursor: "pointer" }}
              onClick={handleExcel}
            ></img>
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
            <Link to="/ConnectorRequest" className="ml-3">
              {t("Back To MainPage")}
            </Link>
          </div>
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card mt-2">
          <Heading
            title={t("Search Details")}
            secondTitle={
              <div style={{ display: "flex", fontWeight: "bold" }}>
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
                      }}
                      onClick={() => handleSearch("0", "0")}
                    ></div>
                    <span
                      className="legend-label ml-2"
                      style={{
                        width: "90%",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      {t("Req Raised")}
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
                        backgroundColor: "lightgreen",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSearch("1 ", "0")}
                    ></div>
                    <span
                      className="legend-label"
                      style={{
                        width: "90%",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      {t("Approve")}
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
                        backgroundColor: "orange",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSearch("2", "0")}
                    ></div>
                    <span
                      className="legend-label"
                      style={{
                        width: "100%",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      {t("Issued")}
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
                        backgroundColor: "lightpink",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSearch("3", "0")}
                    ></div>
                    <span
                      className="legend-label"
                      style={{
                        width: "70%",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      {t("Reject")}
                    </span>
                  </div>
                </div>
                <span className="ml-4">
                  {t("Total Amount")} :&nbsp;{tableData[0]?.GrandTotalAmount}
                </span>
                <span className="ml-4">
                  {t("Total Record")} :&nbsp; {tableData?.length}
                </span>
              </div>
            }
          />
          <Tables
            thead={connectorSearchTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * formData?.PageSize + index + 1,
              "Issue No": (
                <Tooltip label={ele?.ActualIssueNo}>
                  <span
                    id={`projectName-${index}`}
                    targrt={`projectName-${index}`}
                    style={{ textAlign: "center" }}
                  >
                    {shortenName(ele?.IssueNo)}
                  </span>
                </Tooltip>
              ),
              // IssueBy: ele?.IssueBy,
              ClientName: (
                <span
                  id={`projectName-${index}`}
                  targrt={`projectName-${index}`}
                  title={ele?.ProjectName}
                >
                  {shortenName(ele?.ProjectName)}
                </span>
              ),
              "25 Pin Male": ele?.Quantity25Male,
              "25 Pin Female": ele?.Quantity25Female,
              "9 Pin Male": ele?.Quantity9Male,
              "9 Pin Female": ele?.Quantity9Female,
              "Gross Amount": ele?.TotalAmount,
              "Discount Amount": ele?.DiscountOnTotal,
              "Net Amount": ele?.TotalAmount - ele?.DiscountOnTotal,
              "Paid Amount": ele?.ReceivedAmount,
              "Balance Amount": ele?.TotalAmount - ele?.DiscountOnTotal,
              "Created Date": ele?.CreatedDate,
              Print: ele?.ConnectorReceiptURL ? (
                <i
                  className="fa fa-print"
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    color: "white",
                    border: "1px solid green",
                    padding: "2px",
                    background: "black",
                    borderRadius: "3px",
                  }}
                  onClick={() =>
                    window.open(ele?.ConnectorReceiptURL, "_blank")
                  }
                ></i>
              ) : null,
              Email: (
                // ele?.TaxInvoiceNo !=="" &&
                <img
                  src={gmaillogo}
                  height={"10px"}
                  onClick={() => {
                    setActionChangeDetail({
                      gmailVisible: true,
                      showData: ele,
                      ele,
                    });
                  }}
                  title="Click to Gmail."
                  style={{ marginLeft: "12px" }}
                ></img>
              ),
              "Action Change": (
                <div style={{ width: "130px" }}>
                  <ReactSelect
                    style={{ width: "100%", marginLeft: "10px" }}
                    // respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name="ActionChange"
                    dynamicOptions={[
                      { label: "Approve", value: "Approve" },
                      { label: "Issue", value: "Issue" },
                      { label: "Reject", value: "Reject" },
                      { label: "Receipt", value: "Receipt" },
                      { label: "Settlement", value: "Settlement" },
                      { label: "Discount", value: "Discount" },
                      { label: "Edit", value: "Edit" },
                    ]}
                    value={ele.ActionChange}
                    handleChange={(name, value) => {
                      const ind =
                        (currentPage - 1) * formData?.PageSize + index;
                      handleDeliveryChangeValue(name, value?.value, ind, ele);
                    }}
                  />
                </div>
              ),
              colorcode: ele?.rowColor,
            }))}
            tableHeight={"tableHeight"}
          />
          <div className="ml-auto">
            <CustomPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SearchConnectorRequest;
