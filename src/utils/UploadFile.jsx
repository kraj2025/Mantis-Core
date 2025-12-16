import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import Heading from "../components/UI/Heading";
import { headers } from "./apitools";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import { useCryptoLocalStorage } from "./hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

const UploadFile = ({ tableData, setVisible }) => {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [documenttype, setDocumentType] = useState([]);

  const [formData, setFormData] = useState({
    DocumentType: "",
    SelectFile: "",
    Document_Base64: "",
    FileExtension: "",
  });

  const fileInputRef = useRef(null);

  const getType = () => {
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    axios
      .post(apiUrls?.DocumentType_Select, form, { headers })
      .then((res) => {
        const options = res?.data.data.map((item) => ({
          label: item?.DocumentTypeName,
          value: item?.DocumentTypeID,
        }));
        setDocumentType(options);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0] || e?.dataTransfer?.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size exceeds 50MB limit");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        const fileExtension = file.name.split(".").pop();
        setFormData({
          ...formData,
          SelectFile: file,
          Document_Base64: base64String,
          FileExtension: fileExtension,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFileChange(e);
  };

  const handleUploadDocument = () => {
    if (!formData.SelectFile) {
      toast.error("Please select file.");
      return;
    }

    setLoading(true);
    // const form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname"));
    // form.append("ProjectID", tableData?.showData?.ProjectID);
    // form.append("DocumentTypeID", formData.DocumentType);
    // form.append(
    //   "DocumentTypeName",
    //   documenttype.find((item) => item?.value === formData.DocumentType)?.label
    // );
    // form.append("File", formData.SelectFile);
    // form.append("FileExtension", formData.FileExtension);

    // axios
    //   .post(apiUrls?.UploadDocument, form, { headers })
    axiosInstances
      .post(apiUrls.Reporter_Select, {
        ProjectID: String(tableData?.showData?.ProjectID),
        DocumentTypeID: String(formData.DocumentType),
        DocumentTypeName: String(
          documenttype.find((item) => item?.value === formData.DocumentType)
            ?.label
        ),
        File: formData.SelectFile,
        FileExtension: formData.FileExtension,
      })
      .then((res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message);
          setFormData({
            DocumentType: "",
            SelectFile: "",
            Document_Base64: "",
            FileExtension: "",
          });
          document.getElementById("SelectFile").value = "";
          setVisible(false);
        } else {
          toast.error(res?.data?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getType();
  }, []);

  return (
    <div className="card ViewIssues border">
      <Heading />
      <div className="row m-2">
        {/* <ReactSelect
          name="DocumentType"
          respclass="col-md-4 col-12 col-sm-12"
          placeholderName="DocumentType"
          dynamicOptions={documenttype}
          value={formData?.DocumentType}
          handleChange={handleDeliveryChange}
        /> */}

        {/* Drag and Drop File Input */}
        <div
          className={`col-sm-5 dropzone ${dragActive ? "drag-active" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: "2px dashed #ccc",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: dragActive ? "#e6f7ff" : "#fff",
          }}
        >
          <p>Drag & Drop your file here or click below to select</p>
          <input
            type="file"
            id="SelectFile"
            name="SelectFile"
            accept=".pdf,.png,.jpg,.jpeg,.xls,.xlsx"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => fileInputRef.current.click()}
          >
            Browse File
          </button>
          {formData?.SelectFile?.name && (
            <p style={{ marginTop: "10px", fontSize: "14px", color: "#333" }}>
              Selected: <strong>{formData.SelectFile.name}</strong>
            </p>
          )}
        </div>

        <div className="mt-3">
          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-info ml-2"
              onClick={handleUploadDocument}
              disabled={loading}
            >
              Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
