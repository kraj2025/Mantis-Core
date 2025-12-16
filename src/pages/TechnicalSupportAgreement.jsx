import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import DatePickerMonth from "../components/formComponent/DatePickerMonth";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import { toast } from "react-toastify";
import Marque from "../components/UI/Marque";
import DatePicker from "../components/formComponent/DatePicker";
import { useTranslation } from "react-i18next";
import Input from "../components/formComponent/Input";
import Tables from "../components/UI/customTable";
import Modal from "../components/modalComponent/Modal";
import TSACancelModal from "./TSACancelModal";
import Loading from "../components/loader/Loading";
import ReactSelect from "../components/formComponent/ReactSelect";
import TSAConfirmModal from "./TSAConfirmModal";
import TSAHoldModal from "./TSAHoldModal";
import TSAApproveModal from "./TSAApproveModal";
import TSACreateModal from "./TSACreateModal";
import AmountSubmissionSeeMoreList from "../networkServices/AmountSubmissionSeeMoreList";
import SlideScreen from "./SlideScreen";
import SeeMoreSlideScreen from "../components/SearchableTable/SeeMoreSlideScreen";
import Tooltip from "./Tooltip";
import { axiosInstances } from "../networkServices/axiosInstance";
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
const currentYear = currentDate.getFullYear();

