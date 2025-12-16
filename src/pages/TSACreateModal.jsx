import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { apiUrls } from "../networkServices/apiEndpoints";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import axios from "axios";
import { headers } from "../utils/apitools";
import { useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";
import DatePicker from "../components/formComponent/DatePicker";
import Input from "../components/formComponent/Input";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Loading from "../components/loader/Loading";
import TextEditor from "../components/formComponent/TextEditor";
import Heading from "../components/UI/Heading";
import PrimeTextEditor from "../components/formComponent/PrimeTextEditor";
import { axiosInstances } from "../networkServices/axiosInstance";

const TSACreateModal = (showData) => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [acctype, setAmcType] = useState([]);
  const [project, setProject] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    AmcType: "",
    AMC_Start_Date: "",
    AMC_Start_Month: "",
    AMC_Installment: "",
    AMC_Amount: "",
    AMCPercent: "",
    ProjectID: "",
    FromDate: new Date(),
    ToDate: new Date(),
    DateType: "0",
    Description: "",
  });
  const [rowHandler, setRowHandler] = useState({
    TextEditorShow: false,
    ButtonShow: false,
  });
  const editRef = useRef("");

  const handleToggle = () => {
    setRowHandler((prev) => ({
      TextEditorShow: !prev.TextEditorShow,
      ButtonShow: !prev.ButtonShow,
    }));
  };
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };
  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name === "ProjectID") {
      setFormData({
        ...formData,
        [name]: value,
        AmcType: "",
        AMC_Start_Date: "",
        AMC_Start_Month: "",
        AMC_Installment: "",
        AMC_Amount: "",
        FromDate: new Date(),
        ToDate: new Date(),
      });
      getProjectTSA(value);
    } else if (name === "ChangeFormat") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const getAMCTYPE = () => {
    let form = new FormData();
    // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   axios
    //     .post(apiUrls?.AMCType_Select, form, { headers })
    axiosInstances
      .post(apiUrls?.AMCType_Select, {})
      .then((res) => {
        const verticals = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setAmcType(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProjectTSA = (value) => {
    // let form = new FormData();
    // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ProjectID", value),
    // axios
    //   .post(apiUrls?.ProjectVsAMCMapping, form, { headers })
    axiosInstances
      .post(apiUrls?.ProjectVsAMCMapping, { ProjectID: Number(value) })
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          AmcType: res?.data?.data[0]?.AMCID,
          AMC_Start_Month: res?.data?.data[0]?.AMCStartmonth,
          AMC_Amount: res?.data?.data[0]?.AMCAmount,
          FromDate: new Date(res?.data?.data[0]?.AMC_StartDate?.Value),
          ToDate: new Date(res?.data?.data[0]?.AMCToDate),
          ProjectID: res?.data?.data[0]?.ProjectID,
          ProjectName: res?.data?.data[0]?.ProjectName,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getHtmlConvert = () => {
    // let form = new FormData();
    // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   axios
    //     .post(apiUrls?.Tsa_Agreement_Format, form, { headers })
    axiosInstances
      .post(apiUrls?.Tsa_Agreement_Format, {})
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProject = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   axios
    //     .post(apiUrls?.ProjectSelect, form, { headers })
    axiosInstances
      .post(apiUrls?.ProjectSelect, {
        ProjectID: 0,
        IsMaster: "",
        VerticalID: 0,
        TeamID: 0,
        WingID: 0,
      })
      .then((res) => {
        const datas = res?.data.data;
        const poc3s = datas.map((item) => {
          return { label: item?.Project, value: item?.ProjectId };
        });
        setProject(poc3s);
        //   if (datas.length > 0) {
        //     const singleProject = datas[0]?.ProjectId;
        //     setFormData((prev) => ({
        //       ...prev,
        //       ProjectID: singleProject,
        //     }));
        //   }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function getlabel(id, dropdownData) {
    const ele = dropdownData?.filter((item) => item?.value === id);
    return ele?.length > 0 ? ele[0].label : undefined;
  }

  const handleConfirm = () => {
    setLoading(true);
    // let form = new FormData();
    // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   );
    // form.append("Email", useCryptoLocalStorage("user_Data", "get", "EmailId"));
    // form.append("ProjectID", formData?.ProjectID);
    // form.append("AMCID", "0");
    // form.append("AMC", "TSA");
    // // form.append("AMCID", formData?.AmcType);
    // // form.append("AMC", getlabel(formData?.AmcType, acctype));
    // form.append(
    //   "AMCStartDate",
    //   moment(formData?.FromDate).format("YYYY-MM-DD")
    // );
    // form.append("AMCToDate", moment(formData?.ToDate).format("YYYY-MM-DD"));
    // form.append("AMCStartMonth", formData?.AMC_Start_Month);
    // form.append("AMCAmount", formData?.AMC_Amount);
    // form.append("IsEdited", formData?.DateType);
    // const updatedHTML = editRef?.current?.innerHTML;
    // console.log("updatedHTML", updatedHTML);
    // form.append("AgreementHTML", updatedHTML);
    // axios
    //   .post(apiUrls?.CreateTechnicalSupportAgreement, form, { headers })
    const payload = {
      Email: String(useCryptoLocalStorage("user_Data", "get", "EmailId") || ""),
      ProjectID: String(formData?.ProjectID || 0),

      // If AMC details are static → use fixed values
      AMCID: String(formData?.AmcType || 0), // or "0" if fixed
      AMC: String(getlabel(formData?.AmcType, acctype) || "TSA"),

      // Dates in YYYY-MM-DD
      AMCStartDate: moment(formData?.FromDate).isValid()
        ? moment(formData?.FromDate).format("YYYY-MM-DD")
        : "",
      AMCToDate: moment(formData?.ToDate).isValid()
        ? moment(formData?.ToDate).format("YYYY-MM-DD")
        : "",

      AMCStartMonth: String(formData?.AMC_Start_Month || ""),
      AMCAmount: String(formData?.AMC_Amount || 0),
      IsEdited: String(formData?.DateType || false),

      AgreementHTML: String(editRef?.current?.innerHTML || ""),
    };

    axiosInstances
      .post(apiUrls?.CreateTechnicalSupportAgreement, payload)
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          showData?.setVisible(false);
          showData.handleSearch();
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const searchSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (tableData[0]?.AgreementHTML) {
      setFormData((prev) => ({
        ...prev,
        Description: tableData[0].AgreementHTML,
      }));
    }
  }, [tableData]);
  const handleChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      Description: value,
    }));
  };

  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }
  const handleRun = () => {
    // let form = new FormData();
    // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ProjectID", formData?.ProjectID),
    //   form.append("ProjectName", getlabel(formData?.ProjectID, project));
    // form.append("AgreementHTML", formData?.Description);
    // axios
    //   .post(apiUrls?.Change_Tsa_Agreement_Format, form, { headers })
    const payload = {
      ProjectID: Number(formData?.ProjectID || 0),
      ProjectName: String(getlabel(formData?.ProjectID, project) || ""),
      AgreementHTML: String(formData?.Description || ""),
    };

    axiosInstances
      .post(apiUrls?.Change_Tsa_Agreement_Format, payload)
      .then((res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAMCTYPE();
    getProject();
    getHtmlConvert();
  }, []);
  return (
    <>
      <div className="card ">
        <Heading
          title={<span style={{ fontWeight: "bold" }}>TSA Create Details</span>}
        />
        <div className="row p-1">
          <ReactSelect
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            name="ProjectID"
            placeholderName={t("Project")}
            dynamicOptions={project}
            value={formData?.ProjectID}
            handleChange={handleDeliveryChange}
          />
          {/* <ReactSelect
            name="AmcType"
            respclass="col-xl-3 col-md-4 col-sm-6 col-12 "
            placeholderName="AMC Type"
            dynamicOptions={acctype}
            value={formData?.AmcType}
            handleChange={handleDeliveryChange}
          /> */}
          {/* <DatePicker
            className="custom-calendar"
            id="AMC_Start_Date"
            name="AMC_Start_Date"
            lable="AMC Start Date"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.AMC_Start_Date}
            respclass="col-xl-3 col-md-4 col-sm-6 col-12 mt-1"
            handleChange={handleSelectChange}
          /> */}
          {/* <Input
            type="number"
            className="form-control "
            id="AMC_Start_Month"
            name="AMC_Start_Month"
            lable="AMC Start Month"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.AMC_Start_Month}
            respclass="col-xl-3 col-md-4 col-sm-4 col-12 "
          /> */}
          <DatePicker
            className="custom-calendar"
            id="FromDate"
            name="FromDate"
            lable={t("From Date")}
            placeholder={VITE_DATE_FORMAT}
            value={formData?.FromDate}
            respclass="col-xl-3 col-md-4 col-sm-6 col-12 mt-1"
            handleChange={searchHandleChange}
            requiredClassName={"required-fields"}
          />
          <DatePicker
            className="custom-calendar"
            id="ToDate"
            name="ToDate"
            lable={t("To Date")}
            placeholder={VITE_DATE_FORMAT}
            value={formData?.ToDate}
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          <Input
            type="number"
            className="form-control "
            id="AMC_Amount"
            name="AMC_Amount"
            lable="AMC Amount"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.AMC_Amount}
            respclass="col-xl-3 col-md-4 col-sm-4 col-12 "
          />
          {/* <Input
            type="number"
            className="form-control "
            id="AMCPercent"
            name="AMCPercent"
            lable="AMC %"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.AMCPercent}
            respclass="col-xl-4 col-md-4 col-sm-4 col-12 mt-1"
          /> */}
          <ReactSelect
            respclass="col-xl-3 col-md-4 col-sm-4 col-12"
            name="DateType"
            placeholderName="Format Type"
            dynamicOptions={[
              { label: "Default", value: "0" },
              { label: "ChangeFormat", value: "1" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.DateType}
          />

          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-success ml-2 "
              onClick={handleConfirm}
            >
              Create
            </button>
          )}
        </div>
      </div>

      {formData?.DateType == "1" && (
        <div className="card mt-2">
          {/* <Heading
            title={
              <span style={{ fontWeight: "bold" }}>
                Agreement Change Details
              </span>
            }
          /> */}
          <div className="row p-2 d-none">
            <ReactSelect
              respclass="col-xl-3 col-md-4 col-sm-4 col-12"
              name="DateType"
              placeholderName="SelectType"
              dynamicOptions={[
                { label: "Default", value: "1" },
                { label: "ChangeFormat", value: "2" },
              ]}
              handleChange={handleDeliveryChange}
              value={formData.DateType}
            />
          </div>
          {formData?.DateType == "1" && formData?.ProjectID && (
            <div className="card">
              {/* <Heading
              title={
                <span style={{ fontWeight: "bold" }}>
                  TSA Agreement Convert Details
                </span>
              }
            /> */}
              <div className="row p-2">
                <div className="col-sm-6 d-none">
                  <Heading
                    title={
                      <span style={{ fontWeight: "bold" }}>
                        TSA Agreement Html Details
                      </span>
                    }
                    secondTitle={
                      <span
                        style={{
                          width: "25px",
                          height: "10px",
                          padding: "2px",
                          background: "green",
                          color: "white",
                          borderRadius: "2px",
                          cursor: "pointer",
                        }}
                        onClick={handleRun}
                      >
                        Change Agreement
                      </span>
                    }
                  />
                  <textarea
                    placeholder=""
                    id="Description"
                    name="Description"
                    value={formData.Description}
                    onChange={searchSelectChange}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  ></textarea>
                </div>
                <div className="col-sm-12">
                  <Heading
                    title={
                      <span style={{ fontWeight: "bold" }}>
                        TSA Agreement Convert Details
                      </span>
                    }
                    secondTitle={
                      <div className="d-flex justifycontent-spacebetween">
                        <button
                          className="btn btn-sm mt-2 btn-primary"
                          onClick={handleToggle}
                          title="Click to Edit"
                        >
                          {!rowHandler.ButtonShow ? "Edit" : "Preview"}
                        </button>
                        {/* <span
                          style={{
                            width: "25px",
                            height: "10px",
                            padding: "2px",
                            background: "green",
                            color: "white",
                            borderRadius: "2px",
                            cursor: "pointer",
                          }}
                          onClick={handleRun}
                        >
                          Change Agreement
                        </span> */}
                      </div>
                    }
                  />
                  <div
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      minHeight: "100%",
                      width: "100%",
                      backgroundColor: "#f9f9f9",
                    }}
                    ref={editRef}
                    contentEditable={rowHandler?.ButtonShow}
                    dangerouslySetInnerHTML={{
                      __html: formData.Description || "",
                    }}
                  />
                  {/* {!rowHandler?.ButtonShow ? (
                  ) : (
                    <div className="col-12">
                      <PrimeTextEditor
                        value={formData?.Description}
                        onChange={handleChange}
                      />
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TSACreateModal;
