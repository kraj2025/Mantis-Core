import React, { useEffect, useState } from "react";
import ReactSelect from "../../formComponent/ReactSelect";
import axios from "axios";
import { headers } from "../../../utils/apitools";
import Input from "../../formComponent/Input";
import Heading from "../Heading";
import Tables from ".";
import { designationTHEAD } from "../../modalComponent/Utils/HealperThead";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";
const AddDesignationModal = () => {
  const [designation, setDesignation] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    Designation: "",
    IsActive: "",
  });
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  const getCreateDesignation = () => {
  
    axiosInstances
      .post(apiUrls.CreateDesignation, {
        DesignationName: String(formData?.Designation),
      })
      .then((res) => {
        toast.success(res?.data?.message);
        getViewDesignation();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getViewDesignation = () => {

    axiosInstances
      .post(apiUrls.ViewDesignation, {})
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getUpdateDesignation = (ele) => {
    console.log(ele);
    setFormData({
      ...formData,
      Designation: ele?.DesignationName,
      IsActive: ele?.IsActive,
      ID: ele?.ID,
    });
  };

  const handleUpdateDesignation = () => {
 
    axiosInstances
      .post(apiUrls.UpdateDesignation, {
        DesignationName: String(formData?.Designation),
        DesignationID: String(formData?.ID),
        IsActive: Number(formData?.IsActive ? formData?.IsActive : "0"),
      })
      .then((res) => {
        toast.success(res?.data?.message);
        getViewDesignation();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
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
  useEffect(() => {
    getViewDesignation();
  }, []);
  return (
    <>
      <div className="card ViewIssues border p-3">
        <div className="row g-4">
          <Input
            type="text"
            className="form-control"
            id="Designation"
            name="Designation"
            lable="Designation Name"
            placeholder=" "
            max={20}
            onChange={handleSelectChange}
            value={formData?.Designation}
            respclass="col-md-6 col-12 col-sm-12"
          />

          <div className="search-col" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="IsActive"
                  checked={formData?.IsActive == "1" ? true : false}
                  onChange={handleSelectChange}
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
          <div className="col-2">
            {formData?.ID ? (
              <button
                className="btn btn-sm btn-info ml-2"
                onClick={handleUpdateDesignation}
              >
                Update
              </button>
            ) : (
              <button
                className="btn btn-sm btn-info ml-2"
                onClick={getCreateDesignation}
              >
                Create
              </button>
            )}
          </div>
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card patient_registration_card mt-3 my-2">
          <Heading title="Search Details" />
          <Tables
            thead={designationTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              "Designation Name": ele?.DesignationName,
              // "Action": ele?.IsActive,
              Edit: (
                <Link
                  style={{ cursor: "pointer" }}
                  onClick={() => getUpdateDesignation(ele)}
                >
                  Edit
                </Link>
              ),
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
export default AddDesignationModal;
