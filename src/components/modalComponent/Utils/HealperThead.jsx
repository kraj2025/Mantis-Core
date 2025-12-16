import { useTranslation } from "react-i18next";

export const autoTHEAD = [
  "S.No.",
  "Vertical",
  "Team",
  "Wing",
  "Project Name",
  "Last AB Date",
  "Last AB Done By",
  // O_Name,
  // O_Email,
  // O_Mobile,
  "SPOC_Name",
  "SPOC_Email",
  "SPOC_Mobile",
  // Remark,
  "Edit",
  "Show Log",
  // "Color code",
];

export const viewTHEAD = [
  "ID",
  "Project",
  "Category",
  "View Status",
  "Date Submitted",
  "Last Update",
  "Reporter",
  "AssignedTo",
  "Priority",
  "Status",
  "Reported By Mobile No",
  "Reported By Name",
  "Summary",
  "Description",
  "Delivery Date",
];
// export const viewissuesTHEAD = [
//   t("S.No."),
//   t("Select"),
//   "Ticket ID",
//   "Project Name",
//   "Category Name",
//   "Reporter Name",
//   "Assign To",
//   { name: "Summary", width: "40%" },
//   "Status",
//   "Date Submitted",
//   "Delivery Date",
//   "ManMinutes",
//   { name: "Change Action", width: "9%" },
// ];
export const activityTHEAD = [
  { name: "Update", width: "10%" },
  { name: "NoteId", width: "5%" },
  "Notes",
  { name: "User Name", width: "13%" },
  // "User Name",
  { name: "DateSubmitted", width: "15%" },
];
export const issueHistoryTHEAD = [
  "DateModified",
  "User Name",
  "Field",
  "Old Value",
  "New Value",
];

export const updateIssueTHEAD = [
  "ID",
  "Project",
  "Category",
  "Date Submitted",
  "Last Update",
  "Reporter",
  "AssignedTo",
  "Priority",
  "Delivery Date",
  "Summary",
  "Description",
  "Notes",
  "Man Hours",
];

export const EmployeeTHEAD = [
  "S.No.",
  "EmployeeCode",
  "EmployeeID",
  "MantisID",
  "User Name",
  "Real Name",
  "BloodGroup",
  "Email",
  "Address",
  "Mobile No.",
  "Active",
  "Profile Image",
  "Edit",
  "Action",
];
export const userVSprojectTHEAD = [
  "S.No.",
  "ProjectID",
  "Project Name",
  // "Remove",
];
export const documentTHEAD = [
  "S.No.",
  "Vertical",
  "Team",
  "Wing",
  "Project Name",
  "Type",
  "Docs",
  "Upload",
  "Uploaded By",
  "Uploaded Date",
  { name: "Remove", width: "5%" },
];

export const showsearchTHEAD = [
  { name: "S.No.", width: "5%" },
  "Connector",
  "Rate",
  "Quantity",
  "Amount",
];
export const designationTHEAD = [
  "S.No.",
  "Designation Name",
  // "Action",
  "Edit",
];

export const projectTHEAD = [
  "S.No.",
  "Project Name",
  "Vertical",
  "Team",
  "Wing",
  "Edit",
];
export const projectModalTHEAD = [
  { name: "S.No.", width: "3%" },
  "Project Name",
  "Vertical",
  "Team",
  "Wing",
  "ManDays",
  "OnSiteCharges",
  "Machine Uni",
  "Machine Bi",
  // "Edit",
  { name: "Action", width: "5%" },
];

export const moduleTHEAD = [
  "S.No.",
  "Module Name",
  "LiveStatus",
  "DeliveryStatus",
  "AfterLiveStatus",
  "LiveDate",
  "Phase",
  "Remove",
  "Action",
];
export const billingTHEAD = [
  "S.No.",
  "Billing CompanyName",
  "Billing Address",
  "GST Number",
  "PanCardNo.",
  "Action",
];
export const centreTHEAD = ["S.No.", "Centre Name", "Action", "Remove"];
export const machineTHEAD = [
  "S.No.",
  "Machine Name",
  "InterfaceType",
  "Date",
  "LiveStatus",
  "AfterLiveStatus",
  "QtType",
  "Remove",
  "Action",
];
export const categoryTHEAD = ["S.No.", "Project Name"];
export const amountTHEAD = [
  { name: "S.No.", width: "2%" },
  "Project Name",
  // "Vertical",
  "Team",
  // "Wing",
  "POC-I",
  // "POC-II",
  // "POC-III",
  "Amount",
  // "Total Amount",
  "PaymentMode",
  // "Reference ID",
  "Deposite Date",
  "Entry Date",
  "Deposite By",
  "Bank Name",
  "Voucher No.",
  "Remarks",
  { name: "Settlement", width: "2%" },
  { name: "Print", width: "2%" },
  "Email",
  // { name: "Tax Invoice", width: "2%" },

  "Cancel",
];

