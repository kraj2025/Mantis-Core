import React, { useEffect, useState } from "react";
import DatePicker from "../components/formComponent/DatePicker";
import Input from "../components/formComponent/Input";
import Tables from "../components/UI/customTable";
import { ImplementationModalTHEAD } from "../components/modalComponent/Utils/HealperThead";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import { headers } from "../utils/apitools";
import moment from "moment";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import excelimg from "../../src/assets/image/excel.png";
import Heading from "../components/UI/Heading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const ImplementationPlanModal = ({
  data,
  setVisible,
  TrackerProjectName,
  TrackerProjectID,
}) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    Summary: "",
    Remarks: "",
    Email: "",
    ProjectID: "",
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const [tableData, setTableData] = useState([]);

  const handleSearch = () => {
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
    //   form.append("ProjectID", TrackerProjectID),
    //   form.append("ProjectName", TrackerProjectName),
    //   form.append("StepID", data?.data?.Id),
    // axios
    //   .post(apiUrls?.Step_Remark_Select, form, { headers })
    axiosInstances
      .post(apiUrls?.Step_Remark_Select, {
        ProjectID: Number(TrackerProjectID),
        StepID: Number(data?.data?.Id),
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSearchExcel = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "RoleID",
    //     useCryptoLocalStorage("user_Data", "get", "RoleID")
    //   ),
    //   form.append("IsExcel", "1"),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ProjectID", TrackerProjectID),
    //   form.append("ProjectName", TrackerProjectName),
    //   form.append("StepID", data?.data?.Id),
    // axios
    //   .post(apiUrls?.Step_Remark_Select, form, { headers })
    axiosInstances
      .post(apiUrls?.Step_Remark_Select, {
        ProjectID: Number(TrackerProjectID),
        StepID: Number(data?.data?.Id),
        IsExcel: "1",
      })
      .then((res) => {
        setTableData(res?.data?.data);
        const data = res?.data?.data;
        if (!data || data.length === 0) {
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

        // Title row with username, date, and time
        const titleRow = [[`${username} - ${currentDate} ${currentTime}`]];

        // Convert JSON data to an Excel worksheet
        const ws = XLSX.utils.json_to_sheet(data, { origin: "A2" }); // Start data from the second row

        // Insert the title row at the top
        XLSX.utils.sheet_add_aoa(ws, titleRow, { origin: "A1" });

        // Create a new workbook and append the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");

        // Write workbook to binary
        const excelBuffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "array",
        });

        // Convert to Blob and trigger download
        const fileData = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        FileSaver.saveAs(
          fileData,
          `${username}_${currentDate}_${currentTime}.xlsx`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ImplementationTracker_Insert = () => {
    // const stepDetail = JSON.stringify([
    //   {
    //     Date: moment(formData?.FromDate).format("YYYY-MM-DD"),
    //     Description: formData?.Summary,
    //     Remark: formData?.Remarks,
    //     Mail: formData?.Email,
    //     StepID: data?.data?.Id,
    //   },
    // ]);

    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append(
    //   "LoginName",
    //   useCryptoLocalStorage("user_Data", "get", "realname")
    // );
    // form.append("ProjectID", TrackerProjectID);
    // form.append("ProjectName", TrackerProjectName);
    // form.append("StepDetail", stepDetail);

    // axios
    //   .post(apiUrls?.ImplementationTracker_Insert, form, { headers })
    const stepDetail = [
      {
        StepID: data?.data?.Id ? Number(data.data.Id) : 0,
        Date: formData?.FromDate
          ? moment(formData.FromDate).format("YYYY-MM-DD")
          : "1970-01-01",
        Description: formData?.Summary ? String(formData.Summary) : "",
        Remark: formData?.Remarks ? String(formData.Remarks) : "",
        Mail: formData?.Email ? String(formData.Email) : "",
      },
    ];
    axiosInstances
      .post(apiUrls?.ImplementationTracker_Insert, {
        ProjectID: Number(TrackerProjectID),
        ProjectName: TrackerProjectName,
        StepDetail:stepDetail,
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleSearch();
          setVisible(false);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(tableData?.length / rowsPerPage);
  const currentData = tableData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <>
      <div className="card  p-2">
        <span style={{ fontWeight: "bold", display: "flex" }}>
          Project Name : {TrackerProjectName} &nbsp; &nbsp; Steps:{" "}
          {data?.data?.Steps}
        </span>
      </div>
      <div className="row m-2">
        <DatePicker
          className="custom-calendar"
          id="FromDate"
          name="FromDate"
          lable="Date"
          placeholder={VITE_DATE_FORMAT}
          value={formData?.FromDate}
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          handleChange={handleChange}
        />

        <textarea
          type="text"
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          className="form-control"
          placeholder="Description"
          id={"Summary"}
          name="Summary"
          value={formData?.Summary}
          onChange={handleChange}
          style={{ width: "30%", marginLeft: "7.5px", height: "auto" }}
        ></textarea>

        <textarea
          type="text"
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          className="form-control"
          placeholder="Remarks"
          id={"Remarks"}
          name="Remarks"
          value={formData?.Remarks}
          onChange={handleChange}
          style={{ width: "30%", marginLeft: "7.5px", height: "auto" }}
        ></textarea>

        <Input
          type="text"
          className="form-control mt-1"
          id="Email"
          name="Email"
          lable="Enter Email"
          placeholder=""
          onChange={handleChange}
          value={formData?.Email}
          respclass="col-xl-4 col-md-4 col-sm-4 col-12"
        />
        <div className="col-xl-4 col-md-4 col-sm-4 col-12 d-flex mt-1">
          <button
            className="btn btn-sm btn-primary"
            onClick={ImplementationTracker_Insert}
          >
            Save
          </button>
          {/* <button className="btn btn-sm btn-primary ml-3">Close</button> */}

          {tableData?.length > 0 && (
            <img
              src={excelimg}
              className=" ml-4"
              style={{ width: "34px", height: "24px", cursor: "pointer" }}
              onClick={handleSearchExcel}
              title="Click to download Excel"
            ></img>
          )}
        </div>
        {tableData?.length > 0 && (
          <div className="card mt-3">
            <Heading title={"Search Details"} />
            <Tables
              thead={ImplementationModalTHEAD}
              tbody={currentData?.map((ele, index) => ({
                "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
                // Id: ele?.Steps,
                // StepID: ele?.Responsible,
                // Steps: ele?.deviationInDays,
                Date: ele?.dtSubmit,
                Description: ele?.Remark,
                Remark: ele?.Remark,
                Mail: ele?.mail,
                CreatedBy: ele?.CreatedBy,
                EntryDate: ele?.dtEntry,
              }))}
            />
            <div className="pagination ml-auto">
              <div>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ImplementationPlanModal;
