import React, { useEffect, useRef, useState } from "react";
import Heading from "../components/UI/Heading";
import Input from "../components/formComponent/Input";
import DatePicker from "../components/formComponent/DatePicker";
import ReactSelect from "../components/formComponent/ReactSelect";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { headers } from "../utils/apitools";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import axios from "axios";
import {
  AADHARCARD_VALIDATION_REGX,
  DRIVINGLICENSE_VALIDATION_REGX,
  MOBILE_NUMBER_VALIDATION_REGX,
  PANCARD_VALIDATION_REGX,
  PASSPORT_VALIDATION_REGX,
  PINCODE_VALIDATION_REGX,
  VOTER_VALIDATION_REGX,
} from "../utils/constant";
import { inputBoxValidation } from "../utils/utils";
import { toast } from "react-toastify";
import moment from "moment/moment";
import { apiUrls } from "../networkServices/apiEndpoints";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
// import Loading from "../components/loader/Loading";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import { axiosInstances } from "../networkServices/axiosInstance";
import Loading from "../components/loader/Loading";

const EmployeeMaster = () => {
  const [t] = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [subteam, setSubTeam] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [dragActive1, setDragActive1] = useState(false);
  const { state } = location;
  // console.log("sttae", state?.data);
  const fileInputRef = useRef(null);
  const fileInputRef1 = useRef(null);
  const [loading, setLoading] = useState(false);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [errors, setErros] = useState({});
  const [project, setProject] = useState([]);
  const [reporter, setReporter] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accesslevel, setAccessLevel] = useState([]);

  const [formData, setFormData] = useState({
    Name: "",
    DOB: new Date(),
    Mobile: "",
    ContactMobile: "",
    Email: "",
    ContactEmail: "",
    EmployeeEmail: "",
    Username: "",
    Password: "",
    IsActive: "",
    Designation: "",
    OfficeDesignation: "",
    AccessLevel: "",
    Category: "",
    Project: "",
    Manager: "",
    AlternateMobile: "",
    FatherName: "",
    MotherName: "",
    Qualification: "",
    AadharCard: "",
    PanCard: "",
    Address: "",
    CurrentAddress: "",
    PermanentAddress: "",
    Country: "",
    State: "",
    CurrentState: "",
    PermanentState: "",
    City: "",
    CurrentCity: "",
    PermanentCity: "",
    District: "",
    PinCode: "",
    CurrentPinCode: "",
    PermanentPinCode: "",
    Locality: "",
    CurrentLocality: "",
    PermanentLocality: "",
    Relation: "",
    EmergencyMobile: "",
    EmergencyName: "",
    TeamLeaderID: "",
    UpdatePassword: "",
    Title: "Mr",
    Course: "",
    BloodGroup: "",
    GovtID: "Aadhar Card",
    GovtIDNo: "",
    SameAsCurrent: "",
    VerticalID: "",
    TeamID: "",
    WingID: "",
    ReporterTo: "",
    JoiningDate: new Date(),
    NextAppraisalDate: new Date(),
    EmployeeCode: "",
    Grade: "",
    Salary: "",
    SalaryAccountBank: "",
    SalaryAccountNumber: "",
    RegisteredSalesEnquiry: "",
    IsSalesTeamMember: "",
    ApproveLeaveRequest: "",
    MaximumWeekoffs: "",
    WorkingDays: "",
    BiometricEmployeeCode: "",
    EmployeeID: "",
    DocumentType: "",

    SelectFile: "",
    SelectFileSig: "",

    Document_Base64: "",
    FileExtension: "",

    SigDocument_Base64: "",
    FileExtensionSig: "",

    BankName: "",
    AccountNumber: "",
    IFSCCode: "",
    AccountHolderName: "",
    SubTeamID: "",
    IsProfile: "",
    IsSiganture: "",

    EmployeeID: "",
    OldMantisID: "",
  });

  const [rowHandler, setRowHandler] = useState({
    show: false,
    show1: false,
    show2: false,
    show3: true,
    show4: false,
    show5: false,
    ButtonShow: false,
    TextEditorShow: false,
  });
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleDeliveryButton = () => {
    setRowHandler({
      ...rowHandler,
      ButtonShow: !rowHandler?.ButtonShow,
    });
  };
  const handleDeliveryButton1 = () => {
    setRowHandler({
      ...rowHandler,
      TextEditorShow: !rowHandler?.TextEditorShow,
    });
  };

  // Handlers
  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    processFile(file);
  };

  const handleFileChange1 = (e) => {
    const file = e?.target?.files?.[0];
    processFile1(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleDrop1 = (e) => {
    e.preventDefault();
    setDragActive1(false);
    const file = e.dataTransfer.files?.[0];
    processFile1(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragOver1 = (e) => {
    e.preventDefault();
    setDragActive1(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };
  const handleDragLeave1 = () => {
    setDragActive1(false);
  };

  // File processors
  const processFile = (file) => {
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error("File size exceeds 1MB limit");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        const fileExtension = file.name.split(".").pop();

        setFormData((prev) => ({
          ...prev,
          SelectFile: file,
          Document_Base64: base64String,
          FileExtension: fileExtension,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const processFile1 = (file) => {
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error("File size exceeds 1MB limit");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        const fileExtension = file.name.split(".").pop();

        setFormData((prev) => ({
          ...prev,
          SelectFileSig: file,
          SigDocument_Base64: base64String,
          FileExtensionSig: fileExtension,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [getstate, setGetState] = useState([]);
  const getState = (value) => {
    axiosInstances
      .post(apiUrls.GetState, {
        CountryID: String("14"),
      })
      .then((res) => {
        const states = res?.data.data.map((item) => {
          return { label: item?.StateName, value: item?.StateID };
        });
        setGetState(states);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getVertical = () => {
    axiosInstances
      .post(apiUrls?.Vertical_Select, {})
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

  const getTeam = () => {
    axiosInstances
      .post(apiUrls?.Old_Mantis_Team_Select, {})
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

  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevState) => {
      let updatedData = {
        ...prevState,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      };

      if (name === "SameAsCurrent" && e.target.checked) {
        updatedData = {
          ...updatedData,
          PermanentAddress: prevState.CurrentAddress,
          PermanentLocality: prevState.CurrentLocality,
          PermanentCity: prevState.CurrentCity,
          PermanentState: prevState.CurrentState,
          PermanentPinCode: prevState.CurrentPinCode,
        };
        // setRowHandler({ ...rowHandler, show2: true });
      } else if (name === "SameAsCurrent" && !e.target.checked) {
        updatedData = {
          ...updatedData,
          PermanentAddress: "",
          PermanentLocality: "",
          PermanentCity: "",
          PermanentState: "",
          PermanentPinCode: "",
        };
        // setRowHandler({ ...rowHandler, show2: false });
      }

      return updatedData;
    });
  };

  useEffect(() => {
    // Check if state is an object and has the data property
    if (state?.edit) {
      fetchDatabyId(state?.data);
    }
  }, [category]);

  const fetchDatabyId = (id) => {
    axiosInstances
      .post(apiUrls?.SearchEmployee_EmployeeID, {
        EmployeeId: Number(id),
      })
      .then((res) => {
        const datas = res?.data?.data?.Employee[0];
        setFormData({
          ...formData,
          Name: datas?.realname,
          DOB: new Date(datas?.DOB),
          Mobile: "",
          ContactMobile: datas?.MobileNo,
          Email: "",
          OldMantisID: datas?.OldMantisID,
          ContactEmail: datas?.email,
          EmployeeEmail: datas?.companyemail,
          Username: datas?.username,
          Password: datas?.Password,
          IsActive: datas?.enabled,
          Designation: "",
          OfficeDesignation: datas?.DesignationID,
          AccessLevel: datas?.access_level,
          Manager: datas?.TeamLeaderID,
          AlternateMobile: datas?.AlternateMobileNo,
          FatherName: datas?.FatherName,
          MotherName: datas?.MotherName,
          Qualification: datas?.Qualification,
          AadharCard: "",
          PanCard: "",
          Address: "",
          CurrentAddress: datas?.Address,
          PermanentAddress: datas?.Paddress,
          Country: "",
          State: "",
          CurrentState: datas?.StateID,
          PermanentState: datas?.PStateID,
          City: "",
          CurrentCity: datas?.City,
          PermanentCity: datas?.PCity,
          District: "",
          PinCode: "",
          CurrentPinCode: datas?.PinCode,
          PermanentPinCode: datas?.PPincode,
          Locality: datas?.Locality,
          CurrentLocality: datas?.Locality,
          PermanentLocality: datas?.PLocality,
          Relation: datas?.Relation,
          EmergencyMobile: datas?.EmergencyContactNo,
          EmergencyName: datas?.EmergencyContactPerson,
          TeamLeaderID: datas?.TeamLeaderID,
          UpdatePassword: datas?.UpdatePassword,
          Title: datas?.Title,
          BloodGroup: datas?.BloodGroup,
          GovtID: datas?.govtIdentityType,
          GovtIDNo: datas?.govtIdentityNo,
          SameAsCurrent: "",
          VerticalID: "",
          TeamID: datas?.TeamID,
          WingID: "",
          ReporterTo: datas?.TeamLeaderID,
          JoiningDate: new Date(datas?.DOJ),
          NextAppraisalDate: new Date(datas?.appriasaldate),
          EmployeeCode: datas?.EmployeeCode,
          Grade: datas?.grade,
          Salary: "",
          SalaryAccountBank: "",
          SalaryAccountNumber: "",
          RegisteredSalesEnquiry: "",
          IsSalesTeamMember: "",
          ApproveLeaveRequest: "",
          MaximumWeekoffs: datas?.MaxWeekOffs,
          WorkingDays: "",
          BiometricEmployeeCode: "",
          EmployeeID: "",
          DocumentType: "",
          Course: datas?.Coursename,
          SelectFile: "",
          SelectFileSig: "",

          Document_Base64: "",
          FileExtension: "",

          SigDocument_Base64: "",
          FileExtensionSig: "",

          BankName: datas?.BankName,
          AccountNumber: datas?.AccountNumber,
          IFSCCode: datas?.IFSCCode,
          AccountHolderName: datas?.AccountHolderName,
          SubTeamID: Number(datas?.subteam),
          IsProfile: datas?.ProfileImage,
          IsSiganture: datas?.SignatureURL,
          EmployeeID: "",
        }),
          getSubTeam(datas?.teamname);

        setRowHandler({
          ...rowHandler,
          show: true,
          show1: true,
          show2: true,
          show3: true,
          show4: true,
          show5: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlerow = (row) => {
    let obj;
    if (!rowHandler[row]) {
      obj = { ...rowHandler, [row]: true };
    } else {
      obj = { ...rowHandler, [row]: false };
    }
    setRowHandler(obj);
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name == "TeamID") {
      setFormData({
        ...formData,
        [name]: value,
      });
      getSubTeam(e);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  function getlabel(id, dropdownData) {
    const ele = dropdownData?.filter((item) => item?.value === id);
    return ele?.length > 0 ? ele[0].label : undefined;
  }

  const handleSave = () => {
    setRowHandler({
      ...rowHandler,
      show: true,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true,
    });
    const ImageJson = JSON.stringify([
      {
        Document_Base64: formData?.Document_Base64,
        FileExtension: formData?.FileExtension,
      },
    ]);

    const SignatureJson = JSON.stringify([
      {
        Document_Base64: formData?.SigDocument_Base64,
        FileExtension: formData?.FileExtensionSig,
      },
    ]);

    if (!formData?.Username) {
      toast.error("Please Enter Username.");
    } else if (!formData?.Name) {
      toast.error("Please Enter Name.");
    } else if (!formData?.FatherName) {
      toast.error("Please Enter FatherName.");
    } else if (!formData?.MotherName) {
      toast.error("Please Enter Mother/Spouse Name.");
    } else if (!formData?.Qualification) {
      toast.error("Please Select Qualification.");
    } else if (!formData?.ContactMobile) {
      toast.error("Please Enter Mobile.");
    } else if (!formData?.ContactEmail) {
      toast.error("Please Enter Email.");
    } else if (!formData?.CurrentAddress) {
      toast.error("Please Enter Address.");
    } else if (!formData?.CurrentCity) {
      toast.error("Please Enter City.");
    } else if (!formData?.CurrentPinCode) {
      toast.error("Please Enter PinCode.");
    } else if (!formData?.AccessLevel) {
      toast.error("Please Select AccessLevel.");
    } else if (!formData?.AlternateMobile) {
      toast.error("Please Enter AlternateMobile.");
    } else if (!formData?.EmergencyMobile) {
      toast.error("Please Select Emergency Mobile.");
    } else if (!formData?.EmergencyName) {
      toast.error("Please Select Emergency Contact Person.");
    } else if (!formData?.Relation) {
      toast.error("Please Select Relation.");
    } else if (!formData?.CurrentState) {
      toast.error("Please Select State.");
    } else if (!formData?.PermanentState) {
      toast.error("Please Select Permanent State.");
    } else if (!formData?.PermanentPinCode) {
      toast.error("Please Select Permanent PinCode.");
    } else if (!formData?.OfficeDesignation) {
      toast.error("Please Select Designation.");
    } else if (!formData?.ReporterTo) {
      toast.error("Please Select Reporting Manager.");
    } else if (!formData?.EmployeeEmail) {
      toast.error("Please Enter EmployeeEmail.");
    } else if (!formData?.MaximumWeekoffs) {
      toast.error("Please Select MaximumWeekoffs.");
    } else {
      setLoading(true);

      axiosInstances
        .post(apiUrls.CreateEmployee, {
          UserName: String(formData?.Username),
          RealName: String(formData?.Name),
          Email: String(formData?.ContactEmail),
          Password: String(formData?.Password),
          AccessLevel: String(formData?.AccessLevel),
          MobileNo: String(formData?.ContactMobile),
          DOB: String(moment(formData?.DOB).format("YYYY-MM-DD")),
          DesignationID: String(formData?.OfficeDesignation),
          DesignationName: String(
            getlabel(formData?.OfficeDesignation, designation)
          ),
          DOJ: String(moment(formData?.JoiningDate).format("YYYY-MM-DD")),
          TeamLeaderID: String(formData?.ReporterTo),
          FatherName: String(formData?.FatherName),
          MotherName: String(formData?.MotherName),
          Qualification: String(formData?.Qualification),
          AlternateMobileNo: String(formData?.AlternateMobile),
          Address: String(formData?.CurrentAddress),
          PinCode: String(formData?.CurrentPinCode),
          Country: String("14"),
          State: String(formData?.CurrentState),
          District: String(""),
          City: String(formData?.CurrentCity),
          EmergencyContactNo: String(formData?.EmergencyMobile),
          EmergencyContactPerson: String(formData?.EmergencyName),
          Relation: String(formData?.Relation),
          TeamName: String(getlabel(formData?.TeamID, team)),
          TeamID: String(formData?.TeamID),
          BankName: String(formData?.BankName),
          AccountNumber: String(formData?.AccountNumber),
          AccountHolderName: String(formData?.AccountHolderName),
          IFSCCode: String(formData?.IFSCCode),
          Title: String(formData?.Title),
          EmployeeCode: String(formData?.EmployeeCode),
          Locality: String(formData?.CurrentLocality),
          PLocality: String(formData?.PermanentLocality),
          PPincode: String(formData?.PermanentPinCode),
          Coursename: String(formData?.Course),
          BloodGroup: String(formData?.BloodGroup),
          appriasaldate: String(
            moment(formData?.NextAppraisalDate).format("YYYY-MM-DD")
          ),
          companyemail: String(formData?.EmployeeEmail),
          govtIdentityType: String(formData?.GovtID),
          govtIdentityNo: String(formData?.GovtIDNo),
          PStateID: String(formData?.PermanentState),
          PCity: String(formData?.PermanentCity),
          grade: String(formData?.Grade),
          Paddress: String(formData?.PermanentAddress),
          subteam: String(formData?.SubTeamID),
          MaxWeekOffs: String(formData?.MaximumWeekoffs),
          WorkStation: String(""),
          Wing: String(""),
          EmployeeCodeSmartoffice: String(""),
          ProfileDetail: [
            {
              Document_Base64: String(formData?.Document_Base64),
              FileExtension: String(formData?.FileExtension),
            },
          ],
          SignatureDetails: [
            {
              Document_Base64: String(formData?.SigDocument_Base64),
              FileExtension: String(formData?.FileExtensionSig),
            },
          ],
        })
        .then((res) => {
          if (res?.data?.status === true) {
            toast.success(res?.data?.message);
            setLoading(false);
            navigate("/SearchEmployeeMaster");
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

  const getReporter = () => {
    axiosInstances
      .post(apiUrls?.Reporter_Select_Employee, {
        CrmID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        IsMaster: 0,
        RoleID: 0,
        OnlyItdose: 0,
      })
      .then((res) => {
        const datas = res?.data?.data;
        const reporters = datas?.map((item) => {
          return { label: item?.Name, value: item?.CrmID };
        });
        setReporter(reporters);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getDesignation = () => {
    axiosInstances
      .post(apiUrls?.ViewDesignation, {})
      .then((res) => {
        const reporters = res?.data.data.map((item) => {
          return { label: item?.DesignationName, value: item?.ID };
        });
        setDesignation(reporters);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getSubTeam = (item) => {
    axiosInstances
      .post(apiUrls?.Old_Mantis_Sub_Team_Select, {
        TeamName: String(item?.label || item),
      })
      .then((res) => {
        const teams = res?.data?.data?.map((item) => {
          return { label: item?.SubTeam, value: item?.ID };
        });
        setSubTeam(teams);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {})
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

  const getCategory = (proj) => {
    axiosInstances
      .post(apiUrls.Category_Select, {
        ProjectID: Number(proj),
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
      })
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

  const getAccessLevel = () => {
    axiosInstances
      .post(apiUrls.Accesslevel, {})
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setAccessLevel(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = () => {
    const ImageJson = JSON.stringify([
      {
        Document_Base64: formData?.Document_Base64,
        FileExtension: formData?.FileExtension,
      },
    ]);

    const SignatureJson = JSON.stringify([
      {
        Document_Base64: formData?.SigDocument_Base64,
        FileExtension: formData?.FileExtensionSig,
      },
    ]);

    if (!formData?.Username) {
      toast.error("Please Enter Username.");
    } else if (!formData?.Name) {
      toast.error("Please Enter Name.");
    } else if (!formData?.FatherName) {
      toast.error("Please Enter FatherName.");
    } else if (!formData?.MotherName) {
      toast.error("Please Enter Mother/Spouse Name.");
    } else if (!formData?.Qualification) {
      toast.error("Please Select Qualification.");
    } else if (!formData?.ContactMobile) {
      toast.error("Please Enter Mobile.");
    } else if (!formData?.ContactEmail) {
      toast.error("Please Enter Email.");
    } else if (!formData?.CurrentAddress) {
      toast.error("Please Enter Address.");
    } else if (!formData?.CurrentCity) {
      toast.error("Please Enter City.");
    } else if (!formData?.CurrentPinCode) {
      toast.error("Please Enter PinCode.");
    } else if (!formData?.AccessLevel) {
      toast.error("Please Select AccessLevel.");
    } else if (!formData?.AlternateMobile) {
      toast.error("Please Enter AlternateMobile.");
    } else if (!formData?.EmergencyMobile) {
      toast.error("Please Select Emergency Mobile.");
    } else if (!formData?.EmergencyName) {
      toast.error("Please Select Emergency Contact Person.");
    } else if (!formData?.Relation) {
      toast.error("Please Select Relation.");
    } else if (!formData?.CurrentState) {
      toast.error("Please Select State.");
    } else if (!formData?.PermanentState) {
      toast.error("Please Select Permanent State.");
    } else if (!formData?.PermanentPinCode) {
      toast.error("Please Select Permanent PinCode.");
    } else if (!formData?.OfficeDesignation) {
      toast.error("Please Select Designation.");
    } else if (!formData?.ReporterTo) {
      toast.error("Please Select Reporting Manager.");
    } else if (!formData?.EmployeeEmail) {
      toast.error("Please Enter EmployeeEmail.");
    } else if (!formData?.MaximumWeekoffs) {
      toast.error("Please Select MaximumWeekoffs.");
    } else {
      setLoading(true);

      axiosInstances
        .post(apiUrls.UpdateEmployee, {
          ID: String(useCryptoLocalStorage("user_Data", "get", "ID")),
          LoginName: String(
            useCryptoLocalStorage("user_Data", "get", "realname")
          ),
          EmployeeID: String(state?.data),
          OldMantisEmpID: String(formData?.OldMantisID),
          UserName: String(formData?.Username),
          RealName: String(formData?.Name),
          Email: String(formData?.ContactEmail),
          Enabled: String(formData?.IsActive || "0"),
          Password: String(formData?.Password),
          Access_level: String(formData?.AccessLevel),
          MobileNo: String(formData?.ContactMobile),
          DOB: String(moment(formData?.DOB).format("YYYY-MM-DD")),
          DesignationID: String(formData?.OfficeDesignation),
          DesignationName: String(
            getlabel(formData?.OfficeDesignation, designation)
          ),
          DOJ: String(moment(formData?.JoiningDate).format("YYYY-MM-DD")),
          TeamLeaderID: String(formData?.ReporterTo),
          UpdatePasswordKey: String(formData?.UpdatePassword),
          FatherName: String(formData?.FatherName),
          MotherName: String(formData?.MotherName),
          Qualification: String(formData?.Qualification),
          AlternateMobileNo: String(formData?.AlternateMobile),
          Address: String(formData?.CurrentAddress),
          PinCode: String(formData?.CurrentPinCode),
          Country: String("14"),
          State: String(formData?.CurrentState),
          District: String(""),
          City: String(formData?.CurrentCity),
          EmergencyContactNo: String(formData?.EmergencyMobile),
          EmergencyContactPerson: String(formData?.EmergencyName),
          Relation: String(formData?.Relation),
          TeamName: String(getlabel(formData?.TeamID, team)),
          TeamID: String(formData?.TeamID),
          BankName: String(formData?.BankName),
          AccountNumber: String(formData?.AccountNumber),
          AccountHolderName: String(formData?.AccountHolderName),
          IFSCCode: String(formData?.IFSCCode),
          Title: String(formData?.Title),
          EmployeeCode: String(formData?.EmployeeCode),
          Locality: String(formData?.CurrentLocality),
          PLocality: String(formData?.PermanentLocality),
          PPincode: String(formData?.PermanentPinCode),
          Coursename: String(formData?.Course),
          BloodGroup: String(formData?.BloodGroup),
          appriasaldate: String(
            moment(formData?.NextAppraisalDate).format("YYYY-MM-DD")
          ),
          companyemail: String(formData?.EmployeeEmail),
          EmployeeEmail: String(formData?.EmployeeEmail),
          govtIdentityType: String(formData?.GovtID),
          govtIdentityNo: String(formData?.GovtIDNo),
          PStateID: String(formData?.PermanentState),
          PCity: String(formData?.PermanentCity),
          grade: String(formData?.Grade),
          Paddress: String(formData?.PermanentAddress),
          subteam: String(formData?.SubTeamID),
          MaxWeekOffs: String(formData?.MaximumWeekoffs),
          WorkStation: String(""),
          Wing: String(""),
          EmployeeCodeSmartoffice: String(""),
          ProfileDetail: [
            {
              Document_Base64: String(formData?.Document_Base64),
              FileExtension: String(formData?.FileExtension),
            },
          ],
          SignatureDetails: [
            {
              Document_Base64: String(formData?.SigDocument_Base64),
              FileExtension: String(formData?.FileExtensionSig),
            },
          ],
        })
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setLoading(false);
            navigate("/SearchEmployeeMaster");
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
    getProject();
    getAccessLevel();
    getReporter();
    getDesignation();
    getVertical();
    getTeam();
    getState();
  }, []);
  return (
    <>
      <div className="card">
        <Heading
          title="Personal Details"
          isBreadcrumb={true}
          secondTitle={
            <>
              <span style={{ fontWeight: "bold" }}>
                <Link to="/SearchEmployeeMaster" className="ml-4">
                  {"Back to List"}
                </Link>
              </span>
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
                  background: "none",
                  marginLeft: "30px",
                }}
              ></button>
            </>
          }
        />

        {rowHandler.show3 && (
          <>
            <div className="row p-2">
              <ReactSelect
                name="Title"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                defaultValue={formData?.Title}
                placeholderName="Title"
                dynamicOptions={[
                  { label: "Select", value: "0" },
                  { label: "Mr.", value: "Mr" },
                  { label: "Mrs.", value: "Mrs" },
                  { label: "Miss.", value: "Miss" },
                  { label: "Ms.", value: "Ms" },
                  { label: "Dr.", value: "Dr" },
                ]}
                value={formData?.Title}
                handleChange={handleDeliveryChange}
              />
              <Input
                type="text"
                className="form-control"
                id="Name"
                name="Name"
                lable="Name"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.Name}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control"
                id="FatherName"
                name="FatherName"
                lable="Father Name"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.FatherName}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control"
                id="MotherName"
                name="MotherName"
                lable="Mother/Spouse Name"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.MotherName}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />

              <ReactSelect
                name="Qualification"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                defaultValue={formData?.Qualification}
                placeholderName="Qualification"
                dynamicOptions={[
                  {
                    label: "Select",
                    value: "0",
                  },
                  {
                    label: "Bachelor's Degree",
                    value: "Bachelor's Degree",
                  },
                  {
                    label: "Master's Degree",
                    value: "Master's Degree",
                  },
                  {
                    label: "Doctorate or Higher",
                    value: "Doctorate or Higher",
                  },
                ]}
                value={formData?.Qualification}
                handleChange={handleDeliveryChange}
                requiredClassName="required-fields"
              />
              <Input
                type="text"
                className="form-control"
                id="Course"
                name="Course"
                lable="Course"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.Course}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control mt-1"
                id="BloodGroup"
                name="BloodGroup"
                lable="BloodGroup"
                placeholder=""
                onChange={handleSelectChange}
                value={formData?.BloodGroup}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <ReactSelect
                name="GovtID"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
                defaultValue={formData?.GovtID}
                placeholderName="GovtID"
                dynamicOptions={[
                  {
                    label: "Select",
                    value: "",
                  },
                  {
                    label: "Aadhar Card",
                    value: "Aadhar Card",
                  },
                  {
                    label: "Pan Card",
                    value: "Pan Card",
                  },
                  {
                    label: "Driving License",
                    value: "Driving License",
                  },
                  {
                    label: "VoterID Card",
                    value: "VoterID Card",
                  },
                  {
                    label: "Passport",
                    value: "Passport",
                  },
                ]}
                value={formData?.GovtID}
                handleChange={handleDeliveryChange}
              />
              <Input
                type="text"
                className="form-control mt-1"
                id="GovtIDNo"
                name="GovtIDNo"
                lable="GovtID Number"
                placeholder=""
                onChange={handleSelectChange}
                value={formData?.GovtIDNo}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              {/* {formData?.GovtID == "Aadhar Card" && (
                <Input
                  type="text"
                  className="form-control mt-1"
                  id="GovtIDNo"
                  name="GovtIDNo"
                  lable="Aadhar Card"
                  placeholder=""
                  onChange={(e) => {
                    inputBoxValidation(
                      AADHARCARD_VALIDATION_REGX,
                      e,
                      handleSelectChange
                    );
                  }}
                  value={formData?.GovtIDNo}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                />
              )}
              {formData?.GovtID == "Pan Card" && (
                <Input
                  type="text"
                  className="form-control mt-1"
                  id="GovtIDNo"
                  name="GovtIDNo"
                  lable="Pan Card"
                  placeholder=""
                  onChange={(e) => {
                    inputBoxValidation(
                      PANCARD_VALIDATION_REGX,
                      e,
                      handleSelectChange
                    );
                  }}
                  value={formData?.GovtIDNo}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                />
              )}
              {formData?.GovtID == "Driving License" && (
                <Input
                  type="text"
                  className="form-control mt-1"
                  id="GovtIDNo"
                  name="GovtIDNo"
                  lable="Driving License"
                  placeholder=""
                  onChange={(e) => {
                    inputBoxValidation(
                      DRIVINGLICENSE_VALIDATION_REGX,
                      e,
                      handleSelectChange
                    );
                  }}
                  value={formData?.GovtIDNo}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                />
              )}
              {formData?.GovtID == "VoterID Card" && (
                <Input
                  type="text"
                  className="form-control mt-1"
                  id="GovtIDNo"
                  name="GovtIDNo"
                  lable="VoterID Card"
                  placeholder=""
                  onChange={(e) => {
                    inputBoxValidation(
                      VOTER_VALIDATION_REGX,
                      e,
                      handleSelectChange
                    );
                  }}
                  value={formData?.GovtIDNo}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                />
              )}
              {formData?.GovtID == "Passport" && (
                <Input
                  type="text"
                  className="form-control mt-1"
                  id="GovtIDNo"
                  name="GovtIDNo"
                  lable="Passport"
                  placeholder=""
                  onChange={(e) => {
                    inputBoxValidation(
                      PASSPORT_VALIDATION_REGX,
                      e,
                      handleSelectChange
                    );
                  }}
                  value={formData?.GovtIDNo}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                />
              )} */}
              <DatePicker
                className="custom-calendar"
                id="DOB"
                name="DOB"
                placeholder={VITE_DATE_FORMAT}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12 mt-1"
                value={formData?.DOB}
                lable="DOB"
                handleChange={handleSelectChange}
              />

              <Input
                type="text"
                className="form-control mt-1"
                id="Username"
                name="Username"
                lable="Username"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.Username}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />

              <div className="col-sm-2 d-flex ">
                <div className="maindiv">
                  <form>
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="form-control mt-1"
                      id="Password"
                      name="Password"
                      lable={t("Password")}
                      placeholder=""
                      value={formData?.Password}
                      onChange={handleSelectChange}
                      autoComplete="off"
                    />
                  </form>
                </div>
                <div
                  className="icondiv"
                  onClick={togglePasswordVisibility}
                  style={{
                    cursor: "pointer",
                    color: "black",
                    marginLeft: "3px",
                    marginTop: "3px",
                  }}
                >
                  <i
                    className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  />
                </div>
              </div>
              <ReactSelect
                name="AccessLevel"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
                placeholderName="Access Level"
                dynamicOptions={accesslevel}
                value={formData?.AccessLevel}
                handleChange={handleDeliveryChange}
              />

              <div className="ml-3 mr-2 mt-1" style={{ display: "flex" }}>
                <div style={{ width: "100%", marginRight: "3px" }}>
                  {!formData?.IsProfile ? (
                    <Button
                      className="btn btn-sm btn-success"
                      onClick={handleDeliveryButton}
                      title="Click to Upload File."
                    >
                      {t("Select Profile Image")}
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="btn btn-sm btn-success"
                        style={{ background: "green", color: "white" }}
                        onClick={handleDeliveryButton}
                        title="Click to Upload File."
                      >
                        {t("Select Profile Image")}
                      </Button>
                      <>
                        {formData?.IsProfile && (
                          <i
                            className="fa fa-eye"
                            style={{
                              marginLeft: "5px",
                              cursor: "pointer",
                              color: "white",
                              border: "1px solid grey",
                              padding: "4px",
                              background: "green",
                              borderRadius: "3px",
                            }}
                            onClick={() => {
                              setSelectedImageUrl(formData?.IsProfile);
                              setIsModalOpen(true);
                            }}
                            title="Click to View Profole Image."
                          ></i>
                        )}

                        {/* Modal */}
                        {isModalOpen && selectedImageUrl && (
                          <div
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              width: "100vw",
                              height: "100vh",
                              backgroundColor: "rgba(0,0,0,0.6)",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              zIndex: 1000,
                              overflowY: "auto",
                            }}
                          >
                            <div
                              style={{
                                background: "white",
                                width: "500px",
                                height: "auto",
                                position: "relative",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "2px solid grey",
                                maxHeight: "90vh",
                                overflow: "auto",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              {/* Close button */}
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedImageUrl(null);
                                  }}
                                  style={{
                                    padding: "5px 10px",
                                    backgroundColor: "#dc3545",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    marginBottom: "10px",
                                  }}
                                >
                                  X
                                </button>
                              </div>

                              <img
                                src={selectedImageUrl}
                                alt="Document"
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  borderRadius: "5px",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    </>
                  )}
                </div>
              </div>

              {rowHandler?.ButtonShow && (
                <div
                  className={`col-sm-3 dropzone ${dragActive ? "drag-active" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: "2px dashed #ccc",
                    borderRadius: "8px",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: dragActive ? "#e6f7ff" : "#fff",
                  }}
                >
                  <p>Drag & Drop your file here or click below to select</p>
                  <input
                    type="file"
                    id="SelectFile"
                    name="SelectFile"
                    accept=".png,.jpg,.jpeg"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    style={{ color: "white" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse File
                  </button>
                  {formData?.SelectFile?.name && (
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        color: "black",
                      }}
                    >
                      Selected: <strong>{formData?.SelectFile?.name}</strong>
                    </p>
                  )}
                </div>
              )}

              <div className="ml-3 mr-2 mt-1" style={{ display: "flex" }}>
                <div style={{ width: "100%", marginRight: "3px" }}>
                  {!formData?.IsSiganture ? (
                    <Button
                      className="btn btn-sm btn-success"
                      onClick={handleDeliveryButton1}
                      title="Click to Upload File."
                    >
                      {t("Select Signature")}
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="btn btn-sm btn-success"
                        style={{ background: "green", color: "white" }}
                        onClick={handleDeliveryButton1}
                        title="Click to Upload File."
                      >
                        {t("Select Signature")}
                      </Button>
                      <>
                        {formData?.IsSiganture && (
                          <i
                            className="fa fa-eye "
                            style={{
                              marginLeft: "5px",
                              cursor: "pointer",
                              color: "white",
                              border: "1px solid grey",
                              padding: "4px",
                              padding: "4px",
                              padding: "4px",
                              background: "green",
                              borderRadius: "3px",
                            }}
                            onClick={() => {
                              setSelectedImageUrl(formData?.IsSiganture);
                              setIsModalOpen(true);
                            }}
                            title="Click to View Sgnature"
                          ></i>
                        )}

                        {/* Modal */}
                        {isModalOpen && selectedImageUrl && (
                          <div
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              width: "100vw",
                              height: "100vh",
                              backgroundColor: "rgba(0,0,0,0.6)",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              zIndex: 1000,
                              overflowY: "auto",
                            }}
                          >
                            <div
                              style={{
                                background: "white",
                                width: "500px",
                                height: "auto",
                                position: "relative",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "2px solid grey",
                                maxHeight: "90vh",
                                overflow: "auto",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              {/* Close button */}
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedImageUrl(null);
                                  }}
                                  style={{
                                    padding: "5px 10px",
                                    backgroundColor: "#dc3545",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    marginBottom: "10px",
                                  }}
                                >
                                  X
                                </button>
                              </div>

                              <img
                                src={selectedImageUrl}
                                alt="Document"
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  borderRadius: "5px",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    </>
                  )}
                </div>
              </div>

              {rowHandler?.TextEditorShow && (
                <div
                  className={`col-sm-3 dropzone ${dragActive1 ? "drag-active" : ""}`}
                  onDragOver={handleDragOver1}
                  onDragLeave={handleDragLeave1}
                  onDrop={handleDrop1}
                  style={{
                    border: "2px dashed #ccc",
                    borderRadius: "8px",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: dragActive1 ? "#e6f7ff" : "#fff",
                  }}
                >
                  <p>Drag & Drop your file here or click below to select</p>
                  <input
                    type="file"
                    id="SelectFileSig"
                    name="SelectFileSig"
                    accept=".png,.jpg,.jpeg"
                    ref={fileInputRef1}
                    onChange={handleFileChange1}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    style={{ color: "white" }}
                    onClick={() => fileInputRef1.current?.click()}
                  >
                    Browse File
                  </button>
                  {formData?.SelectFileSig?.name && (
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        color: "black",
                      }}
                    >
                      Selected: <strong>{formData?.SelectFileSig?.name}</strong>
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <div className="card ViewIssues border mt-2">
        <Heading
          title="Contact Details"
          secondTitle={
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
                background: "none",
                marginLeft: "30px",
              }}
            ></button>
          }
        />

        {rowHandler.show && (
          <>
            <div className="row g-4 m-2">
              <Input
                type="text"
                className="form-control"
                id="ContactEmail"
                name="ContactEmail"
                lable="Email"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.ContactEmail}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                error={errors?.ContactEmail ? errors?.ContactEmail : ""}
              />
              <Input
                type="number"
                className="form-control"
                id="ContactMobile"
                name="ContactMobile"
                lable="Mobile"
                placeholder=" "
                onChange={(e) => {
                  inputBoxValidation(
                    MOBILE_NUMBER_VALIDATION_REGX,
                    e,
                    handleSelectChange
                  );
                }}
                value={formData?.ContactMobile}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                error={errors?.ContactMobile ? errors?.ContactMobile : ""}
              />
              <Input
                type="number"
                className="form-control"
                id="AlternateMobile"
                name="AlternateMobile"
                lable="AlternateMobile"
                placeholder=" "
                onChange={(e) => {
                  inputBoxValidation(
                    MOBILE_NUMBER_VALIDATION_REGX,
                    e,
                    handleSelectChange
                  );
                }}
                value={formData?.AlternateMobile}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                error={errors?.AlternateMobile ? errors?.AlternateMobile : ""}
              />
              <Input
                type="number"
                className="form-control"
                id="EmergencyMobile"
                name="EmergencyMobile"
                lable="EmergencyMobile"
                placeholder=" "
                onChange={(e) => {
                  inputBoxValidation(
                    MOBILE_NUMBER_VALIDATION_REGX,
                    e,
                    handleSelectChange
                  );
                }}
                value={formData?.EmergencyMobile}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control"
                id="EmergencyName"
                name="EmergencyName"
                lable="Emergency Contact Person"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.EmergencyName}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />

              <ReactSelect
                name="Relation"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                placeholderName="Relation"
                dynamicOptions={[
                  { label: "Father", value: "Father" },
                  { label: "Mother", value: "Mother" },
                ]}
                value={formData?.Relation}
                handleChange={handleDeliveryChange}
              />
            </div>
          </>
        )}
      </div>
      <div className="card ViewIssues border mt-2">
        <Heading
          title="Current Address Details"
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
            <div className="row g-4 m-2">
              <textarea
                type="text"
                className="form-control textArea"
                id="CurrentAddress"
                name="CurrentAddress"
                lable="Address"
                placeholder="Address"
                style={{ width: "16%", marginLeft: "7.5px" }}
                onChange={handleSelectChange}
                value={formData?.CurrentAddress}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control"
                id="CurrentLocality"
                name="CurrentLocality"
                lable="Locality"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.CurrentLocality}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />

              <ReactSelect
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                name="CurrentState"
                placeholderName="State"
                dynamicOptions={getstate}
                handleChange={handleDeliveryChange}
                value={formData.CurrentState}
              />
              <Input
                type="text"
                className="form-control"
                id="CurrentCity"
                name="CurrentCity"
                lable="City"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.CurrentCity}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <Input
                type="number"
                className="form-control"
                id="CurrentPinCode"
                name="CurrentPinCode"
                lable="Pin Code"
                placeholder=" "
                max={6}
                onChange={(e) => {
                  inputBoxValidation(
                    PINCODE_VALIDATION_REGX,
                    e,
                    handleSelectChange
                  );
                }}
                value={formData?.CurrentPinCode}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                error={errors?.CurrentPinCode ? errors?.CurrentPinCode : ""}
              />
            </div>
          </>
        )}
      </div>
      <div className="card ViewIssues border mt-2">
        <Heading
          title={
            <div className="d-flex">
              <span>Permanent Address Details</span>
              <div
                className="search-col"
                style={{ marginLeft: "auto", marginLeft: "30px" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label className="switch" style={{ marginTop: "1px" }}>
                    <input
                      type="checkbox"
                      name="SameAsCurrent"
                      checked={formData?.SameAsCurrent == "1" ? true : false}
                      onChange={handleSelectChange}
                    />
                    <span className="slider"></span>
                  </label>
                  <span
                    style={{
                      marginLeft: "3px",
                      marginRight: "5px",
                      fontSize: "12px",
                      marginBottom: "2px",
                    }}
                  >
                    Same as Current Address
                  </span>
                </div>
              </div>
            </div>
          }
          secondTitle={
            <div className="d-flex">
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
            </div>
          }
        />

        {rowHandler.show2 && (
          <>
            <div className="row g-4 m-2">
              <textarea
                type="text"
                className="form-control textArea"
                id="PermanentAddress"
                name="PermanentAddress"
                lable="Address"
                placeholder="Address"
                style={{ width: "16%", marginLeft: "7.5px" }}
                onChange={handleSelectChange}
                value={formData?.PermanentAddress}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                disabled={formData?.SameAsCurrent == "1"}
                error={errors?.PermanentAddress ? errors?.PermanentAddress : ""}
              />
              <Input
                type="text"
                className="form-control"
                id="PermanentLocality"
                name="PermanentLocality"
                lable="Locality"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.PermanentLocality}
                disabled={formData?.SameAsCurrent == "1"}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />

              <ReactSelect
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                name="PermanentState"
                placeholderName="State"
                dynamicOptions={getstate}
                handleChange={handleDeliveryChange}
                value={formData.PermanentState}
              />
              <Input
                type="text"
                className="form-control"
                id="PermanentCity"
                name="PermanentCity"
                lable="City"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.PermanentCity}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <Input
                type="number"
                className="form-control"
                id="PermanentPinCode"
                name="PermanentPinCode"
                lable="Pin Code"
                placeholder=" "
                disabled={formData?.SameAsCurrent == "1"}
                max={6}
                onChange={(e) => {
                  inputBoxValidation(
                    PINCODE_VALIDATION_REGX,
                    e,
                    handleSelectChange
                  );
                }}
                value={formData?.PermanentPinCode}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                error={errors?.PermanentPinCode ? errors?.PermanentPinCode : ""}
              />
            </div>
          </>
        )}
      </div>
      <div className="card ViewIssues border mt-2">
        <Heading
          title={"For official use"}
          secondTitle={
            <div className="d-flex">
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
                  background: "none",
                  marginLeft: "30px",
                }}
              ></button>
            </div>
          }
        />

        {rowHandler.show4 && (
          <>
            <div className="row g-4 m-2">
              <ReactSelect
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="TeamID"
                placeholderName="Team"
                dynamicOptions={team}
                handleChange={handleDeliveryChange}
                value={formData?.TeamID}
                requiredClassName="required-fields"
              />
              <ReactSelect
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="SubTeamID"
                placeholderName="Sub Team"
                dynamicOptions={subteam}
                handleChange={handleDeliveryChange}
                value={formData?.SubTeamID}
              />

              <ReactSelect
                name="OfficeDesignation"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                defaultValue={formData?.OfficeDesignation}
                placeholderName="Designation"
                dynamicOptions={designation}
                value={formData?.OfficeDesignation}
                handleChange={handleDeliveryChange}
                requiredClassName="required-fields"
              />

              <ReactSelect
                name="ReporterTo"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                placeholderName="Reporting Manager"
                dynamicOptions={reporter}
                value={formData?.ReporterTo}
                handleChange={handleDeliveryChange}
                requiredClassName="required-fields"
              />
              <DatePicker
                className="custom-calendar"
                id="JoiningDate"
                name="JoiningDate"
                placeholder={VITE_DATE_FORMAT}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                value={formData?.JoiningDate}
                lable="Joining Date"
                handleChange={handleSelectChange}
                requiredClassName="required-fields"
              />
              <DatePicker
                className="custom-calendar"
                id="NextAppraisalDate"
                name="NextAppraisalDate"
                placeholder={VITE_DATE_FORMAT}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                value={formData?.NextAppraisalDate}
                lable="Next Appraisal Date"
                handleChange={handleSelectChange}
                requiredClassName="required-fields"
              />
              <Input
                type="text"
                className="form-control required-fields"
                id="EmployeeCode"
                name="EmployeeCode"
                lable="Employee Code"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.EmployeeCode}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                error={errors?.EmployeeCode ? errors?.EmployeeCode : ""}
              />
              <ReactSelect
                name="Grade"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                placeholderName="Grade"
                dynamicOptions={[
                  { label: "Level A", value: "LevelA" },
                  { label: "Level B", value: "LevelB" },
                  { label: "Level C", value: "LevelC" },
                ]}
                value={formData?.Grade}
                handleChange={handleDeliveryChange}
                requiredClassName="required-fields"
              />
              {/* <div
                className="input-group d-flex"
                style={{ width: "15.7%", marginLeft: "7px" }}
              >
                <input
                  type="text"
                  className="form-control required-fields"
                  id="EmployeeEmail"
                  name="EmployeeEmail"
                  placeholder="Company Email Id"
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  onChange={handleSelectChange}
                  value={formData?.EmployeeEmail}
                />
                <span className="input-group-text" style={{ height: "25px" }}>
                  @itdoseinfo.com
                </span>
              
              </div> */}
              <Input
                type="text"
                className="form-control required-fields"
                id="EmployeeEmail"
                name="EmployeeEmail"
                lable="Employee Email"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.EmployeeEmail}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              {/* <Input
                type="number"
                className="form-control required-fields"
                id="Salary"
                name="Salary"
                lable="Salary"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.Salary}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              /> */}
              {/* <ReactSelect
                name="SalaryAccountBank"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                placeholderName="Salary A/c Bank"
                dynamicOptions={[
                  { label: "Kotak", value: "Kotak" },
                  { label: "ICICI", value: "ICICI" },
                  { label: "Delta", value: "Cash" },
                ]}
                value={formData?.SalaryAccountBank}
                handleChange={handleDeliveryChange}
                requiredClassName="required-fields"
              /> */}
              {/* <Input
                type="number"
                className="form-control required-fields"
                id="SalaryAccountNumber"
                name="SalaryAccountNumber"
                lable="Salary A/c No."
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.SalaryAccountNumber}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                error={
                  errors?.SalaryAccountNumber ? errors?.SalaryAccountNumber : ""
                }
              /> */}
              {/* <div className="search-col" style={{ marginLeft: "5px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label className="switch" style={{ marginTop: "7px" }}>
                    <input
                      type="checkbox"
                      name="RegisteredSalesEnquiry"
                      checked={
                        formData?.RegisteredSalesEnquiry == "1" ? true : false
                      }
                      onChange={handleSelectChange}
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
                    Registered Sales Enquiry
                  </span>
                </div>
              </div>
              <div className="search-col" style={{ marginLeft: "5px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label className="switch" style={{ marginTop: "7px" }}>
                    <input
                      type="checkbox"
                      name="IsSalesTeamMember"
                      checked={
                        formData?.IsSalesTeamMember == "1" ? true : false
                      }
                      onChange={handleSelectChange}
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
                    Is Sales Team Member
                  </span>
                </div>
              </div>
              <div className="search-col" style={{ marginLeft: "5px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label className="switch" style={{ marginTop: "7px" }}>
                    <input
                      type="checkbox"
                      name="ApproveLeaveRequest"
                      checked={
                        formData?.ApproveLeaveRequest == "1" ? true : false
                      }
                      onChange={handleSelectChange}
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
                    Approve Leave Request
                  </span>
                </div>
              </div> */}
              <ReactSelect
                name="MaximumWeekoffs"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                placeholderName="Maximum Weekoffs"
                dynamicOptions={[
                  {
                    label: "None",
                    value: "0",
                  },
                  {
                    label: "Alternate Saturdays",
                    value: "1",
                  },
                  {
                    label: "All Saturdays",
                    value: "2",
                  },
                  {
                    label: "3rd WeekOff",
                    value: "3",
                  },
                ]}
                value={formData?.MaximumWeekoffs}
                handleChange={handleDeliveryChange}
                requiredClassName="required-fields"
              />
              {/* <Input
                type="number"
                className="form-control required-fields"
                id="WorkingDays"
                name="WorkingDays"
                lable="Working Days"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.WorkingDays}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              /> */}
              {/* <Input
                type="number"
                className="form-control required-fields mt-1"
                id="BiometricEmployeeCode"
                name="BiometricEmployeeCode"
                lable="Biometric Employee Code"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.BiometricEmployeeCode}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                error={
                  errors?.BiometricEmployeeCode
                    ? errors?.BiometricEmployeeCode
                    : ""
                }
              /> */}
            </div>
          </>
        )}
      </div>
      <div className="card mt-2">
        <Heading
          title={"Bank Details"}
          secondTitle={
            <div className="d-flex">
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
                  background: "none",
                  marginLeft: "30px",
                }}
              ></button>
            </div>
          }
        />
        {rowHandler.show5 && (
          <>
            <div className="row g-4 m-2">
              <Input
                type="text"
                className="form-control "
                id="BankName"
                name="BankName"
                lable="Bank Name"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.BankName}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control "
                id="AccountNumber"
                name="AccountNumber"
                lable="Account Number"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.AccountNumber}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control "
                id="IFSCCode"
                name="IFSCCode"
                lable="IFSC Code"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.IFSCCode}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control "
                id="AccountHolderName"
                name="AccountHolderName"
                lable="Account Holder Name"
                placeholder=" "
                onChange={handleSelectChange}
                value={formData?.AccountHolderName}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
            </div>
          </>
        )}

        <div className="row mt-2">
          <div className="search-col" style={{ marginLeft: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="IsActive"
                  checked={formData?.IsActive ? 1 : 0}
                  onChange={handleSelectChange}
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
                Active
              </span>
            </div>
          </div>

          <div className="col-3 col-sm-4 d-flex">
            {state?.edit && (
              <div className="search-col" style={{ marginLeft: "8px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label className="switch" style={{ marginTop: "7px" }}>
                    <input
                      type="checkbox"
                      name="UpdatePassword"
                      checked={formData?.UpdatePassword ? 1 : 0}
                      onChange={handleSelectChange}
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
                    Update Password
                  </span>
                </div>
              </div>
            )}
            {state?.edit ? (
              <>
                {loading ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-sm btn-info ml-2"
                    onClick={handleUpdate}
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
                    className="btn btn-sm btn-info ml-2"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeMaster;
