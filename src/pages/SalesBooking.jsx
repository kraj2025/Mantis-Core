import React, { useEffect, useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";

import Input from "../components/formComponent/Input";
import Tables from "../components/UI/customTable";
import { salesbookingTHEAD } from "../components/modalComponent/Utils/HealperThead";

import { inputBoxValidation } from "../utils/utils";
import { apiUrls } from "../networkServices/apiEndpoints";
import { AutoComplete } from "primereact/autocomplete";
import Heading from "../components/UI/Heading";
import { toast } from "react-toastify";
import DatePicker from "../components/formComponent/DatePicker";
import Loading from "../components/loader/Loading";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import AddNewCompany from "./AddNewCompany";
import AddNewShippingCompany from "./AddNewShippingCompany";
import {
  GST_VALIDATION_REGX,
  PANCARD_VALIDATION_REGX,
} from "../utils/constant";
import Modal from "../components/modalComponent/Modal";

import { axiosInstances } from "../networkServices/axiosInstance";
const SalesBooking = ({ data }) => {
  const [billingcompany, setBillingCompany] = useState([]);
  const [statedata, setStatedata] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingcompany, setShippingCompany] = useState([]);
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
    ExpectedDate: new Date(),
    EndDate: new Date(),
    ExpiryDate: new Date(),
    Payment_Installment_ID: "",
    //////////////////

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
    LiveDate: "",
  });
  const getState = (value) => {
    // let form = new FormData();
    // form.append("CountryID", "14"),
    //   axios
    //     .post(apiUrls?.GetState, form, { headers })
    axiosInstances
      .post(apiUrls?.GetState, { CountryID: "14" })
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
    getState();
  }, []);

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
    saleVisible: false,
    showData: {},
  });
  const handlerefresh = () => {
    console.log("formData.Project", formData.Project);
    getCompany(formData.Project);
  };
  const getCompany = (proj) => {
    console.log("check project", proj);

    axiosInstances
      .post(apiUrls?.BillingCompany_Select, {
        ProjectID: Number(proj || formData?.Project),
        IsActive: String("1"),
      })
      .then((res) => {
        console.log("billingcompany", res?.data?.data);
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.BillingCompanyName, value: item?.BillingID };
        });
        setBillingCompany(poc3s);
        setShippingCompany(poc3s);
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
        // getState()
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCompanyBill = (proj) => {
    axiosInstances
      .post(apiUrls?.BillingCompanyDetail_Select_ID, { BillingCompanyID: proj })
      .then((res) => {
        setFormData((val) => ({
          ...val,
          BillingAddress: res?.data?.data[0]?.BillingAddress,
          BillingState: res?.data?.data[0]?.StateID,
          BillingGST: res?.data?.data[0]?.GSTNo,
          BillingPanCard: res?.data?.data[0]?.PanCardNo,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getCompanyShipping = (proj) => {
    axiosInstances
      .post(apiUrls.BillingCompanyDetail_Select_ID, {
        BillingCompanyID: Number(proj),
      })

      .then((res) => {
        setFormData((val) => ({
          ...val,

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
  console.log("data data data", formData?.Project);
  const handleDeliveryChange = (name, e, index) => {
    const { value } = e;
    console.log("value value", value);
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
    if (name == "Project") {
      if (data) {
        setFormData({
          ...formData,
          [name]: value,
          Items: data?.ItemName,
        });
        // setFormData((val) => ({ ...val,
        //   ItemName: data?.ItemName,
        //   BillingAddress: "",
        //   BillingState: "",
        //   BillingGST: "",
        //   BillingPanCard: "",
        //   ShippingAddress: "",
        //   ShippingState: "",
        //   ShippingGST: "",
        //   ShippingPanCard: "",
        // }));
        handleGetItemRate({ label: data?.ItemName, value: "" });
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
      handleGetItemSearch(value);
      // getCompany(value);
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

      // console.log("valuevalue");
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

  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [project, setProject] = useState([]);
  const [category, setCategory] = useState([]);
  const [items, setItems] = useState([]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  // const handleDeliveryChangeItems = (name, value) => {
  //   if (name == "Items") {
  //     handleGetItemRate({
  //       label: value?.label,
  //       value: value.value,
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //   }
  // };

  const handleDeliveryChangeItems = (name, value) => {
    if (name === "Items") {
      handleGetItemRate({
        label: value?.label,
        value: value.value,
      });

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleGetItemRate = (value) => {
    axiosInstances
      .post(apiUrls?.Payement_Installment_Select, {
        ProjectID: Number(
          formData?.Project ? formData?.Project : data?.ProjectID
        ),
        ItemID: String(value?.value),
        ItemName: String(""),
        SearchType: String("Rate"),
      })
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
  // console.log("tableData", tableData);

  const getProject = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   axios
    //     .post(apiUrls?.ProjectSelect, form, { headers })
    axiosInstances
      .post(apiUrls?.ProjectSelect, {
        ProjectID: 0,
        IsMaster: "string",
        VerticalID: 0,
        TeamID: 0,
        WingID: 0,
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.Project, value: item?.ProjectId };
        });
        getCategory(poc3s[0]?.value);
        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [salesData, setSalesData] = useState([]);

  const getCategory = (proj) => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("ProjectID", proj),
    //   axios
    //     .post(apiUrls?.Category_Select, form, { headers })
    axiosInstances
      .post(apiUrls?.Category_Select, { ProjectID: proj })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setCategory(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleCalculateTableData = (obj) => {
    // console.log(obj);
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

    if (name === "DiscountPercent" || name === "Quantity") {
      // if(Number(response?.DiscountPercent)>100){
      //   response["DiscountPercent"] = "99"
      // }
      if (modifiedData.PaymentMode === "Cash") {
        response["TaxAmount"] = 0;
        response["Amount"] =
          response?.GrossAmount -
          response?.DiscountAmount +
          response?.TaxAmount;
      }
      // console.log(response);
    }

    mainData[index] = response;
    // Set the updated table data in the state
    setTableData(mainData);
  };

  useEffect(() => {
    getProject();
    // SalesBooking_Load_SalesID();
    getCompany(formData?.Project);
  }, []);

  const handleGetItemSearch = (value) => {
    const payload = {
      ProjectID: Number(value),
      ItemName: String(),
      SearchType: String("GetItem"),
    };
    axiosInstances
      .post(apiUrls?.Payement_Installment_Select, payload)
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.ItemNameGroup, value: item?.ItemIDGroup };
        });
        setItems(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function getlabel(id, dropdownData) {
    const ele = dropdownData.filter((item) => item.value === id);
    return ele.length > 0 ? ele[0].label : "";
  }
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
        Installment_No: String(index),
        Remark: String(val?.Remark),
        IsPaid: Number(val?.isPaid ? "1" : "0"),
        ExpectedDate: val?.ExpectedDate
          ? moment(val?.ExpectedDate).format("YYYY-MM-DD")
          : "1970-01-01",
        LiveDate: val?.LiveDate
          ? moment(val?.LiveDate).format("YYYY-MM-DD")
          : "1970-01-01",
        EndDate: val?.EndDate
          ? moment(val?.EndDate).format("YYYY-MM-DD")
          : "1970-01-01",
        ItemID: Number(val?.ItemID),
        // ItemID: Number(val?.service?.value),
        ItemName: String(val?.ItemName),
        // ItemName: String(val?.service?.label),
        SAC: String(""),
        IsActive: Number("0"),
        PaymentMode: String(val?.PaymentMode),
        TaxAmount: Number(val?.TaxAmount),
        TaxPrecentage: Number(val?.TaxPercent),
        Rate: Number(val?.Rate),
        Quantity: Number(val?.Quantity),
        DiscountAmount: Number(val?.Discount),
        Amount: Number(val?.Amount),
        // GrossAmount: val?.GrossAmount,
        // Payment_Installment_ID: val?.Payment_Installment_ID,
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
    setIsSubmitting(true);
    const OnGoingPayload = {
      Payment_Installment_ID: String(formData?.Payment_Installment_ID),
      ProjectID: formData?.Project ? Number(formData.Project) : 0,
      ProjectName: String(getlabel(formData?.Project, project) || ""),
      BillingCompanyID: String(
        formData?.BillingCompany ? formData.BillingCompany : 0
      ),
      BillingCompanyName: String(
        getlabel(formData?.BillingCompany, billingcompany || "")
      ),
      BillingCompanyAddress: String(formData?.BillingAddress || ""),
      BillingState: String(formData?.BillingState || ""),
      GSTNo: String(formData?.BillingGST || ""),
      PanCardNo: String(formData?.BillingPanCard || ""),

      ShippingCompanyID: String(
        formData?.ShippingCompany ? formData.ShippingCompany : 0
      ),
      ShippingCompanyName: String(
        getlabel(formData?.ShippingCompany, shippingcompany || "")
      ),
      ShippingCompanyAddress: String(formData?.ShippingAddress || ""),
      ShippingState: String(formData?.ShippingState || ""),
      ShippingGSTNo: String(formData?.ShippingGST || ""),
      ShippingPanCardNo: String(formData?.ShippingPanCard || ""),

      GrossAmount: Number(formData?.TotalAmount ? formData.TotalAmount : 0),
      DiscountAmount: Number(
        payload[0]?.DiscountAmount ? payload[0].DiscountAmount : 0
      ),
      TaxAmount: Number(Tax ? Tax : 0),
      Tax_Per: Number(18),
      CGST_Amount: Number(formData?.CgstAmount ? formData.CgstAmount : 0),
      SGST_Amount: Number(formData?.SgstAmount ? formData.SgstAmount : 0),
      IGST_Amount: Number(0),
      CGST_Per: Number(0),
      SGST_Per: Number(0),
      IGST_Per: Number(0),
      RoundOff: Number(formData?.RoundOff ? formData.RoundOff : 0),

      Document_Base64: String(""),
      Document_FormatType: String(""),

      dtSales: String(
        formData?.SalesDate ? formData.SalesDate.toISOString() : ""
      ),
      dtExpiry: String(
        formData?.ExpiryDate ? formData.ExpiryDate.toISOString() : ""
      ),

      PONumber: String(formData?.PoNumber || ""),

      ItemData: payload || [],
    };

    axiosInstances
      .post(apiUrls.Payment_Installment_Update, OnGoingPayload)

      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          setIsSubmitting(false);
          setTableData([]);
          // setFormData({
          //   ...formData,
          //   Items: "",
          //   Project: "",
          // });
          navigate("/SearchSalesBooking");
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
          setIsSubmitting(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSave = () => {
    let payload = [];
    tableData?.map((val, index) => {
      // console.log("valllll", val);
      payload.push({
        Installment_No: String(index),
        Remark: String(val?.Remark),
        IsPaid: Number(val?.isPaid ? "1" : "0"),
        ExpectedDate: val?.ExpectedDate
          ? moment(val?.ExpectedDate).format("YYYY-MM-DD")
          : "1970-01-01",
        LiveDate: val?.LiveDate
          ? moment(val?.LiveDate).format("YYYY-MM-DD")
          : "1970-01-01",
        EndDate: val?.EndDate
          ? moment(val?.EndDate).format("YYYY-MM-DD")
          : "1970-01-01",
        ItemID: Number(val?.service?.value),
        ItemName: String(val?.service?.label),
        SAC: String(""),
        IsActive: Number("0"),
        PaymentMode: String(val?.PaymentMode),
        TaxAmount: Number(val?.TaxAmount),
        TaxPrecentage: Number(val?.TaxPercent),
        Rate: Number(val?.Rate),
        Quantity: Number(val?.Quantity),
        DiscountAmount: Number(val?.Discount),
        Amount: Number(val?.Amount),
        // EndDate: moment(val?.EndDate).format("YYYY-MM-DD"),
        // GrossAmount: val?.GrossAmount,
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
    setIsSubmitting(true);
    const OnGoingPayload = {
      ProjectID: formData?.Project ? Number(formData.Project) : 0,
      ProjectName: String(getlabel(formData?.Project, project) || ""),
      BillingCompanyID: String(
        formData?.BillingCompany ? formData.BillingCompany : 0
      ),
      BillingCompanyName: String(
        getlabel(formData?.BillingCompany, billingcompany || "")
      ),
      BillingCompanyAddress: String(formData?.BillingAddress || ""),
      BillingState: String(formData?.BillingState || ""),
      GSTNo: String(formData?.BillingGST || ""),
      PanCardNo: String(formData?.BillingPanCard || ""),

      ShippingCompanyID: String(
        formData?.ShippingCompany ? formData.ShippingCompany : 0
      ),
      ShippingCompanyName: String(
        getlabel(formData?.ShippingCompany, shippingcompany || "")
      ),
      ShippingCompanyAddress: String(formData?.ShippingAddress || ""),
      ShippingState: String(formData?.ShippingState || ""),
      ShippingGSTNo: String(formData?.ShippingGST || ""),
      ShippingPanCardNo: String(formData?.ShippingPanCard || ""),

      GrossAmount: Number(formData?.TotalAmount ? formData.TotalAmount : 0),
      DiscountAmount: Number(
        payload[0]?.DiscountAmount ? payload[0].DiscountAmount : 0
      ),
      TaxAmount: Number(Tax ? Tax : 0),
      Tax_Per: Number(18),
      CGST_Amount: Number(formData?.CgstAmount ? formData.CgstAmount : 0),
      SGST_Amount: Number(formData?.SgstAmount ? formData.SgstAmount : 0),
      IGST_Amount: Number(0),
      CGST_Per: Number(0),
      SGST_Per: Number(0),
      IGST_Per: Number(0),
      RoundOff: Number(formData?.RoundOff ? formData.RoundOff : 0),

      Document_Base64: String(""),
      Document_FormatType: String(""),

      dtSales: String(
        formData?.SalesDate ? formData.SalesDate.toISOString() : ""
      ),
      dtExpiry: String(
        formData?.ExpiryDate ? formData.ExpiryDate.toISOString() : ""
      ),

      PONumber: String(formData?.PoNumber || ""),

      ItemData: payload || [],
    };

    axiosInstances
      .post(apiUrls.Payment_Installment_Insert, OnGoingPayload)
      .then((res) => {
        if (res?.data?.success == true) {
          toast.success(res?.data?.message);
          setLoading(false);
          // setIsSubmitting(false);
          setTableData([]);
          // setTableData1([]);
          // setFormData({
          //   // ...formData,
          //   Project: "",
          //   Category: "",
          //   Items: "",
          //   Address: "",
          //   GstNumber: "",
          //   PanCardNo: "",
          //   TaxableAmount: "",
          //   SgstAmount: "",
          //   CgstAmount: "",
          //   TotalRate: "",
          //   TotalQuantity: "",
          //   TotalDiscount: "",
          //   TotalAmount: "",
          //   RoundOff: "",
          //   TotalTax: "",
          //   SalesDate: new Date(),
          //   ExpiryDate: new Date(),
          //   PoNumber: "",
          //   ExpectedDate: new Date(),
          //   EndDate: new Date(),
          //   Payment_Installment_ID: "",
          //   BillingCompany: "",
          //   BillingAddress: "",
          //   BillingState: "",
          //   BillingGST: "",
          //   BillingPanCard: "",
          //   ShippingCompany: "",
          //   ShippingAddress: "",
          //   ShippingState: "",
          //   ShippingGST: "",
          //   Sales: "",
          //LiveDate:"",
          //   ShippingPanCard: "",
          // });
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
          setTableData([]);
          // setTableData1([]);
          setIsSubmitting(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;

    if (name == "ExpectedDate") {
      const updatedTableData = [...tableData];
      updatedTableData[index][name] = value;
      setTableData(updatedTableData);
    } else if (name == "EndDate") {
      const updatedTableData = [...tableData];
      updatedTableData[index][name] = value;
      setTableData(updatedTableData);
      setTableData(updatedTableData);
    } else if (name == "LiveDate") {
      const updatedTableData = [...tableData];
      updatedTableData[index][name] = value;
      setTableData(updatedTableData);
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
  useEffect(() => {
    handleCalculate();
  }, [tableData]);

  useEffect(() => {
    if (state?.edit === true) {
      fetchDatabyId(state.data);
    }
  }, []);

  const fetchDatabyId = (id) => {
    axiosInstances
      .post(apiUrls.SalesBooking_Load_SalesID, {
        SalesID: String(id),
      })
      .then((res) => {
        setFormData({
          ...formData,
          Project: res?.data?.data?.data[0]?.ProjectID,
          Items: res?.data?.data?.dataDetail[0]?.ItemID,
          ItemName: res?.data?.data?.dataDetail[0]?.ItemName,
          // ExpectedDate: res?.data?.data?.dataDetail[0]?.ExpectedDate,
          // EndDate: res?.data?.data?.dataDetail[0]?.EndDate,
          TaxAmount: res?.data?.data?.dataDetail[0]?.TaxAmount,
          DiscountAmount: res?.data?.data?.dataDetail[0]?.DiscountAmount,
          Payment_Installment_ID: res?.data?.data?.data[0]?.ID,
          PoNumber: res?.data?.data?.data[0]?.PoNo,
          SalesDate: new Date(res?.data?.data?.data[0]?.dtSales),
          ExpectedDate:
            res?.data?.dataDetail[0]?.ExpectedDate == "01-Jan-1970"
              ? ""
              : res?.data?.dataDetail[0]?.ExpectedDate,
          LiveDate:
            res?.data?.dataDetail[0]?.LiveDate == "01-Jan-1970"
              ? ""
              : res?.data?.dataDetail[0]?.LiveDate,
          EndDate:
            res?.data?.dataDetail[0]?.EndDate == "01-Jan-1970"
              ? ""
              : res?.data?.dataDetail[0]?.EndDate,
          // ExpiryDate: res?.data?.data?.data[0]?.dtExpiry,
          ExpiryDate: new Date(res?.data?.data?.data[0]?.dtExpiry),
          BillingCompany: res?.data?.data?.data[0]?.BillingCompanyID,
          ShippingCompany: res?.data?.data?.data[0]?.ShippingCompanyID,
          BillingState: res?.data?.data?.data[0]?.BillingState,
          ShippingState: res?.data?.data?.data[0]?.ShippingState,
          BillingGST: res?.data?.data?.data[0]?.GSTNo,
          ShippingGST: res?.data?.data?.data[0]?.GSTNo,
          BillingPanCard: res?.data?.data?.data[0]?.PanCardNo,
          ShippingPanCard: res?.data?.data?.data[0]?.PanCardNo,
        });
        const updatedData = res?.data?.data?.dataDetail.map((ele) => ({
          ...ele,
          label: ele?.service?.label || "",
          // ExpectedDate: ele?.ExpectedDate,
          ExpectedDate:
            ele?.ExpectedDate == "01-Jan-1970" ? "" : ele?.ExpectedDate,
          LiveDate: ele?.LiveDate == "01-Jan-1970" ? "" : ele?.LiveDate,
          EndDate: ele?.EndDate == "01-Jan-1970" ? "" : ele?.EndDate,
          TaxPercent: ele?.TaxPrecentage,
          Discount: ele?.DiscountAmount,
          DiscountPercent: ele?.DiscountPercent,
          IsPaid: ele?.IsPaid,
        }));

        // console.log(updatedData);
        setTableData(updatedData);
        // setTableData(res?.data?.data?.dataDetail);
        if (res?.data?.data?.data[0]?.ProjectID > 0) {
          handleGetItemSearch(res?.data?.data?.data[0]?.ProjectID);

          // handleGetItemRate(res?.data?.data?.dataDetail[0])
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (data) {
      if (data?.ProjectID) {
        handleDeliveryChange("Project", { value: data.ProjectID });
      }
    }
  }, [data]);

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
          title={<span style={{ fontWeight: "bold" }}>Sales Register</span>}
          isBreadcrumb={data ? false : true}
          secondTitle={
            <div style={{ fontWeight: "bold" }}>
              <Link to="/SearchSalesBooking" className="ml-3">
                Back to List
              </Link>
            </div>
          }
        />
        <div className="row g-4 m-2">
          {/* {console.log("formDATAA?.Project", formData?.Project)}
          {console.log("project project", project)} */}
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
              isDisabled={true}
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
          <DatePicker
            className="custom-calendar"
            id="SalesDate"
            name="SalesDate"
            lable="Sales Date"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.SalesDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          <DatePicker
            className="custom-calendar"
            id="ExpiryDate"
            name="ExpiryDate"
            lable="Expiry Date"
            placeholder={VITE_DATE_FORMAT}
            value={formData?.ExpiryDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          <Input
            type="number"
            className="form-control"
            id="PoNumber"
            name="PoNumber"
            lable="Po Number"
            onChange={handleChange}
            value={formData?.PoNumber}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
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

          {state?.edit ? (
            <div className="col-xl-8 col-md-4 col-sm-6 col-12">
              <span style={{ fontWeight: "bold" }}>CreatedBy</span>:&nbsp;
              {state?.givenData?.CreatedBy}
              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                EntryDate
              </span>
              :&nbsp;
              {state?.givenData?.dtEntry}
              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                Sales No.:
              </span>
              &nbsp; {state?.givenData?.ActualSalesNo}
              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                PI No.:
              </span>
              &nbsp; {state?.givenData?.ActualPINo}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="row">
          <div className="col-6">
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
                      respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                      name="BillingCompany"
                      id="BillingCompany"
                      placeholderName="Company"
                      dynamicOptions={billingcompany}
                      handleChange={handleDeliveryChange}
                      value={
                        formData.BillingCompany ? formData.BillingCompany : ""
                      }
                      // requiredClassName={"required-fields"}
                    />
                    <i
                      className="fa fa-retweet mr-2 mt-2"
                      onClick={handlerefresh}
                      title="Click to Refresh Company."
                      style={{ cursor: "pointer" }}
                    ></i>
                    <i
                      className="fa fa-plus-circle fa-sm new_record_pluse mt-2 mr-2"
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
                      respclass="col-xl-7 col-md-4 col-sm-4 col-12"
                    />
                    {/* {console.log("check data",formData.BillingState)} */}
                    <ReactSelect
                      respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-2"
                      name="BillingState"
                      id="BillingState"
                      placeholderName="State"
                      dynamicOptions={statedata}
                      handleChange={handleDeliveryChange}
                      value={formData.BillingState ? formData.BillingState : ""}
                    />
                    {/* {console.log("check billing", formData.BillingGST)} */}
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
                      value={formData?.BillingGST}
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
          <div className="col-6">
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
                      respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                      name="ShippingCompany"
                      id="ShippingCompany"
                      placeholderName="Company"
                      dynamicOptions={billingcompany}
                      handleChange={handleDeliveryChange}
                      value={
                        formData.ShippingCompany ? formData.ShippingCompany : ""
                      }
                      // requiredClassName={"required-fields"}
                    />
                    <i
                      className="fa fa-retweet mr-2 mt-2"
                      onClick={handlerefresh}
                      title="Click to Refresh Company."
                      style={{ cursor: "pointer" }}
                    ></i>
                    <i
                      className="fa fa-plus-circle fa-sm new_record_pluse mt-2 mr-2"
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
                      respclass="col-xl-7 col-md-4 col-sm-4 col-12"
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
        <div className="mt-2">
          <Tables
            thead={salesbookingTHEAD}
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
                      // placeholder={"% Discount"}
                      onChange={(e) => handleSelectChange(e, index)}
                      value={ele?.DiscountPercent || 0}
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
                      value={ele?.Discount || 0}
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
                  // respclass="width100px"
                  className="summaryheightRemark"
                  placeholder="Remark "
                  id={"Remark"}
                  name="Remark"
                  value={ele?.Remark}
                  onChange={(e) => handleSelectChange(e, index)}
                  style={{ width: "150px", marginLeft: "7.5px" }}
                ></textarea>
              ),

              isPaid: (
                <>
                  <div className="search-col" style={{ marginLeft: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <label className="switch" style={{ marginTop: "7px" }}>
                        <input
                          type="checkbox"
                          name="isPaid"
                          checked={ele?.isPaid}
                          onChange={(e) => handleCheckBox(e, index)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span
                        style={{
                          marginLeft: "3px",
                          marginRight: "5px",
                          fontSize: "12px",
                        }}
                      ></span>
                    </div>
                  </div>
                </>
              ),
              "Expected/Start Date": (
                <>
                  <div className="mt-2">
                    <DatePicker
                      className="custom-calendar"
                      id="ExpectedDate"
                      name="ExpectedDate"
                      lable="Expected Date"
                      placeholder={VITE_DATE_FORMAT}
                      // value={new Date(ele?.ExpectedDate)}
                      selected={
                        ele?.ExpectedDate ? new Date(ele?.ExpectedDate) : null
                      }
                      respclass="width80px"
                      handleChange={(e) => searchHandleChange(e, index)}
                    />
                  </div>
                </>
              ),
              "Live Date": (formData.Items.label ==
                "Innopath  India New Centre License" ||
                formData.Items.label ==
                  "Innopath India Enterprises New Centre License" ||
                formData.Items.label ==
                  "Hospedia India New Centre License") && (
                <>
                  <div className="mt-2">
                    <DatePicker
                      className="custom-calendar"
                      id="LiveDate"
                      name="LiveDate"
                      lable="Live Date"
                      placeholder={VITE_DATE_FORMAT}
                      // value={new Date(ele?.LiveDate)}
                      selected={ele?.LiveDate ? new Date(ele?.LiveDate) : null}
                      respclass="width80px"
                      handleChange={(e) => searchHandleChange(e, index)}
                    />
                  </div>
                </>
              ),
              "Live Date":
                state?.edit === true ? (
                  <div className="mt-2">
                    <DatePicker
                      className="custom-calendar"
                      id="LiveDate"
                      name="LiveDate"
                      lable="Live Date"
                      placeholder={VITE_DATE_FORMAT}
                      value={new Date(ele?.LiveDate)}
                      // selected={ele?.LiveDate ? new Date(ele?.LiveDate) : null}
                      respclass="width80px"
                      handleChange={(e) => searchHandleChange(e, index)}
                    />
                  </div>
                ) : (
                  (formData.Items.value === 329 ||
                    formData.Items.value === 344 ||
                    formData.Items.value === 351) && (
                    <>
                      <div className="mt-2">
                        <DatePicker
                          className="custom-calendar"
                          id="LiveDate"
                          name="LiveDate"
                          lable="Live Date"
                          placeholder={VITE_DATE_FORMAT}
                          value={new Date(ele?.LiveDate)}
                          // selected={ele?.LiveDate ? new Date(ele?.LiveDate) : null}
                          respclass="width80px"
                          handleChange={(e) => searchHandleChange(e, index)}
                        />
                      </div>
                    </>
                  )
                ),
              "End Date": (ele?.service?.label === "AMC" ||
                ele?.service?.label === "Saas") && (
                <>
                  <div className="mt-2">
                    <DatePicker
                      className="custom-calendar"
                      id="EndDate"
                      name="EndDate"
                      lable="End Date"
                      placeholder={VITE_DATE_FORMAT}
                      // value={new Date(ele?.EndDate)}
                      selected={ele?.EndDate ? new Date(ele?.EndDate) : null}
                      respclass="width80px"
                      handleChange={(e) => searchHandleChange(e, index)}
                    />
                  </div>
                </>
              ),
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
                  <div className="col-sm-1"></div>
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
                    {/* <Input
                    type="text"
                    className="form-control"
                    id="TotalAmount"
                    name="TotalAmount"
                    placeholder="Total Amount"
                    lable="Total Amount"
                    onChange={handleSelectChange}
                    value={tableData?.reduce(
                      (accumulator, currentItem) =>
                        Number(accumulator) +
                        (Number(currentItem.Rate * currentItem.Quantity) -
                          Number(currentItem.Discount) +
                          Number(
                            currentItem.Rate * currentItem.Quantity -
                              currentItem.Discount
                          ) *
                            0.18 || 0),
                      0
                    )}
                    // value={formData?.TotalAmount}
                    respclass="w-50"
                    disabled={true}
                  /> */}
                    {/* {loading ? (
                    <Loading />
                  ) : (
                    <button
                      className="btn btn-sm btn-success ml-3"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  )} */}
                    {state?.edit ? (
                      <button
                        className="btn btn-sm btn-info ml-2"
                        onClick={handleUpdate}
                        disabled={isSubmitting}
                      >
                        Update
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-info ml-2"
                        onClick={handleSave}
                        disabled={isSubmitting}
                      >
                        Save
                      </button>
                    )}
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
export default SalesBooking;
