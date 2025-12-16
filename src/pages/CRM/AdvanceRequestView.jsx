import React, { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";
import DatePickerMonth from "../../components/formComponent/DatePickerMonth";
import MultiSelectComp from "../../components/formComponent/MultiSelectComp";
import { apiUrls } from "../../networkServices/apiEndpoints";
import axios from "axios";
import { headers } from "../../utils/apitools";
import ReactSelect from "../../components/formComponent/ReactSelect";
import Tables from "../../components/UI/customTable";
import {
  advanceRequestTHEAD,
  leaveViewRequestTHEAD,
} from "../../components/modalComponent/Utils/HealperThead";
import Input from "../../components/formComponent/Input";
import { toast } from "react-toastify";
import Modal from "../../components/modalComponent/Modal";
import AdvanceRequestSettelementModal from "./AdvanceRequestSettelementModal";
import Loading from "../../components/loader/Loading";
import AdvanceRequestReject from "./AdvanceRequestReject";
import AdvanceRequestApprove from "./AdvanceRequestApprove";
import AdvanceRequestFinalApprove from "./AdvanceRequestFinalApprove";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { Link } from "react-router-dom";
import { axiosInstances } from "../../networkServices/axiosInstance";

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
const currentYear = currentDate.getFullYear();

const AdvanceRequestView = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]); //original data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]); // Filtered data
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );
  const IsAccountant = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsAccountant"
  );
  const IsCEO = useCryptoLocalStorage("user_Data", "get", "IsCEO");
  const IsEmployee = useCryptoLocalStorage("user_Data", "get", "realname");
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      // If the search query is empty, reset the filtered data to the original table data
      setFilteredData(tableData);
    } else {
      console.log("query", query, tableData);
      const filtered = tableData?.filter(
        (item) => item.RequestedBy?.toLowerCase().includes(query) // Add optional chaining to handle undefined
      );
      // console.log("filteredfiltered",filtered)
      setFilteredData(filtered);
      setCurrentPage(1); // Reset to the first page after search
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredData?.length / rowsPerPage);
  const currentData = filteredData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const totalEntries = filteredData?.length;
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);

  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [formData, setFormData] = useState({
    Month: new Date(),
    VerticalID: [],
    TeamID: [],
    WingID: [],
    Employee: "",
    Name: "",
    Year: "",
    currentMonth: currentMonth,
    currentYear: currentYear,
  });
  const handleMonthYearChange = (name, e) => {
    const { value } = e.target;
    const date = new Date(value);
    setFormData({
      ...formData,
      currentMonth: date.getMonth() + 1,
      currentYear: date.getFullYear(),
    });
  };
  const getReporter = () => {
    axiosInstances
      .post(apiUrls.Reporter_Select, {
        IsMaster: 0,
        RoleID: 0,
        OnlyItdose: 0,
      })
    
      .then((res) => {
        const reporters = res?.data.data.map((item) => {
          return { label: item?.Name, value: item?.ID };
        });
        setEmployee(reporters);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getVertical = () => {
    axiosInstances
      .post(apiUrls.Vertical_Select, {})
      // let form = new FormData();
      // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   axios
      //     .post(apiUrls?.Vertical_Select, form, { headers })
      .then((res) => {
        const verticals = res?.data.data.map((item) => {
          return { name: item?.Vertical, code: item?.VerticalID };
        });
        setVertical(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getTeam = () => {
    axiosInstances
      .post(apiUrls.Team_Select, {})
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   axios
      //     .post(apiUrls?.Team_Select, form, { headers })
      .then((res) => {
        const teams = res?.data.data.map((item) => {
          return { name: item?.Team, code: item?.TeamID };
        });
        setTeam(teams);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getWing = () => {
    axiosInstances
      .post(apiUrls.Wing_Select, {})
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   axios
      //     .post(apiUrls?.Wing_Select, form, { headers })
      .then((res) => {
        const wings = res?.data.data.map((item) => {
          return { name: item?.Wing, code: item?.WingID };
        });
        setWing(wings);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const searchHandleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    getVertical();
    getTeam();
    getWing();
    getReporter();
  }, []);
  const handleSelectChange = (e) => {
    const { name, value } = e?.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleFilter = (filterValue) => {
  //   const filterData = filteredData?.filter(
  //     (item) => item?.Name === filterValue
  //   );
  //   return filterData;
  // };
  // console.log(handleFilter);

  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
  const handleSearchAdvance = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.AdvanceRequest_Search, {
        Month: String(formData?.currentMonth),
        Year: String(formData?.currentYear),
        RequestedBy: Number(formData?.Employee),
        SearchType: Number(0),
        VerticalID: Number(formData?.VerticalID),
        TeamID: Number(formData?.TeamID),
        WingID: Number(formData?.WingID),
      })
      // let form = new FormData();
      // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID"));
      // form.append(
      //   "LoginName",
      //   useCryptoLocalStorage("user_Data", "get", "realname")
      // );
      // form.append(
      //   "CrmID",
      //   useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      // );
      // form.append("Month", formData?.currentMonth),
      //   form.append("Year", formData?.currentYear),
      //   form.append("RequestedBy", formData?.Employee || "0");
      // form.append("SearchType", "");
      // form.append("VerticalID", formData?.VerticalID);
      // form.append("TeamID", formData?.TeamID);
      // form.append("WingID", formData?.WingID);

      // axios
      //   .post(apiUrls?.AdvanceRequest_Search, form, { headers })
      .then((res) => {
        setTableData(res?.data?.data);
        setFilteredData(res?.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleSearchAdvanceEmployee = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.AdvanceRequest_Search, {
        Month: String(formData?.currentMonth),
        Year: String(formData?.currentYear),
        RequestedBy:
          IsCEO == "1"
            ? Number("0")
            : Number(useCryptoLocalStorage("user_Data", "get", "ID")),
        SearchType: Number(0),
        VerticalID: Number(formData?.VerticalID),
        TeamID: Number(formData?.TeamID),
        WingID: Number(formData?.WingID),
      })
      // let form = new FormData();
      // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID"));
      // form.append(
      //   "LoginName",
      //   useCryptoLocalStorage("user_Data", "get", "realname")
      // );
      // form.append(
      //   "CrmID",
      //   useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      // );
      // form.append("Month", formData?.currentMonth),
      //   form.append("Year", formData?.currentYear),
      //   form.append(
      //     "RequestedBy",
      //     IsCEO == "1" ? "0" : useCryptoLocalStorage("user_Data", "get", "ID")
      //   );
      // form.append("SearchType", "");
      // form.append("VerticalID", formData?.VerticalID);
      // form.append("TeamID", formData?.TeamID);
      // form.append("WingID", formData?.WingID);

      // axios
      //   .post(apiUrls?.AdvanceRequest_Search, form, { headers })
      .then((res) => {
        if (res?.data?.status === true) {
          setTableData(res?.data?.data);
          setFilteredData(res?.data?.data);
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
          setTableData([]);
          setFilteredData([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const [visible, setVisible] = useState({
    showVisible: false,
    ShowReject: false,
    ShowApprove: false,
    ShowFinalApprove: false,
    showData: {},
  });
  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header="Payment Details"
        >
          <AdvanceRequestSettelementModal
            visible={visible}
            setVisible={setVisible}
            handleSearchAdvance={handleSearchAdvance}
          />
        </Modal>
      )}
      {visible?.ShowReject && (
        <Modal
          modalWidth={"500px"}
          visible={visible}
          setVisible={setVisible}
          Header="Reject Advance Request"
        >
          <AdvanceRequestReject
            visible={visible}
            setVisible={setVisible}
            handleSearchAdvance={handleSearchAdvance}
          />
        </Modal>
      )}
      {visible?.ShowApprove && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header="Approve Advance Request"
        >
          <AdvanceRequestApprove
            visible={visible}
            setVisible={setVisible}
            handleSearchAdvance={handleSearchAdvance}
          />
        </Modal>
      )}
      {visible?.ShowFinalApprove && (
        <Modal
          modalWidth={"500px"}
          visible={visible}
          setVisible={setVisible}
          Header="Final Approve Details"
        >
          <AdvanceRequestFinalApprove
            visible={visible}
            setVisible={setVisible}
            handleSearchAdvance={handleSearchAdvance}
          />
        </Modal>
      )}
      <div className="card">
        <Heading
          isBreadcrumb={true}
          title={
            <span style={{ fontWeight: "bold" }}>Advance Request View</span>
          }
          secondTitle={
            <div className="attendance-status">
              <div className="status-item ">
                <span className="dot white"></span>
                <strong>Pending</strong>
              </div>
              <div className="status-item ">
                <span className="dot lemonchiffonAdvReq"></span>
                <strong>First Level Approved </strong>
              </div>
              <div className="status-item ">
                <span className="dot skyblueAdReq"></span>
                <strong>Final Approved</strong>
              </div>
              <div className="status-item ">
                <span className="dot pinkAdvReq"></span>
                <strong>Rejected </strong>
              </div>
              <div className="status-item ">
                <span className="dot yellowAdvReq"></span>
                <strong>Settelement </strong>
              </div>
              <div className="status-item ">
                <span className="dot greenAdvReq"></span>
                <strong>Paid </strong>
              </div>

              <div style={{ fontWeight: "bold" }}>
                <Link to="/AdvanceRequest" className="ml-3">
                  Advance Request Create
                </Link>
              </div>
            </div>
          }
        />
        <div className="row g-4 m-2">
          <DatePickerMonth
            className="custom-calendar"
            id="Month"
            name="Month"
            lable="Month/Year"
            placeholder={"MM/YY"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={formData?.Month}
            handleChange={(e) => handleMonthYearChange("Month", e)}
          />
          {ReportingManager == 1 ? (
            <ReactSelect
              name="Employee"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholderName="Employee"
              dynamicOptions={employee}
              value={formData?.Employee}
              handleChange={handleDeliveryChange}
            />
          ) : (
            <Input
              type="text"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              className="form-control"
              placeholder=" "
              lable="Employee"
              id="Employee"
              name="Employee"
              value={IsEmployee}
              // onChange={handleChange}
              disabled={true}
            />
          )}
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="VerticalID"
            placeholderName="Vertical"
            dynamicOptions={vertical}
            optionLabel="VerticalID"
            className="VerticalID"
            handleChange={handleMultiSelectChange}
            value={formData.VerticalID.map((code) => ({
              code,
              name: vertical.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="TeamID"
            placeholderName="Team"
            dynamicOptions={team}
            handleChange={handleMultiSelectChange}
            value={formData.TeamID.map((code) => ({
              code,
              name: team.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="WingID"
            placeholderName="Wing"
            dynamicOptions={wing}
            handleChange={handleMultiSelectChange}
            value={formData.WingID.map((code) => ({
              code,
              name: wing.find((item) => item.code === code)?.name,
            }))}
          />

          {ReportingManager == 1 ? (
            <div className="col-2">
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-info"
                  onClick={handleSearchAdvance}
                >
                  Search
                </button>
              )}
            </div>
          ) : (
            <div className="col-2">
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-info"
                  onClick={handleSearchAdvanceEmployee}
                >
                  Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {tableData?.length > 0 && (
        <div className="card">
          <Heading
            title={<span style={{ fontWeight: "bold" }}>Search Details</span>}
            secondTitle={
              // <div className="d-flex">
              //   <div className="">
              //     Showing {startEntry} to {endEntry} of {totalEntries} entries
              //   </div>
              //   <div style={{ padding: "0px !important", marginLeft: "50px" }}>
              //     <Input
              //       type="text"
              //       className="form-control"
              //       id="Name"
              //       name="Name"
              //       placeholder="Search By Name"
              //       onChange={handleSearch}
              //       value={searchQuery}
              //       respclass="col-xl-12 col-md-4 col-sm-6 col-12"
              //     />
              //   </div>
              // </div>

              ""
            }
          />

          <Tables
            thead={advanceRequestTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              "Entry Date": ele?.dtEntry,
              "Expected Date": ele?.ExpectedDate,
              Name: ele?.RequestedBy,
              Vertical: ele?.Vertical,
              Team: ele?.Team,
              Wing: ele?.Wing,
              Purpose: ele?.PurposeofAdvance,
              Amount: ele?.AmountRequired,
              Settlement: IsAccountant == "1" &&
                ele?.IsFinalApproved == "1" && (
                  <>
                    {ele?.IsPaid > 0 ? (
                      ""
                    ) : (
                      <button
                        className="btn btn-xs"
                        style={{ color: "white" }}
                        onClick={() => {
                          setVisible({ showVisible: true, showData: ele });
                        }}
                      >
                        Pay
                      </button>
                    )}
                  </>
                ),
              Action: (
                <div>
                  {ReportingManager == "1" && (
                    <>
                      {ele?.RequestedById ==
                      useCryptoLocalStorage("user_Data", "get", "ID") ? (
                        ""
                      ) : (
                        <>
                          {ele?.ApprovalStatus > 0 ? (
                            ""
                          ) : (
                            <button
                              className="btn btn-xs"
                              style={{
                                background: "green",
                                border: "none",
                                color: "white",
                              }}
                              // onClick={handleApprove}
                              onClick={() => {
                                setVisible({
                                  ShowApprove: true,
                                  showData: ele,
                                });
                              }}
                            >
                              Approve
                            </button>
                          )}
                        </>
                      )}
                      {ele?.RequestedById ==
                      useCryptoLocalStorage("user_Data", "get", "ID") ? (
                        ""
                      ) : (
                        <>
                          {ele?.ApprovalStatus > 0 ? (
                            ""
                          ) : (
                            <button
                              className="btn btn-xs ml-3"
                              style={{
                                background: "red",
                                border: "none",
                                color: "white",
                              }}
                              onClick={() => {
                                setVisible({ ShowReject: true, showData: ele });
                              }}
                            >
                              Reject
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {IsCEO == "1" && ele?.ApprovalStatus == "1" && (
                    <>
                      {ele?.IsFinalApproved == "1" ? (
                        " "
                      ) : (
                        <button
                          className="btn btn-xs ml-1"
                          style={{
                            background: "green",
                            border: "none",
                            color: "white",
                          }}
                          onClick={() => {
                            setVisible({
                              ShowFinalApprove: true,
                              showData: ele,
                            });
                          }}
                        >
                          Final Approve
                        </button>
                      )}
                    </>
                  )}
                </div>
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
      )}
    </>
  );
};
export default AdvanceRequestView;
