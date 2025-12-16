import React, { useEffect, useState } from "react";
import ReactSelect from "../../formComponent/ReactSelect";
import Input from "../../formComponent/Input";
import BrowseButton from "../../formComponent/BrowseButton";
import Tables from ".";
import { queryResultTHEAD } from "../../modalComponent/Utils/HealperThead";
import { headers } from "../../../utils/apitools";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import axios from "axios";
import { toast } from "react-toastify";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";
const AddResultQueryModal = () => {
  const [editMode, setEditMode] = useState(false);
  const [query, setQuery] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    Query: "",
    Result: "",
    DocumentType: "",
    SelectFile: "",
    Document_Base64: "",
    FileExtension: "",
    IsActive: "",
  });

  const handleImageChange = (e) => {
    const file = e?.target?.files[0];

    if (file) {
      // Check if file size exceeds 5MB (5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size exceeds 5MB. Please choose a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader?.result.split(",")[1];
        const fileExtension = file?.name.split(".").pop();
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

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
    // setTableData([...tableData, formData]);
  };
  const searchHandleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleSave = () => {
    if (formData?.Query == "") {
      toast.error("Please Select Query.");
    } else if (formData?.Result == "") {
      toast.error("Please Select Result.");
    } else {
    
      axiosInstances
      .post(apiUrls.Result_Insert, {
        ID: useCryptoLocalStorage("user_Data", "get", "ID"),
        LoginName: useCryptoLocalStorage("user_Data", "get", "realname"),
        QueryID: formData?.Query,
        Result: formData?.Result,
        Document_Base64: formData?.Document_Base64 ? formData?.Document_Base64 : "",
        Document_FormatType: formData?.FileExtension ? formData?.FileExtension : "",  


      })
          .then((res) => {
            toast.success(res?.data?.message);
          })
          .catch((err) => {
            console.log(err);
          });
    }
  };
  const handleUpdate = () => {
   
    axiosInstances
      .post(apiUrls.Result_Update, {
        ID: useCryptoLocalStorage("user_Data", "get", "ID"),
        LoginName: useCryptoLocalStorage("user_Data", "get", "realname"),
        QueryID: formData?.Query,
        Result: formData?.Result,
        // ResultID: "",
        IsActive: formData?.IsActive,
        Document_Base64: formData?.Document_Base64,
        Document_FormatType: formData?.FileExtension,
      })
        .then((res) => {
          toast.success(res?.data?.message);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const handleEdit = (ele) => {
    setFormData({
      ...formData,
      Query: ele?.QueryID,
      Result: ele?.Result,
      ID: ele?.QueryID,
    });
    setEditMode(true);
  };

  const getQueryName = () => {
   
    
    axiosInstances
      .post(apiUrls.QueryVsResult_Select, {
        ID: useCryptoLocalStorage("user_Data", "get", "ID"),  
        LoginName: useCryptoLocalStorage("user_Data", "get", "realname"),
        // IsActive: "",
        SearchType: "Query_Select",

      })
        .then((res) => {
          console.log(res?.data?.data);
          const assigntos = res?.data.data.map((item) => {
            return { label: item?.Query, value: item?.ID };
          });
          setQuery(assigntos);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const getQuery = () => {
    
      axiosInstances
      .post(apiUrls.QueryVsResult_Select, {
        ID: useCryptoLocalStorage("user_Data", "get", "ID"),  
        LoginName: useCryptoLocalStorage("user_Data", "get", "realname"),
        // IsActive: "",
        SearchType: "Query_Select",
          
      })
        .then((res) => {
          console.log(res?.data?.data);
          setTableData(res?.data?.data);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  useEffect(() => {
    getQuery();
    getQueryName();
  }, []);
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
  return (
    <>
      <div className="card">
        <div className="row g-4 m-2">
          <ReactSelect
            respclass="col-md-4 col-sm-6 col-12"
            name="Query"
            placeholderName="Query"
            dynamicOptions={query}
            className="Query"
            handleChange={handleDeliveryChange}
            value={formData.Query}
            requiredClassName={"required-fields"}
          />
          <Input
            type="text"
            className="form-control required-fields"
            id="Result"
            name="Result"
            lable="Result"
            placeholder=" "
            max={20}
            onChange={searchHandleChange}
            value={formData?.Result}
            respclass="col-md-4 col-sm-4 col-12"
          />

          <BrowseButton handleImageChange={handleImageChange} />
          {editMode && (
            <div className="search-col" style={{ marginLeft: "8px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label className="switch" style={{ marginTop: "7px" }}>
                  <input
                    type="checkbox"
                    name="IsActive"
                    checked={formData?.IsActive == "1" ? true : false}
                    onChange={searchHandleChange}
                  />
                  <span className="slider"></span>
                </label>
                <span
                  style={{
                    marginLeft: "3px",
                    marginRight: "5px",
                    fontSize: "12px",
                  }}
                >
                  Active
                </span>
              </div>
            </div>
          )}
          {/* <div className="col-2 d-flex"> */}
          {editMode ? (
            <button
              className="btn btn-sm btn-success ml-3"
              onClick={handleUpdate}
            >
              Update
            </button>
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
      {/* </div> */}
      <div className="card mt-2">
        <Tables
          thead={queryResultTHEAD}
          tbody={currentData?.map((ele, index) => ({
            "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
            "Query Name": ele?.Query,
            Result: ele?.Result,
            CreatedBy: ele?.ResultCreatedBy,
            Action: (
              <i
                className="fa fa-edit"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleEdit(ele);
                }}
              ></i>
            ),
            "View Docs": ele?.FileName !== "" && (
              <i
                className="fa fa-eye"
                style={{ cursor: "pointer" }}
                onClick={() => window.open(ele?.FileUrl, "_blank")}
              ></i>
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
    </>
  );
};

export default AddResultQueryModal;
