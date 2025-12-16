import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import Input from "../components/formComponent/Input";
import Tables from "../components/UI/customTable";
import { toast } from "react-toastify";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import axios from "axios";
import Loading from "../components/loader/Loading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const MasterType = () => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    MasterName: "",
    IsActive: "",
  });
  const searchHandleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
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

  const masterTypeTHEAD = [
    "S.No.",
    "Master Type",
    "CreateBy",
    "Create Date",
    "Last UpdateBy",
    "Last Update Date",
    "Status",
    "Edit",
  ];
  const handleMasterTypeSave = () => {
    if (formData?.MasterName == "") {
      toast.error("Please Enter Master Name.");
    } else {
      setLoading(true);
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("ActionType", "MasterHeadInsert"),
      //   form.append("MasterHeadName", formData?.MasterName),
      // form.append("IsActive", formData?.IsActive === 1 ? 1 : 0),
      // axios
      //   .post(apiUrls?.ManageGlobalMaster, form, { headers })
      const payload = {
        ActionType: "MasterHeadInsert",
        MasterHeadName: formData?.MasterName || "",
        MasterHeadID: Number("0"),
        IsActive: Boolean(formData?.IsActive === 1 ? 1 : 0),
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
  const handleMasterTypeUpdate = () => {
    setLoading(true);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ActionType", "MasterHeadUpdate"),
    //   form.append("MasterHeadName", formData?.MasterName),
    //   form.append("MasterHeadID", formData?.MasterHeadID),
    //   form.append("IsActive", formData?.IsActive === 1 ? 1 : 0),
    // axios
    //   .post(apiUrls?.ManageGlobalMaster, form, { headers })
    const payload = {
      ActionType: "MasterHeadUpdate",
      MasterHeadName: String(formData?.MasterName) || "",
      MasterHeadID: Number(formData?.MasterHeadID) || 0,
      IsActive: Boolean(formData?.IsActive === 1 ? 1 : 0),
    };

    axiosInstances
      .post(apiUrls?.ManageGlobalMaster, payload)
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          setFormData({ ...formData, MasterName: "" });
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

  const handleMasterTypeSearch = () => {
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
    const payload = {
      ActionType: "MasterHeadSearch",
      MasterHeadName: "",
      MasterHeadID: 0,
      // IsActive: Boolean(1),
    };
    axiosInstances
      .post(apiUrls?.ManageGlobalMaster, payload)
      .then((res) => {
        setTableData(res?.data?.data);
        setFilteredData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    handleMasterTypeSearch();
  }, []);
  const handleBillingEdit = (ele) => {
    console.log("testing ", ele);
    setFormData({
      ...formData,
      MasterName: ele?.NAME,
      IsActive: ele?.IsActive,
      MasterHeadID: ele?.Id,
    });
    setEditMode(true);
  };

  const handleSearchTable = (event) => {
    const query = event.target.value.trim().toLowerCase(); // Trim spaces
    setSearchQuery(query);

    if (query === "") {
      // Reset table data to original
      setTableData(filteredData);
    } else {
      const filtered = filteredData?.filter((item) =>
        Object.keys(item).some(
          (key) => item[key] && String(item[key]).toLowerCase().includes(query)
        )
      );

      // console.log("Filtered Data:", filtered);
      setTableData(filtered);
    }
    setCurrentPage(1);
  };
  return (
    <>
      <div className="card">
        <Heading
          title={<span style={{ fontWeight: "bold" }}>Master Type</span>}
        />
        <div className="row m-2">
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
          <Heading
            title={"Search Details"}
            secondTitle={
              <div className="d-flex">
                <div style={{ padding: "0px !important", marginLeft: "10px" }}>
                  <Input
                    type="text"
                    className="form-control"
                    id="Title"
                    name="Title"
                    lable="Search By MasterType"
                    placeholder=" "
                    onChange={handleSearchTable}
                    value={searchQuery}
                    respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                  />
                </div>
              </div>
            }
          />
          <Tables
            thead={masterTypeTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              "Master Type": ele?.NAME,
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
export default MasterType;
