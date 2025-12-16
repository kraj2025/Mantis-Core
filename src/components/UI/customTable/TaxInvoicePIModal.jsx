import React, { useState } from "react";
import Input from "../../formComponent/Input";
import { toast } from "react-toastify";
import axios from "axios";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { headers } from "../../../utils/apitools";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import Loading from "../../loader/Loading";
import { axiosInstances } from "../../../networkServices/axiosInstance";
const TaxInvoicePIModal = (visible, setVisible) => {
  console.log("lotus ", visible);
  const [formData, setFormData] = useState({
    TaxInvoiceNo: "",
    DocumentType: "",
    SelectFile: "",
    Document_Base64: "",
    FileExtension: "",
  });
  const [loading, setLoading] = useState(false);
  const searchHandleChange = (e, index) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };
  const handleFileChange = (e) => {
    const file = e?.target?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader?.result.split(",")[1];
        const fileExtension = file?.name.split(".").pop();
        // console.log("chchc",file?.name ,fileExtension)
        setFormData({
          ...formData,
          SelectFile: file,
          Document_Base64: base64String,
          FileExtension: fileExtension,
        });
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  const handleUploadDocs = () => {
    if (formData?.TaxInvoiceNo == "") {
      toast.error("Please Enter Tax Invoice No.");
    } else if (formData?.SelectFile == "") {
      toast.error("Please Select Document.");
    } else {
      setLoading(true);
      const payload = {
        TaxInvoiceID: String(visible?.visible?.showData?.EncryptID || 0),
        TaxInvoiceNo: String(formData?.TaxInvoiceNo || ""),
        Document_Base64: String(formData?.Document_Base64 || ""),
        Document_FormatType: String(formData?.FileExtension || ""),
      };

      axiosInstances
        .post(apiUrls?.TaxInvoice_Upload, payload)
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            visible?.setVisible(false);
            setLoading(false);
            visible?.handleSearch();
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <>
      <div className="card p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name:- {visible?.visible?.showData?.ProjectName}
        </span>
      </div>
      <div className="card">
        <div className="row m-2">
          <Input
            type="text"
            className="form-control"
            id="TaxInvoiceNo"
            name="TaxInvoiceNo"
            lable="Tax Invoice No."
            placeholder=" "
            onChange={searchHandleChange}
            value={formData?.TaxInvoiceNo}
            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="file"
            id="SelectFile"
            name="SelectFile"
            respclass="col-md-4 col-12 col-sm-12"
            style={{ width: "100%", marginLeft: "5px" }}
            onChange={handleFileChange}
          />

          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-primary ml-5"
              onClick={handleUploadDocs}
            >
              Upload
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default TaxInvoicePIModal;
