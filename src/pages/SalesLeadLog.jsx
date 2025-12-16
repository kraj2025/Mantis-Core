import React, { useEffect, useState } from "react";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import axios from "axios";
import Input from "../components/formComponent/Input";
import Loading from "../components/loader/Loading";
import Tables from "../components/UI/customTable";
import { toast } from "react-toastify";
import Heading from "../components/UI/Heading";
import { axiosInstances } from "../networkServices/axiosInstance";

const SalesLeadLog = (showData) => {
  console.log("showData", showData);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    EmailTo: "",
    EmailCC: "",
  });

  const searchHandleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSend = () => {
    if (formData?.EmailTo == "") {
      toast.error("Please Enter EmailTo.");
    } else {
      setLoading(true);
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("LeadID", showData?.visible?.showData?.ID),
      //   form.append("ToEmail", formData?.EmailTo),
      //   form.append("CcEmail", formData?.EmailCC),
      //   axios
      //     .post(apiUrls?.ResendEmail, form, { headers })
      const payload = {
        LeadID: Number(showData?.visible?.showData?.ID || 0),
        ToEmail: String(formData?.EmailTo || ""),
        CcEmail: String(formData?.EmailCC || ""),
      };

      axiosInstances
        .post(apiUrls?.ResendEmail, payload)
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setFormData({
              EmailTo: "",
              EmailCC: "",
            });
            setLoading(false);
            showData?.setVisible(false);
            showData.handleSearch();
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };
  const Lead_Email_Log = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("LeadID", showData?.visible?.showData?.ID),
    //   axios
    //     .post(apiUrls?.Lead_Email_Log, form, { headers })

    axiosInstances
      .post(apiUrls?.Lead_Email_Log, {
        LeadID: Number(showData?.visible?.showData?.ID),
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const gmailQuotationTHEAD = [
    "S.No.",
    "CreatedBy",
    "EmailTo",
    "EmailCC",
    "Email Status",
    "Send Date",
  ];

  useEffect(() => {
    Lead_Email_Log();
  }, []);
  return (
    <>
      <div className="card  p-2">
        <span style={{ fontWeight: "bold" }}>
          Organization Name : {showData?.visible?.showData?.OrganizationName}{" "}
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Created By :{" "}
          {showData?.visible?.showData?.CreatedBy} &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; Created Date :{" "}
          {new Date(
            showData?.visible?.showData?.dtEntry?.Value
          ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="card p-1">
        <div className="row mt-1">
          <Input
            type="text"
            className="form-control"
            id="EmailTo"
            name="EmailTo"
            lable="EmailTo"
            placeholder=" "
            onChange={searchHandleChange}
            value={formData?.EmailTo}
            respclass="col-xl-5 col-md-4 col-sm-6 col-12"
          />

          <Input
            type="text"
            className="form-control"
            id="EmailCC"
            name="EmailCC"
            lable="EmailCC"
            placeholder=" "
            onChange={searchHandleChange}
            value={formData?.EmailCC}
            respclass="col-xl-5 col-md-4 col-sm-6 col-12"
          />

          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-primary ml-3"
              onClick={handleSend}
            >
              Send
            </button>
          )}
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card ">
          <Heading title={"Search Details"} />
          <Tables
            thead={gmailQuotationTHEAD}
            tbody={tableData?.map((ele, index) => ({
              "S.No.": index + 1,
              CreatedBy: ele?.CreatedBy,
              EmailTo: ele?.ToEmail,
              EmailCC: ele?.ToCC,
              "Email Status": "Send",
              // "Entry Date": moment(ele?.dtSend).format("DD-MMM-YYYY"),
              "Send Date": new Date(ele.dtSend).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            }))}
            tableHeight={"tableHeight"}
          />
        </div>
      )}
    </>
  );
};
export default SalesLeadLog;
