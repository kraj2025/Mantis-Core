import React, { useState } from "react";
import Heading from "../components/UI/Heading";
import { useNavigate } from "react-router-dom";
import Input from "../components/formComponent/Input";
import Loading from "../components/loader/Loading";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import axios from "axios";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import BrowseButton from "../components/formComponent/BrowseButton";
import { useTranslation } from "react-i18next";
import Tables from "../components/UI/customTable";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const BulkNewTicketNotes = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [t] = useTranslation();
  const [formData, setFormData] = useState({
    Notes: "",
    TicketNo: "",
    Project: "",
    Project1: "",
    Category: "",
    AssignedTo: "",
    Priority: "",
    ReportedName: "",
    ReportedMobile: "",
    Description: "",
    Summary: "",
    ManHours: "",
    ExcelType: "",
    NoteType: "",
  });
  const [selected, setSelected] = useState("no");
  const navigate = useNavigate();
  const handleRadioChange = (value) => {
    setSelected(value);
    if (value === "yes") {
      navigate("/BulkReportIssue");
    } else if (value === "no") {
      navigate("/BulkNewTicketNotes");
    }
  };

 


  const fetchemptyexcel = () => {
    // Define the columns for your Excel sheet
    const data = [[t("Ticket No."), t("Notes")]];

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
      const [headers, ...rows] = jsonData;

      const mappedData = rows.map((row, index) => ({
        "S.No.": index + 1,
        TicketNo: row[0] ?? "", // Assuming Ticket No. is first column
        Notes: row[1] ?? "", // Assuming Notes is second column
      }));

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

  const handleDeleteRow = (index) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
  };

  const handleSave = (e) => {
    let transformPayload = [];
    tableData.map((item, index) => {
      transformPayload.push({
        // Index: index + 1,
        BugId: Number(item?.TicketNo),
        NoteText: String(item?.Notes),
      });
    });
    setIsSubmitting(true);

    axiosInstances
      .post(apiUrls.BulkNoteInsert, {
        TicketData : transformPayload,
      })
    // const form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append("TicketData", JSON.stringify(transformPayload));
    // axios
    //   .post(apiUrls?.BulkNoteInsert, form, { headers })
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
      <div className="card">
        <Heading
          isBreadcrumb={true}
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
                  style={{
                    cursor: "pointer",
                  }}
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
                  onChange={() => handleRadioChange("no")}
                  style={{
                    cursor: "pointer",
                  }}
                />
                <span className="mb-2 ml-1">Notes</span>
              </label>
            </div>
          }
        />
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
            <Heading title={t("BulkTicket Details")} />
            <div>
              <Tables
                thead={[
                  { name: t("S.No."), width: "10%" },

                  <div className="">
                    <span style={{ width: "100px" }}>{t("Ticket No.")}</span>
                    <Input
                      type="text"
                      name="TicketNo"
                      className="form-control"
                      value={formData.TicketNo}
                      onChange={handleChange1}
                    />
                  </div>,
                  <div className="">
                    <span>{t("Notes")}</span>
                    <Input
                      type="text"
                      name="Notes"
                      className="form-control"
                      value={formData.Notes}
                      onChange={handleChange1}
                    />
                  </div>,
                  t("Action"),
                ]}
                tbody={tableData?.map((ele, index) => ({
                  "S.No.": index + 1,
                  "Ticket No.": (
                    <Input
                      type="text"
                      className="form-control"
                      value={ele.TicketNo}
                      onChange={(e) =>
                        handleChange(index, "TicketNo", e.target.value)
                      }
                    />
                  ),
                  Notes: (
                    <textarea
                      type="text"
                      className="summaryheightTicketNotes"
                      value={ele?.Notes}
                      onChange={(e) =>
                        handleChange(index, "Notes", e.target.value)
                      }
                    ></textarea>
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
                {t("Submit Notes")}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BulkNewTicketNotes;
