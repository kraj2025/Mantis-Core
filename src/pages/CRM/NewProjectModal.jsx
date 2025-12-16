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
import ReactSelect from "../../components/formComponent/ReactSelect";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";

const NewProjectModal = ({ setVisible }) => {
  const [formData, setFormData] = useState({
    ProjectName: "",
    VerticalID: "",
    TeamID: "",
    WingID: "",
    UserName: "",
    Password: "",
  });
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [editMode, setEditMode] = useState(false);
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

  const handleNewProject = () => {
    if (!formData?.ProjectName) {
      toast.error("Please Enter Project Name.");
      return;
    }
    setLoading(true);
    const payload = {
      UserName: formData?.UserName ? String(formData.UserName) : "",
      VerticalID: formData?.VerticalID ? Number(formData.VerticalID) : 0,
      TeamID: formData?.TeamID ? Number(formData.TeamID) : 0,
      WingID: formData?.WingID ? Number(formData.WingID) : 0,
      VerticalName: getlabel(formData?.VerticalID, vertical) || "",
      TeamName: getlabel(formData?.TeamID, team) || "",
      WingName: getlabel(formData?.WingID, wing) || "",
      ProjectName: formData?.ProjectName ? String(formData.ProjectName) : "",
      Password: formData?.Password ? String(formData.Password) : "",
    };
    axiosInstances
      .post(apiUrls?.CreateProject, payload)
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          // setVisible(false);
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

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
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
  const handleBillingEdit = (ele) => {
    // console.log("editdetails", ele);
    setFormData({
      ...formData,
      CentreName: ele?.Centre,
      ProjectID: ele?.ProjectID,
      CentreID: ele?.ID,
    });
    setEditMode(true);
  };
  const getVertical = () => {
    axiosInstances
      .post(apiUrls?.Vertical_Select, {})
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
  const getTeam = () => {
    axiosInstances
      .post(apiUrls?.Team_Select, {})
      .then((res) => {
        const teams = res?.data.data.map((item) => {
          return { label: item?.Team, value: item?.TeamID };
        });
        setTeam(teams);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : undefined;
  }
  const getWing = () => {
    axiosInstances
      .post(apiUrls?.Wing_Select, {})
      .then((res) => {
        const wings = res?.data.data.map((item) => {
          return { label: item?.Wing, value: item?.WingID };
        });
        setWing(wings);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const ProjectTHEAD = [{ name: "S.No.", width: "10%" }, "Project Name"];
  const handleSearch = () => {
    axiosInstances
      .post(apiUrls?.ViewProject, {
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
        ProjectID: 0,
        ProjectName: "",
        VerticalID: "",
        TeamID: "",
        WingID: "",
        POC1: "",
        POC2: "",
        POC3: "",
        CategoryID: "",
        DateType: "",
        FromDate: "",
        ToDate: "",
        Status: "",
        IsExcel: "0",
      })
      .then((res) => {
        setTableData(res?.data?.data);
        setFilteredData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
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
    getTeam();
    getVertical();
    handleSearch();
    getWing();
  }, []);
  return (
    <>
      <div className="card ">
        <div className="row m-2">
          <Input
            type="text"
            className="form-control"
            id="ProjectName"
            name="ProjectName"
            lable="Project Name"
            onChange={handleSelectChange}
            value={formData?.ProjectName}
            respclass="col-xl-4 col-md-4 col-12 col-sm-12"
          />
          <ReactSelect
            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
            name="VerticalID"
            placeholderName="Vertical"
            dynamicOptions={vertical}
            handleChange={handleDeliveryChange}
            value={formData.VerticalID}
            // requiredClassName={"required-fields"}
          />

          <ReactSelect
            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
            name="TeamID"
            placeholderName="Team"
            dynamicOptions={team}
            handleChange={handleDeliveryChange}
            value={formData.TeamID}
            // requiredClassName={"required-fields"}
          />

          <ReactSelect
            respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-1"
            name="WingID"
            placeholderName="Wing"
            dynamicOptions={wing}
            handleChange={handleDeliveryChange}
            value={formData.WingID}
            // requiredClassName={"required-fields"}
          />
          <Input
            type="text"
            className="form-control mt-2"
            id="UserName"
            name="UserName"
            lable="User Name"
            onChange={handleSelectChange}
            value={formData?.UserName}
            respclass="col-xl-4 col-md-4 col-12 col-sm-12"
          />
          <Input
            type="password"
            className="form-control mt-2"
            id="Password"
            name="Password"
            lable="Password"
            onChange={handleSelectChange}
            value={formData?.Password}
            respclass="col-xl-4 col-md-4 col-12 col-sm-12"
          />

          {loading ? (
            <Loading />
          ) : (
            <div className="col-2">
              {editMode ? (
                <button
                  className="btn btn-sm btn-info ml-2"
                  //   onClick={handleUpdate}
                >
                  Update
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-info"
                  onClick={handleNewProject}
                >
                  Create
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {tableData?.length > 0 ? (
        <div className="card mt-2">
          <Heading
            title={"Search Details"}
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
            thead={ProjectTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              ProjetName: ele?.NAME,
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
export default NewProjectModal;
