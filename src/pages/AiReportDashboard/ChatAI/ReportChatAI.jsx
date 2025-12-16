import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FaCommentDots } from "react-icons/fa";
import { FaPaperclip, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import doctorPng from "../../../assets/image/doctor.png";
// import doctorPng from "../../../src/assets/image/doctorPng.png";
import { useLocation, useSearchParams } from "react-router-dom";

import "./ReportChatAI.css";
import axios from "axios";
import moment from "moment";
import { ReportAIChatPdfAPI } from "../utils";
import { toast } from "react-toastify";
import { HistorySVGIcon } from "../../../utils/SVGICON";

function ReportChatAI() {
  const typingIntervalRef = useRef(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [reportData, setReportData] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [reportDetails, setReportDetail] = useState({});
  const [apiURL, setApiURL] = useState("");
  const [apiDataDetail, setApiDataDetail] = useState({ reCheckMessage: [] });

  const searchParamsIDS = new URLSearchParams(window.location.search);
  const testId = decodeURIComponent(searchParamsIDS.get("id"))
    ?.split("&")[0]
    ?.split("#")
    ?.filter(Boolean);
 

  const [messages, setMessages] = useState([
    { role: "system", content: "How can I help you ?" },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
 
  const getAPIURL = async (clientCode) => {
    const apiResp = await AIReportsAIClientDetails(clientCode);
    if (apiResp?.success) {
      setApiURL(apiResp?.data[0]?.EndPointURL);
    }
    return apiResp?.data[0];
  };

  const getSuggation = async (clientCode) => {
   
    const apiResp = await AIClientQuestionMaster(clientCode);
    if (apiResp?.success) {
      setSuggestions([
        { ID: 0, Question: "Download Report !" },
        ...apiResp?.data,
      ]);
    } else {
      setSuggestions([{ ID: 0, Question: "Download Report !" }]);
    }
    console.log("apiResp", apiResp);
  };

  useEffect(() => {
    async function getapi() {
      const data = id.split("&");
      if (data?.length > 0) {
        const apiDatavalidation = await getAPIURL(data[1].split("=")[1]);
        getSuggation(data[1].split("=")[1]);
        setReportDetail((val) => ({
          ...val,
          testId: data[0],
          clientcode: data[1].split("=")[1],
          requestID: data[2].split("=")[1],
          IsOpenQuestionAllow: apiDatavalidation?.IsOpenQuestionAllow,
          MaximumQuestionAllow: apiDatavalidation?.MaximumQuestionAllow,
        }));
      }
    }
    getapi();
  }, []);

  const reCheckMessages = async () => {
    const payload = {
      requestID: reportDetails?.requestID,
      clientCode: reportDetails?.clientcode,
      query: "",
    };
    const apiResp = await axios.post(
      `${apiURL}LabReport/AIGetSavedResponse`,
      payload
    );
    if (apiResp?.data?.success) {
      setApiDataDetail((val) => ({
        ...val,
        reCheckMessage: apiResp?.data?.data,
        isDisabled:
          apiResp?.data?.data?.length >= reportDetails?.MaximumQuestionAllow
            ? true
            : false,
      }));
    } else {
      setApiDataDetail((val) => ({
        ...val,
        reCheckMessage: [],
        isDisabled:
          apiResp?.data?.data?.length >= reportDetails?.MaximumQuestionAllow
            ? true
            : false,
      }));
    }
    // return apiResp?.data
  };

  const saveAiMessage = async (
    requestType = "Request",
    query = "",
    response = ""
  ) => {
    const payload = {
      requestID: reportDetails?.requestID,
      patientID: String(patientDetail?.PatientID),
      patientName: String(patientDetail?.PatientName),
      patientAge: String(patientDetail?.Age),
      patientGender: String(patientDetail?.Gender),
      patientMobileNo: String(patientDetail?.Mobile),
      requestType: requestType,
      clientCode: reportDetails?.clientcode,
      requestURL: window.location.href?.split("requestURL=")[1],
      query: query,
      response: response,
    };
    const apiResp = await axios.post(
      `${apiURL}LabReport/AIRequestDetailsInsert`,
      payload
    );
    reCheckMessages();
    return apiResp?.data;
  };

  const getResportData = async () => {
    try {
      const payload = testId;
      // debugger
      // console.log(`${apiURL}LabReport/LabGetReportValue?testID="'O3833','O3835','O3834'"`)
      const respData = await axios.post(
        `${apiURL}LabReport/LabGetReportValue`,
        payload
      );

      if (respData?.data?.success) {
        const input = respData?.data?.data;
        setPatientDetail(input[0]);
        const patient = {
          PatientName: input[0].PatientName,
          Age: input[0].Age,
          Gender: input[0].Gender,
        };

        // Step 2: Group test results by TestName
        const groupedTests = {};
        input.forEach((item) => {
          const { TestName, LabObservationName, VALUE } = item;
          if (!groupedTests[TestName]) {
            groupedTests[TestName] = {};
          }
          groupedTests[TestName][LabObservationName] = isNaN(VALUE)
            ? VALUE
            : parseFloat(VALUE);
        });

        // Step 3: Format into LabResults array
        const labResults = Object.keys(groupedTests).map((testName) => ({
          TestName: testName,
          Observations: groupedTests[testName],
        }));

        // Step 4: Final structured output
        const result = {
          Patient: patient,
          LabResults: labResults,
        };
        setReportData(JSON.stringify(result, null, 2));
      } else {
        setReportData("");
        setApiDataDetail((val) => ({ ...val, isDisabled: true }));
        toast.error(respData?.data?.message, "error");
      }
    } catch (error) {}
  };
  const getPDFCount = async () => {
    // passing true for get api url
    const url = await handleDownloadAPI(true);
    const loadingTask = window.pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    setReportDetail((val) => ({ ...val, reportURL: pdf?.numPages }));
    // const count = await countPDFPage(url)
    // debugger
    // setReportDetail((val) => ({ ...val, reportURL: count }))
  };

  useEffect(() => {
    if (apiURL) {
      getResportData();
    }
  }, [apiURL]);

  useEffect(() => {
    if (patientDetail?.PatientName && apiURL) {
      saveAiMessage();
      getPDFCount();
    }
  }, [patientDetail?.PatientName, apiURL]);

  const simulateTyping = (text) => {
    return new Promise((resolve) => {
      let currentText = "";
      const chars = text.split("");
      const delay = 20;
      let index = 0;

      typingIntervalRef.current = setInterval(() => {
        currentText += chars[index];
        index++;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = currentText;
          return updated;
        });

        if (index >= chars.length) {
          clearInterval(typingIntervalRef.current);
          resolve();
        }
      }, delay);
    });
  };

  // PDF DATA EXTraction

  // const [text, setText] = useState('');
  // const pdfUrls = 'http://itd2.fw.ondgni.com:70///LabReport/RenderPdf?cacheKey=2d272bbf-d552-4fcf-acc9-6b47547e128d'; // Your PDF URL

  // useEffect(() => {
  //   const extractText = async () => {
  //     try {
  //       const loadingTask = window.pdfjsLib.getDocument(pdfUrls);
  //       const pdf = await loadingTask.promise;
  //       setReportDetail((val) => ({ ...val, reportURL: pdf?.numPages }))
  //       // let fullText = '';

  //       // for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  //       //   const page = await pdf.getPage(pageNum);
  //       //   const content = await page.getTextContent();
  //       //   const strings = content.items.map(item => item.str).join(' ');
  //       //   fullText += strings + '\n\n';
  //       // }
  //       // setText(fullText);
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   };

  //   extractText();
  // }, []);

  const handleSubmit = async (data, ID) => {
    // check credit balence avil in hopital or not strat
    const creditPayload = {
      clientCode: reportDetails?.clientcode,
      asOnDate: moment(new Date()).format("YYYY-MM-DD"),
      isCurrent: 1,
    };
    const checkCredit = await AIClientOpeningAPI(creditPayload);
    if (checkCredit?.success) {
      if (checkCredit?.data <= 0) {
        toast.success("Credit limit exceed. Please contact to hospital!");
        return;
      }
    } else {
      toast.error(checkCredit?.message, "error");
      return;
    }
    // check credit balence avil in hopital or not end

    if (ID === 0) {
      handleDownloadAPI();
      return;
    }

    if (!data.trim()) return;
    setInput("");
    const saveResp = apiDataDetail?.reCheckMessage?.find(
      (val) => val?.Query === data.trim()
    );
    const userMessage = { role: "ai-chat-user", content: data.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    if (saveResp) {
      const botMessage = {
        role: "ai-assistant",
        content: "",
      };
      setMessages((prev) => [...prev, botMessage]);
      await simulateTyping(saveResp?.Response);
      setIsTyping(false);
      setInput("");
    } else {
      const payload = {
        data: reportData,
        prompt: data.trim(),
        temperature: 0.7,
        max_tokens: 300,
      };

      const apiResp = await ReportAIChatPdfAPI(payload);
      if (apiResp?.success) {
        const botMessage = {
          role: "ai-assistant",
          content: "",
        };
        setMessages((prev) => [...prev, botMessage]);
        saveAiMessage("Query", data.trim(), apiResp?.data);

        const tokenConsumePayload = {
          clientCode: reportDetails?.clientcode,
          transactionType: "Consume",
          consumeToken: reportDetails?.reportURL ? reportDetails?.reportURL : 1,
          requestID: reportDetails?.requestID,
          remarks: `UHID:${patientDetail?.PatientID}#Name:${patientDetail?.PatientName}#${data.trim()}`,
        };

        await AIClientTokenConsumeDetailsInsert(tokenConsumePayload);
        await simulateTyping(apiResp?.data);
      } else {
        toast.error(apiResp?.message, "error");
      }
      setIsTyping(false);
      setInput("");
    }
  };
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const checkRemQuery = () => {
    // debugger
    if (
      reportDetails?.MaximumQuestionAllow -
        apiDataDetail?.reCheckMessage?.length <
      0
    ) {
      return 0;
    } else {
      return (
        reportDetails?.MaximumQuestionAllow -
        apiDataDetail?.reCheckMessage?.length
      );
    }
  };

  const handleSeeHistory = () => {
    let newData = [];
    apiDataDetail?.reCheckMessage?.map((val) => {
      newData.push(
        { role: "ai-chat-user", content: val?.Query },
        { role: "ai-assistant", content: val?.Response }
      );
    });
    setMessages(newData);
  };

  const handleDownloadAPI = async (getReportURl = false) => {
    const payload = {
      testID: testId?.join(","),
      isOnlinePrint: "",
      isConversion: "",
      isNabl: "",
      orderBy: "",
      labType: "",
      ipAddress: "",
      isPrev: true,
      serialNo: "",
    };
    const data = handleDownload(payload, apiURL, getReportURl);
    return data;
  };

  return (
    <div className="ai-chat-container d-flex flex-column">
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-header-image">
            <img src={doctorPng} alt="Mascot" />
          </div>

          <div className="chat-header-text">
            <div className="chat-header-title">
              Chat
              <span className="chat-header-ai" style={{ marginTop: "1px" }}>
                AI
              </span>
            </div>
            <div className="chat-header-subtitle" style={{ marginTop: "1px" }}>
              Customer Support Agent
              {!isNaN(checkRemQuery()) && (
                <span
                  className="chat-header-subtitle"
                  style={{
                    padding: "2px 5px",
                    borderRadius: "3px",
                    marginTop: "1px",
                    marginLeft: "6px",
                    opacity: 1,
                    background:
                      checkRemQuery() === 0
                        ? "green"
                        : checkRemQuery() === 1
                          ? "#b93b3b"
                          : checkRemQuery()
                            ? "#acac2d"
                            : "",
                  }}
                >
                  {checkRemQuery() === 0
                    ? "Query Completed"
                    : `Query Remaining ${checkRemQuery()}`}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="pointer-cursor" onClick={handleSeeHistory}>
          <HistorySVGIcon />
        </div>
      </div>

      <div
        className="chat-body"
        id="chatBody"
        style={{ flexGrow: 1, padding: "1rem", overflowY: "auto" }}
      >
        {messages.map((msg, idx) => (
          <>
            <div
              key={idx}
              className={`d-flex ${msg.role === "ai-chat-user" ? "justify-content-end" : "justify-content-start"} mb-3`}
            >
              {msg.role !== "ai-chat-user" && (
                <img src={doctorPng} alt="AI" className="chat-avatar" />
              )}
              <div
                className={`chat-bubble glass-box ${msg.role === "ai-chat-user" ? "user-msg" : "ai-msg"}`}
              >
                {msg.role === "ai-chat-user" ? (
                  <span style={{ margin: "0rem !important" }}>
                    {msg.content}
                  </span>
                ) : (
                  <>
                    {/* <div className="markdown-container"> */}
                    <div className="">
                      <ReactMarkdown>
                        {msg.content.replace(/\\n/g, "\n")}
                      </ReactMarkdown>
                    </div>
                  </>
                )}
              </div>
              {msg.role === "ai-chat-user" && (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                  alt="User"
                  className="chat-avatar"
                />
              )}
            </div>
          </>
        ))}

        {isTyping && (
          <div className="typing-indicator-wrapper">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {/* 👇 Dummy div that will always be last and scrolled into view */}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-footer">
        <div className="chat-suggestions">
          {suggestions.map((sug, i) => (
            <button
              key={i}
              className="suggestion-btn"
              disabled={isTyping || apiDataDetail?.isDisabled}
              onClick={(e) => {
                handleSubmit(sug?.Question, sug?.ID);
              }}
              // onClick={(e) => handleSubmitKimik2(sug)}
              // onClick={(e) => handleSubmitOllama(sug)}
              // onClick={(e) => handleSubmitAmazon(sug)}
            >
              <FaCommentDots style={{ marginRight: "5px" }} />
              {sug?.Question}
            </button>
          ))}
        </div>
      </div>
      {!apiDataDetail?.isDisabled && (
        <div className="chat-input-wrapper">
          {isTyping && (
            <button
              className="ai-custom-button stop-button"
              aria-label="Stop Button"
              onClick={() => {
                clearInterval(typingIntervalRef.current);
                setIsTyping(false);
              }}
              style={{ cursor: "pointer" }}
            />
          )}

          <input
            type="text"
            className="chat-input"
            placeholder="Ask anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            // onKeyDown={(e) => e.key === "Enter" && handleSubmitAmazon(input)}
            // onKeyDown={(e) => e.key === "Enter" && handleSubmitOllama(input)}
            // onKeyDown={(e) => e.key === "Enter" && handleSubmitKimik2(input)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(input)}
            disabled={
              isTyping ||
              apiDataDetail?.isDisabled ||
              !reportDetails?.IsOpenQuestionAllow
            }
          />

          <button
            className="input-icon-btn"
            onClick={() => handleSubmit(input)}
            // onClick={() => handleSubmitAmazon(input)}
            // onClick={() => handleSubmitOllama(input)}
            // onClick={() => handleSubmitKimik2(input)}

            disabled={
              isTyping ||
              apiDataDetail?.isDisabled ||
              !reportDetails?.IsOpenQuestionAllow
            }
          >
            <FaPaperPlane />
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportChatAI;
