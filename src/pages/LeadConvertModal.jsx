import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../components/formComponent/Input";
import { headers } from "../utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { apiUrls } from "../networkServices/apiEndpoints";
import Loading from "../components/loader/Loading";
import Heading from "../components/UI/Heading";
import { axiosInstances } from "../networkServices/axiosInstance";

const LeadConvertModal = (showData, handleSearch) => {
  console.log("showData", showData);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    BaseAmount: "",
    TaxAmount: "",
    NetAmount: "",
  });
  const handleSelectChange = (e) => {
    const { name, value } = e?.target;
    const updatedValue = parseFloat(value) || "";
    let updatedFormData = { ...formData, [name]: updatedValue };

    if (name === "BaseAmount") {
      const taxPercent = 18;
      const taxAmount = parseFloat((updatedValue * taxPercent) / 100).toFixed(
        2
      );
      const netAmount = parseFloat(
        updatedValue + parseFloat(taxAmount)
      ).toFixed(2);

      updatedFormData = {
        ...updatedFormData,
        TaxAmount: parseFloat(taxAmount),
        NetAmount: parseFloat(netAmount),
      };
    }

    setFormData(updatedFormData);
  };

  const handleConvert = () => {
    if (!formData?.BaseAmount) {
      toast.error("Base Amount is required");
      return;
    }
    setLoading(true);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("LeadID", showData?.visible?.showData?.ID),
    //   form.append("BaseAmount", formData?.BaseAmount),
    //   form.append("TaxAmount", formData?.TaxAmount),
    //   form.append("NetAmount", formData?.NetAmount),
    const payload = {
      LeadID: Number(showData?.visible?.showData?.ID || 0),
      BaseAmount: Number(formData?.BaseAmount || 0),
      TaxAmount: Number(formData?.TaxAmount || 0),
      NetAmount: Number(formData?.NetAmount || 0),
    };

    // axios
    //   .post(apiUrls?.ConvertedSalesLead, form, { headers })
    axiosInstances
      .post(apiUrls?.ConvertedSalesLead, payload)
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          showData?.setVisible(false);
          showData?.handleSearch();
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
          <span style={{ fontWeight: "bold" }}>Sales Lead Convert Details</span>
        }
      /> */}
      <div className="card  p-2">
        <span style={{ fontWeight: "bold" }}>
          Organization Name : {showData?.visible?.showData?.OrganizationName}{" "}
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Created By :{" "}
          {showData?.visible?.showData?.CreatedBy} &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; Created Date :{" "}
          {new Date(showData?.visible?.showData?.dtEntry?.Value).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )}
        </span>
      </div>
      <div className="card">
        <div className="row p-2">
          <Input
            type="number"
            className="form-control"
            id="BaseAmount"
            name="BaseAmount"
            lable="Base Amount"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.BaseAmount}
            respclass="col-xl-3 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="number"
            className="form-control"
            id="TaxAmount"
            name="TaxAmount"
            lable="Tax Amount"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.TaxAmount}
            respclass="col-xl-3 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="number"
            className="form-control"
            id="NetAmount"
            name="NetAmount"
            lable="Net Amount"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.NetAmount}
            respclass="col-xl-3 col-md-4 col-sm-4 col-12"
          />
          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-primary ml-2"
              onClick={handleConvert}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default LeadConvertModal;
