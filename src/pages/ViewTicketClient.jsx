import React, { useEffect, useRef, useState } from "react";
import Heading from "../components/UI/Heading";
import { toast } from "react-toastify";
import { apiUrls } from "../networkServices/apiEndpoints";
import { useTranslation } from "react-i18next";
import DatePicker from "../components/formComponent/DatePicker";
import ReactSelect from "../components/formComponent/ReactSelect";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import Loading from "../components/loader/Loading";
import Input from "../components/formComponent/Input";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import { PageSize } from "../utils/constant";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import ViewIssueDocTable from "../components/UI/customTable/ViewIssueDocTable";
import ViewIssueNotesModal from "../components/UI/customTable/ViewIssueNotesModal";
import ViewIssueDocModal from "../components/UI/customTable/ViewIssueDocModal";
import ClientViewIssueModal from "../components/UI/customTable/ClientViewIssueModal";
import Tables from "../components/UI/customTable";
import { Link, useLocation } from "react-router-dom";
import Tooltip from "./Tooltip";
import CustomPagination from "../utils/CustomPagination";
import Modal from "../components/modalComponent/Modal";
import { axiosInstances } from "../networkServices/axiosInstance";
const ViewTicketClient = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [priority, setPriority] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [project, setProject] = useState([]);
  const [assignto, setAssignedto] = useState([]);
  const [category, setCategory] = useState([]);
  const [status, setStatus] = useState([]);
  const [reopen, setReOpen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const location = useLocation();
  const [showSelect, setShowSelect] = useState(null);
  const roleStatus = useCryptoLocalStorage("user_Data", "get", "RoleID");
  const [formData, setFormData] = useState({
    PageNo: "",
    PageSize: 50,
    SubmitDate: "",
    DeliveryDate: "",
    ClientDeliveryDate: "",
    ResolveDate: "",
    CloseDate: "",
    UpadteDate: "",
    ManHourDropdown: "",
    ClientManHourDropdown: "",
    OnlyReOpen: "",
    SubmitDateBefore: new Date(),
    SubmitDateAfter: new Date(),
    SubmitDateCurrent: new Date(),

    DeliveryDateBefore: new Date(),
    DeliveryDateAfter: new Date(),
    DeliveryDateCurrent: new Date(),

    ClientDeliveryDateBefore: new Date(),
    ClientDeliveryDateAfter: new Date(),
    ClientDeliveryDateCurrent: new Date(),

    ManHourBefore: "",
    ManHourAfter: "",
    ManHourCurrent: "",

    ClientManHourBefore: "",
    ClientManHourAfter: "",
    ClientManHourCurrent: "",

    ResolveDateBefore: new Date(),
    ResolveDateAfter: new Date(),
    ResolveDateCurrent: new Date(),

    CloseDateBefore: new Date(),
    CloseDateAfter: new Date(),
    CloseDateCurrent: new Date(),

    UpadteDateBefore: new Date(),
    UpadteDateAfter: new Date(),
    UpadteDateCurrent: new Date(),

    ProjectID: [],
    VerticalID: [],
    TeamID: [],
    WingID: [],
    POC1: [],
    POC2: [],
    POC3: [],
    Reporter: [],
    AssignedTo: [],
    AssignedToStatus: "",
    MoveStatus: "",
    UpdateToStatus: "",
    UpdateToCategory: "",
    DeliveryToStatus: "",
    Priority: "",
    Category: [],
    HideStatus: "80" ? "80" : "1",
    Status: "1" ? "1" : "70",
    TableStatus: "",
    IsActive: "",
    RefereRCA: "",
    RefereCode: "",
    ManHours: "",
    ManHour: "",
    Hold: "",
    Ticket: "",
    summary: "",
    ModuleName: "",
    PagesName: "",
    SearhType: "0",
    ReOpen: "",
    ResolveDate: "",
    OnlyDelay: "",
  });
  const AllowAssign = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowTicketAssignTo"
  );
  const AllowDeleteTicket = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowDeleteTicket"
  );
  // const tdRefs = useRef([]);
  // useEffect(() => {
  //   if (tdRefs?.current[selectedRowIndex]) {
  //     tdRefs?.current[selectedRowIndex]?.scrollIntoView({
  //       behavior: "smooth",
  //       block: "center",
  //       inline: "nearest",
  //     });
  //   }
  // }, [selectedRowIndex]);

  const handleSaveFilter = () => {
    localStorage.setItem("formData", JSON.stringify(formData));
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    axiosInstances
      .post(apiUrls.SaveFilterData, {
        FilterData: String(savedData),
        Type: String(""),
      })
      .then((res) => {
        toast.success(res?.data?.message);
        handleGetFilter();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleGetFilter = () => {
    axiosInstances
      .post(apiUrls.SearchFilterData, {
        Type: String(""),
      })
      .then((res) => {
        if (res?.data) {
          let data = res?.data;

          setFormData((val) => ({
            ...val,
            VerticalID: res?.data?.VerticalID,
            TeamID: data?.TeamID || "",
            ProjectID: data?.ProjectID || "",
            WingID: data?.WingID || "",
            PageSize: data?.PageSize || "",
            POC1: data?.POC1 || "",
            POC2: data?.POC2 || "",
            POC3: data?.POC3 || "",
            Reporter: data?.Reporter || "",
            AssignedTo: data?.AssignedTo || "",
            Category: data?.Category || "",
            Priority: data?.Priority || "",
            HideStatus: data?.HideStatus || "",
            Status: data?.Status || "",
            SearhType: data?.SearhType || "",
            OnlyReOpen: data?.OnlyReOpen || "",
            OnlyDelay: data?.OnlyDelay || "",
            ClientManHourDropdown: data?.ClientManHourDropdown || "",
            ManHourDropdown: data?.ManHourDropdown || "",
            ClientDeliveryDate: data?.ClientDeliveryDate || "",
            SubmitDate: data?.SubmitDate || "",
            DeliveryDate: data?.DeliveryDate || "",
            ResolveDate: data?.ResolveDate || "",
            CloseDate: data?.CloseDate || "",
            UpadteDate: data?.UpadteDate || "",
            Ticket: data?.Ticket || "",
          }));
        } else {
          console.error("No data found in the response.");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };

  const handleClick = (clickedIndex) => {
    setShowSelect((prev) => (prev === clickedIndex ? null : clickedIndex));
  };

  const handleReset = () => {
    setFormData({
      ...formData,
      PageNo: "",
      PageSize: 50,
      SubmitDate: "",
      DeliveryDate: "",
      ClientDeliveryDate: "",
      ResolveDate: "",
      CloseDate: "",
      UpadteDate: "",
      ManHourDropdown: "",
      ClientManHourDropdown: "",
      OnlyReOpen: "",
      OnlyDelay: "",
      SubmitDateBefore: new Date(),
      SubmitDateAfter: new Date(),
      SubmitDateCurrent: new Date(),

      DeliveryDateBefore: new Date(),
      DeliveryDateAfter: new Date(),
      DeliveryDateCurrent: new Date(),

      ClientDeliveryDateBefore: new Date(),
      ClientDeliveryDateAfter: new Date(),
      ClientDeliveryDateCurrent: new Date(),

      ManHourBefore: "",
      ManHourAfter: "",
      ManHourCurrent: "",

      ClientManHourBefore: "",
      ClientManHourAfter: "",
      ClientManHourCurrent: "",

      ResolveDateBefore: new Date(),
      ResolveDateAfter: new Date(),
      ResolveDateCurrent: new Date(),

      CloseDateBefore: new Date(),
      CloseDateAfter: new Date(),
      CloseDateCurrent: new Date(),

      UpadteDateBefore: new Date(),
      UpadteDateAfter: new Date(),
      UpadteDateCurrent: new Date(),

      ProjectID: [],
      VerticalID: [],
      TeamID: [],
      WingID: [],
      POC1: [],
      POC2: [],
      POC3: [],
      Reporter: [],
      AssignedTo: [],
      AssignedToStatus: "",
      MoveStatus: "",
      UpdateToStatus: "",
      UpdateToCategory: "",
      DeliveryToStatus: "",
      Priority: "",
      Category: [],
      HideStatus: "80" ? "80" : "1",
      Status: "1" ? "1" : "70",
      TableStatus: "",
      IsActive: "",
      RefereRCA: "",
      RefereCode: "",
      ManHours: "",
      ManHour: "",
      Hold: "",
      Ticket: "",
      summary: "",
      ModuleName: "",
      PagesName: "",
      SearhType: "0",
    });
  };

  const searchHandleChange = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const getPriority = () => {
    axiosInstances
      .post(apiUrls.Priority_Select, {})
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setPriority(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAssignTo = () => {
    axiosInstances
      .post(apiUrls.AssignTo_Select, {
        ProjectID: 0,
      })
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { name: item?.Name, code: item?.ID };
        });
        setAssignedto(assigntos);
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
        const datas = res?.data?.data;
        console.log("daysta", datas);
        const poc3s = datas?.map((item) => ({
          name: item?.Project,
          code: item?.ProjectId,
        }));

        setProject(poc3s);

        if (datas.length > 0) {
          const singleProject = datas[0]?.ProjectId;
          setFormData((prev) => ({
            ...prev,
            ProjectID: [singleProject],
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleViewSearch = (code, page) => {
    axiosInstances
      .post(apiUrls.ViewIssueSearchClient, {
        RoleID:
          Number(useCryptoLocalStorage("user_Data", "get", "RoleID")) || 0,
        ProjectID: formData?.ProjectID ? String(formData?.ProjectID) : "",
        AssignToID: formData?.AssignedTo ? String(formData?.AssignedTo) : "",
        PriorityId: formData?.Priority ? String(formData?.Priority) : "",
        CategoryID: formData?.Category ? String(formData?.Category) : "",
        HideStatusId: formData?.HideStatus ? String(formData?.HideStatus) : "",
        StatusId: formData?.Status ? String(formData?.Status) : "",
        rowColor: code ? String(code) : "0",
        SubmittedDateStatus: formData?.SubmitDate
          ? String(formData?.SubmitDate)
          : "",
        DateFromSubmitted: formatDate(formData?.SubmitDateBefore) || "",
        DateToSubmitted: formatDate(formData?.SubmitDateAfter) || "",
        DeliveryDateStatus: formData?.ClientDeliveryDate
          ? String(formData?.ClientDeliveryDate)
          : "",
        DeliveryFromDate: formatDate(formData?.ClientDeliveryDateBefore) || "",
        Deliverytodate: formatDate(formData?.ClientDeliveryDateAfter) || "",
        LastUpdateDateStatus: formData?.UpadteDate
          ? String(formData?.UpadteDate)
          : "",
        LastUpdatedFromDate: formatDate(formData?.UpadteDateBefore) || "",
        LastUpdatedToDate: formatDate(formData?.UpadteDateAfter) || "",
        ClosedDateStatus: formData?.CloseDate
          ? String(formData?.CloseDate)
          : "",
        ClosedFromDate: formatDate(formData?.CloseDateBefore) || "",
        Closedtodate: formatDate(formData?.CloseDateAfter) || "",
        PageNo: Number(page ?? currentPage - 1) || 1,
        PageSize: Number(formData?.PageSize) || 0,
        IsExcel: Number(formData?.SearhType) || 0,
        OnlyReOpen: Number(formData?.OnlyReOpen) || 0,
        OnlyDelay: Number(formData?.OnlyDelay) || 0,
        Ticket: formData?.Ticket ? String(formData?.Ticket) : "",
      })
      .then((res) => {
        const data = res?.data?.data;

        if (res?.data?.success === true) {
          if (formData?.SearhType == 0) {
            if (data?.length == 0) {
              setShownodata(true);
            }

            const updatedData = data?.map((ele, index) => ({
              ...ele,
              IsActive: false,
              MoveDropDown: "",
              MoveResolve: false,
              MoveDropDownValue: "",
              AssignDropDown: "",
              AssignResolve: false,
              AssignDropDownValue: "",
              UpdateStatusDropdown: "",
              UpdateStatusResolve: false,
              UpdateStatusValue: "",
              ReOpenValue: "",
              UpdateCategoryDropdown: "",
              UpdateCategoryResolve: false,
              UpdateCategoryValue: "",
              UpdatedeliverydateDropdown: "",
              UpdatedeliverydateResolve: false,
              UpdatedeliverydateValue: "",
              CloseDropdown: "",
              CloseResolve: "",
              index: index,
              isDate: false,
              isClientDate: false,
              isManHour: false,
              isClientManHour: false,
              isCategory: false,
              isAssignTo: false,
              isStatus: false,
              isProject: false,
              isSummary: false,
            }));

            setTableData(updatedData);
            setFilteredData(updatedData);
            //  tdRefs.current[0] = updatedData?.[0]?.index;
            //   setSelectedRowIndex(updatedData?.[0]?.index);
            // setSelectedRowIndex(index);
          } else if (formData?.SearhType == 1) {
            if (!data || data.length === 0) {
              console.error("No data available for download.");
              alert("No data available for download.");
              return;
            }

            setLoading(false);
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
            const titleRow = [[`${username} - ${currentDate} ${currentTime}`]];
            const ws = XLSX.utils.json_to_sheet(data, { origin: "A2" });
            XLSX.utils.sheet_add_aoa(ws, titleRow, { origin: "A1" });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Data");
            const excelBuffer = XLSX.write(wb, {
              bookType: "xlsx",
              type: "array",
            });
            const fileData = new Blob([excelBuffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
            });

            FileSaver.saveAs(
              fileData,
              `${username}_${currentDate}_${currentTime}.xlsx`
            );
          } else if (formData?.SearhType == 2) {
            if (!data || data.length === 0) {
              console.error("No data available for download.");
              alert("No data available for download.");
              return;
            }
            setLoading(false);

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
            const titleRow = [[`${username} - ${currentDate} ${currentTime}`]];
            const ws = XLSX.utils.json_to_sheet(data, { origin: "A2" });
            XLSX.utils.sheet_add_aoa(ws, titleRow, { origin: "A1" });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Data");
            const excelBuffer = XLSX.write(wb, {
              bookType: "xlsx",
              type: "array",
            });
            const fileData = new Blob([excelBuffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
            });

            FileSaver.saveAs(
              fileData,
              `${username}_${currentDate}_${currentTime}.xlsx`
            );
          }

          setLoading(false);
        } else {
          toast.error(res.data.message);
          setTableData([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "No Record Found"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const THEAD = [
    t("S.No."),
    t("Notes"),
    t("Attach"),
    t("Select"),
    t("Ticket ID"),
    t("Project Name"),
    t("Category Name"),
    t("Reporter Name"),
    t("Assign To"),
    t("Reported By Name"),
    t("Machine Reference No."),
    t("Summary"),
    t("Status"),
    t("Submit Date"),
    t("Resolve Date"),
    t("Action"),
    t("DeliveryDate"),
    t("ManMinutes"),
    t("ModuleName"),
    t("PageName"),
  ];
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
  let baseRow = {};
  const getCategory = () => {
    axiosInstances
      .post(apiUrls.Category_Select, {
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
        ProjectID: 0,
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { name: item?.NAME, code: item?.NAME };
        });
        setCategory(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getStatus = () => {
    axiosInstances
      .post(apiUrls.Status_Select, {})
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return {
            label: item?.STATUS,
            value: item?.id !== undefined ? item?.id : null,
          };
        });
        setStatus(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "ManHours") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleCheckBox = (e) => {
    const { name, checked, type } = e?.target;
    const checkBoxValue = checked ? 1 : 0;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checkBoxValue : value,
    });
  };

  const getReopen = () => {
    axiosInstances
      .post(apiUrls.Reason_Select, {
        Title: "ReOpenReason",
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setReOpen(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [visible, setVisible] = useState({
    showVisible: false,
    docVisible: false,
    noteVisible: false,
    docViewVisible: false,
    showData: {},
  });

  useEffect(() => {
    if (
      Array.isArray(location.state?.data) &&
      location.state?.data.length > 0 &&
      location.state?.data[0]?.Id > 0
    ) {
      setVisible({
        showVisible: true,
        showData: { ...location.state?.data[0], flag: true },
      });
    }
  }, [location.state?.data]);

  const handleResolveElementClose = (item) => {
    axiosInstances
      .post(apiUrls.ApplyActionClient, {
        TicketIDs: String(item?.TicketID),
        ActionText: "Close",
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleViewSearch();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const dynamicOptionStatus = [
    {
      label: "Close",
      value: "Close",
    },
    {
      label: "ReOpen",
      value: "ReOpen",
    },
    {
      label: "Resolve",
      value: "Resolve",
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const totalRecords =
    tableData?.length > 0 ? parseInt(tableData[0]?.TotalRecord) : 0;
  const totalPages = Math.ceil(totalRecords / (formData?.PageSize || 10));
  const currentData = tableData;
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    handleViewSearch(undefined, newPage - 1);
  };
  const handleDeliveryChangeCheckbox = (e, index) => {
    const { checked } = e.target;
    const data = [...tableData];
    data[index]["IsActive"] = checked;
    setTableData(data);
  };
  const shortenNamesummary = (name) => {
    return name?.length > 20 ? name?.substring(0, 15) + "..." : name;
  };
  const handleDeliveryChangeValue = (name, value, ind, page, ele) => {
    let index = 0;

    tableData?.map((val, ind) => {
      if (val?.TicketID !== ele?.TicketID) {
        val["TableStatus"] = null;
      } else {
        index = ind;
      }
      return val;
    });
    if (name == "ReOpenValue") {
      const data = [...tableData];
      data[index][name] = value;
      setTableData(data);
    } else {
      const data = [...tableData];
      data[index][name] = value;
      setTableData(data);
    }

    if (name === "TableStatus" && value === "Close") {
      handleResolveElementClose(ele);
    }
    if (name === "TableStatus" && value === "Resolve") {
      updateReceivedDate(ele);
    }
  };
  const handleAgainChange = (name, value, index, ele) => {
    let updatedData = [...tableData];
    updatedData[index][name] = value;
    setTableData(updatedData);

    if (name === "ReOpenValue") {
      getApplyActionReason(
        {
          label: value?.label,
          value: value.value,
        },
        index
      );
    }
  };
  const handleDelete = () => {
    const filterdata = tableData?.filter((item) => item?.IsActive == true);
    const ticketIDs = filterdata?.map((item) => item?.TicketID).join(",");
    axiosInstances
      .post(apiUrls.DeleteTicket, {
        TicketIDs: Number(ticketIDs),
      })
      .then((res) => {
        toast.success(res?.data?.message);
        handleViewSearch();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getApplyActionReason = (data, index, ele) => {
    axiosInstances
      .post(apiUrls.ApplyAction, {
        TicketIDs: String(tableData[index]?.TicketID),
        ActionText: "ReOpen",
        ActionId: "",
        RCA: "",
        ReferenceCode: "",
        ManHour: "",
        Summary: "",
        ModuleID: "",
        ModuleName: "",
        PagesID: "",
        PagesName: "",
        ManHoursClient: "",
        DeliveryDateClient: "",
        ReOpenReasonID: String(data?.value),
        ReOpenReason: String(data?.label),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleViewSearch();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateReceivedDate = (details) => {
    axiosInstances
      .post(apiUrls.ApplyAction, {
        TicketIDs: String(details?.TicketID),
        ActionText: "ResolveDate",
        ActionId: String(new Date().toISOString().split("T")[0]),
        RCA: "",
        ReferenceCode: "",
        ManHour: "",
        Summary: "",
        ModuleID: "",
        ModuleName: "",
        PagesID: "",
        PagesName: "",
        ManHoursClient: "",
        DeliveryDateClient: "",
        ReOpenReasonID: String(""),
        ReOpenReason: String(""),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleViewSearch();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function getTotalRecord(tableData) {
    let totalRecord = 0;
    if (tableData && Array.isArray(tableData)) {
      const filteredData = tableData.filter(
        (item) => item.StatusID !== 65 && item.StatusID !== 66
      );
      totalRecord = filteredData.length;
    }
    return totalRecord;
  }

  const total = getTotalRecord(tableData);

  useEffect(() => {
    getPriority();
    getCategory();
    getStatus();
    getProject();
    getAssignTo();
    getReopen();
    // handleGetFilter();
  }, []);
  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"1100px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("View Issues Detail")}
          tableData={currentData}
          setTableData={setTableData}
        >
          <ClientViewIssueModal
            visible={visible}
            setVisible={setVisible}
            tableData={currentData}
            setTableData={setTableData}
            handleViewSearch={handleViewSearch}
          />
        </Modal>
      )}

      {visible?.docVisible && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header="Upload Documents"
        >
          <ViewIssueDocModal
            visible={visible}
            setVisible={setVisible}
            handleViewSearch={handleViewSearch}
          />
        </Modal>
      )}
      {visible?.noteVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Notes Details"
        >
          <ViewIssueNotesModal
            visible={visible}
            setVisible={setVisible}
            handleViewSearch={handleViewSearch}
          />
        </Modal>
      )}
      {visible?.docViewVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="View Documents"
        >
          <ViewIssueDocTable
            visible={visible}
            setVisible={setVisible}
            handleViewSearch={handleViewSearch}
          />
        </Modal>
      )}

      <div className="card">
        <Heading
          title={<span style={{ fontWeight: "bold" }}>{t("View Issues")}</span>}
          isBreadcrumb={true}
          secondTitle={
            <div className="row g-4">
              <div
                className="d-flex flex-wrap align-items-center"
                style={{ marginRight: "10px" }}
              >
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
                      backgroundColor: "#FFC0CB",
                      borderColor: "#FFC0CB",
                      cursor: "pointer",
                      height: "12px",
                      width: "18px",
                      borderRadius: "50%",
                      marginLeft: "4px",
                    }}
                    onClick={() => handleViewSearch("10", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("New")}
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
                      backgroundColor: "#e3b73b",
                      borderColor: "#e3b73b",
                      height: "11px",
                      width: "15px",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    onClick={() => handleViewSearch("20", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("Feedback")}
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
                      backgroundColor: "#ffcde5",
                      cursor: "pointer",
                      height: "11px",
                      width: "15px",
                      borderRadius: "50%",
                    }}
                    onClick={() => handleViewSearch("30", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("Acknowledged")}
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
                    style={{
                      backgroundColor: "#C2Dfff",
                      cursor: "pointer",
                      height: "11px",
                      width: "15px",
                      marginLeft: "5px",
                      borderRadius: "50%",
                    }}
                    onClick={() => handleViewSearch("50", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("Assigned")}
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
                      backgroundColor: "#44E3AA",
                      cursor: "pointer",
                      height: "11px",
                      width: "14px",
                      borderRadius: "50%",
                    }}
                    onClick={() => handleViewSearch("70", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("Done on UAT")}
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
                      backgroundColor: "#f5d79d",
                      cursor: "pointer",
                      height: "11px",
                      width: "14px",
                      borderRadius: "50%",
                    }}
                    onClick={() => handleViewSearch("71", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("Tested on UAT")}
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
                      backgroundColor: "#bbfade",
                      cursor: "pointer",
                      height: "11px",
                      width: "14px",
                      borderRadius: "50%",
                    }}
                    onClick={() => handleViewSearch("72", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("Tested on Live")}
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
                    style={{
                      backgroundColor: "#d2f5b0",
                      cursor: "pointer",
                      height: "11px",
                      width: "15px",
                      borderRadius: "50%",
                      marginLeft: "5px",
                    }}
                    onClick={() => handleViewSearch("80", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("Resolved")}
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
                    style={{
                      backgroundColor: "#c9ccc4",
                      cursor: "pointer",
                      height: "10px",
                      width: "14px",
                      borderRadius: "50%",
                      marginLeft: "4px",
                    }}
                    onClick={() => handleViewSearch("90", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("AutoClosed")}
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
                    style={{
                      backgroundColor: "#f77777",
                      cursor: "pointer",
                      height: "10px",
                      width: "13px",
                      borderRadius: "50%",
                      marginLeft: "4px",
                    }}
                    onClick={() => handleViewSearch("100", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("ManuallyClosed")}
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
                    style={{
                      backgroundColor: "#fff000",
                      cursor: "pointer",
                      height: "11px",
                      width: "18px",
                      borderRadius: "50%",
                      marginLeft: "4px",
                    }}
                    onClick={() => handleViewSearch("60", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
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
                    style={{
                      backgroundColor: "#fff494",
                      cursor: "pointer",
                      height: "12px",
                      width: "15px",
                      borderRadius: "50%",
                      marginLeft: "4px",
                    }}
                    onClick={() => handleViewSearch("40", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("Confirmed")}
                  </span>
                </div>
              </div>
            </div>
          }
        />

        <div className="row p-2">
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="ProjectID"
            placeholderName={t("Project")}
            dynamicOptions={project}
            handleChange={handleMultiSelectChange}
            value={formData?.ProjectID?.map((code) => ({
              code,
              name: project?.find((item) => item?.code === code)?.name,
            }))}
          />
          {AllowAssign == 1 && (
            <MultiSelectComp
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="AssignedTo"
              placeholderName={t("AssignedTo")}
              dynamicOptions={assignto}
              handleChange={handleMultiSelectChange}
              value={formData?.AssignedTo?.map((code) => ({
                code,
                name: assignto.find((item) => item.code === code)?.name,
              }))}
            />
          )}
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Priority"
            placeholderName={t("Priority")}
            dynamicOptions={priority}
            value={formData?.Priority}
            handleChange={handleDeliveryChange}
          />

          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Category"
            placeholderName={t("Category")}
            dynamicOptions={category}
            handleChange={handleMultiSelectChange}
            value={formData?.Category?.map((code) => ({
              code,
              name: category.find((item) => item.code === code)?.name,
            }))}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="HideStatus"
            placeholderName={t("HideStatus")}
            dynamicOptions={
              roleStatus == 7
                ? status?.filter(
                    (data) => data?.value != 65 && data?.value != 66
                  )
                : []
            }
            value={formData?.HideStatus}
            // defaultValue={status.find((option) => option.value === "resolved")}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Status"
            placeholderName={t("Status")}
            dynamicOptions={
              roleStatus == 7
                ? status?.filter(
                    (data) => data?.value != 65 && data?.value != 66
                  )
                : []
            }
            value={formData?.Status}
            handleChange={handleDeliveryChange}
          />
          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div>
              <ReactSelect
                placeholderName={t("Submit Date")}
                id={"SubmitDate"}
                dynamicOptions={[
                  { label: "Any", value: "0" },
                  { label: "Between", value: "2" },
                  { label: "Before", value: "4" },
                  { label: "After", value: "6" },
                  { label: "OnOrBefore", value: "3" },
                  { label: "On", value: "5" },
                  { label: "OnOrAfter", value: "7" },
                  // { label: "WithoutDeliveryDate", value: "9" },
                ]}
                searchable={true}
                lable={t("Submit Date")}
                name="SubmitDate"
                value={formData?.SubmitDate}
                className={"SubmitDate"}
                handleChange={handleDeliveryChange}
              />
            </div>
            {formData.SubmitDate == "2" && (
              <>
                <DatePicker
                  className="custom-calendar"
                  id="SubmitDateBefore"
                  name="SubmitDateBefore"
                  // lable={"Before"}
                  placeholder={VITE_DATE_FORMAT}
                  // respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
                  value={formData?.SubmitDateBefore}
                  handleChange={searchHandleChange}
                />
                <DatePicker
                  className="custom-calendar"
                  id="SubmitDateAfter"
                  name="SubmitDateAfter"
                  // lable={"After"}
                  placeholder={VITE_DATE_FORMAT}
                  // respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
                  value={formData?.SubmitDateAfter}
                  handleChange={searchHandleChange}
                />
              </>
            )}

            {formData.SubmitDate == "4" ||
            formData.SubmitDate == "5" ||
            formData.SubmitDate == "6" ||
            formData.SubmitDate == "7" ||
            formData.SubmitDate == "3" ? (
              <DatePicker
                className="custom-calendar"
                id="SubmitDateBefore"
                name="SubmitDateBefore"
                // lable={"Current"}
                placeholder={VITE_DATE_FORMAT}
                // respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                value={formData?.SubmitDateBefore}
                handleChange={searchHandleChange}
              />
            ) : (
              ""
            )}
          </div>

          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div>
              <ReactSelect
                placeholderName={t("Delivery Date")}
                id={"ClientDeliveryDate"}
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
                lable="Client Delivery Date"
                name="ClientDeliveryDate"
                value={formData?.ClientDeliveryDate}
                className={"ClientDeliveryDate"}
                handleChange={handleDeliveryChange}
              />
            </div>
            {formData.ClientDeliveryDate == "2" && (
              <>
                <DatePicker
                  className="custom-calendar"
                  id="ClientDeliveryDateBefore"
                  name="ClientDeliveryDateBefore"
                  // lable={"Before"}
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.ClientDeliveryDateBefore}
                  handleChange={searchHandleChange}
                />
                <DatePicker
                  className="custom-calendar"
                  id="ClientDeliveryDateAfter"
                  name="ClientDeliveryDateAfter"
                  // lable={"After"}
                  placeholder={VITE_DATE_FORMAT}
                  // respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
                  value={formData?.ClientDeliveryDateAfter}
                  handleChange={searchHandleChange}
                />
              </>
            )}
            {["3", "4", "5", "6", "7"].includes(formData.ClientDeliveryDate) ? (
              <DatePicker
                className="custom-calendar"
                id="ClientDeliveryDateBefore"
                name="ClientDeliveryDateBefore"
                // lable={"Current"}
                placeholder={VITE_DATE_FORMAT}
                // respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                value={new Date(formData?.ClientDeliveryDateBefore)}
                handleChange={searchHandleChange}
              />
            ) : (
              ""
            )}
          </div>
          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div>
              <ReactSelect
                placeholderName={t("Update Date")}
                id={"UpadteDate"}
                dynamicOptions={[
                  { label: "Any", value: "0" },
                  { label: "Between", value: "2" },
                  { label: "Before", value: "4" },
                  { label: "After", value: "6" },
                  { label: "OnOrBefore", value: "3" },
                  { label: "On", value: "5" },
                  { label: "OnOrAfter", value: "7" },
                  // { label: "WithoutDeliveryDate", value: "9" },
                ]}
                searchable={true}
                lable="Update Date"
                name="UpadteDate"
                value={formData?.UpadteDate}
                className={"UpadteDate"}
                handleChange={handleDeliveryChange}
              />
            </div>
            {formData.UpadteDate == "2" && (
              <>
                <DatePicker
                  className="custom-calendar"
                  id="UpadteDateBefore"
                  name="UpadteDateBefore"
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.UpadteDateBefore}
                  handleChange={searchHandleChange}
                />
                <DatePicker
                  className="custom-calendar"
                  id="UpadteDateAfter"
                  name="UpadteDateAfter"
                  // lable={"UpadteDateAfter"}
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.UpadteDateAfter}
                  handleChange={searchHandleChange}
                />
              </>
            )}

            {formData.UpadteDate == "4" ||
            formData.UpadteDate == "5" ||
            formData.UpadteDate == "6" ||
            formData.UpadteDate == "7" ||
            formData.UpadteDate == "3" ? (
              <DatePicker
                className="custom-calendar"
                id="UpadteDateBefore"
                name="UpadteDateBefore"
                // lable={"Current"}
                placeholder={VITE_DATE_FORMAT}
                // respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                value={formData?.UpadteDateBefore}
                handleChange={searchHandleChange}
              />
            ) : (
              ""
            )}
          </div>

          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div>
              <ReactSelect
                placeholderName={t("Close Date")}
                id={"CloseDate"}
                dynamicOptions={[
                  { label: "Any", value: "0" },
                  { label: "Between", value: "2" },
                  { label: "Before", value: "4" },
                  { label: "After", value: "6" },
                  { label: "OnOrBefore", value: "3" },
                  { label: "On", value: "5" },
                  { label: "OnOrAfter", value: "7" },
                  // { label: "WithoutDeliveryDate", value: "9" },
                ]}
                searchable={true}
                lable="Close Date"
                name="CloseDate"
                value={formData?.CloseDate}
                //   respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                className={"CloseDate"}
                handleChange={handleDeliveryChange}
              />
            </div>
            {formData.CloseDate == "2" && (
              <>
                <DatePicker
                  className="custom-calendar"
                  id="CloseDateBefore"
                  name="CloseDateBefore"
                  // lable={"Before"}
                  placeholder={VITE_DATE_FORMAT}
                  // respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
                  value={formData?.CloseDateBefore}
                  handleChange={searchHandleChange}
                />
                <DatePicker
                  className="custom-calendar"
                  id="CloseDateAfter"
                  name="CloseDateAfter"
                  // lable={"After"}
                  placeholder={VITE_DATE_FORMAT}
                  // respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
                  value={formData?.CloseDateAfter}
                  handleChange={searchHandleChange}
                />
              </>
            )}

            {formData.CloseDate == "4" ||
            formData.CloseDate == "5" ||
            formData.CloseDate == "6" ||
            formData.CloseDate == "7" ||
            formData.CloseDate == "3" ? (
              <DatePicker
                className="custom-calendar"
                id="CloseDateBefore"
                name="CloseDateBefore"
                // lable={"Current"}
                placeholder={VITE_DATE_FORMAT}
                // respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                value={formData?.CloseDateBefore}
                handleChange={searchHandleChange}
              />
            ) : (
              ""
            )}
          </div>
          <Input
            type="text"
            className="form-control mt-1"
            id="Ticket"
            name="Ticket"
            value={formData?.Ticket}
            // onChange={handleChange}
            lable={t("Ticket No Search")}
            onChange={handleChange}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            respclass="col-xl-2 mt-1 col-md-4 col-sm-6 col-12"
            name="SearhType"
            placeholderName={t("Searh Type")}
            dynamicOptions={[
              // { label: "Select", value: "All" },
              { label: "Onscreen", value: "0" },
              { label: "Excel", value: "1" },
              //   { label: "Excel Type-II", value: "2" },
            ]}
            value={formData?.SearhType}
            handleChange={handleDeliveryChange}
          />
          <ReactSelect
            respclass="col-xl-2 mt-1 col-md-4 col-sm-6 col-12"
            name="PageSize"
            placeholderName={t("PageSize")}
            dynamicOptions={PageSize}
            value={formData?.PageSize}
            // defaultValue={status.find((option) => option.value === "resolved")}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
          />
          <div className="d-flex">
            <div className="search-col" style={{ marginLeft: "8px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label className="switch" style={{ marginTop: "7px" }}>
                  <input
                    type="checkbox"
                    name="OnlyReOpen"
                    checked={formData?.OnlyReOpen ? 1 : 0}
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
                  {t("Only ReOpen")}
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex">
            <div className="search-col" style={{ marginLeft: "8px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label className="switch" style={{ marginTop: "7px" }}>
                  <input
                    type="checkbox"
                    name="OnlyDelay"
                    checked={formData?.OnlyDelay ? 1 : 0}
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
                  {t("Only Delay")}
                </span>
              </div>
            </div>
          </div>
          <button
            className="btn btn-sm btn-success ml-4"
            onClick={() => handleViewSearch(undefined, "0")}
          >
            {t("Apply Filter")}
          </button>
          <button className="btn btn-sm btn-danger ml-3" onClick={handleReset}>
            {t("Reset Filter")}
          </button>
          {/* {tableData?.length > 0 && ( */}

          {/* )} */}
          <button
            className="btn btn-sm btn-danger ml-2"
            onClick={handleSaveFilter}
          >
            {t("Save Filter")}
          </button>
          <button
            className="btn btn-sm btn-danger ml-2 d-none"
            onClick={handleGetFilter}
          >
            {t("Search Filter")}
          </button>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          {tableData?.length > 0 ? (
            <>
              <div className="card" style={{ marginTop: "10px" }}>
                <Heading
                  title={
                    <span style={{ fontWeight: "bold" }}>
                      {t("Search Details")}
                    </span>
                  }
                  secondTitle={
                    <div className="d-flex">
                      <div
                        style={{
                          padding: "0px !important",
                          marginLeft: "10px",
                        }}
                      >
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

                      <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                        {t("Total ManMinutes")} : &nbsp;{" "}
                        {tableData?.reduce(
                          (acc, curr) =>
                            acc + (Number(curr?.ManHoursClient) || 0),
                          0
                        )}
                      </span>
                      <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                        {t("Total Record")} : &nbsp; {tableData[0]?.TotalRecord}
                      </span>
                    </div>
                  }
                />

                {/* <div
                  className="patient_registration_card bootable tabScroll"
                  style={{ overflowX: "auto" }}
                >
                  <ViewClientTicketTable
                    THEAD={THEAD}
                    tbody={tableData}
                    setTableData={setTableData}
                    formData={formData}
                    setFormData={setFormData}
                    handleViewSearch={handleViewSearch}
                  />
                </div> */}

                <div className="">
                  <Tables
                    style={{ width: "100%", height: "100%" }}
                    thead={
                      formData?.ProjectID == "167"
                        ? THEAD
                        : THEAD.filter((head) => head !== "Assign To")
                    }
                    tbody={currentData?.map((ele, index) => {
                      baseRow = {
                        "S.No.":
                          (currentPage - 1) * formData?.PageSize + index + 1,
                        Notes:
                          ele?.NoteCount === 0 ? (
                            <i
                              className="fa fa-file"
                              onClick={() =>
                                setVisible({
                                  noteVisible: true,
                                  showData: ele,
                                  ele,
                                })
                              }
                              style={{
                                cursor: "pointer",
                                color: "black",
                                marginLeft: "10px",
                              }}
                            />
                          ) : (
                            <i
                              className="fa fa-file"
                              onClick={() =>
                                setVisible({
                                  noteVisible: true,
                                  showData: ele,
                                  ele,
                                })
                              }
                              style={{
                                cursor: "pointer",
                                color: "green",
                                marginLeft: "10px",
                              }}
                            />
                          ),
                        Attach:
                          ele?.AttachmentCount === 0 ? (
                            <i
                              className="fa fa-upload"
                              onClick={() =>
                                setVisible({
                                  docVisible: true,
                                  showData: ele,
                                  ele,
                                })
                              }
                              style={{
                                cursor: "pointer",
                                color: "black",
                                marginLeft: "10px",
                              }}
                              title="Upload Document."
                            />
                          ) : (
                            <i
                              className="fa fa-upload"
                              onClick={() =>
                                setVisible({
                                  docViewVisible: true,
                                  showData: ele,
                                  ele,
                                })
                              }
                              style={{
                                cursor: "pointer",
                                color: "green",
                                marginLeft: "10px",
                              }}
                              title="View Documents"
                            />
                          ),
                        Select: (
                          <Input
                            disabled={ele?.Status == "closed"}
                            type="checkbox"
                            name="IsActive"
                            checked={ele?.IsActive}
                            onChange={(e) =>
                              handleDeliveryChangeCheckbox(e, index)
                            }
                          />
                        ),
                        "Ticket ID": (
                          <div
                            style={{
                              padding: "0px",
                              background: ele?.IsReOpen == 1 && "#c6fcff",
                              border: "none",
                              textAlign: "center",
                              height: "25px",
                            }}
                          >
                            {ele?.Status == "closed" ? (
                              ele?.TicketID
                            ) : (
                              <Link
                                onClick={() =>
                                  setVisible({
                                    showVisible: true,
                                    showData: ele,
                                  })
                                }
                                title="Click to Show"
                              >
                                {ele?.TicketID}
                              </Link>
                            )}
                          </div>
                        ),
                        "Project Name": (
                          <Tooltip label={ele?.ProjectName}>
                            <span style={{ textAlign: "center" }}>
                              {shortenNamesummary(ele?.ProjectName)}
                            </span>
                          </Tooltip>
                        ),
                        "Category Name": ele?.Category,
                        "Reporter Name": (
                          <Tooltip label={ele?.ReporterName}>
                            <span style={{ textAlign: "center" }}>
                              {shortenNamesummary(ele?.ReporterName)}
                            </span>
                          </Tooltip>
                        ),
                        "Assign To":
                          formData?.ProjectID == "167" ? ele?.AssignTo : null,
                        "Reported By Name": ele?.ReportedByName,
                        "Machine Reference No.": ele?.OtherReferenceNo,
                        Summary: (
                          <div style={{ width: "178px" }}>
                            <span
                              style={{
                                whiteSpace: "normal",
                                cursor: "pointer",
                              }}
                              title={ele?.summary}
                            >
                              {ele?.summary}
                            </span>
                          </div>
                        ),
                        Status: ele?.Status,
                        "Submit Date": ele?.TicketRaisedDate,
                        "Resolve Date": ele?.ResolvedDate,
                        Action: (
                          <>
                            <ReactSelect
                              style={{ width: "100%", marginLeft: "10px" }}
                              height={"6px"}
                              name="TableStatus"
                              id="TableStatus"
                              respclass="width110px"
                              placeholderName="Select"
                              dynamicOptions={dynamicOptionStatus}
                              value={ele?.TableStatus}
                              handleChange={(name, value) => {
                                const ind =
                                  (currentPage - 1) * formData?.PageSize +
                                  index;
                                handleDeliveryChangeValue(
                                  name,
                                  value?.value,
                                  ind,
                                  index,
                                  ele
                                );
                              }}
                            />
                            {ele?.TableStatus == "ReOpen" && (
                              <>
                                {ele?.DClosedStatus == 1 ? (
                                  <ReactSelect
                                    style={{ width: "100%", marginLeft: "3px" }}
                                    height={"6px"}
                                    name="ReOpenValue"
                                    respclass="width110px"
                                    id="ReOpenValue"
                                    placeholderName="Reason"
                                    dynamicOptions={reopen}
                                    value={ele?.ReOpenValue}
                                    handleChange={(name, value) => {
                                      handleAgainChange(name, value, index);
                                    }}
                                  />
                                ) : (
                                  <span
                                    style={{
                                      color: "Orange",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    Please Close Ticket
                                    <br />
                                    or &nbsp;Reopen Date Over.
                                  </span>
                                )}
                              </>
                            )}
                          </>
                        ),
                        DeliveryDate: ele?.DeliveryDateClient,
                        ManMinutes: ele?.ManHoursClient,
                        ModuleName: ele?.ModuleName,
                        PageName: ele?.PagesName,
                        colorcode: ele?.rowColor,
                      };

                      // ✅ only add "Assign To" if ProjectID = 167
                      if (formData?.ProjectID != "167") {
                        delete baseRow["Assign To"];
                      }
                      return baseRow;
                    })}
                    tableHeight={"tableHeight"}
                  />
                </div>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    {AllowDeleteTicket === "1" && (
                      <button
                        className="btn btn-sm btn-danger mt-1 ml-2"
                        onClick={handleDelete}
                      >
                        Delete Ticket
                      </button>
                    )}
                  </div>
                  <div>
                    <CustomPagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <NoRecordFound />
            </>
          )}
        </>
      )}
    </>
  );
};

export default ViewTicketClient;
