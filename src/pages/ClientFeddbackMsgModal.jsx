import React, { useState } from "react";
import Input from "../components/formComponent/Input";

const ClientFeddbackMsgModal = () => {
  const [formData, setFormData] = useState({
    ResponseMessage: "",
    AmcPercent:""
  });

  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  return (
    <>
      <div className="card">
        <div className="row m-2">
          <Input
            type="text"
            className="form-control"
            id="AmcPercent"
            name="AmcPercent"
            lable="AMC %"
            onChange={handleSelectChange}
            value={formData?.AmcPercent}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="ResponseMessage"
            name="ResponseMessage"
            lable="AMC % Reason"
            onChange={handleSelectChange}
            value={formData?.ResponseMessage}
            respclass="col-xl-10 col-md-4 col-sm-4 col-12"
          />

          <button className="btn btn-sm btn-success ml-3 mt-2">Save</button>
        </div>
      </div>
    </>
  );
};
export default ClientFeddbackMsgModal;
