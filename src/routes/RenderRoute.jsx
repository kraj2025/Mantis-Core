import React, { Fragment, Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "@app/components/loader/Loading";
import ErrorBoundary from "../layouts/error-Boundary";
import Layout from "@app/layouts";
import Authenticated from "@app/Guard/Authenticated.jsx";
import Guest from "@app/Guard/Guest.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import {
  GetBindMenu,
  GetBindResourceList,
  GetRoleListByEmployeeIDAndCentreID,
} from "../store/reducers/common/CommonExportFunction";
import FeedBack from "../modules/login/Feedback/FeedBack.jsx";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage.js";

function RenderRoute() {
  const { GetMenuList } = useSelector((state) => state?.CommonSlice);
  const localData = useLocalStorage("userData", "get");
  const location = useLocation();
  const dispatch = useDispatch();
  const [waitForRoute, setWaitForRoute] = useState(true);

  const fetchData = async () => {
    try {
      // await dispatch(
      //   GetRoleListByEmployeeIDAndCentreID({
      //     employeeID: localData?.employeeID,
      //     centreID: localData?.centreID,
      //   })
      // );

      await dispatch(
        GetBindMenu({
          RoleID: localData?.defaultRole,
        })
      );

      await dispatch(GetBindResourceList());

      setWaitForRoute(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setWaitForRoute(false);
    }
  };

  useEffect(() => {
    if (localData && GetMenuList?.length === 0) {
      fetchData();
    } else {
      setWaitForRoute(false);
    }
  }, [location]);

  if (waitForRoute) {
    return <Loading />;
  }

  // Define your routes after ensuring all necessary data is fetched
  const getAllUrls = [];
  GetMenuList?.forEach((menu) => {
    menu?.children.forEach((child) => {
      getAllUrls.push(child.url.toLowerCase());
    });
  });

  const bindroutes = allRoutes["roleRoutes"].reduce((acc, current) => {
    if (getAllUrls.includes(current?.path.toLowerCase())) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          {[...allRoutes["commonRoutes"], ...bindroutes]?.map(
            (route, index) => {
              const Component = route?.component;
              const Layout = route?.layout || Fragment;
              const Guard = route?.Guard || Fragment;
              return (
                <Route
                  path={route?.path}
                  exact={route?.exact}
                  key={index}
                  element={
                    <Guard>
                      <Layout>
                        <Component />
                      </Layout>
                    </Guard>
                  }
                />
              );
            }
          )}
          {/* Catch-all route */}

          <Route path="/feedBack" element={<FeedBack />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default RenderRoute;

const allRoutes = {
  commonRoutes: [
    // {
    //   Guard: Authenticated,
    //   layout: Layout,
    //   path: "*",
    //   component: lazy(() => import("@app/pages/NotFound.jsx")),
    //   exact: true,
    // },

    // {
    //   Guard: Guest,
    //   path: "/FeedBack",
    //   component: lazy(() => import("../modules/login/Feedback/FeedBack.jsx")),
    //   exact: true,
    // },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/dashboard",
      component: lazy(() => import("@app/pages/Dashboard.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ClientDashboard",
      component: lazy(() => import("@app/pages/ClientDashboard.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CoordinatorDashboard",
      component: lazy(() => import("@app/pages/CoordinatorDashboard.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HrDashboard",
      component: lazy(() => import("@app/pages/HrDashboard.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ManagerDashboard",
      component: lazy(() => import("@app/pages/ManagerDashboard.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/myview",
      component: lazy(() => import("@app/pages/MyView.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Circular",
      component: lazy(() => import("@app/pages/Circular.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/AmcCalculator",
      component: lazy(
        () => import("@app/pages/AmcCalculator/AmcCalculator.jsx")
      ),
      exact: true,
    },

    // C:\Users\ADMIN\Desktop\mantis-new\Mantis-Core\src\pages\AmcCalculator\AmcCalculator.jsx
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ImplementationStepMaster",
      component: lazy(() => import("@app/pages/ImplementationStepMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/TicketView",
      component: lazy(() => import("@app/pages/TicketView.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/viewissues",
      component: lazy(() => import("@app/pages/ViewIssues.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/AIDashboard",
      component: lazy(
        () => import("@app/pages/AiReportDashboard/OtpLogin.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ReportViewer",
      component: lazy(
        () => import("@app/pages/AiReportDashboard/ChatAI/ReportViewer.jsx")
      ),
      exact: true,
    },
    {
      // Guard: Authenticated,
      // layout: Layout,
      path: "/ReportChatAI",
      component: lazy(
        () => import("@app/pages/AiReportDashboard/ChatAI/ReportChatAI.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/AttendanceReport",
      component: lazy(() => import("@app/pages/AttendanceReport.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ViewIssuePage",
      component: lazy(() => import("@app/pages/ViewIssuePage.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Summary",
      component: lazy(() => import("@app/pages/Summary.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/BulkReportIssue",
      component: lazy(() => import("@app/pages/BulkReportIssue.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/reportissue",
      component: lazy(() => import("@app/pages/ReportIssue.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/FeedbackList",
      component: lazy(() => import("@app/pages/FeedbackList.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/EmployeeFeedback",
      component: lazy(() => import("@app/pages/EmployeeFeedback.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/EmailerView",
      component: lazy(() => import("@app/pages/EmailerView.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/TechnicalSupportAgreement",
      component: lazy(() => import("@app/pages/TechnicalSupportAgreement.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SalesLead",
      component: lazy(() => import("@app/pages/SalesLead.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SalesLeadCreate",
      component: lazy(() => import("@app/pages/SalesLeadCreate.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/BulkNewTicketNotes",
      component: lazy(() => import("@app/pages/BulkNewTicketNotes.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/AMCSalesBooking",
      component: lazy(() => import("@app/pages/AMCSalesBooking.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/NewTicketClient",
      component: lazy(() => import("@app/pages/NewTicketClient.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ViewTicketClient",
      component: lazy(() => import("@app/pages/ViewTicketClient.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ClientFeedbackFlow",
      component: lazy(() => import("@app/pages/ClientFeedbackFlow.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DeveloperCalendar",
      component: lazy(() => import("@app/pages/CRM/DeveloperCalendar.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/newdevelopercalendar",
      component: lazy(
        () => import("@app/pages/DeveloperCalendar/DeveloperCalender.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/AutoBackupStatusSheet",
      component: lazy(() => import("@app/pages/AutoBackupStatusSheet.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CollectionSheet",
      component: lazy(() => import("@app/pages/CollectionSheet.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/AgeingSheet",
      component: lazy(() => import("@app/pages/AgeingSheet.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/EmployeeMaster",
      component: lazy(() => import("@app/pages/EmployeeMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SearchEmployeeMaster",
      component: lazy(() => import("@app/pages/SearchEmployeeMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SearchProjectMaster",
      component: lazy(() => import("@app/pages/SearchProjectMaster.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/VideoPlayerMaster",
      component: lazy(() => import("@app/pages/VideoPlayerMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DashboardConfiguration",
      component: lazy(() => import("@app/pages/DashboardConfiguration.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MasterType",
      component: lazy(() => import("@app/pages/MasterType.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/GlobalMaster",
      component: lazy(() => import("@app/pages/GlobalMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Master",
      component: lazy(() => import("@app/pages/Master.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/EmployeeFeedbackMaster",
      component: lazy(() => import("@app/pages/EmployeeFeedbackMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ImplementationPlan",
      component: lazy(() => import("@app/pages/ImplementationPlan.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ManageOrdering",
      component: lazy(() => import("@app/pages/ManageOrdering.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SearchAmountSubmission",
      component: lazy(() => import("@app/pages/SearchAmountSubmission.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CircularSearch",
      component: lazy(() => import("@app/pages/CircularSearch.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SearchConnectorRequest",
      component: lazy(() => import("@app/pages/SearchConnectorRequest.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SalesBooking",
      component: lazy(() => import("@app/pages/SalesBooking.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/TaxInvoiceView",
      component: lazy(() => import("@app/pages/TaxInvoiceView.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/QuotationBooking",
      component: lazy(() => import("@app/pages/QuotationBooking.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SearchSalesBooking",
      component: lazy(() => import("@app/pages/SearchSalesBooking.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ShortBreakModal",
      component: lazy(() => import("@app/pages/ShortBreakModal.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/LongBreakModal",
      component: lazy(() => import("@app/pages/LongBreakModal.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MorningWishSearch",
      component: lazy(() => import("@app/pages/MorningWishSearch.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/TaxInvoiceRequest",
      component: lazy(() => import("@app/pages/TaxInvoiceRequest.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SearchQuotationBooking",
      component: lazy(() => import("@app/pages/SearchQuotationBooking.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Attendance",
      component: lazy(() => import("@app/pages/CRM/Attendance.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/PurchaseOrder",
      component: lazy(() => import("@app/pages/CRM/PurchaseOrder.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/PurchaseOrderSearch",
      component: lazy(() => import("@app/pages/CRM/PurchaseOrderSearch.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CrmDashboard",
      component: lazy(() => import("@app/pages/CRM/CrmDashboard.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/LeaveRequest",
      component: lazy(() => import("@app/pages/LeaveRequest.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/LeaveViewApproval",
      component: lazy(() => import("@app/pages/LeaveViewApproval.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ShowEmployee",
      component: lazy(() => import("@app/pages/CRM/ShowEmployee.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ShowWorkingDays",
      component: lazy(() => import("@app/pages/CRM/ShowWorkingDays.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/AdvanceRequestView",
      component: lazy(() => import("@app/pages/CRM/AdvanceRequestView.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/AdvanceRequest",
      component: lazy(() => import("@app/pages/CRM/AdvanceRequest.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ExpenseSubmissionPage",
      component: lazy(() => import("@app/pages/CRM/ExpenseSubmissionPage.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ExpenseSubmission",
      component: lazy(() => import("@app/pages/CRM/ExpenseSubmission.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/UploadBiometric",
      component: lazy(() => import("@app/pages/CRM/UploadBiometric.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ViewExpense",
      component: lazy(() => import("@app/pages/CRM/ViewExpense.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ViewEmployeeExpense",
      component: lazy(() => import("@app/pages/CRM/ViewEmployeeExpense.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/EmployeeChangePassword",
      component: lazy(() => import("@app/pages/EmployeeChangePassword.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ProjectMaster",
      component: lazy(() => import("@app/pages/ProjectMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/UserVSProjectMapping",
      component: lazy(() => import("@app/pages/UserVSProjectMapping.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/UserVsModuleMapping",
      component: lazy(() => import("@app/pages/UserVsModuleMapping.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ChangeSubmitDateofTicket",
      component: lazy(() => import("@app/pages/ChangeSubmitDateofTicket.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/QueryVsResultMaster",
      component: lazy(() => import("@app/pages/QueryVsResultMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/AccessRight",
      component: lazy(() => import("@app/pages/AccessRight.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MorningWish",
      component: lazy(() => import("@app/pages/MorningWish.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MorningWishSearch",
      component: lazy(() => import("@app/pages/MorningWishSearch.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/BirthdayWishSearch",
      component: lazy(() => import("@app/pages/BirthdayWishSearch.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/BirthdayWish",
      component: lazy(() => import("@app/pages/BirthdayWish.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ConnectorRequest",
      component: lazy(() => import("@app/pages/ConnectorRequest.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/AmountSubmission",
      component: lazy(() => import("@app/pages/AmountSubmission.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/LedgerStatus",
      component: lazy(() => import("@app/pages/LedgerStatus.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Ledger",
      component: lazy(() => import("@app/pages/Ledger.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/LedgerTransaction",
      component: lazy(() => import("@app/pages/LedgerTransaction.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/UploadDocument",
      component: lazy(() => import("@app/pages/UploadDocument.jsx")),
      exact: true,
    },
   {
      Guard: Authenticated,
      layout: Layout,
      path: "/AdvanceRequestSettlement",
      component: lazy(() => import("@app/pages/CRM/AdvanceRequestSettlement.jsx")),
      exact: true,
    },
    {
      Guard: Guest,
      path: "/login",
      component: lazy(() => import("../modules/login/Login")),
      exact: true,
    },

    {
      path: "/ForgetPassword",
      component: lazy(() => import("@app/modules/login/ForgetPassword.jsx")),
      exact: true,
    },
    // {
    //   // Guard: Authenticated,
    //   layout: Layout,
    //   path: "/examination-room",
    //   component: lazy(
    //     () => import("@app/pages/examinationRoom/OPD/ExaminationRoom.jsx")
    //   ),
    //   exact: true,
    // },
  ],
  roleRoutes: [
    // Reports Section End
    // Reports Section Start
  ],
};
