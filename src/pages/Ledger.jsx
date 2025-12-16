import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import { headers } from "../utils/apitools";
import { apiUrls } from "../networkServices/apiEndpoints";
import axios from "axios";
import ReactSelect from "../components/formComponent/ReactSelect";
import Tables from "../components/UI/customTable";
import {
  ledgerPendingThead,
  ledgerTDSThead,
  ledgerThead,
} from "../components/modalComponent/Utils/HealperThead";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

const Ledger = () => {
  const [project, setProject] = useState([]);
  const [tableData, setTableData] = useState([
    {
      "S.No.": 1,
      Date: "2025-01-01",
      InvoiceNo: "ITD66766",
      Particular: "Product A",
      Amount: "1000.00",
      Status: "Paid",
    },
    {
      "S.No.": 2,
      Date: "2025-01-02",
      InvoiceNo: "ITD66767",
      Particular: "Product B",
      Amount: "2000.00",
      Status: "Unpaid",
    },
    {
      "S.No.": 3,
      Date: "2025-01-03",
      InvoiceNo: "ITD66768",
      Particular: "Service C",
      Amount: "1500.00",
      Status: "Pending",
    },
    {
      "S.No.": 4,
      Date: "2025-01-04",
      InvoiceNo: "ITD66769",
      Particular: "Product D",
      Amount: "2500.00",
      Status: "Cancelled",
    },
    {
      "S.No.": 5,
      Date: "2025-01-05",
      InvoiceNo: "ITD66770",
      Particular: "Service E",
      Amount: "3000.00",
      Status: "Paid",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Project: "",
    FinancialYear: "2024-25",
  });

  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {
  "ProjectID": 0,
  "IsMaster": "0",
  "VerticalID": 0,
  "TeamID": 0,
  "WingID": 0
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname") ),
    //   axios
    //     .post(apiUrls?.ProjectSelect, form, { headers })
        .then((res) => {
          const poc3s = res?.data?.data?.map((item) => {
            return { label: item?.Project, value: item?.ProjectId };
          });
          setProject(poc3s);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    getProject();
  }, []);
  return (
    <>
      <div className="card">
        <Heading title={"Ledger"} isBreadcrumb={true} />
        <div className="row m-2">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Project"
            placeholderName="Project"
            dynamicOptions={project}
            handleChange={handleDeliveryChange}
            value={formData?.Project}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="FinancialYear"
            placeholderName="Financial Year"
            dynamicOptions={[
              { label: "2023-24", value: "2023-24" },
              {
                label: "2024-25",
                value: "2024-25",
              },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.FinancialYear}
          />
          <div className="col-sm-2">
            <button className="btn btn-sm btn-primary"> Search</button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="card mt-2">
            <Heading
              title={
                <span style={{ fontWeight: "bold" }}>
                  Details of Received Amount
                </span>
              }
              secondTitle={
                <div style={{ display: "flex", fontWeight: "bold" }}>
                  <span className="ml-4">
                    Total Amount :&nbsp;{" "}
                    {tableData
                      .reduce((sum, item) => sum + parseFloat(item.Amount), 0)
                      .toFixed(2)}
                  </span>
                  <span className="ml-4">
                    Total Record :&nbsp; {tableData?.length}
                  </span>
                </div>
              }
            />
            <Tables
              thead={ledgerTDSThead}
              tbody={tableData?.map((ele, index) => ({
                "S.No.": index + 1,
                Date: ele?.Date,
                "InvoiceNo.": ele?.InvoiceNo,
                Particular: ele?.Particular,
                Amount: ele?.Amount,
                TDS: ele?.Amount,
                colorcode: ele?.rowColor,
              }))}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="card mt-2">
            <Heading
              title={
                <span style={{ fontWeight: "bold" }}>
                  Details of Billing Amount
                </span>
              }
              secondTitle={
                <div style={{ display: "flex", fontWeight: "bold" }}>
                  <span className="ml-4">
                    Total Amount :&nbsp;{" "}
                    {tableData
                      .reduce((sum, item) => sum + parseFloat(item.Amount), 0)
                      .toFixed(2)}
                  </span>
                  <span className="ml-4">
                    Total Record :&nbsp; {tableData?.length}
                  </span>
                </div>
              }
            />
            <Tables
              thead={ledgerThead}
              tbody={tableData?.map((ele, index) => ({
                "S.No.": index + 1,
                Date: ele?.Date,
                "InvoiceNo.": ele?.InvoiceNo,
                Particular: ele?.Particular,
                Amount: ele?.Amount,
                Status: ele?.Status,
                colorcode: ele?.rowColor,
              }))}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="card mt-2">
            <Heading
              title={
                <span style={{ fontWeight: "bold" }}>
                  Details of Pending Amount
                </span>
              }
              secondTitle={
                <div style={{ display: "flex", fontWeight: "bold" }}>
                  <span className="ml-4">
                    Total Amount :&nbsp;{" "}
                    {tableData
                      .reduce((sum, item) => sum + parseFloat(item.Amount), 0)
                      .toFixed(2)}
                  </span>
                  <span className="ml-4">
                    Total Record :&nbsp; {tableData?.length}
                  </span>
                </div>
              }
            />
            <Tables
              thead={ledgerPendingThead}
              tbody={tableData?.map((ele, index) => ({
                "S.No.": index + 1,
                Date: ele?.Date,
                "InvoiceNo.": ele?.InvoiceNo,
                Particular: ele?.Particular,
                Amount: ele?.Amount,
                Status: ele?.Status,
                colorcode: ele?.rowColor,
              }))}
            />
          </div>
        </div>
        <div className="col-6"></div>
      </div>
    </>
  );
};

export default Ledger;
