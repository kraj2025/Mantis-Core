import React, { useEffect, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";
import ReactSelect from "../components/formComponent/ReactSelect";
import Input from "../components/formComponent/Input";
import { inputBoxValidation } from "../utils/utils";
import {
  GST_VALIDATION_REGX,
  PANCARD_VALIDATION_REGX,
} from "../utils/constant";
import Tables from "../components/UI/customTable";
import Tooltip from "./Tooltip";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

const BillingDetailModal = ({ data }) => {
  console.log(data);
  const [project, setProject] = useState([]);
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    Project: "",
    BillingCompnayName: "",
    Address: "",
    State: "",
    GST: "",
    PanCardNo: "",
    BillingID: "",
    IsActive: "",
  });
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }
  const getState = () => {
    axiosInstances
      .post(apiUrls?.GetState, { CountryID: "14" })
      .then((res) => {
        const states = res?.data.data.map((item) => {
          return { label: item?.StateName, value: item?.StateID };
        });
        setState(states);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const shortenName = (name) => {
    return name.length > 15 ? name.substring(0, 25) + "..." : name;
  };
  const getProject = () => {
    axiosInstances
      .post(apiUrls?.ProjectSelect, {
        ProjectID: 0,
        IsMaster: "",
        VerticalID: 0,
        TeamID: 0,
        WingID: 0,
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.Project, value: item?.ProjectId };
        });
        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSave = () => {
    if (formData?.Project == "") {
      toast.error("Please Select Project.");
    } else if (formData?.BillingCompnayName == "") {
      toast.error("Please Enter BillingCompanyName.");
    } else if (formData?.Address == "") {
      toast.error("Please Enter BillingAddress.");
    } else if (formData?.State == "") {
      toast.error("Please Select State.");
    } else if (formData?.GST == "") {
      toast.error("Please Enter GST.");
    } else {
      const payload = {
        ProjectID: Number(formData?.Project),
        BillingCompanyName: String(formData?.BillingCompnayName),
        BillingAddress: String(formData?.Address),
        GSTNo: String(formData?.GST),
        PanCardNo: String(formData?.PanCardNo),
        StateID: Number(formData?.State),
        State: String(getlabel(formData?.State, state)),
      };

      axiosInstances
        .post(apiUrls?.CreateBilling, payload)
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            handleSearch();
            setFormData({
              ...formData,
              Project: "",
              BillingCompnayName: "",
              Address: "",
              State: "",
              GST: "",
              PanCardNo: "",
              BillingID: "",
              IsActive: "",
            });
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleUpdate = () => {
    const payload = {
      ProjectID: Number(formData?.Project),
      BillingCompanyName: String(formData?.BillingCompnayName),
      BillingId: Number(formData?.BillingID),
      BillingAddress: String(formData?.Address),
      GSTNo: String(formData?.GST),
      PanCardNo: String(formData?.PanCardNo),
      StateID: Number(formData?.State),
      State: String(getlabel(formData?.State, state)),
      IsActive: String(formData?.IsActive), 
    };

    axiosInstances
      .post(apiUrls?.UpdateBilling, payload)
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleSearch();
          setEditMode(false);
          setFormData({
            ...formData,
            Project: "",
            BillingCompnayName: "",
            Address: "",
            State: "",
            GST: "",
            PanCardNo: "",
            BillingID: "",
            IsActive: "",
          });
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProject();
    getState();
  }, []);
  const handleBillingEdit = (ele) => {
    // console.log("editdetails", ele);
    setFormData({
      ...formData,
      Project: ele?.ProjectID,
      BillingCompnayName: ele?.BillingCompanyName,
      Address: ele?.BillingAddress,
      State: ele?.StateID,
      GST: ele?.GSTNo,
      PanCardNo: ele?.PanCardNo,
      BillingID: ele?.BillingID,
      IsActive: ele?.IsActive,
    });
    setEditMode(true);
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
  const centreTHEAD = [
    "S.No.",
    "BillingCompanyName",
    "BillingAddress",
    "State",
    "GSTNo",
    "PanCardNo",
    "Edit",
  ];
  const handleSearch = () => {
    axiosInstances
      .post(apiUrls?.BillingCompany_Select, {
        ProjectID: Number(data?.Id || data?.ProjectID),
        IsActive: "1",
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCheckBox = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };
  useEffect(() => {
    handleSearch();
  }, []);
  return (
    <>
      <div className="card  p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {data?.NAME || data?.ProjectName}
        </span>
      </div>
      <div className="card p-2">
        <div className="row">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Project"
            placeholderName="Project"
            dynamicOptions={project}
            value={formData?.Project}
            handleChange={handleDeliveryChange}
            //   requiredClassName={"required-fields"}
          />
          <Input
            type="text"
            className="form-control"
            id="BillingCompnayName"
            name="BillingCompnayName"
            lable="Billing Compnay Name"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.BillingCompnayName}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="Address"
            name="Address"
            lable="Billing Address"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.Address}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-12 col-sm-12"
            name="State"
            placeholderName="State"
            dynamicOptions={state}
            handleChange={handleDeliveryChange}
            value={formData.State}
          />
          <Input
            type="text"
            className="form-control"
            id="GST"
            name="GST"
            lable="GST"
            placeholder=" "
            onChange={(e) => {
              inputBoxValidation(GST_VALIDATION_REGX, e, handleSelectChange);
            }}
            value={formData?.GST}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            className="form-control"
            id="PanCardNo"
            name="PanCardNo"
            lable="PanCard"
            placeholder=" "
            onChange={(e) => {
              inputBoxValidation(
                PANCARD_VALIDATION_REGX,
                e,
                handleSelectChange
              );
            }}
            value={formData?.PanCardNo}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          {editMode && (
            <div className="search-col" style={{ marginLeft: "8px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label className="switch" style={{ marginTop: "7px" }}>
                  <input
                    type="checkbox"
                    name="IsActive"
                    checked={formData?.IsActive ? 1 : 0}
                    onChange={handleCheckBox}
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
                Create
              </button>
            )}
          </div>
        </div>
      </div>

      {tableData?.length > 0 && (
        <div className="card mt-2">
          <div className="row m-2">
            <Tables
              thead={centreTHEAD}
              tbody={currentData?.map((ele, index) => ({
                "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
                BillingCompanyName: (
                  <Tooltip label={ele?.BillingCompanyName}>
                    <span
                      id={`projectName-${index}`}
                      targrt={`projectName-${index}`}
                      style={{ textAlign: "center" }}
                    >
                      {shortenName(ele?.BillingCompanyName)}
                    </span>
                  </Tooltip>
                ),
                BillingAddress: (
                  <Tooltip label={ele?.BillingAddress}>
                    <span
                      id={`projectName-${index}`}
                      targrt={`projectName-${index}`}
                      style={{ textAlign: "center" }}
                    >
                      {shortenName(ele?.BillingAddress)}
                    </span>
                  </Tooltip>
                ),
                State: ele?.State,
                GSTNo: ele?.GSTNo,
                PanCardNo: ele?.PanCardNo,
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
        </div>
      )}
    </>
  );
};

export default BillingDetailModal;
