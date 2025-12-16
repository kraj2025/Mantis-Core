import React, { useEffect, useState } from "react";
import ReactSelect from "../../components/formComponent/ReactSelect";
import Input from "../../components/formComponent/Input";
import { toast } from "react-toastify";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import Loading from "../../components/loader/Loading";
import { axiosInstances } from "../../networkServices/axiosInstance";

const LoginModal = ({
  setVisible,
  handleTableSearch2,
  LoginLogoutButton2,
  onCloseInnerModal,
}) => {
  // console.log("setvisible", setVisible);
  const CRMID = useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID");
  const [isLogin, setIsLogin] = useState(false);

  const [formData, setFormData] = useState({
    LocationID: "",
    Remarks: "",
    Latitude: "",
    Longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const handleIDChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReactSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value?.value,
    }));
  };

  const locationOptions = [
    { label: "Noida Office", value: "Noida Office" },
    { label: "Client Site", value: "Client Site" },
    { label: "Work From Home", value: "Work From Home" },
    { label: "Office+Client", value: "Office+Client" },
  ];

  const MyLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationString = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
          resolve(locationString);
        },
        (error) => {
          console.error("Geolocation error:", error);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              reject("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              reject("The request to get user location timed out.");
              break;
            default:
              reject("An unknown error occurred.");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };
  const [tableData, setTableData] = useState([]);
  const handleTableSearch = () => {
    
       axiosInstances
          .post(apiUrls.Attendence_Search, {
            EmployeeID: Number(0),
            SearchType: String("0"),
            Date: String(new Date().toISOString().split("T")[0]),
            ManagerID: Number("0"),
          })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    MyLocation()
      .then((currentLocation) => {
        setFormData((prev) => ({
          ...prev,
          Latitude: currentLocation.split(",")[0].split(":")[1].trim(),
          Longitude: currentLocation.split(",")[1].split(":")[1].trim(),
        }));

        console.log("Current Location:", currentLocation);
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
      });
  }, []);
  const [notFound, setNotFound] = useState("");

  const LoginLogoutButton = () => {
   
    axiosInstances
      .post(apiUrls.Attendence_Select, {
        EmailID: String(useCryptoLocalStorage("user_Data", "get", "EmailId")),
        SearchType: String("LogInStatus"),
      })
      .then((res) => {
        const data = res?.data?.data?.[0];
        setNotFound(res?.data?.message === "No Record Found");
        // Ensure only one logic path determines isLogin
        if (data?.IsLoggedIn === 1 && data?.IsLogout === 0) {
          setIsLogin(true);
          localStorage.setItem("isLogin", "true");
          handleTableSearch();
        } else {
          setIsLogin(false);
          localStorage.setItem("isLogin", "false");
          handleTableSearch();
        }
      })
      .catch((err) => {
        console.error("Error fetching login/logout status", err);
      });
  };

  useEffect(() => {
    LoginLogoutButton();
  }, []);

  const handleLogin = async () => {
 
    setLoading(true);

      try {
          const res = await axiosInstances.post(apiUrls.Attendence_Login, {
            CrmEmpID: Number(CRMID),
            Location: String(formData?.LocationID || ""),
            Latitude: String(formData?.Latitude || ""),
            Longitude: String(formData?.Longitude || ""),
            Remarks: String(formData?.Remarks || ""),
            StatusType: String("LogIn"),
          });
      if (res?.data?.success === true) {
        toast.success(res?.data?.message);
        setIsLogin(true);
        localStorage.setItem("isLogin", "true");
        setLoading(false);
        LoginLogoutButton();
        handleTableSearch();
        handleTableSearch2();
        setVisible(false);
        LoginLogoutButton2();
        if (onCloseInnerModal) {
          onCloseInnerModal(); // call parent's handleNews here
        }
      } else {
        toast.error(res?.data?.message);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
  
    setLoading(true);
   
      try {
      const res = await axiosInstances.post(apiUrls.Attendence_Login, {
        CrmEmpID: Number(CRMID),
        Location: String(formData?.LocationID || ""),
        Latitude: String(formData?.Latitude || ""),
        Longitude: String(formData?.Longitude || ""),
        Remarks: String(formData?.Remarks || ""),
        StatusType: String("LogOut"),
      });
      if (res?.data?.status === true) {
        toast.success(res?.data?.message);
        setIsLogin(false);
        localStorage.setItem("isLogin", "false");
        setLoading(false);
        LoginLogoutButton();
        handleTableSearch();
        handleTableSearch2();
        LoginLogoutButton2();
        setVisible(false);
        if (onCloseInnerModal) {
          onCloseInnerModal(); // call parent's handleNews here
        }
      } else {
        toast.error(res?.data?.message);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const loginState = localStorage.getItem("isLogin");
    setIsLogin(loginState === "true");
    LoginLogoutButton();
  }, []);
  return (
    <>
      <div className="card mt-1">
        <div className="row g-4 m-2 d-flex">
          <ReactSelect
            className="form-control"
            name="LocationID"
            respclass="col-xl-12 col-md-4 col-sm-6 col-12"
            placeholderName="Location"
            id="LocationID"
            dynamicOptions={locationOptions}
            value={formData?.LocationID}
            handleChange={handleReactSelect}
          />
          <Input
            type="text"
            className="form-control mt-2"
            id="Remarks"
            name="Remarks"
            lable="Remarks"
            onChange={handleIDChange}
            value={formData?.Remarks}
            respclass="col-xl-12 col-md-4 col-sm-6 col-12"
          />
        </div>
        <div className="row p-2 text-right">
          <div className="col-sm-12">
            {!isLogin ? (
              <>
                {loading ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-sm mr-2"
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      borderColor: "green",
                    }}
                    onClick={handleLogin}
                    // disabled={!notFound}
                  >
                    Login
                  </button>
                )}
              </>
            ) : (
              <>
                {loading ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-sm mr-2"
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      borderColor: "red",
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="card p-0">
        <div className="row m-1">
          {!isLogin ? (
            <div style={{ display: "flex" }}>
              <span style={{ fontWeight: "bold" }}>Disclaimer&nbsp;:-</span>
              &nbsp;
              <span style={{ fontWeight: "" }} className="redIconblink">
                Please note that after clicking login, it may take up to 2
                minutes for the system to update your login status.
              </span>
            </div>
          ) : (
            <div style={{ display: "flex" }}>
              <span style={{ fontWeight: "bold" }}>Disclaimer&nbsp;:-</span>
              &nbsp;
              <span style={{ fontWeight: "" }} className="redIconblink">
                Please note that logout times for employees working from home or
                client sites may not update immediately in Mantis due to a
                process change. Logout times will be automatically updated after
                11:00 PM on the same day. We appreciate your understanding.
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginModal;
