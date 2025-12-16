import { createSlice } from "@reduxjs/toolkit";
import { isArrayFunction, notify, renameKeys } from "../../../utils/utils";
import {
  CentreWiseCacheByCenterID,
  GetBindDepartment,
  GetBindMenu,
  GetRoleListByEmployeeIDAndCentreID,
  getEmployeeWise,
  getNotification,
  GetPanelDocument,
  GetPatientUploadDocument,
  CentreWisePanelControlCache,
  GetAdvanceReason,
  GetBindResourceList,
  GetAllDoctor,
  GetBindAllDoctorConfirmation,
  BindSeeMoreList,
  GetBindSubCatgeory,
  getBindCentre,
  getBindSpeciality,
  getBindPanelList,
  ProjectList,
} from "./CommonExportFunction";

const initialState = {
  CentreWiseCache: [],
  ReasonWiseCache: [],
  CentreWisePanelControlCacheList: [],
  GetEmployeeWiseCenter: [],
  GetMenuList: [
    {
      menuName: "Tickets",
      menuOrder: "1",
      menuID: "84",
      menuIcon: "fas fa-tachometer-alt",
      children: [
        {
          childrenName: "MyView",
          url: "/myview",
          childrenOrder: "1",
          breadcrumb: "Tickets / My View",
        },
        {
          childrenName: "View Ticket",
          url: "/viewissues",
          childrenOrder: "2",
          breadcrumb: "Tickets / View Ticket",
        },
        {
          childrenName: "Summary",
          url: "/Summary",
          childrenOrder: "3",
          breadcrumb: "Tickets / Summary",
        },
        {
          childrenName: "New Ticket",
          url: "/reportissue",
          childrenOrder: "4",
          breadcrumb: "Tickets / New Ticket",
        },
        {
          childrenName: "BulkNewTicketNotes",
          url: "/BulkNewTicketNotes",
          childrenOrder: "4",
          breadcrumb: "Tickets / Notes",
        },

        {
          childrenName: "New Ticket Client",
          url: "/NewTicketClient",
          childrenOrder: "4",
          breadcrumb: "Client Ticket / New Client Ticket",
        },
        {
          childrenName: "View Ticket Client",
          url: "/ViewTicketClient",
          childrenOrder: "4",
          breadcrumb: "Client Ticket / View Client Ticket",
        },
        {
          childrenName: "BulkNewTicket",
          url: "/BulkReportIssue",
          childrenOrder: "5",
          breadcrumb: "Tickets / Bulk New Ticket",
        },
        {
          childrenName: "Circular",
          url: "/Circular",
          childrenOrder: "6",
          breadcrumb: "Tickets / Circular",
        },
        {
          childrenName: "DeveloperCalendar",
          url: "/DeveloperCalendar",
          childrenOrder: "7",
          breadcrumb: "Tickets / Developer Calendar",
        },
        {
          childrenName: "Employee Task Tracker",
          url: "/TicketView",
          childrenOrder: "8",
          breadcrumb: "Tickets / Employee Task Tracker",
        },
      
      ],
    },

    {
      menuName: "MIS",
      menuOrder: "2",
      menuID: "85",
      menuIcon: "fas fa-tachometer-alt",
      children: [
        {
          childrenName: "AutoBackupStatusSheet",
          url: "/AutoBackupStatusSheet",
          childrenOrder: "1",
          breadcrumb: "MIS / AutoBackupStatusSheet",
        },
        {
          childrenName: "CollectionSheet",
          url: "/CollectionSheet",
          childrenOrder: "2",
          breadcrumb: "MIS / Recovery Sheet",
        },
        {
          childrenName: "AgeingSheet",
          url: "/AgeingSheet",
          childrenOrder: "3",
          breadcrumb: "MIS / Ageing Sheet",
        },
      ],
    },
    {
      menuName: "Feedback",
      menuOrder: "22",
      menuID: "89",
      menuIcon: "fas fa-tachometer-alt",
      children: [
        {
          childrenName: "Client Feedback",
          url: "/FeedbackList",
          childrenOrder: "1",
          breadcrumb: "Feedback / Client Feedback",
        },
        {
          childrenName: "Employee Feedback",
          url: "/EmployeeFeedback",
          childrenOrder: "2",
          breadcrumb: "Feedback / Employee Feedback",
        },
        {
          childrenName: "Employee Feedback",
          url: "/EmailerView",
          childrenOrder: "3",
          breadcrumb: "Feedback / Emailer View",
        },
          {
          childrenName: "Client Feedback",
          url: "/ClientFeedbackFlow",
          childrenOrder: "4",
          breadcrumb: "Feedback / Client Feedback",
        },
      ],
    },
    {
      menuName: "Agreement",
      menuOrder: "22",
      menuID: "89",
      menuIcon: "fas fa-tachometer-alt",
      children: [
        {
          childrenName: "Agreement",
          url: "/TechnicalSupportAgreement",
          childrenOrder: "1",
          breadcrumb: "Agreement / Technical Support Agreement",
        },
      ],
    },
    {
      menuName: "SalesLead",
      menuOrder: "219",
      menuID: "819",
      menuIcon: "fas fa-tachometer-alt",
      children: [
        {
          childrenName: "SalesLead",
          url: "/SalesLead",
          childrenOrder: "1",
          breadcrumb: "SalesLead / Sales Lead List",
        },
        {
          childrenName: "SalesLeadCreate",
          url: "/SalesLeadCreate",
          childrenOrder: "2",
          breadcrumb: "SalesLead /  Sales Lead Create",
        },
      ],
    },
    {
      menuName: "Master",
      menuOrder: "4",
      menuID: "87",
      menuIcon: "fas fa-tachometer-alt",
      children: [
        {
          childrenName: "Employee Master",
          url: "/EmployeeMaster",
          childrenOrder: "1",
          breadcrumb: "Master / Employee Master",
        },
        {
          childrenName: "Employee Master",
          url: "/SearchEmployeeMaster",
          childrenOrder: "13",
          breadcrumb: "Master / Search Employee ",
        },
        {
          childrenName: "Employee Change Password",
          url: "/EmployeeChangePassword",
          childrenOrder: "2",
          breadcrumb: "Master / Employee Change Password",
        },
        {
          childrenName: "Project Master",
          url: "/ProjectMaster",
          childrenOrder: "3",
          breadcrumb: "Master / Project Master",
        },

        {
          childrenName: "VideoPlayerMaster",
          url: "/VideoPlayerMaster",
          childrenOrder: "6",
          breadcrumb: "Master / VideoPlayerMaster",
        },

        {
          childrenName: "Employee Feedback Master",
          url: "/EmployeeFeedbackMaster",
          childrenOrder: "3",
          breadcrumb: "Master / Employee Feedback Master",
        },
        {
          childrenName: "Quotation Master",
          url: "/QuotationMaster",
          childrenOrder: "4",
          breadcrumb: "Master / Quotation Master",
        },
        {
          childrenName: "ImplementationPlan",
          url: "/ImplementationPlan",
          childrenOrder: "5",
          breadcrumb: "Master / ImplementationPlan",
        },
        {
          childrenName: "DashboardConfiguration",
          url: "/DashboardConfiguration",
          childrenOrder: "7",
          breadcrumb: "Master / DashboardConfiguration",
        },
        {
          childrenName: "MasterType",
          url: "/MasterType",
          childrenOrder: "8",
          breadcrumb: "Master / MasterType",
        },
        {
          childrenName: "Master",
          url: "/Master",
          childrenOrder: "8",
          breadcrumb: "Master / Master",
        },
        {
          childrenName: "GlobalMaster",
          url: "/GlobalMaster",
          childrenOrder: "9",
          breadcrumb: "Master / GlobalMaster",
        },
        {
          childrenName: "Implementation Step Master",
          url: "/ImplementationStepMaster",
          childrenOrder: "10",
          breadcrumb: "Master / Implementation Step Master",
        },
      ],
    },
    {
      menuName: "Tools",
      menuOrder: "5",
      menuID: "88",
      menuIcon: "fas fa-tachometer-alt",
      children: [
        {
          childrenName: "User Vs Project Mapping",
          url: "/UserVSProjectMapping",
          childrenOrder: "1",
          breadcrumb: "Tools / User Vs Project Mapping",
        },
        {
          childrenName: "User Vs Module Mapping",
          url: "/UserVsModuleMapping",
          childrenOrder: "9",
          breadcrumb: "Tools / User Vs Module Mapping",
        },
        {
          childrenName: "Change Submit Date of Ticket",
          url: "/ChangeSubmitDateofTicket",
          childrenOrder: "2",
          breadcrumb: "Tools / Change Submit Date of Ticket",
        },
        {
          childrenName: "Query Vs Result",
          url: "/QueryVsResultMaster",
          childrenOrder: "3",
          breadcrumb: "Tools / Query Vs Result",
        },
        {
          childrenName: "Upload Document",
          url: "/UploadDocument",
          childrenOrder: "5",
          breadcrumb: "Tools / Upload Document",
        },
        {
          childrenName: "Access Right",
          url: "/AccessRight",
          childrenOrder: "6",
          breadcrumb: "Tools / Access Right",
        },
        {
          childrenName: "MorningWish",
          url: "/MorningWish",
          childrenOrder: "8",
          breadcrumb: "Tools / Morning Wish",
        },
        {
          childrenName: "BirthdayWish",
          url: "/BirthdayWish",
          childrenOrder: "9",
          breadcrumb: "Tools / Birthday Wish",
        },
        {
          childrenName: "Implementation Step Master",
          url: "/ImplementationStepMaster",
          childrenOrder: "7",
          breadcrumb: "Tools /Implementaion Step Master",
        },
      ],
    },
    {
      menuName: "Sales",
      menuOrder: "3",
      menuID: "86",
      menuIcon: "fas fa-tachometer-alt",
      children: [
        {
          childrenName: "Connector Request",
          url: "/ConnectorRequest",
          childrenOrder: "1",
          breadcrumb: "Sales / Connector Request",
        },
        {
          childrenName: "Amount Submission",
          url: "/AmountSubmission",
          childrenOrder: "2",
          breadcrumb: "Sales / Amount Submission",
        },
        {
          childrenName: "Search Amount Submission",
          url: "/SearchAmountSubmission",
          childrenOrder: "9",
          breadcrumb: "Sales / Search Amount Submission",
        },
        {
          childrenName: "SalesBooking",
          url: "/SalesBooking",
          childrenOrder: "3",
          breadcrumb: "Sales / Sales Booking",
        },
        {
          childrenName: "LedgerStatus",
          url: "/LedgerStatus",
          childrenOrder: "4",
          breadcrumb: "Sales / LedgerStatus",
        },
        {
          childrenName: "Ledger",
          url: "/Ledger",
          childrenOrder: "8",
          breadcrumb: "Sales / Ledger",
        },
        {
          childrenName: "LedgerTransaction",
          url: "/LedgerTransaction",
          childrenOrder: "5",
          breadcrumb: "Sales / Ledger Transaction",
        },
        {
          childrenName: "QuotationBooking",
          url: "/QuotationBooking",
          childrenOrder: "6",
          breadcrumb: "Sales / Quotation Booking",
        },
        {
          childrenName: "TaxInvoiceRequest",
          url: "/TaxInvoiceView",
          childrenOrder: "7",
          breadcrumb: "Sales / Tax Invoice",
        },
        {
          childrenName: "AMCSalesBooking",
          url: "/AMCSalesBooking",
          childrenOrder: "4",
          breadcrumb: "Sales / Bulk AMC Upload",
        },
      ],
    },
    {
      menuName: "HR",
      menuOrder: "4",
      menuID: "87",
      menuIcon: "fas fa-tachometer-alt",
      children: [
        {
          childrenName: "Attendance",
          url: "/Attendance",
          childrenOrder: "1",
          breadcrumb: "HR / Attendance",
        },
        {
          childrenName: "Leave Request",
          url: "/LeaveRequest",
          childrenOrder: "2",
          breadcrumb: "HR / Attendance Calendar",
        },
        {
          childrenName: "Leave View/Approval",
          url: "/LeaveViewApproval",
          childrenOrder: "3",
          breadcrumb: "HR / Leave View Approval",
        },
        {
          childrenName: "Show Employee",
          url: "/ShowEmployee",
          childrenOrder: "4",
          breadcrumb: "HR / Show Employee",
        },
        {
          childrenName: "My Leave Report",
          url: "/ShowWorkingDays",
          childrenOrder: "6",
          breadcrumb: "HR / My Leave Report",
        },
        {
          childrenName: "Attendance Report",
          url: "/AttendanceReport",
          childrenOrder: "7",
          breadcrumb: "HR / Attendance Report",
        },

        {
          childrenName: "Upload Biometric Excel",
          url: "/UploadBiometric",
          childrenOrder: "5",
          breadcrumb: "HR/UploadBiometric",
        },
      ],
    },
    {
      menuName: "Accounts",
      menuOrder: "5",
      menuID: "88",
      menuIcon: "fas fa-tachometer-alt",
      children: [
        {
          childrenName: "Expense Submission",
          url: "/ExpenseSubmission",
          childrenOrder: "1",
          breadcrumb: "Accounts/ExpenseSubmission",
        },
        {
          childrenName: "View Expense",
          url: "/ViewExpense",
          childrenOrder: "2",
          breadcrumb: "Accounts /ViewExpense",
        },
        {
          childrenName: "View Employee Expense",
          url: "/ViewEmployeeExpense",
          childrenOrder: "3",
          breadcrumb: "Accounts /View Employee Expense",
        },
        {
          childrenName: "Advance Request",
          url: "/AdvanceRequest",
          childrenOrder: "4",
          breadcrumb: "Accounts / Advance Request",
        },
        {
          childrenName: "Advance Request View",
          url: "/AdvanceRequestView",
          childrenOrder: "5",
          breadcrumb: "Accounts / Advance Request View",
        },
        {
          childrenName: "Purchase Order",
          url: "/PurchaseOrder",
          childrenOrder: "6",
          breadcrumb: "Accounts / Purchase Order",
        },
      ],
    },
  ],
  GetRoleList: [],
  GetProjectList: [],
  GetReferTypeList: [],
  GetDepartmentList: [],
  GetNotifications: [],
  GetDoctorDeptList: [],
  BindResource: {},
  GetAllDoctorList: [],
  GetBindAllDoctorConfirmationData: [],
  GetBindSubCatgeoryData: [],
  getbindCentreData: [],
  getBindSpecialityData: [],
  getBindPanelListData: [],
  GetTeamMember: [],
  loading: false,
  error: "",
  message: "",
  success: false,
};

