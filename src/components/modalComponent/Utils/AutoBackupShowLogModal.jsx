import React, { useEffect, useState } from "react";

import { Tooltip } from "primereact/tooltip";
import { useTranslation } from "react-i18next";
import Input from "../../formComponent/Input";
import { Button, Table } from "react-bootstrap";
import axios from "axios";
import { headers } from "../../../utils/apitools";
import Tables from "../../UI/customTable";
import { toast } from "react-toastify";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { axiosInstances } from "../../../networkServices/axiosInstance";
const AutoBackupShowLogModal = ({ visible, props }) => {
  const [t] = useTranslation();
  const [formData, setFormData] = useState({
    IsActive: false,
    AllowAutobackup: false,
    AllowURLValidation: true,
    AllowDocIDValidation: false,
    AllowRateValidation: true,
    AllowchangePass: false,
    AllowLabSecurity: false,
    OwnerName: visible?.showLogData?.Owner_Name,
    ProjectName: visible?.showLogData?.ProjectName,
    OwnerMobile: visible?.showLogData?.Mobile,
    OwnerEmail: visible?.showLogData?.Owner_Email,
    SPOCName: visible?.showLogData?.spoc_name,
    SPOCEmail: visible?.showLogData?.SPOC_EmailID,
    SPOCMobile: visible?.showLogData?.spoc_mobile,
    AutoBackupDate: visible?.showLogData?.lastdate,
    Description: visible?.showLogData?.remark,
  });

  const handleSubmit = () => {
 

         axiosInstances
      .post(apiUrls?.AutobackupLog, {ProjectID:String(visible?.showLogData?.id)})
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // const[tableData,setTableData]=useState([])
  useEffect(() => {
    handleSubmit();
  }, []);

  const [tableData, setTableData] = useState([]);
  const THEAD = [
    "S.No.",
    "ProjectName",
    // "AutobackupDoneByID",
    "AutobackupDoneBy",
    "AutobackupDate",
    "Summary",
  ];
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
  return (
    <>
      <Tables
        thead={THEAD}
        tbody={currentData?.map((ele, index) => ({
          "S.No.":  (currentPage - 1) * rowsPerPage + index + 1,
          "ProjectName": ele?.ProjectName,
        //   "AutobackupDoneByID": ele?.AutobackupDoneByID,
          "AutobackupDoneBy": ele?.AutobackupDoneBy,
          "AutobackupDate": ele?.AutobackupDate,
          "Summary": ele?.summary,
        }))}
      />
        <div className="pagination" style={{ marginLeft: "auto", float: "right" }}>
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
    </>
  );
};

export default AutoBackupShowLogModal;