const TechnicalSupportAgreement = () => {
  const [loading, setLoading] = useState(false);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [vertical, setVertical] = useState([]);
  const [project, setProject] = useState([]);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);
  const [poc1, setPoc1] = useState([]);
  const [poc2, setPoc2] = useState([]);
  const [poc3, setPoc3] = useState([]);
  const [listVisible, setListVisible] = useState(false);
  const [formData, setFormData] = useState({
    ProjectID: [],
    VerticalID: [],
    TeamID: [],
    WingID: [],
    POC1: [],
    POC2: [],
    POC3: [],
    currentMonth: currentMonth,
    currentYear: currentYear,
    MonthYear: "",
    PageSize: 50,
    PageNo: "",
    Month: new Date(),
    FromDate: new Date(),
    CancelReason: "",
  });
  const [t] = useTranslation();
  const getVertical = () => {
    // let form = new FormData();
    // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.Vertical_Select, form, { headers })
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
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.Team_Select, form, { headers })
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
  const shortenName = (name) => {
    return name.length > 10 ? name.substring(0, 25) + "..." : name;
  };
  const getWing = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.Wing_Select, form, { headers })
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
  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const getPOC1 = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.POC_1_Select, form, { headers })
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
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.POC_2_Select, form, { headers })
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
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.POC_3_Select, form, { headers })
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
        const poc3s = res?.data.data.map((item) => {
          return { name: item?.Project, code: item?.ProjectId };
        });
        setProject(poc3s);
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
  const handleMonthYearChange = (name, e) => {
    const { value } = e.target;
    const date = new Date(value);
    setFormData({
      ...formData,
      currentMonth: date.getMonth() + 1,
      currentYear: date.getFullYear(),
    });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
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

  const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, "").trim();

  const handleSearchTable = (event) => {
    const rawQuery = event.target.value;
    const query = normalizeString(rawQuery);

    setSearchQuery(rawQuery);

    if (query === "") {
      setTableData(filteredData);
      setCurrentPage(1);
      return;
    }

    const filtered = filteredData?.filter((item) =>
      Object.keys(item).some(
        (key) => item[key] && normalizeString(String(item[key])).includes(query)
      )
    );

    if (filtered.length === 0) {
      setSearchQuery("");
      setTableData(filteredData);
    } else {
      setTableData(filtered);
    }

    setCurrentPage(1);
  };

  const handleCheckBox = (e, index) => {
    const { name, checked } = e?.target;

    if (name === "selectAll") {
      // Handle Select All for CURRENT page
      const updatedData = tableData.map((item, idx) => {
        const isOnCurrentPage =
          idx >= (currentPage - 1) * rowsPerPage &&
          idx < currentPage * rowsPerPage;

        return isOnCurrentPage ? { ...item, remove: checked } : item;
      });

      setTableData(updatedData);
      setSelectAll(checked);
    } else if (name === "remove") {
      // Get actual index in full tableData
      const globalIndex = (currentPage - 1) * rowsPerPage + index;
      const data = [...tableData];

      data[globalIndex][name] = checked;
      setTableData(data);

      // Check if all rows in current page are selected
      const currentPageData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );

      const allChecked = currentPageData.every((item) => item.remove);
      setSelectAll(allChecked);
    }
  };
  const centreTHEAD = [
    { name: "S.No.", width: "2%" },
    "Agreement No.",
    "Project",
    "AgreementType",
    "CreatedBy",
    "CreatedDate",
    "ValidFrom",
    "ValidTo",
    "Approve",
    "Print",
    { name: "Action", width: "5%" },
  ];

  console.log("formData",formData)
  const handleSearch = (code) => {
    setLoading(true);
    // const form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "RoleID",
    //     useCryptoLocalStorage("user_Data", "get", "RoleID")
    //   ),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ProjectID", formData?.ProjectID),
    //   form.append("VerticalID", formData?.VerticalID),
    //   form.append("TeamID", formData?.TeamID),
    //   form.append("WingID", formData?.WingID),
    //   form.append("POC1", formData?.POC1),
    //   form.append("POC2", formData?.POC2),
    //   form.append("POC3", formData?.POC3),
    //   form.append("Month", formData?.currentMonth),
    //   form.append("Year", formData?.currentYear),
    //   form.append("RowColor", code ? code : "0"),
    // axios
    //   .post(apiUrls?.TSAAggrementSearch, form, { headers })
    const payload = {
      ProjectID: String(formData?.ProjectID || 0),
      VerticalID: String(formData?.VerticalID || 0),
      TeamID: String(formData?.TeamID || 0),
      WingID: String(formData?.WingID || 0),

      POC1: String(formData?.POC1 || ""),
      POC2: String(formData?.POC2 || ""),
      POC3: String(formData?.POC3 || ""),

      Month: Number(formData?.currentMonth || 0),
      Year: Number(formData?.currentYear || 0),
      RowColor: String(code || "0"),
    };

    axiosInstances
      .post(apiUrls?.TSAAggrementSearch, payload)
      .then((res) => {
        const data = res?.data?.data;
        const updatedData = data?.map((ele, index) => {
          return {
            ...ele,
            index: index,
            IsActive: "0",

            ConfirmDropDown: "",
            ConfirmResolve: false,
            ConfirmDropDownValue: "",

            HoldDropDown: "",
            HoldResolve: false,
            HoldDropDownValue: "",

            CancelDropDown: "",
            CancelResolve: false,
            CancelDropDownValue: "",
          };
        });
        setTableData(updatedData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const [visible, setVisible] = useState({
    ShowConfirm: false,
    ShowHold: false,
    ShowCancel: false,
    ShowApprove: false,
    showTSA: false,
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

    if (value === "Confirm") {
      data[index]["ConfirmResolve"] = true;
      setTableData(data);
      setVisible({
        ShowConfirm: true,
        ShowHold: false,
        ShowCancel: false,
        showData: data[index],
      });
    } else if (value === "Hold") {
      data[index]["HoldResolve"] = true;
      setTableData(data);
      setVisible({
        ShowConfirm: false,
        ShowHold: true,
        ShowCancel: false,
        showData: data[index],
      });
    } else if (value === "Cancel") {
      data[index]["CancelResolve"] = true;
      setTableData(data);
      setVisible({
        ShowConfirm: false,
        ShowHold: false,
        ShowCancel: true,
        showData: data[index],
      });
    } else {
      setTableData(data);
      setVisible({
        ShowConfirm: false,
        ShowHold: false,
        ShowCancel: false,
        showData: {},
      });
    }
  };

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
  useEffect(() => {
    getProject();
    getVertical();
    getTeam();
    getWing();
    getPOC1();
    getPOC2();
    getPOC3();
  }, []);
  return (
    <>
      {visible?.ShowCancel && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("TSA Cancel")}
        >
          <TSACancelModal
            visible={visible}
            setVisible={setVisible}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      {visible?.showTSA && (
        <Modal
          modalWidth={"1000px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Create New TSA")}
        >
          <TSACreateModal
            visible={visible}
            setVisible={setVisible}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      {visible?.ShowApprove && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("TSA Approve Details")}
        >
          <TSAApproveModal
            visible={visible}
            setVisible={setVisible}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      {visible?.ShowConfirm && (
        <Modal
          modalWidth={"700px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("TSA Confirm")}
        >
          <TSAConfirmModal
            visible={visible}
            setVisible={setVisible}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      {visible?.ShowHold && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("TSA Hold")}
        >
          <TSAHoldModal
            visible={visible}
            setVisible={setVisible}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
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
          <DatePickerMonth
            className="custom-calendar"
            id="Month"
            name="Month"
            lable="Month/Year"
            placeholder={"MM/YY"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={formData?.Month}
            handleChange={(e) => handleMonthYearChange("Month", e)}
          />
          {/* <DatePicker
            className="custom-calendar"
            id="FromDate"
            name="FromDate"
            lable={t("From Date")}
            placeholder={VITE_DATE_FORMAT}
            value={formData?.FromDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
            // requiredClassName={"required-fields"}
          /> */}

          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-primary ml-2"
              onClick={() => handleSearch("")}
            >
              Search
            </button>
          )}

          <i
            className="fa fa-plus-circle fa-sm new_record_pluse mt-2 ml-3"
            onClick={() => {
              setVisible({ showTSA: true, showData: "" });
            }}
            title="Click to Create New TSA"
            style={{ cursor: "pointer" }}
          ></i>
        </div>
      </div>

      {tableData?.length > 0 ? (
        <div className="card">
          <Heading
            title={<span style={{ fontWeight: "bold" }}>Search Details</span>}
            secondTitle={
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
                    onClick={() => handleSearch("50")}
                  ></div>
                  <span
                    className="legend-label ml-2"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Open")} (
                    {tableData[0]?.OpenCount ? tableData[0]?.OpenCount : 0})
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
                      backgroundColor: "#fff000",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearch("10")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{
                      width: "80%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Hold")}(
                    {tableData[0]?.HoldCount ? tableData[0]?.HoldCount : 0})
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
                      backgroundColor: "#00ffff",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearch("20")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Confirmed")} (
                    {tableData[0]?.ConfirmedCount
                      ? tableData[0]?.ConfirmedCount
                      : 0}
                    )
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
                      backgroundColor: "#90ee90",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearch("30")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Approved")} (
                    {tableData[0]?.ApprovedCount
                      ? tableData[0]?.ApprovedCount
                      : 0}
                    )
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
                      backgroundColor: "gray",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearch("60")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{
                      width: "100%",
                      height: "90%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Cancel")} (
                    {tableData[0]?.CancelCount ? tableData[0]?.CancelCount : 0})
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
                      backgroundColor: "#fca2e4",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearch("70")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{
                      width: "100%",
                      height: "90%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("IsEdited")} (
                    {tableData[0]?.IsEditedCount
                      ? tableData[0]?.IsEditedCount
                      : 0}
                    )
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
                      backgroundColor: "#f77245",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearch("40")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{
                      width: "100%",
                      height: "90%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Rejected")} (
                    {tableData[0]?.RejectedCount
                      ? tableData[0]?.RejectedCount
                      : 0}
                    )
                  </span>
                </div>

                <span className="mr-1 ml-5" style={{ fontWeight: "bold" }}>
                  Total Record :&nbsp; {tableData[0]?.TotalRecord}
                </span>
              </div>
            }
          />
          <Tables
            thead={centreTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              "Agreement No.": ele?.DocumentNo,
              // <Tooltip label={ele?.DocumentNo}>
              //   <span
              //     id={`documentNo-${index}`}
              //     targrt={`documentNo-${index}`}
              //     style={{ textAlign: "center" }}
              //   >
              //     {shortenName(ele?.DocumentNo)}
              //   </span>
              // </Tooltip>
              Project: (
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
              AgreementType: ele?.AgreementType,
              CreatedBy: ele?.CreatedBy,
              CreatedDate: new Date(ele.dtEntry?.Value).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
              ValidFrom: new Date(ele.ValidFrom?.Value).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
              ValidTo: new Date(ele.ValidTo?.Value).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
              // Action: ele?.IsCancel == 0 && (
              //   <button
              //     className="btn btn-sm btn-danger"
              //     onClick={() => {
              //       setVisible({ cancelVisible: true, showData: ele });
              //     }}
              //   >
              //     Cancel
              //   </button>
              // ),
              Approve: ele?.IsApproved === 1 && (
                <i
                  className="fa fa-eye"
                  onClick={() => {
                    setVisible({
                      ShowApprove: true,
                      showData: ele,
                    });
                  }}
                ></i>
              ),
              Print:
                ele?.IsDocumentGenrate == 1 ? (
                  <i
                    className="fa fa-print"
                    style={{
                      marginLeft: "5px",
                      cursor: "pointer",
                      color: "black",
                      padding: "2px",
                      borderRadius: "3px",
                    }}
                    onClick={() => window.open(ele?.ViewURL, "_blank")}
                  ></i>
                ) : (
                  <span style={{ fontWeight: "bold" }}>
                    Kindly wait a few moments,<br></br> then refresh the page.
                  </span>
                ),
              // Action: (
              //   <>
              //     <i style={{ cursor: "pointer" }}></i>
              //     <div className="">
              //       <span className="">
              //         <AmountSubmissionSeeMoreList
              //           ModalComponent={ModalComponent}
              //           setSeeMore={setSeeMore}

              //           data={{ ...ele, type: "TSA" }}
              //           setVisible={() => {
              //             setListVisible(false);
              //           }}
              //           handleBindFrameMenu={[
              //             {
              //               FileName: "TSA Confirm",
              //               URL: "TSAConfirmModal",
              //               FrameName: "TSAConfirmModal",
              //               Description: "TSAConfirmModal",
              //             },
              //             {
              //               FileName: "TSA Hold",
              //               URL: "TSAHoldModal",
              //               FrameName: "TSAHoldModal",
              //               Description: "TSAHoldModal",
              //             },
              //             {
              //               FileName: "TSA Cancel",
              //               URL: "TSACancelModal",
              //               FrameName: "TSACancelModal",
              //               Description: "TSACancelModal",
              //             },
              //           ]}
              //           isShowPatient={true}
              //         />
              //       </span>
              //     </div>
              //   </>
              // ),
              Action:ele?.IsDocumentGenrate === 1 && (
                <>
                  <ReactSelect
                    style={{ width: "100%" }}
                    name="TableStatus"
                    id="TableStatus"
                    respclass="width80px"
                    placeholderName="Status"
                    dynamicOptions={
                      ele?.IsConfirmed === 1
                        ? []
                        : [
                            ...(ele?.IsHold === 1
                              ? [{ label: "Cancel", value: "Cancel" }]
                              : []),

                            ...(ele?.IsEdited == 1 && ele?.IsFormatApproved == 1
                              ? [
                                  { label: "Confirm", value: "Confirm" },
                                  { label: "Hold", value: "Hold" },
                                  { label: "Cancel", value: "Cancel" },
                                ]
                              : []),

                            ...(ele?.IsConfirmed === 0 &&
                            ele?.IsApproved === 0 &&
                            ele?.IsCancel === 0 &&
                            ele?.IsHold === 0 &&
                            ele?.IsEdited == 0 &&
                            ele?.IsFormatApproved == 0
                              ? [
                                  { label: "Confirm", value: "Confirm" },
                                  { label: "Hold", value: "Hold" },
                                  { label: "Cancel", value: "Cancel" },
                                ]
                              : []),
                          ]
                    }
                    // dynamicOptions={[
                    //   { label: "Confirm", value: "Confirm" },
                    //   { label: "Hold", value: "Hold" },
                    //   { label: "Cancel", value: "Cancel" },
                    // ]}
                    value={ele?.TableStatus}
                    handleChange={(name, value) => {
                      const ind = (currentPage - 1) * rowsPerPage + index;
                      handleDeliveryChangeValue(name, value?.value, ind, ele);
                    }}
                    // isDisabled={ele?.IsApproved == 1}
                  />
                </>
              ),
              colorcode: ele?.rowColor,
              // Remove: (
              //   <input
              //     type="checkbox"
              //     name="remove"
              //     checked={
              //       tableData[(currentPage - 1) * rowsPerPage + index]
              //         ?.remove || false
              //     }
              //     onChange={(e) => handleCheckBox(e, index)}
              //   />
              // ),
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
          <div className="pagination ml-auto">
            {/* <button
              className="btn btn-sm btn-primary"
              style={{ marginRight: "83px" }}
              onClick={handleDeleteSelected}
            >
              Delete
            </button> */}
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
      ) : (
        <NoRecordFound />
      )}
    </>
  );
};
export default TechnicalSupportAgreement;
