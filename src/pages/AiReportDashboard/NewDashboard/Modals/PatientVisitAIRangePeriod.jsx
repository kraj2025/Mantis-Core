import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { exportToExcel } from "../../../../networkServices/Tools";
import { ExcelIconSVG, PDFIconSVG } from "../../../../utils/SVGICON";
import Tables from "../../../../components/UI/customTable";
import PatientViewAnswer from "./PatientViewAnswer";
import PatientViewTargetQues from "./PatientViewTargetQues";
import DashboardTemplate from "../../DashboardTemplate";
import Modal from "../../../../components/modalComponent/Modal";
import { apiUrls } from "../../../../networkServices/apiEndpoints";
import { headers } from "../../../../utils/apitools";
import axios from "axios";
import moment from "moment";

const PatientVisitAIRangePeriod = ({
  apiType,
  dashboardDetail,
  fromDate,
  toDate,
  apiURL,
  title,
  visible,
  type2,
}) => {

  const [t] = useTranslation();

  console.log("type2", type2);
  const [tableData, setTableData] = useState([]);
  const initialThead = [
    { name: "S.No.", width: "1%" },
    { name: "Patient ID", width: "3%" },
    { name: "Patient Name", width: "30%" },
    { name: "Mobile Number", width: "30%" },
    { name: "Age/Gender", width: "30%" },
    { name: "Query", width: "30%" },
    { name: "View Question", width: "1%" },
    { name: "Question Count", width: "1%" },
  ];

  const handleViewQuestion = (data) => {
    const dataReceving = data;
    setModalData({
      show: true,
      component: (
        <PatientViewAnswer
          apiURL={apiURL}
          apiType={apiType}
          data={dataReceving}
          fromDate={fromDate}
          toDate={toDate}
          clientCode={dashboardDetail?.clientCode}
        />
      ),
      size: "80vw",
      header: "View Answer",
      footer: <></>,
    });
  };

  const AIClientDashboardAPIType2 = () => {
    let form = new FormData();
    form.append("clientCode", "REACT2025e8d7c6b5a4f3e2d1c0b"),
      form.append("type", "2"),
      form.append("patientID", ""),
      form.append("requestID", ""),
      form.append("fromDate", moment(fromDate).format("YYYY-MM-DD")),
      form.append("toDate", moment(toDate).format("YYYY-MM-DD")),
      form.append("queryRequest", ""),
      axios
        .post(apiUrls?.AIClientDashboard, form, {
          headers,
        })
        .then((res) => {
          setTableData(res.data.data);
        })
        .catch((err) => console.log(err));
  };

  useEffect(() => {
    AIClientDashboardAPIType2();
  }, []);


  return (
    <>
      <div className="card">
        <Tables
          thead={initialThead}
          tbody={tableData?.map((data, idx) => ({
            "S.No.": idx + 1,
            PatientID: data?.PatientID,
            "Patient Name": data?.PatientName,
            Mobile: data?.PatientMobileNo,
            "Age/Gender": `${data?.PatientAge}/${data?.PatientGender}`,
            Query: data?.TotalVisit,
            "View Question": <i className="fa fa-eye"></i>,
            "Question Count": data?.TotalVisit,
          }))}
          tableHeight={"tableHeight"}
        />
      </div>
    </>
  );
};

export default PatientVisitAIRangePeriod;
