import React, { useEffect, useState } from "react";
import Input from "../../formComponent/Input";
import { headers } from "../../../utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import ReactSelect from "../../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";
const RemoveAmountSubmissionModal = ({ visible, setVisible, ele }) => {
  // console.log(visible);
  const [t] = useTranslation();
  const [reason, setreason] = useState([]);
  const [formData, setFormData] = useState({
    CancelReason: "",
    OtherReason: "",
  });
  const searchHandleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }
  const handleRemove = () => {
    if (formData?.CancelReason == "") {
      toast.error("Please Enter Cancel Reason.");
    } else {
      
      const payload = {
        OnAccount_Req_ID: String(visible?.showData?.EncryptID || ""),
        CancelReason: String(getlabel(formData?.CancelReason, reason) || ""),
        CancelReasonID: String(formData?.CancelReason || ""),
        OtherCancelReason: String(formData?.OtherReason || ""),
      };

      axiosInstances
        .post(apiUrls?.AmountSubmission_ByAccounts_IsCancel, payload)
        .then((res) => {
          toast.success(res?.data?.message);
          setVisible((val) => ({ ...val, removeVisible: false }));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSearchReason = () => {
  
    axiosInstances
      .post(apiUrls?.AmountSub_CancelReason_Select, {})
      .then((res) => {
        const verticals = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setreason(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const othersReason = reason?.find(
    (item) => item?.label == "Others" && formData?.CancelReason == item?.value
  );

  console.log(formData, reason, othersReason?.label);

  useEffect(() => {
    handleSearchReason();
  }, []);

  return (
    <>
      <div className="row m-2">
        <span style={{ fontWeight: "bold" }}>
          {" "}
          {t("Project Name")} : &nbsp; {visible?.showData?.ProjectName}
        </span>
      </div>
      <div className="card">
        <div className="row g-4 m-2">
          <ReactSelect
            respclass="col-xl-5 col-md-4 col-sm-6 col-12"
            name="CancelReason"
            placeholderName={t("Cancel Reason")}
            dynamicOptions={reason}
            handleChange={handleDeliveryChange}
            value={formData.CancelReason}
          />

          {othersReason?.label == "Others" && (
            <Input
              type="text"
              className="form-control"
              id="OtherReason"
              name="OtherReason"
              lable={t("Other Reason")}
              placeholder=" "
              onChange={searchHandleChange}
              value={formData?.OtherReason}
              respclass="col-xl-5 col-md-4 col-sm-6 col-12"
            />
          )}

          <div className="col-2">
            <button className="btn btn-sm btn-danger" onClick={handleRemove}>
              {t("Cancel")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoveAmountSubmissionModal;
