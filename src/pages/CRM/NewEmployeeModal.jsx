import React, { useEffect, useState } from "react";
import Input from "../../components/formComponent/Input";
import { inputBoxValidation } from "../../utils/utils";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../../utils/constant";
import { toast } from "react-toastify";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../utils/apitools";
import axios from "axios";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import Heading from "../../components/UI/Heading";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import { useTranslation } from "react-i18next";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";

const NewEmployeeModal = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    UserName: "",
    RealName: "",
    MobileNo: "",
    Email: "",
    Password: "",
  });
  const [t] = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  const handleIndicator = (state) => {
    return (
      <div className="text" style={{ justifyContent: "space-between" }}>
        {/* <span className="text-dark">Max </span>{" "} */}({" "}
        <span className="text-black">{Number(0 + state?.length)}</span>)
      </div>
    );
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const centreTHEAD = [
    "S.No.",
    "RealName",
    "UserName",
    "MobileNo.",
    "Email",
    "Action",
    // "Remove",
  ];
  const handleNewEmployee = () => {
    setLoading(true);
    // let form = new FormData();
    // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("UserName", formData?.UserName),
    //   form.append("RealName", formData?.RealName),
    //   form.append("Email", formData?.Email),
    //   form.append("Password", formData?.Password),
    //   form.append("MobileNo", formData?.MobileNo),
    //   axios
    //     .post(apiUrls?.CreateEmployee_Short, form, { headers })
    axiosInstances
      .post(apiUrls.CreateEmployee_Short, {
        UserName: String(formData?.UserName),
        RealName: String(formData?.RealName),
        Email: String(formData?.Email),
        MobileNo: String(formData?.MobileNo),
        Password: String(formData?.Password),
      })
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          setFormData({
            UserName: "",
            RealName: "",
            MobileNo: "",
            Email: "",
            Password: "",
          });
          setEditMode(true);
          handleSearch()
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
  const handleUpdateEmployee = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.UpdateEmployee_Short, {
        UserName: String(formData?.UserName),
        RealName: String(formData?.RealName),
        Email: String(formData?.Email),
        MobileNo: String(formData?.MobileNo),
        Password: String(formData?.Password),
      })
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          setFormData({
            UserName: "",
            RealName: "",
            MobileNo: "",
            Email: "",
            Password: "",
          });
          setEditMode(true);
          handleSearch()
        } else {
          toast.error(res?.data?.message);
        }
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
  const handleSearch = () => {
    axiosInstances
      .post(apiUrls.SearchEmployee_Name, {
        EmployeeName: "",
        IsActive: String("2"),
        rowColor: "",
        MobileNo: "",
        EmailID: "",
        RoleID: "",
        CategoryID: "",
        ProjectID: "",
        VerticalID: "",
        TeamID: "",
        WingID: "",
      })
      .then((res) => {
        const data = res?.data?.data;
        setTableData(data);
        setFilteredData(res?.data?.data);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };
  const [editMode, setEditMode] = useState(false);
  const handleBillingEdit = (ele) => {
    console.log("editdetails", ele);
    setFormData({
      ...formData,
      UserName: ele?.username,
      RealName: ele?.realname,
      MobileNo: ele?.mobileno,
      Email: ele?.email,
    });
    setEditMode(true);
  };

  const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, "").trim();

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

  useEffect(() => {
    handleSearch();
  }, []);
  return (
    <>
      <div className="card ">
        <div className="row m-2">
          <Input
            type="text"
            className="form-control"
            id="RealName"
            name="RealName"
            lable="Real Name"
            onChange={handleSelectChange}
            value={formData?.RealName}
            respclass="col-xl-4 col-md-4 col-12 col-sm-12"
          />
          <Input
            type="text"
            className="form-control"
            id="UserName"
            name="UserName"
            lable="User Name"
            onChange={handleSelectChange}
            value={formData?.UserName}
            disabled={editMode === true}
            respclass="col-xl-4 col-md-4 col-12 col-sm-12"
          />

          <div className="d-flex">
            <Input
              type="number"
              className="form-control"
              id="MobileNo"
              name="MobileNo"
              lable="Mobile No."
              onChange={(e) => {
                inputBoxValidation(
                  MOBILE_NUMBER_VALIDATION_REGX,
                  e,
                  handleSelectChange
                );
              }}
              value={formData?.MobileNo}
              // respclass="col-xl-4 col-md-4 col-12 col-sm-12"
            />
            <span className="ml-1"> {handleIndicator(formData?.MobileNo)}</span>
          </div>
          <Input
            type="text"
            className="form-control mt-2"
            id="Email"
            name="Email"
            lable="Email"
            onChange={handleSelectChange}
            value={formData?.Email}
            respclass="col-xl-4 col-md-4 col-12 col-sm-12"
          />

          <div className="col-sm-4 d-flex mt-2">
            <div className="maindiv">
              <Input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="Password"
                name="Password"
                lable={t("Password")}
                placeholder=""
                value={formData?.Password}
                onChange={handleSelectChange}
              />
            </div>
            <div
              className="icondiv"
              onClick={togglePasswordVisibility}
              style={{ cursor: "pointer", color: "black", marginLeft: "3px" }}
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              />
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="col-2 mt-2">
              {editMode ? (
                <button
                  className="btn btn-sm btn-info"
                  onClick={handleUpdateEmployee}
                >
                  Update
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-info"
                  onClick={handleNewEmployee}
                >
                  Create
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {tableData?.length > 0 ? (
        <div className="card mt-3">
          <Heading
            title={<span style={{ fontWeight: "bold" }}>Employee Details</span>}
            secondTitle={
              <div className="d-flex">
                <div style={{ padding: "0px !important", marginLeft: "10px" }}>
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
                </div>
                <span style={{ fontWeight: "bold" }}>
                  Total Record :&nbsp;{tableData?.length}
                </span>
              </div>
            }
          />
          <Tables
            thead={centreTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              RealName: ele?.realname,
              UserName: ele?.username,
              "MobileNo.": ele?.mobileno,
              Email: ele?.email,
              Action: (
                <i
                  className="fa fa-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleBillingEdit(ele)}
                ></i>
              ),
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
export default NewEmployeeModal;
