import React, { useEffect, useRef, useState } from "react";
import Heading from "../components/UI/Heading";
import ReactSelect from "../components/formComponent/ReactSelect";
import TextEditor from "../components/formComponent/TextEditor";
import { useTranslation } from "react-i18next";
import Modal from "../components/modalComponent/Modal";
import UploadFile from "../utils/UploadFile";
import Loading from "../components/loader/Loading";
import { toast } from "react-toastify";
import { apiUrls } from "../networkServices/apiEndpoints";
import axios from "axios";
import { headers } from "../utils/apitools";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import "./MorningWish.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosInstances } from "../networkServices/axiosInstance";

const BirthdayWish = () => {
  const fileInputRef = useRef(null);

  const [t] = useTranslation();
  const location = useLocation();
  const { state } = location;
  const [editMode, setEditMode] = useState(state?.edit);
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    SelectDate: "",
    Description: "",
    DocumentType: "",
    SelectFile: "",
    Document_Base64: "",
    FileExtension: "",
    WishID: "",
  });
  const days = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
    { label: "13", value: "13" },
    { label: "14", value: "14" },
    { label: "15", value: "15" },
    { label: "16", value: "16" },
    { label: "17", value: "17" },
    { label: "18", value: "18" },
    { label: "19", value: "19" },
    { label: "20", value: "20" },
    { label: "21", value: "21" },
    { label: "22", value: "22" },
    { label: "23", value: "23" },
    { label: "24", value: "24" },
    { label: "25", value: "25" },
    { label: "26", value: "26" },
    { label: "27", value: "27" },
    { label: "28", value: "28" },
    { label: "29", value: "29" },
    { label: "30", value: "30" },
    { label: "31", value: "31" },
  ];
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [rowHandler, setRowHandler] = useState({
    ButtonShow: false,
    TextEditorShow: false,
  });

  const handleDeliveryButton2 = () => {
    setRowHandler({
      ...rowHandler,
      TextEditorShow: !rowHandler?.TextEditorShow,
    });
  };
  const handleDeliveryButton3 = () => {
    setRowHandler({
      ...rowHandler,
      ButtonShow: !rowHandler?.ButtonShow,
    });
  };

  const handleChange1 = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      Description: value,
    }));
  };

  const [visible, setVisible] = useState({
    showVisible: false,
    showData: {},
  });

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

  function removeHtmlTags(text) {
    return text?.replace(/<[^>]*>?/gm, "");
  }
  const handleSave = () => {
    if (formData?.SelectDate == "") {
      toast.error("Please Select Day.");
      return;
    }

    if (formData?.SelectFile == "") {
      toast.error("Please Select File.");
      return;
    }

    // if (formData?.Description?.trim() == "") {
    //   toast.error("Please Enter Description.");
    //   return;
    // }

    setLoading(true);

    axiosInstances
      .post(apiUrls.MorningWishSave, {
        Day: String(formData?.SelectDate),
        Content: String(
          formData.Description ? removeHtmlTags(formData.Description) : ""
        ),
        Image_Base64: String(formData?.Document_Base64),
        FileFormat_Base64: String(formData?.FileExtension),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          setFormData({
            ...formData,
            SelectDate: "",
            Description: "",
            DocumentType: "",
            SelectFile: "",
            Document_Base64: "",
            FileExtension: "",
            WishID: "",
          });
          setRowHandler({});
          navigate("/MorningWishSearch");
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleUpdate = () => {
    if (formData?.SelectDate == "") {
      toast.error("Please Select Day.");
      return;
    }

    if (formData?.SelectFile == "") {
      toast.error("Please Select File.");
      return;
    }

    // if (formData?.Description?.trim() == "") {
    //   toast.error("Please Enter Description.");
    //   return;
    // }
    setLoading(true);

    axiosInstances
      .post(apiUrls.UpdateMorningWish, {
        Day: String(formData?.SelectDate),
        Content: String(
          formData.Description ? removeHtmlTags(formData.Description) : ""
        ),
        Image_Base64: String(formData?.Document_Base64),
        FileFormat_Base64: String(formData?.FileExtension),
        WishID: String(formData?.WishID),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          setFormData({
            ...formData,
            SelectDate: "",
            Description: "",
            DocumentType: "",
            SelectFile: "",
            Document_Base64: "",
            FileExtension: "",
            WishID: "",
          });
          setRowHandler({});
          navigate("/MorningWishSearch");
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const EditMorningWish = (id) => {
    axiosInstances
      .post(apiUrls.EditMorningWish, {
        WishID: String(id),
      })
      .then((res) => {
        const datas = res?.data?.data[0];

        setFormData({
          ...formData,
          SelectDate: datas?.Day,
          Description: datas?.Content,
          DocumentType: "",
          SelectFile: "",
          Document_Base64: "",
          FileExtension: "",
          WishID: datas?.ID,
        });
        setEditMode(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (state?.edit) {
      EditMorningWish(state?.data);
    }
  }, []);
  return (
    <>
      <Modal
        modalWidth={"500px"}
        visible={visible?.showVisible}
        setVisible={setVisible}
        Header="Upload Document"
        tableData={visible}
      >
        <UploadFile
          visible={visible?.showVisible}
          setVisible={setVisible}
          tableData={visible}
        />
      </Modal>
      <div className="card">
        <Heading
          isBreadcrumb={true}
          secondTitle={
            <div style={{ fontWeight: "bold" }}>
              <Link to="/BirthdayWishSearch" className="ml-3">
                Birthday Wish Search
              </Link>
            </div>
          }
        />
        <div className="row p-2">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="SelectDate"
            placeholderName={"Select Date"}
            dynamicOptions={days}
            value={formData?.SelectDate}
            handleChange={handleDeliveryChange}
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

          {(rowHandler?.ButtonShow || editMode) && (
            <div
              className={`col-sm-3 dropzone ${dragActive ? "drag-active" : ""}`}
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

          <div className=" ml-3" style={{ display: "flex" }}>
            <div style={{ width: "40%", marginRight: "3px" }}>
              <button
                className="btn btn-sm btn-success"
                onClick={handleDeliveryButton2}
                title="Click to Write Content."
              >
                {t("Content")}
              </button>
            </div>
          </div>

          {(rowHandler?.TextEditorShow || editMode) && (
            <div className="col-12 mt-2">
              <TextEditor
                value={formData?.Description}
                onChange={handleChange1}
              />
            </div>
          )}

          {loading ? (
            <Loading />
          ) : (
            <div className="col-2">
              {state?.edit ? (
                <button
                  className="btn btn-sm btn-info ml-2"
                  // onClick={handleUpdate}
                >
                  Update
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2"
                  // onClick={handleSave}
                >
                  Save
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default BirthdayWish;
