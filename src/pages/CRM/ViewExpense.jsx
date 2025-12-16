import React, { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";
import DatePickerMonth from "../../components/formComponent/DatePickerMonth";
import MultiSelectComp from "../../components/formComponent/MultiSelectComp";
import { apiUrls } from "../../networkServices/apiEndpoints";
import ReactSelect from "../../components/formComponent/ReactSelect";
import Tables from "../../components/UI/customTable";
import { ViewExpenseThead } from "../../components/modalComponent/Utils/HealperThead";
import Input from "../../components/formComponent/Input";
import { Tabfunctionality } from "../../utils/helpers";
import Modal from "../../components/modalComponent/Modal";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ExportToExcel } from "../../networkServices/Tools";
import excelimg from "../../assets/image/excel.png";
import SlideScreen from "../SlideScreen";
import SeeMoreSlideScreen from "../../components/SearchableTable/SeeMoreSlideScreen";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import ViewExpenseApproveModal from "./ViewExpenseApproveModal";
import ViewExpenseRejectModal from "./ViewExpenseRejectModal";
import ViewExpenseSubmitModal from "./ViewExpenseSubmitModal";
import TripDetailModal from "./TripDetailModal";
import HotelDetailModal from "./HotelDetailModal";
import MealDetailModal from "./MealDetailModal";
import LocalDetailModal from "./LocalDetailModal";
import IntercityModalModal from "./IntercityModalModal";
import PhoneDetailModal from "./PhoneDetailModal";
import EnterDetailModal from "./EnterDetailModal";
import OtherDetailModal from "./OtherDetailModal";
import ViewExpenseDelete from "./ViewExpenseDelete";
import Loading from "../../components/loader/Loading";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
const currentYear = currentDate.getFullYear();

