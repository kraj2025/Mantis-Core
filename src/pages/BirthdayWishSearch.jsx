import React, { useEffect, useState } from "react";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import Tooltip from "./Tooltip";
import Tables from "../components/UI/customTable";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import Heading from "../components/UI/Heading";
import { headers } from "../utils/apitools";
import { Link } from "react-router-dom";
import ReactSelect from "../components/formComponent/ReactSelect";
import Loading from "../components/loader/Loading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import MorningWishContentModal from "./MorningWishContentModal";
import Modal from "../components/modalComponent/Modal";
import { axiosInstances } from "../networkServices/axiosInstance";

const BirthdayWishSearch = () => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    SelectDate: "0",
  });

  //   const morningThead = [
  //     { name: "S.No.", width: "2%" },
  //     { name: "Day", width: "10%" },
  //     "Content",
  //     "Image",
  //     "Upload By",
  //     { name: "Upload Date", width: "10%" },
  //     { name: "Edit", width: "4%" },
  //     { name: "Remove", width: "2%" },
  //   ];
  const morningThead = [
    "S.No.",
    "Day",
    { name: "Content", width: "21%" },
    "Image",
    "Upload By",
    "Upload Date",
    "Edit",
    "Remove",
  ];
  const days = [
    { label: "Select", value: "0" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
    { label: "13", value: "13" },
    { label: "14", value: "14" },
    { label: "15", value: "15" },
    { label: "16", value: "16" },
    { label: "17", value: "17" },
    { label: "18", value: "18" },
    { label: "19", value: "19" },
    { label: "20", value: "20" },
    { label: "21", value: "21" },
    { label: "22", value: "22" },
    { label: "23", value: "23" },
    { label: "24", value: "24" },
    { label: "25", value: "25" },
    { label: "26", value: "26" },
    { label: "27", value: "27" },
    { label: "28", value: "28" },
    { label: "29", value: "29" },
    { label: "30", value: "30" },
    { label: "31", value: "31" },
  ];

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

  const handleSearch = () => {
    setLoading(true);

    axiosInstances
      .post(apiUrls.MorningWishSearch, {
        Day: String(formData?.SelectDate),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res?.data?.data);
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
          setTableData([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemove = (ele) => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.RemoveMorningWish, {
        WishID: String(ele?.ID),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          handleSearch();
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const shortenName = (name) => {
    return name?.length > 55 ? name?.substring(0, 65) + "..." : name;
  };

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    // handleSearch();
  }, []);

  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const [visible, setVisible] = useState({
    showVisible: false,
  });
  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header="Content Details"
        >
          <MorningWishContentModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      <div className="card">
        <Heading
          title={
            <span style={{ fontWeight: "bold" }}>Wishes Search Details</span>
          }
          secondTitle={
            <div style={{ fontWeight: "bold" }}>
              <Link to="/BirthdayWish" className="ml-3">
                Create Birthday Wish
              </Link>
            </div>
          }
        />
        <div className="row p-2">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="SelectDate"
            placeholderName={"Select Date"}
            dynamicOptions={days}
            value={formData?.SelectDate}
            handleChange={handleDeliveryChange}
          />

          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-success"
              // onClick={handleSearch}
            >
              Search
            </button>
          )}
        </div>
      </div>
      {tableData?.length > 0 ? (
        <div className="card mt-2">
          <Heading
            title={<span style={{ fontWeight: "bold" }}>Search Details</span>}
          />
          <Tables
            thead={morningThead}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              Day: ele?.Day,
              Content: (
                <>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Tooltip>
                      <span
                        id={`Content-${index}`}
                        targrt={`Content-${index}`}
                        style={{ textAlign: "center" }}
                      >
                        {shortenName(ele?.Content)}
                      </span>
                    </Tooltip>
                    <i
                      className="fa fa-eye"
                      onClick={() => {
                        setVisible({
                          showVisible: true,
                          showData: ele,
                          ele,
                        });
                      }}
                    ></i>
                  </div>
                </>
              ),
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
              "Upload By": ele?.UploadBy,
              "Upload Date": new Date(ele.UploadDate).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              ),

              Edit: (
                <Link
                  to="/MorningWish"
                  state={{ data: ele?.ID, edit: true, givenData: ele }}
                  style={{ cursor: "pointer" }}
                >
                  Edit
                </Link>
              ),
              Remove: (
                <i
                  className="fa fa-times"
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleRemove(ele)}
                  title="Click to Remove"
                ></i>
              ),
              colorcode: ele?.RowColor,
            }))}
            tableHeight={"tableHeight"}
          />
          <div className="pagination ml-auto ">
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

export default BirthdayWishSearch;
