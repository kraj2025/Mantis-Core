import React, { useEffect, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import Input from "../components/formComponent/Input";
import { inputBoxValidation } from "../utils/utils";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../utils/constant";
import Loading from "../components/loader/Loading";
import { axiosInstances } from "../networkServices/axiosInstance";
const SpocUpdateModal = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    OwnerName: "",
    OwnerMobile: "",
    OwnerEmail: "",
    ItPersonName: "",
    ItPersonMobile: "",
    ItPersonEmail: "",
    SpocName: "",
    SpocMobile: "",
    SpocEmail: "",
  });
  const handleSelectChange = (e) => {
    const { name, value } = e?.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const filldetails = () => {
    setFormData({
      ...formData,
      OwnerName: data?.Owner_Name,
      OwnerMobile: data?.Owner_Mobile,
      OwnerEmail: data?.Owner_Email,
      ItPersonName: data?.ItPersonName,
      ItPersonMobile: data?.ItPersonMobile,
      ItPersonEmail: data?.ItPersonEmail,
      SpocName: data?.SPOC_Name,
      SpocMobile: data?.SPOC_Mobile,
      SpocEmail: data?.SPOC_EmailID,
    });
  };

  const handleUpdateSPOC = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls?.SPOC_Update, {
        ProjectID: Number(data?.Id  || data?.ProjectID),
        SPOC_Name: String(formData?.SpocName),
        SPOC_Mobile: String(formData?.SpocMobile),
        SPOC_EmailID: String(formData?.SpocEmail),
        Owner_Name: String(formData?.OwnerName),
        Owner_Mobile: String(formData?.SpocMobile),
        Owner_Email: String(formData?.OwnerEmail),
        ItPersonName: String(formData?.ItPersonName),
        ItPersonMobile: String(formData?.ItPersonMobile),
        ItPersonEmail: String(formData?.ItPersonEmail),
      })
      .then((res) => {
        if (res?.data?.success == true) {
          toast.success(res?.data?.message);
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
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
  const handleIndicator = (state) => {
    return (
      <div className="text" style={{ justifyContent: "space-between" }}>
        {/* <span className="text-dark">Max </span>{" "} */}({" "}
        <span className="text-black">{Number(0 + state?.length)}</span>)
      </div>
    );
  };
  useEffect(() => {
    filldetails();
  }, []);
  return (
    <>
      <div className="card p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name : {data?.NAME || data?.ProjectName}
        </span>
      </div>
      <div className="card LocalityCard border p-2">
        <div className="row">
          <Input
            type="text"
            className="form-control"
            id="OwnerName"
            name="OwnerName"
            lable="Owner Name"
            placeholder=" "
            max={20}
            onChange={handleSelectChange}
            value={formData?.OwnerName}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex">
            <Input
              type="number"
              className="form-control"
              id="OwnerMobile"
              name="OwnerMobile"
              lable="Owner Mobile"
              placeholder=" "
              max={20}
              onChange={(e) => {
                inputBoxValidation(
                  MOBILE_NUMBER_VALIDATION_REGX,
                  e,
                  handleSelectChange
                );
              }}
              value={formData?.OwnerMobile}
              // respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
            <span className="ml-3">
              {handleIndicator(formData?.OwnerMobile)}
            </span>
          </div>
          <Input
            type="text"
            className="form-control"
            id="OwnerEmail"
            name="OwnerEmail"
            lable="Owner Email"
            placeholder=" "
            max={20}
            onChange={handleSelectChange}
            value={formData?.OwnerEmail}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="ItPersonName"
            name="ItPersonName"
            lable="ItPerson Name"
            placeholder=" "
            max={20}
            onChange={handleSelectChange}
            value={formData?.ItPersonName}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex">
            <Input
              type="number"
              className="form-control"
              id="ItPersonMobile"
              name="ItPersonMobile"
              lable="ItPerson Mobile"
              placeholder=" "
              onChange={(e) => {
                inputBoxValidation(
                  MOBILE_NUMBER_VALIDATION_REGX,
                  e,
                  handleSelectChange
                );
              }}
              value={formData?.ItPersonMobile}
              // respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
            <span className="ml-3">
              {handleIndicator(formData?.ItPersonMobile)}
            </span>
          </div>
          <Input
            type="text"
            className="form-control"
            id="ItPersonEmail"
            name="ItPersonEmail"
            lable="ItPerson Email"
            placeholder=" "
            max={20}
            onChange={handleSelectChange}
            value={formData?.ItPersonEmail}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="SpocName"
            name="SpocName"
            lable="Spoc Name"
            placeholder=" "
            max={20}
            onChange={handleSelectChange}
            value={formData?.SpocName}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2"
          />
          <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex mt-2">
            <Input
              type="number"
              className="form-control"
              id="SpocMobile"
              name="SpocMobile"
              lable="Spoc Mobile"
              placeholder=" "
              max={20}
              onChange={(e) => {
                inputBoxValidation(
                  MOBILE_NUMBER_VALIDATION_REGX,
                  e,
                  handleSelectChange
                );
              }}
              value={formData?.SpocMobile}
              // respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
            <span className="ml-3">
              {handleIndicator(formData?.SpocMobile)}
            </span>
          </div>
          <Input
            type="text"
            className="form-control"
            id="SpocEmail"
            name="SpocEmail"
            lable="Spoc Email"
            placeholder=" "
            max={20}
            onChange={handleSelectChange}
            value={formData?.SpocEmail}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-2"
          />
          {loading ? (
            <Loading />
          ) : (
            <div className="ml-2">
              <button
                className="btn btn-sm btn-success mt-2"
                onClick={handleUpdateSPOC}
              >
                Update
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default SpocUpdateModal;
