import React, { useState } from "react";
import Heading from "../../components/UI/Heading";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";

const AdvanceRequestSettlement = () => {
      const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [formData, setFormData] = useState({
    AdvanceRequestAmount: "",
    LastAdvanceRequest: "",
    LastAdvanceRequestDate: "",
    ExpenseSubmitAmount: "",
    NotExpenseSubmitAmount: "",
    PendingExpenseSubmitAmount: "",
    LedgerExpenseSubmitAmount: "",
  });

  const searchHandleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  return (
    <>
      <div className="card">
        <Heading title={<span style={{fontWeight:"bold"}}>Advance Request Settlement</span>}/>
        <div className="row m-2">
          <Input
            type="text"
            className="form-control"
            id="AdvanceRequestAmount"
            name="AdvanceRequestAmount"
            lable="Advance Request"
            placeholder=""
            onChange={searchHandleChange}
            value={formData?.AdvanceRequestAmount}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="LastAdvanceRequest"
            name="LastAdvanceRequest"
            lable="Last Advance Request"
            placeholder=""
            onChange={searchHandleChange}
            value={formData?.LastAdvanceRequest}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="LastAdvanceRequest"
            name="LastAdvanceRequest"
            lable="Last Advance Request"
            placeholder=""
            onChange={searchHandleChange}
            value={formData?.LastAdvanceRequest}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <DatePicker
            className="custom-calendar"
            id="LastAdvanceRequestDate"
            name="LastAdvanceRequestDate"
            lable={t("Last AdvanceRequest Date")}
            placeholder={VITE_DATE_FORMAT}
            value={formData?.LastAdvanceRequestDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="ExpenseSubmitAmount"
            name="ExpenseSubmitAmount"
            lable="ExpenseSubmitAmount"
            placeholder=""
            onChange={searchHandleChange}
            value={formData?.ExpenseSubmitAmount}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="NotExpenseSubmitAmount"
            name="NotExpenseSubmitAmount"
            lable="NotExpenseSubmitAmount"
            placeholder=""
            onChange={searchHandleChange}
            value={formData?.NotExpenseSubmitAmount}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="PendingExpenseSubmitAmount"
            name="PendingExpenseSubmitAmount"
            lable="TotalSubmitAmount"
            placeholder=""
            onChange={searchHandleChange}
            value={formData?.PendingExpenseSubmitAmount}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="LedgerExpenseSubmitAmount"
            name="LedgerExpenseSubmitAmount"
            lable="LedgerSubmitAmount"
            placeholder=""
            onChange={searchHandleChange}
            value={formData?.LedgerExpenseSubmitAmount}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <button className="btn btn-sm btn-success ml-2">Save</button>
        </div>
      </div>
    </>
  );
};

export default AdvanceRequestSettlement;
