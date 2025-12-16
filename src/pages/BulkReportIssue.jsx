import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../components/UI/Heading";
import Input from "../components/formComponent/Input";

import { MOBILE_NUMBER_VALIDATION_REGX } from "../utils/constant";

import ReactSelect from "../components/formComponent/ReactSelect";

import axios from "axios";
import { headers } from "../utils/apitools";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NewTicketModal from "../components/UI/customTable/NetTicketModal";
import Modal from "../components/modalComponent/Modal";
import * as XLSX from "xlsx";
import { inputBoxValidation } from "../utils/utils";
import BrowseButton from "../components/formComponent/BrowseButton";
import Tables from "../components/UI/customTable";
import TableSelect from "../components/formComponent/TableSelect";
import { apiUrls } from "../networkServices/apiEndpoints";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
import { formatDate } from "date-fns";

const BulkReportIssue = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErros] = useState({});
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const navigate = useNavigate();
  const [ticketid, setticketid] = useState("");
  const [formData, setFormData] = useState({
    Project: "",
    Project1: "",
    Category: "",
    AssignTo: "",
    Priority: "",
    ReportedByName: "",
    ReportedByMobile: "",
    Description: "",
    Summary: "",
    ManHours: "",
    ExcelType: "",
    NoteType: "",
  });
  const [tableData, setTableData] = useState([]);
  const [project, setProject] = useState([]);
  const [category, setCategory] = useState([]);
  const [assignto, setAssignedto] = useState([]);
  const [priority, setPriority] = useState([]);
  console.log("tabledata", tableData);
  const [rowHandler, setRowHandler] = useState({
    SummaryShow: false,
    DateSubmittedShow: false,
    TextEditorShow: false,
  });

  const handleDeliveryButton2 = () => {
    setRowHandler({
      ...rowHandler,
      TextEditorShow: !rowHandler?.TextEditorShow,
    });
  };
  const handleSummaryShow = () => {
    setRowHandler({ ...rowHandler, SummaryShow: !rowHandler?.SummaryShow });
  };

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDeliveryChange1 = (name, selectedOption) => {
    const value = selectedOption ? selectedOption.value : null;

    // Update main form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update all table rows
    const updatedTableData = tableData.map((row) => ({
      ...row,
      [name]: {
        value,
        isValid: !!value,
      },
    }));
    setTableData(updatedTableData);
  };

  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        ProjectID: Number(0),
        SearchType: String(0),
        Date: new Date(),
        ManagerID: new Date(),
      })
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
  function removeHtmlTags(text) {
    return text?.replace(/<[^>]*>?/gm, "");
  }

  const getCategory = (proj) => {
    axiosInstances
      .post(apiUrls.Category_Select, {
        RoleID: useCryptoLocalStorage("user_Data", "get", "ID"),
        ProjectID: Number("0"),
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.NAME };
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
          return { label: item?.Name, value: item?.ID };
        });
        setAssignedto(assigntos);
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
        setFormData({ ...formData, Priority: assigntos[0]?.value });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const transformData = (data) => {
    const headers = data[0]; // First array is the header
    const rows = data.slice(1); // Remaining arrays are the data rows

    return rows.map((row) => {
      let obj = {};
      row.forEach((value, index) => {
        obj[headers[index]] = value;
      });
      return obj;
    });
  };

  const getReportNote = (event) => {
    const file = event?.target?.files[0]; // Get the uploaded file
    const reader = new FileReader();
    // console.log("reader", reader);

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming the first sheet is the one you want
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert the sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile);
      const mappedData = transformData(jsonData).map((ele, index) => {
        const categoryOption = category.find(
          (option) => option.label === ele?.Category
        );
        const assignToOption = assignto.find(
          (option) => option.label === ele?.AssignTo
        );
        const priorityOption = priority.find(
          (option) => option.label === ele?.Priority
        );
        const projectOption = project.find(
          (option) => option.label === ele?.Project
        );
        return {
          "S.No.": index + 1,
          Project: {
            value: projectOption ? projectOption.value : null,
            label: ele?.Project,
            isValid: !!projectOption,
          },
          Category: {
            value: categoryOption ? categoryOption.value : null,
            label: ele?.Category,
            isValid: !!categoryOption,
          },
          AssignTo: {
            value: assignToOption ? assignToOption.value : null,
            label: ele?.AssignTo,
            isValid: !!assignToOption,
          },
          Email: ele?.Email,
          Priority: {
            value: priorityOption ? priorityOption.value : null,
            label: ele?.Priority,
            isValid: !!priorityOption,
          },
          Summary: ele?.Summary,
          ReportedByName: ele?.ReportedByName,
          ReportedByMobile: ele?.ReportedByMobile,
          ValidMobile: isValidMobile(ele?.ReportedByMobile),
          ValidReporter: ele?.ReportedByName?.length > 0 ? true : false,
          ValidSummary: ele?.Summary?.length > 0 ? true : false,
          ValidDescription: ele?.Description?.length > 0 ? true : false,
        };
      });
      setTableData(mappedData);
      event.target.value = null;
    };
    reader.readAsArrayBuffer(file);
  };
  const fetchemptyexcel = () => {
    const data = [
      [
        t("Project"),
        t("Category"),
        t("AssignTo"),
        t("Priority"),
        t("Summary"),
        t("ReportedByName"),
        t("ReportedByMobile"),
        t("Description"),
      ],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    getCategory();
    getProject();
    getAssignTo();
    getPriority();
  }, []);

  const handleInputChange = (index, field, selectedOption) => {
    const newData = [...tableData];
    newData[index][field].value = selectedOption ? selectedOption.value : null;
    newData[index][field].isValid = selectedOption ? true : false;
    setTableData(newData);
  };
  const handleChange = (index, name, value) => {
    const newData = [...tableData];
    newData[index][name] = value;
    setTableData(newData);
  };

  const handleSave = (e) => {
    let transformPayload = [];
    tableData.map((item, index) => {
      transformPayload.push({
        // Index: index + 1,
        ProjectId: item.Project.value,
        CategoryId: item.Category.value,
        // AssignTo: item.AssignTo.label || item.AssignTo.value,
        AssignTo: String(item.AssignTo.value),
        PriorityID: item.Priority.value,
        Summary: String(item.Summary),
        ReporterName: String(item.ReportedByName),
        ReporterMobile: String(item.ReportedByMobile),
        Description: item?.Description,
      });
    });
    setIsSubmitting(true);
    axiosInstances
      .post(apiUrls.BulkNewTicket, {
        ReporterID: "0",
        TicketData: transformPayload,
      })
      // const form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
      // form.append("RoleID", useCryptoLocalStorage("user_Data", "get", "RoleID"));
      // form.append("TicketData", JSON.stringify(transformPayload));
      // axios
      //   .post(apiUrls?.BulkNewTicket, form, { headers })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error("API request failed.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const [visible, setVisible] = useState({
    showVisible: false,
    showData: {},
  });
  const handleDeleteRow = (index) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
  };

  const [selected, setSelected] = React.useState("yes");

  const handleRadioChange = (value) => {
    setSelected(value);
    if (value === "yes") {
      navigate("/BulkReportIssue");
    } else if (value === "no") {
      navigate("/BulkNewTicketNotes");
    }
  };

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "ReportedByMobile") {
      newValue = value.replace(/\D/g, "");
      if (newValue.length > 10) {
        newValue = newValue.slice(0, 10);
      }
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setTableData((prev) =>
      prev.map((row) => ({
        ...row,
        [name]: newValue,
      }))
    );
  };

  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Preview NewTicket Details")}
        >
          <NewTicketModal
            visible={visible}
            id={ticketid}
            setVisible={setVisible}
          />
        </Modal>
      )}
      <div className="card patient_registration border">
        <Heading
          title={t("BulkNewTicket")}
          secondTitle={
            <div className="d-flex" style={{ justifyContent: "space-between" }}>
              <label>
                <input
                  className="ml-1"
                  type="radio"
                  name="option"
                  value="yes"
                  checked={selected === "yes"}
                  onChange={() => handleRadioChange("yes")}
                  style={{ cursor: "pointer" }}
                />
                <span className="mb-2 ml-1">Bulk Ticket</span>
              </label>

              <label className="ml-4">
                <input
                  className="ml-1"
                  type="radio"
                  name="option"
                  value="no"
                  checked={selected === "no"}
                  style={{ cursor: "pointer" }}
                  onChange={() => handleRadioChange("no")}
                />
                <span className="mb-2 ml-1">Notes</span>
              </label>
            </div>
          }
          isBreadcrumb={true}
        />
        <div className="row g-4 m-2">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Project1"
            placeholderName={t("Project")}
            dynamicOptions={project}
            value={formData?.Project1}
            handleChange={handleDeliveryChange}
            isDisabled={tableData.length > 0}
            requiredClassName={"required-fields"}
          />
          <div className=" d-flex col-6 col-md-4 col-sm-6 col-12">
            <button
              className="btn btn-sm btn-success mr-2"
              onClick={fetchemptyexcel}
            >
              {t("Template Download")}
            </button>
            <div>
              <BrowseButton handleImageChange={getReportNote} accept="xls/*" />
            </div>
          </div>
        </div>
      </div>
      <div className="card mt-2">
        {tableData?.length > 0 && (
          <>
            <Heading title={t("BulkTicket Details")} />
            <div>
              <Tables
                thead={[
                  t("S.No."),
                  <div className="">
                    <span>{t("Project")}</span>
                    <TableSelect
                      dynamicOptions={project}
                      name="Project"
                      value={formData.Project}
                      handleChange={handleDeliveryChange1}
                    />
                  </div>,
                  <div className="">
                    <span>{t("Category")}</span>
                    <TableSelect
                      dynamicOptions={category}
                      name="Category"
                      value={formData.Category}
                      handleChange={handleDeliveryChange1}
                    />
                  </div>,
                  <div className="">
                    <span>{t("AssignTo")}</span>
                    <TableSelect
                      dynamicOptions={assignto}
                      name="AssignTo"
                      value={formData?.AssignTo}
                      handleChange={handleDeliveryChange1}
                    />
                  </div>,
                  <div className="">
                    <span>{t("Priority")}</span>
                    <TableSelect
                      dynamicOptions={priority}
                      name="Priority"
                      value={formData?.Priority}
                      handleChange={handleDeliveryChange1}
                    />
                  </div>,

                  <div className="">
                    <span>{t("Summary")}</span>
                    <Input
                      type="text"
                      name="Summary"
                      className="form-control"
                      value={formData.Summary}
                      onChange={handleChange1}
                    />
                  </div>,
                  <div className="">
                    <span>{t("Reported Name")}</span>
                    <Input
                      type="text"
                      name="ReportedByName"
                      className="form-control"
                      value={formData.ReportedByName}
                      onChange={handleChange1}
                    />
                  </div>,
                  <div className="">
                    <span>{t("Reported Mobile")}</span>
                    <Input
                      type="text"
                      name="ReportedByMobile"
                      className="form-control"
                      value={formData.ReportedByMobile}
                      onChange={handleChange1}
                    />
                  </div>,
                  <div className="">
                    <span>{t("Description")}</span>
                    <Input
                      type="text"
                      name="Description"
                      className="form-control"
                      value={formData.Description}
                      onChange={handleChange1}
                    />
                  </div>,

                  t("Action"),
                ]}
                tbody={tableData?.map((ele, index) => ({
                  "S.No.": index + 1,
                  Project: (
                    <TableSelect
                      dynamicOptions={project}
                      name="Project"
                      value={ele.Project.value}
                      respclass={ele.Project.isValid ? "" : "border-red"}
                      handleChange={(name, selectedOption) =>
                        handleInputChange(index, name, selectedOption)
                      }
                    />
                  ),
                  Category: (
                    <TableSelect
                      dynamicOptions={category}
                      name="Category"
                      value={ele.Category.value}
                      respclass={ele.Category.isValid ? "" : "border-red"}
                      handleChange={(name, selectedOption) =>
                        handleInputChange(index, name, selectedOption)
                      }
                    />
                  ),
                  AssignTo: (
                    <TableSelect
                      dynamicOptions={assignto}
                      name="AssignTo"
                      placeholder=""
                      respclass={ele.AssignTo.isValid ? "" : "border-red"}
                      value={ele.AssignTo.value}
                      handleChange={(name, selectedOption) =>
                        handleInputChange(index, name, selectedOption)
                      }
                    />
                  ),
                  Priority: (
                    <TableSelect
                      dynamicOptions={priority}
                      placeholder=""
                      respclass={ele.Priority.isValid ? "" : "border-red"}
                      name="Priority"
                      value={ele.Priority.value}
                      handleChange={(name, selectedOption) =>
                        handleInputChange(index, name, selectedOption)
                      }
                    />
                  ),
                  Summary: (
                    <Input
                      type="text"
                      className={`form-control ${!ele?.ValidSummary ? "border-red" : ""}`}
                      value={ele.Summary}
                      onChange={(e) =>
                        handleChange(index, "Summary", e.target.value)
                      }
                    />
                  ),
                  "Reported Name": (
                    <Input
                      type="text"
                      value={ele.ReportedByName}
                      name="ReportedByName"
                      className="form-control"
                      onChange={(e) =>
                        handleChange(index, "ReportedByName", e.target.value)
                      }
                    />
                  ),
                  " Reported Mobile": (
                    <Input
                      type="number"
                      name="ReportedByMobile"
                      className={`form-control ${!ele?.ValidMobile ? "border-red" : ""}`}
                      value={ele.ReportedByMobile}
                      onChange={(e) => {
                        inputBoxValidation(
                          MOBILE_NUMBER_VALIDATION_REGX,
                          e,
                          (validEvent) =>
                            handleChange(
                              index,
                              "ReportedByMobile",
                              validEvent.target.value
                            )
                        );
                      }}
                    />
                  ),
                  Description: (
                    <Input
                      type="text"
                      className="form-control"
                      value={ele.Description}
                      onChange={(e) =>
                        handleChange(index, "Description", e.target.value)
                      }
                    />
                  ),
                  Action: (
                    <div style={{ width: "10px", textAlign: "center" }}>
                      <i
                        className="fa fa-trash text-danger"
                        aria-hidden="true"
                        onClick={() => handleDeleteRow(index)}
                      />
                    </div>
                  ),
                }))}
              />
              <button
                style={{ float: "right", marginLeft: "auto" }}
                className="btn btn-sm btn-success m-2"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {t("Submit Issues")}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BulkReportIssue;
