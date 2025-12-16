import React, { useEffect, useState } from "react";
import ReactSelect from "../../components/formComponent/ReactSelect";
import Input from "../../components/formComponent/Input";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";
import Tables from "../../components/UI/customTable";
import Loading from "../../components/loader/Loading";
import { Fade } from "react-bootstrap";
import Heading from "../../components/UI/Heading";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";

const NewFileMaster = () => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [menuMaster, setMenuMaster] = useState([]);
  const [formData, setFormData] = useState({
    MenuName: "",
    DisplayName: "",
    URL: "",
    IsActive: "",
    UrlID: "",
  });
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name == "MenuName") {
      setFormData({
        ...formData,
        [name]: value,
      });
      bindTableData(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const bindMenu = () => {
    axiosInstances
      .post(apiUrls.SearchMenu, {
        MenuName: String(""),
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.MenuName, value: item?.ID };
        });
        setMenuMaster(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const newFileTHEAD = ["S.No.", "Display Name", "Url Name", "Status", "Edit"];
  const handleSave = () => {
    axiosInstances
      .post(apiUrls.CreateFile, {
        MenuID: Number(formData?.MenuName),
        URLName: String(formData?.URL),
        DispName: String(formData?.DisplayName),
        Description: String(),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = () => {
    axiosInstances
      .post(apiUrls.UpdateFile, {
        MenuID: Number(formData?.MenuName),
        URLName: String(formData?.URL),
        URLID: Number(formData?.UrlID),
        DispName: String(formData?.DisplayName),
        Description: String(),
        ActiveStatus: Number(formData?.IsActive),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBillingEdit = (ele) => {
    setFormData({
      ...formData,
      MenuName: ele?.MenuID,
      DisplayName: ele?.DispName,
      URL: ele?.URLName,
      IsActive: ele?.Active,
      MenuID: ele?.MenuID,
      UrlID: ele?.UrlID,
    });
    setEditMode(true);
  };
  const bindTableData = (menuID) => {
    axiosInstances
      .post(apiUrls.SearchFile, {
        MenuID: Number(menuID),
        DispName: String(formData?.DisplayName),
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
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
  useEffect(() => {
    bindMenu();
  }, []);
  return (
    <>
      <div className="row m-2">
        <ReactSelect
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          name="MenuName"
          placeholderName="Menu Name"
          dynamicOptions={menuMaster}
          handleChange={handleDeliveryChange}
          value={formData.MenuName}
        />
        <Input
          type="text"
          className="form-control"
          id="DisplayName"
          name="DisplayName"
          lable="Display Name"
          onChange={handleSelectChange}
          value={formData?.DisplayName}
          respclass="col-xl-4 col-md-4 col-12 col-sm-12"
        />
        <Input
          type="text"
          className="form-control"
          id="URL"
          name="URL"
          lable="URL Name"
          onChange={handleSelectChange}
          value={formData?.URL}
          respclass="col-xl-4 col-md-4 col-12 col-sm-12"
        />
        {editMode && (
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
        )}
        {loading ? (
          <Loading />
        ) : (
          <div className="">
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
        )}
      </div>
      {currentData?.length > 0 && (
        <>
          <div className="card">
            <Heading title={"Search Details"} />
            <Tables
              thead={newFileTHEAD}
              tbody={currentData?.map((ele, index) => ({
                "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
                "Display Name": ele?.DispName,
                "Url Name": ele?.URLName,
                Status: ele?.Active ? "Active" : "DeActive",
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
          </div>{" "}
        </>
      )}
    </>
  );
};

export default NewFileMaster;
