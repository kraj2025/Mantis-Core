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
  ViewEmployeeExpenseThead,
  ViewExpenseThead,
} from "../../components/modalComponent/Utils/HealperThead";
import Input from "../../components/formComponent/Input";
import { Tabfunctionality } from "../../utils/helpers";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Modal from "../../components/modalComponent/Modal";
import ViewExpenseApproveModal from "./ViewExpenseApproveModal";
import ViewExpenseRejectModal from "./ViewExpenseRejectModal";
import ViewExpenseSubmitModal from "./ViewExpenseSubmitModal";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
const currentYear = currentDate.getFullYear();

const  ViewEmployeeExpense= () => {
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([...tableData]); // Filtered data

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      // If the search query is empty, reset the filtered data to the original table data
      setFilteredData([...tableData]);
    } else {
      const filtered = filteredData.filter((item) =>
        item.Name.toLowerCase().includes(query)
      );
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

  const totalEntries = filteredData.length;
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
    ExpenseType: "",
    currentMonth: currentMonth,
    currentYear: currentYear,
  });

  const getReporter = () => {
    axiosInstances
        .post(apiUrls.Reporter_Select, {
         
        })
        .then((res) => {
          const reporters = res?.data.data.map((item) => {
            return { label: item?.NAME, value: item?.ID };
          });
          setEmployee(reporters);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const getVertical = () => {
    let form = new FormData();
    form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
      axios
        .post(apiUrls?.Vertical_Select, form, { headers })
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
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      axios
        .post(apiUrls?.Team_Select, form, { headers })
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
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      axios
        .post(apiUrls?.Wing_Select, form, { headers })
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

  const handleFilter = (filterValue) => {
    const filterData = tabledata1?.filter((item) => item?.Name === filterValue);
    return filterData;
  };
  console.log(handleFilter);
  const handleMonthYearChange = (name, e) => {
    const { value } = e.target;
    const date = new Date(value);
    setFormData({
      ...formData,
      currentMonth: date.getMonth() + 1,
      currentYear: date.getFullYear(),
    });
  };
  const handleTableSearch = () => {
    if (formData?.ExpenseType == "") {
      toast.error("Please Select Expense Type.");
    } else {
      let form = new FormData();
      form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID"));
      form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname") );
      form.append("ExpenseEmployeeID", useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID"));
      form.append("Month", formData?.currentMonth),
        form.append("Year", formData?.currentYear),
        form.append("Status", "0");
      form.append("TripName", "");
      form.append("ExpenseType", formData?.ExpenseType);
      form.append("VerticalID", formData?.VerticalID);
      form.append("TeamID", formData?.TeamID);
      form.append("WingID", formData?.WingID);

      axios
        .post(apiUrls?.ViewExpenseList_Accounts, form, { headers })
        .then((res) => {
          setTableData(res?.data?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
          modalWidth={"300px"}
          visible={visible}
          setVisible={setVisible}
          Header="Paid Details"
        >
          <ViewEmployeePayModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      <div className="card">
        <Heading title="View Expense" isBreadcrumb={true}   secondTitle={
            <div className="attendance-status">
              <div className="status-item online">
                <span className="dot green"></span>
                <strong>Approved(NotPaid) </strong>
              </div>
              <div className="status-item leave">
                <span className="dot orange"></span>
                <strong>Pending</strong>
              </div>
              <div className="status-item leave">
                <span className=" dot pink"></span>
                <strong>Approved(Paid)</strong>
              </div>
            </div>
          } />
        <div className="row p-2">
          <ReactSelect
            name="Employee"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            placeholderName="Employee"
            dynamicOptions={employee}
            value={formData?.Employee}
            handleChange={handleDeliveryChange}
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
          <ReactSelect
            name="Status"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="Status"
            dynamicOptions={[
              { label: "ALL", value: "ALL" },
              { label: "ACTIVE", value: "0#0" },
              { label: "SUBMITTED", value: "1#0" },
              { label: "APPROVED", value: "1#1" },
              { label: "REJECTED", value: "1#-1" },
            ]}
            value={formData?.Status}
            handleChange={handleDeliveryChange}
          />
          <Input
            type="text"
            className="form-control"
            id="TripName"
            name="TripName"
            lable="TripName"
            placeholder=""
            onChange={handleSelectChange}
            value={formData?.TripName}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
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
            // onKeyDown={Tabfunctionality}
            // tabIndex="1"
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
          <ReactSelect
            className="form-control"
            name="ExpenseType"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="ExpenseType"
            id="ExpenseType"
            dynamicOptions={[
              { label: "BOTH", value: "-1" },
              { label: "India", value: "0" },
              { label: "Overseas", value: "1" },
            ]}
            value={formData?.ExpenseType}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
          />
          <div className="col-2">
            <button className="btn btn-sm btn-info" onClick={handleTableSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card">
          <Heading
            title="Search Details"
            secondTitle={
              <div className="d-flex">
                <div className="">
                  Showing {startEntry} to {endEntry} of {totalEntries} entries
                </div>
              </div>
            }
          />

          <Tables
            thead={ViewEmployeeExpenseThead}
            tbody={tableData?.map((ele, index) => ({
              "S.No": index + 1,
              Name: ele?.tripname,
              Team: ele?.EmoName,
              "Reporting Manager": ele?.EmoName,
              "Total Amount": ele?.EmoName,
              "Pending Amount": ele?.EmoName,
              "Rejected Amount": ele?.EmoName,
              "Approved Amount": ele?.LocalTravel,
              "Advance Amount": ele?.EmoName,
              "Paid Amount": ele?.EmoName,
              "Net Payable Amount": ele?.EmoName,
              Action: (
                <div>
                  <button
                    className="btn btn-sm "
                    onClick={() => {
                      setVisible({ showVisible: true, showData: ele });
                    }}
                  >
                    Pay
                  </button>
                  <button
                    className="btn btn-sm ml-1"
                    onClick={() => {
                      setVisible({ showVisible: true, showData: ele });
                    }}
                    style={{
                      background: "orange",
                      border: "none",
                      color: "white",
                    }}
                  >
                    Adjust
                  </button>
                </div>
              ),
              Attachment: ele?.Attachment ? (
                <i className="fa fa-paperclip" title="Attachment"></i>
              ) : null,
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
export default ViewEmployeeExpense;