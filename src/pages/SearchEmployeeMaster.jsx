import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import ReactSelect from "../components/formComponent/ReactSelect";
import Input from "../components/formComponent/Input";
import { Link } from "react-router-dom";
import axios from "axios";
import { headers } from "../utils/apitools";
import Tables from "../components/UI/customTable";
import { EmployeeTHEAD } from "../components/modalComponent/Utils/HealperThead";
import { apiUrls } from "../networkServices/apiEndpoints";
import Modal from "../components/modalComponent/Modal";
import ManageRoleEmployeeMaster from "./CRM/ManageRoleEmployeeMaster";
import ApplyActionManageRole from "./CRM/ApplyActionManageRole";
import { toast } from "react-toastify";
import ManageFlagModal from "./CRM/ManageFlagModal";
import NewEmployeeModal from "./CRM/NewEmployeeModal";
import ProjectMappingModal from "./CRM/ProjectMappingModal";
import { inputBoxValidation, notify } from "../utils/utils";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../utils/constant";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import AddVerticalModal from "./AddVerticalModal";
import AddTeamModal from "./AddTeamModal";
import AddWingModal from "./AddWingModal";
import AddModuleModal from "./AddModuleModal";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import Loading from "../components/loader/Loading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import AddAssignToModal from "./AddAssignToModal";
import AddDashboardModal from "./AddDashboardModal";
import ImageSignatureUpload from "./ImageSignatureUpload";
import SearchLotusFilter from "./SearchLotusFilter";
import Accordion from "./Accordion";
import { useTranslation } from "react-i18next";
import { axiosInstances } from "../networkServices/axiosInstance";

