import React from "react";
import Tables from "../components/UI/customTable";
import { ImplementationStepEntryTHEAD } from "../components/modalComponent/Utils/HealperThead";
import { useState, useEffect } from "react";
import DatePicker from "../components/formComponent/DatePicker";
import Modal from "../components/modalComponent/Modal";
import ImplementationPlanModal from "../pages/ImplementationPlanModal";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { toast } from "react-toastify";
import Heading from "../components/UI/Heading";
import ReactSelect from "../components/formComponent/ReactSelect";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Tooltip from "./Tooltip";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import moment from "moment";
import excelimg from "../../src/assets/image/excel.png";
import { set, update } from "lodash";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { parse } from "date-fns";
import { axiosInstances } from "../networkServices/axiosInstance";
const ImplementationPlan = ({ data }) => {
  console.log("check ", data);
  const TrackerProjectID = data?.Id || data?.ProjectID;
  const TrackerProjectName = data?.NAME || data?.ProjectName;
  const [t] = useTranslation();
  dayjs.extend(customParseFormat);
  const [tableData, setTableData] = useState([]);
  const [project, setProject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ProjectID: data?.Id || data?.ProjectID ? data?.Id || data?.ProjectID : "",
    FromDate: "",
    // FromDate: "",
    WithDate: "",
  });
  const [visible, setVisible] = useState({
    showVisible: false,
    data: {},
  });

  const getProject = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    // axios
    //   .post(apiUrls?.ProjectSelect, form, { headers })
    axiosInstances
      .post(apiUrls?.ProjectSelect, {
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

        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { VITE_DATE_FORMAT } = import.meta.env;

  // const calculateDeviation = (expectedDate, actualDate) => {
  //   const [day, month, year] = expectedDate.split("-");
  //   const formattedExpectedDate = new Date(`${year}-${month}-${day}`);
  //   const date2 = new Date(actualDate);
  //   if (isNaN(formattedExpectedDate.getTime()) || isNaN(date2.getTime())) {
  //     toast.error("Invalid date formats detected.");
  //     return "";
  //   }
  //   const diffTime = Math.abs(date2 - formattedExpectedDate);
  //   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24) + 1);
  //   return diffDays;
  // };

  const calculateDeviation = (expectedDate, actualDate) => {
    console.log("check", expectedDate, actualDate);
    const [day, month, year] = expectedDate.split("-");
    const formattedExpectedDate = new Date(`${year}-${month}-${day}`);
    console.log("formattedExpectedDate", formattedExpectedDate);
    const formattedActualDate = new Date(actualDate);
    console.log("formattedActualDate", formattedActualDate);
    if (
      isNaN(formattedExpectedDate.getTime()) ||
      isNaN(formattedActualDate.getTime())
    ) {
      toast.error("Invalid date formats detected.");
      return "";
    }

    const diffTime = formattedActualDate - formattedExpectedDate;
    console.log("diffTime", diffTime);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    console.log("diffDays", diffDays);
    return diffDays;
  };

  console.log("calculateDeviation", calculateDeviation);

  const handleExpeFromDtChange = (index, newDate) => {
    setTableData((prevData) => {
      const updatedData = [...prevData];
      const updatedRow = { ...updatedData[index] };
      updatedRow.Expefromdt = newDate;
      // updatedRow.Actdt = newDate;
      const requiredDays = updatedRow.requiredDays || 0;
      updatedRow.ExpeTodt = dayjs(newDate)
        .add(requiredDays, "day")
        .format("DD-MM-YYYY");
      updatedData[index] = updatedRow;
      return updatedData;
    });
    // console.log("tabledata", tableData);
  };

  const handleActDtChange = (index, newDate) => {
    setTableData((prevData) => {
      const updatedData = [...prevData];
      const updatedRow = { ...updatedData[index] };
      updatedRow.Actdt = newDate;
      updatedRow.DeviationInDay = calculateDeviation(
        updatedRow.ExpeTodt,
        updatedRow.Actdt
      );
      updatedData[index] = updatedRow;
      return updatedData;
    });
  };

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const searchHandleChange = (e, index) => {
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
  console.log("formData", formData);
  const handleTableShow = () => {
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
    //   form.append(
    //     "ProjectID",
    //     formData?.ProjectID || data?.ProjectID || data?.Id
    //   ),
    //   form.append("ProductID", data?.productid || data?.ProductID),
    //   form.append(
    //     "FromDate",
    //     formData?.FromDate ? formatDate(formData?.FromDate) : " "
    //   );
    // axios
    //   .post(apiUrls?.ShowImpleStepsMaster_select, form, { headers })

    const payload = {
      RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
      ProjectID: Number(formData?.ProjectID || data?.ProjectID || data?.Id),
      ProductID: Number(data?.productid || data?.ProductID),
      FromDate: String(
        formData?.FromDate ? formatDate(formData?.FromDate) : " "
      ),
      IsExcel: 0,
    };
    axiosInstances
      .post(apiUrls?.ShowImpleStepsMaster_select, payload)
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleTableShowExcel = () => {
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
    //   form.append(
    //     "ProjectID",
    //     formData?.ProjectID || data?.ProjectID || data?.Id
    //   ),
    //   form.append("ProductID", data?.productid || data?.ProductID),
    //   form.append(
    //     "FromDate",
    //     formData?.FromDate ? formatDate(formData?.FromDate) : ""
    //   );

    // axios
    //   .post(apiUrls?.ShowImpleStepsMaster_select, form, { headers })
    const payload = {
      RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID") || 0),
      IsExcel: "1",
      ProjectID: Number(
        formData?.ProjectID || data?.ProjectID || data?.Id || 0
      ),
      ProductID: Number(data?.productid || data?.ProductID || 0),
      FromDate: formData?.FromDate ? formatDate(formData.FromDate) : "",
    };

    axiosInstances
      .post(apiUrls?.ShowImpleStepsMaster_select, payload)
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
  const handleTableShowExcelTracker = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "RoleID",
    //     useCryptoLocalStorage("user_Data", "get", "RoleID")
    //   ),
    //   form.append("IsExcel", "2"),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append(
    //     "ProjectID",
    //     formData?.ProjectID || data?.ProjectID || data?.Id
    //   ),
    //   form.append("ProductID", data?.productid || data?.ProductID),
    //   form.append(
    //     "FromDate",
    //     formData?.FromDate ? formatDate(formData?.FromDate) : ""
    //   );

    // axios
    //   .post(apiUrls?.ShowImpleStepsMaster_select, form, { headers })
    const payload = {
      RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID") || 0),
      IsExcel: "2",
      ProjectID: Number(
        formData?.ProjectID || data?.ProjectID || data?.Id || 0
      ),
      ProductID: Number(data?.productid || data?.ProductID || 0),
      FromDate: formData?.FromDate ? formatDate(formData.FromDate) : "",
    };

    axiosInstances
      .post(apiUrls?.ShowImpleStepsMaster_select, payload)
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

  const handleTableFinalsave = () => {
    let StepMasterRequestData = [];
    tableData?.map((val, index) => {
      StepMasterRequestData.push({
        // "S.No.":index+1,
        StepMasterId: val?.Id,
        StepMaster: val?.Steps,
        Expefromdt: val?.Expefromdt
          ? moment(val.Expefromdt).toISOString()
          : new Date("2001-01-01T00:00:00.000Z").toISOString(),
        ExpeToDt: val?.ExpeTodt
          ? moment(val.ExpeTodt).toISOString()
          : new Date("2001-01-01T00:00:00.000Z").toISOString(),
        Actdt: val?.Actdt
          ? moment(val.Actdt).toISOString()
          : new Date("0001-01-01T00:00:00.000Z").toISOString(),
        ActDt: val?.Actdt
          ? moment(val?.Actdt).format("YYYY-MM-DD")
          : "01-Jan-0001",
        DeviationInDay: val?.DeviationInDay,
        ReasonForDelay: val?.ReasonforDelay,
        IsNotification: true,
      });
    });
    setLoading(true);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    // form.append("ProjectID", data?.Id || data?.ProjectID),
    // form.append("ProjectName", data?.NAME || data?.ProjectName),
    // form.append("IsApprove", "0"),
    // form.append("IsNotification", "0"),
    // form.append("StepMasterRequest", JSON.stringify(payload)),
    // axios
    //   .post(apiUrls?.ImplementationSteps_Insert_details, form, { headers })
    const payload = {
      ProjectID: Number(data?.Id || data?.ProjectID || 0),
      ProjectName: String(data?.NAME || data?.ProjectName || ""),
      IsApprove: Boolean(0),
      IsNotification: 0,
      StepMasterRequest: StepMasterRequestData,
    };

    axiosInstances
      .post(apiUrls?.ImplementationSteps_Insert_details, payload)
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const shortenName = (name) => {
    return name.length > 15 ? name.substring(0, 25) + "..." : name;
  };
  const handleCheckBox = (e) => {
    const { name, checked, type } = e?.target;

    setFormData((prevFormData) => {
      let updatedData = {
        ...prevFormData,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      };

      // If "WithDate" is unchecked, reset FromDate and hide PlanDetail & TrackerDetail
      if (name === "WithDate" && !checked) {
        updatedData = {
          ...updatedData,
          FromDate: "",
        };
        setTableData([]);
      }

      return updatedData;
    });
  };

  const handleSelectChange = (e, index) => {
    const { name, value, checked, type } = e?.target;
    const mainData = [...tableData];
    mainData[index] = {
      ...mainData[index],
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    };
    setTableData(mainData);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5000;
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
    getProject();
  }, []);

  return (
    <>
      <div className="card  p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {data?.NAME || data?.ProjectName}
        </span>
      </div>
      <div className="card">
        <Heading title={"Implementation Steps Entry"} />
        <div className="row m-2">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="ProjectID"
            placeholderName={t("Project")}
            dynamicOptions={project}
            value={formData?.ProjectID}
            handleChange={handleDeliveryChange}
            isDisabled
            // requiredClassName={"required-fields"}
          />
          <div className="search-col" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="WithDate"
                  checked={formData?.WithDate ? 1 : 0}
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
                {t("With Date")}
              </span>
            </div>
          </div>

          {formData?.WithDate == "1" ? (
            <DatePicker
              className="custom-calendar"
              id="FromDate"
              name="FromDate"
              lable={t("From Date")}
              placeholder={VITE_DATE_FORMAT}
              value={formData?.FromDate}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              handleChange={searchHandleChange}
            />
          ) : (
            ""
          )}

          <button className="btn btn-sm btn-primary" onClick={handleTableShow}>
            Show
          </button>
          {tableData?.length > 0 && (
            // <img
            //   src={excelimg}
            //   className=" ml-4"
            //   style={{ width: "34px", height: "24px", cursor: "pointer" }}
            //   onClick={handleTableShowExcel}
            //   title="Click to download Excel"
            // ></img>
            <>
              <button
                className="btn btn-sm btn-primary ml-3"
                onClick={handleTableShowExcel}
              >
                Plan Detail
              </button>
              <button
                className="btn btn-sm btn-primary ml-3"
                onClick={handleTableShowExcelTracker}
              >
                Tracker Detail
              </button>
            </>
          )}

          <Modal
            modalWidth="800px"
            visible={visible?.showVisible}
            data={visible}
            TrackerProjectName={TrackerProjectName}
            TrackerProjectID={TrackerProjectID}
            setVisible={setVisible}
            Header={"Tracker"}
          >
            <ImplementationPlanModal
              visible={visible?.showVisible}
              setVisible={setVisible}
              TrackerProjectName={TrackerProjectName}
              TrackerProjectID={TrackerProjectID}
              data={visible}
            />
          </Modal>
        </div>
      </div>

      {tableData?.length > 0 ? (
        <div className="card mt-2">
          <Heading title={"Search Details"} />
          <Tables
            thead={ImplementationStepEntryTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              Steps: (
                <Tooltip label={ele?.Steps}>
                  <span
                    id={`projectName-${index}`}
                    targrt={`projectName-${index}`}
                    style={{ textAlign: "center" }}
                  >
                    {shortenName(ele?.Steps)}
                  </span>
                </Tooltip>
              ),

              Responsible: ele?.Responsible,
              Type: ele?.ImpleType,
              RequiredDays: ele?.ReqDays,
              Days: ele?.DayFromInitiateDate,
              "Expe from dt": (
                <DatePicker
                  className="custom-calendar implementation-calendar"
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  id={`Expefromdt-${index}`}
                  name="Expefromdt"
                  placeholder={VITE_DATE_FORMAT}
                  value={
                    ele?.Expefromdt == "01-Jan-2001"
                      ? ""
                      : new Date(ele?.Expefromdt)
                  }
                  handleChange={(e) =>
                    handleExpeFromDtChange(index, e.target.value)
                  }
                />
              ),
              "Expe to dt":
                ele?.ExpeTodt === "01-Jan-2001" ? "" : ele?.ExpeTodt,
              "Act dt": (
                <DatePicker
                  className="custom-calendar implementation-calendar"
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  id="Actdt"
                  name="Actdt"
                  // value={new Date(ele?.Actdt)}
                  value={ele.Actdt == null ? "" : new Date(ele.Actdt)}
                  // value={ele?.Actdt ? parse(ele.Actdt, 'dd-MMM-yyyy', new Date()) : null}
                  placeholder={VITE_DATE_FORMAT}
                  handleChange={(e) => handleActDtChange(index, e.target.value)}
                />
              ),

              "Deviation in Days": ele?.DeviationInDay,
              "Reason for Delay": (
                <textarea
                  className="summaryheightRemark"
                  placeholder="Reason for Delay"
                  id={"ReasonforDelay"}
                  name="ReasonforDelay"
                  value={tableData[index]?.ReasonforDelay || ""}
                  onChange={(e) => handleSelectChange(e, index)}
                  style={{ width: "150px", marginLeft: "7.5px" }}
                ></textarea>
              ),
              Tracker: (
                <>
                  {ele?.IsRemarkAvail > 0 ? (
                    <span
                      className="custom-orange-btn-tracker"
                      onClick={() => {
                        setVisible({
                          showVisible: true,
                          data: ele,
                        });
                      }}
                    >
                      View
                    </span>
                  ) : (
                    <span
                      className="custom-orange-btn-tracker-black"
                      onClick={() => {
                        setVisible({
                          showVisible: true,
                          data: ele,
                        });
                      }}
                    >
                      View
                    </span>
                  )}
                </>
              ),
            }))}
          />

          <div className="row m-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleTableFinalsave}
            >
              Save
            </button>

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
        </div>
      ) : (
        <NoRecordFound />
      )}
    </>
  );
};

export default ImplementationPlan;