export const salesbookingTHEAD = [
  "S.No.",
  "Services",
  "Payment Mode",
  "Rate",
  "Quantity",
  "Discount / %",
  "Tax / %",
  "Amount",
  "Remark",
  "isPaid",
  "Expected/Start Date",
  "Live Date",
  "End Date",
  "Remove",
];

export const taxinvoicesTHEAD = [
  "S.No.",
  "Services",
  "Payment Mode",
  "Rate",
  "Quantity",
  "Discount / %",
  "Tax / %",
  "Amount",
  "Remark",
  "Expected/Start Date",
  // "End Date",
  "Remove",
];

export const quotagTHEAD = [
  { name: "S.No.", width: "10%" },
  "Terms",
  { name: "Cancel", width: "10%" },
];
export const taxbookingTHEAD = [
  "S.No.",
  "Item Name",
  "Rate",
  "Quantity",
  "Discount / %",
  "Tax / %",
  "Amount",
];

export const purchasebookingTHEAD = [
  "S.No.",
  "Services",
  "SAC",
  // "Rate",
  "Quantity",
  "Discount / %",
  "Tax / %",
  "Amount",
  "Remark",
  "Remove",
];

export const querySaveTHEAD = [
  "S.No.",
  "Product Name",
  "Module Name",
  "Query Name",
  "CreatedBy",
  "Status",
  "Action",
];
export const queryResultTHEAD = [
  "S.No.",
  "Query Name",
  "Result",
  "CreatedBy",
  "Action",
  "View Docs",
];

export const searchQueryTHEAD = [
  "S.No.",
  "SolutionBy",
  "OnDate",
  "Solution",
  "View",
];

export const implementTHEAD = [
  "S.No.",
  "Group Name",
  "Steps",
  "Responsible",
  "Type",
  "RequiredDays",
  "Interdependent",
  "Project",
  "Action",
  "Remove",
];
export const connectorSearchTHEAD = [
  { name: "S.No.", width: "5%" },
  "Issue No",
  // "IssueBy",
  "ClientName",
  "25 Pin Male",
  "25 Pin Female",
  "9 Pin Male",
  "9 Pin Female",
  "Gross Amount",
  "Discount Amount",
  "Net Amount",
  "Paid Amount",
  "Balance Amount",
  "Created Date",
  "Print",
  "Email",
  "Action Change",
  // "Approve",
  // "Issue",
  // "Reject", dropdown
  // "Receipt",
  // "Settlement",l
  // "Discount",
  // "Edit",
];

export const settlementTHAED = [
  "S.No.",
  "Issue No",
  "PaymentMode",
  "ReceivedDate",
  "Amount",
  "EntryDate",
  "CreatedBy",
];

export const attendanceTHEAD = [
  // "S.No.",
  "Team Member",
  "Login",
  "Location",
  "Logout",
  "Location1",
];

export const leaveViewRequestTHEAD = [
  { name: "S.No.", width: "2%" },
  { name: "Month-Year", width: "10%" },
  "Employee Name",
  "NoOfDays",
  "Leave Date",
  "Description",
  { name: "Edit", width: "5%" },
  // "view",
];
export const advanceRequestTHEAD = [
  "S.No.",
  "Entry Date",
  "Expected Date",
  "Name",
  "Vertical",
  "Team",
  "Wing",
  "Purpose",
  "Amount",
  { name: "Settlement", width: "10%" },
  { name: "Action", width: "8%" },
];
export const showEmployeeTHEAD = [
  "S.No.",
  "Name",
  "Team",
  "Report To",
  "Email Id",
  "Mobile No",
  "Weekoffs",
  "Available Leaves",
  "Status",
  "Inventory",
  "Action",
];
export const showWorkingDaysTHEAD = [
  "S.No.",
  "Name",
  "Designation",
  "Team",
  "Total Days",
  "Sundays",
  "CL",
  "SL",
  "WeekOff",
  "CompOff",
  "CL-CIR",
  "SL-CIR",
  "LWP",
  "Working Days",
  "Non Working Days",
  "Missing Days",
  "Payable Days",
];
export const attendanceThead = [
  "#Team Member",
  "Login",
  "Location",
  "Logout",
  "Location",
];
export const ViewExpenseThead = [
  { name: "S.No.", width: "2%" },
  "Name",
  "TripName",
  "Date",
  "Day",
  "Hotel",
  "Meals",
  "Local",
  "InterCity",
  // "Phone",
  "Entertainment",
  "Others",
  "Total",
  "Status",
  "Action",
  { name: "Attachment", width: "5%" },
];