const SearchEmployeeMaster = () => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [role, setRole] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState([]);
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const RoleID = useCryptoLocalStorage("user_Data", "get", "RoleID");
  const [wing, setWing] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dynamicFilter, setDynamicFilter] = useState([]);
  const [columnConfig, setColumnConfig] = useState([]);
  const [formData, setFormData] = useState({
    Designation: "",
    EmployeeName: "",
    Role: [],
    ProjectID: [],
    VerticalID: [],
    TeamID: [],
    WingID: [],
    Category: [],
    Manager: "",
    Status: "2",
    TableStatus: "",
    IsActive: "",
    MobileNo: "",
    Email: "",
    Module: "",
    AssignTo: "",
    Dashboard: "",
    ImageSignature: "",
    BloodGroup: "",
  });

  /////////////////////////////////

  const SaveFilter = () => {
    const filterData = [
      { header: "S.No", visible: true },
      { header: "EmployeeName", visible: true },
      { header: "MobileNo", visible: true },
      { header: "Email", visible: true },
      { header: "Role", visible: true },
      { header: "Category", visible: true },
      { header: "ProjectID", visible: true },
      { header: "VerticalID", visible: true },
      { header: "TeamID", visible: true },
      { header: "WingID", visible: true },
      { header: "Status", visible: true },
    ];

    const jsonString = JSON.stringify(filterData);
    axiosInstances
      .post(apiUrls?.SaveFilterTableReprintData, {
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        FilterData: String(jsonString),
        PageName: "SearchEmployeeMaster",
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
      { header: "EmployeeName", visible: true },
      { header: "MobileNo", visible: true },
      { header: "Email", visible: true },
      { header: "Role", visible: true },
      { header: "Category", visible: true },
      { header: "ProjectID", visible: true },
      { header: "VerticalID", visible: true },
      { header: "TeamID", visible: true },
      { header: "WingID", visible: true },
      { header: "Status", visible: true },
    ];

    const jsonString = JSON.stringify(filterData);
    axiosInstances
      .post(apiUrls?.SaveFilterTableReprintData, {
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        FilterData: String(jsonString),
        PageName: "SearchEmployeeMasterTable",
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
      .post(apiUrls?.GetFilterTableReprintData, {
        PageName: String("SearchEmployeeMaster"),
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
      })
      .then((res) => {
        console.log("SearchEmployeeMaster", res);
        const data = res.data.data;
        if (res?.data.success === true) {
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
      .post(apiUrls?.GetFilterTableReprintData, {
        PageName: String("SearchEmployeeMasterTable"),
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
      })
      .then((res) => {
        const data = res.data.data;
        if (res?.data.success === true) {
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
  const isTableVisible = (header) =>
    columnConfig.find((f) => f?.header === header)?.visible;

  useEffect(() => {
    SearchAmountSubmissionFilter();
    SearchAmountSubmissionTableFilter();
    SaveTableFilter();
    SaveFilter();
  }, []);

  ////////////////////////////////
  const getCategory = () => {
    axiosInstances
      .post(apiUrls?.Category_Select, {})
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { name: item?.NAME, code: item?.NAME };
        });
        setCategory(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        ProjectID: 0,
        IsMaster: String("0"),
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
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleChange = (e, ele, index) => {
    const { name, checked, type } = e?.target;
    const updatedTableData = tableData.map((item, i) =>
      i === index
        ? {
            ...item,
            [name]:
              type === "checkbox" ? (checked ? "1" : "0") : e.target.value,
          }
        : item
    );
    setTableData(updatedTableData);
    handleDotnetMantis(checked, ele);
  };

  const ValidationForm = (formData) => {
    let err = "";
    if (formData?.Name === "") {
      err = { ...err, Name: "Please Enter Employee Name." };
    }
    return err;
  };

  const handleDotnetMantis = (isActive, ele, index) => {
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    form.append("RoleID", useCryptoLocalStorage("user_Data", "get", "RoleID"));
    form.append(
      "LoginName",
      useCryptoLocalStorage("user_Data", "get", "realname")
    );
    form.append("UserID", ele?.id);
    form.append("Value", isActive ? "1" : "0");

    axios
      .post(apiUrls?.DotNetMantis_EmployeeID, form, {
        headers,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        handleSearch();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleIndicator = (state) => {
    return (
      <div className="text" style={{ justifyContent: "space-between" }}>
        {/* <span className="text-dark">Max </span>{" "} */}({" "}
        <span className="text-black">{Number(0 + state?.length)}</span>)
      </div>
    );
  };

  const handleSearch = (code) => {
    if (
      formData?.Name == "" &&
      formData?.Email == "" &&
      formData?.MobileNo == "" &&
      formData?.Category.length === 0 &&
      formData?.ProjectID.length === 0 &&
      formData?.VerticalID.length === 0 &&
      formData?.TeamID.length === 0 &&
      formData?.WingID.length === 0 &&
      formData?.Role.length === 0
    ) {
      toast.error("Please select atleast one searching criteria.");
    } else {
      setLoading(true);

      axiosInstances
        .post(apiUrls?.SearchEmployee_Name, {
          EmployeeName: String(formData?.EmployeeName || ""),
          IsActive: String(formData?.Status || "0"),
          MobileNo: String(formData?.MobileNo || ""),
          EmailID: String(formData?.Email || ""),
          RoleID: String(formData?.Role || "0"),
          CategoryID: String(formData?.Category || "0"),
          ProjectID: String(formData?.ProjectID || "0"),
          TeamID: String(formData?.TeamID || "0"),
          WingID: String(formData?.WingID || "0"),
          VerticalID: String(formData?.VerticalID || "0"),
          BloodGroup: String(formData?.BloodGroup || "0"),
          rowColor: String(code ? code : 0 || "0"),
        })
        .then((res) => {
          ///for employee error message
          if (!res?.data?.success) {
            notify(res?.data?.message, "error");
          }

          const data = res?.data?.data;
          const updatedData = data?.map((ele, index) => {
            return {
              ...ele,
              index: index,
              IsActive: "0",

              RoleDropDown: "",
              RoleResolve: false,
              RoleDropDownValue: "",

              FlagDropDown: "",
              FlagResolve: false,
              FlagDropDownValue: "",

              UpdateCategoryDropdown: "",
              UpdateCategoryResolve: false,
              UpdateCategoryValue: "",

              ProjectMappingDropdown: "",
              ProjectMappingResolve: false,
              ProjectMappingValue: "",

              VerticalDropdown: "",
              VerticalResolve: false,
              VerticalValue: "",

              TeamDropdown: "",
              TeamResolve: false,
              TeamValue: "",

              WingDropdown: "",
              WingResolve: false,
              WingValue: "",

              ModuleDropdown: "",
              ModuleResolve: false,
              ModuleValue: "",

              AssignToDropdown: "",
              AssignToResolve: false,
              AssignToValue: "",

              DashboardDropdown: "",
              DashboardResolve: false,
              DashboardValue: "",

              ImageSignatureDropdown: "",
              ImageSignatureResolve: false,
              ImageSignatureValue: "",
            };
          });
          setTableData(updatedData);
          setFilteredData(updatedData);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
        });
    }
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
  const [visible, setVisible] = useState({
    ShowRole: false,
    ShowAction: false,
    ShowFlag: false,
    showProject: false,
    showEmployee: false,
    showVertical: false,
    showTeam: false,
    showWing: false,
    showModule: false,
    showAssignTo: false,
    showDashboard: false,
    showImageSignature: false,
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

    if (value === "Flag") {
      data[index]["FlagResolve"] = true;
      setTableData(data);
      setVisible({
        ShowFlag: true,
        ShowAction: false,
        ShowRole: false,
        showProject: false,
        showModule: false,
        showVertical: false,
        showTeam: false,
        showWing: false,
        showAssignTo: false,
        showDashboard: false,
        showImageSignature: false,
        showData: data[index],
      });
    } else if (value === "Role") {
      data[index]["RoleResolve"] = true;
      setTableData(data);
      setVisible({
        ShowRole: true,
        ShowAction: false,
        ShowFlag: false,
        showProject: false,
        showVertical: false,
        showTeam: false,
        showWing: false,
        showModule: false,
        showDashboard: false,
        showAssignTo: false,
        showImageSignature: false,
        showData: data[index],
      });
    } else if (value === "Category") {
      data[index]["UpdateCategoryResolve"] = true;
      setTableData(data);
      setVisible({
        ShowAction: true,
        ShowRole: false,
        ShowFlag: false,
        showProject: false,
        showVertical: false,
        showTeam: false,
        showWing: false,
        showModule: false,
        showDashboard: false,
        showAssignTo: false,
        showImageSignature: false,
        showData: data[index],
      });
    } else if (value === "ProjectMapping") {
      data[index]["ProjectMappingResolve"] = true;
      setTableData(data);
      setVisible({
        showProject: true,
        ShowAction: false,
        ShowRole: false,
        ShowFlag: false,
        showVertical: false,
        showTeam: false,
        showModule: false,
        showDashboard: false,
        showWing: false,
        showAssignTo: false,
        showImageSignature: false,
        showData: data[index],
      });
    } else if (value === "Vertical") {
      data[index]["VerticalResolve"] = true;
      setTableData(data);
      setVisible({
        showVertical: true,
        showTeam: false,
        showWing: false,
        showProject: false,
        ShowAction: false,
        ShowRole: false,
        showModule: false,
        showDashboard: false,
        ShowFlag: false,
        showAssignTo: false,
        showImageSignature: false,
        showData: data[index],
      });
    } else if (value === "Team") {
      data[index]["TeamResolve"] = true;
      setTableData(data);
      setVisible({
        showVertical: false,
        showTeam: true,
        showWing: false,
        showProject: false,
        ShowAction: false,
        ShowRole: false,
        showModule: false,
        showDashboard: false,
        ShowFlag: false,
        showAssignTo: false,
        showImageSignature: false,
        showData: data[index],
      });
    } else if (value === "Wing") {
      data[index]["WingResolve"] = true;
      setTableData(data);
      setVisible({
        showVertical: false,
        showTeam: false,
        showWing: true,
        showProject: false,
        ShowAction: false,
        ShowRole: false,
        ShowFlag: false,
        showModule: false,
        showDashboard: false,
        showAssignTo: false,
        showImageSignature: false,
        showData: data[index],
      });
    } else if (value === "Module") {
      data[index]["ModuleResolve"] = true;
      setTableData(data);
      setVisible({
        showVertical: false,
        showTeam: false,
        showWing: false,
        showModule: true,
        showDashboard: false,
        showProject: false,
        ShowAction: false,
        ShowRole: false,
        ShowFlag: false,
        showAssignTo: false,
        showImageSignature: false,
        showData: data[index],
      });
    } else if (value === "AssignTo") {
      data[index]["AssignToResolve"] = true;
      setTableData(data);
      setVisible({
        showVertical: false,
        showTeam: false,
        showWing: false,
        showModule: false,
        showProject: false,
        ShowAction: false,
        ShowRole: false,
        showDashboard: false,
        ShowFlag: false,
        showAssignTo: true,
        showImageSignature: false,
        showData: data[index],
      });
    } else if (value === "Dashboard") {
      data[index]["DashboardResolve"] = true;
      setTableData(data);
      setVisible({
        showVertical: false,
        showTeam: false,
        showWing: false,
        showModule: false,
        showProject: false,
        ShowAction: false,
        ShowRole: false,
        showDashboard: true,
        ShowFlag: false,
        showAssignTo: false,
        showImageSignature: false,
        showData: data[index],
      });
    } else if (value === "ImageSignature") {
      data[index]["ImageSignatureResolve"] = true;
      setTableData(data);
      setVisible({
        showVertical: false,
        showTeam: false,
        showWing: false,
        showModule: false,
        showProject: false,
        ShowAction: false,
        ShowRole: false,
        showDashboard: false,
        ShowFlag: false,
        showAssignTo: false,
        showImageSignature: true,
        showData: data[index],
      });
    } else {
      setTableData(data);
      setVisible({
        ShowRole: false,
        ShowAction: false,
        ShowFlag: false,
        showProject: false,
        showVertical: false,
        showTeam: false,
        showWing: false,
        showModule: false,
        showDashboard: false,
        showAssignTo: false,
        showImageSignature: false,
        showData: {},
      });
    }
  };
  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };

  const bindRole = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("RoleName", ""),
    //   axios
    //     .post(apiUrls?.SearchRole, form, { headers })
    axiosInstances
      .post(apiUrls?.SearchRole, { RoleName: "" })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { name: item?.RoleName, code: item?.ID };
        });
        setRole(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
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
  useEffect(() => {
    bindRole();
    getVertical();
    getCategory();
    getProject();
    getTeam();
    getWing();
  }, []);
  return (
    <>
      {visible?.ShowRole && (
        <Modal
          modalWidth={"600px"}
          visible={visible?.ShowRole}
          setVisible={setVisible}
          Header="Manage Role"
        >
          <ManageRoleEmployeeMaster visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.ShowAction && (
        <Modal
          modalWidth={"600px"}
          visible={visible?.ShowAction}
          setVisible={setVisible}
          Header="Manage Category"
        >
          <ApplyActionManageRole visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.ShowFlag && (
        <Modal
          modalWidth={"1000px"}
          visible={visible?.ShowFlag}
          setVisible={setVisible}
          Header="Flag"
        >
          <ManageFlagModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.showEmployee && (
        <Modal
          modalWidth={"800px"}
          visible={visible?.showEmployee}
          setVisible={setVisible}
          Header="New Employee"
        >
          <NewEmployeeModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.showProject && (
        <Modal
          modalWidth={"800px"}
          visible={visible?.showProject}
          setVisible={setVisible}
          Header="Project Mapping"
        >
          <ProjectMappingModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.showVertical && (
        <Modal
          modalWidth={"600px"}
          visible={visible?.showVertical}
          setVisible={setVisible}
          Header="Vertical"
        >
          <AddVerticalModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.showTeam && (
        <Modal
          modalWidth={"600px"}
          visible={visible?.showTeam}
          setVisible={setVisible}
          Header="Team"
        >
          <AddTeamModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.showWing && (
        <Modal
          modalWidth={"600px"}
          visible={visible?.showWing}
          setVisible={setVisible}
          Header="Wing"
        >
          <AddWingModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.showModule && (
        <Modal
          modalWidth={"600px"}
          visible={visible?.showModule}
          setVisible={setVisible}
          Header="Module"
        >
          <AddModuleModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.showImageSignature && (
        <Modal
          modalWidth={"700px"}
          visible={visible?.showImageSignature}
          setVisible={setVisible}
          Header="Signature & Image Upload"
        >
          <ImageSignatureUpload visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.showAssignTo && (
        <Modal
          modalWidth={"600px"}
          visible={visible?.showAssignTo}
          setVisible={setVisible}
          Header="AssignTo"
        >
          <AddAssignToModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.showDashboard && (
        <Modal
          modalWidth={"600px"}
          visible={visible?.showDashboard}
          setVisible={setVisible}
          Header="Dashboard"
        >
          <AddDashboardModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      <div className="card ViewIssues border">
        <Heading
          title={
            <div className="d-flex">
              <span style={{ fontWeight: "bold" }}>{t("Search Employee")}</span>
              <div className="d-flex">
                <span className="ml-4" style={{ fontWeight: "bold" }}>
                  {t("Search Filter Details")}{" "}
                </span>
                <span className="header ml-1" style={{ cursor: "pointer" }}>
                  <SearchLotusFilter
                    columnConfig={dynamicFilter}
                    setColumnConfig={setDynamicFilter}
                    PageName="SearchEmployeeMaster"
                  />
                </span>
              </div>
            </div>
          }
          // isBreadcrumb={true}
          secondTitle={
            <span style={{ fontWeight: "bold" }}>
              <Link to="/EmployeeMaster" style={{ float: "right" }}>
                {"Create Employee"}
              </Link>
            </span>
          }
          // style={{marginBottom:"3px"}}
        />
        <div className="row m-2">
          {isVisible("EmployeeName") && (
            <Input
              type="text"
              className="form-control"
              id="EmployeeName"
              name="EmployeeName"
              lable="Employee Name"
              placeholder=" "
              onChange={handleSelectChange}
              value={formData?.EmployeeName}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
          )}
          {isVisible("MobileNo") && (
            <div className="col-12 col-md-2 d-flex" style={{ width: "100%" }}>
              <Input
                type="number"
                className="form-control "
                id="MobileNo"
                name="MobileNo"
                lable="Mobile No"
                placeholder=" "
                onChange={(e) => {
                  inputBoxValidation(
                    MOBILE_NUMBER_VALIDATION_REGX,
                    e,
                    handleSelectChange
                  );
                }}
                value={formData?.MobileNo}
                respclass="width150px"
                style={{ width: "100%" }}
              />
              <span className="ml-1">
                {handleIndicator(formData?.MobileNo)}
              </span>
            </div>
          )}
          {isVisible("Email") && (
            <Input
              type="text"
              className="form-control "
              id="Email"
              name="Email"
              lable="Email"
              placeholder=" "
              onChange={handleSelectChange}
              value={formData?.Email}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
          )}
          {isVisible("Role") && (
            <MultiSelectComp
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="Role"
              placeholderName="Role"
              dynamicOptions={role}
              handleChange={handleMultiSelectChange}
              value={formData.Role.map((code) => ({
                code,
                name: role.find((item) => item.code === code)?.name,
              }))}
            />
          )}
          {isVisible("Category") && (
            <MultiSelectComp
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="Category"
              placeholderName="Category"
              dynamicOptions={category}
              handleChange={handleMultiSelectChange}
              value={formData.Category.map((code) => ({
                code,
                name: category.find((item) => item.code === code)?.name,
              }))}
            />
          )}
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
              optionLabel="VerticalID"
              className="VerticalID"
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
          <ReactSelect
            name="BloodGroup"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="Blood Group"
            searchable={true}
            dynamicOptions={[
              { label: "Select", value: "0" },
              { label: "A+", value: "A+" },
              { label: "A-", value: "A-" },
              { label: "B+", value: "B+" },
              { label: "B-", value: "B-" },
              { label: "AB+", value: "AB+" },
              { label: "AB-", value: "AB-" },
              { label: "O+", value: "O+" },
              { label: "O-", value: "O-" },
            ]}
            value={formData?.BloodGroup}
            handleChange={handleDeliveryChange}
          />
          {isVisible("Status") && (
            <ReactSelect
              name="Status"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholderName="Status"
              searchable={true}
              dynamicOptions={[
                { label: "Active", value: "1" },
                { label: "In-Active", value: "0" },
                { label: "Both", value: "2" },
              ]}
              value={formData?.Status}
              handleChange={handleDeliveryChange}
            />
          )}
          <div className="col-3 d-flex">
            {loading ? (
              <Loading />
            ) : (
              <button className="btn btn-sm btn-success" onClick={handleSearch}>
                Search
              </button>
            )}
            <i
              className="fa fa-plus-circle fa-sm new_record_pluse mt-2 ml-3"
              onClick={() => {
                setVisible({ showEmployee: true, showData: "" });
              }}
              title="Click to Create New Employee"
              style={{ cursor: "pointer" }}
            ></i>
          </div>
        </div>
      </div>
      {tableData?.length > 0 ? (
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
                        PageName="SearchEmployeeMasterTable"
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
            title={<span style={{ fontWeight: "bold" }}>Employee Details</span>}
            secondTitle={
              <div style={{ fontWeight: "bold", display: "flex" }}>
                <div style={{ padding: "0px !important", marginLeft: "10px" }}>
                  <Input
                    type="text"
                    className="form-control"
                    id="Title"
                    name="Title"
                    lable="Search"
                    placeholder=" "
                    onChange={handleSearchTable}
                    value={searchQuery}
                    respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                  />
                </div>
                <div
                  className="status-item online mr-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSearch("white", "0")}
                >
                  <span
                    className="dot"
                    style={{
                      backgroundColor: "white",
                      border: "1px solid black",
                    }}
                  ></span>
                  Active
                </div>
                <div
                  className="status-item online mr-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSearch("lightpink", "0")}
                >
                  <span
                    className="dot"
                    style={{
                      backgroundColor: "lightpink",
                      border: "1px solid lightpink",
                    }}
                  ></span>
                  InActive
                </div>
                <span className="mt-1">
                  Total Record : &nbsp; {tableData?.length}
                </span>
              </div>
            }
          />
          <Tables
            thead={EmployeeTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              EmployeeCode: ele?.EmployeeCode,
              EmployeeID: ele?.id,
              MantisID: ele?.CrmEmployeeID,
              "User Name": ele?.username,
              "Real Name": ele?.realname,
              "BloodGroup": ele?.BloodGroup,
              Email: ele?.email,
              Address: ele?.Address,
              "Mobile No.": ele?.mobileno,
              Active: ele?.enabled == 1 ? "Yes" : "No",
              // "DotNet Mantis": (
              //   <div className="search-col" style={{ marginLeft: "8px" }}>
              //     <div style={{ display: "flex", alignItems: "center" }}>
              //       <label className="switch" style={{ marginTop: "7px" }}>
              //         <input
              //           type="checkbox"
              //           name="IsActive"
              //           checked={ele?.DotNetMantis == "1"}
              //           onChange={(e) => handleChange(e, ele, index)}
              //         />
              //         <span className="slider"></span>
              //       </label>
              //       <span
              //         style={{
              //           marginLeft: "3px",
              //           marginRight: "5px",
              //           fontSize: "12px",
              //         }}
              //       ></span>
              //     </div>
              //   </div>
              // ),
              "Profile Image": (
                <>
                  {ele?.ProfileImage && (
                    <i
                      className="fa fa-eye"
                      style={{
                        marginLeft: "5px",
                        cursor: "pointer",
                        color: "white",
                        border: "1px solid grey",
                        padding: "2px",
                        background: "black",
                        borderRadius: "3px",
                      }}
                      onClick={() => {
                        setSelectedImageUrl(ele?.ProfileImage);
                        setIsModalOpen(true);
                      }}
                    ></i>
                  )}

                  {/* Modal */}
                  {isModalOpen && selectedImageUrl && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                        overflowY: "auto",
                      }}
                    >
                      <div
                        style={{
                          background: "white",
                          width: "500px",
                          height: "auto",
                          position: "relative",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "2px solid grey",
                          maxHeight: "90vh",
                          overflow: "auto",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        {/* Close button */}
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            onClick={() => {
                              setIsModalOpen(false);
                              setSelectedImageUrl(null);
                            }}
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#dc3545",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              marginBottom: "10px",
                            }}
                          >
                            X
                          </button>
                        </div>

                        <img
                          src={selectedImageUrl}
                          alt="Document"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              ),
              Edit: [3, 4, 5, 15].includes(RoleID) && (
                <Link
                  to="/EmployeeMaster"
                  state={{ data: ele?.id, edit: true }}
                  style={{ cursor: "pointer" }}
                >
                  Edit
                </Link>
              ),
              Action: (
                <>
                  <ReactSelect
                    style={{ width: "100%" }}
                    name="TableStatus"
                    id="TableStatus"
                    respclass="width100px"
                    placeholderName="Apply Action"
                    dynamicOptions={[
                      { label: "Flag", value: "Flag" },
                      { label: "Role", value: "Role" },
                      { label: "Category", value: "Category" },
                      { label: "Project", value: "ProjectMapping" },
                      { label: "Vertical", value: "Vertical" },
                      { label: "Team", value: "Team" },
                      { label: "Wing", value: "Wing" },
                      { label: "Module", value: "Module" },
                      { label: "Dashboard", value: "Dashboard" },
                      // { label: "AssignTo", value: "AssignTo" },
                      {
                        label: "Document Upload",
                        value: "ImageSignature",
                      },
                    ]}
                    value={ele?.TableStatus}
                    handleChange={(name, value) => {
                      const ind = (currentPage - 1) * rowsPerPage + index;
                      handleDeliveryChangeValue(name, value?.value, ind, ele);
                    }}
                  />
                </>
              ),
              colorcode: ele?.rowColor,
            }))}
            tableHeight={"tableHeight"}
          />
          {/* <div className="col-2">
            <button className="btn btn-sm btn-success">Save</button>
          </div> */}
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
      ) : (
        <NoRecordFound />
      )}
    </>
  );
};
export default SearchEmployeeMaster;
