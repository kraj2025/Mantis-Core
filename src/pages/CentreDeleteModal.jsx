import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiUrls } from "../networkServices/apiEndpoints";
import Loading from "../components/loader/Loading";
import { axiosInstances } from "../networkServices/axiosInstance";

const CentreDeleteModal = ({ visible, setVisible }) => {
  const [loading, setLoading] = useState(false);
  const handleRemove = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.ProjectMasterUpdate, {
        ProjectID: String(visible?.data?.Id),
        Centre: String(""),
        CentreID: String(""),
        ActionType: String("DeleteCentre"),
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
      });
  };
  return (
    <>
      {/* <div className="card p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {""}
        </span>
      </div> */}
      <div className="card p-2">
        <div className="row">
          <h1 style={{ fontWeight: "bold", marginLeft: "10px" }}>
            Do you want to delete all items in the CentreList?
          </h1>

          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-danger ml-4"
              onClick={handleRemove}
            >
              Yes
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CentreDeleteModal;
