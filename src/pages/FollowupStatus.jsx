import React, { useEffect, useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";
import DatePicker from "../components/formComponent/DatePicker";
import Input from "../components/formComponent/Input";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";
import Loading from "../components/loader/Loading";
import Tables from "../components/UI/customTable";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import Heading from "../components/UI/Heading";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import { axiosInstances } from "../networkServices/axiosInstance";

const FollowupStatus = (visible) => {
  // console.log("visible visible", visible);
  // const tabledatasale=[visible?.data]
  const [loading, setLoading] = useState(false);
  const [assignto, setAssignedto] = useState([]);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [tableData, setTableData] = useState([]);
  const [followup, setFollowUp] = useState([]);
  const [salesID, setSalesID] = useState([]);
  const [formData, setFormData] = useState({
    FollowUpType: "",
    SalesID: visible?.data?.ID,
    LockingDate: new Date(),
    Remark: visible?.data?.Remark ? visible?.data?.Remark : "",
    PaymentStatus: "",
    IsNextFollowupReq: "",
    AssignTo: "",
    dtNextFollowup: "",
    ExpectedPaymentDate: new Date(),
  });
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const searchHandleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handlePaymentFollowup = () => {
    axiosInstances
      .post(apiUrls.PaymentFollowup, {
  "ActionType": "FollowupReason",
  "FollowupHeadID": 0,
  "FolloupHead": "",
  "dtFollowup": "",
  "IsNextFollowupReq": true,
  "dtNextFollowup": "",
  "Remark": "",
  "SalesID": 0,
  "PINo": "",
  "HelpingHandID": 0,
  "HelpingHand": "",
  "IsClose": true,
  "PaymentStatus": "",
  "ProjectID": 0,
  "FollowupID": 0,
  "ExpectedPaymentDate": ""
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ActionType", "FollowupReason"),
    //   axios
    //     .post(apiUrls?.PaymentFollowup, form, { headers })
        .then((res) => {
          const poc3s = res?.data?.data?.map((item) => {
            return { label: item?.NAME, value: item?.ID };
          });
          setFollowUp(poc3s);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const handlePaymentFollowupClose = (id) => {
    axiosInstances
      .post(apiUrls.PaymentFollowup, {
  "ActionType": "Close",
  "FollowupHeadID": 0,
  "FolloupHead": "",
  "dtFollowup": "",
  "IsNextFollowupReq": true,
  "dtNextFollowup": "",
  "Remark": "",
  "SalesID": 0,
  "PINo": "",
  "HelpingHandID": 0,
  "HelpingHand": "",
  "IsClose": true,
  "PaymentStatus": "",
  "ProjectID": 0,
  "FollowupID": Number(id),
  "ExpectedPaymentDate": ""
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("FollowupID", id),
    //   form.append("ActionType", "Close"),
    //   axios
    //     .post(apiUrls?.PaymentFollowup, form, { headers })
        .then((res) => {
          if (res?.data?.status === true) {
            toast.success(res?.data?.messge);
            handlePaymentFollowupSearch();
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const handlePaymentFollowupSearch = () => {
    axiosInstances
      .post(apiUrls.PaymentFollowup, {
  "ActionType": "FollowupSearch",
  "FollowupHeadID": 0,
  "FolloupHead": "",
  "dtFollowup": "",
  "IsNextFollowupReq": true,
  "dtNextFollowup": "",
  "Remark": "",
  "SalesID": Number(visible?.data?.ID),
  "PINo": "",
  "HelpingHandID": 0,
  "HelpingHand": "",
  "IsClose": true,
  "PaymentStatus": "",
  "ProjectID": Number(visible?.data?.ProjectID),
  "FollowupID": 0,
  "ExpectedPaymentDate": ""
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ProjectID", visible?.data?.ProjectID),
    //   form.append("SalesID", visible?.data?.ID),
    //   form.append("ActionType", "FollowupSearch"),
    //   axios
    //     .post(apiUrls?.PaymentFollowup, form, { headers })
        .then((res) => {
          setTableData(res?.data?.data);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const handlePaymentFollowupSave = () => {
    if (!formData?.FollowUpType) {
      toast.error("Please Select FollowupType.");
    } else if (!formData?.PaymentStatus) {
      toast.error("Please Enter PaymentStatus.");
    } else {
      setLoading(true);
const payload = {
  ActionType: "Insert",
  FollowupHeadID: Number(formData?.FollowUpType) || 0,
  FolloupHead: getlabel(formData?.FollowUpType, followup) || "",
  dtFollowup: formData?.LockingDate
    ? moment(formData?.LockingDate).toISOString()
    : null,
  IsNextFollowupReq: formData?.IsNextFollowupReq == 1,
  dtNextFollowup:
    formData?.dtNextFollowup && formData?.dtNextFollowup !== ""
      ? moment(formData?.dtNextFollowup).toISOString()
      : "2001-01-01T00:00:00.000Z",
  Remark: formData?.Remark || "",
  SalesID: Number(visible?.data?.ID) || 0,
  PINo: visible?.data?.PINo || "",
  HelpingHandID: 0,
  HelpingHand: "",
  IsClose: false, // you can control this depending on logic
  PaymentStatus: formData?.PaymentStatus || "",
  ProjectID: Number(visible?.data?.ProjectID) || 0,
  FollowupID: 0,
  ExpectedPaymentDate: formData?.ExpectedPaymentDate
    ? moment(formData?.ExpectedPaymentDate).toISOString()
    : null,
};

      axiosInstances
      .post(apiUrls.PaymentFollowup, payload)
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("ProjectID", visible?.data?.ProjectID),
      //   form.append("FollowupHeadID", formData?.FollowUpType),
      //   form.append("FolloupHead", getlabel(formData?.FollowUpType, followup)),
      //   form.append(
      //     "dtFollowup",
      //     moment(formData?.LockingDate).format("YYYY-MM-DD")
      //   ),
      //   form.append("Remark", formData?.Remark),
      //   form.append("SalesID", visible?.data?.ID),
      //   form.append("PINo", visible?.data?.PINo),
      //   form.append("PaymentStatus", formData?.PaymentStatus),
      //   form.append(
      //     "IsNextFollowupReq",
      //     formData?.IsNextFollowupReq == 1 ? 1 : 0
      //   ),
      //   form.append(
      //     "dtNextFollowup",
      //     formData?.dtNextFollowup == ""
      //       ? "2001-01-01"
      //       : moment(formData?.dtNextFollowup).format("YYYY-MM-DD")
      //   ),
      //   form.append(
      //     "ExpectedPaymentDate",
      //     moment(formData?.ExpectedPaymentDate).format("YYYY-MM-DD") || ""
      //   ),
      //   form.append("HelpingHandID", "0"),
      //   form.append("HelpingHand", ""),
      //   form.append("ActionType", "Insert"),
      //   axios
      //     .post(apiUrls?.PaymentFollowup, form, { headers })
          .then((res) => {
            if (res?.data?.success === true) {
              toast.success(res?.data?.message);
              handlePaymentFollowupSearch();
              setLoading(false);
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
  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }
  const handleCheckBox = (e) => {
    const { name, checked, type } = e?.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : prevData[name],
      ...(name === "IsNextFollowupReq" && !checked
        ? { AssignTo: "", dtNextFollowup: "" }
        : {}),
    }));
  };
  // const handleCheckBox = (e) => {
  //   const { name, value, checked, type } = e?.target;
  //   setFormData({
  //     ...formData,
  //     [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
  //   });
  // };
  // const getAssignTo = () => {
  //   let form = new FormData();
  //   form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
  //     axios
  //       .post("/CRMAPI/API/MasterBind/AssignTo_Select", form, { headers })
  //       .then((res) => {
  //         const assigntos = res?.data.data.map((item) => {
  //           return { label: item?.NAME, value: item?.ID };
  //         });
  //         setAssignedto(assigntos);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  // };

  const followupTHEAD = [
    "S.No.",
    "Followup",
    "CreateBy",
    "Followup Date",
    "Next Followup Date",
    "Expected Payment Date",
    "Payment Status",
    "Status",
    "Action",
  ];
  useEffect(() => {
    handlePaymentFollowup();
    handlePaymentFollowupSearch();
    // getAssignTo();
  }, []);
  return (
    <>
      <div className="card p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name :&nbsp;{visible?.data?.ProjectName}
        </span>
      </div>
      <div className="card">
        <div className="row m-2">
          {/* <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="SalesID"
            placeholderName="SalesID"
            dynamicOptions={visible?.data?.ID}
            className="SalesID"
            handleChange={handleDeliveryChange}
            value={formData.SalesID}
          /> */}

          <Input
            type="text"
            className="form-control"
            id="SalesID"
            name="SalesID"
            lable="SalesID"
            placeholder=" "
            onChange={searchHandleChange}
            value={formData?.SalesID}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 "
            disabled
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="FollowUpType"
            placeholderName="FollowUpType"
            dynamicOptions={followup}
            className="FollowUpType"
            handleChange={handleDeliveryChange}
            value={formData.FollowUpType}
            requiredClassName={"required-fields"}
          />
          <DatePicker
            className="custom-calendar"
            id="LockingDate"
            name="LockingDate"
            lable="Followup Date"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.LockingDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="Remark"
            name="Remark"
            lable="Remark"
            placeholder=" "
            onChange={searchHandleChange}
            value={formData?.Remark}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 "
          />
          <Input
            type="text"
            className="form-control required-fields"
            id="PaymentStatus"
            name="PaymentStatus"
            lable="Payment Status"
            placeholder=" "
            onChange={searchHandleChange}
            value={formData?.PaymentStatus}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 "
          />
          <DatePicker
            className="custom-calendar"
            id="ExpectedPaymentDate"
            name="ExpectedPaymentDate"
            lable="Expected Payment Date"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.ExpectedPaymentDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-0"
            handleChange={searchHandleChange}
          />
          <div className="search-col" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="IsNextFollowupReq"
                  checked={formData?.IsNextFollowupReq ? 1 : 0}
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
                IsNextFollowupReq
              </span>
            </div>
          </div>
          {formData?.IsNextFollowupReq == "1" ? (
            <>
              {/* <ReactSelect
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="AssignTo"
                placeholderName="AssignTo"
                dynamicOptions={assignto}
                className="Employee"
                handleChange={handleDeliveryChange}
                value={formData.AssignTo}
              /> */}
              <DatePicker
                className="custom-calendar"
                id="dtNextFollowup"
                name="dtNextFollowup"
                lable="Next Followup Date"
                placeholder={VITE_DATE_FORMAT}
                value={formData?.dtNextFollowup}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2"
                handleChange={searchHandleChange}
              />
              {/* <DatePicker
                className="custom-calendar"
                id="ExpectedPaymentDate"
                name="ExpectedPaymentDate"
                lable="Expected Payment Date"
                placeholder={VITE_DATE_FORMAT}
                value={formData?.ExpectedPaymentDate}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2"
                handleChange={searchHandleChange}
              /> */}
            </>
          ) : (
            ""
          )}
          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-primary ml-3 mt-2"
              onClick={handlePaymentFollowupSave}
            >
              Save
            </button>
          )}
        </div>
      </div>
      {tableData?.length > 0 ? (
      <div className="card mt-2">
        <Heading title={"Search Details"} />
        <Tables
          thead={followupTHEAD}
          tbody={tableData?.map((ele, index) => ({
            "S.No.": index + 1,
            Followup: ele?.FolloupHead,
            CreateBy: ele?.CreatedBy,
            "Followup Date": ele?.dtFollowup,
            "Next Followup Date":
              ele?.dtNextFollowup == "01-Jan-2001" ? "" : ele?.dtNextFollowup,
            "Expected Payment Date": ele?.ExpectedPaymentDate,
            PaymentStatus: ele?.PaymentStatus,
            Status: ele?.IsClose == 0 ? "Active" : "DeActive",
            Action: ele?.IsClose == 0 && (
              <button
                className="btn btn-sm btn-danger"
                style={{
                  color: "white",
                  backgroundColor: "red",
                  borderColor: "red !important",
                  border: "none",
                }}
                // disabled={ele?.IsClose == 1}
                onClick={() => handlePaymentFollowupClose(ele?.ID)}
              >
                Close
              </button>
            ),
            // Edit: (
            //   <i
            //     className="fa fa-edit"
            //     style={{ cursor: "pointer" }}
            //     onClick={() => handleBillingEdit(ele)}
            //   ></i>
            // ),
          }))}
          tableHeight={"tableHeight"}
        />
      </div>
     ):<NoRecordFound />} 
    </>
  );
};
export default FollowupStatus;
