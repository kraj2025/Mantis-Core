export const apiUrls = {
  ///////////////////////////////    MANTIS api  ///////////////////////////////

  login: "/CRMCOREAPI/api/Login",
  ProjectSelect: "/CRMCOREAPI/api/MasterBind/ProjectSelect",

  ///ViewIssuesSearchPage
  ViewIssueSearch: "/CRMCOREAPI/api/ViewIssue/ViewIssueSearch",

  //MyView Page Api's
  AutobackupSearch: "/CRMCOREAPI/api/Autobackup/AutobackupSearch",
  AssingedToMe: "/CRMCOREAPI/api/MyView/AssingedToMe",
  UnAssigned: "/CRMCOREAPI/api/MyView/UnAssigned",
  ReportedbyMe: "/CRMCOREAPI/api/MyView/ReportedbyMe",

  // ViewIssues Page Api's
  ApplyAction: "/CRMCOREAPI/api/ViewIssue/ApplyAction",
  Vertical_Select: "/CRMCOREAPI/api/MasterBind/Vertical_Select",
  Team_Select: "/CRMCOREAPI/api/MasterBind/Team_Select",
  Wing_Select: "/CRMCOREAPI/api/MasterBind/Wing_Select",
  POC_1_Select: "/CRMCOREAPI/api/MasterBind/POC_1_Select",
  POC_2_Select: "/CRMCOREAPI/api/MasterBind/POC_2_Select",
  POC_3_Select: "/CRMCOREAPI/api/MasterBind/POC_3_Select",
  Category_Select: "/CRMCOREAPI/api/MasterBind/Category_Select",
  Status_Select: "/CRMCOREAPI/api/MasterBind/Status_Select",
  Reporter_Select: "/CRMCOREAPI/api/MasterBind/Reporter_Select",
  AssignTo_Select: "/CRMCOREAPI/api/MasterBind/AssignTo_Select",
  Priority_Select: "/CRMCOREAPI/api/MasterBind/Priority_Select",
  DeleteTicket: "/CRMCOREAPI/api/ViewIssue/DeleteTicket",
  ViewTicket: "/CRMCOREAPI/api/ViewIssue/ViewTicket",
  UpdateTicket: "/CRMCOREAPI/api/BugReport/UpdateTicket",
  DeleteNote: "/CRMCOREAPI/api/BugReport/DeleteNote",
  UpdateNote: "/CRMCOREAPI/api/BugReport/UpdateNote",
  ViewNote: "/CRMCOREAPI/api/ViewIssue/ViewNote",
  ViewHistory: "/CRMCOREAPI/api/ViewIssue/ViewHistory",
  UpdateTickets: "/CRMCOREAPI/api/ViewIssue/UpdateTicket",
  //NewTicket(ReportIssue) Page Api's
  NewTicket: "/CRMCOREAPI/api/BugReport/NewTicket",

  //AutoBackupStatusSheet  Page Api's   & MisReport Table Page
  AutobackupSearch: "/CRMCOREAPI/api/Autobackup/AutobackupSearch",
  SPOC_Update: "/CRMCOREAPI/api/Autobackup/SPOC_Update",
  AutobackupLog: "/CRMCOREAPI/api/Autobackup/AutobackupLog",

  //Employee Master Page Api's   && SearchEmployeeMaster
  SearchEmployee_EmployeeID:"/CRMCOREAPI/api/EmployeeMaster/SearchEmployee_EmployeeID",
  CreateEmployee: "/CRMCOREAPI/api/EmployeeMaster/CreateEmployee",
  UpdateEmployee: "/CRMCOREAPI/api/EmployeeMaster/UpdateEmployee",
  ViewDesignation: "/CRMCOREAPI/api/DesignationMaster/ViewDesignation",
  Accesslevel: "/CRMCOREAPI/api/EmployeeMaster/Accesslevel",
  SearchEmployee_Name: "/CRMCOREAPI/api/EmployeeMaster/SearchEmployee_Name",
  CreateDesignation: "/CRMCOREAPI/api/DesignationMaster/CreateDesignation",
  UpdateDesignation: "/CRMCOREAPI/api/DesignationMaster/UpdateDesignation",

  //EmployeeChangePassword Page Api's
  ChangePassword: "/CRMCOREAPI/api/BugReport/ChangePassword",

  //ProjectMaster Page Api's
  CreateProject: "/CRMCOREAPI/api/ProjectMaster/CreateProject",
  ViewProject: "/CRMCOREAPI/api/ProjectMaster/ViewProject",
  UpdateProject: "/CRMCOREAPI/api/ProjectMaster/UpdateProject",
  UpdateProjectRateCard: "/CRMCOREAPI/api/ProjectMaster/UpdateProjectRateCard",
  GetCountry: "/CRMCOREAPI/api/MasterBind/GetCountry",
  GetState: "/CRMCOREAPI/api/MasterBind/GetState",
  GetDistrict: "/CRMCOREAPI/api/MasterBind/GetDistrict",
  GetCity: "/CRMCOREAPI/api/MasterBind/GetCity",
  GetProductVersion: "/CRMCOREAPI/api/ProjectMaster/GetProductVersion",
  UpdateLocality: "/CRMCOREAPI/api/ProjectMaster/UpdateLocality",
  CreateBilling: "/CRMCOREAPI/api/ProjectMaster/CreateBilling",
  UpdateBilling: "/CRMCOREAPI/api/ProjectMaster/UpdateBilling",
  UpdateEscalation: "/CRMCOREAPI/api/ProjectMaster/UpdateEscalation",
  UpdateNotification: "/CRMCOREAPI/api/ProjectMaster/UpdateNotification",
  GetClientModuleList: "/CRMCOREAPI/api/ProjectMaster/GetClientModuleList",
  GetPhaseID: "/CRMCOREAPI/api/ProjectMaster/GetPhaseID",
  CreateClientModule: "/CRMCOREAPI/api/ProjectMaster/CreateClientModule",
  UpdateClientModule: "/CRMCOREAPI/api/ProjectMaster/UpdateClientModule",
  DeleteClientModule: "/CRMCOREAPI/api/ProjectMaster/DeleteClientModule",
  SaveMachineList: "/CRMCOREAPI/api/ProjectMaster/SaveMachineList",
  UpdateMachineList: "/CRMCOREAPI/api/ProjectMaster/UpdateMachineList",
  DeleteClientMachineList: "/CRMCOREAPI/api/ProjectMaster/DeleteClientMachineList",
  GetGstTaxAndOldLisID: "/CRMCOREAPI/api/ProjectMaster/GetGstTaxAndOldLisID",
  AMCType_Select: "/CRMCOREAPI/api/MasterBind/AMCType_Select",
  UpdateFinancialInfo: "/CRMCOREAPI/api/ProjectMaster/UpdateFinancialInfo",
  CreateClientCentre: "/CRMCOREAPI/api/ProjectMaster/CreateClientCentre",
  UpdateClientCentre: "/CRMCOREAPI/api/ProjectMaster/UpdateClientCentre",
  GetProjectCategory: "/CRMCOREAPI/api/ProjectMaster/GetProjectCategory",
  CreateProjectCategory: "/CRMCOREAPI/api/ProjectMaster/CreateProjectCategory",

  //UserVSProjectMapping Page Api's
  UserVsProject_Select: "/CRMCOREAPI/api/EmployeeMaster/UserVsProject_Select",
  UserVsProjectMapping: "/CRMCOREAPI/api/EmployeeMaster/UserVsProjectMapping",
  Remove_UserVsProjectMapping:
    "/CRMCOREAPI/api/EmployeeMaster/Remove_UserVsProjectMapping",
  SelectProjectOrdering: "/CRMCOREAPI/api/ProjectMaster/SelectProjectOrdering",
  UpdateProjectOrdering: "/CRMCOREAPI/api/ProjectMaster/UpdateProjectOrdering",

  //ChangeSubmitDateofTicket Page Api's
  ChangeSubmitDate: "/CRMCOREAPI/api/BugReport/ChangeSubmitDate",

  //UploadDocument Page Api's
  DocumentType_Select: "/CRMCOREAPI/api/ManageDocument/DocumentType_Select",
  UploadDocument_Search: "/CRMCOREAPI/api/ManageDocument/UploadDocument_Search",
  UploadDocument: "/CRMCOREAPI/api/ManageDocument/UploadDocument",

  //Amount Submission Page Api's
  AmountSubmission_ByAccounts:
    "/CRMCOREAPI/api/Accounts/AmountSubmission_ByAccounts",
  AmountSubmission_ByAccounts_Search:
    "/CRMCOREAPI/api/Accounts/AmountSubmission_ByAccounts_Search",
  AmountSubmission_ByAccounts_IsCancel:
    "/CRMCOREAPI/api/Accounts/AmountSubmission_ByAccounts_IsCancel",

  //Query Master Api;s
  Query_Insert: "/CRMCOREAPI/api/QueryVsResult/Query_Insert",
  Query_Update: "/CRMCOREAPI/api/QueryVsResult/Query_Update",
  QueryVsResult_Select: "/CRMCOREAPI/api/QueryVsResult/QueryVsResult_Select",
  Result_Insert: "/CRMCOREAPI/api/QueryVsResult/Result_Insert",
  Result_Update: "/CRMCOREAPI/api/QueryVsResult/Result_Update",

  //Connector Request Api's
  Connector_Search: "/CRMCOREAPI/api/AccountsConnector/Connector_Search",
  Connector_Settlement_Insert:
    "/CRMCOREAPI/api/AccountsConnector/Connector_Settlement_Insert",
  Connector_Discount_Insert:
    "/CRMCOREAPI/api/AccountsConnector/Connector_Discount_Insert",
  Connector_Select: "/CRMCOREAPI/api/AccountsConnector/Connector_Select",
  Connector_Insert: "/CRMCOREAPI/api/AccountsConnector/Connector_Insert",
  Connector_Status_Update:
    "/CRMCOREAPI/api/AccountsConnector/Connector_Status_Update",
  Connector_Update: "/CRMCOREAPI/api/AccountsConnector/Connector_Update",

  GetImplementaiondropdown:
    "/CRMCOREAPI/api/ImplementationSteps/ImplementationSteps_MasterSelect",
  InsertImplementaion:
    "/CRMCOREAPI/api/ImplementationSteps/ImplementationSteps_Insert",
  DeleteImplementation:
    "/CRMCOREAPI/api/ImplementationSteps/ImplementationSteps_Delete",
  UpdateImplementation:
    "/CRMCOREAPI/api/ImplementationSteps/ImplementationSteps_Update",

  //Attendance//
  Attendence_Login: "/CRMCOREAPI/api/CRMAttendence/Attendence_Login",
  Attendence_Select: "/CRMCOREAPI/api/CRMAttendance/AttendanceSelect",
  Attendence_Search: "/CRMCOREAPI/api/CRMAttendance/AttendanceSearch",
  Birthday_Anniversary_Search:
    "/CRMCOREAPI/api/CRMAttendence/Birthday_Anniversary_Search",

  //LeaveRequest//
  LeaveRequest_ApproveALL: "/CRMCOREAPI/api/CRMAttendence/LeaveRequest_ApproveALL",
  LeaveRequest_BindCalender:
    "/CRMCOREAPI/api/CRMAttendence/LeaveRequest_BindCalender",
  LeaveRequest_Save: "/CRMCOREAPI/api/CRMAttendence/LeaveRequest_Save",
  LeaveRequest_Select: "/CRMCOREAPI/api/CRMAttendence/LeaveRequest_Select",

  LeaveApproval_Search: "/CRMCOREAPI/api/CRMAttendence/LeaveApproval_Search",
  ShowWorkingDays_Search: "/CRMCOREAPI/api/CRMAttendence/ShowWorkingDays_Search",
  UploadAttendanceExcel: "/CRMCOREAPI/api/CRMAttendence/UploadAttendanceExcel",

  ////Advance Request /////
  AdvanceAmount_Requset: "/CRMCOREAPI/api/AdvanceAmount/AdvanceAmount_Requset",
  AdvanceRequest_Search: "/CRMCOREAPI/api/AdvanceAmount/AdvanceRequest_Search",
  AdvaceAmount_Select: "/CRMCOREAPI/api/AdvanceAmount/AdvaceAmount_Select",
  AdvanceAmount_Status_Update:
    "/CRMCOREAPI/api/AdvanceAmount/AdvanceAmount_Status_Update",
  AdvanceAmount_Paid: "/CRMCOREAPI/api/AdvanceAmount/AdvanceAmount_Paid",
  ManageExpense_Insert: "/CRMCOREAPI/api/ManageExpense/ManageExpense_Insert",
  IsExpenseExists: "/CRMCOREAPI/api/ManageExpense/IsExpenseExists",
  GetReportingTo_Employee: "/CRMCOREAPI/api/ManageExpense/GetReportingTo_Employee",
  ViewExpenseList: "/CRMCOREAPI/api/ManageExpense/ViewExpenseList",
  PaidAmount: "/CRMCOREAPI/api/ManageExpense/PaidAmount",
  ViewExpenseList_Accounts:
    "/CRMCOREAPI/api/ManageExpense/ViewExpenseList_Accounts",
  UpdateStatus: "/CRMCOREAPI/api/ManageExpense/UpdateStatus",

  // Access right
  CreateRole: "/CRMCOREAPI/api/AccessRight/CreateRole",
  SearchRole: "/CRMCOREAPI/api/AccessRight/SearchRole",
  UpdateRole: "/CRMCOREAPI/api/AccessRight/UpdateRole",
  EmployeeView: "/CRMCOREAPI/api/AccessRight/EmployeeView",

  CreateMenu: "/CRMCOREAPI/api/AccessRight/CreateMenu",
  UpdateMenu: "/CRMCOREAPI/api/AccessRight/UpdateMenu",
  SearchMenu: "/CRMCOREAPI/api/AccessRight/SearchMenu",

  BindRoleVsMenu_File: "/CRMCOREAPI/api/AccessRight/BindRoleVsMenu_File",

  CreateFile: "/CRMCOREAPI/api/AccessRight/CreateFile",
  SearchFile: "/CRMCOREAPI/api/AccessRight/SearchFile",
  UpdateFile: "/CRMCOREAPI/api/AccessRight/UpdateFile",
  AccessRight_Bind: "/CRMCOREAPI/api/AccessRight/AccessRight_Bind",
  AccessRight_Update: "/CRMCOREAPI/api/AccessRight/AccessRight_Update",
  UserVsRoleMapping: "/CRMCOREAPI/api/EmployeeMaster/UserVsRoleMapping",
  UserVsCategoryMapping: "/CRMCOREAPI/api/EmployeeMaster/UserVsCategoryMapping",
  DotNetMantis_EmployeeID: "/CRMCOREAPI/api/EmployeeMaster/DotNetMantis_EmployeeID",
  UserVsRole_Select: "/CRMCOREAPI/api/EmployeeMaster/UserVsRole_Select",
  UserVsCategory_Select: "/CRMCOREAPI/api/EmployeeMaster/UserVsCategory_Select",

  Monthly_CollectionSheet_MIS:
    "/CRMCOREAPI/api/Accounts/Monthly_CollectionSheet_MIS",
  UpdateFlag: "/CRMCOREAPI/api/EmployeeMaster/UpdateFlag",
  GetFlag: "/CRMCOREAPI/api/EmployeeMaster/GetFlag",
  AmountSubmission_ByAccounts_Update:
    "/CRMCOREAPI/api/Accounts/AmountSubmission_ByAccounts_Update",
  Payement_Installment_Select:
    "/CRMCOREAPI/api/AccountsPaymentInstallment/Payement_Installment_Select",
  Payment_Installment_Insert:
    "/CRMCOREAPI/api/AccountsPaymentInstallment/Payment_Installment_Insert",
  Payment_Installment_Search:
    "/CRMCOREAPI/api/AccountsPaymentInstallment/Payment_Installment_Search",
  BulkNewTicket: "/CRMCOREAPI/api/BugReport/BulkNewTicket",
  Settlement_Select: "/CRMCOREAPI/api/Accounts/Settlement_Select",
  UpdateProfile: "/CRMCOREAPI/api/EmployeeMaster/UpdateProfile",
  // ForgetPassword_ValdiateEmailMobile:'/CRMCOREAPI/api/EmployeeMaster/ForgetPassword_ValdiateEmailMobile',
  ForgetPassword_ValdiateEmailMobile:
    "/CRMCOREAPI/api/LoginAPIDynamic/ForgetPassword_ValdiateEmailMobile",
  // ForgetPassword_ValdiateOTP:'/CRMCOREAPI/api/EmployeeMaster/ForgetPassword_ValdiateOTP',
  ForgetPassword_ValdiateOTP:
    "/CRMCOREAPI/api/LoginAPIDynamic/ForgetPassword_ValdiateOTP",
  // ForgetPassword_ChangePassword:'/CRMCOREAPI/api/EmployeeMaster/ForgetPassword_ChangePassword',
  ForgetPassword_ChangePassword:
    "/CRMCOREAPI/api/LoginAPIDynamic/ForgetPassword_ChangePassword",
  LedgerStatus: "/CRMCOREAPI/api/Accounts/LedgerStatus",
  LedgerStatus_LockUnLock: "/CRMCOREAPI/api/Accounts/LedgerStatus_LockUnLock",
  LedgerStatus_LockUnLock_Log:
    "/CRMCOREAPI/api/Accounts/LedgerStatus_LockUnLock_Log",
  Settlement: "/CRMCOREAPI/api/Accounts/Settlement",
  Settlement_IsCancel: "/CRMCOREAPI/api/Accounts/Settlement_IsCancel",
  CreateEmployee_Short: "/CRMCOREAPI/api/EmployeeMaster/CreateEmployee_Short",
  UserVsVertical_Select: "/CRMCOREAPI/api/EmployeeMaster/UserVsVertical_Select",
  UserVsVerticalMapping: "/CRMCOREAPI/api/EmployeeMaster/UserVsVerticalMapping",
  UserVsTeam_Select: "/CRMCOREAPI/api/EmployeeMaster/UserVsTeam_Select",
  UserVsTeamMapping: "/CRMCOREAPI/api/EmployeeMaster/UserVsTeamMapping",
  UserVsWing_Select: "/CRMCOREAPI/api/EmployeeMaster/UserVsWing_Select",
  UserVsWingMapping: "/CRMCOREAPI/api/EmployeeMaster/UserVsWingMapping",
  UpdateThemeColor: "/CRMCOREAPI/api/EmployeeMaster/UpdateThemeColor",
  GetUserName: "/CRMCOREAPI/api/ProjectMaster/GetUserName",
  AmountSub_CancelReason_Select:
    "/CRMCOREAPI/api/MasterBind/AmountSub_CancelReason_Select",
  AmountSubmission_ByAccounts_Search_ProjectID:
    "/CRMCOREAPI/api/Accounts/AmountSubmission_ByAccounts_Search_ProjectID",
  SalesBooking_CancelReason_Select:
    "/CRMCOREAPI/api/MasterBind/SalesBooking_CancelReason_Select",
  SalesBooking_IsCancel:
    "/CRMCOREAPI/api/AccountsPaymentInstallment/SalesBooking_IsCancel",
  SalesBooking_GeneratePI:
    "/CRMCOREAPI/api/AccountsPaymentInstallment/SalesBooking_GeneratePI",
  SalesBooking_Load_SalesID:
    "/CRMCOREAPI/api/AccountsPaymentInstallment/SalesBooking_Load_SalesID",

  Quotation_Search: "/CRMCOREAPI/api/AccountsQuotation/Quotation_Search",
  Quotation_Select: "/CRMCOREAPI/api/AccountsQuotation/Quotation_Select",
  Quotation_Insert: "/CRMCOREAPI/api/AccountsQuotation/Quotation_Insert",
  Quotation_IsCancel: "/CRMCOREAPI/api/AccountsQuotation/Quotation_IsCancel",
  Quotation_Approved: "/CRMCOREAPI/api/AccountsQuotation/Quotation_Approved",
  Quotation_Load_QuotationID:
    "/CRMCOREAPI/api/AccountsQuotation/Quotation_Load_QuotationID",
  Quotation_SalesConvert:
    "/CRMCOREAPI/api/AccountsQuotation/Quotation_SalesConvert",
  Quotation_Update: "/CRMCOREAPI/api/AccountsQuotation/Quotation_Update",
  Quotation_CancelReason_Select:
    "/CRMCOREAPI/api/MasterBind/Quotation_CancelReason_Select",
  Payment_Installment_Update:
    "/CRMCOREAPI/api/AccountsPaymentInstallment/Payment_Installment_Update",
  Sales_MIS_Type: "/CRMCOREAPI/api/MasterBind/Sales_MIS_Type",
  BillingCompany_Select: "/CRMCOREAPI/api/ProjectMaster/BillingCompany_Select",
  SaveFilterData: "/CRMCOREAPI/api/ViewIssue/SaveFilterData",
  SearchFilterData: "/CRMCOREAPI/api/ViewIssue/SearchFilterData",
  MantisSummary_Search: "/CRMCOREAPI/api/MantisSummary/MantisSummary_Search",
  SaveFilterDataSubmission: "/CRMCOREAPI/api/MasterBind/SaveFilterData ",
  SearchFilterDataSubmission: "/CRMCOREAPI/api/MasterBind/SearchFilterData ",
  SalesSaveFilterData: "/CRMCOREAPI/api/MasterBind/SaveFilterData",
  SalesSearchFilterData: "/CRMCOREAPI/api/MasterBind/SearchFilterData ",

  ///Dashboard Api///////////
  DevDashboard_Summary: "/CRMCOREAPI/api/MantisSummary/DevDashboardSummary",
  DevDashboard_Detailed: "/CRMCOREAPI/api/MantisSummary/DevDashboard_Detailed",
  Circular_News: "/CRMCOREAPI/api/Circular/CircularNews",
  Circular_UserList: "/CRMCOREAPI/api/Circular/Circular_UserList",
  Circular_Search: "/CRMCOREAPI/api/Circular/Circular_Search",
  SaveCircular: "/CRMCOREAPI/api/Circular/SaveCircular",
  Circular_Read: "/CRMCOREAPI/api/Circular/Circular_Read",
  PaymentTerms_Select: "/CRMCOREAPI/api/MasterBind/PaymentTerms_Select",
  SalesBooking_Load_SalesID:
    "/CRMCOREAPI/api/AccountsPaymentInstallment/SalesBooking_Load_SalesID",
  BillingCompanyDetail_Select_ID:
    "/CRMCOREAPI/api/MasterBind/BillingCompanyDetail_Select_ID",
  Dev_Caledar: "/CRMCOREAPI/api/MantisSummary/DeveloperCalender",
  Module_Select: "/CRMCOREAPI/api/MasterBind/Module_Select",
  Pages_Select: "/CRMCOREAPI/api/MasterBind/Pages_Select",
  CreateModule: "/CRMCOREAPI/api/MasterBind/CreateModule",
  CreatePages: "/CRMCOREAPI/api/MasterBind/CreatePages",
  UpdatePages: "/CRMCOREAPI/api/MasterBind/UpdatePages",
  UpdateModule: "/CRMCOREAPI/api/MasterBind/UpdateModule",
  Quotation_PaymentTerms_Select:
    "/CRMCOREAPI/api/AccountsQuotation/Quotation_PaymentTerms_Select",
  PI_Load_QuotationID: "/CRMCOREAPI/api/AccountsQuotation/PI_Load_QuotationID",

  Quotation_Email_Log: "/CRMCOREAPI/api/AccountsQuotation/Quotation_Email_Log",
  Quotation_Email: "/CRMCOREAPI/api/AccountsQuotation/Quotation_Email",
  SalesBooking_GenerateTax:
    "/CRMCOREAPI/api/AccountsPaymentInstallment/SalesBooking_GenerateTax",
  TaxInvoice_Search: "/CRMCOREAPI/api/AccountsTaxInvoice/TaxInvoice_Search",
  TaxInvoice_Upload: "/CRMCOREAPI/api/AccountsTaxInvoice/TaxInvoice_Upload",
  DevDashboard_Welcome_PriorityID:
    "/CRMCOREAPI/api/MantisSummary/DevDashboardWelcomePriority",
  DevDashboard_Welcome_Category:
    "/CRMCOREAPI/api/MantisSummary/DevDashboardWelcomeCategory",
  DevDashboard_Welcome_AvgTime_Category:
    "/CRMCOREAPI/api/MantisSummary/DevDashboardWelcomeAvgTimeCategory",
  DevDashboard_Welcome_Status_Count:
    "/CRMCOREAPI/api/MantisSummary/DevDashboardWelcomeStatusCount",
  TrainingVedio: "/CRMCOREAPI/api/TrainingVedio/TrainingVedio",
  PaymentFollowup: "/CRMCOREAPI/api/Accounts/PaymentFollowup",
  ManageGlobalMaster: "/CRMCOREAPI/api/MasterBind/ManageGlobalMaster",
  GetTeamMember: "/CRMCOREAPI/api/MasterBind/GetTeamMember",
  Reason_Select: "/CRMCOREAPI/api/MasterBind/Reason_Select",
  GetProjectInfo: "/CRMCOREAPI/api/ProjectMaster/GetProjectInfo",
  ProjectMasterUpdate: "/CRMCOREAPI/api/ProjectMasterUpdate/SaveProject",
  getViewProject: "/CRMCOREAPI/api/ProjectMasterUpdate/ViewProject",
  ShowImpleStepsMaster_select:
    "/CRMCOREAPI/api/ImplementationSteps/StepDetail_Project_Select",
  ImplementationTracker_Insert: "/CRMCOREAPI/api/ImplementationSteps/Step_Remark",
  ImplementationSteps_Insert_details:
    "/CRMCOREAPI/api/ImplementationSteps/ImplementationSteps_Insert_details",
  Step_Remark_Select: "/CRMCOREAPI/api/ImplementationSteps/Step_Remark_Select",
  ApproveClick: "/CRMCOREAPI/api/ImplementationSteps/ApproveClick",
  Birthday_Anniversary_Interface_Search:
    "/api/CRMAttendance/BirthdayAnniversarySearch",
  ViewDocument: "/CRMCOREAPI/api/ManageDocument/UploadDocument",
  ViewAttachment: "/CRMCOREAPI/api/ViewIssue/ViewAttachment",
  InsertAttachment: "/CRMCOREAPI/api/BugReport/InsertAttachment",
  DeleteAttachment: "/CRMCOREAPI/api/BugReport/DeleteAttachment",
  ViewIssueSearchClient: "/CRMCOREAPI/api/ViewIssue/ViewIssueSearchClient",
  ApplyActionClient: "/CRMCOREAPI/api/ViewIssue/ApplyActionClient",
  InsertNoteLog: "/CRMCOREAPI/api/BugReport/InsertNoteLog",
  UpdateEmployee_Short: "/CRMCOREAPI/api/EmployeeMaster/UpdateEmployee_Short",
  CoorDashboard_Received_Recovery:
    "/CRMCOREAPI/api/CoordinatorDashboard/CoorDashboard_Received_Recovery",
  CoorDashboard_NewSales:
    "/CRMCOREAPI/api/CoordinatorDashboard/CoorDashboard_NewSales",
  CoorDashboard_Open_Dead_Sales:
    "/CRMCOREAPI/api/CoordinatorDashboard/CoorDashboard_Open_Dead_Sales",
  CoorDashboard_Ageing_Sheet_Pending_Recovery:
    "/CRMCOREAPI/api/CoordinatorDashboard/CoorDashboard_Ageing_Sheet_Pending_Recovery",
  CentreRemoveProject: "/CRMCOREAPI/api/ProjectMasterUpdate/CentreRemoveProject",
  BulkNoteInsert: "/CRMCOREAPI/api/BugReport/BulkNoteInsert",
  CreateEmployeeModule: "/CRMCOREAPI/api/EmployeeMaster/CreateEmployeeModule",
  GetEmployeeModule: "/CRMCOREAPI/api/EmployeeMaster/GetEmployeeModule",
  DeleteEmployeeModule: "/CRMCOREAPI/api/EmployeeMaster/DeleteEmployeeModule",
  UpdateStatusCopy: "/CRMCOREAPI/api/ManageExpense/UpdateStatusCopy",
  ExpenceDetails: "/CRMCOREAPI/api/ManageExpense/ExpenceDetails",
  AMC_Payment_Installment_Insert:
    "/CRMCOREAPI/api/AccountsPaymentInstallment/AMC_Payment_Installment_Insert",
  CoorDashboard_Paid_Request_Status:
    "/CRMCOREAPI/api/CoordinatorDashboard/CoorDashboard_Paid_Request_Status",
  CoorDashboard_Developer_Availability:
    "/CRMCOREAPI/api/CoordinatorDashboard/CoorDashboard_Developer_Availability",
  CoorDashboard_Ticket_Close_Assign:
    "/CRMCOREAPI/api/CoordinatorDashboard/CoorDashboard_Ticket_Close_Assign",
  CoorDashboard_Financial_Recovery_Quotation:
    "/CRMCOREAPI/api/CoordinatorDashboard/CoorDashboard_Financial_Recovery_Quotation",
  CoorDashboard_Top_Client_Amount:
    "/CRMCOREAPI/api/CoordinatorDashboard/CoorDashboard_Top_Client_Amount",
  CoorDashboard_Current_Month_Bifurcation:
    "/CRMCOREAPI/api/CoordinatorDashboard/CoorDashboard_Current_Month_Bifurcation",
  CoorDashboard_Quotation_Month:
    "/CRMCOREAPI/api/CoordinatorDashboard/CoorDashboard_Quotation_Month",
  ManagerDashboard_Ticket_Category_Analysis:
    "/CRMCOREAPI/api/ManagerDashboard/ManagerDashboard_Ticket_Category_Analysis",
  ManagerDashboard_New_Quarter_Sales:
    "/CRMCOREAPI/api/ManagerDashboard/ManagerDashboard_New_Quarter_Sales",
  ManagerDashboard_Paid_Request_Status:
    "/CRMCOREAPI/api/ManagerDashboard/ManagerDashboard_Paid_Request_Status",
  TSAAggrementSearch: "/CRMCOREAPI/api/TSAAgreement/TSAAggrementSearch",
  TSACancel: "/CRMCOREAPI/api/TSAAgreement/TSACancel",
  ConfirmTSA: "/CRMCOREAPI/api/TSAAgreement/ConfirmTSA",
  TSAHold: "/CRMCOREAPI/api/TSAAgreement/TSAHold",
  TSAAgreementVarification: "/CRMCOREAPI/api/TSAAgreement/TSAAgreementVarification",
  ManagerDashboard_New_Sales:
    "/CRMCOREAPI/api/ManagerDashboard/ManagerDashboard_New_Sales",
  ManagerDashboard_Received_Recovery:
    "/CRMCOREAPI/api/ManagerDashboard/ManagerDashboard_Received_Recovery",
  ManagerDashboard_Top_Client_Amount:
    "/CRMCOREAPI/api/ManagerDashboard/ManagerDashboard_Top_Client_Amount",
  CreateTechnicalSupportAgreement:
    "/CRMCOREAPI/api/TSAAgreement/CreateTechnicalSupportAgreement",
  ManagerDashboard_Delay_Recovery:
    "/CRMCOREAPI/api/ManagerDashboard/ManagerDashboard_Delay_Recovery",
  TSAMarque: "/CRMCOREAPI/api/TSAAgreement/TSAMarque",
  ClientFeedbackSearch: "/CRMCOREAPI/api/Feedback/ClientFeedbackSearch",
  ClientFeedbackTransaction: "/CRMCOREAPI/api/Feedback/ClientFeedbackTransaction",
  ProjectVsAMCMapping: "/CRMCOREAPI/api/ProjectMasterUpdate/ProjectVsAMCMapping",
  ManagerDashboard_Recovery_Quarter:
    "/CRMCOREAPI/api/ManagerDashboard/ManagerDashboard_Recovery_Quarter",
  ManagerDashboard_Ageing_POC:
    "/CRMCOREAPI/api/ManagerDashboard/ManagerDashboard_Ageing_POC",
  ManagerDashboard_Total_Pending:
    "/CRMCOREAPI/api/ManagerDashboard/ManagerDashboard_Total_Pending",
  CoorDashboard_Total_Pending:
    "/CRMCOREAPI/api/CoordinatorDashboard/CoorDashboard_Total_Pending",
  CreateSalesLead: "/CRMCOREAPI/api/SalesLead/CreateSalesLead",
  DeadSalesLead: "/CRMCOREAPI/api/SalesLead/DeadSalesLead",
  ConvertedSalesLead: "/CRMCOREAPI/api/SalesLead/ConvertedSalesLead",
  SearchSalesLeads: "/CRMCOREAPI/api/SalesLead/SearchSalesLeads",
  UploadEmployeeSignature: "/CRMCOREAPI/api/EmployeeMaster/UploadEmployeeSignature",
  ResendEmail: "/CRMCOREAPI/api/SalesLead/ResendEmail",
  EditSalesLead: "/CRMCOREAPI/api/SalesLead/EditSalesLead",
  UpdateSalesLead: "/CRMCOREAPI/api/SalesLead/UpdateSalesLead",
  Lead_Email_Log: "/CRMCOREAPI/api/SalesLead/Lead_Email_Log",
  Tsa_Agreement_Format: "/CRMCOREAPI/api/TSAAgreement/Tsa_Agreement_Format",
  Change_Tsa_Agreement_Format:
    "/CRMCOREAPI/api/TSAAgreement/Change_Tsa_Agreement_Format",
  CreateFeedback: "/CRMCOREAPI/api/Feedback/CreateFeedback",
  ResendFeedbackMail: "/CRMCOREAPI/api/Feedback/ResendFeedbackMail",
  AllEmployeeSearch: "/CRMCOREAPI/api/SalesLead/AllEmployeeSearch",
  CreateEmployeeFeedback: "/CRMCOREAPI/api/EmployeeFeedback/CreateEmployeeFeedback",
  ResendFeedbackWhatsapp: "/CRMCOREAPI/api/Feedback/ResendFeedbackWhatsapp",
  EmployeeFeedbackSearch: "/CRMCOREAPI/api/EmployeeFeedback/EmployeeFeedbackSearch",
  ShowFullFeedback: "/CRMCOREAPI/api/EmployeeFeedback/ShowFullFeedback",
  ShowAverageRating: "/CRMCOREAPI/api/EmployeeFeedback/ShowAverageRating",
  EmployeeFeebackBind: "/CRMCOREAPI/api/EmployeeFeedback/EmployeeFeebackBind",
  EmployeeFeedbackTransaction:
    "/CRMCOREAPI/api/EmployeeFeedback/EmployeeFeedbackTransaction",
  ResendEmployeeFeedbackWhatsapp:
    "/CRMCOREAPI/api/EmployeeFeedback/ResendEmployeeFeedbackWhatsapp",
  ResendEmployeeFeedbackMail:
    "CRMAPI/api/EmployeeFeedback/ResendEmployeeFeedbackMail",
  EmployeeFeedbackAvg: "/CRMCOREAPI/api/EmployeeFeedback/EmployeeFeedbackAvg",
  GetWorkingHours: "/CRMCOREAPI/api/CRMAttendance/GetWorkingHours",
  GetEmployeeTransactions: "/CRMCOREAPI/api/Attendence/GetEmployeeTransactions",
  EmployeeBind: "/CRMCOREAPI/api/Attendence/EmployeeBind",
  WeaklyMonthlyBreakCount: "/CRMCOREAPI/api/Attendence/WeaklyMonthlyBreakCount",
  WeaklyMonthlyBreakHours: "/CRMCOREAPI/api/Attendence/WeaklyMonthlyBreakHours",
  EmployeeFeedbackDashboard: "/CRMCOREAPI/api/Attendence/EmployeeFeedbackDashboard",
  ClientFeedbackDashboard: "/CRMCOREAPI/api/Attendence/ClientFeedbackDashboard",
  EmailerSearch: "/CRMCOREAPI/api/Emailer/EmailerSearch",
  RepushMail: "/CRMCOREAPI/api/Emailer/RepushMail",
  GetFlagProject: "/CRMCOREAPI/api/ProjectMasterUpdate/GetFlagProject",
  UpdateFlagProject: "/CRMCOREAPI/api/ProjectMasterUpdate/UpdateFlagProject",
  EmployeeEmail: "/CRMCOREAPI/api/Emailer/EmployeeEmail",
  SendTaxInvoiceMailFinal:
    "/CRMCOREAPI/api/AccountsPaymentInstallment/SendTaxInvoiceMailFinal",
  TaxInvoiceLog: "/CRMCOREAPI/api/AccountsTaxInvoice/TaxInvoiceLog",
  MorningWishSave: "/CRMCOREAPI/api/MorningWish/MorningWishSave",
  MorningWishSearch: "/CRMCOREAPI/api/MorningWish/MorningWishSearch",
  RemoveMorningWish: "/CRMCOREAPI/api/MorningWish/RemoveMorningWish",
  UpdateMorningWish: "/CRMCOREAPI/api/MorningWish/UpdateMorningWish",
  EditMorningWish: "/CRMCOREAPI/api/MorningWish/EditMorningWish",
  UploadEmployeeImages: "/CRMCOREAPI/api/EmployeeMaster/UploadEmployeeImages",
  RemoveEmployeeImages: "/CRMCOREAPI/api/EmployeeMaster/RemoveEmployeeImages",
  SearchEmployeeImages: "/CRMCOREAPI/api/EmployeeMaster/SearchEmployeeImages",
  ForceFullyShortBreakAttendanceSave:
    "/CRMCOREAPI/api/CRMAttendence/ForceFullyShortBreakAttendanceSave",
  ForceFullyShortBreakAttendanceSearch:
    "/CRMCOREAPI/api/CRMAttendence/ForceFullyShortBreakAttendanceSearch",
  Old_Mantis_Sub_Team_Select:
    "/CRMCOREAPI/api/MasterBind/Old_Mantis_Sub_Team_Select",
  Old_Mantis_Team_Select:
    "/CRMCOREAPI/api/MasterBind/Old_Mantis_Team_Select",
  Attendence_Report:
    "/CRMCOREAPI/api/CRMAttendence/Attendence_Report",
  MonthWiseAttendanceReoprt:
    "/CRMCOREAPI/api/CRMAttendence/MonthWiseAttendanceReoprt",
  AttendanceReoprtTypeWise:
    "/CRMCOREAPI/api/CRMAttendence/AttendanceReoprtTypeWise",
  WOandOLTypeWise:
    "/CRMCOREAPI/api/CRMAttendence/WOandOLTypeWise",
  SaveFilterTableReprintData:
    "/CRMCOREAPI/api/DynamicFilter/SaveFilterTableReprintData",
  GetFilterTableReprintData:
    "/CRMCOREAPI/api/DynamicFilter/GetFilterTableReprintData",
  GetFeaturesStatus:
    "/CRMCOREAPI/api/Circular/GetFeaturesStatus",
  Reporter_Select_Employee:
    "/CRMCOREAPI/api/MasterBind/Reporter_Select_Employee",
};
