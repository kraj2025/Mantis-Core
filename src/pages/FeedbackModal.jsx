import React, { useEffect, useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { toast } from "react-toastify";
import { set } from "lodash";
import Loading from "../components/loader/Loading";
import { axiosInstances } from "../networkServices/axiosInstance";
const FeedbackModal = (showData) => {
  //   console.log("showData", showData);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState([]);
  const [formData, setFormData] = useState({
    ProjectID: "",
  });
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );
  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        ProjectID: 0,
        IsMaster: "0",
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
  const handleFeedback = () => {
    if (formData.ProjectID.length === 0) {
      toast.error("Please select a project");
      return;
    }
    setLoading(true);
    axiosInstances
      .post(apiUrls.CreateFeedback, {
        ProjectID: Number(formData.ProjectID),
      })

      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setFormData({
            ProjectID: [],
          });
          showData?.setVisible(false);

          setLoading;
          if (
            ReportingManager == 1
              ? showData.handleSearchFeedback()
              : showData.handleSearchEmployee()
          );
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
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    getProject();
  }, []);
  return (
    <>
      <div className="card">
        <div className="row p-2">
          <ReactSelect
            respclass="col-xl-6 col-md-4 col-sm-6 col-12"
            name="ProjectID"
            placeholderName="Project"
            dynamicOptions={project}
            handleChange={handleDeliveryChange}
            value={formData.ProjectID}
          />
          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-success ml-4"
              onClick={handleFeedback}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default FeedbackModal;
