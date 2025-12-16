import React, { useState } from "react";
import Loading from "../components/loader/Loading";
import { toast } from "react-toastify";
import { apiUrls } from "../networkServices/apiEndpoints";
import Input from "../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import { inputBoxValidation } from "../utils/utils";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../utils/constant";
import { axiosInstances } from "../networkServices/axiosInstance";

const EmployeeFeedbackWhatsapp = (showData) => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    WhatsappNumber: showData?.visible?.showData?.MobileNo,
  });
  const handleConfirm = () => {
    setLoading(true);

    axiosInstances
      .post(apiUrls.ResendEmployeeFeedbackWhatsapp, {
        FeedbackID: Number(showData?.visible?.showData?.FeedbackID),
        EmployeeID: Number(showData?.visible?.showData?.CrmEmployeeID),
        EmployeeName: String(showData?.visible?.showData?.EmployeeName),
        MobileNo: String(formData?.WhatsappNumber),
      })
      .then((res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message);
          showData.setVisible(false);
          showData.handleSearchList();
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
        <div className="row p-1 d-none">
          <label style={{ fontWeight: "bold", marginLeft: "10px" }}>
            Just to confirm, would you like to proceed with sending a WhatsApp
            message?
          </label>
        </div>
        <div className="row p-1">
          <Input
            type="text"
            className="form-control"
            id="WhatsappNumber"
            name="WhatsappNumber"
            lable={t("Whatsapp Number")}
            placeholder=" "
            onChange={(e) => {
              inputBoxValidation(
                MOBILE_NUMBER_VALIDATION_REGX,
                e,
                handleChange
              );
            }}
            value={formData?.WhatsappNumber}
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
export default EmployeeFeedbackWhatsapp;
