import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import Tables from "../components/UI/customTable";
import Heading from "../components/UI/Heading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
const PirntDocument = ({ data }) => {
  const [tableData, setTableData] = useState([]);
  console.log(data);

  const handleSearch = () => {
  // form.append("Title", "ClickToShift"),
    axiosInstances
      .post(apiUrls?.UploadDocument_Search, {
        Status: String(),
        ProjectID: String(data?.Id || data?.ProjectID),
        VerticalID: String(),
        TeamID: String(),
        WingID: String(),
        POC1: String(),
        POC2: String(),
        POC3: String(),
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
  const documentTHEAD = [
    "S.No.",
    "Vertical",
    "Team",
    "Wing",
    "Project Name",
    "Type",
    "Print",
    "Upload",
    "Uploaded By",
    "Uploaded Date",
  ];
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <>
      <div className="card  p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {data?.NAME || data?.ProjectName}
        </span>
      </div>
      <div className="card">
        <div className="row m-2">
          {/* <span style={{ fontWeight: "bold" }}>
            Are you sure you want to Print Document?{" "}
          </span>
          <div className="col-sm-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={() =>
                window.open(tableData?.PDFURL, "_blank")
              }
            >
              Yes
            </button>
          </div> */}
          {tableData?.length > 0 && (
            <div className="card patient_registration_card mt-2 my-2">
              <Heading
                title="Search Details"
                // secondTitle={
                //   <div className="row g-4">
                //     <div
                //       className="d-flex flex-wrap align-items-center"
                //       style={{ marginRight: "0px" }}
                //     >
                //       <div
                //         className="d-flex "
                //         style={{
                //           justifyContent: "flex-start",
                //           alignItems: "center",
                //         }}
                //       >
                //         <div
                //           className="legend-circle"
                //           style={{
                //             backgroundColor: "#4cd07d",
                //             cursor: "pointer",
                //             height: "11px",
                //             width: "31px",
                //             borderRadius: "50%",
                //           }}
                //           onClick={() => getUploadSearch("2")}
                //         ></div>
                //         <span
                //           className="legend-label"
                //           style={{ width: "100%", textAlign: "left" }}
                //         >
                //           {t("Uploaded")}
                //         </span>
                //         <div
                //           className="legend-circle"
                //           style={{
                //             backgroundColor: "#ffffff",
                //             cursor: "pointer",
                //             height: "11px",
                //             width: "28px",
                //             borderRadius: "50%",
                //             border: "1px solid black",
                //           }}
                //           onClick={() => getUploadSearch("1")}
                //         ></div>
                //         <span
                //           className="legend-label"
                //           style={{ width: "100%", textAlign: "left" }}
                //         >
                //           {t("Not-Uploaded")}
                //         </span>
                //       </div>
                //     </div>
                //   </div>
                // }
              />
              <Tables
                thead={documentTHEAD}
                tbody={currentData?.map((ele, index) => ({
                  "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
                  Vertical: ele?.Vertical,
                  Team: ele?.Team,
                  Wing: ele?.Wing,
                  ProjectName: ele?.ProjectName,
                  Type: ele?.DocumentName,
                  Print: ele?.DocumentUrl ? (
                    <i
                      className="fa fa-print"
                      style={{
                        marginLeft: "5px",
                        cursor: "pointer",
                        color: "white",
                        border: "1px solid green",
                        padding: "2px",
                        background: "black",
                        borderRadius: "3px",
                      }}
                      onClick={() => window.open(ele?.DocumentUrl, "_blank")}
                    ></i>
                  ) : null,
                  // Upload: (
                  //   <i
                  //     className="fa fa-plus"
                  //     style={{
                  //       marginLeft: "5px",
                  //       cursor: "pointer",
                  //       color: "white",
                  //       border: "1px solid green",
                  //       padding: "2px",
                  //       background: "green",
                  //       borderRadius: "3px",
                  //     }}
                  //     onClick={() => {
                  //       setVisible({ showVisible: true, showData: ele });
                  //     }}
                  //   ></i>
                  // ),
                  UploadedBy: ele?.UploadedBy,
                  UploadedDate: ele?.dtUpload,
                  colorcode: ele?.colorcode,
                }))}
                tableHeight={"tableHeight"}
              />

              <div
                className="pagination"
                style={{ marginLeft: "auto", marginBottom: "9px" }}
              >
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
          )}
        </div>
      </div>
    </>
  );
};

export default PirntDocument;
