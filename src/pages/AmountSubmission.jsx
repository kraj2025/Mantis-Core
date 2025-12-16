import React, { useEffect, useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";
import DatePicker from "../components/formComponent/DatePicker";
import Input from "../components/formComponent/Input";
import axios from "axios";
import { headers } from "../utils/apitools";
import Heading from "../components/UI/Heading";
import { Link } from "react-router-dom";
import BrowseButton from "../components/formComponent/BrowseButton";
import { apiUrls } from "../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import Tables from "../components/UI/customTable";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const AmountSubmission = ({ data }) => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [project, setProject] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    Project: "",
    ReceiveDate: new Date(),
    ReceivedBy: "Jai Guru Dev",
    UTRNO: "",
    BankNeft: "",
    ChequeNumber: "",
    BankName: "",
    ChequeDate: new Date(),
    PaymentMode: "",
    Amount: "",
    Remarks: "",
    Documents: "",
    DocumentType: "",
    SelectFile: "",
    Document_Base64: "",
    FileExtension: "",
    DepositedBy: "",
    VoucherNo: "",
    RecoveryTeam: "",
  });
  // const handleDeliveryChange = (name, e) => {
  //   const { value } = e;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //     ...(value === "NEFT" || value === "Cheque"
  //       ? { ReceivedBy: "" }
  //       : { ReceivedBy: "Jai Guru Dev" }),
  //   });

  //   if (name === "Project") {
  //     handleSearch(value);
  //   }
  // };

  const handleDeliveryChange = (name, e) => {
    const { value, fullData } = e;

    if (name === "Project") {
      const isSupport = fullData?.IsSupport === 1;

      setFormData((prev) => ({
        ...prev,
        [name]: value, // value = ProjectId
        ReceivedBy:
          prev.ReceivedBy === "NEFT" || prev.ReceivedBy === "Cheque"
            ? ""
            : "Jai Guru Dev",
        RecoveryTeam: isSupport ? "Support" : "", // Clear unless IsSupport === 1
      }));

      handleSearch(value); // Call search with ProjectId
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ReceivedBy:
          value === "NEFT" || value === "Cheque" ? "" : "Jai Guru Dev",
      }));
    }
  };

  useEffect(() => {
    if (data) {
      const projectID = data?.ProjectID;
      setFormData((prevData) => ({
        ...prevData,
        Project: projectID,
      }));

      // Call handleDeliveryChange after setting the Project in formData
      handleDeliveryChange("Project", { value: projectID });
    }
  }, [data]);

  const handleSearch = (item) => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.AmountSubmission_ByAccounts_Search_ProjectID, {
        SearchType: String("OnScreen"),
        ProjectID: Number(item),
      })
      .then((res) => {
        setTableData(res?.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleExcel = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.AmountSubmission_ByAccounts_Search_ProjectID, {
        SearchType: String("Excel"),
        ProjectID: Number(tableData[0]?.ProjectID),
      })
      .then((res) => {
        const datas = res?.data?.data;

        if (!datas || datas.length === 0) {
          console.error("No data available for download.");
          alert("No data available for download.");
          setLoading(false);
          return;
        }
        const username =
          useCryptoLocalStorage("user_Data", "get", "realname") || "User";
        // const currentDate = new Date().toLocaleDateString();
        const currentDate = new Date().toLocaleDateString("en-GB", {
          // day: "numeric",
          // month: "short",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const titleRow = [{ title: `${username} - ${currentDate}` }];
        const dataWithTitle = [...titleRow, ...datas];
        const fileType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const ws = XLSX.utils.json_to_sheet(datas, { skipHeader: false });
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "array",
          s,
        });
        const data = new Blob([excelBuffer], { type: fileType });
        // Save the file with the title as username and current date
        FileSaver.saveAs(data, `${username}_${currentDate}` + fileExtension);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error downloading the file:", err);
        alert("Failed to download the file. Please try again.");
        setLoading(false);
      });
  };
  const handleCancelExcel = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.AmountSubmission_ByAccounts_Search_ProjectID, {
        SearchType: String("CancelExcel"),
        ProjectID: Number(tableData[0]?.ProjectID),
      })
      .then((res) => {
        const datas = res?.data?.data;

        if (!datas || datas.length === 0) {
          console.error("No data available for download.");
          alert("No data available for download.");
          setLoading(false);
          return;
        }
        const username =
          useCryptoLocalStorage("user_Data", "get", "realname") || "User";
        // const currentDate = new Date().toLocaleDateString();
        const currentDate = new Date().toLocaleDateString("en-GB", {
          // day: "numeric",
          // month: "short",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const titleRow = [{ title: `${username} - ${currentDate}` }];
        const dataWithTitle = [...titleRow, ...datas];
        const fileType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const ws = XLSX.utils.json_to_sheet(datas, { skipHeader: false });
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "array",
        });
        const data = new Blob([excelBuffer], { type: fileType });
        // Save the file with the title as username and current date
        FileSaver.saveAs(data, `${username}_${currentDate}` + fileExtension);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error downloading the file:", err);
        alert("Failed to download the file. Please try again.");
        setLoading(false);
      });
  };

  const searchHandleChange = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleSelectChange1 = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          return {
            label: item?.Project,
            value: item?.ProjectId,
            fullData: item,
          };
        });
        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }
  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleValidation = (formData) => {
    let error = false;
    let message = "";
    if (formData?.Project == "") {
      error = true;
      message = "Please Select Project.";
    } else if (formData?.RecoveryTeam == "") {
      error = true;
      message = "Please Select RecoveryTeam.";
    } else if (formData?.PaymentMode == "") {
      error = true;
      message = "Please Select PaymentMode.";
    } else if (formData?.Amount == "") {
      error = true;
      message = "Please Enter Amount.";
    } else if (formData?.ReceivedBy == "" && formData?.PaymentMode === "Cash") {
      error = true;
      message = "Please Enter ReceivedBy.";
    }

    return {
      error,
      message,
    };
  };
  const amountSubmissionTHEAD = [
    t("S.No."),
    t("Receive Date"),
    t("Recovery Team"),
    t("PaymentMode"),
    t("Amount"),
    t("Received By"),
    t("UTR NO."),
    t("Bank Name"),
    t("Cheque Number"),
    t("Cheque Date"),
    t("Remarks"),
    t("Entry By"),
    t("Entry Date"),
  ];

  const handleSave = () => {
    const { error, message } = handleValidation(formData);
    if (error) {
      toast.error(message);
      return;
    }
    setLoading(true);
    const payload = {
      ProjectID: String(formData?.Project || ""),
      ProjectName: String(getlabel(formData?.Project, project) || ""),
      BillingCompanyID: String(""),
      BillingCompanyName: String(""),
      BillingCompanyAddress: String(""),
      BillingState: String(""),
      GSTNo: String(""),
      PanCardNo: String(""),
      ShippingCompanyID: String(""),
      ShippingCompanyName: String(""),
      ShippingCompanyAddress: String(""),
      ShippingState: String(""),
      ShippingGSTNo: String(""),
      ShippingPanCardNo: String(""),
      ReceivedDate: formatDate(formData?.ReceiveDate) || "",
      PaymentMode: String(formData?.PaymentMode || ""),
      Amount: String(formData?.Amount || ""),
      ReceivedBy: String(formData?.ReceivedBy || ""),
      Remark: String(formData?.Remarks || ""),
      UtrNo: String(formData?.UTRNO || ""),
      BankName:
        formData?.PaymentMode === "NEFT"
          ? String(formData?.BankNeft || "")
          : String(formData?.BankName || ""),
      ChequeNo: String(formData?.ChequeNumber || ""),
      ChequeDate: formData?.ChequeDate
        ? moment(formData?.ChequeDate).format("YYYY-MM-DD")
        : "",
      Document_Base64: String(formData?.Document_Base64 || ""),
      Document_FormatType: String(formData?.FileExtension || ""),
      VoucherNo: String(formData?.VoucherNo || ""),
      RecoveryTeam: String(formData?.RecoveryTeam),
    };
    axiosInstances
      .post(apiUrls.AmountSubmission_ByAccounts, payload)

      .then((res) => {
        if (res?.data?.success == true) {
          toast.success(res?.data?.message);
          setFormData({
            // Project: "",
            ReceiveDate: new Date(),
            ReceivedBy: "",
            UTRNO: "",
            BankNeft: "",
            ChequeNumber: "",
            BankName: "",
            ChequeDate: new Date(),
            PaymentMode: "",
            Amount: "",
            Remarks: "",
            Documents: "",
            DocumentType: "",
            SelectFile: "",
            Document_Base64: "",
            FileExtension: "",
          });
          handleSearch(formData?.Project);
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleImageChange = (e) => {
    const file = e?.target?.files[0];

    if (file) {
      // Check if file size exceeds 5MB (5 * 1024 * 1024 bytes)
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size exceeds 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader?.result.split(",")[1];
        const fileExtension = file?.name.split(".").pop();
        setFormData({
          ...formData,
          SelectFile: file,
          Document_Base64: base64String,
          FileExtension: fileExtension,
        });
      };
      reader.readAsDataURL(file); 
    }
  };

  useEffect(() => {
    getProject();
  }, []);
  return (
    <>
      <div className="card">
        <Heading
          title={
            <span style={{ fontWeight: "bold" }}>{t("Amount Submission")}</span>
          }
          isBreadcrumb={data ? false : true}
        />
        <div className="row m-2">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Project"
            placeholderName={t("Project")}
            dynamicOptions={project}
            handleChange={handleDeliveryChange}
            value={project.find((p) => p.value === formData.Project)}
            requiredClassName={"required-fields"}
          />

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="RecoveryTeam"
            placeholderName={t("Recovery Team")}
            dynamicOptions={[
              { label: "Select", value: "Select" },
              { label: "Sale", value: "Sale" },
              { label: "Delivery", value: "Delivery" },
              { label: "Support", value: "Support" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.RecoveryTeam}
            isDisabled={formData.RecoveryTeam === "Support"}
            requiredClassName={"required-fields"}
          />
          <DatePicker
            className="custom-calendar"
            id="ReceiveDate"
            name="ReceiveDate"
            lable={t("Receive Date")}
            placeholder={VITE_DATE_FORMAT}
            value={formData?.ReceiveDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          {/* <div className="d-flex">
            <label>Type :</label>
            <div
              className="search-col"
              style={{
                marginLeft: "8px",
                display: "flex",
                marginRight: "auto",
              }}
            >
              {[
                { name: "Deposit", label: "Deposit" },
                { name: "CreditNote", label: "CreditNote" },
                { name: "DebitNote", label: "DebitNote" },
                { name: "TDS", label: "TDS" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: idx !== 0 ? "28px" : "0px",
                  }}
                >
                  <label className="switch" style={{ marginTop: "3px" }}>
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={formData[item.name] === "1"}
                      onChange={handleSelectChange}
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
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div> */}

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="PaymentMode"
            placeholderName={t("Payment Mode")}
            dynamicOptions={[
              { label: "Delta", value: "Cash" },
              { label: "NEFT", value: "NEFT" },
              { label: "Cheque", value: "Cheque" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.PaymentMode}
            requiredClassName={"required-fields"}
          />

          <Input
            type="number"
            className="form-control required-fields"
            id="Amount"
            name="Amount"
            lable={t("Amount")}
            onChange={handleSelectChange}
            value={formData?.Amount}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          {formData?.PaymentMode == "Cash" && (
            <>
              <Input
                type="text"
                className="form-control"
                id="VoucherNo"
                name="VoucherNo"
                lable={t("Voucher Number")}
                onChange={handleSelectChange}
                value={formData?.VoucherNo}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control required-fields"
                id="ReceivedBy"
                name="ReceivedBy"
                lable={t("ReceivedBy")}
                onChange={handleSelectChange}
                value={formData?.ReceivedBy}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />
            </>
          )}
          {formData?.PaymentMode == "NEFT" && (
            <>
              {/* <Input
                type="text"
                className="form-control"
                id="DepositedBy"
                name="DepositedBy"
                lable="Deposited By"
                onChange={handleSelectChange}
                value={formData?.DepositedBy}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              /> */}
              {/* <Input
                type="text"
                className="form-control required-fields"
                id="ReceivedBy"
                name="ReceivedBy"
                lable="ReceivedBy"
                onChange={handleSelectChange}
                value={formData?.ReceivedBy}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              /> */}
              <Input
                type="text"
                className="form-control"
                id="UTRNO"
                name="UTRNO"
                lable={t("UTRNO")}
                onChange={handleSelectChange}
                value={formData?.UTRNO}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />
              <ReactSelect
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="BankNeft"
                placeholderName={t("Bank")}
                dynamicOptions={[
                  { label: "Select", value: "" },
                  { label: "ICICI-220", value: "ICICI-220" },
                  { label: "ICICI-51", value: "ICICI-51" },
                  { label: "Kotak", value: "Kotak" },
                ]}
                handleChange={handleDeliveryChange}
                value={formData.BankNeft}
              />
            </>
          )}
          {formData?.PaymentMode == "Cheque" && (
            <>
              {/* <Input
                type="text"
                className="form-control required-fields"
                id="ReceivedBy"
                name="ReceivedBy"
                lable="ReceivedBy"
                onChange={handleSelectChange}
                value={formData?.ReceivedBy}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              /> */}
              <Input
                type="text"
                className="form-control"
                id="ChequeNumber"
                name="ChequeNumber"
                lable={t("Cheque Number")}
                onChange={handleSelectChange}
                value={formData?.ChequeNumber}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control"
                id="BankName"
                name="BankName"
                lable={t("Bank Name")}
                onChange={handleSelectChange}
                value={formData?.BankName}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />
              <DatePicker
                className="custom-calendar"
                id="ChequeDate"
                name="ChequeDate"
                lable={t("ChequeDate")}
                placeholder={VITE_DATE_FORMAT}
                value={formData?.ChequeDate}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                handleChange={searchHandleChange}
              />
            </>
          )}

          <Input
            type="text"
            className="form-control"
            id="Remarks"
            name="Remarks"
            lable={t("Remarks")}
            onChange={handleSelectChange}
            value={formData?.Remarks}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12 mt-1"
          />
          {/* <Input
            type="file"
            id="Documents"
            name="Documents"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            style={{ width: "100%", marginLeft: "5px" }}
            // onChange={handleFileChange}
          /> */}
          <div className="col-sm-3 d-flex mt-2">
            <BrowseButton handleImageChange={handleImageChange} />

            {loading ? (
              <Loading />
            ) : (
              <button
                className="btn btn-sm btn-success ml-3"
                onClick={handleSave}
              >
                {t("Save")}
              </button>
            )}

            <Link
              to="/SearchAmountSubmission"
              className="ml-3 mt-1"
              style={{ fontWeight: "bold" }}
            >
              {t("Back to List")}
            </Link>
          </div>
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card mt-2">
          <Heading
            title={t("Amount Submission Details")}
            secondTitle={
              <div className="d-flex">
                <div className="row">
                  <div
                    className="d-flex flex-wrap align-items-center"
                    style={{ marginRight: "0px" }}
                  >
                    <div
                      className="d-flex"
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "#00B0F0",
                          cursor: "pointer",
                          height: "10px",
                          width: "30px",
                          borderRadius: "50%",
                        }}
                        // onClick={() => handleSearch("1")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                        // onClick={() => handleSearch("1")}
                      >
                        {t("Delta")}
                      </span>
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "lightgreen",
                          cursor: "pointer",
                          height: "10px",
                          width: "30px",
                          borderRadius: "50%",
                        }}
                        onClick={() => handleSearch("2")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch("2")}
                      >
                        {t("Online")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <span className="ml-3">
                    {t("Project Name")} : &nbsp; {tableData[0]?.ProjectName}
                  </span>
                  <span className="ml-3">
                    {t("Team")} : &nbsp; {tableData[0]?.Team}
                  </span>
                  <span className="ml-3">
                    {t("Total Amount")} : &nbsp;
                    {Number(tableData[0]?.TotalAmount || 0).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>
                  <span className="ml-3">
                    {t("Total Record")} : &nbsp; {tableData[0]?.TotalRecord}
                  </span>
                </div>
                <span className="ml-5">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={handleExcel}
                  >
                    {t("Excel")}
                  </button>
                </span>
                <span className="ml-3">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={handleCancelExcel}
                  >
                    {t("InActive Excel")}
                  </button>
                </span>
              </div>
            }
          />
          <Tables
            thead={amountSubmissionTHEAD}
            tbody={tableData?.map((ele, index) => ({
              "S.No.": index + 1,
              "Receive Date": ele?.ReceivedDate,
              "Recovery Team": ele?.RecoveryTeam,
              PaymentMode: ele?.PaymentMode,
              Amount: ele?.Amount,
              "Received By": ele?.ReceivedBy,
              "UTR NO.": ele?.UtrNo,
              "Bank Name": ele?.BankName,
              "Cheque Number": ele?.ChequeNo,
              "Cheque Date": ele?.ChequeDate,
              // "Deposite Date": "",
              // "Deposite By": "",
              Remarks: ele?.Remark,
              "Entry By": ele?.CreatedBy,
              "Entry Date": ele?.dtEntry
                ? new Date(ele.dtEntry)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(" ", "-")
                    .replace(" ", "-")
                : "",
              colorcode: ele?.rowColorPayementMode,
            }))}
            tableHeight={"tableHeight"}
          />
        </div>
      )}
    </>
  );
};
export default AmountSubmission;
