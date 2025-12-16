import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../components/UI/Heading";
import ReactSelect from "../components/formComponent/ReactSelect";
import DatePicker from "../components/formComponent/DatePicker";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import Tables from "../components/UI/customTable";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import moment from "moment";
import ViewIssueDetailsTableModal from "../components/UI/customTable/ViewIssueDetailsTableModal";
import { Link, useLocation } from "react-router-dom";
import Modal from "../components/modalComponent/Modal";
import Input from "../components/formComponent/Input";
import { apiUrls } from "../networkServices/apiEndpoints";
import CustomPagination from "../utils/CustomPagination";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { PageSize } from "../utils/constant";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import { useSelector } from "react-redux";
import Tooltip from "./Tooltip";
import ViewIssueDocModal from "../components/UI/customTable/ViewIssueDocModal";
import ViewIssueDocTable from "../components/UI/customTable/ViewIssueDocTable";
import ViewIssueNotesModal from "../components/UI/customTable/ViewIssueNotesModal";
import { use } from "react";
import SummaryStatusModal from "../components/UI/customTable/SummaryStatusModal";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import ViewIssueCloseModal from "./ViewIssueCloseModal";
import ReactSelectIcon from "../components/formComponent/ReactSelectIcon";
import { axiosInstances } from "../networkServices/axiosInstance";
import ReportIssue from "./ReportIssue";
import SubTicketMappping from "./SubTicketMappping";
const ViewIssues = ({ data }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const AllowDeleteTicket = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowDeleteTicket"
  );
  const AllowDeliveryDateEdit = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowDeliveryDateEdit"
  );
  const AllowManHourEdit = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowManHourEdit"
  );

  const ShowClientDeliveryDate = useCryptoLocalStorage(
    "user_Data",
    "get",
    "ShowClientDeliveryDate"
  );
  const ShowClientManHour = useCryptoLocalStorage(
    "user_Data",
    "get",
    "ShowClientManHour"
  );
  const [tableData, setTableData] = useState([]);
  const location = useLocation();
  const states = location.state; // Access the state passed from the Link
  const datePickerRefs = useRef({});
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [project, setProject] = useState([]);
  const [wing, setWing] = useState([]);
  const [moduleName, setModuleName] = useState([]);
  const [pageName, setPageName] = useState([]);
  const [poc1, setPoc1] = useState([]);
  const [poc2, setPoc2] = useState([]);
  const [poc3, setPoc3] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [reopen, setReOpen] = useState([]);
  const [status, setStatus] = useState([]);
  const [hidestatus, setHideStatus] = useState([]);
  const [category, setCategory] = useState([]);
  const [updatecategory, setUpdateCategory] = useState([]);
  const [reporter, setReporter] = useState([]);
  const [assignto, setAssignedto] = useState([]);
  const [priority, setPriority] = useState([]);
  const [assigntoValue, setAssignedtoValue] = useState([]);
  const [incharge, setIncharge] = useState([]);
  const [productversion, setProductVersion] = useState([]);
  const [assigntoValueProjectId, setAssignedtoValueProjectId] = useState([]);
  const [shownodata, setShownodata] = useState(false);
  const { clientId } = useSelector((state) => state?.loadingSlice);

  // const tdRefs = useRef([]);

  // useEffect(() => {
  //   if (tdRefs?.current[selectedRowIndex]) {
  //     tdRefs?.current[selectedRowIndex]?.scrollIntoView({
  //       behavior: "smooth",
  //       block: "center",
  //       inline: "nearest",
  //     });
  //   }
  // }, [selectedRowIndex, tdRefs?.current]);

  // console.log("tdRefs", tdRefs);

  const [rowHandler, setRowHandler] = useState({
    show: true,
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    SubmitDateShow: false,
    DeliveryDateShow: false,
    ResolveDateShow: false,
    CloseDateShow: false,
    UpadteDateShow: false,
  });
  const [formData, setFormData] = useState({
    PageNo: "",
    PageSize: 50,
    SubmitDate: "",
    Incharge: [],
    DeliveryDate:
      data?.fiveDate || data?.DelayDate || data?.PlannedDate
        ? data?.fiveDate || data?.DelayDate || data?.PlannedDate
        : "",
    ClientDeliveryDate: "",
    ClientManHour: "",
    AssignedDate: "",
    ResolveDate: "",
    DelayedTicketType: "0",
    DelayedTicket: "",
    CloseDate: "",
    UpadteDate: "",
    ManHourDropdown: "",
    ClientManHourDropdown: "",
    OnlyReOpen: "",
    OnlyDeliveryDateChange: "",
    SubmitDateBefore: new Date(),
    SubmitDateAfter: new Date(),
    SubmitDateCurrent: new Date(),
    ProductVersion: "",
    DeliveryDateBefore: new Date(),
    DeliveryDateAfter: new Date(),
    DeliveryDateCurrent: new Date(),

    AssignedDateBefore: new Date(),
    AssignedDateAfter: new Date(),
    AssignedDateCurrent: new Date(),

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
    RemoveDeliveryToStatus: "",
    Priority: "",
    Category: [],
    HideStatus: "80" ? "80" : "1",
    // Status: "1" ? "1" : "70",
    Status: [1] ? [1] : [70],
    TableStatus: "",
    IsActive: "",
    RefereRCA: "",
    RefereCode: "",
    ManHours: "",
    ManHour: "",
    Hold: "",
    Ticket: "",
    summary: "",
    ModuleName: [],
    PagesName: "",
    SearhType: "0",
    NotToDo: "",
  });

  const viewissuesTHEAD = [
    t("S.No."),
    // t("Notes"),
    // t("Attach"),
    t("View"),
    t("Select"),
    t("Ticket ID"),
    t("Project Name"),

    t("Category Name"),
    t("Reporter Name"),
    t("Assign To"),
    t("Priority"),
    { name: t("Summary"), width: "40%" },
    t("Status"),
    t("Date Submitted"),
    t("Delivery Date"),
    // t("PMM"),
    t("M.ManMinutes"),
    { name: t("Change Action"), width: "9%" },
    t("Module Name"),
    t("Incharge"),
    // t("Dev.MM"),
    t("Dev.ManMinutes"),
    t("DeliveryDate-"),
    // t("CMM"),
    t("ManMinutes-"),
  ];

  useEffect(() => {
    if (!data?.type) return;

    const memberID = data?.LotusAssign
      ? [data?.LotusAssign]
      : useCryptoLocalStorage("user_Data", "get", "ID");

    let updatedFormData = {};

    switch (data?.type) {
      case "OpenBugs":
        if (data?.assigntovalue === "AssignCheck") {
          const assignvalue = [data?.LotusAssign];
          updatedFormData = {
            AssignedTo: [memberID],
            Category: ["Bug"],
          };
        }
        handleViewSearch(
          undefined,
          undefined,
          undefined,
          ["Bug"],
          undefined,
          undefined,
          memberID,
          undefined,
          undefined
        );
        break;

      case "DoneUat":
        updatedFormData = {
          Status: [70],

          AssignedTo: [memberID],
          HideStatus: "1",
        };
        handleViewSearch(
          undefined,
          undefined,

          [70],
          undefined,
          undefined,
          undefined,

          memberID,
          undefined
        );
        break;

      case "Delivery":
        if (data?.fiveDate === "5" && data?.assigntovalue === "AssignCheck") {
          const assignvalue = [data?.LotusAssign];
          updatedFormData = {
            AssignedTo: [memberID],
            HideStatus: "1",
          };
        }
        handleViewSearch(
          undefined,
          undefined,
          "1",
          undefined,
          undefined,
          undefined,
          memberID,
          undefined,
          "1"
        );
        break;

      case "Delay":
        if (data?.assigntovalue === "AssignCheck") {
          const assignvalue = [data?.LotusAssign];
          updatedFormData = {
            AssignedTo: [memberID],
            HideStatus: "80",
          };
        }
        handleViewSearch(
          110,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          memberID,
          undefined
        );
        break;

      case "Planned":
        if (
          data?.PlannedDate === "7" &&
          data?.assigntovalue === "AssignCheck"
        ) {
          updatedFormData = {
            AssignedTo: [memberID],
            HideStatus: "1",
          };
        }

        handleViewSearch(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          memberID,
          undefined
        );
        break;
      case "DeveloperCalendar":
        if (
          data?.PlannedDate === "5" &&
          data?.assigntovalue === "AssignCheck"
        ) {
          const assignvalue = [data?.LotusAssign];
          updatedFormData = {
            AssignedTo: assignvalue,
            HideStatus: "1",
            Status: [1],
            // Status: "1",
            DeliveryDateBefore: data?.selectCalendarDate,
          };

          handleViewSearch(
            undefined,
            undefined,
            // "1",
            [1],
            undefined,
            undefined,
            undefined,
            [data?.LotusAssign],
            undefined,
            "",
            data?.selectCalendarDate
          );
        }
        break;

      case "TicketsTobeWork":
        if (
          data?.PlannedDate === "5" &&
          data?.assigntovalue === "AssignCheck"
        ) {
          const assignvalue = [data?.LotusAssign];
          updatedFormData = {
            AssignedTo: memberID,
            HideStatus: "1",
            // Status: "1",
            Status: [1],
          };
          handleViewSearch(
            undefined,
            undefined,
            // "1",
            [1],
            undefined,
            undefined,
            undefined,
            memberID,
            undefined
          );
        }
        break;
      case "NotAssignedHeader":
        if (
          // data?.PlannedDate === "5" &&
          data?.assigntovalue === "AssignCheck"
        ) {
          const assignvalue = [data?.LotusAssign];
          console.log("assignvalue", assignvalue);
          updatedFormData = {
            AssignedTo: [memberID],
            HideStatus: "1",
            Status: [50],
          };
          handleViewSearch(
            undefined,
            undefined,
            [50],
            undefined,
            undefined,

            memberID,
            "1",
            undefined
          );
        }
        break;
      case "AssignWithOutDeliveryDateHeader":
        if (
          // data?.PlannedDate === "5" &&
          data?.assigntovalue === "AssignCheck"
        ) {
          const assignvalue = [data?.LotusAssign];
          updatedFormData = {
            // AssignedTo: memberID,
            HideStatus: "80",
            Status: [50],
            // Status: "50",
            DeliveryDate: data?.PlannedDate,
          };
          handleViewSearch(
            undefined,
            undefined,
            [50],
            // "50",
            undefined,
            undefined,
            undefined,
            undefined,
            undefined
          );
        }
        break;
      default:
        break;
    }
    // }

    // Update formData only if there are changes
    if (Object.keys(updatedFormData).length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        ...updatedFormData,
      }));
    }
  }, []);

  const tabledynamicOptions = [
    { label: "Move", value: "Move" },
    { label: "Assign", value: "Assign" },
    { label: "Close", value: "Close" },
    { label: "Resolve", value: "Resolve" },
    { label: "Status", value: "UpdateStatus" },
    {
      label: "Category",
      value: "UpdateCategory",
    },
    {
      label: "DeliveryDate",
      value: "UpdateDeliveryDate",
    },
    {
      label: "ManMinutes",
      value: "ManHours",
    },
    {
      label: "Hold",
      value: "Hold",
    },
    {
      label: "RemoveDeliveryDate",
      value: "RemoveDeliveryDate",
    },
    {
      label: "NotToDo",
      value: "NotToDo",
    },
  ];

  const dynamicOptionStatus = [
    { label: "Close", value: "Close" },
    { label: "Resolve", value: "Resolve" },
    { label: "Status", value: "UpdateStatus" },
    {
      label: "Hold",
      value: "Hold",
    },
    {
      label: "ReOpen",
      value: "ReOpen",
    },
    {
      label: "NotToDo",
      value: "NotToDo",
    },
  ];
  const filteredOptions =
    clientId === 7
      ? dynamicOptionStatus.filter((option) => option.value === "Close")
      : dynamicOptionStatus;
  const filteredOptionsTable =
    clientId === 7
      ? tabledynamicOptions.filter((option) => option.value === "Close")
      : tabledynamicOptions;

  const handleResolve = () => {
    const filterdata = tableData?.filter((item) => item.IsActive == true);
    const ticketIDs = filterdata.map((item) => item.TicketID).join(",");
    if (ticketIDs == "") {
      toast.error("Please Select atleast one Ticket.");
    } else if (
      !formData?.RefereCode ||
      isNaN(formData?.RefereCode) ||
      Number(formData?.RefereCode) <= 0
    ) {
      toast.error("Developer Manminutes cannot be Zero or Empty.");
    } else {
      axiosInstances
        .post(apiUrls.ApplyAction, {
          TicketIDs: String(ticketIDs),
          ActionText: "Resolve",
          ActionId: "",
          RCA: String(formData?.RefereRCA),
          ReferenceCode: String(formData?.RefereCode),
          ManHour: String(formData?.ManHours),
          Summary: "",
          ModuleID: "",
          ModuleName: "",
          PagesID: "",
          PagesName: "",
          ManHoursClient: "",
          DeliveryDateClient: "",
          ReOpenReasonID: "",
          ReOpenReason: "",
        })

        .then((res) => {
          toast.success(res?.data?.message);
          setFormData({
            ...formData,
            RefereRCA: "",
            RefereCode: "",
            ManHours: "",
          });
          handleViewSearch();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleResolveClose = () => {
    const filterdata = tableData?.filter((item) => item.IsActive == true);
    const ticketIDs = filterdata.map((item) => item.TicketID).join(",");
    if (ticketIDs == "") {
      toast.error("Please Select atleast one Ticket.");
    } else {
      // const filterdata = tableData?.filter((item) => item.IsActive == true);
      // const ticketIDs = filterdata.map((item) => item.TicketID).join(",");
      axiosInstances
        .post(apiUrls.ApplyAction, {
          TicketIDs: String(ticketIDs),
          ActionText: "Close",
          ActionId: "",
          RCA: String(formData?.RefereRCA),
          ReferenceCode: String(formData?.RefereCode),
          ManHour: String(formData?.ManHours),
          Summary: "",
          ModuleID: "",
          ModuleName: "",
          PagesID: "",
          PagesName: "",
          ManHoursClient: "",
          DeliveryDateClient: "",
          ReOpenReasonID: "",
          ReOpenReason: "",
        })
      
        .then((res) => {
          toast.success(res?.data?.message);
          setFormData({
            ...formData,
            RefereRCA: "",
            RefereCode: "",
            ManHours: "",
          });
          handleViewSearch();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleManhour = () => {
    const filterdata = tableData?.filter((item) => item.IsActive == true);
    const ticketIDs = filterdata.map((item) => item.TicketID).join(",");
    // console.log("edit dtaa", ticketIDs);
    if (ticketIDs == "") {
      toast.error("Please Select atleast one Ticket.");
    } else {
      axiosInstances
        .post(apiUrls.ApplyAction, {
          TicketIDs: String(ticketIDs),
          ActionText: "ManHours",
          ActionId: String(formData?.ManHours),
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
          ReOpenReasonID: "",
          ReOpenReason: "",
        })
        // const filterdata = tableData?.filter((item) => item.IsActive == true);
        // const ticketIDs = filterdata.map((item) => item.TicketID).join(",");
        // let form = new FormData();
        // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
        //   form.append(
        //     "LoginName",
        //     useCryptoLocalStorage("user_Data", "get", "realname")
        //   ),
        //   form.append("TicketIDs", ticketIDs),
        //   form.append("ActionText", "ManHours"),
        //   form.append("ActionId", formData?.ManHours),
        //   axios
        //     .post(apiUrls?.ApplyAction, form, { headers })
        .then((res) => {
          toast.success(res?.data?.message);
          setFormData({
            ...formData,
            ManHours: "",
          });
          handleViewSearch();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getModule = (value) => {
    axiosInstances
      .post(apiUrls.Module_Select, {
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
        ProjectID: 0,
        IsActive: 1,
        IsMaster: 2,
        InchargeID: value || "",
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { name: item?.ModuleName, code: item?.ModuleID };
        });
        setModuleName(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getPage = () => {
    axiosInstances
      .post(apiUrls.Pages_Select, {
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
        ProjectID: 0,
        IsActive: 1,
        IsMaster: 0,
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "RoleID",
      //     useCryptoLocalStorage("user_Data", "get", "RoleID")
      //   ),
      //   form.append("ProjectID", "0"),
      //   form.append("IsActive", "1"),
      //   form.append("IsMaster", "0"),
      //   axios
      //     .post(apiUrls?.Pages_Select, form, { headers })
      .then((res) => {
        const poc3s = res?.data?.data?.map((item) => {
          return { label: item?.PagesName, value: item?.ID };
        });
        setPageName(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleHoldTable = () => {
    const filterdata = tableData?.filter((item) => item.IsActive == true);
    const ticketIDs = filterdata.map((item) => item.TicketID).join(",");
    if (ticketIDs == "") {
      toast.error("Please Select atleast one Ticket.");
    } else {
      axiosInstances
        .post(apiUrls.ApplyAction, {
          TicketIDs: String(ticketIDs),
          ActionText: "Hold",
          ActionId: String(formData?.Hold),
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
          ReOpenReasonID: "",
          ReOpenReason: "",
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setFormData({
            ...formData,
            Hold: "",
          });
          handleViewSearch();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleNotToDoTable = () => {
    const filterdata = tableData?.filter((item) => item.IsActive == true);
    const ticketIDs = filterdata.map((item) => item.TicketID).join(",");
    if (ticketIDs == "") {
      toast.error("Please Select atleast one Ticket.");
    } else {
      axiosInstances
        .post(apiUrls.ApplyAction, {
          TicketIDs: String(ticketIDs),
          ActionText: "NotToDo",
          ActionId: String(formData?.NotToDo),
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
          ReOpenReasonID: "",
          ReOpenReason: "",
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setFormData({
            ...formData,
            NotToDo: "",
          });
          handleViewSearch();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleNotToDo = (item) => {
    axiosInstances
      .post(apiUrls.ApplyAction, {
        TicketIDs: String(item?.TicketID),
        ActionText: "NotToDo",
        ActionId: String(formData?.NotToDo),
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
        ReOpenReasonID: "",
        ReOpenReason: "",
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setFormData({
          ...formData,
          NotToDo: "",
        });
        handleViewSearch();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleResolveElement = (item) => {
    if (formData?.RefereRCA == "") {
      toast.error("Please Enter Summary.");
    } else if (
      !formData?.RefereCode ||
      isNaN(formData?.RefereCode) ||
      Number(formData?.RefereCode) <= 0
    ) {
      toast.error("Developer Manminutes cannot be Zero or Empty.");
    } else {
      axiosInstances
        .post(apiUrls.ApplyAction, {
          TicketIDs: String(item?.TicketID),
          ActionText: "Resolve",
          ActionId: "",
          RCA: String(formData?.RefereRCA),
          ReferenceCode: String(formData?.RefereCode),
          ManHour: String(""),
          Summary: "",
          ModuleID: "",
          ModuleName: "",
          PagesID: "",
          PagesName: "",
          ManHoursClient: "",
          DeliveryDateClient: "",
          ReOpenReasonID: "",
          ReOpenReason: "",
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setFormData({
            ...formData,
            RefereRCA: "",
            RefereCode: "",
            ManHours: "",
          });
          handleViewSearch();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleDelayCheckBox = (e) => {
    const { name, checked, type } = e.target;
    const checkBoxValue = checked ? 1 : 0;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checkBoxValue : e.target.value,
      DelayedTicketType:
        name === "DelayedTicket" && checkBoxValue === 0
          ? ""
          : prev.DelayedTicketType,
    }));
  };

  const handleHold = (item) => {
    axiosInstances
      .post(apiUrls.ApplyAction, {
        TicketIDs: String(item?.TicketID),
        ActionText: "Hold",
        ActionId: String(formData?.Hold),
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
        ReOpenReasonID: "",
        ReOpenReason: "",
      })
     
      .then((res) => {
        toast.success(res?.data?.message);
        setFormData({
          ...formData,
          Hold: "",
        });
        handleViewSearch();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleResolveElementClose = (item) => {
    if (formData?.RefereRCA == "") {
      toast.error("Please Enter Close Reason");
      // }
      // else if (formData?.RefereCode == "") {
      //   toast.error("Please Enter Reference RCA Code.");
    } else {
      axiosInstances
        .post(apiUrls.ApplyAction, {
          TicketIDs: String(item?.TicketID),
          ActionText: "Close",
          ActionId: String(formData?.Hold),
          RCA: String(formData?.RefereRCA),
          ReferenceCode: "",
          ManHour: String(formData?.ManHours),
          Summary: "",
          ModuleID: "",
          ModuleName: "",
          PagesID: "",
          PagesName: "",
          ManHoursClient: "",
          DeliveryDateClient: "",
          ReOpenReasonID: "",
          ReOpenReason: "",
        })
     
        .then((res) => {
          if (res?.data?.status === true) {
            toast.success(res?.data?.message);
            setFormData({
              ...formData,
              RefereRCA: "",
              RefereCode: "",
              ManHours: "",
            });
            handleViewSearch();
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDeliveryChangeValueStatus = (name, value) => {
    setFormData({ ...formData, [name]: value });
    const filterdata = tableData?.filter((item) => item.IsActive === true);
    const ticketIDs = filterdata.map((item) => item.TicketID).join(",");
    const formattedTicketIDs = Array.isArray(ticketIDs)
      ? ticketIDs
      : [ticketIDs];
    if (name === "DeliveryToStatus") {
      getmultiApplyAction(formattedTicketIDs, {
        label: "DeliveryDate",
        value: moment(value).format("YYYY-MM-DD"),
      });
    } else if (name === "RemoveDeliveryToStatus") {
      getmultiApplyAction(formattedTicketIDs, {
        label: "RemoveDeliveryDate",
        value: moment(value).format("YYYY-MM-DD"),
      });
    } else if (name === "UpdateToCategory") {
      getmultiApplyAction(formattedTicketIDs, {
        label: "Category",
        value: value.value,
      });
    } else if (name === "UpdateToStatus") {
      getmultiApplyAction(formattedTicketIDs, {
        label: "Status",
        value: value.value,
      });
    } else if (name === "AssignedToStatus") {
      getmultiApplyAction(formattedTicketIDs, {
        label: "Assign",
        value: value.value,
      });
    } else if (name === "MoveStatus") {
      getmultiApplyAction(formattedTicketIDs, {
        label: "Move",
        value: value.value,
      });
    } else if (name !== "TableStatus") {
      getmultiApplyAction(formattedTicketIDs, value);
    }
  };

  const handleDeliveryRemove = () => {
    const filterdata = tableData?.filter((item) => item.IsActive == true);
    const ticketIDs = filterdata.map((item) => item.TicketID).join(",");
    if (ticketIDs == "") {
      toast.error("Please Select atleast one Ticket.");
    } else {
      axiosInstances
        .post(apiUrls.ApplyAction, {
          TicketIDs: String(ticketIDs),
          ActionText: "DeliveryDate",
          ActionId: "0",
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
          ReOpenReasonID: "",
          ReOpenReason: "",
        })
      
        .then((res) => {
          toast.success(res?.data?.message);
          setFormData({
            ...formData,
            RemoveDeliveryToStatus: "",
          });
          handleViewSearch();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const getmultiApplyAction = (ids, data) => {
    if (ids == "") {
      toast.error("Please Select atleast one Ticket.");
    } else {
      axiosInstances
        .post(apiUrls.ApplyAction, {
          TicketIDs: String(ids),
          ActionText: String(data?.label),
          ActionId: String(data?.value),
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
          ReOpenReasonID: "",
          ReOpenReason: "",
        })
      
        .then((res) => {
          toast.success(res?.data?.message);
          handleViewSearch();
          setFormData((val) => ({ ...val, TableStatus: {} }));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDeliveryChangeValue = (name, value, ind, page, ele) => {
    let index = 0;
    tableData.map((val, ind) => {
      if (val?.TicketID !== ele?.TicketID) {
        val["TableStatus"] = null;
      } else {
        index = ind;
      }
      return val;
    });
    // console.log("valuevaluevalue",index)

    if (name == "Move") {
      const data = [...tableData];
      data[index]["TableStatus"] = value;
      data[index]["MoveResolve"] = true;
      setTableData(data);
    } else if (name == "Assign") {
      const data = [...tableData];
      data[index]["TableStatus"] = value;
      // console.log("projectid",value)
      data[index]["AssignResolve"] = true;
      setTableData(data);
    } else if (name == "AssignDropDownValue") {
      const data = [...tableData];
      data[index][name] = value;
      setTableData(data);
    } else if (name == "UpdateStatus") {
      const data = [...tableData];
      data[index]["TableStatus"] = value;
      data[index]["UpdateStatusResolve"] = true;
      setTableData(data);
    } else if (name == "UpdateStatusValue") {
      const data = [...tableData];
      data[index][name] = value;
      setTableData(data);
    } else if (name == "ReOpenValue") {
      const data = [...tableData];
      data[index][name] = value;
      setTableData(data);
    } else if (name == "UpdateCategory") {
      const data = [...tableData];
      data[index]["TableStatus"] = value;
      data[index]["UpdateCategoryResolve"] = true;
      setTableData(data);
    } else if (name == "UpdateCategoryValue") {
      const data = [...tableData];
      data[index][name] = value;
      setTableData(data);
    } else if (name == "UpdateDeliveryDate") {
      const data = [...tableData];
      data[index]["TableStatus"] = value;
      data[index]["UpdatedeliverydateResolve"] = true;
      setTableData(data);
    } else if (name == "UpdatedeliverydateValue") {
      const data = [...tableData];
      data[index][name] = value;
      // data[index]["TableStatus"] = value;
      setTableData(data);
    } else if (name == "TableStatus") {
      const data = [...tableData];
      data[index][name] = value;
      data[index]["TableStatus"] = value;

      setTableData(data);
      value == "Assign" && getAssignToValueProjectID(ele?.ProjectID);
    } else {
      const data = [...tableData];
      // data[index]["TableStatus"] = value;
      data[index][name] = value;
      setTableData(data);
    }
  };
  const handleAgainChange = (name, value, index, ele) => {
    let updatedData = [...tableData];
    updatedData[index][name] = value;
    setTableData(updatedData);

    if (name === "UpdatedeliverydateValue")
      getApplyAction(
        {
          label: "DeliveryDate",
          value: moment(value).format("YYYY-MM-DD"),
        },
        index
      );
    else if (name === "UpdateCategoryValue") {
      getApplyAction(
        {
          label: "Category",
          value: value.value,
        },
        index
      );
    } else if (name === "UpdatePriorityValue") {
      getApplyAction(
        {
          label: "Priority",
          value: value.value,
        },
        index
      );
    } else if (name === "UpdateStatusValue") {
      getApplyAction(
        {
          label: "Status",
          value: value.value,
        },
        index
      );
    } else if (name === "ReOpenValue") {
      getApplyActionReason(
        {
          label: value?.label,
          value: value.value,
        },
        index
      );
    } else if (name === "AssignDropDownValue") {
      getApplyActionAssign(
        {
          label: "Assign",
          value: value.value,
        },
        index,
        ele
      );
    } else if (name === "MoveDropDownValue") {
      getApplyAction(
        {
          label: "Move",
          value: value.value,
        },
        index
      );
    } else getApplyAction(value, index);
  };

  const handleDeliveryChangeCheckbox = (e, index) => {
    const { checked } = e.target;
    const data = [...tableData];
    data[index]["IsActive"] = checked;
    setTableData(data);
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
  const getIncharge = () => {
    axiosInstances
      .post(apiUrls.Reporter_Select, {
        IsIncharge: "1",
      })
      .then((res) => {
        const poc3s = res?.data?.data?.map((item) => {
          return { name: item?.Name, code: item?.ID };
        });
        setIncharge(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeliveryChangeAttach = (name, value, index, ele) => {
    tableData?.map((val, ind) => {
      if (index !== ind) {
        val["TableAttach"] = null;
      }
      return val;
    });

    const data = [...tableData];
    data[index]["TableAttach"] = value;
    if (value === "Notes") {
      data[index]["NotesResolve"] = true;
      setTableData(data);
      setVisible({
        notesVisible: true,
        attachVisible: false,
        historyVisible: false,
        subTicketVisible: false,
        SubTicketMappingVisisble: false,
        showData: data[index],
      });
    } else if (value === "Attach") {
      data[index]["AttachResolve"] = true;
      setTableData(data);
      setVisible({
        notesVisible: false,
        attachVisible: true,
        historyVisible: false,
        subTicketVisible: false,
        SubTicketMappingVisisble: false,
        showData: data[index],
      });
    } else if (value === "History") {
      data[index]["HistoryResolve"] = true;
      setTableData(data);
      setVisible({
        notesVisible: false,
        attachVisible: false,
        historyVisible: true,
        subTicketVisible: false,
        SubTicketMappingVisisble: false,
        showData: data[index],
      });
    } else if (value === "SubTicket") {
      data[index]["SubTicketResolve"] = true;
      setTableData(data);
      setVisible({
        notesVisible: false,
        attachVisible: false,
        historyVisible: false,
        subTicketVisible: true,
        SubTicketMappingVisisble: false,
        showData: data[index],
      });
    } else if (value === "SubTicketMapping") {
      data[index]["SubTicketMappingResolve"] = true;
      setTableData(data);
      setVisible({
        notesVisible: false,
        attachVisible: false,
        historyVisible: false,
        subTicketVisible: false,
        SubTicketMappingVisisble: true,
        showData: data[index],
      });
    } else {
      setTableData(data);
      setVisible({
        notesVisible: false,
        attachVisible: false,
        historyVisible: false,
        subTicketVisible: false,
        SubTicketMappingVisisble: false,
        showData: {},
      });
    }
  };

  const handleSelectAll = (values) => {
    const data = tableData.map((ele) => {
      return {
        ...ele,
        IsActive: values,
      };
    });
    setTableData(data);
  };

  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

    const keys = [
      "summaryByStatus",
      "summaryByPriority",
      "summaryByCategory",
      "summaryByProject",
      "summaryByAssignedTo",
      "summaryByReporter",
    ];

    keys.forEach((key) => {
      const value = localStorage.getItem(key);

      if (value !== null) {
        const parsedValue = JSON.parse(value);

        switch (key) {
          case "summaryByStatus":
            setFormData((val) => ({
              ...val,
              Status: parsedValue?.StatusID,
            }));
            handleViewSearch("", 0, parsedValue?.StatusID);
            break;

          case "summaryByPriority":
            setFormData((val) => ({
              ...val,
              Priority: parsedValue?.PriorityId,
            }));
            handleViewSearch("", 0, "", "", "", parsedValue?.PriorityId);
            break;

          case "summaryByCategory":
            setFormData((val) => ({
              ...val,
              Category: parsedValue?.CategoryId
                ? [parsedValue?.CategoryId]
                : [],
            }));
            handleViewSearch("", 0, "", parsedValue?.CategoryId);
            break;

          case "summaryByProject":
            setFormData((val) => ({
              ...val,
              ProjectID: parsedValue?.ProjectId ? [parsedValue?.ProjectId] : [],
            }));
            handleViewSearch("", 0, "", "", parsedValue?.ProjectId);
            break;

          case "summaryByAssignedTo":
            setFormData((val) => ({
              ...val,
              AssignedTo: parsedValue?.AssignToID
                ? [parsedValue?.AssignToID]
                : [],
            }));
            handleViewSearch("", 0, "", "", "", "", parsedValue?.AssignToID);
            break;

          case "summaryByReporter":
            setFormData((val) => ({
              ...val,
              Reporter: parsedValue?.ReporterID
                ? [parsedValue?.ReporterID]
                : [],
            }));
            handleViewSearch(
              "",
              0,
              "",
              "",
              "",
              "",
              "",
              parsedValue?.ReporterID
            );
            break;

          default:
            break;
        }
        localStorage.removeItem(key);
      }
    });
  }, []);

  const handleCheckBox = (e) => {
    const { name, checked, type } = e?.target;
    const checkBoxValue = checked ? 1 : 0;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checkBoxValue : value,
    });
  };

  const handleSaveFilter = () => {
    localStorage.setItem("formData", JSON.stringify(formData));
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    axiosInstances
      .post(apiUrls.SaveFilterData, {
        FiterData: savedData,
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append("_FiterData", savedData),
      //   axios
      //     .post(apiUrls?.SaveFilterData, form, { headers })
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleGetFilter = () => {
    axiosInstances
      .post(apiUrls.SearchFilterData, {})
      // let form = new FormData();

      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
      // axios
      //   .post(apiUrls?.SearchFilterData, form, { headers })
      .then((res) => {
        if (res?.data) {
          let resultObject = res?.data;
          setFormData((val) => ({
            ...val,
            VerticalID: resultObject?.VerticalID,
            TeamID: resultObject?.TeamID || "",
            ProjectID: resultObject?.ProjectID || "",
            WingID: resultObject?.WingID || "",
            POC1: resultObject?.POC1 || "",
            POC2: resultObject?.POC2 || "",
            POC3: resultObject?.POC3 || "",
            Reporter: resultObject?.Reporter || "",
            AssignedTo: resultObject?.AssignedTo || "",
            Category: resultObject?.Category || "",
            ClientManHourDropdown: resultObject?.ClientManHourDropdown || "",
            ManHourDropdown: resultObject?.ManHourDropdown || "",
            ClientDeliveryDate: resultObject?.ClientDeliveryDate || "",
            SubmitDate: resultObject?.SubmitDate || "",
            DeliveryDate: resultObject?.DeliveryDate || "",
            ResolveDate: resultObject?.ResolveDate || "",
            CloseDate: resultObject?.CloseDate || "",
            UpadteDate: resultObject?.UpadteDate || "",
            ModuleName: resultObject?.ModuleName || "",
            Incharge: resultObject?.Incharge || "",
            PagesName: resultObject?.PagesName || "",
            Priority: resultObject?.Priority || "",
            HideStatus: resultObject?.HideStatus || "",
            Status: resultObject?.Status || "",
          }));
        } else {
          console.error("No data found in the response.");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };
  const handlePageReset = () => {
    setFormData((val) => ({
      ...val,
      PageNo: "",
      PageSize: 50,
      ProductVersion: "",
      SubmitDate: "",
      DeliveryDate:
        data?.fiveDate || data?.DelayDate || data?.PlannedDate
          ? data?.fiveDate || data?.DelayDate || data?.PlannedDate
          : "",
      ClientDeliveryDate: "",
      AssignedDate: "",
      ResolveDate: "",
      CloseDate: "",
      UpadteDate: "",
      ManHourDropdown: "",
      ClientManHourDropdown: "",
      OnlyReOpen: "",
      OnlyDeliveryDateChange: "",
      SubmitDateBefore: new Date(),
      SubmitDateAfter: new Date(),
      SubmitDateCurrent: new Date(),

      DeliveryDateBefore: new Date(),
      DeliveryDateAfter: new Date(),
      DeliveryDateCurrent: new Date(),

      AssignedDateBefore: new Date(),
      AssignedDateAfter: new Date(),
      AssignedDateCurrent: new Date(),

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
      RemoveDeliveryToStatus: "",
      Priority: "",
      Category: [],
      HideStatus: "80" ? "80" : "1",
      // Status: "1" ? "1" : "70",
      Status: [1] ? [1] : [70],
      TableStatus: "",
      IsActive: "",
      RefereRCA: "",
      RefereCode: "",
      ManHours: "",
      ManHour: "",
      Hold: "",
      Ticket: "",
      summary: "",
      ModuleName: [],
      Incharge: [],
      PagesName: "",
      SearhType: "0",
    }));
  };
  const handleReset = () => {
    setFormData({
      ...formData,
      PageNo: "",
      PageSize: 50,
      ProductVersion: "",
      SubmitDate: "",
      DeliveryDate:
        data?.fiveDate || data?.DelayDate || data?.PlannedDate
          ? data?.fiveDate || data?.DelayDate || data?.PlannedDate
          : "",
      ClientDeliveryDate: "",
      AssignedDate: "",
      ResolveDate: "",
      CloseDate: "",
      UpadteDate: "",
      ManHourDropdown: "",
      ClientManHourDropdown: "",
      OnlyReOpen: "",
      OnlyDeliveryDateChange: "",
      SubmitDateBefore: new Date(),
      SubmitDateAfter: new Date(),
      SubmitDateCurrent: new Date(),

      DeliveryDateBefore: new Date(),
      DeliveryDateAfter: new Date(),
      DeliveryDateCurrent: new Date(),

      AssignedDateBefore: new Date(),
      AssignedDateAfter: new Date(),
      AssignedDateCurrent: new Date(),

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
      RemoveDeliveryToStatus: "",
      Priority: "",
      Category: [],
      HideStatus: "80" ? "80" : "1",
      // Status: "1" ? "1" : "70",
      Status: [1] ? [1] : [70],
      TableStatus: "",
      IsActive: "",
      RefereRCA: "",
      RefereCode: "",
      ManHours: "",
      ManHour: "",
      Hold: "",
      Ticket: "",
      summary: "",
      ModuleName: [],
      Incharge: [],
      PagesName: "",
      SearhType: "0",
    });
  };

  const shortenNamesummary = (name) => {
    return name?.length > 20 ? name?.substring(0, 15) + "..." : name;
  };
  const searchHandleChange = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlerow = (row) => {
    let obj;
    if (!rowHandler[row]) {
      obj = { ...rowHandler, [row]: true };
    } else {
      obj = { ...rowHandler, [row]: false };
    }
    setRowHandler(obj);
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    if (name == "Incharge") {
      setFormData((prev) => ({
        ...prev,
        [`${name}`]: selectedValues,
      }));
      getModule(selectedValues);
    } else {
      setFormData((prev) => ({
        ...prev,
        [`${name}`]: selectedValues,
      }));
    }
  };
  const getVertical = () => {
    axiosInstances
      .post(apiUrls.Vertical_Select, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
      })
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
      .then((res) => {
        const reporters = res?.data.data.map((item) => {
          return { name: item?.Team, code: item?.TeamID };
        });
        setTeam(reporters);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getWing = () => {
    axiosInstances
      .post(apiUrls.Wing_Select, {})
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
  const [updateProject, setUpdateProject] = useState([]);
  const getProjectvalue = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        ProjectID: 0,
        IsMaster: "string",
        VerticalID: 0,
        TeamID: 0,
        WingID: 0,
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.Project, value: item?.ProjectId };
        });
        // getUpdateCategory(poc3s[0]?.value);
        setUpdateProject(poc3s);
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
        const poc3s = res?.data?.data?.map((item) => {
          return { name: item?.Project, code: item?.ProjectId };
        });
        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCategory = () => {
    axiosInstances
      .post(apiUrls.Category_Select, {
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
        ProjectID: 0,
      })
      .then((res) => {
        const poc3s = res?.data?.data?.map((item) => {
          return { name: item?.NAME, code: item?.NAME };
        });
        setCategory(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getUpdateCategory = () => {
    axiosInstances
      .post(apiUrls.Category_Select, {
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
        ProjectID: 0,
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.NAME };
        });
        setUpdateCategory(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getStatus = () => {
    axiosInstances
      .post(apiUrls.Status_Select, {})
      .then((res) => {
        console.log("check", res.data.data);
        const poc3s = res?.data?.data?.map((item) => {
          return {
            name: item?.STATUS,
            // code: item?.id !== undefined ? item?.id : null,
            code: item?.id,
          };
        });
        setStatus(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getHideStatus = () => {
    axiosInstances
      .post(apiUrls.Status_Select, {})
      .then((res) => {
        const poc3s = res?.data?.data?.map((item) => {
          return {
            label: item?.STATUS,
            value: item?.id !== undefined ? item?.id : null,
          };
        });
        setHideStatus(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getReporter = () => {
    axiosInstances
      .post(apiUrls.Reporter_Select, {
        IsMaster: 0,
        RoleID: 0,
        OnlyItdose: 0,
      })
      .then((res) => {
        const reporters = res?.data.data.map((item) => {
          return { name: item?.Name, code: item?.ID };
        });
        setReporter(reporters);
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
        const assigntos = res?.data?.data?.map((item) => {
          return { name: item?.Name, code: item?.ID };
        });
        setAssignedto(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAssignToValue = () => {
    axiosInstances
      .post(apiUrls.AssignTo_Select, {
        ProjectID: 0,
      })
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { label: item?.Name, value: item?.ID };
        });
        setAssignedtoValue(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAssignToValueProjectID = (projectID) => {
    axiosInstances
      .post(apiUrls.AssignTo_Select, {
        ProjectID: projectID ?? "",
      })
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { label: item?.Name, value: item?.ID };
        });
        setAssignedtoValueProjectId(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };
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
  const getApplyActionAssign = (data, index, ele) => {
    axiosInstances
      .post(apiUrls.ApplyAction, {
        TicketIDs: String(tableData[index]?.TicketID),
        ActionText: String(data?.label),
        ActionId: String(data?.value),
        RCA: "",
        ReferenceCode: "",
        ManHour: String(""),
        Summary: "",
        ModuleID: "",
        ModuleName: "",
        PagesID: "",
        PagesName: "",
        ManHoursClient: "",
        DeliveryDateClient: "",
        ReOpenReasonID: "",
        ReOpenReason: "",
      })
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res?.data?.message);
          handleViewSearch();
        } else {
          toast.error(res.data.message);
        }
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
        ActionId: String(data?.value),
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
        if (res?.data?.status === true) {
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

  const getApplyAction = (data, index) => {
    axiosInstances
      .post(apiUrls.ApplyAction, {
        TicketIDs: String(tableData[index]?.TicketID),
        ActionText: String(data?.label),
        ActionId: String(data?.value),
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
      // console.log("check latest", data);
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("TicketIDs", tableData[index]?.TicketID),
      //   form.append("ActionText", data?.label),
      //   form.append("ActionId", data?.value),
      //   axios
      //     .post(apiUrls?.ApplyAction, form, { headers })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleViewSearch();
        } else {
          toast.error(res?.data?.message);
          handleViewSearch();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchAllData = async () => {
    try {
      await Promise.all([
        getVertical(),
        getAssignTo(),
        getStatus(),
        getHideStatus(),
        getCategory(),
        getPriority(),
        getTeam(),
        getReporter(),
        getWing(),
        getUpdateCategory(),
        getPOC1(),
        getPOC2(),
        getPOC3(),
        getProjectvalue(),
        getProject(),
        getAssignToValue(),
        getModule(),
        getPage(),
        getReopen(),
        getIncharge(),
        getProduct(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
    // handleGetFilter();
  }, []);

  const [loading, setLoading] = useState(false);

  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // console.log("formData?.ResolveDate", formData?.ResolveDate);
  const handleViewSearch = async (
    code,
    page,
    StatusID = formData?.Status,
    CategoryID = formData?.Category,
    ProjectID = formData?.ProjectID,
    Priority = formData?.Priority,
    AssignedTo = formData?.AssignedTo,
    Reporter = formData?.Reporter,
    HideStatusId = formData?.HideStatus,
    deliveryDate = ""
  ) => {
    const paylaod = {
      RoleID: String(useCryptoLocalStorage("user_Data", "get", "RoleID") || ""),
      ProjectID: String(ProjectID || ""),
      VerticalID: String(formData?.VerticalID || ""),
      TeamID: String(formData?.TeamID || ""),
      WingID: String(formData?.WingID || ""),
      POC1: String(formData?.POC1 || ""),
      POC2: String(formData?.POC2 || ""),
      POC3: String(formData?.POC3 || ""),
      DelayedTicketType: String(formData?.DelayedTicketType || ""),
      DelayedTicket: String(formData?.DelayedTicket || ""),
      ReporterId: String(Reporter || ""),
      AssignToID: String(AssignedTo || ""),
      PriorityId: String(Priority || ""),
      CategoryID: String(CategoryID || ""),
      HideStatusId: String(HideStatusId || ""),
      StatusId: String(StatusID || ""),
      Incharge: String(formData?.Incharge || ""),
      rowColor: String(code || ""),
      SubmittedDateStatus: String(formData?.SubmitDate || ""),
      DateFromSubmitted: String(formatDate(formData?.SubmitDateBefore) || ""),
      DateToSubmitted: String(formatDate(formData?.SubmitDateAfter) || ""),
      ProductVersion: String(formData?.ProductVersion || ""),

      DeliveryDateStatus: String(formData?.DeliveryDate || ""),
      DeliveryFromDate: String(
        formatDate(deliveryDate || formData?.DeliveryDateBefore) || ""
      ),
      Deliverytodate: String(formatDate(formData?.DeliveryDateAfter) || ""),

      ClientDeliveryDateStatus: String(formData?.ClientDeliveryDate || ""),
      ClientDeliveryFromDate: String(
        formatDate(deliveryDate || formData?.ClientDeliveryDateBefore) || ""
      ),
      ClientDeliverytodate: String(
        formatDate(formData?.ClientDeliveryDateAfter) || ""
      ),

      ResolveDateStatus: String(formData?.ResolveDate || ""),
      ResolveFromDate: String(formatDate(formData?.ResolveDateBefore) || ""),
      Resolvetodate: String(formatDate(formData?.ResolveDateAfter) || ""),

      AssignedDateStatus: String(formData?.AssignedDate || ""),
      AssignedFromDate: String(
        formatDate(deliveryDate || (formData?.AssignedDateBefore ?? new Date()))
      ),
      // Assignedtodate: formatDate(formData?.AssignedDateAfter) ? String(formatDate(formData?.AssignedDateAfter)) : new Date(),
      Assignedtodate: String(
        formData?.AssignedDateAfter
          ? new Date(formData?.AssignedDateAfter).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      ),
      // Assignedtodate: "2025-09-16",

      ClosedDateStatus: String(formData?.CloseDate || ""),
      ClosedFromDate: String(formatDate(formData?.CloseDateBefore) || ""),
      Closedtodate: String(formatDate(formData?.CloseDateAfter) || ""),

      LastUpdateDateStatus: String(formData?.UpadteDate || ""),
      LastUpdatedFromDate: String(formatDate(formData?.UpadteDateBefore) || ""),
      LastUpdatedToDate: String(formatDate(formData?.UpadteDateAfter) || ""),

      PageNo: String(page ? page : currentPage - 1 || "0"),
      IsExcel: String(formData?.SearhType || ""),
      OnlyReOpen: String(formData?.OnlyReOpen || ""),
      OnlyDeliveryDateChange: String(formData?.OnlyDeliveryDateChange || ""),
      TicketID: String(formData?.Ticket || ""),
      PageSize: String(formData?.PageSize || ""),

      ManHourStatus: String(formData?.ManHourDropdown || ""),
      FromManHour: String(formData?.ManHourBefore || ""),
      ToManHour: String(formData?.ManHourAfter || ""),

      ClientManHourStatus: String(formData?.ClientManHourDropdown || ""),
      ClientFromManHour: String(formData?.ClientManHourBefore || ""),
      ClientToManHour: String(formData?.ClientManHourAfter || ""),

      ModuleID: String(formData?.ModuleName || ""),
      PagesID: String(formData?.PagesName || ""),
    };
    if (formData?.HideStatus == "") {
      toast.error("Please Select HideStatus.");
    } else {
      // setLoading(true)
      axiosInstances
        .post(apiUrls.ViewIssueSearch, paylaod)
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
        //   form.append("ProjectID", ProjectID),
        //   form.append("PageSize", formData?.PageSize),
        //   form.append("Ticket", formData?.Ticket ?? ""),
        //   form.append("VerticalID", formData?.VerticalID),
        //   form.append("TeamID", formData?.TeamID),
        //   form.append("IsExcel", formData?.SearhType),
        //   form.append("WingID", formData?.WingID),
        //   form.append("POC1", formData?.POC1),
        //   form.append("POC2", formData?.POC2),
        //   form.append("POC3", formData?.POC3),
        //   form.append("ReporterId", Reporter),
        //   form.append("ModuleID", formData?.ModuleName),
        //   form.append("PagesID", formData?.PagesName),
        //   form.append("AssignToID", AssignedTo),
        //   form.append("PriorityId", Priority),
        //   form.append("CategoryID", CategoryID),
        //   form.append("OnlyReOpen", formData?.OnlyReOpen),
        //   form.append("OnlyDeliveryDateChange", formData?.OnlyDeliveryDateChange),
        //   form.append("HideStatusId", HideStatusId),
        //   form.append("StatusId", StatusID),
        //   form.append("SubmittedDateStatus", formData?.SubmitDate),
        //   form.append(
        //     "DateFromSubmitted",
        //     formatDate(formData?.SubmitDateBefore)
        //       ? formatDate(formData?.SubmitDateBefore)
        //       : ""
        //   );
        // form.append(
        //   "DateToSubmitted",
        //   formatDate(formData?.SubmitDateAfter)
        //     ? formatDate(formData?.SubmitDateAfter)
        //     : ""
        // ),
        //   form.append("DeliveryDateStatus", formData?.DeliveryDate),
        //   form.append("ClientDeliveryDateStatus", formData?.ClientDeliveryDate),
        //   form.append("AssignedDateStatus", formData?.AssignedDate),
        //   form.append("ManHourStatus", formData?.ManHourDropdown),
        //   form.append("ClientManHourStatus", formData?.ClientManHourDropdown),
        //   form.append(
        //     "DeliveryFromDate",
        //     formatDate(deliveryDate || formData?.DeliveryDateBefore)
        //   ),
        //   form.append(
        //     "ClientDeliveryFromDate",
        //     formatDate(deliveryDate || formData?.ClientDeliveryDateBefore)
        //   ),
        //   form.append(
        //     "AssignedFromDate",
        //     formatDate(deliveryDate || formData?.AssignedDateBefore)
        //   ),
        //   form.append("FromManHour", formData?.ManHourBefore),
        //   form.append("ClientFromManHour", formData?.ClientManHourBefore),
        //   form.append(
        //     "Deliverytodate",
        //     formatDate(formData?.DeliveryDateAfter)
        //       ? formatDate(formData?.DeliveryDateAfter)
        //       : ""
        //   ),
        //   form.append(
        //     "Assignedtodate",
        //     formatDate(formData?.AssignedDateAfter)
        //       ? formatDate(formData?.AssignedDateAfter)
        //       : ""
        //   ),
        //   form.append(
        //     "ClientDeliverytodate",
        //     formatDate(formData?.ClientDeliveryDateAfter)
        //       ? formatDate(formData?.ClientDeliveryDateAfter)
        //       : ""
        //   ),
        //   form.append("ToManHour", formData?.ManHourAfter),
        //   form.append("ClientToManHour", formData?.ClientManHourAfter),
        //   form.append("ClosedDateStatus", formData?.CloseDate),
        //   form.append(
        //     "ClosedFromDate",
        //     formatDate(formData?.CloseDateBefore)
        //       ? formatDate(formData?.CloseDateBefore)
        //       : ""
        //   ),
        //   form.append(
        //     "Closedtodate",
        //     formatDate(formData?.CloseDateAfter)
        //       ? formatDate(formData?.CloseDateAfter)
        //       : ""
        //   ),
        //   form.append("LastUpdateDateStatus", formData?.UpadteDate),
        //   form.append(
        //     "LastUpdatedFromDate",
        //     formatDate(formData?.UpadteDateBefore)
        //       ? formatDate(formData?.UpadteDateBefore)
        //       : ""
        //   ),
        //   form.append(
        //     "LastUpdatedToDate",
        //     formatDate(formData?.UpadteDateAfter)
        //       ? formatDate(formData?.UpadteDateAfter)
        //       : ""
        //   ),
        //   form.append("ResolveDateStatus", formData?.ResolveDate || ""),
        //   form.append(
        //     "ResolveFromDate",
        //     formatDate(formData?.ResolveDateBefore)
        //       ? formatDate(formData?.ResolveDateBefore)
        //       : ""
        //   ),
        //   form.append(
        //     "Resolvetodate",
        //     formatDate(formData?.ResolveDateAfter)
        //       ? formatDate(formData?.ResolveDateAfter)
        //       : ""
        //   ),
        //   form.append("rowColor", code ? code : ""),
        //   form.append("PageNo", page ?? currentPage - 1);
        // setLoading(true);
        // await axios
        //   .post(apiUrls?.ViewIssueSearch, form, { headers })
        .then((res) => {
          setLoading(false);
          const data = res?.data?.data;

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
              UpdatePriorityDropdown: "",
              UpdatePriorityResolve: false,
              UpdatePriorityValue: "",
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
              isPriority: false,
              isAssignTo: false,
              isStatus: false,
              isProject: false,
              isSummary: false,
              HistoryResolve: "",
              AttachResolve: "",
              NotesResolve: "",
              SubTicketResolve: "",
              SubTicketMappingResolve: "",
            }));

            setTableData(updatedData);
            // tdRefs.current[0] = updatedData?.[0]?.index;
            // setSelectedRowIndex(updatedData?.[0]?.index);
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
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
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

  const handleDelete = () => {
    const filterdata = tableData?.filter((item) => item.IsActive == true);
    const ticketIDs = filterdata.map((item) => item.TicketID).join(",");
    if (ticketIDs == "") {
      toast.error("Please Select atleast one Ticket.");
    } else {
      axiosInstances
        .post(apiUrls.DeleteTicket, {
          TicketIDs: String(ticketIDs),
        })

        .then((res) => {
          toast.success(res?.data?.message);
          handleViewSearch();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSelectChange = (e, index) => {
    const { name, value } = e.target;
    const data = JSON.parse(JSON.stringify(tableData));
    // data[index][name] = value;
    data[index][name] = value;
    setTableData(data);
    setViewIssueDetail(data[index]);
  };
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

  const [visible, setVisible] = useState({
    showVisible: false,
    docVisible: false,
    noteVisible: false,
    docViewVisible: false,
    summaryVisible: false,
    closeVisible: false,
    attachVisible: false,
    notesVisible: false,
    historyVisible: false,
    subTicketVisible: false,
    SubTicketMappingVisisble: false,
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
  useEffect(() => {
    if (
      Array.isArray(location.state?.data) &&
      location.state?.data.length > 0 &&
      location.state?.data[0]?.Id > 0
    ) {
      setVisible({
        ticketVisible: true,
        showData: { ...location.state?.data[0], subTicketflag: true },
      });
    }
  }, [location.state?.data]);
  // const handleIconClickdate = (value, index) => {
  //   let data = [...tableData];
  //   data[index]["isDate"] = !data[index]["isDate"];
  //   setTableData(data);
  // };

  const handleIconClickdate = (value, index) => {
    let data = [...tableData];
    data[index]["isDate"] = !data[index]["isDate"];
    setTableData(data);

    // Delay to allow re-render of the DatePicker component
    setTimeout(() => {
      const ref = datePickerRefs.current[index];
      if (ref?.setOpen) {
        ref.setOpen(true); // react-datepicker style
      } else if (ref?.input) {
        ref.input.click(); // fallback for input-based calendars
      }
    }, 100);
  };

  const handleIconClientClickdate = (value, index) => {
    let data = [...tableData];
    data[index]["isClientDate"] = !data[index]["isClientDate"];
    setTableData(data);
  };
  const handleIconClickCategory = (value, index) => {
    let data = [...tableData];
    data[index]["isCategory"] = !data[index]["isCategory"];
    setTableData(data);
  };
  const handleIconClickPriority = (value, index) => {
    let data = [...tableData];
    data[index]["isPriority"] = !data[index]["isPriority"];
    setTableData(data);
  };
  const handleIconClickProject = (value, index) => {
    let data = [...tableData];
    data[index]["isProject"] = !data[index]["isProject"];
    setTableData(data);
  };
  const handleIconClickStatus = (value, index) => {
    let data = [...tableData];
    data[index]["isStatus"] = !data[index]["isStatus"];
    setTableData(data);
  };
  const handleIconClickAssignTo = (value, index) => {
    console.log(value);
    let data = [...tableData];
    data[index]["isAssignTo"] = !data[index]["isAssignTo"];
    setTableData(data);
    getAssignToValueProjectID(value?.ProjectID);
  };

  const searchHandleChangeTable = (name, value, index, ele) => {
    const details = tableData[index];
    let updatedData = [...tableData];
    updatedData[index][name] = value;
    setTableData(updatedData);

    updateReceivedDate(details, value, index, name);

    // console.log("raj check", details);
  };
  const searchHandleChangeTableClient = (name, value, index, ele) => {
    const details = tableData[index];
    let updatedData = [...tableData];
    updatedData[index][name] = value;
    setTableData(updatedData);

    ClientupdateReceivedDate(details, value, index, name);
    // console.log("raj check", details);
  };
  const updateReceivedDate = (details, item, value, name) => {
    // console.log("master check", details);
    axiosInstances
      .post(apiUrls.ApplyAction, {
        TicketIDs: String(details?.TicketID),
        ActionText: String(name),
        ActionId: formatDate(details?.DeliveryDate),
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
        ReOpenReasonID: "",
        ReOpenReason: "",
      })
      //     let form = new FormData();
      //     form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //       form.append(
      //         "LoginName",
      //         useCryptoLocalStorage("user_Data", "get", "realname")
      //       ),
      //       form.append("TicketIDs", details?.TicketID),
      //       form.append("ActionText", name),
      //       form.append("ActionId", formatDate(details?.DeliveryDate)),
      //       axios
      //         .post(apiUrls?.ApplyAction, form, { headers })
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
  const ClientupdateReceivedDate = (details, item, value, name) => {
    const finaldate = new Date(details?.ClientDeliveryDate);
    axiosInstances
      .post(apiUrls.ApplyAction, {
        TicketIDs: String(details?.TicketID),
        ActionText: "DeliveryDateClient",
        ActionId: formatDate(finaldate),
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
        ReOpenReasonID: "",
        ReOpenReason: "",
      })
      //     let form = new FormData();
      //     form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //       form.append(
      //         "LoginName",
      //         useCryptoLocalStorage("user_Data", "get", "realname")
      //       ),
      //       form.append("TicketIDs", details?.TicketID),
      //       form.append("ActionText", "DeliveryDateClient"),
      //       form.append("ActionId", formatDate(finaldate)),
      //       axios
      //         .post(apiUrls?.ApplyAction, form, { headers })
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
  const handleIconClick = (value, index) => {
    let data = [...tableData];
    data[index]["isManHour"] = !data[index]["isManHour"];
    setTableData(data);
  };
  const handleClientIconClick = (value, index) => {
    let data = [...tableData];
    data[index]["isClientManHour"] = !data[index]["isClientManHour"];
    setTableData(data);
  };
  const handleIconClickSummary = (value, index) => {
    let data = [...tableData];
    data[index]["isSummary"] = !data[index]["isSummary"];
    setTableData(data);
  };

  const [viewIssueDetail, setViewIssueDetail] = useState({});

  const handleManHourTable = (details) => {
    console.log("handleManHourTable", details);
    if (
      !details?.ManHour ||
      isNaN(details?.ManHour) ||
      Number(details?.ManHour) <= 0
    ) {
      toast.error("Developer Manminutes cannot be Zero or Empty.");
    } else {
      axiosInstances
        .post(apiUrls.ApplyAction, {
          TicketIDs: String(details?.TicketID),
          ActionText: "ManHours",
          ActionId: String(details?.ManHour),
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
          ReOpenReasonID: "",
          ReOpenReason: "",
        })
        .then((res) => {
          if (res.data.success === true) {
            toast.success(res?.data?.message);
            handleViewSearch();
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getProduct = () => {
    axiosInstances
      .post(apiUrls.GetProductVersion, {})
      .then((res) => {
        const states = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.id };
        });
        setProductVersion(states);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClientManHourTable = (details) => {
    // console.log("details manhour", details);
    axiosInstances
      .post(apiUrls.ApplyAction, {
        TicketIDs: String(details?.TicketID),
        ActionText: "ManHoursClient",
        ActionId: String(details?.ManHoursClient),
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
        ReOpenReasonID: "",
        ReOpenReason: "",
      })
      //     let form = new FormData();
      //     form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //       form.append(
      //         "LoginName",
      //         useCryptoLocalStorage("user_Data", "get", "realname")
      //       ),
      //       form.append("TicketIDs", details?.TicketID),
      //       form.append("ActionText", "ManHoursClient"),
      //       form.append("ActionId", details?.ManHoursClient),
      //       axios
      //         .post(apiUrls?.ApplyAction, form, { headers })
      .then((res) => {
        toast.success(res?.data?.message);
        handleViewSearch();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSummaryTable = (details) => {
    // console.log("SummaryTable", details);
    axiosInstances
      .post(apiUrls.ApplyAction, {
        TicketIDs: String(details?.TicketID),
        ActionText: "Summary",
        ActionId: "",
        RCA: "",
        ReferenceCode: "",
        ManHour: "",
        Summary: details?.summary,
        ModuleID: "",
        ModuleName: "",
        PagesID: "",
        PagesName: "",
        ManHoursClient: "",
        DeliveryDateClient: "",
        ReOpenReasonID: "",
        ReOpenReason: "",
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("TicketIDs", details?.TicketID),
      //   form.append("ActionText", "Summary"),
      //   form.append("Summary", details?.summary),
      //   axios
      //     .post(apiUrls?.ApplyAction, form, { headers })
      .then((res) => {
        toast.success(res?.data?.message);
        handleViewSearch();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {/* {shownodata && (
       <NoDataMessage show={shownodata} setShow={setShownodata} /> 
       )}  */}

      {visible?.showVisible && (
        <Modal
          modalWidth={"1100px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("View Ticket Details")}
          tableData={currentData}
          setTableData={setTableData}
        >
          <ViewIssueDetailsTableModal
            visible={visible}
            setVisible={setVisible}
            tableData={currentData}
            setTableData={setTableData}
          />
        </Modal>
      )}
      {visible?.historyVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("History Details")}
          tableData={currentData}
          setTableData={setTableData}
        >
          <ViewIssueCloseModal
            visible={visible}
            setVisible={setVisible}
            tableData={currentData}
            setTableData={setTableData}
          />
        </Modal>
      )}
      {visible?.subTicketVisible && (
        <Modal
          modalWidth={"1200px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Sub Ticket")}
          tableData={currentData}
          setTableData={setTableData}
        >
          <ReportIssue
            visibleTicket={visible}
            setVisible={setVisible}
            tableDataTicket={currentData}
            setTableData={setTableData}
          />
        </Modal>
      )}
      {visible?.SubTicketMappingVisisble && (
        <Modal
          modalWidth={"700px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Sub Ticket Mapping")}
          tableData={currentData}
          setTableData={setTableData}
        >
          <SubTicketMappping
            visibleTicket={visible}
            setVisible={setVisible}
            tableDataTicket={currentData}
            setTableData={setTableData}
          />
        </Modal>
      )}
      {visible?.attachVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Upload Documents"
        >
          <ViewIssueDocModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.notesVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Notes Details"
        >
          <ViewIssueNotesModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {/* {visible?.attachVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="View Documents"
        >
          <ViewIssueDocTable visible={visible} setVisible={setVisible} />
        </Modal>
      )} */}
      {visible?.summaryVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header="Summary Status"
        >
          <SummaryStatusModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      <div className="card ViewIssues border">
        <Heading
          title={<span style={{ fontWeight: "bold" }}>{t("View Ticket")}</span>}
          isBreadcrumb={data ? true : false}
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
                      height: "11px",
                      width: "15px",
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
                      height: "10px",
                      width: "13px",
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
                      height: "10px",
                      width: "13px",
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
                    className="legend-circle"
                    style={{
                      backgroundColor: "#fff494",
                      cursor: "pointer",
                      height: "11px",
                      width: "15px",
                      borderRadius: "50%",
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
                    style={{
                      backgroundColor: "#FF00FF",
                      cursor: "pointer",
                      height: "11px",
                      width: "15px",
                      marginLeft: "5px",
                      borderRadius: "50%",
                    }}
                    onClick={() => handleViewSearch("110", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("Delayed")}
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
                      backgroundColor: "#ffa500",
                      cursor: "pointer",
                      height: "11px",
                      width: "15px",
                      marginLeft: "5px",
                      borderRadius: "50%",
                    }}
                    onClick={() => handleViewSearch("120", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("Planned")}
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
                      backgroundColor: "#FFF000",
                      cursor: "pointer",
                      height: "11px",
                      width: "17px",
                      borderRadius: "50%",
                      marginLeft: "7px",
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
                      backgroundColor: "#c0a9eb",
                      cursor: "pointer",
                      height: "11px",
                      width: "13px",
                      borderRadius: "50%",
                    }}
                    onClick={() => handleViewSearch("65", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("Done on Local")}
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
                      backgroundColor: "#f7baed",
                      cursor: "pointer",
                      height: "11px",
                      width: "14px",
                      borderRadius: "50%",
                    }}
                    onClick={() => handleViewSearch("66", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("Tested on Local")}
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
                      width: "13px",
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
                      width: "12px",
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
                      backgroundColor: "#f70539",
                      cursor: "pointer",
                      height: "10px",
                      width: "12px",
                      borderRadius: "50%",
                      marginLeft: "4px",
                    }}
                    onClick={() => handleViewSearch("91", "0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("NotToDo")}
                  </span>
                </div>
                <button
                  className={`fa ${rowHandler.show ? "fa-arrow-up" : "fa-arrow-down"}`}
                  onClick={() => {
                    handlerow("show");
                  }}
                  style={{
                    cursor: "pointer",
                    border: "none",
                    color: "black",
                    borderRadius: "2px",
                    background: "none",
                    marginLeft: "30px",
                  }}
                ></button>
              </div>
            </div>
            // <div style={{ marginRight: "0px" }}>
            // <button
            //   className={`fa ${rowHandler.show ? "fa-arrow-up" : "fa-arrow-down"}`}
            //   onClick={() => {
            //     handlerow("show");
            //   }}
            //   style={{
            //     cursor: "pointer",
            //     border: "none",
            //     color: "black",
            //     borderRadius: "2px",
            //     background: "none",
            //   }}
            // ></button>
            // </div>
          }
        />

        {rowHandler.show && (
          <>
            <div className="row g-4 m-2">
              {clientId === 7 ? (
                ""
              ) : (
                <MultiSelectComp
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  name="VerticalID"
                  placeholderName={t("Vertical")}
                  dynamicOptions={vertical}
                  optionLabel="VerticalID"
                  className="VerticalID"
                  handleChange={handleMultiSelectChange}
                  // value={formData?.VerticalID?.map((code) => ({
                  //   code,
                  //   name: vertical.find((item) => item.code === code)?.name,
                  // }))}
                  value={
                    Array.isArray(formData?.VerticalID)
                      ? formData.VerticalID.map((code) => ({
                          code,
                          name: vertical.find((item) => item.code === code)
                            ?.name,
                        }))
                      : []
                  }
                />
              )}
              {clientId === 7 ? (
                ""
              ) : (
                <MultiSelectComp
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  name="TeamID"
                  placeholderName={t("Team")}
                  dynamicOptions={team}
                  handleChange={handleMultiSelectChange}
                  value={
                    Array.isArray(formData?.TeamID)
                      ? formData.TeamID.map((code) => ({
                          code,
                          name: team.find((item) => item.code === code)?.name,
                        }))
                      : []
                  }
                />
              )}
              {clientId === 7 ? (
                ""
              ) : (
                <MultiSelectComp
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  name="WingID"
                  placeholderName={t("Wing")}
                  dynamicOptions={wing}
                  handleChange={handleMultiSelectChange}
                  // value={formData?.WingID?.map((code) => ({
                  //   code,
                  //   name: wing.find((item) => item.code === code)?.name,
                  // }))}
                  value={
                    Array.isArray(formData?.WingID)
                      ? formData.WingID.map((code) => ({
                          code,
                          name: wing.find((item) => item.code === code)?.name,
                        }))
                      : []
                  }
                />
              )}
              {clientId === 7 ? (
                ""
              ) : (
                <MultiSelectComp
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  name="POC1"
                  placeholderName={t("POC-I")}
                  dynamicOptions={poc1}
                  handleChange={handleMultiSelectChange}
                  // value={formData?.POC1?.map((code) => ({
                  //   code,
                  //   name: poc1.find((item) => item.code === code)?.name,
                  // }))}
                  value={
                    Array.isArray(formData?.POC1)
                      ? formData.POC1.map((code) => ({
                          code,
                          name: poc1.find((item) => item.code === code)?.name,
                        }))
                      : []
                  }
                />
              )}
              {clientId === 7 ? (
                ""
              ) : (
                <MultiSelectComp
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  name="POC2"
                  placeholderName={t("POC-II")}
                  dynamicOptions={poc2}
                  handleChange={handleMultiSelectChange}
                  // value={formData?.POC2?.map((code) => ({
                  //   code,
                  //   name: poc2.find((item) => item.code === code)?.name,
                  // }))}
                  value={
                    Array.isArray(formData?.POC2)
                      ? formData.POC2.map((code) => ({
                          code,
                          name: poc2.find((item) => item.code === code)?.name,
                        }))
                      : []
                  }
                />
              )}
              {clientId === 7 ? (
                ""
              ) : (
                <MultiSelectComp
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  name="POC3"
                  placeholderName={t("POC-III")}
                  dynamicOptions={poc3}
                  handleChange={handleMultiSelectChange}
                  // value={formData?.POC3?.map((code) => ({
                  //   code,
                  //   name: poc3.find((item) => item.code === code)?.name,
                  // }))}
                  value={
                    Array.isArray(formData?.POC3)
                      ? formData.POC3.map((code) => ({
                          code,
                          name: poc3.find((item) => item.code === code)?.name,
                        }))
                      : []
                  }
                />
              )}

              <MultiSelectComp
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="ProjectID"
                placeholderName={t("Project")}
                dynamicOptions={project}
                handleChange={handleMultiSelectChange}
                // value={[641]}
                // value={formData?.ProjectID?.map((code) => ({
                //   code,
                //   name: project.find((item) => item.code === code)?.name,
                // }))}
                value={
                  Array.isArray(formData?.ProjectID)
                    ? formData.ProjectID.map((code) => ({
                        code,
                        name: project.find((item) => item.code === code)?.name,
                      }))
                    : []
                }
              />
              {clientId === 7 ? (
                ""
              ) : (
                <MultiSelectComp
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  name="Reporter"
                  placeholderName={t("Reporter")}
                  dynamicOptions={reporter}
                  handleChange={handleMultiSelectChange}
                  // value={formData?.Reporter?.map((code) => ({
                  //   code,
                  //   name: reporter.find((item) => item.code === code)?.name,
                  // }))}
                  value={
                    Array.isArray(formData?.Reporter)
                      ? formData.Reporter?.map((code) => ({
                          code,
                          name: reporter.find((item) => item.code === code)
                            ?.name,
                        }))
                      : []
                  }
                />
              )}
              <MultiSelectComp
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="AssignedTo"
                placeholderName={t("AssignedTo")}
                dynamicOptions={assignto}
                handleChange={handleMultiSelectChange}
                // value={formData?.AssignedTo?.map((code) => ({
                //   code,
                //   name: assignto?.find((item) => item?.code === code)?.name,
                // }))}
                value={
                  Array.isArray(formData?.AssignedTo)
                    ? formData.AssignedTo.map((code) => ({
                        code,
                        name: assignto.find((item) => item.code === code)?.name,
                      }))
                    : []
                }
              />
              <ReactSelect
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="Priority"
                placeholderName={t("Priority")}
                dynamicOptions={[{ label: "Select", value: "0" }, ...priority]}
                value={formData?.Priority}
                handleChange={handleDeliveryChange}
              />
              <MultiSelectComp
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="Category"
                placeholderName={t("Category")}
                dynamicOptions={category}
                handleChange={handleMultiSelectChange}
                // value={formData?.Category?.map((code) => ({
                //   code,
                //   name: category.find((item) => item.code === code)?.name,
                // }))}
                value={
                  Array.isArray(formData?.Category)
                    ? formData.Category.map((code) => ({
                        code,
                        name: category.find((item) => item.code === code)?.name,
                      }))
                    : []
                }
              />
              <ReactSelect
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="HideStatus"
                placeholderName="HideStatus"
                dynamicOptions={hidestatus}
                value={formData?.HideStatus}
                // defaultValue={status.find((option) => option.value === "resolved")}
                handleChange={handleDeliveryChange}
                requiredClassName={"required-fields"}
              />
              {/* <ReactSelect
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="Status"
                placeholderName={t("Status")}
                dynamicOptions={status}
                value={formData?.Status}
                handleChange={handleDeliveryChange}
              /> */}
              <MultiSelectComp
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="Status"
                lable="Status"
                placeholderName={t("Status")}
                dynamicOptions={status}
                value={(Array.isArray(formData?.Status)
                  ? formData.Status
                  : []
                ).map((code) => ({
                  code,
                  name: status?.find((item) => item?.code === code)?.name,
                }))}
                handleChange={handleMultiSelectChange}
              />

              <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                <div>
                  <ReactSelect
                    placeholderName={t("Assigned Date")}
                    id={"AssignedDate"}
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
                    lable="Assigned Date"
                    name="AssignedDate"
                    value={formData?.AssignedDate}
                    //   respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    className={"AssignedDate"}
                    handleChange={handleDeliveryChange}
                  />
                </div>
                {formData.AssignedDate == "2" && (
                  <>
                    <DatePicker
                      className="custom-calendar"
                      id="AssignedDateBefore"
                      name="AssignedDateBefore"
                      // lable={"Before"}
                      placeholder={VITE_DATE_FORMAT}
                      // respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
                      value={formData?.AssignedDateBefore}
                      handleChange={searchHandleChange}
                    />
                    <DatePicker
                      className="custom-calendar"
                      id="AssignedDateAfter"
                      name="AssignedDateAfter"
                      // lable={"After"}
                      placeholder={VITE_DATE_FORMAT}
                      // respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
                      value={formData?.AssignedDateAfter}
                      handleChange={searchHandleChange}
                    />
                  </>
                )}
                {["3", "4", "5", "6", "7"].includes(formData.AssignedDate) ? (
                  <DatePicker
                    className="custom-calendar"
                    id="AssignedDateBefore"
                    name="AssignedDateBefore"
                    // lable={"Current"}
                    placeholder={VITE_DATE_FORMAT}
                    // respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                    value={new Date(formData?.AssignedDateBefore)}
                    handleChange={searchHandleChange}
                  />
                ) : (
                  ""
                )}
              </div>
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
                    id={"DeliveryDate"}
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
                    lable="Delivery Date"
                    name="DeliveryDate"
                    value={formData?.DeliveryDate}
                    //   respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    className={"DeliveryDate"}
                    handleChange={handleDeliveryChange}
                  />
                </div>
                {formData.DeliveryDate == "2" && (
                  <>
                    <DatePicker
                      className="custom-calendar"
                      id="DeliveryDateBefore"
                      name="DeliveryDateBefore"
                      // lable={"Before"}
                      placeholder={VITE_DATE_FORMAT}
                      // respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
                      value={formData?.DeliveryDateBefore}
                      handleChange={searchHandleChange}
                    />
                    <DatePicker
                      className="custom-calendar"
                      id="DeliveryDateAfter"
                      name="DeliveryDateAfter"
                      // lable={"After"}
                      placeholder={VITE_DATE_FORMAT}
                      // respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
                      value={formData?.DeliveryDateAfter}
                      handleChange={searchHandleChange}
                    />
                  </>
                )}
                {["3", "4", "5", "6", "7"].includes(formData.DeliveryDate) ? (
                  <DatePicker
                    className="custom-calendar"
                    id="DeliveryDateBefore"
                    name="DeliveryDateBefore"
                    // lable={"Current"}
                    placeholder={VITE_DATE_FORMAT}
                    // respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                    value={new Date(formData?.DeliveryDateBefore)}
                    handleChange={searchHandleChange}
                  />
                ) : (
                  ""
                )}
              </div>
              {ShowClientDeliveryDate == 1 && (
                <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                  <div>
                    <ReactSelect
                      placeholderName={t("Delivery Date-")}
                      id={"ClientDeliveryDate"}
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
                      lable="Delivery Date-"
                      name="ClientDeliveryDate"
                      value={formData?.ClientDeliveryDate}
                      //   respclass="col-xl-2 col-md-4 col-sm-4 col-12"
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
                        // respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
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
                  {["3", "4", "5", "6", "7"].includes(
                    formData.ClientDeliveryDate
                  ) ? (
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
              )}
              <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                <div>
                  <ReactSelect
                    placeholderName={t("Resolve Date")}
                    id={"ResolveDate"}
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
                    lable="Resolve Date"
                    name="ResolveDate"
                    value={formData?.ResolveDate}
                    //   respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    className={"ResolveDate"}
                    handleChange={handleDeliveryChange}
                  />
                </div>
                {formData.ResolveDate == "2" && (
                  <>
                    <DatePicker
                      className="custom-calendar"
                      id="ResolveDateBefore"
                      name="ResolveDateBefore"
                      // lable={"Before"}
                      placeholder={VITE_DATE_FORMAT}
                      // respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
                      value={formData?.ResolveDateBefore}
                      handleChange={searchHandleChange}
                    />
                    <DatePicker
                      className="custom-calendar"
                      id="ResolveDateAfter"
                      name="ResolveDateAfter"
                      // lable={"After"}
                      placeholder={VITE_DATE_FORMAT}
                      // respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
                      value={formData?.ResolveDateAfter}
                      handleChange={searchHandleChange}
                    />
                  </>
                )}

                {formData.ResolveDate == "4" ||
                formData.ResolveDate == "5" ||
                formData.ResolveDate == "6" ||
                formData.ResolveDate == "7" ||
                formData.ResolveDate == "3" ? (
                  <DatePicker
                    className="custom-calendar"
                    id="ResolveDateBefore"
                    name="ResolveDateBefore"
                    // lable={"Current"}
                    placeholder={VITE_DATE_FORMAT}
                    // respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                    value={formData?.ResolveDateBefore}
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

              {clientId === 7 ? (
                ""
              ) : (
                <div className="col-xl-2 col-md-4 col-sm-4 col-12 mt-1">
                  <div>
                    <ReactSelect
                      placeholderName={t("ManMinutes")}
                      id={"ManHourDropdown"}
                      dynamicOptions={[
                        { label: "Any", value: "0" },
                        { label: "Between", value: "2" },
                        { label: "Before", value: "4" },
                        { label: "After", value: "6" },
                        { label: "OnOrBefore", value: "3" },
                        { label: "On", value: "5" },
                        { label: "OnOrAfter", value: "7" },
                        { label: "WithoutManHour", value: "9" },
                      ]}
                      searchable={true}
                      lable="ManMinutes"
                      name="ManHourDropdown"
                      value={formData?.ManHourDropdown}
                      //  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                      className={"ManHourDropdown"}
                      handleChange={handleDeliveryChange}
                    />
                  </div>

                  <div>
                    {formData.ManHourDropdown == "2" && (
                      <>
                        <Input
                          type="number"
                          className="form-control mt-2"
                          id="ManHourBefore"
                          name="ManHourBefore"
                          lable="From ManMinutes"
                          respclass="col-14"
                          value={formData?.ManHourBefore}
                          onChange={searchHandleChange}
                        />
                        <Input
                          type="number"
                          className="form-control mt-2"
                          id="ManHourAfter"
                          name="ManHourAfter"
                          lable="To ManMinutes"
                          // placeholder={" "}
                          respclass="col-14"
                          value={formData?.ManHourAfter}
                          onChange={searchHandleChange}
                        />
                      </>
                    )}

                    {formData.ManHourDropdown == "4" ||
                    formData.ManHourDropdown == "5" ||
                    formData.ManHourDropdown == "6" ||
                    formData.ManHourDropdown == "7" ||
                    formData.ManHourDropdown == "3" ? (
                      <Input
                        type="number"
                        className="form-control mt-2"
                        id="ManHourBefore"
                        name="ManHourBefore"
                        lable={"Enter ManMinutes"}
                        // placeholder={""}
                        respclass="col-14"
                        value={formData?.ManHourBefore}
                        onChange={searchHandleChange}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}

              {ShowClientManHour === 1 && (
                <div className="col-xl-2 col-md-4 col-sm-4 col-12 mt-1">
                  <div>
                    <ReactSelect
                      placeholderName={t("ManMinutes-")}
                      id={"ClientManHourDropdown"}
                      dynamicOptions={[
                        { label: "Any", value: "0" },
                        { label: "Between", value: "2" },
                        { label: "Before", value: "4" },
                        { label: "After", value: "6" },
                        { label: "OnOrBefore", value: "3" },
                        { label: "On", value: "5" },
                        { label: "OnOrAfter", value: "7" },
                        { label: "WithoutManHour", value: "9" },
                      ]}
                      searchable={true}
                      lable="ClientManMinutes"
                      name="ClientManHourDropdown"
                      value={formData?.ClientManHourDropdown}
                      //  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                      className={"ClientManHourDropdown"}
                      handleChange={handleDeliveryChange}
                    />
                  </div>

                  <div>
                    {formData.ClientManHourDropdown == "2" && (
                      <>
                        <Input
                          type="number"
                          className="form-control mt-2"
                          id="ClientManHourBefore"
                          name="ClientManHourBefore"
                          lable="From ManMinutes-"
                          respclass="col-14"
                          value={formData?.ClientManHourBefore}
                          onChange={searchHandleChange}
                        />
                        <Input
                          type="number"
                          className="form-control mt-2"
                          id="ClientManHourAfter"
                          name="ClientManHourAfter"
                          lable="To ManMinutes-"
                          // placeholder={" "}
                          respclass="col-14"
                          value={formData?.ClientManHourAfter}
                          onChange={searchHandleChange}
                        />
                      </>
                    )}

                    {formData.ClientManHourDropdown == "4" ||
                    formData.ClientManHourDropdown == "5" ||
                    formData.ClientManHourDropdown == "6" ||
                    formData.ClientManHourDropdown == "7" ||
                    formData.ClientManHourDropdown == "3" ? (
                      <Input
                        type="number"
                        className="form-control mt-2"
                        id="ClientManHourBefore"
                        name="ClientManHourBefore"
                        lable={"Enter ManMinutes-"}
                        // placeholder={""}
                        respclass="col-14"
                        value={formData?.ClientManHourBefore}
                        onChange={searchHandleChange}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}
              {clientId === 7 ? (
                ""
              ) : (
                <MultiSelectComp
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
                  name="Incharge"
                  placeholderName={t("Incharge")}
                  dynamicOptions={incharge}
                  value={
                    Array.isArray(formData?.Incharge)
                      ? formData?.Incharge?.map((code) => ({
                          code,
                          name: incharge?.find((item) => item.code === code)
                            ?.name,
                        }))
                      : []
                  }
                  handleChange={handleMultiSelectChange}
                />
              )}
              {clientId === 7 ? (
                ""
              ) : (
                <ReactSelect
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12 mt-1"
                  name="ProductVersion"
                  placeholderName="Product Version"
                  dynamicOptions={productversion}
                  handleChange={handleDeliveryChange}
                  value={formData.ProductVersion}
                />
              )}
              {clientId === 7 ? (
                ""
              ) : (
                <MultiSelectComp
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
                  name="ModuleName"
                  placeholderName={t("ModuleName")}
                  dynamicOptions={moduleName}
                  value={
                    Array.isArray(formData?.ModuleName)
                      ? formData?.ModuleName?.map((code) => ({
                          code,
                          name: moduleName?.find((item) => item.code === code)
                            ?.name,
                        }))
                      : []
                  }
                  handleChange={handleMultiSelectChange}
                />
              )}

              {clientId === 7 ? (
                ""
              ) : (
                <ReactSelect
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
                  name="PagesName"
                  placeholderName={t("PageName")}
                  dynamicOptions={pageName}
                  value={formData?.PagesName}
                  handleChange={handleDeliveryChange}
                  // requiredClassName={"required-fields"}
                />
              )}

              <ReactSelect
                respclass="col-xl-2 mt-1 col-md-4 col-sm-6 col-12"
                name="SearhType"
                placeholderName={t("Searh Type")}
                dynamicOptions={[
                  // { label: "Select", value: "All" },
                  { label: "Onscreen", value: "0" },
                  { label: "Excel Type-I", value: "1" },
                  { label: "Excel Type-II", value: "2" },
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

              {/* <div className="col-xl-8 col-md-5 col-sm-6 col-12 mt-1 d-flex"> */}
                {/* <div className="d-flex"> */}
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
                      {t("OnlyReOpen")}
                    </span>
                  </div>
                </div>
                <div className="search-col" style={{ marginLeft: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                      <input
                        type="checkbox"
                        name="OnlyDeliveryDateChange"
                        checked={formData?.OnlyDeliveryDateChange ? 1 : 0}
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
                      {t("ChangeDeliveryDate")}
                    </span>
                  </div>
                </div>
                <div className="search-col" style={{ marginLeft: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                      <input
                        type="checkbox"
                        name="DelayedTicket"
                        checked={formData?.DelayedTicket ? 1 : 0}
                        onChange={handleDelayCheckBox}
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
                      {t("DelayedTicket")}
                    </span>
                  </div>
                </div>
                {formData?.DelayedTicket == "1" ? (
                  <ReactSelect
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name="DelayedTicketType"
                    placeholderName={t("Delayed Type")}
                    dynamicOptions={[
                      {
                        label: "Select",
                        value: "0",
                      },
                      {
                        label: "1 Day Delay",
                        value: "1",
                      },
                      {
                        label: "1 Week Delay",
                        value: "2",
                      },
                      {
                        label: "1 Month Delay",
                        value: "3",
                      },
                    ]}
                    value={formData?.DelayedTicketType}
                    handleChange={handleDeliveryChange}
                  />
                ) : (
                  ""
                )}
                <button
                  className="btn btn-sm btn-success ml-3"
                  onClick={() => handleViewSearch(undefined, "0")}
                >
                  {t("Apply Filter")}
                </button>
                <button
                  className="btn btn-sm btn-danger ml-2"
                  onClick={handleReset}
                >
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
              {/* </div> */}
              {/* </div> */}
            </div>
          </>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          {tableData?.length > 0 ? (
            <>
              <div className="card mt-2" style={{ marginTop: "10px" }}>
                <Heading
                  title={
                    <span style={{ fontWeight: "bold" }}>
                      {t("Issue Details")}
                    </span>
                  }
                  secondTitle={
                    <div>
                      <span style={{ fontWeight: "bold" }}>
                        {t("Total Manager ManMinutes")} : &nbsp;{" "}
                        {tableData[0]?.SumOfManMinute}
                      </span>
                      <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                        {t("Total Dev. ManMinutes")} : &nbsp;{" "}
                        {tableData?.reduce(
                          (acc, curr) =>
                            acc + (Number(curr?.ReferenceCode) || 0),
                          0
                        )}
                      </span>
                      <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                        {t("Total Records")} : &nbsp;{" "}
                        {tableData[0]?.TotalRecord}
                      </span>
                    </div>
                  }
                />

                <Tables
                  style={{ width: "100%", height: "100%" }}
                  thead={viewissuesTHEAD}
                  // ref={(el) => (tdRefs.current[0] = el)}
                  tbody={currentData?.map((ele, index) => ({
                    "S.No.": (currentPage - 1) * formData?.PageSize + index + 1,
                    // Notes:
                    //   ele?.NoteCount === 0 ? (
                    //     <i
                    //       className="fa fa-file"
                    //       onClick={() => {
                    //         setVisible({
                    //           noteVisible: true,
                    //           showData: ele,
                    //           ele,
                    //         });
                    //       }}
                    //       style={{
                    //         cursor:
                    //           ele?.Status === "closed"
                    //             ? "not-allowed"
                    //             : "pointer",
                    //         color: "black",
                    //         marginLeft: "10px",
                    //       }}
                    //     ></i>
                    //   ) : (
                    //     <i
                    //       className="fa fa-file"
                    //       onClick={() => {
                    //         setVisible({
                    //           noteVisible: true,
                    //           showData: ele,
                    //           ele,
                    //         });
                    //       }}
                    //       style={{
                    //         cursor:
                    //           ele?.Status === "closed"
                    //             ? "not-allowed"
                    //             : "pointer",
                    //         color: "green",
                    //         marginLeft: "10px",
                    //       }}
                    //     ></i>
                    //   ),
                    // Attach:
                    //   ele?.AttachmentCount === 0 ? (
                    //     <i
                    //       className="fa fa-upload"
                    //       onClick={() => {
                    //         setVisible({
                    //           docVisible: true,
                    //           showData: ele,
                    //           ele,
                    //         });
                    //       }}
                    //       style={{
                    //         cursor:
                    //           ele?.Status === "closed"
                    //             ? "not-allowed"
                    //             : "pointer",
                    //         color: "black",
                    //         marginLeft: "10px",
                    //       }}
                    //       title="Upload Document."
                    //     ></i>
                    //   ) : (
                    //     <i
                    //       className="fa fa-upload"
                    //       onClick={() => {
                    //         setVisible({
                    //           docViewVisible: true,
                    //           showData: ele,
                    //           ele,
                    //         });
                    //       }}
                    //       style={{
                    //         cursor:
                    //           ele?.Status === "closed"
                    //             ? "not-allowed"
                    //             : "pointer",
                    //         color: "green",
                    //         marginLeft: "10px",
                    //       }}
                    //       title="View Documents"
                    //     ></i>
                    //   ),
                    View: (
                      <div>
                        <ReactSelectIcon
                          // style={{ width: "80%" }}
                          name="TableAttach"
                          id="TableAttach"
                          respclass="width30px"
                          placeholderName=""
                          dynamicOptions={[
                            { label: "Notes", value: "Notes" },
                            { label: "File", value: "Attach" },
                            { label: "History", value: "History" },
                            { label: "Sub Ticket", value: "SubTicket" },
                            {
                              label: "Sub Ticket Mapping",
                              value: "SubTicketMapping",
                            },
                          ]}
                          value={ele?.TableAttach}
                          handleChange={(name, value) => {
                            const ind =
                              (currentPage - 1) * formData?.PageSize + index;
                            handleDeliveryChangeAttach(
                              name,
                              value?.value,
                              ind,
                              index,
                              ele
                            );
                          }}
                        />
                      </div>
                    ),
                    Select: (
                      <>
                        <Input
                          disabled={ele?.Status == "closed"}
                          type="checkbox"
                          name="IsActive"
                          checked={ele?.IsActive}
                          onChange={(e) =>
                            handleDeliveryChangeCheckbox(e, index)
                          }
                        />
                      </>
                    ),
                    "Ticket ID": (
                      <div
                        style={{
                          // border: "1px solid black",
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
                          <>
                            <Link
                              // onClick={() => {
                              //   setVisible({
                              //     ticketVisible: true,
                              //     showData: ele,
                              //   });
                              // }}
                              // title="Click to Show SubTicket"
                              className="mt-2"
                            >
                              <span
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  color: "#c75685",
                                  marginBottom: "6px",
                                }}
                              >
                                {ele?.ReferenceTicketID
                                  ? ele?.ReferenceTicketID
                                  : ""}
                                {ele?.ReferenceTicketID > 0 ? (
                                  <i className="fa fa-star ml-1"></i>
                                ) : (
                                  ""
                                )}
                              </span>
                            </Link>

                            <Link
                              onClick={() => {
                                setVisible({
                                  showVisible: true,
                                  showData: ele,
                                });
                              }}
                              title="Click to Show"
                            >
                              <span
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                {ele?.TicketID}{" "}
                              </span>
                            </Link>
                          </>
                        )}
                      </div>
                    ),

                    "Project Name": (
                      <div className="d-flex align-items-center justify-content-between">
                        {!ele?.isProject && (
                          <div style={{ width: "100%" }}>
                            {" "}
                            <Tooltip label={ele?.ProjectName}>
                              <span
                                id={`projectName-${index}`}
                                targrt={`projectName-${index}`}
                                style={{ textAlign: "center" }}
                              >
                                {shortenNamesummary(ele?.ProjectName)}
                              </span>
                            </Tooltip>
                          </div>
                        )}

                        <div className="d-flex align-items-center justify-content-between">
                          {clientId === 7 ? (
                            ""
                          ) : (
                            <i
                              className="fa fa-eye ml-2 mr-2"
                              onClick={() =>
                                ele?.Status !== "closed" &&
                                handleIconClickProject(ele, index)
                              }
                              style={{
                                cursor:
                                  ele?.Status === "closed"
                                    ? "not-allowed"
                                    : "pointer",
                                pointerEvents:
                                  ele?.Status === "closed" ? "none" : "auto",
                              }}
                            ></i>
                          )}

                          {ele?.isProject && (
                            <ReactSelect
                              style={{ width: "100%" }}
                              height={"6px"}
                              name="MoveDropDownValue"
                              id="MoveDropDownValue"
                              respclass="width100px"
                              placeholderName="Move"
                              dynamicOptions={updateProject}
                              value={ele?.MoveDropDownValue}
                              handleChange={(name, value) => {
                                handleAgainChange(name, value, index);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ),

                    "Category Name": (
                      <div className="d-flex align-items-center justify-content-between">
                        {!ele?.isCategory && (
                          <div>
                            {
                              <Tooltip label={ele?.Category}>
                                <span
                                  id={`projectName-${index}`}
                                  targrt={`projectName-${index}`}
                                  style={{ textAlign: "center" }}
                                >
                                  {shortenNamesummary(ele?.Category)}
                                </span>
                              </Tooltip>
                            }
                          </div>
                        )}

                        <div className="d-flex align-items-center justify-content-between ">
                          {clientId === 7 ? (
                            ""
                          ) : (
                            <i
                              className="fa fa-eye ml-2 mr-2"
                              onClick={() =>
                                ele?.Status !== "closed" &&
                                handleIconClickCategory(ele, index)
                              }
                              style={{
                                cursor:
                                  ele?.Status === "closed"
                                    ? "not-allowed"
                                    : "pointer",
                                pointerEvents:
                                  ele?.Status === "closed" ? "none" : "auto",
                              }}
                            ></i>
                          )}

                          {ele?.isCategory && (
                            <ReactSelect
                              style={{ width: "100%", marginLeft: "3px" }}
                              height={"6px"}
                              name="UpdateCategoryValue"
                              respclass="width80px"
                              id="UpdateCategoryValue"
                              placeholderName="Category"
                              dynamicOptions={updatecategory}
                              value={ele?.UpdateCategoryValue}
                              handleChange={(name, value) => {
                                handleAgainChange(name, value, index);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ),
                    "Reporter Name": (
                      <Tooltip label={ele?.ReporterName}>
                        <span
                          id={`projectName-${index}`}
                          targrt={`projectName-${index}`}
                          style={{ textAlign: "center" }}
                        >
                          {shortenNamesummary(ele?.ReporterName)}
                        </span>
                      </Tooltip>
                    ),

                    "Assign To": (
                      <div className="d-flex align-items-center justify-content-between">
                        {!ele?.isAssignTo && (
                          <div>
                            {
                              <Tooltip label={ele?.AssignTo}>
                                <span
                                  id={`projectName-${index}`}
                                  targrt={`projectName-${index}`}
                                  style={{ textAlign: "center" }}
                                >
                                  {shortenNamesummary(ele?.AssignTo)}
                                </span>
                              </Tooltip>
                            }
                          </div>
                        )}

                        <div className="d-flex align-items-center justify-content-between ">
                          {clientId === 7 ? (
                            ""
                          ) : (
                            <i
                              className="fa fa-eye ml-2 mr-2"
                              onClick={() =>
                                handleIconClickAssignTo(ele, index)
                              }
                              style={{
                                cursor:
                                  ele?.Status === "closed"
                                    ? "not-allowed"
                                    : "pointer",
                                pointerEvents:
                                  ele?.Status === "closed" ? "none" : "auto",
                              }}
                            ></i>
                          )}

                          {ele?.isAssignTo && (
                            <>
                              {/* {AllowManHourEdit == 1 ? (
                                <Input
                                  type="text"
                                  className="form-control mt-1 required-fields"
                                  id="AssignToManHour"
                                  name="AssignToManHour"
                                  lable="Minutes"
                                  value={
                                    ele?.ManHour
                                      ? ele?.ManHour
                                      : ele?.AssignToManHour
                                  }
                                  respclass="width801px"
                                  // disabled={ele?.ManHour > 0}
                                  style={{ width: "50%" }}
                                  onChange={(e) => handleSelectChange(e, index)}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  className="form-control mt-1 required-fields"
                                  id="AssignToManHour"
                                  name="AssignToManHour"
                                  lable="Minutes"
                                  value={
                                    ele?.ManHour
                                      ? ele?.ManHour
                                      : ele?.AssignToManHour
                                  }
                                  respclass="width801px"
                                  // disabled={ele?.ManHour > 0}
                                  style={{ width: "50%" }}
                                  onChange={(e) => handleSelectChange(e, index)}
                                />
                              )} */}
                              <ReactSelect
                                style={{ width: "100%", marginLeft: "3px" }}
                                height={"6px"}
                                name="AssignDropDownValue"
                                respclass="width110px"
                                id="AssignDropDownValue"
                                placeholderName="Assign"
                                dynamicOptions={assigntoValueProjectId}
                                value={ele?.AssignDropDownValue}
                                handleChange={(name, value) => {
                                  handleAgainChange(name, value, index, ele);
                                }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    ),

                    Priority: (
                      <div className="d-flex align-items-center justify-content-between">
                        {!ele?.isPriority && (
                          <div>
                            {
                              <Tooltip label={ele?.Priority}>
                                <span
                                  id={`projectName-${index}`}
                                  targrt={`projectName-${index}`}
                                  style={{ textAlign: "center" }}
                                >
                                  {shortenNamesummary(ele?.Priority)}
                                </span>
                              </Tooltip>
                            }
                          </div>
                        )}

                        <div className="d-flex align-items-center justify-content-between ">
                          {clientId === 7 ? (
                            ""
                          ) : (
                            <i
                              className="fa fa-eye ml-2 mr-2"
                              onClick={() =>
                                ele?.Status !== "closed" &&
                                handleIconClickPriority(ele, index)
                              }
                              style={{
                                cursor:
                                  ele?.Status === "closed"
                                    ? "not-allowed"
                                    : "pointer",
                                pointerEvents:
                                  ele?.Status === "closed" ? "none" : "auto",
                              }}
                            ></i>
                          )}

                          {ele?.isPriority && (
                            <ReactSelect
                              style={{ width: "100%", marginLeft: "3px" }}
                              height={"6px"}
                              name="UpdatePriorityValue"
                              respclass="width90px"
                              id="UpdatePriorityValue"
                              placeholderName="Priority"
                              dynamicOptions={[
                                { label: "Select", value: "0" },
                                ...priority,
                              ]}
                              value={ele?.UpdatePriorityValue}
                              handleChange={(name, value) => {
                                handleAgainChange(name, value, index);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ),
                    Summary: (
                      <>
                        <div className="d-flex align-items-center justify-content-between">
                          {!ele?.isSummary && (
                            <div style={{ width: "178px" }}>
                              <span
                                style={{
                                  whiteSpace: "normal",
                                  cursor:
                                    ele?.Status === "closed"
                                      ? "not-allowed"
                                      : "pointer",
                                  pointerEvents:
                                    ele?.Status === "closed" ? "none" : "auto",
                                }}
                                id={`summary-${index}`}
                                targrt={`summary-${index}`}
                                title={ele?.summary}
                              >
                                {ele?.summary}
                              </span>
                            </div>
                            // <Tooltip label={ele?.summary}>
                            //   <span
                            //     id={`projectName-${index}`}
                            //     targrt={`projectName-${index}`}
                            //     // style={{ textAlign: "center" }}
                            //     style={{
                            //       whiteSpace: "normal",
                            //       cursor:
                            //         ele?.Status === "closed"
                            //           ? "not-allowed"
                            //           : "pointer",
                            //       pointerEvents:
                            //         ele?.Status === "closed" ? "none" : "auto",
                            //     }}
                            //   >
                            //     {shortenName(ele?.summary)}
                            //   </span>
                            // </Tooltip>
                          )}

                          <div className="d-flex align-items-center justify-content-between">
                            {clientId === 7 ? (
                              ""
                            ) : (
                              <>
                                <i
                                  className="fa fa-edit mr-1"
                                  aria-hidden="true"
                                  onClick={() =>
                                    handleIconClickSummary(ele, index)
                                  }
                                  style={{
                                    cursor:
                                      ele?.Status === "closed"
                                        ? "not-allowed"
                                        : "pointer",
                                    pointerEvents:
                                      ele?.Status === "closed"
                                        ? "none"
                                        : "auto",
                                  }}
                                ></i>
                                <i
                                  className="fa fa-eye"
                                  onClick={() => {
                                    setVisible({
                                      summaryVisible: true,
                                      showData: ele,
                                      ele,
                                    });
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    color: "black",
                                    marginLeft: "2px",
                                  }}
                                  title="View Summary"
                                ></i>
                              </>
                            )}

                            {ele?.isSummary && (
                              <>
                                <textarea
                                  type="text"
                                  className="summaryheight"
                                  id="summary"
                                  name="summary"
                                  disabled={ele?.Status === "closed"}
                                  lable="summary"
                                  onChange={(e) => handleSelectChange(e, index)}
                                  value={ele?.summary}
                                ></textarea>
                                <button
                                  className="btn btn-xs btn-success ml-2"
                                  onClick={() => {
                                    handleSummaryTable(ele);
                                  }}
                                  disabled={ele?.Status === "closed"}
                                >
                                  Save
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    ),
                    Status: ele?.Status,
                    "Date Submitted": ele?.TicketRaisedDate,
                    "Delivery Date": (
                      // clientId === 7 ? (
                      //   ""
                      // ) : (

                      <div className="d-flex align-items-center justify-content-between">
                        {/* {AllowDeliveryDateEdit == 1 ? (
                          <div>{ele?.CurrentDeliveryDate}</div>
                        ) : (
                          ""
                        )} */}

                        {ele?.isDate ? (
                          <>
                            <DatePicker
                              className="custom-calendar"
                              ref={(ref) =>
                                (datePickerRefs.current[index] = ref)
                              }
                              id="DeliveryDate"
                              name="DeliveryDate"
                              lable="Delivery Date"
                              placeholder={VITE_DATE_FORMAT}
                              value={
                                ele?.CurrentDeliveryDate == "01-Jan-0001"
                                  ? ""
                                  : ele?.CurrentDeliveryDate
                              }
                              respclass="width110px mt-3"
                              handleChange={(e) => {
                                const { name, value } = e.target;
                                searchHandleChangeTable(
                                  name,
                                  value,
                                  index,
                                  ele
                                );
                              }}
                              onFocus={() => ref?.setOpen?.(true)}
                            />
                          </>
                        ) : (
                          <>
                            <div>
                              <span
                                style={{
                                  backgroundColor:
                                    ele?.DeliveryDateChangeCount > 0
                                      ? "#f06f48"
                                      : "",
                                  padding:
                                    ele?.DeliveryDateChangeCount > 0
                                      ? "5px"
                                      : "",
                                }}
                              >
                                {ele?.CurrentDeliveryDate === "01-Jan-0001"
                                  ? ""
                                  : ele?.CurrentDeliveryDate}
                              </span>
                            </div>
                          </>
                        )}
                        <div className="">
                          {AllowDeliveryDateEdit == 1 ||
                          [
                            // "Modification",
                            // "Bug",
                            // "New Requirment",
                            // "Paid Request",
                            "Application Not Working",
                            "Application Slow",
                            "Auto - Archive",
                            "Autobackup",
                            "Emailing",
                            "Mobile App",
                            "New Machine",
                            "OLD Machine Interfacing",
                            "Server Management",
                            "SMS",
                            "SRS",
                            "Support",
                            "Support CheckList",
                            "Training",
                          ].includes(ele.Category) ? (
                            <>
                              <i
                                className="fa fa-calendar ml-2 mr-2"
                                onClick={() => handleIconClickdate(ele, index)}
                                style={{
                                  cursor:
                                    ele?.Status === "closed"
                                      ? "not-allowed"
                                      : "pointer",
                                  pointerEvents:
                                    ele?.Status === "closed" ? "none" : "auto",
                                }}
                              ></i>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ),
                    // ),
                    "M.ManMinutes": (
                      <div className="d-flex align-items-center justify-content-between">
                        {!ele?.isManHour && <div>{ele?.ManHour}</div>}

                        <div className="d-flex align-items-center justify-content-between">
                          {AllowManHourEdit == 1 ||
                          [
                            // "Modification",
                            // "Bug",
                            // "New Requirment",
                            // "Paid Request",
                            "Application Not Working",
                            "Application Slow",
                            "Auto - Archive",
                            "Autobackup",
                            "Emailing",
                            "Mobile App",
                            "New Machine",
                            "OLD Machine Interfacing",
                            "Server Management",
                            "SMS",
                            "SRS",
                            "Support",
                            "Support CheckList",
                            "Training",
                          ].includes(ele.Category) ? (
                            <label htmlFor="ManHour">
                              <i
                                className="fa fa-clock mr-2"
                                onClick={() => handleIconClick(ele, index)}
                                style={{
                                  cursor:
                                    ele?.Status === "closed"
                                      ? "not-allowed"
                                      : "pointer",
                                  pointerEvents:
                                    ele?.Status === "closed" ? "none" : "auto",
                                }}
                              ></i>
                            </label>
                          ) : (
                            ""
                          )}

                          {ele?.isManHour && (
                            <>
                              <Input
                                type="text"
                                className="form-control"
                                id="ManHour"
                                name="ManHour"
                                lable=""
                                onChange={(e) => handleSelectChange(e, index)}
                                value={ele?.ManHour}
                                respclass="width50px"
                              />
                              <button
                                className="btn btn-xs btn-success ml-2"
                                onClick={() => {
                                  handleManHourTable(ele);
                                }}
                              >
                                Save
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ),

                    "Change Action":
                      clientId === 7 ? (
                        ""
                      ) : (
                        <>
                          <ReactSelect
                            style={{ width: "100%", marginLeft: "10px" }}
                            height={"6px"}
                            name="TableStatus"
                            id="TableStatus"
                            respclass="width110px"
                            placeholderName="Action"
                            dynamicOptions={filteredOptions}
                            isDisabled={ele?.Status == "closed"}
                            value={ele?.TableStatus}
                            handleChange={(name, value) => {
                              const ind =
                                (currentPage - 1) * formData?.PageSize + index;
                              handleDeliveryChangeValue(
                                name,
                                value?.value,
                                ind,
                                index,
                                ele
                              );
                            }}
                          />

                          <div
                            style={{
                              display: "flex",
                              marginRight: "3px",
                              width: "350px !important",
                              marginTop: "8px",
                              marginBottom: "5px",
                            }}
                          >
                            <div style={{}} className="">
                              {ele?.TableStatus == "NotToDo" && (
                                <>
                                  <Input
                                    type="text"
                                    className="form-control mt-1"
                                    id="NotToDo"
                                    name="NotToDo"
                                    lable="Enter NotToDo Reason"
                                    value={ele?.NotToDo}
                                    respclass="width110px"
                                    style={{ width: "50%" }}
                                    onChange={handleChange}
                                  />
                                  <button
                                    className="btn btn-sm btn-success ml-1 mb-1 mt-1"
                                    style={{
                                      marginRight: "1px",
                                      marginLeft: "1px",
                                    }}
                                    onClick={() => handleNotToDo(ele)}
                                  >
                                    Save
                                  </button>
                                </>
                              )}
                              {ele?.TableStatus == "Hold" && (
                                <>
                                  <Input
                                    type="text"
                                    className="form-control mt-1"
                                    id="Hold"
                                    name="Hold"
                                    lable="Enter Hold Reason"
                                    value={ele?.Hold}
                                    respclass="width110px"
                                    style={{ width: "50%" }}
                                    onChange={handleChange}
                                  />
                                  <button
                                    className="btn btn-sm btn-success ml-1 mb-1 mt-1"
                                    style={{
                                      marginRight: "1px",
                                      marginLeft: "1px",
                                    }}
                                    onClick={() => handleHold(ele)}
                                  >
                                    Save
                                  </button>
                                </>
                              )}
                              {ele?.TableStatus == "Close" && (
                                <>
                                  <Input
                                    type="text"
                                    className="form-control mt-1"
                                    id="RefereRCA"
                                    name="RefereRCA"
                                    lable="Enter Close Reason"
                                    value={ele?.RefereRCA}
                                    respclass="width110px"
                                    style={{ width: "50%" }}
                                    onChange={handleChange}
                                  />
                                  {/* <Input
                                    type="number"
                                    className="form-control mt-3"
                                    id="RefereCode"
                                    name="RefereCode"
                                    lable="Enter Man Minutes"
                                    value={ele?.RefereCode}
                                    respclass="width110px"
                                    style={{ width: "50%" }}
                                    onChange={handleChange}
                                  /> */}
                                  <button
                                    className="btn btn-sm btn-success ml-1 mb-1 mt-1"
                                    style={{
                                      marginRight: "1px",
                                      marginLeft: "1px",
                                    }}
                                    onClick={() =>
                                      handleResolveElementClose(ele)
                                    }
                                  >
                                    Close
                                  </button>
                                </>
                              )}
                              {ele?.TableStatus == "Resolve" && (
                                <>
                                  <Input
                                    type="text"
                                    className="form-control mt-1"
                                    id="RefereRCA"
                                    name="RefereRCA"
                                    lable="Enter Summary"
                                    value={ele?.RefereRCA}
                                    respclass="width110px"
                                    onChange={handleChange}
                                  />
                                  <Input
                                    type="number"
                                    className="form-control ml-0 mt-3"
                                    id="RefereCode"
                                    name="RefereCode"
                                    lable="Dev. ManMinutes"
                                    value={ele?.RefereCode}
                                    respclass="width110px"
                                    style={{ width: "100%" }}
                                    onChange={handleChange}
                                  />
                                  {/* {ele?.ManHour && (
                                    <Input
                                      type="number"
                                      className="form-control mt-3"
                                      id="ManHours"
                                      name="ManHours"
                                      lable="Enter ManMinutes"
                                      value={ele?.ManHours}
                                      respclass="width110px"
                                      style={{ width: "50%" }}
                                      onChange={handleChange}
                                    />
                                  )} */}
                                  <button
                                    className="btn btn-sm btn-success ml-1 mb-1 mt-1"
                                    style={{
                                      marginRight: "1px",
                                      marginLeft: "1px",
                                    }}
                                    onClick={() => handleResolveElement(ele)}
                                  >
                                    Resolve
                                  </button>
                                </>
                              )}
                              {ele?.TableStatus == "UpdateStatus" && (
                                <>
                                  <ReactSelect
                                    style={{ width: "100%", marginLeft: "3px" }}
                                    height={"6px"}
                                    name="UpdateStatusValue"
                                    respclass="width110px"
                                    id="UpdateStatusValue"
                                    placeholderName="Status"
                                    dynamicOptions={hidestatus}
                                    value={ele?.UpdateStatusValue}
                                    handleChange={(name, value) => {
                                      handleAgainChange(name, value, index);
                                    }}
                                  />
                                </>
                              )}
                              {ele?.TableStatus == "ReOpen" && (
                                <>
                                  <ReactSelect
                                    style={{ width: "100%", marginLeft: "3px" }}
                                    height={"6px"}
                                    name="ReOpenValue"
                                    respclass="width110px"
                                    id="ReOpenValue"
                                    placeholderName="Reopen"
                                    dynamicOptions={reopen}
                                    value={ele?.ReOpenValue}
                                    handleChange={(name, value) => {
                                      handleAgainChange(name, value, index);
                                    }}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      ),
                    "Module Name": ele?.ModuleName,
                    Incharge: ele?.Incharge,
                    "Dev. ManMinutes": ele?.ReferenceCode,
                    "DeliveryDate-":
                      clientId === 7 ? (
                        ""
                      ) : (
                        <div className="d-flex align-items-center justify-content-between">
                          {clientId == 7 && ShowClientDeliveryDate == 1 ? (
                            <div>{ele?.DeliveryDateClient}</div>
                          ) : (
                            ""
                          )}
                          {ele?.isClientDate ? (
                            <>
                              <DatePicker
                                className="custom-calendar"
                                id="DeliveryDate"
                                name="ClientDeliveryDate"
                                lable="DeliveryDate-"
                                placeholder={VITE_DATE_FORMAT}
                                value={ele?.DeliveryDateClient}
                                respclass="width110px mt-3"
                                handleChange={(e) => {
                                  const { name, value } = e.target;
                                  searchHandleChangeTableClient(
                                    name,
                                    value,
                                    index,
                                    ele
                                  );
                                }}
                              />
                            </>
                          ) : (
                            <div>{ele?.DeliveryDateClient}</div>
                          )}
                          <div className="">
                            {clientId !== 7 && ShowClientDeliveryDate == 1 && (
                              <i
                                className="fa fa-calendar ml-2 mr-2"
                                onClick={() =>
                                  handleIconClientClickdate(ele, index)
                                }
                                style={{
                                  cursor:
                                    ele?.Status === "closed"
                                      ? "not-allowed"
                                      : "pointer",
                                  pointerEvents:
                                    ele?.Status === "closed" ? "none" : "auto",
                                }}
                              ></i>
                            )}
                          </div>
                        </div>
                      ),
                    "ManMinutes-":
                      clientId === 7 ? (
                        ""
                      ) : (
                        <>
                          <div className="d-flex align-items-center justify-content-between">
                            {!ele?.isClientManHour && (
                              <div>{ele?.ManHoursClient}</div>
                            )}

                            <div className="d-flex align-items-center justify-content-between">
                              {ShowClientManHour == 1 && (
                                <label htmlFor="ClientManHour">
                                  <i
                                    className="fa fa-clock mr-2"
                                    onClick={() =>
                                      handleClientIconClick(ele, index)
                                    }
                                    style={{
                                      cursor:
                                        ele?.Status === "closed"
                                          ? "not-allowed"
                                          : "pointer",
                                      pointerEvents:
                                        ele?.Status === "closed"
                                          ? "none"
                                          : "auto",
                                    }}
                                  ></i>{" "}
                                </label>
                              )}

                              {ele?.isClientManHour && (
                                <>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="ClientManHour"
                                    name="ManHoursClient"
                                    lable=""
                                    onChange={(e) =>
                                      handleSelectChange(e, index)
                                    }
                                    value={ele?.ManHoursClient}
                                    respclass="width50px"
                                  />
                                  <button
                                    className="btn btn-xs btn-success ml-2"
                                    onClick={() => {
                                      handleClientManHourTable(ele);
                                    }}
                                  >
                                    Save
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      ),
                    colorcode: ele?.rowColor,
                  }))}
                  tableHeight={"tableHeight"}
                />
                <div className="row m-2  justify-content">
                  <div style={{ display: "flex" }}>
                    <Input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <span style={{ marginRight: "7px", marginLeft: "7px" }}>
                      Select All
                    </span>
                  </div>

                  <div className="d-flex">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        marginRight: "3px",
                      }}
                    >
                      <div style={{ width: "53%" }}>
                        <ReactSelect
                          name="TableStatus"
                          id="TableStatus"
                          respclass="width100px"
                          placeholderName="Change Action"
                          dynamicOptions={filteredOptionsTable}
                          value={formData?.TableStatus}
                          handleChange={(name, value) =>
                            handleDeliveryChangeValueStatus(name, value)
                          }
                        />
                      </div>
                      {formData?.TableStatus?.value == "Move" && (
                        <>
                          <ReactSelect
                            style={{ width: "100%", marginLeft: "5px" }}
                            height={"6px"}
                            name="MoveStatus"
                            respclass="width100px"
                            id="MoveStatus"
                            placeholderName="MoveStatus"
                            dynamicOptions={updateProject}
                            value={formData?.MoveStatus}
                            handleChange={(name, value) =>
                              handleDeliveryChangeValueStatus(name, value)
                            }
                          />
                        </>
                      )}
                      {formData?.TableStatus?.value == "NotToDo" && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <Input
                              type="text"
                              id="NotToDo"
                              name="NotToDo"
                              className="form-control ml-2"
                              lable="Enter NotToDo Reason"
                              value={formData?.NotToDo}
                              respclass="width100px"
                              style={{ width: "100%", marginLeft: "2px" }}
                              onChange={handleChange}
                            />

                            <button
                              className="btn btn-sm btn-info ml-4"
                              onClick={handleNotToDoTable}
                            >
                              Save
                            </button>
                          </div>
                        </>
                      )}
                      {formData?.TableStatus?.value == "Resolve" && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <Input
                              type="text"
                              className="form-control ml-1"
                              id="RefereRCA"
                              name="RefereRCA"
                              lable="Enter Summary"
                              value={formData?.RefereRCA}
                              respclass="width100px"
                              onChange={handleChange}
                            />
                            <Input
                              type="number"
                              className="form-control ml-3"
                              id="RefereCode"
                              name="RefereCode"
                              lable="Dev. ManMinutes"
                              value={formData?.RefereCode}
                              respclass="width100px"
                              onChange={handleChange}
                            />
                            <button
                              className="btn btn-sm btn-info ml-5"
                              onClick={handleResolve}
                            >
                              Resolve
                            </button>
                          </div>
                        </>
                      )}
                      {formData?.TableStatus?.value == "ManHours" && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <Input
                              type="number"
                              id="ManHours"
                              name="ManHours"
                              className="form-control ml-2"
                              lable="Enter ManMinutes"
                              value={formData?.ManHours}
                              respclass="width100px"
                              style={{ width: "100%", marginLeft: "2px" }}
                              onChange={handleChange}
                            />

                            <button
                              className="btn btn-sm btn-info ml-4"
                              onClick={handleManhour}
                            >
                              Save
                            </button>
                          </div>
                        </>
                      )}
                      {formData?.TableStatus?.value == "Hold" && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <Input
                              type="text"
                              id="Hold"
                              name="Hold"
                              className="form-control ml-2"
                              lable="Enter Hold Reason"
                              value={formData?.Hold}
                              respclass="width100px"
                              style={{ width: "100%", marginLeft: "2px" }}
                              onChange={handleChange}
                            />

                            <button
                              className="btn btn-sm btn-info ml-4"
                              onClick={handleHoldTable}
                            >
                              Save
                            </button>
                          </div>
                        </>
                      )}
                      {formData?.TableStatus?.value == "Close" && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <Input
                              type="text"
                              id="RefereRCA"
                              name="RefereRCA"
                              className="form-control ml-2"
                              lable="Enter Refere RCA"
                              value={formData?.RefereRCA}
                              respclass="width100px"
                              style={{ width: "100%", marginLeft: "2px" }}
                              onChange={handleChange}
                            />
                            <Input
                              type="number"
                              id="RefereCode"
                              name="RefereCode"
                              className="form-control ml-3"
                              lable="Enter Refere Code"
                              value={formData?.RefereCode}
                              respclass="width100px"
                              style={{ width: "100%", marginLeft: "2px" }}
                              onChange={handleChange}
                            />
                            <Input
                              type="number"
                              id="ManHours"
                              name="ManHours"
                              className="form-control ml-4"
                              lable="Enter ManMinutes"
                              value={formData?.ManHours}
                              respclass="width100px"
                              style={{ width: "100%", marginLeft: "2px" }}
                              onChange={handleChange}
                            />

                            <button
                              className="btn btn-sm btn-info ml-5"
                              onClick={handleResolveClose}
                            >
                              Close
                            </button>
                          </div>
                        </>
                      )}
                      {formData?.TableStatus?.value == "Assign" && (
                        <>
                          <ReactSelect
                            style={{ width: "100%", marginLeft: "5px" }}
                            height={"6px"}
                            name="AssignedToStatus"
                            respclass="width100px"
                            id="AssignedToStatus"
                            placeholderName="AssignedToStatus"
                            dynamicOptions={assigntoValue}
                            value={formData?.AssignedToStatus}
                            handleChange={(name, value) =>
                              handleDeliveryChangeValueStatus(name, value)
                            }
                          />
                        </>
                      )}
                      {formData?.TableStatus?.value == "UpdateStatus" && (
                        <>
                          <ReactSelect
                            style={{ width: "100%", marginLeft: "3px" }}
                            height={"6px"}
                            name="UpdateToStatus"
                            respclass="width100px"
                            id="UpdateToStatus"
                            placeholderName="UpdateToStatus"
                            dynamicOptions={hidestatus}
                            value={formData?.UpdateToStatus}
                            handleChange={(name, value) =>
                              handleDeliveryChangeValueStatus(name, value)
                            }
                          />
                        </>
                      )}
                      {formData?.TableStatus?.value == "UpdateCategory" && (
                        <>
                          <ReactSelect
                            style={{ width: "100%", marginLeft: "3px" }}
                            height={"6px"}
                            name="UpdateToCategory"
                            respclass="width100px"
                            id="UpdateToCategory"
                            placeholderName="UpdateToCategory"
                            dynamicOptions={updatecategory}
                            value={formData?.UpdateToCategory}
                            handleChange={(name, value) =>
                              handleDeliveryChangeValueStatus(name, value)
                            }
                          />
                        </>
                      )}
                      {formData?.TableStatus?.value == "UpdateDeliveryDate" && (
                        <>
                          <DatePicker
                            placeholder={VITE_DATE_FORMAT}
                            className="custom-calendar"
                            id="DeliveryToStatus"
                            name="DeliveryToStatus"
                            lable={"Delivery Date"}
                            value={formData?.DeliveryToStatus}
                            handleChange={(e) => {
                              const { name, value } = e.target;
                              handleDeliveryChangeValueStatus(name, value);
                            }}
                          />
                        </>
                      )}
                      {formData?.TableStatus?.value == "RemoveDeliveryDate" && (
                        <>
                          {/* <DatePicker
                            placeholder={VITE_DATE_FORMAT}
                            className="custom-calendar"
                            id="RemoveDeliveryToStatus"
                            name="RemoveDeliveryToStatus"
                            lable={"RemoveDeliveryDate"}
                            value={formData?.RemoveDeliveryToStatus}
                            handleChange={(e) => {
                              const { name, value } = e.target;
                              handleDeliveryChangeValueStatus(name, value);
                            }}
                          /> */}
                          <button
                            className="btn btn-sm btn-primary ml-5"
                            onClick={handleDeliveryRemove}
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>

                    {clientId === 7 ? (
                      ""
                    ) : (
                      <div style={{ marginLeft: "10px" }}>
                        <button
                          className="btn btn-sm btn-danger ml-5"
                          onClick={handlePageReset}
                        >
                          Reset
                        </button>
                        {AllowDeleteTicket == "1" && (
                          <button
                            className="btn btn-sm btn-danger ml-2"
                            onClick={handleDelete}
                          >
                            Delete Ticket
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="ml-auto">
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

export default ViewIssues;
