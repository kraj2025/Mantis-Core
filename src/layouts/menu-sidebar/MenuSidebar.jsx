import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import MenuItem from "@app/layouts/menu-sidebar/MenuItem.jsx";
import { Image } from "@profabric/react-components";
import styled from "styled-components";
import i18n from "@app/utils/i18n";
import ReactSelectHead from "../../components/formComponent/ReactSelectHead";
import logo from "@app/assets/image/logo.png";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import DesktopMenuItem from "./DesktopMenuItem";
import { GetRoleListByEmployeeIDAndCentreID } from "../../store/reducers/common/CommonExportFunction";
import { t } from "i18next";
import { setClientId } from "../../store/reducers/loadingSlice/loadingSlice";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
const Version = import.meta.env.VITE_APP_VERSION;
export const MENU = {
  commonComponent: [
    {
      menuName: i18n.t("menusidebar.label.dashboard"),
      icon: "fas fa-tachometer-alt nav-icon",
      children: [
        {
          childrenName: i18n.t("menusidebar.label.dashboard"),
          icon: "fas fa-regular fa-user",
          url: "/dashboard",
          breadcrumb: t("Developer Dashboard"),
        },
        {
          childrenName: i18n.t("menusidebar.label.dashboard"),
          icon: "fas fa-regular fa-user",
          url: "/CoordinatorDashboard",
          breadcrumb: t("Coordinator Dashboard"),
        },
        {
          childrenName: i18n.t("menusidebar.label.dashboard"),
          icon: "fas fa-regular fa-user",
          url: "/ManagerDashboard",
          breadcrumb: t("Manager Dashboard"),
        },
        {
          childrenName: i18n.t("menusidebar.label.dashboard"),
          icon: "fas fa-regular fa-user",
          url: "/HrDashboard",
          breadcrumb: t("HR Dashboard"),
        },
      ],
    },
  ],
  frontOffice: [
    {
      name: i18n.t("Tickets"),
      icon: "fas fa-regular fa-users",
      children: [
        {
          name: "MyView",
          icon: "fas fa-regular fa-user",
          path: "/myview",
          breadcrumb: "Tickets / My View",
        },
        {
          name: "Circular",
          icon: "fas fa-regular fa-user",
          path: "/Circular",
          breadcrumb: t("Tickets / Circular"),
        },
        {
          name: "ViewIssues",
          icon: "fas fa-regular fa-user",
          path: "/viewissues",
          breadcrumb: "Tickets / View Issues",
        },
        {
          name: "Summary",
          icon: "fas fa-regular fa-user",
          path: "/Summary",
          breadcrumb: "Tickets / Summary",
        },
        {
          name: "ReportIssue",
          icon: "fas fa-regular fa-user",
          path: "/reportissue",
          breadcrumb: t("Tickets / New Ticket"),
        },
        {
          name: "BulkNewTicketNotes",
          icon: "fas fa-regular fa-user",
          path: "/BulkNewTicketNotes",
          breadcrumb: t("Tickets / Notes"),
        },
        {
          name: "New Ticket Client",
          icon: "fas fa-regular fa-user",
          path: "/NewTicketClient",
          breadcrumb: t("Client Ticket / New Client Ticket"),
        },
        {
          name: "View Ticket Client",
          icon: "fas fa-regular fa-user",
          path: "/ViewTicketClient",
          breadcrumb: t("Client Ticket / View Client Ticket"),
        },
        {
          name: "DeveloperCalendar",
          icon: "fas fa-regular fa-user",
          path: "/DeveloperCalendar",
          breadcrumb: "Tickets / DeveloperCalendar",
        },
        {
          name: "Employee Task Tracker",
          icon: "fas fa-regular fa-user",
          path: "/TicketView",
          breadcrumb: "Tickets / Employee Task Tracker",
        },
      ],
    },
    {
      name: i18n.t("MIS"),
      icon: "fas fa-regular fa-users",
      children: [
        {
          name: "AutoBackupStatusSheet",
          icon: "fas fa-regular fa-user",
          path: "/AutoBackupStatusSheet",
          breadcrumb: "MIS / AutoBackupStatusSheet",
        },
        {
          name: "CollectionSheet",
          icon: "fas fa-regular fa-user",
          path: "/CollectionSheet",
          breadcrumb: "MIS / Recovery Sheet",
        },
        {
          name: "AgeingSheet",
          icon: "fas fa-regular fa-user",
          path: "/AgeingSheet",
          breadcrumb: "MIS / AgeingSheet",
        },
      ],
    },

    {
      name: i18n.t("Master"),
      icon: "fas fa-regular fa-users",
      children: [
        {
          name: "EmployeeMaster",
          icon: "fas fa-regular fa-user",
          path: "/EmployeeMaster",
          breadcrumb: "Master / Employee Master",
        },
        {
          name: "Employee Change Password",
          icon: "fas fa-regular fa-user",
          path: "/EmployeeChangePassword",
          breadcrumb: "Master / Employee Change Password",
        },
        {
          name: "Project Master",
          icon: "fas fa-regular fa-user",
          path: "/ProjectMaster",
          breadcrumb: "Master / Project Master",
        },

        {
          name: "VideoPlayerMaster",
          icon: "fas fa-regular fa-user",
          path: "/VideoPlayerMaster",
          breadcrumb: "Master / VideoPlayerMaster",
        },
        {
          name: "DashboardConfiguration",
          icon: "fas fa-regular fa-user",
          path: "/DashboardConfiguration",
          breadcrumb: "Master / DashboardConfiguration",
        },
        {
          name: "MasterType",
          icon: "fas fa-regular fa-user",
          path: "/MasterType",
          breadcrumb: "Master / MasterType",
        },
        {
          name: "Master",
          icon: "fas fa-regular fa-user",
          path: "/Master",
          breadcrumb: "Master / Master",
        },
        {
          name: "GlobalMaster",
          icon: "fas fa-regular fa-user",
          path: "/GlobalMaster",
          breadcrumb: "Master / GlobalMaster",
        },
        {
          name: "Employee Feedback Master",
          icon: "fas fa-regular fa-user",
          path: "/EmployeeFeedbackMaster",
          breadcrumb: "Master / Employee Feedback Master",
        },

        {
          name: "Quotation Master",
          icon: "fas fa-regular fa-user",
          path: "/QuotationMaster",
          breadcrumb: "Master / Quotation Master",
        },
        {
          name: "ImplementationPlan",
          icon: "fas fa-regular fa-user",
          path: "/ImplementationPlan",
          breadcrumb: "Master / ImplementationPlan",
        },
        {
          name: "ImplementationStepMaster",
          icon: "fas fa-regular fa-user",
          path: "/ImplementationStepMaster",
          breadcrumb: "Master / ImplementationStepMaster",
        },
      ],
    },
    {
      name: i18n.t("Tools"),
      icon: "fas fa-regular fa-users",
      children: [
        {
          name: "User Vs Project Mapping",
          icon: "fas fa-regular fa-user",
          path: "/UserVSProjectMapping",
          breadcrumb: "Tools / User Vs Project Mapping",
        },
        {
          name: "User Vs Module Mapping",
          icon: "fas fa-regular fa-user",
          path: "/UserVsModuleMapping",
          breadcrumb: "Tools / User Vs Nodule Mapping",
        },
        {
          name: "Change Submit Dat of Ticket",
          icon: "fas fa-regular fa-user",
          path: "/ChangeSubmitDateofTicket",
          breadcrumb: "Tools / Change Submit Dat of Ticket",
        },
        {
          name: "Query Vs Result",
          icon: "fas fa-regular fa-user",
          path: "/QueryVsResultMaster",
          breadcrumb: "Tools / Query Vs Result",
        },
        {
          name: "Upload Document",
          icon: "fas fa-regular fa-user",
          path: "/UploadDocument",
          breadcrumb: "Tools / Upload Document",
        },
        {
          name: "Access Right",
          icon: "fas fa-regular fa-user",
          path: "/AccessRight",
          breadcrumb: "Tools / Access Right",
        },
        {
          name: "MorningWish",
          icon: "fas fa-regular fa-user",
          path: "/MorningWish",
          breadcrumb: "Tools / Morning Wish",
        },
        {
          name: "BirthdayWish",
          icon: "fas fa-regular fa-user",
          path: "/BirthdayWish",
          breadcrumb: "Tools / Birthday Wish",
        },
      ],
    },
    {
      name: i18n.t("Feedback"),
      icon: "fas fa-regular fa-users",
      children: [
        {
          name: "Client Feedback",
          icon: "fas fa-regular fa-user",
          path: "/FeedbackList",
          breadcrumb: "Feedback / Client Feedback",
        },
        {
          name: "Employee Feedback",
          icon: "fas fa-regular fa-user",
          path: "/EmployeeFeedback",
          breadcrumb: "Feedback / Employee Feedback",
        },
        {
          name: "Employee Feedback",
          icon: "fas fa-regular fa-user",
          path: "/EmailerView",
          breadcrumb: "Feedback / Emailer View",
        },
        {
          name: "Client Feedback",
          icon: "fas fa-regular fa-user",
          path: "/ClientFeedbackFlow",
          breadcrumb: "Feedback / Client Feedback",
        },
      ],
    },
    {
      name: i18n.t("Agreement"),
      icon: "fas fa-regular fa-users",
      children: [
        {
          name: "Agreement",
          icon: "fas fa-regular fa-user",
          path: "/TechnicalSupportAgreement",
          breadcrumb: "Agreement / Technical Support Agreement",
        },
      ],
    },
    {
      name: i18n.t("SalesLead"),
      icon: "fas fa-regular fa-users",
      children: [
        {
          name: "SalesLead",
          icon: "fas fa-regular fa-user",
          path: "/SalesLead",
          breadcrumb: "SalesLead / Sales Lead",
        },
        {
          name: "SalesLeadCreate",
          icon: "fas fa-regular fa-user",
          path: "/SalesLeadCreate",
          breadcrumb: "SalesLead / Sales Lead Create",
        },
      ],
    },
    {
      name: i18n.t("Sales"),
      icon: "fas fa-regular fa-users",
      children: [
        {
          name: "Connector Request",
          icon: "fas fa-regular fa-user",
          path: "/ConnectorRequest",
          breadcrumb: "Sales / Connector Request",
        },
        {
          name: "Amount Submission",
          icon: "fas fa-regular fa-user",
          path: "/AmountSubmission",
          breadcrumb: "Sales / Amount Submission",
        },
        {
          name: "Search Amount Submission",
          icon: "fas fa-regular fa-user",
          path: "/SearchAmountSubmission",
          breadcrumb: "Sales / Search Amount Submission",
        },
        {
          name: "SalesBooking",
          icon: "fas fa-regular fa-user",
          path: "/SalesBooking",
          breadcrumb: "Sales / Sales Booking",
        },
        {
          name: "LedgerStatus",
          icon: "fas fa-regular fa-user",
          path: "/LedgerStatus",
          breadcrumb: "Sales / Ledger Status",
        },
        {
          name: "Ledger",
          icon: "fas fa-regular fa-user",
          path: "/Ledger",
          breadcrumb: "Sales / Ledger",
        },
        {
          name: "LedgerTransaction",
          icon: "fas fa-regular fa-user",
          path: "/LedgerTransaction",
          breadcrumb: "Sales / Ledger Transaction",
        },
        {
          name: "QuotationBooking",
          icon: "fas fa-regular fa-user",
          path: "/QuotationBooking",
          breadcrumb: "Sales / Quotation Booking",
        },
        // {
        //   name: "TaxInvoiceRequest",
        //   icon: "fas fa-regular fa-user",
        //   path: "/TaxInvoiceRequest",
        //   breadcrumb: "Sales / Tax Invoice Request",
        // },
        {
          name: "TaxInvoiceRequest",
          icon: "fas fa-regular fa-user",
          path: "/TaxInvoiceView",
          breadcrumb: "Sales / Tax Invoice",
        },
        {
          name: "AMCSalesBooking",
          icon: "fas fa-regular fa-user",
          path: "/AMCSalesBooking",
          breadcrumb: "Sales / Bulk AMC Upload",
        },
      ],
    },
    {
      name: i18n.t("HR"),
      icon: "fas fa-regular fa-users",
      children: [
        {
          name: "Attendance",
          icon: "fas fa-regular fa-user",
          path: "/Attendance",
          breadcrumb: "HR / Attendance",
        },
        {
          name: "Leave Request",
          icon: "fas fa-regular fa-user",
          path: "/LeaveRequest",
          breadcrumb: "HR / Attendance Calendar",
        },
        {
          name: "Leave View/Approval",
          icon: "fas fa-regular fa-user",
          path: "/LeaveViewApproval",
          breadcrumb: "HR / Leave View Approval",
        },
        {
          name: "Show Employee",
          icon: "fas fa-regular fa-user",
          path: "/ShowEmployee",
          breadcrumb: "HR / Show Employee",
        },
        {
          name: "My Leave Report",
          icon: "fas fa-regular fa-user",
          path: "/ShowWorkingDays",
          breadcrumb: "HR / My Leave Report",
        },
        {
          name: "Attendance Report",
          icon: "fas fa-regular fa-user",
          path: "/AttendanceReport",
          breadcrumb: "HR / Attendance Report",
        },
        {
          name: "Upload Biometric Excel",
          icon: "fas fa-regular fa-user",
          path: "/UploadBiometric",
          breadcrumb: "HR / Upload Biometric Excel",
        },
      ],
    },
    {
      name: i18n.t("Accounts"),
      icon: "fas fa-regular fa-users",
      children: [
        {
          name: "Expense Submission",
          icon: "fas fa-regular fa-user",
          path: "/ExpenseSubmission",
          breadcrumb: "Accounts / ExpenseSubmission",
        },
        {
          name: "View Expense",
          icon: "fas fa-regular fa-user",
          path: "/ViewExpense",
          breadcrumb: "Accounts / ViewExpense",
        },
        {
          name: "View Employee Expense",
          icon: "fas fa-regular fa-user",
          path: "/ViewEmployeeExpense",
          breadcrumb: "Accounts / View Employee Expense",
        },
        {
          name: "Advance Request",
          icon: "fas fa-regular fa-user",
          path: "/AdvanceRequest",
          breadcrumb: "Accounts / AdvanceRequest",
        },
        {
          name: "Advance Request View",
          icon: "fas fa-regular fa-user",
          path: "/AdvanceRequestView",
          breadcrumb: "Accounts / Advance Request View",
        },
        {
          name: "Purchase Order",
          icon: "fas fa-regular fa-user",
          path: "/PurchaseOrder",
          breadcrumb: "Accounts / Purchase Order",
        },
      ],
    },
  ],
};

