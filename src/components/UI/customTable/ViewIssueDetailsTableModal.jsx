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

const ViewIssueDetailsTableModal = ({ visible, tableData, setVisible }) => {
  // console.log("visible", visible);

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
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [reopen, setReOpen] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [tableData1, setTableData1] = useState([]);
  const [loading, setLoading] = useState();
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
  });
  const [formDataUpdate, setFormDataUpdate] = useState({
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
    ClientManHour: "",
    ManHour: "",
    ReferenceCode: "",
    Note: "",
    HoldReason: "",
    Reason: "",
    ReOpen: "",

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
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
        ProjectID: visible?.showData?.ProjectID,
        IsActive: 1,
        IsMaster: 0,
      })

      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
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
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
        ProjectID: visible?.showData?.ProjectID,
        IsActive: 1,
        IsMaster: 0,
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

    setFormDataUpdate({ ...formDataUpdate, [name]: value });
  };

  const handleSearchNote = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.ViewNote, {
        TicketID: visible?.showData?.TicketID,
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
        TicketID: visible?.showData?.TicketID,
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
        TicketID: ticket,
      })

      .then((res) => {
        setFormData({
          TicketID: res?.data.data[0].Id,
          Project: res?.data.data[0].ProjectName,
          ProjectID: res?.data.data[0].Project_ID,
          Category: res?.data.data[0].CategoryName,
          ViewStatus: res?.data.data[0]?.Status,
          DateSubmitted: res?.data.data[0]?.SubmittedDate,
          LastUpdate: res?.data.data[0]?.Updatedate,
          Reporter: res?.data.data[0]?.AssignedTo,
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
          Reporter: res?.data.data[0]?.AssignedTo,
          AssignedTo: res?.data.data[0]?.handler_id,
          Priority: res?.data.data[0]?.priority,
          Status: res?.data.data[0]?.StatusId,
          ReportedByMobile: res?.data.data[0]?.RepoterMobileNo,
          ReportedByName: res?.data.data[0]?.RepoterName,
          Summary: res?.data.data[0]?.summary,
          Description: removeHtmlTags(res?.data.data[0]?.description),
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
      axiosInstances
        .post(apiUrls.UpdateTicket, {
          TicketID: Number(formDataUpdate?.TicketID ?? 0),
          User_id: 0,
          CategoryID: Number(formDataUpdate?.Category ?? 0),
          AssignToID: Number(formDataUpdate?.AssignedTo ?? 0),
          PriorityID: Number(formDataUpdate?.Priority ?? 0),
          DeliveryDate: String(
            formDataUpdate?.DeliveryDate == ""
              ? moment(new Date()).format("YYYY-MM-DD")
              : formatDate(formDataUpdate?.DeliveryDate)
          ),
          DeliveryDateClient: String(
            formDataUpdate?.ClientDeliveryDate == ""
              ? moment(new Date()).format("YYYY-MM-DD")
              : formatDate(formDataUpdate?.ClientDeliveryDate)
          ),
          Summary: String(formDataUpdate?.Summary || ""),
          Description: String(
            removeHtmlTags(formDataUpdate?.Description) || ""
          ),
          Note: String(formDataUpdate?.Note || ""),
          ReferenceCode: String(formDataUpdate?.ReferenceCode || ""),
          ManHour: String(formDataUpdate?.ManHour || "0"),
          ManHoursClient: String(formDataUpdate?.ClientManHour || "0"),
          ReportedByName: String(formDataUpdate?.ReportedByName || ""),
          ReportedByMobileNo: String(formDataUpdate?.ReportedByMobile || ""),
          HoldReason: String(formDataUpdate?.HoldReason || ""),
          Status: String(formDataUpdate?.Status || ""),
          ModuleID: Number(formDataUpdate?.ModuleName ?? 0),
          ModuleName: String(
            getlabel(formDataUpdate?.ModuleName, moduleName) || ""
          ),
          PagesID: Number(formDataUpdate?.PageName ?? 0),
          PagesName: String(getlabel(formDataUpdate?.PageName, pageName) || ""),
          IsReOpen: Boolean(Number(formDataUpdate?.IsReOpen ?? 1)), // "1" → true, "0" → false
          ReOpenReasonID: Number(formDataUpdate?.ReOpen ?? 0),
          ReOpenReason: String(getlabel(formDataUpdate?.ReOpen, reopen) || ""),
        })

        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setLoading(false);
            handleIssueSearch();
            setVisible(false);
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
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
    axiosInstances
      .post(apiUrls.DeleteNote, {
        NoteID: id,
        TicketID: formDataUpdate?.TicketID,
      })

      .then((res) => {
        toast.success(res?.data?.message);

        handleSearchNote();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occurred"
        );
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
        NoteID: ele?.NoteId,
        TicketID: formDataUpdate?.TicketID,
        NoteText: ele?.note,
      })

      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
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
  const [project, setProject] = useState([]);
  const [category, setCategory] = useState([]);
  const [assignto, setAssignedto] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
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
        ProjectID: 0,
        IsMaster: "0",
        VerticalID: 0,
        TeamID: 0,
        WingID: 0,
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
        RoleID: 0,
        ProjectID: proj,
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
        ProjectID: 0,
      })

      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setAssignedto(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProject();
    getAssignTo();
    getPriority();
    getStatus();
    getModule();
    getPage();
    handleSearchNote();
    handleSearchHistory();
    if (visible?.showData?.flag) {
      handleIssueSearch(visible?.showData?.Id);
    } else {
      handleIssueSearch(visible?.showData?.TicketID);
    }
  }, []);

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
  useEffect(() => {
    getReopen();
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

          {edit == false ? (
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
            <>
              <ReactSelect
                respclass="col-md-2 col-12 col-sm-12 mt-2"
                name="AssignedTo"
                placeholderName="AssignedTo"
                dynamicOptions={assignto}
                value={formDataUpdate?.AssignedTo}
                handleChange={handleDeliveryChange}
              />
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
              respclass="col-md-4 col-12 col-sm-12"
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
              respclass="col-md-4 col-12 col-sm-12"
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
            <div className="col-12">
              <TextEditor
                value={formDataUpdate?.Description}
                placeholder="Description"
                onChange={(value) =>
                  setFormDataUpdate({ ...formDataUpdate, Description: value })
                }
              />
            </div>
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
              onChange={handleChange}
              disabled={edit == false}
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
              onChange={handleChange}
            ></textarea>
          )}

          {RoleID == 7 && (
            <>
              {edit == false ? (
                <Input
                  type="text"
                  className="form-control mt-2"
                  id="ClientDeliveryDate"
                  name="ClientDeliveryDate"
                  lable="ClientDeliveryDate"
                  value={formData?.ClientDeliveryDate}
                  placeholder=" "
                  respclass="col-md-2 col-12 col-sm-12"
                  onChange={handleChange}
                  disabled={edit == false}
                />
              ) : (
                <DatePicker
                  className="custom-calendar"
                  id="ClientDeliveryDate"
                  name="ClientDeliveryDate"
                  placeholder={VITE_DATE_FORMAT}
                  respclass="col-md-2 col-12 col-sm-12 mt-2"
                  value={formDataUpdate?.ClientDeliveryDate}
                  handleChange={searchHandleChange}
                  disabled={
                    ShowClientDeliveryDate !== "0" ||
                    ShowClientDeliveryDate === undefined ||
                    ShowClientDeliveryDate === null
                  }
                />
              )}
            </>
          )}

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

          {RoleID == 7 && (
            <>
              {edit == false ? (
                <Input
                  type="number"
                  className="form-control mt-2"
                  id="ClientManHour"
                  name="ClientManHour"
                  lable="ClientManHour"
                  value={formData?.ClientManHour}
                  placeholder=""
                  respclass="col-md-2 col-12 col-sm-12"
                  onChange={handleChange}
                  disabled={edit == false}
                />
              ) : (
                <Input
                  type="number"
                  className="form-control mt-2"
                  id="ClientManHour"
                  name="ClientManHour"
                  lable="ClientManHour"
                  value={formDataUpdate?.ClientManHour}
                  placeholder=""
                  respclass="col-md-2 col-12 col-sm-12"
                  onChange={handleChange}
                  disabled={ShowClientManHour !== "0"}
                />
              )}
            </>
          )}

          {clientId === 7 ? (
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
          )}

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
                  <button
                    className="btn btn-lg btn-info ml-2"
                    onClick={() => handleDeleteNote(ele?.NoteId)}
                  >
                    Delete
                  </button>
                </>
              ),
              NoteId: ele?.NoteId,

              Notes:
                ele?.IsUpdate === false ? (
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

              DateSubmitted: ele?.dtEntry,
            }))}
            tableHeight={"tableHeight"}
          />
        ) : (
          <span style={{ textAlign: "center" }}>
            There are no notes attached to this issue.
          </span>
        )}{" "}
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
                  "Old Value": ele?.leble1 == "01-01-1970" ? "" : ele.leble1,
                  "New Value": ele?.leble2 == "01-01-1970" ? "" : ele.leble2,
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
export default ViewIssueDetailsTableModal;
