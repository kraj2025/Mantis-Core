import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { toast } from "react-toastify";
import Heading from "../components/UI/Heading";
import ReactSelect from "../components/formComponent/ReactSelect";
import Loading from "../components/loader/Loading";
import Input from "../components/formComponent/Input";
import Tables from "../components/UI/customTable";
import DocumentTypeModal from "../components/UI/customTable/DocumentTypeModal";
import Modal from "../components/modalComponent/Modal";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { useTranslation } from "react-i18next";
import { axiosInstances } from "../networkServices/axiosInstance";

const UploadDocumentProject = ({ data }) => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    DocumentType: "",
    SelectFile: "",
    Document_Base64: "",
    FileExtension: "",
    DocumentID: "",
    DocumentPrimaryID: "",
  });

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [documenttype, setDocumentType] = useState([]);
  const getType = () => {
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      axios
        .post(apiUrls?.DocumentType_Select, form, { headers })
        .then((res) => {
          const wings = res?.data.data.map((item) => {
            return {
              label: item?.DocumentTypeName,
              value: item?.DocumentTypeID,
            };
          });
          setDocumentType(wings);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const handleUploadDocument = async () => {
    setLoading(true);

    // Convert base64 to Blob
    const byteCharacters = atob(formData?.Document_Base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const fileBlob = new Blob([byteArray], { type: "application/pdf" });

    // Create a File object with a proper filename
    const pdfFile = new File([fileBlob], "filename.pdf", {
      type: "application/pdf",
    });

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const result = reader.result;
          // Remove the "data:application/...;base64," prefix
          const base64 = result.split(",")[1]?.trim();
          resolve(base64);
        };
        reader.onerror = (error) => reject(error);
      });

    // console.log("pdfFile", pdfFile);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append(
    //   "LoginName",
    //   useCryptoLocalStorage("user_Data", "get", "realname")
    // );
    // form.append("ProjectID", data?.ProjectID || data?.Id);
    // form.append("DocumentTypeID", formData?.DocumentType);
    // form.append(
    //   "DocumentTypeName",
    //   documenttype.find((item) => item?.value === formData?.DocumentType)?.label
    // );

    // Append the PDF file
    // form.append("File", pdfFile);
    // form.append("FileExtension", formData?.FileExtension),
    // axios
    //   .post(apiUrls?.UploadDocument, form, { headers })
    const base64File = pdfFile ? await toBase64(pdfFile) : "";
    const payload = {
      ProjectID: Number(data?.ProjectID || data?.Id),
      DocumentTypeID: Number(formData?.DocumentType),
      DocumentTypeName:
        String(
          documenttype.find((item) => item?.value === formData?.DocumentType)
            ?.label
        ) || "",
      Document_Base64: base64File,
      FileExtension: String(formData?.FileExtension),
    };
    axiosInstances
      .post(apiUrls?.UploadDocument, payload)
      .then((res) => {
        if (res?.data?.success == true) {
          toast.success(res?.data?.message);
          setLoading(false);
          setFormData({
            ...formData,
            DocumentType: "",
            SelectFile: "",
            Document_Base64: "",
            FileExtension: "",
          });
          handleSearch();
          document.getElementById("SelectFile").value = "";
          setVisible(false);
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(tableData?.length / rowsPerPage);
  const currentData = tableData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleBillingEdit = (ele) => {
    setFormData({
      ...formData,
      CentreName: ele?.Centre,
      ProjectID: ele?.ProjectID,
      DocumentID: ele?.DocumentID,
      DocumentPrimaryID: "",
    });
    setEditMode(true);
  };

  const handleDocRemove = (ele) => {
    setLoading(true);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ProjectID", ele?.ProjectID),
    //   form.append("ActionType", "DeleteDocument"),
    //   form.append("DocumentPrimaryID", ele?.UniqueID),
    //   axios
    //     .post(apiUrls?.ProjectMasterUpdate, form, { headers })
    axiosInstances
      .post(apiUrls.ProjectMasterUpdate, {
        ProjectID: Number(ele?.ProjectID),
        ActionType: "DeleteDocument",
        User_ID: ele?.UniqueID,
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleSearch();
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    const payload = {
      RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
      VerticalID: "",
      TeamID: "",
      WingID: "",
      POC1: "",
      POC2: "",
      POC3: "",
      Status: "",
      ProjectID: String(data?.Id || data?.ProjectID),
    };
    axiosInstances
      .post(apiUrls?.UploadDocument_Search, payload)
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getType();
    handleSearch();
  }, []);
  const docTHEAD = [
    "S.No.",
    "Document Name",
    "Entry Date",
    "DocumentUrl",

    "Remove",
  ];
  const documentTHEAD = [
    "S.No.",
    "Vertical",
    "Team",
    "Wing",
    "Project Name",
    "Type",
    "Print",
    // "Upload",
    "Uploaded By",
    "Uploaded Date",
    { name: "Remove", width: "5%" },
  ];

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const [visible, setVisible] = useState({
    showVisible: false,
    showData: {},
  });

  const [rowHandler, setRowHandler] = useState({
    ButtonShow: false,
  });

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
        toast.error(
          "File size exceeds 1MB limit, Please compress the file below 1MB"
        );
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
  return (
    <>
      <Modal
        modalWidth={"600px"}
        visible={visible?.showVisible}
        setVisible={setVisible}
        Header="Upload Document"
        tableData={visible}
        setTableData={setTableData}
      >
        <DocumentTypeModal
          visible={visible?.showVisible}
          setVisible={setVisible}
          tableData={visible}
          setTableData={setTableData}
        />
      </Modal>
      <div className="card  p-2">
        <Heading title={"View Document"} />
      </div>
      <div className="card p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {data?.ProjectName || data?.NAME}
        </span>

        <div className="row g-4 m-2">
          <ReactSelect
            name="DocumentType"
            respclass="col-sm-2 col-md-2 col-12 col-sm-12"
            placeholderName="DocumentType"
            dynamicOptions={documenttype}
            value={formData?.DocumentType}
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

          {rowHandler?.ButtonShow && (
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
                accept=".png,.jpg,.jpeg,.pdf,.xls,.xlsx"
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
            <div className="">
              <button
                className="btn btn-sm btn-info ml-4"
                onClick={handleUploadDocument}
                disabled={loading}
              >
                Upload
              </button>
            </div>
          )}
        </div>
      </div>
      {/* {tableData?.length > 0 && (
        <div className="card">
           <Heading title={"Search Details"} />
          <Tables
            thead={docTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              "Documnet Name": ele?.DocumentName,
              "Entry Date":ele?.dtEntry,
              DocumentUrl: ( <i
                className="fa fa-print"
                style={{
                  marginLeft: "5px",
                  cursor: "pointer",
                  color: "black",
                  padding: "2px",
                  borderRadius: "3px",
                }}
                onClick={() => window.open(ele?.DocumentUrl, "_blank")}
              ></i>),
            
              Remove: (
                <i
                  className="fa fa-remove"
                  style={{ color: "red" }}
                  onClick={() => {
                    handleDocRemove(ele);
                  }}
                >
                  X
                </i>
              ),
            }))}
            tableHeight={"tableHeight"}
          />
          <div className="pagination ml-auto">
            <div>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )} */}
      {tableData?.length > 0 && (
        <div className="card patient_registration_card mt-2 my-2">
          <Heading title="Search Details" />
          <Tables
            thead={documentTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              Vertical: ele?.Vertical,
              Team: ele?.Team,
              Wing: ele?.Wing,
              ProjectName: ele?.ProjectName,
              Type: ele?.DocumentName,
              Print: ele?.DocumentUrl ? (
                <i
                  className="fa fa-print"
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    color: "white",
                    border: "1px solid green",
                    padding: "2px",
                    background: "black",
                    borderRadius: "3px",
                  }}
                  onClick={() => window.open(ele?.DocumentUrl, "_blank")}
                ></i>
              ) : null,

              UploadedBy: ele?.UploadedBy,
              UploadedDate: ele?.dtUpload,
              Remove: (
                <i
                  className="fa fa-times"
                  style={{ color: "red", marginLeft: "20px" }}
                  onClick={() => {
                    handleDocRemove(ele);
                  }}
                ></i>
              ),
              colorcode: ele?.colorcode,
            }))}
            tableHeight={"tableHeight"}
          />

          <div
            className="pagination"
            style={{ marginLeft: "auto", marginBottom: "9px" }}
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadDocumentProject;
