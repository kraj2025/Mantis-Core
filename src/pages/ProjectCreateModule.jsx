
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { apiUrls } from "../networkServices/apiEndpoints";
import Input from "../components/formComponent/Input";
import Loading from "../components/loader/Loading";
import Tables from "../components/UI/customTable";
import Heading from "../components/UI/Heading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

const ProjectCreateModule = ({ tableDatas }) => {
  const [tableData, setTableData] = useState([]);
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  s;
  const [formData, setFormData] = useState({
    ModuleName: "",
    IsActive: "",
    ModuleID: "",
  });
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

  const moduleTHEAD = [
    { name: t("S.No."), width: "19%" },
    t("ModuleName"),
    t("Edit"),
  ];

  const handleSave = () => {
    if (formData?.ModuleName == "") {
      toast.error("Please Enter Module Name.");
    } else {
      setLoading(true);
      axiosInstances
        .post(apiUrls.CreateModule, {
          ProjectID: Number(tableDatas[0]?.ProjectID),
          ModuleName: String(formData?.ModuleName),
        })
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            getModuleSearch();
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
  const handleUpdate = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.UpdateModule, {
        ProjectID: Number(tableDatas[0]?.ProjectID),
        ModuleID: Number(formData?.ModuleID),
        ModuleName: String(formData?.ModuleName),
        IsActive: Number(formData?.IsActive),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          getModuleSearch();
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
  };
  const getModuleSearch = () => {
    axiosInstances
      .post(apiUrls.Module_Select, {
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
        ProjectID: Number(tableDatas[0]?.ProjectID),
        IsActive: Number(1),
        IsMaster: Number(0),
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleEditModule = (ele) => {

    setFormData({
      ...formData,
      ModuleName: ele?.ModuleName,
      IsActive: ele?.IsActive,
      ModuleID: ele?.ModuleID,
    });
    setEditMode(true);
  };

  useEffect(() => {
    getModuleSearch();
  }, []);
  return (
    <>
      <div className="row m-2">
        <Input
          type="text"
          className="form-control required-fields"
          id="ModuleName"
          name="ModuleName"
          lable={t("ModuleName")}
          placeholder=" "
          onChange={handleSelectChange}
          value={formData?.ModuleName}
          respclass="col-xl-6 col-md-4 col-sm-4 col-12"
        />
        {editMode && (
          <div className="search-col" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="IsActive"
                  checked={formData?.IsActive ? 1 : 0}
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
                {t("IsActive")}
              </span>
            </div>
          </div>
        )}
        {loading ? (
          <Loading />
        ) : (
          <div className="col-2">
            {editMode ? (
              <button
                className="btn btn-sm btn-info ml-2"
                onClick={handleUpdate}
              >
                {t("Update")}
              </button>
            ) : (
              <button className="btn btn-sm btn-info ml-2" onClick={handleSave}>
                {t("Create")}
              </button>
            )}
          </div>
        )}
      </div>
      {tableData?.length > 0 && (
        <>
          <div className="card">
            <Heading title={t("Search Details")} />
            <Tables
              thead={moduleTHEAD}
              tbody={currentData?.map((ele, index) => ({
                "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
                "Module Name": ele?.ModuleName,
                Edit: (
                  <i
                    className="fa fa-edit"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditModule(ele)}
                  ></i>
                ),
              }))}
            />
            <div className="pagination ml-right">
              <div>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {t("Previous")}
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {t("Next")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProjectCreateModule;
