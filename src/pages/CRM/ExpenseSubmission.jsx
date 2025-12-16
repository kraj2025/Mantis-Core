import React, { useEffect, useRef, useState } from "react";
import Heading from "../../components/UI/Heading";
import { Tabfunctionality } from "../../utils/helpers";
import ReactSelect from "../../components/formComponent/ReactSelect";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";
import meals from "../../assets/image/meal.png";
import hotels from "../../assets/image/hotel.png";
import travel from "../../assets/image/travel.png";
import intercity from "../../assets/image/intercity2.png";
import phone from "../../assets/image/phone.png";
import client from "../..//assets/image/client.png";
import other from "../../assets/image/other.png";
import Tables from "../../components/UI/customTable";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import BrowseInput from "../../components/formComponent/BrowseInput";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
const currentYear = currentDate.getFullYear();
const ExpenseSubmission = () => {
  const location = useLocation();
  const { state } = location;

  const { VITE_DATE_FORMAT } = import.meta.env;
  const [states, setState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ExpenseType: "",
    EmployeeName: "",
    VerticalID: [],
    TeamID: [],
    WingID: [],
    Designation: [],
    ReportingPerson: "",
    Mobile: "",
    Status: "",
    MaximumWeekoffs: "",
    ExpenseCategory: "",
    HotelAmount: "",
    HotelName: "",
    Description: "",
    TravelType: "",
    InterTravelType: "",
    IntercityAmount: "",
    From: "",
    To: "",
    TravelAmount: "",
    TravelDescription: "",
    MealsDescription: "",
    OthersAmount: "",
    OthersDescription: "",
    PhoneAmount: "",
    PhoneDescription: "",
    EntertainmentAmount: "",
    EntertainmentDescription: "",
    OtherAmount: "",
    OtherDescription: "",
    BreakfastAmount: "",
    LunchAmount: "",
    DinnerAmount: "",
    MealDescription: "",
    HotelDescription: "",
    Country: "",
    State: "",
    District: "",
    City: "",
    ClientName: "",
    DocumentType: "",
    SelectFile: "",
    Document_Base64: "",
    FileExtension: "",
    FromDate: "",
    TripName: "",
    Locality: "",
    OtherTeammate: "",
    currentMonth: currentMonth,
    currentYear: currentYear,
  });
  // console.log("update", formData);
  // useEffect(() => {
  //   if (state?.edit) {
  //     handleIsExpenseExists(state?.data);
  //   }
  // }, []);

  const handleHotelClear = () => {
    setFormData({
      ...formData,
      HotelAmount: "",
      HotelName: "",
      HotelDescription: "",
    });
  };

  const handleMealClear = () => {
    setFormData({
      ...formData,
      BreakfastAmount: "",
      LunchAmount: "",
      DinnerAmount: "",
      MealDescription: "",
    });
  };

  const handlePhoneClear = () => {
    setFormData({ ...formData, PhoneAmount: "", PhoneDescription: "" });
  };
  const handleClientClear = () => {
    setFormData({
      ...formData,
      EntertainmentAmount: "",
      EntertainmentDescription: "",
    });
  };
  const handleOtherClear = () => {
    setFormData({ ...formData, OtherAmount: "", OtherDescription: "" });
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
        setState(states);
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
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  // useEffect(() => {
  //   if (formData?.FromDate) {
  //     handleIsExpenseExists(formData?.FromDate);
  //   }
  // }, [formData?.FromDate]);

  const rowConst = {
    show: false,
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    show6: false,
    show7: false,
  };
  const [rowHandler, setRowHandler] = useState(rowConst);
  const handlerow = (row) => {
    let obj;
    if (!rowHandler[row]) {
      obj = { ...rowHandler, [row]: true };
    } else {
      obj = { ...rowHandler, [row]: false };
    }
    setRowHandler(obj);
  };

  const travelThead = [
    { name: "Travel Type" },
    { name: "From" },
    { name: "To" },
    { name: "Amount" },
    { name: "Description" },
    { name: "Add/Remove" },
  ];
  const intercityThead = [
    { name: "Travel Type" },
    { name: "From" },
    { name: "To" },
    { name: "Amount" },
    { name: "Description" },
    { name: "Add/Remove" },
  ];
  const [rows, setRows] = useState([
    {
      TravelType: "",
      TravelFrom: "",
      TravelTo: "",
      TravelAmount: "",
      TravelDescription: "",
    },
  ]);
  const [rows1, setRows1] = useState([
    {
      InterTravelType: "",
      IntercityFrom: "",
      IntercityTo: "",
      IntercityAmount: "",
      IntercityDescription: "",
    },
  ]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        TravelType: "",
        TravelFrom: "",
        TravelTo: "",
        TravelAmount: "",
        TravelDescription: "",
      },
    ]);
  };
  const handleAddRow1 = () => {
    setRows1([
      ...rows1,
      {
        InterTravelType: "",
        IntercityFrom: "",
        IntercityTo: "",
        IntercityAmount: "",
        IntercityDescription: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  };
  const handleRemoveRow1 = (index) => {
    const updatedRows = rows1.filter((_, rowIndex) => rowIndex !== index);
    setRows1(updatedRows);
  };

  const handleInputChange = (e, index, field) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = e.target.value;
    setRows(updatedRows);
  };
  const handleInputChange1 = (e, index, field) => {
    const updatedRows = [...rows1];
    updatedRows[index][field] = e.target.value;
    setRows1(updatedRows);
  };

  const handleDeliveryChangeValue = (name, value, index) => {
    let updatedRows = [...rows];
    let updatedRows1 = [...rows1];

    switch (name) {
      case "TravelType":
        updatedRows[index]["TravelType"] = value;
        setRows(updatedRows);
        break;

      case "InterTravelType":
        updatedRows1[index]["InterTravelType"] = value;
        setRows1(updatedRows1);
        break;

      default:
        updatedRows[index]["TravelType"] = value;
        updatedRows1[index]["InterTravelType"] = value;
        setRows(updatedRows);
        setRows1(updatedRows1);
    }
  };

  const handleSave = () => {
    if (!formData?.FromDate) {
      toast.error("Please Select Date");
      return;
    }
    if (!formData?.TripName) {
      toast.error("Please Enter Trip Name");
      return;
    }
    if (!formData?.State) {
      toast.error("Please Select State");
      return;
    }
    if (!formData?.City) {
      toast.error("Please Enter City Name");
      return;
    }
    if (!formData?.Locality) {
      toast.error("Please Enter Locality");
      return;
    }
    if (!formData?.ClientName) {
      toast.error("Please Enter Client Name");
      return;
    }
    if (!formData?.ExpenseType) {
      toast.error("Please Select Expense Type");
      return;
    }

    const GeneralDetailsJson = [
      {
        Date: moment(formData?.FromDate).format("YYYY-MM-DD"),
        TripName: formData?.TripName,
        // State: getlabel(formData?.State, states),
        stateID: formData?.State,
        City: formData?.City,
        Locality: formData?.Locality,
        ClientName: formData?.ClientName,
        other_employees: formData?.OtherTeammate,
        ExpenseType: formData?.ExpenseType,
        HotelAmount: formData?.HotelAmount || "0",
        HotelName: formData?.HotelName,
        HotelDesc: formData?.HotelDescription,
        BreakfastAmount: formData?.BreakfastAmount || "0",
        LunchAmount: formData?.LunchAmount || "0",
        DinnerAmount: formData?.DinnerAmount || "0",
        mealsDesc: formData?.MealDescription,
        PhoneAmount: formData?.PhoneAmount || "0",
        phoneDesc: formData?.PhoneDescription,
        Client_Enterment_Amount: formData?.EntertainmentAmount || "0",
        Client_Enterment_Desc: formData?.EntertainmentDescription,
        amount: formData?.OtherAmount || "0",
        Other_Desc: formData?.OtherDescription,
      },
    ];
    let LocalTravelpayload = [];
    rows?.map((val, index) => {
      LocalTravelpayload.push({
        LocalTravelType: val.TravelType || "",
        LocalFrom: val.TravelFrom || "",
        LocalTo: val.TravelTo || "",
        LocalTravelAmt: val.TravelAmount || "0",
        LocalTravelDescription: val.TravelDescription || "",
      });
    });
    let InterCityTravelpayload = [];
    rows1?.map((val, index) => {
      InterCityTravelpayload.push({
        InterTravelType: val.InterTravelType || "",
        IntercityFrom: val.IntercityFrom || "",
        IntercityTo: val.IntercityTo || "",
        IntercityAmount: val.IntercityAmount || "0",
        IntercityDescription: val.IntercityDescription || "",
      });
    });
    setLoading(true);

    const payload = {
      EmpID: Number(useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")),
      GeneralDetails: [
        {
          Date: moment(formData?.FromDate).format("YYYY-MM-DD"),
          TripName: formData?.TripName,
          expenseDate: 0,
          expenseMonth: 0,
          expenseYear: 0,
          expenceDay: moment(formData?.FromDate).format("dddd"),
          // State: getlabel(formData?.State, states),
          stateID: formData?.State,
          City: formData?.City,
          Locality: formData?.Locality,
          ClientName: formData?.ClientName,
          other_employees: formData?.OtherTeammate,
          ExpenseType: formData?.ExpenseType,
          HotelAmount: formData?.HotelAmount || "0",
          HotelName: formData?.HotelName,
          HotelDesc: formData?.HotelDescription,
          BreakfastAmount: formData?.BreakfastAmount || "0",
          LunchAmount: formData?.LunchAmount || "0",
          DinnerAmount: formData?.DinnerAmount || "0",
          mealsDesc: formData?.MealDescription,
          PhoneAmount: formData?.PhoneAmount || "0",
          phoneDesc: formData?.PhoneDescription,
          Client_Enterment_Amount: formData?.EntertainmentAmount || "0",
          Client_Enterment_Desc: formData?.EntertainmentDescription,
          amount: formData?.OtherAmount || "0",
          Other_Desc: formData?.OtherDescription,
          expenseMonthName: moment(formData?.FromDate).format("MMMM"),
          ExpenseHeadName: "",
        },
      ],
      Document_Base64: String(formData?.Document_Base64),
      Document_FormatType: String(formData?.FileExtension),
      ActionType: "Insert",
      ExpenseTransID: 0,
      LocalTravelExp: LocalTravelpayload,
      InterCityTravelExp: InterCityTravelpayload,
    };
    axiosInstances
      .post(apiUrls.ManageExpense_Insert, payload)
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          setFormData((prev) => ({
            ...prev,
            ExpenseType: "",
            EmployeeName: "",
            VerticalID: [],
            TeamID: [],
            WingID: [],
            Designation: [],
            ReportingPerson: "",
            Mobile: "",
            Status: "",
            MaximumWeekoffs: "",
            ExpenseCategory: "",
            HotelAmount: "",
            HotelName: "",
            Description: "",
            TravelType: "",
            InterTravelType: "",
            IntercityAmount: "",
            From: "",
            To: "",
            TravelAmount: "",
            TravelDescription: "",
            MealsDescription: "",
            OthersAmount: "",
            OthersDescription: "",
            PhoneAmount: "",
            PhoneDescription: "",
            EntertainmentAmount: "",
            EntertainmentDescription: "",
            OtherAmount: "",
            OtherDescription: "",
            BreakfastAmount: "",
            LunchAmount: "",
            DinnerAmount: "",
            MealDescription: "",
            HotelDescription: "",
            Country: "",
            State: "",
            District: "",
            City: "",
            ClientName: "",
            DocumentType: "",
            SelectFile: "",
            Document_Base64: "",
            FileExtension: "",
            FromDate: "",
            TripName: "",
            Locality: "",
            OtherTeammate: "",
          }));
          setRows([
            {
              TravelType: "",
              TravelFrom: "",
              TravelTo: "",
              TravelAmount: "",
              TravelDescription: "",
            },
          ]);
          setRows1([
            {
              InterTravelType: "",
              IntercityFrom: "",
              IntercityTo: "",
              IntercityAmount: "",
              IntercityDescription: "",
            },
          ]);
          setRowHandler(rowConst);
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000);
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = () => {
    if (!formData?.FromDate) {
      toast.error("Please Select Date");
      return;
    }
    if (!formData?.TripName) {
      toast.error("Please Enter Trip Name");
      return;
    }
    if (!formData?.State) {
      toast.error("Please Select State");
      return;
    }
    if (!formData?.City) {
      toast.error("Please Enter City Name");
      return;
    }
    if (!formData?.Locality) {
      toast.error("Please Enter Locality");
      return;
    }
    if (!formData?.ClientName) {
      toast.error("Please Enter Client Name");
      return;
    }
    if (!formData?.ExpenseType) {
      toast.error("Please Select Expense Type");
      return;
    }
    // if (!formData?.SelectFile) {
    //   toast.error("Please Choose File");
    //   return;
    // }

    const GeneralDetailsJson = JSON.stringify([
      {
        Date: moment(formData?.FromDate).format("YYYY-MM-DD"),
        TripName: formData?.TripName,
        // State: getlabel(formData?.State, states),
        stateID: formData?.State,
        City: formData?.City,
        Locality: formData?.Locality,
        ClientName: formData?.ClientName,
        other_employees: formData?.OtherTeammate,
        ExpenseType: formData?.ExpenseType,
        HotelAmount: formData?.HotelAmount || "0",
        HotelName: formData?.HotelName,
        HotelDesc: formData?.HotelDescription,
        BreakfastAmount: formData?.BreakfastAmount || "0",
        LunchAmount: formData?.LunchAmount || "0",
        DinnerAmount: formData?.DinnerAmount || "0",
        mealsDesc: formData?.MealDescription,
        PhoneAmount: formData?.PhoneAmount || "0",
        phoneDesc: formData?.PhoneDescription,
        Client_Enterment_Amount: formData?.EntertainmentAmount || "0",
        Client_Enterment_Desc: formData?.EntertainmentDescription,
        amount: formData?.OtherAmount || "0",
        Other_Desc: formData?.OtherDescription,
      },
    ]);
    let LocalTravelpayload = [];
    rows?.map((val, index) => {
      LocalTravelpayload.push({
        LocalTravelType: val.TravelType || "",
        LocalFrom: val.TravelFrom || "",
        LocalTo: val.TravelTo || "",
        LocalTravelAmt: val.TravelAmount || "0",
        LocalTravelDescription: val.TravelDescription || "",
        ExpenseReportMasterId: val.ExpenseReportMasterId,
      });
    });
    let InterCityTravelpayload = [];
    rows1?.map((val, index) => {
      InterCityTravelpayload.push({
        InterTravelType: val.InterTravelType || "",
        IntercityFrom: val.IntercityFrom || "",
        IntercityTo: val.IntercityTo || "",
        IntercityAmount: val.IntercityAmount || "0",
        IntercityDescription: val.IntercityDescription || "",
        ExpenseReportMasterId: val?.ExpenseReportMasterId,
      });
    });
    setLoading(true);
    const payload = {
      EmpID: Number(useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")),
      GeneralDetails: [
        {
          Date: moment(formData?.FromDate).format("YYYY-MM-DD"),
          TripName: formData?.TripName,
          // State: getlabel(formData?.State, states),
          stateID: formData?.State,
          City: formData?.City,
          Locality: formData?.Locality,
          ClientName: formData?.ClientName,
          other_employees: formData?.OtherTeammate,
          ExpenseType: formData?.ExpenseType,
          HotelAmount: formData?.HotelAmount || "0",
          HotelName: formData?.HotelName,
          HotelDesc: formData?.HotelDescription,
          BreakfastAmount: formData?.BreakfastAmount || "0",
          LunchAmount: formData?.LunchAmount || "0",
          DinnerAmount: formData?.DinnerAmount || "0",
          mealsDesc: formData?.MealDescription,
          PhoneAmount: formData?.PhoneAmount || "0",
          phoneDesc: formData?.PhoneDescription,
          Client_Enterment_Amount: formData?.EntertainmentAmount || "0",
          Client_Enterment_Desc: formData?.EntertainmentDescription,
          amount: formData?.OtherAmount || "0",
          Other_Desc: formData?.OtherDescription,
        },
      ],
      Document_Base64: String(formData?.Document_Base64),
      Document_FormatType: String(formData?.FileExtension),
      ActionType: "Update",
      ExpenseTransID:
        Number(state?.givenData?.expense_report_ID) || Number(reportidd),
      LocalTravelExp: LocalTravelpayload,
      InterCityTravelExp: InterCityTravelpayload,
    };
    axiosInstances
      .post(apiUrls.ManageExpense_Insert, payload)
      .then((res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message);
          setLoading(false);

          setFormData((prev) => ({
            ...prev,
            ExpenseType: "",
            EmployeeName: "",
            VerticalID: [],
            TeamID: [],
            WingID: [],
            Designation: [],
            ReportingPerson: "",
            Mobile: "",
            Status: "",
            MaximumWeekoffs: "",
            ExpenseCategory: "",
            HotelAmount: "",
            HotelName: "",
            Description: "",
            TravelType: "",
            InterTravelType: "",
            IntercityAmount: "",
            From: "",
            To: "",
            TravelAmount: "",
            TravelDescription: "",
            MealsDescription: "",
            OthersAmount: "",
            OthersDescription: "",
            PhoneAmount: "",
            PhoneDescription: "",
            EntertainmentAmount: "",
            EntertainmentDescription: "",
            OtherAmount: "",
            OtherDescription: "",
            BreakfastAmount: "",
            LunchAmount: "",
            DinnerAmount: "",
            MealDescription: "",
            HotelDescription: "",
            Country: "",
            State: "",
            District: "",
            City: "",
            ClientName: "",
            DocumentType: "",
            SelectFile: "",
            Document_Base64: "",
            FileExtension: "",
            FromDate: "",
            TripName: "",
            Locality: "",
            OtherTeammate: "",
          }));
          setRows([
            {
              TravelType: "",
              TravelFrom: "",
              TravelTo: "",
              TravelAmount: "",
              TravelDescription: "",
            },
          ]);
          setRows1([
            {
              InterTravelType: "",
              IntercityFrom: "",
              IntercityTo: "",
              IntercityAmount: "",
              IntercityDescription: "",
            },
          ]);

          setRowHandler(rowConst);
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleImageChange = (e) => {
    const file = e?.target?.files[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size exceeds 10MB. Please choose a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader?.result.split(",")[1];
        const fileExtension = file?.name.split(".").pop();
        setFormData({
          ...formData,
          SelectFile: file,
          Document_Base64: base64String,
          FileExtension: fileExtension,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const [checkdataa, setcheckdataa] = useState("");
  const [filedtaa, setFiledta] = useState("");

  const [reportidd, setreportid] = useState("");

  const handleIsExpenseExists = (check) => {
    const formatDateToLocal = (date) => {
      const d = new Date(date?.Value);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    axiosInstances
      .post(apiUrls.IsExpenseExists, {
        ExpenseEmployeeID:
          state?.length > 0
            ? Number(state.givenData?.EmpID)
            : Number(
                useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
              ),
        ExpenseDate: String(formatDateToLocal(check)),
      })
      .then((res) => {
        const response = res?.data?.data?.data?.dt[0];
        const datecheck = response?.Date;
        const filetd = response?.FileURL;
        setFiledta(filetd);
        const Reportid = response?.expense_report_ID;
        setreportid(Reportid);
        setcheckdataa(datecheck);
        if (response) {
          setFormData((prev) => ({
            ...prev,
            ExpenseType: response?.ExpenseType,
            EmployeeName: response?.EmpName,
            Designation: response?.Description,
            ReportingPerson: "",
            Mobile: "",
            Status: "",
            OtherTeammate: response?.Other_Employees,
            MaximumWeekoffs: "",
            ExpenseCategory: "",
            HotelAmount: response?.Hotel_Amount,
            HotelName: response?.HotelName,
            Description: response?.Hotel_description,
            TravelType: "",
            InterTravelType: "",
            IntercityAmount: "",
            From: "",
            To: "",
            TravelAmount: "",
            TravelDescription: "",
            MealsDescription: response?.Meals_Description,
            OthersAmount: "",
            OthersDescription: "",
            PhoneAmount: response?.phone_Expense,
            PhoneDescription: response?.Phone_Description,
            EntertainmentAmount: response?.entertainment_Expense,
            EntertainmentDescription: response?.Enterment_Description,
            OtherAmount: response?.Amount,
            OtherDescription: response?.Description,
            BreakfastAmount: response?.BreakfastAmounnt,
            LunchAmount: response?.LunchAmounnt,
            DinnerAmount: response?.DinnerAmounnt,
            MealDescription: response?.Meals_Description,
            HotelDescription: response?.Hotel_description,
            Country: "",
            State: response?.state_id,
            District: "",
            City: response?.city,
            ClientName: response?.client_name,
            DocumentType: "",
            SelectFile: "",
            Document_Base64: "",
            FileExtension: "",
            TripName: response?.tripname,
            FromDate: new Date(response?.Date),
            Locality: response?.locality,
          }));

          const updatedData = res?.data?.data?.data?.dtDetailLocal?.map(
            (ele) => ({
              ...ele,
              TravelType: ele?.traveling_by,
              TravelFrom: ele?.tavling_from,
              TravelTo: ele?.tavling_to,
              TravelAmount: ele?.traveling_amount,
              TravelDescription: ele?.traveling_description,
              ExpenseReportMasterId: ele?.expense_report_master_Id,
            })
          );
          setRows(updatedData);

          const updatedData1 = res?.data?.data?.data?.dtDetailCity?.map(
            (ele) => ({
              ...ele,
              InterTravelType: ele?.traveling_by,
              IntercityFrom: ele?.tavling_from,
              IntercityTo: ele?.tavling_to,
              IntercityAmount: ele?.traveling_amount,
              IntercityDescription: ele?.traveling_description,
              ExpenseReportMasterId: ele?.expense_report_master_Id,
            })
          );
          setRows1(updatedData1);

          setRowHandler((prev) => ({
            ...prev,
            show: true,
            show1: true,
            show2: true,
            show3: true,
            show4: true,
            show5: true,
            show6: true,
            show7: true,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getState();
  }, []);

  const TotalMealExpense = () => {
    const mealKeys = ["BreakfastAmount", "LunchAmount", "DinnerAmount"];
    return mealKeys.reduce((acc, key) => acc + Number(formData?.[key] || 0), 0);
  };

  const totalMealExpense = TotalMealExpense();
  const totalLocalTravelExp = rows
    ?.filter((ele) => ele?.TravelAmount)
    ?.reduce((acc, ele) => acc + Number(ele?.TravelAmount || 0), 0);

  const totalInterCityTravelExp = rows1
    ?.filter((ele) => ele?.IntercityAmount)
    ?.reduce((acc, ele) => acc + Number(ele?.IntercityAmount || 0), 0);

  const GrandTotal = () => {
    const totalExp = [
      totalMealExpense,
      totalLocalTravelExp,
      totalInterCityTravelExp,
      Number(formData?.HotelAmount || 0),
      Number(formData?.PhoneAmount || 0),
      Number(formData?.EntertainmentAmount || 0),
      Number(formData?.OtherAmount || 0),
    ];

    return totalExp?.reduce((acc, value) => acc + value, 0);
  };

  const GrandTotalExpense = GrandTotal();

  const searchHandleChange = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };

  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (state?.edit && !hasCalledRef.current) {
      hasCalledRef.current = true;
      handleIsExpenseExists(state?.data);
    }
  }, [state]);

  useEffect(() => {
    if (formData?.FromDate && !hasCalledRef.current) {
      hasCalledRef.current = true;
      handleIsExpenseExists(formData?.FromDate);
    }
  }, [formData?.FromDate]);

   const isCurrentMonthSelected = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // months are 0-based
    const currentYear = today.getFullYear();
    // Previous month and year logic
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const isCurrentMonth =
      formData.currentMonth === currentMonth &&
      formData.currentYear === currentYear;

    const isPreviousMonth =
      formData.currentMonth === prevMonth &&
      formData.currentYear === prevMonthYear;

    // Check if today is within the first 5 days of the month
    const isWithinFirst5Days = today.getDate() <= 5;
    // Allow previous month only for first 5 days
    if (isPreviousMonth && isWithinFirst5Days) {
      return true; // enabled
    } else if (isPreviousMonth && !isWithinFirst5Days) {
      return false; // disabled
    }

    return isCurrentMonth; // normal current month behavior
  };
  return (
    <>
      <div className="card">
        <Heading
          isBreadcrumb={true}
          secondTitle={
            <div className="">
              <Link
                to="/ViewExpense"
                style={{ cursor: "pointer", fontWeight: "bold" }}
              >
                View Expense
              </Link>
            </div>
          }
        />
      </div>
      <div className="card mt-2">
        <Heading title={"General Details"} />
        <div className="row p-2">
          <DatePicker
            className="custom-calendar"
            id="FromDate"
            name="FromDate"
            lable="Date"
            placeholder={VITE_DATE_FORMAT}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={formData?.FromDate}
            maxDate={new Date()}
            handleChange={searchHandleChange}
            disabled={state?.edit}
          />
          <Input
            type="text"
            className="form-control"
            id="TripName"
            name="TripName"
            lable="Trip Name"
            placeholder=""
            onChange={handleSelectChange}
            value={formData?.TripName}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
            tabIndex="1"
            disabled={state?.edit}
          />

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="State"
            placeholderName="State"
            dynamicOptions={states}
            handleChange={handleDeliveryChange}
            value={formData.State}
            onKeyDown={Tabfunctionality}
            tabIndex="1"
            isDisabled={state?.edit}
          />
          <Input
            type="text"
            className="form-control"
            id="City"
            name="City"
            lable="City Name"
            placeholder=""
            onChange={handleSelectChange}
            value={formData?.City}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
            tabIndex="1"
            disabled={state?.edit}
          />
          <Input
            type="text"
            className="form-control"
            id="Locality"
            name="Locality"
            lable="Locality"
            placeholder=""
            onChange={handleSelectChange}
            value={formData?.Locality}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
            tabIndex="1"
            disabled={state?.edit}
          />
          <Input
            type="text"
            className="form-control"
            id="ClientName"
            name="ClientName"
            lable="Client Name"
            placeholder=""
            onChange={handleSelectChange}
            value={formData?.ClientName}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
            tabIndex="1"
            disabled={state?.edit}
          />
          <Input
            type="text"
            className="form-control mt-1"
            id="OtherTeammate"
            name="OtherTeammate"
            lable="Teammates Name"
            placeholder=""
            onChange={handleSelectChange}
            value={formData?.OtherTeammate}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
            tabIndex="1"
            disabled={state?.edit}
          />
          <ReactSelect
            className="form-control"
            name="ExpenseType"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
            placeholderName="ExpenseType"
            id="ExpenseType"
            dynamicOptions={[
              { label: "India", value: "India" },
              { label: "Overseas", value: "Overseas" },
            ]}
            value={formData?.ExpenseType}
            handleChange={handleDeliveryChange}
            onKeyDown={Tabfunctionality}
            tabIndex="1"
            isDisabled={state?.edit}
          />
        </div>
      </div>
      <div className="card mt-2">
        <Heading
          title="Expense Details"
          secondTitle={
            <div>
              <span>Grand Total : {GrandTotalExpense}</span>
            </div>
          }
        />
      </div>
      <div className="card HotelExpense " style={{ marginTop: "3px" }}>
        <div
          className="accordion"
          id="accordionExample"
          style={{ borderRadius: "3px", background: "white", border: "white" }}
        >
          <div
            className="accordion-item"
            style={{
              justifyContent: "space-between",
              display: "flex",
              cursor: "pointer",
            }}
            onClick={() => {
              handlerow("show");
            }}
            title="Click to View."
          >
            <div>
              {/* <i
                className="fa fa-hotel"
                style={{
                  fontSize: "15px",
                  marginRight: "6px",
                  marginLeft: "13px",
                }}
              ></i> */}
              <img
                src={hotels}
                style={{
                  width: "19px",
                  height: "19px",
                  marginLeft: "10px",
                  marginRight: "7px",
                }}
              />
              Hotel Expense
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.show && (
                <span style={{ fontWeight: "bold" }}>
                  Total Count : {formData?.HotelAmount}
                </span>
              )}

              <button
                className={`fa ${rowHandler.show ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("show");
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "white",
                }}
                // style={{
                //   marginTop: "3px",
                //   transition: "transform 0.5s ease-in-out",
                //   transform: `rotate(${rowHandler?.show2 ? "180deg" : "0deg"})`,
                // }}
              ></button>
            </div>
          </div>
          {(rowHandler.show || !formData?.HotelAmount == "") && (
            <>
              <div className="">
                <div className="row m-2">
                  <Input
                    type="number"
                    className="form-control"
                    id="HotelAmount"
                    name="HotelAmount"
                    lable="Hotel Amount"
                    placeholder=""
                    onChange={handleSelectChange}
                    value={formData?.HotelAmount}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    onKeyDown={Tabfunctionality}
                    tabIndex="1"
                    disabled={state?.edit}
                  />
                  <Input
                    type="text"
                    className="form-control"
                    id="HotelName"
                    name="HotelName"
                    lable="Hotel Name"
                    placeholder=""
                    onChange={handleSelectChange}
                    value={formData?.HotelName}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    onKeyDown={Tabfunctionality}
                    tabIndex="1"
                    disabled={state?.edit}
                  />
                  <Input
                    type="text"
                    className="form-control"
                    id="HotelDescription"
                    name="HotelDescription"
                    lable="Description"
                    placeholder=""
                    onChange={handleSelectChange}
                    value={formData?.HotelDescription}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    onKeyDown={Tabfunctionality}
                    tabIndex="1"
                    disabled={state?.edit}
                  />
                  <div className="col-2">
                    <button
                      className="btn btn-sm"
                      style={{
                        background: "red",
                        border: "none",
                        color: "white",
                      }}
                      onClick={handleHotelClear}
                      disabled={state?.edit}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="card MealsExpense " style={{ marginTop: "3px" }}>
        <div
          className="accordion"
          id="accordionExample"
          style={{ borderRadius: "3px", background: "white", border: "white" }}
        >
          <div
            className="accordion-item"
            style={{
              justifyContent: "space-between",
              display: "flex",
              cursor: "pointer",
            }}
            onClick={() => {
              handlerow("show1");
            }}
            title="Click to View."
          >
            <div>
              {/* <i
                className="fa fa-hotel"
                style={{
                  fontSize: "15px",
                  marginRight: "6px",
                  marginLeft: "13px",
                }}
              ></i> */}
              <img
                src={meals}
                style={{
                  width: "17px",
                  height: "17px",
                  marginLeft: "10px",
                  marginRight: "9px",
                }}
              />
              Meals Expense
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.show1 && (
                <span style={{ fontWeight: "bold" }}>
                  Total Count:{totalMealExpense}
                </span>
              )}

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
                  background: "white",
                }}
                // style={{
                //   marginTop: "3px",
                //   transition: "transform 0.5s ease-in-out",
                //   transform: `rotate(${rowHandler?.show2 ? "180deg" : "0deg"})`,
                // }}
              ></button>
            </div>
          </div>
          {(rowHandler.show1 || !formData?.BreakfastAmount == "") && (
            <>
              <div className="row g-4 m-2">
                <Input
                  type="number"
                  className="form-control"
                  id="BreakfastAmount"
                  name="BreakfastAmount"
                  lable="Breakfast Amount"
                  placeholder=""
                  onChange={handleSelectChange}
                  value={formData?.BreakfastAmount}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  onKeyDown={Tabfunctionality}
                  tabIndex="1"
                  disabled={state?.edit}
                />
                <Input
                  type="number"
                  className="form-control"
                  id="LunchAmount"
                  name="LunchAmount"
                  lable="Lunch Amount"
                  placeholder=""
                  onChange={handleSelectChange}
                  value={formData?.LunchAmount}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  onKeyDown={Tabfunctionality}
                  tabIndex="1"
                  disabled={state?.edit}
                />
                <Input
                  type="number"
                  className="form-control"
                  id="DinnerAmount"
                  name="DinnerAmount"
                  lable="Dinner Amount"
                  placeholder=""
                  onChange={handleSelectChange}
                  value={formData?.DinnerAmount}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  onKeyDown={Tabfunctionality}
                  tabIndex="1"
                  disabled={state?.edit}
                />
                <Input
                  type="text"
                  className="form-control"
                  id="MealDescription"
                  name="MealDescription"
                  lable="Description"
                  placeholder=""
                  onChange={handleSelectChange}
                  value={formData?.MealDescription}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  onKeyDown={Tabfunctionality}
                  tabIndex="1"
                  disabled={state?.edit}
                />
                <div className="col-2">
                  <button
                    className="btn btn-sm"
                    style={{
                      background: "red",
                      border: "none",
                      color: "white",
                    }}
                    onClick={handleMealClear}
                    disabled={state?.edit}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="card LocalTravelExpense " style={{ marginTop: "3px" }}>
        <div
          className="accordion"
          id="accordionExample"
          style={{ borderRadius: "3px", background: "white", border: "white" }}
        >
          <div
            className="accordion-item"
            style={{
              justifyContent: "space-between",
              display: "flex",
              cursor: "pointer",
            }}
            onClick={() => {
              handlerow("show2");
            }}
            title="Click to View."
          >
            <div>
              <img
                src={travel}
                style={{
                  width: "17px",
                  height: "17px",
                  marginLeft: "10px",
                  marginRight: "9px",
                }}
              />
              Local Travel Expense
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.show2 && (
                <span style={{ fontWeight: "bold" }}>
                  Total Count : {totalLocalTravelExp}
                </span>
              )}

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
                  background: "white",
                }}
                // style={{
                //   marginTop: "3px",
                //   transition: "transform 0.5s ease-in-out",
                //   transform: `rotate(${rowHandler?.show2 ? "180deg" : "0deg"})`,
                // }}
              ></button>
            </div>
          </div>
          {rowHandler.show2 && (
            <>
              <div className="m-2">
                <Tables
                  thead={travelThead}
                  tbody={rows?.map((ele, index) => ({
                    "Travel Type": (
                      <ReactSelect
                        className="form-control"
                        dynamicOptions={[
                          { label: "Rickshaw/Auto", value: "Rickshaw" },
                          { label: "Bus", value: "Bus" },
                          { label: "Train", value: "Train" },
                          { label: "Metro", value: "Metro" },
                          { label: "Cab", value: "Cab" },
                          { label: "Car(Self/Rental)", value: "Car" },
                          { label: "Bike", value: "Bike" },
                          { label: "Flight", value: "Flight" },
                        ]}
                        name="TravelType"
                        id="TravelType"
                        value={ele?.TravelType}
                        handleChange={(name, value) =>
                          handleDeliveryChangeValue(name, value?.value, index)
                        }
                        placeholder="TravelType"
                        onKeyDown={Tabfunctionality}
                        tabIndex="1"
                        isDisabled={state?.edit}
                      />
                    ),
                    From: (
                      <Input
                        type="text"
                        name="TravelFrom"
                        value={ele.TravelFrom}
                        className="form-control"
                        placeholder="From"
                        onChange={(e) =>
                          handleInputChange(e, index, "TravelFrom")
                        }
                        onKeyDown={Tabfunctionality}
                        tabIndex="1"
                        disabled={state?.edit}
                      />
                    ),
                    To: (
                      <Input
                        type="text"
                        value={ele.TravelTo}
                        name="TravelTo"
                        className="form-control"
                        placeholder="To"
                        onChange={(e) =>
                          handleInputChange(e, index, "TravelTo")
                        }
                        onKeyDown={Tabfunctionality}
                        tabIndex="1"
                        disabled={state?.edit}
                      />
                    ),
                    Amount: (
                      <Input
                        type="number"
                        value={ele.TravelAmount}
                        name="TravelAmount"
                        className="form-control"
                        placeholder="Amount"
                        onChange={(e) =>
                          handleInputChange(e, index, "TravelAmount")
                        }
                        onKeyDown={Tabfunctionality}
                        tabIndex="1"
                        disabled={state?.edit}
                      />
                    ),
                    Description: (
                      <Input
                        type="text"
                        value={ele.TravelDescription}
                        name="TravelDescription"
                        className="form-control"
                        placeholder="Description"
                        onChange={(e) =>
                          handleInputChange(e, index, "TravelDescription")
                        }
                        onKeyDown={Tabfunctionality}
                        tabIndex="1"
                        disabled={state?.edit}
                      />
                    ),
                    "Add/Remove": (
                      <div>
                        {index === rows.length - 1 ? (
                          <span
                            label="Add"
                            icon="pi pi-plus"
                            className="fa fa-plus"
                            onClick={handleAddRow}
                            style={{ cursor: "pointer", color: "green" }}
                          />
                        ) : null}
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
                      </div>
                    ),
                  }))}
                  tableHeight={"tableHeight"}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div
        className="card InterCityTravelExpense "
        style={{ marginTop: "3px" }}
      >
        <div
          className="accordion"
          id="accordionExample"
          style={{ borderRadius: "3px", background: "white", border: "white" }}
        >
          <div
            className="accordion-item"
            style={{
              justifyContent: "space-between",
              display: "flex",
              cursor: "pointer",
            }}
            onClick={() => {
              handlerow("show3");
            }}
            title="Click to View."
          >
            <div>
              <img
                src={intercity}
                style={{
                  width: "17px",
                  height: "17px",
                  marginLeft: "10px",
                  marginRight: "9px",
                }}
              />
              Inter City Travel Expense
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.show3 && (
                <span style={{ fontWeight: "bold" }}>
                  Total Count : {totalInterCityTravelExp}
                </span>
              )}

              <button
                className={`fa ${rowHandler.show3 ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("show3");
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "white",
                }}
              ></button>
            </div>
          </div>
          {rowHandler.show3 && (
            <>
              <div className="m-2">
                <Tables
                  thead={intercityThead}
                  tbody={rows1?.map((ele, index) => ({
                    "Travel Type": (
                      <ReactSelect
                        className="form-control"
                        name="InterTravelType"
                        id="InterTravelType"
                        dynamicOptions={[
                          { label: "Rickshaw/Auto", value: "Rickshaw" },
                          { label: "Bus", value: "Bus" },
                          { label: "Train", value: "Train" },
                          { label: "Metro", value: "Metro" },
                          { label: "Cab", value: "Cab" },
                          { label: "Car(Self/Rental)", value: "Car" },
                          { label: "Bike", value: "Bike" },
                          { label: "Flight", value: "Flight" },
                        ]}
                        value={ele?.InterTravelType}
                        handleChange={(name, value) =>
                          handleDeliveryChangeValue(name, value?.value, index)
                        }
                        placeholder="TravelType"
                        onKeyDown={Tabfunctionality}
                        tabIndex="1"
                        isDisabled={state?.edit}
                      />
                    ),
                    From: (
                      <Input
                        type="text"
                        value={ele.IntercityFrom}
                        name="IntercityFrom"
                        className="form-control"
                        placeholder="From"
                        onChange={(e) =>
                          handleInputChange1(e, index, "IntercityFrom")
                        }
                        onKeyDown={Tabfunctionality}
                        tabIndex="1"
                        disabled={state?.edit}
                      />
                    ),
                    To: (
                      <Input
                        type="text"
                        value={ele.IntercityTo}
                        name="IntercityTo"
                        className="form-control"
                        placeholder="To"
                        onChange={(e) =>
                          handleInputChange1(e, index, "IntercityTo")
                        }
                        onKeyDown={Tabfunctionality}
                        tabIndex="1"
                        disabled={state?.edit}
                      />
                    ),
                    Amount: (
                      <Input
                        type="number"
                        value={ele.IntercityAmount}
                        name="IntercityAmount"
                        className="form-control"
                        placeholder="Amount"
                        onChange={(e) =>
                          handleInputChange1(e, index, "IntercityAmount")
                        }
                        onKeyDown={Tabfunctionality}
                        tabIndex="1"
                        disabled={state?.edit}
                      />
                    ),
                    Description: (
                      <Input
                        type="text"
                        value={ele.IntercityDescription}
                        name="IntercityDescription"
                        className="form-control"
                        placeholder="Description"
                        onChange={(e) =>
                          handleInputChange1(e, index, "IntercityDescription")
                        }
                        onKeyDown={Tabfunctionality}
                        tabIndex="1"
                        disabled={state?.edit}
                      />
                    ),
                    "Add/Remove": (
                      <div>
                        {index === rows1.length - 1 ? (
                          <span
                            label="Add"
                            icon="pi pi-plus"
                            className="fa fa-plus"
                            onClick={handleAddRow1}
                            style={{ cursor: "pointer", color: "green" }}
                          />
                        ) : null}
                        <span
                          label="Remove"
                          icon="pi pi-trash"
                          className="fa fa-trash"
                          onClick={() => handleRemoveRow1(index)}
                          style={{
                            cursor: "pointer",
                            color: "red",
                            marginLeft: "10px",
                          }}
                        />
                      </div>
                    ),
                  }))}
                  tableHeight={"tableHeight"}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card PhoneExpense d-none" style={{ marginTop: "3px" }}>
        <div
          className="accordion"
          id="accordionExample"
          style={{ borderRadius: "3px", background: "white", border: "white" }}
        >
          <div
            className="accordion-item"
            style={{
              justifyContent: "space-between",
              display: "flex",
              cursor: "pointer",
            }}
            onClick={() => {
              handlerow("show4");
            }}
            title="Click to View."
          >
            <div>
              {/* <i
                className="fa fa-hotel"
                style={{
                  fontSize: "15px",
                  marginRight: "6px",
                  marginLeft: "13px",
                }}
              ></i> */}
              <img
                src={phone}
                style={{
                  width: "17px",
                  height: "17px",
                  marginLeft: "10px",
                  marginRight: "9px",
                }}
              />
              Phone Expense
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.show4 && (
                <span style={{ fontWeight: "bold" }}>
                  Total Count : {formData?.PhoneAmount}
                </span>
              )}

              <button
                className={`fa ${rowHandler.show4 ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("show4");
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "white",
                }}
                // style={{
                //   marginTop: "3px",
                //   transition: "transform 0.5s ease-in-out",
                //   transform: `rotate(${rowHandler?.show2 ? "180deg" : "0deg"})`,
                // }}
              ></button>
            </div>
          </div>
          {(rowHandler.show4 || !formData?.PhoneAmount == "") && (
            <>
              <div className="row m-2">
                <Input
                  type="number"
                  className="form-control"
                  id="PhoneAmount"
                  name="PhoneAmount"
                  lable="Phone Amount"
                  placeholder=""
                  onChange={handleSelectChange}
                  value={formData?.PhoneAmount}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  onKeyDown={Tabfunctionality}
                  tabIndex="1"
                  disabled={state?.edit}
                />
                <Input
                  type="text"
                  className="form-control"
                  id="PhoneDescription"
                  name="PhoneDescription"
                  lable="Phone Description"
                  placeholder=""
                  onChange={handleSelectChange}
                  value={formData?.PhoneDescription}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  onKeyDown={Tabfunctionality}
                  tabIndex="1"
                  disabled={state?.edit}
                />
                <div className="col-2">
                  <button
                    className="btn btn-sm"
                    style={{
                      background: "red",
                      border: "none",
                      color: "white",
                    }}
                    onClick={handlePhoneClear}
                    disabled={state?.edit}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className="card ClientEntertainmentExpense"
        style={{ marginTop: "3px" }}
      >
        <div
          className="accordion"
          id="accordionExample"
          style={{ borderRadius: "3px", background: "white", border: "white" }}
        >
          <div
            className="accordion-item"
            style={{
              justifyContent: "space-between",
              display: "flex",
              cursor: "pointer",
            }}
            onClick={() => {
              handlerow("show5");
            }}
            title="Click to View."
          >
            <div>
              {/* <i
                className="fa fa-hotel"
                style={{
                  fontSize: "15px",
                  marginRight: "6px",
                  marginLeft: "13px",
                }}
              ></i> */}
              <img
                src={client}
                style={{
                  width: "17px",
                  height: "17px",
                  marginLeft: "10px",
                  marginRight: "9px",
                }}
              />
              Client Entertainment Expense
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.show5 && (
                <span style={{ fontWeight: "bold" }}>
                  Total Count : {formData?.EntertainmentAmount}
                </span>
              )}

              <button
                className={`fa ${rowHandler.show5 ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("show5");
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "white",
                }}
                // style={{
                //   marginTop: "3px",
                //   transition: "transform 0.5s ease-in-out",
                //   transform: `rotate(${rowHandler?.show2 ? "180deg" : "0deg"})`,
                // }}
              ></button>
            </div>
          </div>
          {(rowHandler.show5 || !formData?.EntertainmentAmount == "") && (
            <>
              <div className="row m-2">
                <Input
                  type="number"
                  className="form-control"
                  id="EntertainmentAmount"
                  name="EntertainmentAmount"
                  lable="Entertainment Amount"
                  placeholder=""
                  onChange={handleSelectChange}
                  value={formData?.EntertainmentAmount}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  onKeyDown={Tabfunctionality}
                  tabIndex="1"
                  disabled={state?.edit}
                />
                <Input
                  type="text"
                  className="form-control"
                  id="EntertainmentDescription"
                  name="EntertainmentDescription"
                  lable="Entertainment Description"
                  placeholder=""
                  onChange={handleSelectChange}
                  value={formData?.EntertainmentDescription}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  onKeyDown={Tabfunctionality}
                  tabIndex="1"
                  disabled={state?.edit}
                />
                <div className="col-2">
                  <button
                    className="btn btn-sm"
                    style={{
                      background: "red",
                      border: "none",
                      color: "white",
                    }}
                    onClick={handleClientClear}
                    disabled={state?.edit}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card OtherExpense" style={{ marginTop: "3px" }}>
        <div
          className="accordion"
          id="accordionExample"
          style={{ borderRadius: "3px", background: "white", border: "white" }}
        >
          <div
            className="accordion-item"
            style={{
              justifyContent: "space-between",
              display: "flex",
              cursor: "pointer",
            }}
            onClick={() => {
              handlerow("show6");
            }}
            title="Click to View."
          >
            <div>
              {/* <i
                className="fa fa-hotel"
                style={{
                  fontSize: "15px",
                  marginRight: "6px",
                  marginLeft: "13px",
                }}
              ></i> */}
              <img
                src={other}
                style={{
                  width: "17px",
                  height: "17px",
                  marginLeft: "10px",
                  marginRight: "9px",
                }}
              />
              Other Expense
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.show6 && (
                <span style={{ fontWeight: "bold" }}>
                  Total Count : {formData?.OtherAmount}
                </span>
              )}

              <button
                className={`fa ${rowHandler.show6 ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("show6");
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "white",
                }}
                // style={{
                //   marginTop: "3px",
                //   transition: "transform 0.5s ease-in-out",
                //   transform: `rotate(${rowHandler?.show2 ? "180deg" : "0deg"})`,
                // }}
              ></button>
            </div>
          </div>
          {rowHandler.show6 && (
            <>
              <div className="row m-2">
                <Input
                  type="number"
                  className="form-control"
                  id="OtherAmount"
                  name="OtherAmount"
                  lable="Other Amount"
                  placeholder=""
                  onChange={handleSelectChange}
                  value={formData?.OtherAmount}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  onKeyDown={Tabfunctionality}
                  tabIndex="1"
                  disabled={state?.edit}
                />
                <Input
                  type="text"
                  className="form-control"
                  id="OtherDescription"
                  name="OtherDescription"
                  lable="Other Description"
                  placeholder=""
                  onChange={handleSelectChange}
                  value={formData?.OtherDescription}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  onKeyDown={Tabfunctionality}
                  tabIndex="1"
                  disabled={state?.edit}
                />
                <div className="col-2">
                  <button
                    className="btn btn-sm"
                    style={{
                      background: "red",
                      border: "none",
                      color: "white",
                    }}
                    onClick={handleOtherClear}
                    disabled={state?.edit}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="card">
        <div className="row m-2 d-flex">
          <BrowseInput handleImageChange={handleImageChange} />
<<<<<<< HEAD


          {/* {state?.edit && state?.givenData?.FileURLs ? (
            <div className="mr-4">
              <span style={{ fontWeight: "bold", marginLeft: "30px" }}>
                View Attachment:{" "}
              </span>{" "}
              <i
                className="fa fa-print"
                style={{
                  marginLeft: "5px",
                  cursor: "pointer",
                  color: "black",
                  padding: "2px",
                  borderRadius: "3px",
                }}
                onClick={() =>
                  window.open(state?.givenData?.FileURLs, "_blank")
                }
                title="Click to view attachment"
              ></i>
            </div>
          ) : filedtaa ? (
            <div className="mr-4">
              <span style={{ fontWeight: "bold", marginLeft: "30px" }}>
                View Attachment:{" "}
              </span>{" "}
              <i
                className="fa fa-print"
                style={{
                  marginLeft: "5px",
                  cursor: "pointer",
                  color: "black",
                  padding: "2px",
                  borderRadius: "3px",
                }}
                onClick={() => window.open(filedtaa, "_blank")}
                title="Click to view attachment"
              ></i>
            </div>
          ) : null} */}

=======
>>>>>>> b95a713ced8b902a14804c7aa0167443b0315e94
          {state?.edit || checkdataa ? (
            <button
              className="btn btn-sm btn-info ml-2"
              onClick={handleUpdate}
              disabled={state?.edit}
            >
              Update
            </button>
            
          ) : (
            <button
              className="btn btn-sm btn-info ml-2"
              onClick={handleSave}
              disabled={isCurrentMonthSelected() === false}
              title={
                isCurrentMonthSelected() === false
                  ? "Expenses can be submitted only on the 5th of the previous month"
                  : "Click to Submit Expense"
              }
            >
              Save
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default ExpenseSubmission;
