import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import ReactSelect from "../components/formComponent/ReactSelect";
import Input from "../components/formComponent/Input";
import DatePicker from "../components/formComponent/DatePicker";
import { inputBoxValidation } from "../utils/utils";
import {
  GST_VALIDATION_REGX,
  MOBILE_NUMBER_VALIDATION_REGX,
  PANCARD_VALIDATION_REGX,
  PINCODE_VALIDATION_REGX,
} from "../utils/constant";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AmountSubmissionSeeMoreList from "../networkServices/AmountSubmissionSeeMoreList";
import SlideScreen from "./SlideScreen";
import SeeMoreSlideScreen from "../components/SearchableTable/SeeMoreSlideScreen";
import moment from "moment";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const ProjectMaster = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [country, setCountry] = useState([]);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUserName] = useState([]);
  const [states, setState] = useState([]);
  const [project, setProject] = useState([]);
  const [district, setDistrict] = useState([]);
  const [listVisible, setListVisible] = useState(false);
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);
  const [city, setCity] = useState([]);
  const [acctype, setAmcType] = useState([]);
  const [productversion, setProductVersion] = useState([]);
  const [projectPriority, setProjectPriority] = useState();
  const [user, setUser] = useState([]);
  const [projectStatus, setProjectStatus] = useState([]);
  const [projectOrganizationType, setProjectOrganizationType] = useState();

  const [formData, setFormData] = useState({
    ProjectPriority: "",
    ProjectStatus: "",
    ProjectOrganizationType: "",
    ProjectName: "",
    ProjectDisplayName: "",
    ProjectID: "",
    Address: "",
    PinCode: "",
    Country: "",
    State: "",
    District: "",
    City: "",
    ProductVersion: "",
    PoCashAmount: "",
    POChequeAmount: "",
    POAmount: "",
    NetAmount: "",
    TaxPercent: "18%",
    Tax: "",
    PoDate: new Date(),
    StartDate: new Date(),
    LiveDate: new Date(),
    OnlineSupportDate: new Date(),
    CompanyName: "",
    CompanyAddress: "",
    GSTNumber: "",
    PanCardNo: "",
    AmcType: "",
    AMC_Start_Date: new Date(),
    AMC_Start_Month: "",
    AMC_Installment: "",
    AMCPercent: "",
    ExistingApplication: "",
    AdditionCharges: "",
    ManDays: "",
    Visit: "",
    MachineUni: "",
    MachineBi: "",
    AuthorityName: "",
    AuthorityMobile: "",
    AuthorityEmail: "",
    ITPersonName: "",
    ITPersonMobile: "",
    ITPersonEmail: "",
    AllowSecEmail: "",
    AllowEscMatrix: "",
    Level1Employee1: "",
    Level2Employee1: "",
    Level3Employee1: "",
    Level1Employee2: "",
    Level2Employee2: "",
    Level3Employee2: "",
    Engineer1: "",
    Engineer2: "",
    VerticalID: "",
    TeamID: "",
    WingID: "",
    UserName: "",
    Password: "",
    SPOCName: "",
    SPOCEmail: "",
    SPOCMobile: "",
    // follow: [],
    AgreementStatus: "",
    FeedbackStatus: "",
    OwnerFollowup: "",
    SPOCFollowup: "",
    ITPersonFollowup: "",
    Website: "",
    OwnerDesignation: "",
    SPOCDesignation: "",
    ItPersonDesignation: "",
    IsActive: "",
    IsMailSent: "",
    IsAutoDeliveryDate: "",
  });

  console.log("formdata", formData);

  const handleCheckBox = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleStatusChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
      AgreementStatus: value,
    }));
  };

  const handleStatusChange1 = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
      FeedbackStatus: value,
    }));
  };

  const handleFollowupChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleFollwChange = (e) => {
    const { name, checked } = e.target;
    let updatedFollow = [...formData.follow];

    if (checked) {
      // Add the item if it's checked and not already in the array
      if (!updatedFollow.includes(name)) {
        updatedFollow.push(name);
      }
    } else {
      // Remove the item if unchecked
      updatedFollow = updatedFollow.filter((item) => item !== name);
    }

    setFormData({
      ...formData,
      follow: updatedFollow,
    });
  };

  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const ModalComponent = (name, component) => {
    setListVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };
  const [seeMore, setSeeMore] = useState([]);

  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name == "ProjectID") {
      setFormData({
        ...formData,
        [name]: value,
      });
      fetchProjectdetails(value);
    } else if (name == "Country") {
      setFormData({
        ...formData,
        [name]: value,
        State: "",
        District: "",
        City: "",
      });
      setState([]);
      setDistrict([]);
      setCity([]);
      getState(value);
    } else if (name == "State") {
      setFormData({ ...formData, [name]: value, District: "", City: "" });
      setDistrict([]);
      setCity([]);
      getDistrict(formData?.Country, value);
    } else if (name == "District") {
      setFormData({ ...formData, [name]: value, City: "" });
      getCity(formData?.Country, formData?.State, value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };
  const getUserName = () => {
    // let form = new FormData();
    // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.GetUserName, form, { headers })
    axiosInstances
      .post(apiUrls?.GetUserName, { Username: "" })
      .then((res) => {
        const verticals = res?.data.data.map((item) => {
          return { label: item?.Username, value: item?.Id };
        });
        setUserName(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getVertical = () => {
    let form = new FormData();
    form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
      axios
        .post(apiUrls?.Vertical_Select, form, { headers })
        .then((res) => {
          const verticals = res?.data.data.map((item) => {
            return { label: item?.Vertical, value: item?.VerticalID };
          });
          setVertical(verticals);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const getAMCTYPE = () => {
    let form = new FormData();
    form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
      form.append(
        "LoginName",
        useCryptoLocalStorage("user_Data", "get", "realname")
      ),
      axios
        .post(apiUrls?.AMCType_Select, form, { headers })
        .then((res) => {
          const verticals = res?.data.data.map((item) => {
            return { label: item?.NAME, value: item?.ID };
          });
          setAmcType(verticals);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const getTeam = () => {
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      axios
        .post(apiUrls?.Team_Select, form, { headers })
        .then((res) => {
          const teams = res?.data.data.map((item) => {
            return { label: item?.Team, value: item?.TeamID };
          });
          setTeam(teams);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const getWing = () => {
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      axios
        .post(apiUrls?.Wing_Select, form, { headers })
        .then((res) => {
          const wings = res?.data.data.map((item) => {
            return { label: item?.Wing, value: item?.WingID };
          });
          setWing(wings);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const getReporter = () => {
    axiosInstances
      .post(apiUrls?.Reporter_Select, {})
      .then((res) => {
      
        const reporters = res?.data.data.map((item) => {
          return { label: item?.Name, value: item?.ID };
        });
        setUser(reporters);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProduct = (value) => {
    axiosInstances
      .post(apiUrls?.GetProductVersion, {})
      .then((res) => {
        const states = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.id };
        });
        setProductVersion(states);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getCountry = () => {
    axiosInstances
      .post(apiUrls?.GetCountry, {})
      .then((res) => {
        const countrys = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.CountryID };
        });
        setCountry(countrys);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getState = (value) => {
    axiosInstances
      .post(apiUrls?.GetState, { CountryID: String(value) })
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
  const getDistrict = (country, state) => {
    axiosInstances
      .post(apiUrls?.GetDistrict, {
        CountryID: String(formData?.Country ? formData?.Country : country),
        StateID: String(state),
      })
      .then((res) => {
        const states = res?.data.data.map((item) => {
          return { label: item?.District, value: item?.DistrictID };
        });
        setDistrict(states);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getCity = (country, state, district) => {
    axiosInstances
      .post(apiUrls?.GetCity, {
        CountryID: String(formData?.Country ? formData?.Country : country),
        StateID: String(formData?.State ? formData?.State : state),
        DistrictID: String(district),
      })
      .then((res) => {
        const states = res?.data.data.map((item) => {
          return { label: item?.City, value: item?.CityID };
        });
        setCity(states);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProjectPriority = () => {
    axiosInstances
      .post(apiUrls?.Reason_Select, { Title: "ProjectPriority" })
      .then((res) => {
        const teams = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setProjectPriority(teams);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProjectStatus = () => {
    axiosInstances
      .post(apiUrls?.Reason_Select, { Title: "ProjectStatus" })
      .then((res) => {
        const teams = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setProjectStatus(teams);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProject = () => {
    axiosInstances
      .post(apiUrls?.ProjectSelect, {
        ProjectID: 0,
        IsMaster: "",
        VerticalID: 0,
        TeamID: 0,
        WingID: 0,
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.Project, value: item?.ProjectId };
        });
        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProjectOrganizationType = () => {
    axiosInstances
      .post(apiUrls?.Reason_Select, { Title: "ProjectOrganizationType" })
      .then((res) => {
        const teams = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setProjectOrganizationType(teams);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [fetchDetails, setFetchDetails] = useState([]);

  const fetchProjectdetails = (value) => {
    axiosInstances
      .post(apiUrls?.getViewProject, {
        Title: "",
        ProjectID: String(state?.data || value),
      })
      .then((res) => {
        const fetchData = res?.data?.data[0];
        // console.log("errerer", fetchData);
        setFetchDetails(fetchData);

        setFormData({
          ...formData,
          ProjectPriority: fetchData?.PriorityID,
          ProjectStatus: fetchData?.CurrentStatusID,
          ProjectOrganizationType: fetchData?.OrganizationTypeID,
          ProjectName: fetchData?.ProjectName,
          ProjectID: fetchData?.ProjectID,
          Address: fetchData?.Address,
          PinCode: fetchData?.PinCode,
          Country: fetchData?.CountryID,
          State: fetchData?.StateID,
          District: fetchData?.DistrictID,
          City: fetchData?.CityId,
          ProductVersion: fetchData?.ProductID,
          InitialAmount: "",
          POAmount: fetchData?.PoAmt,
          TaxPercent: fetchData?.GstPercent,
          Tax: fetchData?.PoGstAmt,
          PoDate: new Date(fetchData?.PODate),
          StartDate: new Date(fetchData?.Startdate),
          LiveDate: new Date(fetchData?.LiveDate),
          OnlineSupportDate: new Date(fetchData?.OnsiteSupportDate),
          CompanyName: "",
          CompanyAddress: "",
          GSTNumber: "",
          PanCardNo: "",
          AmcType: fetchData?.AMCID,
          AMC_Start_Date:
            new Date(fetchData?.AMC_StartDate) == "1970-01-01"
              ? new Date()
              : new Date(fetchData?.AMC_StartDate),
          AMC_Start_Month: fetchData?.AMCStartmonth,
          AMC_Installment: fetchData?.AMCAmount,
          AMCPercent: fetchData?.AmcPer,
          ExistingApplication: fetchData?.ExistingApplication,
          AdditionCharges: "",
          SPOCName: fetchData?.SPOC_Name,
          SPOCMobile: fetchData?.SPOC_Mobile,
          SPOCEmail: fetchData?.SPOC_EmailID,
          OwnerDesignation: fetchData?.OwnerDesignation,
          SPOCDesignation: fetchData?.SPOCDesignation,
          ItPersonDesignation: fetchData?.ItPersonDesignation,
          ManDays: fetchData?.maindayscharges,
          Visit: fetchData?.Onsitecharges,
          MachineUni: fetchData?.MachineChargesUNI,
          MachineBi: fetchData?.MachineChargesBI,
          AuthorityName: fetchData?.Owner_Name,
          AuthorityMobile: fetchData?.Owner_Mobile,
          AuthorityEmail: fetchData?.Owner_Email,
          ITPersonName: fetchData?.ItPersonName,
          Website: fetchData?.Website,
          ITPersonMobile: fetchData?.ItPersonMobile,
          ITPersonEmail: fetchData?.ItPersonEmail,
          AllowSecEmail: "",
          AllowEscMatrix: "",
          Level1Employee1: fetchData?.level1employee_1,
          Level2Employee1: fetchData?.level2employee_1,
          Level3Employee1: fetchData?.level3employee_1,
          Level1Employee2: fetchData?.level1employee_2,
          Level2Employee2: fetchData?.level2employee_2,
          Level3Employee2: fetchData?.level3employee_2,
          Engineer1: fetchData?.Engineer1,
          Engineer2: fetchData?.Engineer2,
          VerticalID: fetchData?.VerticalID,
          TeamID: fetchData?.TeamID,
          WingID: fetchData?.WingID,
          UserName: "",
          Password: "",
          User_ID: fetchData?.User_ID,
          PoCashAmount: fetchData?.PoCashAmt,
          POChequeAmount: fetchData?.PoChequeAmt,
          NetAmount: fetchData?.PoAmt,
          ProjectDisplayName: fetchData?.ProjectDisplayName,
          AgreementStatus: fetchData?.TCAAgreement,
          FeedbackStatus: fetchData?.Feedback,
          OwnerFollowup: fetchData?.OwnerFollowup,
          SPOCFollowup: fetchData?.SPOCFollowup,
          ITPersonFollowup: fetchData?.ITPersonFollowup,
          IsActive: fetchData?.enabled,
          IsMailSent: fetchData?.IsMailSent,
          IsAutoDeliveryDate: fetchData?.IsAutoDeliveryDate,
        });
        getCountry();
        getState(fetchData?.CountryID);
        getDistrict(fetchData?.CountryID, fetchData?.StateID);
        getCity(
          fetchData?.CountryID,
          fetchData?.StateID,
          fetchData?.DistrictID
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleProjectSave = async () => {
    if (!formData?.ProjectName) {
      toast.error("Please Enter Project Name.");
    } else if (!formData?.AmcType) {
      toast.error("Please Enter AMC Type.");
    } else if (formData?.AMC_Start_Date === "") {
      toast.error("Please Enter AMC Start Date");
    } else if (!formData?.AMC_Start_Month) {
      toast.error("Please Enter AMC Start Month.");
    } else if (!formData?.Country) {
      toast.error("Please Select Country.");
    } else if (!formData?.State) {
      toast.error("Please Select State.");
    } else if (!formData?.Address) {
      toast.error("Please Enter Address.");
    } else if (!formData?.AuthorityEmail) {
      toast.error("Please Enter Owner Email.");
    } else if (!formData?.ITPersonEmail) {
      toast.error("Please Enter ITPersonEmail.");
    } else if (!formData?.SPOCEmail) {
      toast.error("Please Enter SPOCEmail.");
    } else if (!formData?.AgreementStatus) {
      toast.error("Please Select AgreementStatus.");
    } else if (!formData?.FeedbackStatus) {
      toast.error("Please Select FeedbackStatus.");
    } else {
      const formatDate = (date) => {
        return date &&
          moment(date, [
            "YYYY-MM-DD",
            "MM/DD/YYYY",
            "YYYY-MM-DDTHH:mm:ss",
          ]).isValid()
          ? moment(date).format("YYYY-MM-DD")
          : "2001-01-01";
      };

      const payload = {
        ActionType: "InsertProject",
        ProjectID: Number(formData?.ProjectID) || 0,
        User_ID: Number(formData?.User_ID) || 0,
        ProjectName: String(formData?.ProjectName) || "",
        DisplayName: String(formData?.ProjectDisplayName) || "",
        PriorityID: Number(formData?.ProjectPriority) || 0,
        Priority: getlabel(formData?.ProjectPriority, projectPriority),
        CurrentStatusID: Number(formData?.ProjectStatus) || 0,
        CurrentStatus: getlabel(formData?.ProjectStatus, projectStatus),
        OrganizationTypeID: Number(formData?.ProjectOrganizationType) || 0,
        OrganizationType: getlabel(
          formData?.ProjectOrganizationType,
          projectOrganizationType
        ),
        Address: String(formData?.Address) || "",
        PinCode: String(formData?.PinCode) || "",
        CountryID: Number(formData?.Country) || 0,
        Country: getlabel(formData?.Country, country),
        StateID: Number(formData?.State) || 0,
        State: getlabel(formData?.State, states),
        DistrictID: Number(formData?.District) || 0,
        District: getlabel(formData?.District, district),
        CityId: Number(formData?.City) || 0,
        City: getlabel(formData?.City, city),
        PoCashAmt: Number(formData?.PoCashAmount) || 0,
        PoChequeAmt: Number(formData?.POChequeAmount) || 0,
        GstPercentID: String("0"),
        GstPercent: String(formData?.TaxPercent) || "",
        PoGstAmt: Number(formData?.Tax) || 0,
        PoAmt: Number(formData?.NetAmount) || 0,
        PODate: formatDate(formData?.PoDate),
        Startdate: formatDate(formData?.StartDate),
        LiveDate: formatDate(formData?.LiveDate),
        OnsiteSupportDate: formatDate(formData?.OnlineSupportDate),
        ExistingApplication: String(formData?.ExistingApplication) || "",
        AMC: getlabel(formData?.AmcType, acctype),
        AMCID: Number(formData?.AmcType) || 0,
        AMC_StartDate: formatDate(formData?.AMC_Start_Date),
        AMCStartmonth: Number(formData?.AMC_Start_Month) || 0,
        AMCAmount: Number(formData?.AMC_Installment) || 0,
        AmcPer: Number(formData?.AMCPercent) || 0,
        MachineChargesUNI: Number(formData?.MachineUni) || 0,
        MachineChargesBI: Number(formData?.MachineBi) || 0,
        MaindaysCharges: Number(formData?.ManDays) || 0,
        OnsiteCharges: Number(formData?.Visit) || 0,
        SPOC_Name: String(formData?.SPOCName) || "",
        SPOC_Mobile: String(formData?.SPOCMobile) || "",
        SPOC_EmailID: String(formData?.SPOCEmail) || "",
        Owner_Name: String(formData?.AuthorityName) || "",
        Owner_Mobile: String(formData?.AuthorityMobile) || "",
        Owner_Email: String(formData?.AuthorityEmail) || "",
        ItPersonName: String(formData?.ITPersonName) || "",
        ItPersonMobile: String(formData?.ITPersonMobile) || "",
        ItPersonEmail: String(formData?.ITPersonEmail) || "",
        OwnerDesignation: String(formData?.OwnerDesignation) || "",
        SPOCDesignation: String(formData?.SPOCDesignation) || "",
        ItPersonDesignation: String(formData?.ItPersonDesignatio) || "",
        VerticalID: Number(formData?.VerticalID) || 0,
        Vertical: getlabel(formData?.VerticalID, vertical),
        TeamID: Number(formData?.TeamID) || 0,
        Team: getlabel(formData?.TeamID, team),
        WingID: Number(formData?.WingID) || 0,
        Wing: getlabel(formData?.WingID, wing),
        Level1Employee_1: String(formData?.Level1Employee1 || ""),
        Level1Employee_2: String("0"),
        Level2Employee_1: String(formData?.Level2Employee1 || ""),
        Level2Employee_2: String("0"),
        Level3Employee_1: String(formData?.Level3Employee1 || ""),
        Level3Employee_2: String("0"),
        Engineer1: String(formData?.Engineer1 || ""),
        Engineer2: String(formData?.Engineer2 || ""),
        ProductID: Number(formData?.ProductVersion) || 0,
        Product: getlabel(formData?.ProductVersion, productversion),
        TCAAgreement: String(formData?.AgreementStatus) || "",
        Feedback: String(formData?.FeedbackStatus) || "",
        OwnerFollowup: formData?.OwnerFollowup === 1 ? "Owner" : "",
        SPOCFollowup: formData?.SPOCFollowup === 1 ? "SPOC" : "",
        ITPersonFollowup: formData?.ITPersonFollowup === 1 ? "ItPerson" : "",
        Website: String(formData?.Website) || "",
        IsAutoDeliveryDate: Number(formData?.IsAutoDeliveryDate) || 0,
        IsMailSent: Number(formData?.IsMailSent) || 0,

        // Nested arrays (send empty or with real data)
        ChecklistItems: formData?.ChecklistItems || [],
        centredetails: formData?.CentreDetails || [],
        ProjectModule: formData?.ProjectModule || [],
        ProjectMachineProperty: formData?.ProjectMachineProperty || [],
        ProjectShiftDetails: formData?.ProjectShiftDetails || [],
      };

      setLoading(true);
      try {
        axiosInstances
          .post(apiUrls?.ProjectMasterUpdate, payload)
          .then((res) => {
            if (res?.data?.success === true) {
              toast.success(res?.data?.message);
              setLoading(false);
              setIsSubmitting(false);
            } else {
              toast.error(res?.data?.message);
              setLoading(false);
              setIsSubmitting(false);
            }
          });
      } catch (error) {
        toast.error("An error occurred");
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  function getlabel(id, dropdownData) {
    const ele = dropdownData?.filter((item) => item?.value === id);
    return ele?.length > 0 ? ele[0].label : undefined;
  }

  const handleUpdateProject = () => {
    if (!formData?.AmcType) {
      toast.error("Please Enter AMC Type.");
    } else if (formData?.AMC_Start_Date === "") {
      toast.error("Please Enter AMC Start Date");
    } else if (!formData?.AMC_Start_Month) {
      toast.error("Please Enter AMC Start Month.");
    } else if (!formData?.Country) {
      toast.error("Please Select Country.");
    } else if (!formData?.State) {
      toast.error("Please Select State.");
    } else if (!formData?.Address) {
      toast.error("Please Enter Address.");
    } else if (!formData?.AuthorityEmail) {
      toast.error("Please Enter Owner Email.");
    } else if (!formData?.ITPersonEmail) {
      toast.error("Please Enter ITPersonEmail.");
    } else if (!formData?.SPOCEmail) {
      toast.error("Please Enter SPOCEmail.");
    } else if (!formData?.AgreementStatus) {
      toast.error("Please Select AgreementStatus.");
    } else if (!formData?.FeedbackStatus) {
      toast.error("Please Select FeedbackStatus.");
    } else {
      const formatDate = (date) => {
        return date &&
          moment(date, [
            "YYYY-MM-DD",
            "MM/DD/YYYY",
            "YYYY-MM-DDTHH:mm:ss",
          ]).isValid()
          ? moment(date).format("YYYY-MM-DD")
          : "2001-01-01";
      };
      const payload = {
        ActionType: "UpdateProject",
        ProjectID: Number(formData?.ProjectID) || 0,
        User_ID: Number(formData?.User_ID) || 0,
        ProjectName: String(formData?.ProjectName) || "",
        DisplayName: String(formData?.ProjectDisplayName) || "",
        PriorityID: Number(formData?.ProjectPriority) || 0,
        Priority: getlabel(formData?.ProjectPriority, projectPriority),
        CurrentStatusID: Number(formData?.ProjectStatus) || 0,
        CurrentStatus: getlabel(formData?.ProjectStatus, projectStatus),
        OrganizationTypeID: Number(formData?.ProjectOrganizationType) || 0,
        OrganizationType: getlabel(
          formData?.ProjectOrganizationType,
          projectOrganizationType
        ),
        Address: String(formData?.Address) || "",
        PinCode: String(formData?.PinCode) || "",
        CountryID: Number(formData?.Country) || 0,
        Country: getlabel(formData?.Country, country),
        StateID: Number(formData?.State) || 0,
        State: getlabel(formData?.State, states),
        DistrictID: Number(formData?.District) || 0,
        District: getlabel(formData?.District, district),
        CityId: Number(formData?.City) || 0,
        City: getlabel(formData?.City, city),
        PoCashAmt: Number(formData?.PoCashAmount) || 0,
        PoChequeAmt: Number(formData?.POChequeAmount) || 0,
        GstPercentID: String("0"),
        GstPercent: String(formData?.TaxPercent) || "",
        PoGstAmt: Number(formData?.Tax) || 0,
        PoAmt: Number(formData?.NetAmount) || 0,
        PODate: formatDate(formData?.PoDate),
        Startdate: formatDate(formData?.StartDate),
        LiveDate: formatDate(formData?.LiveDate),
        OnsiteSupportDate: formatDate(formData?.OnlineSupportDate),
        ExistingApplication: String(formData?.ExistingApplication) || "",
        AMC: getlabel(formData?.AmcType, acctype),
        AMCID: Number(formData?.AmcType) || 0,
        AMC_StartDate: formatDate(formData?.AMC_Start_Date),
        AMCStartmonth: Number(formData?.AMC_Start_Month) || 0,
        AMCAmount: Number(formData?.AMC_Installment) || 0,
        AmcPer: Number(formData?.AMCPercent) || 0,
        MachineChargesUNI: Number(formData?.MachineUni) || 0,
        MachineChargesBI: Number(formData?.MachineBi) || 0,
        MaindaysCharges: Number(formData?.ManDays) || 0,
        OnsiteCharges: Number(formData?.Visit) || 0,
        SPOC_Name: String(formData?.SPOCName) || "",
        SPOC_Mobile: String(formData?.SPOCMobile) || "",
        SPOC_EmailID: String(formData?.SPOCEmail) || "",
        Owner_Name: String(formData?.AuthorityName) || "",
        Owner_Mobile: String(formData?.AuthorityMobile) || "",
        Owner_Email: String(formData?.AuthorityEmail) || "",
        ItPersonName: String(formData?.ITPersonName) || "",
        ItPersonMobile: String(formData?.ITPersonMobile) || "",
        ItPersonEmail: String(formData?.ITPersonEmail) || "",
        OwnerDesignation: String(formData?.OwnerDesignation) || "",
        SPOCDesignation: String(formData?.SPOCDesignation) || "",
        ItPersonDesignation: String(formData?.ItPersonDesignatio) || "",
        VerticalID: Number(formData?.VerticalID) || 0,
        Vertical: getlabel(formData?.VerticalID, vertical),
        TeamID: Number(formData?.TeamID) || 0,
        Team: getlabel(formData?.TeamID, team),
        WingID: Number(formData?.WingID) || 0,
        Wing: getlabel(formData?.WingID, wing),
        Level1Employee_1: String(formData?.Level1Employee1 || ""),
        Level1Employee_2: String("0"),
        Level2Employee_1: String(formData?.Level2Employee1 || ""),
        Level2Employee_2: String("0"),
        Level3Employee_1: String(formData?.Level3Employee1 || ""),
        Level3Employee_2: String("0"),
        Engineer1: String(formData?.Engineer1 || ""),
        Engineer2: String(formData?.Engineer2 || ""),
        ProductID: Number(formData?.ProductVersion) || 0,
        Product: getlabel(formData?.ProductVersion, productversion),
        TCAAgreement: String(formData?.AgreementStatus) || "",
        Feedback: String(formData?.FeedbackStatus) || "",
        OwnerFollowup: formData?.OwnerFollowup === 1 ? "Owner" : "",
        SPOCFollowup: formData?.SPOCFollowup === 1 ? "SPOC" : "",
        ITPersonFollowup: formData?.ITPersonFollowup === 1 ? "ItPerson" : "",
        Website: String(formData?.Website) || "",
        IsAutoDeliveryDate: Number(formData?.IsAutoDeliveryDate) || 0,
        IsMailSent: Number(formData?.IsMailSent) || 0,

        // Nested arrays (send empty or with real data)
        ChecklistItems: formData?.ChecklistItems || [],
        centredetails: formData?.CentreDetails || [],
        ProjectModule: formData?.ProjectModule || [],
        ProjectMachineProperty: formData?.ProjectMachineProperty || [],
        ProjectShiftDetails: formData?.ProjectShiftDetails || [],
      };

      setLoading(true);

      axiosInstances
        .post(apiUrls?.ProjectMasterUpdate, payload)
        .then((res) => {
          if (res?.data?.success == true) {
            toast.success(res?.data?.message);
            setLoading(false);
            navigate("/SearchProjectMaster");
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    getProjectOrganizationType();
    getProjectStatus();
    getProjectPriority();
    getCountry();
    getProduct();
    getReporter();
    getVertical();
    getTeam();
    getWing();
    getUserName();
    // fetchProjectdetails();
    getProject();
    getAMCTYPE();
  }, []);

  useEffect(() => {
    if (state?.edit) {
      fetchProjectdetails(state?.data);
    }
  }, [state?.data, state?.edit]);

  return (
    <>
      <div className="card">
        <Heading
          title="Project Master New"
          isBreadcrumb={true}
          secondTitle={
            <div className="d-flex">
              <div className="text-align-center">
                {state && (
                  <div className="d-flex">
                    <span style={{ fontWeight: "bold" }}> Tab List :</span>
                    <span className="">
                      <AmountSubmissionSeeMoreList
                        ModalComponent={ModalComponent}
                        setSeeMore={setSeeMore}
                        // data={fetchDetails}
                        data={{ ...fetchDetails, type: "LedgerStatus" }}
                        setVisible={() => {
                          setListVisible(false);
                        }}
                        handleBindFrameMenu={[
                          {
                            FileName: "Centre Booking",
                            URL: "CentreModuleModal",
                            FrameName: "CentreModuleModal",
                            Description: "CentreModuleModal",
                          },
                          {
                            FileName: "Sales Booking",
                            URL: "SearchSalesBooking",
                            FrameName: "SearchSalesBooking",
                            Description: "SearchSalesBooking",
                          },
                          {
                            FileName: "Machine Booking",
                            URL: "MachineModuleModal",
                            FrameName: "MachineModuleModal",
                            Description: "MachineModuleModal",
                          },
                          {
                            FileName: "Module Booking",
                            URL: "ModuleTabModal",
                            FrameName: "ModuleTabModal",
                            Description: "ModuleTabModal",
                          },

                          {
                            FileName: "Category Mapping",
                            URL: "ProjectMasterProjectModal",
                            FrameName: "ProjectMasterProjectModal",
                            Description: "ProjectMasterProjectModal",
                          },
                          {
                            FileName: "User Mapping",
                            URL: "UserMapping",
                            FrameName: "UserMapping",
                            Description: "UserMapping",
                          },
                          // {
                          //   FileName: "Rate List Master",
                          //   URL: "RateListsMaster",
                          //   FrameName: "RateListsMaster",
                          //   Description: "RateListsMaster",
                          // },
                          // {
                          //   FileName: "Finance Update",
                          //   URL: "FinanceModalTab",
                          //   FrameName: "FinanceModalTab",
                          //   Description: "FinanceModalTab",
                          // },

                          // {
                          //   FileName: "Notification Details",
                          //   URL: "NotificationTabModal",
                          //   FrameName: "NotificationTabModal",
                          //   Description: "NotificationTabModal",
                          // },
                          // {
                          //   FileName: "SpocUpdate Details",
                          //   URL: "SpocUpdateModal",
                          //   FrameName: "SpocUpdateModal",
                          //   Description: "SpocUpdateModal",
                          // },
                          // {
                          //   FileName: "Escalation Matrix Details",
                          //   URL: "EscalationModal",
                          //   FrameName: "EscalationModal",
                          //   Description: "EscalationModal",
                          // },
                          {
                            FileName: "Billing Details",
                            URL: "BillingDetailModal",
                            FrameName: "BillingDetailModal",
                            Description: "BillingDetailModal",
                          },
                          // {
                          //   FileName: "Locality Update",
                          //   URL: "LocalityUpdateTab",
                          //   FrameName: "LocalityUpdateTab",
                          //   Description: "LocalityUpdateTab",
                          // },
                          // {
                          //   FileName: "Project RateCard",
                          //   URL: "ProjectRateCardModal",
                          //   FrameName: "ProjectRateCardModal",
                          //   Description: "ProjectRateCardModal",
                          // },
                          // {
                          //   FileName: "View Module",
                          //   URL: "ImplementationModuleModal",
                          //   FrameName: "ImplementationModuleModal",
                          //   Description: "ImplementationModuleModal",
                          // },
                          {
                            FileName: "Implementation Plan",
                            URL: "ImplementationPlan",
                            FrameName: "ImplementationPlan",
                            Description: "ImplementationPlan",
                          },
                          {
                            FileName: "Checklist Entry",
                            URL: "CheckListEntry",
                            FrameName: "CheckListEntry",
                            Description: "CheckListEntry",
                          },
                          {
                            FileName: "Client To Shift",
                            URL: "ClientToShift",
                            FrameName: "ClientToShift",
                            Description: "ClientToShift",
                          },

                          {
                            FileName: "View Document",
                            URL: "UploadDocumentProject",
                            FrameName: "UploadDocumentProject",
                            Description: "UploadDocumentProject",
                          },
                          // {
                          //   FileName: "Pirnt Document",
                          //   URL: "PirntDocument",
                          //   FrameName: "PirntDocument",
                          //   Description: "PirntDocument",
                          // },
                        ]}
                        isShowPatient={true}
                      />
                    </span>
                    <SlideScreen
                      visible={listVisible}
                      setVisible={() => {
                        setListVisible(false);
                        setRenderComponent({
                          name: null,
                          component: null,
                        });
                      }}
                      Header={
                        <SeeMoreSlideScreen
                          name={renderComponent?.name}
                          seeMore={seeMore}
                          handleChangeComponent={handleChangeComponent}
                        />
                      }
                    >
                      {renderComponent?.component}
                    </SlideScreen>
                  </div>
                )}
              </div>
              <div className="ml-2">
                <Link to="/SearchProjectMaster" style={{ fontWeight: "bold" }}>
                  Back to List
                </Link>
              </div>
            </div>
          }
        />

        {/* <div className="card"> */}
        <div className="row m-1">
          <div className="col-sm-6">
            <div className="card ">
              <Heading title="Project Details" />
              <div className="row m-1">
                <Input
                  type="text"
                  className="form-control mt-1"
                  id="ProjectName"
                  name="ProjectName"
                  lable="Project Name"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.ProjectName}
                  respclass="col-xl-4 col-md-4 col-sm-4 col-12"
                  // disabled
                />

                <Input
                  type="text"
                  className="form-control mt-1"
                  id="ProjectDisplayName"
                  name="ProjectDisplayName"
                  lable="Display Name"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.ProjectDisplayName}
                  respclass="col-xl-4 col-md-4 col-sm-4 col-12"
                />

                <ReactSelect
                  respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-1"
                  name="ProjectPriority"
                  placeholderName="Priority"
                  dynamicOptions={projectPriority}
                  handleChange={handleDeliveryChange}
                  value={formData.ProjectPriority}
                />
                <ReactSelect
                  respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-1"
                  name="ProjectStatus"
                  placeholderName="Status"
                  dynamicOptions={projectStatus}
                  handleChange={handleDeliveryChange}
                  value={formData.ProjectStatus}
                />
                <ReactSelect
                  respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-1"
                  name="ProjectOrganizationType"
                  placeholderName="Organization"
                  dynamicOptions={projectOrganizationType}
                  handleChange={handleDeliveryChange}
                  value={formData.ProjectOrganizationType}
                />
                <div
                  className="search-col d-none"
                  style={{ marginLeft: "8px" }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                      <input
                        type="checkbox"
                        name="IsActive"
                        checked={formData?.IsActive ? 1 : 0}
                        onChange={handleCheckBox}
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
                      {formData?.IsActive ? "Active" : "DeActive"}
                    </span>
                  </div>
                </div>
                <div
                  className="search-col d-none"
                  style={{ marginLeft: "8px" }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                      <input
                        type="checkbox"
                        name="IsMailSent"
                        checked={formData?.IsMailSent ? 1 : 0}
                        onChange={handleCheckBox}
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
                      {formData?.IsMailSent ? "IsMailSent" : "IsMailNotSent"}
                    </span>
                  </div>
                </div>
                <div
                  className="search-col d-none"
                  style={{ marginLeft: "8px" }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                      <input
                        type="checkbox"
                        name="IsAutoDeliveryDate"
                        checked={formData?.IsAutoDeliveryDate ? 1 : 0}
                        onChange={handleCheckBox}
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
                      IsAutoDeliveryDate
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card ">
              <Heading title="Product Version Details" />
              <div className="row m-1">
                <ReactSelect
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12 mt-1"
                  name="ProductVersion"
                  placeholderName="Product Version"
                  dynamicOptions={productversion}
                  handleChange={handleDeliveryChange}
                  value={formData.ProductVersion}
                />
                <Input
                  type="number"
                  className="form-control mt-1"
                  id="PoCashAmount"
                  name="PoCashAmount"
                  lable="PO Cash Amount"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.PoCashAmount}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                />
                <Input
                  type="number"
                  className="form-control mt-1"
                  id="POChequeAmount"
                  name="POChequeAmount"
                  lable="PO Cheque Amount"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.POChequeAmount}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                />
                {/* <ReactSelect
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                  name="POAmount"
                  placeholderName="PO Amount"
                  dynamicOptions={[
                    { label: "Cash", value: "Cash" },
                    { label: "Online", value: "Online" },
                  ]}
                  handleChange={handleDeliveryChange}
                  value={formData.POAmount}
                /> */}
                <Input
                  type="number"
                  className="form-control mt-1"
                  id="TaxPercent"
                  name="TaxPercent"
                  lable="Tax %"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.TaxPercent}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                />
                <Input
                  type="number"
                  className="form-control mt-1"
                  id="Tax"
                  name="Tax"
                  lable="Tax Amount"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.Tax}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12 mt-1"
                />
                <Input
                  type="number"
                  className="form-control"
                  id="NetAmount"
                  name="NetAmount"
                  lable="Net Amount"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.NetAmount}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12 mt-1"
                />
                <ReactSelect
                  name="ExistingApplication"
                  respclass="col-xl-3 col-md-4 col-sm-6 col-12 mt-1"
                  placeholderName="Exiting Application"
                  dynamicOptions={[
                    { label: "LABMATE", value: "1" },
                    { label: "New Setup", value: "2" },
                    { label: "LIMS 2.0", value: "3" },
                  ]}
                  value={formData?.ExistingApplication}
                  handleChange={handleDeliveryChange}
                />
                <Input
                  type="text"
                  className="form-control"
                  id="Website"
                  name="Website"
                  lable="Website"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.Website}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12 mt-1"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row m-1">
          <div className="col-sm-6">
            <div className="card ">
              <Heading title="Team Details" />
              <div className="row m-1">
                <ReactSelect
                  respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-1"
                  name="VerticalID"
                  placeholderName="Vertical"
                  dynamicOptions={vertical}
                  handleChange={handleDeliveryChange}
                  value={formData.VerticalID}
                  // requiredClassName={"required-fields"}
                />

                <ReactSelect
                  respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-1"
                  name="TeamID"
                  placeholderName="Team"
                  dynamicOptions={team}
                  handleChange={handleDeliveryChange}
                  value={formData.TeamID}
                  // requiredClassName={"required-fields"}
                />

                <ReactSelect
                  respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-1"
                  name="WingID"
                  placeholderName="Wing"
                  dynamicOptions={wing}
                  handleChange={handleDeliveryChange}
                  value={formData.WingID}
                  // requiredClassName={"required-fields"}
                />
              </div>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="card ">
              <Heading title="Itdose Details" />
              <div className="row m-1">
                <ReactSelect
                  name="Level1Employee1"
                  respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-1"
                  placeholderName="Level 1"
                  dynamicOptions={[{ label: "Select", value: "" }, ...user]}
                  value={formData?.Level1Employee1}
                  handleChange={handleDeliveryChange}
                />
                <ReactSelect
                  name="Level2Employee1"
                  respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-1"
                  placeholderName="Level 2"
                  dynamicOptions={[{ label: "Select", value: "" }, ...user]}
                  value={formData?.Level2Employee1}
                  handleChange={handleDeliveryChange}
                />
                <ReactSelect
                  name="Level3Employee1"
                  respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-1"
                  placeholderName="Level 3"
                  dynamicOptions={[{ label: "Select", value: "" }, ...user]}
                  value={formData?.Level3Employee1}
                  handleChange={handleDeliveryChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row m-1">
          <div className="col-sm-6">
            <div className="card ">
              <Heading title="Contact Details" />
              <div className="row m-1">
                <ReactSelect
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                  name="Country"
                  placeholderName="Country"
                  dynamicOptions={country}
                  handleChange={handleDeliveryChange}
                  value={formData.Country}
                />
                <ReactSelect
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                  name="State"
                  placeholderName="State"
                  dynamicOptions={states}
                  handleChange={handleDeliveryChange}
                  value={formData.State}
                />
                <ReactSelect
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                  name="District"
                  placeholderName="District"
                  dynamicOptions={district}
                  handleChange={handleDeliveryChange}
                  value={formData.District}
                />
                <ReactSelect
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                  name="City"
                  placeholderName="City"
                  dynamicOptions={city}
                  handleChange={handleDeliveryChange}
                  value={formData.City}
                />
                <Input
                  type="text"
                  className="form-control mt-1"
                  id="Address"
                  name="Address"
                  lable="Address"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.Address}
                  respclass="col-xl-9 col-md-4 col-sm-4 col-12"
                />
                <Input
                  type="text"
                  className="form-control mt-1"
                  id="PinCode"
                  name="PinCode"
                  lable="PinCode"
                  placeholder=" "
                  onChange={(e) => {
                    inputBoxValidation(
                      PINCODE_VALIDATION_REGX,
                      e,
                      handleSelectChange
                    );
                  }}
                  value={formData?.PinCode}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                />
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card ">
              <Heading title="AMC Details" />
              <div className="row m-1">
                <ReactSelect
                  name="AmcType"
                  respclass="col-xl-3 col-md-4 col-sm-6 col-12 "
                  placeholderName="AMC Type"
                  dynamicOptions={acctype}
                  value={formData?.AmcType}
                  handleChange={handleDeliveryChange}
                />
                <DatePicker
                  className="custom-calendar"
                  id="AMC_Start_Date"
                  name="AMC_Start_Date"
                  lable="AMC Start Date"
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.AMC_Start_Date}
                  respclass="col-xl-3 col-md-4 col-sm-6 col-12 "
                  handleChange={handleSelectChange}
                />
                <Input
                  type="number"
                  className="form-control "
                  id="AMC_Start_Month"
                  name="AMC_Start_Month"
                  lable="AMC Start Month"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.AMC_Start_Month}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12 "
                />
                <Input
                  type="number"
                  className="form-control "
                  id="AMC_Installment"
                  name="AMC_Installment"
                  lable="AMC Installment"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.AMC_Installment}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12 "
                />
                {/* <Input
                  type="number"
                  className="form-control "
                  id="AMC_Amount"
                  name="AMC_Amount"
                  lable="AMC Amount"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.AMC_Amount}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12 "
                /> */}
                <Input
                  type="number"
                  className="form-control "
                  id="AMCPercent"
                  name="AMCPercent"
                  lable="AMC %"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.AMCPercent}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12 mt-1"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row m-1">
          <div className="col-sm-6">
            <div className="card ">
              <Heading title="Charges Details" />
              <div className="row m-1">
                {/* <Input
                  type="number"
                  className="form-control"
                  id="AdditionCharges"
                  name="AdditionCharges"
                  lable="Addition Charges"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.AdditionCharges}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                /> */}
                <Input
                  type="number"
                  className="form-control mt-1"
                  id="ManDays"
                  name="ManDays"
                  lable="ManDays"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.ManDays}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                />
                <Input
                  type="number"
                  className="form-control mt-1"
                  id="Visit"
                  name="Visit"
                  lable="OnSite Charges"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.Visit}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                />
                <Input
                  type="number"
                  className="form-control mt-1"
                  id="MachineUni"
                  name="MachineUni"
                  lable="MachineUni"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.MachineUni}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                />
                <Input
                  type="number"
                  className="form-control mt-1"
                  id="MachineBi"
                  name="MachineBi"
                  lable="MachineBi"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.MachineBi}
                  respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                />
              </div>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="card ">
              <Heading title="PO/Live Details" />
              <div className="row m-1">
                <DatePicker
                  className="custom-calendar"
                  id="PoDate"
                  name="PoDate"
                  lable="Po Date"
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.PoDate}
                  respclass="col-xl-3 col-md-4 col-sm-6 col-12 mt-1"
                  handleChange={handleSelectChange}
                />
                <DatePicker
                  className="custom-calendar"
                  id="StartDate"
                  name="StartDate"
                  lable="Start Date"
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.StartDate}
                  respclass="col-xl-3 col-md-4 col-sm-6 col-12 mt-1"
                  handleChange={handleSelectChange}
                />
                <DatePicker
                  className="custom-calendar"
                  id="LiveDate"
                  name="LiveDate"
                  lable="Live Date"
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.LiveDate}
                  respclass="col-xl-3 col-md-4 col-sm-6 col-12 mt-1"
                  handleChange={handleSelectChange}
                />
                <DatePicker
                  className="custom-calendar"
                  id="OnlineSupportDate"
                  name="OnlineSupportDate"
                  lable="Online Support Date"
                  placeholder={VITE_DATE_FORMAT}
                  value={formData?.OnlineSupportDate}
                  respclass="col-xl-3 col-md-4 col-sm-6 col-12 mt-1"
                  handleChange={handleSelectChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row m-1">
          <div className="col-sm-10">
            <div className="card">
              <Heading
                title="Client Details"
                secondTitle={
                  <div className="d-flex">
                    <span className="mr-3">Agreement</span>
                    <span className="mr-3">Feedback</span>
                    <span className="mr-0">Followup</span>
                  </div>
                }
              />
              <div className="row m-1">
                <div className="col-sm-10">
                  <div className="row">
                    <Input
                      type="text"
                      className="form-control "
                      id="AuthorityName"
                      name="AuthorityName"
                      lable="Owner Name"
                      placeholder=" "
                      onChange={handleSelectChange}
                      value={formData?.AuthorityName}
                      respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                      type="text"
                      className="form-control "
                      id="OwnerDesignation"
                      name="OwnerDesignation"
                      lable="Owner Designation"
                      placeholder=" "
                      onChange={handleSelectChange}
                      value={formData?.OwnerDesignation}
                      respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                      type="number"
                      className="form-control "
                      id="AuthorityMobile"
                      name="AuthorityMobile"
                      lable="Owner Mobile"
                      placeholder=" "
                      onChange={(e) => {
                        inputBoxValidation(
                          MOBILE_NUMBER_VALIDATION_REGX,
                          e,
                          handleSelectChange
                        );
                      }}
                      value={formData?.AuthorityMobile}
                      respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                      type="text"
                      className="form-control "
                      id="AuthorityEmail"
                      name="AuthorityEmail"
                      lable="Owner Email"
                      placeholder=" "
                      onChange={handleSelectChange}
                      value={formData?.AuthorityEmail}
                      respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                    />

                    <Input
                      type="text"
                      className="form-control mt-1"
                      id="SPOC_Name"
                      name="SPOCName"
                      lable="SPOC Name"
                      value={formData?.SPOCName}
                      placeholder=" "
                      respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                      onChange={handleSelectChange}
                    />
                    <Input
                      type="text"
                      className="form-control mt-1"
                      id="SPOCDesignation"
                      name="SPOCDesignation"
                      lable="SPOC Designation"
                      value={formData?.SPOCDesignation}
                      placeholder=" "
                      respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                      onChange={handleSelectChange}
                    />
                    <Input
                      type="text"
                      className="form-control mt-1"
                      id="SPOC_Mobile"
                      name="SPOCMobile"
                      lable="SPOC Mobile"
                      value={formData?.SPOCMobile}
                      placeholder=" "
                      respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                      onChange={(e) => {
                        inputBoxValidation(
                          MOBILE_NUMBER_VALIDATION_REGX,
                          e,
                          handleSelectChange
                        );
                      }}
                    />
                    <Input
                      type="text"
                      className="form-control mt-1"
                      id="SPOC_Email"
                      name="SPOCEmail"
                      lable="SPOC Email"
                      value={formData?.SPOCEmail}
                      placeholder=" "
                      respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                      onChange={handleSelectChange}
                    />
                    <Input
                      type="text"
                      className="form-control mt-1"
                      id="ITPersonName"
                      name="ITPersonName"
                      lable="IT Person Name"
                      placeholder=" "
                      onChange={handleSelectChange}
                      value={formData?.ITPersonName}
                      respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                      type="text"
                      className="form-control mt-1"
                      id="ItPersonDesignation"
                      name="ItPersonDesignation"
                      lable="ItPerson Designation"
                      placeholder=" "
                      onChange={handleSelectChange}
                      value={formData?.ItPersonDesignation}
                      respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                      type="number"
                      className="form-control mt-1"
                      id="ITPersonMobile"
                      name="ITPersonMobile"
                      lable="IT Person Mobile"
                      placeholder=" "
                      onChange={(e) => {
                        inputBoxValidation(
                          MOBILE_NUMBER_VALIDATION_REGX,
                          e,
                          handleSelectChange
                        );
                      }}
                      value={formData?.ITPersonMobile}
                      respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                      type="text"
                      className="form-control mt-1"
                      id="ITPersonEmail"
                      name="ITPersonEmail"
                      lable="IT Person Email"
                      placeholder=" "
                      onChange={handleSelectChange}
                      value={formData?.ITPersonEmail}
                      respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                    />
                  </div>
                </div>
                <div className="col-sm-2">
                  <div
                    className="row"
                    style={{ justifyContent: "space-between" }}
                  >
                    <div className="col-sm-1">
                      <div className="flex ">
                        <div className="row">
                          <label className="ml-4 mt-2">
                            <input
                              type="radio"
                              name="AgreementStatus"
                              checked={formData.AgreementStatus === "Owner"}
                              onChange={() =>
                                handleStatusChange("AgreementStatus", "Owner")
                              }
                            />
                            {/* Owner */}
                          </label>
                        </div>
                        <div className="row">
                          <label className="ml-4 mt-2">
                            <input
                              type="radio"
                              name="AgreementStatus"
                              checked={formData.AgreementStatus === "SPOC"}
                              onChange={() =>
                                handleStatusChange("AgreementStatus", "SPOC")
                              }
                            />
                            {/* SPOC */}
                          </label>
                        </div>
                        <div className="row">
                          <label className="ml-4 mt-2">
                            <input
                              type="radio"
                              name="AgreementStatus"
                              checked={formData.AgreementStatus === "ItPerson"}
                              onChange={() =>
                                handleStatusChange(
                                  "AgreementStatus",
                                  "ItPerson"
                                )
                              }
                            />
                            {/* ItPerson */}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-1">
                      <div className="flex ">
                        <div className="row">
                          <label className="ml-4 mt-2">
                            <input
                              type="radio"
                              name="status"
                              checked={formData.FeedbackStatus === "Owner"}
                              onChange={() =>
                                handleStatusChange1("FeedbackStatus", "Owner")
                              }
                            />
                            {/* Owner */}
                          </label>
                        </div>
                        <div className="row">
                          <label className="ml-4 mt-2">
                            <input
                              type="radio"
                              name="status"
                              checked={formData.FeedbackStatus === "SPOC"}
                              onChange={() =>
                                handleStatusChange1("FeedbackStatus", "SPOC")
                              }
                            />
                            {/* SPOC */}
                          </label>
                        </div>
                        <div className="row">
                          <label className="ml-4 mt-2">
                            <input
                              type="radio"
                              name="status"
                              checked={formData.FeedbackStatus === "ItPerson"}
                              onChange={() =>
                                handleStatusChange1(
                                  "FeedbackStatus",
                                  "ItPerson"
                                )
                              }
                            />
                            {/* ItPerson */}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-1 ml-3">
                      <div className="row">
                        <div className="flex">
                          {/* {["1", "2", "3"].map((channel) => (
                            <div className="row" key={channel}>
                              <label className="ml-4 mt-2">
                                <input
                                  type="checkbox"
                                  name={channel}
                                  checked={formData.follow?.includes(channel)}
                                  onChange={handleFollwChange}
                                />
                              </label>
                            </div>
                          ))} */}
                          <div className="row">
                            <label className="ml-4 mt-2">
                              <input
                                type="checkbox"
                                name="OwnerFollowup"
                                checked={formData.OwnerFollowup ? 1 : 0}
                                onChange={handleFollowupChange}
                              />
                              {/* Owner */}
                            </label>
                          </div>
                          <div className="row">
                            <label className="ml-4 mt-2">
                              <input
                                type="checkbox"
                                name="SPOCFollowup"
                                checked={formData.SPOCFollowup ? 1 : 0}
                                onChange={handleFollowupChange}
                              />
                              {/* SPOC */}
                            </label>
                          </div>
                          <div className="row">
                            <label className="ml-4 mt-2">
                              <input
                                type="checkbox"
                                name="ITPersonFollowup"
                                checked={formData.ITPersonFollowup ? 1 : 0}
                                onChange={handleFollowupChange}
                              />
                              {/* ItPerson */}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>{" "}
              </div>
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="ml-2">
              {state?.edit ? (
                <button
                  className="btn btn-sm btn-info"
                  onClick={handleUpdateProject}
                >
                  Update
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-info"
                  onClick={handleProjectSave}
                  disabled={isSubmitting}
                >
                  Save
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default ProjectMaster;