export const ViewEmployeeExpenseThead = [
  "S.No",
  "Name",
  "Team",
  "Reporting Manager",
  "Total Amount",
  "Pending Amount",
  "Rejected Amount",
  "Approved Amount",
  "Advance Amount",
  "Paid Amount",
  "Net Payable Amount",
  "Action",
  "Attachment",
];

export const purchaseOrderTHEAD = [
  "Date",
  "Purchase Order Number",
  "Party Name",
  "Valid Till",
  "Amount",
  "Status",
];

export const collectTHEAD = [
  { name: "S.No." },
  { name: "Project Name" },
  { name: "POC" },
  { name: "Opening Balance" },
  { name: "Machine" },
  { name: "Centre" },
  { name: "Change Request" },
  { name: "Resource Billing" },
  { name: "SAAS" },
  { name: "AMC Amount" },
  { name: "AMC Date", width: "20%" },
  { name: "STotal" },
  { name: "April" },
  { name: "May" },
  { name: "June" },
  { name: "July" },
  { name: "August" },
  { name: "September" },
  { name: "October" },
  { name: "November" },
  { name: "December" },
  { name: "January" },
  { name: "February" },
  { name: "March" },
  { name: "Total" },
];

export const manageorderingTHEAD = ["S.No.", "ProjectID", "Project Name"];
export const rolemasterTHEAD = ["S.No.", "Role Name", "Status", "View", "Edit"];
export const menumasterTHEAD = ["S.No.", "Menu Name", "Status", "View", "Edit"];

export const salesSearchThead = [
  "S.No.",
  "Project Name",
  "POC",
  "Team",
  "Sales No.",
  "Item Name",
  "Sales Date",
  "Remark",
  "PaymentMode",
  "Net Amount",
  "Print",
  "PI",
  "Tax",
  "Entry Date",
  "EmailStatus",
  "Email",
  "Edit",
  "Cancel",
];
export const quotationSearchThead = [
  "S.No.",
  "Project Name",
  "Team",
  "POC",
  "Quotation No.",
  "PINo",
  "PaymentMode",
  "Gross Amount",
  "Dis Amount",
  "Tax Amount",
  "Net Amount",
  "Entry Date",
  "Remark",
  "Email",
  "Print",
  "Print PI",
  "Action",
  "Edit",
  "Cancel",
];

export const ledgerstatusThead = [
  "S.No.",
  "Team",
  "SalesManager",
  "POC-1",
  "Project Name",
  "Opening Balance",
  "Current Sale",
  "Received Amount",
  "Closing Balance",
  "LiveDate",
  "City",
  "SPOC",
  "Mobile",
  "Email",
  "Ledger Status",
  "Lock/UnLockReason",
  "Last Paid Amount",
  "Last Paid Date",
  "Age(Last Paid Date)",
  "Log",
];

export const ledgerTransactionThead = [
  "S.No.",
  "Client",
  "Closing Balance",
  "Security Amount",
  "Testing Charges",
  "Net Payable",
  "Bill Date",
  "Invoice No.",
  "Opening Balance",
  "Debit Amount",
  "Credit Amount",
  "Closing Amount",
];

export const TaxsearchTHEAD = [
  "S.No.",
  "Project Name",
  "POC",
  "Team",
  "Sales No.",
  "Item Name",
  // "Sales Date",
  "Remark",
  "PaymentMode",
  "Gross Amount",
  "Dis Amount",
  "Tax Amount",
  "Net Amount",
  "Print",
  "Tax Invoice",
  // "PI",
  "Entry Date",
  "Email",
  // "Edit",
  // "Cancel",
  // "Action",
];

