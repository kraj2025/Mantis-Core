import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import moment from "moment";
import { Tooltip } from "primereact/tooltip";
import { toast } from "react-toastify";
import { exportToExcel } from "../../../../networkServices/Tools";
import DashboardTemplate from "../../DashboardTemplate";
import { ExcelIconSVG } from "../../../../utils/SVGICON";
import { maxLengthChecker, RedirectURL } from "../../utils";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import DatePicker from "../../../../components/formComponent/DatePicker";
import Tables from "../../../../components/UI/customTable";
import { apiUrls } from "../../../../networkServices/apiEndpoints";
import { headers } from "../../../../utils/apitools";
import axios from "axios";

const TransactionHistory = ({ clientCode }) => {
  const [t] = useTranslation();

  const [tableData, setTableData] = useState([]);
  const [apiURL, setApiURL] = useState("");
  const [values, setValues] = useState({
    fromDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    toDate: new Date(),
    type: { value: "1" },
  });
  <Tooltip target=".remark-tooltip" />;
  const initioalThead = [
    { name: "Transaction Date", width: "1%" },
    { name: "Transaction No", width: "20%" },
    { name: "Transaction Type", width: "10%" },
    { name: "Remark", width: "30%" },
    { name: "Recharge Amount", width: "30%" },
    { name: "Opening", width: "30%" },
    { name: "Credit", width: "30%" },
    { name: "Debit", width: "30%" },
    { name: "Running Balance", width: "30%" },
    // { name: "colorcode", width: "30%", hidden: true },
  ];
  const [THEAD, setTHEAD] = useState(initioalThead);

  useEffect(() => {
    if (values?.type?.value === "1") {
      setTHEAD(initioalThead);
    } else {
      setTHEAD(THEAD?.filter((val) => val?.name !== "Opening"));
    }
  }, [values?.type?.value]);

  const handleTabelData = (data) => {
    console.log("Data", data);
    if (values?.type?.value === "1") {
      const tableResp = data
        ?.slice(-500)
        ?.filter(
          (val) =>
            val?.TransactionType === "DebitNote" ||
            val?.TransactionType === "Recharge"
        )
        ?.map(
          (
            {
              EntryDate,
              TransactionNo,
              TransactionType,
              Remarks,
              RechargeAmount,
              Opening,
              Credit,
              Debit,
              RunningBal,
            },
            index
          ) => ({
            EntryDate: EntryDate,
            TransactionNo: TransactionNo,
            TransactionType: TransactionType,

            Remark: (
              <>
                <span id={`BedNo-tooltip-${index}`}>
                  {maxLengthChecker(Remarks, 50)}
                </span>
                {Remarks?.length > 10 && (
                  <Tooltip
                    target={`#BedNo-tooltip-${index}`}
                    content={Remarks}
                  />
                )}
              </>
            ),

            RechargeAmount: RechargeAmount,
            Opening: Opening ? Opening?.toFixed(2) : "0.00",
            Credit: Credit ? Credit?.toFixed(2) : "0.00",
            Debit: Debit ? Debit?.toFixed(2) : "0.00",
            RunningBal: RunningBal ? RunningBal?.toFixed(2) : "0.00",
          })
        );
      return [
        ...tableResp,
        {
          EntryDate: "",
          TransactionNo: "",
          TransactionType: "",
          Remark: "",
          RechargeAmount: "",
          Opening: "Total",
          Credit: tableResp
            ?.reduce((acc, curr) => acc + parseFloat(curr?.Credit || 0), 0)
            ?.toFixed(2),
          Debit: tableResp
            ?.reduce((acc, curr) => acc + parseFloat(curr?.Debit || 0), 0)
            ?.toFixed(2),
          RunningBal: "",
          colorcode: "#DCCFF0",
        },
      ];
    } else {
      const tableRespData = data
        ?.slice(-500)
        ?.map(
          (
            {
              EntryDate,
              TransactionNo,
              TransactionType,
              Remarks,
              RechargeAmount,
              Opening,
              Credit,
              Debit,
              RunningBal,
            },
            index
          ) => ({
            EntryDate: EntryDate,
            TransactionNo: TransactionNo,
            TransactionType: TransactionType,
            Remark: (
              <>
                <span id={`BedNo-tooltip-${index}`}>
                  {maxLengthChecker(Remarks, 50)}
                </span>
                {Remarks?.length > 10 && (
                  <Tooltip
                    target={`#BedNo-tooltip-${index}`}
                    content={Remarks}
                  />
                )}
              </>
            ),
            RechargeAmount: RechargeAmount,
            // Opening: Opening ? Opening?.toFixed(2) : "0.00",
            Credit: Credit ? Credit?.toFixed(2) : "0.00",
            Debit: Debit ? Debit?.toFixed(2) : "0.00",
            RunningBal: RunningBal ? RunningBal?.toFixed(2) : "0.00",
          })
        );
      return [
        ...tableRespData,
        {
          EntryDate: "",
          TransactionNo: "",
          TransactionType: "",
          Remark: "",
          RechargeAmount: "Total",
          // Opening: "Total",
          Credit: tableRespData
            ?.reduce((acc, curr) => acc + parseFloat(curr?.Credit || 0), 0)
            ?.toFixed(2),
          colorcode: "#DCCFF0",
          Debit: tableRespData
            ?.reduce((acc, curr) => acc + parseFloat(curr?.Debit || 0), 0)
            ?.toFixed(2),
          RunningBal: "",
        },
      ];
    }
  };

  // const THEAD = [
  //     { name: "Transaction Date", width: "1%" },
  //     { name: "Transaction No", width: "30%" },
  //     { name: "Transaction Type", width: "30%" },
  //     { name: "Recharge Amount", width: "30%" },
  //     { name: "Opening", width: "30%" },
  //     { name: "Credit", width: "30%" },
  //     { name: "Debit", width: "30%" },
  //     { name: "Running Balance", width: "30%" }
  // ]

  const getAPIURL = async (clientCode) => {
    const apiResp = await AIReportsAIClientDetails(clientCode);
    if (apiResp?.success) {
      setApiURL(apiResp?.data[0]?.EndPointURL);
    }
    return apiResp?.data[0];
  };

  async function AIClientLedger() {
    const payload = {
      clientCode: clientCode,
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
    };
    let apiResp = await AIClientLedgerAPI(payload);
    if (apiResp?.success) {
      setTableData(apiResp?.data);
    } else {
      setTableData([]);
    }
  }
  const handleAIClientLedger = () => {
    let form = new FormData();
    form.append("clientCode", "REACT2025e8d7c6b5a4f3e2d1c0b"),
      form.append("fromDate", moment(values?.fromDate).format("YYYY-MM-DD")),
      form.append("toDate", moment(values?.toDate).format("YYYY-MM-DD")),
      axios
        .post(apiUrls?.AIClientLedger, form, {
          headers,
        })
        .then((res) => {
          setTableData(res.data.data);
        })
        .catch((err) => console.log(err));
  };
  useEffect(() => {
    getAPIURL(clientCode);
    AIClientLedger();
  }, [values?.fromDate, values?.toDate, values?.type?.value]);

  const handleChange = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const DownloadExcel = () => {
    exportToExcel(tableData, "AI Dashboard Report");
  };

  const handlePrint = async () => {
    const payload = {
      clientCode: clientCode,
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
    };

    const response = await AIReportsAIClientLedgerPrint(payload);
    if (response?.success) {
      RedirectURL(response?.data);
    } else {
      toast.error(response?.message, "error");
    }
  };

  useEffect(() => {
    handleAIClientLedger();
  }, []);
  return (
    <div>
      <Tooltip
        target={`#remark`}
        position="top"
        content={"test"}
        event="focus"
        className="ToolTipCustom"
      />
      <div className="row p-2">
        <ReactSelect
          placeholderName={"Type"}
          id={"Type"}
          searchable={true}
          name={"type"}
          dynamicOptions={[
            { label: "Recharge History", value: "1" },
            { label: "Transaction History", value: "2" },
          ]}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          handleChange={(name, value) => {
            handleChange(name, value);
          }}
          value={values?.type?.value}
          removeIsClearable={true}
        />

        <DatePicker
          className="custom-calendar"
          placeholder=""
          lable="From Date" // Corrected to "lable"
          name="fromDate"
          id="From"
          value={values?.fromDate}
          handleChange={(e) => handleChange("fromDate", e?.target?.value)}
        />
        <DatePicker
          className="custom-calendar ml-2"
          placeholder=""
          lable="To Date" // Corrected to "lable"
          name="toDate"
          id="toDate"
          value={values?.toDate}
          handleChange={(e) => handleChange("toDate".e?.target?.value)}
        />

        <div
          className=" mb-3 ml-3 d-flex justify-content-end"
          style={{ gap: "10px" }}
        >
          {/* <div onClick={() => handlePrint()}>
            <PDFIconSVG />
          </div> */}
          <div onClick={DownloadExcel}>
            <ExcelIconSVG />
          </div>
        </div>
      </div>

      <Tables
        thead={THEAD}
        tbody={handleTabelData(tableData)}
        handleClassOnRow={(val, name) => {
          if (
            name === "Running Balance" ||
            name === "Credit" ||
            name === "Debit"
          ) {
            return "text-right";
          }
          return "";
        }}
        style={{ maxHeight: "50vh" }}
      />

      <DashboardTemplate
        thead={THEAD?.map((val) => val?.name)}
        tbody={handleTabelData(tableData)}
        Header={"AI Dashboard Report"}
        TimeDuration={values?.type?.label}
      />
    </div>
  );
};

export default TransactionHistory;
