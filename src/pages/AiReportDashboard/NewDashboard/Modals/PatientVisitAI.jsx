import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { exportToExcel } from "../../../../networkServices/Tools";
import { ExcelIconSVG, PDFIconSVG } from "../../../../utils/SVGICON";
import Tables from "../../../../components/UI/customTable";
import PatientViewAnswer from "./PatientViewAnswer";
import PatientViewTargetQues from "./PatientViewTargetQues";
import DashboardTemplate from "../../DashboardTemplate";
import Modal from "../../../../components/modalComponent/Modal";

const PatientVisitAI = ({
  apiType,
  dashboardDetail,
  fromDate,
  toDate,
  apiURL,
  title,
  visible,
}) => {
  console.log("dashboardDetail in Patient Visit", visible);
  const [t] = useTranslation();

  const [tableData, setTableData] = useState([]);
  console.log("tableData", tableData);

  const [modalData, setModalData] = useState({
    show: false,
    component: null,
    size: null,
    header: null,
    footer: <></>,
  });

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

  const [THEAD, setTHEAD] = useState(initialThead);

  console.log("thead", THEAD);

  useEffect(() => {
    if (apiType !== 5) {
      setTHEAD(initialThead?.filter((val) => val?.name !== "Query"));
    } else {
      setTHEAD(
        THEAD?.filter(
          (val) =>
            val?.name !== "Age/Gender" &&
            val?.name !== "Mobile Number" &&
            val?.name !== "Patient Name" &&
            val?.name !== "Patient ID"
        )
      );
    }
  }, [apiType]);

  useEffect(() => {
    const fetchData = async () => {
      if (!apiURL) return;
      // type, from, to, apiURL, data,clientCode
      const apiResp = await AIClientDashboardAPI(
        apiType,
        fromDate,
        toDate,
        apiURL,
        {},
        dashboardDetail?.clientCode
      );
      if (apiResp?.success) {
        setTableData(apiResp?.data);
      }
    };
    fetchData();
  }, []);

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
  const handleViewBottomQuestion = (data) => {
    const dataReceving = data;
    console.log("View Question clicked for:", data);
    setModalData({
      show: true,
      component: (
        <PatientViewTargetQues
          apiURL={apiURL}
          apiType={apiType}
          data={dataReceving}
          fromDate={fromDate}
          toDate={toDate}
          clientCode={dashboardDetail?.clientCode}
        />
      ),
      size: "80vw",
      header: `Patient Details who asked :  ${data?.Query}`,
      footer: <></>,
    });
  };
  const DownloadExcel = () => {
    exportToExcel(tableData, title);
  };

  const handleTabelData = (tbleData) => {
    if (apiType !== 5) {
      const modifiedTable = tbleData?.map((data, idx) => ({
        "S.No.": idx + 1,
        PatientID: data?.PatientID,
        pName: data?.PatientName,
        mobile: data?.PatientMobileNo,
        ageGender: `${data?.PatientAge}/${data?.PatientGender}`,
        viewQuestion: (
          <>
            <span
              onClick={() => handleViewQuestion(data)}
              className="fa fa-eye"
            ></span>
          </>
        ),
        questionCount: data?.TotalVisit,
      }));
      return [
        ...modifiedTable,
        {
          "S.No.": 0,
          PatientID: 0,
          pName: 0,
          mobile: 0,
          ageGender: 0,
          viewQuestion: "Total",
          colorcode: "#DCCFF0",
          questionCount:
            modifiedTable?.reduce(
              (sum, item) => sum + item?.questionCount,
              0
            ) || 0,
        },
      ];
    } else {
      const tableData = tbleData?.map((data, idx) => ({
        "S.No.": idx + 1,
        question: data?.Query,
        viewQuestion: (
          <div style={{ cursor: "pointer" }}>
            <span
              onClick={() => handleViewBottomQuestion(data)}
              className="fa fa-eye"
            ></span>
          </div>
        ),
        questionCount: data?.TotalVisit,
      }));
      return [
        ...tableData,
        {
          "S.No.": 0,
          question: 0,
          viewQuestion: "Total",
          colorcode: "#DCCFF0",
          questionCount:
            tableData?.reduce((sum, item) => sum + item?.questionCount, 0) || 0,
        },
      ];
    }
  };
  return (
    <div>
      <div
        className=" mb-3 w-100 d-flex justify-content-end"
        style={{ gap: "10px" }}
      >
        <div
        // onClick={() => exportHtmlToPDF("hidden-template", "Chat AI Report")}
        >
          <PDFIconSVG />
        </div>
        <div
        // onClick={DownloadExcel}
        >
          <ExcelIconSVG />
        </div>
      </div>

      <Tables thead={THEAD} tbody={handleTabelData(tableData)} />

      <DashboardTemplate
        thead={THEAD?.map((val) => val?.name)?.filter(
          (val) => val !== "View Question"
        )}
        tbody={tableData?.map((data, idx) => {
          if (apiType !== 5) {
            return {
              "S.No.": idx + 1,
              pName: data?.PatientName,
              PatientID: data?.PatientID,
              mobile: data?.PatientMobileNo,
              ageGender: `${data?.PatientAge}/${data?.PatientGender}`,
              questionCount: data?.TotalVisit,
            };
          } else {
            return {
              "S.No.": idx + 1,
              question: data?.Query,
              questionCount: data?.TotalVisit,
            };
          }
        })}
        Header={"AI Dashboard Report"}
        TimeDuration={title}
      />
      {
        <Modal
          visible={modalData?.show}
          setVisible={() =>
            setModalData({
              show: false,
              component: null,
              size: null,
            })
          }
          modalWidth={modalData?.size}
          Header={modalData?.header}
          buttonName={modalData?.buttonName}
          modalData={modalData?.modalData}
          footer={modalData?.footer}
          handleAPI={modalData?.handleAPI}
        >
          {modalData?.component}
        </Modal>
      }
    </div>
  );
};

export default PatientVisitAI;
