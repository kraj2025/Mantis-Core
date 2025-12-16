import React, { useEffect, useState } from "react";
import Input from "../../formComponent/Input";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { headers } from "../../../utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";
import { gmailQuotationTHEAD } from "../../modalComponent/Utils/HealperThead";
import Tables from ".";
import moment from "moment";
import Loading from "../../loader/Loading";
import { useTranslation } from "react-i18next";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";

const GmailConnecterModal = (visible) => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
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
      .post(apiUrls.Quotation_Email_Log, {
        DocumentID: String(visible?.visible?.showData?.EncryptID),
        DocumentType: "Connecter",
      })

      .then((res) => {
        console.log("email log", res);
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
      const payloadData = {
        DocumentID: visible?.visible?.showData?.EncryptID || "",
        EmailTo: formData?.EmailTo || "",
        EmailCC: formData?.EmailCC || "",
        DocumentType: "Connecter", // fixed value from your code
        ActionType: "", // not in FormData, so you can fill as needed
      };

      axiosInstances
        .post(apiUrls.Quotation_Email, payloadData)
    
        .then((res) => {
          toast.success(res?.data?.messsage);
          handleQuotation_Email_Log();
          setFormData({
            EmailTo: "",
            EmailCC: "",
          });
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };
 

  useEffect(() => {
    handleQuotation_Email_Log();
 
  }, []);

  const gmailQuotationTHEAD = [
    { name: t("S.No."), width: "7%" },
    t("EmailTo"),
    t("EmailCC"),
    t("Email Status"),
    t("Entry Date"),
    t("Send Date"),
  ];
  return (
    <>
      <div className="card p-2">
        <div className="d-flex">
          <span style={{ fontWeight: "bold" }}>
            {t("Project Name")}:- &nbsp;
            {visible?.visible?.showData?.ProjectName}
          </span>
          <span style={{ fontWeight: "bold", marginLeft: "20px" }}>
            {t("Issue No.")}:- &nbsp;{visible?.visible?.showData?.ActualIssueNo}
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
            lable={t("EmailTo")}
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
            lable={t("EmailCC")}
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
              {t("Send")}
            </button>
          )}
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card p-2">
          {/* <Heading title={"Gmail Details"}/> */}
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
      )}
    </>
  );
};
export default GmailConnecterModal;
