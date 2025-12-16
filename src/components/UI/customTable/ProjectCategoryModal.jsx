import React, { useEffect, useState } from "react";
import ReactSelect from "../../formComponent/ReactSelect";
import axios from "axios";
import { headers } from "../../../utils/apitools";
import { toast } from "react-toastify";
import Tables from ".";
import { categoryTHEAD } from "../../modalComponent/Utils/HealperThead";
import MultiSelectComp from "../../formComponent/MultiSelectComp";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";
const ProjectCategoryModal = (visible) => {
  console.log(visible);
  const [category, setCategory] = useState([]);
  const [formData, setFormData] = useState({
    ProjectCategory: [],
  });
  const [tableData, setTableData] = useState([]);

  const getProject = () => {
    axiosInstances
      .post(apiUrls.GetProjectCategory, {})
      .then((res) => {
        const verticals = res?.data.data.map((item) => {
          return { name: item?.NAME, code: item?.ID };
        });
        setCategory(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function getlabel(id, dropdownData) {
    console.log(id);
    const labels = id
      .map((id) => {
        const ele = dropdownData?.find((item) => item.code == id);
        return ele ? ele.name : "";
      })
      .filter((label) => label);
    return labels.join(", ");
  }

  const handleProjectCreate = () => {
   
    axiosInstances
      .post(apiUrls.CreateProjectCategory, {
        ProjectID: String(visible?.Data?.ProjectID),
        Category: String(getlabel(formData?.ProjectCategory, category)),
      })
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    setTableData([...tableData, ...visible?.Data?.showData]);
  }, []);
  console.log(visible?.showData?.showData);
  useEffect(() => {
    getProject();
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
  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };
  return (
    <>
      <div className="card border p-2">
        <div className="row">
          {/* <ReactSelect
            respclass="col-md-4 col-12 col-sm-12"
            name="ProjectCategory"
            placeholderName="Project Category"
            dynamicOptions={cateory}
            handleChange={handleDeliveryChange}
            value={formData.ProjectCategory}
          /> */}
          <MultiSelectComp
            respclass="col-md-4 col-12 col-sm-12"
            name="ProjectCategory"
            placeholderName="Category"
            dynamicOptions={category}
            optionLabel="ProjectCategory"
            className="ProjectCategory"
            handleChange={handleMultiSelectChange}
            value={formData.ProjectCategory.map((code) => ({
              code,
              name: category.find((item) => item.code === code)?.name,
            }))}
          />
          <div className="col=2">
            <button
              className="btn btn-sm btn-success"
              onClick={handleProjectCreate}
            >
              Create
            </button>
          </div>
        </div>
        <Tables
          thead={categoryTHEAD}
          tbody={currentData?.map((ele, index) => ({
            "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
            "Project Name": ele?.NAME,
          }))}
          tableHeight={"tableHeight"}
        />
        <div className="pagination ml-auto" style={{ float: "right" }}>
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
    </>
  );
};
export default ProjectCategoryModal;
