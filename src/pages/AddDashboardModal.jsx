import React, { useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";

const AddDashboardModal = ({ visible, setVisible }) => {
  const [dashboard, setDashboard] = useState([]);

  const [formData, setFormData] = useState({
    Dashboard: "",
  });

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <div className="card p-2">
        <span style={{ fontWeight: "bold" }}>
          Employee Name: &nbsp; {visible?.showData?.realname}
        </span>
      </div>
      <div className="card">
        <div className="row p-2">
          <ReactSelect
            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
            name="Dashboard"
            placeholderName="Dashboard"
            dynamicOptions={dashboard}
            handleChange={handleDeliveryChange}
            value={formData.Dashboard}
          />

          <button className="btn btn-sm btn-primary">Add </button>
        </div>
      </div>
    </>
  );
};
export default AddDashboardModal;
