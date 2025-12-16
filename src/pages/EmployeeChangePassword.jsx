import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import Input from "../components/formComponent/Input";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import axios from "axios";
import { headers } from "../utils/apitools";
import { inputBoxValidation } from "../utils/utils";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../utils/constant";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import ReactSelect from "../components/formComponent/ReactSelect";
import { apiUrls } from "../networkServices/apiEndpoints";
import { useTranslation } from "react-i18next";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

const EmployeeChangePassword = () => {
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [reporter, setReporter] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    Password: "",
    Reporter: "",
  });
  const IsEmployee = useCryptoLocalStorage("user_Data", "get", "realname");

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const getReporter = () => {
    axiosInstances
      .post(apiUrls.Reporter_Select, {
        ID: useCryptoLocalStorage("user_Data", "get", "ID"),
        IsMaster: "1",
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
  
      })
        .then((res) => {
          const reporters = res?.data?.data?.map((item) => {
            return { label: item?.NAME, value: item?.ID };
          });
          setReporter(reporters);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const getChangePasswordEmployee = () => {
    if (formData?.Password == "") {
      toast.error("Please Enter Password.");
      setLoading(false);
    } else {
      setLoading(true);
    
      axiosInstances
      .post(apiUrls.ChangePassword, {
        UserID: String(useCryptoLocalStorage("user_Data", "get", "ID")),
        Password: String(formData?.Password),
      })
          .then((res) => {
            if (res?.data?.success) {
              toast.success(res?.data?.message);
              setLoading(false);
            } else {
              toast.error(res?.data?.message);
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
    }
  };
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    getReporter();
  }, []);
  return (
    <>
      <div className="card ">
        <Heading title={t("Employee Change Password")} isBreadcrumb={true} />
        <div className="row g-4 m-2">
          {/* <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Reporter"
            placeholderName={t("User")}
            dynamicOptions={reporter}
            value={formData?.Reporter}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
          /> */}

          {/* {ReportingManager == 1 ? (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="Reporter"
              placeholderName={t("User")}
              dynamicOptions={reporter}
              value={formData?.Reporter}
              handleChange={handleDeliveryChange}
              // requiredClassName={"required-fields"}
            />
          ) : ( */}
          <Input
            type="text"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            className="form-control"
            placeholder=" "
            lable="Employee"
            id="AssignedTo"
            name="AssignedTo"
            value={IsEmployee}
            disabled={true}
          />
          {/* )} */}

          <div className="col-sm-2 d-flex ">
            <div className="maindiv">
              <form>
                <Input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
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
              style={{ cursor: "pointer", color: "black", marginLeft: "3px" }}
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              />
            </div>
          </div>

          {/* {loading ? (
            <Loading />
          ) : (
            <div className="col-3 col-sm-4 d-flex">
              <button
                className="btn btn-sm btn-success ml-2"
                onClick={getChangePassword}
              >
                {t("Save")}
              </button>
            </div>
          )} */}

          {/* {ReportingManager == 1 ? (
            <div>
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={getChangePassword}
                >
                  Update
                </button>
              )}
            </div>
          ) : ( */}
          <div>
            {loading ? (
              <Loading />
            ) : (
              <button
                className="btn btn-sm btn-info ml-2"
                onClick={getChangePasswordEmployee}
              >
                Update
              </button>
            )}
          </div>
          {/* )} */}
        </div>
      </div>
    </>
  );
};

export default EmployeeChangePassword;
