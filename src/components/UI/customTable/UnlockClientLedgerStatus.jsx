import React, { useState } from "react";
import Input from "../../formComponent/Input";
import ReactSelect from "../../formComponent/ReactSelect";
import { toast } from "react-toastify";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { headers } from "../../../utils/apitools";
import axios from "axios";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";

const UnlockClientLedgerStatus = ({ visible, setVisible }) => {
  const [formData, setFormData] = useState({
    UnLockDays: "",
    UnLockHours: "",
    Reason: "",
    LastReason: "",
  });

  const handleSelectChange = (e) => {
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

  const handleSave = () => {
    if (formData?.Reason == "") {
      toast.error("Please Enter Reason.");
    } else {
      axiosInstances
        .post(apiUrls.LedgerStatus_LockUnLock, {
          ProjectID: Number(visible?.showData?.ProjectID),
          Reason: String(formData?.Reason),
          IsLock: 0,
          TxtTimeLimit: Number(formData?.UnLockHours),
          DdlTime: Number(formData?.UnLockDays),
        })

        .then((res) => {
          toast.success(res?.data?.message);
          setFormData({
            ...formData,
            UnLockDays: "",
            UnLockHours: "",
            Reason: "",
          });
          setVisible((val) => ({ ...val, showVisible: false }));
          // setVisible(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <>
      <div className="row m-2">
        <span style={{ fontWeight: "bold", marginLeft: "0px" }}>
          Project Name : &nbsp; {visible?.showData?.ProjectName}
        </span>
      </div>
      <div className="row m-2">
        <label>Time Limit</label> &nbsp;&nbsp;:
        <Input
          type="number"
          className="form-control"
          id="UnLockDays"
          name="UnLockDays"
          lable="Days"
          placeholder=" "
          onChange={handleSelectChange}
          value={formData?.UnLockDays}
          respclass="col-xl-5 col-md-4 col-sm-4 col-12"
        />
        <Input
          type="number"
          className="form-control"
          id="UnLockHours"
          name="UnLockHours"
          lable="Hours"
          placeholder=" "
          onChange={handleSelectChange}
          value={formData?.UnLockHours}
          respclass="col-xl-5 col-md-4 col-sm-4 col-12"
        />
        {/* <ReactSelect
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          name="UnLockHours"
          placeholderName="Hours"
          dynamicOptions={[
            { label: "", value: "" },
            { label: "", value: "" },
          ]}
          handleChange={handleDeliveryChange}
          value={formData.UnLockHours}
        /> */}
      </div>
      <div className="row m-2">
        <label>Reason</label> &nbsp;: &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
        <Input
          type="text"
          className="form-control"
          id="Reason"
          name="Reason"
          lable="Reason"
          placeholder=" "
          onChange={handleSelectChange}
          value={formData?.Reason}
          respclass="col-xl-10 col-md-4 col-sm-4 col-12"
        />
      </div>
      {/* <div className="row m-2">
        <label>Last Reason</label>:
        <Input
          type="text"
          className="form-control"
          id="LastReason"
          name="LastReason"
          lable="Last Reason"
          placeholder=" "
          onChange={handleSelectChange}
          value={formData?.LastReason}
          respclass="col-xl-9 col-md-4 col-sm-4 col-12"
        />
      </div> */}
      <div className="row m-2" style={{ justifyContent: "center" }}>
        <button className="btn btn-sm btn-success" onClick={handleSave}>
          Save
        </button>
      </div>
    </>
  );
};

export default UnlockClientLedgerStatus;
