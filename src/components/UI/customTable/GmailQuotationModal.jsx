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
import NoRecordFound from "../../formComponent/NoRecordFound";
import { axiosInstances } from "../../../networkServices/axiosInstance";

const GmailQuotationModal = ({ visible, setVisible }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quotationLog, setQuotationLog] = useState([]);
  const [projectEmail, setProjectEmail] = useState([]);
  const [formData, setFormData] = useState({
    EmailTo: projectEmail?.EmailTo || "",
    EmailCC: projectEmail?.EmailCC || "",
    GmailType: "",
  });

  useEffect(() => {
    if (projectEmail) {
      setFormData((prev) => ({
        ...prev,
        ...(projectEmail.EmailTo && { EmailTo: projectEmail.EmailTo }),
        ...(projectEmail.EmailCC && { EmailCC: projectEmail.EmailCC }),
      }));
    }
  }, [projectEmail]);

  const searchHandleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuotation_Email_Log = () => {
   
    axiosInstances
      .post(apiUrls.Quotation_Email_Log, {
        DocumentID: String(visible?.showData?.EncryptID),
        DocumentType: String("Quotation"),
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
 
      axiosInstances
        .post(apiUrls.Quotation_Email, {
          DocumentID: String(visible?.showData?.EncryptID),
          EmailTo: String(formData?.EmailTo),
          EmailCC: String(formData?.EmailCC),
          DocumentType: String("Quotation"),
          ActionType: String(""),
        })
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            handleQuotation_Email_Log();
            setFormData({
              EmailTo: "",
              EmailCC: "",
            });
            setLoading(false);
            setVisible(false);
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
  const getProjectEmail = () => {
   
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        ProjectID: Number(visible?.showData?.ProjectID),
        IsMaster: String("0"),
        WingID: Number("0"),
        TeamID: Number("0"),
        VerticalID: Number("0"),
      })
      .then((res) => {
        setProjectEmail(res?.data?.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    handleQuotation_Email_Log();
    getProjectEmail();
  }, []);
  return (
    <>
      <div className="card p-2">
        <div className="d-flex">
          <span style={{ fontWeight: "bold" }}>
            Project Name:- &nbsp;{visible?.showData?.ProjectName}
          </span>
          <span style={{ fontWeight: "bold", marginLeft: "20px" }}>
            Quotation No.:- &nbsp;{visible?.showData?.QuotationNo}
          </span>
        </div>
      </div>
      <div className="card p-1">
        <div className="row mt-2">
          <Input
            type="text"
            className="form-control"
            id="EmailTo"
            name="EmailTo"
            lable="EmailTo"
            placeholder=" "
            onChange={searchHandleChange}
            value={formData?.EmailTo}
            // value={
            //   formData?.EmailTo ? formData?.EmailTo : projectEmail?.EmailTo
            // }
            respclass="col-xl-12 col-md-4 col-sm-6 col-12"
          />
        </div>
        <div className="row mt-2">
          <Input
            type="text"
            className="form-control"
            id="EmailCC"
            name="EmailCC"
            lable="EmailCC"
            placeholder=" "
            onChange={searchHandleChange}
            value={formData?.EmailCC}
            // value={
            //   formData?.EmailCC ? formData?.EmailCC : projectEmail?.EmailCC
            // }
            respclass="col-xl-12 col-md-4 col-sm-6 col-12"
          />
        </div>
        <div className="row mt-1">
          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-primary ml-3"
              onClick={handleQuotation_Email}
            >
              Send
            </button>
          )}
        </div>
      </div>

      {tableData?.length > 0 ? (
        <div className="card p-2">
          <Tables
            thead={gmailQuotationTHEAD}
            tbody={tableData?.map((ele, index) => ({
              "S.No.": index + 1,
              EmailTo: ele?.ToEMailID,
              EmailCC: ele?.CCEmailID,
              "Email Status": ele?.EmaiStatus,
              "Entry Date": moment(ele?.dtEntry).format("DD-MMM-YYYY"),
              "Send Date": ele?.dtSent
                ? moment(ele.dtSent).format("DD-MMM-YYYY")
                : "",
            }))}
            tableHeight={"tableHeight"}
          />
        </div>
      ) : (
        <NoRecordFound />
      )}
    </>
  );
};
export default GmailQuotationModal;