export const ageingTHEAD = [
  "ID",
  "Project",
  "Reporter",
  "AssignTo",
  "DateSubmitted",
  "DateDifference",
  "Category",
  "Summary",
  "Status",
  "DeliveryDate",
  "DeliveryDateChangeCount",
  "Hold",
];

export const ChartData = [
  {
    label: "Bar Chart",
    value: "Bar Chart",
  },
  {
    label: "Pie Chart",
    value: "Pie Chart",
  },

  {
    label: "Radar Chart",
    value: "Radar Chart",
  },
  {
    label: "PolarArea Chart",
    value: "PolarArea Chart",
  },
  {
    label: "Line Chart",
    value: "Line Chart",
  },
];

export const getChart = (s, maindashboard) => {
  switch (s) {
    case "Pie Chart":
      return <Chat2 state={maindashboard} />;
      break;
    case "PolarArea Chart":
      return <PolarAreaChart state={maindashboard} />;
      break;
    case "Radar Chart":
      return <RadarChart state={maindashboard} />;
      break;
    case "Line Chart":
      return <Linechart state={maindashboard} />;
      break;
    // case "Bar Chart":
    //   return <BarChart state={maindashboard} />;
    //   break;
  }
};

export const todaysDeliveryTHEAD = [
  "S.No.",
  // "Select",
  "Ticket ID",
  "Project Name",
  "Category Name",
  "Reporter Name",
  "Assign To",
  // "Summary",
  { name: "Summary", width: "40%" },
  "Status",
  "Date Submitted",
  "Delivery Date",
  "ManHour",
  // { name: "Change Action", width: "9%" },
];

export const circularThead = [
  { name: "S.No", width: "2%" },
  "CicualarSentBy",
  "DocumentNo",
  "Subject",
  "Message",
  "Entry Date",
  "Valid From",
  "Valid To",
  "TotalUserCount",
  "ReadByCount",
  "UnReadByCount",
  "Attachment",
];

export const ledgerThead = [
  { name: "S.No", width: "2%" },
  "Date",
  "InvoiceNo.",
  "Particular",
  "Amount",
  "Status",
];
export const ledgerTDSThead = [
  { name: "S.No", width: "2%" },
  "Date",
  "InvoiceNo.",
  "Particular",
  "Amount",
  "TDS",
];
export const ledgerPendingThead = [
  { name: "S.No", width: "2%" },
  "Date",
  "InvoiceNo.",
  "Particular",
  "Amount",
  "Status",
];
export const projectPlanTHEAD = [
  { name: "S.No.", width: "2%" },
  "Team",
  "ProjectID",
  "Project Name",
  "Display Name",
  "Address",
  "Dates",
  "Details",
  "Status",
  "Amc Amount",
  "PO Amount",
  "Advanced Amount",
  "Received Amount",
  "Balance Amount",
  // "View Docs",
  "Edit",
  "Action",
];

export const ImplementationModalStatusTHEAD = [
  { name: "S.No", width: "2%" },
  "Modules",
  "D",
  "L",
  "AL",
];

export const ImplementationModalInstallmentStatusTHEAD = [
  { name: "S.No", width: "2%" },
  "Inst Amt",
  "Inst Date",
  "Mode",
  "R",
  "AL",
];

export const ImplementationModalMachineStatusTHEAD = [
  { name: "S.No", width: "2%" },
  "Machine Name",
  "InterfaceType",
  "L",
  "AL",
];

export const ImplementationStepEntryTHEAD = [
  { name: "S.No.", width: "2%" },
  "Steps",
  "Responsible",
  "Type",
  "RequiredDays",
  "Days",
  "Expe from dt",
  "Expe to dt",
  "Act dt",
  "Deviation in Day",
  "Reason for delay",
  "Tracker",
];

export const ImplementationModalTHEAD = [
  { name: "S.No.", width: "2%" },
  // "Id",
  // "StepID",
  // "Steps",
  "Date",
  "Description",
  "Remark",
  "Mail",
  "CreatedBy",
  "EntryDate",
  // "ShowColor",
];

export const checkListEntryTHEAD = [
  { name: "S.No.", width: "2%" },
  "CheckList Name",
  "Status",
  // "Mail",
  "Remarks",
];
export const gmailQuotationTHEAD = [
  { name: "S.No.", width: "7%" },
  "EmailTo",
  "EmailCC",
  // "Email Status",
  // "Entry Date",
  "Send Date",
];
