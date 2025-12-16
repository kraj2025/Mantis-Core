import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { toast } from "react-toastify";
import Input from "../components/formComponent/Input";
import Loading from "../components/loader/Loading";
import Tables from "../components/UI/customTable";
import { centreTHEAD } from "../components/modalComponent/Utils/HealperThead";
import Modal from "../components/modalComponent/Modal";
import CentreDeleteModal from "./CentreDeleteModal";
import Heading from "../components/UI/Heading";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const CentreModuleModal = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [formData, setFormData] = useState({
    CentreName: "",
    CentreID: "",
  });
  const [editMode, setEditMode] = useState(false);
  const handleSelectChange = (e) => {
    const { name, value } = e?.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAdd = () => {
    setLoading(true);

    axiosInstances
      .post(apiUrls?.ProjectMasterUpdate, {
        ProjectID: String(data?.Id || data?.ProjectID),
        Centre: String(formData?.CentreName),
        ActionType: "InsertCentre",
      })
      .then((res) => {
        toast.success(res?.data?.message);
        handleSearch();
        setFormData({ CentreName: "" });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    axiosInstances
      .post(apiUrls?.getViewProject, {
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
        ProjectID: Number(data?.Id || data?.ProjectID),
        Title: "Centre",
      })
      .then((res) => {
        setTableData(res?.data?.data);
        setFilteredData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleUpdate = () => {
    setLoading(true);

    axiosInstances;
    post(apiUrls?.ProjectMasterUpdate, {
      ProjectID: data?.Id || data?.ProjectID,
      Centre: formData?.CentreName,
      CentreID: formData?.CentreID,
      ActionType: "UpdateCentre",
    })
      .then((res) => {
        toast.success(res?.data?.message);
        handleSearch();
        setFormData({ CentreName: "" });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleBillingEdit = (ele) => {
    setFormData({
      ...formData,
      CentreName: ele?.Centre,
      ProjectID: ele?.ProjectID,
      CentreID: ele?.ID,
    });
    setEditMode(true);
  };

  // useEffect(() => {
  //   setTableData([...tableData, ...showData?.tableData]);
  // }, []);
  // console.log(showData?.tableData);

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

  const [visible, setVisible] = useState({
    deleteVisible: false,
    showData: {},
  });

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
  const centreTHEAD = [
    "S.No.",
    "Centre Name",
    "Action",
    // <i
    //   className="fa fa-trash"
    //   style={{
    //     color: "red",
    //     cursor: "pointer",
    //   }}
    //   onClick={() => {
    //     setVisible({
    //       deleteVisible: true,
    //       showData: tableData,
    //       data: data,
    //     });
    //   }}
    //   title="Click to Delete All."
    // ></i>,
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
      .map((row) => row.ID);

    if (selectedIds.length === 0) {
      toast.error("Please select at least one row to delete.");
      setLoading(false);
      return;
    }
    // const form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "RoleID",
    //     useCryptoLocalStorage("user_Data", "get", "RoleID")
    //   ),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("ProjectID", data?.Id),
    //   form.append("CentreID", selectedIds.join(",")),
    //   axios
    //     .post(apiUrls?.CentreRemoveProject, form, { headers })
    axiosInstances
      .post(apiUrls?.CentreRemoveProject, {
        ProjectID: data?.Id,
        CentreID: selectedIds.join(","),
      })
      .then((res) => {
        if (res?.data?.status === true) {
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
  return (
    <>
      {visible?.deleteVisible && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header="Delete CentreList"
        >
          <CentreDeleteModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      <div className="card  p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {data?.NAME || data?.ProjectName}
        </span>
      </div>
      <div className="card">
        <div className="row m-2">
          <Input
            type="text"
            className="form-control"
            id="CentreName"
            name="CentreName"
            lable="Centre"
            onChange={handleSelectChange}
            value={formData?.CentreName}
            respclass="col-xl-2 col-md-2 col-12 col-sm-12"
          />
          {loading ? (
            <Loading />
          ) : (
            <div className="col-2">
              {editMode ? (
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={handleAdd}
                >
                  Create
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {tableData?.length > 0 ? (
        <div className="card">
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
            thead={centreTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              CentreName: ele?.Centre,
              Action: (
                <i
                  className="fa fa-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleBillingEdit(ele)}
                ></i>
              ),
              Remove: (
                // <i
                //   className="fa fa-remove"
                //   style={{ color: "red" }}
                //   onClick={() => {
                //     handleCentreRemove(ele);
                //   }}
                // >
                //   X
                // </i>
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
              style={{ marginRight: "83px" }}
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

export default CentreModuleModal;
