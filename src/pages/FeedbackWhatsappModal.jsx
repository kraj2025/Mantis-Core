import React, { useState } from "react";
import Loading from "../components/loader/Loading";
import { toast } from "react-toastify";
import axios from "axios";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import Input from "../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import { inputBoxValidation } from "../utils/utils";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../utils/constant";
import { axiosInstances } from "../networkServices/axiosInstance";
import { formatDate } from "date-fns";

const FeedbackWhatsappModal = (showData) => {
  console.log("showdata", showData);
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    WhatsappNumber: showData?.visible?.showData?.MobileNo,
  });
  const handleConfirm = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.ResendFeedbackWhatsapp, {
        FeedbackID: Number(showData?.visible?.showData?.FeedbackID),
        ProjectID: Number(showData?.visible?.showData?.ProjectID),
        ProjectName: String(showData?.visible?.showData?.ProjectName),
        MobileNo: String(formData?.WhatsappNumber),
        Content: String(showData?.visible?.showData?.Content),
      })

      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          showData.setVisible(false);
          showData.handleSearchFeedback();
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
          Project Name : {showData?.visible?.showData?.ProjectName}
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
            respclass="col-xl-6 col-md-4 col-sm-4 col-12"
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
export default FeedbackWhatsappModal;
