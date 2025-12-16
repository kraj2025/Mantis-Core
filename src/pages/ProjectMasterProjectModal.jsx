import React, { useEffect, useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import Tables from "../components/UI/customTable";
import Heading from "../components/UI/Heading";
import { toast } from "react-toastify";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import Input from "../components/formComponent/Input";
import Loading from "../components/loader/Loading";
import Modal from "../components/modalComponent/Modal";
import CategoryDeleteModal from "./CategoryDeleteModal";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const ProjectMasterProjectModal = ({ data }) => {
  const ele = data;
  const [category, setCategory] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState([]);
  const [formData, setFormData] = useState({
    Category: "",
    Project: "",
  });

  const [visible, setVisible] = useState({
    deleteVisible: false,
    showData: {},
  });
  const getCategory = () => {
    
    axiosInstances
      .post(apiUrls?.Category_Select, {
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
        ProjectID: Number(ele?.Id || ele?.ProjectID),
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.NAME };
        });
        setCategory(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProject = () => {
      axiosInstances
        .post(apiUrls?.ProjectSelect, {
          ProjectID: 0,
          IsMaster: String("0"),
          VerticalID: 0,
          TeamID: 0,
          WingID: 0,
        })
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const CategoryAdd = () => {
 
    const payload = {
      ProjectID: Number(ele?.Id || ele?.ProjectID),
      ProjectName: String(formData?.Category),
      ActionType: "AddCategory",
    };
    axiosInstances
      .post(apiUrls?.ProjectMasterUpdate, payload)
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
  };

  const CategoryCopyMapping = () => {
    axiosInstances
      .post(apiUrls?.ProjectMasterUpdate, {
        ProjectID: Number(ele?.Id || ele?.ProjectID),
        TargetProjectID: String(formData?.Project),
        ActionType: "CopyCategoryMapping",
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
  };
  const handleSearch = () => {
    axiosInstances
      .post(apiUrls?.getViewProject, {
        ProjectID: Number(ele?.Id || ele?.ProjectID),
        Title: "Category",
      })
      .then((res) => {
        setTableData(res?.data?.data);
        setFilteredData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
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
  const newRoleTHEAD = [
    "S.No.",
    "Category Name",

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
      .map((row) => row.NAME);

    if (selectedIds.length === 0) {
      toast.error("Please select at least one row to delete.");
      setLoading(false);
      return;
    }
    const payload = {
      ProjectID: Number(ele?.Id || ele?.project_id),
      ProjectName: String(selectedIds.join(",")), 
      ActionType: "DeleteCategoryMapping", 
    };

    axiosInstances
      .post(apiUrls?.ProjectMasterUpdate, payload)
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
    getCategory();
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
          Header="Delete CategoryList"
        >
          <CategoryDeleteModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      <div className="card  p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {data?.NAME || data?.ProjectName}
        </span>
      </div>
      <div className="card">
        <div className="row m-2">
          <div className="col-sm-6 d-flex">
            <Input
              type="text"
              className="form-control"
              id="Category"
              name="Category"
              lable="Category Name"
              placeholder=" "
              onChange={handleSelectChange}
              value={formData?.Category}
              respclass="col-xl-5 col-md-4 col-sm-4 col-12"
            />

            <button
              className="btn btn-sm btn-success ml-3"
              onClick={CategoryAdd}
            >
              Add Category
            </button>
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
            {loading ? (
              <Loading />
            ) : (
              <button
                className="btn btn-sm btn-success ml-3"
                onClick={CategoryCopyMapping}
              >
                Category Mapping
              </button>
            )}
          </div>
        </div>
      </div>
      {tableData?.length > 0 ? (
        <div className="card mt-2">
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
            thead={newRoleTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              "Category Name": ele?.NAME,
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
          <div className="pagination ml-auto">
            <button
              className="btn btn-sm btn-primary"
              style={{ marginRight: "188px" }}
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

export default ProjectMasterProjectModal;
