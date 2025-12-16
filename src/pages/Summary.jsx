import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../components/UI/customTable";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import axios from "axios";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import Loading from "../components/loader/Loading";
import excelimg from "../../src/assets/image/excel.png";
import {
  exportHtmlToPDF,
  ExportToExcel,
  ExportToPDF,
} from "../networkServices/Tools";
import pdf from "../../src/assets/image/pdf.png";
import SlideScreen from "./SlideScreen";
import SeeMoreSlideScreen from "../components/SearchableTable/SeeMoreSlideScreen";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import DatePicker from "../components/formComponent/DatePicker";
import ReactSelect from "../components/formComponent/ReactSelect";
import moment from "moment/moment";
import { toast } from "react-toastify";
import SummaryFilter from "./SummaryFilter";
import { axiosInstances } from "../networkServices/axiosInstance";

const Summary = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [loading, setLoading] = useState(false);
  const [moduleName, setModuleName] = useState([]);
  const [byProject, setByProject] = useState([]);
  const [ageingSheet, setageingSheet] = useState([]);
  const [byCategory, setbyCategory] = useState([]);
  const [developerStatus, setdeveloperStatus] = useState([]);
  const [byStatus, setbyStatus] = useState([]);
  const [longestOpen, setlongestOpen] = useState([]);
  const [byPriority, setbyPriority] = useState([]);
  const [reporterStatus, setreporterStatus] = useState([]);
  const [reporterByResolution, setReporterByResolution] = useState([]);
  const [developerByResolution, setDeveloperByResolution] = useState([]);
  const [module1, setModule1] = useState([]);
  const [module2, setModule2] = useState([]);
  const [module3, setModule3] = useState([]);
  const [module4, setModule4] = useState([]);
  const [columnConfig, setColumnConfig] = useState([]);

  const [listVisible, setListVisible] = useState(false);
  const searchFilter = [
    { name: "By Project", code: "1" },
    { name: "Ageing Sheet", code: "2" },
    { name: "By Category", code: "3" },
    { name: "Developer Status", code: "4" },
    { name: "By Status", code: "5" },
    { name: "By Priority", code: "6" },
    { name: "Reporter Status", code: "7" },
    { name: "Reporter By Resolution", code: "8" },
    { name: "Developer By Resolution", code: "9" },
    { name: "Longest Open", code: "10" },
    { name: "Module-Wise Summary Report", code: "11" },
    { name: "Module Status Summary (Based on Open Points)", code: "12" },
    { name: "Module Category Breakdown (Based on Open Points)", code: "13" },
    { name: "Project-Wise Module Status Summary", code: "14" },
  ];

  const shortenNamesummary = (name) => {
    return name?.length > 10 ? name?.substring(0, 5) + "..." : name;
  };
  const [formData, setFormData] = useState({
    ProjectID: [],
    TeamID: [],
    WingID: [],
    VerticalID: [],
    DateType: "1",
    DateRange: "",
    POC1: [],
    POC2: [],
    POC3: [],
    AsDate: "",
    FromDate: new Date(),
    ToDate: new Date(),
    SearchFilter: searchFilter.map((option) => option.code),
    ModuleName: [],
  });

  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const ModalComponent = (name, component) => {
    setListVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };
  const [seeMore, setSeeMore] = useState([]);

  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [project, setProject] = useState([]);
  const [wing, setWing] = useState([]);
  const [poc1, setPoc1] = useState([]);
  const [poc2, setPoc2] = useState([]);
  const [poc3, setPoc3] = useState([]);

  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };

  const handleSearchfilter = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
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

  const getModule = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "RoleID",
    //     useCryptoLocalStorage("user_Data", "get", "RoleID")
    //   ),
    //   form.append("ProjectID", formData?.ProjectID),
    //   form.append("IsActive", "1"),
    //   form.append("IsMaster", "2"),
    //   axios
    //     .post(apiUrls?.Module_Select, form, { headers })
    axiosInstances
      .post(apiUrls.Module_Select, {
        ProjectID: String(formData?.ProjectID),
        IsActive: String("1"),
        IsMaster: String("2"),
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { name: item?.ModuleName, code: item?.ModuleID };
        });
        setModuleName(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getPOC3 = () => {
    axiosInstances
      .post(apiUrls.POC_3_Select, {})
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   axios
      //     .post(apiUrls?.POC_3_Select, form, { headers })
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

  const handleSummaryDetails = () => {
    console.log("formData", formData);
    // Validation for DateRange
    if (formData?.DateRange === "1" && !formData?.ToDate) {
      toast.error("Please select To Date.");
      return;
    }

    if (formData?.DateRange === "2") {
      if (!formData?.FromDate) {
        toast.error("Please select From Date.");
        return;
      }
      if (!formData?.ToDate) {
        toast.error("Please select To Date.");
        return;
      }
    }
    setLoading(true);
    axiosInstances
      .post(apiUrls.MantisSummary_Search, {
        ID: useCryptoLocalStorage("user_Data", "get", "ID"),
        DateType: formData?.DateType,
        DateRange: formData?.DateRange,
        FromDate: moment(formData?.FromDate).format("YYYY-MM-DD")
          ? moment(formData?.FromDate).format("YYYY-MM-DD")
          : "",
        ToDate: moment(formData?.ToDate).format("YYYY-MM-DD"),
        ProjectIDs: formData?.ProjectID,
        VerticalIDs: formData?.VerticalID,
        TeamIDs: formData?.TeamID,
        WingIDs: formData?.WingID,
        POC1s: formData?.POC1,
        POC2s: formData?.POC2,
        POC3s: formData?.POC3,
        ModuleID: formData?.ModuleName,
        DeveloperID: useCryptoLocalStorage("user_Data", "get", "ID"),
      })
      .then((res) => {
        console.log("check Response", res?.data?.status);
        const data = res?.data;
        if (res?.data?.status === true) {
          setByProject(data?.dtProject);
          setbyStatus(data?.dtStatus);
          setbyCategory(data?.dtCategory);
          setdeveloperStatus(data?.dtAssignTo);
          setlongestOpen(data?.dtLongestOpen);
          setreporterStatus(data?.dtReporter);
          setageingSheet(data?.dtAgeing);
          setReporterByResolution(data?.dtReporterResolution);
          setDeveloperByResolution(data?.dtAssignToResolution);
          setbyPriority(data?.dtPriority);
          setModule1(data?.dtModule4);
          setModule2(data?.dtModule3);
          setModule3(data?.dtModule2);
          setModule4(data?.dtModule1);
          setLoading(false);
        } else {
          toast.error(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const shortenName = (name) => {
    return name?.length > 95 ? name?.substring(0, 25) + "..." : name;
  };
  const shortenName1 = (name) => {
    return name?.length > 30 ? name?.substring(0, 25) + "..." : name;
  };

  const handleDeliveryChange = (name, e) => {
    const { value } = e;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    getVertical();
    getTeam();
    getWing();
    getProject();
    getPOC1();
    getPOC2();
    getPOC3();
    getModule();
  }, []);
  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const projectTHEAD = [
    t("Project Name"),
    t("Open"),
    t("Resolved"),
    t("Closed"),
    t("Total"),
    t("Resolved Ratio"),
    t("Ratio"),
  ];
  const statusTHEAD = [
    t("Status"),
    t("Open"),
    t("Resolved"),
    t("Closed"),
    t("Total"),
    t("Resolved Ratio"),
    t("Ratio"),
  ];
  const categoryTHEAD = [
    t("Category Name"),
    t("Open"),
    t("Resolved"),
    t("Closed"),
    t("Total"),
    t("Resolved Ratio"),
    t("Ratio"),
  ];
  const developerTHEAD = [
    t("Developer Name"),
    t("Open"),
    t("Resolved"),
    t("Closed"),
    t("Total"),
    t("Resolved Ratio"),
    t("Ratio"),
  ];

  const longestopenTHEAD = [
    t("TicketID"),
    t("Longest Open(Summary)"),
    t("Days"),
  ];
  const priorityTHEAD = [
    t("Priority"),
    t("Open"),
    t("Resolved"),
    t("Closed"),
    t("Total"),
    t("Resolved Ratio"),
    t("Ratio"),
  ];
  const reporterstatusTHEAD = [
    t("Reporter Name"),
    t("Open"),
    t("Resolved"),
    t("Closed"),
    t("Total"),
    t("Resolved Ratio"),
    t("Ratio"),
  ];

  const ageingsheetTHEAD = [
    t("Project Name"),
    t("Open_7Days"),
    t("Open_7_15Days"),
    t("Open_15_30Days"),
    t("Open_30_180Days"),
    t("Open_More_180Days"),
    t("TotalTicket"),
  ];

  const ReporterByResolutionTHEAD = [
    t("Reporter By Resolution"),
    t("Open"),
    t("Fixed"),
    t("Hold"),
    t("ReOpened"),
    t("Total"),
  ];
  const moduleTHEAD = [
    t("ModuleName"),
    t("Open"),
    t("Resolved"),
    t("Closed"),
    t("Total"),
    t("Resolved %"),
  ];
  const module3THEAD = [
    t("ModuleName"),
    t("Bug"),
    t("Modification"),
    t("New Requirement"),
    t("Paid Request"),
    t("Support"),
    t("Training"),
    t("Others"),
    t("Total"),
  ];
  const module4THEAD = [
    t("ModuleName"),
    t("Project"),
    t("Total"),
    t("Bugs(Open)"),
    t("Bugs(Resolved)"),
    t("Bugs(Closed)"),
    t("Mods(Open)"),
    t("Mods(Resolved)"),
    t("Mods(Closed)"),
    // t("Support(Open)"),
    // t("Support(Resolved)"),
    // t("Support(Closed)"),
    t("Others(Open)"),
    t("Others(Resolved)"),
    t("Others(Closed)"),
  ];

  const DeveloperByResolutionTHEAD = [
    t("Developer By Resolution"),
    t("Open"),
    t("Fixed"),
    t("Hold"),
    t("ReOpened"),
    t("Total"),
  ];

  const moduleSummaryTHEAD = [
    t("ModuleName"),
    t("New"),
    t("Assigned with/Delivery"),
    t("No Delivery Date"),
    t("Delayed"),
    t("On Hold"),
    t("Done On UAT"),
    t("Total"),
  ];
  const handleOpenNewTab = (ele) => {
    localStorage.setItem("summaryByStatus", JSON.stringify(ele));
    window.open("/viewissues", "_blank");
  };
  const handleOpenNewTabPriority = (ele) => {
    localStorage.setItem("summaryByPriority", JSON.stringify(ele));
    window.open("/viewissues", "_blank");
  };
  const handleOpenNewTabCategory = (ele) => {
    // console.log(ele)
    localStorage.setItem("summaryByCategory", JSON.stringify(ele));
    window.open("/viewissues", "_blank");
  };
  const handleOpenNewTabProject = (ele) => {
    console.log(ele);
    console.log(JSON.stringify(ele));
    localStorage.setItem("summaryByProject", JSON.stringify(ele));
    window.open("/viewissues", "_blank");
  };

  const handleOpenNewTabAssignedTo = (ele) => {
    localStorage.setItem("summaryByAssignedTo", JSON.stringify(ele));
    window.open("/viewissues", "_blank");
  };
  const handleOpenNewTabReporter = (ele) => {
    localStorage.setItem("summaryByReporter", JSON.stringify(ele));
    window.open("/viewissues", "_blank");
  };

  const processedData = byStatus?.map((ele, index) => ({
    ...ele,
    isLastRow: index === byStatus.length - 1,
  }));

  const processedDataCategory = byCategory?.map((ele, index) => ({
    ...ele,
    isLastRow: index === byCategory.length - 1,
  }));
  const processedDataAssignedTo = developerStatus?.map((ele, index) => ({
    ...ele,
    isLastRow: index === developerStatus.length - 1,
  }));
  const processedDataReporter = reporterStatus?.map((ele, index) => ({
    ...ele,
    isLastRow: index === reporterStatus.length - 1,
  }));

  const processedDataProject = byProject?.map((ele, index) => ({
    ...ele,
    isLastRow: index === byProject.length - 1,
  }));
  const processedDataPriority = byPriority?.map((ele, index) => ({
    ...ele,
    isLastRow: index === byPriority?.length - 1,
  }));
  const processedDataResolution = reporterByResolution?.map((ele, index) => ({
    ...ele,
    isLastRow: index === reporterByResolution?.length - 1,
  }));
  const processedDataDeveloper = developerByResolution?.map((ele, index) => ({
    ...ele,
    isLastRow: index === developerByResolution?.length - 1,
  }));
  const processedDataModule4 = module4?.map((ele, index) => ({
    ...ele,
    isLastRow: index === module4?.length - 1,
  }));
  const processedDataModule3 = module3?.map((ele, index) => ({
    ...ele,
    isLastRow: index === module3?.length - 1,
  }));
  const processedDataModule2 = module2?.map((ele, index) => ({
    ...ele,
    isLastRow: index === module2?.length - 1,
  }));
  const processedDataModule1 = module1?.map((ele, index) => ({
    ...ele,
    isLastRow: index === module1?.length - 1,
  }));
  const processedDataAgeingSheet = ageingSheet?.map((ele, index) => ({
    ...ele,
    isLastRow: index === ageingSheet?.length - 1,
  }));

  return (
    <>
      <div className="card Summary border">
        <Heading title={t("Summary")} isBreadcrumb={true} />
        <div className="row m-2">
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="ProjectID"
            placeholderName={t("Project")}
            dynamicOptions={project}
            handleChange={handleMultiSelectChange}
            value={formData?.ProjectID?.map((code) => ({
              code,
              name: project.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="VerticalID"
            placeholderName={t("Vertical")}
            dynamicOptions={vertical}
            optionLabel="VerticalID"
            className="VerticalID"
            handleChange={handleMultiSelectChange}
            value={formData?.VerticalID?.map((code) => ({
              code,
              name: vertical.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="TeamID"
            placeholderName={t("Team")}
            dynamicOptions={team}
            handleChange={handleMultiSelectChange}
            value={formData?.TeamID?.map((code) => ({
              code,
              name: team.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="WingID"
            placeholderName={t("Wing")}
            dynamicOptions={wing}
            handleChange={handleMultiSelectChange}
            value={formData?.WingID?.map((code) => ({
              code,
              name: wing.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="POC1"
            placeholderName={t("POC-I")}
            dynamicOptions={poc1}
            handleChange={handleMultiSelectChange}
            value={formData?.POC1?.map((code) => ({
              code,
              name: poc1.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="POC2"
            placeholderName={t("POC-II")}
            dynamicOptions={poc2}
            handleChange={handleMultiSelectChange}
            value={formData?.POC2?.map((code) => ({
              code,
              name: poc2.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="POC3"
            placeholderName={t("POC-III")}
            dynamicOptions={poc3}
            handleChange={handleMultiSelectChange}
            value={formData?.POC3?.map((code) => ({
              code,
              name: poc3.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="ModuleName"
            placeholderName={t("Module Name")}
            dynamicOptions={moduleName}
            value={
              Array.isArray(formData?.ModuleName)
                ? formData?.ModuleName?.map((code) => ({
                    code,
                    name: moduleName?.find((item) => item.code === code)?.name,
                  }))
                : []
            }
            handleChange={handleMultiSelectChange}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="DateType"
            placeholderName="DateType"
            dynamicOptions={[{ label: "EntryDate", value: "1" }]}
            handleChange={handleDeliveryChange}
            value={formData.DateType}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="DateRange"
            placeholderName="Date Range"
            dynamicOptions={[
              { label: "AsOnDate", value: "1" },
              { label: "Range", value: "2" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.DateRange}
          />
          {formData?.DateRange == "1" && (
            <>
              <DatePicker
                className="custom-calendar"
                id="ToDate"
                name="ToDate"
                lable={t("To Date")}
                placeholder={VITE_DATE_FORMAT}
                value={formData?.ToDate}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                handleChange={searchHandleChange}
                // requiredClassName={"required-fields"}
              />
            </>
          )}
          {formData?.DateRange == "2" && (
            <>
              <DatePicker
                className="custom-calendar"
                id="FromDate"
                name="FromDate"
                lable={t("From Date")}
                placeholder={VITE_DATE_FORMAT}
                value={formData?.FromDate}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                handleChange={searchHandleChange}
              />
              <DatePicker
                className="custom-calendar"
                id="ToDate"
                name="ToDate"
                lable={t("To Date")}
                placeholder={VITE_DATE_FORMAT}
                value={formData?.ToDate}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                handleChange={searchHandleChange}
              />
            </>
          )}
          <button
            className="btn btn-sm btn-primary ml-2"
            onClick={handleSummaryDetails}
          >
            {t("Search")}
          </button>

          {/* <div className="d-flex">
            <span className="mt-1 ml-4" style={{ fontWeight: "bold" }}>
              {t("Click Icon To Filter Results")}{" "}
            </span>
            <span
              className="header ml-1 mt-1"
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              <SummaryFilter
                columnConfig={columnConfig}
                setColumnConfig={setColumnConfig}
                PageName="Summary"
              />
            </span>
          </div> */}
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
            {byProject?.length > 0 ||
            ageingSheet?.length > 0 ||
            byCategory?.length > 0 ||
            developerStatus?.length > 0 ||
            byStatus?.length > 0 ||
            longestOpen?.length > 0 ||
            byPriority?.length > 0 ||
            reporterStatus?.length > 0 ||
            reporterByResolution?.length > 0 ||
            developerByResolution?.length > 0 ? (
              <div className="col-12">
                <Heading
                  title={
                    <span style={{ fontWeight: "bold" }}>
                      {t("Search Details")}
                    </span>
                  }
                  secondTitle={
                    <div className="m-0 p-0">
                      <MultiSelectComp
                        respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                        name="SearchFilter"
                        placeholderName={t("Search Filter")}
                        dynamicOptions={searchFilter}
                        optionLabel="SearchFilter"
                        className="SearchFilter"
                        handleChange={handleSearchfilter}
                        value={formData?.SearchFilter?.map((code) => ({
                          code,
                          name: searchFilter.find((item) => item.code === code)
                            ?.name,
                        }))}
                      />
                    </div>
                  }
                />
                <div className="row g-4 mt-2">
                  {formData?.SearchFilter?.includes("1") && (
                    <div className="col-sm-6">
                      <Heading
                        title={
                          <span style={{ fontWeight: "bold" }}>
                            {t("By Project")}
                          </span>
                        }
                        secondTitle={
                          <div className="d-flex">
                            <>
                              <img
                                src={excelimg}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToExcel(byProject)}
                              ></img>
                              <img
                                src={pdf}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                // onClick={() => exportHtmlToPDF(byProject)}
                                onClick={() => ExportToPDF(byProject)}
                              ></img>
                              <span style={{ fontWeight: "bold" }}>
                                {t("Total Record")} : &nbsp;{" "}
                                {byProject[0]?.TotalRecord}
                              </span>
                            </>
                          </div>
                        }
                      />
                      <Tables
                        thead={projectTHEAD}
                        tbody={processedDataProject?.map((ele, index) => ({
                          "Project Name": (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                              }}
                            >
                              <span
                                id={`ProjectName-${index}`}
                                targrt={`ProjectName-${index}`}
                                title={ele?.ProjectName}
                              >
                                {shortenName1(ele?.ProjectName)}
                              </span>
                            </span>
                          ),

                          Open: (
                            <>
                              {/* <span
                                style={{
                                  fontWeight: ele.isLastRow ? "bold" : "normal",
                                }}
                              >
                                {ele?.OpenTicket}
                              </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabProject(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.OpenTicket}
                                  </span>
                                  {/* <span title="More Actions">
                                  <AmountSubmissionSeeMoreList
                                    ModalComponent={ModalComponent}
                                    setSeeMore={setSeeMore}
                                    data={ele}
                                    setVisible={() => {
                                      setListVisible(false);
                                    }}
                                    handleBindFrameMenu={[
                                      {
                                        FileName: "View Issues",
                                        URL: "ViewIssues",
                                        FrameName: "ViewIssues",
                                        Description: "ViewIssues",
                                      },
                                    ]}
                                    isShowPatient={true}
                                  />
                                </span> */}
                                </span>
                              </>
                            </>
                          ),
                          Resolved: (
                            <>
                              {/* <span
                                style={{
                                  fontWeight: ele.isLastRow ? "bold" : "normal",
                                }}
                              >
                                {ele?.ResolvedTicket}
                              </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabProject(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.ResolvedTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          Closed: (
                            <>
                              {/* <span
                                style={{
                                  fontWeight: ele.isLastRow ? "bold" : "normal",
                                }}
                              >
                                {ele?.ClosedTicket}
                              </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabProject(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.ClosedTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          Total: (
                            <>
                              {/* <span
                                style={{
                                  fontWeight: ele.isLastRow ? "bold" : "normal",
                                }}
                              >
                                {ele?.Total}
                              </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabProject(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.Total}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          "Resolved Ratio": ele?.Resolved_Ratio,
                          Ratio: ele?.Open_Ratio,
                        }))}
                        tableHeight={"tableHeight"}
                      />
                      <SlideScreen
                        visible={listVisible}
                        setVisible={() => {
                          setListVisible(false);
                          setRenderComponent({
                            name: null,
                            component: null,
                          });
                        }}
                        Header={
                          <SeeMoreSlideScreen
                            name={renderComponent?.name}
                            seeMore={seeMore}
                            handleChangeComponent={handleChangeComponent}
                          />
                        }
                      >
                        {renderComponent?.component}
                      </SlideScreen>
                      <div></div>
                    </div>
                  )}
                  {formData?.SearchFilter?.includes("2") && (
                    <div className="col-sm-6">
                      <Heading
                        title={
                          <span style={{ fontWeight: "bold" }}>
                            {t("Ageing Sheet")}
                          </span>
                        }
                        secondTitle={
                          <>
                            <div className="d-flex">
                              <img
                                src={excelimg}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToExcel(ageingSheet)}
                              ></img>
                              <img
                                src={pdf}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToPDF(ageingSheet)}
                              ></img>
                              <div>
                                <span style={{ fontWeight: "bold" }}>
                                  {t("Total Record")} : &nbsp;
                                  {ageingSheet[0]?.TotalRecord}
                                </span>
                              </div>
                            </div>
                          </>
                        }
                      />
                      <Tables
                        thead={ageingsheetTHEAD}
                        tbody={processedDataAgeingSheet?.map((ele, index) => ({
                          "Project Name": (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                              id={`ProjectName-${index}`}
                              targrt={`ProjectName-${index}`}
                              title={ele?.ProjectName}
                              // style={{ wordWrap: "break-word", whiteSpace: "normal" }}
                            >
                              {shortenName1(ele?.ProjectName)}
                            </span>
                          ),

                          Open_7Days: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.Open_7Days}
                            </span>
                          ),
                          Open_7_15Days: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.Open_7_15Days}
                            </span>
                          ),
                          Open_15_30Days: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.Open_15_30Days}
                            </span>
                          ),
                          Open_30_180Days: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.Open_30_180Days}
                            </span>
                          ),
                          Open_More_180Days: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.Open_More_180Days}
                            </span>
                          ),
                          TotalTicket: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.TotalTicket}
                            </span>
                          ),
                        }))}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  )}
                </div>

                <div className="row g-4 mt-3">
                  {formData?.SearchFilter?.includes("3") && (
                    <div className="col-sm-6">
                      <Heading
                        title={
                          <span style={{ fontWeight: "bold" }}>
                            {t("By Category")}
                          </span>
                        }
                        secondTitle={
                          <div className="d-flex">
                            <>
                              <img
                                src={excelimg}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToExcel(byCategory)}
                              ></img>
                              <img
                                src={pdf}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToPDF(byCategory)}
                              ></img>
                              <span style={{ fontWeight: "bold" }}>
                                {t("Total Record")} : &nbsp;{" "}
                                {byCategory[0]?.TotalRecord}
                              </span>{" "}
                            </>
                          </div>
                        }
                      />
                      <Tables
                        thead={categoryTHEAD}
                        tbody={processedDataCategory?.map((ele, index) => ({
                          "Category Name": (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                              }}
                            >
                              {ele?.CategoryName}
                            </span>
                          ),
                          Open: (
                            <>
                              {/* <span
                                style={{
                                  fontWeight: ele.isLastRow ? "bold" : "normal",
                                }}
                              >
                                {ele?.OpenTicket}
                              </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabCategory(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.OpenTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          Resolved: (
                            <>
                              {/* <span
                                style={{
                                  fontWeight: ele.isLastRow ? "bold" : "normal",
                                }}
                              >
                                {ele?.ResolvedTicket}
                              </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabCategory(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.ResolvedTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          Closed: (
                            <>
                              {/* <span
                                style={{
                                  fontWeight: ele.isLastRow ? "bold" : "normal",
                                }}
                              >
                                {ele?.ClosedTicket}
                              </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabCategory(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.ClosedTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          Total: (
                            <>
                              {/* <span
                                style={{
                                  fontWeight: ele.isLastRow ? "bold" : "normal",
                                }}
                              >
                                {ele?.Total}
                              </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabCategory(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.Total}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          "Resolved Ratio": ele?.Resolved_Ratio,
                          Ratio: ele?.Open_Ratio,
                        }))}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  )}
                  {formData?.SearchFilter?.includes("4") && (
                    <div className="col-sm-6">
                      <Heading
                        title={
                          <span style={{ fontWeight: "bold" }}>
                            {t("Developer Status")}
                          </span>
                        }
                        secondTitle={
                          <div className="d-flex">
                            <>
                              <img
                                src={excelimg}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToExcel(developerStatus)}
                              ></img>
                              <img
                                src={pdf}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToPDF(developerStatus)}
                              ></img>
                              <span style={{ fontWeight: "bold" }}>
                                {t("Total Record")} : &nbsp;
                                {developerStatus[0]?.TotalRecord}
                              </span>{" "}
                            </>
                          </div>
                        }
                      />
                      <Tables
                        thead={developerTHEAD}
                        tbody={processedDataAssignedTo?.map((ele, index) => ({
                          "Developer Name": (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                              }}
                            >
                              {ele?.AssignTo}
                            </span>
                          ),
                          Open: (
                            <>
                              {/* <span
                                  style={{
                                    fontWeight: ele.isLastRow ? "bold" : "normal",
                                  }}
                                >
                                  {ele?.OpenTicket}
                                </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabAssignedTo(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.OpenTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          Resolved: (
                            <>
                              {/* <span
                                  style={{
                                    fontWeight: ele.isLastRow ? "bold" : "normal",
                                  }}
                                >
                                  {ele?.ResolvedTicket}
                                </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabAssignedTo(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.ResolvedTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          Closed: (
                            <>
                              {/* <span
                                  style={{
                                    fontWeight: ele.isLastRow ? "bold" : "normal",
                                  }}
                                >
                                  {ele?.ClosedTicket}
                                </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabAssignedTo(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.ClosedTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          Total: (
                            <>
                              {/* <span
                                  style={{
                                    fontWeight: ele.isLastRow ? "bold" : "normal",
                                  }}
                                >
                                  {ele?.Total}
                                </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabAssignedTo(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.Total}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          "Resolved Ratio": ele?.Resolved_Ratio,
                          Ratio: ele?.Open_Ratio,
                        }))}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  )}
                </div>

                <div className="row g-4 mt-3">
                  {formData?.SearchFilter?.includes("5") && (
                    <div className="col-sm-6">
                      <Heading
                        title={
                          <span style={{ fontWeight: "bold" }}>
                            {t("By Status")}
                          </span>
                        }
                        secondTitle={
                          <div className="d-flex">
                            <>
                              <img
                                src={excelimg}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToExcel(byStatus)}
                              ></img>
                              <img
                                src={pdf}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToPDF(byStatus)}
                              ></img>
                              <span style={{ fontWeight: "bold" }}>
                                {t("Total Record")} : &nbsp;{" "}
                                {byStatus[0]?.TotalRecord}
                              </span>{" "}
                            </>
                          </div>
                        }
                      />
                      <Tables
                        thead={statusTHEAD}
                        tbody={processedData?.map((ele, index) => ({
                          // Status:(<span style={{fontWeight:"bold"}}>{ele?.StatusName}</span>) ,
                          Status: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                              }}
                            >
                              {ele?.StatusName}
                            </span>
                          ),
                          // Open: ele?.OpenTicket,
                          Open: (
                            <>
                              <span
                                onClick={() => {
                                  handleOpenNewTab(ele);
                                }}
                                style={{ color: "#03a0e7" }}
                              >
                                <span
                                  style={{
                                    fontWeight: ele.isLastRow
                                      ? "bold"
                                      : "normal",
                                    color: ele.isLastRow ? "black" : "#03a0e7",
                                  }}
                                >
                                  {ele?.OpenTicket}
                                </span>
                                {/* {ele?.OpenTicket} */}
                                {/* <Link
                            to="/viewissues"
                            state={{ myStateData: ele?.StatusID}}
                            // target="_blank"
                            style={{ cursor: "pointer" }}
                          >
                            {ele?.OpenTicket}
                          </Link> */}
                              </span>
                            </>
                          ),
                          Resolved: (
                            <>
                              {/* <span
                                style={{
                                  fontWeight: ele.isLastRow ? "bold" : "normal",
                                }}
                              >
                                {ele?.ResolvedTicket}
                              </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTab(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.ResolvedTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),

                          Closed: (
                            <>
                              {/* <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                              }}
                            >
                              {ele?.ClosedTicket}
                            </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTab(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.ClosedTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),

                          Total: (
                            <>
                              {/* <span
                                style={{
                                  fontWeight: ele.isLastRow ? "bold" : "normal",
                                }}
                              >
                                {ele?.Total}
                              </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTab(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.Total}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          "Resolved Ratio": ele?.Resolved_Ratio,
                          Ratio: ele?.Open_Ratio,
                        }))}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  )}
                  {formData?.SearchFilter?.includes("6") && (
                    <div className="col-sm-6">
                      <Heading
                        title={
                          <span style={{ fontWeight: "bold" }}>
                            {t("By Priority")}
                          </span>
                        }
                        secondTitle={
                          <div className="d-flex">
                            <>
                              <img
                                src={excelimg}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToExcel(byPriority)}
                              ></img>
                              <img
                                src={pdf}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToPDF(byPriority)}
                              ></img>
                              <span style={{ fontWeight: "bold" }}>
                                {t("Total Record")} : &nbsp;
                                {byPriority[0]?.TotalRecord}
                              </span>
                            </>
                          </div>
                        }
                      />
                      <Tables
                        thead={priorityTHEAD}
                        tbody={processedDataPriority?.map((ele, index) => ({
                          Priority: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                              }}
                            >
                              {ele?.PriorityName}
                            </span>
                          ),
                          Open: (
                            <>
                              {/* <span
                                  style={{
                                    fontWeight: ele.isLastRow ? "bold" : "normal",
                                  }}
                                >
                                  {ele?.OpenTicket}
                                </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabPriority(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.OpenTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          Resolved: (
                            <>
                              {/* <span
                                  style={{
                                    fontWeight: ele.isLastRow ? "bold" : "normal",
                                  }}
                                >
                                  {ele?.ResolvedTicket}
                                </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabPriority(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.ResolvedTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          Closed: (
                            <>
                              {/* <span
                                  style={{
                                    fontWeight: ele.isLastRow ? "bold" : "normal",
                                  }}
                                >
                                  {ele?.ClosedTicket}
                                </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabPriority(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.ClosedTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          Total: (
                            <>
                              {/* <span
                                  style={{
                                    fontWeight: ele.isLastRow ? "bold" : "normal",
                                  }}
                                >
                                  {ele?.Total}
                                </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabPriority(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.Total}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          "Resolved Ratio": ele?.Resolved_Ratio,
                          Ratio: ele?.Open_Ratio,
                        }))}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  )}
                </div>

                <div className="row g-4 mt-3">
                  {formData?.SearchFilter?.includes("10") && (
                    <div className="col-sm-6">
                      <Heading
                        title={
                          <span style={{ fontWeight: "bold" }}>
                            {t("Longest Open")}
                          </span>
                        }
                        secondTitle={
                          <div className="d-flex">
                            <>
                              <img
                                src={excelimg}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToExcel(longestOpen)}
                              ></img>
                              <img
                                src={pdf}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToPDF(longestOpen)}
                              ></img>
                              <span style={{ fontWeight: "bold" }}>
                                {t("Total Record")} : &nbsp;{" "}
                                {longestOpen[0]?.TotalRecord}
                              </span>
                            </>
                          </div>
                        }
                      />
                      <Tables
                        thead={longestopenTHEAD}
                        tbody={longestOpen?.map((ele, index) => ({
                          TicketID: ele?.TicketId,
                          "Longest Open(Summary)": (
                            <span
                              id={`summary-${index}`}
                              targrt={`summary-${index}`}
                              title={ele?.summary}
                              // style={{ wordWrap: "break-word", whiteSpace: "normal" }}
                            >
                              {shortenName(ele?.summary)}
                            </span>
                          ),
                          Days: ele?.datedifference,
                          colorcode: ele?.rowColor,
                        }))}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  )}
                  {formData?.SearchFilter?.includes("7") && (
                    <div className="col-sm-6">
                      <Heading
                        title={
                          <span style={{ fontWeight: "bold" }}>
                            {t("Reporter Status")}
                          </span>
                        }
                        secondTitle={
                          <div className="d-flex">
                            <>
                              <img
                                src={excelimg}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToExcel(reporterStatus)}
                              ></img>
                              <img
                                src={pdf}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToPDF(reporterStatus)}
                              ></img>
                              <span style={{ fontWeight: "bold" }}>
                                {t("Total Record")} : &nbsp;
                                {reporterStatus[0]?.TotalRecord}
                              </span>
                            </>
                          </div>
                        }
                      />
                      <Tables
                        thead={reporterstatusTHEAD}
                        tbody={processedDataReporter?.map((ele, index) => ({
                          "Reporter Name": (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                              }}
                            >
                              {ele?.ReporterName}
                            </span>
                          ),
                          Open: (
                            <>
                              {/* <span
                                  style={{
                                    fontWeight: ele.isLastRow ? "bold" : "normal",
                                  }}
                                >
                                  {ele?.OpenTicket}
                                </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabReporter(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.OpenTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          Resolved: (
                            <>
                              {/* <span
                                  style={{
                                    fontWeight: ele.isLastRow ? "bold" : "normal",
                                  }}
                                >
                                  {ele?.ResolvedTicket}
                                </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabReporter(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.ResolvedTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          Closed: (
                            <>
                              {/* <span
                                  style={{
                                    fontWeight: ele.isLastRow ? "bold" : "normal",
                                  }}
                                >
                                  {ele?.ClosedTicket}
                                </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabReporter(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.ClosedTicket}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          Total: (
                            <>
                              {/* <span
                                  style={{
                                    fontWeight: ele.isLastRow ? "bold" : "normal",
                                  }}
                                >
                                  {ele?.Total}
                                </span> */}

                              <>
                                <span
                                  onClick={() => {
                                    handleOpenNewTabReporter(ele);
                                  }}
                                  style={{ color: "#03a0e7" }}
                                >
                                  <span
                                    style={{
                                      fontWeight: ele.isLastRow
                                        ? "bold"
                                        : "normal",
                                      color: ele.isLastRow
                                        ? "black"
                                        : "#03a0e7",
                                    }}
                                  >
                                    {ele?.Total}
                                  </span>
                                </span>
                              </>
                            </>
                          ),
                          "Resolved Ratio": ele?.Resolved_Ratio,
                          Ratio: ele?.Open_Ratio,
                        }))}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  )}
                </div>

                <div className="row g-4 mt-3">
                  {formData?.SearchFilter?.includes("8") && (
                    <div className="col-sm-6">
                      <Heading
                        title={
                          <span style={{ fontWeight: "bold" }}>
                            {t("Reporter By Resolution")}
                          </span>
                        }
                        secondTitle={
                          <div className="d-flex">
                            <>
                              <img
                                src={excelimg}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() =>
                                  ExportToExcel(reporterByResolution)
                                }
                              ></img>
                              <img
                                src={pdf}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() =>
                                  ExportToPDF(reporterByResolution)
                                }
                              ></img>
                              <span style={{ fontWeight: "bold" }}>
                                {t("Total Record")} : &nbsp;{" "}
                                {reporterByResolution[0]?.TotalRecord}
                              </span>{" "}
                            </>
                          </div>
                        }
                      />
                      <Tables
                        thead={ReporterByResolutionTHEAD}
                        tbody={processedDataResolution?.map((ele, index) => ({
                          "Reporter By Resolution": (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.ReporterName}
                            </span>
                          ),
                          Open: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.OpenTicket}
                            </span>
                          ),
                          Fixed: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.FixedTicket}
                            </span>
                          ),
                          Hold: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.HoldTicket}
                            </span>
                          ),
                          ReOpened: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.ReOpenTicket}
                            </span>
                          ),
                          Total: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.Total}
                            </span>
                          ),
                        }))}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  )}
                  {formData?.SearchFilter?.includes("9") && (
                    <div className="col-sm-6">
                      <Heading
                        title={
                          <span style={{ fontWeight: "bold" }}>
                            {t("Developer By Resolution")}
                          </span>
                        }
                        secondTitle={
                          <div className="d-flex">
                            <>
                              <img
                                src={excelimg}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() =>
                                  ExportToExcel(developerByResolution)
                                }
                              ></img>
                              <img
                                src={pdf}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() =>
                                  ExportToPDF(developerByResolution)
                                }
                              ></img>
                              <span style={{ fontWeight: "bold" }}>
                                {t("Total Record")} : &nbsp;
                                {developerByResolution[0]?.TotalRecord}
                              </span>
                            </>
                          </div>
                        }
                      />
                      <Tables
                        thead={DeveloperByResolutionTHEAD}
                        tbody={processedDataDeveloper?.map((ele, index) => ({
                          "Developer By Resolution": (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.AssignTo}
                            </span>
                          ),
                          Open: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.OpenTicket}
                            </span>
                          ),
                          Fixed: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.FixedTicket}
                            </span>
                          ),
                          Hold: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.HoldTicket}
                            </span>
                          ),
                          ReOpened: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.ReOpenTicket}
                            </span>
                          ),
                          Total: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: ele.isLastRow ? "black" : "black",
                              }}
                            >
                              {ele?.Total}
                            </span>
                          ),
                        }))}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  )}
                </div>

                <div className="row g-4 mt-3">
                  {formData?.SearchFilter?.includes("11") && (
                    <div className="col-sm-6">
                      <Heading
                        title={
                          <span style={{ fontWeight: "bold" }}>
                            {t("Module-Wise Summary Report")}
                          </span>
                        }
                        secondTitle={
                          <div className="d-flex">
                            <>
                              <img
                                src={excelimg}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToExcel(module1)}
                              ></img>
                              <img
                                src={pdf}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToPDF(module1)}
                              ></img>
                              <span style={{ fontWeight: "bold" }}>
                                {t("Total Record")} : &nbsp;{" "}
                                {module1[0]?.TotalRecord}
                              </span>{" "}
                            </>
                          </div>
                        }
                      />
                      <Tables
                        thead={moduleTHEAD}
                        tbody={processedDataModule1?.map((ele, index) => ({
                          "Module Name": (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                              }}
                            >
                              {ele?.ModuleName}
                            </span>
                          ),
                          Open: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                              }}
                            >
                              {ele?.OPEN}
                            </span>
                          ),
                          Resolved: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                              }}
                            >
                              {ele?.Resolved}
                            </span>
                          ),
                          Closed: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                              }}
                            >
                              {ele?.Closed}
                            </span>
                          ),
                          Total: (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                                color: "black",
                              }}
                            >
                              {ele?.Total}
                            </span>
                          ),
                          "Resolved %": (
                            <span
                              style={{
                                fontWeight: ele.isLastRow ? "bold" : "normal",
                              }}
                            >
                              {ele?.Resolved_Per}
                            </span>
                          ),
                        }))}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  )}

                  {formData?.SearchFilter?.includes("12") && (
                    <div className="col-sm-6">
                      <Heading
                        title={
                          <span style={{ fontWeight: "bold" }}>
                            {t("Module Status Summary (Based on Open Points)")}
                          </span>
                        }
                        secondTitle={
                          <div className="d-flex">
                            <>
                              <img
                                src={excelimg}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToExcel(module2)}
                              ></img>
                              <img
                                src={pdf}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToPDF(module2)}
                              ></img>
                              <span style={{ fontWeight: "bold" }}>
                                {t("Total Record")} : &nbsp;
                                {module2[0]?.TotalRecord}
                              </span>
                            </>
                          </div>
                        }
                      />
                      <Tables
                        thead={moduleSummaryTHEAD}
                        tbody={processedDataModule2?.map((ele, index) => {
                          const commonStyle = {
                            fontWeight: ele.isLastRow ? "bold" : "normal",
                          };

                          return {
                            ModuleName: (
                              <span style={commonStyle}>{ele?.ModuleName}</span>
                            ),
                            New: <span style={commonStyle}>{ele?.NEW}</span>,
                            "Assigned with/Delivery": (
                              <span style={commonStyle}>
                                {ele?.AssignedwithDelivery}
                              </span>
                            ),
                            "No Delivery Date": (
                              <span style={commonStyle}>
                                {ele?.NoDeliveryDate}
                              </span>
                            ),
                            Delayed: (
                              <span style={commonStyle}>{ele?.Delayed}</span>
                            ),
                            "On Hold": (
                              <span style={commonStyle}>{ele?.OnHold}</span>
                            ),
                            "Done On UAT": (
                              <span style={commonStyle}>{ele?.DoneOnUAT}</span>
                            ),
                            Total: (
                              <span style={commonStyle}>{ele?.Total}</span>
                            ),
                          };
                        })}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  )}
                </div>

                <div className="row g-4 mt-3">
                  {formData?.SearchFilter?.includes("13") && (
                    <div className="col-sm-6">
                      <Heading
                        title={
                          <span style={{ fontWeight: "bold" }}>
                            {t(
                              "Module Category Breakdown (Based on Open Points)"
                            )}
                          </span>
                        }
                        secondTitle={
                          <div className="d-flex">
                            <>
                              <img
                                src={excelimg}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToExcel(module3)}
                              ></img>
                              <img
                                src={pdf}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToPDF(module3)}
                              ></img>
                              <span style={{ fontWeight: "bold" }}>
                                {t("Total Record")} : &nbsp;{" "}
                                {module3[0]?.TotalRecord}
                              </span>{" "}
                            </>
                          </div>
                        }
                      />
                      <Tables
                        thead={module3THEAD}
                        tbody={processedDataModule3?.map((ele) => {
                          const boldStyle = {
                            fontWeight: ele.isLastRow ? "bold" : "normal",
                          };

                          return {
                            ModuleName: (
                              <span style={boldStyle}>{ele?.ModuleName}</span>
                            ),
                            Bug: <span style={boldStyle}>{ele?.Bug_Open}</span>,
                            Modification: (
                              <span style={boldStyle}>{ele?.Mod_Open}</span>
                            ),
                            "New Requirement": (
                              <span style={boldStyle}>{ele?.NewReq_Open}</span>
                            ),
                            "Paid Request": (
                              <span style={boldStyle}>{ele?.PaidReq_Open}</span>
                            ),
                            Support: (
                              <span style={boldStyle}>{ele?.Support_Open}</span>
                            ),
                            Training: (
                              <span style={boldStyle}>
                                {ele?.Training_Open}
                              </span>
                            ),
                            Others: (
                              <span style={boldStyle}>{ele?.Others_Open}</span>
                            ),
                            Total: (
                              <span style={boldStyle}>{ele?.TotalTicket}</span>
                            ),
                          };
                        })}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  )}

                  {formData?.SearchFilter?.includes("14") && (
                    <div className="col-sm-6">
                      <Heading
                        title={
                          <span style={{ fontWeight: "bold" }}>
                            {t("Project-Wise Module Status Summary")}
                          </span>
                        }
                        secondTitle={
                          <div className="d-flex">
                            <>
                              <img
                                src={excelimg}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToExcel(module4)}
                              ></img>
                              <img
                                src={pdf}
                                className=" ml-2"
                                style={{
                                  width: "20px",
                                  height: "15px",
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() => ExportToPDF(module4)}
                              ></img>
                              <span style={{ fontWeight: "bold" }}>
                                {t("Total Record")} : &nbsp;
                                {module4[0]?.TotalRecord}
                              </span>
                            </>
                          </div>
                        }
                      />
                      <Tables
                        thead={module4THEAD}
                        tbody={processedDataModule4?.map((ele, index) => {
                          const commonStyle = {
                            fontWeight: ele.isLastRow ? "bold" : "normal",
                          };

                          return {
                            ModuleName: (
                              <span style={commonStyle}>{ele?.ModuleName}</span>
                            ),
                            Project: (
                              <span style={commonStyle}>
                                {ele?.ProjectName}
                              </span>
                            ),
                            Total: (
                              <span style={commonStyle}>
                                {ele?.TotalTicket}
                              </span>
                            ),
                            "Bugs(Open)": (
                              <span style={commonStyle}>{ele?.Bug_Open}</span>
                            ),
                            "Bugs(Resolved)": (
                              <span style={commonStyle}>
                                {ele?.Bug_Resolved}
                              </span>
                            ),
                            "Bugs(Closed)": (
                              <span style={commonStyle}>{ele?.Bug_Closed}</span>
                            ),
                            "Mods(Open)": (
                              <span style={commonStyle}>{ele?.Mod_Open}</span>
                            ),
                            "Mods(Resolved)": (
                              <span style={commonStyle}>
                                {ele?.Mod_Resolved}
                              </span>
                            ),
                            "Mods(Closed)": (
                              <span style={commonStyle}>{ele?.Mod_Closed}</span>
                            ),
                            "Others(Open)": (
                              <span style={commonStyle}>{ele?.Other_Open}</span>
                            ),
                            "Others(Resolved)": (
                              <span style={commonStyle}>
                                {ele?.Other_Resolved}
                              </span>
                            ),
                            "Others(Closed)": (
                              <span style={commonStyle}>
                                {ele?.Other_Closed}
                              </span>
                            ),
                          };
                        })}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <NoRecordFound />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Summary;
