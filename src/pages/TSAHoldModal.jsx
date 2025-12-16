import React, { useState } from "react";
import Input from "../components/formComponent/Input";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import Heading from "../components/UI/Heading";
import { axiosInstances } from "../networkServices/axiosInstance";
const TSAHoldModal = (showData) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    CancelReason: "",
  });
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleHold = () => {
    setLoading(true);
    // let form = new FormData();
    // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   );
    // form.append("TSAID", showData?.visible?.showData?.TSAID);
    // form.append("ProjectID", showData?.visible?.showData?.ProjectID);
    // form.append("HoldRegion", formData?.CancelReason);
    // axios
    //   .post(apiUrls?.TSAHold, form, { headers })

    const payload = {
      TSAID: Number(showData?.visible?.showData?.TSAID || 0),
      ProjectID: Number(showData?.visible?.showData?.ProjectID || 0),
      HoldRegion: String(formData?.CancelReason || ""),
    };

    axiosInstances
      .post(apiUrls?.TSAHold, payload)
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          showData?.setVisible(false);
          showData.handleSearch();
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      {/* <Heading
        title={
          <span style={{ fontWeight: "bold" }}>TSA Cancel Details</span>
        } /> */}
      <div className="card p-1">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {showData?.visible?.showData?.ProjectName}
        </span>
      </div>
      <div className="card">
        <div className="row p-1">
          <Input
            type="text"
            className="form-control"
            id="CancelReason"
            name="CancelReason"
            lable="Hold Reason"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.CancelReason}
            respclass="col-xl-8 col-md-4 col-sm-6 col-12 mt-2"
          />

          {loading ? (
            <Loading />
          ) : (
            <button className="btn btn-sm btn-danger mt-2" onClick={handleHold}>
              Yes
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default TSAHoldModal;
