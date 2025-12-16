import React, { useState } from "react";
import Input from "../../formComponent/Input";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { headers } from "../../../utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";

const ConnectorIssueModal = (visible) => {
  const [t] = useTranslation();
  const [formData, setFormData] = useState({
    IssueReason: "",
  });
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
      <div className="row g-4 m-2">
        <label>
          {t("Do you want to submit this Issue")} :-{" "}
          {visible?.visible?.connectdata?.IssueNo}
        </label>
        <div className="col-2">
          <button className="btn btn-sm btn-success ml-2" onClick={handleSave}>
            {t("Yes")}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConnectorIssueModal;
