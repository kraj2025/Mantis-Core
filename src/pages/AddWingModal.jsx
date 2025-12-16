import React, { useEffect, useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import Heading from "../components/UI/Heading";
import Tables from "../components/UI/customTable";
import Loading from "../components/loader/Loading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
import { toast } from "react-toastify";
const AddWingModal = (ele) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wing, setWing] = useState([]);
  const [formData, setFormData] = useState({
    Wing: "",
  });
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const newRoleTHEAD = ["S.No.", "Wing Name", "Remove"];

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
  const handleSearch = () => {
    axiosInstances
      .post(apiUrls?.UserVsWing_Select, {
        EmployeeId: Number(ele?.visible?.showData?.id),
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleADD = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls?.UserVsWingMapping, {
        EmployeeId: Number(ele?.visible?.showData?.id),
        Status: String("Add"),
        WingID: Number(formData?.Wing),
      })
      .then((res) => {
        toast.success(res?.data?.message);
        handleSearch();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleRemove = (item) => {
    setLoading(true);
    axiosInstances
      .post(apiUrls?.UserVsWingMapping, {
        EmployeeId: Number(ele?.visible?.showData?.id),
        Status: String("Remove"),
        WingID: Number(item?.WingID),
      })
      .then((res) => {
        toast.success(res?.data?.message);
        handleSearch();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getWing();
    handleSearch();
  }, []);
  return (
    <>
      <div className="row ml-2">
        <span style={{ fontWeight: "bold" }}>
          Employee Name: &nbsp; {ele?.visible?.showData?.realname}
        </span>
      </div>
      <div className="row m-2">
        <ReactSelect
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          name="Wing"
          placeholderName="Wing"
          dynamicOptions={wing}
          handleChange={handleDeliveryChange}
          value={formData.Wing}
        />
        <div className="col-2">
          {loading ? (
            <Loading />
          ) : (
            <button className="btn btn-sm btn-success" onClick={handleADD}>
              Add Wing
            </button>
          )}
        </div>
      </div>
      <div className="card">
        <Heading title={"Search Details"} />
        <Tables
          thead={newRoleTHEAD}
          tbody={tableData?.map((ele, index) => ({
            "S.No.": index + 1,
            "Wing Name": ele?.Wing,
            Remove: (
              <i
                className="fa fa-remove"
                style={{ color: "red" }}
                onClick={() => {
                  handleRemove(ele);
                }}
              >
                X
              </i>
            ),
          }))}
          tableHeight={"tableHeight"}
        />
        {/* <div className="col-2">
          <button className="btn btn-sm btn-success m-1">Save</button>
        </div> */}
      </div>
    </>
  );
};
export default AddWingModal;