export const CommonSlice = createSlice({
  name: "CommonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CentreWiseCacheByCenterID.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(CentreWiseCacheByCenterID.fulfilled, (state, { payload }) => {
        state.CentreWiseCache = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(CentreWiseCacheByCenterID.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })
      .addCase(ProjectList.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(ProjectList.fulfilled, (state, { payload }) => {
        state.GetProjectList = payload?.data || [];
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message || "Success";
      })
      .addCase(ProjectList.rejected, (state, { error }) => {
        // localStorage.clear();
        state.loading = false;
        state.error = error?.message || "Something went wrong";
        state.success = false;
        state.message = error?.message || "Something went wrong";
        // It's better to trigger notifications outside reducers in middleware or components
      })

      // getEmployeeWIseCenter
      .addCase(getEmployeeWise.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getEmployeeWise.fulfilled, (state, { payload }) => {
        state.GetEmployeeWiseCenter = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(getEmployeeWise.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })

      // getMenuList
      .addCase(GetBindMenu.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetBindMenu.fulfilled, (state, { payload }) => {
        state.GetMenuList = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetBindMenu.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })

      // Notification Detail
      .addCase(getNotification.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getNotification.fulfilled, (state, { payload }) => {
        state.GetNotifications = isArrayFunction(payload?.data);
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(getNotification.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })

      // getRoleList

      .addCase(GetRoleListByEmployeeIDAndCentreID.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(
        GetRoleListByEmployeeIDAndCentreID.fulfilled,
        (state, { payload }) => {
          state.GetRoleList = payload?.data;
          state.loading = false;
          state.success = true;
          state.error = "";
          state.message = payload?.Message;
        }
      )
      .addCase(
        GetRoleListByEmployeeIDAndCentreID.rejected,
        (state, { error }) => {
          state.loading = false;
          state.error = error.message;
          state.success = false;
          state.message = error.message;
          //notify(error.message, "error");
        }
      )

      // CentreWisePanelControlCache
      .addCase(CentreWisePanelControlCache.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(CentreWisePanelControlCache.fulfilled, (state, { payload }) => {
        state.CentreWisePanelControlCacheList = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.Message;
      })
      .addCase(CentreWisePanelControlCache.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })

      // getDoctorDepartment
      .addCase(GetBindDepartment.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetBindDepartment.fulfilled, (state, { payload }) => {
        state.GetDepartmentList = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetBindDepartment.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })
      // BindSeeMoreList
      .addCase(BindSeeMoreList.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(BindSeeMoreList.fulfilled, (state, { payload }) => {
        state.BindSeeMoreListData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(BindSeeMoreList.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })

      // GetPanelDocument
      .addCase(GetPanelDocument.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetPanelDocument.fulfilled, (state, { payload }) => {
        state.GetPanelDocumentList = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetPanelDocument.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })

      // GetPatientUploadDocument
      .addCase(GetPatientUploadDocument.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetPatientUploadDocument.fulfilled, (state, { payload }) => {
        state.GetPatientUploadDocumentList = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetPatientUploadDocument.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })
      // GetAdvanceReason
      .addCase(GetAdvanceReason.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetAdvanceReason.fulfilled, (state, { payload }) => {
        const newKeyNames = {
          ID: "value",
          Reason: "label",
        };

        const arrayOfObjects = payload?.data.map((obj) =>
          renameKeys(obj, newKeyNames)
        );
        state.ReasonWiseCache = arrayOfObjects;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetAdvanceReason.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })
      // GetBindResourceList
      .addCase(GetBindResourceList.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetBindResourceList.fulfilled, (state, { payload }) => {
        state.BindResource = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetBindResourceList.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })

      // GetAllDoctor
      .addCase(GetAllDoctor.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetAllDoctor.fulfilled, (state, { payload }) => {
        state.GetAllDoctorList = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetAllDoctor.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })

      // GetAllDoctorConfirmation
      .addCase(GetBindAllDoctorConfirmation.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetBindAllDoctorConfirmation.fulfilled, (state, { payload }) => {
        state.GetBindAllDoctorConfirmationData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetBindAllDoctorConfirmation.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })

      // GetBindSubCatgeory
      .addCase(GetBindSubCatgeory.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetBindSubCatgeory.fulfilled, (state, { payload }) => {
        state.GetBindSubCatgeoryData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetBindSubCatgeory.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })

      // Token Management

      .addCase(getBindCentre.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getBindCentre.fulfilled, (state, { payload }) => {
        state.getbindCentreData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(getBindCentre.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })

      .addCase(getBindSpeciality.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getBindSpeciality.fulfilled, (state, { payload }) => {
        state.getBindSpecialityData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(getBindSpeciality.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      })

      .addCase(getBindPanelList.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getBindPanelList.fulfilled, (state, { payload }) => {
        state.getBindPanelListData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(getBindPanelList.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        //notify(error.message, "error");
      });

    ///////////////Team Member ////////////////

    // .addCase(GetTeamList.pending, (state) => {
    //   state.loading = true;
    //   state.error = "";
    //   state.success = false;
    // })
    // .addCase(GetTeamList.fulfilled, (state, { payload }) => {
    //   state.GetTeamMember = payload?.data;
    //   state.loading = false;
    //   state.success = true;
    //   state.error = "";
    //   state.message = payload?.message;
    // })
    // .addCase(GetTeamList.rejected, (state, { error }) => {
    //   console.log(error.message);
    //   state.loading = false;
    //   state.error = error.message;
    //   state.success = false;
    //   state.message = error.message;

    // });
  },
});

export default CommonSlice.reducer;
