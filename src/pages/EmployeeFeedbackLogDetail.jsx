import React, { useEffect, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import Tables from "../components/UI/customTable";
import { Rating } from "react-simple-star-rating";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import excelimg from "../../src/assets/image/excel.png";
import { ExportToExcel } from "../networkServices/Tools";
import { axiosInstances } from "../networkServices/axiosInstance";
const EmployeeFeedbackLogDetail = (showData) => {
  const [tableData, setTableData] = useState([]);
  const handleApprove = () => {
    axiosInstances
      .post(apiUrls.ShowFullFeedback, {
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
    // { name: "S.No.", width: "2%" },
    { name: "QuestionID", width: "3%" },
    // "Question",
    { name: "Question", width: "40%" },
    { name: "Result", width: "7%" },
    { name: "Description", width: "10%" },
  ];

  useEffect(() => {
    handleApprove();
  }, []);
  return (
    <>
      <div className="card p-1">
        <div className="row ">
          <span style={{ fontWeight: "bold", marginLeft: "7px" }}>
            Employee Name: &nbsp;
            {showData?.visible?.showData?.EmployeeName} &nbsp; &nbsp;
            &nbsp;&nbsp; &nbsp; FeedbackID:{" "}
            {showData?.visible?.showData?.FeedbackID} &nbsp; &nbsp; &nbsp;&nbsp;
            &nbsp; FeedbackSubmittedBy: &nbsp;
            {showData?.visible?.showData?.FeedbackSubmittedBy}
            &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; Feedback Date: &nbsp;
            {showData?.visible?.showData?.dtFeedback
              ? new Date(
                  showData?.visible?.showData?.dtFeedback
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : ""}
          </span>
          <div className="ml-auto">
            {" "}
            {tableData?.length > 0 && (
              <img
                src={excelimg}
                className="mr-3 "
                style={{ width: "28px", height: "24px", cursor: "pointer" }}
                // onClick={handleExcel}
                onClick={() => ExportToExcel(tableData)}
              ></img>
            )}
          </div>
        </div>
      </div>
      {tableData?.length > 0 ? (
        <div className="card">
          <Tables
            thead={TSAHEAD}
            tbody={tableData?.map((ele, index) => ({
              // "S.No.": index + 1,

              QuestionID: ele?.QuestionID,
              Question: ele?.Question,
              // "Employee Name": ele?.EmployeeName,
              Rating: (
                <Rating
                  size={20}
                  initialValue={ele?.Result}
                  // onClick={(e) => handleRating(ele?.id, e)}
                  readonly
                />
              ),
              Description: ele?.ResultDescription,
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

export default EmployeeFeedbackLogDetail;