const StyledBrandImage = styled(Image)`
  float: left;
  line-height: 0.8;
  margin: -1px 8px 0 6px;
  opacity: 0.8;
  --pf-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23) !important;
`;

const StyledUserImage = styled(Image)`
  --pf-box-shadow: 0 3px 6px #00000029, 0 3px 6px #0000003b !important;
`;

const MenuSidebar = () => {
  const localData = useLocalStorage("userData", "get"); // get Data from localStorage
  const dispatch = useDispatch();
  const sidebarSkin = useSelector((state) => state.ui.sidebarSkin);
  const menuItemFlat = useSelector((state) => state.ui.menuItemFlat);
  const menuChildIndent = useSelector((state) => state.ui.menuChildIndent);
  const screenSize = useSelector((state) => state.ui.screenSize);
  const { GetMenuList, GetRoleList } = useSelector(
    (state) => state.CommonSlice
  );
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [GetRoleListitem, setGetRoleListitem] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    let data = useLocalStorage("Role", "get");
    setGetRoleListitem(data);
    // console.log("ASd",data)
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    if (value) {
      // const filtered = [...MENU["commonComponent"], ...GetRoleList]
      const filtered = [...GetRoleList]
        .map((category) => {
          const filteredChildren = category.Files.filter((child) =>
            child.DispName?.toLowerCase().includes(value)
          );

          if (filteredChildren?.length > 0) {
            return {
              ...category,
              Files: filteredChildren,
            };
          }
          return null;
        })
        .filter((category) => category !== null);

      setFilteredData(filtered);
    } else {
      // setFilteredData([...MENU["commonComponent"], ...GetRoleList]);
      setFilteredData([...GetRoleList]);
    }
  };

  const BindRoleWiseMenu = async (RoleID) => {
    dispatch(GetRoleListByEmployeeIDAndCentreID({ roleID: RoleID }));
    // window.location.href = "/dashboard";
    navigate("/dashboard");
  };

  // role bind
  const handleChangeRole = async (e) => {
    const { value } = e;
    // useLocalStorage("userData", "set", { ...localData, defaultRole: value });
    try {
      // setFormData({
      //   ...formData,
      //   [name]: value,
      // });
      dispatch(setClientId(value));
      useCryptoLocalStorage("user_Data", "set", "RoleID", value);
      // localStorage.setItem("RoleID", value);
      BindRoleWiseMenu(value);
      // await dispatch(
      //   GetBindMenu({
      //     RoleID: value,
      //   })
      // );
  
      navigate("/dashboard");
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  useEffect(() => {
    if (GetRoleList?.length > 0) {
      // setFilteredData([...MENU["commonComponent"], ...GetRoleList]);
      setFilteredData([...GetRoleList]);
    }
  }, [GetRoleList]);

  return ["lg", "md"].includes(screenSize) ? (
    <DesktopMenuItem filteredData={filteredData} />
  ) : (
    <aside className={`main-sidebar sidebar_border ${sidebarSkin}`}>
      <Link to="#" className="brand-link">
        <StyledBrandImage
          className="logoStyle"
          src={logo}
          alt="AdminLTE Logo"
          width={33}
          height={30}
          rounded
        />
        <span className="brand-text font-weight-bold">Mantis</span>
      </Link>
      <div className="sidebar">
        <div className="row mt-3  bindrole">
          <ReactSelectHead
            placeholderName="Select Role"
            dynamicOptions={GetRoleListitem?.map((ele) => {
              return {
                label: ele?.RoleName,
                value: ele?.RoleID,
              };
            })}
            searchable={true}
            respclass="col-12"
            value={useCryptoLocalStorage("user_Data", "get", "RoleID")}
            handleChange={handleChangeRole}
          />
        </div>
        <div className="row bindrole">
          <div className="col-12">
            <input
              type="text"
              className="form-control search_Items"
              id="search"
              name="search"
              label=""
              value={query}
              onChange={handleSearch}
              placeholder="Search"
              respclass="col-12"
            />
            <i className="fa fa-search search_icon" aria-hidden="true"></i>
          </div>
        </div>

        <nav className="mt-2">
          <ul
            className={`nav  nav-sidebar flex-column${
              menuItemFlat ? " nav-flat" : ""
            }${menuChildIndent ? " nav-child-indent" : ""}`}
            role="menu"
          >
            {filteredData?.map((menuItem) => (
              <MenuItem
                key={menuItem.name + menuItem.path}
                menuItem={menuItem}
                isSearched={Boolean(query)}
              />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default MenuSidebar;
