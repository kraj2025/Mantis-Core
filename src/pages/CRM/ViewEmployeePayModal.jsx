import React, { useState } from "react";
import ReactSelect from "../../components/formComponent/ReactSelect";
import DatePicker from "../../components/formComponent/DatePicker";
import Loading from "../../components/loader/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../utils/apitools";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
const ViewEmployeePayModal = (visible) => {

  const { VITE_DATE_FORMAT } = import.meta.env;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    PaymentMode: "",
    PaymentDate: new Date(),
    Remarks: "",
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
  const handleLSubmit = () => {
    setLoading(true);
    // Format the date
    const formattedDate = formatDate(formData?.PaymentDate);
    const date = new Date(formData?.PaymentDate);
    const expenseYear = date.getFullYear();
    const expenseMonth = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure it's 2 digits
  
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname") );
    form.append("ExpenseDate", formattedDate);
    form.append("ExpenseEmployeeID", "2");
    form.append("Remark", formData?.Remarks);
    form.append("PaymentMode", formData?.PaymentMode);
    form.append("ActionType", "");
    form.append("ExpenseYear", expenseYear); // Add ExpenseYear
    form.append("ExpenseMonth", expenseMonth); // Add ExpenseMonth
    form.append("AdvanceAmount", "");
  
    axios
      .post(apiUrls?.PaidAmount, form, { headers })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <>
      <div className="">
        <div className="row m-2">
          <div className="col-12">
            <label>Name : </label>{" "}
            <span className="ml-5">
              {visible?.visible?.showData?.RequestedBy}
            </span>
          </div>
          <div className="col-12">
            <label>Net Advance : </label>
            <span className="ml-5">
              {visible?.visible?.showData?.AmountRequired}
            </span>
          </div>
          <div className="col-12">
            <label>Net Expense : </label>
            <span className="ml-5">
              {visible?.visible?.showData?.AmountRequired}
            </span>
          </div>
          <div className="col-12">
            <label>Net Payable Amount : </label>
            <span className="ml-5">
              {visible?.visible?.showData?.AmountRequired}
            </span>
          </div>

          <ReactSelect
            respclass="col-md-12 col-12 col-sm-12 mb-2"
            name="PaymentMode"
            placeholderName="Payment Mode"
            dynamicOptions={[
              { label: "Delta", value: "CASH" },
              { label: "KOTAK BANK", value: "KOTAK BANK" },
              { label: "ICICI BANK", value: "ICICI BANK" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.PaymentMode}
          />
          <DatePicker
            className="custom-calendar"
            id="PaymentDate"
            name="PaymentDate"
            lable="Payment Date"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.PaymentDate}
            respclass="col-md-12 col-12 col-sm-12"
            handleChange={searchHandleChange}
          />
          <textarea
            type="text"
            respclass="col-md-12 col-12 col-sm-12"
            className=""
            placeholder="Remarks "
            id={"Remarks"}
            name="Remarks"
            value={formData?.Remarks}
            onChange={searchHandleChange}
            style={{ width: "95%", marginLeft: "7.5px", height: "50px" }}
          ></textarea>
          <div className="col-2 mt-1 ">
            {loading ? (
              <Loading />
            ) : (
              <button
                className="btn btn-sm"
                style={{ background: "green", border: "none", color: "white" }}
                onClick={handleLSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewEmployeePayModal;
