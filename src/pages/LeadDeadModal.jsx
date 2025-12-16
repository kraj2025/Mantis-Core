import React, { useState } from "react";
import Input from "../components/formComponent/Input";
import { toast } from "react-toastify";
import { headers } from "../utils/apitools";
import axios from "axios";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { apiUrls } from "../networkServices/apiEndpoints";
import Loading from "../components/loader/Loading";
import Heading from "../components/UI/Heading";
import { axiosInstances } from "../networkServices/axiosInstance";

const LeadDeadModal = (showData) => {
  console.log("showData1111", showData);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Reason: "",
  });
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };
  const handleDead = () => {
    if (!formData?.Reason) {
      toast.error("Please Enter Dead Reason.");
      return;
    }
    setLoading(true);
  
    axiosInstances
      .post(apiUrls?.DeadSalesLead, {
        LeadID: Number(showData?.visible?.showData?.ID),
        DeadReason: String(formData?.Reason),
      })
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
          <span style={{ fontWeight: "bold" }}>Sales Lead Dead Details</span>
        }
      /> */}
      <div className="card  p-2">
        <span style={{ fontWeight: "bold" }}>
          Organization Name : {showData?.visible?.showData?.OrganizationName}{" "}
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Created By :{" "}
          {showData?.visible?.showData?.CreatedBy} &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; Created Date :{" "}
          {new Date(
            showData?.visible?.showData?.dtEntry?.Value
          ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="card">
        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            id="Reason"
            name="Reason"
            lable="Dead Reason"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.Reason}
            respclass="col-xl-8 col-md-4 col-sm-4 col-12"
          />

          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-primary ml-2"
              onClick={handleDead}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default LeadDeadModal;
