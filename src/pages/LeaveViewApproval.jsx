import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import DatePickerMonth from "../components/formComponent/DatePickerMonth";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import { apiUrls } from "../networkServices/apiEndpoints";
import axios from "axios";
import { headers } from "../utils/apitools";
import ReactSelect from "../components/formComponent/ReactSelect";
import Tables from "../components/UI/customTable";
import { leaveViewRequestTHEAD } from "../components/modalComponent/Utils/HealperThead";
import Input from "../components/formComponent/Input";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import { useNavigate } from "react-router-dom";

import SeeMoreSlideScreen from "../components/SearchableTable/SeeMoreSlideScreen";
import SlideScreen from "./SlideScreen";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import LeaveRequestList from "./LeaveRequestList";
import Tooltip from "./Tooltip";
import { axiosInstances } from "../networkServices/axiosInstance";

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
const currentYear = currentDate.getFullYear();

const LeaveViewApproval = () => {
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );
  const IsEmployee = useCryptoLocalStorage("user_Data", "get", "realname");
  const [employee, setEmployee] = useState([]);
  const [formData, setFormData] = useState({
    Month: new Date(),
    Employee: "0",
    Name: "",
    Year: "",
    currentMonth: currentMonth,
    currentYear: currentYear,
    SearchType: "0",
  });

  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]); // Filtered data
  const [loading, setLoading] = useState(false);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredData([...tableData]);
    } else {
      const filtered = filteredData?.filter((item) =>
        item.Name.toLowerCase().includes(query)
      );
      setFilteredData(filtered);
      setCurrentPage(1);
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

  const totalEntries = filteredData.length;
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);

  const shortenName = (name) => {
    return name?.length > 45 ? name?.substring(0, 45) + "..." : name;
  };
  const getReporter = () => {
    axiosInstances
      .post(apiUrls.EmployeeEmail, {
        CrmEmployeeID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
      })
      .then((res) => {
        const assigntos = res?.data?.data?.map((item) => {
          return { label: item?.EmployeeName, value: item?.Employee_ID };
        });
        setEmployee(assigntos);
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
  };

  const handleMonthYearChange = (name, e) => {
    const { value } = e.target;
    const date = new Date(value);
    setFormData({
      ...formData,
      currentMonth: date.getMonth() + 1,
      currentYear: date.getFullYear(),
    });
  };

  // Effect to update days when month/year changes

  const handleTableSearch = (code) => {
    setLoading(true);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append(
    //     "CrmEmployeeID",
    //     formData?.Employee ? formData.Employee : "0"
    //   );
    // form.append("SearchType", formData?.SearchType);
    // form.append("Month", formData?.currentMonth),
    //   form.append("Year", formData?.currentYear),
    axiosInstances
      .post(apiUrls.LeaveApproval_Search, {
        CrmID: Number(formData?.Employee ? formData.Employee : "0"),
        Month: Number(formData?.currentMonth),
        Year: Number(formData?.currentYear),
        IsApproved: Number(0),
        VerticalID: Number(0),
        TeamID: Number(0),
        WingID: Number(0),
        Name: String(""),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res?.data?.data);
          setFilteredData(res?.data?.data);
          setLoading(false);
        } else {
          toast.error("No Record Found..");
          setLoading(false);
          setTableData([]);
          setFilteredData([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleTableSearchEmployee = () => {
    setLoading(true);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append(
    //     "CrmEmployeeID",
    //     useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
    //   ),
    //   form.append("SearchType", formData?.SearchType);
    // form.append("Month", formData?.currentMonth),
    //   form.append("Year", formData?.currentYear),
    //   // form.append("IsApproved", "2"),
    //   // form.append("RowColor", code ? code : "0"),
    //   axios
    //     .post(apiUrls?.LeaveApproval_Search, form, { headers })
    axiosInstances
      .post(apiUrls.LeaveApproval_Search, {
        CrmID: Number(formData?.Employee ? formData.Employee : "0"),
        Month: Number(formData?.currentMonth),
        Year: Number(formData?.currentYear),
        IsApproved: Number(0),
        VerticalID: Number(0),
        TeamID: Number(0),
        WingID: Number(0),
        Name: String(""),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res?.data?.data);
          setFilteredData(res?.data?.data);
          setLoading(false);
        } else {
          toast.error("No Record Found..");
          setLoading(false);
          setTableData([]);
          setFilteredData([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const [listVisible, setListVisible] = useState(false);
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const ModalComponent = (name, component) => {
    setListVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };
  const [seeMore, setSeeMore] = useState([]);

  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };
  useEffect(() => {
    getReporter();
  }, []);
  return (
    <>
      <div className="card">
        <Heading
          isBreadcrumb={true}
          title={
            <span style={{ fontWeight: "bold" }}>Leave View Approval</span>
          }
          secondTitle={
            <div>
              {tableData?.length > 0 && (
                <div
                  className="attendance-status"
                  style={{ fontWeight: "bold" }}
                >
                  <div
                    className="status-item total"
                    // onClick={() => {
                    //   ReportingManager == 1
                    //     ? handleTableSearch("1")
                    //     : handleTableSearchEmployee("1");
                    // }}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="dot white"></span>
                    No-Leave
                  </div>

                  <div
                    className="status-item online"
                    // onClick={() => {
                    //   ReportingManager == 1
                    //     ? handleTableSearch("2")
                    //     : handleTableSearchEmployee("2");
                    // }}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="dot skyblue"></span>
                    Pending
                  </div>
                  <div
                    className="status-item online"
                    // onClick={() => {
                    //   ReportingManager == 1
                    //     ? handleTableSearch("3")
                    //     : handleTableSearchEmployee("3");
                    // }}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="dot greenatten"></span>
                    Approved
                  </div>
                  <div className="status-item missing">
                    Total Record : {tableData?.length}
                  </div>
                </div>
              )}
            </div>
          }
        />
        <div className="row g-4 m-2">
          {ReportingManager == 1 ? (
            <ReactSelect
              name="Employee"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholderName="Employee"
              dynamicOptions={[{ label: "Select", value: "0" }, ...employee]}
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
          <ReactSelect
            name="SearchType"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="SearchType"
            dynamicOptions={[
              { label: "All", value: "0" },
              { label: "No Leaves", value: "1" },
              { label: "Pending", value: "2" },
              { label: "Approved", value: "3" },
            ]}
            value={formData?.SearchType}
            handleChange={handleDeliveryChange}
          />
          <div className="ml-2">
            {ReportingManager == 1 ? (
              <div>
                {loading ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-sm btn-info"
                    // onClick={() => handleTableSearch("")}
                    onClick={handleTableSearch}
                  >
                    Search
                  </button>
                )}
              </div>
            ) : (
              <div>
                {loading ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-sm btn-info"
                    onClick={handleTableSearchEmployee}
                    // onClick={() => handleTableSearchEmployee("")}
                  >
                    Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          {tableData?.length > 0 ? (
            <div className="card">
              <Heading
                title={
                  <span style={{ fontWeight: "bold" }}>Search Details</span>
                }
                secondTitle={
                  <div className="d-flex">
                    <div className="" style={{ fontWeight: "bold" }}>
                      Showing {startEntry} to {endEntry} of {totalEntries}
                      entries
                    </div>
                    <div
                      style={{ padding: "0px !important", marginLeft: "10px" }}
                    >
                      <Input
                        type="text"
                        className="form-control"
                        id="Name"
                        name="Name"
                        placeholder="Search By Name"
                        onChange={handleSearch}
                        value={searchQuery}
                        respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                      />
                    </div>
                  </div>
                }
              />

              <div className="row">
                <div className="col-sm-12">
                  <Tables
                    thead={leaveViewRequestTHEAD}
                    tbody={currentData?.map((ele, index) => ({
                      "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
                      "Month/Year": ele?.MonthYear,
                      "Employee Name": ele?.Name,
                      NoOfDays: ele?.NoOfDays,
                      // Dates: `${ele?.LeavesAvailable} , (Leave Date : ${ele?.LeaveDate})`,
                      "Leave Date": ele?.LeaveDate,
                      Description: (
                        <Tooltip label={ele?.Description}>
                          <span
                            id={`Description-${index}`}
                            targrt={`Description-${index}`}
                            style={{ textAlign: "center" }}
                          >
                            {shortenName(ele?.Description)}
                          </span>
                        </Tooltip>
                      ),
                      Edit: ele?.AllowEdit == 1 && (
                        <LeaveRequestList
                          ModalComponent={ModalComponent}
                          isShowDropDown={false}
                          setSeeMore={setSeeMore}
                          data={ele}
                          setVisible={() => {
                            setListVisible(false);
                          }}
                          handleBindFrameMenu={[
                            {
                              FileName: "Leave Request",
                              URL: "LeaveRequest",
                              FrameName: "LeaveRequest",
                              Description: "LeaveRequest",
                            },
                          ]}
                          isShowPatient={true}
                        />
                      ),

                      colorcode: ele?.rowColor,
                    }))}
                    tableHeight={"tableHeight"}
                  />
                </div>
              </div>
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
      )}
      <SlideScreen
        visible={listVisible}
        setVisible={() => {
          setListVisible(false);
          setRenderComponent({
            name: null,
            component: null,
          });
        }}
        Header={
          <SeeMoreSlideScreen
            name={renderComponent?.name}
            seeMore={seeMore}
            handleChangeComponent={handleChangeComponent}
          />
        }
      >
        {renderComponent?.component}
      </SlideScreen>
    </>
  );
};
export default LeaveViewApproval;
