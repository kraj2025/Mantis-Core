import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Heading from "../components/UI/Heading";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import { useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";
import DatePicker from "../components/formComponent/DatePicker";
import Tables from "../components/UI/customTable";
import SettlementAmountModal from "../components/UI/customTable/SettlementAmountModal";
import Modal from "../components/modalComponent/Modal";
import { apiUrls } from "../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import RemoveAmountSubmissionModal from "../components/UI/customTable/RemoveAmountSubmissionModal";
import Input from "../components/formComponent/Input";
import moment from "moment";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import Tooltip from "./Tooltip";
import CustomPagination from "../utils/CustomPagination";
import { PageSize } from "../utils/constant";
import AmountPIModal from "../components/UI/customTable/AmountPIModal";
import GmailAmountSubmissionModal from "../components/UI/customTable/GmailAmountSubmissionModal";
import gmaillogo from "../../src/assets/image/Gmail_Logo.png";
import { useTranslation } from "react-i18next";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import SearchLotusFilter from "./SearchLotusFilter";
import { axiosInstances } from "../networkServices/axiosInstance";
const SearchAmountSubmission = ({ data }) => {

  const [t] = useTranslation();
  const AmountCancel = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowAmountSubmissionCancel"
  );
  // console.log("amoiunt", AmountCancel);

  // useEffect(() => {
  //   if (data) {
  //   }
  // }, []);

  const { VITE_DATE_FORMAT } = import.meta.env;
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);
  const [project, setProject] = useState([]);
  const [poc1, setPoc1] = useState([]);
  const [poc2, setPoc2] = useState([]);
  const [poc3, setPoc3] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [dynamicFilter, setDynamicFilter] = useState([]);
  const [columnConfig, setColumnConfig] = useState([]);

  const [formData, setFormData] = useState({
    ProjectID: [],
    VerticalID: [],
    TeamID: [],
    WingID: [],
    POC1: [],
    POC2: [],
    POC3: [],
    Status: "All",
    DateType: "ReceivedDate",
    FromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    ToDate: new Date(),
    ReceivedDate: "",
    PaymentMode: "",
    Remark: "",
    EntryDate: "",
    PageSize: 50,
    PageNo: "",
    BankName: "",
    RecoveryTeam: "",
  });

  console.log("formdata,kamal",formData)
  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };

  const handleDeliveryChangefilter = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
      { header: "Status", visible: true },
      { header: "DateType", visible: true },
      { header: "FromDate", visible: true },
      { header: "ToDate", visible: true },
      { header: "BankName", visible: true },
      { header: "RecoveryTeam", visible: true },
    ];
    axiosInstances
      .post(apiUrls.SaveFilterTableReprintData, {
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        FilterData: JSON.stringify(filterData),
        PageName: "SearchAmountSubmission",
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
      // form.append("PageName", "SearchAmountSubmission");

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
      { header: "Amount", visible: true },
      { header: "PaymentMode", visible: true },
      { header: "Deposite Date", visible: true },
      { header: "Entry Date", visible: true },
      { header: "Deposite By", visible: true },
      { header: "Bank Name", visible: true },
      { header: "Voucher No.", visible: true },
      { header: "BankName", visible: true },
      { header: "Remarks", visible: true },
      { header: "Settlement", visible: true },
      { header: "Print", visible: true },
      { header: "Email", visible: true },
      { header: "Cancel", visible: true },
    ];
    axiosInstances
      .post(apiUrls.SaveFilterTableReprintData, {
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        FilterData: JSON.stringify(filterData),
        PageName: "SearchAmountSubmissionTable",
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
      // form.append("PageName", "SearchAmountSubmissionTable");

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

  const SearchAmountSubmissionFilter = () => {
    axiosInstances
      .post(apiUrls.GetFilterTableReprintData, {
        PageName: "SearchAmountSubmission",
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
      //   form.append("PageName", "SearchAmountSubmission"),
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
        PageName: "SearchAmountSubmissionTable",
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
      //   form.append("PageName", "SearchAmountSubmissionTable"),
      //   axios
      //     .post(apiUrls?.GetFilterTableReprintData, form, { headers })
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

  // const handleDeliveryChange = (name, e, index) => {
  //   const { value } = e;
  //   const details = tableData[index];

  //   // setFormData({
  //   //   ...formData,
  //   //   [name]: value,
  //   // });
  //   console.log("detailsvalue", value);
  //   // Update tableData for the corresponding row
  //   const updatedTableData = [...tableData];
  //   updatedTableData[index] = {
  //     ...updatedTableData[index],
  //     PaymentMode: value,
  //   };
  //   setTableData(updatedTableData);

  //   if (name == "PaymentMode") {
  //     updatePaymentMode(details, value);
  //   }
  //   if (name == "BankName") {
  //     updateBankName(details, value);
  //   }
  // };

  const handleDeliveryChange = (name, e, index) => {
    const value = e?.value || e; // Support both controlled and native events
    const details = tableData[index];

    console.log("detailsvalue", value);

    // Update the tableData at the specified index
    const updatedTableData = [...tableData];
    updatedTableData[index] = {
      ...updatedTableData[index],
      [name]: value, // Use dynamic key to handle multiple fields
    };
    setTableData(updatedTableData);

    // Call specific update functions based on the name
    if (name === "PaymentMode") {
      updatePaymentMode(details, value);
    } else if (name === "BankName") {
      updateBankName(details, value);
    }
  };

  const searchHandleChangeTable = (name, value, index) => {
    const details = tableData[index];
    let updatedData = [...tableData];
    updatedData[index][name] = value;
    setTableData(updatedData);
    updateReceivedDate(details, value, index);
  };

  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e, id, index) => {
    const { name, value } = e.target;
    const data = [...tableData];
    data[index][name] = value;
    setTableData(data);
  };

  const updatePaymentMode = (item, value) => {
    axiosInstances
      .post(apiUrls.AmountSubmission_ByAccounts_Update, {
        OnAccount_Req_ID: String(item?.EncryptID),
        ActionType: "PaymentMode",
        Remark: "",
        ReceivedDate: "",
        PaymentMode: String(value),
        VoucherNo: "",
        BankName: "",
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleSearch();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateRemark = (item, value) => {
    console.log("remark", item);
    axiosInstances
      .post(apiUrls.AmountSubmission_ByAccounts_Update, {
        OnAccount_Req_ID: String(item?.EncryptID),
        ActionType: "Remark",
        Remark: String(item?.Remark),
        ReceivedDate: "",
        PaymentMode: "",
        VoucherNo: "",
        BankName:""
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleSearch();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateBankName = (item, value) => {
    axiosInstances
      .post(apiUrls.AmountSubmission_ByAccounts_Update, {
        OnAccount_Req_ID: String(item?.EncryptID),
        ActionType: "BankName",
        Remark: "",
        ReceivedDate: "",
        PaymentMode: "",
        VoucherNo: "",
        BankName: String(value),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleSearch();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateReceivedDate = (item, value) => {
    axiosInstances
      .post(apiUrls.AmountSubmission_ByAccounts_Update, {
        OnAccount_Req_ID: String(item?.EncryptID),
        ActionType: "ReceivedDate",
        Remark: "",
        ReceivedDate: String(moment(value).format("YYYY-MM-DD")),
        PaymentMode: "",
        VoucherNo: "",
        BankName: "",
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleSearch();
        } else {
          toast.error(res?.data?.message);
        }
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
  const [visible, setVisible] = useState({
    showVisible: false,
    removeVisible: false,
    gmailVisible: false,
    piVisible: false,
    showData: {},
  });
  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
  const handleSearch = (page, code) => {
    if (formData?.DateType == "") {
      toast.error("Please Select DateType.");
    } else if (formData?.FromDate == "") {
      toast.error("Please Select FromDate.");
    } else if (formData?.Status == "") {
      toast.error("Please Select Status.");
    } else {
      setLoading(true);
      const payload = {
        DateType: String(formData?.DateType || ""),
        FromDate: formatDate(formData?.FromDate) || "",
        ToDate: formatDate(formData?.ToDate) || "",
        Status: String(formData?.Status || ""),
        SearchType: "OnScreen",
        BankName: String(formData?.BankName || ""),
        PageSize: String(formData?.PageSize || ""),
        PageNo: String(page ?? currentPage - 1),
        RowColor: String(code || ""),
        ProjectID: String(formData?.ProjectID || ""),
        VerticalID: String(formData?.VerticalID || ""),
        TeamID: String(formData?.TeamID || ""),
        WingID: String(formData?.WingID || ""),
        POC1: String(formData?.POC1 || ""),
        POC2: String(formData?.POC2 || ""),
        POC3: String(formData?.POC3 || ""),
        RecoveryTeam: formData?.RecoveryTeam
          ? String(formData?.RecoveryTeam)
          : "All",
      };

      axiosInstances
        .post(apiUrls.AmountSubmission_ByAccounts_Search, payload)
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
        //   form.append("BankName", formData?.BankName),
        //   form.append("DateType", formData?.DateType),
        //   form.append(
        //     "RecoveryTeam",
        //     formData?.RecoveryTeam ? formData?.RecoveryTeam : "All"
        //   ),
        //   form.append("FromDate", formatDate(formData?.FromDate)),
        //   form.append("ToDate", formatDate(formData?.ToDate)),
        //   form.append("SearchType", "OnScreen"),
        //   form.append("rowColor", code ? code : ""),
        //   form.append("PageSize", formData?.PageSize),
        //   form.append("PageNo", page ?? currentPage - 1),
        //   // form.append("colorcode", code ? String(code) : ""),
        //   axios
        //     .post(apiUrls?.AmountSubmission_ByAccounts_Search, form, { headers })
        .then((res) => {
          const datas = res?.data?.data?.map((val) => {
            val.isShow = false;
            val.isDate = false;
            val.isRemark = false;
            val.isBankName = false;
            return val;
          });
          setTableData(datas);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };
  const [excelData, setExcelData] = useState([]);
  const handleSearchExcel = (code) => {
    const payload = {
      DateType: String(formData?.DateType || ""),
      FromDate: formatDate(formData?.FromDate) || "",
      ToDate: formatDate(formData?.ToDate) || "",
      Status: String(formData?.Status || ""),
      SearchType: "Excel",
      BankName: String(formData?.BankName || ""),
      PageSize: String(""),
      PageNo: String(""),
      RowColor: String(""),
      ProjectID: String(formData?.ProjectID || ""),
      VerticalID: String(formData?.VerticalID || ""),
      TeamID: String(formData?.TeamID || ""),
      WingID: String(formData?.WingID || ""),
      POC1: String(formData?.POC1 || ""),
      POC2: String(formData?.POC2 || ""),
      POC3: String(formData?.POC3 || ""),
      RecoveryTeam: String(""),
    };

    axiosInstances
      .post(apiUrls.AmountSubmission_ByAccounts_Search, payload)
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
      //   form.append("BankName", formData?.BankName),
      //   form.append("DateType", formData?.DateType),
      //   form.append("FromDate", formatDate(formData?.FromDate)),
      //   form.append("ToDate", formatDate(formData?.ToDate)),
      //   form.append("SearchType", "Excel"),
      //   // form.append("colorcode", code ? String(code) : ""),
      //   axios
      //     .post(apiUrls?.AmountSubmission_ByAccounts_Search, form, { headers })
      .then((res) => {
        setExcelData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleExcel = () => {
    setLoading(true);
    const payload = {
      DateType: String(formData?.DateType || ""),
      FromDate: formatDate(formData?.FromDate) || "",
      ToDate: formatDate(formData?.ToDate) || "",
      Status: String(formData?.Status || ""),
      SearchType: "Excel",
      BankName: String(formData?.BankName || ""),
      PageSize: String(""),
      PageNo: String(""),
      RowColor: String(""),
      ProjectID: String(formData?.ProjectID || ""),
      VerticalID: String(formData?.VerticalID || ""),
      TeamID: String(formData?.TeamID || ""),
      WingID: String(formData?.WingID || ""),
      POC1: String(formData?.POC1 || ""),
      POC2: String(formData?.POC2 || ""),
      POC3: String(formData?.POC3 || ""),
      RecoveryTeam: String(""),
    };

    axiosInstances
      .post(apiUrls.AmountSubmission_ByAccounts_Search, payload)
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
      // form.append(
      //   "LoginName",
      //   useCryptoLocalStorage("user_Data", "get", "realname")
      // );
      // form.append("ProjectID", formData?.ProjectID);
      // form.append("VerticalID", formData?.VerticalID);
      // form.append("TeamID", formData?.TeamID);
      // form.append("WingID", formData?.WingID);
      // form.append("POC1", formData?.POC1);
      // form.append("POC2", formData?.POC2);
      // form.append("POC3", formData?.POC3);
      // form.append("Status", formData?.Status);
      // form.append("BankName", formData?.BankName);
      // form.append("DateType", formData?.DateType);
      // form.append("FromDate", formatDate(formData?.FromDate));
      // form.append("ToDate", formatDate(formData?.ToDate));
      // form.append("SearchType", "Excel");

      // axios
      //   .post(apiUrls?.AmountSubmission_ByAccounts_Search, form, { headers })
      .then((res) => {
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
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
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

  const handleCancelExcel = () => {
    setLoading(true);
    const payload = {
      DateType: String(formData?.DateType || ""),
      FromDate: formatDate(formData?.FromDate) || "",
      ToDate: formatDate(formData?.ToDate) || "",
      Status: String(formData?.Status || ""),
      SearchType: "CancelExcel",
      BankName: String(formData?.BankName || ""),
      PageSize: String(""),
      PageNo: String(""),
      RowColor: String(""),
      ProjectID: String(formData?.ProjectID || ""),
      VerticalID: String(formData?.VerticalID || ""),
      TeamID: String(formData?.TeamID || ""),
      WingID: String(formData?.WingID || ""),
      POC1: String(formData?.POC1 || ""),
      POC2: String(formData?.POC2 || ""),
      POC3: String(formData?.POC3 || ""),
      RecoveryTeam: String(""),
    };

    axiosInstances
      .post(apiUrls.AmountSubmission_ByAccounts_Search, payload)
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
      //   form.append("BankName", formData?.BankName),
      //   form.append("DateType", formData?.DateType),
      //   form.append("FromDate", formatDate(formData?.FromDate)),
      //   form.append("ToDate", formatDate(formData?.ToDate)),
      //   form.append("SearchType", "CancelExcel"),
      //   axios
      //     .post(apiUrls?.AmountSubmission_ByAccounts_Search, form, { headers })
      .then((res) => {
        const datas = res?.data?.data;
        toast.success(datas);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const totalRecords =
    tableData?.length > 0 && parseInt(tableData[0]?.TotalRecord);
  const totalPages = Math.ceil(totalRecords / formData?.PageSize);
  const currentData = tableData;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    handleSearch(undefined, newPage - 1);
  };
  const staticHeaders = ["S.No."]; // Always shown

  const allHeaders = [
    "Project Name",
    "Team",
    "POC-I",
    "Amount",
    "PaymentMode",
    "Deposite Date",
    "Entry Date",
    "Deposite By",
    "Bank Name",
    "Voucher No.",
    "Remarks",
    "Settlement",
    "Print",
    "Email",
    "Cancel",
  ];

  const amountTHEAD = [
    ...staticHeaders.map((header) => ({
      name: t(header),
      width: header === "S.No." ? "2%" : undefined,
    })),
    ...allHeaders
      .filter((header) => isTableVisible(header)) // only show if enabled
      .map((header) =>
        ["Settlement", "Print"].includes(header)
          ? { name: t(header), width: "2%" }
          : t(header)
      ),
  ];

  //   const amountTHEAD = [
  //   ...staticHeaders.map((header) => ({
  //     name: t(header),
  //     width: header === "S.No." ? "2%" : undefined,
  //   })),

  //   ...allHeaders
  //     .filter((header) => isTableVisible(header))
  //     .map((header) =>
  //       ["Settlement", "Print"].includes(header)
  //         ? { name: t(header), width: "2%" }
  //         : { name: t(header) }
  //     ),

  //   ...(AmountCancel == 1
  //     ? [{ name: t("Cancel"), width: "2%" }]
  //     : []),
  // ];

  const getThead = () => {
    if (AmountCancel == 1) {
      return [...amountTHEAD];
    } else {
      return amountTHEAD.filter((key) => key !== "Cancel");
    }
  };

  const shortenName = (name) => {
    return name.length > 15 ? name.substring(0, 25) + "..." : name;
  };

  const handleIconClickdate = (value, index) => {
    let data = [...tableData];
    data[index]["isDate"] = !data[index]["isDate"];
    setTableData(data);
  };

  const handleIconClickPayment = (value, index) => {
    let data = [...tableData];
    data[index]["isShow"] = !data[index]["isShow"];
    setTableData(data);
  };

  const handleIconClick = (value, index) => {
    let data = [...tableData];
    data[index]["isRemark"] = !data[index]["isRemark"];
    setTableData(data);
  };
  const handleIconBankClick = (value, index) => {
    let data = [...tableData];
    data[index]["isBankName"] = !data[index]["isBankName"];
    setTableData(data);
  };

  const handleReset = () => {
    setFormData({
      ...formData,
      ProjectID: [],
      VerticalID: [],
      TeamID: [],
      WingID: [],
      POC1: [],
      POC2: [],
      POC3: [],
      Status: "All",
      BankName: "",
      DateType: "ReceivedDate",
      FromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      ToDate: new Date(),
      ReceivedDate: "",
      PaymentMode: "",
      Remark: "",
      EntryDate: "",
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
        Type: "AmountSubmission",
        FilterData: String(savedData),
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
          ProjectID: [],
          VerticalID: [],
          TeamID: [],
          WingID: [],
          POC1: [],
          POC2: [],
          POC3: [],
          Status: "All",
          DateType: "ReceivedDate",
          FromDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ),
          ToDate: new Date(),
          ReceivedDate: "",
          PaymentMode: "",
          BankName: "",
          Remark: "",
          EntryDate: "",
          PageSize: 50,
          PageNo: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log("save data", formData);
  };

  // const handleSearchFilter = () => {
  //   let form = new FormData();
  //   form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
  //     form.append("Type", "AmountSubmission"),
  //     // form.append("FilterData", savedData),
  //     axios
  //       .post(apiUrls?.SearchFilterDataSubmission, form, { headers })
  //       .then((res) => {
  //         setFormData({
  //           ...formData,
  //           ProjectID: res?.data?.ProjectID || [],
  //           VerticalID: res?.data?.VerticalID || [],
  //           TeamID: res?.data?.TeamID || [],
  //           WingID: res?.data?.WingID || [],
  //           POC1: res?.data?.POC1 || [],
  //           POC2: res?.data?.POC2 || [],
  //           POC3: res?.data?.POC3 || [],
  //           Status: res?.data?.Status || "All",
  //           BankName: res?.data?.BankName || "",
  //           DateType: res?.data?.DateType || "ReceivedDate",
  //           FromDate: new Date(res?.data?.FromDate),
  //           ToDate: new Date(res?.data?.ToDate),
  //           ReceivedDate: res?.data?.ReceivedDate || "",
  //           PaymentMode: res?.data?.PaymentMode || "",
  //           BankName: res?.data?.BankName || "",
  //           Remark: res?.data?.Remark || "",
  //           EntryDate: res?.data?.EntryDate || "",
  //           PageSize: res?.data?.PageSize || 50,
  //           PageNo: res?.data?.PageNo || "",
  //         });

  //         // if (res?.data) {
  //         //   console.log("kamaldata:", res?.data);
  //         // } else {
  //         //   console.error("No data found in the response.");
  //         // }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });

  //   // console.log("save data", formData);
  // };
  useEffect(() => {
    getProject();
    getVertical();
    getTeam();
    getWing();
    getPOC1();
    getPOC2();
    getPOC3();
    handleSearchExcel();

    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  return (
    <>
      {visible?.gmailVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Amount Submission Email Details")}
        >
          <GmailAmountSubmissionModal
            visible={visible}
            setVisible={setVisible}
            edit={true}
          />
        </Modal>
      )}

      {visible?.showVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          // Header={`Project Name:  ${formData?.ProjectName}`}
          Header={t("Settlement Details")}
        >
          <SettlementAmountModal
            visible={visible}
            setVisible={setVisible}
            edit={true}
          />
        </Modal>
      )}
      {visible?.removeVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Cancel AmountSubmission")}
        >
          <RemoveAmountSubmissionModal
            visible={visible}
            setVisible={setVisible}
          />
        </Modal>
      )}
      {visible?.piVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Upload Tax Invoice Details")}
        >
          <AmountPIModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}

      <div className="card  border">
        <Heading
          title={
            <div className="d-flex">
              <span style={{ fontWeight: "bold" }}>
                {t("Search AmountSubmission")}
              </span>
              <div className="d-flex">
                <span className="ml-4" style={{ fontWeight: "bold" }}>
                  {t("Search Filter Details")}{" "}
                </span>
                <span className="header ml-1" style={{ cursor: "pointer" }}>
                  <SearchLotusFilter
                    columnConfig={dynamicFilter}
                    setColumnConfig={setDynamicFilter}
                    PageName="SearchAmountSubmission"
                  />
                </span>
              </div>
            </div>
          }
          secondTitle={
            <Link to="/AmountSubmission" style={{ float: "right" }}>
              {
                <span style={{ fontWeight: "bold" }}>
                  {t("Amount Submission")}
                </span>
              }
            </Link>
          }
        />
        {/* <Accordion
          defaultValue={true}
          notOpen={true}
          title={
            <div className="d-flex">
              <span className="mt-1"> {t("Search Filter Details")} </span>
              <span className="header ml-1" style={{ cursor: "pointer" }}>
                <SearchLotusFilter
                  columnConfig={dynamicFilter}
                  setColumnConfig={setDynamicFilter}
                  PageName="SearchAmountSubmission"
                />
              </span>
            </div>
          }
        /> */}
        <div className="row g-4 m-2">
          {isVisible("ProjectID") && (
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
          )}
          {isVisible("VerticalID") && (
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
          )}
          {isVisible("TeamID") && (
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
          )}
          {isVisible("WingID") && (
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
          )}
          {isVisible("POC1") && (
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
          )}
          {isVisible("POC2") && (
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
          )}
          {isVisible("POC3") && (
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
          )}
          {isVisible("RecoveryTeam") && (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="RecoveryTeam"
              placeholderName={t("Recovery Team")}
              dynamicOptions={[
                { label: "Select", value: "Select" },
                { label: "Sale", value: "Sale" },
                { label: "Delivery", value: "Delivery" },
                { label: "Support", value: "Support" },
              ]}
              handleChange={handleDeliveryChangefilter}
              value={formData.RecoveryTeam}
            />
          )}
          {isVisible("DateType") && (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="DateType"
              placeholderName={t("Date Type")}
              dynamicOptions={[
                { label: "ReceivedDate", value: "ReceivedDate" },
                { label: "EntryDate", value: "EntryDate" },
              ]}
              handleChange={handleDeliveryChangefilter}
              value={formData.DateType}
              requiredClassName={"required-fields"}
            />
          )}
          {isVisible("FromDate") && (
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
          )}
          {isVisible("ToDate") && (
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
          )}
          {isVisible("BankName") && (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="BankName"
              placeholderName={t("Bank Name")}
              dynamicOptions={[
                { label: "Select", value: "All" },
                { label: "ICICI-220", value: "ICICI-220" },
                { label: "ICICI-51", value: "ICICI-51" },
                { label: "Kotak", value: "Kotak" },
              ]}
              handleChange={handleDeliveryChangefilter}
              value={formData.BankName}
            />
          )}
          {isVisible("Status") && (
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
              handleChange={handleDeliveryChangefilter}
              value={formData.Status}
              requiredClassName={"required-fields"}
            />
          )}
          {isVisible("PageSize") && (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="PageSize"
              placeholderName={t("PageSize")}
              dynamicOptions={PageSize}
              value={formData?.PageSize}
              // defaultValue={status.find((option) => option.value === "resolved")}
              handleChange={handleDeliveryChangefilter}
              requiredClassName={"required-fields"}
            />
          )}
          <div className="col-2">
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
              className="btn btn-sm btn-success ml-2"
              // onClick={() => ExportToExcel(excelData)}
              onClick={handleExcel}
            >
              {t("Excel")}
            </button>
            <button
              className="btn btn-sm btn-success ml-2"
              onClick={handleCancelExcel}
            >
              {t("InActive Excel")}
            </button>
            {/* onClick={() => ExportToExcel(tableData)} */}
          </div>
          {/* <button className="btn btn-sm btn-danger ml-0" onClick={handleReset}>
            {t("Reset Filter")}
          </button> */}
          {/* <button
            className="btn btn-sm btn-danger ml-2"
            onClick={handleSaveFilter}
          >
            {t("Save Filter")}
          </button> */}
          {/* <button
            className="btn btn-sm btn-danger ml-2"
            onClick={handleSearchFilter}
          >
            {t("Search Filter")}
          </button> */}
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
                        PageName="SearchAmountSubmissionTable"
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
                      PageName="SearchAmountSubmissionTable"
                    />
                  </span>
                </div>
              </div>
            }
            secondTitle={
              <>
                <div className="d-flex" style={{ fontWeight: "bold" }}>
                  <div className="row g-4">
                    <div
                      className="d-flex flex-wrap align-items-center"
                      style={{ marginRight: "0px" }}
                    >
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
                            backgroundColor: "#00B0F0",
                            cursor: "pointer",
                            height: "10px",
                            width: "16px",
                            borderRadius: "50%",
                          }}
                          onClick={() => handleSearch(undefined, "1")}
                        ></div>
                        <span
                          className="legend-label"
                          style={{
                            width: "12%",
                            textAlign: "left",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                          onClick={() => handleSearch(undefined, "1")}
                        >
                          {t("Delta")}
                        </span>
                        <div
                          className="legend-circle"
                          style={{
                            backgroundColor: "lightgreen",
                            cursor: "pointer",
                            height: "10px",
                            width: "16px",
                            borderRadius: "50%",
                          }}
                          onClick={() => handleSearch(undefined, "2")}
                        ></div>
                        <span
                          className="legend-label"
                          style={{
                            width: "12%",
                            textAlign: "left",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                          onClick={() => handleSearch(undefined, "2")}
                        >
                          {t("Online")}
                        </span>
                        <div
                          className="legend-circle"
                          style={{
                            backgroundColor: "rgb(0, 255, 255)",
                            cursor: "pointer",
                            height: "10px",
                            width: "16px",
                            borderRadius: "50%",
                          }}
                          onClick={() => handleSearch(undefined, "3")}
                        ></div>
                        <span
                          className="legend-label"
                          style={{
                            width: "20%",
                            textAlign: "left",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                          onClick={() => handleSearch(undefined, "3")}
                        >
                          {t("Non Settled")}
                        </span>
                        <div
                          className="legend-circle"
                          style={{
                            backgroundColor: "rgb(255, 228, 196)",
                            cursor: "pointer",
                            height: "10px",
                            width: "16px",
                            borderRadius: "50%",
                          }}
                          onClick={() => handleSearch(undefined, "4")}
                        ></div>
                        <span
                          className="legend-label"
                          style={{
                            width: "25%",
                            textAlign: "left",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                          onClick={() => handleSearch(undefined, "4")}
                        >
                          {t("Partial Settled")}
                        </span>
                        <div
                          className="legend-circle"
                          style={{
                            backgroundColor: "rgb(68, 163, 170)",
                            cursor: "pointer",
                            height: "10px",
                            width: "16px",
                            borderRadius: "50%",
                          }}
                          onClick={() => handleSearch(undefined, "5")}
                        ></div>
                        <span
                          className="legend-label"
                          style={{
                            width: "20%",
                            textAlign: "left",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                          onClick={() => handleSearch(undefined, "5")}
                        >
                          {t("Full Settled")}
                        </span>
                        <div
                          className="legend-circle"
                          style={{
                            backgroundColor: "rgb(73, 88, 225)",
                            cursor: "pointer",
                            height: "10px",
                            width: "15px",
                            borderRadius: "50%",
                          }}
                          onClick={() => handleSearch(undefined, "6")}
                        ></div>
                        <span
                          className="legend-label"
                          style={{
                            width: "20%",
                            textAlign: "left",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                          onClick={() => handleSearch(undefined, "6")}
                        >
                          {t("Tax Pending")}
                        </span>
                        <div
                          className="legend-circle"
                          style={{
                            backgroundColor: "rgb(170, 68, 155)",
                            cursor: "pointer",
                            height: "10px",
                            width: "16px",
                            borderRadius: "50%",
                          }}
                          onClick={() => handleSearch(undefined, "7")}
                        ></div>
                        <span
                          className="legend-label"
                          style={{
                            width: "25%",
                            textAlign: "left",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                          onClick={() => handleSearch(undefined, "7")}
                        >
                          {t("Tax Generated")}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Total Transaction: {tableData1?.length} */}
                  <span className="ml-5">
                    {t("Total Amount")} : &nbsp;
                    {Number(tableData[0]?.TotalAmount || 0).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>
              </>
            }
          />

          <Tables
            thead={amountTHEAD}
            tbody={currentData?.map((ele, index) => {
              const serialNumber =
                (currentPage - 1) * formData?.PageSize + index + 1;
              const rowData = {
                "S.No.": serialNumber,
              };

              if (isTableVisible("Project Name")) {
                rowData["Project Name"] = (
                  <Tooltip label={ele?.ProjectName}>
                    <span
                      id={`projectName-${index}`}
                      target={`projectName-${index}`}
                      style={{ textAlign: "center" }}
                    >
                      {shortenName(ele?.ProjectName)}
                    </span>
                  </Tooltip>
                );
              }

              if (isTableVisible("Team")) rowData.Team = ele?.Team;
              if (isTableVisible("POC-I")) rowData["POC-I"] = ele?.POC_1_Name;
              if (isTableVisible("Amount")) rowData.Amount = ele?.Amount;

              if (isTableVisible("PaymentMode")) {
                rowData.PaymentMode = (
                  <div className="d-flex align-items-center justify-content-between">
                    {!ele?.isShow && <div>{ele?.PaymentMode}</div>}
                    <div className="d-flex align-items-center justify-content-between">
                      <i
                        className="fa fa-eye mr-2"
                        onClick={() => handleIconClickPayment(ele, index)}
                        style={{ cursor: "pointer" }}
                      ></i>
                      {ele?.isShow && (
                        <ReactSelect
                          name="PaymentMode"
                          placeholderName="Payment Mode"
                          dynamicOptions={[
                            { label: "Delta", value: "Cash" },
                            { label: "NEFT", value: "NEFT" },
                            { label: "Cheque", value: "Cheque" },
                          ]}
                          handleChange={(name, e) =>
                            handleDeliveryChange(name, e, index)
                          }
                          value={ele.PaymentMode}
                          respclass={"width80px"}
                        />
                      )}
                    </div>
                  </div>
                );
              }

              if (isTableVisible("Deposite Date")) {
                rowData["Deposite Date"] = (
                  <div className="d-flex align-items-center justify-content-between">
                    {!ele?.isDate && <div>{ele?.ReceivedDate}</div>}
                    <div className="d-flex align-items-center justify-content-between">
                      <i
                        className="fa fa-calendar ml-2 mr-2"
                        onClick={() => handleIconClickdate(ele, index)}
                        style={{ cursor: "pointer" }}
                      ></i>
                      {ele?.isDate && (
                        <DatePicker
                          className="custom-calendar"
                          id="ReceivedDate"
                          name="ReceivedDate"
                          label="Deposit Date"
                          placeholder={VITE_DATE_FORMAT}
                          value={ele?.ReceivedDate}
                          respclass="width100px"
                          handleChange={(e) => {
                            const { name, value } = e.target;
                            searchHandleChangeTable(name, value, index);
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              }

              if (isTableVisible("Entry Date")) {
                rowData["Entry Date"] = ele?.dtEntry
                  ? new Date(ele.dtEntry)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(" ", "-")
                      .replace(" ", "-")
                  : "";
              }

              if (isTableVisible("Deposite By"))
                rowData["Deposite By"] = ele?.ReceivedBy;

              if (isTableVisible("Bank Name")) {
                rowData["Bank Name"] = ele?.PaymentMode !== "Cash" && (
                  <div className="d-flex align-items-center justify-content-between">
                    {!ele?.isBankName && <div>{ele?.BankName}</div>}
                    <div className="d-flex align-items-center justify-content-between">
                      <i
                        className="fa fa-eye mr-2"
                        onClick={() => handleIconBankClick(ele, index)}
                        style={{ cursor: "pointer" }}
                      ></i>
                      {ele?.isBankName && (
                        <ReactSelect
                          name="BankName"
                          placeholderName="Bank"
                          dynamicOptions={[
                            { label: "ICICI-220", value: "ICICI-220" },
                            { label: "ICICI-51", value: "ICICI-51" },
                            { label: "Kotak", value: "Kotak" },
                          ]}
                          handleChange={(name, e) =>
                            handleDeliveryChange(name, e, index)
                          }
                          value={ele.BankName}
                          respclass={"width80px"}
                        />
                      )}
                    </div>
                  </div>
                );
              }

              if (isTableVisible("Voucher No."))
                rowData["Voucher No."] = ele?.VoucherNo;

              if (isTableVisible("Remarks")) {
                rowData.Remarks = (
                  <div className="d-flex align-items-center justify-content-between">
                    {!ele?.isRemark && (
                      <Tooltip label={ele?.Remark}>
                        <span
                          id={`remark-${index}`}
                          target={`remark-${index}`}
                          style={{ textAlign: "center" }}
                        >
                          {shortenName(ele?.Remark)}
                        </span>
                      </Tooltip>
                    )}
                    <div className="d-flex align-items-center justify-content-between">
                      <i
                        className="fa fa-eye mr-2"
                        onClick={() => handleIconClick(ele, index)}
                        style={{ cursor: "pointer" }}
                      ></i>
                      {ele?.isRemark && (
                        <>
                          <Input
                            type="text"
                            className="form-control"
                            id="Remark"
                            name="Remark"
                            label="Remark"
                            max={20}
                            onChange={(name, e) =>
                              handleSelectChange(name, e, index)
                            }
                            value={ele?.Remark}
                            respclass="width100px"
                          />
                          <button
                            className="btn btn-xs btn-success ml-2"
                            onClick={() => updateRemark(ele)}
                          >
                            {t("Save")}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              }

              if (isTableVisible("Settlement")) {
                rowData.Settlement = (
                  <div style={{ backgroundColor: ele?.rowColorPayementMode }}>
                    {ele?.SettlementStatus === "Settled" ? (
                      <span style={{ color: ele?.rowColorPayementMode }}>
                        .
                      </span>
                    ) : (
                      <i
                        className="fa fa-share-square"
                        onClick={() =>
                          setVisible({ showVisible: true, showData: ele })
                        }
                        style={{
                          marginLeft: "10px",
                          color: "#3d3c3a",
                          cursor: "pointer",
                        }}
                        title="Click to Settlement."
                      ></i>
                    )}
                  </div>
                );
              }

              if (isTableVisible("Print")) {
                rowData.Print =
                  ele?.PaymentMode === "Cash" ? (
                    ""
                  ) : (
                    <i
                      className="fa fa-print"
                      style={{
                        marginLeft: "5px",
                        cursor: "pointer",
                        color: "black",
                        padding: "2px",
                        borderRadius: "3px",
                      }}
                      title="Click here to Print."
                      onClick={() =>
                        window.open(ele?.AmountSubmissionUrl, "_blank")
                      }
                    />
                  );
              }

              if (isTableVisible("Email")) {
                rowData.Email = ele?.TaxInvoiceNo !== "" && (
                  <img
                    src={gmaillogo}
                    height={"10px"}
                    onClick={() =>
                      setVisible({
                        gmailVisible: true,
                        data: ele,
                        ele,
                      })
                    }
                    title="Click to Gmail."
                    style={{ marginLeft: "12px" }}
                  />
                );
              }

              if (isTableVisible("Cancel")) {
                rowData.Cancel = (
                  <>
                    {AmountCancel == "1" && (
                      <i
                        className="fa fa-times"
                        title="Click to Remove."
                        onClick={() =>
                          setVisible({
                            removeVisible: true,
                            showData: ele,
                            ele,
                          })
                        }
                        style={{
                          marginLeft: "10px",
                          color: "red",
                          cursor: "pointer",
                        }}
                      ></i>
                    )}
                  </>
                );
              }

              // Always include row background color
              rowData.colorcode = ele?.rowColor;

              return rowData;
            })}
            tableHeight="tableHeight"
          />

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
export default SearchAmountSubmission;
