import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import ReactSelect from "../components/formComponent/ReactSelect";
import { apiUrls } from "../networkServices/apiEndpoints";
import axios from "axios";
import { headers } from "../utils/apitools";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import Input from "../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { inputBoxValidation } from "../utils/utils";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../utils/constant";

import Loading from "../components/loader/Loading";
import { axiosInstances } from "../networkServices/axiosInstance";
import { Siren } from "lucide-react";
const SalesLeadCreate = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  console.log("stateeeeee", state);
  useEffect(() => {
    if (state?.edit) {
      getFetchDetails(state.data);
      // console.log(state.data)
    }
  }, []);
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState([]);
  const [district, setDistrict] = useState([]);
  const [project, setProject] = useState([]);
  const [assignto, setAssignedto] = useState([]);
  const [country, setCountry] = useState([]);
  const [states, setState] = useState([]);
  const [productversion, setProductVersion] = useState([]);
  const [formData, setFormData] = useState({
    Centre: "2",
    Country: "14",
    State: "",
    District: "",
    ProductVersion: "0",
    City: "",
    OrganizationName: "",
    ContactPersonName: "",
    ContactPersonDesignation: "",
    ContactPersonEmail: "",
    ContactPersonMobile: "",
    Website: "",
    Email: "",
    ReferralSource: "",
    ProjectID: "0",
    AssignedTo: "0",
    SoftwareVertical: "N/A",
    OtherProject: "",
    OtherEmployee: "",
    OtherVersion: "",
    NoOfCentre: "0",
    NoOfMachine: "0",
    isDue: "",
    isWebsite: "",
    isResource: "",
    isDesignation: "",
    isEmail: "",
    isMobile: "",
  });

  console.log("city", city);
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name == "Country") {
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
      // getState("14");
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

  const getFetchDetails = (id) => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("LeadID", id),
    // axios
    //   .post(apiUrls?.EditSalesLead, form, { headers })
    axiosInstances
      .post(apiUrls?.EditSalesLead, { LeadID: Number(id) })
      .then((res) => {
        const data = res?.data?.data;
        console.log("EditSalesLead", data);

        setFormData({
          ...formData,
          Centre: data?.IsUpcomingCentre,
          Country: data?.CountryID,
          State: data?.StateID,
          District: data?.DistrictID,
          City: data?.CityID,
          OrganizationName: data?.OrganizationName,
          ContactPersonName: data?.SPOC,
          ContactPersonDesignation: data?.SPOC_Designation,
          ContactPersonEmail: data?.SPOC_EmailID,
          ContactPersonMobile: data?.SPOC_Mobile,
          Website: data?.Website,
          ReferralSource: data?.ReferralSource,
          ProjectID: data?.ReferProjectID,
          AssignedTo: data?.ReferEmployeeID,
          SoftwareVertical: data?.SoftwareVertical,
          OtherProject: data?.ReferProject,
          OtherEmployee: data?.ReferEmployee,
          ProductVersion: data?.SoftwareVersionID,
          LeadID: data?.ID,
          NoOfCentre: data?.NoOfCentre,
          NoOfMachine: data?.NoOfMachine,
        });

        getState(data?.CountryID);
        getDistrict(data?.CountryID, data?.StateID);
        getCity(data?.CountryID, data?.StateID, data?.DistrictID);
        getProject();
        getAssignTo();
        getCountry();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
      .post(apiUrls?.ProjectSelect, {})
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
  const getCountry = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.GetCountry, form, { headers })
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
    // let form = new FormData();
    // form.append("CountryID", value || "14"),
    //   axios
    //     .post(apiUrls?.GetState, form, { headers })
    axiosInstances
      .post(apiUrls?.GetState, { CountryID: String(value || "14") })
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
  const getProduct = (value) => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   axios
    //     .post(apiUrls?.GetProductVersion, form, {
    //       headers,
    //     })
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
  // .post(apiUrls?.AssignTo_Select, form, { headers })
  const getAssignTo = () => {
    // let form = new FormData();
    // form.append("ID", "0");
    // axios
    //   .post(apiUrls?.AllEmployeeSearch, form, { headers })
    axiosInstances
      .post(apiUrls?.AllEmployeeSearch, {})
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { label: item?.realname, value: item?.id };
        });
        setAssignedto(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getDistrict = (country, state) => {
    // let form = new FormData();
    // form.append("CountryID", formData?.Country ? formData?.Country : country),
    //   form.append("StateID", state),
    //   axios
    //     .post(apiUrls?.GetDistrict, form, { headers })
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
    // let form = new FormData();
    // form.append("CountryID", formData?.Country ? formData?.Country : country),
    //   form.append("StateID", formData?.State ? formData?.State : state),
    //   form.append("DistrictID", district),
    //   axios
    //     .post(apiUrls?.GetCity, form, {
    //       headers,
    //     })
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
  function getlabel(id, dropdownData) {
    const ele = dropdownData?.filter((item) => item?.value === id);
    return ele?.length > 0 ? ele[0].label : undefined;
  }

  const handleSave = () => {
    if (!formData?.OrganizationName) {
      toast.error("Please enter Organization Name");
      return;
    }
    if (!formData?.ContactPersonName) {
      toast.error("Please enter SPOC Name");
      return;
    }
    if (!formData?.SoftwareVertical) {
      toast.error("Please Select Software Vertical");
      return;
    }
    if (!formData?.ContactPersonMobile) {
      toast.error("Please enter SPOC Mobile");
      return;
    }
    if (!formData?.ContactPersonEmail) {
      toast.error("Please enter SPOC Email");
      return;
    }
    if (!formData?.ContactPersonDesignation) {
      toast.error("Please enter SPOC Designation");
      return;
    }
    if (!formData?.Country) {
      toast.error("Please Select Country");
      return;
    }
    if (!formData?.Centre) {
      toast.error("Please Select Centre");
      return;
    }
    if (!formData?.State) {
      toast.error("Please Select State");
      return;
    }
    if (!formData?.District) {
      toast.error("Please Select District");
      return;
    }
    if (!formData?.City) {
      toast.error("Please Select City");
      return;
    }
    if (!formData?.Website) {
      toast.error("Please enter Website");
      return;
    }
    if (!formData?.ReferralSource) {
      toast.error("Please enter Referral Source");
      return;
    }
    if (!formData?.ProjectID) {
      toast.error("Please Select Referal Project.");
      return;
    }
    if (!formData?.AssignedTo) {
      toast.error("Please Select Referal Employee.");
      return;
    }
    setLoading(true);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append(
    //     "Country",
    //     formData?.Country == "14"
    //       ? "INDIA"
    //       : getlabel(formData?.Country, country)
    //   ),
    //   form.append("CountryID", formData?.Country),
    //   form.append("City", getlabel(formData?.City, city)),
    //   form.append("CityID", formData?.City),
    //   form.append("DistrictID", formData?.District),
    //   form.append("District", getlabel(formData?.District, district)),
    //   form.append("OrganizationName", formData?.OrganizationName),
    //   form.append("State", getlabel(formData?.State, states)),
    //   form.append("StateID", formData?.State),
    //   form.append("IsUpcomingCentre", formData?.Centre),
    //   form.append(
    //     "SoftwareVertical",
    //     formData?.SoftwareVertical == "0" ? "N/A" : formData.SoftwareVertical
    //   ),
    //   form.append("SPOC", formData?.ContactPersonName),
    //   form.append("SPOC_Mobile", formData?.ContactPersonMobile),
    //   form.append("SPOC_EmailID", formData?.ContactPersonEmail),
    //   form.append("SPOC_Designation", formData?.ContactPersonDesignation),
    //   form.append("Website", formData?.Website),
    //   form.append("ReferralSource", formData?.ReferralSource),
    //   form.append(
    //     "ReferProjectID",
    //     formData?.ProjectID == "Other" ? "-1" : formData?.ProjectID
    //   ),
    //   form.append(
    //     "ReferProject",
    //     getlabel(formData?.ProjectID, project)
    //       ? getlabel(formData?.ProjectID, project)
    //       : formData?.OtherProject
    //   ),
    //   form.append(
    //     "ReferEmployeeID",
    //     formData?.AssignedTo == "Other" ? "-1" : formData?.AssignedTo
    //   ),
    //   form.append(
    //     "ReferEmployee",
    //     getlabel(formData?.AssignedTo, assignto)
    //       ? getlabel(formData?.AssignedTo, assignto)
    //       : formData?.OtherEmployee
    //   ),
    //   form.append(
    //     "SoftwareVersionID",
    //     formData?.ProductVersion == "Other" ? "-1" : formData?.ProductVersion
    //   ),
    //   form.append(
    //     "SoftwareVersionName",
    //     formData?.ProductVersion == "0"
    //       ? "N/A"
    //       : getlabel(formData?.ProductVersion, productversion)
    //   ),
    //   form.append("NoOfCentre", formData?.NoOfCentre),
    //   form.append("NoOfMachine", formData?.NoOfMachine),
    // axios
    //   .post(apiUrls?.CreateSalesLead, form, {
    //     headers,
    //   })
    axiosInstances
      .post(apiUrls?.CreateSalesLead, {
        Country: String(
          formData?.Country == "14"
            ? "INDIA"
            : getlabel(formData?.Country, country)
        ),
        CountryID: Number(formData?.Country),
        City: String(formData?.City, city),
        CityID: Number(formData?.City),
        DistrictID: Number(formData?.District),
        District: String(formData?.District, district),
        OrganizationName: String(formData?.OrganizationName ?? ""),

        State: String(getlabel(formData?.State, states)),
        StateID: Number(formData?.State),

        IsUpcomingCentre: formData?.Centre === 0 ? true : false,

        SoftwareVertical:
          formData?.SoftwareVertical == "0"
            ? "N/A"
            : String(formData?.SoftwareVertical),

        SPOC: String(formData?.ContactPersonName),
        SPOC_Mobile: String(formData?.ContactPersonMobile),
        SPOC_EmailID: String(formData?.ContactPersonEmail),
        SPOC_Designation: String(formData?.ContactPersonDesignation),
        Website: String(formData?.Website ?? ""),
        ReferralSource: String(formData?.ReferralSource ?? ""),

        ReferProjectID:
          formData?.ProjectID == "Other" ? -1 : Number(formData?.ProjectID),
        ReferProject:
          getlabel(formData?.ProjectID, project) ||
          String(formData?.OtherProject),

        ReferEmployeeID:
          formData?.AssignedTo == "Other" ? -1 : Number(formData?.AssignedTo),
        ReferEmployee:
          getlabel(formData?.AssignedTo, assignto) ||
          String(formData?.OtherEmployee),

        SoftwareVersionID:
          formData?.ProductVersion == "Other"
            ? -1
            : Number(formData?.ProductVersion),

        SoftwareVersionName:
          formData?.ProductVersion == "0"
            ? "N/A"
            : String(getlabel(formData?.ProductVersion, productversion)),

        NoOfCentre: Number(formData?.NoOfCentre),
        NoOfMachine: Number(formData?.NoOfMachine),
      })
      .then((res) => {
        if (res?.data?.status == true) {
          toast.success(res?.data?.message);
          setLoading(false);
          setFormData({
            Centre: "",
            Country: "",
            State: "",
            District: "",
            City: "",
            OrganizationName: "",
            ContactPersonName: "",
            ContactPersonDesignation: "",
            ContactPersonEmail: "",
            ContactPersonMobile: "",
            Website: "",
            ReferralSource: "",
            ProjectID: "",
            AssignedTo: "",
            SoftwareVertical: "",
            OtherProject: "",
            OtherEmployee: "",
          });
          navigate("/SalesLead");
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
    if (!formData?.OrganizationName) {
      toast.error("Please enter Organization Name");
      return;
    }
    if (!formData?.ContactPersonName) {
      toast.error("Please enter Contact Person Name");
      return;
    }
    if (!formData?.SoftwareVertical) {
      toast.error("Please Select Software Vertical");
      return;
    }
    if (!formData?.ContactPersonMobile) {
      toast.error("Please enter Contact Person Mobile");
      return;
    }
    if (!formData?.ContactPersonEmail) {
      toast.error("Please enter Contact Person Email");
      return;
    }
    if (!formData?.Country) {
      toast.error("Please Select Country");
      return;
    }
    if (!formData?.Centre) {
      toast.error("Please Select Status");
      return;
    }
    if (!formData?.State) {
      toast.error("Please Select State");
      return;
    }
    if (!formData?.District) {
      toast.error("Please Select District");
      return;
    }
    if (!formData?.City) {
      toast.error("Please Select City");
      return;
    }
    if (!formData?.ContactPersonDesignation) {
      toast.error("Please enter Contact Person Designation");
      return;
    }
    if (!formData?.Website) {
      toast.error("Please enter Website");
      return;
    }
    if (!formData?.ReferralSource) {
      toast.error("Please enter Referral Source");
      return;
    }
    if (!formData?.ProjectID) {
      toast.error("Please Select Project.");
      return;
    }
    if (!formData?.AssignedTo) {
      toast.error("Please Select Employee.");
      return;
    }
    setLoading(true);
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("LeadID", formData?.LeadID),
    //   form.append("Country", getlabel(formData?.Country, country)),
    //   form.append("CountryID", formData?.Country),
    //   form.append("City", getlabel(formData?.City, city)),
    //   form.append("CityID", formData?.City),
    //   form.append("DistrictID", formData?.District),
    //   form.append("District", getlabel(formData?.District, district)),
    //   form.append("OrganizationName", formData?.OrganizationName),
    //   form.append("State", getlabel(formData?.State, states)),
    //   form.append("StateID", formData?.State),
    //   form.append("IsUpcomingCentre", formData?.Centre),
    //   form.append("SoftwareVertical", formData?.SoftwareVertical),
    //   form.append("SPOC", formData?.ContactPersonName),
    //   form.append("SPOC_Mobile", formData?.ContactPersonMobile),
    //   form.append("SPOC_EmailID", formData?.ContactPersonEmail),
    //   form.append("SPOC_Designation", formData?.ContactPersonDesignation),
    //   form.append("Website", formData?.Website),
    //   form.append("ReferralSource", formData?.ReferralSource),
    //   form.append(
    //     "ReferProjectID",
    //     formData?.ProjectID == "Other" ? "-1" : formData?.ProjectID
    //   ),
    //   form.append(
    //     "ReferProject",
    //     getlabel(formData?.ProjectID, project)
    //       ? getlabel(formData?.ProjectID, project)
    //       : formData?.OtherProject
    //   ),
    //   form.append(
    //     "ReferEmployeeID",
    //     formData?.AssignedTo == "Other" ? "-1" : formData?.AssignedTo
    //   ),
    //   form.append(
    //     "ReferEmployee",
    //     getlabel(formData?.AssignedTo, assignto)
    //       ? getlabel(formData?.AssignedTo, assignto)
    //       : formData?.OtherEmployee
    //   ),
    //   form.append(
    //     "SoftwareVersionID",
    //     formData?.ProductVersion == "Other" ? "-1" : formData?.ProductVersion
    //   ),
    //   form.append(
    //     "SoftwareVersionName",
    //     getlabel(formData?.ProductVersion, productversion)
    //       ? getlabel(formData?.ProductVersion, productversion)
    //       : formData?.ProductVersion
    //   ),
    //   form.append("NoOfCentre", formData?.NoOfCentre),
    //   form.append("NoOfMachine", formData?.NoOfMachine),
    //   axios
    //     .post(apiUrls?.UpdateSalesLead, form, {
    //       headers,
    //     })

    const paylode = {
      LeadID: Number(formData?.LeadID),
      LeadNum: String(""),
      Country: String(getlabel(formData?.Country, country)),
      CountryID: Number(formData?.Country),

      City: String(getlabel(formData?.City, city)),
      CityID: Number(formData?.City),

      District: String(getlabel(formData?.District, district)),
      DistrictID: Number(formData?.District),

      OrganizationName: String(formData?.OrganizationName ?? ""),

      State: String(getlabel(formData?.State, states)),
      StateID: Number(formData?.State),

      IsUpcomingCentre: String(formData?.Centre),

      SoftwareVertical: String(formData?.SoftwareVertical ?? ""),

      SPOC: String(formData?.ContactPersonName ?? ""),
      SPOC_Mobile: String(formData?.ContactPersonMobile ?? ""),
      SPOC_EmailID: String(formData?.ContactPersonEmail ?? ""),
      SPOC_Designation: String(formData?.ContactPersonDesignation ?? ""),

      Website: String(formData?.Website ?? ""),
      ReferralSource: String(formData?.ReferralSource ?? ""),

      ReferProjectID:
        formData?.ProjectID == "Other" ? "-1" : String(formData?.ProjectID),
      ReferProject:
        getlabel(formData?.ProjectID, project) ||
        String(formData?.OtherProject ?? ""),

      ReferEmployeeID:
        formData?.AssignedTo == "Other" ? "-1" : String(formData?.AssignedTo),
      ReferEmployee:
        getlabel(formData?.AssignedTo, assignto) ||
        String(formData?.OtherEmployee ?? ""),

      SoftwareVersionID:
        formData?.ProductVersion == "Other"
          ? "-1"
          : String(formData?.ProductVersion),

      SoftwareVersionName:
        getlabel(formData?.ProductVersion, productversion) ||
        String(formData?.ProductVersion ?? ""),

      NoOfCentre: Number(formData?.NoOfCentre),
      NoOfMachine: Number(formData?.NoOfMachine),
    };
    axiosInstances
      .post(apiUrls?.UpdateSalesLead, paylode)
      .then((res) => {
        if (res?.data?.status == true) {
          toast.success(res?.data?.message);
          setLoading(false);
          setFormData({
            Centre: "",
            Country: "",
            State: "",
            District: "",
            City: "",
            OrganizationName: "",
            ContactPersonName: "",
            ContactPersonDesignation: "",
            ContactPersonEmail: "",
            ContactPersonMobile: "",
            Website: "",
            ReferralSource: "",
            ProjectID: "",
            AssignedTo: "",
            SoftwareVertical: "",
            OtherProject: "",
            OtherEmployee: "",
          });
          navigate("/SalesLead");
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;

    if (type === "checkbox") {
      const newCheckboxValue = checked ? 1 : 0;

      setFormData((prev) => {
        const updatedData = {
          ...prev,
          [name]: newCheckboxValue,
        };

        if (name === "isDue" && checked) {
          updatedData.OrganizationName = "N/A";
        } else if (name === "isDue" && !checked) {
          updatedData.OrganizationName = "";
        }
        if (name === "isEmail" && checked) {
          updatedData.ContactPersonEmail = "N/A";
        } else if (name === "isEmail" && !checked) {
          updatedData.ContactPersonEmail = "";
        }
        if (name === "isMobile" && checked) {
          updatedData.ContactPersonMobile = "N/A";
        } else if (name === "isMobile" && !checked) {
          updatedData.ContactPersonMobile = "";
        }

        if (name === "isWebsite" && checked) {
          updatedData.Website = "N/A";
        } else if (name === "isWebsite" && !checked) {
          updatedData.Website = "";
        }

        if (name === "isResource" && checked) {
          updatedData.ReferralSource = "N/A";
        } else if (name === "isResource" && !checked) {
          updatedData.ReferralSource = "";
        }
        if (name === "isDesignation" && checked) {
          updatedData.ContactPersonDesignation = "N/A";
        } else if (name === "isDesignation" && !checked) {
          updatedData.ContactPersonDesignation = "";
        }
        return updatedData;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  console.log("formData", formData);
  useEffect(() => {
    getCountry();
    getCity();
    getState();
    getDistrict();
    getProject();
    getProduct();
    getAssignTo();
  }, []);

  return (
    <>
      <div className="card">
        <Heading
          isBreadcrumb={true}
          secondTitle={
            <span style={{ fontWeight: "bold" }}>
              {" "}
              <Link to="/SalesLead" className="ml-3">
                Sales Lead List
              </Link>
            </span>
          }
        />
        <div className="row p-2">
          <div className="col-sm-2 d-flex">
            <Input
              type="text"
              className="form-control"
              id="OrganizationName"
              name="OrganizationName"
              lable="Organization Name"
              placeholder=" "
              onChange={handleSelectChange}
              value={formData?.isDue ? "N/A" : formData?.OrganizationName ?? ""}
              respclass="width190px"
              disabled={formData?.isDue == 1}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "7px",
                marginLeft: "5px",
              }}
            >
              <label className="switch">
                <input
                  type="checkbox"
                  name="isDue"
                  checked={formData?.isDue ? 1 : 0}
                  onChange={handleSelectChange}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="Centre"
            placeholderName="Centre"
            dynamicOptions={[
              { label: "N/A", value: "0" },
              { label: "Upcoming(New)", value: 1 },
              { label: "Existing", value: 2 },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.Centre}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="SoftwareVertical"
            placeholderName="Software Vertical"
            dynamicOptions={[
              { label: "N/A", value: "N/A" },
              { label: "LIMS", value: "LIMS" },
              { label: "HIMS", value: "HIMS" },
              { label: "Both", value: "Both" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.SoftwareVertical}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="Country"
            placeholderName="Country"
            dynamicOptions={country}
            handleChange={handleDeliveryChange}
            value={formData.Country}
          />

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="State"
            placeholderName="State"
            dynamicOptions={states}
            handleChange={handleDeliveryChange}
            value={formData.State}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="District"
            placeholderName="District"
            dynamicOptions={district}
            handleChange={handleDeliveryChange}
            value={formData.District}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-4 col-12 mt-1"
            name="City"
            placeholderName="City"
            dynamicOptions={city}
            handleChange={handleDeliveryChange}
            value={formData.City}
          />
          <Input
            type="text"
            className="form-control mt-1"
            id="ContactPersonName"
            name="ContactPersonName"
            lable="SPOC Name"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.ContactPersonName}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <div className="col-sm-2 d-flex">
            <Input
              type="text"
              className="form-control"
              id="ContactPersonDesignation"
              name="ContactPersonDesignation"
              lable="SPOC Designation"
              placeholder=" "
              onChange={handleSelectChange}
              value={
                formData?.isDesignation
                  ? "N/A"
                  : formData?.ContactPersonDesignation ?? ""
              }
              respclass="width190px mt-1"
              disabled={formData?.isDesignation == 1}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "7px",
                marginLeft: "5px",
              }}
            >
              <label className="switch">
                <input
                  type="checkbox"
                  name="isDesignation"
                  checked={formData?.isDesignation ? 1 : 0}
                  onChange={handleSelectChange}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="col-sm-2 d-flex">
            <Input
              type="text"
              className="form-control mt-1"
              id="ContactPersonMobile"
              name="ContactPersonMobile"
              lable="SPOC Mobile"
              placeholder=" "
              onChange={(e) => {
                inputBoxValidation(
                  MOBILE_NUMBER_VALIDATION_REGX,
                  e,
                  handleSelectChange
                );
              }}
              disabled={formData?.isMobile == 1}
              value={
                formData?.isMobile ? "N/A" : formData?.ContactPersonMobile ?? ""
              }
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "7px",
                marginLeft: "5px",
              }}
            >
              <label className="switch">
                <input
                  type="checkbox"
                  name="isMobile"
                  checked={formData?.isMobile ? 1 : 0}
                  onChange={handleSelectChange}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="col-sm-2 d-flex">
            <Input
              type="text"
              className="form-control mt-1"
              id="ContactPersonEmail"
              name="ContactPersonEmail"
              lable="SPOC Email"
              placeholder=" "
              onChange={handleSelectChange}
              value={
                formData?.isEmail ? "N/A" : formData?.ContactPersonEmail ?? ""
              }
              respclass="width190px"
              disabled={formData?.isEmail == 1}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "7px",
                marginLeft: "5px",
              }}
            >
              <label className="switch">
                <input
                  type="checkbox"
                  name="isEmail"
                  checked={formData?.isEmail ? 1 : 0}
                  onChange={handleSelectChange}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="col-sm-2 d-flex">
            <Input
              type="text"
              className="form-control mt-1"
              id="Website"
              name="Website"
              lable="Website"
              placeholder=" "
              onChange={handleSelectChange}
              value={formData?.isWebsite ? "N/A" : formData?.Website ?? ""}
              respclass="width190px"
              disabled={formData?.isWebsite == 1}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "7px",
                marginLeft: "5px",
              }}
            >
              <label className="switch">
                <input
                  type="checkbox"
                  name="isWebsite"
                  checked={formData?.isWebsite ? 1 : 0}
                  onChange={handleSelectChange}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="col-sm-2 d-flex">
            <Input
              type="text"
              className="form-control mt-1"
              id="ReferralSource"
              name="ReferralSource"
              lable="Referral Source"
              placeholder=" "
              onChange={handleSelectChange}
              value={
                formData?.isResource ? "N/A" : formData?.ReferralSource ?? ""
              }
              respclass="width190px"
              disabled={formData?.isResource == 1}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "7px",
                marginLeft: "5px",
              }}
            >
              <label className="switch">
                <input
                  type="checkbox"
                  name="isResource"
                  checked={formData?.isResource ? 1 : 0}
                  onChange={handleSelectChange}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-4 col-12 mt-1"
            name="ProductVersion"
            placeholderName="Software Version"
            dynamicOptions={[
              ...productversion,
              { label: "Other", value: "Other" },
              { label: "N/A", value: "0" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.ProductVersion}
          />
          {formData?.ProductVersion == "Other" && (
            <Input
              type="text"
              className="form-control mt-1"
              id="OtherVersion"
              name="OtherVersion"
              lable="Other Version"
              placeholder=" "
              onChange={handleSelectChange}
              value={formData?.OtherVersion}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
          )}
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
            name="ProjectID"
            placeholderName="Referal Project"
            dynamicOptions={[
              ...project,
              { label: "Other", value: "Other" },
              { label: "N/A", value: "0" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.ProjectID}
          />

          {formData?.ProjectID == "Other" && (
            <Input
              type="text"
              className="form-control mt-1"
              id="OtherProject"
              name="OtherProject"
              lable="Other Project"
              placeholder=" "
              onChange={handleSelectChange}
              value={formData?.OtherProject}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
          )}
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
            name="AssignedTo"
            placeholderName={t("Refer Employee")}
            dynamicOptions={[
              ...assignto,
              { label: "Other", value: "Other" },
              { label: "N/A", value: "0" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData?.AssignedTo}
          />
          {formData?.AssignedTo == "Other" && (
            <Input
              type="text"
              className="form-control mt-1"
              id="OtherEmployee"
              name="OtherEmployee"
              lable="Other Employee"
              placeholder=" "
              onChange={handleSelectChange}
              value={formData?.OtherEmployee}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
          )}
          <Input
            type="number"
            className="form-control mt-1"
            id="NoOfCentre"
            name="NoOfCentre"
            lable="No. of Centre"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.NoOfCentre}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="number"
            className="form-control mt-1"
            id="NoOfMachine"
            name="NoOfMachine"
            lable="No. of Machine"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.NoOfMachine}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          {/* {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-primary ml-2 mt-1"
              onClick={handleSave}
            >
              Save
            </button>
          )} */}

          {state?.edit ? (
            <>
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-info ml-3 mt-1"
                  onClick={handleUpdate}
                  // disabled={isSubmitting === false}
                >
                  Update
                </button>
              )}
            </>
          ) : (
            <>
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-info ml-3 mt-1"
                  onClick={handleSave}
                  // disabled={isSubmitting === false}
                >
                  Save
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SalesLeadCreate;
