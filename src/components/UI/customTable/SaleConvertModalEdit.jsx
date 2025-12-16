import React, { useEffect, useState } from "react";
import ReactSelect from "../../formComponent/ReactSelect";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { headers } from "../../../utils/apitools";
import axios from "axios";
import Tables from ".";
import { toast } from "react-toastify";
import Input from "../../formComponent/Input";
import DatePicker from "../../formComponent/DatePicker";
import moment from "moment";
import Loading from "../../loader/Loading";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";

const SaleConvertModalEdit = ({ visible, setVisible, handleSearch }) => {
  console.log("lotus edit ", visible.showData.saveEditData.ProjectName);
  const [loading, setLoading] = useState(false);
  // console.log(visible?.visible?.showData?.EncryptID);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [emailShow, setEmailShow] = useState({ Email: "" });
  const [termsdata, setTermsData] = useState([]);
  const [projectEmail, setProjectEmail] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    Category: "",
    OtherReason: "",
    AcknowledgmentDate: new Date(),
    PaymentTerms: "",
    Installment: "",
    InstallmentDate: new Date(),
    EmailTo: "",
    EmailCC: "",
    ExpectedDate: new Date(),
    EmailStatus: "1",
  });
  const [errors, setErrors] = useState({});
  const getProjectEmail = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        ProjectID: String(visible?.showData?.saveEditData?.ProjectID),
        IsMaster: "0",
        VerticalID: 0,
        TeamID: 0,
        WingID: 0,
      })
   
      .then((res) => {
        setProjectEmail(res?.data?.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCheckBoxEmail = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleAddRow = () => {
    setTableData((prevTableData) => [
      ...prevTableData,
      {
        ExpectedDate: new Date(),
        Percent: "",
        Amount: "",
        Remark: visible?.showData?.saveEditData?.Remark,
        Cancel: "",
        NetAmount: visible?.showData?.saveEditData?.NetAmount || 0,
      },
    ]);
  };

  const searchSelectChange = (e, index) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const searchHandleChange = (e, index) => {
    const { name, value } = e.target;

    if (typeof index === "undefined") {
      console.error("Index is not defined. Please provide a valid index.");
      return;
    }

    setTableData((prevTableData) => {
      const updatedTableData = [...prevTableData];
      const newErrors = { ...errors };

      if (!updatedTableData[index]) return prevTableData;

      let netAmount =
        parseFloat(visible?.showData?.saveEditData?.NetAmount) || 0;

      if (name === "Percent") {
        let percentValue = parseFloat(value);
        if (percentValue > 100) percentValue = 100;

        let calculatedAmount = (percentValue / 100) * netAmount;

        let totalAmount = updatedTableData.reduce((sum, row, i) => {
          return (
            sum + (i === index ? calculatedAmount : parseFloat(row.Amount))
          );
        }, 0);

        if (totalAmount > netAmount) {
          newErrors[index] = "Enter Valid Percent.";
        } else {
          delete newErrors[index];
          updatedTableData[index] = {
            ...updatedTableData[index],
            Percent: percentValue.toString(),
            Amount: calculatedAmount.toFixed(2),
          };
        }
      } else if (name === "Amount") {
        let enteredAmount = value; // allow raw input including empty string
        let parsedAmount = parseFloat(enteredAmount);

        let totalAmount = updatedTableData.reduce((sum, row, i) => {
          let amt = i === index ? parsedAmount : parseFloat(row.Amount || 0);
          return sum + (isNaN(amt) ? 0 : amt);
        }, 0);

        if (!isNaN(parsedAmount) && totalAmount > netAmount) {
          newErrors[index] = "Enter Valid Amount.";
        } else {
          delete newErrors[index];
          updatedTableData[index] = {
            ...updatedTableData[index],
            Amount: enteredAmount, // don't fix to decimal here
            Percent:
              parsedAmount && netAmount
                ? ((parsedAmount / netAmount) * 100).toFixed(2)
                : "",
          };
        }
      } else {
        // Handle all other generic fields like Terms, Remark, etc.
        updatedTableData[index] = {
          ...updatedTableData[index],
          [name]: value,
        };
      }

      setErrors(newErrors);
      return updatedTableData;
    });
  };

  const handleRemoveRow = (index) => {
    if (typeof index === "undefined") {
      console.error("Index is not defined. Please provide a valid index.");
      return;
    }

    setTableData((prevTableData) =>
      prevTableData.filter((_, i) => i !== index)
    );
  };

  const Quotation_PaymentTerms_Select = () => {
    axiosInstances
      .post(apiUrls.Quotation_PaymentTerms_Select, {
        QuotationID: String(
          visible?.showData?.recordID || visible?.encryptFile
        ),
      })
    
      .then((res) => {
        const uploadData = res?.data?.data;
        const updatedData = uploadData.map((item) => ({
          ...item,
          ExpectedDate: item?.ExpectedDate || new Date(),
          Amount: item.Amount, // Default to empty string if undefined
          Remark: item.Remark || "",
          Percent: item.Percent, // Default to 0 if undefined
        }));

        setTableData(updatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSaleConvert = () => {
    let DatePayload = [];
    tableData?.map((val, index) => {
      console.log("val val", val);
      DatePayload?.push({
        // "S.No.": index + 1,
        ExpectedDate: moment(val?.ExpectedDate).format("YYYY-MM-DD"),
        Percent: String(val?.Percent || ""),
        Amount: String(val?.Amount || ""),
        Remark: String(val?.Remark || ""),
        Terms: String(val?.Terms || ""),
        TermsID: String(val?.TermsID || ""),
        ItemName: String(""),
        ItemID: String(""),
        SAC: String(""),
        IsActive: String(""),
        PaymentMode: String(""),
        TaxAmount: String(""),
        TaxPercentage: String(""),
        Rate: String(val?.Rate || ""),
        Quantity: String(val?.Quantity || ""),
        DiscountAmount: String(val?.DiscountAmount || ""),
      });
    });

 
    setLoading(true);
    axiosInstances
      .post(apiUrls.Quotation_SalesConvert, {
        QuotationID: String(visible?.showData?.saveEditData?.recordID),
        dtAcknowledgement: String(
          moment(formData?.AcknowledgmentDate).format("YYYY-MM-DD")
        ),
        InstallmentData: DatePayload,
      })
    
      .then((res) => {
        if (res?.data?.success == true) {
          toast.success(res?.data?.message);
          setLoading(false);
          setVisible(false);
          handleSearch();
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    Quotation_PaymentTerms_Select();
    getProjectEmail();
  }, []);

  return (
    <>
      <div className="card p-2">
        <div className="d-flex">
          <span style={{ fontWeight: "bold" }}>
            Project Name:-&nbsp;
            {visible?.showData?.saveEditData?.ProjectName}
          </span>
          <span style={{ fontWeight: "bold", marginLeft: "20px" }}>
            Net Amount:- {visible?.showData?.saveEditData?.NetAmount}
          </span>
          <span style={{ fontWeight: "bold", marginLeft: "20px" }}>
            Quotataion No.:- {visible?.showData?.saveEditData?.QuotationNo}
          </span>
        </div>{" "}
      </div>
      <div className="card">
        <div className="row m-2">
          <DatePicker
            className="custom-calendar"
            id="AcknowledgmentDate"
            name="AcknowledgmentDate"
            lable="Acknowledgment Date"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.AcknowledgmentDate}
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            handleChange={searchSelectChange}
          />

          <div className="search-col" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="EmailStatus"
                  checked={formData?.EmailStatus ? 1 : 0}
                  onChange={handleCheckBoxEmail}
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
                Email
              </span>
            </div>
          </div>
          {formData?.EmailStatus == "1" && (
            <>
              <textarea
                type="text"
                className="summaryheightRemark"
                placeholder="EmailTo"
                id={"EmailTo"}
                name="EmailTo"
                value={
                  formData?.EmailTo ? formData?.EmailTo : projectEmail.EmailTo
                }
                onChange={searchSelectChange}
                style={{ width: "220px", height: "60px", marginLeft: "5px" }}
              ></textarea>
              <textarea
                type="text"
                className="summaryheightRemark"
                placeholder="EmailCC "
                id={"EmailCC"}
                name="EmailCC"
                value={
                  formData?.EmailCC ? formData?.EmailCC : projectEmail?.EmailCC
                }
                onChange={searchSelectChange}
                style={{ width: "220px", height: "60px", marginLeft: "10px" }}
              ></textarea>
            </>
          )}

          <div className="card mt-3">
            <Tables
              thead={[
                { name: "S.No.", width: "1%" },
                { name: "Expected Date", width: "15%" },
                { name: "%", width: "6%" },
                { name: "₹", width: "9%" },
                { name: "Terms", width: "20%" },
                { name: "Remark", width: "15%" },
                { name: "Cancel", width: "10%" },
              ]}
              tbody={tableData.map((ele, index) => ({
                "S.No.": index + 1,
                "Expected Date": (
                  <DatePicker
                    className="custom-calendar"
                    id="ExpectedDate"
                    name="ExpectedDate"
                    placeholder={VITE_DATE_FORMAT}
                    value={new Date(ele?.ExpectedDate)}
                    handleChange={(e) => searchHandleChange(e, index)}
                    respclass="col-xl-12 col-md-4 col-sm-6 col-12 mt-1"
                  />
                ),
                Percentage: (
                  <div>
                    <Input
                      type="number"
                      className="form-control"
                      id="Percent"
                      name="Percent"
                      lable="%"
                      placeholder=" "
                      onChange={(e) => searchHandleChange(e, index)}
                      value={ele?.Percent || ""}
                      // respclass="col-xl-12 col-md-4 col-sm-6 col-12 mt-2"
                    />
                    {errors[index] && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginTop: "5px",
                        }}
                      >
                        {errors[index]}
                      </p>
                    )}
                  </div>
                ),
                Amount: (
                  <div>
                    <Input
                      type="number"
                      className="form-control"
                      id="Amount"
                      name="Amount"
                      lable="₹"
                      placeholder=" "
                      onChange={(e) => searchHandleChange(e, index)}
                      value={ele?.Amount}
                      // respclass="col-xl-12 col-md-4 col-sm-6 col-12 mt-2"
                    />
                    {errors[index] && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginTop: "5px",
                        }}
                      >
                        {errors[index]}
                      </p>
                    )}
                  </div>
                ),

                Terms: (
                  <Input
                    type="text"
                    className="form-control"
                    id="Terms"
                    name="Terms"
                    lable="Terms"
                    placeholder=" "
                    onChange={(e) => searchHandleChange(e, index)}
                    value={
                      ele?.Terms
                        ? ele?.Terms
                        : visible?.showData?.saveEditData?.Terms
                    }
                  />
                ),
                Remark: (
                  <textarea
                    type="text"
                    className="summaryheightRemark"
                    id="Remark"
                    name="Remark"
                    lable="Enter emark"
                    placeholder={""}
                    onChange={(e) => searchHandleChange(e, index)}
                    value={
                      ele?.Remark
                        ? ele?.Remark
                        : visible?.showData?.saveEditData?.Remark
                    }
                    style={{ width: "200px", marginLeft: "7.5px" }}
                  ></textarea>
                ),

                Cancel: (
                  // <span
                  //   label="Remove"
                  //   icon="pi pi-trash"
                  //   className="fa fa-trash"
                  //   onClick={() => handleRemoveRow(index)}
                  //   style={{
                  //     cursor: "pointer",
                  //     color: "red",
                  //     marginLeft: "10px",
                  //   }}
                  // />
                  <div>
                    {index === tableData.length - 1 ? (
                      <span
                        label="Add"
                        icon="pi pi-plus"
                        className="fa fa-plus"
                        onClick={handleAddRow}
                        style={{ cursor: "pointer", color: "green" }}
                      />
                    ) : null}

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
                  </div>
                ),
              }))}
            />
          </div>

          {/* {loading ? (
            <Loading />
          ) : ( */}
          <button
            className="btn btn-sm btn-primary mt-2 ml-2"
            onClick={handleSaleConvert}
          >
            Save
          </button>
          {/* )} */}
        </div>
      </div>
    </>
  );
};

export default SaleConvertModalEdit;
