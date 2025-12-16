import React, { useState } from "react";
import Input from "../../formComponent/Input";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { headers } from "../../../utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";
const ConnectorRejectModal = (visible) => {
  console.log(visible);
  const [t] = useTranslation();
  const [formData, setFormData] = useState({
    RejectReason: "",
  });
  const searchHandleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleSave = () => {
    axiosInstances
      .post(apiUrls.Connector_Status_Update, {
        ConnectorID: visible?.visible?.connectdata?.ID || 0,
        Status: "Approve",
      })
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className="card">
        <div className="row g-4 m-2">
          <Input
            type="text"
            className="form-control"
            id="RejectReason"
            name="RejectReason"
            lable={t("Reject Reason")}
            onChange={searchHandleChange}
            value={formData?.RejectReason}
            respclass="col-md-10 col-12 col-sm-12"
          />
          <div className="col-2">
            <button className="btn btn-sm btn-success" onClick={handleSave}>
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default ConnectorRejectModal;
