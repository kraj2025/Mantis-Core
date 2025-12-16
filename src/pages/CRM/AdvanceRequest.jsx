import React, { useEffect, useRef, useState } from "react";
import DatePicker from "../../components/formComponent/DatePicker";
import ReactSelect from "../../components/formComponent/ReactSelect";
import Input from "../../components/formComponent/Input";
import Heading from "../../components/UI/Heading";
import { toast } from "react-toastify";
import { headers } from "../../utils/apitools";
import axios from "axios";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tables from "../../components/UI/customTable";
import Loading from "../../components/loader/Loading";
import { axiosInstances } from "../../networkServices/axiosInstance";
const AdvanceRequest = () => {
  const fileInputRef = useRef(null);
  const [t] = useTranslation();
  const [tableData1, setTableData1] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [dragActive, setDragActive] = useState(false);
  const [advanceType, setAdvanceType] = useState([]);
  const [inhandType, setInHandType] = useState([]);
  const [formData, setFormData] = useState({
    AdvanceType: "",
    AdvanceAmountRequired: "",
    PurposeOfAdvance: "",
    AdvanceExpectedDate: new Date(),
    DocumentType: "",
    SelectFile: "",
    Document_Base64: "",
    FileExtension: "",
    EMIType: "",
    FirstEmi: "",
    SecondEmi: "",
    ThirdEmi: "",
    FourthEmi: "",
    FifthEmi: "",
  });
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const searchHandleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  const handleSave = () => {
    let termsPayload = [];
    tableData1?.map((val, index) => {
      // console.log("val", val);
      termsPayload?.push({
        "S.No.": index,
        Month: val?.Month,
        Year: val?.Year,
        Amount: val?.Amount,
      });
    });
    const ImageJson = JSON.stringify([
      {
        Document_Base64: formData?.Document_Base64,
        FileExtension: formData?.FileExtension,
      },
    ]);
    if (!formData?.AdvanceType) {
      toast.error("Please Select AdvanceType.");
      return;
    }
    if (!formData?.EMIType) {
      toast.error("Please Select EMI Type.");
      return;
    }
    if (!formData?.PurposeOfAdvance) {
      toast.error("Please Select Purpose of Advance.");
      return;
    }
    setLoading(true);
    axiosInstances
      .post(apiUrls.AdvanceAmount_Requset, {
  "AdvanceType": String(formData?.AdvanceType),
  "AmountRequired": Number(totalAmount),
  "PurposeofAdvance": String(formData?.PurposeOfAdvance),
  "ExpectedDate": new Date(formData.AdvanceExpectedDate).toISOString(),
  "EMIDetails": termsPayload,
  "DocumentDetails": [
    {
        Document_Base64: formData?.Document_Base64,
        FileExtension: formData?.FileExtension,
      }
  ]
})
    // let form = new FormData();
    // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append(
    //   "LoginName",
    //   useCryptoLocalStorage("user_Data", "get", "realname")
    // );
    // form.append(
    //   "CrmID",
    //   useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
    // );
    // form.append("ExpectedDate", formatDate(formData?.AdvanceExpectedDate));
    // form.append("AmountRequired", totalAmount);
    // form.append("PurposeofAdvance", formData?.PurposeOfAdvance);
    // form.append("AdvanceType", formData?.AdvanceType);
    // form.append("DocumentDetails", ImageJson);
    // form.append("EMIDetails", JSON.stringify(termsPayload));
    // axios
    //   .post(apiUrls?.AdvanceAmount_Requset, form, { headers })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          navigate("/AdvanceRequestView");
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const quotagTHEAD = [
    { name: t("S.No."), width: "10%" },
    t("Month"),
    t("Year"),
    t("Amount"),
    { name: t("Cancel"), width: "10%" },
  ];
  const handleDeliveryChangeEMI = (name, e) => {
    const { value } = e;
    const emiCount = parseInt(value, 10);

    if (name === "EMIType") {
      if (emiCount > 0) {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const now = new Date();
        const currentMonthIndex = now.getMonth(); // 0-11
        const currentYear = now.getFullYear();

        const emiRows = Array.from({ length: emiCount }, (_, i) => {
          const monthIndex = (currentMonthIndex + i) % 12;
          const yearOffset = Math.floor((currentMonthIndex + i) / 12);
          const year = currentYear + yearOffset;

          return {
            "S.No.": i + 1,
            Month: monthNames[monthIndex],
            Year: year,
            Amount: "",
          };
        });

        setTableData1(emiRows);
      } else {
        setTableData1([]);
      }

      setFormData((prev) => ({
        ...prev,
        EMIType: e,
      }));
    }
  };

  const handleRemoveRow = (index) => {
    const updatedRows = tableData1?.filter((_, rowIndex) => rowIndex !== index);
    setTableData1(updatedRows);
  };
  const getAdvanceType = () => {
    axiosInstances
      .post(apiUrls.AdvaceAmount_Select, {
        SearchType : "AdvanceType"
      })
    // let form = new FormData();
    // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append(
    //   "LoginName",
    //   useCryptoLocalStorage("user_Data", "get", "realname")
    // );
    // form.append("SearchType", "AdvanceType");
    // axios
    //   .post(apiUrls?.AdvaceAmount_Select, form, { headers })
      .then((res) => {
        const poc3s = res?.data?.data?.map((item) => {
          return { label: item?.AdvanceType, value: item?.AdvanceTypeID };
        });
        setAdvanceType(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // const getInhandChildEmployee = () => {
  //   let form = new FormData();
  //   form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID"));
  //   form.append(
  //     "LoginName",
  //     useCryptoLocalStorage("user_Data", "get", "realname")
  //   );
  //   form.append("SearchType", "InHand");
  //   axios
  //     .post(apiUrls?.AdvaceAmount_Select, form, { headers })
  //     .then((res) => {
  //       const poc3s = res?.data.data.map((item) => {
  //         return { label: item?.AdvanceType, value: item?.AdvanceTypeID };
  //       });
  //       setInHandType(poc3s);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const [rowHandler, setRowHandler] = useState({
    ButtonShow: false,
  });
  const handleDeliveryButton3 = () => {
    setRowHandler({
      ...rowHandler,
      ButtonShow: !rowHandler?.ButtonShow,
    });
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error("File size exceeds 1MB limit");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        const fileExtension = file.name.split(".").pop();

        setFormData((prev) => ({
          ...prev,
          SelectFile: file,
          Document_Base64: base64String,
          FileExtension: fileExtension,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };
  useEffect(() => {
    getAdvanceType();
    // getInhandChildEmployee();
  }, []);
  return (
    <>
      <div className="card">
        <Heading
          isBreadcrumb={true}
          secondTitle={
            <div style={{ fontWeight: "bold" }}>
              <Link to="/AdvanceRequestView" className="ml-3">
                Advance Request View
              </Link>
            </div>
          }
        />
        <div className="row g-4 m-2">
          <ReactSelect
            name="AdvanceType"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="Advance Type"
            dynamicOptions={[{ label: "Select", value: "0" }, ...advanceType]}
            value={formData?.AdvanceType}
            handleChange={handleDeliveryChange}
          />
          {/* <Input
            type="number"
            className="form-control"
            id="AdvanceAmountRequired"
            name="AdvanceAmountRequired"
            placeholder="Advance Amount"
            onChange={searchHandleChange}
            value={formData?.AdvanceAmountRequired}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          /> */}
          <ReactSelect
            name="EMIType"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="EMI Type"
            dynamicOptions={[
              { label: "Select", value: "0" },
              { label: "1 Month", value: "1" },
              { label: "2 Month", value: "2" },
              { label: "3 Month", value: "3" },
              { label: "4 Month", value: "4" },
              { label: "5 Month", value: "5" },
              { label: "6 Month", value: "6" },
              { label: "7 Month", value: "7" },
              { label: "8 Month", value: "8" },
              { label: "9 Month", value: "9" },
              { label: "10 Month", value: "10" },
              { label: "11 Month", value: "11" },
              { label: "12 Month", value: "12" },
            ]}
            value={formData?.EMIType}
            handleChange={handleDeliveryChangeEMI}
          />

          <Input
            type="text"
            className="form-control"
            id="PurposeOfAdvance"
            name="PurposeOfAdvance"
            lable="Purpose of Advance"
            placeholder=""
            onChange={searchHandleChange}
            value={formData?.PurposeOfAdvance}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <DatePicker
            className="custom-calendar"
            id="AdvanceExpectedDate"
            name="AdvanceExpectedDate"
            placeholder={VITE_DATE_FORMAT}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            value={formData?.AdvanceExpectedDate}
            lable="Advance Expected Date"
            handleChange={searchHandleChange}
          />
          <div className="ml-3 mr-2" style={{ display: "flex" }}>
            <div style={{ width: "100%", marginRight: "3px" }}>
              <button
                className="btn btn-sm btn-success"
                onClick={handleDeliveryButton3}
                title="Click to Upload File."
              >
                {t("Select File")}
              </button>
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="col-2">
              <button className="btn btn-sm btn-success" onClick={handleSave}>
                Save
              </button>
            </div>
          )}

          {tableData1?.length > 0 && (
            <div className="card mt-3" style={{ width: "400px" }}>
              <Heading
                title={<span style={{ fontWeight: "bold" }}>EMI Details</span>}
              />
              <div className=" m-0">
                <Tables
                  thead={quotagTHEAD}
                  tbody={tableData1?.map((ele, index) => ({
                    "S.No.": index + 1,
                    Month: ele?.Month,
                    Year: ele.Year,
                    Amount: (
                      <Input
                        type="number"
                        className="form-control"
                        value={ele.Amount}
                        onChange={(e) => {
                          const updated = [...tableData1];
                          updated[index].Amount = e.target.value;

                          setTableData1(updated);

                          // Recalculate total
                          const total = updated.reduce((sum, row) => {
                            const amt = parseFloat(row.Amount);
                            return sum + (isNaN(amt) ? 0 : amt);
                          }, 0);

                          setTotalAmount(total);
                        }}
                      />
                    ),
                    Cancel: (
                      <span
                        label="Remove"
                        icon="pi pi-trash"
                        className="fa fa-trash"
                        onClick={() => handleRemoveRow(index)}
                        style={{
                          cursor: "pointer",
                          color: "red",
                          marginLeft: "10px",
                        }}
                      />
                    ),
                  }))}
                  tableHeight={"tableHeight"}
                />
                {/* Total Display */}
                <div className="text-right mt-2 ml-auto mr-5">
                  <strong>Total Amount: ₹{totalAmount.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          )}

          {rowHandler?.ButtonShow && (
            <div
              className={`col-sm-3 dropzone ${dragActive ? "drag-active" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: "2px dashed #ccc",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: dragActive ? "#e6f7ff" : "#fff",
                marginLeft: "20px",
                marginTop: "10px",
              }}
            >
              <p>Drag & Drop your file here or click below to select</p>
              <input
                type="file"
                id="SelectFile"
                name="SelectFile"
                // accept=".png,.jpg,.jpeg"
                accept=".pdf,.png,.jpg,.jpeg,.xls,.xlsx"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                style={{ color: "white" }}
                onClick={() => fileInputRef.current?.click()}
              >
                Browse File
              </button>
              {formData?.SelectFile?.name && (
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    color: "black",
                  }}
                >
                  Selected: <strong>{formData?.SelectFile?.name}</strong>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdvanceRequest;
