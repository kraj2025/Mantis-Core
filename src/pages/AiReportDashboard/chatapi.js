// import store from "../store/store";
import axios from "axios";
import moment from "moment";
import { apiUrls } from "../../networkServices/apiEndpoints";
import makeApiRequest from "../../networkServices/axiosInstance";
import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
import store from "../../store/store";
// import pdf from '../assets/image'

export const ChatHubChatTicket = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.ChatHubChatTicket, options);
    return data;
  } catch (error) {
    console.error("Error Found", error);
  }
};

export const ChatHubSaveChat = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.ChatHubSaveChat, options);
    return data;
  } catch (error) {
    console.error("Error Found", error);
  }
};
export const AIReportsAIClientDetails = async (clientCode) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.AIReportsAIClientDetails}?clientCode=${clientCode}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const AIClientQuestionMaster = async (clientCode) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.AIClientQuestionMasterURL}?clientCode=${clientCode}`,
      option
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "SomeThing Went Wrong");
  }
};
export const AIRateCardMaster = async (clientCode) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.AIRateCardMasterURL}?clientCode=${clientCode}`,
      option
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "SomeThing Went Wrong");
  }
};

export const handleDownload = async (payload, apiURL, getReportURl = false) => {
  store.dispatch(setLoading(true));
  try {
    const apiResp = await axios.post(
      `${apiURL}LabReport/BindMultipleLabReport`,
      payload
    );
    if (getReportURl) {
      store.dispatch(setLoading(false));
      return `${apiURL}/${apiResp?.data?.data}`;
    }
    store.dispatch(setLoading(false));
    const link = document.createElement("a");
    link.href = `${apiURL}/${apiResp?.data?.data}`;
    link.download = "medical-report.pdf";
    link.target = "_blank";
    link.click();
  } catch (error) {
    store.dispatch(setLoading(false));
  }
};

// export const handleDownload = async (payload, apiURL, getReportURl = false) => {
//   store.dispatch(setLoading(true));
//   try {
//     // Path to the hardcoded PDF in public/assets
//     const hardcodedPDFPath = `http://hospedia.itdoseinfo.com:8088/medical-report.pdf`;
//     if (getReportURl) {
//       store.dispatch(setLoading(false));
//       return hardcodedPDFPath;
//     }
//     store.dispatch(setLoading(false));
//     // const link = document.createElement("a");
//     // link.href = hardcodedPDFPath;
//     // link.download = "medical-report.pdf"; // Will trigger download
//     // link.target = "_blank";
//     // link.click();
//     const link = document.createElement("a");
//     link.href = hardcodedPDFPath;
//     link.target = "_blank"; // Open in new tab
//     document.body.appendChild(link); // optional
//     link.click();
//     document.body.removeChild(link);

//   } catch (error) {
//     store.dispatch(setLoading(false));
//     console.error("Error opening hardcoded PDF:", error);
//   }
// };

export const AIClientOpeningAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(`${apiUrls?.AIClientOpeningURL}`, option);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "SomeThing Went Wrong");
  }
};
export const AIClientTokenConsumeDetailsInsert = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(
      `${apiUrls?.AIClientTokenConsumeDetailsInsert}`,
      option
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "SomeThing Went Wrong");
  }
};
export const AIClientLedgerAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(`${apiUrls?.AIClientLedgerURL}`, option);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "SomeThing Went Wrong");
  }
};

export async function AIClientDashboardAPI(
  type,
  from,
  to,
  apiURL,
  data,
  clientCode
) {
  // type=1,2,4,5 only pass clientCode and date
  // type=3 patientid dynamic, query=""
  // type=6  query dynamic , patientid=""
  try {
    store.dispatch(setLoading(true));
    const payload = {
      type: type,
      clientCode: clientCode,
      requestID: "",
      patientID: "",
      fromDate: moment(from).format("YYYY-MM-DD"),
      toDate: moment(to).format("YYYY-MM-DD"),
      queryRequest: type === 6 ? data?.Query : "",
    };
    const apiResp = await axios.post(
      `${apiURL}LabReport/AIClientDashboard`,
      payload
    );
    store.dispatch(setLoading(false));
    return apiResp?.data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "SomeThing Went Wrong");
  }
}

export const AIClientRechargeTnxDetailsInsert = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(
      `${apiUrls?.AIClientRechargeTnxDetailsInsertURL}`,
      option
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "SomeThing Went Wrong");
  }
};
export const AIReportsAIClientLedgerPrint = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(
      `${apiUrls?.AIReportsAIClientLedgerPrint}`,
      option
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "SomeThing Went Wrong");
  }
};
export const AIClientQuestionMasterInsertUpdateDelete = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(
      `${apiUrls?.AIClientQuestionMasterInsert}`,
      option
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "SomeThing Went Wrong");
  }
};
export const QuestionAllowPermissionAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(
      `${apiUrls?.QuestionAllowPermissionURL}`,
      option
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "SomeThing Went Wrong");
  }
};
export const RazorPayOrder = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(`${apiUrls?.RazorPayOrderURL}`, option);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "SomeThing Went Wrong");
  }
};

// chat bote API start

export const ChatBotAIAPI = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(`${apiUrls?.ChatBotAIAPIURL}`, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const GetOPDEnquiryAPI = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(`${apiUrls?.GetOPDEnquiryURL}`, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

// chat bote API end
