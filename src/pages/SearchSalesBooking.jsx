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
import { Link } from "react-router-dom";
import CancelSalesBookingModal from "../components/UI/customTable/CancelSalesBookingModal";
import Modal from "../components/modalComponent/Modal";
import { toast } from "react-toastify";
import Tooltip from "./Tooltip";
import CustomPagination from "../utils/CustomPagination";
import { PageSize } from "../utils/constant";
import excelimg from "../../src/assets/image/excel.png";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

import GmailTaxInvoiceModal from "../components/UI/customTable/GmailTaxInvoiceModal";
import gmaillogo from "../../src/assets/image/Gmail_Logo.png";
import GmailSalesModal from "../components/UI/customTable/GmailSalesModal";
import AmountSubmissionSeeMoreList from "../networkServices/AmountSubmissionSeeMoreList";
import SlideScreen from "./SlideScreen";
import SeeMoreSlideScreen from "../components/SearchableTable/SeeMoreSlideScreen";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import SearchLotusFilter from "./SearchLotusFilter";
import Accordion from "./Accordion";
import { useTranslation } from "react-i18next";
import { axiosInstances } from "../networkServices/axiosInstance";
const SearchSalesBooking = ({ data }) => {
  // console.log("data data", data);
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [tableData, setTableData] = useState([]);
  const [vertical, setVertical] = useState([]);
  const [project, setProject] = useState([]);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);
  const [poc1, setPoc1] = useState([]);
  const [poc2, setPoc2] = useState([]);
  const [listVisible, setListVisible] = useState(false);
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
    ExpectedPaymentDate: new Date(),
  });
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });

  /////////////////////////////////

  const SaveFilter = () => {
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
    // form.append("PageName", "SearchSalesBooking");

    // Example FilterData array

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
    // Append stringified FilterData
    // form.append("FilterData", JSON.stringify(filterData));

    // axios
    //   .post(apiUrls?.SaveFilterTableReprintData, form, { headers })

    const payload = {
      PageName: "SearchSalesBooking",
      FilterData: String(filterData),
    };
    axiosInstances
      .post(apiUrls?.SaveFilterTableReprintData, payload)
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
      { header: "POC", visible: true },
      { header: "Team", visible: true },
      { header: "Sales No.", visible: true },
      { header: "Item Name", visible: true },
      { header: "Sales Date", visible: true },
      { header: "Remark", visible: true },
      { header: "PaymentMode", visible: true },
      { header: "Net Amount", visible: true },
      { header: "Print", visible: true },
      { header: "PI", visible: true },
      { header: "Tax", visible: true },
      { header: "Entry Date", visible: true },
      { header: "EmailStatus", visible: true },
      { header: "Email", visible: true },
      { header: "Edit", visible: true },
      { header: "Cancel", visible: true },
    ];

    // Append stringified FilterData
    // form.append("FilterData", JSON.stringify(filterData));

    // axios
    //   .post(apiUrls?.SaveFilterTableReprintData, form, { headers })

    const payload = {
      CrmEmpID: String(
        useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      ),
      PageName: "SearchSalesBookingTable",
      FilterData: JSON.stringify(filterData),
    };
    axiosInstances
      .post(apiUrls?.SaveFilterTableReprintData, payload)
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
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        PageName: "SearchSalesBooking",
      })
      .then((res) => {
        const data = res.data.data;
        console.log("SearchSalesBooking", data);
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
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        PageName: "SearchSalesBookingTable",
      })
      .then((res) => {
        const data = res.data.data;
        if (res?.data?.success === true) {
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
  ///////////////////////////////////
  const ModalComponent = (name, component) => {
    console.log("name component sale..", name, component);
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
  // useEffect(() => {
  //   if (data) {
  //     const projectID = data?.Id;
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       ProjectID: [projectID],
  //     }));
  //     handleSearch("", [data?.Id]);
  //   }
  // }, [data]);

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
  };
  function capitalizeFirstLetter(sentence) {
    if (!sentence) return "";
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  const searchHandleChange = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const getVertical = () => {
    // let form = new FormData();
    // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.Vertical_Select, form, { headers })
    axiosInstances
      .post(apiUrls?.Vertical_Select, {})
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
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.Team_Select, form, { headers })
    axiosInstances
      .post(apiUrls?.Team_Select, {})
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
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.Wing_Select, form, { headers })
    axiosInstances
      .post(apiUrls?.Wing_Select, {})
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
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.POC_1_Select, form, { headers })
    axiosInstances
      .post(apiUrls?.POC_1_Select, {})
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
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.POC_2_Select, form, { headers })
    axiosInstances
      .post(apiUrls?.POC_2_Select, {})
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
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.POC_3_Select, form, { headers })
    axiosInstances
      .post(apiUrls?.POC_3_Select, {})
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
  const handleSearch = (page, project, DateType = formData?.DateType) => {
    setLoading(true);

    const payload = {
      ProjectID:
        project?.length > 0 && project !== "0"
          ? String(project) // ✅ ensure number
          : String(formData?.ProjectID),

      VerticalID: String(formData?.VerticalID),
      TeamID: String(formData?.TeamID),
      WingID: String(formData?.WingID),

      POC1: formData?.POC1 ? String(formData?.POC1) : "",
      POC2: formData?.POC2 ? String(formData?.POC2) : "",
      POC3: formData?.POC3 ? String(formData?.POC3) : "",

      Status: formData?.Status ? String(formData?.Status) : "",

      DateType: String(formData?.DateType),
      FromDate: formatDate(formData?.FromDate),
      ToDate: formatDate(formData?.ToDate),

      SearchType: "OnScreen", // always string
      PageSize: Number(formData?.PageSize),
      PageNo: page != null ? Number(page) : Number(currentPage - 1),

      // extra fields
      Centre: "testing22", // ✅ string
      ActionType: "InsertCentre", // ✅ string
      IsExcel: 0,
    };

    axiosInstances
      .post(apiUrls?.Payment_Installment_Search, payload)
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
  const shortenName = (name) => {
    return name.length > 15 ? name.substring(0, 25) + "..." : name;
  };
  const handleExcel = (page) => {
    setLoading(true);

    const payload = {
      ProjectID: formData?.ProjectID ? Number(formData?.ProjectID) : 0,
      VerticalID: formData?.VerticalID ? Number(formData?.VerticalID) : 0,
      TeamID: formData?.TeamID ? Number(formData?.TeamID) : 0,
      WingID: formData?.WingID ? Number(formData?.WingID) : 0,

      POC1: formData?.POC1 ? String(formData?.POC1) : "",
      POC2: formData?.POC2 ? String(formData?.POC2) : "",
      POC3: formData?.POC3 ? String(formData?.POC3) : "",

      Status: formData?.Status ? String(formData?.Status) : "",

      DateType: formData?.DateType ? String(formData?.DateType) : "",
      FromDate: formData?.FromDate ? formatDate(formData?.FromDate) : "",
      ToDate: formData?.ToDate ? formatDate(formData?.ToDate) : "",

      SearchType: "OnScreen",
      IsExcel: 1,
      PageSize: formData?.PageSize ? Number(formData?.PageSize) : 10,
      PageNo: page ? Number(currentPage - 1) : 0,
    };

    axiosInstances
      .post(apiUrls?.Quotation_Search, payload)
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
        const excelBuffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "array",
        });
        const data = new Blob([excelBuffer], { type: fileType });

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

  const [visible, setVisible] = useState({
    showVisible: false,
    removeVisible: false,
    gmailVisible: false,
    showData: {},
  });

  const handleGenerate = (ele) => {
    axiosInstances
      .post(apiUrls.SalesBooking_GeneratePI, {
        SalesID: String(ele),
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("SalesID", ele),
      //   axios
      //     .post(apiUrls?.SalesBooking_GeneratePI, form, { headers })
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
  const handleRequested = (ele) => {
    axiosInstances
      .post(apiUrls.SalesBooking_GenerateTax, {
        SalesID: String(ele),
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("SalesID", ele),
      //   axios
      //     .post(apiUrls?.SalesBooking_GenerateTax, form, { headers })
      // axiosInstances
      //   .post(apiUrls?.SalesBooking_GenerateTax, {})
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

  // const handleSalesId = () => {
  //   let form = new FormData();
  //   form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
  //     form.append(
  //       "LoginName",
  //       useCryptoLocalStorage("user_Data", "get", "realname")
  //     ),
  //     form.append("SalesID", tableData[0]?.EncryptID),
  //     axios
  //       .post(apiUrls?.SalesBooking_Load_SalesID, form, { headers })
  //       .then((res) => {
  //         toast.success(res?.data?.message);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  // };

  useEffect(() => {
    // handleSalesId()
  }, []);

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
    });
  };

  const TaxInvoiceStatus = ""; // Replace with actual value
  const TaxInvoiceNo = "";
  const renderButton = (TaxInvoiceStatus, TaxInvoiceNo) => {
    if (TaxInvoiceStatus === 0) {
      return <button>Generate</button>;
    } else if (TaxInvoiceStatus === 1 && TaxInvoiceNo === "") {
      return <button>Requested</button>;
    } else if (TaxInvoiceStatus === 1 && TaxInvoiceNo !== "") {
      return <button>Save</button>;
    }
    return null; // Default case if no conditions are met
  };

  useEffect(() => {
    if (!data?.type) return; // Ensure the effect runs only when data.type exists

    let updatedFormData = {};

    switch (data?.type) {
      case "AgeingSheet":
        updatedFormData = {
          ...updatedFormData, // Preserve existing data
          DateType: updatedFormData.DateType || "ApprovedDate", // Retain previous DateType or set default
        };
        handleSearch("", "", updatedFormData.DateType); // Pass the updated DateType
        break;

      case "LedgerStatus":
        const projectID = data?.ProjectID || data?.Id;
        updatedFormData = {
          ProjectID: [data?.ProjectID || data?.Id],
        };
        handleSearch("", [data?.ProjectID || data?.Id]);
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

  //////////////////////////

  const staticHeaders = [
    "S.No",
    "Project Name",
    "POC",
    "Team",
    "Sales No.",
    "Item Name",
    "Sales Date",
    "Remark",
    "PaymentMode",
    "Net Amount",
    "Print",
    "PI",
    "Tax",
    "Entry Date",
    "EmailStatus",
    "Email",
    "Edit",
    "Cancel",
  ];

  const salesSearchThead = staticHeaders
    .filter((header) =>
      isTableVisible(typeof header === "string" ? header : header.name)
    )
    .map((header) =>
      typeof header === "string"
        ? header
        : { name: header.name, width: header.width }
    );
  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header="Cancel Sales"
        >
          <CancelSalesBookingModal
            visible={visible}
            setVisible={setVisible}
            edit={true}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      {visible?.gmailVisible && (
        <Modal
          modalWidth={"1000px"}
          visible={visible}
          setVisible={setVisible}
          Header="Sales Email Details"
        >
          <GmailSalesModal
            visible={visible}
            setVisible={setVisible}
            edit={true}
          />
        </Modal>
      )}
      {data?.type === "LedgerStatus" && (
        <div className="card  p-2">
          <span style={{ fontWeight: "bold" }}>
            Project Name : {data?.NAME || data?.ProjectName}
          </span>
        </div>
      )}
      <div className="card">
        <Heading
          title={
            <div className="d-flex">
              <span style={{ fontWeight: "bold" }}>
                {t("View Sales Booking")}
              </span>
              <div className="d-flex">
                <span className="ml-4" style={{ fontWeight: "bold" }}>
                  {t("Search Filter Details")}{" "}
                </span>
                <span className="header ml-1" style={{ cursor: "pointer" }}>
                  <SearchLotusFilter
                    columnConfig={dynamicFilter}
                    setColumnConfig={setDynamicFilter}
                    PageName="SearchSalesBooking"
                  />
                </span>
              </div>
            </div>
          }
          secondTitle={
            <div style={{ fontWeight: "bold" }}>
              <Link to="/SalesBooking" className="ml-3">
                Back to SalesBooking
              </Link>
            </div>
          }
        />
        <div className="row m-2">
          {isVisible("ProjectID") && (
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

          {isVisible("DateType") && (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="DateType"
              placeholderName="Date Type"
              dynamicOptions={[
                { label: "SalesDate", value: "SalesDate" },
                { label: "EntryDate", value: "EntryDate" },
                { label: "ApproveDate", value: "ApproveDate" },
                { label: "FollowupDate", value: "FollowupDate" },
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
          {/* <DatePicker
                className="custom-calendar"
                id="ExpectedPaymentDate"
                name="ExpectedPaymentDate"
                lable="Expected Payment Date"
                placeholder={VITE_DATE_FORMAT}
                value={formData?.ExpectedPaymentDate}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-0"
                handleChange={searchHandleChange}
              /> */}
          {isVisible("Status") && (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="Status"
              placeholderName="Status"
              dynamicOptions={[
                { label: "All", value: "0" },
                { label: "FOC", value: "1" },
                { label: "Partial Paid", value: "2" },
                { label: "Full Paid", value: "3" },
                { label: "UnPaid", value: "4" },
              ]}
              handleChange={handleDeliveryChange}
              value={formData.Status}
              requiredClassName={"required-fields"}
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
          <div className="ml-2">
            {loading ? (
              <Loading />
            ) : (
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleSearch(undefined, "0")}
              >
                Search
              </button>
            )}{" "}
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
                        PageName="SearchSalesBookingTable"
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
                      PageName="SearchSalesBookingTable"
                    />
                  </span>
                </div>
              </div>
            }
            secondTitle={
              <div style={{ fontWeight: "bold" }}>
                <span className="mr-4">
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
          {console.log("salesSearchTheadsalesSearchThead", salesSearchThead)}
          <Tables
            thead={salesSearchThead}
            tbody={currentData
              ?.map((ele, index) => {
                const fullRow = {
                  "S.No": (
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
                        {ele?.PINo == "" ? (
                          ""
                        ) : (
                          <span className="ledger-span">
                            <AmountSubmissionSeeMoreList
                              ModalComponent={ModalComponent}
                              setSeeMore={setSeeMore}
                              isShowDropDown={false}
                              data={ele}
                              setVisible={() => {
                                setListVisible(false);
                              }}
                              handleBindFrameMenu={[
                                {
                                  FileName: "FollowUp Status",
                                  URL: "FollowupStatus",
                                  FrameName: "FollowupStatus",
                                  Description: "FollowupStatus",
                                },
                              ]}
                              isShowPatient={true}
                            />
                          </span>
                        )}
                      </div>
                    </>
                  ),
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
                  POC: ele?.POC_1_Name,
                  Team: ele?.Team,
                  "Sales No.": (
                    <>
                      <Tooltip label={ele?.ActualSalesNo}>
                        <span
                          id={`projectName-${index}`}
                          targrt={`projectName-${index}`}
                          style={{ textAlign: "center" }}
                        >
                          {shortenName(ele?.SalesNo)}
                        </span>
                      </Tooltip>
                    </>
                  ),
                  "Item Name": (
                    <>
                      <Tooltip label={ele?.ItemName}>
                        <span
                          id={`projectName-${index}`}
                          targrt={`projectName-${index}`}
                          style={{ textAlign: "center" }}
                        >
                          {shortenName(ele?.ItemName)}
                        </span>
                      </Tooltip>
                    </>
                  ),
                  "Sales Date": ele?.SalesDate,
                  Remark: (
                    <>
                      <Tooltip label={capitalizeFirstLetter(ele?.Remark)}>
                        <span
                          id={`projectName-${index}`}
                          targrt={`projectName-${index}`}
                          style={{ textAlign: "center" }}
                        >
                          {capitalizeFirstLetter(shortenName(ele?.Remark))}
                        </span>
                      </Tooltip>
                    </>
                  ),
                  PaymentMode: ele?.PaymentMode,
                  "Net Amount": ele?.NetAmount,
                  Print: ele?.PINo > 0 && (
                    <i
                      className="fa fa-print"
                      style={{
                        marginLeft: "5px",
                        cursor: "pointer",
                        color: "black",
                        padding: "2px",
                        borderRadius: "3px",
                      }}
                      onClick={() => window.open(ele?.PIURL, "_blank")}
                    ></i>
                  ),

                  PI:
                    ele?.PINo == "" ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleGenerate(ele?.EncryptID)}
                      >
                        Generate
                      </button>
                    ) : (
                      <Link
                        style={{ cursor: "pointer" }}
                        onClick={() => window.open(ele?.PIURL, "_blank")}
                      >
                        <Tooltip label={ele?.ActualPINo}>
                          <span
                            id={`projectName-${index}`}
                            targrt={`projectName-${index}`}
                            style={{ textAlign: "center" }}
                          >
                            {shortenName(ele?.PINo)}
                          </span>
                        </Tooltip>
                      </Link>
                    ),
                  Tax: (
                    <>
                      {ele?.TaxInvoiceStatus === 0 && (
                        <button
                          className="btn btn-sm btn-primary"
                          style={{
                            color: "white",
                          }}
                          onClick={() => handleRequested(ele?.EncryptID)}
                        >
                          Generate
                        </button>
                      )}
                      {ele?.TaxInvoiceStatus === 1 &&
                        ele?.TaxInvoiceNo == "" && (
                          <button className="btn btn-sm btn-primary">
                            Requested
                          </button>
                        )}

                      {ele?.TaxInvoiceStatus === 1 &&
                        ele?.TaxInvoiceNo !== "" && (
                          <Link
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              window.open(ele?.TaxInvoiceURL, "_blank")
                            }
                          >
                            <Tooltip label={ele?.TaxInvoiceNo}>
                              <span
                                id={`projectName-${index}`}
                                targrt={`projectName-${index}`}
                                style={{ textAlign: "center" }}
                              >
                                {shortenName(ele?.TaxInvoiceNo)}
                              </span>
                            </Tooltip>
                          </Link>
                        )}
                    </>
                  ),
                  "Entry Date": ele?.dtEntry,
                  EmailStatus: ele?.EmailStatus,
                  Email: ele?.PINo > 0 && (
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
                      style={{ marginLeft: "12px" }}
                    ></img>
                  ),
                  Edit: (
                    <Link
                      to="/SalesBooking"
                      state={{
                        data: ele?.EncryptID,
                        edit: true,
                        givenData: ele,
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      Edit
                    </Link>
                  ),
                  Cancel: (
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
                  ),
                  colorcode: ele?.rowColor,
                };

                const visibleHeaders = salesSearchThead.map((h) =>
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

                return fullRow;
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

export default SearchSalesBooking;
