import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import "./PatientViewAnswer.css";

const PatientViewAnswer = ({ data, fromDate, toDate, apiURL, clientCode }) => {
  const [questionData, setQuestionData] = useState([]);
  const patientName = data?.PatientName;

  async function AIClientDashboardAPI(type, from = fromDate, to = toDate) {
    const payload = {
      type: type,
      clientCode: clientCode,
      requestID: "",
      patientID: data?.PatientID ? data?.PatientID : "",
      fromDate: moment(from).format("YYYY-MM-DD"),
      toDate: moment(to).format("YYYY-MM-DD"),
      queryRequest: "",
    };
    const apiResp = await axios.post(
      `${apiURL}LabReport/AIClientDashboard`,
      payload
    );
    return apiResp?.data;
  }
  useEffect(() => {
    if (!apiURL) return;
    const fetchData = async () => {
      const apiResp = await AIClientDashboardAPI(3, fromDate, toDate);
      if (apiResp?.success) {
        setQuestionData(apiResp?.data);
      }
    };
    fetchData();
  }, [apiURL, fromDate, toDate]);

  return (
    <div className="patient-questions-container">
      <div className="headerView">
        <h1 className="title">Patient Questions</h1>
        <p className="subtitle">
          Displaying questions and answers for {patientName}.
        </p>
      </div>

      <div className="questions-list">
        {questionData.map((item) => (
          <div
            key={item.id}
            className="question-item"
            style={{ borderBottom: "1px solid grey", marginBottom: "2px" }}
          >
            <h3 className="question-number">Question ({item?.RequestID}):</h3>
            <div className="question-box">{item.Query}</div>
            <h4 className="answer-label">AI Answer:</h4>
            <div className="answer-box">
              {item.Response.split("\n").map((line, index) => {
                if (line.trim() === "") return null; // skip empty lines

                // Section titles (like "Patient Information:" / "Lab Results:")
                if (line.match(/^[A-Za-z].*:$/)) {
                  return (
                    <h3 key={index} className="section-title">
                      {line}
                    </h3>
                  );
                }

                // Numbered section titles (like "1. RFT PANEL")
                if (line.match(/^\d+\./)) {
                  return (
                    <h4 key={index} className="section-subtitle">
                      {line}
                    </h4>
                  );
                }

                // List items (like "- Name: Mr. KAPTAN")
                if (line.trim().startsWith("-")) {
                  return (
                    <li key={index} className="answer-list-item">
                      {line.replace("-", "").trim()}
                    </li>
                  );
                }

                // Normal text
                return (
                  <p key={index} className="answer-text">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientViewAnswer;
