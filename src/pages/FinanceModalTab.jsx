import React, { useEffect, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";
import Input from "../components/formComponent/Input";
import ReactSelect from "../components/formComponent/ReactSelect";
import moment from "moment";
import DatePicker from "../components/formComponent/DatePicker";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

const FinanceModalTab = ({ data }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [tax, setTax] = useState([]);
  const [oldlis, setOldLis] = useState([]);
  const [amcstatus, setAmcStatus] = useState([]);
  const [formData, setFormData] = useState({
    PurchageOrderAmount: "",
    CashAmount: "",
    ChequeAmount: "",
    Tax: "",
    GSTPercent: "",
    StartDate: "",
    PoDate: "",
    LiveDate: "",
    OnSupportDate: "",
    AmcDate: "",
    AmcStMonth: "",
    AmcAmount: "",
    AmcStatus: "",
    AmcTo: "",
    OldLis: "",
    TotalPoAmount: "",
    TotalGstVatAmount: "",
    NetPoAmount: "",
  });
  useEffect(() => {
    setFormData({
      ...formData,
      TotalPoAmount:
        Number(formData?.CashAmount) + Number(formData?.ChequeAmount),
    });
  }, [formData?.CashAmount, formData?.ChequeAmount]);
  useEffect(() => {
    if (formData?.Tax) {
      const calculate =
        (Number(formData?.TotalPoAmount) * Number(formData?.Tax)) / 100;
      setFormData({
        ...formData,
        TotalGstVatAmount: calculate,
        NetPoAmount: calculate + formData?.TotalPoAmount,
      });
    }
  }, [formData?.TotalPoAmount]);

  const searchHandleChange = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSelectChange = (e) => {
    const { name, value } = e?.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name == "Tax") {
      const calculate = (Number(formData?.TotalPoAmount) * Number(value)) / 100;
      setFormData({
        ...formData,
        [name]: value,
        TotalGstVatAmount: calculate,
        NetPoAmount: calculate + formData?.TotalPoAmount,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const getTax = () => {
    axiosInstances
      .post(apiUrls.GetGstTaxAndOldLisID, {})
      .then((res) => {
        const taxes = res?.data?.Tax?.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setTax(taxes);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAmcStatus = () => {
    axiosInstances
      .post(apiUrls.AMCType_Select, {})
      .then((res) => {
        const taxes = res?.data?.data?.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setAmcStatus(taxes);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getOLDLIS = () => {
    axiosInstances
      .post(apiUrls.GetGstTaxAndOldLisID, {})
      .then((res) => {
        const taxes = res?.data?.LIS?.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setOldLis(taxes);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const filldetails = () => {
    setFormData({
      ...formData,
      PurchageOrderAmount: data?.NetPoAmt,
      CashAmount: data?.PoCashAmt,
      ChequeAmount: data?.PoChequeAmt,
      Tax: data?.GstpercentId,

      StartDate: data?.startdate
        ? moment(data?.startdate, "YYYY-MM-DD").toDate()
        : new Date(),
      PoDate: data?.PODate
        ? moment(data?.PODate, "YYYY-MM-DD").toDate()
        : new Date(),

      LiveDate: data?.Livedate
        ? moment(data?.Livedate, "YYYY-MM-DD").toDate()
        : new Date(),

      OnSupportDate: data?.OnsiteSupportDate
        ? moment(data?.OnsiteSupportDate, "YYYY-MM-DD").toDate()
        : new Date(),
      AmcDate: data?.AMC_StartDate
        ? moment(data?.AMC_StartDate, "YYYY-MM-DD").toDate()
        : new Date(),
      AmcStMonth: data?.AMCStartmonth,
      AmcAmount: data?.AMCAmount,
      AmcStatus: data?.Amcid,
      AmcTo: data?.AMCper,
      OldLis: data?.OLDLISID,
      GSTPercent: data?.Gstpercent,
      ProjectID: data?.Id,
      AMCper: data?.AMCper,
      AMC: data?.AMC,
      Amcid: data?.Amcid,
      CurrentStatus: data?.CurrentStatus,
    });
  };

  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }
  const handleUpdate = () => {
    axiosInstances
      .post(apiUrls.UpdateFinancialInfo, {
        ProjectID: String(formData?.ProjectID),
        PoCashAmt: String(formData?.CashAmount),
        PoChequeAmt: String(formData?.ChequeAmount),
        NetPoAmt: String(formData?.NetPoAmount),
        CurrentStatus: String(formData?.CurrentStatus),
        startdate: String(formData?.StartDate),
        Livedate: String(formData?.LiveDate),
        OnsiteSupportDate: String(formatDate(formData?.OnSupportDate)),
        AMCStartDate: String(formatDate(formData?.AmcDate)),
        AMC: String(getlabel(formData?.AmcStatus, amcstatus)),
        Amcid: String(formData?.AmcStatus),
        AMCper: String(formData?.AmcTo),
        OLDLISID: String(formData?.OldLis),
        GstpercentId: String(formData?.Tax),
        Gstpercent: String(getlabel(formData?.Tax, tax)),
        PODate: String(formatDate(formData?.PoDate)),
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setFormData({});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTax();
    getAmcStatus();
    getOLDLIS();
    filldetails();
  }, []);
  const formattedPoDate = formData?.PoDate
    ? moment(formData.PoDate, "YYYY-MM-DD").format(VITE_DATE_FORMAT)
    : moment().format(VITE_DATE_FORMAT);
  return (
    <>
      <div className="card  p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {data?.NAME || data?.ProjectName}
        </span>
      </div>
      <div className="card">
        <div className="row m-2">
          <Input
            type="text"
            className="form-control"
            id="CashAmount"
            name="CashAmount"
            lable="PO Cash"
            placeholder=" "
            max={20}
            onChange={handleSelectChange}
            value={formData?.CashAmount}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="ChequeAmount"
            name="ChequeAmount"
            lable="PO Cheque"
            placeholder=" "
            max={20}
            onChange={handleSelectChange}
            value={formData?.ChequeAmount}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <ReactSelect
            style={{ marginLeft: "20px" }}
            name="Tax"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="Tax"
            dynamicOptions={tax}
            value={formData?.Tax}
            handleChange={handleDeliveryChange}
          />
          <Input
            type="text"
            className="form-control"
            id="TotalPoAmount"
            name="TotalPoAmount"
            lable="Total Po Amount"
            placeholder=" "
            max={20}
            onChange={handleSelectChange}
            value={formData?.TotalPoAmount}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            disabled={true}
          />
          <Input
            type="text"
            className="form-control"
            id="TotalGstVatAmount"
            name="TotalGstVatAmount"
            lable="Total Gst/Vat Amount"
            placeholder=" "
            max={20}
            onChange={handleSelectChange}
            value={formData?.TotalGstVatAmount}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            disabled={true}
          />
          <Input
            type="text"
            className="form-control"
            id="NetPoAmount"
            name="NetPoAmount"
            lable="Net Po Amount"
            placeholder=" "
            max={20}
            onChange={handleSelectChange}
            value={formData?.NetPoAmount}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            disabled={true}
          />
          <DatePicker
            className="custom-calendar"
            id="StartDate"
            name="StartDate"
            lable="StartDate"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.StartDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2"
            handleChange={searchHandleChange}
          />
          <DatePicker
            className="custom-calendar"
            id="PoDate"
            name="PoDate"
            lable="PoDate"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.PoDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2"
            handleChange={searchHandleChange}
          />
          <DatePicker
            className="custom-calendar"
            id="LiveDate"
            name="LiveDate"
            lable="LiveDate"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.LiveDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2"
            handleChange={searchHandleChange}
          />
          <DatePicker
            className="custom-calendar"
            id="OnSupportDate"
            name="OnSupportDate"
            lable="OnSupportDate"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.OnSupportDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2"
            handleChange={searchHandleChange}
          />
          <DatePicker
            className="custom-calendar"
            id="AmcDate"
            name="AmcDate"
            lable="AmcDate"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.AmcDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2"
            handleChange={searchHandleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="AmcStMonth"
            name="AmcStMonth"
            lable="AmcStartMonth"
            placeholder=" "
            max={20}
            onChange={handleSelectChange}
            value={formData?.AmcStMonth}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2"
          />
          <Input
            type="text"
            className="form-control"
            id="AmcAmount"
            name="AmcAmount"
            lable="AmcAmount"
            placeholder=" "
            max={20}
            onChange={handleSelectChange}
            value={formData?.AmcAmount}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2"
          />
          <ReactSelect
            style={{ marginLeft: "20px" }}
            name="AmcStatus"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2"
            placeholderName="AmcStatus"
            dynamicOptions={amcstatus}
            value={formData?.AmcStatus}
            handleChange={handleDeliveryChange}
          />
          <Input
            type="text"
            className="form-control"
            id="AmcTo"
            name="AmcTo"
            lable="Amc Percent"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.AmcTo}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2"
          />
          <ReactSelect
            style={{ marginLeft: "20px" }}
            name="OldLis"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2"
            placeholderName="OldLis"
            dynamicOptions={oldlis}
            value={formData?.OldLis}
            handleChange={handleDeliveryChange}
          />

          <button
            className="btn btn-sm btn-success mt-2 ml-2"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
};

export default FinanceModalTab;
