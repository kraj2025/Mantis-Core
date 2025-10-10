import { useState } from "react";
// import "./OtpLogin.css"
import { useNavigate } from "react-router-dom";
import "./OtpLogin.css";
import HospitalDashboard from "./NewDashboard/HospitalDashboard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";
import { toast } from "react-toastify";

const OtpLogin = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [visible, setSetVisible] = useState(false);

  const handleSendOtp = () => {
    if (mobileNumber.length !== 10 || !/^\d{10}$/.test(mobileNumber)) {
      toast.error("Invalid Mobile Number", "warning");
      return;
    }

    setShowOtpInput(true);
    toast.success("OTP Sent", "success");
  };

  const handleLogin = () => {
    if (otp.length !== 6) {
      toast.error("Invalid OTP", "warning");
      return;
    }

    toast.success("Login Successful");
    // navigate("/dashboard-new-hospital");
    setSetVisible(true);
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setMobileNumber(value);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  return (
    <>
      {!visible && (
        <div className="login-container">
          <Card className="login-card">
            <CardHeader className="login-header">
              <div className="logo-container">
                <svg
                  className="logo-icon"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2L7.5 3.5L6 2v20l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5zM19 19.09H5V4.91h14v14.18z" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 7.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              {/* <h1 className="login-title">ITDose AI Dashboard</h1> */}
              <h1 className="login-title">AI Dashboard</h1>
              <p className="login-subtitle">
                Welcome back! Please log in to your account.
              </p>
            </CardHeader>

            <CardContent className="login-content">
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <div className="input-group">
                  <Input
                    type="text"
                    placeholder="Enter Mobile Number"
                    value={mobileNumber}
                    onChange={handleMobileChange}
                    maxLength={10}
                    className={"w-75"}
                  />
                  <Button
                    onClick={handleSendOtp}
                    variant="outline"
                    className="send-btn"
                    disabled={showOtpInput}
                  >
                    Send
                  </Button>
                </div>
                <p className="form-hint">
                  Please enter a valid 10-digit mobile number to receive an OTP
                </p>
              </div>

              {showOtpInput && (
                <div className="form-group">
                  <label className="form-label">OTP</label>
                  <Input
                    type="password"
                    placeholder="••••••"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength={6}
                  />
                </div>
              )}

              {showOtpInput && (
                <Button onClick={handleLogin} className="login-btn">
                  Login
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      {visible && <HospitalDashboard />}
    </>
  );
};

export default OtpLogin;
