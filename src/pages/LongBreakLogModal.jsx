import React, { useEffect, useState } from "react";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import Tables from "../components/UI/customTable";
import { axiosInstances } from "../networkServices/axiosInstance";

const LongBreakLogModal = ({ visible }) => {
  // console.log("visisble", visible);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const handleSearch = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("AttType", "LongBreak"),
    //   form.append("AttSummaryID", visible?.showData?.breakSummaryLogId),
    //   axios
    //     .post(apiUrls?.ForceFullyShortBreakAttendanceSearch, form, { headers })
    axiosInstances
      .post(apiUrls.ForceFullyShortBreakAttendanceSearch, {
        AttType: String("LongBreak"),
        AttSummaryID: Number(visible?.showData?.breakSummaryLogId),
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const shortTHEAD = [
    "S.No.",
    "Name",
    "ClosedBy",
    "Closed Date",
    "Reason",
    "Image",
  ];
  useEffect(() => {
    handleSearch();
  }, []);
  return (
    <>
      {tableData?.length > 0 ? (
        <div className="">
          {/* <Heading title={"Gmail Details"}/> */}
          <Tables
            thead={shortTHEAD}
            tbody={tableData?.map((ele, index) => ({
              "S.No.": index + 1,
              Name: ele?.EmployeeName,
              ClosedBy: ele?.CloseByName,
              "Closed Date": ele?.dtClose,
              Reason: ele?.Reason,
              Image: (
                <>
                  {ele?.DocumentUrl && (
                    <i
                      className="fa fa-eye"
                      style={{
                        marginLeft: "5px",
                        cursor: "pointer",
                        color: "white",
                        border: "1px solid grey",
                        padding: "2px",
                        background: "black",
                        borderRadius: "3px",
                      }}
                      onClick={() => {
                        setSelectedImageUrl(ele?.DocumentUrl);
                        setIsModalOpen(true);
                      }}
                    ></i>
                  )}

                  {/* Modal */}
                  {isModalOpen && selectedImageUrl && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                        overflowY: "auto",
                      }}
                    >
                      <div
                        style={{
                          background: "white",
                          width: "500px",
                          height: "auto",
                          position: "relative",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "2px solid grey",
                          maxHeight: "90vh",
                          overflow: "auto",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        {/* Close button */}
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            onClick={() => {
                              setIsModalOpen(false);
                              setSelectedImageUrl(null);
                            }}
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#dc3545",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              marginBottom: "10px",
                            }}
                          >
                            X
                          </button>
                        </div>

                        <img
                          src={selectedImageUrl}
                          alt="Document"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              ),
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

export default LongBreakLogModal;
