import React, { useState } from "react";
import { toast } from "react-toastify";

import { apiUrls } from "../../../networkServices/apiEndpoints";
import Loading from "../../loader/Loading";
import { axiosInstances } from "../../../networkServices/axiosInstance";
const SummaryStatusModal = ({ visible, setVisible }) => {
  const [formData, setFormData] = useState({
    summary: visible?.ele?.summary,
  });
  const [loading, setLoading] = useState(false);
  const handleSummaryTable = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.ApplyAction, {
        TicketIDs: String(visible?.ele?.TicketID),
        ActionText: "Summary",
        ActionId: "",
        RCA: "",
        ReferenceCode: "",
        ManHour: "",
        Summary: String(formData?.summary),
        ModuleID: "",
        ModuleName: "",
        PagesID: "",
        PagesName: "",
        ManHoursClient: "",
        DeliveryDateClient: "",
        ReOpenReasonID: "",
        ReOpenReason: "",
      })

      .then((res) => {
        if (res?.success === true) {
          toast.success(res?.data?.Success?.Success);
          setLoading(false);
          setVisible(false);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="card  p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {visible?.ele?.ProjectName}&nbsp;&nbsp;&nbsp; Ticket
          No. : {visible?.ele?.TicketID}
        </span>
      </div>
      <div className="card">
        <div className="row p-2">
          <textarea
            type="text"
            className="summaryheightmodalsummary"
            id="summary"
            name="summary"
            lable="summary"
            onChange={handleSelectChange}
            value={formData?.summary}
          ></textarea>
          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-xs btn-success ml-2 mt-2"
              onClick={handleSummaryTable}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default SummaryStatusModal;
