import React, { useEffect, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import axios from "axios";
import Tables from "../components/UI/customTable";
const TSAApproveModal = (showData) => {
  // console.log("data", showData);
  const [tableData, setTableData] = useState([]);
  const handleApprove = () => {
    let form = new FormData();
    // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   );
    // form.append("AgreementID", showData?.visible?.showData?.TSAID);
    // axios
    //   .post(apiUrls?.TSAAgreementVarification, form, { headers })
         axiosInstances
      .post(apiUrls?.TSAAgreementVarification, {AgreementID:Number(showData?.visible?.showData?.TSAID)})
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const TSAHEAD = ["S.No.", "Status", "StatusBy" , "OTP"];

  useEffect(() => {
    handleApprove();
  }, []);
  return (
    <>
      <div className="card p-1">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {showData?.visible?.showData?.ProjectName} &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
          AgreementID: {showData?.visible?.showData?.TSAID}  &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
          CreatedBy: {showData?.visible?.showData?.CreatedBy}  &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
          CreatedDate: {new Date(showData?.visible?.showData?.dtEntry).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}  &nbsp; &nbsp; &nbsp;
        </span>
      </div>
      <div className="card">
        <Tables
          thead={TSAHEAD}
          tbody={tableData?.map((ele, index) => ({
            "S.No.": index + 1,
            // CreatedDate: new Date(ele.dtEntry).toLocaleDateString("en-GB", {
            //   day: "2-digit",
            //   month: "short",
            //   year: "numeric",
            // }),
            Status:  ele?.IsApproved ===1 ? "Approved" :"Rejected",
            StatusBy: ele?.ApprovedBy,
            OTP: ele?.ApprovedOTP,
          }))}
          tableHeight={"tableHeight"}
        />
      </div>
    </>
  );
};

export default TSAApproveModal;
