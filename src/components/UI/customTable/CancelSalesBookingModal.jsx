import React, { useEffect, useState } from "react";
import Input from "../../formComponent/Input";
import { headers } from "../../../utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import ReactSelect from "../../formComponent/ReactSelect";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";
const CancelSalesBookingModal = ({ visible, setVisible, handleSearch }) => {
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
      toast.error("Please Select CancelReason.");
    } else {
     
      axiosInstances
        .post(apiUrls.SalesBooking_IsCancel, {
          SalesID: String(visible?.showData?.EncryptID),
          CancelReasonID: Number(formData?.CancelReason),
          CancelReason: String(getlabel(formData?.CancelReason, reason)),
          OtherCancelReason: String(formData?.OtherReason),
        })
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setVisible(false);
            handleSearch();
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSearchReason = () => {
  
    axiosInstances
      .post(apiUrls.SalesBooking_CancelReason_Select, {})
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

  useEffect(() => {
    handleSearchReason();
  }, []);

  return (
    <>
      <div className="row m-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name : &nbsp; {visible?.showData?.ProjectName}
        </span>
      </div>
      <div className="card">
        <div className="row g-4 m-2">
          <ReactSelect
            respclass="col-xl-5 col-md-4 col-sm-6 col-12"
            name="CancelReason"
            placeholderName="Cancel Reason"
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
              lable="Other Reason"
              placeholder=" "
              onChange={searchHandleChange}
              value={formData?.OtherReason}
              respclass="col-xl-5 col-md-4 col-sm-6 col-12"
            />
          )}

          <div className="col-2">
            <button className="btn btn-sm btn-danger" onClick={handleRemove}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CancelSalesBookingModal;
