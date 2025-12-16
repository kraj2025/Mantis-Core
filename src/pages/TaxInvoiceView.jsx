import React, { useEffect, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import axios from "axios";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import Input from "../components/formComponent/Input";
import DatePicker from "../components/formComponent/DatePicker";
import ReactSelect from "../components/formComponent/ReactSelect";
import { Link } from "react-router-dom";
import Heading from "../components/UI/Heading";
import Tables from "../components/UI/customTable";
import { TaxsearchTHEAD } from "../components/modalComponent/Utils/HealperThead";
import Modal from "../components/modalComponent/Modal";
import ApproveTaxInvoiceModal from "./CRM/ApproveTaxInvoiceModal";
import AcceptTaxInvoiceModal from "./CRM/AcceptTaxInvoiceModal";
import UploadTaxInvoiceModal from "./CRM/UploadTaxInvoiceModal";
import EmailTaxInvoiceModal from "./CRM/EmailTaxInvoiceModal";
import { PageSize } from "../utils/constant";
import { toast } from "react-toastify";
import Tooltip from "./Tooltip";
import { useTranslation } from "react-i18next";
import CustomPagination from "../utils/CustomPagination";
import GmailTaxInvoiceModal from "../components/UI/customTable/GmailTaxInvoiceModal";
import gmaillogo from "../assets/image/Gmail_Logo.png";
import TaxInvoicePIModal from "../components/UI/customTable/TaxInvoicePIModal";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import Loading from "../components/loader/Loading";
import { axiosInstances } from "../networkServices/axiosInstance";
const TaxInvoiceView = ({ data }) => {
  console.log("tax invoice", data);

  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [tableData, setTableData] = useState([]);
  const [vertical, setVertical] = useState([]);
  const [project, setProject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);
  const [poc1, setPoc1] = useState([]);
  const [poc2, setPoc2] = useState([]);
  const [poc3, setPoc3] = useState([]);
  const [city, setCity] = useState([]);
  const [manager, setManager] = useState([]);
  const [formData, setFormData] = useState({
    ProjectName: "",
    ProjectID: [],
    VerticalID: [],
    TeamID: [],
    WingID: [],
    POC1: [],
    FromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    ToDate: new Date(),
    POC2: [],
    POC3: [],
    Status: "0",
    DateType: "EntryDate",
    City: "",
    SalesManager: "",
    TableStatus: "",
    PageSize: "10",
    PageNo: "",
  });

  useEffect(() => {
    if (data) {
      const projectID = data?.ProjectID;
      setFormData((prevData) => ({
        ...prevData,
        ProjectID: [projectID],
      }));

      // Call handleDeliveryChange after setting the Project in formData
      // handleDeliveryChange("Project", { value: projectID });
    }
  }, [data]);

  const getVertical = () => {
    axiosInstances
      .post(apiUrls.Vertical_Select, {})
      // let form = new FormData();
      // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   axios
      //     .post(apiUrls?.Vertical_Select, form, { headers })
      .then((res) => {
        const verticals = res?.data.data.map((item) => {
          return { name: item?.Vertical, code: item?.VerticalID };
        });
        setVertical(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function capitalizeFirstLetter(sentence) {
    if (!sentence) return "";
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  const getTeam = () => {
    axiosInstances
      .post(apiUrls.Team_Select, {})
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   axios
      //     .post(apiUrls?.Team_Select, form, { headers })
      .then((res) => {
        const teams = res?.data.data.map((item) => {
          return { name: item?.Team, code: item?.TeamID };
        });
        setTeam(teams);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getWing = () => {
    axiosInstances
      .post(apiUrls.Wing_Select, {})
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   axios
      //     .post(apiUrls?.Wing_Select, form, { headers })
      .then((res) => {
        const wings = res?.data.data.map((item) => {
          return { name: item?.Wing, code: item?.WingID };
        });
        setWing(wings);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSaveFilter = () => {
    localStorage.setItem("formData", JSON.stringify(formData));
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

    axiosInstances
      .post(apiUrls.SaveFilterDataSubmission, {
        Type: "TaxInvoiceRequest",
        FilterData: JSON.stringify(savedData),
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append("Type", "TaxInvoiceRequest"),
      //   form.append("FilterData", savedData),
      //   axios
      //     .post(apiUrls?.SaveFilterDataSubmission, form, { headers })
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSearchFilter = () => {
    axiosInstances
      .post(apiUrls.SearchFilterDataSubmission, {
        Type: "TaxInvoiceRequest",
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append("Type", "TaxInvoiceRequest"),
      //   // form.append("FilterData", savedData),
      //   axios
      //     .post(apiUrls?.SearchFilterDataSubmission, form, { headers })
      .then((res) => {
        console.log("Response data:", res?.data?.data);
        // toast.success(res?.data?.message);
        if (res?.data) {
          console.log("Response data:", res?.data);
        } else {
          console.error("No data found in the response.");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log("save data", formData);
  };

  const shortenName = (name) => {
    return name?.length > 15 ? name?.substring(0, 25) + "..." : name;
  };
  const handleReset = () => {
    setFormData({
      ...formData,
      ProjectName: "",
      ProjectID: [],
      VerticalID: [],
      TeamID: [],
      WingID: [],
      POC1: [],
      FromDate: new Date(),
      ToDate: new Date(),
      POC2: [],
      POC3: [],
      Status: "0",
      DateType: "Entry Date",
      City: "",
      SalesManager: "",
      TableStatus: "",
      PageSize: "10",
      PageNo: "",
    });
  };
  const getPOC1 = () => {
    axiosInstances
      .post(apiUrls.POC_1_Select, {})

      .then((res) => {
        const poc1s = res?.data.data.map((item) => {
          return { name: item?.POC_1_Name, code: item?.POC_1_ID };
        });
        setPoc1(poc1s);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPOC2 = () => {
    axiosInstances
      .post(apiUrls.POC_2_Select, {})

      .then((res) => {
        const poc2s = res?.data.data.map((item) => {
          return { name: item?.POC_2_Name, code: item?.POC_2_ID };
        });
        setPoc2(poc2s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getPOC3 = () => {
    axiosInstances
      .post(apiUrls.POC_3_Select, {})

      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { name: item?.POC_3_Name, code: item?.POC_3_ID };
        });
        setPoc3(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        ProjectID: 0,
        IsMaster: "0",
        VerticalID: 0,
        TeamID: 0,
        WingID: 0,
      })

      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { name: item?.Project, code: item?.ProjectId };
        });
        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getCity = () => {
    axiosInstances
      .post(apiUrls.GetCity, {
        CountryID: "14",
        StateID: "0",
        DistrictID: "0",
      })
     
      .then((res) => {
        const states = res?.data.data.map((item) => {
          return { label: item?.City, value: item?.ID };
        });
        setCity(states);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };
  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    getProject();
    getVertical();
    getTeam();
    getWing();
    getPOC1();
    getPOC2();
    getPOC3();
    getCity();
    // handleSearchFilter();
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const [visible, setVisible] = useState({
    ShowApprove: false,
    ShowAccepted: false,
    ShowUplaod: false,
    ShowEmail: false,
    gmailVisible: false,
    piVisible: false,
    showData: {},
  });

  const handleDeliveryChangeValue = (name, value, index, ele) => {
    tableData.map((val, ind) => {
      if (index !== ind) {
        val["TableStatus"] = null;
      }
      return val;
    });

    const data = [...tableData];
    data[index]["TableStatus"] = value;

    if (value === "Approve") {
      data[index]["ApprovedResolve"] = true;
      setTableData(data);
      setVisible({
        ShowApprove: true,
        ShowAccepted: false,
        ShowUplaod: false,
        ShowEmail: false,
        showData: data[index],
      });
    } else if (value === "Accept") {
      data[index]["AcceptedResolve"] = true;
      setTableData(data);
      setVisible({
        ShowApprove: false,
        ShowAccepted: true,
        ShowUplaod: false,
        ShowEmail: false,
        showData: data[index],
      });
    } else if (value === "Upload") {
      data[index]["UplaodResolve"] = true;
      setTableData(data);
      setVisible({
        ShowApprove: false,
        ShowAccepted: false,
        ShowUplaod: true,
        ShowEmail: false,
        showData: data[index],
      });
    } else if (value === "Email") {
      data[index]["EmailResolve"] = true;
      setTableData(data);
      setVisible({
        ShowApprove: false,
        ShowAccepted: false,
        ShowUplaod: false,
        ShowEmail: true,
        showData: data[index],
      });
    } else {
      setTableData(data);
      setVisible({
        ShowApprove: false,
        ShowAccepted: false,
        ShowUplaod: false,
        ShowEmail: false,
        showData: {},
      });
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const totalRecords = parseInt(tableData[0]?.TotalRecord);
  const totalPages = Math.ceil(totalRecords / formData?.PageSize);
  const currentData = tableData;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    handleSearch(undefined, newPage - 1);
  };

  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
  const handleSearch = (page, code) => {
    if (formData?.Name == "") {
      toast.error("Please Enter Employee Name.");
    } else if (formData?.Status == "") {
      toast.error("Please Select Status.");
    } else {
      setLoading(true);
      const payload = {
        DateType: String(formData?.DateType || ""),
        FromDate: formData?.FromDate
          ? String(formatDate(formData.FromDate))
          : "",
        ToDate: formData?.ToDate ? String(formatDate(formData.ToDate)) : "",
        Status: String(formData?.Status || ""),
        SearchType: "OnScreen", // fixed value
        PageSize: formData?.PageSize ? Number(formData.PageSize) : 0,
        PageNo: page ?? currentPage - 1,

        ProjectID: formData?.ProjectID ? String(formData.ProjectID) : "",
        VerticalID: formData?.VerticalID ? String(formData.VerticalID) : "",
        TeamID: formData?.TeamID ? String(formData.TeamID) : "",
        WingID: formData?.WingID ? String(formData.WingID) : "",
        POC1: formData?.POC1 ? String(formData.POC1) : "",
        POC2: formData?.POC2 ? String(formData.POC2) : "",
        POC3: formData?.POC3 ? String(formData.POC3) : "",
      };

      axiosInstances
        .post(apiUrls.TaxInvoice_Search, payload)
   
        .then((res) => {
          if (res?.data?.success == true) {
            // toast.success(res?.data?.message);
            const data = res?.data?.data;
            const updatedData = data?.map((ele, index) => {
              return {
                ...ele,
                index: index,
                IsActive: "0",

                ApprovedDropDown: "",
                ApprovedResolve: false,
                ApprovedDropDownValue: "",

                AcceptedDropDown: "",
                AcceptedResolve: false,
                AcceptedDropDownValue: "",

                UplaodDropdown: "",
                UplaodResolve: false,
                UplaodValue: "",

                EmailDropdown: "",
                EmailResolve: false,
                EmailValue: "",
              };
            });
            setTableData(updatedData);
            setLoading(false);
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {visible?.ShowApprove && (
        <Modal
          modalWidth={"600px"}
          visible={visible?.ShowApprove}
          setVisible={setVisible}
          Header="Approve Details"
        >
          <ApproveTaxInvoiceModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.ShowAccepted && (
        <Modal
          modalWidth={"600px"}
          visible={visible?.ShowAccepted}
          setVisible={setVisible}
          Header="Accept Details"
        >
          <AcceptTaxInvoiceModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.ShowUplaod && (
        <Modal
          modalWidth={"600px"}
          visible={visible?.ShowUplaod}
          setVisible={setVisible}
          Header="Upload details"
        >
          <UploadTaxInvoiceModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.ShowEmail && (
        <Modal
          modalWidth={"400px"}
          visible={visible?.ShowEmail}
          setVisible={setVisible}
          Header="Email details"
        >
          <EmailTaxInvoiceModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.piVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header="Upload Tax Invoice Details"
        >
          <TaxInvoicePIModal
            visible={visible}
            setVisible={setVisible}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      {visible?.gmailVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header="Tax Invoice Email Details"
        >
          <GmailTaxInvoiceModal
            visible={visible}
            setVisible={setVisible}
            edit={true}
          />
        </Modal>
      )}
      <div className="card">
        <Heading
          title={<span style={{ fontWeight: "bold" }}>Tax Invoice View</span>}
          isBreadcrumb={true}
        />
        <div className="row m-2">
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="ProjectID"
            placeholderName="Project"
            dynamicOptions={project}
            handleChange={handleMultiSelectChange}
            value={formData.ProjectID.map((code) => ({
              code,
              name: project.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="VerticalID"
            placeholderName="Vertical"
            dynamicOptions={vertical}
            optionLabel="VerticalID"
            className="VerticalID"
            handleChange={handleMultiSelectChange}
            value={formData.VerticalID.map((code) => ({
              code,
              name: vertical.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="TeamID"
            placeholderName="Team"
            dynamicOptions={team}
            handleChange={handleMultiSelectChange}
            value={formData.TeamID.map((code) => ({
              code,
              name: team.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="WingID"
            placeholderName="Wing"
            dynamicOptions={wing}
            handleChange={handleMultiSelectChange}
            value={formData.WingID.map((code) => ({
              code,
              name: wing.find((item) => item.code === code)?.name,
            }))}
          />

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="DateType"
            placeholderName="Date Type"
            dynamicOptions={[
              { label: "Entry Date", value: "EntryDate" },
              { label: "Upload Date", value: "UploadDate" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.DateType}
            requiredClassName={"required-fields"}
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
            requiredClassName={"required-fields"}
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

          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="POC1"
            placeholderName="POC-I"
            dynamicOptions={poc1}
            handleChange={handleMultiSelectChange}
            value={formData.POC1.map((code) => ({
              code,
              name: poc1.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="POC2"
            placeholderName="POC-II"
            dynamicOptions={poc2}
            handleChange={handleMultiSelectChange}
            value={formData.POC2.map((code) => ({
              code,
              name: poc2.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="POC3"
            placeholderName="POC-III"
            dynamicOptions={poc3}
            handleChange={handleMultiSelectChange}
            value={formData.POC3.map((code) => ({
              code,
              name: poc3.find((item) => item.code === code)?.name,
            }))}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Status"
            placeholderName="Status"
            dynamicOptions={[
              { label: "ALL", value: "0" },
              { label: "Approved", value: "Approved" },
              { label: "Accepted", value: "Accepted" },
              { label: "Tax Generated", value: "TaxGenerated" },
              { label: "Email Request", value: "EmailRequest" },
              { label: "Email Sent", value: "EmailSent" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.Status}
            requiredClassName={"required-fields"}
          />
          <ReactSelect
            respclass="col-xl-2 mt-1 col-md-4 col-sm-6 col-12"
            name="PageSize"
            placeholderName="PageSize"
            dynamicOptions={PageSize}
            value={formData?.PageSize}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
          />
          <div className="col-3 d-flex">
            {loading ? (
              <Loading />
            ) : (
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleSearch(undefined, "0")}
              >
                Search
              </button>
            )}
            <button
              className="btn btn-sm btn-danger ml-2"
              onClick={handleReset}
            >
              Reset Filter
            </button>
            <button
              className="btn btn-sm btn-danger ml-2"
              onClick={handleSaveFilter}
            >
              Save Filter
            </button>
            <button
              className="btn btn-sm btn-danger ml-2"
              onClick={handleSearchFilter}
            >
              Search Filter
            </button>
          </div>
          {/* <div className="col-sm-2">
            <Link to="/TaxInvoiceRequest" className="ml-0">
              Tax Invoice Request
            </Link>
          </div> */}
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card mt-2">
          <Heading
            title={<span style={{ fontWeight: "bold" }}>Search Details</span>}
            secondTitle={
              <div className="d-flex" style={{ fontWeight: "bold" }}>
                <div className="row">
                  <div className="d-flex flex-wrap align-items-center">
                    <div
                      className="d-flex"
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "white",
                          borderColor: "black",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch(undefined, "1")}
                      ></div>
                      <span
                        className="legend-label ml-2"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch(undefined, "1")}
                      >
                        {t("ManualRequest")}
                      </span>
                    </div>
                    <div
                      className="d-flex "
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "#B0C4DE",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch(undefined, "2")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch(undefined, "2")}
                      >
                        {t("AutoRequest")}
                      </span>
                    </div>
                    <div
                      className="d-flex "
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "#90EE90",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch(undefined, "3")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "107%",
                          textAlign: "left",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch(undefined, "3")}
                      >
                        {t("Tax Generated")}
                      </span>
                    </div>
                    <div
                      className="d-flex "
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "#00FFFF",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch(undefined, "4")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch(undefined, "4")}
                      >
                        {t("Mail Request")}
                      </span>
                    </div>
                    <div
                      className="d-flex "
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "#CC99FF",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch(undefined, "5")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "90%",
                          textAlign: "left",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch(undefined, "5")}
                      >
                        {t("Mail Sent")}
                      </span>
                    </div>
                    <div
                      className="d-flex "
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="legend-circle"
                        style={{
                          backgroundColor: "#FFE4C4",
                          borderColor: "#FFE4C4",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch(undefined, "6")}
                      ></div>
                      <span
                        className="legend-label"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearch(undefined, "6")}
                      >
                        {t("Mail Failed")}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="mr-4 ml-5">
                  Total Record :&nbsp; {tableData[0]?.TotalRecord}
                </span>
                <span>
                  Total Amount :&nbsp;{" "}
                  {Number(tableData[0]?.TotalAmount || 0).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </span>
              </div>
            }
          />

          <Tables
            thead={TaxsearchTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * formData?.PageSize + index + 1,
              "Project Name": (
                <Tooltip label={ele?.ProjectName}>
                  <span
                    id={`projectName-${index}`}
                    targrt={`projectName-${index}`}
                    style={{ textAlign: "center" }}
                  >
                    {shortenName(ele?.ProjectName)}
                  </span>
                </Tooltip>
              ),
              POC: ele?.POC_1_Name,
              Team: ele?.Team,
              "Sales No.": (
                <>
                  <Tooltip label={ele?.ActualSalesNo}>
                    <span
                      id={`projectName-${index}`}
                      targrt={`projectName-${index}`}
                      style={{ textAlign: "center" }}
                    >
                      {shortenName(ele?.SalesNo)}
                    </span>
                  </Tooltip>
                </>
              ),
              "Item Name": ele?.ItemName,
              // "Sales Date": ele?.dtEntry,
              Remark: (
                <>
                  <Tooltip label={capitalizeFirstLetter(ele?.Remark)}>
                    <span
                      id={`projectName-${index}`}
                      targrt={`projectName-${index}`}
                      style={{ textAlign: "center" }}
                    >
                      {capitalizeFirstLetter(shortenName(ele?.Remark))}
                    </span>
                  </Tooltip>
                </>
              ),
              PaymentMode: ele?.PaymentMode,
              "Gross Amount": ele?.GrossAmount,
              "Dis Amount": ele?.DiscountAmount,
              "Tax Amount": ele?.TaxAmount,
              "Net Amount": ele?.NetAmount,
              Print: ele?.TaxInvoiceURL !== "" && (
                <i
                  className="fa fa-print"
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    color: "black",
                  }}
                  onClick={() => window.open(ele?.TaxInvoiceURL, "_blank")}
                ></i>
              ),
              "Tax Invoice":
                ele?.TaxInvoiceNo == "" ? (
                  <i
                    className="fa fa-upload"
                    onClick={() => {
                      setVisible({
                        piVisible: true,
                        showData: ele,
                        ele,
                      });
                    }}
                    style={{
                      cursor: "pointer",
                      color: "black",
                      marginLeft: "20px",
                    }}
                    title="Click to View Document."
                  ></i>
                ) : (
                  ele?.TaxInvoiceNo
                ),
              // PI:
              //   ele?.PINo == "" ? (
              //     <button
              //       className="btn btn-sm btn-success"
              //       onClick={() => handleGenerate(ele?.EncryptID)}
              //     >
              //       Generate
              //     </button>
              //   ) : (
              //     <Link
              //       style={{ cursor: "pointer" }}
              //       // title="Click to Print PI."
              //       onClick={() => window.open(ele?.PIURL, "_blank")}
              //     >
              //       <Tooltip label={ele?.ActualPINo}>
              //         <span
              //           id={`projectName-${index}`}
              //           targrt={`projectName-${index}`}
              //           style={{ textAlign: "center" }}
              //         >
              //           {shortenName(ele?.PINo)}
              //         </span>
              //       </Tooltip>
              //     </Link>
              //   ),s

              "Entry Date": ele?.dtEntry,
              Email: (
                //  ele?.TaxInvoiceNo !== "" && (

                <img
                  src={gmaillogo}
                  height={"10px"}
                  onClick={() => {
                    setVisible({
                      gmailVisible: true,
                      showData: ele,
                      ele,
                    });
                  }}
                  title="Click to Gmail."
                  style={{ marginLeft: "12px" }}
                ></img>
              ),
              // ),

              // Edit: (
              //   <Link
              //     to="/TaxInvoiceRequest"
              //     // state={{ data: ele?.EncryptID, edit: true, givenData: ele }}
              //     style={{ cursor: "pointer" }}
              //   >
              //     Edit
              //   </Link>
              // ),
              // Cancel: (
              //   <i
              //     className="fa fa-times"
              //     onClick={() => {
              //       setVisible({
              //         showVisible: true,
              //         showData: ele,
              //         ele,
              //       });
              //     }}
              //     style={{
              //       marginLeft: "10px",
              //       color: "red",
              //       cursor: "pointer",
              //     }}
              //   ></i>
              // ),
              // Action: (
              //   <ReactSelect
              //     respclass="width100px"
              //     name="TableStatus"
              //     placeholderName="Action Type"
              //     dynamicOptions={[
              //       { label: "Approve", value: "Approve" },
              //       { label: "Accept", value: "Accept" },
              //       { label: "Upload", value: "Upload" },
              //       { label: "Email", value: "Email" },
              //     ]}
              //     handleChange={(name, value) => {
              //       const ind = index;
              //       handleDeliveryChangeValue(name, value?.value, ind, ele);
              //     }}
              //     value={ele.TableStatus}
              //   />
              // ),
              colorcode: ele?.rowColor,
            }))}
            tableHeight={"tableHeight"}
          />
          <div className="ml-auto">
            <CustomPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TaxInvoiceView;
