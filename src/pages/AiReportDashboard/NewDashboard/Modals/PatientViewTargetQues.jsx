import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { AIClientDashboardAPI } from "../../chatapi";
import Tables from "../../../../components/UI/customTable";
import { apiUrls } from "../../../../networkServices/apiEndpoints";
import { headers } from "../../../../utils/apitools";
import axios from "axios";
import moment from "moment";

const PatientViewTargetQues = ({
  data,
  fromDate,
  toDate,
}) => {
  const [t] = useTranslation();

  const [tableData, setTableData] = useState(data?.TargetQuestions || []);
  
  const THEAD = [
    { name: "S.No.", width: "1%" },
    { name: "Patient ID" },
    { name: "Patient Name" },
    { name: "Mobile Number" },
    { name: "Age/Gender" },
  ];

  const AIClientDashboardAPIType = () => {
    let form = new FormData();
    form.append("clientCode", "REACT2025e8d7c6b5a4f3e2d1c0b"),
      form.append("type", "6"),
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
    AIClientDashboardAPIType();
  }, []);
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
