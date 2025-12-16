import React, { useEffect, useState } from "react";
import Input from "../../components/formComponent/Input";
import Heading from "../../components/UI/Heading";
import Tables from "../../components/UI/customTable";
import { rolemasterTHEAD } from "../../components/modalComponent/Utils/HealperThead";
import { Link } from "react-router-dom";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../../src/utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";
const RoleMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    RoleName: "",
    IsActive: "",
  });
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
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
  const [editMode, setEditMode] = useState(false);
  const handleBillingEdit = (ele) => {
    console.log("editdetails", ele);
    setFormData({
      ...formData,
      RoleName: ele?.RoleName,
      IsActive: ele?.Active,
    });
    setEditMode(true);
  };

  const handleSave = () => {
    setLoading(true);
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      form.append(
        "LoginName",
        useCryptoLocalStorage("user_Data", "get", "realname")
      ),
      form.append("RoleName", formData?.RoleName),
      form.append("ActiveStatus", formData?.IsActive),
      axios
        .post(apiUrls?.CreateRole, form, { headers })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoading(false);
          handleTableData();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
  };

  const handleUpdate = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.UpdateRole, {
        RoleID: Number(tableData[0]?.ID),
        RoleName: String(formData?.RoleName),
        ActiveStatus: formData?.IsActive == "1" ? true : false,
      })
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          handleTableData();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleTableData = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.SearchRole, {
        RoleName: String(),
      })
      .then((res) => {
        setTableData(res?.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleEmployeeView = (ele) => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.EmployeeView, {
        RoleID: Number(ele?.ID),
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  // useEffect(() => {
  //   if (tableData.length > 0 && tableData[0]?.ID) {
  //     handleEmployeeView();
  //   }
  // }, [tableData]);
  useEffect(() => {
    handleTableData();
  }, []);
  return (
    <>
      <div className="row m-2">
        <Input
          type="text"
          className="form-control"
          id="RoleName"
          name="RoleName"
          lable="Role Name"
          onChange={handleSelectChange}
          value={formData?.RoleName}
          respclass="col-md-4 col-12 col-sm-12"
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
          <div className="col-2">
            {editMode ? (
              <button
                className="btn btn-sm btn-info ml-2"
                onClick={handleUpdate}
              >
                Update
              </button>
            ) : (
              <button className="btn btn-sm btn-info ml-2" onClick={handleSave}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="card">
        <Heading title={"Seacrh Details"} />
        <Tables
          thead={rolemasterTHEAD}
          tbody={currentData?.map((ele, index) => ({
            "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
            "Role Name": ele?.RoleName,
            Status: ele?.Active == 1 ? "Active" : "De-Active",
            View: (
              <i
                className="fa fa-eye"
                style={{ cursor: "pointer" }}
                onClick={() => handleEmployeeView(ele)}
              ></i>
            ),
            Edit: (
              <i
                className="fa fa-edit"
                style={{ cursor: "pointer" }}
                onClick={() => handleBillingEdit(ele)}
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
export default RoleMaster;
