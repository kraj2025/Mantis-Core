import "./ReportViewer.css";
import logo from "../../../assets/image/logo-itdose.png";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const baseurl = import.meta.env.VITE_APP_REACT_APP_BASE_URL;
import axios from "axios";
import { toast } from "react-toastify";


const ReportViewer = () => {

  const location = useLocation();
  // let id = location?.hash?.split("#")[1];
  const searchParams = new URLSearchParams(location?.hash?.replace(/#/g, '&'));
  const clientcode = searchParams.get('clientcode');
  // const testId = searchParams.get('testId');
  function extractTestIds(url) {
    const queryParams = new URL(url).searchParams;
    const testIdFromQuery = queryParams.get('testId');
    const hashPart = url.split('#')[1]?.split('&')[0]; // clean up hash part
    const testIdFromHash = hashPart ? hashPart.trim() : '';
    if (testIdFromHash) {
      return `${testIdFromQuery},${testIdFromHash}`;
    }
    return testIdFromQuery;
  }
  const [apiURL, setApiURL] = useState()
  const [getReportValue, setGetReportValue] = useState(false)
  // const testId = `${new URLSearchParams(window.location.search).get('testId')},${location?.hash?.split('&')[0]?.slice(1).split('#')?.join(',')}`
 const testId =  extractTestIds(window.location.href)
  console.log("testIdtestIdtestIdtestId", extractTestIds(window.location.href))
  const getAPIURL = async () => {
    const apiResp = await AIReportsAIClientDetail(clientcode)
    if (apiResp?.success) {
      getResportData(apiResp?.data[0]?.EndPointURL)
      setApiURL(apiResp?.data[0]?.EndPointURL)
    }
    return apiResp?.data[0]
  }

  const getResportData = async (url) => {
    try {
      const payload = testId?.split(",")
      const respData = await axios.post(`${url}LabReport/LabGetReportValue`, payload)
      if (respData?.data?.success === false) {
        setGetReportValue(true)
        toast.error(respData?.data?.message, "error")
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    getAPIURL()

  }, [])

  const handleDownloadAPI = async () => {
    // debugger
    if (getReportValue) {
      toast.error("Report Not Found!", "error")
      return
    }
    // store.dispatch(setLoading(true));

    const payload = {
      "testID": testId,
      "isOnlinePrint": "",
      "isConversion": "",
      "isNabl": "",
      "orderBy": "",
      "labType": "",
      "ipAddress": "",
      "isPrev": true,
      "serialNo": ""
    }
    await handleDownload(payload, apiURL)
    // const apiResp = await axios.post(`${apiURL}LabReport/BindMultipleLabReport`, payload)
    // // store.dispatch(setLoading(false));
    // const link = document.createElement("a");
    // link.href = `${apiURL}/${apiResp?.data?.data}`;
    // link.download = "medical-report.pdf";
    // link.click();
  };

  const navigate = useNavigate();
  const redirectlocation = useLocation();

  const handleClick = () => {
    if (getReportValue) {
      toast.error("Report Not Found!", "error")
      return
    }
    const firsttestId = new URLSearchParams(window.location.search).get('testId')
    const hash = redirectlocation.hash || "";
    const encodedHash = encodeURIComponent(firsttestId + hash);
    const requestURL = window.location.href;
    const reportURL = `/ReportChatAI?id=${encodedHash}&requestURL=${requestURL}`;
    navigate(reportURL);
  };


  return (
    <div className="report-container">
      <div className="report-card">
        {/* Header Section */}
        <div className="header-section">
          <div className="icon-badge">
            <img className="stethoscope-icon" src={logo} />
          </div>
          {/* <h1 className="main-title">IT DOSE INFOSYSTEM</h1> */}
          <h1 className="main-title">Chat AI Report</h1>
          <p className="subtitle">Access and download your Medical Report</p>
        </div>

        {/* Action Buttons */}
        <div className="button-container">
          {/* Download Button */}
          <button onClick={handleDownloadAPI} className="download-button">
            <div className="button-content">
              {/* <Download className="download-icon" /> */}
              <i className="fa fa-download"></i>
              <span className="button-text">Download Report</span>
            </div>
            <div className="button-overlay"></div>
          </button>

          <button onClick={handleClick} className="view-button">
            <div className="button-content">
              {/* <Download className="download-icon" /> */}
              <i className="fa fa-download"></i>
              <span className="button-text">View AI Report</span>
            </div>
            <div className="button-overlay"></div>
          </button>

          {/* View Button */}
          {/* <a
            href={`/report-chat-ai?id=${encodeURIComponent(location?.hash ? location?.hash : "")}&requestURL=${window.location.href}`}
            className="view-link"
          >
            <div className="view-button">
              <div className="button-content">
                <i className="fa fa-file"></i>
                <span className="button-text">View AI Report</span>
              </div>
            </div>
          </a> */}
        </div>

        {/* Footer */}
        <div className="footer-section">
          <p className="security-text">
            Your medical information is secure and confidential
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;













// import "./ReportViewer.css";
// import logo from "../../assets/image/logo.png";
// import { useLocation, useParams, useSearchParams } from "react-router-dom";
// import { useEffect } from "react";
// import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
// import store from "../../store/store";
// import makeApiRequest from "../../networkServices/axiosInstance";
// import { RedirectURL } from "../../networkServices/PDFURL";

// const ReportViewer = () => {

//   const location = useLocation();
//   let id = location?.hash?.split("#")[1];
//   console.log("location?.hash", location)
//   const getApiURL = async (url, payload) => {
//     store.dispatch(setLoading(true));
//     debugger
//     try {
//       const options = {
//         method: "Post",
//         data: payload,
//       };
//       const data = await makeApiRequest(url, options);
//       if (data?.success) {
//         // RedirectURL(data?.data);
//       }
//     } catch (error) {
//       console.error("Error Add Expense", error);
//     } finally {
//       store.dispatch(setLoading(false));
//     }


//   }

//   useEffect(() => {
//     const ids = location?.hash?.split("#")[2];
//     if (ids?.length > 0) {
//       const parts = id.split('/');
//       const lastTwo = parts.slice(-2).join('/');
//       getApiURL(lastTwo, { testID: ids })
//     }
//   }, [])


//   // const id =
//   //   "https://cdn1.lalpathlabs.com/live/reports/WM17S.pdf";

//   const handleDownload = () => {
//     const link = document.createElement("a");
//     link.href = id;
//     link.download = "medical-report.pdf";
//     link.click();
//   };

//   return (
//     <div className="report-container">
//       <div className="report-card">
//         {/* Header Section */}
//         <div className="header-section">
//           <div className="icon-badge">
//             <img className="stethoscope-icon" src={logo} />
//           </div>
//           <h1 className="main-title">IT DOSE INFOSYSTEM</h1>
//           <p className="subtitle">Access and download your Medical Report</p>
//         </div>

//         {/* Action Buttons */}
//         <div className="button-container">
//           {/* Download Button */}
//           <button onClick={handleDownload} className="download-button">
//             <div className="button-content">
//               {/* <Download className="download-icon" /> */}
//               <i className="fa fa-download"></i>
//               <span className="button-text">Download Report</span>
//             </div>
//             <div className="button-overlay"></div>
//           </button>

//           {/* View Button */}
//           <a
//             href={`/report-chat-ai?pdfUrl=${encodeURIComponent(id ? id : "")}`}
//             className="view-link"
//           >
//             <div className="view-button">
//               <div className="button-content">
//                 {/* <FileText className="file-icon" /> */}
//                 <i className="fa fa-file"></i>
//                 <span className="button-text">View AI Report</span>
//               </div>
//             </div>
//           </a>
//         </div>

//         {/* Footer */}
//         <div className="footer-section">
//           <p className="security-text">
//             Your medical information is secure and confidential
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportViewer;
