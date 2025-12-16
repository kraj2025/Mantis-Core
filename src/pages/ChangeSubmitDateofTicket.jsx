import React, { useState } from "react";
import Heading from "../components/UI/Heading";
import Input from "../components/formComponent/Input";
import DatePicker from "../components/formComponent/DatePicker";
import { headers } from "../utils/apitools";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../components/loader/Loading";
import { apiUrls } from "../networkServices/apiEndpoints";
import moment from "moment";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

const ChangeSubmitDateofTicket = () => {
  const [loading, setLoading] = useState(false);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [formData, setFormData] = useState({
    TicketNo: "",
    DeliveryDate: new Date(),
  });

  const searchHandleChange = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitTicket = () => {
    if (formData?.TicketNo == "") {
      toast.error("Ticket No. can't be blank");
    } else if (formData?.DeliveryDate == "") {
      toast.error("Please Select Delivery Date.");
    } else {
      setLoading(true);

      axiosInstances
        .post(apiUrls.ChangeSubmitDate, {
          ID: useCryptoLocalStorage("user_Data", "get", "ID"),
          LoginName: useCryptoLocalStorage("user_Data", "get", "realname"),
          TicketIDs: formData?.TicketNo,
          dtSubmit: moment(formData?.DeliveryDate).format("YYYY-MM-DD"),
        })
        .then((res) => {
          if (res?.data?.status == true) {
            toast.success(res?.data?.message);
          } else {
            toast.success(res?.data?.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };
  return (
    <>
      <div className="card ViewIssues border">
        <Heading title="Search Criteria" isBreadcrumb={true} />
        <div className="row g-4 m-2">
          <Input
            type="number"
            className="form-control required-fields"
            id="TicketNo"
            name="TicketNo"
            lable="TicketNo"
            placeholder=" "
            max={20}
            onChange={searchHandleChange}
            value={formData?.TicketNo}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <DatePicker
            className="custom-calendar"
            id="DeliveryDate"
            name="DeliveryDate"
            lable="Submit Date"
            placeholder={VITE_DATE_FORMAT}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            value={formData?.DeliveryDate}
            handleChange={searchHandleChange}
          />
          {loading ? (
            <Loading />
          ) : (
            <div className="col-3 col-sm-4 d-flex">
              <button
                className="btn btn-sm btn-success ml-2"
                onClick={handleSubmitTicket}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChangeSubmitDateofTicket;
