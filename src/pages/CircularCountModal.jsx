import React, { useEffect, useState } from "react";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { toast } from "react-toastify";
import Tables from "../components/UI/customTable";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import { axiosInstances } from "../networkServices/axiosInstance";
const CircularCountModal = ({ visible }) => {
  const [tableData, setTableData] = useState([]);

  const getHandle = () => {
    axiosInstances
        .post(apiUrls?.GetFeaturesStatus, {
          CircularID: String(visible?.showData?.ID),
          Type:  String("Read"),
        })
        .then((res) => {
          if (res.data.success === true) {
            setTableData(res.data.data);
          } else {
            toast.error("No record found.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  useEffect(() => {
    getHandle();
  }, []);
  const localTHEAD = [
    { name: "S.No.", width: "15%" },
    "Employee Name",
    { name: "View Date", width: "23%" },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
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
  return (
    <>
      {tableData?.length > 0 ? (
        <div className="card">
          <Tables
            thead={localTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              "Employee Name": ele?.EmployeeName,
              "View Date": ele?.View_Date,
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
        <NoRecordFound />
      )}
    </>
  );
};
export default CircularCountModal;
