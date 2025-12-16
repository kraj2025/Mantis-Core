import React, { useState } from "react";
import Loading from "../components/loader/Loading";
import { toast } from "react-toastify";
import { apiUrls } from "../networkServices/apiEndpoints";
import { useTranslation } from "react-i18next";
import Input from "../components/formComponent/Input";
import { axiosInstances } from "../networkServices/axiosInstance";
const EmployeeFeedbackGmail = (showData) => {
  console.log("showdata", showData);
  const [loading, setLoading] = useState(false);
  const [t] = useTranslation();
  const [formData, setFormData] = useState({
    Gmail: showData?.visible?.showData?.FeedbackSubmittedBy
      ? showData?.visible?.showData?.FeedbackSubmittedBy
      : "",
  });
  const handleConfirm = () => {
    setLoading(true);

    axiosInstances
      .post(apiUrls.ResendEmployeeFeedbackMail, {
        FeedbackID: Number(showData?.visible?.showData?.FeedbackID),
        EmployeeID: Number(showData?.visible?.showData?.CrmEmployeeID),
        EmployeeName: String(showData?.visible?.showData?.EmployeeName),
        MobileNo: String(formData?.Gmail),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          showData?.setVisible(false);
          showData?.handleSearchList();
          setLoading(false);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  return (
    <>
      <div className="card p-1">
        <span style={{ fontWeight: "bold" }}>
          Employee Name : {showData?.visible?.showData?.EmployeeName}
        </span>
      </div>
      <div className="card">
        <div className="row p-2 d-none">
          <label style={{ fontWeight: "bold", marginLeft: "5px" }}>
            Do you want to send this message through Gmail now?
          </label>
        </div>
        <div className="row p-1">
          <Input
            type="text"
            className="form-control"
            id="Gmail"
            name="Gmail"
            lable={t("Gmail")}
            placeholder=" "
            onChange={handleChange}
            value={formData?.Gmail}
            respclass="col-xl-7 col-md-4 col-sm-4 col-12"
          />
          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-danger ml-2"
              onClick={handleConfirm}
            >
              Send
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default EmployeeFeedbackGmail;
