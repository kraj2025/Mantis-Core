import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import Input from "../components/formComponent/Input";
import Loading from "../components/loader/Loading";
import { apiUrls } from "../networkServices/apiEndpoints";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import BrowseButton from "../components/formComponent/BrowseButton";
import { useTranslation } from "react-i18next";
import Tables from "../components/UI/customTable";
import TableSelect from "../components/formComponent/TableSelect";
import ReactSelect from "../components/formComponent/ReactSelect";
import { axiosInstances } from "../networkServices/axiosInstance";
const AMCSalesBooking = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [project, setProject] = useState([]);
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [t] = useTranslation();
  const [formData, setFormData] = useState({
    Project: "",
    April: "",
    May: "",
    June: "",
    July: "",
    August: "",
    September: "",
    October: "",
    November: "",
    December: "",
    January: "",
    February: "",
    March: "",
    Remark: "",
    TotalAmount: "",
    SalesDate: "",
    PaymentMode: "",
    Items: "",
  });

  const handleGetItemSearch = (value) => {
    axiosInstances
      .post(apiUrls.Payement_Installment_Select, {
        ProjectID: String(value),
        SearchType: "GetItem",
        ItemName: "",
        ItemID: "",
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.ItemNameGroup, value: item?.ItemIDGroup };
        });
        setItems(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function getlabel(id, dropdownData) {
    const ele = dropdownData?.filter((item) => item?.value === id);
    return ele?.length > 0 ? ele[0].label : undefined;
  }
  const transformData = (data) => {
    const headers = data[0];
    const rows = data.slice(1);

    return rows.map((row) => {
      let obj = {};
      row.forEach((value, index) => {
        obj[headers[index]] = value;
      });
      return obj;
    });
  };

  const fetchemptyexcel = () => {
    const data = [
      [
        t("Project"),
        t("April"),
        t("May"),
        t("June"),
        t("July"),
        t("August"),
        t("September"),
        t("October"),
        t("November"),
        t("December"),
        t("January"),
        t("February"),
        t("March"),
        // t("TotalAmount"),
      ],
    ];

    // Create a worksheet from the data
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Create a new workbook and add the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    // Convert the workbook to a binary Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create a Blob from the binary Excel file
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const getReportNote = (event) => {
    const file = event?.target?.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Remove header row
      // const [headers, ...rows] = jsonData;
      const mappedData = transformData(jsonData).map((ele, index) => {
        const projectOption = project.find(
          (option) => option.label === ele?.Project
        );
        // console.log("projectOption", projectOption);
        return {
          "S.No.": index + 1,
          Project: {
            value: projectOption ? projectOption.value : null,
            label: ele?.Project,
            // isValid: !!projectOption,
          },

          April: ele?.April,
          May: ele?.May,
          June: ele?.June,
          July: ele?.July,
          August: ele?.August,
          September: ele?.September,
          October: ele?.October,
          November: ele?.November,
          December: ele?.December,
          January: ele?.January,
          February: ele?.February,
          March: ele?.March,
          // TotalAmount: ele?.TotalAmount,
        };
      });
      // const mappedData = rows.map((row, index) => ({
      // "S.No.": index + 1,
      // ProjectID: row[0] ?? "", // Assuming Ticket No. is first column
      // Project: row[0] ?? "",
      // April: row[1] ?? "",
      // May: row[2] ?? "",
      // June: row[3] ?? "",
      // July: row[4] ?? "",
      // August: row[5] ?? "",
      // September: row[6] ?? "",
      // October: row[7] ?? "",
      // November: row[8] ?? "",
      // December: row[9] ?? "",
      // January: row[10] ?? "",
      // February: row[11] ?? "",
      // March: row[12] ?? "",
      // TotalAmount: row[13] ?? "",

      // }));

      setTableData(mappedData);
      event.target.value = null; // Reset the input
    };

    reader.readAsArrayBuffer(file);
  };
  const handleChange = (index, name, value) => {
    const newData = [...tableData];
    newData[index][name] = value;
    setTableData(newData);
  };

  const handleDeliveryChangeItems = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleDeleteRow = (index) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
  };

  const handleSave = () => {
    if (!formData?.Items) {
      toast.error("Please Select Project & Items.");
    } else {
      let transformPayload = [];
      tableData.map((item, index) => {
        transformPayload.push({
          ProjectID: Number(item.Project.value),
          Project: String(item?.Project.label),
          April: String(item?.April),
          May: String(item?.May),
          June: String(item?.June),
          July: String(item?.July),
          August: String(item?.August),
          September: String(item?.September),
          October: String(item?.October),
          November: String(item?.November),
          December: String(item?.December),
          January: String(item?.January),
          February: String(item?.February),
          March: String(item?.March),

          // TotalAmount: item?.TotalAmount,
        });
      });
      setLoading(true);
      setIsSubmitting(true);
      axiosInstances
        .post(apiUrls.AMC_Payment_Installment_Insert, {
          ItemID: Number(formData?.Items),
          ItemsName: String(getlabel(formData?.Items, items)),
          AmcData: transformPayload,
        })
        // const form = new FormData();
        // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
        // form.append(
        //   "LoginName",
        //   useCryptoLocalStorage("user_Data", "get", "realname")
        // );
        // form.append("ItemID", formData?.Items);
        // form.append("ItemsName", getlabel(formData?.Items, items));
        // form.append("AmcData", JSON.stringify(transformPayload));
        // axios
        //   .post(apiUrls?.AMC_Payment_Installment_Insert, form, { headers })
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setLoading(false);
            setFormData({ ...formData, Items: "" });
            setTableData((prevData) =>
              prevData.map((item) => ({
                ...item,
                Project: "",
                April: "",
                May: "",
                June: "",
                July: "",
                August: "",
                September: "",
                October: "",
                November: "",
                December: "",
                January: "",
                February: "",
                March: "",
              }))
            );
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          toast.error("API request failed.");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };
  const handleDeliveryChange1 = (name, selectedOption) => {
    const value = selectedOption ? selectedOption.value : null;
    const label = selectedOption ? selectedOption.label : null;
    // console.log("Selected:", { name, value, label });

    // Update main form data
    setFormData((prev) => ({
      ...prev,
      [name]: { value, label },
    }));

    // Update all table rows
    const updatedTableData = tableData.map((row) => ({
      ...row,
      [name]: {
        value,
        label,
        name,
      },
    }));
    handleGetItemSearch(value);
    setTableData(updatedTableData);
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
  const getProject = () => {
    const payload = {
      ProjectID: 0,
      IsMaster: "0",
      VerticalID: 0,
      TeamID: 0,
      WingID: 0,
    };
    axiosInstances
      .post(apiUrls.ProjectSelect, payload)

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

  const handleInputChange = (index, field, selectedOption) => {
    const newData = [...tableData];
    newData[index][field] = {
      value: selectedOption ? selectedOption.value : null,
      label: selectedOption ? selectedOption.label : "",
      // isValid: !!selectedOption,
    };

    setTableData(newData);

    // Check if the field is "Project" and selectedOption is valid before calling
    if (field === "Project") {
      handleGetItemSearch(selectedOption.value);
    }
  };

  useEffect(() => {
    getProject();
    // handleGetItemSearch();
  }, []);
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <div className=" d-flex col-2">
            <button
              className="btn btn-sm btn-success mr-2"
              onClick={fetchemptyexcel}
            >
              {t("Template Download")}
            </button>
            <div>
              <BrowseButton
                handleImageChange={getReportNote}
                accept="xls/*"
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        {tableData?.length > 0 && (
          <>
            <Heading title={t("Bulk AMC Upload")} />
            <div>
              <Tables
                thead={[
                  { name: t("S.No."), width: "5%" },
                  "Project",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                  "January",
                  "February",
                  "March",
                  // <div className="d-none">
                  //   <span>{t("Project")}</span>
                  //   <TableSelect
                  //     dynamicOptions={project}
                  //     name="Project"
                  //     value={formData.Project}
                  //     handleChange={handleDeliveryChange1}
                  //   />
                  // </div>,
                  // <div className="d-none">
                  //   <span>{t("April")}</span>
                  //   <Input
                  //     type="text"
                  //     name="April"
                  //     className="form-control"
                  //     value={formData.April}
                  //     onChange={handleChange1}
                  //   />
                  // </div>,
                  // <div className="d-none">
                  //   <span>{t("May")}</span>
                  //   <Input
                  //     type="text"
                  //     name="May"
                  //     className="form-control"
                  //     value={formData.May}
                  //     onChange={handleChange1}
                  //   />
                  // </div>,
                  // <div className="d-none">
                  //   <span>{t("June")}</span>
                  //   <Input
                  //     type="text"
                  //     name="June"
                  //     className="form-control"
                  //     value={formData.June}
                  //     onChange={handleChange1}
                  //   />
                  // </div>,
                  // <div className="d-none">
                  //   <span>{t("July")}</span>
                  //   <Input
                  //     type="text"
                  //     name="July"
                  //     className="form-control"
                  //     value={formData.July}
                  //     onChange={handleChange1}
                  //   />
                  // </div>,
                  // <div className="d-none">
                  //   <span>{t("August")}</span>
                  //   <Input
                  //     type="text"
                  //     name="August"
                  //     className="form-control"
                  //     value={formData.August}
                  //     onChange={handleChange1}
                  //   />
                  // </div>,
                  // <div className="d-none">
                  //   <span>{t("September")}</span>
                  //   <Input
                  //     type="text"
                  //     name="September"
                  //     className="form-control"
                  //     value={formData.September}
                  //     onChange={handleChange1}
                  //   />
                  // </div>,
                  // <div className="d-none">
                  //   <span>{t("October")}</span>
                  //   <Input
                  //     type="text"
                  //     name="October"
                  //     className="form-control"
                  //     value={formData.October}
                  //     onChange={handleChange1}
                  //   />
                  // </div>,
                  // <div className="d-none">
                  //   <span>{t("November")}</span>
                  //   <Input
                  //     type="text"
                  //     name="November"
                  //     className="form-control"
                  //     value={formData.November}
                  //     onChange={handleChange1}
                  //   />
                  // </div>,
                  // <div className="d-none">
                  //   <span>{t("December")}</span>
                  //   <Input
                  //     type="text"
                  //     name="December"
                  //     className="form-control"
                  //     value={formData.December}
                  //     onChange={handleChange1}
                  //   />
                  // </div>,
                  // <div className="d-none">
                  //   <span>{t("January")}</span>
                  //   <Input
                  //     type="text"
                  //     name="January"
                  //     className="form-control"
                  //     value={formData.January}
                  //     onChange={handleChange1}
                  //   />
                  // </div>,
                  // <div className="d-none">
                  //   <span>{t("February")}</span>
                  //   <Input
                  //     type="text"
                  //     name="February"
                  //     className="form-control"
                  //     value={formData.February}
                  //     onChange={handleChange1}
                  //   />
                  // </div>,
                  // <div className="d-none">
                  //   <span>{t("March")}</span>
                  //   <Input
                  //     type="text"
                  //     name="March"
                  //     className="form-control"
                  //     value={formData.March}
                  //     onChange={handleChange1}
                  //   />
                  // </div>,
                  // <div className="d-none">
                  //   <span>{t("TotalAmount")}</span>
                  //   <Input
                  //     type="text"
                  //     name="TotalAmount"
                  //     className="form-control"
                  //     value={formData.TotalAmount}
                  //     onChange={handleChange1}
                  //   />
                  // </div>,
                  t("Action"),
                ]}
                tbody={tableData?.map((ele, index) => ({
                  "S.No.": index + 1,
                  Project: (
                    <TableSelect
                      dynamicOptions={project}
                      name="Project"
                      value={ele.Project.value}
                      handleChange={(name, selectedOption) =>
                        handleInputChange(index, name, selectedOption)
                      }
                      requiredClassName={"required-fields"}
                    />
                  ),
                  April: (
                    <Input
                      type="number"
                      value={Math.floor(ele.April)}
                      name="April"
                      className="form-control"
                      onChange={(e) =>
                        handleChange(index, "April", e.target.value)
                      }
                    />
                  ),
                  May: (
                    <Input
                      type="number"
                      value={Math.floor(ele.May)}
                      name="May"
                      className="form-control"
                      onChange={(e) =>
                        handleChange(index, "May", e.target.value)
                      }
                    />
                  ),
                  June: (
                    <Input
                      type="number"
                      value={Math.floor(ele.June)}
                      name="June"
                      className="form-control"
                      onChange={(e) =>
                        handleChange(index, "June", e.target.value)
                      }
                    />
                  ),
                  July: (
                    <Input
                      type="number"
                      value={Math.floor(ele.July)}
                      name="July"
                      className="form-control"
                      onChange={(e) =>
                        handleChange(index, "July", e.target.value)
                      }
                    />
                  ),
                  August: (
                    <Input
                      type="number"
                      value={Math.floor(ele.August)}
                      name="August"
                      className="form-control"
                      onChange={(e) =>
                        handleChange(index, "August", e.target.value)
                      }
                    />
                  ),
                  September: (
                    <Input
                      type="number"
                      value={Math.floor(ele.September)}
                      name="September"
                      className="form-control"
                      onChange={(e) =>
                        handleChange(index, "September", e.target.value)
                      }
                    />
                  ),
                  October: (
                    <Input
                      type="number"
                      value={Math.floor(ele.October)}
                      name="October"
                      className="form-control"
                      onChange={(e) =>
                        handleChange(index, "October", e.target.value)
                      }
                    />
                  ),
                  November: (
                    <Input
                      type="number"
                      value={Math.floor(ele.November)}
                      name="November"
                      className="form-control"
                      onChange={(e) =>
                        handleChange(index, "November", e.target.value)
                      }
                    />
                  ),
                  December: (
                    <Input
                      type="number"
                      value={Math.floor(ele.December)}
                      name="December"
                      className="form-control"
                      onChange={(e) =>
                        handleChange(index, "December", e.target.value)
                      }
                    />
                  ),
                  January: (
                    <Input
                      type="number"
                      value={Math.floor(ele.January)}
                      name="January"
                      className="form-control"
                      onChange={(e) =>
                        handleChange(index, "January", e.target.value)
                      }
                    />
                  ),
                  February: (
                    <Input
                      type="number"
                      value={Math.floor(ele.February)}
                      name="February"
                      className="form-control"
                      onChange={(e) =>
                        handleChange(index, "February", e.target.value)
                      }
                    />
                  ),
                  March: (
                    <Input
                      type="number"
                      value={Math.floor(ele.March)}
                      name="March"
                      className="form-control"
                      onChange={(e) =>
                        handleChange(index, "March", e.target.value)
                      }
                    />
                  ),
                  // TotalAmount: (
                  //   <Input
                  //     type="number"
                  //     value={ele.TotalAmount}
                  //     name="TotalAmount"
                  //     className="form-control"
                  //     onChange={(e) =>
                  //       handleChange(index, "TotalAmount", e.target.value)
                  //     }
                  //   />
                  // ),
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
              <div className="row d-flex">
                <ReactSelect
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2 ml-2"
                  name="Items"
                  placeholderName="Item"
                  dynamicOptions={items?.filter(
                    (data) => data?.value === 347 || data?.value === 326
                  )}
                  className="Items"
                  handleChange={handleDeliveryChangeItems}
                  value={formData.Items}
                  requiredClassName={"required-fields"}
                />

                {loading ? (
                  <Loading />
                ) : (
                  <button
                    style={{ float: "right", marginLeft: "auto" }}
                    className="btn btn-sm btn-success m-2"
                    onClick={handleSave}
                    disabled={isSubmitting}
                  >
                    {t("Submit")}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AMCSalesBooking;
