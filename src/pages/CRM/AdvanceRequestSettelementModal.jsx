import React, { useState } from "react";
import ReactSelect from "../../components/formComponent/ReactSelect";
import DatePicker from "../../components/formComponent/DatePicker";
import Loading from "../../components/loader/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../utils/apitools";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
const AdvanceRequestSettelementModal = ({
  visible,
  setVisible,
  handleSearchAdvance,
}) => {
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
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      form.append(
          "CrmID",
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        );
      form.append(
        "LoginName",
        useCryptoLocalStorage("user_Data", "get", "realname")
      ),
      form.append("PaymentDate", formatDate(formData?.PaymentDate)),
      form.append("AdvanceRequestID", visible?.showData?.ID),
      form.append("Remarks", formData?.Remarks),
      form.append("PaymentMode", formData?.PaymentMode),
      axios
        .post(apiUrls?.AdvanceAmount_Paid, form, { headers })
        .then((res) => {
          if (res?.data?.status === true) {
            toast.success(res?.data?.message);
            setLoading(false);
            setVisible(false);
            handleSearchAdvance();
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
  };
  return (
    <>
      <div className="card">
        <div className="row p-2 d-flex">
          <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
            Name : {visible?.showData?.RequestedBy}
          </span>
          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
          <span style={{ fontWeight: "bold" }}>
            Amount : {visible?.showData?.AmountRequired}
          </span>
        </div>
      </div>
      <div className="card p-1">
        <ReactSelect
          respclass="col-md-12 col-12 col-sm-12 mb-2 mt-2"
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
          className="mt-1"
          placeholder="Remarks "
          id={"Remarks"}
          name="Remarks"
          value={formData?.Remarks}
          onChange={searchHandleChange}
          style={{ width: "95%", marginLeft: "7.5px", height: "60px" }}
        ></textarea>
        <div className="col mt-2 ">
          {loading ? (
            <Loading />
          ) : (
            <button className="btn btn-sm btn-success" onClick={handleLSubmit}>
              Submit
            </button>
          )}
          <button
            className="btn btn-sm btn-success ml-4"
            onClick={() => setVisible(false)}
          >
            No
          </button>
        </div>
      </div>
    </>
  );
};

export default AdvanceRequestSettelementModal;
