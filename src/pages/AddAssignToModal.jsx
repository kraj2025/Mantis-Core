import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import ReactSelect from "../components/formComponent/ReactSelect";
import Tables from "../components/UI/customTable";
import Heading from "../components/UI/Heading";
import Loading from "../components/loader/Loading";
import { toast } from "react-toastify";
import Modal from "../components/modalComponent/Modal";
import TransferModuleModal from "../components/UI/customTable/TransferModuleModal";
import Input from "../components/formComponent/Input";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

const AddAssignToModal = ({ visible, setVisible }) => {
  const [tableData, setTableData] = useState([]);
  const tabVis = visible?.showData?.id;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignto, setAssignedto] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    User: "",
    AssignTo: [],
  });
  const [t] = useTranslation();
  const handleEditModule = (ele) => {
    setFormData({
      ...formData,
      ModuleName: ele?.ModuleID,
      IsActive: ele?.IsActive,
      ModuleID: ele?.ModuleID,
    });
    setEditMode(true);
  };
  const getAssignTo = () => {
    axiosInstances
      .post(apiUrls.AssignTo_Select, {})
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { name: item?.NAME, code: item?.ID };
        });
        setAssignedto(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }
  const handleSave = () => {
    if (formData?.ModuleName == "") {
      toast.error("Please Select Module");
    } else {
      setLoading(true);
      axiosInstances
        .post(apiUrls.CreateEmployeeModule, {
          EmployeeID: String(visible?.showData?.id),
          AssignToID: String(formData?.AssignTo),
          Status: String("Add"),
        })
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            getAssignToSearch();
            setLoading(false);
            setFormData((prev) => ({ ...prev, AssignTo: [] }));
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

  const getAssignToSearch = () => {
    axiosInstances
      .post(apiUrls.GetEmployeeModule, {
        EmployeeID: String(visible?.showData?.id),
      })
      .then((res) => {
        setTableData(res?.data?.data);
        setFilteredData(res?.data?.data);
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
  const [visibles, setVisibles] = useState({
    showVisible: false,
    showData: {},
  });

  const handleDeleteSelected = () => {
    setLoading(true);

    const selectedIds = tableData
      .filter((row) => row.remove)
      .map((row) => row.ModuleID);

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
      form.append("EmployeeID", visible?.showData?.id),
      form.append("AssignToID", selectedIds.join(",")),
      axios
        .post(apiUrls?.DeleteEmployeeModule, form, { headers })
        .then((res) => {
          if (res?.data?.status === true) {
            toast.success(res?.data?.message);
            setLoading(false);
            getAssignToSearch();
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
  const moduleTHEAD = [
    "S.No.",
    "Module Name",
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
  useEffect(() => {
    getAssignTo();
    // getAssignToSearch();
  }, []);
  return (
    <>
      <Modal
        modalWidth={"600px"}
        visible={visibles?.showVisible}
        setVisible={setVisibles}
        tableData={formData}
        userData={tableData}
        Header="Transfer Module"
      >
        <TransferModuleModal
          visible={visibles?.showVisible}
          setVisible={setVisibles}
          tableData={formData}
          userData={tableData}
        />
      </Modal>

      <div className="card p-2">
        <span style={{ fontWeight: "bold" }}>
          Employee Name: &nbsp; {visible?.showData?.realname}
        </span>
      </div>

      <div className="card p-2">
        <div className="row">
          <MultiSelectComp
            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
            name="AssignTo"
            placeholderName={t("AssignTo")}
            dynamicOptions={assignto}
            handleChange={handleMultiSelectChange}
            value={formData?.AssignTo?.map((code) => ({
              code,
              name: assignto.find((item) => item.code === code)?.name,
            }))}
          />

          {loading ? (
            <Loading />
          ) : (
            <div className="col-2">
              <button className="btn btn-sm btn-info ml-2" onClick={handleSave}>
                {t("Add AssignTo")}
              </button>
            </div>
          )}
          {/* <button
            className="btn btn-sm btn-primary ml-4"
            onClick={() => {
              setVisibles({
                showVisible: true,
                showData: { formData, tableData },
              });
            }}
          >
            Transfer Module
          </button> */}
        </div>
      </div>

      {/* {tableData?.length > 0 && (
        <div className="card mt-3">
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
            thead={moduleTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              "Module Name": ele?.ModuleName,

              Remove: (
                <input
                  type="checkbox"
                  name="remove"
                  checked={ele?.remove || false}
                  onChange={(e) => handleCheckBox(e, index)}
                />
              ),
            }))}
            tableHeight={"tableHeight"}
          />
          <div
            className="pagination"
            style={{ justifyContent: "space-between" }}
          >
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
            <div>
              <button
                className="btn btn-sm btn-primary"
                style={{ marginRight: "145px" }}
                onClick={handleDeleteSelected}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};
export default AddAssignToModal;
