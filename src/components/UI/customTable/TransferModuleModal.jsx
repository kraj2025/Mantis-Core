import React, { useEffect, useState } from "react";
import { headers } from "../../../utils/apitools";
import ReactSelect from "../../formComponent/ReactSelect";
import Heading from "../Heading";
import axios from "axios";
import Loading from "../../loader/Loading";
import { toast } from "react-toastify";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";

const TransferModuleModal = ({ tableData, userData, setVisible }) => {
  console.log("tableData", tableData);
  console.log("userData", userData);
  const [loading, setLoading] = useState(false);
  const [reporter, setReporter] = useState([]);
  const [targetreporter, setTargetReporter] = useState([]);
  const [formData, setFormData] = useState({
    DocumentType: "",
    SelectFile: "",
    SourceUser: null,
    TargetUser: null,
  });
  const getReporter = () => {
    axiosInstances
      .post(apiUrls.Reporter_Select, {
        ID: useCryptoLocalStorage("user_Data", "get", "ID"),
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
      })
      .then((res) => {
        const reporters = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setReporter(reporters);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getTargetReporter = () => {
    axiosInstances
      .post(apiUrls.Reporter_Select, {
        ID: useCryptoLocalStorage("user_Data", "get", "ID"),
        IsMaster: "1",
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
      })
      .then((res) => {
        const reporters = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setTargetReporter(reporters);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeliveryChange = (name, selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption,
    }));
  };
  const handleusermapping = () => {
    setLoading(true);
   
    axiosInstances
      .post(apiUrls.UserVsProjectMapping, {
        ProjectID: String(userData[0]?.ProjectID),
        UserID: String(tableData?.User),
        TargetUserID: String(formData?.TargetUser?.value),
        ProjectID: String(userData[0]?.ProjectID),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          setVisible(false);
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
  // console.log("formData?.TargetUser", formData?.TargetUser?.value);

  const getFilteredTargetOptions = () => {
    if (!formData.SourceUser) {
      return targetreporter;
    }
    return targetreporter.filter(
      (option) => option.value !== formData.SourceUser.value
    );
  };
  useEffect(() => {
    getReporter();
    getTargetReporter();
  }, []);
  return (
    <>
      <div className="card ViewIssues border p-3">
        {/* <Heading
                    title="User Vs Project Mapping"
                /> */}
        <div className="row d-flex">
          <div className="col-md-5 col-sm-6">
            <ReactSelect
              name="SourceUser"
              respclass=" col-12"
              placeholderName="Source User"
              dynamicOptions={reporter}
              value={formData?.SourceUser}
              handleChange={handleDeliveryChange}
            />
          </div>
          <div className="col-2" style={{ textAlign: "center" }}>
            {/* {loading ? (
                            <Loading />
                        ) : (<i className="fa fa-arrow-down" onClick={handleusermapping} style={{cursor:"pointer"}}></i>)} */}
          </div>
          <div className="col-md-5 col-sm-6">
            <ReactSelect
              name="TargetUser"
              respclass=" col-12"
              placeholderName="Target User"
              //   dynamicOptions={targetreporter}
              dynamicOptions={getFilteredTargetOptions()}
              value={formData?.TargetUser}
              handleChange={handleDeliveryChange}
            />
          </div>
        </div>
        <div className="col-2" style={{ margin: "auto" }}>
          <button
            className="btn btn-sm btn-info ml-3"
            onClick={handleusermapping}
          >
            Transfer
          </button>
        </div>
      </div>
    </>
  );
};
export default TransferModuleModal;
