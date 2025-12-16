import React, { useState } from "react";
import Input from "../components/formComponent/Input";
import { apiUrls } from "../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import { axiosInstances } from "../networkServices/axiosInstance";

const SubTicketMappping = ({ visible, handleViewSearch, setVisible }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    CurrentTicket: visible?.showData?.TicketID
      ? visible?.showData?.TicketID
      : "",
    MappingTicket: "",
  });

  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleMapping = () => {
    if (!formData.CurrentTicket) {
      toast.error("Please Enter Current Ticket.");
      return;
    }
    if (!formData.MappingTicket) {
      toast.error("Please Enter Mapping Ticket.");
      return;
    }
    setLoading(true);
    axiosInstances
      .post(apiUrls.MappingSubTicket, {
        CurrentTicketID: formData.CurrentTicket,
        MappingTicketID: formData.MappingTicket,
      })
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res.data.message);
          setLoading(false);
          setVisible(false);
          handleViewSearch();
        } else {
          toast.error(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="card p-2">
        <div style={{ fontWeight: "bold" }}>
          <span>TicketID : {visible?.showData?.TicketID}</span>
          <span className="ml-3">
            Project Name : {visible?.showData?.ProjectName}
          </span>
          <span className="ml-3">AssignTo : {visible?.showData?.AssignTo}</span>
          <span className="ml-3">
            Reporter Name : {visible?.showData?.ReporterName}
          </span>
        </div>
      </div>
      <div className="card">
        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            id="CurrentTicket"
            name="CurrentTicket"
            lable="Current Ticket"
            onChange={handleSelectChange}
            value={formData?.CurrentTicket}
            respclass="col-xl-4 col-md-3 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="MappingTicket"
            name="MappingTicket"
            lable="Mapping Ticket"
            onChange={handleSelectChange}
            value={formData?.MappingTicket}
            respclass="col-xl-4 col-md-3 col-sm-6 col-12"
          />
          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-success ml-3"
              onClick={handleMapping}
            >
              Mapping
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SubTicketMappping;
