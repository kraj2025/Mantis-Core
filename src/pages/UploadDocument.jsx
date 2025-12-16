import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import Input from "../components/formComponent/Input";
import ReactSelect from "../components/formComponent/ReactSelect";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import axios from "axios";
import { headers } from "../utils/apitools";
import { documentTHEAD } from "../components/modalComponent/Utils/HealperThead";
import Tables from "../components/UI/customTable";
import DocumentTypeModal from "../components/UI/customTable/DocumentTypeModal";
import Modal from "../components/modalComponent/Modal";
import Loading from "../components/loader/Loading";
import { useTranslation } from "react-i18next";
import { apiUrls } from "../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

const UploadDocument = () => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [documenttype, setDocumentType] = useState([]);
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);
  const [poc1, setPoc1] = useState([]);
  const [poc2, setPoc2] = useState([]);
  const [poc3, setPoc3] = useState([]);
  const [project, setProject] = useState([]);
  const [status, setStatus] = useState([]);

  const [formData, setFormData] = useState({
    User: "",
    ProjectID: [],
    VerticalID: [],
    TeamID: [],
    WingID: [],
    DocumentType: "",
    Status: "",
    POC1: [],
    POC2: [],
    POC3: [],
  });


  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const getPOC1 = () => {
    axiosInstances
      .post(apiUrls.POC_1_Select, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
      })
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
    let form = new FormData();
    axiosInstances
      .post(apiUrls.POC_2_Select, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
      })
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
    let form = new FormData();
    axiosInstances
      .post(apiUrls.POC_3_Select, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
      })
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
  const getStatus = () => {
    axiosInstances
      .post(apiUrls.Status_Select, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.STATUS, value: item?.id };
        });
        setStatus(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
        LoginName: useCryptoLocalStorage("user_Data", "get", "realname"),
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
  const getVertical = () => {
    axiosInstances
      .post(apiUrls.Vertical_Select, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
      })
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
  const getTeam = () => {
    axiosInstances
      .post(apiUrls.Team_Select, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
      })
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
      .post(apiUrls.Wing_Select, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
      })
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
  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };
  const getType = () => {
    axiosInstances
      .post(apiUrls.DocumentType_Select, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
      })
      .then((res) => {
        const wings = res?.data.data.map((item) => {
          return {
            label: item?.DocumentTypeName,
            value: item?.DocumentTypeID,
          };
        });
        setDocumentType(wings);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [tableData, setTableData] = useState([]);

  const [visible, setVisible] = useState({
    showVisible: false,
    showData: {},
  });
  const getUploadSearch = (code) => {
    setLoading(true);
   
    axiosInstances
      .post(apiUrls.UploadDocument_Search, {
        ProjectID: String(formData?.ProjectID),
        VerticalID: String(formData?.VerticalID),
        TeamID: String(formData?.TeamID),
        WingID: String(formData?.WingID),
        POC1: String(formData?.POC1),
        POC2: String(formData?.POC2),
        POC3: String(formData?.POC3),
        Status: String(formData?.Status),
      })
      .then((res) => {
        setTableData(res?.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
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
  const handleDocRemove = (ele) => {
    console.log("ele",ele)
    setLoading(true);
   
    axiosInstances
      .post(apiUrls.ProjectMasterUpdate, {
        ProjectID: Number(ele?.ProjectID),
        ActionType: "DeleteDocument",
        User_ID: ele?.UniqueID,
      })
      .then((res) => {
        if (res?.data?.success===true) {
          toast.success(res?.data?.message);
          getUploadSearch();
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

  useEffect(() => {
    getProject();
    getTeam();
    getWing();
    getVertical();
    getStatus();
    getType();
    getPOC1();
    getPOC2();
    getPOC3();
  }, []);
  return (
    <>
      <Modal
        modalWidth={"600px"}
        visible={visible?.showVisible}
        setVisible={setVisible}
        Header="Upload Document"
        tableData={visible}
        setTableData={setTableData}
      >
        <DocumentTypeModal
          visible={visible?.showVisible}
          setVisible={setVisible}
          tableData={visible}
          setTableData={setTableData}
        />
      </Modal>
      <div className="card ViewIssues border">
        <Heading title="Upload Document" isBreadcrumb={true} />
        <div className="row g-4 m-1">
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
            name="DocumentType"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="DocumentType"
            dynamicOptions={documenttype}
            value={formData?.DocumentType}
            handleChange={handleDeliveryChange}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Status"
            placeholderName="Status"
            dynamicOptions={status}
            value={formData?.Status}
            handleChange={handleDeliveryChange}
          />
          <div className="col-3 col-sm-4 d-flex">
            <button
              className="btn btn-sm btn-info ml-2"
              onClick={getUploadSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          {tableData?.length > 0 && (
            <div className="card patient_registration_card mt-2 my-2">
              <Heading
                title="Search Details"
                secondTitle={
                  <div className="row g-4">
                    <div
                      className="d-flex flex-wrap align-items-center"
                      style={{ marginRight: "0px" }}
                    >
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
                            backgroundColor: "#4cd07d",
                            cursor: "pointer",
                            height: "11px",
                            width: "28px",
                            borderRadius: "50%",
                          }}
                          // onClick={() => getUploadSearch("2")}
                        ></div>
                        <span
                          className="legend-label"
                          style={{ width: "100%", textAlign: "left" }}
                        >
                          {t("Uploaded")}
                        </span>
                        <div
                          className="legend-circle"
                          style={{
                            backgroundColor: "#ffffff",
                            cursor: "pointer",
                            height: "11px",
                            width: "25px",
                            borderRadius: "50%",
                            border: "1px solid black",
                          }}
                          // onClick={() => getUploadSearch("1")}
                        ></div>
                        <span
                          className="legend-label"
                          style={{ width: "100%", textAlign: "left" }}
                        >
                          {t("Not-Uploaded")}
                        </span>
                      </div>
                    </div>
                  </div>
                }
              />
              <Tables
                thead={documentTHEAD}
                tbody={currentData?.map((ele, index) => ({
                  "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
                  Vertical: ele?.Vertical,
                  Team: ele?.Team,
                  Wing: ele?.Wing,
                  ProjectName: ele?.ProjectName,
                  Type: ele?.DocumentName,
                  Docs: ele?.DocumentUrl ? (
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
                  Upload: (
                    <i
                      className="fa fa-plus"
                      style={{
                        marginLeft: "5px",
                        cursor: "pointer",
                        color: "white",
                        border: "1px solid green",
                        padding: "2px",
                        background: "green",
                        borderRadius: "3px",
                      }}
                      onClick={() => {
                        setVisible({ showVisible: true, showData: ele });
                      }}
                    ></i>
                  ),
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
          )}
        </>
      )}
    </>
  );
};
export default UploadDocument;
