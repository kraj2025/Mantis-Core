import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading } from "../loadingSlice/loadingSlice";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import makeApiRequest, {
  axiosInstances,
} from "../../../networkServices/axiosInstance";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";

export const CentreWiseCacheByCenterID = createAsyncThunk(
  "CentreWiseCache",
  async ({ centreID }, { dispatch }) => {
    const options = {
      method: "GET",
    };

    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.CentreWiseCacheByCenterID}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const CentreWisePanelControlCache = createAsyncThunk(
  "CentreWisePanelControlCache",
  async ({ centreID }, { dispatch }) => {
    const options = {
      method: "GET",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.CentreWisePanelControlCache}?CentreID=${centreID}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const getEmployeeWise = createAsyncThunk(
  "centre",
  async ({ employeeID }, { dispatch }) => {
    const options = {
      method: "GET",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.EmployeeWiseCentreList}?EmployeeId=${employeeID}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const GetBindMenu = createAsyncThunk(
  "BindMenu",
  async ({ RoleID }, { dispatch }) => {
    // console.log("RoleID", RoleID);
    const options = {
      method: "GET",
    };
    try {
      dispatch(setLoading(true));
      // const data = await makeApiRequest(
      //   `${apiUrls.BindMenuList}?RoleID=${RoleID}`,
      //   options
      // );
      const newdata = {
        success: true,
        data: [
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
                childrenName: "Circular",
                url: "/Circular",
                childrenOrder: "5",
                breadcrumb: "Tickets / Circular",
              },
              {
                childrenName: "DeveloperCalendar",
                url: "/DeveloperCalendar",
                childrenOrder: "6",
                breadcrumb: "Tickets / Developer Calendar",
              },
              {
                childrenName: "Employee Task Tracker",
                url: "/TicketView",
                childrenOrder: "7",
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
            menuOrder: "76",
            menuID: "871",
            menuIcon: "fas fa-tachometer-alt",
            children: [
              {
                childrenName: "Client Feedback",
                url: "/FeedbackList",
                childrenOrder: "1",
                breadcrumb: "Feedback /Client Feedback",
              },
              {
                childrenName: "Employee Feedback",
                url: "/EmployeeFeedback",
                childrenOrder: "2",
                breadcrumb: "Feedback /Employee Feedback",
              },
              {
                childrenName: "Employee Feedback",
                url: "/EmailerView",
                childrenOrder: "3",
                breadcrumb: "Feedback /Emailer View",
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
            menuOrder: "76",
            menuID: "871",
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
            menuOrder: "96",
            menuID: "877",
            menuIcon: "fas fa-tachometer-alt",
            children: [
              {
                childrenName: "SalesLead",
                url: "/SalesLead",
                childrenOrder: "1",
                breadcrumb: "SalesLead /  Sales Lead",
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
                childrenOrder: "3",
                breadcrumb: "Master / VideoPlayerMaster",
              },
              {
                childrenName: "Employee Feedback Master",
                url: "/EmployeeFeedbackMaster",
                childrenOrder: "6",
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
                childrenName: "GlobalMaster",
                url: "/GlobalMaster",
                childrenOrder: "9",
                breadcrumb: "Master / GlobalMaster",
              },
              {
                childrenName: "Master",
                url: "/Master",
                childrenOrder: "10",
                breadcrumb: "Master / Master",
              },
              {
                childrenName: "ImplementationStepMaster",
                url: "/ImplementationStepMaster",
                childrenOrder: "11",
                breadcrumb: "Master / ImplementationStepMaster",
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
                childrenOrder: "10",
                breadcrumb: "Tools / User Vs Module Mapping",
              },
              {
                childrenName: "Change Submit Dat of Ticket",
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
                childrenOrder: "4",
                breadcrumb: "Tools / Upload Document",
              },
              {
                childrenName: "Access Right",
                url: "/AccessRight",
                childrenOrder: "14",
                breadcrumb: "Tools / Access Right",
              },
              {
                childrenName: "MorningWish",
                url: "/MorningWish",
                childrenOrder: "15",
                breadcrumb: "Tools / Morning Wish",
              },
              {
                childrenName: "BirthdayWish",
                url: "/BirthdayWish",
                childrenOrder: "16",
                breadcrumb: "Tools / Birthday Wish",
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
                childrenOrder: "8",
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
                childrenOrder: "7",
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
                childrenName: "AMCSalesBooking",
                url: "/AMCSalesBooking",
                childrenOrder: "14",
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
                childrenOrder: "5",
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
                childrenOrder: "6",
                breadcrumb: "HR / Upload Biometric Excel",
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

        message: "",
      };
      dispatch(setLoading(false));
      return newdata;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const getNotification = createAsyncThunk(
  "GetNotify",
  async ({ RoleID, EmployeeID, CentreID }, { dispatch }) => {
    const options = {
      method: "GET",
    };
    try {
      dispatch(setLoading(true));
      const data = await makeApiRequest(
        `${apiUrls.getNotificationDetail}?RoleID=${RoleID}&EmployeeID=${EmployeeID}&CentreID=${CentreID}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const GetRoleListByEmployeeIDAndCentreID = createAsyncThunk(
  "GetRoleList",
  async (payload, { dispatch }) => {
    const options = {
      method: "Post",
      data: payload,
    };
    dispatch(setLoading(true));
    try {
      const data = await axiosInstances(
        `${apiUrls.BindRoleVsMenu_File}`,
        options
      );
      dispatch(setLoading(false));
      return data.data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const GetTeamMember = createAsyncThunk(
  "GetTeamList",
  async (payload, { dispatch }) => {
    const options = {
      method: "Post",
      data: payload,
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(`${apiUrls.GetTeamMember}`, options);
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const GetBindDepartment = createAsyncThunk(
  "GetBindDepartmentList",
  async (data, { dispatch }) => {
    const options = {
      method: "get",
      data: {
        centreID: "1",
        TypeID: "5",
      },
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.BindDepartment}?TypeID=5`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);
export const BindSeeMoreList = createAsyncThunk(
  "BindSeeMoreList",
  async (data, { dispatch }) => {
    const options = {
      method: "get",
      data: {
        centreID: "1",
        TypeID: "5",
      },
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(`${apiUrls.BindSeeMoreList}`, options);
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const GetPanelDocument = createAsyncThunk(
  "getPanelDocumentList",
  async ({ PanelID }, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.GetPanelDocument}?PanelID=${PanelID}`,
        options
      );

      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const GetPatientUploadDocument = createAsyncThunk(
  "getPatientUploadDocument",
  async ({ patientID }, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.GetPatientUploadDocument}?patientID=${patientID}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const ReferenceTypeInsert = createAsyncThunk(
  "REFERENCETYPE",
  async (data, { dispatch }) => {
    const options = {
      method: "POST",
      data,
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(apiUrls.CreateTypeOfReference, options);
      dispatch(setLoading(false));
      if (data?.status) {
        notify(data?.message, "success");
      } else {
        notify(data?.message, "error");
      }
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);
export const ProjectList = createAsyncThunk(
  "ProjectSelect",
  async (payload, { dispatch }) => {
    const options = {
      method: "POST",
      data: payload,
    };
    dispatch(setLoading(true));
    try {
      const response = await makeApiRequest(apiUrls.ProjectSelect, options);
      dispatch(setLoading(false));
      return response;
    } catch (error) {
      dispatch(setLoading(false));
      notify(error?.message || "An error occurred", "error");
      throw error; // Ensure the error is rethrown for any further handling upstream
    }
  }
);
export const RoleList = createAsyncThunk(
  "login",
  async (payload, { dispatch }) => {
    const options = {
      method: "POST",
      data: payload,
    };
    dispatch(setLoading(true));
    try {
      const response = await makeApiRequest(apiUrls.login, options);
      dispatch(setLoading(false));
      return response;
    } catch (error) {
      dispatch(setLoading(false));
      notify(error?.message || "An error occurred", "error");
      throw error; // Ensure the error is rethrown for any further handling upstream
    }
  }
);

export const GetAdvanceReason = createAsyncThunk(
  "GetAdvanceReason",
  async (data, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(`${apiUrls.GetAdvanceReason}`, options);
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const CreateAdvanceReason = createAsyncThunk(
  "CreateAdvanceReason",
  async (data, { dispatch }) => {
    console.log(data);
    const options = {
      method: "POST",
      data,
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(apiUrls.CreateAdvanceReason, options);
      dispatch(setLoading(false));
      if (data?.success) {
        notify(data?.message, "success");
      } else {
        notify(data?.message, "error");
      }
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);

export const GetBindResourceList = createAsyncThunk(
  "BINDRESOURCELIST",
  async (data, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(apiUrls.BindResourceList, options);
      dispatch(setLoading(false));
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);

export const GetAllDoctor = createAsyncThunk(
  "GetAllDoctorList",
  async (_, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.BindDoctorDept}?Department=ALL&CentreID=1`,
        options
      );
      dispatch(setLoading(false));
      return {
        data: handleReactSelectDropDownOptions(data?.data, "Name", "DoctorID"),
      };
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);

export const GetBindAllDoctorConfirmation = createAsyncThunk(
  "GetBindAllDoctorConfirmation",
  async ({ Department, CentreID }, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.BindDoctorDept}?Department=${Department}`,
        options
      );
      dispatch(setLoading(false));
      return data;
      // return {
      //   data: handleReactSelectDropDownOptions(data?.data, "Name", "DoctorID"),
      // };
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);

export const GetBindSubCatgeory = createAsyncThunk(
  "GetBindSubCatgeory",
  async ({ Type, CategoryID }, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.getBindSubCategory}?Type=${Type}&CategoryID=${CategoryID}`,
        options
      );
      dispatch(setLoading(false));
      return data;
      // return {
      //   data: handleReactSelectDropDownOptions(data?.data, "Name", "DoctorID"),
      // };
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);

// Token Management
export const getBindCentre = createAsyncThunk(
  "getBindCentre",
  async (_, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(`${apiUrls.getBindCenterAPI}`, options);
      dispatch(setLoading(false));
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);
export const getBindSpeciality = createAsyncThunk(
  "getBindSpeciality",
  async (_, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(`${apiUrls.BindSpeciality}`, options);
      dispatch(setLoading(false));
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);
export const getBindPanelList = createAsyncThunk(
  "getBindPanelList",
  async ({ PanelGroup }, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.GetPanelName}?PanelGroup=${PanelGroup}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);
