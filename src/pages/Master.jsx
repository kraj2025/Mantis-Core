import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import Input from "../components/formComponent/Input";
import ReactSelect from "../components/formComponent/ReactSelect";
import Tables from "../components/UI/customTable";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import axios from "axios";
import Loading from "../components/loader/Loading";
import { toast } from "react-toastify";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const Master = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [mastertype, setMasterType] = useState([]);
  const [formData, setFormData] = useState({
    MasterType: "",
    MasterName: "",
    IsActive: "",
    MasterHeadID: "",
    MasterID: "",
  });
  const searchHandleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
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
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
    handleMasterTypeSearch(value);
  };
  const handleMasterTypeSearch = (id) => {
 
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ActionType", "MasterSearch"),
    //   form.append("MasterHeadID", id || formData?.MasterType),
    //   form.append("MasterName", ""),
    //   form.append("IsActive", ""),
    // axios
    //   .post(apiUrls?.ManageGlobalMaster, form, { headers })
    const payload = {
      ActionType: "MasterSearch",
      MasterHeadID: Number(id || formData?.MasterType),
      MasterName: "",
      MasterHeadName: "",
      IsActive: Boolean(1),
    };
    axiosInstances
      .post(apiUrls?.ManageGlobalMaster, payload)
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getMasterType = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ActionType", "MasterHeadSearch"),
    //   form.append("MasterHeadName", ""),
    //   form.append("IsActive", ""),
    // axios
    //   .post(apiUrls?.ManageGlobalMaster, form, { headers })
    // const payload = {
    //   ActionType: "MasterHeadSearch",
    //   MasterHeadName: "",
    //   IsActive: "",
    // };

    const payload = {
      ActionType: "MasterHeadSearch",
      MasterHeadID: 0,
      MasterName: "",
      MasterHeadName: "",
    };

    axiosInstances
      .post(apiUrls?.ManageGlobalMaster, payload)
      .then((res) => {
        console.log("res ", res);
        const verticals = res?.data?.data?.map((item) => {
          return { label: item?.NAME, value: item?.Id };
        });
        setMasterType(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getMasterType();
  }, []);
  const masterTypeTHEAD = [
    "S.No.",
    "Master Type",
    "Name",
    "CreateBy",
    "Create Date",
    "Last UpdateBy",
    "Last Update Date",
    "Status",
    "Edit",
  ];

  function getlabel(id, dropdownData) {
    const ele = dropdownData?.filter((item) => item?.value === id);
    return ele?.length > 0 ? ele[0].label : "";
  }
  const handleMasterTypeSave = () => {
    if (formData?.MasterName == "") {
      toast.error("Please Enter Master Name.");
    } else if (formData?.MasterType == "") {
      toast.error("Please Select MasterType");
    } else {
      setLoading(true);
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("ActionType", "MasterInsert"),
      //   form.append(
      //     "MasterHeadName",
      //     getlabel(formData?.MasterType, mastertype)
      //   ),
      //   form.append("MasterHeadID", formData?.MasterType),
      //   form.append("MasterName", formData?.MasterName),
      // form.append("IsActive", formData?.IsActive === 1 ? 1 : 0),
      // axios
      //   .post(apiUrls?.ManageGlobalMaster, form, { headers })
      const payload = {
        ActionType: "MasterInsert",
        MasterHeadName: getlabel(formData?.MasterType, mastertype),
        MasterHeadID: formData?.MasterType,
        MasterName: formData?.MasterName,
      };
      axiosInstances
        .post(apiUrls?.ManageGlobalMaster, payload)
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setLoading(false);
            setFormData({ ...formData, MasterName: "" });
            handleMasterTypeSearch();
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  console.log("formDatass",formData)
  const handleMasterTypeUpdate = () => {
    setLoading(true);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ActionType", "MasterUpdate"),
    //   form.append("MasterHeadName", getlabel(formData?.MasterType, mastertype)),
    //   form.append("MasterHeadID", formData?.MasterHeadID),
    //   form.append("MasterID", formData?.MasterID),
    //   form.append("MasterName", formData?.MasterName),
    //   form.append("IsActive", formData?.IsActive === 1 ? 1 : 0),
    const payload = {
      ActionType: "MasterUpdate",
      MasterHeadName: getlabel(formData?.MasterType, mastertype),
      MasterHeadID: formData?.MasterHeadID,
      MasterID: formData?.MasterID,
      MasterName: formData?.MasterName,
      IsActive: Boolean(formData?.IsActive === 1 ? 1 : 0,)
    };

    // axios
    //   .post(apiUrls?.ManageGlobalMaster, form, { headers })
    axiosInstances
      .post(apiUrls?.ManageGlobalMaster, payload)
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          // setFormData({ ...formData, MasterName: "", MasterType: "" });
          setEditMode(false);
          handleMasterTypeSearch();
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
  const handleBillingEdit = (ele) => {
    console.log("ele elel ", ele);
    setFormData({
      ...formData,
      MasterName: ele?.NAME,
      MasterType: ele?.MasterTypeID,
      IsActive: ele?.IsActive,
      MasterHeadID: ele?.MasterTypeID,
      MasterID: ele?.Id,
    });
    setEditMode(true);
  };
  return (
    <>
      <div className="card">
        <Heading title={<span style={{ fontWeight: "bold" }}>Master</span>} />
        <div className="row m-2">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="MasterType"
            placeholderName="MasterType"
            dynamicOptions={mastertype}
            className="Employee"
            handleChange={handleDeliveryChange}
            value={formData.MasterType}
          />
          <Input
            type="text"
            className="form-control"
            id="MasterName"
            name="MasterName"
            lable="MasterName"
            placeholder=" "
            onChange={searchHandleChange}
            value={formData?.MasterName}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 "
          />
          {editMode && (
            <div className="search-col" style={{ marginLeft: "8px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label className="switch" style={{ marginTop: "7px" }}>
                  <input
                    type="checkbox"
                    name="IsActive"
                    checked={formData?.IsActive ? 1 : 0}
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
                  IsActive
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
                  onClick={handleMasterTypeUpdate}
                >
                  Update
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={handleMasterTypeSave}
                >
                  Save
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card">
          <Heading title={"Search Details"} />
          <Tables
            thead={masterTypeTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              "Master Type": ele?.MasterType,
              Name: ele?.NAME,
              CreateBy: ele?.CreatedBy,
              "Create Date": ele?.dtEntry,
              "Last UpdateBy": ele?.UpdatedBy,
              "Last Update Date": ele?.Updatedate,
              Status: ele?.IsActive ? "Active" : "DeActive",
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
      )}
    </>
  );
};
export default Master;
