import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import ReactSelect from "../components/formComponent/ReactSelect";
import DatePicker from "../components/formComponent/DatePicker";
import Input from "../components/formComponent/Input";
import Tables from "../components/UI/customTable";
import { apiUrls } from "../networkServices/apiEndpoints";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import BrowseButton from "../components/formComponent/BrowseButton";
import { useTranslation } from "react-i18next";
import { axiosInstances } from "../networkServices/axiosInstance";

const ConnectorRequest = ({ data }) => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { connectdata, ele } = location?.state || {};
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [tableData, setTableData] = useState([]);
  const [paymentmode, setPaymentMode] = useState([]);
  const [Courier, setCourier] = useState([]);
  const [project, setProject] = useState([]);
  const [formData, setFormData] = useState({
    PaymentType: "",
    IssueDate: new Date(),
    Address: "",
    Courier: "",
    CourierAddress: "",
    IsActive: "",
    Remarks: "",
    Project: "",
    TableQuantity: "",
    TableAmount: "",
    CourierCharges: "",
    DocumentType: "",
    SelectFile: "",
    Document_Base64: "",
    FileExtension: "",
  });

  useEffect(() => {
    setFormData({
      PaymentType: connectdata?.PaymentMode,
      IssueDate: new Date(connectdata?.IssueDate),
      Address: connectdata?.ClientAddress,
      Courier: connectdata?.Courier,
      CourierAddress: connectdata?.CourierAddress,
      IsActive: "",
      Remarks: connectdata?.Remarks,
      Project: connectdata?.ProjectID,
      TableQuantity: "",
      TableAmount: "",
      ConnectorID: connectdata?.ID,
      ProjectName: connectdata?.ProjectName,
      CourierCharges: connectdata?.CourierCharges,
    });

    console.log("formData useEffect", formData);
    setTableData((prevTableData) => [
      ...prevTableData,
      {
        Index: 1,
        TableAmount: connectdata?.Amount25PinMale,
        TableQuantity: connectdata?.Quantity25Male,
      },
      {
        Index: 2,
        TableAmount: connectdata?.Amount25PinFemale,
        TableQuantity: connectdata?.Quantity25Female,
      },
      {
        Index: 3,
        TableAmount: connectdata?.Amount9PinMale,
        TableQuantity: connectdata?.Quantity9Male,
      },
      {
        Index: 4,
        TableAmount: connectdata?.Amount9PinFemale,
        TableQuantity: connectdata?.Quantity9Female,
      },
    ]);
  }, [location]);

  useEffect(() => {
    if (data) {
      const projectID = data?.ProjectID;
      setFormData((prevData) => ({
        ...prevData,
        Project: projectID,
      }));

      // Call handleDeliveryChange after setting the Project in formData
      // handleDeliveryChange("Project", { value: projectID });
    }
  }, [data]);

  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
  const handleDeliveryChange = (name, e) => {
    console.log("namename", name, e);

    const { value } = e;
    if (name == "Project") {
      getProjectAddress(name, value, "Project");
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getPaymentMode = () => {
    axiosInstances
      .post(apiUrls.Connector_Select, {
        ProjectID: 0,
        SearchType: "PaymentMode",
        IssueNo: "",
      })
      .then((res) => {
        const reporters = res?.data.data.map((item) => {
          return { label: item?.PaymentMode, value: item?.PaymentMode };
        });
        setPaymentMode(reporters);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [projectaddress, setProjectAddress] = useState([]);

  const getProjectAddress = (name, value, type) => {
    axiosInstances
      .post(apiUrls.Connector_Select, {
        ProjectID:
          type == "Project" ? Number(value) : Number(formData?.Project),
        SearchType: "GetProjectAddress",
        IssueNo: "",
      })
      .then((res) => {
        const data = res?.data?.data;
        setProjectAddress(data);
        if (data && data[0]?.Address) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
            Address: data[0]?.Address,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleImageChange = (e) => {
    const file = e?.target?.files[0];
    if (file) {
      // Check if file size exceeds 5MB (5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size exceeds 5MB. Please choose a smaller file.");
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
      reader.readAsDataURL(file); // Convert file to base64
    }
  };
  const getConnectorCharges = (value, type) => {
    axiosInstances
      .post(apiUrls.Connector_Select, {
        ProjectID: 0,
        SearchType: "ConnectorCharges",
        IssueNo: "",
      })
      .then((res) => {
        const data = res?.data?.data;
        const datacourier = data?.filter(
          (item) => item?.ConnectorName == "Courier Charges"
        );
        const filteredData = data?.filter(
          (item) => item?.ConnectorName !== "Courier Charges"
        );
        setCourier(datacourier);
        setTableData(filteredData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }
  const handleSave = () => {
    if (!formData?.Project) {
      toast.error("Please Select Project.");
    } else {
      setLoading(true);
      let maleConnector_9 = { rate: "", qty: "", amount: "" };
      let femaleConnector_9 = { rate: "", qty: "", amount: "" };
      let maleConnector_25 = { rate: "", qty: "", amount: "" };
      let femaleConnector_25 = { rate: "", qty: "", amount: "" };
      // Loop through the array to map the fields
      tableData?.forEach((item) => {
        switch (item.ConnectorName) {
          case "9 Pin Male":
            maleConnector_9.rate = item.Rate || "";
            maleConnector_9.qty = item.TableQuantity || "";
            maleConnector_9.amount = item.TableAmount || "";
            break;
          case "9 Pin Female":
            femaleConnector_9.rate = item.Rate || "";
            femaleConnector_9.qty = item.TableQuantity || "";
            femaleConnector_9.amount = item.TableAmount || "";
            break;
          case "25 Pin Male":
            maleConnector_25.rate = item.Rate || "";
            maleConnector_25.qty = item.TableQuantity || "";
            maleConnector_25.amount = item.TableAmount || "";
            break;
          case "25 Pin Female":
            femaleConnector_25.rate = item.Rate || "";
            femaleConnector_25.qty = item.TableQuantity || "";
            femaleConnector_25.amount = item.TableAmount || "";
            break;
          default:
            break;
        }
      });
      const payload = {
        ProjectID: String(formData?.Project),
        ProjectName: String(getlabel(formData?.Project, project)),
        PaymentMode: String(formData?.PaymentType),
        ClientAddress: String(formData?.Address),
        Courier: String(formData?.Courier || ""),
        CourierAddress: String(formData?.CourierAddress || ""),
        CourierCharges: Number(formData?.CourierCharges || ""),
        FemaleConnector_Rate_9: Number(femaleConnector_9.rate),
        FemaleConnector_Qty_9: Number(femaleConnector_9.qty),
        FemaleConnector_Amount_9: Number(femaleConnector_9.amount),
        MaleConnector_Rate_9: Number(maleConnector_9.rate),
        MaleConnector_Qty_9: Number(maleConnector_9.qty),
        MaleConnector_Amount_9: Number(maleConnector_9.amount),
        FemaleConnector_Rate_25: Number(femaleConnector_25.rate),
        FemaleConnector_Qty_25: Number(femaleConnector_25.qty),
        FemaleConnector_Amount_25: Number(femaleConnector_25.amount),
        MaleConnector_Rate_25: Number(maleConnector_25.rate),
        MaleConnector_Qty_25: Number(maleConnector_25.qty),
        MaleConnector_Amount_25: Number(maleConnector_25.amount),
        Remarks: String(formData?.Remarks || ""),
        DeliveryDate: String(formatDate(formData?.IssueDate)),
        Document_Base64: String(
          formData?.Document_Base64 ? formData?.Document_Base64 : ""
        ),
        Document_FormatType: String(
          formData?.FileExtension ? formData?.FileExtension : ""
        ),
      };
      axiosInstances
        .post(apiUrls?.Connector_Insert, payload)
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setLoading(false);
            setFormData({
              PaymentType: "",
              IssueDate: new Date(),
              Address: "",
              Courier: "",
              CourierAddress: "",
              IsActive: "",
              Remarks: "",
              Project: "",
              TableQuantity: "",
              TableAmount: "",
              CourierCharges: "",
              DocumentType: "",
              SelectFile: "",
              Document_Base64: "",
              FileExtension: "",
            });
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };
  const handleUpdate = () => {
    if (!formData?.Project) {
      toast.error("Please Select Project.");
    } else {
      setLoading(true);
      let maleConnector_9 = { rate: "", qty: "", amount: "" };
      let femaleConnector_9 = { rate: "", qty: "", amount: "" };
      let maleConnector_25 = { rate: "", qty: "", amount: "" };
      let femaleConnector_25 = { rate: "", qty: "", amount: "" };
      tableData?.forEach((item) => {
        switch (item.ConnectorName) {
          case "9 Pin Male":
            maleConnector_9.rate = item.Rate || "";
            maleConnector_9.qty = item.TableQuantity || "";
            maleConnector_9.amount = item.TableAmount || "";
            break;
          case "9 Pin Female":
            femaleConnector_9.rate = item.Rate || "";
            femaleConnector_9.qty = item.TableQuantity || "";
            femaleConnector_9.amount = item.TableAmount || "";
            break;
          case "25 Pin Male":
            maleConnector_25.rate = item.Rate || "";
            maleConnector_25.qty = item.TableQuantity || "";
            maleConnector_25.amount = item.TableAmount || "";
            break;
          case "25 Pin Female":
            femaleConnector_25.rate = item.Rate || "";
            femaleConnector_25.qty = item.TableQuantity || "";
            femaleConnector_25.amount = item.TableAmount || "";
            break;
          default:
            break;
        }
      });
      const payload = {
        ProjectID: String(formData?.Project),
        ConnectorID: String(formData?.ConnectorID),
        ProjectName: String(getlabel(formData?.Project, project)),
        PaymentMode: String(formData?.PaymentType),
        ClientAddress: String(formData?.Address),
        Courier: String(formData?.Courier || ""),
        CourierAddress: String(formData?.CourierAddress || ""),
        CourierCharges: Number(formData?.CourierCharges || ""),
        FemaleConnector_Rate_9: Number(femaleConnector_9.rate),
        FemaleConnector_Qty_9: Number(femaleConnector_9.qty),
        FemaleConnector_Amount_9: Number(femaleConnector_9.amount),
        MaleConnector_Rate_9: Number(maleConnector_9.rate),
        MaleConnector_Qty_9: Number(maleConnector_9.qty),
        MaleConnector_Amount_9: Number(maleConnector_9.amount),
        FemaleConnector_Rate_25: Number(femaleConnector_25.rate),
        FemaleConnector_Qty_25: Number(femaleConnector_25.qty),
        FemaleConnector_Amount_25: Number(femaleConnector_25.amount),
        MaleConnector_Rate_25: Number(maleConnector_25.rate),
        MaleConnector_Qty_25: Number(maleConnector_25.qty),
        MaleConnector_Amount_25: Number(maleConnector_25.amount),
        Remarks: String(formData?.Remarks || ""),
        DeliveryDate: String(formatDate(formData?.IssueDate)),
        Document_Base64: String(
          formData?.Document_Base64 ? formData?.Document_Base64 : ""
        ),
        Document_FormatType: String(
          formData?.FileExtension ? formData?.FileExtension : ""
        ),
      };
      axiosInstances
        .post(apiUrls?.Connector_Update, payload)
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setLoading(false);
            setFormData({
              PaymentType: "",
              IssueDate: new Date(),
              Address: "",
              Courier: "",
              CourierAddress: "",
              IsActive: "",
              Remarks: "",
              Project: "",
              TableQuantity: "",
              TableAmount: "",
              CourierCharges: "",
              DocumentType: "",
              SelectFile: "",
              Document_Base64: "",
              FileExtension: "",
            });
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };
  const searchHandleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  useEffect(() => {
    getPaymentMode();
    getProject();
    getConnectorCharges();
  }, []);

  const handleTableChange = (value, index, name, type) => {
    let updatedTableData = [...tableData];
    let updatedRow = { ...updatedTableData[index] };
    updatedRow[name] = type === "checkbox" ? (checked ? 1 : 0) : value;
    if (name === "TableQuantity") {
      updatedRow.TableAmount = value * updatedRow.Rate;
    }
    updatedTableData[index] = updatedRow;
    setTableData(updatedTableData);
  };

  const showsearchTHEAD = [
    { name: t("S.No."), width: "5%" },
    t("Connector"),
    t("Rate"),
    t("Quantity"),
    t("Amount"),
  ];
  return (
    <>
      <div className="card mt-1">
        <Heading
          title={
            <span style={{ fontWeight: "bold" }}>{t("Connector Request")}</span>
          }
          isBreadcrumb={data ? false : true}
        />
        <div className="row g-4 m-2">
          <ReactSelect
            name="Project"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName={t("Project")}
            dynamicOptions={project}
            value={formData?.Project}
            handleChange={handleDeliveryChange}
            // requiredClassName={"required-fields"}
          />
          <ReactSelect
            name="PaymentType"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName={t("Type of Payment")}
            dynamicOptions={paymentmode}
            value={formData?.PaymentType}
            handleChange={handleDeliveryChange}
          />
          <DatePicker
            className="custom-calendar"
            id="IssueDate"
            name="IssueDate"
            lable={t("Issue Date")}
            placeholder={VITE_DATE_FORMAT}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={formData?.IssueDate}
            handleChange={searchHandleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="Address"
            name="Address"
            lable={t("Address Of Client")}
            placeholder=" "
            max={20}
            onChange={searchHandleChange}
            value={formData?.Address}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />

          <ReactSelect
            name="Courier"
            respclass="col-xl-1 col-md-4 col-sm-6 col-12"
            placeholderName={t("Courier")}
            dynamicOptions={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
            value={formData?.Courier}
            handleChange={handleDeliveryChange}
          />
          {formData?.Courier == "Yes" && (
            <>
              <Input
                type="text"
                className="form-control"
                id="CourierAddress"
                name="CourierAddress"
                lable={t("Courier Address")}
                placeholder=" "
                max={20}
                onChange={searchHandleChange}
                value={formData?.CourierAddress}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                disabled={formData?.Courier == 1}
              />
              <div className="search-col" style={{ marginLeft: "0px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label className="switch" style={{ marginTop: "7px" }}>
                    <input
                      type="checkbox"
                      name="IsActive"
                      checked={formData?.IsActive == "1" ? true : false}
                      onChange={(e) => {
                        // Update IsActive status
                        const isChecked = e.target.checked ? "1" : "0";

                        // If checked, copy the Address to CourierAddress
                        setFormData((prevData) => ({
                          ...prevData,
                          IsActive: isChecked,
                          CourierAddress:
                            isChecked === "1"
                              ? formData?.Address
                              : prevData?.CourierAddress, // Auto-fill only when checked
                        }));
                      }}
                      disabled={formData?.Courier == 1}
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
                    {t("Same Address")}
                  </span>
                </div>
              </div>
              <Input
                type="number"
                className="form-control required-fields"
                id="CourierCharges"
                name="CourierCharges"
                lable={t("Courier Charges")}
                placeholder=" "
                onChange={searchHandleChange}
                value={formData?.CourierCharges}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                disabled={formData?.Courier == 1}
              />
            </>
          )}

          <Input
            type="text"
            className="form-control"
            id="Remarks"
            name="Remarks"
            lable={t("Remarks")}
            placeholder=" "
            onChange={searchHandleChange}
            value={formData?.Remarks}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <BrowseButton handleImageChange={handleImageChange} />
        </div>
        <div className="ml-0 mr-0">
          <Tables
            thead={showsearchTHEAD}
            tbody={tableData?.map((ele, index) => ({
              "S.No.": index + 1,
              Connector: ele?.ConnectorName,
              Rate: ele?.Rate,
              Quantity: (
                <Input
                  type="number"
                  className="form-control"
                  id="TableQuantity"
                  name="TableQuantity"
                  placeholder={t("Quantity")}
                  onChange={(e) =>
                    handleTableChange(e.target.value, index, e.target.name)
                  }
                  value={ele?.TableQuantity}
                />
              ),
              Amount: (
                <Input
                  type="number"
                  className="form-control"
                  id="TableAmount"
                  name="TableAmount"
                  placeholder={t("Amount")}
                  onChange={(e) =>
                    handleTableChange(e.target.value, index, e.target.name)
                  }
                  value={ele?.TableAmount}
                />
              ),
            }))}
            tableHeight={"tableHeight"}
          />
          <div className="row m-2">
            {loading ? (
              <Loading />
            ) : (
              <div>
                {connectdata?.edit ? (
                  <button
                    className="btn btn-sm btn-info ml-2"
                    onClick={handleUpdate}
                  >
                    {t("Update")}
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-info ml-2"
                    onClick={handleSave}
                  >
                    {t("Save")}
                  </button>
                )}
              </div>
            )}
            <Link to="/SearchConnectorRequest" className="ml-3">
              {t("Back to List")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default ConnectorRequest;
