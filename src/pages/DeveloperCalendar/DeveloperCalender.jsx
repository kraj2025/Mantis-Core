import React, { useEffect, useState } from "react";
import "./DeveloperCalender.css";
import CalendarTable from "./CalenderTable";
import BugCard from "./BugCard";
import Heading from "../../components/UI/Heading";
import ReactSelect from "../../components/formComponent/ReactSelect";
import DatePickerMonth from "../../components/formComponent/DatePickerMonth";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../utils/apitools";
import axios from "axios";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";

const DeveloperCalendar = () => {
  const [formData, setFormData] = useState({
    AssignedTo: "",
    Month: new Date(),
  });
  const [assignto, setAssignedto] = useState([]);

  const getAssignTo = () => {
    axiosInstances
      .post(apiUrls.Reporter_Select, {
      })
        .then((res) => {
          const assigntos = res?.data.data.map((item) => {
            return { label: item?.NAME, value: item?.ID };
          });
          setAssignedto(assigntos);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const handleMonthYearChange = (name, e) => {
    const { value } = e.target;
    const date = new Date(value);
    setFormData({...formData, [name]: value});
  };

  const handleSearch=()=>{

  }

  useEffect(() => {
    getAssignTo();
  }, []);

  const handleDeliveryChange = () => {};
  return (
    <>
      <Heading title="Pending Tickets" isBreadcrumb={true} />
      <div className="row g-4 m-2">
        <ReactSelect
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="AssignedTo"
          placeholderName="Employee"
          dynamicOptions={assignto}
          value={formData?.AssignedTo}
          handleChange={handleDeliveryChange}
        />
        <DatePickerMonth
          className="custom-calendar"
          id="Month"
          name="Month"
          lable="Month/Year"
          placeholder="MM/YY"
          respclass="col-xl-2 col-md-6 col-sm-6 col-12"
          value={formData.Month}
          handleChange={(e) => handleMonthYearChange("Month", e)}
        />
          <button className="btn btn-sm btn-primary" onClick={handleSearch}>
            Search
          </button>
      </div>
      <div className="row px-3">
        <div className="col-md-7 col-12">
          <CalendarTable />
        </div>
        <div className="col-md-5 col-12">
          <BugCard />
        </div>
      </div>
    </>
  );
};

export default DeveloperCalendar;
