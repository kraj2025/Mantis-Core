import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { AIClientDashboardAPI } from "../../chatapi";
import Tables from "../../../../components/UI/customTable";

const PatientViewTargetQues = ({ apiType, data, fromDate, toDate, apiURL,clientCode }) => {
  const [t] = useTranslation();

  const [tableData, setTableData] = useState(data?.TargetQuestions || []);
  const THEAD = [
    { name: "S.No.", width: "1%" },
    { name: "Patient ID" },
    { name: "Patient Name" },
    { name: "Mobile Number" },
    { name: "Age/Gender" },
  ];

  useEffect(() => {
    async function fetchData() {
      if (!apiURL) return;

      const apiResp = await AIClientDashboardAPI(
        6,
        fromDate,
        toDate,
        apiURL,
        data,
        clientCode
      );

      if (apiResp?.success) {
        setTableData(apiResp?.data);
      }
    }

    fetchData();
  }, [apiURL, fromDate, toDate]);

  //   useEffect(() => {
  //     getAPIURL();
  //   }, []);
  return (
    <>
      <div>
        <Tables
          thead={THEAD}
          tbody={tableData?.map((data, idx) => ({
            "S.No.": idx + 1,
            PatientID: data?.PatientID,
            pName: data?.PatientName,
            mobile: data?.PatientMobileNo,
            ageGender: `${data?.PatientAge}/${data?.PatientGender}`,
          }))}
        />
      </div>
    </>
  );
};

export default PatientViewTargetQues;
