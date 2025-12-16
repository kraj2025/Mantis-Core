import React, { useEffect, useState } from "react";
import ReactSelect from "../../formComponent/ReactSelect";
import Input from "../../formComponent/Input";
import { toast } from "react-toastify";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { headers } from "../../../utils/apitools";
import axios from "axios";
import Tables from ".";
import Loading from "../../loader/Loading";
import Heading from "../Heading";
import { useTranslation } from "react-i18next";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";

const PageNameModal = ({ visible, setVisible, onCloseInnerModal }) => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    ModuleName: "",
    IsActive: "",
  });
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
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
    t("PageName"),
    t("Edit"),
  ];

  const handleSave = () => {
    if (formData?.ModuleName == "") {
      toast.error("Please Enter Page Name.");
    } else {
      setLoading(true);
      axiosInstances
        .post(apiUrls.CreatePages, {
          ProjectID: Number(visible?.showData?.ProjectID),
          PagesName: String(formData?.ModuleName),
        })

        .then((res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            getModuleSearch();
            setLoading(false);
            setVisible(false);
            if (onCloseInnerModal) {
              onCloseInnerModal();
            }
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
      .post(apiUrls.UpdatePages, {
        PagesID: tableData[0]?.ID,
        PagesName: formData?.ModuleName,
        IsActive: formData?.IsActive,
      })
      .then((res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          getModuleSearch();
          setLoading(false);
          setVisible(false);
          if (onCloseInnerModal) {
            onCloseInnerModal(); // call parent's handleNews here
          }
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
      .post(apiUrls.Pages_Select, {
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
        ProjectID: visible?.showData?.ProjectID,
        IsActive: 1,
        IsMaster: 0,
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
      ModuleName: ele?.PagesName,
      IsActive: ele?.IsActive,
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
          lable={t("PageName")}
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
                "Page Name": ele?.PagesName,
                Edit: (
                  <i
                    className="fa fa-edit"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditModule(ele)}
                  ></i>
                ),
              }))}
              // tableHeight={"tableHeight"}
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

export default PageNameModal;
