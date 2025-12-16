import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@app/utils/i18n";
import Input from "../../formComponent/Input";
import ReactSelect from "../../formComponent/ReactSelect";
import { headers } from "../../../utils/apitools";
import { Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import Loading from "../../loader/Loading";
import { inputBoxValidation } from "../../../utils/utils";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../../../utils/constant";
import { axiosInstances } from "../../../networkServices/axiosInstance";

const AutoBackupEditModal = ({ visible, setVisible }) => {
  const [loading, setLoading] = useState(false);
  const [t] = useTranslation();
  const [formData, setFormData] = useState({
    IsActive: false,
    AllowAutobackup: false,
    AllowURLValidation: true,
    AllowDocIDValidation: false,
    AllowRateValidation: true,
    AllowchangePass: false,
    AllowLabSecurity: false,
    OwnerName: visible?.showData?.Owner_Name || "",
    OwnerMobile: visible?.showData?.Mobile || "",
    OwnerEmail: visible?.showData?.Owner_Email || "",
    SPOCName: visible?.showData?.spoc_name || "",
    SPOCEmail: visible?.showData?.SPOC_EmailID || "",
    SPOCMobile: visible?.showData?.spoc_mobile || "",
    ItPersonName: visible?.showData?.ItPersonName || "",
    ItPersonMobile: visible?.showData?.ItPersonMobile || "",
    ItPersonEmail: visible?.showData?.ItPersonEmail || "",
  });

  const handleSubmit = () => {
    setLoading(true);
   
    const payload = {
      ProjectID: Number(visible?.showData?.id || 0),
      Owner_Name: String(formData?.OwnerName || ""),
      Owner_Mobile: String(formData?.OwnerMobile || ""),
      Owner_Email: String(formData?.OwnerEmail || ""),
      SPOC_Name: String(formData?.SPOCName || ""),
      SPOC_Mobile: String(formData?.SPOCMobile || ""),
      SPOC_EmailID: String(formData?.SPOCEmail || ""),
      ItPersonName: String(formData?.ItPersonName || ""),
      ItPersonMobile: String(formData?.ItPersonMobile || ""),
      ItPersonEmail: String(formData?.ItPersonEmail || ""),
    };

    axiosInstances
      .post(apiUrls?.SPOC_Update, payload)
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setVisible(false);
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoading(false);
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <div className="">
        <div>
          <label style={{ marginLeft: "5px" }}>
            Project Name :&nbsp; &nbsp; &nbsp; {visible?.showData?.ProjectName}
          </label>
        </div>

        <div className="row g-4 m-2">
          <Input
            type="text"
            className="form-control"
            id="O_Name"
            name="OwnerName"
            lable="O_Name"
            value={formData?.OwnerName}
            placeholder=" "
            respclass="col-md-4 col-12"
            onChange={handleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="O_Mobile"
            name="OwnerMobile"
            lable="O_Mobile"
            value={formData?.OwnerMobile}
            placeholder=" "
            respclass="col-md-4 col-12"
            onChange={(e) => {
              inputBoxValidation(
                MOBILE_NUMBER_VALIDATION_REGX,
                e,
                handleChange
              );
            }}
          />
          <Input
            type="text"
            className="form-control"
            id="O_Email"
            name="OwnerEmail"
            lable="O_Email"
            value={formData?.OwnerEmail}
            placeholder=" "
            respclass="col-md-4 col-12"
            onChange={handleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="SPOC_Name"
            name="SPOCName"
            lable="SPOC_Name"
            value={formData?.SPOCName}
            placeholder=" "
            respclass="col-md-4 col-12"
            onChange={handleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="SPOC_Mobile"
            name="SPOCMobile"
            lable="SPOC_Mobile"
            value={formData?.SPOCMobile}
            placeholder=" "
            respclass="col-md-4 col-12"
            onChange={(e) => {
              inputBoxValidation(
                MOBILE_NUMBER_VALIDATION_REGX,
                e,
                handleChange
              );
            }}
          />
          <Input
            type="text"
            className="form-control"
            id="SPOC_Email"
            name="SPOCEmail"
            lable="SPOC_Email"
            value={formData?.SPOCEmail}
            placeholder=" "
            respclass="col-md-4 col-12"
            onChange={handleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="ItPersonName"
            name="ItPersonName"
            lable="ItPersonName"
            value={formData?.ItPersonName}
            placeholder=" "
            respclass="col-md-4 col-12"
            onChange={handleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="ItPersonMobile"
            name="ItPersonMobile"
            lable="ItPersonMobile"
            value={formData?.ItPersonMobile}
            placeholder=" "
            respclass="col-md-4 col-12"
            onChange={(e) => {
              inputBoxValidation(
                MOBILE_NUMBER_VALIDATION_REGX,
                e,
                handleChange
              );
            }}
          />
          <Input
            type="text"
            className="form-control"
            id="ItPersonEmail"
            name="ItPersonEmail"
            lable="ItPersonEmail"
            value={formData?.ItPersonEmail}
            placeholder=" "
            respclass="col-md-4 col-12"
            onChange={handleChange}
          />
          {/* <Input
                    type="text"
                    className="form-control"
                    id="Remarks"
                    name="Remarks"
                    lable="Remarks"
                    placeholder=" "
                    respclass="col-md-4 col-12"
                /> */}
          <div></div>
        </div>
        <div
          className="ftr_btn"
          style={{ marginBottom: "6px", marginRight: "12px" }}
        >
          {loading ? (
            <Loading />
          ) : (
            <Button onClick={() => handleSubmit()}>Update</Button>
          )}

          {/* <Button
                        // onClick={() => setVisible(false)}
                    >Close</Button> */}
        </div>
      </div>
      {/* <div className="row g-4 m-2">
                <div className="search-col" style={{ marginLeft: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                            <input
                                type="checkbox"
                                name="IsActive"
                                checked={formData?.IsActive}
                                onChange={handleCheckBox}
                            />
                            <span className="slider"></span>
                        </label>
                        <span style={{ marginLeft: "3px", marginRight: "5px", fontSize: "12px" }}>Active</span>
                      
                    </div>
                </div>
                <div className="search-col" style={{ marginLeft: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                            <input
                                type="checkbox"
                                name="AllowAutobackup"
                                checked={formData?.AllowAutobackup}
                                onChange={handleCheckBox}
                            />
                            <span className="slider"></span>
                        </label>
                        <span style={{ marginLeft: "3px", marginRight: "5px", fontSize: "12px" }}>Allow Autobackup</span>
                      
                    </div>
                </div>
                <div className="search-col" style={{ marginLeft: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                            <input
                                type="checkbox"
                                name="AllowURLValidation"
                                checked={formData?.AllowURLValidation}
                                onChange={handleCheckBox}
                            />
                            <span className="slider"></span>
                        </label>
                        <span style={{ marginLeft: "3px", marginRight: "5px", fontSize: "12px" }}>AllowURLValidation</span>
                      
                    </div>
                </div>
                <div className="search-col" style={{ marginLeft: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                            <input
                                type="checkbox"
                                name="AllowURLValidation"
                                checked={formData?.AllowURLValidation}
                                onChange={handleCheckBox}
                            />
                            <span className="slider"></span>
                        </label>
                        <span style={{ marginLeft: "3px", marginRight: "5px", fontSize: "12px" }}>AllowURLValidation</span>
                      
                    </div>
                </div>
                <div className="search-col" style={{ marginLeft: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                            <input
                                type="checkbox"
                                name="AllowDocIDValidation"
                                checked={formData?.AllowDocIDValidation}
                                onChange={handleCheckBox}
                            />
                            <span className="slider"></span>
                        </label>
                        <span style={{ marginLeft: "3px", marginRight: "5px", fontSize: "12px" }}>Allow DocID Validation</span>
                      
                    </div>
                </div>
                <div className="search-col" style={{ marginLeft: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                            <input
                                type="checkbox"
                                name="AllowRateValidation"
                                checked={formData?.AllowRateValidation}
                                onChange={handleCheckBox}
                            />
                            <span className="slider"></span>
                        </label>
                        <span style={{ marginLeft: "3px", marginRight: "5px", fontSize: "12px" }}>Allow Rate Validation</span>
                      
                    </div>
                </div>
                <div className="search-col" style={{ marginLeft: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                            <input
                                type="checkbox"
                                name="AllowchangePass"
                                checked={formData?.AllowchangePass}
                                onChange={handleCheckBox}
                            />
                            <span className="slider"></span>
                        </label>
                        <span style={{ marginLeft: "3px", marginRight: "5px", fontSize: "12px" }}>Allow change Pass.</span>
                      
                    </div>
                </div>
                <div className="search-col" style={{ marginLeft: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginTop: "7px" }}>
                            <input
                                type="checkbox"
                                name="AllowLabSecurity"
                                checked={formData?.AllowLabSecurity}
                                onChange={handleCheckBox}
                            />
                            <span className="slider"></span>
                        </label>
                        <span style={{ marginLeft: "3px", marginRight: "5px", fontSize: "12px" }}>Allow Lab Security</span>
                      
                    </div>
                </div>
            </div> */}
    </>
  );
};

export default AutoBackupEditModal;
