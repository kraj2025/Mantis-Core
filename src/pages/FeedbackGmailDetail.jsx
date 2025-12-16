import React, { useEffect, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import Tables from "../components/UI/customTable";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import { axiosInstances } from "../networkServices/axiosInstance";
const FeedbackGmailDetail = (showData) => {
  const [tableData, setTableData] = useState([]);
  const handleApprove = () => {
    axiosInstances
      .post(apiUrls.ClientFeedbackTransaction, {
        FeedbackID: Number(showData?.visible?.showData?.FeedbackID),
      })

      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const TSAHEAD = [
    "S.No.",
    "Mode",
    "Email",
    "Mobile",
    "CreatedBy",
    "CreatedDate",
    "SendDate",
  ];

  useEffect(() => {
    handleApprove();
  }, []);
  return (
    <>
      <div className="card p-1">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {showData?.visible?.showData?.ProjectName} &nbsp;
          &nbsp; &nbsp;&nbsp; &nbsp;
          {/* FeedbackID: {showData?.visible?.showData?.FeedbackID}  &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; */}
          {/* FeedbackBy: {showData?.visible?.showData?.FeedbackBy}  &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
          FeedbackDate: {new Date(showData?.visible?.showData?.dtFeedback).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}  &nbsp; &nbsp; &nbsp; */}
        </span>
      </div>
      {tableData?.length > 0 ? (
        <div className="card">
          <Tables
            thead={TSAHEAD}
            tbody={tableData?.map((ele, index) => ({
              "S.No.": index + 1,
              Mode: ele?.MessageSentMode,
              Email: ele?.ToEmailID,
              Mobile: ele?.MobileNo,
              CreatedBy: ele?.CreatedBy,
              CreatedDate: new Date(ele.dtEntry).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
              SendDate: ele?.dtSent,
            }))}
            tableHeight={"tableHeight"}
          />
        </div>
      ) : (
        <NoRecordFound />
      )}
    </>
  );
};

export default FeedbackGmailDetail;
