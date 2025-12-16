import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { toast } from "react-toastify";
import Modal from "../components/modalComponent/Modal";
import TransferProjectModal from "../components/UI/customTable/TransferProjectModal";
import Heading from "../components/UI/Heading";
import ReactSelect from "../components/formComponent/ReactSelect";
import Tables from "../components/UI/customTable";
import Input from "../components/formComponent/Input";
import Loading from "../components/loader/Loading";
import UserDeleteModal from "./UserDeleteModal";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

const UserMapping = ({ data }) => {
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reporter, setReporter] = useState([]);
  const [project, setProject] = useState([]);
  const [formData, setFormData] = useState({
    Username: "",
    Password: "",
    User: "",
    Project: "",
    CreateUserName: "",
    AccessType: "",
  });

  const getReporter = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "RoleID",
    //     useCryptoLocalStorage("user_Data", "get", "RoleID")
    //   ),
    // axios
    //   .post(apiUrls?.Reporter_Select, form, { headers })
    axiosInstances
      .post(apiUrls?.Reporter_Select, {
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
      })
      .then((res) => {
        const reporters = res?.data.data.map((item) => {
          return { label: item?.Name, value: item?.ID };
        });
        setReporter(reporters);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProject = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    // axios
    //   .post(apiUrls?.ProjectSelect, form, { headers })
    axiosInstances
      .post(apiUrls?.ProjectSelect, { RoleID: 0, ProjectID: 0 })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.Project, value: item?.ProjectId };
        });
        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name == "User") {
      setFormData({ ...formData, [name]: value });
      handleSearch(value);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [visible, setVisible] = useState({
    deleteVisible: false,
    showData: {},
  });

  const handleSearch = (value) => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "RoleID",
    //     useCryptoLocalStorage("user_Data", "get", "RoleID")
    //   ),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ProjectID", data?.Id || data?.ProjectID || value),
    //   form.append("Title", "UserMapping"),
    // axios
    //   .post(apiUrls?.getViewProject, form, { headers })
    axiosInstances
      .post(apiUrls?.getViewProject, {
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
        ProjectID: Number(data?.Id || data?.ProjectID || value),
        Title: "UserMapping",
      })
      .then((res) => {
        setTableData(res?.data?.data);
        setFilteredData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleAddUserMapping = () => {
    if (formData?.User == "") {
      toast.error("Please Select User.");
    } else {
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "RoleID",
      //     useCryptoLocalStorage("user_Data", "get", "RoleID")
      //   ),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("ProjectID", data?.Id || data?.ProjectID),
      //   form.append("EmployeeID", formData?.User),
      //   form.append("ActionType", "AddUserMapping"),
      //   axios
      //     .post(apiUrls?.ProjectMasterUpdate, form, { headers })

      axiosInstances
        .post(apiUrls?.ProjectMasterUpdate, {
          ProjectID: Number(data?.Id || data?.ProjectID),
          EmployeeID: Number(formData?.User),
          ActionType: "AddUserMapping",
        })
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            handleSearch();
            setLoading(false);
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleCopyUserMapping = () => {
    if (formData?.Project == "") {
      toast.error("Please Select Project.");
    } else if (formData?.AccessType == "") {
      toast.error("Please Select AccessType.");
    } else {
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "RoleID",
      //     useCryptoLocalStorage("user_Data", "get", "RoleID")
      //   ),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("ProjectID", data?.Id || data?.ProjectID),
      //   form.append("TargetProjectID", formData?.Project),
      //   form.append("ActionType", "CopyUserMapping"),
      //   form.append("AccessType", formData?.AccessType),
      // axios
      //   .post(apiUrls?.ProjectMasterUpdate, form, { headers })
      axiosInstances
        .post(apiUrls?.ProjectMasterUpdate, {
          ProjectID: Number(data?.Id || data?.ProjectID),
          TargetProjectID: Number(formData?.Project),
          ActionType: "CopyUserMapping",
          AccessType: String(formData?.AccessType),
        })
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            handleSearch();
            setLoading(false);
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleDeleteUserMapping = (ele) => {
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      form.append(
        "RoleID",
        useCryptoLocalStorage("user_Data", "get", "RoleID")
      ),
      form.append(
        "LoginName",
        useCryptoLocalStorage("user_Data", "get", "realname")
      ),
      form.append("ProjectID", data?.Id || data?.ProjectID),
      form.append("EmployeeID", ele?.Employee_ID),
      form.append("ActionType", "DeleteUserMapping"),
      axios
        .post(apiUrls?.ProjectMasterUpdate, form, { headers })
        .then((res) => {
          if (res?.data?.status === true) {
            toast.success(res?.data?.message);
            handleSearch();
            setLoading(false);
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
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
  const [selectAll, setSelectAll] = useState(false);
  const handleCheckBox = (e, index) => {
    const { name, checked } = e?.target;

    if (name === "selectAll") {
      // Handle Select All for CURRENT page
      const updatedData = tableData.map((item, idx) => {
        const isOnCurrentPage =
          idx >= (currentPage - 1) * rowsPerPage &&
          idx < currentPage * rowsPerPage;

        return isOnCurrentPage ? { ...item, remove: checked } : item;
      });

      setTableData(updatedData);
      setSelectAll(checked);
    } else if (name === "remove") {
      // Get actual index in full tableData
      const globalIndex = (currentPage - 1) * rowsPerPage + index;
      const data = [...tableData];

      data[globalIndex][name] = checked;
      setTableData(data);

      // Check if all rows in current page are selected
      const currentPageData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );

      const allChecked = currentPageData.every((item) => item.remove);
      setSelectAll(allChecked);
    }
  };
  const userVSprojectTHEAD = [
    "S.No.",
    "User Name",
    <label style={{ alignItems: "center" }}>
      <input
        type="checkbox"
        name="selectAll"
        checked={selectAll}
        onChange={handleCheckBox}
      />{" "}
      &nbsp;All
    </label>,
  ];
  const handleDeleteSelected = () => {
    setLoading(true);
    const selectedIds = tableData
      .filter((row) => row.remove)
      .map((row) => row.Employee_ID);

    if (selectedIds.length === 0) {
      toast.error("Please select at least one row to delete.");
      setLoading(false);
      return;
    }
    const form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "RoleID",
    //     useCryptoLocalStorage("user_Data", "get", "RoleID")
    //   ),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ProjectID", data?.Id || data?.ProjectID),
    //   form.append("EmployeeID", selectedIds.join(",")),
    //   form.append("ActionType", "DeleteUserMapping"),
      // axios
      //   .post(apiUrls?.ProjectMasterUpdate, form, { headers })
      axiosInstances
        .post(apiUrls?.ProjectMasterUpdate, {
          ProjectID: Number(data?.Id || data?.ProjectID),
          EmployeeID: Number(selectedIds.join(",")),
          ActionType:"DeleteUserMapping"
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
          setLoading(false);
        });
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
    getReporter();
    handleSearch();
    getProject();
  }, []);
  return (
    <>
      {visible?.deleteVisible && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header="Delete UserMappingList"
        >
          <UserDeleteModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}

      <div className="card  p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {data?.NAME || data?.ProjectName}
        </span>
      </div>
      <div className="card  border mt-2">
        <Heading title="User Mapping" />
        <div className="row g-4 m-2">
          <div className="col-sm-6 d-flex">
            <ReactSelect
              name="User"
              respclass="col-xl-5 col-md-4 col-sm-6 col-12"
              placeholderName="User"
              dynamicOptions={reporter}
              value={formData?.User}
              handleChange={handleDeliveryChange}
            />
            {loading ? (
              <Loading />
            ) : (
              <button
                className="btn btn-sm btn-success ml-3"
                onClick={handleAddUserMapping}
              >
                Add User
              </button>
            )}
          </div>
          <div className="col-sm-6 d-flex">
            <ReactSelect
              name="Project"
              respclass="col-xl-5 col-md-4 col-sm-6 col-12"
              placeholderName="Project"
              dynamicOptions={project}
              value={formData?.Project}
              handleChange={handleDeliveryChange}
            />

            <ReactSelect
              name="AccessType"
              respclass="col-xl-3 col-md-4 col-sm-6 col-12"
              placeholderName="AccessType"
              dynamicOptions={[
                { label: "Full", value: "90" },
                { label: "Module Wise", value: "80" },
              ]}
              value={formData?.AccessType}
              handleChange={handleDeliveryChange}
            />
            {loading ? (
              <Loading />
            ) : (
              <button
                className="btn btn-sm btn-success ml-3"
                onClick={handleCopyUserMapping}
              >
                Copy User Mapping
              </button>
            )}
          </div>
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card patient_registration_card mt-3 my-2">
          <Heading
            title="Search Details"
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
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <span style={{ fontWeight: "bold" }}>
                  Total Record :&nbsp;{tableData?.length}
                </span>
              </div>
            }
          />
          <Tables
            thead={userVSprojectTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              "User Name": ele?.EmployeeName,
              Remove: (
                <input
                  type="checkbox"
                  name="remove"
                  checked={
                    tableData[(currentPage - 1) * rowsPerPage + index]
                      ?.remove || false
                  }
                  onChange={(e) => handleCheckBox(e, index)}
                />
              ),
            }))}
            tableHeight={"tableHeight"}
          />
          <div className="pagination ml-auto" style={{ float: "right" }}>
            <button
              className="btn btn-sm btn-primary ml-auto"
              style={{ marginRight: "186px" }}
              onClick={handleDeleteSelected}
            >
              Delete
            </button>
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

export default UserMapping;
