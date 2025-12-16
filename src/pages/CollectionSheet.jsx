import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../components/UI/Heading";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import { apiUrls } from "../networkServices/apiEndpoints";
import axios from "axios";
import { headers } from "../utils/apitools";
import excelimg from "../../src/assets/image/excel.png";
import { ExportToExcel } from "../networkServices/Tools";

import { collectTHEAD } from "../components/modalComponent/Utils/HealperThead";
import Modal from "../components/modalComponent/Modal";
import CollectMoneyModal from "./CollectMoneyModal";
import Loading from "../components/loader/Loading";
import ReactSelect from "../components/formComponent/ReactSelect";
import Input from "../components/formComponent/Input";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import SearchLotusFilter from "./SearchLotusFilter";
import Tables from "../components/UI/customTable";
import Accordion from "./Accordion";
import { axiosInstances } from "../networkServices/axiosInstance";

const CollectionSheet = () => {
  const [columnConfig, setColumnConfig] = useState([]);
  const isTableVisible = (header) =>
    columnConfig.find((f) => f?.header === header)?.visible;
  const [loading, setLoading] = useState(false);
  const staticHeaders = [
    "S.No",
    "Project Name",
    "POC",
    "Opening Balance",
    "Machine",
    "Centre",
    "Change Request",
    "Resource Billing",
    "SAAS",
    "AMC Amount",
    "AMC Date",
    "STotal",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "Total",
  ];
  const [tHead, setThead] = useState(collectTHEAD);

  const collectTHEADTable = staticHeaders
    .filter((header) =>
      isTableVisible(typeof header === "string" ? header : header.name)
    )
    .map((header) =>
      typeof header === "string"
        ? header
        : { name: header.name, width: header.width }
    );

  const [t] = useTranslation();
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);
  const [dynamicFilter, setDynamicFilter] = useState([]);
  const [poc1, setPoc1] = useState([]);
  const [poc2, setPoc2] = useState([]);
  const [project, setProject] = useState([]);
  const [poc3, setPoc3] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]);
  const [searchType, setsearchType] = useState([]);
  const [secondThead, setSecondThead] = useState([]);
  const [month, setMonth] = useState([
    { name: "Apr", code: "Apr" },
    { name: "May", code: "May" },
    { name: "June", code: "June" },
    { name: "July", code: "July" },
    { name: "Aug", code: "Aug" },
    { name: "Sep", code: "Sep" },
    { name: "Oct", code: "Oct" },
    { name: "Nov", code: "Nov" },
    { name: "Dec", code: "Dec" },
    { name: "Jan", code: "Jan" },
    { name: "Feb", code: "Feb" },
    { name: "Mar", code: "Mar" },
  ]);
  const [formData, setFormData] = useState({
    ProjectID: [],
    VerticalID: [],
    TeamID: [],
    WingID: [],
    POC1: [],
    POC2: [],
    POC3: [],
    FinancialYear: "2024-25",
    Month: [],
    SearchType: "Collection",
    POC_1: "",
    ProjectName: "",
  });

  useEffect(() => {
    const updateSecond = JSON.parse(JSON.stringify(secondThead));
    columnConfig.map((val, index) => {
      if (val?.visible) {
        updateSecond[index] = { ...updateSecond[index], visible: true };
      } else {
        updateSecond[index] = { ...updateSecond[index], visible: false };
      }
    });
    setSecondThead(updateSecond);
  }, [columnConfig, tableData?.length]);

  const SaveFilter = () => {
    axiosInstances
      .post(apiUrls.SaveFilterTableReprintData, {
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        PageName: "RecoverySheet",
        FilterData: "string",
      })
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        setLoading(true);
      });
  };

  const SaveTableFilter = () => {
    const filterData = [
      { header: "S.No", visible: true },
      { header: "Project Name", visible: true },
      { header: "POC", visible: true },
      { header: "Opening Balance", visible: true },
      { header: "Machine", visible: true },
      { header: "Centre", visible: true },
      { header: "Change Request", visible: true },
      { header: "Resource Billing", visible: true },
      { header: "SAAS", visible: true },
      { header: "AMC Amount", visible: true },
      { header: "AMC Date", visible: true },
      { header: "STotal", visible: true },
      { header: "April", visible: true },
      { header: "May", visible: true },
      { header: "June", visible: true },
      { header: "July", visible: true },
      { header: "August", visible: true },
      { header: "September", visible: true },
      { header: "October", visible: true },
      { header: "November", visible: true },
      { header: "December", visible: true },
      { header: "January", visible: true },
      { header: "February", visible: true },
      { header: "March", visible: true },
      { header: "Total", visible: true },
    ];

    axiosInstances
      .post(apiUrls.SaveFilterTableReprintData, {
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        PageName: "RecoverySheetTable",
        FilterData: JSON.stringify(filterData),
      })
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        setLoading(true);
      });
  };

  const SearchAmountSubmissionFilter = () => {
    axiosInstances
      .post(apiUrls.GetFilterTableReprintData, {
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        PageName: "RecoverySheet",
      })
      .then((res) => {
        const data = res.data.data;
        if (res?.data.status === true) {
          setDynamicFilter(data);
        } else {
          SaveFilter();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const SearchAmountSubmissionTableFilter = () => {
    axiosInstances
      .post(apiUrls.GetFilterTableReprintData, {
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        PageName: "RecoverySheetTable",
      })
      .then((res) => {
        const data = res.data.data;
        if (res?.data.status === true) {
          setColumnConfig(data);
        } else {
          SaveTableFilter();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const isVisible = (header) =>
    dynamicFilter.find((f) => f?.header === header)?.visible;
  // const isTableVisible = (header) =>
  //   columnConfig.find((f) => f?.header === header)?.visible;

  useEffect(() => {
    SearchAmountSubmissionFilter();
    SearchAmountSubmissionTableFilter();
    // SaveTableFilter();
    // SaveFilter();
  }, []);

  //////////////////////////////////
  const handleSearchTable = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      // If the search query is empty, reset the filtered data to the original table data
      setTableData([...tableData]);
    } else {
      const filtered = filteredData.filter((item) =>
        // item.POC_1.toLowerCase().includes(query)
        {
          let items = "";
          Object.keys(item).map((val) => {
            if (
              val !== "TotalRecord" &&
              val !== "ProjectID" &&
              val !== "POC_2" &&
              val !== "POC_3" &&
              String(item[val])?.toLowerCase()?.includes(query)
            ) {
              items = val;
              return val;
            }
          });
          return items;
        }
      );

      setTableData(filtered);
      setCurrentPage(1);
    }
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
  const getSales_MIS_Type = () => {
    axiosInstances
      .post(apiUrls.Sales_MIS_Type, {})
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.NAME };
        });
        setsearchType(poc3s);
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
  const handleHideShowSecThead = (month) => {
    let head = tHead?.filter((val) => val !== month);
    renderHeader(head);
    setThead(head);
  };
  const handleSearch = () => {
    setLoading(true);

    axiosInstances
      .post(apiUrls.Monthly_CollectionSheet_MIS, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
        LoginName: useCryptoLocalStorage("user_Data", "get", "realname"),
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
        FY: formData?.FinancialYear,
        ProjectID: formData.ProjectID,
        VerticalID: formData.VerticalID,
        TeamID: formData.TeamID,
        WingID: formData.WingID,
        POC1: formData.POC1,
        POC2: formData.POC2,
        POC3: formData.POC3,
      })
      .then((res) => {
        setTableData(res?.data?.data);
        setFilteredData(res?.data?.data);
        let secThead = {
          // ProjectName:0,
          // POC_1:0,
          OpeningBalance: 0,
          MachineAmount: 0,
          CentreLicenceAmount: 0,
          ChangeReqAmount: 0,
          ResourseBillAmount: 0,
          // SAAS,
          AMCAmount: 0,
          // AMCDate,
          TotalSum: 0,
          Apr_Amount: 0,
          May_Amount: 0,
          June_Amount: 0,
          July_Amount: 0,
          Aug_Amount: 0,
          Sep_Amount: 0,
          Oct_Amount: 0,
          Nov_Amount: 0,
          Dec_Amount: 0,
          Jan_Amount: 0,
          Feb_Amount: 0,
          Mar_Amount: 0,
          Total: 0,
        };
        res?.data?.data?.map((val, index) => {
          // secThead.ProjectName += val?.ProjectName;
          // secThead.POC_1 += val?.POC_1;
          secThead.OpeningBalance += val?.OpeningBalance;
          secThead.MachineAmount += val?.MachineAmount;
          secThead.CentreLicenceAmount += val?.CentreLicenceAmount;
          secThead.ChangeReqAmount += val?.ChangeReqAmount;
          secThead.ResourseBillAmount += val?.ResourseBillAmount;
          // secThead.SAAS += val?.SAAS;
          secThead.AMCAmount += val?.AMCAmount;
          secThead.Apr_Amount += val?.Apr_Amount;
          secThead.May_Amount += val?.May_Amount;
          secThead.June_Amount += val?.June_Amount;
          secThead.July_Amount += val?.July_Amount;
          secThead.Aug_Amount += val?.Aug_Amount;
          secThead.Sep_Amount += val?.Sep_Amount;
          secThead.Oct_Amount += val?.Oct_Amount;
          secThead.Nov_Amount += val?.Nov_Amount;
          secThead.Dec_Amount += val?.Dec_Amount;
          secThead.Jan_Amount += val?.Jan_Amount;
          secThead.Feb_Amount += val?.Feb_Amount;
          secThead.Mar_Amount += val?.Mar_Amount;
          secThead.Total += val?.Total;
        }, []);
        setSecondThead([
          { name: "#", visible: false }, //s.no
          { name: "##", visible: false }, //Project
          { name: "###", visible: false }, //POC
          { name: secThead?.OpeningBalance, visible: false }, // Opening Balance
          { name: secThead?.MachineAmount, visible: false }, //Machine
          { name: secThead?.CentreLicenceAmount, visible: false }, //Centre
          { name: secThead?.ChangeReqAmount, visible: false }, //ChangeReqAmount
          { name: secThead?.ResourseBillAmount, visible: false }, //ResourseBillAmount
          { name: "####", visible: false },
          { name: secThead?.AMCAmount, visible: false }, // AMC Amount
          { name: "#####", visible: false },
          { name: secThead?.TotalSum, visible: false }, // STotal
          { name: secThead?.Apr_Amount, visible: false }, // April Amount

          // {
          //   name: (
          //     <span
          //       onClick={() => handleHideShowSecThead("April")}
          //       style={{ cursor: "pointer" }}
          //     >
          //       {secThead?.Apr_Amount}
          //     </span>
          //   ),
          //   visible: false,
          // },

          { name: secThead?.May_Amount, visible: false },
          { name: secThead?.June_Amount, visible: false },
          { name: secThead?.July_Amount, visible: false },
          { name: secThead?.Aug_Amount, visible: false },
          { name: secThead?.Sep_Amount, visible: false },
          { name: secThead?.Oct_Amount, visible: false },
          { name: secThead?.Nov_Amount, visible: false },
          { name: secThead?.Dec_Amount, visible: false },
          { name: secThead?.Jan_Amount, visible: false },
          { name: secThead?.Feb_Amount, visible: false },
          { name: secThead?.Mar_Amount, visible: false },
          { name: secThead?.Total, visible: false },
        ]);

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
    getSales_MIS_Type();
  }, []);
  const [visible, setVisible] = useState({
    ShowRole: false,
    showData: {},
  });
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
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
  const totalEntries = currentData.length;
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });

  // const [sortedData, setSortedData] = useState([]);
  // useEffect(() => {
  //   setTableData(currentData);
  // }, [currentData?.length]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    const sortedDataList = tableData?.sort((a, b) => {
      if (direction === "ascending") {
        return a[`${key}_Amount`] - b[`${key}_Amount`];
      } else {
        return b[`${key}_Amount`] - a[`${key}_Amount`];
      }
    });

    setTableData(sortedDataList);
    setSortConfig({ key, direction });
  };

  const renderHeader = (head) => {
    return head?.map((col) => (
      <th
        key={col}
        onClick={() => requestSort(col)}
        style={{ cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {col}
          <span style={{ marginLeft: "5px" }}>
            {sortConfig.key === col
              ? sortConfig.direction === "ascending"
                ? "▲"
                : "▼"
              : "↕"}
          </span>
        </div>
      </th>
    ));
  };

  /////////////////////////////

  return (
    <>
      {visible?.ShowRole && (
        <Modal
          modalWidth={"200px"}
          visible={visible}
          setVisible={setVisible}
          Header="Total Details"
        >
          <CollectMoneyModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      <div className="card">
        <Heading
          title={
            <div className="d-flex">
              <span style={{ fontWeight: "bold" }}>{t("Recovery Sheet")}</span>
              <div className="d-flex">
                <span className="ml-4" style={{ fontWeight: "bold" }}>
                  {t("Search Filter Details")}{" "}
                </span>
                <span className="header ml-1" style={{ cursor: "pointer" }}>
                  <SearchLotusFilter
                    columnConfig={dynamicFilter}
                    setColumnConfig={setDynamicFilter}
                    PageName="RecoverySheet"
                  />
                </span>
              </div>
            </div>
          }
        />
        <div className="row m-2">
          {isVisible("ProjectID") && (
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
          )}
          {isVisible("VerticalID") && (
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
          )}
          {isVisible("TeamID") && (
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
          )}
          {isVisible("WingID") && (
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
          )}
          {isVisible("POC1") && (
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
          )}
          {isVisible("POC2") && (
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
          )}
          {isVisible("POC3") && (
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
          )}
          {isVisible("FinancialYear") && (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="FinancialYear"
              placeholderName="Financial Year"
              dynamicOptions={[
                // { label: "2023-24", value: "2023-24" },
                { label: "2024-25", value: "2024-25" },
                { label: "2025-26", value: "2025-26" },
              ]}
              handleChange={handleDeliveryChange}
              value={formData.FinancialYear}
            />
          )}
          {isVisible("Month") && (
            <MultiSelectComp
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="Month"
              placeholderName="Month"
              dynamicOptions={month}
              handleChange={handleMultiSelectChange}
              value={formData.Month.map((code) => ({
                code,
                name: month.find((item) => item.code === code)?.name,
              }))}
            />
          )}
          {isVisible("SearchType") && (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="SearchType"
              placeholderName="SearchType"
              dynamicOptions={searchType}
              handleChange={handleDeliveryChange}
              value={formData.SearchType}
            />
          )}
          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div className="d-flex ">
              {loading ? (
                <Loading />
              ) : (
                <button className="btn btn-lg btn-info " onClick={handleSearch}>
                  Search
                </button>
              )}
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
                  title="Click to Download Excel"
                ></img>
              )}
            </div>
          </div>
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card mt-2">
          {/* <Accordion
            title={
              <>
                {tableData?.length === 0 ? (
                  t("Search Result")
                ) : (
                  <div className="d-flex">
                    <span className="mt-1" style={{ fontWeight: "bold" }}>
                      {t("Click Icon To Filter Results")}
                    </span>
                    <span className="header ml-1" style={{ cursor: "pointer" }}>
                      <SearchLotusFilter
                        columnConfig={columnConfig}
                        setColumnConfig={setColumnConfig}
                        PageName="RecoverySheetTable"
                      />
                    </span>
                  </div>
                )}
              </>
            }
            notOpen={true}
            defaultValue={true}
          ></Accordion> */}
          <Heading
            title={
              <div className="d-flex">
                <span style={{ fontWeight: "bold" }}>Search Details</span>{" "}
                <div className="d-flex">
                  <span
                    className="mt-1"
                    style={{ fontWeight: "bold", marginLeft: "10px" }}
                  >
                    {t("Click Icon To Filter Results")}
                  </span>
                  <span className="header ml-1" style={{ cursor: "pointer" }}>
                    <SearchLotusFilter
                      columnConfig={columnConfig}
                      setColumnConfig={setColumnConfig}
                      PageName="RecoverySheetTable"
                    />
                  </span>
                </div>
              </div>
            }
            secondTitle={
              <div className="d-flex">
                <span>Total Amount : {tableData[0]?.Total}</span>
                &nbsp;&nbsp;&nbsp;{" "}
                <span className="ml-5 mr-2">
                  Total Record :&nbsp; {tableData[0]?.TotalRecord}
                </span>
                <div className=" ml-3">
                  Showing {startEntry} to {endEntry} of {totalEntries} entries
                </div>
                <div style={{ padding: "0px !important", marginLeft: "10px" }}>
                  <Input
                    type="text"
                    className="form-control"
                    id="ProjectName"
                    name="ProjectName"
                    placeholder="Search By Amount & POC."
                    onChange={handleSearchTable}
                    value={searchQuery}
                    respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                  />
                </div>
              </div>
            }
          />

          <Tables
            thead={collectTHEADTable}
            secondHead={secondThead}
            tbody={currentData
              ?.map((ele, index) => {
                // Define full row with all possible keys
                const fullRow = {
                  "S.No": (currentPage - 1) * rowsPerPage + index + 1,
                  "Project Name": ele?.ProjectName,
                  POC: ele?.POC_1,
                  "Opening Balance": ele?.OpeningBalance,
                  Machine: ele?.MachineAmount,
                  Centre: ele?.CentreLicenceAmount,
                  "Change Request": ele?.ChangeReqAmount,
                  "Resource Billing": ele?.ResourseBillAmount,
                  SAAS: "0",
                  "AMC Amount": ele?.AMCAmount,
                  "AMC Date": ele?.AMCDate
                    ? (() => {
                        const d = new Date(ele.AMCDate);
                        return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
                      })()
                    : "",
                  STotal: ele?.TotalSum,
                  April: ele?.Apr_Amount,
                  May: ele?.May_Amount,
                  June: ele?.June_Amount,
                  July: ele?.July_Amount,
                  August: ele?.Aug_Amount,
                  September: ele?.Sep_Amount,
                  October: ele?.Oct_Amount,
                  November: ele?.Nov_Amount,
                  December: ele?.Dec_Amount,
                  January: ele?.Jan_Amount,
                  February: ele?.Feb_Amount,
                  March: ele?.Mar_Amount,
                  Total: ele?.Total,
                };

                // ✅ Extract only visible headers from thead
                const visibleHeaders = collectTHEADTable.map((h) =>
                  typeof h === "string" ? h : h.name
                );

                // ✅ Build filtered row with only visible fields
                const filteredRow = {};
                let isEmptyRow = true;

                visibleHeaders.forEach((key) => {
                  const value = fullRow[key];
                  filteredRow[key] = value;

                  if (typeof value === "string") {
                    if (value.trim() !== "") isEmptyRow = false;
                  } else if (!!value) {
                    isEmptyRow = false;
                  }
                });

                // ✅ Skip row if all visible values are empty
                if (isEmptyRow) return null;

                return filteredRow;
              })
              .filter(Boolean)} // remove null (empty) rows
            tableHeight="tableHeight"
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

export default CollectionSheet;
