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

const PatientVisitAIQuestionPeriod = ({
  apiType,
  dashboardDetail,
  fromDate,
  toDate,
  apiURL,
  title,
  type2,
}) => {
  const [t] = useTranslation();

  const [tableData, setTableData] = useState([]);
  const initialThead = [
    { name: "S.No.", width: "1%" },
    { name: "Question", width: "30%" },
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
      form.append("type", "5"),
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
  const [visible, setVisible] = useState({
    showVisible: false,
    showData: {},
  });
  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header={`Patient Details who asked :  ${tableData[0]?.Query}`}
        >
          <PatientViewTargetQues
            visible={visible}
            setVisible={setVisible}
            fromDate={fromDate}
            toDate={toDate}
          />
        </Modal>
      )}
      <div className="card">
        <Tables
          thead={initialThead}
          tbody={tableData?.map((data, idx) => ({
            "S.No.": idx + 1,
            Question: data?.Query,
            "View Question": (
              <div style={{ cursor: "pointer" }}>
                <span
                  onClick={() => {
                    setVisible({
                      showVisible: true,
                    });
                  }}
                  style={{
                    marginLeft: "10px",
                    color: "red",
                    cursor: "pointer",
                  }}
                  className="fa fa-eye"
                ></span>
              </div>
            ),
            "Question Count": data?.TotalVisit,
          }))}
          tableHeight={"tableHeight"}
        />
      </div>
    </>
  );
};

export default PatientVisitAIQuestionPeriod;
