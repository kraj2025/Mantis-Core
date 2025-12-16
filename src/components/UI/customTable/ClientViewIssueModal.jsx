import React, { useEffect, useState } from "react";
import Tables from ".";
import axios from "axios";
import { toast } from "react-toastify";
import { headers } from "../../../utils/apitools";
import Heading from "../Heading";
import {
  activityTHEAD,
  issueHistoryTHEAD,
} from "../../modalComponent/Utils/HealperThead";
import Input from "../../formComponent/Input";
import { useTranslation } from "react-i18next";
import DatePicker from "../../formComponent/DatePicker";
import TextEditor from "../../formComponent/TextEditor";
import ReactSelect from "../../formComponent/ReactSelect";
import { inputBoxValidation } from "../../../utils/utils";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../../../utils/constant";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import Loading from "../../loader/Loading";
import { useSelector } from "react-redux";
import Tooltip from "../../../pages/Tooltip";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";

const ClientViewIssueModal = ({
  visible,
  tableData,
  setVisible,
  handleViewSearch,
}) => {
  console.log("visible kamal", visible);

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

  const AllowAssign = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowTicketAssignTo"
  );
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [reopen, setReOpen] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [tableData1, setTableData1] = useState([]);
  const [loading, setLoading] = useState();
  const [project, setProject] = useState([]);
  const [category, setCategory] = useState([]);
  const [assignto, setAssignedto] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [formData, setFormData] = useState({
    TicketID: "",
    Project: "",
    Category: "",
    ViewStatus: "",
    DateSubmitted: "",
    LastUpdate: "",
    Reporter: "",
    AssignedTo: "",
    Priority: "",
    Status: "",
    ReportedByMobile: "",
    ReportedByName: "",
    Summary: "",
    Description: "",
    DeliveryDate: "",
    ClientDeliveryDate: "",
    ManHour: "",
    ClientManHour: "",
    ReferenceCode: "",
    Note: "",
    HoldReason: "",
    ReOpen: "",
    ProjectID: "",
    ModuleName: "",
    PageName: "",
    OtherReferenceNo: "",
  });
  const [formDataUpdate, setFormDataUpdate] = useState({
    TicketID: "",
    Project: "",
    Category: "",
    ProjectID: "",
    ViewStatus: "",
    DateSubmitted: "",
    LastUpdate: "",
    Reporter: "",
    AssignedTo: "",
    Priority: "",
    Status: "",
    ReportedByMobile: "",
    ReportedByName: "",
    Summary: "",
    Description: "",
    DeliveryDate: "",
    ClientDeliveryDate: "",
    ClientManHour: "",
    ManHour: "",
    ReferenceCode: "",
    Note: "",
    HoldReason: "",
    Reason: "",
    ReOpen: "",
    OtherReferenceNo: "",
    ModuleName: "",
    PageName: "",
  });
  const [moduleName, setModuleName] = useState([]);
  const [pageName, setPageName] = useState([]);
  const { clientId } = useSelector((state) => state?.loadingSlice);
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormDataUpdate({
      ...formDataUpdate,
      [name]: value,
    });
  };

  const RoleID = useCryptoLocalStorage("user_Data", "get", "RoleID");
  const getModule = () => {
    axiosInstances
      .post(apiUrls.Module_Select, {
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
        ProjectID: Number(visible?.showData?.ProjectID),
        IsActive: Number(1),
        IsMaster: Number(0),
      })
      .then((res) => {
        const poc3s = res?.data?.data?.map((item) => {
          return { label: item?.ModuleName, value: item?.ModuleID };
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
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
        ProjectID: Number(visible?.showData?.ProjectID),
        IsActive: Number(1),
        IsMaster: Number(0),
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.PagesName, value: item?.ID };
        });
        setPageName(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const shortenNamesummary = (name) => {
    return name.length > 20 ? name.substring(0, 15) + "..." : name;
  };
  const navigateTable = (type, id) => {
    let currentIndex = tableData?.findIndex((ele) => ele?.TicketID === id);
    let updatedData = {};

    if (type === "pre" && currentIndex > 0) {
      let goToInd = currentIndex - 1;
      updatedData = tableData[goToInd];
    } else if (type === "next" && currentIndex < tableData?.length - 1) {
      let goToInd = currentIndex + 1;
      updatedData = tableData[goToInd];
    }
    if (updatedData) {
      handleIssueSearch(updatedData?.TicketID);
    }
  };
  function removeHtmlTags(text) {
    return text.replace(/<[^>]*>?/gm, "");
  }
  const searchHandleChange = (e) => {
    const { name, value } = e?.target;
    setFormDataUpdate({ ...formDataUpdate, [name]: value });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    // if (name == "ReferenceCode") {
    //   if (value.length == 40) return;
    // }
    setFormDataUpdate({ ...formDataUpdate, [name]: value });
  };

  const handleSearchNote = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.ViewNote, {
        TicketID: Number(visible?.showData?.TicketID),
      })
      .then((res) => {
        const data = res?.data?.data;
        const updateddata = data?.map((ele, index) => {
          return {
            ...ele,
            IsUpdate: false,
          };
        });
        setTableData2(updateddata);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoading(false);
      });
  };

  const handleSearchHistory = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.ViewHistory, {
        TicketID: Number(visible?.showData?.TicketID),
      })
      .then((res) => {
        setTableData1(res?.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoading(false);
      });
  };

  const handleIssueSearch = (ticket) => {
    axiosInstances
      .post(apiUrls.ViewTicket, {
        TicketID: Number(ticket || visible.showData.TicketID),
      })
      .then((res) => {
        console.log("res kamal", res);

        setFormData({
          TicketID: res?.data.data[0].Id,
          Project: res?.data.data[0].ProjectName,
          ProjectID: res?.data.data[0].Project_ID,
          Category: res?.data.data[0].CategoryName,
          ViewStatus: res?.data.data[0]?.Status,
          DateSubmitted: res?.data.data[0]?.SubmittedDate,
          LastUpdate: res?.data.data[0]?.Updatedate,
          Reporter: res?.data.data[0]?.ReporterName,
          AssignedTo: res?.data.data[0]?.AssignedTo,
          Priority: res?.data.data[0]?.priority,
          Status: res?.data.data[0]?.Status,
          ReportedByMobile: res?.data.data[0]?.RepoterMobileNo,
          ReportedByName: res?.data.data[0]?.RepoterName,
          Summary: res?.data.data[0]?.summary,
          Description: removeHtmlTags(res?.data.data[0]?.description),
          // DeliveryDate:
          //   res?.data?.data[0]?.DeliveryDate !== null
          //     ? res?.data?.data[0]?.DeliveryDate
          //     : "",
          DeliveryDate: res?.data?.data[0]?.DeliveryDate,
          ClientDeliveryDate: res?.data?.data[0]?.DeliveryDateClient,
          ManHour: res?.data.data[0]?.ManHour,
          ClientManHour: res?.data.data[0]?.ManHoursClient,
          Note: res?.data.data[0]?.Note,
          ReferenceCode: res?.data.data[0]?.ReferenceCode,
          HoldReason: res?.data.data[0]?.HoldReason,
          ModuleName: res?.data.data[0]?.ModuleName,
          PageName: res?.data.data[0]?.PagesName,
          ModuleID: res?.data.data[0]?.ModuleID,
          PagesID: res?.data.data[0]?.PagesID,
          OtherReferenceNo: res?.data.data[0]?.OtherReferenceNo,
        });
        setFormDataUpdate({
          TicketID: res?.data.data[0].Id,
          Project: res?.data.data[0].Project_ID,
          ClientDeliveryDate:
            res?.data?.data[0]?.DeliveryDateClient !== null
              ? new Date(res?.data?.data[0]?.DeliveryDateClient)
              : "",
          ClientManHour: res?.data.data[0]?.ManHoursClient,
          Category: res?.data.data[0]?.category_id,
          DateSubmitted: res?.data.data[0]?.SubmittedDate,
          LastUpdate: res?.data.data[0]?.Updatedate,
          Reporter: res?.data.data[0]?.RepoterName,
          AssignedTo: res?.data.data[0]?.handler_id,
          Priority: res?.data.data[0]?.priority,
          Status: res?.data.data[0]?.StatusId,
          ReportedByMobile: res?.data.data[0]?.RepoterMobileNo,
          ReportedByName: res?.data.data[0]?.RepoterName,
          Summary: res?.data.data[0]?.summary,
          Description: res?.data.data[0]?.description,
          // Description: removeHtmlTags(res?.data.data[0]?.description),
          // DeliveryDate:
          //   res?.data.data[0]?.DeliveryDate != ""
          //     ? new Date(res?.data.data[0]?.DeliveryDate)
          //     : "",
          // DeliveryDate: new Date(res?.data?.data[0]?.DeliveryDate),
          DeliveryDate:
            res?.data?.data[0]?.DeliveryDate !== null
              ? new Date(res?.data?.data[0]?.DeliveryDate)
              : "",
          ManHour: res?.data.data[0]?.ManHour,
          ReferenceCode: res?.data.data[0]?.ReferenceCode,
          Note: res?.data.data[0]?.Note,
          HoldReason: res?.data.data[0]?.HoldReason,
          ModuleName: res?.data.data[0]?.ModuleID,
          PageName: res?.data.data[0]?.PagesID,
          OtherReferenceNo: res?.data.data[0]?.OtherReferenceNo,
        });
        // }
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
  function getlabel(id, dropdownData) {
    const ele = dropdownData?.filter((item) => item?.value === id);
    return ele?.length > 0 ? ele[0].label : undefined;
  }
  const [edit, setEdit] = useState(false);

  const handleEdit = () => {
    if (edit) {
      setLoading(true);
      const payload = {
        TicketID: Number(formDataUpdate?.TicketID) || 0,
        User_id: Number(useCryptoLocalStorage("user_Data", "get", "ID")) || 0,
        CategoryID: Number(formDataUpdate?.Category) || 0,
        AssignToID: Number(formDataUpdate?.AssignedTo) || 0,
        PriorityID: Number(formDataUpdate?.Priority) || 0,
        DeliveryDate:
          formDataUpdate?.DeliveryDate &&
          !isNaN(formDataUpdate?.DeliveryDate.getTime())
            ? formDataUpdate?.DeliveryDate.toISOString().split("T")[0] // format: YYYY-MM-DD
            : "",
        // DeliveryDate:  formatDate(formDataUpdate?.DeliveryDate)
        //   ? String(formatDate(formDataUpdate?.DeliveryDate))
        //   : "",
        DeliveryDateClient: formDataUpdate?.ClientDeliveryDate
          ? String(formDataUpdate?.ClientDeliveryDate)
          : "",
        Summary: formDataUpdate?.Summary ? String(formDataUpdate?.Summary) : "",
        Description: formDataUpdate?.Description
          ? String(formDataUpdate?.Description)
          : "",
        Note: formDataUpdate?.Note ? String(formDataUpdate?.Note) : "",
        ReferenceCode: formDataUpdate?.ReferenceCode
          ? String(formDataUpdate?.ReferenceCode)
          : "",
        ManHour: formDataUpdate?.ManHour
          ? String(formDataUpdate?.ManHour)
          : "0",
        ManHoursClient: formDataUpdate?.ClientManHour
          ? String(formDataUpdate?.ClientManHour)
          : "0",
        ReportedByName: formDataUpdate?.ReportedByName
          ? String(formDataUpdate?.ReportedByName)
          : "",
        ReportedByMobileNo: formDataUpdate?.ReportedByMobile
          ? String(formDataUpdate?.ReportedByMobile)
          : "",
        HoldReason: formDataUpdate?.HoldReason
          ? String(formDataUpdate?.HoldReason)
          : "",
        Status: formDataUpdate?.Status ? String(formDataUpdate?.Status) : "",
        ModuleID: Number(formDataUpdate?.ModuleName) || 0,
        ModuleName: getlabel(formDataUpdate?.ModuleName, moduleName) || "",
        PagesID: Number(formDataUpdate?.PageName) || 0,
        PagesName: getlabel(formDataUpdate?.PageName, pageName) || "",
        IsReOpen: Number("1"),
        ReOpenReasonID: Number(formDataUpdate?.ReOpen) || 0,
        ReOpenReason: getlabel(formDataUpdate?.ReOpen, reopen) || "",
      };

      axiosInstances
        .post(apiUrls.UpdateTicket, payload)
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setLoading(false);
            handleIssueSearch();
            setVisible(false);
            handleViewSearch();
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          // toast.error(
          //   err?.response?.data?.message
          //     ? err?.response?.data?.message
          //     : "Error Occured"
          // );
          const errorMessage = err?.response?.data?.message ?? "Error Occurred";

          // Display the error message in the toast notification
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      setEdit(true);
    }
  };
  const handleDeleteNote = (id) => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.DeleteNote, {
        NoteID: Number(id),
        TicketID: Number(formDataUpdate?.TicketID),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleSearchNote();
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }

        // Optionally, remove the note from the tableData2 state after successful deletion
        // const updatedTableData = tableData2.filter((item) => item.id !== id);
        // setTableData2(updatedTableData);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleEditUpdate = (ele) => {
    // if (!IsUpdate) {
    //   const data = tableData2;
    //   data[index]["IsUpdate"] = true;
    //   setTableData2(data);
    // } else {
    axiosInstances
      .post(apiUrls.UpdateNote, {
        NoteID: Number(ele?.NoteId),
        TicketID: Number(formDataUpdate?.TicketID),
        NoteText: String(ele?.note),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };
  const [rowHandler, setRowHandler] = useState({
    show: true,
    show1: true,
  });
  const handlerow = (row) => {
    let obj;
    if (!rowHandler[row]) {
      obj = { ...rowHandler, [row]: true };
    } else {
      obj = { ...rowHandler, [row]: false };
    }
    setRowHandler(obj);
  };

  const getStatus = () => {
    axiosInstances
      .post(apiUrls.Status_Select, {})
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.STATUS, value: item?.id };
        });
        setStatus(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        ProjectID: Number(formDataUpdate?.ProjectID || 0),
        IsMaster: String(formDataUpdate?.IsMaster || ""),
        VerticalID: Number(formDataUpdate?.VerticalID || 0),
        TeamID: Number(formDataUpdate?.TeamID || 0),
        WingID: Number(formDataUpdate?.WingID || 0),
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.Project, value: item?.ProjectId };
        });
        getCategory(poc3s[0]?.value);
        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
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
  const getCategory = (proj) => {
    axiosInstances
      .post(apiUrls.Category_Select, {
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
        ProjectID: Number(proj),
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setCategory(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAssignTo = () => {
    axiosInstances
      .post(apiUrls.AssignTo_Select, {
        ProjectID: Number(0),
      })
      .then((res) => {
        console.log("get assign to", res.data.data);
        const assigntos = res?.data?.data?.map((item) => {
          return { label: item?.Name, value: item?.ID };
        });
        setAssignedto(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getReopen = () => {
    axiosInstances
      .post(apiUrls.Reason_Select, {
        Title: String("ReOpenReason" || ""),
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

  useEffect(() => {
    getReopen();
    getProject();
    getAssignTo();
    getPriority();
    getStatus();
    getModule();
    getPage();
    handleSearchNote();
    handleSearchHistory();
  
    handleIssueSearch(visible?.showData?.TicketID);
  }, []);
  return (
    <>
     
      <div className="card">
        <Heading
          title={"Ticket Details"}
          secondTitle={
            <div className="col-sm-12 col-xs-12">
            
              {visible.showData.flag == true ? (
                <></>
              ) : (
                <>
                  <i
                    className="fa fa-arrow-left"
                    style={{
                      fontSize: "15px",
                      marginRight: "6px",
                      marginLeft: "13px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigateTable("pre", formData?.TicketID)}
                  ></i>
                  <i
                    className="fa fa-arrow-right"
                    style={{
                      fontSize: "15px",
                      marginRight: "6px",
                      marginLeft: "13px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigateTable("next", formData?.TicketID)}
                  ></i>
                </>
              )}

              {/* <button
                className="next btn-success mx-2"
                disabled={
                  tableData[0]?.currentIndex === tableData.length - 1
                    ? true
                    : false
                }
              >
                ›
              </button> */}
            </div>
          }
        />

        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            id="TickeID"
            name="TickeID"
            lable="TickeID"
            value={formData?.TicketID}
            placeholder=" "
            respclass="col-md-2 col-12 col-sm-12"
            onChange={handleChange}
            disabled={edit == false}
          />
          {edit == false ? (
            <Input
              type="text"
              className="form-control"
              id="Project"
              name="Project"
              lable="Project"
              value={formData?.Project}
              placeholder=" "
              respclass="col-md-2 col-12 col-sm-12"
              onChange={handleChange}
              disabled={edit == false}
            />
          ) : (
            <ReactSelect
              respclass="col-md-2 col-12 col-sm-12"
              name="Project"
              placeholderName="Project"
              dynamicOptions={project}
              value={formDataUpdate?.Project}
              handleChange={handleDeliveryChange}
            />
          )}
          {edit == false ? (
            <Input
              type="text"
              className="form-control"
              id="Category"
              name="Category"
              lable="Category"
              value={formData?.Category}
              placeholder=" "
              respclass="col-md-2 col-12 col-sm-12"
              onChange={handleChange}
              disabled={edit == false}
            />
          ) : (
            <ReactSelect
              respclass="col-md-2 col-12 col-sm-12"
              name="Category"
              placeholderName="Category"
              dynamicOptions={category}
              value={formDataUpdate?.Category}
              handleChange={handleDeliveryChange}
            />
          )}

          <Input
            type="text"
            className="form-control mt-2"
            id="DateSubmitted"
            name="DateSubmitted"
            lable="DateSubmitted"
            value={formData?.DateSubmitted}
            placeholder=" "
            respclass="col-md-2 col-12 col-sm-12"
            onChange={handleChange}
            disabled={edit == true || edit == false}
          />
          <Input
            type="text"
            className="form-control mt-2"
            id="LastUpdate"
            name="LastUpdate"
            lable="LastUpdate"
            value={formData?.LastUpdate}
            placeholder=" "
            respclass="col-md-2 col-12 col-sm-12"
            onChange={handleChange}
            disabled={edit == true || edit == false}
          />
          <Input
            type="text"
            className="form-control mt-2"
            id="Reporter"
            name="Reporter"
            lable="Reporter"
            value={formData?.Reporter}
            placeholder=" "
            respclass="col-md-2 col-12 col-sm-12"
            onChange={handleChange}
            disabled={edit == false}
          />
          {edit == false ? (
            <>
              {AllowAssign == 1 ? (
                <Input
                  type="text"
                  className="form-control mt-2"
                  id="AssignedTo"
                  name="AssignedTo"
                  lable="AssignedTo"
                  value={formData?.AssignedTo}
                  placeholder=" "
                  respclass="col-md-2 col-12 col-sm-12"
                  onChange={handleChange}
                  disabled={edit == false}
                />
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              {AllowAssign == 1 ? (
                <ReactSelect
                  respclass="col-md-2 col-12 col-sm-12 mt-2"
                  name="AssignedTo"
                  placeholderName="AssignedTo"
                  dynamicOptions={assignto}
                  value={formDataUpdate?.AssignedTo}
                  handleChange={handleDeliveryChange}
                />
              ) : (
                ""
              )}
            </>
          )}

          {edit == false ? (
            <Input
              type="text"
              className="form-control mt-2"
              id="Priority"
              name="Priority"
              lable="Priority"
              value={formData?.Priority}
              placeholder=" "
              respclass="col-md-2 col-12 col-sm-12"
              onChange={handleChange}
              disabled={edit == false}
            />
          ) : (
            <ReactSelect
              respclass="col-md-2 col-12 col-sm-12 mt-2"
              name="Priority"
              placeholderName="Priority"
              dynamicOptions={priority}
              value={formDataUpdate?.Priority}
              handleChange={handleDeliveryChange}
            />
          )}
          {edit == false ? (
            <Input
              type="text"
              className="form-control mt-2"
              id="Status"
              name="Status"
              lable="Status"
              value={formData?.Status}
              placeholder=" "
              respclass="col-md-2 col-12 col-sm-12"
              onChange={handleChange}
              disabled={edit == false}
            />
          ) : (
            <>
              <ReactSelect
                respclass="col-md-2 col-12 col-sm-12 mt-2"
                name="Status"
                placeholderName="Status"
                dynamicOptions={status}
                value={formDataUpdate?.Status}
                handleChange={handleDeliveryChange}
              />
              {formDataUpdate?.Status === 70 ||
              formDataUpdate?.Status === 50 ||
              formDataUpdate?.Status === 80 ? (
                ""
              ) : (
                <ReactSelect
                  respclass="col-md-2 col-12 col-sm-12 mt-2"
                  height={"6px"}
                  name="ReOpen"
                  id="ReOpen"
                  placeholderName="Reopen"
                  dynamicOptions={reopen}
                  value={formDataUpdate?.ReOpen}
                  handleChange={handleDeliveryChange}
                />
              )}
              {/* {
              formDataUpdate?.Status === 80 &&
                <ReactSelect
                  respclass="col-md-2 col-12 col-sm-12 mt-2"
                  height={"6px"}
                  name="ReOpen"
                  id="ReOpen"
                  placeholderName="Reopen"
                  dynamicOptions={reopen}
                  value={formDataUpdate?.ReOpen}
                  handleChange={handleDeliveryChange}
                />
              } */}

              {/* {(formDataUpdate?.Status === 80 ||
                formDataUpdate?.Status === 70 ||
                formDataUpdate?.Status === 90) && (
                <Input
                  type="text"
                  className="form-control"
                  name="Reason"
                  lable={
                    formDataUpdate?.Status === 80
                      ? t("Resolved Reason")
                      : formDataUpdate?.Status === 70
                        ? t("DoneOnUAT Reason")
                        : t("Closed Reason")
                  }
                  placeholderName=""
                  respclass="col-md-2 col-12 col-sm-12"
                  value={formDataUpdate?.Reason}
                  onChange={handleChange}
                />
              )} */}
            </>
          )}

          {edit == false ? (
            <Input
              type="number"
              className="form-control mt-2"
              id="ReportedByMobile"
              name="ReportedByMobile"
              lable="ReportedByMobile"
              value={formData?.ReportedByMobile}
              placeholder=" "
              respclass="col-md-2 col-12 col-sm-12"
              onChange={(e) => {
                inputBoxValidation(
                  MOBILE_NUMBER_VALIDATION_REGX,
                  e,
                  handleChange
                );
              }}
              disabled={edit == false}
            />
          ) : (
            <Input
              type="number"
              className="form-control mt-2"
              id="ReportedByMobile"
              name="ReportedByMobile"
              lable="ReportedByMobile"
              value={formDataUpdate?.ReportedByMobile}
              placeholder=" "
              respclass="col-md-2 col-12 col-sm-12"
              onChange={(e) => {
                inputBoxValidation(
                  MOBILE_NUMBER_VALIDATION_REGX,
                  e,
                  handleChange
                );
              }}
            />
          )}
          {edit == false ? (
            <Input
              type="text"
              className="form-control mt-2"
              id="ReportedByName"
              name="ReportedByName"
              lable="ReportedByName"
              value={formData?.ReportedByName}
              placeholder=" "
              respclass="col-md-2 col-12 col-sm-12"
              onChange={handleChange}
              disabled={edit == false}
            />
          ) : (
            <Input
              type="text"
              className="form-control mt-2"
              id="ReportedByName"
              name="ReportedByName"
              lable="ReportedByName"
              value={formDataUpdate?.ReportedByName}
              placeholder=" "
              respclass="col-md-2 col-12 col-sm-12"
              onChange={handleChange}
            />
          )}
          {edit == false ? (
            <Input
              type="text"
              className="form-control mt-2"
              id="HoldReason"
              name="HoldReason"
              lable="Hold Reason"
              value={formData?.HoldReason}
              placeholder=""
              respclass="col-md-2 col-12 col-sm-12"
              onChange={handleChange}
              disabled={edit == false}
            />
          ) : (
            <Input
              type="text"
              className="form-control mt-2"
              id="HoldReason"
              name="HoldReason"
              lable="Hold Reason"
              value={formDataUpdate?.HoldReason}
              placeholder=""
              respclass="col-md-2 col-12 col-sm-12"
              onChange={handleChange}
              // disabled={edit == false}
            />
          )}
          {edit == false ? (
            <Input
              type="text"
              className="form-control mt-2"
              id="Summary"
              name="Summary"
              lable="Summary"
              value={formData?.Summary}
              placeholder=" "
              respclass="col-xl-12 col-md-2 col-12 col-sm-12"
              onChange={handleChange}
              disabled={edit == false}
            />
          ) : (
            <Input
              type="text"
              className="form-control mt-2"
              id="Summary"
              name="Summary"
              lable="Summary"
              value={formDataUpdate?.Summary}
              placeholder=" "
              respclass="col-xl-12 col-md-2 col-12 col-sm-12"
              onChange={handleChange}
            />
          )}
          {edit == false ? (
            <textarea
              type="text"
              className="summaryheight mt-2 mb-2"
              id="Description"
              name="Description"
              lable="Description"
              value={formData?.Description}
              placeholder="Description "
              respclass="col-md-12 col-12 col-sm-12"
              onChange={handleChange}
              disabled={edit == false}
              style={{ width: "100%" }}
            ></textarea>
          ) : (
            <>
              {/* <TextEditor
                value={formDataUpdate?.Description}
                placeholder="Description"
                onChange={(value) =>
                  setFormDataUpdate({ ...formDataUpdate, Description: value })
                }
              /> */}
              <Input
                type="text"
                respclass="col-md-12 col-12 col-sm-12"
                className="form-control mt-2 mb-2"
                placeholder=" "
                lable="Description"
                id="Description"
                name="Description"
                value={formDataUpdate?.Description}
                onChange={handleChange}
              />
            </>
          )}

          {edit == false ? (
            <textarea
              type="text"
              className="form-control mb-1 ml-2 mr-2"
              id="Note"
              name="Note"
              lable="Note"
              value={formData?.Note}
              placeholder="Note "
              //  respclass="col-md-4 col-12 col-sm-12"
              onChange={handleChange}
              disabled={edit == false}
              // style={{ width: "32%", marginLeft: "7.5px" }}
            ></textarea>
          ) : (
            <textarea
              type="text"
              className="form-control mb-2 ml-2 mr-2"
              id="Note"
              name="Note"
              lable="Note"
              value={formDataUpdate?.Note}
              placeholder="Note "
              //  respclass="col-md-4 col-12 col-sm-12"
              onChange={handleChange}
              // disabled={edit == false}
              // style={{ width: "32%", marginLeft: "7.5px" }}
            ></textarea>
          )}

          {RoleID == 7 &&
            // <>
            //   {edit == false ?
            //   (
            //     <Input
            //       type="text"
            //       className="form-control mt-2"
            //       id="ClientDeliveryDate"
            //       name="ClientDeliveryDate"
            //       lable="ClientDeliveryDate"
            //       value={formData?.ClientDeliveryDate}
            //       placeholder=" "
            //       respclass="col-md-2 col-12 col-sm-12"
            //       onChange={handleChange}
            //       disabled={edit == false}
            //     />
            //   ) : (
            //     <DatePicker
            //       className="custom-calendar"
            //       id="ClientDeliveryDate"
            //       name="ClientDeliveryDate"
            //       placeholder={VITE_DATE_FORMAT}
            //       respclass="col-md-2 col-12 col-sm-12 mt-2"
            //       value={formDataUpdate?.ClientDeliveryDate}
            //       handleChange={searchHandleChange}
            //       disabled={
            //         ShowClientDeliveryDate !== "0" ||
            //         ShowClientDeliveryDate === undefined ||
            //         ShowClientDeliveryDate === null
            //       }
            //     />
            //   )}
            // </>
            ""}

          {RoleID != 7 && (
            <>
              {edit == false ? (
                <Input
                  type="text"
                  className="form-control mt-2"
                  id="DeliveryDate"
                  name="DeliveryDate"
                  lable="DeliveryDate"
                  value={formData?.DeliveryDate}
                  placeholder=" "
                  respclass="col-md-2 col-12 col-sm-12"
                  onChange={handleChange}
                  disabled={edit == false}
                />
              ) : (
                <DatePicker
                  className="custom-calendar"
                  id="DeliveryDate"
                  name="DeliveryDate"
                  placeholder={VITE_DATE_FORMAT}
                  respclass="col-md-2 col-12 col-sm-12 mt-2"
                  value={formDataUpdate?.DeliveryDate}
                  handleChange={searchHandleChange}
                  disabled={
                    AllowDeliveryDateEdit !== "0" ||
                    AllowDeliveryDateEdit === undefined ||
                    AllowDeliveryDateEdit === null
                  }
                />
              )}
            </>
          )}
          {RoleID != 7 && (
            <>
              {edit == false ? (
                <Input
                  type="number"
                  className="form-control mt-2"
                  id="ManHour"
                  name="ManHour"
                  lable="ManHour"
                  value={formData?.ManHour}
                  placeholder=""
                  respclass="col-md-2 col-12 col-sm-12"
                  onChange={handleChange}
                  disabled={edit == false}
                />
              ) : (
                <Input
                  type="number"
                  className="form-control mt-2"
                  id="ManHour"
                  name="ManHour"
                  lable="ManHour"
                  value={formDataUpdate?.ManHour}
                  placeholder=""
                  respclass="col-md-2 col-12 col-sm-12"
                  onChange={handleChange}
                  disabled={AllowManHourEdit !== 0}
                />
              )}
            </>
          )}

          {RoleID == 7 &&
            // <>
            //   {edit == false ? (
            //     <Input
            //       type="number"
            //       className="form-control mt-2"
            //       id="ClientManHour"
            //       name="ClientManHour"
            //       lable="ClientManHour"
            //       value={formData?.ClientManHour}
            //       placeholder=""
            //       respclass="col-md-2 col-12 col-sm-12"
            //       onChange={handleChange}
            //       disabled={edit == false}
            //     />
            //   ) : (
            //     <Input
            //       type="number"
            //       className="form-control mt-2"
            //       id="ClientManHour"
            //       name="ClientManHour"
            //       lable="ClientManHour"
            //       value={formDataUpdate?.ClientManHour}
            //       placeholder=""
            //       respclass="col-md-2 col-12 col-sm-12"
            //       onChange={handleChange}
            //       disabled={ShowClientManHour !== "0"}
            //     />
            //   )}
            // </>
            ""}

          {/* {clientId === 7 ? (
            ""
          ) : edit == false ? (
            <Input
              type="text"
              className="form-control mt-2"
              id="ReferenceCode"
              name="ReferenceCode"
              lable="Dev. ManMinutes"
              value={formData?.ReferenceCode}
              placeholder=""
              respclass="col-md-2 col-12 col-sm-12"
              onChange={handleChange}
              disabled={edit == false}
            />
          ) : (
            <Input
              type="text"
              className="form-control mt-2"
              id="ReferenceCode"
              name="ReferenceCode"
              lable="Dev. ManMinutes"
              value={formDataUpdate?.ReferenceCode}
              placeholder=""
              respclass="col-md-2 col-12 col-sm-12"
              onChange={handleChange}
            
            />
          )} */}

          {edit == false ? (
            <Input
              type="text"
              className="form-control mt-2"
              id="ModuleName"
              name="ModuleName"
              lable="ModuleName"
              value={formData?.ModuleName}
              placeholder=" "
              respclass="col-md-2 col-12 col-sm-12"
              onChange={handleChange}
              disabled={edit == false}
            />
          ) : (
            <ReactSelect
              respclass="col-md-2 col-12 col-sm-12 mt-2"
              name="ModuleName"
              placeholderName={t("ModuleName")}
              dynamicOptions={moduleName}
              value={formDataUpdate?.ModuleName}
              handleChange={handleDeliveryChange}
              // requiredClassName={`${formData?.Category?.MandatoryModule_Ticket === 1 && "required-fields"}`}
            />
          )}

          {edit == false ? (
            <Input
              type="text"
              className="form-control mt-2"
              id="PageName"
              name="PageName"
              lable="PageName"
              value={formData?.PageName}
              placeholder=" "
              respclass="col-md-2 col-12 col-sm-12"
              onChange={handleChange}
              disabled={edit == false}
            />
          ) : (
            <ReactSelect
              respclass="col-md-2 col-12 col-sm-12 mt-2"
              name="PageName"
              placeholderName={t("PageName")}
              dynamicOptions={pageName}
              value={formDataUpdate?.PageName}
              handleChange={handleDeliveryChange}
              // requiredClassName={`${formData?.Category?.MandatoryModule_Ticket === 1 && "required-fields"}`}
            />
          )}
          {edit == false ? (
            <Input
              type="text"
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              className="form-control mt-2"
              placeholder=" "
              lable="Other Reference No"
              id="OtherReferenceNo"
              name="OtherReferenceNo"
              value={formData?.OtherReferenceNo}
              onChange={handleChange}
              disabled={edit == false}
            />
          ) : (
            <Input
              type="text"
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              className="form-control mt-2"
              placeholder=" "
              lable="Other Reference No"
              id="OtherReferenceNo"
              name="OtherReferenceNo"
              value={formDataUpdate?.OtherReferenceNo}
              onChange={handleChange}
            />
          )}
        </div>
        {clientId === 7 ? (
          ""
        ) : (
          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div className="d-flex m-2">
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-lg btn-info ml-2"
                  onClick={handleEdit}
                >
                  {edit ? "Update" : "Edit"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="card patient_registration_card mt-3">
        <Heading
          title={"Notes Details"}
          secondTitle={
            <div style={{ marginRight: "0px" }}>
              <button
                className={`fa ${rowHandler.show1 ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("show1");
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "none",
                }}
              ></button>
            </div>
          }
        />
        {/* {rowHandler.show1 && (
          <> */}
        {tableData2?.length > 0 ? (
          <Tables
            style={{ margin: "1px" }}
            thead={activityTHEAD}
            tbody={tableData2?.map((ele, index) => ({
              Update: (
                <>
                  <button
                    className="btn btn-lg btn-info ml-2"
                    onClick={() => {
                      const updatedData = [...tableData2]; // Create a copy of the state
                      updatedData[index]["IsUpdate"] = !ele?.IsUpdate; // Modify the copy
                      setTableData2(updatedData); // Set the state with the new array
                      if (!ele?.IsUpdate) handleEditUpdate(ele);
                    }}
                  >
                    {ele?.IsUpdate ? "Update" : "Edit"}
                  </button>

                  {loading ? (
                    <Loading />
                  ) : (
                    <button
                      className="btn btn-lg btn-info ml-2"
                      onClick={() => handleDeleteNote(ele?.NoteId)}
                    >
                      Delete
                    </button>
                  )}
                </>
              ),
              NoteId: ele?.NoteId,
              //  (
              //   <Input
              //     value={ele?.NoteId}
              //     className="form-control"
              //     disabled={true}
              //   />
              // ),
              Notes:
                ele?.IsUpdate === false ? (
                  // <Input
                  //   value={ele?.note}
                  //   className="form-control"
                  //   disabled={ele?.IsUpdate == false}
                  // />
                  <textarea
                    type="text"
                    className="summaryheightTicket"
                    id="Note"
                    name="Note"
                    disabled={ele?.IsUpdate == false}
                    // lable="Note"
                    value={ele?.note}
                    onChange={(e) => {
                      const updatedData = [...tableData2];
                      updatedData[index]["note"] = e?.target.value;
                      setTableData2(updatedData);
                    }}
                  ></textarea>
                ) : (
                  // <Input
                  //   name="Note"
                  //   className="form-control"
                  //   value={ele?.note}
                  //   onChange={(e) => {
                  //     const updatedData = [...tableData2];
                  //     updatedData[index]["note"] = e?.target.value;
                  //     setTableData2(updatedData);
                  //   }}
                  // />
                  <textarea
                    type="text"
                    className="summaryheightTicket"
                    id="Note"
                    name="Note"
                    // lable="Note"
                    value={ele?.note}
                    onChange={(e) => {
                      const updatedData = [...tableData2];
                      updatedData[index]["note"] = e?.target.value;
                      setTableData2(updatedData);
                    }}
                  ></textarea>
                ),
              "User Name": (
                <Tooltip label={ele?.RealName}>
                  <span
                    id={`projectName-${index}`}
                    targrt={`projectName-${index}`}
                    style={{ textAlign: "center" }}
                  >
                    {shortenNamesummary(ele?.RealName)}
                  </span>
                </Tooltip>
              ),
              //  (
              //   <Input
              //     value={ele?.RealName}
              //     className="form-control"
              //     disabled={true}
              //   />
              // ),
              DateSubmitted: ele?.dtEntry,
              //  (
              //   <Input
              //     value={ele?.dtEntry}
              //     disabled={true}
              //     className="form-control"
              //   />
              // ),
            }))}
            tableHeight={"tableHeight"}
          />
        ) : (
          <span style={{ textAlign: "center" }}>
            There are no notes attached to this issue.
          </span>
        )}{" "}
        {/* </>
        )} */}
      </div>

      <div className="card patient_registration_card mt-3">
        <Heading
          title={t("View History Details")}
          secondTitle={
            <div style={{ marginRight: "0px" }}>
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
                }}
              ></button>
            </div>
          }
        />
        {rowHandler.show && (
          <>
            {tableData1?.length > 0 ? (
              <Tables
                thead={issueHistoryTHEAD}
                tbody={tableData1?.map((ele, index) => ({
                  DateModified: ele?.Updatedate,
                  "User Name": ele?.username,
                  Field: ele?.field_name,
                  "Old Value": ele?.leble1,
                  "New Value": ele?.leble2,
                }))}
                tableHeight={"tableHeight"}
              />
            ) : (
              <span style={{ textAlign: "center" }}>
                There are no notes history of this issue.
              </span>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default ClientViewIssueModal;
