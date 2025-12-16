import React, { useEffect, useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";
import axios, { formToJSON } from "axios";
import { headers } from "../utils/apitools";
import Input from "../components/formComponent/Input";
import Tables from "../components/UI/customTable";
import gmaillimg from "../../src/assets/image/gmail.png";
import printlimg from "../../src/assets/image/print1.png";
import { inputBoxValidation } from "../utils/utils";
import { apiUrls } from "../networkServices/apiEndpoints";
import { AutoComplete } from "primereact/autocomplete";
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
import GmailQuotationModal from "../components/UI/customTable/GmailQuotationModal";
import SaleConvertModalEdit from "../components/UI/customTable/SaleConvertModalEdit";
import { useTranslation } from "react-i18next";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import QuotationPopupModal from "./QuotationPopupModal";
import { axiosInstances } from "../networkServices/axiosInstance";
const QuotationBooking = ({ data }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  console.log("kamal lotus", state);
  const AllowQuotationApproved = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowQuotationApproved"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  // console.log("quotaton dataa", state);
  const [billingcompany, setBillingCompany] = useState([]);
  const [shippingcompany, setShippingCompany] = useState([]);
  const [value, setValue] = useState("");
  const [aprrovedata, setApproveData] = useState([]);
  // console.log("aprrovedata", aprrovedata);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableData1, setTableData1] = useState([]);
  // console.log("tableData1", tableData1);
  const [statedata, setStatedata] = useState([]);
  const [project, setProject] = useState([]);
  const [category, setCategory] = useState([]);
  const [terms, setTerms] = useState([]);
  const [saveEditData, setSaveEditData] = useState([]);
  console.log("saveEditData", saveEditData);
  const [items, setItems] = useState([]);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [emailShow, setEmailShow] = useState({ Email: "" });
  const [projectEmail, setProjectEmail] = useState([]);

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
    DiscountAmount: "",
    TotalAmount: "",
    RoundOff: "",
    TotalTax: "",
    // SalesDate: new Date(),
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
    ExpectedDate: new Date(),
    Terms: "",
    OtherReason: "",
    ExpiryDate: new Date(),
    // ExpiryDate: new Date(
    //   new Date().getFullYear(),
    //   new Date().getMonth() + 1,
    //   0
    // ),
    EmailTo: projectEmail?.EmailTo || "",
    EmailCC: projectEmail?.EmailCC || "",
    EmailStatus: "1",
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
  const handleEmail = () => {
    setEmailShow((prev) => !prev);
  };
  const searchSelectChange = (e, index) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleCheckBoxEmail = (e) => {
    const { name, value, checked, type } = e?.target;
    if (checked) {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? 1 : value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: "", // blank instead of 0
        EmailCC: "",
        EmailTo: "",
      });
    }
  };

  const handleDeliveryChange = (name, e, index) => {
    const { value } = e;

    if (name === "Terms") {
      // Add the new row only if the selected term is not "Others"
      if (e?.label !== "Others") {
        setTableData1((prevData) => [
          ...prevData,
          {
            "S.No.": prevData.length + 1,
            Terms: e?.label || "",
            ID: e?.value || "",
            // OtherReason: formData?.OtherReason,
          },
        ]);
      }
    }

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
    /////////////////////////////
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
      getCompany(value);
      getProjectEmail(value);
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

  // const handleDeliveryChangeItems = (name, value) => {
  //   if (name === "Items" ) {
  //     handleGetItemRate({
  //       label: value?.label,
  //       value: value.value,
  //     });

  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };
  const [showModal, setShowModal] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const handleDeliveryChangeItems = (name, value) => {
    if (name === "Items") {
      const label = value?.label;

      // Use value.label directly instead of formData
      if (label === "Innopath India AMC" || label === "Hospedia India AMC") {
        setShowModal(true); // Open modal
        setShowTable(false); // Don't bind table yet
      } else {
        handleGetItemRate({ label, value: value.value }); // Immediately fetch and show table
        setShowTable(true);
      }

      // Always update formData
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

  const handleModalYes = () => {
    handleGetItemRate({
      label: formData?.Items?.label,
      value: formData?.Items?.value,
    });
    setShowTable(true);
    setShowModal(false);
  };
  const handleModalNo = () => {
    setFormData({ ...formData, Items: "" });
    setShowTable(true);
    setShowModal(false);
  };

  const handleGetItemRate = (value) => {
    axiosInstances
      .post(apiUrls.Quotation_Select, {
        ProjectID: String(formData?.Project),
        ItemID: value?.value ? String(value?.value) : String(value.ItemID),
        ItemName: value?.label ? String(value?.label) : String(value.ItemName),
        SearchType: "Rate",
      })

      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "RoleID",
      //     useCryptoLocalStorage("user_Data", "get", "RoleID")
      //   ),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
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
      .post(apiUrls.ProjectSelect, {
        ProjectID: 0,
        IsMaster: "0",
        VerticalID: 0,
        TeamID: 0,
        WingID: 0,
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
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
  const getProjectEmail = (proj) => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        ProjectID: Number(proj),
        IsMaster: "0",
        VerticalID: 0,
        TeamID: 0,
        WingID: 0,
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("ProjectID", proj),
      // axios
      //   .post(apiUrls?.ProjectSelect, form, { headers })
      .then((res) => {
        setProjectEmail(res?.data?.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    setTableData1([
      { "S.No.": 1, Terms: "50% advance along with PO", ID: "270" },
      { "S.No.": 2, Terms: "50% after delivery", ID: "271" },
    ]);
  }, []);

  const getTerms = () => {
    axiosInstances
      .post(apiUrls.PaymentTerms_Select, {
        QuotationID: "string",
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   // form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname")),
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
      .post(apiUrls.BillingCompany_Select, {
        ProjectID: Number(proj),
        IsActive: "1",
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append("ProjectID", proj),
      //   form.append("IsActive", "1"),
      //   axios
      //     .post(apiUrls?.BillingCompany_Select, form, { headers })
      .then((res) => {
        // console.log("billingcompany", res?.data?.data);
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
      .post(apiUrls.BillingCompanyDetail_Select_ID, {
        BillingCompanyID: Number(proj),
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
  const getCompanyShipping = (proj) => {
    axiosInstances
      .post(apiUrls.BillingCompanyDetail_Select_ID, {
        BillingCompanyID: Number(proj),
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append("BillingCompanyID", proj),
      //   // form.append("IsActive", "1"),
      //   axios
      //     .post(apiUrls?.BillingCompanyDetail_Select_ID, form, { headers })
      .then((res) => {
        // console.log("shippingcompanydetail",res?.data?.data[0])
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
    // console.log("responseresponse", response);
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
      // console.log("venumnnnn", response);
    }

    mainData[index] = response;
    // Set the updated table data in the state
    setTableData(mainData);
  };

  useEffect(() => {
    getProject();
  }, []);

  const handleGetItemSearch = (value) => {
    axiosInstances
      .post(apiUrls.Quotation_Select, {
        ProjectID: String(value),
        ItemID: "",
        ItemName: "",
        SearchType: "GetItem",
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "RoleID",
      //     useCryptoLocalStorage("user_Data", "get", "RoleID")
      //   ),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
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

  const encryptFile = state?.data;
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
    let termsPayload = [];
    tableData1?.map((val, index) => {
      termsPayload?.push({
        // "S.No.": index,
        TermsID: String(val?.ID),
        Terms: String(val?.Terms),
        // OtherReason: val?.OtherReason,
      });
    });
    let payload = [];
    tableData?.map((val, index) => {
      // console.log("valllll Update", val);
      payload.push({
        // Installment_No: index,
        Remark: String(val?.Remark || ""),
        IsPaid: String(val?.isPaid ? 1 : 0),
        ExpectedDate: String(moment(val?.ExpectedDate).format("YYYY-MM-DD")),
        ItemID: String(val?.service?.value ? val?.service?.value : val?.ItemID),
        ItemName: String(
          val?.service?.label ? val?.service?.label : val?.ItemName
        ),
        SAC: String(""),
        IsActive: String("0"),
        PaymentMode: String(val?.PaymentMode || ""),
        TaxAmount: String(val?.TaxAmount),
        TaxPrecentage: String(val?.TaxPercent || ""),
        Rate: String(val?.Rate),
        Quantity: String(val?.Quantity),
        DiscountAmount: String(val?.Discount),
        Amount: String(val?.Amount),
        EndDate: String(moment(val?.EndDate).format("YYYY-MM-DD")),
        GrossAmount: String(val?.GrossAmount),
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
      QuotationID: String(state?.data || recordID || ""),
      ProjectID: Number(formData?.Project || 0),
      ProjectName: getlabel(formData?.Project, project) || "",
      BillingCompanyID: Number(formData?.BillingCompany || 0),
      BillingCompanyName:
        getlabel(formData?.BillingCompany, billingcompany) || "",
      BillingCompanyAddress: String(formData?.BillingAddress || ""),
      BillingState: String(formData?.BillingState || ""),
      GSTNo: String(formData?.BillingGST || ""),
      PanCardNo: String(formData?.BillingPanCard || ""),
      ShippingCompanyID: Number(formData?.ShippingCompany || 0),
      ShippingCompanyName: String(
        getlabel(formData?.ShippingCompany, shippingcompany) || ""
      ),
      ShippingCompanyAddress: String(formData?.ShippingAddress || ""),
      ShippingState: String(formData?.ShippingState || ""),
      ShippingGSTNo: String(formData?.ShippingGST || ""),
      ShippingPanCardNo: String(formData?.ShippingPanCard || ""),
      GrossAmount: Number(GrossAmount || 0),
      DiscountAmount: Number(payload[0]?.DiscountAmount || 0),
      TaxAmount: Number(Tax || 0),
      Tax_Per: 18,
      CGST_Amount: Number(formData?.CgstAmount || 0),
      SGST_Amount: Number(formData?.SgstAmount || 0),
      IGST_Amount: 0,
      CGST_Per: 0,
      SGST_Per: 0,
      IGST_Per: 0,
      RoundOff: Number(formData?.RoundOff || 0),
      Document_Base64: "",
      Document_FormatType: "",
      ItemData: payload || [],
      PaymentTerms: termsPayload || [],
    };

    axiosInstances
      .post(apiUrls.Quotation_Update, payloadData)
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "RoleID",
      //     useCryptoLocalStorage("user_Data", "get", "RoleID")
      //   ),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("ProjectID", formData?.Project),
      //   form.append("ProjectName", getlabel(formData?.Project, project)),
      //   form.append("BillingCompanyID", formData?.BillingCompany),
      //   form.append(
      //     "BillingCompanyName",
      //     getlabel(formData?.BillingCompany, billingcompany)
      //   ),
      //   form.append("BillingCompanyAddress", formData?.BillingAddress),
      //   form.append("BillingState", formData?.BillingState),
      //   form.append("GSTNo", formData?.BillingGST),
      //   form.append("PanCardNo", formData?.BillingPanCard),
      //   form.append("ShippingCompanyID", formData?.ShippingCompany),
      //   form.append(
      //     "ShippingCompanyName",
      //     getlabel(formData?.ShippingCompany, shippingcompany)
      //   ),
      //   form.append("ShippingCompanyAddress", formData?.ShippingAddress),
      //   form.append("ShippingState", formData?.ShippingState),
      //   form.append("ShippingGSTNo", formData?.ShippingGST),
      //   form.append("ShippingPanCardNo", formData?.ShippingPanCard),
      //   form.append("dtSales", moment(formData?.SalesDate).format("YYYY-MM-DD")),
      //   form.append("PONo", formData?.PoNumber ?? ""),
      //   form.append(
      //     "ExpiryDate",
      //     moment(formData?.ExpiryDate).format("YYYY-MM-DD")
      //   ),
      //   form.append("GrossAmount", GrossAmount),
      //   // form.append("GrossAmount", formData?.TotalAmount),
      //   form.append("DiscountAmount", payload[0]?.DiscountAmount ?? ""),
      //   form.append("TaxAmount", Tax || ""),
      //   form.append("Tax_Per", 18),
      //   form.append("CGST_Amount", formData?.CgstAmount),
      //   form.append("SGST_Amount", formData?.SgstAmount),
      //   form.append("IGST_Amount", ""),
      //   form.append("CGST_Per", ""),
      //   form.append("SGST_Per", ""),
      //   form.append("IGST_Per", ""),
      //   form.append("RoundOff", formData?.RoundOff || ""),
      //   form.append("Document_Base64", ""),
      //   form.append("Document_FormatType", ""),
      //   form.append("QuotationID", state?.data || recordID),
      //   form.append("EmailTo", formData?.EmailTo),
      //   form.append("EmailCC", formData?.EmailCC),
      //   form.append("EmailStatus", formData?.EmailStatus),
      //   form.append("ItemData", JSON.stringify(payload));
      // form.append("PaymentTerms", JSON.stringify(termsPayload));
      // axios
      //   .post(apiUrls?.Quotation_Update, form, { headers })
      .then((res) => {
        if (res?.data?.success == true) {
          toast.success(res?.data?.message);
          setLoading(false);
          // setTableData([]);
          // setFormData({
          //   ...formData,
          //   Items: "",
          //   Project: "",
          // });
          // navigate("/SearchQuotationBooking")
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const [recordID, setRecordID] = useState("");

  const handleSave = () => {
    if (new Date(formData?.SalesDate) >= new Date(formData?.ExpiryDate)) {
      toast.error("Expiry Date must be greater than Sales Date.");
    } else {
      let termsPayload = [];
      tableData1?.map((val, index) => {
        termsPayload?.push({
          "S.No.": index,
          ID: val?.ID,
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
          TaxAmount: val?.TaxAmount,
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
      // console.log("Tax",Tax)
      const Amount =
        payload[0]?.Rate * payload[0]?.Quantity -
        payload[0]?.DiscountAmount +
        (payload[0]?.Rate * payload[0]?.Quantity - payload[0]?.DiscountAmount) *
          0.18 +
        payload[0]?.Amount;
      // console.log("Amount", Amount);

      setLoading(true);
      setIsSubmitting(true);

      const FinalPayload = {
        ProjectID: formData?.Project ? String(formData.Project) : "",
        ProjectName: String(getlabel(formData?.Project, project) || ""),

        BillingCompanyID: formData?.BillingCompany
          ? String(formData.BillingCompany)
          : "",
        BillingCompanyName: String(
          getlabel(formData?.BillingCompany, billingcompany) || ""
        ),
        BillingCompanyAddress: String(formData?.BillingAddress || ""),
        BillingState: String(formData?.BillingState || ""),
        GSTNo: String(formData?.BillingGST || ""),
        PanCardNo: String(formData?.BillingPanCard || ""),

        ShippingCompanyID: formData?.ShippingCompany
          ? String(formData.ShippingCompany)
          : "",
        ShippingCompanyName: String(
          getlabel(formData?.ShippingCompany, shippingcompany) || ""
        ),
        ShippingCompanyAddress: String(formData?.ShippingAddress || ""),
        ShippingState: String(formData?.ShippingState || ""),
        ShippingGSTNo: String(formData?.ShippingGST || ""),
        ShippingPanCardNo: String(formData?.ShippingPanCard || ""),

        dtSales: formData?.SalesDate
          ? String(moment(formData.SalesDate).format("YYYY-MM-DD"))
          : "",
        ExpiryDate: formData?.ExpiryDate
          ? String(moment(formData.ExpiryDate).format("YYYY-MM-DD"))
          : "",

        GrossAmount: String(formData?.TotalAmount ?? ""),
        DiscountAmount: String(payload[0]?.DiscountAmount ?? ""),
        TaxAmount: String(Tax ?? ""),
        Tax_Per: "18", // force string always
        CGST_Amount: String(formData?.CgstAmount ?? ""),
        SGST_Amount: String(formData?.SgstAmount ?? ""),
        IGST_Amount: "",
        CGST_Per: "",
        SGST_Per: "",
        IGST_Per: "",
        RoundOff: String(formData?.RoundOff ?? ""),

        Document_Base64: "",
        Document_FormatType: "",

        ItemData: String(JSON.stringify(payload) || "[]"),
        PaymentTerms: String(JSON.stringify(termsPayload) || "[]"),

        IsApproved: "0",
        PoNo: String(formData?.PoNumber || ""),
        EmailStatus: "0",
        EmailTo: String(formData?.EmailTo || ""),
        EmailCC: String(formData?.EmailCC || ""),
      };

      axiosInstances
        .post(apiUrls.Quotation_Insert, FinalPayload)
        .then((res) => {
          console.log("handlesave", res.data.data);
          if (res?.data?.success == true) {
            toast.success(res?.data?.message);
            setLoading(false);
            setSaveEditData(res?.data?.data[0]);
            setIsSubmitting(false);
            // setTableData([]);
            // setTableData1([]);
            // setFormData({
            //   ...formData,
            //   Items: "",
            //   Project: "",
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
            //   ShippingPanCard: "",
            //   Terms: "",
            // });
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
            setIsSubmitting(false);
          }
          if (res.status) {
            // console.log("res.status", res.status);
            localStorage.setItem("lotus", res.data.ID);
            setRecordID(res.data.ID); // Store the ID in state
            fetchDatabyEdit();
            // console.log("Record ID saved:", response.data.ID);
          } else {
            console.error("Failed to save record.");
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };
  const handleApprove = () => {
    if (new Date(formData?.SalesDate) >= new Date(formData?.ExpiryDate)) {
      toast.error("Expiry Date must be greater than Sales Date.");
      // return; // Prevent the API call
    } else {
      // let ids=[]
      // tableData?.map((val,index)=>{
      //     console.log("iddssss",val)
      //   ids+=`${index ,val?.service?.value},`
      // })
      // console.log("tableData idd idd",tableData1)
      let termsPayload = [];
      tableData1?.map((val, index) => {
        termsPayload?.push({
          "S.No.": index,
          ID: val?.ID,
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
          TaxAmount: val?.TaxAmount,
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
      // console.log("Tax",Tax)
      const Amount =
        payload[0]?.Rate * payload[0]?.Quantity -
        payload[0]?.DiscountAmount +
        (payload[0]?.Rate * payload[0]?.Quantity - payload[0]?.DiscountAmount) *
          0.18 +
        payload[0]?.Amount;
      // console.log("Amount", Amount);

      setLoading(true);
      setIsSubmitting(true);
     
      axiosInstances
        .post(apiUrls.Quotation_Approved, {
          QuotationID: String(state?.data || recordID),
        })
        .then((res) => {
          console.log("sav edit data", res?.data?.data);
          if (res?.data?.success == true) {
            toast.success(res?.data?.message);
            setLoading(false);
            setSaveEditData(res?.data?.data[0]);
            setApproveData(res?.data?.data[0]);
            setIsSubmitting(false);
            // setTableData([]);
            // setTableData1([]);
            // setFormData({
            //   ...formData,
            //   Items: "",
            //   Project: "",
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
            //   ShippingPanCard: "",
            //   Terms: "",
            // });
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
          // console.log("res.status", res);
          if (res.status) {
            // console.log("res.status", res.status);
            localStorage.setItem("lotus", res.data.ID);
            setRecordID(res.data.ID); // Store the ID in state
            fetchDatabyEdit();
            // console.log("Record ID saved:", response.data.ID); // Log to confirm
          } else {
            console.error("Failed to save record.");
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };
  const handleSaveApprove = () => {
    if (new Date(formData?.SalesDate) >= new Date(formData?.ExpiryDate)) {
      toast.error("Expiry Date must be greater than Sales Date.");
    } else {
      let termsPayload = [];
      tableData1?.map((val, index) => {
        termsPayload?.push({
          "S.No.": index,
          ID: val?.ID,
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
          TaxAmount: val?.TaxAmount,
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
      // console.log("Tax",Tax)
      const Amount =
        payload[0]?.Rate * payload[0]?.Quantity -
        payload[0]?.DiscountAmount +
        (payload[0]?.Rate * payload[0]?.Quantity - payload[0]?.DiscountAmount) *
          0.18 +
        payload[0]?.Amount;
      // console.log("Amount", Amount);

      setLoading(true);
      setIsSubmitting(true);

      const FinalPayload = {
        ProjectID: formData?.Project ? String(formData.Project) : "",
        ProjectName: String(getlabel(formData?.Project, project) || ""),

        BillingCompanyID: formData?.BillingCompany
          ? String(formData.BillingCompany)
          : "",
        BillingCompanyName: String(
          getlabel(formData?.BillingCompany, billingcompany) || ""
        ),
        BillingCompanyAddress: String(formData?.BillingAddress || ""),
        BillingState: String(formData?.BillingState || ""),
        GSTNo: String(formData?.BillingGST || ""),
        PanCardNo: String(formData?.BillingPanCard || ""),

        ShippingCompanyID: formData?.ShippingCompany
          ? String(formData.ShippingCompany)
          : "",
        ShippingCompanyName: String(
          getlabel(formData?.ShippingCompany, shippingcompany) || ""
        ),
        ShippingCompanyAddress: String(formData?.ShippingAddress || ""),
        ShippingState: String(formData?.ShippingState || ""),
        ShippingGSTNo: String(formData?.ShippingGST || ""),
        ShippingPanCardNo: String(formData?.ShippingPanCard || ""),

        dtSales: formData?.SalesDate
          ? String(moment(formData?.SalesDate).format("YYYY-MM-DD"))
          : "",
        ExpiryDate: formData?.ExpiryDate
          ? String(moment(formData?.ExpiryDate).format("YYYY-MM-DD"))
          : "",

        GrossAmount: formData?.TotalAmount ? String(formData?.TotalAmount) : "",
        DiscountAmount: payload[0]?.DiscountAmount
          ? String(payload[0]?.DiscountAmount)
          : "",
        TaxAmount: Tax ? String(Tax) : "",
        Tax_Per: String("18"),
        CGST_Amount: formData?.CgstAmount ? String(formData?.CgstAmount) : "",
        SGST_Amount: formData?.SgstAmount ? String(formData?.SgstAmount) : "",
        IGST_Amount: String(""),
        CGST_Per: String(""),
        SGST_Per: String(""),
        IGST_Per: String(""),
        RoundOff: formData?.RoundOff ? String(formData?.RoundOff) : "",

        Document_Base64: String(""),
        Document_FormatType: String(""),

        ItemData: String(JSON.stringify(payload)),
        PaymentTerms: String(JSON.stringify(termsPayload)),

        IsApproved: String("1"),
        PoNo: String(formData?.PoNumber || ""),

        // Extra fields from schema (set empty if not in FormData)
        EmailStatus: String(""),
        EmailTo: String(""),
        EmailCC: String(""),
      };

      axiosInstances
        .post(apiUrls.Quotation_Insert, FinalPayload)
        // let form = new FormData();
        // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
        //   form.append(
        //     "RoleID",
        //     useCryptoLocalStorage("user_Data", "get", "RoleID")
        //   ),
        //   form.append(
        //     "LoginName",
        //     useCryptoLocalStorage("user_Data", "get", "realname")
        //   ),
        //   form.append("ProjectID", formData?.Project),
        //   form.append("IsApproved", "1"),
        //   form.append("ProjectName", getlabel(formData?.Project, project)),
        //   form.append("BillingCompanyID", formData?.BillingCompany),
        //   form.append(
        //     "BillingCompanyName",
        //     getlabel(formData?.BillingCompany, billingcompany)
        //   ),
        //   form.append("BillingCompanyAddress", formData?.BillingAddress),
        //   form.append("BillingState", formData?.BillingState),
        //   form.append("GSTNo", formData?.BillingGST),
        //   form.append("PoNo", formData?.PoNumber || ""),
        //   form.append("PanCardNo", formData?.BillingPanCard),
        //   form.append("ShippingCompanyID", formData?.ShippingCompany),
        //   form.append(
        //     "ShippingCompanyName",
        //     getlabel(formData?.ShippingCompany, shippingcompany)
        //   ),
        //   form.append("ShippingCompanyAddress", formData?.ShippingAddress),
        //   form.append("ShippingGSTNo", formData?.ShippingGST),
        //   form.append("ShippingPanCardNo", formData?.ShippingPanCard),
        //   form.append("ShippingState", formData?.ShippingState),
        //   form.append(
        //     "dtSales",
        //     moment(formData?.SalesDate).format("YYYY-MM-DD")
        //   ),
        //   form.append(
        //     "ExpiryDate",
        //     moment(formData?.ExpiryDate).format("YYYY-MM-DD")
        //   ),
        //   // form.append("GrossAmount", GrossAmount),
        //   form.append("GrossAmount", formData?.TotalAmount),
        //   form.append("DiscountAmount", payload[0]?.DiscountAmount),
        //   form.append("TaxAmount", Tax),
        //   form.append("Tax_Per", 18),
        //   form.append("CGST_Amount", formData?.CgstAmount),
        //   form.append("SGST_Amount", formData?.SgstAmount),
        //   form.append("IGST_Amount", ""),
        //   form.append("CGST_Per", ""),
        //   form.append("SGST_Per", ""),
        //   form.append("IGST_Per", ""),
        //   form.append("RoundOff", formData?.RoundOff ?? ""),
        //   form.append("Document_Base64", ""),
        //   form.append("Document_FormatType", ""),
        //   form.append("QuotationID", state?.data || recordID),
        //   form.append("ItemData", JSON.stringify(payload));
        // form.append("PaymentTerms", JSON.stringify(termsPayload));
        // axios
        // .post(apiUrls?.Quotation_Insert, form, { headers })
        .then((res) => {
          if (res?.data?.success == true) {
            toast.success(res?.data?.message);
            setApproveData(res?.data?.data[0]);
            setLoading(false);
            setIsSubmitting(false);
            // setTableData([]);
            // setTableData1([]);
            // setFormData({
            //   ...formData,
            //   Items: "",
            //   Project: "",
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
            //   ShippingPanCard: "",
            //   Terms: "",
            // });
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
          // console.log("res.status", res);
          if (res.status) {
            // console.log("res.status", res.status);
            localStorage.setItem("lotus", res.data.ID);
            setRecordID(res.data.ID); // Store the ID in state
            fetchDatabyEdit();
            // console.log("Record ID saved:", response.data.ID);
          } else {
            console.error("Failed to save record.");
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const handleResetFilter = () => {
    setFormData({
      // ...formData,
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
      DiscountAmount: "",
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
    setTableData1([]);
    setTableData([]);
    setSaveEditData([]);
    setApproveData([]);
  };

  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;

    let updatedFormData = { ...formData, [name]: value };

    if (name === "SalesDate" && value) {
      // Ensure the value is a valid date
      const salesDate = new Date(value);
      if (!isNaN(salesDate.getTime())) {
        // Calculate ExpiryDate (10 days after SalesDate)
        const expiryDate = new Date(salesDate);
        expiryDate.setDate(salesDate.getDate() + 10);

        // Format the ExpiryDate (YYYY-MM-DD format)
        const formattedExpiryDate = new Date(expiryDate);

        updatedFormData = {
          ...updatedFormData,
          ExpiryDate: new Date(formattedExpiryDate),
        };
      }

      setFormData(updatedFormData); // Update formData with the new values
    } else if (name === "ExpectedDate") {
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

  const getState = (value) => {
    axiosInstances
      .post(apiUrls.GetState, {
        CountryID: "14",
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
    if (state?.edit === true) {
      fetchDatabyId(state.data);
      getProjectEmail(formData?.Project);
      fetchDatabyEdit(state.data);
    }
  }, []);
  const [savelotus, setSaveLotus] = useState([]);

  const fetchDatabyId = (id) => {
    console.log("master", id);
    axiosInstances
      .post(apiUrls.Quotation_Load_QuotationID, {
        QuotationID: String(id),
      })
      .then((res) => {
        console.log("data ", res.data.data.data);
        console.log("dataDetail ", res.data.data.dataDetail);
        console.log("dataterms ", res.data.data.dtTerms);
        setSaveLotus(res?.data?.data?.data[0]);
        setFormData({
          ...formData,
          Project: res?.data?.data?.data[0]?.ProjectID,
          Items: res?.data?.data?.dataDetail[0]?.ItemID,
          ItemName: res?.data?.data.dataDetail[0]?.ItemName,
          ExpectedDate: res?.data?.data.dataDetail[0]?.ExpectedDate,
          BillingCompany: res?.data?.data.data[0]?.BillingCompanyID,
          ShippingCompany: res?.data?.data.data[0]?.ShippingCompanyID,
          BillingState: res?.data?.data?.data[0]?.BillingState,
          ShippingState: res?.data?.data?.data[0]?.ShippingState,
          BillingGST: res?.data?.data?.data[0]?.GSTNo,
          ShippingGST: res?.data?.data?.data[0]?.ShippingGSTNo,
          BillingPanCard: res?.data?.data?.data[0]?.PanCardNo,
          ShippingPanCard: res?.data?.data?.data[0]?.ShippingPanCardNo,
          PoNumber: res?.data?.data?.data[0]?.PoNo,
          SalesDate: new Date(res?.data?.data?.data[0]?.dtEntry),
          ExpiryDate: new Date(res?.data?.data?.data[0]?.dtExpiry),
          BillingAddress: res?.data?.data?.data[0]?.BillingCompanyAddress,
          ShippingAddress: res?.data?.data?.data[0]?.ShippingCompanyAddress,
        });
        const updatedData = res?.data?.data?.dataDetail?.map((ele) => ({
          ...ele,
          label: ele?.service?.label || "",
          ExpectedDate: new Date(ele?.ExpectedDate),
          TaxPercent: ele?.TaxPrecentage,
          Discount: ele?.DiscountAmount,
          DiscountPercent: ele?.DiscountPercent,
        }));
        setTableData(updatedData);
        const updateTerms = res?.data?.data?.dtTerms?.map((ele) => ({
          ...ele,
          label: ele?.Terms || "",
        }));
        setTableData1(updateTerms);

        if (res?.data?.data?.data[0]?.ProjectID > 0) {
          handleGetItemSearch(res?.data?.data?.data[0]?.ProjectID);
          getCompany(res?.data?.data?.data[0]?.ProjectID);
          getProjectEmail(res?.data?.data?.data[0]?.ProjectID);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchDatabyEdit = (id) => {
   
    axiosInstances
      .post(apiUrls.Quotation_Load_QuotationID, {
        QuotationID: String(id),
      })
      .then((res) => {
        console.log("Edit Check Value", res?.data?.data?.data);
        setSaveEditData(res?.data?.data?.data[0]);
        setApproveData(res?.data?.data?.data[0]);
        setFormData({
          ...formData,
          Project: res?.data?.data?.data[0]?.ProjectID,
          Items: res?.data?.data?.dataDetail[0]?.ItemID,
          ItemName: res?.data?.data?.dataDetail[0]?.ItemName,
          ExpectedDate: res?.data?.data?.dataDetail[0]?.ExpectedDate,
          BillingCompany: res?.data?.data?.data[0]?.BillingCompanyID,
          ShippingCompany: res?.data?.data?.data[0]?.ShippingCompanyID,
          BillingState: res?.data?.data?.data[0]?.BillingState,
          ShippingState: res?.data?.data?.data[0]?.ShippingState,
          BillingGST: res?.data?.data?.data[0]?.GSTNo,
          ShippingGST: res?.data?.data?.data[0]?.GSTNo,
          BillingPanCard: res?.data?.data?.data[0]?.PanCardNo,
          ShippingPanCard: res?.data?.data?.data[0]?.PanCardNo,
          PoNumber: res?.data?.data?.data[0]?.PoNo,
          SalesDate: new Date(res?.data?.data?.data[0]?.dtEntry),
          ExpiryDate: new Date(res?.data?.data?.data[0]?.dtExpiry),
          // ItemName:res?.data?.dataDetail[0]?.ItemName
        });
        // console.log("expectedcheckk", res?.data?.dataDetail[0]?.ExpectedDate);
        const updatedData = res?.data?.data?.dataDetail?.map((ele) => ({
          ...ele,
          label: ele?.service?.label || "",
          ExpectedDate: new Date(ele?.ExpectedDate),
          TaxPercent: ele?.TaxPrecentage,
          Discount: ele?.DiscountAmount,
          DiscountPercent: ele?.DiscountPercent,
        }));

        // console.log(updatedData);
        setTableData(updatedData);
        const updateTerms = res?.data?.data?.dtTerms?.map((ele) => ({
          ...ele,
          label: ele?.Terms || "",
        }));
        setTableData1(updateTerms);

        if (res?.data?.data[0]?.ProjectID > 0) {
          handleGetItemSearch(res?.data?.data?.data[0]?.ProjectID);
          getCompany(res?.data?.data?.data[0]?.ProjectID);
          // getState()
        }
        // localStorage.removeItem("lotus")
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
    saleVisible: false,
    gmailVisible: false,
    popupVisible: false,
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

  useEffect(() => {
    if (data) {
      if (data?.ProjectID) {
        handleDeliveryChange("Project", { value: data.ProjectID });
      }
    }
  }, [data]);

  const [t] = useTranslation();
  const quotagTHEAD = [
    { name: t("S.No."), width: "10%" },
    t("Terms"),
    { name: t("Cancel"), width: "10%" },
  ];

  const quotationbookingTHEAD = [
    t("S.No."),
    t("Services"),
    t("Payment Mode"),
    t("Rate"),
    t("Quantity"),
    t("Discount / %"),
    t("Tax / %"),
    t("Amount"),
    t("Remark"),
    t("Expected/Start Date"),
    t("Remove"),
  ];

  useEffect(() => {
    if (
      formData?.Items?.label === "Innopath India AMC" ||
      formData?.Items?.label === "Hospedia India AMC"
    ) {
      setVisible((prev) => ({ ...prev, popupVisible: true }));
    } else {
      setVisible((prev) => ({ ...prev, popupVisible: false }));
    }
  }, [formData?.Items?.label]);

  return (
    <>
      {/* {showModal && (
        <Modal
          modalWidth={"400px"}
          setVisible={setShowModal}
          onConfirm={handleModalYes}
        >
          <QuotationPopupModal
            setVisible={setShowModal}
            onConfirm={handleModalYes}
          />
        </Modal>
      )} */}
      {showModal && (
        <QuotationPopupModal
          setVisible={setShowModal}
          onConfirm={handleModalYes}
          OnNo={handleModalNo}
        />
      )}
      {visible?.showCompany && (
        <Modal
          modalWidth={"700px"}
          visible={visible?.showCompany}
          setVisible={setVisible}
          tableData={visible?.showData}
          projectid={formData?.Project}
          Header={t("New Billing Company")}
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
          Header={t("New Shipping Company")}
        >
          <AddNewShippingCompany
            visible={visible?.shippingCompany}
            setVisible={setVisible}
            tableData={visible?.showData}
            projectid={formData?.Project}
          />
        </Modal>
      )}

      {visible?.saleVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          encryptFile={encryptFile}
          formData={formData?.Project}
          Header={t("Sale Convert")}
        >
          <SaleConvertModalEdit
            visible={visible}
            encryptFile={encryptFile}
            setVisible={setVisible}
            edit={true}
          />
        </Modal>
      )}
      {visible?.gmailVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          formData={formData?.Project}
          Header={t("Gmail")}
        >
          <GmailQuotationModal
            visible={visible}
            setVisible={setVisible}
            edit={true}
          />
        </Modal>
      )}
      <div className="card">
        <Heading
          title={
            <span style={{ fontWeight: "bold" }}>
              {t("Quotation Register")}
            </span>
          }
          isBreadcrumb={data ? false : true}
        />
        <div className="row g-4 m-2">
          {state?.edit ? (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="Project"
              placeholderName={t("Project")}
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
              placeholderName={t("Project")}
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
            lable={t("Quotation Date")}
            placeholder={VITE_DATE_FORMAT}
            value={formData?.SalesDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          <DatePicker
            className="custom-calendar"
            id="ExpiryDate"
            name="ExpiryDate"
            lable={t("Expiry Date")}
            placeholder={VITE_DATE_FORMAT}
            value={formData?.ExpiryDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="PoNumber"
            name="PoNumber"
            lable={t("Po Number")}
            onChange={handleChange}
            value={formData?.PoNumber}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Items"
            placeholderName={t("Item")}
            dynamicOptions={items}
            className="Items"
            handleChange={(name, value) =>
              handleDeliveryChangeItems(name, value)
            }
            value={formData.Items}
            requiredClassName={"required-fields"}
            isDisabled={showModal === true}
          />

          {/* {recordID?.length > 0 && (
            <div>
              <button
                className=" btn btn-sm btn-primary ml-3"
                onClick={fetchDatabyEdit}
              >
                Edit
              </button>
            </div>
          )} */}
          <div>
            <Link
              to="/SearchQuotationBooking"
              className="ml-3"
              style={{ fontWeight: "bold" }}
            >
              {t("Back to List")}
            </Link>
          </div>

          {console.log("suneel ", saveEditData)}
          {saveEditData?.CreatedBy && saveEditData?.dtEntry && (
            <div className="col-xl-6 col-md-4 col-sm-6 col-12">
              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                {t("CreatedBy")} :&nbsp;
                {saveEditData?.CreatedBy}
              </span>

              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                {t("EntryDate")} :&nbsp;
                {moment(saveEditData?.dtEntry).format("YYYY-MM-DD")}
              </span>
              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                {t("Quotation No.")} :&nbsp;
                {saveEditData?.QuotationNo}
              </span>
            </div>
          )}

          {/* {aprrovedata?.CreatedBy && aprrovedata?.dtEntry && (
            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                CreatedBy :&nbsp;
                {aprrovedata?.CreatedBy}
              </span>

              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                EntryDate :&nbsp;
                {moment(aprrovedata?.dtEntry).format("YYYY-MM-DD")}
              </span>
            </div>
          )} */}

          {/* {state?.edit && (
            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                CreatedBy :&nbsp;
                {state?.givenData?.CreatedBy}
              </span>

              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                EntryDate :&nbsp;
                {moment(state?.givenData?.dtEntry).format("YYYY-MM-DD")}
              </span>
            </div>
          )} */}
          {/* {savelotus?.QuotationNo && (
            <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
              Quotation No. :&nbsp;
              {savelotus?.QuotationNo}
            </span>
          )} */}
        </div>
        <div className="row">
          <div className="col-xl-4 col-sm-12 col-md-6">
            <div className="card BillingDetails border mt-2">
              <Heading
                title={t("Billing Details")}
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
                      respclass="col-xl-6 col-md-4 col-sm-6 col-12"
                      name="BillingCompany"
                      id="BillingCompany"
                      placeholderName={t("Company")}
                      dynamicOptions={billingcompany}
                      handleChange={handleDeliveryChange}
                      value={
                        formData.BillingCompany ? formData.BillingCompany : ""
                      }
                    />
                    <i
                      className="fa fa-retweet mr-2 mt-2"
                      onClick={handlerefresh}
                      title={t("Click to Refresh Company.")}
                      style={{ cursor: "pointer" }}
                    ></i>
                    <i
                      className="fa fa-plus-circle fa-sm new_record_pluse mt-2"
                      style={{ cursor: "pointer" }}
                      title={t("Click to Create New Billing Company.")}
                      onClick={() => {
                        setVisible({ showCompany: true, showData: "" });
                      }}
                    ></i>
                    <Input
                      type="text"
                      className="form-control"
                      id="BillingAddress"
                      name="BillingAddress"
                      lable={t("Address")}
                      placeholder=" "
                      onChange={handleChange}
                      value={
                        formData?.BillingAddress ? formData?.BillingAddress : ""
                      }
                      respclass="col-xl-5 col-md-4 col-sm-4 col-12"
                    />
                    {/* {console.log("check data",formData.BillingState)} */}
                    <ReactSelect
                      respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-2"
                      name="BillingState"
                      id="BillingState"
                      placeholderName={t("State")}
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
                      lable={t("GST")}
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
                      lable={t("PanCard")}
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
          <div className="col-xl-4 col-sm-12 col-md-6">
            <div className="card ShippingDetails border mt-2">
              <Heading
                title={t("Shipping Details")}
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
                      respclass="col-xl-6 col-md-4 col-sm-6 col-12"
                      name="ShippingCompany"
                      id="ShippingCompany"
                      placeholderName={t("Company")}
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
                      title={t("Click to Refresh Company.")}
                      style={{ cursor: "pointer" }}
                    ></i>
                    <i
                      className="fa fa-plus-circle fa-sm new_record_pluse mt-2"
                      title={t("Click to Create New Shipping Company.")}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setVisible({ shippingCompany: true, showData: "" });
                      }}
                    ></i>
                    <Input
                      type="text"
                      className="form-control"
                      id="ShippingAddress"
                      name="ShippingAddress"
                      lable={t("Address")}
                      placeholder=" "
                      onChange={handleChange}
                      value={
                        formData?.ShippingAddress
                          ? formData?.ShippingAddress
                          : ""
                      }
                      respclass="col-xl-5 col-md-4 col-sm-4 col-12"
                    />
                    <ReactSelect
                      respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-2"
                      name="ShippingState"
                      id="ShippingState"
                      placeholderName={t("State")}
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
                      lable={t("GST")}
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
                      lable={t("PanCard")}
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

          <div className="col-xl-4 col-sm-12 col-md-6">
            <div className="card termscondition border mt-2">
              <Heading title={t("Terms & Conditions")} />
              <div className="row m-2">
                <ReactSelect
                  respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                  name="Terms"
                  placeholderName={t("Terms")}
                  dynamicOptions={terms}
                  className="Terms"
                  handleChange={handleDeliveryChange}
                  value={formData.Terms}
                />
                {othersReason?.label == "Others" && (
                  <Input
                    type="text"
                    className="form-control"
                    id="OtherReason"
                    name="OtherReason"
                    lable={t("Other Terms")}
                    placeholder=" "
                    onChange={searchHandleChange}
                    value={formData?.OtherReason}
                    respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                  />
                )}
                {othersReason?.label == "Others" && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleSaveOthers}
                  >
                    {t("Save")}
                  </button>
                )}
                <button
                  className="btn btn-sm btn-primary ml-3"
                  onClick={handleReset}
                >
                  {t("Reset")}
                </button>
                <div>
                  <div className="card mt-1">
                    <div className="row m-1">
                      <Tables
                        thead={quotagTHEAD}
                        tbody={tableData1?.map((ele, index) => ({
                          "S.No.": index + 1,
                          Terms: ele?.Terms,
                          Cancel: (
                            <span
                              label="Remove"
                              icon="pi pi-trash"
                              className="fa fa-trash"
                              onClick={() => handleRemoveRow(index)}
                              style={{
                                cursor: "pointer",
                                color: "red",
                                marginLeft: "10px",
                              }}
                            />
                          ),
                        }))}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>
        </div>
        {/* {console.log("tableDatatableData", tableData)} */}
        <Tables
          thead={quotationbookingTHEAD}
          tbody={tableData?.map((ele, index) => ({
            "S.No.": <div className="p-2">{index + 1}</div>,
            Services: ele?.SalesLabel?.label
              ? ele?.SalesLabel?.label
              : ele?.ItemName,

            "Payment Mode": (
              <>
                <ReactSelect
                  name="PaymentMode"
                  placeholderName={t("Payment Mode")}
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
                lable={t("Rate")}
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
                lable={t("Quantity")}
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
                    lable={t("%")}
                    onChange={(e) => handleSelectChange(e, index)}
                    value={ele?.DiscountPercent}
                  />
                  {/* {ele?.DiscountPercent !== "" && ( */}
                  <Input
                    type="number"
                    className="form-control"
                    id="Discount"
                    name="Discount"
                    lable={t("₹")}
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
                    lable={t("₹")}
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
                    lable={t("%")}
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
                lable={t("Amount")}
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
                // respclass="summaryheight"
                className="summaryheightRemark"
                placeholder={t("Remark")}
                id={"Remark"}
                name="Remark"
                value={ele?.Remark}
                onChange={(e) => handleSelectChange(e, index)}
                style={{ width: "150px", marginLeft: "7.5px" }}
              ></textarea>
            ),

            "Expected/Start Date": (
              <>
                {/* {console.log("ele?.ExpectedDate", ele?.ExpectedDate)} */}

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
                <label style={{ marginRight: "25px" }}>{t("SubTotal")}: </label>
                <div className="col-2">
                  <Input
                    type="number"
                    className="form-control"
                    id="TotalRate"
                    name="TotalRate"
                    lable={t("Total Rate")}
                    placeholder={t("Total Rate")}
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
                    lable={t("Total Quantity")}
                    placeholder={t("Total Quantity")}
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
                    lable={t("Total Discount")}
                    placeholder={t("Total Discount")}
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
                    lable={t("Total Tax")}
                    placeholder={t("Total Tax")}
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
                    lable={t("Total Amount")}
                    placeholder={t("Total Amount")}
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
                    placeholder={t("Taxable Amount")}
                    lable={t("Taxable Amount")}
                    onChange={handleSelectChange}
                    value={
                      tableData?.reduce(
                        (accumulator, currentItem) =>
                          Number(accumulator) + Number(currentItem.Amount || 0),
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
                    placeholder={t("SGST@9")}
                    lable={t("SGST@9")}
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
                    placeholder={t("CGST@9")}
                    lable={t("CGST@9")}
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
                      {t("AutoRoundOff")}
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
                    {t("AutoRoundOff")}
                  </span>
                </div>
                <button
                  className="btn btn-sm btn-primary ml-3"
                  onClick={handleResetFilter}
                >
                  {t("ResetFilter")}
                </button>
              </div>

              {/* <div className="col-2 d-flex">
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
                        disabled={isSubmitting === false}
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div> */}
            </div>
          </div>
        )}

        <div className="row m-2">
          {tableData?.length > 0 && (
            <div>
              {state?.edit || recordID ? (
                <button
                  className="btn btn-sm btn-success ml-2"
                  onClick={handleUpdate}
                  // disabled={isSubmitting}
                >
                  {t("Update")}
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={handleSave}
                  disabled={isSubmitting && recordID}
                >
                  {t("Save")}
                </button>
              )}
            </div>
          )}

          {/* {recordID?.length > 0 && saveEditData?.IsApproved === 0 && (
            <div>
              <button className="btn btn-sm btn-info ml-2" onClick={handleSave}>
                Approve
              </button>
            </div>
          )} */}
          {tableData?.length > 0 &&
            recordID?.length > 0 &&
            aprrovedata?.IsApproved !== 1 && (
              <div>
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={handleApprove}
                >
                  {t("Approve")}
                </button>
              </div>
            )}

          {tableData?.length > 0 &&
          AllowQuotationApproved == 1 &&
          !recordID &&
          !state?.edit ? (
            <div>
              <button
                className="btn btn-sm btn-info ml-2"
                onClick={handleSaveApprove}
              >
                {t("Save & Approve")}
              </button>
            </div>
          ) : (
            ""
          )}

          {recordID?.length > 0 && saveEditData?.SalesID === 0 && (
            <div>
              {" "}
              <button
                className="btn btn-sm btn-info ml-2"
                onClick={() => {
                  setVisible({
                    saleVisible: true,
                    showData: { saveEditData, recordID },
                    // formData:[project]
                  });
                }}
              >
                {t("Sales Convert")}
              </button>
            </div>
          )}
          {state?.edit && (
            <div>
              <button
                className="btn btn-sm btn-info ml-2"
                onClick={() => {
                  setVisible({
                    saleVisible: true,
                    showData: { saveEditData, recordID },
                    // formData:[project]
                  });
                }}
              >
                {t("Sales Convert")}
              </button>
            </div>
          )}
          {tableData?.length > 0 && recordID?.length > 0 && (
            <div>
              <img
                src={printlimg}
                className=" ml-3"
                style={{
                  width: "33px",
                  height: "30px",
                  cursor: "pointer",
                }}
                title="Click here to Print."
                onClick={() => window.open(aprrovedata?.QuotationURL, "_blank")}
              ></img>
            </div>
          )}
          <div className="search-col" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="EmailStatus"
                  checked={formData?.EmailStatus ? 1 : 0}
                  onChange={handleCheckBoxEmail}
                />
                <span className="slider"></span>
              </label>
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "5px",
                  fontSize: "12px",
                }}
              >
                {t("Email")}
              </span>
            </div>
          </div>

          {formData?.EmailStatus == "1" && (
            <>
              <textarea
                type="text"
                className="summaryheightRemark1"
                placeholder={t("EmailTo")}
                id={"EmailTo"}
                name="EmailTo"
                value={formData?.EmailTo}
                // value={
                //   formData?.EmailTo ? formData?.EmailTo : projectEmail?.EmailTo
                // }
                onChange={searchSelectChange}
                style={{ width: "400px", marginLeft: "7.5px" }}
              ></textarea>
              <textarea
                type="text"
                className="summaryheightRemark1"
                placeholder={t("EmailCC")}
                id={"EmailCC"}
                name="EmailCC"
                value={formData?.EmailCC}
                // value={
                //   formData?.EmailCC ? formData?.EmailCC : projectEmail?.EmailCC
                // }
                onChange={searchSelectChange}
                style={{ width: "480px", marginLeft: "7.5px" }}
              ></textarea>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default QuotationBooking;
