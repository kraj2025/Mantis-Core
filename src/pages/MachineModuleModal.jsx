import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import Input from "../components/formComponent/Input";
import ReactSelect from "../components/formComponent/ReactSelect";
import Loading from "../components/loader/Loading";
import Tables from "../components/UI/customTable";
import { machineTHEAD } from "../components/modalComponent/Utils/HealperThead";
import DatePicker from "../components/formComponent/DatePicker";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Modal from "../components/modalComponent/Modal";
import MachineDeleteModal from "./MachineDeleteModal";
import Heading from "../components/UI/Heading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const MachineModuleModal = ({ data }) => {
  console.log("dataa", data);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    MachineName: "",
    MachineID: "",
    InterfaceType: "",
    LiveStatus: "",
    AfterLiveStatus: "",
    MIType: "",
    MotherBoardID: "",
    LiveDate: "",
    IsActive: "",
  });
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const AddMachine = () => {
    if (formData?.MachineName == "") {
      toast.error("Please Enter Machine Name.");
    } else {
      setLoading(true);
      const formDataJson = JSON.stringify([
        {
          MachineName: formData?.MachineName,
          InterfaceType: formData?.InterfaceType,
          LiveStatus: formData?.LiveStatus || "0",
          AfterLiveStatus: formData?.AfterLiveStatus || "0",
          MIType: formData?.MIType,
          MachineID: formData?.MachineID,
          MotherBoardID: formData?.MotherBoardID,
          LiveDate: formData?.LiveDate
            ? formatDate(formData.LiveDate)
            : "1970-01-01",
          QuoteNo: "",
        },
      ]);
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("ProjectID", data?.Id || data?.ProjectID || data?.Id),
      //   form.append("ActionType", "InsertMachine"),
      //   form.append("ProjectData", formDataJson),
      //   axios
      // .post(apiUrls?.ProjectMasterUpdate, form, { headers })
      const payload = {
        ProjectID: Number(data?.Id || data?.ProjectID || data?.Id),
        ActionType: "InsertMachine",
        MachineName: formData?.MachineName ? String(formData.MachineName) : "",
        InterfaceType: formData?.InterfaceType
          ? String(formData.InterfaceType)
          : "",
        LiveStatus: formData?.LiveStatus ? String(formData.LiveStatus) : "0",
        AfterLiveStatus: formData?.AfterLiveStatus
          ? String(formData.AfterLiveStatus)
          : "0",
        MIType: formData?.MIType ? String(formData.MIType) : "",
        MachineID: formData?.MachineID ? Number(formData.MachineID) : 0,
        MotherBoardID: formData?.MotherBoardID
          ? Number(formData.MotherBoardID)
          : 0,
        LiveDate: formData?.LiveDate
          ? formatDate(formData.LiveDate)
          : "1970-01-01",
        QuoteNo: "", // always a string
      };

      axiosInstances
        .post(apiUrls?.ProjectMasterUpdate, payload)
        .then((res) => {
          if (res?.data?.success == true) {
            toast.success(res?.data?.message);
            handleSearch();
            setLoading(false);
            setFormData({
              ...formData,
              MachineName: "",
              MachineID: "",
              InterfaceType: "",
              LiveStatus: "",
              AfterLiveStatus: "",
              MIType: "",
              MotherBoardID: "",
              LiveDate: "",
              IsActive: "",
            });
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
  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const handleUpdate = () => {
    setLoading(true);
    const formDataJson = JSON.stringify([
      {
        MachineName: formData?.MachineName,
        InterfaceType: formData?.InterfaceType,
        LiveStatus: formData?.LiveStatus || "0",
        AfterLiveStatus: formData?.AfterLiveStatus || "0",
        MIType: formData?.MIType,
        MachinePrimaryID: formData?.MachinePrimaryID,
        MachineID: formData?.MachineID,
        MotherBoardID: formData?.MotherBoardID,
        LiveDate: formData?.LiveDate
          ? formatDate(formData.LiveDate)
          : "1970-01-01",
        QuoteNo: "",
        IsActive: formData?.IsActive,
      },
    ]);
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      form.append(
        "LoginName",
        useCryptoLocalStorage("user_Data", "get", "realname")
      ),
      form.append(
        "ProjectID",
        formData?.ProjectID || data?.ProjectID || data?.Id
      ),
      form.append("ActionType", "UpdateMachine"),
      form.append("ProjectData", formDataJson),
      axios
        .post(apiUrls?.ProjectMasterUpdate, form, { headers })
        .then((res) => {
          if (res?.data?.status === true) {
            toast.success(res?.data?.message);
            handleSearch();
            setLoading(false);
            setEditMode(false);
            setFormData({
              ...formData,
              MachineName: "",
              MachineID: "",
              InterfaceType: "",
              LiveStatus: "",
              AfterLiveStatus: "",
              MIType: "",
              MotherBoardID: "",
              LiveDate: "",
              IsActive: "",
            });
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
  // useEffect(() => {
  //   setTableData([...tableData, ...visible?.showData?.showData]);
  // }, []);
  const handleSearch = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname") ),
    //   form.append("ProjectName", data?.NAME || data?.ProjectName);
    // form.append("ProjectID", data?.Id || data?.ProjectID);
    // form.append("Title", "Machine");
    // axios
    //   .post(apiUrls?.getViewProject, form, { headers })
    axiosInstances
      .post(apiUrls?.getViewProject, {
        ProjectName:String(data?.NAME || data?.ProjectName),
        ProjectID: Number(data?.Id || data?.ProjectID),
        Title: "Machine",
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

  const handleEditMachine = (ele) => {
    // console.log("ele", ele);
    setFormData({
      ...formData,
      MachineName: ele?.MachineName,
      InterfaceType: ele?.InterfaceType,
      LiveStatus: ele?.LiveStatus,
      AfterLiveStatus: ele?.AfterLiveStatus,
      MIType: ele?.MIType,
      MachineID: ele?.MachineID,
      ProjectID: ele?.ProjectID,
      MachinePrimaryID: ele?.ID,
      MotherBoardID: ele?.MotherboardID,
      LiveDate: ele?.LiveDate == null ? "" : new Date(ele?.Livedate),
      IsActive: ele?.IsActive,
    });
    setEditMode(true);
  };

  const [t] = useTranslation();

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

  const machineTHEAD = [
    "S.No.",
    "Machine Name",
    "InterfaceType",
    "Date",
    "LiveStatus",
    "AfterLiveStatus",
    "QtType",
    <label style={{ alignItems: "center" }}>
      <input
        type="checkbox"
        name="selectAll"
        checked={selectAll}
        onChange={handleCheckBox}
      />{" "}
      &nbsp;All
    </label>,
    "Action",
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
    const form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      form.append(
        "LoginName",
        useCryptoLocalStorage("user_Data", "get", "realname")
      ),
      form.append("ProjectID", data?.Id || data?.ProjectID),
      form.append("ActionType", "DeleteMachine"),
      form.append("MachinePrimaryID", selectedIds.join(",")),
      axios
        .post(apiUrls?.ProjectMasterUpdate, form, { headers })
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
          Header="Delete MachineList"
        >
          <MachineDeleteModal visible={visible} setVisible={setVisible} />
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
            id="MachineName"
            name="MachineName"
            lable="Machine Name"
            onChange={handleSelectChange}
            value={formData?.MachineName}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="MachineID"
            name="MachineID"
            lable="Machine ID"
            onChange={handleSelectChange}
            value={formData?.MachineID}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="MotherBoardID"
            name="MotherBoardID"
            lable="MotherBoardID"
            onChange={handleSelectChange}
            value={formData?.MotherBoardID}
            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          />
          <ReactSelect
            name="InterfaceType"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="Interface Type"
            dynamicOptions={[
              { label: "Bi-Directional", value: "1" },
              { label: "Uni-Directional", value: "2" },
            ]}
            value={formData?.InterfaceType}
            handleChange={handleDeliveryChange}
          />
          <ReactSelect
            name="MIType"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="MI Type"
            dynamicOptions={[
              { label: "Against Quotation", value: "AgainstQuotation" },
              { label: "Against PO", value: "Against PO" },
            ]}
            value={formData?.MIType}
            handleChange={handleDeliveryChange}
          />
          <div className="search-col" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="LiveStatus"
                  checked={formData?.LiveStatus ? 1 : 0}
                  onChange={handleSelectChange}
                />
                <span className="slider"></span>
              </label>
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "5px",
                  fontSize: "12px",
                }}
              >
                {t("LiveStatus")}
              </span>
            </div>
          </div>
          {formData?.LiveStatus ? (
            <DatePicker
              className="custom-calendar"
              id="LiveDate"
              name="LiveDate"
              lable="Live Date"
              placeholder={VITE_DATE_FORMAT}
              value={formData?.LiveDate}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
              handleChange={handleSelectChange}
            />
          ) : (
            ""
          )}
          {/* <div
            className="search-col"
            style={{ marginLeft: "8px", display: "flex", marginRight: "auto" }}
          >
            {[
              { name: "LiveStatus", label: "LiveStatus" },
              { name: "AfterLiveStatus", label: "AfterLiveStatus" },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: idx !== 0 ? "30px" : "0px",
                }}
              >
                <label className="switch" style={{ marginTop: "7px" }}>
                  <input
                    type="checkbox"
                    name={item?.name}
                    checked={formData[item?.name]}
                    onChange={handleSelectChange}
                  />
                  <span className="slider"></span>
                </label>
                <span
                  style={{
                    marginLeft: "3px",
                    marginRight: "5px",
                    fontSize: "12px",
                  }}
                >
                  {item?.label}
                </span>
              </div>
            ))}

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
                    onClick={AddMachine}
                  >
                    Create
                  </button>
                )}
              </div>
            )}
          </div> */}
          <div className="search-col" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="AfterLiveStatus"
                  checked={formData?.AfterLiveStatus ? 1 : 0}
                  onChange={handleSelectChange}
                />
                <span className="slider"></span>
              </label>
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "5px",
                  fontSize: "12px",
                }}
              >
                {t("AfterLiveStatus")}
              </span>
            </div>
          </div>
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
                  onClick={AddMachine}
                >
                  Create
                </button>
              )}
            </div>
          )}
        </div>{" "}
      </div>
      {tableData?.length > 0 && (
        <div className="card mt-3">
          <>
            <Heading
              title={<span style={{ fontWeight: "bold" }}>Search Details</span>}
              secondTitle={
                <div className="d-flex">
                  <div
                    style={{ padding: "0px !important", marginLeft: "10px" }}
                  >
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
              thead={machineTHEAD}
              tbody={currentData?.map((ele, index) => ({
                "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
                "Machine Name": ele?.MachineName,
                InterfaceType:
                  (ele?.InterfaceType == 1 && "Bi-Directional") ||
                  (ele?.InterfaceType == 2 && "Uni-Directional"),
                Date: ele?.Livedate,
                LiveStatus: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                      <input
                        type="checkbox"
                        name="LiveStatus"
                        checked={ele?.LiveStatus == "1" ? true : false}
                        onChange={handleSelectChange}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                ),
                AfterLiveStatus: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                      <input
                        type="checkbox"
                        name="AfterLiveStatus"
                        checked={ele?.AfterLiveStatus == "1" ? true : false}
                        onChange={handleSelectChange}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                ),
                QtType: ele?.MIType,
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
                Action: (
                  <i
                    className="fa fa-edit"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditMachine(ele)}
                  ></i>
                ),
              }))}
              tableHeight={"tableHeight"}
            />
            <div className="pagination ml-auto">
              <button
                className="btn btn-sm btn-primary"
                style={{ marginRight: "25px" }}
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
          </>
        </div>
      )}
    </>
  );
};

export default MachineModuleModal;
