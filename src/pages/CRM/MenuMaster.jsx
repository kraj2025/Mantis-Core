import React, { useEffect, useState } from "react";
import Input from "../../components/formComponent/Input";
import Heading from "../../components/UI/Heading";
import Tables from "../../components/UI/customTable";
import { menumasterTHEAD } from "../../components/modalComponent/Utils/HealperThead";

import { apiUrls } from "../../networkServices/apiEndpoints";

import { toast } from "react-toastify";
import { axiosInstances } from "../../networkServices/axiosInstance";

const MenuMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    MenuName: "",
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
      MenuName: ele?.MenuName,
      IsActive: ele?.Active,
    });
    setEditMode(true);
  };
  const handleSave = () => {
    // setLoading(true);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("MenuName", formData?.MenuName),
    //   form.append("ActiveStatus", formData?.IsActive),
    //   axios
    //     .post(apiUrls?.CreateMenu, form, { headers })
    axiosInstances
      .post(apiUrls.CreateMenu, {
        MenuName: String(formData?.MenuName),
        ActiveStatus: Number(formData?.IsActive),
      })
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
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("MenuName", formData?.MenuName),
    //   form.append("ActiveStatus", formData?.IsActive),
    //   form.append("MenuID", tableData[0]?.ID),
    //   axios
    //     .post(apiUrls?.UpdateMenu, form, { headers })
    axiosInstances
      .post(apiUrls.UpdateMenu, {
        MenuID: Number(tableData[0]?.ID),
        MenuName: String(formData?.MenuName),
        ActiveStatus: Number(formData?.IsActive),
      })
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
  const handleTableData = () => {
    setLoading(true);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("MenuName", ""),
    //   form.append("ActiveStatus", "2"),
    //   axios
    //     .post(apiUrls?.SearchMenu, form, { headers })
    axiosInstances
      .post(apiUrls.SearchMenu, {
        MenuName: "",
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
  useEffect(() => {
    handleTableData();
  }, []);
  return (
    <>
      <div className="row m-2">
        <Input
          type="text"
          className="form-control"
          id="MenuName"
          name="MenuName"
          lable="Menu Name"
          onChange={handleSelectChange}
          value={formData?.MenuName}
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
          {editMode ? (
            <button className="btn btn-sm btn-info ml-2" onClick={handleUpdate}>
              Update
            </button>
          ) : (
            <button className="btn btn-sm btn-info ml-2" onClick={handleSave}>
              Save
            </button>
          )}
        </div>
      </div>
      <div className="card">
        <Heading title={"Seacrh Details"} />
        <Tables
          thead={menumasterTHEAD}
          tbody={currentData?.map((ele, index) => ({
            "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
            "Menu Name": ele?.MenuName,
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
export default MenuMaster;
