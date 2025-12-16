import React, { useEffect, useState } from "react";
import { headers } from "../utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";
import ReactSelect from "../components/formComponent/ReactSelect";
import Input from "../components/formComponent/Input";
import Heading from "../components/UI/Heading";
import Tables from "../components/UI/customTable";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
// import { projectPlanTHEAD } from "../components/modalComponent/Utils/HealperThead";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/modalComponent/Modal";

import { apiUrls } from "../networkServices/apiEndpoints";
import AddProjectModal from "./AddProjectModal";
import ProjectMasterProjectModal from "./ProjectMasterProjectModal";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";

import Tooltip from "./Tooltip";
import AmountSubmissionSeeMoreList from "../networkServices/AmountSubmissionSeeMoreList";
import SlideScreen from "./SlideScreen";
import SeeMoreSlideScreen from "../components/SearchableTable/SeeMoreSlideScreen";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { FaCalendarAlt, FaInfoCircle, FaRupeeSign } from "react-icons/fa";
import DocumentTypeModalProject from "./DocumentTypeModalProject";
import excelimg from "../../src/assets/image/excel.png";
import excelimgOrange from "../../src/assets/image/orangeExcel.png";
import NewProjectModal from "./CRM/NewProjectModal";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import Loading from "../components/loader/Loading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import DatePicker from "../components/formComponent/DatePicker";
import { useTranslation } from "react-i18next";
import moment from "moment";
import SearchLotusFilter from "./SearchLotusFilter";
import Accordion from "./Accordion";
import { axiosInstances } from "../networkServices/axiosInstance";
const SearchProjectMaster = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [project, setProject] = useState([]);
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wing, setWing] = useState([]);
  const [poc1, setPoc1] = useState([]);
  const [poc2, setPoc2] = useState([]);
  const [projectStatus, setProjectStatus] = useState([]);
  const [username, setUserName] = useState([]);
  const [poc3, setPoc3] = useState([]);
  const [listVisible, setListVisible] = useState(false);
  const [dynamicFilter, setDynamicFilter] = useState([]);
  const [columnConfig, setColumnConfig] = useState([]);
  const [productversion, setProductVersion] = useState([]);
  const [formData, setFormData] = useState({
    ProjectID: "",
    TeamID: [],
    Mandays: "",
    Onsitecharges: "",
    MachineChargesUNI: "",
    MachineChargesBI: "",
    ProjectName: "",
    Status: "1",
    WingID: [],
    POC1: [],
    POC2: [],
    POC3: [],
    VerticalID: [],
    Category: [],
    TableStatus: "",
    UserName: "",
    TStatus: "",
    DateType: "0",
    FromDate: "",
    ToDate: "",
    ProjectStatus: "0",
    OnlyMappingClient: "",
    PODate: "",
    PODateBefore: new Date(),
    PODateAfter: new Date(),
    ProductVersion: [],
    StartDate: "",
    StartDateBefore: new Date(),
    StartDateAfter: new Date(),

    LiveDate: "",
    LiveDateBefore: new Date(),
    LiveDateAfter: new Date(),

    TransferDate: "",
    TransferDateBefore: new Date(),
    TransferDateAfter: new Date(),
  });
  const handleCheckBox = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const SaveFilter = () => {
    const filterData = [
      { header: "S.No", visible: true },
      { header: "ProjectName", visible: true },
      { header: "ProductVersion", visible: true },
      { header: "Category", visible: true },
      { header: "VerticalID", visible: true },
      { header: "TeamID", visible: true },
      { header: "WingID", visible: true },
      { header: "POC1", visible: true },
      { header: "POC2", visible: true },
      { header: "POC3", visible: true },
      { header: "DateType", visible: true },
      { header: "ProjectStatus", visible: true },
      { header: "OnlyMappingClient", visible: true },
    ];

    const jsonString = JSON.stringify(filterData);
    axiosInstances
      .post(apiUrls?.SaveFilterTableReprintData, {
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        FilterData: String(jsonString),
        PageName: "SearchProjectMaster",
      })
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        setLoading(true);
      });
  };

  const SaveTableFilter = () => {
    const filterData = [
      { header: "S.No", visible: true },
      { header: "Team", visible: true },
      { header: "ProjectID", visible: true },
      { header: "Project Name", visible: true },
      { header: "Display Name", visible: true },
      { header: "Address", visible: true },
      { header: "Dates", visible: true },
      { header: "Details", visible: true },
      { header: "Status", visible: true },
      { header: "Amc Amount", visible: true },
      { header: "PO Amount", visible: true },
      { header: "Advanced Amount", visible: true },
      { header: "Received Amount", visible: true },
      { header: "Balance Amount", visible: true },
      { header: "Edit", visible: true },
      { header: "Action", visible: true },
    ];

    const jsonString = JSON.stringify(filterData);
    axiosInstances
      .post(apiUrls?.SaveFilterTableReprintData, {
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        FilterData: String(jsonString),
        PageName: "SearchProjectMasterTable",
      })
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        setLoading(true);
      });
  };

  const SearchAmountSubmissionFilter = () => {
    axiosInstances
      .post(apiUrls?.GetFilterTableReprintData, {
        PageName: String("SearchProjectMaster"),
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
      })
      .then((res) => {
        console.log("SearchProjectMaster", res);
        const data = res.data.data;
        if (res?.data.success === true) {
          setDynamicFilter(data);
        } else {
          SaveFilter();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const SearchAmountSubmissionTableFilter = () => {
    axiosInstances
      .post(apiUrls?.GetFilterTableReprintData, {
        PageName: String("SearchProjectMasterTable"),
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
      })
      .then((res) => {
        const data = res.data.data;
        if (res?.data.success === true) {
          setColumnConfig(data);
        } else {
          SaveTableFilter();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProduct = () => {
    axiosInstances
      .post(apiUrls?.GetProductVersion, {
        ID: String(useCryptoLocalStorage("user_Data", "get", "ID")),
        LoginName: String(
          useCryptoLocalStorage("user_Data", "get", "realname")
        ),
      })
      .then((res) => {
        const states = res?.data.data.map((item) => {
          return { name: item?.NAME, code: item?.id };
        });
        setProductVersion(states);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const isVisible = (header) =>
    dynamicFilter.find((f) => f?.header === header)?.visible;
  const isTableVisible = (header) =>
    columnConfig.find((f) => f?.header === header)?.visible;
  ////////////////////////////////////
  const staticHeaders = [
    "S.No",
    "Team",
    "ProjectID",
    "Project Name",
    "Display Name",
    "Address",
    "Dates",
    "Details",
    "Status",
    "Amc Amount",
    "PO Amount",
    "Advanced Amount",
    "Received Amount",
    "Balance Amount",
    "Edit",
    "Action",
  ];

  const projectPlanTHEAD = staticHeaders
    .filter((header) =>
      isTableVisible(typeof header === "string" ? header : header.name)
    )
    .map((header) =>
      typeof header === "string"
        ? header
        : { name: header.name, width: header.width }
    );

  /////////////////////////////////
  useEffect(() => {
    SearchAmountSubmissionFilter();
    SearchAmountSubmissionTableFilter();
    // SaveTableFilter();
    // SaveFilter();
  }, []);

  //////////////////////////////////
  const getProjectStatus = () => {
    axiosInstances
      .post(apiUrls?.Reason_Select, { Title: "ProjectStatus" })
      .then((res) => {
        const teams = res?.data?.data?.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setProjectStatus(teams);
      })
      .catch((err) => {
        console.log(err);
      });
  };
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

  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const navigate = useNavigate();

  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }

  const [centretabledata, setCentretabledata] = useState([]);

  const handleViewProject = () => {
    // if (
    //   formData?.ProjectName == "" &&
    //   formData?.Category.length === 0 &&
    //   formData?.ProjectID.length === 0 &&
    //   formData?.VerticalID.length === 0 &&
    //   formData?.TeamID.length === 0 &&
    //   formData?.WingID.length === 0 &&
    //   formData?.POC1.length === 0 &&
    //   formData?.POC2.length === 0 &&
    //   formData?.POC3.length === 0
    // ) {
    //   toast.error("Please select atleast one searching criteria.");
    // } else {
    setLoading(true);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "RoleID",
    //     useCryptoLocalStorage("user_Data", "get", "RoleID")
    //   ),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ProjectName", formData?.ProjectName);
    // form.append("ProjectID", "");
    // form.append("VerticalID", formData?.VerticalID);
    // form.append("TeamID", formData?.TeamID);
    // form.append("WingID", formData?.WingID);
    // form.append("POC1", formData?.POC1);
    // form.append("POC2", formData?.POC2);
    // form.append("POC3", formData?.POC3);
    // form.append(
    //   "OnlyMappingClient",
    //   formData?.OnlyMappingClient == 1 ? "1" : "0"
    // ),
    //   form.append("DateType", formData?.DateType);
    // form.append(
    //   "FromDate",
    //   moment(formData?.FromDate).isValid()
    //     ? moment(formData?.FromDate).format("YYYY-MM-DD")
    //     : ""
    // );
    // form.append(
    //   "ToDate",
    //   moment(formData?.ToDate).isValid()
    //     ? moment(formData?.ToDate).format("YYYY-MM-DD")
    //     : ""
    // ),
    // form.append("POStatus", formData?.PODate),
    //   form.append(
    //     "POFromDate",
    //     formatDate(formData?.PODateBefore)
    //       ? formatDate(formData?.PODateBefore)
    //       : ""
    //   ),
    //   form.append(
    //     "POToDate",
    //     formatDate(formData?.PODateAfter)
    //       ? formatDate(formData?.PODateAfter)
    //       : ""
    //   ),
    //   form.append("StartStatus", formData?.StartDate),
    //   form.append(
    //     "StartFromDate",
    //     formatDate(formData?.StartDateBefore)
    //       ? formatDate(formData?.StartDateBefore)
    //       : ""
    //   ),
    //   form.append(
    //     "StartToDate",
    //     formatDate(formData?.StartDateAfter)
    //       ? formatDate(formData?.StartDateAfter)
    //       : ""
    //   ),
    //   form.append("LiveStatus", formData?.LiveDate),
    //   form.append(
    //     "LiveFromDate",
    //     formatDate(formData?.LiveDateBefore)
    //       ? formatDate(formData?.LiveDateBefore)
    //       : ""
    //   ),
    //   form.append(
    //     "LiveToDate",
    //     formatDate(formData?.LiveDateAfter)
    //       ? formatDate(formData?.LiveDateAfter)
    //       : ""
    //   ),

    //   form.append("TransferStatus", formData?.TransferDate),
    // form.append(
    //   "TransferFromDate",
    //   formatDate(formData?.TransferDateBefore)
    //     ? formatDate(formData?.TransferDateBefore)
    //     : ""
    // ),
    // form.append(
    //   "TransferToDate",
    //   formatDate(formData?.TransferDateAfter)
    //     ? formatDate(formData?.TransferDateAfter)
    //     : ""
    // ),

    // form.append(
    //   "Status",
    //   getlabel(formData?.ProjectStatus, projectStatus) || ""
    // );
    // axios
    //   .post(apiUrls?.ViewProject, form, { headers })
    const payload = {
      RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")) || 0,
      ProjectID: Number(formData?.ProjectID) || 0,
      ProjectName: String(formData?.ProjectName || ""),
      VerticalID: Number(formData?.VerticalID) || 0,
      TeamID: Number(formData?.TeamID) || 0,
      WingID: Number(formData?.WingID) || 0,
      POC1: Number(formData?.POC1) || 0,
      POC2: Number(formData?.POC2) || 0,
      POC3: Number(formData?.POC3) || 0,
      CategoryID: String(formData?.Category || ""),
      DateType: String(formData?.DateType || ""),
      FromDate: moment(formData?.FromDate).isValid()
        ? moment(formData?.FromDate).format("YYYY-MM-DD")
        : "",
      ToDate: moment(formData?.ToDate).isValid()
        ? moment(formData?.ToDate).format("YYYY-MM-DD")
        : "",
      Status: String(getlabel(formData?.ProjectStatus, projectStatus) || ""),
      IsExcel: Number(formData?.IsExcel) || 0,
      ProductVersion: formData?.ProductVersion || "",
      OnlyMappingClient: formData?.OnlyMappingClient || "",
    };

    axiosInstances
      .post(apiUrls?.ViewProject, payload)
      .then((res) => {
        setCentretabledata(res?.data?.data);
        if (res?.data?.success === true) {
          const data = res?.data?.data;

          // console.log("centre check",res?.data?.ClientCentreList)
          const updatedData = data?.map((ele, index) => {
            return {
              ...ele,
              index: index,
              IsActive: "0",

              UpdateCategoryDropdown: "",
              UpdateCategoryResolve: false,
              UpdateCategoryValue: "",

              RateCardDropdown: "",
              RateCardResolve: false,
              RateCardValue: "",

              LocalityDropdown: "",
              LocalityResolve: false,
              LocalityValue: "",

              BillingDetailsDropdown: "",
              BillingDetailsResolve: false,
              BillingDetailsValue: "",

              EscalationDropdown: "",
              EscalationResolve: false,
              EscalationValue: "",

              SPOCDropdown: "",
              SPOCResolve: false,
              SPOCValue: "",

              NotificationDropdown: "",
              NotificationResolve: false,
              NotificationValue: "",

              ModuleDropdown: "",
              ModuleResolve: false,
              ModuleValue: "",

              MachineDropdown: "",
              MachineResolve: false,
              MachineValue: "",

              FinanceDropdown: "",
              FinanceResolve: false,
              FinanceValue: "",

              CentreDropdown: "",
              CentreResolve: false,
              CentreValue: "",

              EditDropdown: "",
              EditResolve: false,
              EditValue: "",
            };
          });

          setTableData(updatedData);
          setFilteredData(updatedData);
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };

  const handleViewProjectExcel = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "RoleID",
    //     useCryptoLocalStorage("user_Data", "get", "RoleID")
    //   ),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ProjectName", formData?.ProjectName);
    // form.append("ProjectID", "");
    // form.append("IsExcel", "1");
    // form.append("VerticalID", formData?.VerticalID);
    // form.append("TeamID", formData?.TeamID);
    // form.append("WingID", formData?.WingID);
    // form.append("POC1", formData?.POC1);
    // form.append("POC2", formData?.POC2);
    // form.append("POC3", formData?.POC3);
    // form.append("DateType", formData?.DateType);
    // form.append(
    //   "FromDate",
    //   moment(formData?.FromDate).isValid()
    //     ? moment(formData?.FromDate).format("YYYY-MM-DD")
    //     : ""
    // );
    // form.append(
    //   "ToDate",
    //   moment(formData?.ToDate).isValid()
    //     ? moment(formData?.ToDate).format("YYYY-MM-DD")
    //     : ""
    // ),
    //   form.append(
    //     "Status",
    //     getlabel(formData?.ProjectStatus, projectStatus) || ""
    //   );
    // axios
    //   .post(apiUrls?.ViewProject, form, { headers })
    axiosInstances
      .post(apiUrls?.ViewProject, {
        RoleID:
          String(useCryptoLocalStorage("user_Data", "get", "RoleID")) || "0",
        ProjectID: String(formData?.ProjectID) || "0",
        ProjectName: formData?.ProjectName || "",
        VerticalID: String(formData?.VerticalID) || "0",
        TeamID: String(formData?.TeamID) || "0",
        WingID: String(formData?.WingID) || "0",
        POC1: String(formData?.POC1) || "0",
        POC2: String(formData?.POC2) || "0",
        POC3: String(formData?.POC3) || "0",
        CategoryID: formData?.Category || "",
        DateType: formData?.DateType || "",
        FromDate: moment(formData?.FromDate).isValid()
          ? moment(formData?.FromDate).format("YYYY-MM-DD")
          : "",
        ToDate: moment(formData?.ToDate).isValid()
          ? moment(formData?.ToDate).format("YYYY-MM-DD")
          : "",
        Status: getlabel(formData?.ProjectStatus, projectStatus) || "",
        IsExcel: Number(formData?.IsExcel) || "0",
        ProductVersion: formData?.ProductVersion || "",
      })
      .then((res) => {
        setCentretabledata(res?.data?.ClientCentreList);
        const data = res?.data?.data;
        if (!data || data.length === 0) {
          console.error("No data available for download.");
          alert("No data available for download.");
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

        // Title row with username, date, and time
        const titleRow = [[`${username} - ${currentDate} ${currentTime}`]];

        // Convert JSON data to an Excel worksheet
        const ws = XLSX.utils.json_to_sheet(data, { origin: "A2" }); // Start data from the second row

        // Insert the title row at the top
        XLSX.utils.sheet_add_aoa(ws, titleRow, { origin: "A1" });

        // Create a new workbook and append the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");

        // Write workbook to binary
        const excelBuffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "array",
        });

        // Convert to Blob and trigger download
        const fileData = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        FileSaver.saveAs(
          fileData,
          `${username}_${currentDate}_${currentTime}.xlsx`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleViewProjectExcelDelivery = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "RoleID",
    //     useCryptoLocalStorage("user_Data", "get", "RoleID")
    //   ),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ProjectName", formData?.ProjectName);
    // form.append("ProjectID", "");
    // form.append("IsExcel", "2");
    // form.append("VerticalID", formData?.VerticalID);
    // form.append("TeamID", formData?.TeamID);
    // form.append("WingID", formData?.WingID);
    // form.append("POC1", formData?.POC1);
    // form.append("POC2", formData?.POC2);
    // form.append("POC3", formData?.POC3);
    // form.append("DateType", formData?.DateType);
    // form.append(
    //   "FromDate",
    //   moment(formData?.FromDate).isValid()
    //     ? moment(formData?.FromDate).format("YYYY-MM-DD")
    //     : ""
    // );
    // form.append(
    //   "ToDate",
    //   moment(formData?.ToDate).isValid()
    //     ? moment(formData?.ToDate).format("YYYY-MM-DD")
    //     : ""
    // ),
    //   form.append(
    //     "Status",
    //     getlabel(formData?.ProjectStatus, projectStatus) || ""
    //   );
    // axios
    //   .post(apiUrls?.ViewProject, form, { headers })
    axiosInstances
      .post(apiUrls?.ViewProject, {
        RoleID:
          String(useCryptoLocalStorage("user_Data", "get", "RoleID")) || "0",
        ProjectID: String(formData?.ProjectID) || "0",
        ProjectName: formData?.ProjectName || "",
        VerticalID: String(formData?.VerticalID) || "0",
        TeamID: String(formData?.TeamID) || "0",
        WingID: String(formData?.WingID) || "0",
        POC1: String(formData?.POC1) || "0",
        POC2: String(formData?.POC2) || "0",
        POC3: String(formData?.POC3) || "0",
        CategoryID: formData?.CategoryID || "",
        DateType: formData?.DateType || "",
        FromDate: moment(formData?.FromDate).isValid()
          ? moment(formData?.FromDate).format("YYYY-MM-DD")
          : "",
        ToDate: moment(formData?.ToDate).isValid()
          ? moment(formData?.ToDate).format("YYYY-MM-DD")
          : "",
        Status: getlabel(formData?.ProjectStatus, projectStatus) || "",
        IsExcel: Number(formData?.IsExcel) || "0",
        ProductVersion: formData?.ProductVersion || "",
      })
      .then((res) => {
        setCentretabledata(res?.data?.ClientCentreList);
        const data = res?.data?.data;
        if (!data || data.length === 0) {
          console.error("No data available for download.");
          alert("No data available for download.");
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

        // Title row with username, date, and time
        const titleRow = [[`${username} - ${currentDate} ${currentTime}`]];

        // Convert JSON data to an Excel worksheet
        const ws = XLSX.utils.json_to_sheet(data, { origin: "A2" }); // Start data from the second row

        // Insert the title row at the top
        XLSX.utils.sheet_add_aoa(ws, titleRow, { origin: "A1" });

        // Create a new workbook and append the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");

        // Write workbook to binary
        const excelBuffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "array",
        });

        // Convert to Blob and trigger download
        const fileData = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        FileSaver.saveAs(
          fileData,
          `${username}_${currentDate}_${currentTime}.xlsx`
        );
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
  const getProject = () => {
    axiosInstances
      .post(apiUrls?.ProjectSelect, {})
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.Project, value: item?.ProjectId };
        });
        setProject(poc3s);
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
  const handleDeliveryChangeTable = (name, value, index, ele) => {
    // console.log(ele);
    let updatedData = [...tableData];
    updatedData[index][name] = value;
    setTableData(updatedData);
  };

  const getVertical = () => {
    let form = new FormData();
    form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
      axios
        .post(apiUrls?.Vertical_Select, form, { headers })
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
  const getUserName = () => {
    axiosInstances
      .post(apiUrls?.GetUserName, { Username: "" })
      .then((res) => {
        const verticals = res?.data.data.map((item) => {
          return { label: item?.username, value: item?.id };
        });
        setUserName(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function getlabel(id, dropdownData) {
    const ele = dropdownData?.filter((item) => item?.value === id);
    return ele?.length > 0 ? ele[0].label : undefined;
  }
  const getTeam = () => {
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      axios
        .post(apiUrls?.Team_Select, form, { headers })
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
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      axios
        .post(apiUrls?.Wing_Select, form, { headers })
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
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      axios
        .post(apiUrls?.POC_1_Select, form, { headers })
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
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      axios
        .post(apiUrls?.POC_2_Select, form, { headers })
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
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      axios
        .post(apiUrls?.POC_3_Select, form, { headers })
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

  const getCategory = (proj) => {
    axiosInstances
      .post(apiUrls?.Category_Select, {
        RoleID: 0,
        ProjectID: 0,
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { name: item?.NAME, code: item?.ID };
        });
        setCategory(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  useEffect(() => {
    getProject();
    getTeam();
    getWing();
    getVertical();
    getCategory();
    getProduct();
    getPOC1();
    getPOC2();
    getPOC3();
    getUserName();
    getProjectStatus();
  }, []);

  const shortenName = (name) => {
    return name?.length > 10 ? name?.substring(0, 25) + "..." : name;
  };
  const [visible, setVisible] = useState({
    showRateCard: false,
    showLocality: false,
    showBillingDetails: false,
    showEscalation: false,
    showSPOC: false,
    showNotification: false,
    showModule: false,
    showMachine: false,
    showFinance: false,
    showCentre: false,
    showCategory: false,
    showEdit: false,
    showVisible: false,
    showEmployee: false,
    showData: {},
  });

  const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, "").trim();

  const handleSearchTable = (event) => {
    const rawQuery = event.target.value;
    const query = normalizeString(rawQuery);

    setSearchQuery(rawQuery);

    if (query === "") {
      setTableData(filteredData);
      setCurrentPage(1);
      return;
    }

    const filtered = filteredData?.filter((item) =>
      Object.keys(item).some(
        (key) => item[key] && normalizeString(String(item[key])).includes(query)
      )
    );

    if (filtered.length === 0) {
      setSearchQuery("");
      setTableData(filteredData);
    } else {
      setTableData(filtered);
    }

    setCurrentPage(1);
  };

  const handleBindFrameMenuList = [
    {
      FileName: "Flag",
      URL: "ProjectFlagModal",
      FrameName: "ProjectFlagModal",
      Description: "ProjectFlagModal",
    },
    {
      FileName: "Rate List Master",
      URL: "RateListsMaster",
      FrameName: "RateListsMaster",
      Description: "RateListsMaster",
    },
    {
      FileName: "Centre Booking",
      URL: "CentreModuleModal",
      FrameName: "CentreModuleModal",
      Description: "CentreModuleModal",
    },
    {
      FileName: "Sales Booking",
      URL: "SearchSalesBooking",
      FrameName: "SearchSalesBooking",
      Description: "SearchSalesBooking",
    },
    {
      FileName: "Machine Booking",
      URL: "MachineModuleModal",
      FrameName: "MachineModuleModal",
      Description: "MachineModuleModal",
    },
    {
      FileName: "Module Booking",
      URL: "ModuleTabModal",
      FrameName: "ModuleTabModal",
      Description: "ModuleTabModal",
    },
    {
      FileName: "Category Mapping",
      URL: "ProjectMasterProjectModal",
      FrameName: "ProjectMasterProjectModal",
      Description: "ProjectMasterProjectModal",
    },
    {
      FileName: "User Mapping",
      URL: "UserMapping",
      FrameName: "UserMapping",
      Description: "UserMapping",
    },
    {
      FileName: "Billing Details",
      URL: "BillingDetailModal",
      FrameName: "BillingDetailModal",
      Description: "BillingDetailModal",
    },
    {
      FileName: "Implementation Plan",
      URL: "ImplementationPlan",
      FrameName: "ImplementationPlan",
      Description: "ImplementationPlan",
    },
    {
      FileName: "Checklist Entry",
      URL: "CheckListEntry",
      FrameName: "CheckListEntry",
      Description: "CheckListEntry",
    },
    {
      FileName: "Client To Shift",
      URL: "ClientToShift",
      FrameName: "ClientToShift",
      Description: "ClientToShift",
    },
    {
      FileName: "View Document",
      URL: "UploadDocumentProject",
      FrameName: "UploadDocumentProject",
      Description: "UploadDocumentProject",
    },
  ];

  return (
    <>
      <Modal
        modalWidth={"600px"}
        visible={visible?.showVisible}
        setVisible={setVisible}
        Header="Upload Document"
        tableData={tableData}
        setTableData={setTableData}
      >
        <DocumentTypeModalProject
          visible={visible?.showVisible}
          setVisible={setVisible}
          tableData={visible?.showData}
          setTableData={setTableData}
        />
      </Modal>
      <Modal
        modalWidth={"800px"}
        visible={visible?.showEmployee}
        setVisible={setVisible}
        Header="Create New Project"
        tableData={tableData}
        setTableData={setTableData}
      >
        <NewProjectModal
          visible={visible?.showEmployee}
          setVisible={setVisible}
          tableData={visible?.showData}
          setTableData={setTableData}
        />
      </Modal>

      <div className="card border">
        <Heading
          title={
            <div className="d-flex">
              <span style={{ fontWeight: "bold" }}>{t("Search Project")}</span>
              <div className="d-flex">
                <span className="ml-4" style={{ fontWeight: "bold" }}>
                  {t("Search Filter Details")}{" "}
                </span>
                <span className="header ml-1" style={{ cursor: "pointer" }}>
                  <SearchLotusFilter
                    columnConfig={dynamicFilter}
                    setColumnConfig={setDynamicFilter}
                    PageName="SearchProjectMaster"
                  />
                </span>
              </div>
            </div>
          }
          isBreadcrumb={false}
          secondTitle={
            <Link
              to="/ProjectMaster"
              style={{ float: "right", fontWeight: "bold" }}
            >
              {"Create Project"}
            </Link>
          }
        />
        <div className="row g-4 m-2">
          {isVisible("ProjectName") && (
            <Input
              type="text"
              className="form-control"
              id="ProjectName"
              name="ProjectName"
              lable="Project Name"
              placeholder=" "
              max={20}
              onChange={handleSelectChange}
              value={formData?.ProjectName}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
          )}
          {isVisible("ProductVersion") && (
            <MultiSelectComp
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="ProductVersion"
              placeholderName="Product Version"
              dynamicOptions={productversion}
              handleChange={handleMultiSelectChange}
              value={formData.ProductVersion?.map((code) => ({
                code,
                name: productversion.find((item) => item.code === code)?.name,
              }))}
            />
          )}
          {isVisible("Category") && (
            <MultiSelectComp
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="Category"
              placeholderName="Category"
              dynamicOptions={category}
              handleChange={handleMultiSelectChange}
              value={formData.Category.map((code) => ({
                code,
                name: category.find((item) => item.code === code)?.name,
              }))}
            />
          )}
          {isVisible("VerticalID") && (
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
          )}
          {isVisible("TeamID") && (
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
          )}
          {isVisible("WingID") && (
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
          )}
          {isVisible("POC1") && (
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
          )}
          {isVisible("POC2") && (
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
          )}
          {isVisible("POC3") && (
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
          )}
          {/* <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div>
              <ReactSelect
                placeholderName={t("PO Date")}
                id={"PODate"}
                dynamicOptions={[
                  { label: "Any", value: "0" },
                  { label: "Between", value: "2" },
                  { label: "Before", value: "4" },
                  { label: "After", value: "6" },
                  { label: "OnOrBefore", value: "3" },
                  { label: "On", value: "5" },
                  { label: "OnOrAfter", value: "7" },
                  { label: "WithoutDeliveryDate", value: "9" },
                ]}
                searchable={true}
                lable="PO Date"
                name="PODate"
                value={formData?.PODate}
                className={"PODate"}
                handleChange={handleDeliveryChange}
              />
            </div>
            {formData.PODate == "2" && (
              <>
                <DatePicker
                  className="custom-calendar"
                  id="PODateBefore"
                  name="PODateBefore"
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.PODateBefore}
                  handleChange={searchHandleChange}
                />
                <DatePicker
                  className="custom-calendar"
                  id="PODateAfter"
                  name="PODateAfter"
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.PODateAfter}
                  handleChange={searchHandleChange}
                />
              </>
            )}
            {["3", "4", "5", "6", "7"].includes(formData.PODate) ? (
              <DatePicker
                className="custom-calendar"
                id="PODateBefore"
                name="PODateBefore"
                placeholder={VITE_DATE_FORMAT}
                value={new Date(formData?.PODateBefore)}
                handleChange={searchHandleChange}
              />
            ) : (
              ""
            )}
          </div>

          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div>
              <ReactSelect
                placeholderName={t("Start Date")}
                id={"StartDate"}
                dynamicOptions={[
                  { label: "Any", value: "0" },
                  { label: "Between", value: "2" },
                  { label: "Before", value: "4" },
                  { label: "After", value: "6" },
                  { label: "OnOrBefore", value: "3" },
                  { label: "On", value: "5" },
                  { label: "OnOrAfter", value: "7" },
                  { label: "WithoutDeliveryDate", value: "9" },
                ]}
                searchable={true}
                lable="Start Date"
                name="StartDate"
                value={formData?.StartDate}
                className={"StartDate"}
                handleChange={handleDeliveryChange}
              />
            </div>
            {formData.StartDate == "2" && (
              <>
                <DatePicker
                  className="custom-calendar"
                  id="StartDateBefore"
                  name="StartDateBefore"
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.StartDateBefore}
                  handleChange={searchHandleChange}
                />
                <DatePicker
                  className="custom-calendar"
                  id="StartDateAfter"
                  name="StartDateAfter"
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.StartDateAfter}
                  handleChange={searchHandleChange}
                />
              </>
            )}
            {["3", "4", "5", "6", "7"].includes(formData.StartDate) ? (
              <DatePicker
                className="custom-calendar"
                id="StartDateBefore"
                name="StartDateBefore"
                placeholder={VITE_DATE_FORMAT}
                value={new Date(formData?.StartDateBefore)}
                handleChange={searchHandleChange}
              />
            ) : (
              ""
            )}
          </div>

          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div>
              <ReactSelect
                placeholderName={t("Live Date")}
                id={"LiveDate"}
                dynamicOptions={[
                  { label: "Any", value: "0" },
                  { label: "Between", value: "2" },
                  { label: "Before", value: "4" },
                  { label: "After", value: "6" },
                  { label: "OnOrBefore", value: "3" },
                  { label: "On", value: "5" },
                  { label: "OnOrAfter", value: "7" },
                  { label: "WithoutDeliveryDate", value: "9" },
                ]}
                searchable={true}
                lable="Live Date"
                name="LiveDate"
                value={formData?.LiveDate}
                className={"LiveDate"}
                handleChange={handleDeliveryChange}
              />
            </div>
            {formData.LiveDate == "2" && (
              <>
                <DatePicker
                  className="custom-calendar"
                  id="LiveDateBefore"
                  name="LiveDateBefore"
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.LiveDateBefore}
                  handleChange={searchHandleChange}
                />
                <DatePicker
                  className="custom-calendar"
                  id="LiveDateAfter"
                  name="LiveDateAfter"
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.LiveDateAfter}
                  handleChange={searchHandleChange}
                />
              </>
            )}
            {["3", "4", "5", "6", "7"].includes(formData.LiveDate) ? (
              <DatePicker
                className="custom-calendar"
                id="LiveDateBefore"
                name="LiveDateBefore"
                placeholder={VITE_DATE_FORMAT}
                value={new Date(formData?.LiveDateBefore)}
                handleChange={searchHandleChange}
              />
            ) : (
              ""
            )}
          </div>

          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div>
              <ReactSelect
                placeholderName={t("Transfer Date")}
                id={"TransferDate"}
                dynamicOptions={[
                  { label: "Any", value: "0" },
                  { label: "Between", value: "2" },
                  { label: "Before", value: "4" },
                  { label: "After", value: "6" },
                  { label: "OnOrBefore", value: "3" },
                  { label: "On", value: "5" },
                  { label: "OnOrAfter", value: "7" },
                  { label: "WithoutDeliveryDate", value: "9" },
                ]}
                searchable={true}
                lable="Transfer Date"
                name="TransferDate"
                value={formData?.TransferDate}
                className={"TransferDate"}
                handleChange={handleDeliveryChange}
              />
            </div>
            {formData.TransferDate == "2" && (
              <>
                <DatePicker
                  className="custom-calendar"
                  id="TransferDateBefore"
                  name="TransferDateBefore"
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.TransferDateBefore}
                  handleChange={searchHandleChange}
                />
                <DatePicker
                  className="custom-calendar"
                  id="TransferDateAfter"
                  name="TransferDateAfter"
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.TransferDateAfter}
                  handleChange={searchHandleChange}
                />
              </>
            )}
            {["3", "4", "5", "6", "7"].includes(formData.TransferDate) ? (
              <DatePicker
                className="custom-calendar"
                id="TransferDateBefore"
                name="TransferDateBefore"
                placeholder={VITE_DATE_FORMAT}
                value={new Date(formData?.TransferDateBefore)}
                handleChange={searchHandleChange}
              />
            ) : (
              ""
            )}
          </div> */}

          {isVisible("DateType") && (
            <ReactSelect
              name="DateType"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholderName="DateType"
              dynamicOptions={[
                { label: "Select", value: "0" },
                { label: "PO Date", value: "1" },
                { label: "Start Date", value: "2" },
                { label: "Live Date", value: "3" },
                { label: "Transfer Date", value: "4" },
              ]}
              value={formData?.DateType}
              handleChange={handleDeliveryChange}
            />
          )}
          {["1", "2", "3", "4"].includes(formData?.DateType) && (
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

          {isVisible("ProjectStatus") && (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="ProjectStatus"
              placeholderName="Project Status"
              dynamicOptions={[
                { label: "Select", value: "0" },
                ...projectStatus,
              ]}
              handleChange={handleDeliveryChange}
              value={formData.ProjectStatus}
            />
          )}
          {/* <ReactSelect
            name="Status"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="Status"
            dynamicOptions={[
              { label: "Active", value: "1" },
              { label: "In-Active", value: "0" },
              { label: "Both", value: "2" },
            ]}
            value={formData?.Status}
            handleChange={handleDeliveryChange}
          /> */}
          <div className="search-col" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="OnlyMappingClient"
                  checked={formData?.OnlyMappingClient ? 1 : 0}
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
                {t("OnlyMappingClient")}
              </span>
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-info ml-2"
              onClick={handleViewProject}
            >
              Search
            </button>
          )}

          <i
            className="fa fa-plus-circle fa-sm new_record_pluse mt-2 ml-3"
            onClick={() => {
              setVisible({ showEmployee: true, showData: "" });
            }}
            title="Click to Create New Project."
            style={{ cursor: "pointer" }}
          ></i>

          {tableData?.length > 0 && (
            <img
              src={excelimg}
              className=" ml-4"
              style={{
                width: "34px",
                height: "24px",
                cursor: "pointer",
                marginTop: "3px",
              }}
              onClick={handleViewProjectExcel}
              title="Click to Download Excel"
            ></img>
          )}
          {tableData?.length > 0 && (
            <img
              src={excelimgOrange}
              className=" ml-4"
              style={{ width: "30px", height: "32px", cursor: "pointer" }}
              onClick={handleViewProjectExcelDelivery}
              title="Get Delivery Manager Excel Sheet"
            ></img>
          )}
        </div>
      </div>
      {tableData?.length > 0 ? (
        <div className="card mt-2">
          {/* <Accordion
            title={
              <>
                {tableData?.length === 0 ? (
                  t("Search Result")
                ) : (
                  <div className="d-flex">
                    <span className="mt-1" style={{ fontWeight: "bold" }}>
                      {t("Click Icon To Filter Results")}
                    </span>
                    <span className="header ml-1" style={{ cursor: "pointer" }}>
                      <SearchLotusFilter
                        columnConfig={columnConfig}
                        setColumnConfig={setColumnConfig}
                        PageName="SearchProjectMasterTable"
                      />
                    </span>
                  </div>
                )}
              </>
            }
            notOpen={true}
            defaultValue={true}
          ></Accordion> */}
          <Heading
            title={
              <div className="d-flex">
                <span style={{ fontWeight: "bold" }}>Search Details</span>{" "}
                <div className="d-flex">
                  <span
                    className="mt-1"
                    style={{ fontWeight: "bold", marginLeft: "10px" }}
                  >
                    {t("Click Icon To Filter Results")}
                  </span>
                  <span className="header ml-1" style={{ cursor: "pointer" }}>
                    <SearchLotusFilter
                      columnConfig={columnConfig}
                      setColumnConfig={setColumnConfig}
                      PageName="SearchProjectMasterTable"
                    />
                  </span>
                </div>
              </div>
            }
            secondTitle={
              <div style={{ fontWeight: "bold", display: "flex" }}>
                <div style={{ padding: "0px !important", marginLeft: "10px" }}>
                  <Input
                    type="text"
                    className="form-control"
                    id="Title"
                    name="Title"
                    lable="Search"
                    placeholder=" "
                    onChange={handleSearchTable}
                    value={searchQuery}
                    respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                  />
                </div>
                <span className="mt-1">
                  Total Record : &nbsp; {tableData?.length}
                </span>
              </div>
            }
          />
          <Tables
            thead={projectPlanTHEAD}
            tbody={currentData
              ?.map((ele, index) => {
                // Define full row with all possible keys
                const fullRow = {
                  "S.No": (currentPage - 1) * rowsPerPage + index + 1,
                  Team: ele?.team,
                  ProjectID: ele?.Id,
                  "Project Name": (
                    <Tooltip label={ele?.NAME}>
                      <span style={{ textAlign: "center" }}>
                        {shortenName(ele?.NAME)}
                      </span>
                    </Tooltip>
                  ),
                  "Display Name": (
                    <Tooltip label={ele?.ProjectDisplayName}>
                      <span style={{ textAlign: "center" }}>
                        {shortenName(ele?.ProjectDisplayName)}
                      </span>
                    </Tooltip>
                  ),
                  Address: (
                    <Tooltip label={capitalizeFirstLetter(ele?.Address)}>
                      <span style={{ textAlign: "center" }}>
                        {capitalizeFirstLetter(shortenName(ele?.Address))}
                      </span>
                    </Tooltip>
                  ),
                  Dates: (
                    <>
                      <FaCalendarAlt
                        className="icon"
                        data-tooltip-id={`tooltip-dates-${index}`}
                        data-tooltip-html={(() => {
                          const tooltipData = [
                            ele?.PODate && `PO Date: ${ele?.PODate}`,
                            ele?.startdate && `Start Date: ${ele?.startdate}`,
                            ele?.Livedate && `Live Date: ${ele?.Livedate}`,
                            ele?.AMC_StartDate &&
                              `AMC Start Date: ${ele?.AMC_StartDate}`,
                          ].filter(Boolean);
                          return tooltipData.length
                            ? tooltipData.join("<br>")
                            : null;
                        })()}
                      />
                      <ReactTooltip
                        id={`tooltip-dates-${index}`}
                        place="right"
                      />
                    </>
                  ),
                  Details: (
                    <>
                      <FaInfoCircle
                        className="icon"
                        data-tooltip-id={`tooltip-details-${index}`}
                        data-tooltip-html={(() => {
                          const tooltipData = [
                            ele?.maindayscharges &&
                              `Man Days: ${ele?.maindayscharges}`,
                            ele?.Onsitecharges &&
                              `OnSite Charges: ${ele?.Onsitecharges}`,
                            ele?.MachineChargesUNI &&
                              `Machine-Uni: ${ele?.MachineChargesUNI}`,
                            ele?.MachineChargesBI &&
                              `Machine-Bi: ${ele?.MachineChargesBI}`,
                          ].filter(Boolean);
                          return tooltipData.length
                            ? tooltipData.join("<br>")
                            : null;
                        })()}
                      />
                      <ReactTooltip
                        id={`tooltip-details-${index}`}
                        place="right"
                      />
                    </>
                  ),
                  Status: ele?.CurrentStatus,
                  "Amc Amount": (
                    <>
                      <FaRupeeSign
                        className="icon"
                        data-tooltip-id={`tooltip-amount-${index}`}
                        data-tooltip-html={(() => {
                          const tooltipData = [
                            ele?.AMCAmount && `AMC Amount: ${ele?.AMCAmount}`,
                            ele?.amcTenure && `AMC Tenure: ${ele?.amcTenure}`,
                            ele?.lastAmcPaid &&
                              `Last AMC Paid: ${ele?.lastAmcPaid}`,
                            ele?.amcDue && `AMC Due: ${ele?.amcDue}`,
                            ele?.AMCper && `AMC %: ${ele?.AMCper}`,
                          ].filter(Boolean);
                          return tooltipData.length
                            ? tooltipData.join("<br>")
                            : null;
                        })()}
                      />
                      <ReactTooltip
                        id={`tooltip-amount-${index}`}
                        place="top"
                      />
                    </>
                  ),
                  "PO Amount": ele?.NetPoAmt,
                  "Advanced Amount": ele?.AdvancedAmount,
                  "Received Amount": ele?.ReceivedAmount,
                  "Balance Amount": ele?.BalanceAmount,
                  Edit: (
                    <Link
                      to="/ProjectMaster"
                      state={{ data: ele?.Id, edit: true, givenData: ele }}
                      style={{ cursor: "pointer" }}
                    >
                      Edit
                    </Link>
                  ),
                  Action: (
                    <AmountSubmissionSeeMoreList
                      ModalComponent={ModalComponent}
                      setSeeMore={setSeeMore}
                      data={{
                        ...ele,
                        type: "LedgerStatus",
                      }}
                      handleViewProject={handleViewProject}
                      setVisible={() => setListVisible(false)}
                      handleBindFrameMenu={handleBindFrameMenuList}
                      isShowPatient={true}
                    />
                  ),
                };

                // ✅ Extract only visible headers from thead
                const visibleHeaders = projectPlanTHEAD.map((h) =>
                  typeof h === "string" ? h : h.name
                );

                // ✅ Build filtered row with only visible fields
                const filteredRow = {};
                let isEmptyRow = true;

                visibleHeaders.forEach((key) => {
                  const value = fullRow[key];
                  filteredRow[key] = value;

                  if (typeof value === "string") {
                    if (value.trim() !== "") isEmptyRow = false;
                  } else if (!!value) {
                    isEmptyRow = false;
                  }
                });

                // ✅ Skip row if all visible values are empty
                if (isEmptyRow) return null;

                return filteredRow;
              })
              .filter(Boolean)} // remove null (empty) rows
            tableHeight="tableHeight"
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

          <div className="pagination" style={{ float: "left" }}>
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
      ) : (
        <NoRecordFound />
      )}
    </>
  );
};
export default SearchProjectMaster;
