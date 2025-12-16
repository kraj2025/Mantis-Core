import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import { apiUrls } from "../networkServices/apiEndpoints";
import axios from "axios";
import { headers } from "../utils/apitools";
import { useTranslation } from "react-i18next";
import ReactSelect from "../components/formComponent/ReactSelect";
import Tables from "../components/UI/customTable";
import { ageingTHEAD } from "../components/modalComponent/Utils/HealperThead";
import Loading from "../components/loader/Loading";
import excelimg from "../../src/assets/image/excel.png";
import { ExportToExcel } from "../networkServices/Tools";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const AgeingSheet = () => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    ProjectID: [],
    VerticalID: [],
    TeamID: [],
    WingID: [],
    POC1: [],
    POC2: [],
    POC3: [],
    GroupBy: "",
  });
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);
  const [poc1, setPoc1] = useState([]);
  const [poc2, setPoc2] = useState([]);
  const [project, setProject] = useState([]);
  const [poc3, setPoc3] = useState([]);

  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {})
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
      .post(apiUrls.Vertical_Select, {})
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
      .post(apiUrls.Team_Select, {})
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

  const handleSearch = () => {
    setLoading(true);

    axiosInstances
      .post(apiUrls.MantisSummary_Search, {
        ID: 0,
        DateType: "string",
        DateRange: "string",
        FromDate: new Date().toISOString(),
        ToDate: new Date().toISOString(),

        ProjectIDs: formData?.ProjectID?.length ? [...formData.ProjectID] : [0],
        VerticalIDs: formData?.VerticalID?.length
          ? [...formData.VerticalID]
          : [0],
        TeamIDs: formData?.TeamID?.length ? [...formData.TeamID] : [0],
        WingIDs: formData?.WingID?.length ? [...formData.WingID] : [0],
        POC1s: formData?.POC1?.length ? [...formData.POC1] : [0],
        POC2s: formData?.POC2?.length ? [...formData.POC2] : [0],
        POC3s: formData?.POC3?.length ? [...formData.POC3] : [0],

        DeveloperID: formData?.DeveloperID || 0,
      })
      .then((res) => {
        setTableData(res?.data?.dtAgeing);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getVertical();
    getTeam();
    getWing();
    getPOC1();
    getPOC2();
    getPOC3();
    getProject();
  }, []);

  return (
    <>
      <div className="card">
        <Heading title={t("Ageing Sheet")} isBreadcrumb={true} />
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
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="GroupBy"
            placeholderName="GroupBy"
            dynamicOptions={[
              { label: "POC1 and Project", value: "POC1 and Project" },
              { label: "Team and POC1", value: "Team and POC1" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.GroupBy}
          />
          {loading ? (
            <Loading />
          ) : (
            <button className="btn btn-lg btn-info ml-3" onClick={handleSearch}>
              Search
            </button>
          )}

          {tableData?.length > 0 && (
            <img
              src={excelimg}
              className="ml-3"
              style={{ width: "34px", height: "24px", cursor: "pointer" }}
              onClick={() => ExportToExcel(tableData)}
              title="Click to Download Excel"
            ></img>
          )}
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card mt-2">
          <Heading title="Search Details" />
          <Tables
            thead={ageingTHEAD}
            tbody={tableData?.map((ele, index) => ({
              ID: ele?.ID,
              Project: "",
              Reporter: "",
              AssignTo: "",
              DateSubmitted: "",
              DateDifference: "",
              Category: "",
              Summary: "",
              Status: "",
              DeliveryDate: "",
              DeliveryDateChangeCount: "",
              Hold: "",
            }))}
            tableHeight={"tableHeight"}
          />
        </div>
      )}
    </>
  );
};

export default AgeingSheet;
