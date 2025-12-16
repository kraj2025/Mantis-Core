import React, { useEffect, useState } from "react";
import Input from "../../formComponent/Input";
import Tables from ".";
import { querySaveTHEAD } from "../../modalComponent/Utils/HealperThead";
import ReactSelect from "../../formComponent/ReactSelect";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import axios from "axios";
import { headers } from "../../../utils/apitools";
import { toast } from "react-toastify";
import BrowseButton from "../../formComponent/BrowseButton";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";

const SaveQueryMasterModal = () => {
  const [editMode, setEditMode] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [product, setProduct] = useState([]);
  const [modules, setModules] = useState([]);
  const [formData, setFormData] = useState({
    QueryName: "",
    IsActive: "",
    Product: "",
    Module: "",
    DocumentType: "",
    SelectFile: "",
    Document_Base64: "",
    FileExtension: "",
  });
  const searchHandleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleGet = () => {
    axiosInstances
      .post(apiUrls.QueryVsResult_Select, {
        SearchType: String(formData.DocumentType),
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }
  const handleSave = () => {
    const payload = {
      Query: formData?.QueryName || "",
      ProductID: Number(formData?.Product) || 0,
      ProductName: getlabel(formData?.Product, product) || "",
      ModuleID: Number(formData?.Module) || 0,
      ModuleName: getlabel(formData?.Module, modules) || "",
      Document_Base64: formData?.Document_Base64 || "",
      Document_FormatType: formData?.FileExtension || "",
    };
    axiosInstances
      .post(apiUrls.Query_Insert, payload)
      .then((res) => {
        toast.success(res?.data?.message);
        setFormData({
          QueryName: "",
          IsActive: "",
          Product: "",
          Module: "",
          DocumentType: "",
          SelectFile: "",
          Document_Base64: "",
          FileExtension: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = () => {
    axiosInstances
      .post(apiUrls.Query_Update, {
        Query: String(formData?.QueryName),
        QueryID: String(formData?.ID),
        ProductID: String(formData?.Product),
        ProductName: String(getlabel(formData?.Product, product)),
        ModuleID: String(formData?.Module),
        ModuleName: String(getlabel(formData?.Module, modules)),
        IsActive: formData?.IsActive,
      })
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    console.log(value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getProduct = () => {
    axiosInstances
      .post(apiUrls.GetProductVersion, {})
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.id };
        });
        setProduct(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getModules = () => {
    axiosInstances
      .post(apiUrls.GetClientModuleList, {})
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { label: item?.ModuleName, value: item?.ID };
        });
        setModules(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEdit = (ele) => {
    setFormData({
      ...formData,
      Status: ele?.IsActive,
      ID: ele?.ID,
      QueryName: ele?.Query,
      IsActive: ele?.IsActive,
      Product: ele?.ProductID,
      Module: ele?.ModuleID,
      FileName: ele?.FileName,
    });
    setEditMode(true);
  };
  useEffect(() => {
    getModules();
    getProduct();
    handleGet();
  }, []);

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
            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
            name="Product"
            placeholderName="Product"
            dynamicOptions={product}
            value={formData?.Product}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
          />
          <ReactSelect
            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
            name="Module"
            placeholderName="Module"
            dynamicOptions={modules}
            value={formData?.Module}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
          />
          <Input
            type="text"
            className="form-control required-fields"
            id="QueryName"
            name="QueryName"
            lable="Query Name"
            placeholder=" "
            max={20}
            onChange={searchHandleChange}
            value={formData?.QueryName}
            respclass="col-md-4 col-sm-4 col-12"
          />
          <div className="col-2">
            <BrowseButton
              style={{ marginLeft: "10px" }}
              handleImageChange={handleImageChange}
            />
          </div>
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

          <div className="col-2">
            {editMode ? (
              <button
                className="btn btn-sm btn-success ml-1"
                onClick={handleUpdate}
              >
                Update
              </button>
            ) : (
              <button
                className="btn btn-sm btn-success ml-1"
                onClick={handleSave}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="card mt-2">
        <Tables
          thead={querySaveTHEAD}
          tbody={currentData?.map((ele, index) => ({
            "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
            "Product Name": ele?.ProductName,
            "Module Name": ele?.ModuleName,
            "Query Name": ele?.Query,
            CreatedBy: ele?.CreatedBy,
            Status: ele?.IsActive == 1 ? "Active" : "De-Active",
            Action: (
              <i
                className="fa fa-edit"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleEdit(ele);
                }}
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

export default SaveQueryMasterModal;
