import React, { useEffect, useState } from "react";
import Input from "../../formComponent/Input";
import ReactSelect from "../../formComponent/ReactSelect";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { headers } from "../../../utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";
import Tables from ".";
import Heading from "../Heading";

import { values } from "lodash";
import { inputBoxValidation } from "../../../utils/utils";
import { max7digit } from "../../../utils/constant";
import Loading from "../../loader/Loading";
import { useTranslation } from "react-i18next";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";
const SettlementAmountModal = (visible, edit) => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [isEditVisible, setIsEditVisible] = useState(edit);
  const handleButtonClick = () => {
    setIsEditVisible(!isEditVisible);
  };
  const [sale, setSale] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ProjectName: "",
    BillingCompanyName: "",
    Address: "",
    GSTNumber: "",
    PanCardNo: "",
    Sale: "",
    NetAmount: "",
    PendingAmount: "",
    AdjustmentAmount: "",
    SalesNo: "",
    SalesID: "",
    ReceivedAmount: "",
    Balance: "",
    SettlementAmount: "",
    TDSAmount: "",
  });

  const handleSelectChange = (e) => {
    const { name, value } = e?.target;

    const adjustedValue = value.trim() === "" ? 0 : Number(value);

    if (name == "PendingAmount" || name == "SettlementAmount") {
      if (
        adjustedValue <= Number(formData?.NetAmount)
        // &&
        // adjustedValue <=
        //   Number(formData?.PayableAmount) - Number(formData?.PaidAmount)
      ) {
        setFormData({
          ...formData,
          [name]: value,
          // DueAmount:
          //   Number(formData?.PayableAmount) -
          //   Number(formData?.PaidAmount) -
          //   adjustedValue,
        });
      }
    } else if (name == "SettlementAmount") {
      setFormData({
        ...formData,
        [name]: value,
        PendingAmount:
          Number(formData?.NetAmount) -
          Number(formData?.SettlementAmount) -
          adjustedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDeliveryChange = (name, e) => {
    // console.log( e.SalesNo);

    const { value } = e;
    if (name == "Sale") {
      setFormData({
        ...formData,
        [name]: value,
        SalesNo: e.SalesNo,
        SalesID: e.SalesID,
        NetAmount: e.NetAmount,
        SettlementAmount: e.SettlementAmount,
        PendingAmount: e.PendingAmount,
        TDSAmount: e.TDSAmount,
      });
    } else
      setFormData({
        ...formData,
        [name]: value,
      });
  };

  const getSales = () => {
    const payload = {
      ProjectID: Number(visible?.visible?.showData?.ProjectID || "0"),
      OnAccount_Req_ID: String(visible?.visible?.showData?.EncryptID || ""),
    };

    axiosInstances
      .post(apiUrls?.Settlement_Select, payload)
      .then((res) => {
        const assigntos = res?.data?.data?.Sales?.map((item) => {
          return { label: item?.ItemName, value: item?.SalesID, ...item };
        });
        setSale(assigntos);

        setTableData([res?.data?.data?.dtOnAccountDetail[0]]);

        const dataID = res?.data?.Sales[0];
        console.log("restst", dataID);
        setFormData((prevState) => ({
          ...prevState, // Retain any existing values in formData
          Sale: dataID?.SalesID || "", // Set default value if null or undefined
          NetAmount: dataID?.NetAmount || 0, // Default to 0 if not available
          PendingAmount: dataID?.PendingAmount || 0,
          AdjustmentAmount: dataID?.Adjustment || 0,
          SalesNo: dataID?.SalesNo || "",
          SalesID: "", // Explicitly set SalesID as empty string
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getsalestable = () => {
    const payload = {
      ProjectID: Number(visible?.visible?.showData?.ProjectID || "0"),
      OnAccount_Req_ID: String(visible?.visible?.showData?.EncryptID || ""),
    };

    axiosInstances
      .post(apiUrls?.Settlement_Select, payload)
      .then((res) => {
        console.log("restst", res);
        setTableData([res?.data?.dtOnAccount_Req_ID[0]]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleReset = () => {
    setFormData({
      ...formData,
      ProjectName: "",
      BillingCompanyName: "",
      Address: "",
      GSTNumber: "",
      PanCardNo: "",
      // Sale: "",
      Sale: "",
      NetAmount: "",
      PendingAmount: "",
      AdjustmentAmount: "",
      SalesNo: "",
      SalesID: "",
      ReceivedAmount: "",
      Balance: "",
      SettlementAmount: "",
      TDSAmount: "",
    });
  };
  const handleSettlement = () => {
    const payload = {
      SalesID: Number(formData?.SalesID || "0"),
      OnAccount_Req_ID: Number(
        visible?.visible?.showData?.OnAccount_Req_ID || "0"
      ),
      SettlementAmount: Number(formData?.SettlementAmount || "0"),
      TDS: Number(formData?.TDSAmount || "0"),
    };

    axiosInstances
      .post(apiUrls?.SaveSettlement, payload)
      .then((res) => {
        if (res?.data?.success == true) {
          toast.success(res?.data?.message);
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        s;
      });
  };

  const SettlementCancel = () => {
    const payload = {
      RoleID: String(
        useCryptoLocalStorage("user_Data", "get", "RoleID") || "0"
      ),
      SettlementID: String(""),
      Reason: String(""),
    };

    axiosInstances
      .post(apiUrls?.Settlement, payload)
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getSales();
  }, []);
  return (
    <>
      <div className="card p-2">
        <div className="row d-flex m-2">
          <span style={{ fontWeight: "bold" }}>
            {t("Project")}: {visible?.visible?.showData?.ProjectName}
          </span>{" "}
          &nbsp; &nbsp; &nbsp; &nbsp;
          <span style={{ fontWeight: "bold" }}>
            {t("Non-Settled Amount")} : {tableData[0]?.ReceivedAmount}
          </span>{" "}
          &nbsp; &nbsp; &nbsp; &nbsp;
          <span style={{ fontWeight: "bold" }}>
            {t("Settled Amount")} : {tableData[0]?.SettledAmount}
          </span>{" "}
          &nbsp; &nbsp; &nbsp; &nbsp;
          <span style={{ fontWeight: "bold" }}>
            {t("Pending Amount for Settlement")} : {tableData[0]?.PendingAmount}
          </span>{" "}
          &nbsp;
        </div>
        <div className=" row mt-2">
          <ReactSelect
            name="Sale"
            respclass="col-md-3 col-12 col-sm-12"
            placeholderName={t("Sale")}
            dynamicOptions={sale}
            value={formData?.Sale}
            handleChange={handleDeliveryChange}
            // isDisabled={formData?.Sale == "" ? false : true}
          />

          <Input
            type="text"
            className="form-control"
            id="SaleID"
            name="SaleID"
            lable={t("SaleID")}
            onChange={handleSelectChange}
            value={formData?.SalesID}
            respclass="col-md-3 col-12 col-sm-12"
            disabled={true}
          />
          <Input
            type="text"
            className="form-control"
            id="SalesNo"
            name="SalesNo"
            lable={t("SalesNo")}
            onChange={handleSelectChange}
            value={formData?.SalesNo}
            respclass="col-md-3 col-12 col-sm-12"
            disabled={true}
          />
          <Input
            type="text"
            className="form-control"
            id="NetAmount"
            name="NetAmount"
            lable={t("Net Amount")}
            onChange={handleSelectChange}
            value={Math.floor(formData?.NetAmount)}
            respclass="col-md-3 col-12 col-sm-12"
            disabled={true}
          />
          <Input
            type="number"
            className="form-control mt-1"
            id="SettlementAmount"
            name="SettlementAmount"
            lable={t("Settlement Amount")}
            onChange={(e) => {
              inputBoxValidation(max7digit, e, handleSelectChange);
            }}
            value={formData?.SettlementAmount}
            respclass="col-md-3 col-12 col-sm-12"
          />
          <Input
            type="number"
            className="form-control mt-1"
            id="TDSAmount"
            name="TDSAmount"
            lable={t("TDS")}
            onChange={(e) => {
              inputBoxValidation(max7digit, e, handleSelectChange);
            }}
            value={formData?.TDSAmount}
            respclass="col-md-3 col-12 col-sm-12"
          />
          <Input
            type="text"
            className="form-control mt-1"
            id="PendingAmount"
            name="PendingAmount"
            lable={t("Pending Amount")}
            onChange={handleSelectChange}
            value={Math.floor(formData?.NetAmount - formData?.SettlementAmount)}
            respclass="col-md-3 col-12 col-sm-12"
            disabled={true}
          />

          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-primary mt-1 ml-3"
              onClick={handleSettlement}
            >
              {t("Save")}
            </button>
          )}

          <button
            className="btn btn-sm btn-primary mt-1 ml-3"
            onClick={handleReset}
          >
            {t("Reset")}
          </button>
        </div>
      </div>
      {/* <div className="card mt-2">
        <Heading title={"Search Details"} />
          <Tables
            thead={settlementTHEAD}
            tbody={tableData[0]?.map((ele, index) => ({
              "S.No.": index + 1,
              "Sales No": ele?.SalesNo,
              "Net Amount": ele?.NetAmount,
              "Adjustment Amount": ele?.Adjustment,
              "Pending Amount": ele?.PendingAmount,
              // Action: (
              //   <i
              //     className="fa fa-edit"
              //     style={{ cursor: "pointer" }}
              //     onClick={() => handleBillingEdit(ele)}
              //   ></i>
              // ),
            }))}
            tableHeight={"tableHeight"}
          />
        </div> */}
    </>
  );
};
export default SettlementAmountModal;
