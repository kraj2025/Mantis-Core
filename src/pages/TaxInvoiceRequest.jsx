import React, { useEffect, useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";
import axios, { formToJSON } from "axios";
import { headers } from "../utils/apitools";
import Input from "../components/formComponent/Input";
import Tables from "../components/UI/customTable";
import {
  taxinvoicesTHEAD,
} from "../components/modalComponent/Utils/HealperThead";

import { inputBoxValidation } from "../utils/utils";
import { apiUrls } from "../networkServices/apiEndpoints";
import Heading from "../components/UI/Heading";
import { toast } from "react-toastify";
import DatePicker from "../components/formComponent/DatePicker";
import Loading from "../components/loader/Loading";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import {
  GST_VALIDATION_REGX,
  PANCARD_VALIDATION_REGX,
} from "../utils/constant";
import AddNewCompany from "./AddNewCompany";
import Modal from "../components/modalComponent/Modal";
import AddNewShippingCompany from "./AddNewShippingCompany";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const TaxInvoiceRequest = ({ data }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  // console.log("quotaton dataa", state);
  const [billingcompany, setBillingCompany] = useState([]);
  const [shippingcompany, setShippingCompany] = useState([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableData1, setTableData1] = useState([]);
  // console.log("tableData1", tableData1);
  const [statedata, setStatedata] = useState([]);
  const [project, setProject] = useState([]);
  const [category, setCategory] = useState([]);
  const [terms, setTerms] = useState([]);
  const [items, setItems] = useState([]);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [formData, setFormData] = useState({
    Project: "",
    Category: "",
    Items: "",
    Address: "",
    GstNumber: "",
    PanCardNo: "",
    TaxableAmount: "",
    SgstAmount: "",
    CgstAmount: "",
    TotalRate: "",
    TotalQuantity: "",
    TotalDiscount: "",
    TotalAmount: "",
    RoundOff: "",
    TotalTax: "",
    SalesDate: new Date(),
    PoNumber: "",
    ItemName: "",
    ////////////////

    BillingCompany: "",
    BillingAddress: "",
    BillingState: "",
    BillingGST: "",
    BillingPanCard: "",
    ShippingCompany: "",
    ShippingAddress: "",
    ShippingState: "",
    ShippingGST: "",
    Sales: "",
    ShippingPanCard: "",
    ExpectedDate: "",
    Terms: "",
    OtherReason: "",
    ExpiryDate: new Date(),
  });

  useEffect(() => {
    if (data) {
      // console.log("Data:", data);
      if (data?.ProjectID) {
        handleDeliveryChange("Project", { value: data.ProjectID });
      }
    }
  }, [data]);

  const getCompanyShipping = (proj) => {
    axiosInstances
      .post(apiUrls.BillingCompanyDetail_Select_ID,{
  "BillingCompanyID": Number(proj)
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("BillingCompanyID", proj),
    //   // form.append("IsActive", "1"),
    //   axios
    //     .post(apiUrls?.BillingCompanyDetail_Select_ID, form, { headers })
        .then((res) => {
          // console.log("billingcompanydetail",res?.data?.data[0])
          setFormData((val) => ({
            ...val,
            // BillingAddress: res?.data?.data[0]?.BillingAddress,
            // BillingState: res?.data?.data[0]?.StateID,
            // BillingGST: res?.data?.data[0]?.GSTNo,
            // BillingPanCard: res?.data?.data[0]?.PanCardNo,

            ShippingAddress: res?.data?.data[0]?.BillingAddress,
            ShippingState: res?.data?.data[0]?.StateID,
            ShippingGST: res?.data?.data[0]?.GSTNo,
            ShippingPanCard: res?.data?.data[0]?.PanCardNo,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const handleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleDeliveryChange = (name, e, index) => {

    const { value } = e;
    /////////////////////////////////////
    if (name == "BillingCompany") {
      // console.log("formdata-formdata", formData, name, value);
      setFormData({
        ...formData,
        [name]: value,
      });
      getCompanyBill(value);
    }
    if (name == "ShippingCompany") {
      // console.log("formdata-formdata", formData, name, value);
      setFormData({
        ...formData,
        [name]: value,
      });
      getCompanyShipping(value);
    }
    //////////////////////////////
    if (name == "Project") {
      if (data) {
        setFormData({
          ...formData,
          [name]: value,
          // Items: data?.ItemName,
        });
        // handleGetItemRate({ label: data?.ItemName, value: "" });
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
      handleGetItemSearch(value);
      getCompany(value);
    } else if (name == "PaymentMode") {
      const updatedTableData = [...tableData];
      updatedTableData[index] = {
        ...updatedTableData[index],
        Amount:
          value != "Cash"
            ? updatedTableData[index]?.Rate *
                updatedTableData[index]?.Quantity -
              updatedTableData[index]?.Discount +
              (updatedTableData[index]?.Rate *
                updatedTableData[index]?.Quantity -
                updatedTableData[index]?.Discount) *
                0.18
            : updatedTableData[index]?.Rate *
                updatedTableData[index]?.Quantity -
              updatedTableData[index]?.Discount,

        PaymentMode: value,
        TaxAmount:
          value === "Cash"
            ? 0
            : (updatedTableData[index]?.Rate *
                updatedTableData[index]?.Quantity -
                updatedTableData[index]?.Discount) *
              0.18,
        TaxPercent: value === "Cash" ? 0 : 18,
        // TaxAmount: value === "Cash" ? 0 : value,
      };

      setFormData({
        ...formData,
        TotalTax: 0,
      });
      // setFormData({
      //   ...formData,
      //   TotalTax: value === "Cash"
      //   ? 0
      //   : ((updatedTableData[index]?.Rate * updatedTableData[index]?.Quantity) - (updatedTableData[index]?.Discount)) * 0.18,
      // });
      setTableData(updatedTableData);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDeliveryChangeItems = (name, value) => {
    if (name == "Items") {
      handleGetItemRate({
        label: value?.label,
        value: value.value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleGetItemRate = (value) => {
    // console.log(value);
    axiosInstances
      .post(apiUrls.Quotation_Select,{
  "ProjectID": String(formData?.Project),
  "ItemID":  String(value?.value ? value?.value : value.ItemID),
  "ItemName": String(value?.label ? value?.label : value.ItemName),
  "SearchType": "Rate"
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("RoleID", useCryptoLocalStorage("user_Data", "get", "RoleID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname") ),
    //   form.append("ProjectID", formData?.Project),
    //   form.append("ItemID", value?.value ? value?.value : value.ItemID),
    //   form.append("ItemName", value?.label ? value?.label : value.ItemName),
    //   form.append("SearchType", "Rate"),
    //   axios
    //     .post(apiUrls?.Quotation_Select, form, { headers })
        .then((res) => {
          let data = res?.data?.data[0];
          data.Amount = data.Rate * 1 + data.Rate * 0.18;
          data.SalesLabel = data.service = value;
          data.Quantity = 1;
          data.Discount = 0;
          data.DiscountPercent = 0;
          data.PaymentMode = "Online";
          data.TaxAmount = data.Rate * 0.18;
          data.TaxPercent = 18;
          // data.TaxPercent = data.PaymentMode === "Cash" ? 0 : 18;
          setTableData((val) => [...val, data]);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect,{
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
          const poc3s = res?.data.data.map((item) => {
            return { label: item?.Project, value: item?.ProjectId };
          });
          // getCompany(poc3s[0]?.value);
          setProject(poc3s);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const getTerms = () => {
    axiosInstances
      .post(apiUrls.PaymentTerms_Select,{})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   // form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname") ),
    //   axios
    //     .post(apiUrls?.PaymentTerms_Select, form, { headers })
        .then((res) => {
          const poc3s = res?.data.data.map((item) => {
            return { label: item?.NAME, value: item?.ID };
          });
          // getCompany(poc3s[0]?.value);
          setTerms(poc3s);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  // console.log("lotus", companyData);
  const othersReason = terms?.find(
    (item) => item?.label == "Others" && formData?.Terms == item?.value
  );
  const getCompany = (proj) => {
    axiosInstances
      .post(apiUrls.BillingCompany_Select,{
  "ProjectID": Number(proj),
  "IsActive": "1"
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("ProjectID", proj),
    //   form.append("IsActive", "1"),
    //   axios
    //     .post(apiUrls?.BillingCompany_Select, form, { headers })
        .then((res) => {
          const poc3s = res?.data.data.map((item) => {
            return { label: item?.BillingCompanyName, value: item?.BillingID };
          });
          setBillingCompany(poc3s);

          setFormData((val) => ({
            ...val,
            BillingCompany: res?.data?.data[0]?.BillingID,
            BillingAddress: res?.data?.data[0]?.BillingAddress,
            BillingState: res?.data?.data[0]?.StateID,
            BillingGST: res?.data?.data[0]?.GSTNo,
            BillingPanCard: res?.data?.data[0]?.PanCardNo,

            ShippingCompany: res?.data?.data[0]?.BillingID,
            ShippingAddress: res?.data?.data[0]?.BillingAddress,
            ShippingState: res?.data?.data[0]?.StateID,
            ShippingGST: res?.data?.data[0]?.GSTNo,
            ShippingPanCard: res?.data?.data[0]?.PanCardNo,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const getCompanyBill = (proj) => {
    axiosInstances
      .post(apiUrls.BillingCompanyDetail_Select_ID,{
  "BillingCompanyID": Number(proj)
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("BillingCompanyID", proj),
    //   // form.append("IsActive", "1"),
    //   axios
    //     .post(apiUrls?.BillingCompanyDetail_Select_ID, form, { headers })
        .then((res) => {
          setFormData((val) => ({
            ...val,
            BillingAddress: res?.data?.data[0]?.BillingAddress,
            BillingState: res?.data?.data[0]?.StateID,
            BillingGST: res?.data?.data[0]?.GSTNo,
            BillingPanCard: res?.data?.data[0]?.PanCardNo,
            // ShippingAddress: res?.data?.data[0]?.BillingAddress,
            // ShippingState: res?.data?.data[0]?.StateID,
            // ShippingGST: res?.data?.data[0]?.GSTNo,
            // ShippingPanCard: res?.data?.data[0]?.PanCardNo,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const handleRemoveRow = (index) => {
    const updatedRows = tableData1?.filter((_, rowIndex) => rowIndex !== index);
    setTableData1(updatedRows);
  };

  const handleReset = () => {
    setFormData({
      ...formData,
      Terms: "",
    });
    setTableData1([]);
  };
  const handleCalculateTableData = (obj) => {
    console.log(obj);
    const GrossAmount = Number(obj.Rate) * Number(obj.Quantity);
    const DiscountAmount = Number(obj.Discount);
    const TaxAmount = (Number(GrossAmount) - Number(DiscountAmount)) * 0.18;
    const NetAmount =
      Number(GrossAmount) - Number(DiscountAmount) + Number(TaxAmount);
    const TaxPercentage = 18;
    const Amount = obj.Quantity * obj.Rate - obj.Discount + TaxAmount;

    const roundedTotalAmount = Math.round(Number(Amount) * 100) / 100;

    obj.GrossAmount = GrossAmount;
    obj.DiscountAmount = DiscountAmount;
    obj.TaxAmount = TaxAmount;
    obj.NetAmount = NetAmount;
    obj.Amount = Amount;
    obj.roundedTotalAmount = roundedTotalAmount;
    return obj;
  };

  const handleSelectChange = (e, index) => {
    const { name, value, checked, type } = e?.target;
    const mainData = [...tableData];
    const modifiedData = { ...mainData[index] };
    modifiedData[name] = type === "checkbox" ? (checked ? "1" : "0") : value;

    // console.log(modifiedData);

    const rate = Number(modifiedData.Rate);
    const quantity = Number(modifiedData?.Quantity);
    const discountPercent = Number(modifiedData?.DiscountPercent);

    if (name !== "Discount") {
      if (!isNaN(rate) && !isNaN(quantity) && !isNaN(discountPercent)) {
        modifiedData.Discount = (
          rate *
          quantity *
          discountPercent *
          0.01
        ).toFixed(2);
      } else {
        modifiedData.Discount = "0"; // or handle as needed
      }
    }

    if (name !== "DiscountPercent") {
      const discount = Number(modifiedData.Discount);

      if (
        !isNaN(discount) &&
        !isNaN(rate) &&
        !isNaN(quantity) &&
        quantity > 0
      ) {
        modifiedData.DiscountPercent = (
          (discount * 100) /
          (rate * quantity)
        ).toFixed(2);
      } else {
        modifiedData.DiscountPercent = "0"; // or handle as needed
      }
    }

    if (name === "RoundOff") {
      if (checked) {
        // When RoundOff is selected, round the Amount
        setFormData({
          ...formData,
          [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
          TotalAmount: Math.round(formData?.TotalAmount),
        });
        return;
      } else {
        setFormData({
          ...formData,
          [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
        });
      }
    }

    const response = handleCalculateTableData(modifiedData);
    console.log("responseresponse", response);
    if (name === "DiscountPercent" || name === "Quantity" || name === "Rate") {
      // if(Number(response?.DiscountPercent)>100){
      //   response["DiscountPercent"] = "99"
      // }
      if (modifiedData.PaymentMode === "Cash") {
        const discount = Number(modifiedData.Discount);
        response["TaxAmount"] = 0;
        response["Amount"] =
          response?.GrossAmount -
          response?.DiscountAmount +
          response?.TaxAmount;
      }
      console.log("venumnnnn", response);
    }

    mainData[index] = response;
    // Set the updated table data in the state
    setTableData(mainData);
  };

  useEffect(() => {
    getProject();
    // getCompany()
  }, []);

  const handleGetItemSearch = (value) => {
    axiosInstances
      .post(apiUrls.Quotation_Select,{
  "ProjectID": String(value),
  "ItemID": "",
  "ItemName": "",
  "SearchType": "GetItem"
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("RoleID", useCryptoLocalStorage("user_Data", "get", "RoleID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname") ),
    //   form.append("ProjectID", value),
    //   form.append("ItemID", ""),
    //   form.append("ItemName", ""),
    //   form.append("SearchType", "GetItem"),
    //   axios
    //     .post(apiUrls?.Quotation_Select, form, { headers })
        .then((res) => {
          const poc3s = res?.data.data.map((item) => {
            return { label: item?.ItemNameGroup, value: item?.ItemIDGroup };
          });
          setItems(poc3s);
          // setFormData((val)=>({
          //   ...val,
          //   ItemName:formData?.ItemName
          // }))
        })
        .catch((err) => {
          console.log(err);
        });
  };

  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }

  const handleSaveOthers = () => {
    if (formData.OtherReason.trim() && formData.OtherReason !== "Others") {
      setTableData1((prev) => [
        ...prev,
        { Terms: formData.OtherReason.trim() },
      ]);
      setFormData((prevFormData) => ({
        ...prevFormData,
        OtherReason: "",
      }));
    }
  };

  const handleUpdate = () => {
    // let ids=[]
    // tableData?.map((val,index)=>{
    //     console.log("iddssss",val)
    //   ids+=`${index ,val?.service?.value},`
    // })
    let payload = [];
    tableData?.map((val, index) => {
      // console.log("valllll", val);
      payload.push({
        Installment_No: index,
        Remark: val?.Remark,
        IsPaid: val?.isPaid ? "1" : "0",
        ExpectedDate: moment(val?.ExpectedDate).format("YYYY-MM-DD"),
        ItemID: val?.service?.value,
        ItemName: val?.service?.label,
        SAC: "",
        IsActive: "",
        PaymentMode: val?.PaymentMode,
        TaxAmount: val?.Tax,
        TaxPrecentage: val?.TaxPercent,
        Rate: val?.Rate,
        Quantity: val?.Quantity,
        DiscountAmount: val?.Discount,
        Amount: val?.Amount,
        EndDate: moment(val?.EndDate).format("YYYY-MM-DD"),
        GrossAmount: val?.GrossAmount,
      });
      // console.log("data of payload", payload);
    });

    // console.log("payload data", payload);
    const NetAmount =
      payload[0]?.Amount + payload[0]?.DiscountAmount - payload[0]?.TaxAmount;

    const GrossAmount = payload[0]?.Rate * payload[0]?.Quantity;

    const Tax =
      (payload[0]?.Rate * payload[0]?.Quantity - payload[0]?.DiscountAmount) *
      0.18;

    const Amount =
      payload[0]?.Rate * payload[0]?.Quantity -
      payload[0]?.DiscountAmount +
      (payload[0]?.Rate * payload[0]?.Quantity - payload[0]?.DiscountAmount) *
        0.18 +
      payload[0]?.Amount;
    // console.log("Amount", Amount);

    setLoading(true);
    const payloadData = {
  QuotationID: state?.data || "",
  ProjectID: formData?.Project || 0,
  ProjectName: getlabel(formData?.Project, project) || "",
  BillingCompanyID: 0, // you passed "" in FormData, schema expects number
  BillingCompanyName: "",
  BillingCompanyAddress: "",
  BillingState: "",
  GSTNo: formData?.GstNumber || "",
  PanCardNo: formData?.PanCardNo || "",
  ShippingCompanyID: 0,
  ShippingCompanyName: "",
  ShippingCompanyAddress: "",
  ShippingState: "",
  ShippingGSTNo: "", // not present in FormData, added to match schema
  ShippingPanCardNo: "", // not present in FormData, added to match schema
  GrossAmount: Number(GrossAmount) || 0,
  DiscountAmount: Number(payload[0]?.DiscountAmount) || 0,
  TaxAmount: Number(Tax) || 0,
  Tax_Per: 18,
  CGST_Amount: Number(formData?.CgstAmount) || 0,
  SGST_Amount: Number(formData?.SgstAmount) || 0,
  IGST_Amount: 0,
  CGST_Per: 0,
  SGST_Per: 0,
  IGST_Per: 0,
  RoundOff: Number(formData?.RoundOff) || 0,
  Document_Base64: "",
  Document_FormatType: "",
  ItemData: payload || [],
  PaymentTerms: [], // not in FormData, add if you have termsPayload
};

    axiosInstances
      .post(apiUrls.Quotation_Update,payloadData)
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("RoleID", useCryptoLocalStorage("user_Data", "get", "RoleID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname") ),
    //   form.append("ProjectID", formData?.Project),
    //   form.append("ProjectName", getlabel(formData?.Project, project)),
    //   form.append("BillingCompanyID", ""),
    //   form.append("BillingCompanyName", ""),
    //   form.append("BillingCompanyAddress", ""),
    //   form.append("BillingState", ""),
    //   form.append("GSTNo", formData?.GstNumber),
    //   form.append("PanCardNo", formData?.PanCardNo),
    //   form.append("ShippingCompanyID", ""),
    //   form.append("ShippingCompanyName", ""),
    //   form.append("ShippingCompanyAddress", ""),
    //   form.append("ShippingState", ""),
    //   form.append("dtSales", moment(formData?.SalesDate).format("DD-MM-YYYY")),
    //   form.append("PONumber", formData?.PoNumber),
    //   form.append("GrossAmount", GrossAmount),
    //   form.append("DiscountAmount", payload[0]?.DiscountAmount),
    //   form.append("TaxAmount", Tax),
    //   form.append("Tax_Per", 18),
    //   form.append("CGST_Amount", formData?.CgstAmount),
    //   form.append("SGST_Amount", formData?.SgstAmount),
    //   form.append("IGST_Amount", ""),
    //   form.append("CGST_Per", ""),
    //   form.append("SGST_Per", ""),
    //   form.append("IGST_Per", ""),
    //   form.append("RoundOff", formData?.RoundOff),
    //   form.append("Document_Base64", ""),
    //   form.append("Document_FormatType", ""),
    //   form.append("QuotationID", state?.data),
    //   form.append("ItemData", JSON.stringify(payload));
    // axios
    //   .post(apiUrls?.Quotation_Update, form, { headers })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoading(false);
        // setTableData([]);
        // setFormData({
        //   ...formData,
        //   Items: "",
        //   Project: "",
        // });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSave = () => {
    // let ids=[]
    // tableData?.map((val,index)=>{
    //     console.log("iddssss",val)
    //   ids+=`${index ,val?.service?.value},`
    // })

    let termsPayload = [];
    tableData1?.map((val, index) => {
      termsPayload?.push({
        "S.No.": index,
        Terms: val?.Terms,
        // OtherReason: val?.OtherReason,
      });
    });
    let payload = [];
    tableData?.map((val, index) => {
      // console.log("valllll", val);
      payload.push({
        Installment_No: index,
        Remark: val?.Remark,
        IsPaid: val?.isPaid ? "1" : "0",
        ExpectedDate: moment(val?.ExpectedDate).format("YYYY-MM-DD"),
        ItemID: val?.service?.value,
        ItemName: val?.service?.label,
        SAC: "",
        IsActive: "",
        PaymentMode: val?.PaymentMode,
        TaxAmount: val?.Tax,
        TaxPrecentage: val?.TaxPercent,
        Rate: val?.Rate,
        Quantity: val?.Quantity,
        DiscountAmount: val?.Discount,
        Amount: val?.Amount,
        EndDate: moment(val?.EndDate).format("YYYY-MM-DD"),
        GrossAmount: val?.GrossAmount,
      });
    });

    const NetAmount =
      payload[0]?.Amount + payload[0]?.DiscountAmount - payload[0]?.TaxAmount;

    const GrossAmount = payload[0]?.Rate * payload[0]?.Quantity;

    const Tax =
      (payload[0]?.Rate * payload[0]?.Quantity - payload[0]?.DiscountAmount) *
      0.18;

    const Amount =
      payload[0]?.Rate * payload[0]?.Quantity -
      payload[0]?.DiscountAmount +
      (payload[0]?.Rate * payload[0]?.Quantity - payload[0]?.DiscountAmount) *
        0.18 +
      payload[0]?.Amount;
    // console.log("Amount", Amount);

    setLoading(true);

    const FinalPayload = {
  ProjectID: String(formData?.Project || ""),
  ProjectName: String(getlabel(formData?.Project, project) || ""),

  BillingCompanyID: String(""),
  BillingCompanyName: String(""),
  BillingCompanyAddress: String(""),
  BillingState: String(""),
  GSTNo: String(""),
  PanCardNo: String(""),

  ShippingCompanyID: String(""),
  ShippingCompanyName: String(""),
  ShippingCompanyAddress: String(""),
  ShippingState: String(""),
  ShippingGSTNo: String(""),     // added for schema
  ShippingPanCardNo: String(""), // added for schema

  dtSales: formData?.SalesDate
    ? String(moment(formData?.SalesDate).format("DD-MM-YYYY"))
    : String(""),
  ExpiryDate: formData?.ExpiryDate
    ? String(moment(formData?.ExpiryDate).format("DD-MM-YYYY"))
    : String(""),

  GrossAmount: String(GrossAmount || ""),
  DiscountAmount: String(payload[0]?.DiscountAmount || ""),
  TaxAmount: String(Tax || ""),
  Tax_Per: String("18"),

  CGST_Amount: String(""),
  SGST_Amount: String(""),
  IGST_Amount: String(""),
  CGST_Per: String(""),
  SGST_Per: String(""),
  IGST_Per: String(""),

  RoundOff: String(formData?.RoundOff || ""),

  Document_Base64: String(""),
  Document_FormatType: String(""),

  ItemData: String(JSON.stringify(payload) || ""),
  PaymentTerms: String(JSON.stringify(termsPayload) || ""),

  IsApproved: String(""),  // added for schema
  PoNo: String(""),        // added for schema
  EmailStatus: String(""), // added for schema
  EmailTo: String(""),     // added for schema
  EmailCC: String(""),     // added for schema
};

axiosInstances
      .post(apiUrls.Quotation_Insert, FinalPayload)
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("RoleID", useCryptoLocalStorage("user_Data", "get", "RoleID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname") ),
    //   form.append("ProjectID", formData?.Project),
    //   form.append("ProjectName", getlabel(formData?.Project, project)),
    //   form.append("BillingCompanyID", ""),
    //   form.append("BillingCompanyName", ""),
    //   form.append("BillingCompanyAddress", ""),
    //   form.append("BillingState", ""),
    //   form.append("GSTNo", ""),
    //   form.append("PanCardNo", ""),
    //   form.append("ShippingCompanyID", ""),
    //   form.append("ShippingCompanyName", ""),
    //   form.append("ShippingCompanyAddress", ""),
    //   form.append("ShippingState", ""),
    //   form.append("dtSales", moment(formData?.SalesDate).format("DD-MM-YYYY")),
    //   form.append(
    //     "ExpiryDate",
    //     moment(formData?.ExpiryDate).format("DD-MM-YYYY")
    //   ),
    //   form.append("PONumber", ""),
    //   form.append("GrossAmount", GrossAmount),
    //   form.append("DiscountAmount", payload[0]?.DiscountAmount),
    //   form.append("TaxAmount", Tax),
    //   form.append("Tax_Per", 18),
    //   form.append("CGST_Amount", ""),
    //   form.append("SGST_Amount", ""),
    //   form.append("IGST_Amount", ""),
    //   form.append("CGST_Per", ""),
    //   form.append("SGST_Per", ""),
    //   form.append("IGST_Per", ""),
    //   form.append("RoundOff", formData?.RoundOff ?? ""),
    //   form.append("Document_Base64", ""),
    //   form.append("Document_FormatType", ""),
    //   form.append("ItemData", JSON.stringify(payload));
    // form.append("PaymentTerms", JSON.stringify(termsPayload));
    // axios
    //   .post(apiUrls?.Quotation_Insert, form, { headers })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoading(false);
        setTableData([]);
        setTableData1([]);
        setFormData({
          ...formData,
          Items: "",
          Project: "",
          BillingCompany: "",
          BillingAddress: "",
          BillingState: "",
          BillingGST: "",
          BillingPanCard: "",
          ShippingCompany: "",
          ShippingAddress: "",
          ShippingState: "",
          ShippingGST: "",
          Sales: "",
          ShippingPanCard: "",
          Terms: "",
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;
    if (name === "ExpectedDate") {
      const updatedTableData = [...tableData];
      updatedTableData[index][name] = value;
      setTableData(updatedTableData);
      // } else if (name == "EndDate") {
      //   const updatedTableData = [...tableData];
      //   updatedTableData[index][name] = value;
      //   setTableData(updatedTableData);
      // }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRemove = (index) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
  };

  const handleCheckBox = (e, index) => {
    const { name, checked, type } = e?.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });

    if (name == "isPaid") {
      const data = [...tableData];
      data[index][name] = checked;

      setTableData(data);
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
      });
    }
  };

  const handleCalculate = () => {
    const totalRate = tableData?.reduce(
      (accumulator, currentItem) =>
        Number(accumulator) + Number(currentItem.Rate || 0),
      0
    );

    const totalQuantity = tableData?.reduce(
      (accumulator, currentItem) =>
        Number(accumulator) + Number(currentItem.Quantity || 0),
      0
    );

    const TotalDiscount = tableData?.reduce(
      (accumulator, currentItem) =>
        Number(accumulator) + Number(currentItem.Discount || 0),
      0
    );

    const totalTax = tableData.reduce((sum, item) => {
      return item.PaymentMode === "Online" ? sum + item.TaxAmount : sum;
    }, 0);
    // console.log("tableDatatableData",totalTax)
    // const totalTax = tableData
    //   ?.reduce(
    //     (accumulator, currentItem) =>
    //       accumulator +
    //       (Number(currentItem.Rate) * Number(currentItem.Quantity) -
    //         Number(currentItem.Discount)) *
    //         0.18,
    //     0
    //   )
    //   .toFixed(2);

    const totalAmount = tableData?.reduce(
      (accumulator, currentItem) => Number(accumulator) + currentItem?.Amount,
      0
    );
    // const totalAmount = tableData?.reduce(
    //   (accumulator, currentItem) =>
    //     Number(accumulator) +
    //     (Number(currentItem.Rate * currentItem.Quantity) -
    //       Number(currentItem.Discount) +
    //       Number(
    //         currentItem.Rate * currentItem.Quantity - currentItem.Discount
    //       ) *
    //         0.18 || 0),
    //   0
    // );

    setFormData({
      ...formData,
      TotalAmount: totalAmount,
      TotalQuantity: totalQuantity,
      TotalRate: totalRate,
      TotalTax: totalTax,
      TotalDiscount: TotalDiscount,
    });
  };

  const getState = (value) => {
    axiosInstances
      .post(apiUrls.GetState,{
  "CountryID": "14"
})
    // let form = new FormData();
    // form.append("CountryID", "14"),
    //   axios
    //     .post(apiUrls?.GetState, form, { headers })
        .then((res) => {
          const states = res?.data.data.map((item) => {
            return { label: item?.StateName, value: item?.StateID };
          });
          setStatedata(states);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  useEffect(() => {
    handleCalculate();
  }, [tableData]);

  useEffect(() => {
    if (state?.edit) {
      fetchDatabyId(state.data);
    }
  }, []);

  const fetchDatabyId = (id) => {
    axiosInstances
      .post(apiUrls.Quotation_Load_QuotationID,{
  "QuotationID": Number(id)
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname") );
    // form.append("QuotationID", id);

    // axios
    //   .post(apiUrls?.Quotation_Load_QuotationID, form, {
    //     headers,
    //   })
      .then((res) => {
        console.log("mastererer", res);
        setFormData({
          ...formData,
          Project: res?.data?.data[0]?.ProjectID,

          Items: res?.data?.dataDetail[0]?.ItemID,
          ExpectedDate: res?.data?.dataDetail[0]?.ExpectedDate,
          // ItemName:res?.data?.dataDetail[0]?.ItemName
        });
        // console.log("expectedcheckk", res?.data?.dataDetail[0]?.ExpectedDate);
        const updatedData = res?.data?.dataDetail.map((ele) => ({
          ...ele,
          label: ele?.service?.label || "",
          ExpectedDate: ele?.ExpectedDate,
        }));
        // console.log(updatedData);
        setTableData(updatedData);

        if (res?.data?.data[0]?.ProjectID > 0) {
          handleGetItemSearch(res?.data?.data[0]?.ProjectID);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [rowHandler, setRowHandler] = useState({
    show: false,
    show1: true,
    show2: true,
    show3: true,
    show4: false,
    show5: false,
  });
  const handlerow = (row) => {
    let obj;
    if (!rowHandler[row]) {
      obj = { ...rowHandler, [row]: true };
    } else {
      obj = { ...rowHandler, [row]: false };
    }
    setRowHandler(obj);
  };
  const [visible, setVisible] = useState({
    showCompany: false,
    shippingCompany: false,
    showData: {},
  });

  useEffect(() => {
    getState();
    getTerms();
  }, []);

  const handlerefresh = () => {
    // console.log("formData.Project", formData.Project);
    getCompany(formData.Project);
  };
  return (
    <>
      {visible?.showCompany && (
        <Modal
          modalWidth={"700px"}
          visible={visible?.showCompany}
          setVisible={setVisible}
          tableData={visible?.showData}
          projectid={formData?.Project}
          Header="New Billing Company"
          getCompany={getCompany}
        >
          <AddNewCompany
            visible={visible?.showCompany}
            setVisible={setVisible}
            tableData={visible?.showData}
            projectid={formData?.Project}
            getCompany={getCompany}
          />
        </Modal>
      )}
      {visible?.shippingCompany && (
        <Modal
          modalWidth={"700px"}
          visible={visible?.shippingCompany}
          setVisible={setVisible}
          tableData={visible?.showData}
          projectid={formData?.Project}
          Header="New Shipping Company"
        >
          <AddNewShippingCompany
            visible={visible?.shippingCompany}
            setVisible={setVisible}
            tableData={visible?.showData}
            projectid={formData?.Project}
          />
        </Modal>
      )}
      <div className="card">
        <Heading
          title={
            <span style={{ fontWeight: "bold" }}>Tax Invoice Request</span>
          }
          isBreadcrumb={data ? false : true}
        />
        <div className="row g-4 m-2">
          {state?.edit ? (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="Project"
              placeholderName="Project"
              dynamicOptions={project}
              className="Project"
              handleChange={handleDeliveryChange}
              value={formData.Project}
              // requiredClassName={"required-fields"}
              // isDisabled={true}
            />
          ) : (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="Project"
              placeholderName="Project"
              dynamicOptions={project}
              className="Project"
              handleChange={handleDeliveryChange}
              value={formData.Project}
              requiredClassName={"required-fields"}
            />
          )}
          {/* <DatePicker
            className="custom-calendar"
            id="SalesDate"
            name="SalesDate"
            lable="Quotation Date"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.SalesDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          /> */}
          {/* <DatePicker
            className="custom-calendar"
            id="ExpiryDate"
            name="ExpiryDate"
            lable="Expiry Date"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.ExpiryDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          /> */}
          {/* <Input
            type="text"
            className="form-control"
            id="PoNumber"
            name="PoNumber"
            lable="Po Number"
            onChange={handleChange}
            value={formData?.PoNumber}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          /> */}
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Items"
            placeholderName="Item"
            dynamicOptions={items}
            className="Items"
            handleChange={(name, value) =>
              handleDeliveryChangeItems(name, value)
            }
            value={formData.Items}
            requiredClassName={"required-fields"}
          />

          <div>
            <Link to="/TaxInvoiceView" className="ml-3">
              Back to List
            </Link>
          </div>
          {state?.edit && (
            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                CreatedBy
              </span>
              :&nbsp;
              {state?.givenData?.CreatedBy}
              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
              EntryDate
            </span>
              :&nbsp;
            {state?.givenData?.dtEntry}
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-6 col-xl-6 ">
            <div className="card BillingDetails border mt-2">
              <Heading
                title="Billing Details"
                secondTitle={
                  <button
                    className={`fa ${rowHandler.show1 ? "fa-arrow-up" : "fa-arrow-down"}`}
                    onClick={() => {
                      handlerow("show1");
                    }}
                    style={{
                      cursor: "pointer",
                      border: "none",
                      color: "black",
                      borderRadius: "2px",
                      background: "none",
                      marginLeft: "30px",
                    }}
                  ></button>
                }
              />

              {rowHandler.show1 && (
                <>
                  <div className="row m-2">
                    <ReactSelect
                      respclass="col-xl-5 col-md-4 col-sm-6 col-12"
                      name="BillingCompany"
                      id="BillingCompany"
                      placeholderName="Company"
                      dynamicOptions={billingcompany}
                      handleChange={handleDeliveryChange}
                      value={formData.BillingCompany}
                      // requiredClassName={"required-fields"}
                    />
                    <i
                      className="fa fa-retweet mr-2 mt-2"
                      onClick={handlerefresh}
                      title="Click to Refresh Company."
                      style={{ cursor: "pointer" }}
                    ></i>
                    <i
                      className="fa fa-plus-circle fa-sm new_record_pluse mt-2"
                      style={{ cursor: "pointer" }}
                      title="Click to Create New Billing Company."
                      onClick={() => {
                        setVisible({ showCompany: true, showData: "" });
                      }}
                    ></i>
                    <Input
                      type="text"
                      className="form-control"
                      id="BillingAddress"
                      name="BillingAddress"
                      lable="Address"
                      placeholder=" "
                      onChange={handleChange}
                      value={
                        formData?.BillingAddress ? formData?.BillingAddress : ""
                      }
                      respclass="col-xl-6 col-md-4 col-sm-4 col-12"
                    />
                    <ReactSelect
                      respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-2"
                      name="BillingState"
                      id="BillingState"
                      placeholderName="State"
                      dynamicOptions={statedata}
                      handleChange={handleDeliveryChange}
                      value={formData.BillingState ? formData.BillingState : ""}
                    />
                    <Input
                      type="text"
                      className="form-control"
                      id="BillingGST"
                      name="BillingGST"
                      lable="GST"
                      placeholder=" "
                      onChange={(e) => {
                        inputBoxValidation(
                          GST_VALIDATION_REGX,
                          e,
                          handleChange
                        );
                      }}
                      value={formData?.BillingGST ? formData?.BillingGST : ""}
                      respclass="col-xl-4 col-md-4 col-sm-4 col-12 mt-2"
                    />
                    <Input
                      type="text"
                      className="form-control"
                      id="BillingPanCard"
                      name="BillingPanCard"
                      lable="PanCard"
                      placeholder=" "
                      onChange={(e) => {
                        inputBoxValidation(
                          PANCARD_VALIDATION_REGX,
                          e,
                          handleChange
                        );
                      }}
                      // onChange={handleChange}
                      value={
                        formData?.BillingPanCard ? formData?.BillingPanCard : ""
                      }
                      respclass="col-xl-4 col-md-4 col-sm-4 col-12 mt-2"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-xl-6 ">
            <div className="card ShippingDetails border mt-2">
              <Heading
                title="Shipping Details"
                secondTitle={
                  <button
                    className={`fa ${rowHandler.show2 ? "fa-arrow-up" : "fa-arrow-down"}`}
                    onClick={() => {
                      handlerow("show2");
                    }}
                    style={{
                      cursor: "pointer",
                      border: "none",
                      color: "black",
                      borderRadius: "2px",
                      background: "none",
                      marginLeft: "30px",
                    }}
                  ></button>
                }
              />

              {rowHandler.show2 && (
                <>
                  <div className="row m-2">
                    <ReactSelect
                      respclass="col-xl-5 col-md-4 col-sm-6 col-12"
                      name="ShippingCompany"
                      id="ShippingCompany"
                      placeholderName="Company"
                      dynamicOptions={billingcompany}
                      handleChange={handleDeliveryChange}
                      value={formData.ShippingCompany}
                      // requiredClassName={"required-fields"}
                    />
                    <i
                      className="fa fa-retweet mr-2 mt-2"
                      onClick={handlerefresh}
                      title="Click to Refresh Company."
                      style={{ cursor: "pointer" }}
                    ></i>
                    <i
                      className="fa fa-plus-circle fa-sm new_record_pluse mt-2"
                      title="Click to Create New Shipping Company."
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setVisible({ showCompany: true, showData: "" });
                      }}
                    ></i>
                    <Input
                      type="text"
                      className="form-control"
                      id="ShippingAddress"
                      name="ShippingAddress"
                      lable="Address"
                      placeholder=" "
                      onChange={handleChange}
                      value={
                        formData?.ShippingAddress
                          ? formData?.ShippingAddress
                          : ""
                      }
                      respclass="col-xl-6 col-md-4 col-sm-4 col-12"
                    />
                    <ReactSelect
                      respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-2"
                      name="ShippingState"
                      id="ShippingState"
                      placeholderName="State"
                      dynamicOptions={statedata}
                      handleChange={handleDeliveryChange}
                      value={
                        formData.ShippingState ? formData.ShippingState : ""
                      }
                    />
                    <Input
                      type="text"
                      className="form-control"
                      id="ShippingGST"
                      name="ShippingGST"
                      lable="GST"
                      placeholder=" "
                      onChange={(e) => {
                        inputBoxValidation(
                          GST_VALIDATION_REGX,
                          e,
                          handleChange
                        );
                      }}
                      value={formData?.ShippingGST ? formData?.ShippingGST : ""}
                      respclass="col-xl-4 col-md-4 col-sm-4 col-12 mt-2"
                    />
                    <Input
                      type="text"
                      className="form-control"
                      id="ShippingPanCard"
                      name="ShippingPanCard"
                      lable="PanCard"
                      placeholder=" "
                      onChange={(e) => {
                        inputBoxValidation(
                          PANCARD_VALIDATION_REGX,
                          e,
                          handleChange
                        );
                      }}
                      // onChange={handleChange}
                      value={
                        formData?.ShippingPanCard
                          ? formData?.ShippingPanCard
                          : ""
                      }
                      respclass="col-xl-4 col-md-4 col-sm-4 col-12 mt-2"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* {console.log("tableDatatableData", tableData)} */}
        <div className="mt-2">
          <Tables
            thead={taxinvoicesTHEAD}
            tbody={tableData?.map((ele, index) => ({
              "S.No.": <div className="p-2">{index + 1}</div>,
              Services: ele?.SalesLabel?.label
                ? ele?.SalesLabel?.label
                : ele?.ItemName,

              "Payment Mode": (
                <>
                  <ReactSelect
                    name="PaymentMode"
                    placeholderName="Payment Mode"
                    dynamicOptions={[
                      { label: "Delta", value: "Cash" },
                      { label: "Online", value: "Online" },
                    ]}
                    handleChange={(name, e) =>
                      handleDeliveryChange(name, e, index)
                    }
                    value={ele.PaymentMode}
                    respclass={"width80px"}
                  />
                </>
              ),
              Rate: (
                <Input
                  type="number"
                  className="form-control"
                  id="Rate"
                  name="Rate"
                  lable="Rate"
                  onChange={(e) => handleSelectChange(e, index)}
                  value={ele?.Rate}
                />
              ),
              Quantity: (
                <Input
                  type="number"
                  className="form-control"
                  id="Quantity"
                  name="Quantity"
                  lable="Quantity"
                  // placeholder={"Quantity"}
                  onChange={(e) => handleSelectChange(e, index)}
                  value={ele?.Quantity}
                />
              ),
              "Discount/%": (
                <>
                  {/* {ele?.PaymentMode == "Online" && ( */}
                  <div className="d-flex">
                    <Input
                      type="number"
                      className="form-control"
                      id="DiscountPercent"
                      name="DiscountPercent"
                      lable="%"
                      onChange={(e) => handleSelectChange(e, index)}
                      value={ele?.DiscountPercent}
                    />
                    {/* {ele?.DiscountPercent !== "" && ( */}
                    <Input
                      type="number"
                      className="form-control"
                      id="Discount"
                      name="Discount"
                      lable="₹"
                      // placeholder={"₹ Discount"}
                      onChange={(e) => handleSelectChange(e, index)}
                      value={ele?.Discount}
                    />
                    {/* )} */}
                  </div>
                  {/* // )} */}
                </>
              ),
              "Tax%": (
                <>
                  <div className="d-flex" style={{ width: "120px" }}>
                    <Input
                      type="number"
                      className="form-control"
                      id="TaxAmount"
                      name="TaxAmount"
                      lable="₹"
                      // placeholder={"₹ Tax"}
                      onChange={(e) => handleSelectChange(e, index)}
                      value={ele?.TaxAmount}
                      disabled={true}
                    />
                    {/* {ele?.Tax !== "" && ( */}
                    <Input
                      type="number"
                      className="form-control"
                      id="TaxPercent"
                      name="TaxPercent"
                      lable="%"
                      // placeholder={"18% Tax"}
                      onChange={(e) => handleSelectChange(e, index)}
                      disabled={true}
                      value={ele?.TaxPercent}
                    />
                    {/* )} */}
                  </div>
                </>
              ),
              Amount: (
                <Input
                  type="number"
                  className="form-control"
                  id="Amount"
                  name="Amount"
                  lable="Amount"
                  // placeholder={"Amount"}
                  onChange={(e) => handleSelectChange(e, index)}
                  value={ele?.Amount}
                />
              ),
              Remark: (
                // <Input
                //   type="text"
                //   className="form-control"
                //   id="Remark"
                //   name="Remark"
                //   // lable="Remark"
                //   placeholder={"Remark"}
                //   onChange={(e) => handleSelectChange(e, index)}
                //   value={ele?.Remark}
                // />
                <textarea
                  type="text"
                  respclass="width100px"
                  className="form-control textArea"
                  placeholder="Remark "
                  id={"Remark"}
                  name="Remark"
                  value={ele?.Remark}
                  onChange={(e) => handleSelectChange(e, index)}
                  style={{ width: "150px", marginLeft: "7.5px" }}
                ></textarea>
              ),

              "Expected/Start Date": (
                <>
                  {console.log("ele?.ExpectedDate", ele?.ExpectedDate)}

                  <div className="mt-2">
                    <DatePicker
                      className="custom-calendar"
                      id="ExpectedDate"
                      name="ExpectedDate"
                      lable="Expected Date"
                      placeholder={VITE_DATE_FORMAT}
                      value={new Date(ele?.ExpectedDate)}
                      respclass="width100px"
                      handleChange={(e) => searchHandleChange(e, index)}
                    />
                  </div>
                </>
              ),
              // "End Date": (ele?.service?.label === "AMC" ||
              //   ele?.service?.label === "Saas") && (
              //   <>
              //     <div className="mt-2">
              //       <DatePicker
              //         className="custom-calendar"
              //         id="EndDate"
              //         name="EndDate"
              //         lable="End Date"
              //         placeholder={VITE_DATE_FORMAT}
              //         value={ele?.EndDate}
              //         respclass="width100px"
              //         handleChange={(e) => searchHandleChange(e, index)}
              //       />
              //     </div>
              //   </>
              // ),
              Remove: (
                <i
                  className="fa fa-trash"
                  style={{ cursor: "pointer", color: "red", marginLeft: "5px" }}
                  onClick={() => handleRemove(ele, index)}
                ></i>
              ),
            }))}
            tableHeight={"tableHeight"}
          />
          {tableData?.length > 0 && (
            <div className="row g-4 m-2">
              <div className="col-lg-10 col-md-12">
                <div className="row g-4 m-2">
                  <div className="col-1" style={{ marginLeft: "55px" }}></div>
                  <label style={{ marginRight: "25px" }}>SubTotal: </label>
                  <div className="col-2">
                    <Input
                      type="number"
                      className="form-control"
                      id="TotalRate"
                      name="TotalRate"
                      lable="Total Rate"
                      placeholder={"Total Rate"}
                      onChange={handleSelectChange}
                      value={formData?.TotalRate}
                      respclass="w-67"
                      disabled={true}
                    />
                  </div>
                  <div className="col-1.5" style={{ marginLeft: "5px" }}>
                    <Input
                      type="number"
                      className="form-control"
                      id="TotalQuantity"
                      name="TotalQuantity"
                      lable="Total Quantity"
                      placeholder={"Total Quantity"}
                      onChange={handleSelectChange}
                      value={formData?.TotalQuantity}
                      respclass="w-70"
                      disabled={true}
                    />
                  </div>
                  <div className="col-1.5" style={{ marginLeft: "4px" }}>
                    <Input
                      type="number"
                      className="form-control"
                      id="TotalDiscount"
                      name="TotalDiscount"
                      lable="Total Discount"
                      placeholder={"Total Discount"}
                      onChange={handleSelectChange}
                      value={formData?.TotalDiscount}
                      respclass="w-60"
                      disabled={true}
                    />
                  </div>
                  <div className="col-1.5" style={{ marginLeft: "6px" }}>
                    <Input
                      type="number"
                      className="form-control"
                      id="TotalTax"
                      name="TotalTax"
                      lable="Total Tax"
                      placeholder={"Total Tax"}
                      onChange={handleSelectChange}
                      value={formData?.TotalTax}
                      respclass="w-60"
                      disabled={true}
                    />
                  </div>
                  <div className="col-1.5" style={{ marginLeft: "7px" }}>
                    <Input
                      type="number"
                      className="form-control"
                      id="TotalAmount"
                      name="TotalAmount"
                      lable="Total Amount"
                      placeholder={"Total Amount"}
                      onChange={handleSelectChange}
                      value={formData?.TotalAmount}
                      respclass="w-60"
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-md-12">
                <div className="row g-4 m-2 d-none">
                  <div className="col-1.5 d-flex">
                    <Input
                      type="number"
                      className="form-control"
                      id="TaxableAmount"
                      name="TaxableAmount"
                      placeholder="Taxable Amount"
                      lable="Taxable Amount"
                      onChange={handleSelectChange}
                      value={
                        tableData?.reduce(
                          (accumulator, currentItem) =>
                            Number(accumulator) +
                            Number(currentItem.Amount || 0),
                          0
                        ) -
                        tableData?.reduce(
                          (accumulator, currentItem) =>
                            Number(accumulator) + Number(currentItem.Tax || 0),
                          0
                        )
                      }
                      respclass="w-50"
                      disabled={true}
                    />

                    <Input
                      type="number"
                      className="form-control ml-1"
                      id="SgstAmount"
                      name="SgstAmount"
                      placeholder="SGST@9"
                      lable="SGST@9"
                      onChange={handleSelectChange}
                      value={
                        tableData?.reduce(
                          (accumulator, currentItem) =>
                            Number(accumulator) + Number(currentItem.Tax || 0),
                          0
                        ) / 2
                      }
                      respclass="w-50"
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="row g-4 m-2 d-none">
                  <div className="col-1.5 d-flex">
                    <Input
                      type="number"
                      className="form-control"
                      id="CgstAmount"
                      name="CgstAmount"
                      placeholder="CGST@9"
                      lable="CGST@9"
                      onChange={handleSelectChange}
                      value={
                        tableData?.reduce(
                          (accumulator, currentItem) =>
                            Number(accumulator) + Number(currentItem.Tax || 0),
                          0
                        ) / 2
                      }
                      respclass="w-50"
                      disabled={true}
                    />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "5px",
                      }}
                    >
                      <label className="switch" style={{ marginTop: "7px" }}>
                        <input
                          type="checkbox"
                          name="RoundOff"
                          checked={formData?.RoundOff == "1" ? true : false}
                          // value={tableData?.RoundOff == "1" ? true : false}
                          onChange={handleSelectChange}
                        />
                        <span className="slider"></span>
                      </label>
                      <span
                        style={{
                          marginLeft: "3px",
                          fontSize: "12px",
                        }}
                      >
                        AutoRoundOff
                      </span>
                    </div>
                  </div>
                </div>

                <div className="row g-4 m-2">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "5px",
                    }}
                  >
                    <label className="switch" style={{ marginTop: "7px" }}>
                      <input
                        type="checkbox"
                        name="RoundOff"
                        checked={formData?.RoundOff == "1" ? true : false}
                        // value={tableData?.RoundOff == "1" ? true : false}
                        onChange={handleSelectChange}
                      />
                      <span className="slider"></span>
                    </label>
                    <span
                      style={{
                        marginLeft: "3px",
                        fontSize: "12px",
                      }}
                    >
                      AutoRoundOff
                    </span>
                  </div>
                  <div className="col-1.5 d-flex">
                    <div className="col-2">
                      {state?.edit ? (
                        <button
                          className="btn btn-sm btn-info ml-2"
                          onClick={handleUpdate}
                        >
                          Update
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-info ml-2"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default TaxInvoiceRequest;
