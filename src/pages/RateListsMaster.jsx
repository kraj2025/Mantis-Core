import React, { useEffect, useState } from "react";
import Input from "../components/formComponent/Input";
import Tables from "../components/UI/customTable";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import ReactSelect from "../components/formComponent/ReactSelect";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import { useTranslation } from "react-i18next";
import Heading from "../components/UI/Heading";

const RateListsMaster = ({ data }) => {
  const [editMode, setEditMode] = useState(false);
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    Items: "",
    DiscountAmount: "",
    GrossAmount: "",
    NetAmount: "",
    // IsCurrent: "",
    RateListID: "",
    ProjectId: "",
    ProjectName: "",
  });
  const [tableData, setTableData] = useState([]);

  const ratelistTHEAD = [
    "S.No.",
    "Item Name",
    "Project Name",
    "Gross Amount",
    "Discount Amount",
    "Net Amount",
    // "Entry Date",
    "CreatedBy",
    "Created Date",
    // "UpdatedBy",
    // "IsCurrent",
    "Edit",
  ];

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
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  //   const handleSelectChange = (e) => {
  //   const { name, value } = e.target;

  //   let updatedData = {
  //     ...formData,
  //     [name]: value,
  //   };

  //   const gross = parseFloat(updatedData.GrossAmount) || 0;
  //   const discount = parseFloat(updatedData.DiscountAmount) || 0;
  //   const net = gross - (gross * discount) / 100;

  //   updatedData.NetAmount = net.toFixed(2);

  //   setFormData(updatedData);
  // };

  const handleGetItemSearch = (value) => {
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      form.append(
        "RoleID",
        useCryptoLocalStorage("user_Data", "get", "RoleID")
      ),
      form.append(
        "LoginName",
        useCryptoLocalStorage("user_Data", "get", "realname")
      ),
      form.append("ProjectID", data?.Id),
      form.append("ItemID", ""),
      form.append("ItemName", ""),
      form.append("SearchType", "GetItem"),
      axios
        .post(apiUrls?.Payement_Installment_Select, form, { headers })
        .then((res) => {
          const poc3s = res?.data.data.map((item) => {
            return { label: item?.ItemNameGroup, value: item?.ItemIDGroup };
          });
          setItems(poc3s);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  function getlabel(id, dropdownData) {
    const ele = dropdownData?.filter((item) => item?.value === id);
    return ele?.length > 0 ? ele[0].label : undefined;
  }
  const handleSave = () => {
    if (!formData?.Items) {
      toast.error("Please Select Items.");
      return;
    }
    if (!formData?.GrossAmount) {
      toast.error("Please Enter Gross Amount.");
      return;
    }
    if (!formData?.DiscountAmount) {
      toast.error("Please Enter Discount Amount.");
      return;
    }
    if (!formData?.NetAmount) {
      toast.error("Please Enter Net Amount.");
      return;
    }
    setLoading(true);
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      form.append(
        "LoginName",
        useCryptoLocalStorage("user_Data", "get", "realname")
      ),
      form.append("ProjectID", data?.Id),
      form.append("ProjectName", data?.NAME),
      form.append("ItemID", formData?.Items),
      form.append("ItemName", getlabel(formData?.Items, items)),
      form.append("GrossAmt", formData?.GrossAmount),
      form.append("DiscAmt", formData?.DiscountAmount),
      form.append("NetAmt", formData?.NetAmount),
      // form.append("IsCurrent", formData?.IsCurrent == 1 ? "1" : "0"),
      axios
        .post(apiUrls?.ProjectRateListSave, form, { headers })
        .then((res) => {
          if (res.data.status === true) {
            toast.success(res.data.message);
            handleSearch();
            setLoading(false);
          } else {
            toast.error(res.data.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const handleUpdate = () => {
    if (!formData?.Items) {
      toast.error("Please Select Items.");
      return;
    }
    if (!formData?.GrossAmount) {
      toast.error("Please Enter Gross Amount.");
      return;
    }
    if (!formData?.DiscountAmount) {
      toast.error("Please Enter Discount Amount.");
      return;
    }
    if (!formData?.NetAmount) {
      toast.error("Please Enter Net Amount.");
      return;
    }
    setLoading(true);
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      form.append(
        "LoginName",
        useCryptoLocalStorage("user_Data", "get", "realname")
      ),
      form.append("ProjectID", formData?.ProjectId),
      form.append("ProjectName", formData?.ProjectName),
      form.append("ItemID", formData?.Items),
      form.append("ItemName", getlabel(formData?.Items, items)),
      form.append("GrossAmt", formData?.GrossAmount),
      form.append("DiscAmt", formData?.DiscountAmount),
      form.append("NetAmt", formData?.NetAmount),
      // form.append("IsCurrent", formData?.IsCurrent == 1 ? "1" : "0"),
      form.append("RateListID", formData?.RateListID),
      axios
        .post(apiUrls?.ProjectRateListUpdate, form, { headers })
        .then((res) => {
          if (res.data.status === true) {
            toast.success(res.data.message);
            handleSearch();
            setEditMode(false);
            setLoading(false);
            setFormData({
              ...formData,
              Items: "",
              DiscountAmount: "",
              GrossAmount: "",
              NetAmount: "",
              // IsCurrent: "",
              RateListID: "",
            });
          } else {
            toast.error(res.data.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const handleSearch = () => {
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      form.append(
        "LoginName",
        useCryptoLocalStorage("user_Data", "get", "realname")
      ),
      form.append("ProjectID", data?.Id),
      axios
        .post(apiUrls?.SearchProjectRateList, form, { headers })
        .then((res) => {
          setTableData(res?.data?.data);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const handleRateEdit = (ele) => {
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      form.append(
        "LoginName",
        useCryptoLocalStorage("user_Data", "get", "realname")
      ),
      form.append("ProjectID", ele?.ProjectID),
      form.append("ItemID", ele?.ItemID),
      axios
        .post(apiUrls?.EditProjectRateList, form, { headers })
        .then((res) => {
          const data = res.data.data;
          setFormData({
            ...formData,
            Items: data[0]?.ItemID,
            DiscountAmount: data[0]?.DiscAmt,
            GrossAmount: data[0]?.GrossAmt,
            NetAmount: data[0]?.NetAmt,
            // IsCurrent: data[0]?.IsCurrent,
            RateListID: data[0]?.ID,
            ProjectName: data[0]?.ProjectName,
            ProjectId: data[0]?.ProjectID,
          });
          setEditMode(true);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  useEffect(() => {
    handleGetItemSearch();
    handleSearch();
  }, []);
  return (
    <>
      <div className="card  p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {data?.NAME || data?.ProjectName}
        </span>
      </div>
      <div className="card">
        <Heading
          title={<span style={{ fontWeight: "bold" }}>Create Rate List</span>}
        />
        <div className="row p-2">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Items"
            placeholderName="Item"
            dynamicOptions={items}
            className="Items"
            handleChange={handleDeliveryChange}
            value={formData.Items}
            isDisabled={editMode === true}
          />
          <Input
            type="text"
            className="form-control"
            id="GrossAmount"
            name="GrossAmount"
            lable="Gross Amount"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.GrossAmount}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="DiscountAmount"
            name="DiscountAmount"
            lable="Discount Amount"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.DiscountAmount}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="NetAmount"
            name="NetAmount"
            lable="Net Amount"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.NetAmount}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          {/* <div className="search-col" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="IsCurrent"
                  checked={formData?.IsCurrent ? 1 : 0}
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
                {t("IsCurrent")}
              </span>
            </div>
          </div> */}
          {loading ? (
            <Loading />
          ) : (
            <div className="col-2">
              {editMode ? (
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={handleSave}
                >
                  Save
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card mt-2">
          <Heading
            title={
              <span style={{ fontWeight: "bold" }}>Rate List Details</span>
            }
          />
          <Tables
            thead={ratelistTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              "Item Name": ele?.ItemName,
              "Project Name": ele?.ProjectName,
              "Gross Amount": ele?.GrossAmt,
              "Discount Amount": ele?.DiscAmt,
              "Net Amount": ele?.NetAmt,
              // "Entry Date": ele?.EntryDate,
              CreatedBy: ele?.CreatedBy,
              "Created Date": ele?.EntryDate,
              // UpdatedBy: ele?.UpdatedBy,
              // IsCurrent: ele?.IsCurrent == 1 ? "Active" : false,
              Edit: (
                <i
                  className="fa fa-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRateEdit(ele)}
                ></i>
              ),
            }))}
            tableHeight={"tableHeight"}
          />
          <div className="pagination ml-auto" style={{ float: "right" }}>
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

export default RateListsMaster;
