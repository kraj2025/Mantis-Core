import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import Tables from "../components/UI/customTable";
import { checkListEntryTHEAD } from "../components/modalComponent/Utils/HealperThead";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const CheckListEntry = ({ data }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const [formData, setFormData] = useState({
    Date: "",
    Remarks: "",
    Email: "",
    isYes: "",
    isNo: "",
    isNR: "",
  });
  const handleRemarkChange = (index, value) => {
    setTableData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, Remarks: value } : item))
    );
  };

  const handleCheckListSearch = () => {
    axiosInstances
      .post(apiUrls?.getViewProject, {
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
        ProjectID: Number(data?.Id || data?.ProjectID),
        Title: "Checklist",
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCheckListSave = () => {
    const payload = tableData?.map((val, index) => ({
      "S.No.": index + 1, // index starts at 0, so +1
      CheckListName: val?.CheckListName,
      ChecklistID: val?.ChecklistID,
      Status: val?.Status,
      Remarks: val?.Remarks,
    }));
    setLoading(true);

    axiosInstances
      .post(apiUrls?.ProjectMasterUpdate, {
        ProjectID: Number(data?.Id || data?.ProjectID),
        ActionType: "UpdateCheckList",
        ProjectData: String(JSON.stringify(payload)),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          handleCheckListSearch();
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleStatusChange = (index, value) => {
    setTableData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, Status: value } : item))
    );
  };

  useEffect(() => {
    handleCheckListSearch();
  }, []);

  return (
    <>
      <div className="card  p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {data?.NAME || data?.ProjectName}
        </span>
      </div>
      <div>
        <Heading
          title={<span style={{ fontWeight: "bold" }}>Check List Entry</span>}
        />
        <Tables
          thead={checkListEntryTHEAD}
          tbody={currentData?.map((ele, index) => {
            const actualIndex = (currentPage - 1) * rowsPerPage + index;
            return {
              "S.No.": actualIndex + 1,
              "CheckList Name": ele?.CheckListName,
              Status: (
                <>
                  <label className="ml-1">
                    <input
                      type="radio"
                      name={`IsStatus_${actualIndex}`}
                      checked={tableData[actualIndex]?.Status === 1}
                      onChange={() => handleStatusChange(actualIndex, 1)}
                    />
                    Yes
                  </label>
                  <label className="ml-2">
                    <input
                      type="radio"
                      name={`IsStatus_${actualIndex}`}
                      checked={tableData[actualIndex]?.Status === 0}
                      onChange={() => handleStatusChange(actualIndex, 0)}
                    />
                    No
                  </label>
                  <label className="ml-2">
                    <input
                      type="radio"
                      name={`IsStatus_${actualIndex}`}
                      checked={tableData[actualIndex]?.Status === 2}
                      onChange={() => handleStatusChange(actualIndex, 2)}
                    />
                    NR
                  </label>
                </>
              ),
              Remarks: (
                <div>
                  <textarea
                    type="text"
                    className="form-control"
                    placeholder="Remarks"
                    name="Remarks"
                    value={tableData[actualIndex]?.Remarks}
                    onChange={(e) =>
                      handleRemarkChange(actualIndex, e.target.value)
                    }
                    style={{
                      width: "98%",
                      marginLeft: "5px",
                      height: "auto",
                      marginRight: "15px",
                    }}
                  ></textarea>
                </div>
              ),
            };
          })}
        />
        <div className="card p-1">
          <div className="row ">
            <div className="col-sm-2">
              {loading ? (
                <Loading />
              ) : (
                <button
                  onClick={handleCheckListSave}
                  className="btn btn-sm btn-primary"
                >
                  Save
                </button>
              )}
            </div>
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
        </div>
      </div>
    </>
  );
};

export default CheckListEntry;
