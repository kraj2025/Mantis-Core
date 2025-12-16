import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import { toast } from "react-toastify";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

const ProjectFlagModal = ({ data, handleViewProject }) => {
  const [flagdata, setFlagdata] = useState([]);
  //   console.log("flagdata", flagdata);
  const [formData, setFormData] = useState({
    IsActive: "0",
    IsMailSent: "0",
    IsAutoDeliveryDate: "0",
    AutobackupNotification: "0",
    ClientFeedbackDisplay: "0",
    IsWeeklyMailSend: "0",
    IsClientCredentialMailSend: "0",
  });

  useEffect(() => {
    if (flagdata.length > 0) {
      setFormData({
        IsActive: flagdata[0]?.enabled == "1" ? "1" : "0",
        IsMailSent: flagdata[0]?.IsMailSent == "1" ? "1" : "0",
        IsAutoDeliveryDate: flagdata[0]?.IsAutoDeliveryDate == "1" ? "1" : "0",
        AutobackupNotification:
          flagdata[0]?.AllowAutobackupNotification == "1" ? "1" : "0",
        ClientFeedbackDisplay:
          flagdata[0]?.ClientFeedbackDisplay == "1" ? "1" : "0",
        IsWeeklyMailSend: flagdata[0]?.IsWeeklyMailSend == "1" ? "1" : "0",
        IsClientCredentialMailSend:
          flagdata[0]?.IsClientCredentialMailSend == "1" ? "1" : "0",
      });
    }
  }, [flagdata]);

  const handleSelectChange = (e) => {
    const { name, checked } = e.target;
    const value = checked ? "1" : "0";

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    getNotfication({ ...formData, [name]: value });
  };

  const getNotfication = (updatedFormData) => {

    const payload = {
      ProjectID: data?.Id || data?.ProjectID || 0,
      enabled: updatedFormData?.IsActive || "0",
      IsAutoDeliveryDate: updatedFormData?.IsAutoDeliveryDate || "0",
      IsMailSent: updatedFormData?.IsMailSent || "0",
      AllowAutobackupNotification:
        updatedFormData?.AutobackupNotification || "0",
      ClientFeedbackDisplay: updatedFormData?.ClientFeedbackDisplay || "0",
      IsWeeklyMailSend: updatedFormData?.IsWeeklyMailSend || "0",
      IsClientCredentialMailSend:
        updatedFormData?.IsClientCredentialMailSend || "0",
    };

    axiosInstances
      .post(apiUrls?.UpdateFlagProject, payload)
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleViewProject();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getFlagData = () => {

    axiosInstances
      .post(apiUrls?.GetFlagProject, { ProjectID: data?.Id || data?.ProjectID })
      .then((res) => {
        setFlagdata(res?.data?.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    getFlagData();
  }, []);
  return (
    <>
      <div className="card p-2">
        <span style={{ fontWeight: "bold", marginLeft: "6px" }}>
          Project Name : {data?.NAME || data?.ProjectName}
        </span>
      </div>
      <div className="card">
        <div className="row m-2">
          <div
            className="search-col"
            style={{
              marginLeft: "9px",
              display: "flex",
              marginRight: "auto",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((col) => (
              <div
                key={col}
                style={{ display: "flex", flexDirection: "row", flex: 1 }}
              >
                {[
                  { name: "IsActive", label: "IsActive" },
                  { name: "IsMailSent", label: "IsMailSent" },
                  { name: "IsAutoDeliveryDate", label: "IsAutoDeliveryDate" },
                  {
                    name: "AutobackupNotification",
                    label: "AutobackupNotification",
                  },
                  {
                    name: "ClientFeedbackDisplay",
                    label: "ClientFeedbackDisplay",
                  },
                  {
                    name: "IsWeeklyMailSend",
                    label: "IsWeeklyMailSend",
                  },
                  {
                    name: "IsClientCredentialMailSend",
                    label: "IsClientCredentialMailSend",
                  },
                ]
                  .slice(col * Math.ceil(11 / 2), (col + 1) * Math.ceil(11 / 2))
                  .map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <label className="switch" style={{ marginTop: "7px" }}>
                        <input
                          type="checkbox"
                          name={item.name}
                          checked={formData[item.name] == "1"}
                          onChange={handleSelectChange}
                        />
                        <span className="slider"></span>
                      </label>
                      <span
                        style={{
                          marginLeft: "7px",
                          marginRight: "10px",
                          fontSize: "12px",
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectFlagModal;
