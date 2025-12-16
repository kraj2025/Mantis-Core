import React, { useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import Heading from "../components/UI/Heading";
import Input from "../components/formComponent/Input";
import Loading from "../components/loader/Loading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { toast } from "react-toastify";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import axios from "axios";
import { axiosInstances } from "../networkServices/axiosInstance";
const LongBreakModal = ({ visible, setVisible, handleTableSearch }) => {
  // console.log("visible",visible)
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    Reason: "",
    DocumentType: "",
    SelectFile: "",
    Document_Base64: "",
    FileExtension: "",
  });
  const [rowHandler, setRowHandler] = useState({
    ButtonShow: false,
  });
  const handleSelectChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleDeliveryButton3 = () => {
    setRowHandler({
      ...rowHandler,
      ButtonShow: !rowHandler?.ButtonShow,
    });
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error("File size exceeds 1MB limit");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        const fileExtension = file.name.split(".").pop();

        setFormData((prev) => ({
          ...prev,
          SelectFile: file,
          Document_Base64: base64String,
          FileExtension: fileExtension,
        }));
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

  const handleSave = () => {
    setLoading(true);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("Reason", formData?.Reason),
    //   form.append("AttType", "LongBreak"),
    //   form.append("Image_Base64", formData?.Document_Base64),
    //   form.append("FileFormat_Base64", formData?.FileExtension),
    //   form.append("AttSummaryID", visible?.showData?.breakSummaryId),
    //   form.append("EmployeeID", visible?.showData?.Employee_Id),
    //   form.append("EmployeeName", visible?.showData?.Name),
    //   axios
    //     .post(apiUrls?.ForceFullyShortBreakAttendanceSave, form, { headers })
     axiosInstances
          .post(apiUrls.ForceFullyShortBreakAttendanceSave, {
            Reason: String(formData?.Reason),
            AttType: String("LongBreak"),
            AttSummaryID: Number(visible?.showData?.breakSummaryId),
            EmployeeID: Number(visible?.showData?.Employee_Id),
            EmployeeName: String(visible?.showData?.Name),
            Image_Base64: String(formData?.Document_Base64),
            FileFormat_Base64: String(formData?.FileExtension),
          })
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setLoading(false);
            setVisible(false);
            handleTableSearch();
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
        title={<span style={{ fontWeight: "bold" }}>Long Break Details</span>}
      /> */}
      <div className="card">
        <div className="row p-2">
          <Input
            type="text"
            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
            className="form-control"
            placeholder=" "
            lable="Reason"
            id="Reason"
            name="Reason"
            value={formData?.Reason}
            onChange={handleSelectChange}
          />
          <div className=" ml-3 mr-2" style={{ display: "flex" }}>
            <div style={{ width: "100%", marginRight: "3px" }}>
              <button
                className="btn btn-sm btn-success"
                onClick={handleDeliveryButton3}
                title="Click to Upload File."
              >
                {t("Select File")}
              </button>
            </div>
          </div>

          {rowHandler?.ButtonShow && (
            <div
              className={`col-sm-4 dropzone ${dragActive ? "drag-active" : ""}`}
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
                accept=".png,.jpg,.jpeg"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                style={{ color: "white" }}
                onClick={() => fileInputRef.current?.click()}
              >
                Browse File
              </button>
              {formData?.SelectFile?.name && (
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    color: "black",
                  }}
                >
                  Selected: <strong>{formData?.SelectFile?.name}</strong>
                </p>
              )}
            </div>
          )}

          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-success ml-3"
              onClick={handleSave}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default LongBreakModal;
