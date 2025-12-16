import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import ReactSelect from "../components/formComponent/ReactSelect";
import Input from "../components/formComponent/Input";
import ReportTimePicker from "./CRM/ReportTimePicker";
import ReportDatePicker from "./CRM/ReportDatePicker";
import DatePicker from "../components/formComponent/DatePicker";
import TimePicker from "./CRM/TimePicker";
import TextEditor from "../components/formComponent/TextEditor";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { useTranslation } from "react-i18next";
import { axiosInstances } from "../../src/networkServices/axiosInstance";
const Circular = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [circular, setCircular] = useState([]);
  const [assignto, setAssignedto] = useState([]);
  const [roleMaster, setRoleMaster] = useState([]);
  const [circularto, setCircularTo] = useState([]);
  const today = new Date();
  const [formData, setFormData] = useState({
    Circular: "",
    CircularTo: [],
    Subject: "",
    DocumentNo: "",
    FromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    ToDate: new Date(),
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
    Description: "",
    AssignedTo: [],
    RoleMaster: "0",
  });

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name == "RoleMaster") {
      setFormData({
        ...formData,
        [name]: value,
      });
      getCircularTo(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const bindRole = () => {
    axiosInstances
      .post(apiUrls.SearchRole, {
        RoleName: "",
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.RoleName, value: item?.ID };
        });
        setRoleMaster(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };
  const searchHandleChange = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };

  const getCircularTo = () => {
    axiosInstances
      .post(apiUrls.Circular_UserList, {
        Type: String("To"),
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { name: item?.RealName, code: item?.Id };
        });
        setCircularTo(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [rowHandler, setRowHandler] = useState({
    SummaryShow: false,
    DateSubmittedShow: false,
    TextEditorShow: false,
  });
  const handleDeliveryButton2 = () => {
    setRowHandler({
      ...rowHandler,
      TextEditorShow: !rowHandler?.TextEditorShow,
    });
  };
  function removeHtmlTags(text) {
    return text?.replace(/<[^>]*>?/gm, "");
  }
  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
  const saveCircular = () => {
    if (formData?.Subject === "") {
      toast.error("Please Enter Subject.");
    } else if (formData?.Description === "") {
      toast.error("Please Enter Message.");
    } else {
      setLoading(true);

      const payload = {
        RoleID:
          Number(useCryptoLocalStorage("user_Data", "get", "RoleID")) || 0,
        Message: formData?.Description,
        Subject: formData?.Subject,
        DtFrom: formatDate(formData?.FromDate),
        DtTo: formatDate(formData?.ToDate),
        ToRoleIDs: "", // change if you later allow multiple role IDs
        ToIDs: Array.isArray(formData?.CircularTo)
          ? formData?.CircularTo.join(",")
          : formData?.CircularTo || "",
        DocumentNo: formData?.DocumentNo || "",
        AttachmentData: "", // set base64 file data if needed later
      };

      // axiosInstances
      //   .post(apiUrls?.SaveCircular, payload, { headers })
      axiosInstances
        .post(apiUrls.SaveCircular, {
          ...payload,
        })
        .then((res) => {
          toast.success(res?.data?.message || "Circular saved successfully!");

          setFormData({
            RoleMaster: formData?.RoleMaster, // keep default RoleID from localStorage
            CircularTo: [], // empty list after save
            Subject: "",
            DocumentNo: "",
            FromDate: new Date(),
            ToDate: new Date(),
            FromTime: new Date(today.setHours(0, 0, 0, 0)),
            ToTime: new Date(today.setHours(23, 59, 59, 999)),
            Description: "",
          });

          setLoading(false);
        })
        .catch((err) => {
          console.error("SaveCircular Error:", err);
          toast.error("Something went wrong while saving Circular!");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    getCircularTo();
    bindRole();
  }, []);
  return (
    <>
      <div className="card">
        <Heading
          title={"Circular"}
          isBreadcrumb={true}
          secondTitle={
            <div style={{ fontWeight: "bold" }}>
              <Link to="/CircularSearch">Back to List</Link>
            </div>
          }
        />
        <div className="row g-4 m-2">
          <Input
            type="text"
            className="form-control required-fields"
            id="Subject"
            name="Subject"
            lable="Subject"
            onChange={handleSelectChange}
            value={formData?.Subject}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="DocumentNo"
            name="DocumentNo"
            lable="DocumentNo"
            onChange={handleSelectChange}
            value={formData?.DocumentNo}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <DatePicker
            className="custom-calendar"
            id="FromDate"
            name="FromDate"
            lable="From Date"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.FromDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          <TimePicker
            className="custom-calendar"
            id="FromTime"
            name="FromTime"
            lable="From Time"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.FromTime}
            respclass="col-xl-1 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          <DatePicker
            className="custom-calendar"
            id="ToDate"
            name="ToDate"
            lable="To Date"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.ToDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          <TimePicker
            className="custom-calendar"
            id="ToTime"
            name="ToTime"
            lable="To Time"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.ToTime}
            respclass="col-xl-1 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="RoleMaster"
            placeholderName="Role"
            dynamicOptions={[{ label: "All", value: "0" }, ...roleMaster]}
            handleChange={handleDeliveryChange}
            value={formData.RoleMaster}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="CircularTo"
            placeholderName="CircularTo"
            dynamicOptions={circularto}
            handleChange={handleMultiSelectChange}
            value={formData?.CircularTo?.map((code) => ({
              code,
              name: circularto.find((item) => item.code === code)?.name,
            }))}
          />

          <div className="ml-2" style={{ display: "flex" }}>
            <div style={{ width: "40%", marginRight: "0px" }}>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleDeliveryButton2}
              >
                Message
              </button>
            </div>
          </div>

          {rowHandler?.TextEditorShow && (
            <div className="col-12">
              <TextEditor
                value={formData?.Description}
                onChange={(value) =>
                  setFormData({ ...formData, Description: value })
                }
              />
              {/* <CKEditor initData={''} onChange={(value) => setFormData({...formData,'Description':value})}  /> */}
            </div>
          )}

          {loading ? (
            <Loading />
          ) : (
            <div className="ml-4">
              <button className="btn btn-sm btn-success" onClick={saveCircular}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Circular;
