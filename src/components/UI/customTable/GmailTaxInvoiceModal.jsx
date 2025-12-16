import React, { useEffect, useState } from "react";
import Input from "../../formComponent/Input";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { headers } from "../../../utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";
import { gmailQuotationTHEAD } from "../../modalComponent/Utils/HealperThead";
import Tables from ".";
import moment from "moment";
import Heading from "../Heading";
import ReactSelect from "../../formComponent/ReactSelect";
import Loading from "../../loader/Loading";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";

const GmailTaxInvoiceModal = (visible) => {
  // console.log("visible visible", visible);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quotationLog, setQuotationLog] = useState([]);
  const [projectEmail, setProjectEmail] = useState([]);
  const [formData, setFormData] = useState({
    EmailTo: "",
    EmailCC: "",
  });
  const searchHandleChange = (e, index) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuotation_Email_Log = () => {
    
    axiosInstances
      .post(apiUrls?.TaxInvoiceLog, {
        TaxId: String(visible?.visible?.showData?.ID),
      })
      .then((res) => {
      
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleQuotation_Email = () => {
    if (formData?.EmailTo == "") {
      toast.error("Please Enter EmailTo.");
    } else if (formData?.EmailCC == "") {
      toast.error("Please Enter EmailCC.");
    } else {
      setLoading(true);
      const payload = {
        TaxId: Number(visible?.visible?.showData?.ID || 0),
        ToEmail: String(formData?.EmailTo || ""),
        CcEmail: String(formData?.EmailCC || ""),
      };

      axiosInstances
        .post(apiUrls?.SendTaxInvoiceMailFinal, payload)
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            handleQuotation_Email_Log();
            setFormData({
              EmailTo: "",
              EmailCC: "",
            });
            setLoading(false);
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    handleQuotation_Email_Log();
    // getProjectEmail();
  }, []);
  return (
    <>
      <div className="card p-2">
        <div className="d-flex">
          <span style={{ fontWeight: "bold" }}>
            Project Name:- &nbsp;{visible?.visible?.showData?.ProjectName}
          </span>
          <span style={{ fontWeight: "bold", marginLeft: "20px" }}>
            Tax Invoice No.:- &nbsp;{visible?.visible?.showData?.TaxInvoiceNo}
          </span>
        </div>
      </div>
      <div className="card">
        <div className="row m-2">
          <Input
            type="text"
            className="form-control"
            id="EmailTo"
            name="EmailTo"
            lable="EmailTo"
            placeholder=" "
            onChange={searchHandleChange}
            value={formData?.EmailTo}
            // value={formData?.EmailTo?formData?.EmailTo:projectEmail?.EmailTo}
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
            // value={formData?.EmailTo?formData?.EmailTo:projectEmail?.EmailCC}
            respclass="col-xl-5 col-md-4 col-sm-6 col-12"
          />
          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-primary"
              onClick={handleQuotation_Email}
            >
              Send
            </button>
          )}
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card p-0">
          <Heading title={"Search Details"} />
          <Tables
            thead={gmailQuotationTHEAD}
            tbody={tableData?.map((ele, index) => ({
              "S.No.": index + 1,
              EmailTo: ele?.ToEmail,
              EmailCC: ele?.CCEmail,
              // "Email Status": ele?.EmaiStatus,
              // "Entry Date": moment(ele?.dtEntry).format("DD-MMM-YYYY"),
              "Send Date": ele?.dtSent
                ? moment(ele.dtSent).format("DD-MMM-YYYY")
                : "",
            }))}
            tableHeight={"tableHeight"}
          />
        </div>
      )}
    </>
  );
};
export default GmailTaxInvoiceModal;
