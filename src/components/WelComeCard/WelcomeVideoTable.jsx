import React, { useEffect, useState } from "react";
import Loading from "../loader/Loading";
import Tables from "../UI/customTable";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../utils/apitools";
import axios from "axios";
import ReactSelect from "../formComponent/ReactSelect";
import Heading from "../UI/Heading";
import Input from "../formComponent/Input";
import NoRecordFound from "../formComponent/NoRecordFound";
import videopng from "../../assets/image/videopng.png";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";
const WelcomeVideoTable = ({ visible, setVisible }) => {
  // console.log("Video Testing", visible, setVisible);
  const [showVideo, setShowVideo] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [vertical, setVertical] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    TitleName: "",
    VideoLink: "",
    VerticalID: "",
    isActive: "",
    VedioLinkID: "",
    Title: "",
  });
  const welcomeTHEAD = [
    { name: "S.No", width: "10%" },
    "Title",
    { name: "Status", width: "15%" },
    { name: "VideoLink", width: "10%" },
  ];
  const getVertical = () => {
    axiosInstances
      .post(apiUrls.Vertical_Select, {})
      .then((res) => {
        const verticals = res?.data.data.map((item) => {
          return { label: item?.Vertical, value: item?.VerticalID };
        });
        setVertical(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
    handleVideoSearch(value);
  };
  const handleVideoSearch = (vertical) => {
    setLoading(true);

    axiosInstances
      .post(apiUrls.TrainingVedio, {
        ActionType: String("Search"),
        VerticalID: vertical,
        Title: String(""),
        VedioLink: String(""),
        VedioLinkID: String(""),
      })
      .then((res) => {
        const dataset = res?.data?.data;
        setTableData(dataset);
        setFilteredData(dataset);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
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
  const formatVideoLink = (url) => {
    if (typeof url !== "string") {
      console.error("Invalid URL:", url);
      return "";
    }

    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }
    return url;
  };

  const handleClick = (videoUrl) => {
    const formattedUrl = formatVideoLink(videoUrl);
    if (formattedUrl) {
      setVideoLink(formattedUrl);
      setShowVideo(true);
    } else {
      console.error("Invalid video URL provided.");
    }
  };

  const handleClose = () => {
    setShowVideo(false);
  };

  useEffect(() => {
    // handleVideoSearch();
    getVertical();
  }, []);

  const handleSearchTable = (event) => {
    const query = event.target.value.trim().toLowerCase(); // Trim spaces
    setSearchQuery(query);

    if (query === "") {
      // Reset table data to original
      setTableData(filteredData);
    } else {
      const filtered = filteredData?.filter((item) =>
        Object.keys(item).some(
          (key) => item[key] && String(item[key]).toLowerCase().includes(query)
        )
      );

      console.log("Filtered Data:", filtered);
      setTableData(filtered);
    }
    setCurrentPage(1);
  };

  return (
    <>
      <div className="card p-2">
        <div className="row">
          <ReactSelect
            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
            name="VerticalID"
            placeholderName="Vertical"
            dynamicOptions={vertical}
            value={formData?.VerticalID}
            handleChange={handleDeliveryChange}
          />
          {/* <button className="btn btn-sm btn-primary" onClick={handleVideoSearch}>Search</button> */}
        </div>
      </div>
      {/* {tableData?.length > 0 && ( */}
      <div className="card">
        <Heading
          title={"Video Details"}
          secondTitle={
            <div className="d-flex">
              <div style={{ padding: "0px !important", marginLeft: "10px" }}>
                <Input
                  type="text"
                  className="form-control"
                  id="Title"
                  name="Title"
                  lable="Search By Title"
                  placeholder=" "
                  onChange={handleSearchTable}
                  value={searchQuery}
                  respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                />
              </div>
            </div>
          }
        />
        {tableData?.length > 0 ? (
          <div>
            <Tables
              thead={welcomeTHEAD}
              tbody={currentData?.map((ele, index) => ({
                "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
                Title: ele?.Title,
                Status: ele?.IsActive === 1 ? "Active" : "DeActive",
                VideoLink: ele?.VedioLink && (
                  <div>
                    {!showVideo ? (
                      <img
                        src={videopng}
                        height="20px"
                        width="20px"
                        onClick={() => handleClick(ele?.VedioLink)}
                        title="Click to Play."
                      ></img>
                    ) : (
                      <div
                        style={{
                          position: "fixed",
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          zIndex: 99999,
                          background: "white",
                          padding: "10px",
                          border: "5px solid black",
                          borderRadius: "5px",
                          boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
                        }}
                      >
                        <button
                          onClick={handleClose}
                          style={{
                            position: "absolute",
                            top: "-10px",
                            right: "-10px",
                            background: "red",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            fontSize: "16px",
                          }}
                        >
                          ✖
                        </button>
                        <iframe
                          width="560"
                          height="315"
                          src={videoLink ? `${videoLink}?autoplay=1` : ""}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                ),
                colorcode: ele?.rowColor,
              }))}
              tableHeight={"tableHeight"}
            />
            <div className="pagination">
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
          <span
            style={{
              textAlign: "center",
              fontWeight: "bold",
              height: "40px",
              marginTop: "30px",
            }}
          >
            No Record Found
          </span>
        )}
      </div>
      {/* // )} */}
    </>
  );
};
export default WelcomeVideoTable;
