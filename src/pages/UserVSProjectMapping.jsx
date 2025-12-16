import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import ReactSelect from "../components/formComponent/ReactSelect";
import Tables from "../components/UI/customTable";
import Modal from "../components/modalComponent/Modal";
import TransferProjectModal from "../components/UI/customTable/TransferProjectModal";
import axios from "axios";
import { headers } from "../utils/apitools";
import { apiUrls } from "../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import Input from "../components/formComponent/Input";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import { useTranslation } from "react-i18next";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

const UserVSProjectMapping = () => {
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
    Project: [],
    // Project: "",
    AccessType: "90",
    remove: "",
  });
  const [t] = useTranslation();
  const getReporter = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("RoleID", useCryptoLocalStorage("user_Data", "get", "RoleID")),
    //   form.append("IsMaster", "1"),
    //   axios
    //     .post(apiUrls?.Reporter_Select, form, { headers })
    axiosInstances
      .post(apiUrls.Reporter_Select, {
        ID: useCryptoLocalStorage("user_Data", "get", "ID"),
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
        IsMaster: "1",

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
  const getUserVsProject_Select = (value) => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("RoleID", useCryptoLocalStorage("user_Data", "get", "RoleID")),
    //   form.append("UserID", value || formData?.User),
    //   axios
    //     .post(apiUrls?.UserVsProject_Select, form, { headers })
    axiosInstances
      .post(apiUrls.UserVsProject_Select,{
        
      })
        .then((res) => {
          const dadadata = res?.data?.data;
          setTableData(dadadata);
          setFilteredData(dadadata);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name == "User") {
      setFormData({ ...formData, [name]: value });
      getUserVsProject_Select(value);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [visible, setVisible] = useState({
    showVisible: false,
    showData: {},
  });
  useEffect(() => {
    getReporter();
    getProject();
  }, []);

  const getProject = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname")),
    //   form.append("IsMaster", "1"),
    //   axios
    //     .post(apiUrls?.ProjectSelect, form, { headers })
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
        LoginName: useCryptoLocalStorage("user_Data", "get", "realname"),
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { name: item?.Project, code: item?.ProjectId };
        });
        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleusermapping = () => {
    setLoading(true);
    if (formData?.User == "") {
      toast.error("Please Select User.");
      setLoading(false);
    } else if (formData?.Project == "") {
      toast.error("Please Select Project.");
      setLoading(false);
    } else {
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname")),
      //   form.append("UserID", formData?.User),
      //   form.append("Status", "Add"),
      //   form.append("TargetUserID", ""),
      //   form.append("ProjectID", formData?.Project),
      //   form.append("AccessType", formData?.AccessType),
      //   axios
      //     .post(apiUrls?.UserVsProjectMapping, form, { headers })
      axiosInstances.post(apiUrls.UserVsProjectMapping, {
        Status: formData?.Status || "Add",
        TargetUserID: formData?.User || 0,
        AccessType: formData?.AccessType || "",
        ProjectIDs: Array.isArray(formData?.Project)
          ? formData?.Project   
          : [formData?.Project] 
      })
        .then((res) => {
          if (res?.data.success) {
            toast.success(res?.data?.message);
            setLoading(false);
            formData?.User && getUserVsProject_Select();
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

  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };
  const handleTransferClick = () => {
    if (!formData?.User) {
      toast.error("Please Select User.");
      return;
    }
    setVisible({
      showVisible: true,
      showData: { formData, tableData },
    });
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
    { name: "S.No.", width: "10%" },
    "ProjectID",
    "Project Name",
    { name: "AccessType", width: "10%" },
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
    // Get selected ProjectIDs
    const selectedIds = tableData
      .filter((row) => row.remove)
      .map((row) => row.ProjectID);

    if (selectedIds.length === 0) {
      toast.error("Please select at least one row to delete.");
      setLoading(false);
      return;
    }
    // const form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname")),
    //   form.append("UserID", formData?.User),
    //   form.append("ProjectID", selectedIds.join(",")),
    //   axios
    //     .post(apiUrls?.Remove_UserVsProjectMapping, form, { headers })
    axiosInstances
      .post(apiUrls.Remove_UserVsProjectMapping, {
         ProjectIDs: selectedIds?.length > 0 ? selectedIds : [0], 
      })
        .then((res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setLoading(false);
            formData?.User && getUserVsProject_Select();
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
  return (
    <>
      <Modal
        modalWidth={"600px"}
        visible={visible?.showVisible}
        setVisible={setVisible}
        tableData={formData}
        userData={tableData}
        Header="Transfer Project Modal"
      >
        <TransferProjectModal
          visible={visible?.showVisible}
          setVisible={setVisible}
          tableData={formData}
          userData={tableData}
        />
      </Modal>
      <div className="card  border mt-2">
        <Heading
          title={
            <span style={{ fontWeight: "bold" }}>
              Mantis User Vs Project Mapping
            </span>
          }
        />
        <div className="row g-4 m-2">
          <ReactSelect
            name="User"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="User"
            dynamicOptions={reporter}
            value={formData?.User}
            handleChange={handleDeliveryChange}
          />

          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Project"
            placeholderName={t("Project")}
            dynamicOptions={project}
            optionLabel="Project"
            className="Project"
            handleChange={handleMultiSelectChange}
            value={formData?.Project?.map((code) => ({
              code,
              name: project.find((item) => item.code === code)?.name,
            }))}
          />
          <ReactSelect
            name="AccessType"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="AccessType"
            dynamicOptions={[
              { label: "Full", value: "90" },
              { label: "Module Wise", value: "80" },
            ]}
            value={formData?.AccessType}
            handleChange={handleDeliveryChange}
          />
          <div className="col-3 col-sm-4 d-flex">
            <button
              className="btn btn-sm btn-success"
              onClick={handleusermapping}
            >
              Add Project
            </button>

            <button
              className="btn btn-sm btn-success ml-3"
              // onClick={handleTransferClick}
              onClick={() => {
                setVisible({
                  showVisible: true,
                  showData: { formData, tableData },
                });
              }}
            >
              Transfer Project
            </button>
          </div>
        </div>
      </div>

      {tableData?.length > 0 ? (
        <div className="card patient_registration_card mt-3 my-2">
          <Heading
            title={<span style={{ fontWeight: "bold" }}>Search Details</span>}
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
            thead={userVSprojectTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              ProjectID: ele?.ProjectID,
              "Project Name": ele?.ProjectName,
              AccessType: ele?.AccessType === 90 ? "Full" : "Module Wise",

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
          <div className="pagination ml-auto">
            <button
              className="btn btn-sm btn-primary"
              style={{ marginRight: "55px" }}
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
      ) : (
        <NoRecordFound />
      )}
    </>
  );
};

export default UserVSProjectMapping;
