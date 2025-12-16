import React, { useEffect, useState } from "react";
import Tables from ".";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import NoRecordFound from "../../formComponent/NoRecordFound";
import Heading from "../Heading";
import { axiosInstances } from "../../../networkServices/axiosInstance";

const ViewIssueDocTable = ({ visible, setVisible, handleViewSearch }) => {
  const [tableData, setTableData] = useState([]);

  const centreTHEAD = ["S.No.", "CreatedBy", "EntryDate", "Print", "Remove"];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(tableData?.length / rowsPerPage);
  const currentData = tableData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDetails = () => {
    axiosInstances
      .post(apiUrls.ViewAttachment, {
        TicketID: Number(visible?.showData?.TicketID),
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleRemove = (ele) => {
    axiosInstances
      .post(apiUrls.DeleteAttachment, {
        TicketID: Number(ele?.TicketID),
        AttachmentID: Number(ele?.ID),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setVisible(false);
          handleViewSearch();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    handleDetails();
  }, []);

  return (
    <>
      <div className="card p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name:- {visible?.ele?.ProjectName} &nbsp; &nbsp; Ticket No.:-{" "}
          {visible?.ele?.TicketID}&nbsp; &nbsp; Summary:-{" "}
          {visible?.ele?.summary}
        </span>
      </div>
      {tableData?.length > 0 ? (
        <div className="card p-0">
          <Heading title={"Details"} />
          <Tables
            thead={centreTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              CreatedBy: ele?.CreatedBy,
              EntryDate: ele?.dtEntry,
              Print: (
                <i
                  className="fa fa-print"
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    color: "black",
                    padding: "2px",
                    borderRadius: "3px",
                  }}
                  onClick={() => window.open(ele?.DocumentUrl, "_blank")}
                ></i>
              ),
              Remove: (
                <i
                  className="fa fa-remove"
                  style={{ color: "red" }}
                  onClick={() => {
                    handleRemove(ele);
                  }}
                >
                  X
                </i>
              ),
            }))}
            tableHeight={"tableHeight"}
          />
          <div className="pagination ml-auto">
            <div>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-2">
          <Heading title={"Details"} />
          <NoRecordFound />
        </div>
      )}
    </>
  );
};
export default ViewIssueDocTable;
