import React, { useEffect, useState } from "react";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../utils/apitools";
import axios from "axios";
import Loading from "../../components/loader/Loading";
import Heading from "../../components/UI/Heading";
import Tables from "../../components/UI/customTable";
import { toast } from "react-toastify";
import MultiSelectComp from "../../components/formComponent/MultiSelectComp";
import Input from "../../components/formComponent/Input";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";

const ProjectMappingModal = (ele) => {
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    Project: [],
    RoleMaster: "",
    AccessType: "90",
  });
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getProject = () => {
    // let form = new FormData();
    // form.append("ID",  useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname")),
    //   form.append("IsMaster", "1"),
    //   axios
    //     .post(apiUrls?.ProjectSelect, form, { headers })
    axiosInstances
      .post(apiUrls?.ProjectSelect, {
        ProjectID: 0,
        IsMaster: "",
        VerticalID: 0,
        TeamID: 0,
        WingID: 0,
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
  const handleSearch = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append(
    //   "LoginName",
    //   useCryptoLocalStorage("user_Data", "get", "realname")
    // );
    // form.append("UserID", ele?.visible?.showData?.id);
    // axios
    //   .post(apiUrls?.UserVsProject_Select, form, {
    //     headers,
    //   })
    axiosInstances
      .post(apiUrls?.UserVsProject_Select, {})
      .then((res) => {
        const data = res?.data?.data;
        setTableData(data);
        setFilteredData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 1000;
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
  const handleusermapping = () => {
    setLoading(true);
    const selectedIds = tableData
      .filter((row) => row.remove)
      .map((row) => row.ProjectID);

    if (formData?.Project == "") {
      toast.error("Please Select Project.");
      setLoading(false);
    } else if (formData?.AccessType == "") {
      toast.error("Please Select AccessType.");
      setLoading(false);
    } else {
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("UserID", ele?.visible?.showData?.id),
      //   form.append("Status", "Add"),
      //   form.append("TargetUserID", ""),
      //   form.append("ProjectID", formData?.Project),
      //   form.append("AccessType", formData?.AccessType),
      //   axios
      //     .post(apiUrls?.UserVsProjectMapping, form, { headers })
      axiosInstances
        .post(apiUrls?.UserVsProjectMapping, {
          AccessType: String(formData?.AccessType),
          // ProjectIDs: (formData?.Project).join(","),
          ProjectIDs: formData?.Project,
          Status: "Add",
          TargetUserID: Number("0"),
        })
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setFormData({ ...formData, Project: [] });
            handleSearch();
            setLoading(false);
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

  useEffect(() => {
    getProject();
    handleSearch();
  }, []);
  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };

  const [selectAll, setSelectAll] = useState(false);

  const handleCheckBox = (e, index) => {
    const { name, checked } = e?.target;
    if (name === "selectAll") {
      const updatedData = tableData.map((item, idx) => {
        const isOnCurrentPage =
          idx >= (currentPage - 1) * rowsPerPage &&
          idx < currentPage * rowsPerPage;
        return isOnCurrentPage ? { ...item, remove: checked } : item;
      });

      setTableData(updatedData);
      setSelectAll(checked);
    } else if (name === "remove") {
      const globalIndex = (currentPage - 1) * rowsPerPage + index;
      const data = [...tableData];
      data[globalIndex][name] = checked;
      setTableData(data);
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
    "ProjectID",
    "Project Name",
    "AccessType",
    <label style={{ alignItems: "center" }}>
      <input
        type="checkbox"
        name="selectAll"
        checked={selectAll}
        onChange={handleCheckBox}
      />
      &nbsp;All
    </label>,
  ];

  const handleDeleteSelected = () => {
    setLoading(true);
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
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("UserID", ele?.visible?.showData?.id),
    //   form.append("ProjectID", selectedIds.join(",")),
    //   axios
    //     .post(apiUrls?.Remove_UserVsProjectMapping, form, { headers })
    axiosInstances
      .post(apiUrls?.Remove_UserVsProjectMapping, {
        ProjectIDs: selectedIds.map((id) => Number(id)),
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

  // useEffect(() => {
  //   const startIdx = (currentPage - 1) * rowsPerPage;
  //   const endIdx = currentPage * rowsPerPage;
  //   const currentPageData = tableData.slice(startIdx, endIdx);
  //   const allChecked = currentPageData.every((item) => item.remove);

  //   setSelectAll(allChecked);
  // }, [currentPage, tableData]);
  return (
    <>
      <div className="card p-2">
        <span style={{ fontWeight: "bold" }}>
          Employee Name: &nbsp; {ele?.visible?.showData?.realname}
        </span>
      </div>
      <div className="card p-2">
        <div className="row">
          {/* <ReactSelect
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          name="Project"
          placeholderName="Project"
          dynamicOptions={project}
          handleChange={handleDeliveryChange}
          value={formData.Project}
        /> */}
          <MultiSelectComp
            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
            name="Project"
            placeholderName="Project"
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
            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
            placeholderName="AccessType"
            dynamicOptions={[
              { label: "Full", value: "90" },
              { label: "Module Wise", value: "80" },
            ]}
            value={formData?.AccessType}
            handleChange={handleDeliveryChange}
          />
          <div className="col-2">
            {loading ? (
              <Loading />
            ) : (
              <button
                className="btn btn-sm btn-success"
                onClick={handleusermapping}
              >
                Add Project
              </button>
            )}
          </div>
        </div>
      </div>
      {tableData?.length > 0 ? (
        <div
          className="card patient_registration_card mt-3 my-2"
          style={{ height: "350px" }}
        >
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

            <button
              className="btn btn-sm btn-primary ml-auto"
              style={{ marginRight: "145px" }}
              onClick={handleDeleteSelected}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <NoRecordFound />
      )}
    </>
  );
};

export default ProjectMappingModal;
