import React, { useEffect, useState } from "react";
import Input from "../components/formComponent/Input";
import Tables from "../components/UI/customTable";
import Heading from "../components/UI/Heading";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import axios from "axios";
import Loading from "../components/loader/Loading";
import { toast } from "react-toastify";
import ReactSelect from "../components/formComponent/ReactSelect";
import Tooltip from "./Tooltip";
import videopng from "../../src/assets/image/videopng.png";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const VideoPlayerMaster = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [vertical, setVertical] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    TitleName: "",
    VideoLink: "",
    VerticalID: "",
    isActive: "",
    VedioLinkID: "",
    DocumentType: "Video",
    SelectFile: "",
    Document_Base64: "",
    FileExtension: "",
  });
  const [tableData, setTableData] = useState([]);
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }
  const getVertical = () => {
    let form = new FormData();
    // form.append("Id",  useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.Vertical_Select, form, { headers })
    axiosInstances
      .post(apiUrls.Vertical_Select)
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

  const handleCheckBox = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleVideoSave = () => {
    if (formData?.VerticalID == "") {
      toast.error("Please Select Vertical.");
    }
    //  else if (formData?.VideoLink == "") {
    //   toast.error("Please Enter or Paste VideoLink.");
    // }
    else {
      setLoading(true);
      // let form = new FormData();
      // form.append("ID",  useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname")),
      //   form.append("ActionType", "Insert"),
      //   form.append("VerticalID", formData?.VerticalID),
      //   form.append("Vertical", getlabel(formData?.VerticalID, vertical)),
      //   form.append("Title", formData?.TitleName),
      //   form.append("VedioLink", formData?.VideoLink),
      //   form.append("DocumentTypeID", formData?.DocumentType),
      //   // form.append(
      //   //   "DocumentTypeName",
      //   //   documenttype.find((item) => item?.value === formData?.DocumentType)
      //   //     ?.label
      //   // ),
      //   form.append("Document_Base64", formData?.Document_Base64),
      //   form.append("FileExtension", formData?.FileExtension),
      //   axios
      //     .post(apiUrls?.TrainingVedio, form, { headers })
      axiosInstances
      .post(apiUrls.TrainingVedio, {
          ActionType: "Insert",                                   
        VerticalID: formData?.VerticalID || 0,                  
        Vertical: getlabel(formData?.VerticalID, vertical) || "", 
        Title: formData?.TitleName || "",                     
        VedioLink: formData?.VideoLink || "string",                 
        VedioLinkID: formData?.VedioLinkID || 0,              
        IsActive: 1,  
      
      })
          .then((res) => {
            if (res?.data?.success) {
              toast.success(res?.data?.message);
              setLoading(false);
              setFormData({ TitleName: "", VideoLink: "", VerticalID: "" });
              handleVideoSearch();
            } else {
              toast.error(res?.data?.message);
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
    }
  };
  const handleVideoUpdate = () => {
    setLoading(true);
    // let form = new FormData();
    // form.append("ID",  useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname")),
    //   form.append("ActionType", "Update"),
    //   form.append("VerticalID", formData?.VerticalID),
    //   form.append("Vertical", getlabel(formData?.VerticalID, vertical)),
    //   form.append("Title", formData?.TitleName),
    //   form.append("VedioLink", formData?.VideoLink),
    //   form.append("IsActive", formData?.isActive),
    //   form.append("VedioLinkID", formData?.VedioLinkID),
    //   axios
    //     .post(apiUrls?.TrainingVedio, form, { headers })
       axiosInstances
      .post(apiUrls.TrainingVedio, {
          ActionType: "Insert",                                   
        VerticalID: formData?.VerticalID || 0,                  
        Vertical: getlabel(formData?.VerticalID, vertical) || "", 
        Title: formData?.TitleName || "",                     
        VedioLink: formData?.VideoLink || "",                 
        VedioLinkID: formData?.VedioLinkID || 0,              
        IsActive: 1, })
        .then((res) => {
          if (res?.data?.status === true) {
            toast.success(res?.data?.message);
            setLoading(false);
            setFormData({ TitleName: "", VideoLink: "", VerticalID: "" });
            handleVideoSearch();
            setEditMode(false);
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
  };

  const handleVideoSearch = () => {
    setLoading(true);
    // let form = new FormData();
    // form.append("ID",  useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname")),
    //   form.append("ActionType", "Search"),
    //   form.append("VerticalID", ""),
    //   form.append("Title", ""),
    //   form.append("VedioLink", ""),
    //   form.append("VedioLinkID", ""),
    //   axios
    //     .post(apiUrls?.TrainingVedio, form, { headers })
       axiosInstances
      .post(apiUrls.TrainingVedio, {
          ActionType: "Insert",                                   
        VerticalID: formData?.VerticalID || 0,                  
        Vertical: getlabel(formData?.VerticalID, vertical) || "", 
        Title: formData?.TitleName || "",                     
        VedioLink: formData?.VideoLink || "",                 
        VedioLinkID: formData?.VedioLinkID || 0,              
        IsActive: 1, })
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
  const videoTHEAD = [
    { name: "S.No", width: "5%" },
    "Vertical",
    "Title Name",
    "Video link",
    "CreatedBy",
    "CreatedDate",
    { name: "Status", width: "10%" },
    { name: "VideoLink", width: "5%" },
    { name: "Edit", width: "5%" },
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
  const shortenName = (name) => {
    return name.length > 15 ? name.substring(0, 25) + "..." : name;
  };
  const handleEdit = (ele) => {
    setFormData({
      ...formData,
      TitleName: ele?.Title,
      VideoLink: ele?.VedioLink,
      VerticalID: ele?.VerticalID,
      isActive: ele?.IsActive,
      VedioLinkID: ele?.ID,
    });
    setEditMode(true);
  };
  useEffect(() => {
    getVertical();
    handleVideoSearch();
  }, []);

  // const formatVideoLink = (url) => {
  //   if (typeof url !== "string") {
  //     console.error("Invalid URL:", url);
  //     return "";
  //   }

  //   if (url.includes("watch?v=")) {
  //     return url.replace("watch?v=", "embed/");
  //   } else if (url.includes("youtu.be/")) {
  //     return url.replace("youtu.be/", "www.youtube.com/embed/");
  //   }
  //   return url;
  // };
  const formatVideoLink = (url) => {
    if (typeof url !== "string") {
      console.error("Invalid URL:", url);
      return "";
    }

    // Handle YouTube Links
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }

    // Handle SharePoint/OneDrive Stream Links
    if (url.includes("sharepoint.com") || url.includes("onedrive.com")) {
      return url.replace("stream.aspx?id=", "embed.aspx?id=").split("&")[0];
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

  const handleFileChange = (e) => {
    const file = e?.target?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader?.result.split(",")[1];
        const fileExtension = file?.name.split(".").pop();
        setFormData({
          ...formData,
          SelectFile: file,
          Document_Base64: base64String,
          FileExtension: fileExtension,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="card">
        <Heading title="Video Player Master" isBreadcrumb={true} />
        <div className="row m-2">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="VerticalID"
            placeholderName="Vertical"
            dynamicOptions={vertical}
            value={formData?.VerticalID}
            handleChange={handleDeliveryChange}
          />
          <Input
            type="text"
            className="form-control"
            id="TitleName"
            name="TitleName"
            lable="Title Name"
            onChange={handleSelectChange}
            value={formData?.TitleName}
            respclass="col-xl-3 col-md-4 col-12 col-sm-12"
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="DocumentType"
            placeholderName="DocumentType"
            dynamicOptions={[
              { label: "Video", value: "Video" },
              { label: "Script", value: "Script" },
            ]}
            value={formData?.DocumentType}
            handleChange={handleDeliveryChange}
          />
          {formData?.DocumentType == "Video" ? (
            <textarea
              type="text"
              className="summaryheightRemark"
              placeholder="VideoLink"
              lable="VideoLink"
              id={"VideoLink"}
              name="VideoLink"
              value={formData?.VideoLink}
              onChange={handleSelectChange}
              style={{ width: "30%", marginLeft: "7.5px" }}
            ></textarea>
          ) : (
            <Input
              type="file"
              id="SelectFile"
              name="SelectFile"
              respclass="col-md-4 col-12 col-sm-12"
              style={{ width: "100%", marginLeft: "5px" }}
              onChange={handleFileChange}
            />
          )}

          {editMode && (
            <div className="search-col" style={{ marginLeft: "8px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label className="switch" style={{ marginTop: "7px" }}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData?.isActive ? 1 : 0}
                    onChange={handleCheckBox}
                  />
                  <span className="slider"></span>
                </label>
                <span
                  style={{
                    marginLeft: "3px",
                    marginRight: "5px",
                    fontSize: "12px",
                  }}
                ></span>
              </div>
            </div>
          )}
          {editMode ? (
            <>
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={handleVideoUpdate}
                >
                  Update
                </button>
              )}
            </>
          ) : (
            <>
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-primary ml-3"
                  onClick={handleVideoSave}
                >
                  Save
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card mt-2">
          <Heading
            title={"Search Details"}
            secondTitle={
              <div className="d-flex">
                <div
                  className="d-flex flex-wrap align-items-center"
                  style={{ marginRight: "0px" }}
                >
                  <div
                    className="d-flex"
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="legend-circle"
                      style={{
                        backgroundColor: "lightgreen",
                        cursor: "pointer",
                        height: "10px",
                        width: "10px",
                        borderRadius: "50%",
                      }}
                      // onClick={() => handleSearch(undefined, "1")}
                    ></div>
                    <span
                      className="legend-label"
                      style={{
                        // width: "12%",
                        textAlign: "left",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      // onClick={() => handleSearch(undefined, "1")}
                    >
                      Active
                    </span>
                    <div
                      className="legend-circle"
                      style={{
                        backgroundColor: "red",
                        cursor: "pointer",
                        height: "10px",
                        width: "10px",
                        borderRadius: "50%",
                      }}
                      // onClick={() => handleSearch(undefined, "2")}
                    ></div>
                    <span
                      className="legend-label"
                      style={{
                        // width: "12%",
                        textAlign: "left",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      // onClick={() => handleSearch(undefined, "2")}
                    >
                      DeActive
                    </span>
                    <div
                      style={{ padding: "0px !important", marginLeft: "10px" }}
                    >
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
                </div>
              </div>
            }
          />
          {tableData?.length > 0 ? (
            <div>
              <Tables
                thead={videoTHEAD}
                tbody={currentData?.map((ele, index) => ({
                  "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
                  Vertical: ele?.Vertical,
                  "Title Name": ele?.Title,
                  "Video Link": (
                    <Tooltip label={ele?.VedioLink}>
                      <span
                        id={`VedioLink-${index}`}
                        targrt={`VedioLink-${index}`}
                        style={{ textAlign: "center" }}
                      >
                        {shortenName(ele?.VedioLink)}
                      </span>
                    </Tooltip>
                  ),
                  CreatedBy: ele?.CreatedBy,
                  CreatedDate: ele?.dtEntry,
                  Status: ele?.IsActive === 1 ? "Active" : "DeActive",
                  Play: ele?.VedioLink && (
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
                        //   <button
                        //   onClick={() => handleClick(ele?.VedioLink)}
                        //   className="btn btn-sm btn-primary"
                        // >
                        //   Play
                        // </button>
                        <div
                          style={{
                            position: "fixed",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 99999,
                            background: "white",
                            padding: "10px",
                            border: "2px solid black",
                            borderRadius: "5px",
                            boxShadow: "0px 0px 5px rgba(0,0,0,0.5)",
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
                            src={
                              videoLink ? `${videoLink}&action=embedview` : ""
                            }
                            title="Video Player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}
                    </div>
                  ),
                  Edit: (
                    <i
                      className="fa fa-edit"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEdit(ele)}
                    ></i>
                  ),
                  colorcode: ele?.rowColor,
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
      )}
    </>
  );
};
export default VideoPlayerMaster;
