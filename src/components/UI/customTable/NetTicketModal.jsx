import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Heading from "../Heading";
import Input from "../../formComponent/Input";
import { useTranslation } from "react-i18next";
import TextEditor from "../../formComponent/TextEditor";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { axiosInstances } from "../../../networkServices/axiosInstance";
const NewTicketModal = ({ visible, setVisible }) => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
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
    ManHours: "",
    ReferenceCode: "",
  });

  function removeHtmlTags(text) {
    return text.replace(/<[^>]*>?/gm, "");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "ReferenceCode") {
      if (value.length == 4) return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleTableChange = () => {
    setTableData2({});
  };

  const handleSearchNote = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.ViewNote, {
        TicketID: visible?.visible?.TicketID,
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
        TicketID: visible?.visible?.TicketID,
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
    console.log("ticket", ticket);
    axiosInstances
      .post(apiUrls.ViewTicket, {
        TicketID: Number(visible?.visible?.TicketID),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setFormData({
            TicketID: res?.data.data[0].Id,
            Project: res?.data.data[0].ProjectName,
            Category: res?.data.data[0].CategoryName,
            ViewStatus: res?.data.data[0]?.Status,
            DateSubmitted: res?.data.data[0]?.SubmittedDate,
            LastUpdate: res?.data.data[0]?.Updatedate,
            Reporter: res?.data.data[0]?.TicketRaisedBy,
            AssignedTo: res?.data.data[0]?.AssignedTo,
            Priority: res?.data.data[0]?.priority,
            Status: res?.data.data[0]?.Status,
            ReportedByMobile: res?.data.data[0]?.RepoterMobileNo,
            ReportedByName: res?.data.data[0]?.RepoterName,
            Summary: res?.data.data[0]?.summary,
            Description: removeHtmlTags(res?.data.data[0]?.description),
            DeliveryDate:
              res?.data.data[0]?.DeliveryDate != ""
                ? new Date(res?.data.data[0]?.DeliveryDate)
                : "",
            ManHours: res?.data.data[0]?.ManHour,
            Note: "",
            ReferenceCode: res?.data.data[0]?.ReferenceCode,
          });
        } else {
          toast.error("You are not authorised to view this ticket");
          setVisible(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [edit, setEdit] = useState(false);
  const [rowHandler, setRowHandler] = useState({
    show: false,
    show1: false,
  });

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
    handleSearchNote();
    handleSearchHistory();
    handleIssueSearch();
  }, []);

  return (
    <>
      <div className="card">
        <Heading
          title={"Ticket Generated"}
          secondTitle={<div className="col-sm-12 col-xs-12"></div>}
        />
        <div className="row m-2">
          <Input
            type="text"
            className="form-control"
            id="TickeID"
            name="TickeID"
            lable="TickeID"
            value={formData?.TicketID}
            placeholder=" "
            respclass="col-md-4 col-12 col-sm-12"
            onChange={handleChange}
            disabled={true}
          />

          <Input
            type="text"
            className="form-control"
            id="Project"
            name="Project"
            lable="Project"
            value={formData?.Project}
            placeholder=" "
            respclass="col-md-4 col-12 col-sm-12"
            onChange={handleChange}
            disabled={true}
          />

          <Input
            type="text"
            className="form-control"
            id="Category"
            name="Category"
            lable="Category"
            value={formData?.Category}
            placeholder=" "
            respclass="col-md-4 col-12 col-sm-12"
            onChange={handleChange}
            disabled={true}
          />

          <Input
            type="text"
            className="form-control"
            id="DateSubmitted"
            name="DateSubmitted"
            lable="DateSubmitted"
            value={formData?.DateSubmitted}
            placeholder=" "
            respclass="col-md-4 col-12 col-sm-12"
            onChange={handleChange}
            disabled={edit == true || true}
          />

          <Input
            type="text"
            className="form-control"
            id="Reporter"
            name="Reporter"
            lable="Reporter"
            value={formData?.Reporter}
            placeholder=" "
            respclass="col-md-4 col-12 col-sm-12"
            onChange={handleChange}
            disabled={true}
          />

          <Input
            type="text"
            className="form-control"
            id="AssignedTo"
            name="AssignedTo"
            lable="AssignedTo"
            value={formData?.AssignedTo}
            placeholder=" "
            respclass="col-md-4 col-12 col-sm-12"
            onChange={handleChange}
            disabled={true}
          />

          <Input
            type="text"
            className="form-control"
            id="Priority"
            name="Priority"
            lable="Priority"
            value={formData?.Priority}
            placeholder=" "
            respclass="col-md-4 col-12 col-sm-12"
            onChange={handleChange}
            disabled={true}
          />
          <Input
            type="text"
            className="form-control"
            id="Status"
            name="Status"
            lable="Status"
            value={formData?.Status}
            placeholder=" "
            respclass="col-md-4 col-12 col-sm-12"
            onChange={handleChange}
            disabled={true}
          />

          <Input
            type="text"
            className="form-control"
            id="ReportedByMobile"
            name="ReportedByMobile"
            lable="ReportedByMobile"
            value={formData?.ReportedByMobile}
            placeholder=" "
            respclass="col-md-4 col-12 col-sm-12"
            onChange={handleChange}
            disabled={true}
          />
          <Input
            type="text"
            className="form-control"
            id="ReportedByName"
            name="ReportedByName"
            lable="ReportedByName"
            value={formData?.ReportedByName}
            placeholder=" "
            respclass="col-md-4 col-12 col-sm-12"
            onChange={handleChange}
            disabled={true}
          />
          <Input
            type="text"
            className="form-control"
            id="Summary"
            name="Summary"
            lable="Summary"
            value={formData?.Summary}
            placeholder=" "
            respclass="col-md-4 col-12 col-sm-12"
            onChange={handleChange}
            disabled={true}
          />
          <div className="col-12">
            <TextEditor
              value={formData?.Description ? formData?.Description : ""}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default NewTicketModal;
