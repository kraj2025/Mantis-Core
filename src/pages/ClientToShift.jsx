import React, { useEffect, useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import Input from "../components/formComponent/Input";
import { toast } from "react-toastify";
import Heading from "../components/UI/Heading";
import Tables from "../components/UI/customTable";
import { inputBoxValidation } from "../utils/utils";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../utils/constant";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import DatePicker from "../components/formComponent/DatePicker";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { axiosInstances } from "../networkServices/axiosInstance";
const ClientToShift = ({ data }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [user, setUser] = useState([]);
  const [wing, setWing] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [docData, setDocData] = useState([]);
  const [levelList, setLevelList] = useState({
    leve1: {},
    level2: {},
    level3: {},
  });

  const [formData, setFormData] = useState({
    VerticalID: "",
    TeamID: "",
    WingID: "",
    Engineer1: "",
    Engineer1Mobile: "",
    Engineer1Email: "",
    Engineer2: "",
    Engineer2Mobile: "",
    Engineer2Email: "",
    Engineer3: "",
    Engineer3Mobile: "",
    Engineer3Email: "",
    isDue: "",
    FromDate: "",
  });

  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const getVertical = () => {
    axiosInstances
      .post(apiUrls?.Vertical_Select, {})
      .then((res) => {
        const verticals = res?.data.data.map((item) => {
          return { label: item?.Vertical, value: item?.VerticalID };
        });
        setVertical(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getTeam = () => {
    axiosInstances
      .post(apiUrls?.Team_Select, {})
      .then((res) => {
        const teams = res?.data.data.map((item) => {
          return { label: item?.Team, value: item?.TeamID };
        });
        setTeam(teams);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const documentTHEAD = [
    "S.No.",
    "Vertical",
    "Team",
    "Wing",
    "Project Name",
    "Type",
    "Print",
    // "Upload",
    "Uploaded By",
    "Uploaded Date",
    { name: "Remove", width: "5%" },
  ];

  const handleSearchDocs = () => {
    const payload = {
      RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
      VerticalID: "",
      TeamID: "",
      WingID: "",
      POC1: "",
      POC2: "",
      POC3: "",
      Status: "",
      ProjectID: String(data?.Id || data?.ProjectID),
    };

    axiosInstances
      .post(apiUrls?.UploadDocument_Search, payload)
      .then((res) => {
        setDocData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getWing = () => {
    axiosInstances
      .post(apiUrls?.Wing_Select, {})
      .then((res) => {
        const wings = res?.data.data.map((item) => {
          return { label: item?.Wing, value: item?.WingID };
        });
        setWing(wings);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getReporter = () => {
    const payload = {
      RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID") || 0),
      OnlyItdose: "1",
    };
    axiosInstances
      .post(apiUrls?.Reporter_Select, payload)
      .then((res) => {
        const reporters = res?.data.data.map((item) => {
          return { label: item?.Name, value: item?.ID };
        });
        setUser(reporters);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }
  const handleSearch = () => {
    const payload = {
      RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID") || 0),
      ProjectID: Number(data?.Id || data?.ProjectID || 0),
      Title: "ClickToShift",
    };

    axiosInstances
      .post(apiUrls?.getViewProject, payload)
      .then((res) => {
        console.log(res);
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSave = () => {
    const payload = {
      RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID") || 0),
      LoginName: String(
        useCryptoLocalStorage("user_Data", "get", "realname") || ""
      ),
      ActionType: "ClickToShift",

      ProjectShiftDetails: [
        {
          ID: 0,
          ProjectID: Number(data?.Id || data?.ProjectID || 0),
          ProjectName: String(data?.NAME || data?.ProjectName || ""),
          ShiftedByID: Number(
            useCryptoLocalStorage("user_Data", "get", "User_ID") || 0
          ),
          ShiftedBy: String(
            useCryptoLocalStorage("user_Data", "get", "realname") || ""
          ),

          DtShift: moment(formData?.FromDate).isValid()
            ? moment(formData?.FromDate).format("YYYY-MM-DD")
            : "",

          ToVerticalID: Number(formData?.VerticalID || 0),
          ToVertical: String(getlabel(formData?.VerticalID, vertical) || ""),
          ToTeamID: Number(formData?.TeamID || 0),
          ToTeam: String(getlabel(formData?.TeamID, team) || ""),
          ToWingID: Number(formData?.WingID || 0),
          ToWing: String(getlabel(formData?.WingID, wing) || ""),

          SPOC_Level_1_ID: Number(formData?.Engineer1 || 0),
          SPOC_Level_1_Name: String(getlabel(formData?.Engineer1, user) || ""),
          SPOC_Level_1_Mobile: String(formData?.Engineer1Mobile || ""),
          SPOC_Level_1_Email: String(formData?.Engineer1Email || ""),

          SPOC_Level_2_ID: Number(formData?.Engineer2 || 0),
          SPOC_Level_2_Name: String(getlabel(formData?.Engineer2, user) || ""),
          SPOC_Level_2_Mobile: String(formData?.Engineer2Mobile || ""),
          SPOC_Level_2_Email: String(formData?.Engineer2Email || ""),

          SPOC_Level_3_ID: Number(formData?.Engineer3 || 0),
          SPOC_Level_3_Name: String(getlabel(formData?.Engineer3, user) || ""),
          SPOC_Level_3_Mobile: String(formData?.Engineer3Mobile || ""),
          SPOC_Level_3_Email: String(formData?.Engineer3Email || ""),

          IsAccept: false,
          AcceptByID: 0,
          AcceptBy: "",
          DtAccept: "",

          IsReject: false,
          RejectById: 0,
          RejectBy: "",
          DtReject: "",
        },
      ],
    };

    if (formData?.VerticalID == "") {
      toast.error("Please select Vertical");
    } else if (formData?.TeamID == "") {
      toast.error("Please select Team");
    } else if (formData?.WingID == "") {
      toast.error("Please select Wing");
    } else if (formData?.Engineer1 == "") {
      toast.error("Please select Level1");
    } else if (formData?.Engineer2 == "") {
      toast.error("Please select Level2");
    } else if (formData?.Engineer3 == "") {
      toast.error("Please select Level3");
    } else if (formData?.FromDate == "") {
      toast.error("Please select Shifted Date");
    } else {
      axiosInstances
        .post(apiUrls?.ProjectMasterUpdate, payload)
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            handleSearch();
            setFormData({
              ...formData,
              VerticalID: "",
              TeamID: "",
              WingID: "",
              Engineer1: "",
              Engineer1Mobile: "",
              Engineer1Email: "",
              Engineer2: "",
              Engineer2Mobile: "",
              Engineer2Email: "",
              Engineer3: "",
              Engineer3Mobile: "",
              Engineer3Email: "",
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

  // console.log('formData:::::', formData);
  useEffect(() => {
    getVertical();
    getTeam();
    getWing();
    getReporter();
    handleSearch();
    handleSearchDocs();
  }, []);
  const ownerTHEAD = ["Level", "Mobile", "Email"];
  const [ownerTbody, setOwnerTbody] = useState([
    { Level: "", Mobile: "", Email: "" },
    { Level: "", Mobile: "", Email: "" },
    { Level: "", Mobile: "", Email: "" },
  ]);
  const handleDeliveryChangeTab = (name, e) => {
    setLevelList((prev) => ({ ...prev, [name]: e }));
  };

  const clientshiftTHEAD = [
    "S.No.",
    "Team",
    "Level1",
    "Level2",
    "Level3",
    "ShiftedBy",
    "Shifted Date",
    "Print",
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math?.ceil(tableData?.length / rowsPerPage);
  const currentData = tableData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const [currentPagedoc, setCurrentPagedoc] = useState(1);
  const rowsPerPagedoc = 10;
  const totalPagesdoc = Math?.ceil(docData?.length / rowsPerPagedoc);
  const currentDatadoc = docData?.slice(
    (currentPagedoc - 1) * rowsPerPagedoc,
    currentPagedoc * rowsPerPagedoc
  );
  const handlePageChangedoc = (newPageDOC) => {
    if (newPageDOC > 0 && newPageDOC <= totalPagesdoc) {
      setCurrentPagedoc(newPageDOC);
    }
  };
  const handleCheckBox = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };
  const handleDocRemove = (ele) => {
    setLoading(true);
    axiosInstances
      .post(apiUrls?.ProjectMasterUpdate, {
        ProjectID: Number(ele?.ProjectID),
        ActionType: "DeleteDocument",
        DocumentPrimaryID: Number(ele?.UniqueID),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleSearchDocs();
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
  };
  return (
    <>
      <div className="card  p-2 ">
        <div className="row d-flex">
          <span style={{ fontWeight: "bold", marginLeft: "6px" }}>
            Project Name : {data?.NAME || data?.ProjectName}
          </span>
          <div className="search-col" style={{ marginLeft: "20px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="isDue"
                  checked={formData?.isDue ? 1 : 0}
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
                Show Document Details
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="row p-2">
          {/* <div className="col-sm-6 d-flex"> */}
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="VerticalID"
            placeholderName="Vertical"
            dynamicOptions={vertical}
            handleChange={handleDeliveryChange}
            value={formData.VerticalID}
          />

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="TeamID"
            placeholderName="Team"
            dynamicOptions={team}
            handleChange={handleDeliveryChange}
            value={formData.TeamID}
          />

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="WingID"
            placeholderName="Wing"
            dynamicOptions={wing}
            handleChange={handleDeliveryChange}
            value={formData.WingID}
          />
          <ReactSelect
            name="Engineer1"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="Level 1"
            dynamicOptions={user}
            value={formData?.Engineer1}
            handleChange={handleDeliveryChange}
          />
          {formData?.Engineer1 && (
            <>
              <Input
                type="Engineer1Mobile"
                className="form-control"
                id="Engineer1Mobile"
                name="Engineer1Mobile"
                lable="Mobile"
                placeholder=" "
                onChange={(e) => {
                  inputBoxValidation(
                    MOBILE_NUMBER_VALIDATION_REGX,
                    e,
                    handleSelectChange
                  );
                }}
                value={formData?.Engineer1Mobile}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control"
                id="Engineer1Email"
                name="Engineer1Email"
                lable="Email"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.Engineer1Email}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
            </>
          )}
          <ReactSelect
            name="Engineer2"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
            placeholderName="Level 2"
            dynamicOptions={user}
            value={formData?.Engineer2}
            handleChange={handleDeliveryChange}
          />
          {formData?.Engineer2 && (
            <>
              <Input
                type="number"
                className="form-control mt-1"
                id="Engineer2Mobile"
                name="Engineer2Mobile"
                lable="Mobile"
                placeholder=" "
                onChange={(e) => {
                  inputBoxValidation(
                    MOBILE_NUMBER_VALIDATION_REGX,
                    e,
                    handleSelectChange
                  );
                }}
                value={formData?.Engineer2Mobile}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control mt-1"
                id="Engineer2Email"
                name="Engineer2Email"
                lable="Email"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.Engineer2Email}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
            </>
          )}
          <ReactSelect
            name="Engineer3"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
            placeholderName="Level 3"
            dynamicOptions={user}
            value={formData?.Engineer3}
            handleChange={handleDeliveryChange}
          />
          {formData?.Engineer3 && (
            <>
              <Input
                type="number"
                className="form-control mt-1"
                id="Engineer3Mobile"
                name="Engineer3Mobile"
                lable="Mobile"
                placeholder=" "
                onChange={(e) => {
                  inputBoxValidation(
                    MOBILE_NUMBER_VALIDATION_REGX,
                    e,
                    handleSelectChange
                  );
                }}
                value={formData?.Engineer3Mobile}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control mt-1"
                id="Engineer3Email"
                name="Engineer3Email"
                lable="Email"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.Engineer3Email}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
            </>
          )}

          <DatePicker
            className="custom-calendar"
            id="FromDate"
            name="FromDate"
            lable={t("Shifted Date")}
            placeholder={VITE_DATE_FORMAT}
            value={formData?.FromDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
            handleChange={searchHandleChange}
          />
          <button
            className="btn btn-sm btn-primary ml-2 mt-1"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
      {formData?.isDue > 0 && (
        <div className="card mt-3 my-2">
          <Heading title="Document Upload Details" />
          <Tables
            thead={documentTHEAD}
            tbody={currentDatadoc?.map((ele, index) => ({
              "S.No.": (currentPagedoc - 1) * rowsPerPagedoc + index + 1,
              Vertical: ele?.Vertical,
              Team: ele?.Team,
              Wing: ele?.Wing,
              ProjectName: ele?.ProjectName,
              Type: ele?.DocumentName,
              Print: ele?.DocumentUrl ? (
                <i
                  className="fa fa-print"
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    color: "white",
                    border: "1px solid green",
                    padding: "2px",
                    background: "black",
                    borderRadius: "3px",
                  }}
                  onClick={() => window.open(ele?.DocumentUrl, "_blank")}
                ></i>
              ) : null,

              UploadedBy: ele?.UploadedBy,
              UploadedDate: ele?.dtUpload,
              Remove: (
                <i
                  className="fa fa-times"
                  style={{ color: "red", marginLeft: "20px" }}
                  onClick={() => {
                    handleDocRemove(ele);
                  }}
                ></i>
              ),
              colorcode: ele?.colorcode,
            }))}
            tableHeight={"tableHeight"}
          />

          <div
            className="pagination"
            style={{ marginLeft: "auto", marginBottom: "9px" }}
          >
            <button
              onClick={() => handlePageChangedoc(currentPagedoc - 1)}
              disabled={currentPagedoc === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPagedoc} of {totalPagesdoc}
            </span>
            <button
              onClick={() => handlePageChangedoc(currentPagedoc + 1)}
              disabled={currentPagedoc === totalPagesdoc}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {tableData?.length > 0 && (
        <div className="card mt-3">
          <Heading title={"Clik To Shift Details"} />
          <Tables
            thead={clientshiftTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              Team: (
                <div dangerouslySetInnerHTML={{ __html: ele?.TeamDisplay }} />
              ),

              Level1: (
                <div
                  dangerouslySetInnerHTML={{
                    __html: ele?.SPOC_Level_1_Display,
                  }}
                />
              ),
              Level2: (
                <div
                  dangerouslySetInnerHTML={{
                    __html: ele?.SPOC_Level_2_Display,
                  }}
                />
              ),
              Level3: (
                <div
                  dangerouslySetInnerHTML={{
                    __html: ele?.SPOC_Level_3_Display,
                  }}
                />
              ),
              ShiftedBy: ele?.ShiftedBy,
              "Shifted Date": ele?.dtShift,
              Print: (
                <i
                  className="fa fa-print"
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    color: "black",
                    padding: "2px",
                    borderRadius: "3px",
                  }}
                  onClick={() => window.open(ele?.PDFURL, "_blank")}
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

export default ClientToShift;
