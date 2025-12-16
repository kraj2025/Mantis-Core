import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import ReactSelect from "../components/formComponent/ReactSelect";
import Input from "../components/formComponent/Input";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import DatePicker from "../components/formComponent/DatePicker";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import Loading from "../components/loader/Loading";
import Tables from "../components/UI/customTable";
import {
  quotationSearchThead,
  salesSearchThead,
} from "../components/modalComponent/Utils/HealperThead";
import { Link } from "react-router-dom";
import Modal from "../components/modalComponent/Modal";
import CancelQuotationBookingModal from "../components/UI/customTable/CancelQuotationBookingModal";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import SaleConvertModal from "../components/UI/customTable/SaleConvertModal";
import Tooltip from "./Tooltip";
import { PageSize } from "../utils/constant";
import CustomPagination from "../utils/CustomPagination";
import excelimg from "../../src/assets/image/excel.png";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { ExportToPDF } from "../networkServices/Tools";
import pdf from "../../src/assets/image/pdf.png";
import QuotationPIModal from "../components/UI/customTable/QuotationPIModal";
import GmailQuotationModal from "../components/UI/customTable/GmailQuotationModal";
import gmaillogo from "../../src/assets/image/Gmail_Logo.png";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import SearchLotusFilter from "./SearchLotusFilter";
import Accordion from "./Accordion";
import { axiosInstances } from "../networkServices/axiosInstance";
const SearchQuotationBooking = ({ data }) => {
  const [t] = useTranslation();
  const QuotationApproved = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowQuotationApproved"
  );
  const QuotationUpdate = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowQuotationUpdate"
  );
  const QuotaionCreate = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowQuotaionCreate"
  );
  const QuotationReject = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowQuotationReject"
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
  const [dynamicFilter, setDynamicFilter] = useState([]);
  const [columnConfig, setColumnConfig] = useState([]);
  const [formData, setFormData] = useState({
    ProjectName: "",
    ProjectID: [],
    VerticalID: [],
    TeamID: [],
    WingID: [],
    POC1: [],
    POC2: [],
    POC3: [],
    Status: "0",
    DateType: "EntryDate",
    FromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    ToDate: new Date(),
    ReceivedDate: "",
    PaymentMode: "",
    Remark: "",
    EntryDate: "",
    PageSize: 50,
    PageNo: "",
  });

  const SaveFilter = () => {
    const filterData = [
      { header: "S.No", visible: true },
      { header: "ProjectID", visible: true },
      { header: "VerticalID", visible: true },
      { header: "TeamID", visible: true },
      { header: "WingID", visible: true },
      { header: "POC1", visible: true },
      { header: "POC2", visible: true },
      { header: "POC3", visible: true },
      { header: "DateType", visible: true },
      { header: "FromDate", visible: true },
      { header: "ToDate", visible: true },
      { header: "Status", visible: true },
      { header: "PageSize", visible: true },
    ];

    axiosInstances
      .post(apiUrls.SaveFilterTableReprintData, {
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        FilterData: JSON.stringify(filterData),
        PageName: "SearchQuotationBooking",
      })
      // let form = new FormData();

      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
      // form.append(
      //   "CrmEmpID",
      //   useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      // );
      // form.append(
      //   "LoginName",
      //   useCryptoLocalStorage("user_Data", "get", "realname")
      // );
      // form.append("PageName", "SearchQuotationBooking");

      // // Example FilterData array

      // // Append stringified FilterData
      // form.append("FilterData", JSON.stringify(filterData));

      // axios
      //   .post(apiUrls?.SaveFilterTableReprintData, form, { headers })
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
      { header: "Project Name", visible: true },
      { header: "Team", visible: true },
      { header: "POC", visible: true },
      { header: "Quotation No.", visible: true },
      { header: "PINo", visible: true },
      { header: "PaymentMode", visible: true },
      { header: "Gross Amount", visible: true },
      { header: "Dis Amount", visible: true },
      { header: "Tax Amount", visible: true },
      { header: "Net Amount", visible: true },
      { header: "Entry Date", visible: true },
      { header: "Remark", visible: true },
      { header: "Email", visible: true },
      { header: "Print", visible: true },
      { header: "Print PI", visible: true },
      { header: "Edit", visible: true },
      { header: "Action", visible: true },
      { header: "Cancel", visible: true },
    ];

    // Append stringified FilterData
    form.append("FilterData");
    axiosInstances
      .post(apiUrls.SaveFilterTableReprintData, {
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        FilterData: JSON.stringify(filterData),
        PageName: "SearchQuotationBookingTable",
      })
      // let form = new FormData();

      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
      // form.append(
      //   "CrmEmpID",
      //   useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      // );
      // form.append(
      //   "LoginName",
      //   useCryptoLocalStorage("user_Data", "get", "realname")
      // );
      // form.append("PageName", "SearchQuotationBookingTable");

      // // Example FilterData array

      // axios
      //   .post(apiUrls?.SaveFilterTableReprintData, form, { headers })
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
      .post(apiUrls.GetFilterTableReprintData, {
        PageName: "SearchQuotationBooking",
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "CrmEmpID",
      //     useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      //   ),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("PageName", "SearchQuotationBooking"),
      //   axios
      //     .post(apiUrls?.GetFilterTableReprintData, form, { headers })
      .then((res) => {
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
      .post(apiUrls.GetFilterTableReprintData, {
        PageName: "SearchQuotationBookingTable",
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "CrmEmpID",
      //     useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      //   ),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("PageName", "SearchQuotationBookingTable"),
      //   axios
      //     .post(apiUrls?.GetFilterTableReprintData, form, { headers })
      .then((res) => {
        const data = res.data.data;
        if (res?.data.status === true) {
          setColumnConfig(data);
        } else {
          SaveTableFilter();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const isVisible = (header) =>
    dynamicFilter.find((f) => f?.header === header)?.visible;
  const isTableVisible = (header) =>
    columnConfig.find((f) => f?.header === header)?.visible;

  useEffect(() => {
    SearchAmountSubmissionFilter();
    SearchAmountSubmissionTableFilter();
    // SaveTableFilter();
    // SaveFilter();
  }, []);

  //////////////////////////////////

  // useEffect(() => {
  //   if (data) {
  //     const projectID = data?.ProjectID;
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       ProjectID: [projectID],
  //     }));
  //     handleSearch("", [data?.ProjectID]);
  //   }
  // }, [data]);

  const handleReset = () => {
    setFormData({
      ...formData,
      ProjectName: "",
      ProjectID: [],
      VerticalID: [],
      TeamID: [],
      WingID: [],
      POC1: [],
      POC2: [],
      POC3: [],
      Status: "0",
      DateType: "EntryDate",
      FromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      ToDate: new Date(),
      ReceivedDate: "",
      PaymentMode: "",
      Remark: "",
      EntryDate: "",
      PageSize: 50,
    });
  };
  const [visible, setVisible] = useState({
    showVisible: false,
    saleVisible: false,
    removeVisible: false,
    gmailVisible: false,
    quotePiVisible: false,
    showData: {},
  });

  const [currentPage, setCurrentPage] = useState(1);
  const totalRecords = parseInt(tableData[0]?.TotalRecord);
  const totalPages = Math.ceil(totalRecords / formData?.PageSize);
  const currentData = tableData;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    handleSearch(undefined, newPage - 1);
  };

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
  function capitalizeFirstLetter(sentence) {
    if (!sentence) return "";
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  // const handleSaveFilter = () => {
  //   localStorage.setItem("formData", JSON.stringify(formData));
  //   const savedData = localStorage.getItem("formData");
  //   if (savedData) {
  //     setFormData(JSON.parse(savedData));
  //   }
  //   let form = new FormData();
  //   form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
  //     form.append("Type", "QuotationBooking"),
  //     form.append("FilterData", savedData),
  //     axios
  //       .post(apiUrls?.SaveFilterDataSubmission, form, { headers })
  //       .then((res) => {
  //         toast.success(res?.data?.message);
  //         setFormData({
  //           ...formData,

  //           ProjectName: "",
  //           ProjectID: [],
  //           VerticalID: [],
  //           TeamID: [],
  //           WingID: [],
  //           POC1: [],
  //           POC2: [],
  //           POC3: [],
  //           Status: "0",
  //           DateType: "EntryDate",
  //           FromDate: new Date(
  //             new Date().getFullYear(),
  //             new Date().getMonth(),
  //             1
  //           ),
  //           ToDate: new Date(),
  //           ReceivedDate: "",
  //           PaymentMode: "",
  //           Remark: "",
  //           EntryDate: "",
  //           PageSize: 50,
  //           PageNo: "",
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  // };
  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "ProjectID") {
      handleSearch(value);
    }
  };

  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  const searchHandleChange = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
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
  const [isApproved, setIsApproved] = useState(false);
  const [isSold, setIsSold] = useState(false);

  const handleApprove = (ele) => {
    axiosInstances
      .post(apiUrls.Quotation_Approved, {
        QuotationID: String(ele),
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("QuotationID", ele),
      //   axios
      //     .post(apiUrls?.Quotation_Approved, form, { headers })
      .then((res) => {
        toast.success(res?.data?.message);
        setIsApproved(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // const handleSaleConvert = (ele) => {
  //   let form = new FormData();
  //   form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
  //     form.append(
  //       "LoginName",
  //       useCryptoLocalStorage("user_Data", "get", "realname")
  //     ),
  //     form.append("QuotationID", ele),
  //     axios
  //       .post(apiUrls?.Quotation_SalesConvert, form, { headers })
  //       .then((res) => {
  //         toast.success(res?.data?.message);
  //         setIsSold(true);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  // };
  // const handleReject = (ele) => {
  //   let form = new FormData();
  //   form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
  //     form.append(
  //       "LoginName",
  //       useCryptoLocalStorage("user_Data", "get", "realname")
  //     ),
  //     form.append("QuotationID", ele),
  //     axios
  //       .post(apiUrls?.Quotation_SalesConvert, form, { headers })
  //       .then((res) => {
  //         toast.success(res?.data?.message);
  //         // setIsSold(true)
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  // };

  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
  const handleSearch = (page, project, Status = formData?.Status) => {
    // console.log("project project", project?.length);
    setLoading(true);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
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
    //   form.append("Status", Status),
    //   form.append("DateType", formData?.DateType),
    //   form.append("FromDate", formatDate(formData?.FromDate)),
    //   form.append("ToDate", formatDate(formData?.ToDate)),
    //   form.append("SearchType", "OnScreen"),
    //   form.append("IsExcel", "0"),
    //   form.append("PageSize", formData?.PageSize),
    //   form.append("PageNo", page ?? currentPage - 1),
    //   axios
    //     .post(apiUrls?.Quotation_Search, form, { headers })
    axiosInstances
      .post(apiUrls.Quotation_Search, {
        DateType: String(formData?.DateType),
        FromDate: String(formatDate(formData?.FromDate)),
        ToDate: String(formatDate(formData?.ToDate)),
        Status: String(Status),
        SearchType: String("OnScreen"),
        PageSize: Number(formData?.PageSize),
        PageNo: Number(page ?? currentPage - 1),
        IsExcel: Number(0),
        ProjectID: String(
          project?.length > 0 && project !== "0" ? project : formData?.ProjectID
        ),
        VerticalID: String(formData?.VerticalID),
        TeamID: String(formData?.TeamID),
        WingID: String(formData?.WingID),
        POC1: String(formData?.POC1),
        POC2: String(formData?.POC2),
        POC3: String(formData?.POC3),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res?.data?.data);
          // const datas = res?.data?.data?.map((val) => {
          //   val.QuotationApproved = false;
          //   val.QuotationUpdate = false;
          //   val.QuotationReject = false;
          //   return val;
          // });
          // setTableData(datas);
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
  const handleExcel = (page) => {
    setLoading(true);
    const payloadData = {
  DateType: formData?.DateType || "",
  FromDate: formatDate(formData?.FromDate) || "",
  ToDate: formatDate(formData?.ToDate) || "",
  Status: formData?.Status || "",
  SearchType: "OnScreen", // fixed value
  PageSize: Number(formData?.PageSize) || 0,
  PageNo: Number(page ?? currentPage - 1) || 0,
  IsExcel: 1, // from your FormData
  ProjectID: formData?.ProjectID || "",
  VerticalID: formData?.VerticalID || "",
  TeamID: formData?.TeamID || "",
  WingID: formData?.WingID || "",
  POC1: formData?.POC1 || "",
  POC2: formData?.POC2 || "",
  POC3: formData?.POC3 || "",
};

     axiosInstances
      .post(apiUrls.Quotation_Search, payloadData)

    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
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
    //   form.append("SearchType", "OnScreen"),
    //   form.append("IsExcel", "1"),
    //   form.append("PageSize", formData?.PageSize),
    //   form.append("PageNo", page ?? currentPage - 1),
    //   axios
    //     .post(apiUrls?.Quotation_Search, form, { headers })
        .then((res) => {
          // console.log("dataatata", res?.data?.data);
          const datas = res?.data?.data;

        if (!datas || datas.length === 0) {
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
  const shortenName = (name) => {
    return name.length > 15 ? name.substring(0, 25) + "..." : name;
  };
  // const handleSearchFilter = () => {
  //   let form = new FormData();
  //   form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
  //     form.append("Type", "QuotationBooking"),
  //     axios
  //       .post(apiUrls?.SearchFilterDataSubmission, form, { headers })
  //       .then((res) => {
  //         setFormData({
  //           ProjectID: res?.data?.ProjectID || [],
  //           VerticalID: res?.data?.VerticalID || [],
  //           TeamID: res?.data?.TeamID || [],
  //           WingID: res?.data?.WingID || [],
  //           POC1: res?.data?.POC1 || [],
  //           POC2: res?.data?.POC2 || [],
  //           POC3: res?.data?.POC3 || [],
  //           Status: res?.data?.Status || "All",
  //           DateType: res?.data?.DateType || "EntryDate",
  //           FromDate: new Date(res?.data?.FromDate),
  //           ToDate: new Date(res?.data?.ToDate),
  //           ReceivedDate: res?.data?.ReceivedDate || "",
  //           PaymentMode: res?.data?.PaymentMode || "",
  //           Remark: res?.data?.Remark || "",
  //           EntryDate: res?.data?.EntryDate || "",
  //           PageSize: res?.data?.PageSize || 50,
  //           PageNo: res?.data?.PageNo || "",
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  // };
  useEffect(() => {
    getProject();
    getVertical();
    getTeam();
    getWing();
    getPOC1();
    getPOC2();
    getPOC3();
    // handleSearchFilter();
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    if (!data?.type) return; // Ensure the effect runs only when data.type exists

    const memberID = data?.LotusAssign
      ? [data?.LotusAssign]
      : [Number(localStorage?.getItem("CrmEmployeeID"))];

    let updatedFormData = {};

    switch (data?.type) {
      case "NewSaleChart":
        updatedFormData = {
          ...updatedFormData,
          Status: data?.Status,
        };
        handleSearch("", "", updatedFormData.Status);
        break;
      case "OldSaleChart":
        updatedFormData = {
          ...updatedFormData,
          Status: data?.Status,
        };
        handleSearch("", "", updatedFormData.Status);
        break;

      case "LedgerStatus":
        const projectID = data?.ProjectID;
        updatedFormData = {
          ProjectID: [projectID],
        };
        handleSearch("", [data?.ProjectID]);
        break;
    }

    // Update formData only if there are changes
    if (Object.keys(updatedFormData).length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        ...updatedFormData,
      }));
    }
  }, [data?.type]);

  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header="Cancel Quotation"
        >
          <CancelQuotationBookingModal
            visible={visible}
            setVisible={setVisible}
            edit={true}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      {visible?.saleVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Sale Convert"
        >
          <SaleConvertModal
            visible={visible}
            setVisible={setVisible}
            edit={true}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      {visible?.quotePiVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header="Quotation PI Details"
        >
          <QuotationPIModal
            visible={visible}
            setVisible={setVisible}
            edit={true}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      {visible?.gmailVisible && (
        <Modal
          modalWidth={"1100px"}
          visible={visible}
          setVisible={setVisible}
          Header="Quotation Email Details"
        >
          <GmailQuotationModal
            visible={visible}
            setVisible={setVisible}
            edit={true}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      <div className="card">
        <Heading
          title={
            <div className="d-flex">
              <span style={{ fontWeight: "bold" }}>
                {t("View Quotation Booking")}
              </span>
              <div className="d-flex">
                <span className="ml-4" style={{ fontWeight: "bold" }}>
                  {t("Search Filter Details")}{" "}
                </span>
                <span className="header ml-1" style={{ cursor: "pointer" }}>
                  <SearchLotusFilter
                    columnConfig={dynamicFilter}
                    setColumnConfig={setDynamicFilter}
                    PageName="SearchQuotationBooking"
                  />
                </span>
              </div>
            </div>
          }
          isBreadcrumb={false}
        />
        <div className="row m-2">
          {isVisible("ProjectID") && (
            <MultiSelectComp
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="ProjectID"
              placeholderName="Project"
              dynamicOptions={project}
              handleChange={handleMultiSelectChange}
              value={formData.ProjectID?.map((code) => ({
                code,
                name: project.find((item) => item.code === code)?.name,
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
              value={formData.VerticalID?.map((code) => ({
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
              value={formData.TeamID?.map((code) => ({
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
              value={formData.WingID?.map((code) => ({
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
              value={formData.POC1?.map((code) => ({
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
              value={formData.POC2?.map((code) => ({
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
              value={formData.POC3?.map((code) => ({
                code,
                name: poc3.find((item) => item.code === code)?.name,
              }))}
            />
          )}

          {isVisible("DateType") && (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="DateType"
              placeholderName="Date Type"
              dynamicOptions={[
                { label: "SalesDate", value: "SalesDate" },
                { label: "EntryDate", value: "EntryDate" },
              ]}
              handleChange={handleDeliveryChange}
              value={formData.DateType}
              requiredClassName={"required-fields"}
            />
          )}
          {isVisible("FromDate") && (
            <DatePicker
              className="custom-calendar"
              id="FromDate"
              name="FromDate"
              lable="From Date"
              placeholder={VITE_DATE_FORMAT}
              value={formData?.FromDate}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              handleChange={searchHandleChange}
            />
          )}
          {isVisible("ToDate") && (
            <DatePicker
              className="custom-calendar"
              id="ToDate"
              name="ToDate"
              lable="To Date"
              placeholder={VITE_DATE_FORMAT}
              value={formData?.ToDate}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              handleChange={searchHandleChange}
            />
          )}
          {isVisible("Status") && (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="Status"
              placeholderName="Status"
              dynamicOptions={[
                { label: "All", value: "0", rowColor: "primary" },
                { label: "Open", value: "Open", rowColor: "white" },
                { label: "Cancel", value: "Rejected", rowColor: "#B0C4DE" },
                { label: "Hold", value: "Hold", rowColor: "#FFF000" },
                { label: "Dead", value: "Dead", rowColor: "#c72643" },
                { label: "Approved", value: "Approved", rowColor: "#90EE90" },
                { label: "Sale", value: "Sale", rowColor: "#00FFFF" },
                // { label: "UnPaid", value: "UnPaid", rowColor: "#CC99FF" },
                {
                  label: "Partial Paid",
                  value: "PartialPaid",
                  rowColor: "#FFE4C4",
                },
                { label: "Full Paid", value: "FullPaid", rowColor: "#44A3AA" },
              ]}
              handleChange={handleDeliveryChange}
              value={formData.Status}
              requiredClassName={"required-fields"}
              handleFormatlabel={handleFormatlabel}
            />
          )}
          {isVisible("PageSize") && (
            <ReactSelect
              respclass="col-xl-2 mt-1 col-md-4 col-sm-6 col-12"
              name="PageSize"
              placeholderName="PageSize"
              dynamicOptions={PageSize}
              value={formData?.PageSize}
              // defaultValue={status.find((option) => option.value === "resolved")}
              handleChange={handleDeliveryChange}
              requiredClassName={"required-fields"}
            />
          )}
          <div className="ml-2 d-flex">
            {loading ? (
              <Loading />
            ) : (
              <button
                className="btn btn-sm btn-success"
                onClick={() => {
                  handleSearch(undefined, "0");
                }}
              >
                Search
              </button>
            )}
          </div>
          {/* <button className="btn btn-sm btn-danger ml-2" onClick={handleReset}>
            Reset Filter
          </button>
          <button
            className="btn btn-sm btn-danger ml-2"
            onClick={handleSaveFilter}
          >
            Save Filter
          </button>
          <button
            className="btn btn-sm btn-danger ml-2"
            onClick={handleSearchFilter}
          >
            Search Filter
          </button> */}
          <img
            src={excelimg}
            className="ml-3"
            style={{ width: "34px", height: "24px", cursor: "pointer" }}
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
          <div>
            <Link to="/QuotationBooking" className="ml-3">
              Back to QuotationBooking
            </Link>
          </div>
        </div>
      </div>

      {tableData?.length > 0 && (
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
                        PageName="SearchQuotationBookingTable"
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
            title={<span style={{ fontWeight: "bold" }}>Search Details</span>}
            secondTitle={
              <div className="d-flex" style={{ fontWeight: "bold" }}>
                <div className="row">
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
                        onClick={() => handleSearch("Open", "0")}
                      ></div>
                      <span
                        className="legend-label ml-2"
                        style={{
                          width: "90%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("Open")}
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
                          backgroundColor: "#B0C4DE",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch("Rejected", "0")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "90%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("Cancel")}
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
                          backgroundColor: "#FFF000",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch("Hold", "0")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "90%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("Hold")}
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
                          backgroundColor: "#90EE90",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch("Approved", "0")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("Approved")}
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
                          backgroundColor: "#00FFFF",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch("Sale", "0")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "70%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("Sale")}
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
                          backgroundColor: "#c72643",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch("Dead", "0")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "90%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("Dead")}
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
                          backgroundColor: "#FFE4C4",
                          borderColor: "#FFE4C4",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch("PartialPaid", "0")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("PartialPaid")}
                      </span>
                    </div>
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
                          backgroundColor: "#44A3AA",
                          borderColor: "#44A3AA",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch("FullPaid", "0")}
                      ></div>
                      <span
                        className="legend-label ml-2"
                        style={{
                          width: "90%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("Full Paid")}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="mr-4 ml-5">
                  Total Record :&nbsp; {tableData[0]?.TotalRecord}
                </span>
                <span>
                  Total Amount :&nbsp;{" "}
                  {Number(tableData[0]?.TotalAmount || 0).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </span>
              </div>
            }
          />
          <Tables
            thead={quotationSearchThead}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * formData?.PageSize + index + 1,
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
              Team: ele?.Team,
              POC: ele?.POC_1_Name,
              "Quotation No.": (
                <>
                  <Tooltip label={ele?.ActualQuotationNo}>
                    <span
                      id={`projectName-${index}`}
                      targrt={`projectName-${index}`}
                      style={{ textAlign: "center" }}
                    >
                      {shortenName(ele?.QuotationNo)}
                    </span>
                  </Tooltip>
                </>
              ),
              "PINo.": (
                <>
                  <Tooltip label={ele?.NoOfPI}>
                    <span
                      id={`projectName-${index}`}
                      targrt={`projectName-${index}`}
                      style={{ textAlign: "center" }}
                    >
                      {shortenName(ele?.PINo)}
                    </span>
                  </Tooltip>
                  {/* {ele?.NoOfPI > 0 && (
                    <i
                      className="fa fa-eye ml-2"
                      onClick={() => {
                        setVisible({
                          quotePiVisible: true,
                          showData: ele,
                          ele,
                        });
                      }}
                    ></i>
                  )} */}
                </>
              ),
              PaymentMode: ele?.PaymentMode,
              "Gross Amount": ele?.GrossAmount,
              "Dis Amount": ele?.DiscountAmount,
              "Tax Amount": ele?.TaxAmount,
              "Net Amount": ele?.NetAmount,
              "Entry Date": ele?.dtEntry
                ? new Date(ele.dtEntry)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(" ", "-")
                    .replace(" ", "-")
                : "",
              Remark: (
                <Tooltip label={capitalizeFirstLetter(ele?.Remark)}>
                  <span
                    id={`projectName-${index}`}
                    targrt={`projectName-${index}`}
                    style={{ textAlign: "center" }}
                  >
                    {capitalizeFirstLetter(shortenName(ele?.Remark))}
                  </span>
                </Tooltip>
              ),
              Email: ele?.IsApproved == 1 && (
                <img
                  src={gmaillogo}
                  height={"10px"}
                  onClick={() => {
                    setVisible({
                      gmailVisible: true,
                      showData: ele,
                      ele,
                    });
                  }}
                  title="Click to Gmail."
                  style={{ marginLeft: "7px" }}
                ></img>
              ),
              Print: (
                <i
                  className="fa fa-print"
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    color: "black",
                  }}
                  title="Click here to Print."
                  onClick={() => window.open(ele?.QuotationURL, "_blank")}
                ></i>
              ),
              "Print PI":
                ele?.NoOfPI > 1 ? (
                  <i
                    className="fa fa-eye ml-2"
                    onClick={() => {
                      setVisible({
                        quotePiVisible: true,
                        showData: ele,
                        ele,
                      });
                    }}
                  ></i>
                ) : (
                  // ele?.NoOfPI > 0 && (
                  <i
                    className="fa fa-print"
                    style={{
                      marginLeft: "5px",
                      cursor: "pointer",
                      color: "black",
                    }}
                    title="Click here to Print."
                    onClick={() => window.open(ele?.PIURL, "_blank")}
                  ></i>
                  // )
                ),
              Action: (
                <div>
                  {ele?.QuotationStatus == "Open" &&
                    !isApproved &&
                    QuotationApproved && (
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => handleApprove(ele?.EncryptID)}
                      >
                        Approve
                      </button>
                    )}
                  {ele?.QuotationStatus == "Approved" && (
                    <button
                      className="btn btn-xs btn-primary"
                      // onClick={() => handleSaleConvert(ele?.EncryptID)}
                      onClick={() => {
                        setVisible({
                          saleVisible: true,
                          showData: ele,
                          ele,
                        });
                      }}
                    >
                      Sale
                    </button>
                  )}
                </div>
              ),

              Edit: ele?.SalesID == "0" && (
                <>
                  <Link
                    to="/QuotationBooking"
                    state={{ data: ele?.EncryptID, edit: true, givenData: ele }}
                    style={{ cursor: "pointer" }}
                  >
                    Edit
                  </Link>
                </>
              ),
              Cancel:
                ele?.QuotationStatus === "Open" ||
                (ele?.QuotationStatus === "Approved" && QuotationReject) ? (
                  <i
                    className="fa fa-times"
                    onClick={() => {
                      setVisible({
                        showVisible: true,
                        showData: ele,
                        ele,
                      });
                    }}
                    style={{
                      marginLeft: "10px",
                      color: "red",
                      cursor: "pointer",
                    }}
                  ></i>
                ) : (
                  ""
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

export default SearchQuotationBooking;
