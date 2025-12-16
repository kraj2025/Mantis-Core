import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { setWindowClass } from "@app/utils/helpers";
import Input from "@app/components/formComponent/Input";
import logoitdose from "@app/assets/image/hrcrmBug.png";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { Tabfunctionality } from "../../utils/helpers";
import { headers } from "../../utils/apitools";
import { inputBoxValidation, speakMessage } from "../../utils/utils";
import {
  MOBILE_NUMBER_VALIDATION_REGX,
  OTP_VALIDATION_REGX,
} from "../../utils/constant";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import LanguagesDropdown from "../../layouts/header/languages-dropdown/LanguagesDropdown";
import { axiosInstances } from "../../networkServices/axiosInstance";
import { signInAction } from "../../store/reducers/loginSlice/loginSlice";
import { useDispatch } from "react-redux";

const LoginComponent = () => {
  const [t] = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const [values, setValues] = useState({
    username: "",
    password: "",
    email: "",
    mobile: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleIndicator = (state) => {
    return (
      <div className="text" style={{ justifyContent: "space-between" }}>
        {/* <span className="text-dark">Max </span>{" "} */}({" "}
        <span className="text-black"> {Number(0 + String(state)?.length)}</span>
        )
      </div>
    );
  };
  const navigate = useNavigate();

  const convertToFormData = (obj) => {
    const formData = new FormData();

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        formData.append(key, obj[key]);
      }
    }

    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }

    return formData;
  };
  const dispatch = useDispatch();

  function decodeJWT(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (validate()) {
    async function getLoginDetails() {
      const loginRes = await dispatch(
        signInAction({
          userName: values.username,
          password: values.password,
          client: "b2b",
        })
      );
      const responseData = loginRes?.payload?.data;

      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldmVuZHJhLnNpbmdoQGl0ZG9zZWluZm8uY29tIiwidW5pcXVlX25hbWUiOiJhZG1pbiIsIm5hbWVpZCI6IkVNUDAwMSIsIkdsb2JhbElkIjoiY2NhZDUyNjA4YjhhY2I4NzYxYzFiMDY4ZjlhNTMwMDciLCJJRCI6IkVNUDAwMSIsIlVzZXJWYWxpZGF0ZUlEIjoiWVMrNXBnTFU5WWlVQVEySTVXaGNmQT09IiwiTG9naW5OYW1lIjoiTXIuIEFkbWluaXN0cmF0b3IiLCJSb2xlSUQiOiIxMTgiLCJDZW50cmVJRCI6IjEiLCJCb29raW5nQ2VudHJlSUQiOiIxIiwiQ2VudHJlTmFtZSI6IklURE9TRSBJTkZPU1lTVEVNUyBQVlQuIExURC4iLCJFbXBsb3llZU5hbWUiOiJNci4gQWRtaW5pc3RyYXRvciIsIklzU3RvcmUiOiIxIiwiTG9naW5UeXBlIjoiQkxPT0RCQU5LIiwiVXNlck5hbWUiOiJhZG1pbiIsIk93bmVyc2hpcCI6IlByaXZhdGUiLCJFbXBMYW5ndWFnZSI6IkVuZ2xpc2giLCJFbXBMYW5ndWFnZUNvZGUiOiJlbiIsIk9yZ2FuaXphdGlvbklEIjoiMSIsIk9yZ2FuaXphdGlvbk5hbWUiOiJJVERPU0UgSU5GT1NZU1RFTVMgR1JPVVAiLCJPcmdhbml6YXRpb25DdXJyZW5jeSI6IklOUiIsIkNlbnRyZUN1cnJlbmN5IjoiSU5SIiwibmJmIjoxNzU2Mjc0OTk1LCJleHAiOjE3NTYzMTgxOTUsImlhdCI6MTc1NjI3NDk5NSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo3MDAwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo3MDAwIn0.yqKRJCMolcP7EwCI6RUqlpv2Sf40mGs8-BYnoXiWUI0"; // Replace with your JWT
      // const decodedToken = decodeJWT(token);
      // console.log("decodedTokendecodedToken",decodedToken);

      if (loginRes?.payload?.success) {
        // const userDetails = {
        //   token: responseData?.token,
        //   ID: responseData.User?.id,
        //   AllowQuotaionCreate: responseData.User?.allowQuotaionCreate,
        //   AllowQuotationUpdate: responseData.User?.allowQuotationUpdate,
        //   AllowQuotationApproved: responseData.User?.allowQuotationApproved,
        //   AllowQuotationReject: responseData.User?.allowQuotationReject,
        //   AllowSalesBooking: responseData.User?.allowSalesBooking,
        //   AllowSalesUpdate: responseData.User?.allowSalesUpdate,
        //   AllowSalesReject: responseData.User?.allowSalesReject,
        //   AllowPICreate: responseData.User?.allowPICreate,
        //   AllowDeleteTicket: responseData.User?.allowDeleteTicket,
        //   AllowTicketAssignTo: responseData.User?.allowTicketAssignTo,
        //   username: responseData.User?.username,
        //   realname: responseData.User?.realname,
        //   IsFeedbackShow: responseData.User?.isFeedbackShow,
        //   MobileNo: responseData.User?.mobileno,
        //   EmailId: responseData.User?.email,
        //   AllowLockUnLock: responseData.User?.allowLockUnLock,
        //   ProfileImage: responseData.User?.profileImage,
        //   AllowAmountSubmissionCancel:
        //     responseData.User?.allowAmountSubmissionCancel,
        //   AllowManHourEdit: responseData.User?.allowManHourEdit,
        //   AllowExpenseApprove: responseData.User?.allowExpenseApprove,
        //   AllowAddModule: responseData.User?.allowAddModule,
        //   AllowAddPages: responseData.User?.allowAddPages,
        //   AllowDeliveryDateEdit: responseData.User?.allowDeliveryDateEdit,
        //   RoleID: responseData.roles[0]?.roleID,
        //   CrmEmployeeID: responseData.User?.crmEmployeeID,
        //   ShowClientDeliveryDate: responseData.User?.showClientDeliveryDate,
        //   ShowClientManHour: responseData.User?.showClientManHour,
        //   IsReportingManager: responseData.User?.isReportingManager,
        //   IsAccountant: responseData.User?.isAccountant,
        //   IsCEO: responseData.User?.isCEO,
        //   IsLogin: true,
        //   Role: responseData.Roles,
        //   themeColor: responseData.User?.themeColor || "default_theme",
        // };

        const userDetails = {
          token: responseData?.token,
          ID: responseData.User?.ID,
          AllowQuotaionCreate: responseData.User?.AllowQuotaionCreate,
          AllowQuotationUpdate: responseData.User?.AllowQuotationUpdate,
          AllowQuotationApproved: responseData.User?.AllowQuotationApproved,
          AllowQuotationReject: responseData.User?.AllowQuotationReject,
          AllowSalesBooking: responseData.User?.AllowSalesBooking,
          AllowSalesUpdate: responseData.User?.AllowSalesUpdate,
          AllowSalesReject: responseData.User?.AllowSalesReject,
          AllowPICreate: responseData.User?.AllowPICreate,
          AllowDeleteTicket: responseData.User?.AllowDeleteTicket,
          AllowTicketAssignTo: responseData.User?.AllowTicketAssignTo,
          username: responseData.User?.username,
          realname: responseData.User?.realname,
          IsFeedbackShow: responseData.User?.IsFeedbackShow,
          MobileNo: responseData.User?.mobileno,
          EmailId: responseData.User?.email,
          AllowLockUnLock: responseData.User?.AllowLockUnLock,
          ProfileImage: responseData.User?.ProfileImage,
          AllowAmountSubmissionCancel:
            responseData.User?.AllowAmountSubmissionCancel,
          AllowManHourEdit: responseData.User?.AllowManHourEdit,
          AllowExpenseApprove: responseData.User?.AllowExpenseApprove,
          AllowAddModule: responseData.User?.AllowAddModule,
          AllowAddPages: responseData.User?.AllowAddPages,
          AllowDeliveryDateEdit: responseData.User?.AllowDeliveryDateEdit,
          RoleID: responseData.Roles[0]?.RoleID,
          CrmEmployeeID: responseData.User?.CrmEmployeeID,
          ShowClientDeliveryDate: responseData.User?.ShowClientDeliveryDate,
          ShowClientManHour: responseData.User?.ShowClientManHour,
          IsReportingManager: responseData.User?.IsReportingManager,
          IsAccountant: responseData.User?.IsAccountant,
          IsCEO: responseData.User?.IsCEO,
          IsLogin: true,
          Role: responseData.Roles,
          theme: responseData?.User?.ThemeColor || "default_theme",
        };

        useCryptoLocalStorage("user_Data", "set", null, userDetails);

        setWindowClass(
          // `hold-transition login-page ${responseData.User?.ThemeColor || "default_theme"}`
          `hold-transition login-page ${useCryptoLocalStorage("user_Data", "get", "theme")}`
        );
        // speakMessage(`Welcome ${responseData.User?.realname}`);
        // useCryptoLocalStorage("user_Data", "get", "RoleID") == 7
        "roleID" == 7 ? navigate("/ClientDashboard") : navigate("/dashboard");
      } else {
        toast.error(loginRes?.payload?.message);
      }
      return responseData;
    }
    getLoginDetails();
  };

  const [showForgotPage, setShowForgotPage] = useState({
    isLogin: true,
    isForgetPassword: false,
    isOTP: false,
    isNewPassword: false,
  });
  const handleForgotPasswordClick = () => {
    setShowForgotPage({
      isLogin: false,
      isForgetPassword: true,
      isOTP: false,
      isNewPassword: false,
    });
    setValues(values);
  };
  const handleForgotPasswordClickForgot = () => {
    setShowForgotPage({
      isLogin: true,
      isForgetPassword: false,
      isOTP: false,
      isNewPassword: false,
    });
    setValues(values);
  };
  const [showotp, setshowotp] = useState([]);

  const handleEmailMobileSubmit = () => {
    if (values?.email == "") {
      toast.error("Please Enter Valid EmailId.");
    } else if (values?.mobile == "") {
      toast.error("Please Enter Mobile No.");
    } else {
      axiosInstances
        .post(apiUrls.ForgetPassword_ValdiateEmailMobile, {
          EmailID: String(values?.email),
          MobileNo: String(values?.mobile),
        })
        .then((res) => {
          if (res?.data?.success == true) {
            toast.success(res?.data?.message);
            setshowotp(res?.data?.data);
            setShowForgotPage({
              isLogin: false,
              isForgetPassword: false,
              isOTP: true,
              isNewPassword: false,
            });
            setValues(values);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const [showpassword, setshowpassword] = useState([]);

  const handleVerify = () => {
    if (values?.otp == "") {
      toast.error("Please Enter 6 digit Otp No.");
    } else {
      axiosInstances
        .post(apiUrls.ForgetPassword_ValdiateOTP, {
          EmpID: String(showotp[0]?.EmpID),
          OTP: String(values?.otp),
        })
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setshowpassword(res?.data?.data);
            setShowForgotPage({
              isLogin: false,
              isForgetPassword: false,
              isOTP: false,
              isNewPassword: true,
            });
            setValues(values);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handlenewpassword = () => {
    if (values?.newPassword == "") {
      toast.error("Please Enter New Password.");
    } else if (values?.confirmPassword == "") {
      toast.error("Please Enter Confirm Password.");
    } else {
      axiosInstances
        .post(apiUrls.ForgetPassword_ChangePassword, {
          EmpID: String(showpassword[0]?.EmpID),
          Password: String(values?.newPassword),
          ConfirmedPassword: String(values?.confirmPassword),
        })
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setShowForgotPage({
              isLogin: true,
              isForgetPassword: false,
              isOTP: false,
              isNewPassword: false,
            });
            setValues(values);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };
  return (
    <>
      <div
        className="cardlogin card-outline card-primary border text-center py-3 mediacard"
        style={{ borderRadius: "10px" }}
      >
        <div
          style={{ display: "flex", justifyContent: "end" }}
          className="mr-4"
        >
          <LanguagesDropdown />
        </div>

        <div className="card-body loginmedia">
          <h5 className="cardTitle my-2">{t("Welcome to itDose")}</h5>

          <Link to="/">
            <img
              className="logoStyle"
              src={logoitdose}
              style={{ background: "white", borderRadius: "10px" }}
            />
          </Link>
          <h5 className="cardTitle my-1">
            {showForgotPage.isLogin
              ? t("Sign in to start your session")
              : t("I forgot my password.")}
          </h5>
          <div>
            {showForgotPage.isLogin && (
              <>
                <div className="row">
                  <div className="col-sm-12 d-flex mt-4">
                    <div className="maindiv">
                      <Input
                        type="text"
                        className="form-control lablecontrolcss"
                        id="text"
                        name="username"
                        lable={t("Username")}
                        placeholder=""
                        value={values?.username}
                        onChange={handleChange}
                        onKeyDown={Tabfunctionality}
                        tabIndex="1"
                      />
                    </div>
                    <div className="icondiv">
                      <i
                        className="fas fa-envelope"
                        style={{ background: "", color: "white" }}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 d-flex mt-4">
                    <div className="maindiv">
                      <Input
                        // type="password"
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        name="password"
                        lable={t("Password")}
                        placeholder=""
                        value={values?.password}
                        onChange={handleChange}
                        onKeyDown={Tabfunctionality}
                        tabIndex="1"
                      />
                    </div>
                    <div
                      className="icondiv"
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer", color: "white" }}
                    >
                      <i
                        className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "flex-end" }}
                  className="mt-2"
                >
                  <Link
                    to="#"
                    onClick={handleForgotPasswordClick}
                    style={{ marginRight: "0", color: "white" }}
                  >
                    {t("Forgot Password")}
                  </Link>
                </div>

                <div className=" mt-3">
                  <button
                    className=" btn btn-sm btn-block"
                    onClick={handleSubmit}
                    onKeyDown={Tabfunctionality}
                    tabIndex="1"
                    style={{ background: "white", color: "black" }}
                  >
                    {t("Login")}
                  </button>
                </div>
              </>
            )}

            <>
              <div className="row">
                {showForgotPage?.isForgetPassword && (
                  <>
                    <div className="col-sm-12 mt-3">
                      <Input
                        type="email"
                        id="email"
                        className="form-control"
                        name="email"
                        lable={t("Email")}
                        placeholder=""
                        value={values?.email}
                        onChange={handleChange}
                      />
                    </div>
                    {/* <div className="col-2 d-flex"> */}
                    <div className="col-sm-12 mt-3 d-flex">
                      <div style={{ width: "86%" }}>
                        <Input
                          type="number"
                          id="mobile"
                          className="form-control"
                          name="mobile"
                          lable={t("Mobile")}
                          value={values?.mobile}
                          placeholder=""
                          onChange={(e) => {
                            inputBoxValidation(
                              MOBILE_NUMBER_VALIDATION_REGX,
                              e,
                              handleChange
                            );
                          }}
                        />
                      </div>
                      <span className="ml-1" style={{ color: "white" }}>
                        {handleIndicator(values?.mobile)}
                      </span>
                    </div>

                    {/* </div> */}
                    <div className=" mt-2 ml-auto mr-2">
                      <Link
                        to="/login"
                        onClick={handleForgotPasswordClickForgot}
                        style={{ marginRight: "auto", color: "white" }}
                      >
                        {t("Back to Login")}
                      </Link>
                    </div>
                    <div className="col-sm-12 mt-3">
                      <button
                        className=" btn btn-sm  btn-block"
                        onClick={handleEmailMobileSubmit}
                        type="button"
                        style={{ background: "white", color: "black" }}
                      >
                        {t("Submit")}
                      </button>
                    </div>
                  </>
                )}

                {showForgotPage.isOTP && (
                  <>
                    <div className="col-sm-12 mt-3">
                      <Input
                        type="number"
                        className="form-control"
                        id="otp"
                        name="otp"
                        lable={t("OTP")}
                        placeholder=""
                        value={values?.otp}
                        onChange={(e) => {
                          inputBoxValidation(
                            OTP_VALIDATION_REGX,
                            e,
                            handleChange
                          );
                        }}
                      />
                    </div>
                    <div className=" mt-2 ml-auto mr-2">
                      <Link
                        to="/login"
                        onClick={handleForgotPasswordClickForgot}
                        style={{ marginRight: "auto", color: "white" }}
                      >
                        {t("Back to Login")}
                      </Link>
                    </div>
                    <div className="col-sm-12 mt-3">
                      <button
                        type="button"
                        className=" btn btn-sm btn-block"
                        onClick={handleVerify}
                        style={{ background: "white", color: "black" }}
                      >
                        {t("Verify")}
                      </button>
                    </div>
                  </>
                )}

                {showForgotPage.isNewPassword && (
                  <>
                    <div className="col-sm-12 mt-3">
                      <Input
                        type="password"
                        id="newpassword"
                        className="form-control"
                        name="newPassword"
                        lable={t("New Password")}
                        placeholder=""
                        value={values?.newPassword}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-sm-12 mt-3">
                      <Input
                        type="password"
                        id="confirmpassword"
                        className="form-control"
                        name="confirmPassword"
                        lable={t("Confirm Password")}
                        placeholder=""
                        value={values?.confirmPassword}
                        onChange={handleChange}
                        onKeyDown={Tabfunctionality}
                        tabIndex="1"
                      />
                    </div>

                    <div className=" mt-2 ml-auto mr-2">
                      <Link
                        to="/login"
                        onClick={handleForgotPasswordClickForgot}
                        style={{ marginRight: "auto", color: "white" }}
                      >
                        {t("Back to Login")}
                      </Link>
                    </div>

                    <div className="col-sm-12 mt-3">
                      <button
                        className=" btn btn-sm  btn-block"
                        onClick={handlenewpassword}
                        type="button"
                        style={{ background: "white", color: "black" }}
                      >
                        {t("Submit")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginComponent;