const ViewExpense = () => {
  const IsManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowExpenseApprove"
  );

  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );

  const IsEmployee = useCryptoLocalStorage("user_Data", "get", "realname");
  // console.log("IsManager", IsManager);
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wing, setWing] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [reporter, setReporter] = useState([]);
  const [formData, setFormData] = useState({
    Month: new Date(),
    VerticalID: [],
    TeamID: [],
    WingID: [],
    // Employee: Number(useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID"))
    //   ? Number(useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID"))
    //   : "",
    Employee: "0",
    ReportingTo: "",
    Name: "",
    Year: "",
    currentMonth: currentMonth,
    currentYear: currentYear,
    ExpenseType: "Both",
  });
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([...tableData]); // Filtered data
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
  const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, "").trim();
  const handleChangeComponent = (e) => {
    console.log("e", e);
    ModalComponent(e?.label, e?.component);
  };
  const handleSearchTable = (event) => {
    const rawQuery = event.target.value;
    const query = normalizeString(rawQuery);

    setSearchQuery(rawQuery);

    if (query === "") {
      setTableData(filteredData);
      setCurrentPage(1);
      return;
    }

    const filtered = filteredData?.filter((item) =>
      Object.keys(item).some(
        (key) => item[key] && normalizeString(String(item[key])).includes(query)
      )
    );

    if (filtered.length === 0) {
      setSearchQuery("");
      setTableData(filteredData);
    } else {
      setTableData(filtered);
    }

    setCurrentPage(1);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
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

  const getReporter = () => {
    axiosInstances
      .post(apiUrls.GetReportingTo_Employee, {})
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   axios
      //     .post(apiUrls?.GetReportingTo_Employee, form, { headers })
      .then((res) => {
        const reporters = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.Employee_ID };
        });
        setReporter(reporters);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getEmployee = () => {
    axiosInstances
      .post(apiUrls.EmployeeBind, {
        CrmEmployeeID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
      })
      // let form = new FormData();
      // form.append(
      //   "CrmEmployeeID",
      //   useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      // ),
      //   form.append(
      //     "RoleID",
      //     useCryptoLocalStorage("user_Data", "get", "RoleID")
      //   ),
      //   axios
      //     .post(apiUrls?.EmployeeBind, form, { headers })
      .then((res) => {
        const wings = res?.data?.data?.map((item) => {
          return { label: item?.EmployeeName, value: item?.Employee_ID };
        });
        setEmployee(wings);
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

  const handleMonthYearChange = (name, e) => {
    const { value } = e.target;
    const date = new Date(value);
    setFormData({
      ...formData,
      currentMonth: date.getMonth() + 1,
      currentYear: date.getFullYear(),
    });
  };
  const handleFilter = (filterValue) => {
    const filterData = tableData?.filter((item) => item?.Name === filterValue);
    return filterData;
  };

  const handleTableSearch = () => {
    if (formData?.ExpenseType == "") {
      toast.error("Please Select Expense Type.");
    } else {
      setLoading(true);
      axiosInstances
        .post(apiUrls.ViewExpenseList, {
          ExpenseEmployeeID: formData?.Employee ? Number(formData.Employee) : 0,
          Month: Number(formData?.currentMonth),
          Year: Number(formData?.currentYear),
          Status: String(0),
          TripName: String(""),
          ExpenseType: String(formData?.ExpenseType),
          VerticalID: Number(formData?.VerticalID),
          TeamID: Number(formData?.TeamID),
          WingID: Number(formData?.WingID),
          CrmEmployeeID: Number(
            useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
          ),
          IsAccountant: Number(0),
          StatusType: Number(0),
        })
        // let form = new FormData();
        // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID"));
        // form.append(
        //   "LoginName",
        //   useCryptoLocalStorage("user_Data", "get", "realname")
        // );
        // form.append(
        //   "CrmEmployeeID",
        //   useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        // );
        // form.append(
        //   "ExpenseEmployeeID",
        //   formData?.Employee ? formData.Employee : "0"
        //   // IsManager == 1
        //   //   ? "0"
        //   //   : formData?.Employee
        //   //     ? formData.Employee
        //   //     : useCryptoLocalStorage("user_Data", "get", "ID")
        // );
        // form.append("Month", formData?.currentMonth),
        //   form.append("Year", formData?.currentYear),
        //   form.append("Status", "0");
        // form.append("TripName", "");
        // form.append("ExpenseType", formData?.ExpenseType);
        // form.append("VerticalID", formData?.VerticalID);
        // form.append("TeamID", formData?.TeamID);
        // form.append("WingID", formData?.WingID);

        // axios
        //   .post(apiUrls?.ViewExpenseList, form, { headers })
        .then((res) => {
          if (res?.data?.success === true) {
            setTableData(res?.data?.data);
            setFilteredData(res?.data?.data);
            setLoading(false);
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
            setTableData([]);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };
  const handleTableSearchEmployee = () => {
    if (formData?.ExpenseType == "") {
      toast.error("Please Select Expense Type.");
    } else {
      setLoading(true);
      axiosInstances
        .post(apiUrls.ViewExpenseList, {
          ExpenseEmployeeID: Number(
            formData?.Employee ? Number(formData.Employee) : 0
          ),
          Month: Number(formData?.currentMonth),
          Year: Number(formData?.currentYear),
          Status: String(0),
          TripName: String(""),
          ExpenseType: String(formData?.ExpenseType),
          VerticalID: Number(formData?.VerticalID),
          TeamID: Number(formData?.TeamID),
          WingID: Number(formData?.WingID),
          CrmEmployeeID: Number(
            useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
          ),
          IsAccountant: Number(0),
          StatusType: Number(0),
        })
        // let form = new FormData();
        // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID"));
        // form.append(
        //   "CrmEmployeeID",
        //   useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        // );
        // form.append(
        //   "LoginName",
        //   useCryptoLocalStorage("user_Data", "get", "realname")
        // );
        // form.append(
        //   "ExpenseEmployeeID",
        //   useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        // );
        // form.append("Month", formData?.currentMonth),
        //   form.append("Year", formData?.currentYear),
        //   form.append("Status", "0");
        // form.append("TripName", "");
        // form.append("ExpenseType", formData?.ExpenseType);
        // form.append("VerticalID", formData?.VerticalID);
        // form.append("TeamID", formData?.TeamID);
        // form.append("WingID", formData?.WingID);

        // axios
        //   .post(apiUrls?.ViewExpenseList, form, { headers })
        .then((res) => {
          if (res?.data?.status === true) {
            setTableData(res?.data?.data);
            setFilteredData(res?.data?.data);
            setLoading(false);
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
            setTableData([]);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const [visible, setVisible] = useState({
    ShowReject: false,
    ShowApprove: false,
    ShowSubmit: false,
    tripShow: false,
    hotelShow: false,
    mealsShow: false,
    localShow: false,
    intercityShow: false,
    phoneShow: false,
    entertainmentShow: false,
    othersShow: false,
    deleteShow: false,
    showData: {},
  });

  useEffect(() => {
    getVertical();
    getTeam();
    getWing();
    getReporter();
    getEmployee();
  }, []);

  const isCurrentMonthSelected = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // months are 0-based
    const currentYear = today.getFullYear();

    // Previous month and year logic
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const isCurrentMonth =
      formData.currentMonth === currentMonth &&
      formData.currentYear === currentYear;

    const isPreviousMonth =
      formData.currentMonth === prevMonth &&
      formData.currentYear === prevMonthYear;

    // Check if today is within the first 5 days of the month
    const isWithinFirst5Days = today.getDate() <= 5;

    // Allow previous month only for first 5 days
    if (isPreviousMonth && isWithinFirst5Days) {
      return true; // enabled
    } else if (isPreviousMonth && !isWithinFirst5Days) {
      return false; // disabled
    }

    return isCurrentMonth; // normal current month behavior
  };
  const TwelthdayCurrentMonthSelected = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // months are 0-based
    const currentYear = today.getFullYear();

    // Previous month and year logic
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const isCurrentMonth =
      formData.currentMonth === currentMonth &&
      formData.currentYear === currentYear;

    const isPreviousMonth =
      formData.currentMonth === prevMonth &&
      formData.currentYear === prevMonthYear;

    // Check if today is within the first 5 days of the month
    const isWithinFirst5Days = today.getDate() <= 12;

    // Allow previous month only for first 5 days
    if (isPreviousMonth && isWithinFirst5Days) {
      return true; // enabled
    } else if (isPreviousMonth && !isWithinFirst5Days) {
      return false; // disabled
    }

    return isCurrentMonth; // normal current month behavior
  };

  return (
    <>
      {visible?.ShowApprove && (
        <Modal
          modalWidth={"500px"}
          visible={visible}
          setVisible={setVisible}
          Header="Approve Details"
        >
          <ViewExpenseApproveModal
            visible={visible}
            setVisible={setVisible}
            handleTableSearch={handleTableSearch}
            handleTableSearchEmployee={handleTableSearchEmployee}
          />
        </Modal>
      )}
      {visible?.ShowReject && (
        <Modal
          modalWidth={"500px"}
          visible={visible}
          setVisible={setVisible}
          Header="Reject Details"
        >
          <ViewExpenseRejectModal
            visible={visible}
            setVisible={setVisible}
            handleTableSearch={handleTableSearch}
            handleTableSearchEmployee={handleTableSearchEmployee}
          />
        </Modal>
      )}
      {visible?.ShowSubmit && (
        <Modal
          modalWidth={"500px"}
          visible={visible}
          setVisible={setVisible}
          Header="Submit Details"
        >
          <ViewExpenseSubmitModal
            visible={visible}
            setVisible={setVisible}
            handleTableSearch={handleTableSearch}
            handleTableSearchEmployee={handleTableSearchEmployee}
          />
        </Modal>
      )}
      {visible?.tripShow && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header="Expense Details"
        >
          <TripDetailModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.hotelShow && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header="Hotel Details"
        >
          <HotelDetailModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.mealsShow && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header="Meal Details"
        >
          <MealDetailModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.deleteShow && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header="Meal Details"
        >
          <ViewExpenseDelete
            visible={visible}
            setVisible={setVisible}
            handleTableSearch={handleTableSearch}
          />
        </Modal>
      )}
      {visible?.localShow && (
        <Modal
          modalWidth={"700px"}
          visible={visible}
          setVisible={setVisible}
          Header="Local Details"
        >
          <LocalDetailModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.intercityShow && (
        <Modal
          modalWidth={"700px"}
          visible={visible}
          setVisible={setVisible}
          Header="Intercity Details"
        >
          <IntercityModalModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.phoneShow && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header="Phone Details"
        >
          <PhoneDetailModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.entertainmentShow && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header="Entertainment Details"
        >
          <EnterDetailModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.othersShow && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header="Other Details"
        >
          <OtherDetailModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}

      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row g-4 m-2">
          {ReportingManager == 1 ? (
            <ReactSelect
              name="Employee"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              placeholderName="Employee"
              dynamicOptions={[{ label: "Select", value: "0" }, ...employee]}
              value={formData?.Employee}
              handleChange={handleDeliveryChange}
              onKeyDown={Tabfunctionality}
              tabIndex="1"
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
          <ReactSelect
            name="ReportingTo"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="ReportTo"
            dynamicOptions={reporter}
            value={formData?.ReportingTo}
            handleChange={handleDeliveryChange}
            onKeyDown={Tabfunctionality}
            tabIndex="1"
          />
          <DatePickerMonth
            // className="custom-calendar"
            id="Month"
            name="Month"
            lable="Month/Year"
            placeholder={"MM/YY"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={formData?.Month}
            handleChange={(e) => handleMonthYearChange("Month", e)}
          />

          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="VerticalID"
            placeholderName="Vertical"
            dynamicOptions={vertical}
            handleChange={handleMultiSelectChange}
            value={formData.VerticalID.map((code) => ({
              code,
              name: vertical.find((item) => item.code === code)?.name,
            }))}
            onKeyDown={Tabfunctionality}
            tabIndex="1"
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
            onKeyDown={Tabfunctionality}
            tabIndex="1"
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
            onKeyDown={Tabfunctionality}
            tabIndex="1"
          />
          <ReactSelect
            className="form-control"
            name="ExpenseType"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="ExpenseType"
            id="ExpenseType"
            dynamicOptions={[
              { label: "BOTH", value: "Both" },
              { label: "India", value: "India" },
              { label: "Overseas", value: "Overseas" },
            ]}
            value={formData?.ExpenseType}
            handleChange={handleDeliveryChange}
            onKeyDown={Tabfunctionality}
            tabIndex="1"
            requiredClassName={"required-fields"}
          />
          {ReportingManager == 1 ? (
            <div>
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2"
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
                  className="btn btn-sm btn-info ml-2"
                  onClick={handleTableSearchEmployee}
                >
                  Search
                </button>
              )}
            </div>
          )}
          {/* {IsEmployee && (
            <div>
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={handleTableSearchEmployee}
                >
                  Search
                </button>
              )}
            </div>
          )} */}
          {tableData?.length > 0 && (
            <img
              src={excelimg}
              className="ml-2"
              style={{ width: "34px", height: "24px", cursor: "pointer" }}
              onClick={() => ExportToExcel(tableData)}
              title="Click to download Excel"
            ></img>
          )}
        </div>
      </div>
      {tableData?.length > 0 ? (
        <div className="card mt-3">
          <Heading
            title={<span style={{ fontWeight: "bold" }}>Search Details</span>}
            secondTitle={
              <div className="d-flex">
                <div className="d-flex flex-wrap align-items-center">
                  <div
                    className="d-flex "
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="legendcircleExpense"
                      style={{
                        backgroundColor: "#007bff",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      V
                    </div>
                    <span
                      style={{
                        color: "#007bff",
                        fontWeight: "bold",
                        marginLeft: "4px",
                      }}
                    >
                      View
                    </span>
                  </div>

                  <div
                    className="d-flex "
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="legendcircleExpense"
                      style={{
                        backgroundColor: "green",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        marginLeft: "5px",
                      }}
                    >
                      A
                    </div>
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                        marginLeft: "4px",
                      }}
                    >
                      Approve
                    </span>
                  </div>

                  <div
                    className="d-flex "
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="legendcircleExpense"
                      style={{
                        backgroundColor: "red",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        marginLeft: "5px",
                      }}
                    >
                      R
                    </div>
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        marginLeft: "4px",
                      }}
                    >
                      Reject
                    </span>
                  </div>

                  <div
                    className="d-flex "
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="legendcircleExpense"
                      style={{
                        backgroundColor: "orange",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        marginLeft: "5px",
                      }}
                    >
                      S
                    </div>
                    <span
                      style={{
                        color: "orange",
                        fontWeight: "bold",
                        marginLeft: "4px",
                      }}
                    >
                      Submit
                    </span>
                  </div>
                  <div
                    className="d-flex "
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="legendcircleExpense"
                      style={{
                        backgroundColor: "#EB3467",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        marginLeft: "5px",
                      }}
                    >
                      D
                    </div>
                    <span
                      style={{
                        color: "#EB3467",
                        fontWeight: "bold",
                        marginLeft: "4px",
                        marginRight: "10px",
                      }}
                    >
                      Delete
                    </span>
                  </div>
                </div>
                <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                  Grand Total :&nbsp;
                  {tableData?.reduce((acc, curr) => acc + (curr.Total || 0), 0)}
                </span>
                {/* <div style={{ padding: "0px !important", marginLeft: "10px" }}>
                  <Input
                    type="text"
                    className="form-control"
                    id="Title"
                    name="Title"
                    lable="Search"
                    placeholder=" "
                    onChange={handleSearchTable}
                    value={searchQuery}
                    respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                  />
                </div> */}
                <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                  Total Record :&nbsp;{tableData?.length}
                </span>
              </div>
            }
          />

          <Tables
            thead={ViewExpenseThead}
            tbody={currentData?.map((ele, index) => ({
              "S.No": (currentPage - 1) * rowsPerPage + index + 1,
              Name: (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{ele?.EmpName}</span>
                  <i
                    className="fa fa-eye"
                    onClick={() => {
                      setVisible({
                        tripShow: true,
                        showData: ele,
                      });
                    }}
                    style={{
                      cursor: "pointer",
                      color: "black",
                      marginLeft: "10px",
                    }}
                    title="Expense Details"
                  ></i>
                </div>
              ),
              TripName: ele?.tripname,
              Date: ele?.DATE
                ? new Date(ele.DATE)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, " ")
                : "",
              Day: ele?.DAY,
              Hotel: (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{ele?.Hotel_Amount}</span>
                  {ele?.Hotel_Amount > 0 && (
                    <i
                      className="fa fa-eye"
                      onClick={() => {
                        setVisible({
                          hotelShow: true,
                          showData: ele,
                        });
                      }}
                      style={{
                        cursor: "pointer",
                        color: "black",
                        marginLeft: "10px",
                      }}
                      title="Hotel Details"
                    ></i>
                  )}
                </div>
              ),
              Meals: (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{ele?.Meals_Expense}</span>
                  {ele?.Meals_Expense > 0 && (
                    <i
                      className="fa fa-eye"
                      onClick={() => {
                        setVisible({
                          mealsShow: true,
                          showData: ele,
                        });
                      }}
                      style={{
                        cursor: "pointer",
                        color: "black",
                        marginLeft: "10px",
                      }}
                      title="Meal Details"
                    ></i>
                  )}
                </div>
              ),
              Local: (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{ele?.LocalAmount}</span>
                  {ele?.LocalAmount > 0 && (
                    <i
                      className="fa fa-eye"
                      onClick={() => {
                        setVisible({
                          localShow: true,
                          showData: ele,
                        });
                      }}
                      style={{
                        cursor: "pointer",
                        color: "black",
                        marginLeft: "10px",
                      }}
                      title="Local Details"
                    ></i>
                  )}
                </div>
              ),
              InterCity: (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{ele?.InterCityAmount}</span>
                  {ele?.InterCityAmount > 0 && (
                    <i
                      className="fa fa-eye"
                      onClick={() => {
                        setVisible({
                          intercityShow: true,
                          showData: ele,
                        });
                      }}
                      style={{
                        cursor: "pointer",
                        color: "black",
                        marginLeft: "10px",
                      }}
                      title="Intercity Details"
                    ></i>
                  )}
                </div>
              ),
              // Phone: (
              //   <div className="d-flex align-items-center justify-content-between">
              //     <span>{ele?.phone_Expense}</span>
              //     {ele?.phone_Expense > 0 && (
              //       <i
              //         className="fa fa-eye"
              //         onClick={() => {
              //           setVisible({
              //             phoneShow: true,
              //             showData: ele,
              //           });
              //         }}
              //         style={{
              //           cursor: "pointer",
              //           color: "black",
              //           marginLeft: "10px",
              //         }}
              //         title="Phone Details"
              //       ></i>
              //     )}
              //   </div>
              // ),
              Entertainment: (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{ele?.entertainment_Expense}</span>
                  {ele?.entertainment_Expense > 0 && (
                    <i
                      className="fa fa-eye"
                      onClick={() => {
                        setVisible({
                          entertainmentShow: true,
                          showData: ele,
                        });
                      }}
                      style={{
                        cursor: "pointer",
                        color: "black",
                        marginLeft: "10px",
                      }}
                      title="Entertainment Details"
                    ></i>
                  )}
                </div>
              ),
              Others: (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{ele?.misc_Expense}</span>
                  {ele?.misc_Expense > 0 && (
                    <i
                      className="fa fa-eye"
                      onClick={() => {
                        setVisible({
                          othersShow: true,
                          showData: ele,
                        });
                      }}
                      style={{
                        cursor: "pointer",
                        color: "black",
                        marginLeft: "10px",
                      }}
                      title="Other Details"
                    ></i>
                  )}
                </div>
              ),
              Total: ele?.Total,
              Status: ele?.Status,
              // <div>
              //    <span className="ledger-span">
              //         <AmountSubmissionSeeMoreList
              //           ModalComponent={ModalComponent}
              //           setSeeMore={setSeeMore}
              //           data={{ ...ele, type: "LedgerStatus" }}
              //           setVisible={() => {
              //             setListVisible(false);
              //           }}
              //           handleBindFrameMenu={[
              //             {
              //               FileName: "ExpenseSubmission",
              //               URL: "ExpenseSubmission",
              //               FrameName: "ExpenseSubmission",
              //               Description: "ExpenseSubmission",
              //             },
              //           ]}
              //           isShowPatient={true}
              //         />
              //       </span>
              // </div>

              // Action: (
              //   <>
              //     &nbsp;
              //     <div style={{ marginTop: "0px" }}>
              //       <Link
              //         style={{
              //           color: "white",
              //           fontWeight: "bold",
              //           border: "1px solid #355ec4",
              //           padding: "2px 9px",
              //           background: "#355ec4",
              //           borderRadius: "2px",
              //         }}
              //         to="/ExpenseSubmission"
              //         state={{
              //           data: ele?.DATE,
              //           edit: true,
              //           givenData: ele,
              //         }}
              //       >
              //         View
              //       </Link>

              //       {ele?.EmpID ==
              //       useCryptoLocalStorage(
              //         "user_Data",
              //         "get",
              //         "CrmEmployeeID"
              //       ) ? (
              //         <button
              //           className="btn btn-sm btn-info"
              //           style={{
              //             background: "green",
              //             fontWeight: "bold",
              //             border: "none",
              //             marginLeft: "10px",
              //           }}
              //           onClick={() => {
              //             setVisible({ ShowApprove: true, showData: ele });
              //           }}
              //           disabled
              //         >
              //           Approve
              //         </button>
              //       ) : (
              //         <button
              //           className="btn btn-sm btn-info"
              //           style={{
              //             background: "green",
              //             fontWeight: "bold",
              //             border: "none",
              //             marginLeft: "10px",
              //           }}
              //           onClick={() => {
              //             setVisible({ ShowApprove: true, showData: ele });
              //           }}
              //           disabled={ele?.is_approved === 1}
              //         >
              //           Approve
              //         </button>
              //       )}
              //     </div>
              //     <br></br>
              //     <button
              //       className="btn btn-sm btn-info"
              //       style={{
              //         background: "red",
              //         fontWeight: "bold",
              //         marginTop: "0px",
              //         border: "none",
              //       }}
              //       onClick={() => {
              //         setVisible({ ShowReject: true, showData: ele });
              //       }}
              //       disabled={ele?.is_approved === 1}
              //     >
              //       Reject
              //     </button>
              //     &nbsp;&nbsp;&nbsp;&nbsp;
              //     <button
              //       className="btn btn-sm btn-info"
              //       style={{
              //         background: "orange",
              //         fontWeight: "bold",
              //         marginTop: "5px",
              //         border: "none",
              //       }}
              //       onClick={() => {
              //         setVisible({ ShowSubmit: true, showData: ele });
              //       }}
              //       disabled={["Submitted", "Approved"].includes(ele?.Status)}
              //     >
              //       Submit
              //     </button>
              //     <br></br>
              //     <button
              //       className="btn btn-sm btn-info"
              //       style={{
              //         background: "#eb3467",
              //         fontWeight: "bold",
              //         marginTop: "5px",
              //         border: "none",
              //       }}
              //       onClick={() => {
              //         setVisible({ deleteShow: true, showData: ele });
              //       }}
              //     >
              //       Delete
              //     </button>
              //   </>
              // ),

              // Action: (
              //   <div
              //     style={{
              //       display: "flex",
              //       // flexWrap: "wrap",
              //       gap: "8px", // spacing between buttons
              //       padding: "3px",
              //     }}
              //   >
              //     <Link
              //       style={{
              //         color: "white",
              //         fontWeight: "bold",
              //         border: "1px solid #355ec4",
              //         width: "20px",
              //         height: "20px",
              //         background: "#355ec4",
              //         borderRadius: "50%",
              //         display: "flex",
              //         alignItems: "center",
              //         justifyContent: "center",
              //         textDecoration: "none",
              //       }}
              //       to="/ExpenseSubmission"
              //       state={{
              //         data: ele?.DATE,
              //         edit: true,
              //         givenData: ele,
              //       }}
              //       title="Click to View/Edit"
              //     >
              //       V
              //     </Link>

              //     {ele?.EmpID ==
              //       useCryptoLocalStorage(
              //         "user_Data",
              //         "get",
              //         "CrmEmployeeID"
              //       ) || ele?.is_approved === 1 ? null : (
              //       <span
              //         style={{
              //           color: "white",
              //           fontWeight: "bold",
              //           border: "1px solid green",
              //           width: "20px",
              //           height: "20px",
              //           background: "green",
              //           borderRadius: "50%",
              //           display: "flex",
              //           alignItems: "center",
              //           justifyContent: "center",
              //           textDecoration: "none",
              //         }}
              //         onClick={() => {
              //           setVisible({ ShowApprove: true, showData: ele });
              //         }}
              //         title="Click to Approve"
              //       >
              //         A
              //       </span>
              //     )}

              //     {ele?.is_approved !== 1 && (
              //       <span
              //         style={{
              //           color: "white",
              //           fontWeight: "bold",
              //           border: "1px solid red",
              //           width: "20px",
              //           height: "20px",
              //           background: "red",
              //           borderRadius: "50%",
              //           display: "flex",
              //           alignItems: "center",
              //           justifyContent: "center",
              //           textDecoration: "none",
              //         }}
              //         onClick={() => {
              //           setVisible({ ShowReject: true, showData: ele });
              //         }}
              //         title="Click to Reject"
              //       >
              //         R
              //       </span>
              //     )}

              //     {!["Submitted", "Approved"].includes(ele?.Status) && (
              //       <span
              //         style={{
              //           color: "white",
              //           fontWeight: "bold",
              //           border: "1px solid orange",
              //           width: "20px",
              //           height: "20px",
              //           background: "orange",
              //           borderRadius: "50%",
              //           display: "flex",
              //           alignItems: "center",
              //           justifyContent: "center",
              //           textDecoration: "none",
              //         }}
              //         onClick={() => {
              //           setVisible({ ShowSubmit: true, showData: ele });
              //         }}
              //         title="Click to Submit"
              //       >
              //         S
              //       </span>
              //     )}

              //     <span
              //       style={{
              //         color: "white",
              //         fontWeight: "bold",
              //         border: "1px solid #eb3467",
              //         width: "20px",
              //         height: "20px",
              //         background: "#eb3467",
              //         borderRadius: "50%",
              //         display: "flex",
              //         alignItems: "center",
              //         justifyContent: "center",
              //         textDecoration: "none",
              //       }}
              //       onClick={() => {
              //         setVisible({ deleteShow: true, showData: ele });
              //       }}
              //     >
              //       D
              //     </span>
              //   </div>
              // ),

              Action: (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    padding: "3px",
                  }}
                >
                  {/* View Button */}
                  <Link
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      border: "1px solid #355ec4",
                      width: "20px",
                      height: "20px",
                      background: "#355ec4",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                    }}
                    to="/ExpenseSubmission"
                    state={{
                      data: ele?.DATE,
                      edit: true,
                      givenData: ele,
                    }}
                    title="Click to View/Edit"
                  >
                    V
                  </Link>

                  {/* Approve Button - with conditional styling */}
                  {ele?.EmpID ==
                    useCryptoLocalStorage(
                      "user_Data",
                      "get",
                      "CrmEmployeeID"
                    ) ||
                  ele?.is_approved === 1 ||
                  ele?.Status === "Active" ? null : (
                    <span
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        border: "1px solid green",
                        width: "20px",
                        height: "20px",
                        background: TwelthdayCurrentMonthSelected()
                          ? "green"
                          : "#cccccc",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none",
                        cursor: TwelthdayCurrentMonthSelected()
                          ? "pointer"
                          : "not-allowed",
                        opacity: TwelthdayCurrentMonthSelected() ? 1 : 0.6,
                      }}
                      onClick={() => {
                        if (TwelthdayCurrentMonthSelected()) {
                          setVisible({ ShowApprove: true, showData: ele });
                        }
                      }}
                      title={
                        TwelthdayCurrentMonthSelected()
                          ? "Click to Approve"
                          : "Approval is available only on the 12th day of the current month."
                      }
                    >
                      A
                    </span>
                  )}

                  {/* Reject Button */}
                  {ele?.is_approved !== 1 && (
                    <span
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        border: "1px solid red",
                        width: "20px",
                        height: "20px",
                        background: TwelthdayCurrentMonthSelected()
                          ? "red"
                          : "#cccccc",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none",
                        cursor: TwelthdayCurrentMonthSelected()
                          ? "pointer"
                          : "not-allowed",
                        opacity: TwelthdayCurrentMonthSelected() ? 1 : 0.6,
                      }}
                      onClick={() => {
                        if (TwelthdayCurrentMonthSelected()) {
                          setVisible({ ShowReject: true, showData: ele });
                        }
                      }}
                      title={
                        TwelthdayCurrentMonthSelected()
                          ? "Click to Reject"
                          : "Reject is available only on the 12th day of the current month."
                      }
                    >
                      R
                    </span>
                  )}

                  {/* Submit Button */}
                  {!["Submitted", "Approved"].includes(ele?.Status) && (
                    <span
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        border: "1px solid orange",
                        width: "20px",
                        height: "20px",
                        background: isCurrentMonthSelected()
                          ? "orange"
                          : "#cccccc",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none",
                        cursor: isCurrentMonthSelected()
                          ? "pointer"
                          : "not-allowed",
                        opacity: isCurrentMonthSelected() ? 1 : 0.6,
                      }}
                      onClick={() => {
                        if (isCurrentMonthSelected()) {
                          setVisible({ ShowSubmit: true, showData: ele });
                        }
                      }}
                      title={
                        isCurrentMonthSelected()
                          ? "Click to Submit"
                          : "Submit is available only on the 5th day of the current month."
                      }
                    >
                      S
                    </span>
                  )}

                  {/* Delete Button */}
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      border: "1px solid #eb3467",
                      width: "20px",
                      height: "20px",
                      background:
                        ReportingManager == 1
                          ? TwelthdayCurrentMonthSelected()
                            ? "#eb3467"
                            : "#cccccc"
                          : isCurrentMonthSelected()
                            ? "#eb3467"
                            : "#cccccc",

                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                      cursor:
                        ReportingManager == 1
                          ? TwelthdayCurrentMonthSelected()
                            ? "pointer"
                            : "not-allowed"
                          : isCurrentMonthSelected()
                            ? "pointer"
                            : "not-allowed",
                      // cursor: isCurrentMonthSelected()
                      //   ? "pointer"
                      //   : "not-allowed",
                      opacity:
                        ReportingManager == 1
                          ? TwelthdayCurrentMonthSelected()
                            ? 1
                            : 0.6
                          : isCurrentMonthSelected()
                            ? 1
                            : 0.6,
                      // opacity: isCurrentMonthSelected() ? 1 : 0.6,
                    }}
                    // onClick={() => {
                    //   if (isCurrentMonthSelected()) {
                    //     setVisible({ deleteShow: true, showData: ele });
                    //   }
                    // }}
                    onClick={() => {
                      ReportingManager == 1
                        ? TwelthdayCurrentMonthSelected()
                          ? setVisible({ deleteShow: true, showData: ele })
                          : ""
                        : isCurrentMonthSelected()
                          ? setVisible({ deleteShow: true, showData: ele })
                          : "";
                    }}
                    title={
                      ReportingManager == 1
                        ? TwelthdayCurrentMonthSelected()
                          ? "Click to Delete"
                          : "Delete is available only on the 12th day of the current month."
                        : isCurrentMonthSelected()
                          ? "Click to Delete"
                          : "Delete is available only on the 5th day of the current month."
                    }
                    // title={
                    //   isCurrentMonthSelected()
                    //     ? "Click to Delete"
                    //     : "Delete only available for current month"
                    // }
                  >
                    D
                  </span>
                </div>
              ),

              Attachment: ele?.FileURLs ? (
                <>
                  <i
                    className="fa fa-print"
                    style={{
                      marginLeft: "5px",
                      cursor: "pointer",
                      color: "black",
                      padding: "2px",
                      borderRadius: "3px",
                    }}
                    onClick={() => window.open(ele?.FileURLs, "_blank")}
                    title="Click to view attachment"
                  ></i>
                </>
              ) : (
                ""
              ),
            }))}
            tableHeight={"tableHeight"}
          />
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
export default ViewExpense;
