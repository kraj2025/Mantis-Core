import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../components/UI/Heading";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import MisReportTable from "../components/UI/customTable/MisReportTable";
import Loading from "../components/loader/Loading";
import { toast } from "react-toastify";
import { apiUrls } from "../networkServices/apiEndpoints";
import { ExportToExcel, ExportToPDF } from "../networkServices/Tools";
import excelimg from "../../src/assets/image/excel.png";
import pdf from "../../src/assets/image/pdf.png";
import { axiosInstances } from "../networkServices/axiosInstance";
const AutoBackupStatusSheet = () => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    ProjectID: [],
    VerticalID: [],
    TeamID: [],
    WingID: [],
    POC1: [],
    POC2: [],
    POC3: [],
  });

  const [project, setProject] = useState([]);
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);
  const [poc1, setPoc1] = useState([]);
  const [poc2, setPoc2] = useState([]);
  const [poc3, setPoc3] = useState([]);

  const [loading, setLoading] = useState(false);
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
          return { name: item?.Project, code: item?.ProjectId };
        });
        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getProject();
  }, []);
  const handleSearch = (code) => {
    setLoading(true);

    const payload = {
      ProjectID: String(formData?.ProjectID || 0),
      VerticalID: String(formData?.VerticalID || 0),
      TeamID: String(formData?.TeamID || 0),
      WingID: String(formData?.WingID || 0),
      POC1: String(formData?.POC1 || 0),
      POC2: String(formData?.POC2 || 0),
      POC3: String(formData?.POC3 || 0),
      StatusCode: String(code || ""),
    };

    axiosInstances
      .post(apiUrls?.AutobackupSearch, payload)
      .then((res) => {
        if (res?.data?.data?.length > 0) {
          setTableData(res?.data?.data);
        } else {
          toast.error(res?.data?.message);
          setTableData([]);
        }
        // setFormData({
        //     VerticalID: [],
        //     TeamID: [],
        //     WingID: [],
        //     POC1: [],
        //     POC2: [],
        //     POC3: []
        // })
        setLoading(false);
      })
      .catch((err) => {
        setTableData([]);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoading(false);
      });
  };

  const THEAD = [
    t("S.No."),
    t("Vertical"),
    t("Team"),
    t("Wing"),
    t("Project Name"),
    t("Last AB Date"),
    t("Last AB Done By"),
    t("SPOC_Name"),
    t("SPOC_Email"),
    t("SPOC_Mobile"),
    t("Edit"),
    t("Show Log"),
  ];

  const filterByColor = (color) => {
    const data = tableData?.filter((ele) => ele?.colorcode == color);
    setTableData(data);
    handleSearch();
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };

  const getVertical = () => {
    axiosInstances
      .post(apiUrls?.Vertical_Select, {})
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
      .post(apiUrls?.Team_Select, {})
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
      .post(apiUrls?.Wing_Select, {})
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
  const getPOC1 = () => {
    axiosInstances
      .post(apiUrls?.POC_1_Select, {})
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
      .post(apiUrls?.POC_2_Select, {})
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
      .post(apiUrls?.POC_3_Select, {})
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

  useEffect(() => {
    getVertical();
    getTeam();
    getWing();
    getPOC1();
    getPOC2();
    getPOC3();
  }, []);

  return (
    <>
      <div className="card ViewIssues border">
        <Heading title={t("AutoBackupStatusSheet")} isBreadcrumb={true} />

        <div className="row g-4 m-2">
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="VerticalID"
            placeholderName="Vertical"
            dynamicOptions={vertical}
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
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="ProjectID"
            placeholderName="Project"
            dynamicOptions={project}
            handleChange={handleMultiSelectChange}
            value={formData?.ProjectID?.map((code) => ({
              code,
              name: project.find((item) => item.code === code)?.name,
            }))}
          />

          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div className="d-flex ">
              <button
                className="btn btn-lg btn-info "
                onClick={() => handleSearch()}
              >
                Search
              </button>
              {/* <button
                style={{ color: "white" }}
                className="btn btn-lg btn-warning ml-2"
                onClick={() => ExportToExcel(tableData)}
              >
                Excel
              </button> */}
              {tableData?.length > 0 && (
                <img
                  src={excelimg}
                  className=" ml-2"
                  style={{ width: "34px", height: "24px", cursor: "pointer" }}
                  onClick={() => ExportToExcel(tableData)}
                  title="Click to download Excel"
                ></img>
              )}
              {tableData?.length > 0 && (
                <img
                  src={pdf}
                  className=" ml-2"
                  style={{
                    width: "28px",
                    height: "25px",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                  onClick={() => ExportToPDF(tableData)}
                ></img>
              )}
            </div>
          </div>
          {tableData?.length > 0 && (
            <div className="row g-4">
              <div className="d-flex flex-wrap align-items-center">
                <div
                  className="d-flex "
                  style={{ justifyContent: "flex-start", alignItems: "center" }}
                >
                  <div
                    className="legend-circle"
                    style={{
                      backgroundColor: "#FFC0CB",
                      borderColor: "#FFC0CB",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearch("-1")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("AB Not Required")}
                  </span>
                </div>
                <div
                  className="d-flex "
                  style={{ justifyContent: "flex-start", alignItems: "center" }}
                >
                  <div
                    className="legend-circle"
                    style={{
                      backgroundColor: "white",
                      borderColor: "black",
                      border: "1px solid grey",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearch("0")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("AB Not Done")}
                  </span>
                </div>
                <div
                  className="d-flex "
                  style={{ justifyContent: "flex-start", alignItems: "center" }}
                >
                  <div
                    className="legend-circle"
                    style={{ backgroundColor: "#FFFF00", cursor: "pointer" }}
                    onClick={() => handleSearch("180")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("AB Not Done 180 Days")}
                  </span>
                </div>
                <div
                  className="d-flex "
                  style={{ justifyContent: "flex-start", alignItems: "center" }}
                >
                  <div
                    className="legend-circle"
                    style={{ backgroundColor: "#FFE4C4", cursor: "pointer" }}
                    onClick={() => handleSearch("90")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("AB Not Done 90 Days")}
                  </span>
                </div>
                <div
                  className="d-flex "
                  style={{ justifyContent: "flex-start", alignItems: "center" }}
                >
                  <div
                    className="legend-circle"
                    style={{ backgroundColor: "#FFA500", cursor: "pointer" }}
                    onClick={() => handleSearch("75")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("AB Not Done 75 Days")}
                  </span>
                </div>
                <div
                  className="d-flex "
                  style={{ justifyContent: "flex-start", alignItems: "center" }}
                >
                  <div
                    className="legend-circle"
                    style={{
                      backgroundColor: "#90EE90",
                      cursor: "pointer",
                      border: "1px solid #90EE90",
                    }}
                    onClick={() => handleSearch("1")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {t("AB Verified")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          {tableData?.length > 0 && (
            <div
              className="card ViewIssues border mt-2 table-responsive"
              style={{ overflowX: "auto" }}
            >
              <div
                className="col-sm-12"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div style={{ fontWeight: "bold" }}>Search Details</div>
                <div style={{ fontWeight: "bold" }}>
                  Total Count : {tableData?.length}
                </div>
              </div>

              <div
                className="patient_registration_card bootable tabScroll"
                style={{ overflowX: "auto" }}
              >
                <MisReportTable
                  THEAD={THEAD}
                  tbody={tableData}
                  setBodyData={setTableData}
                />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AutoBackupStatusSheet;
