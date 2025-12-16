import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../utils/apitools";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";

const ManageFlagModal = (ele) => {
  const [flagdata, setFlagdata] = useState([]);
  const [formData, setFormData] = useState({
    DotNetMantis: "0",
    AllowPaymentCancel: "0",
    LockUnLock: "0",
    AllowQuotaionCreate: "0",
    AllowQuotationUpdate: "0",
    AllowQuotationApproved: "0",
    AllowQuotationReject: "0",
    AllowSalesBooking: "0",
    AllowSalesUpdate: "0",
    AllowSalesReject: "0",
    AllowPICreate: "0",
    AllowDeleteTicket: "0",
    IsActive: "0",
    AllowSentCircular: "0",
    AllowAddModule: "0",
    AllowAddPages: "0",
    AllowManHourEdit: "0",
    AllowDeliveryDateEdit: "0",
    ShowClientDeliveryDate: "0",
    ShowClientManHour: "0",
    AllowExpenseApprove: "0",
    AllowTicketAssignTo: "0",
    AllowAutobackup: "0",
  });

  useEffect(() => {
    if (flagdata.length > 0) {
      setFormData({
        DotNetMantis: flagdata[0]?.DotNetMantis == "1" ? "1" : "0",
        AllowPaymentCancel:
          flagdata[0]?.AllowAmountSubmissionCancel == "1" ? "1" : "0",
        LockUnLock: flagdata[0]?.AllowLockUnLock == "1" ? "1" : "0",
        AllowQuotaionCreate:
          flagdata[0]?.AllowQuotaionCreate == "1" ? "1" : "0",
        AllowQuotationUpdate:
          flagdata[0]?.AllowQuotationUpdate == "1" ? "1" : "0",
        AllowQuotationApproved:
          flagdata[0]?.AllowQuotationApproved == "1" ? "1" : "0",
        AllowQuotationReject:
          flagdata[0]?.AllowQuotationReject == "1" ? "1" : "0",
        AllowSalesBooking: flagdata[0]?.AllowSalesBooking == "1" ? "1" : "0",
        AllowSalesUpdate: flagdata[0]?.AllowSalesUpdate == "1" ? "1" : "0",
        AllowSalesReject: flagdata[0]?.AllowSalesReject == "1" ? "1" : "0",
        AllowPICreate: flagdata[0]?.AllowPICreate == "1" ? "1" : "0",
        AllowDeleteTicket: flagdata[0]?.AllowDeleteTicket == "1" ? "1" : "0",
        IsActive: flagdata[0]?.IsActive == "1" ? "1" : "0",
        AllowSentCircular: flagdata[0]?.AllowSentCircular == "1" ? "1" : "0",
        AllowAddModule: flagdata[0]?.AllowAddModule == "1" ? "1" : "0",
        AllowAddPages: flagdata[0]?.AllowAddPages == "1" ? "1" : "0",
        AllowDeliveryDateEdit:
          flagdata[0]?.AllowDeliveryDateEdit == "1" ? "1" : "0",
        AllowManHourEdit: flagdata[0]?.AllowManHourEdit == "1" ? "1" : "0",
        ShowClientDeliveryDate:
          flagdata[0]?.ShowClientDeliveryDate == "1" ? "1" : "0",
        ShowClientManHour: flagdata[0]?.ShowClientManHour == "1" ? "1" : "0",
        AllowExpenseApprove:
          flagdata[0]?.AllowExpenseApprove == "1" ? "1" : "0",
        AllowTicketAssignTo:
          flagdata[0]?.AllowTicketAssignTo == "1" ? "1" : "0",
        AllowAutobackup: flagdata[0]?.AllowAutobackup == "1" ? "1" : "0",
      });
    }
  }, [flagdata]);

  const handleSelectChange = (e) => {
    const { name, checked } = e.target;
    const value = checked ? "1" : "0";

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    getNotfication({ ...formData, [name]: value });
  };

  const getNotfication = (updatedFormData) => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append("RoleID", useCryptoLocalStorage("user_Data", "get", "RoleID"));
    // form.append(
    //   "LoginName",
    //   useCryptoLocalStorage("user_Data", "get", "realname")
    // );
    // form.append("UserID", ele?.visible?.showData?.id);
    // form.append("DotNetMantis", updatedFormData?.DotNetMantis);
    // form.append("AllowLockUnLock", updatedFormData?.LockUnLock);
    // form.append(
    //   "AllowAmountSubmissionCancel",
    //   updatedFormData?.AllowPaymentCancel
    // );
    // form.append("AllowQuotaionCreate", updatedFormData?.AllowQuotaionCreate);
    // form.append("AllowQuotationUpdate", updatedFormData?.AllowQuotationUpdate);
    // form.append(
    //   "AllowQuotationApproved",
    //   updatedFormData?.AllowQuotationApproved
    // );
    // form.append("AllowQuotationReject", updatedFormData?.AllowQuotationReject);
    // form.append("AllowSalesBooking", updatedFormData?.AllowSalesBooking);
    // form.append("AllowSalesUpdate", updatedFormData?.AllowSalesUpdate);
    // form.append("AllowSalesReject", updatedFormData?.AllowSalesReject);
    // form.append("AllowPICreate", updatedFormData?.AllowPICreate);
    // form.append("AllowDeleteTicket", updatedFormData?.AllowDeleteTicket);
    // form.append("IsActive", updatedFormData?.IsActive);
    // form.append("AllowSentCircular", updatedFormData?.AllowSentCircular);
    // form.append("AllowAddModule", updatedFormData?.AllowAddModule);
    // form.append("AllowAddPages", updatedFormData?.AllowAddPages);
    // form.append(
    //   "AllowDeliveryDateEdit",
    //   updatedFormData?.AllowDeliveryDateEdit
    // );
    // form.append("AllowManHourEdit", updatedFormData?.AllowManHourEdit);
    // form.append(
    //   "ShowClientDeliveryDate",
    //   updatedFormData?.ShowClientDeliveryDate
    // );
    // form.append("ShowClientManHour", updatedFormData?.ShowClientManHour);
    // form.append("AllowExpenseApprove", updatedFormData?.AllowExpenseApprove);
    // form.append("AllowTicketAssignTo", updatedFormData?.AllowTicketAssignTo);
    // form.append("AllowAutobackup", updatedFormData?.AllowAutobackup);

    // axios
    //   .post(apiUrls?.UpdateFlag, form, { headers })
    axiosInstances
      .post(apiUrls?.UpdateFlag, {
        UserID: Number(ele?.visible?.showData?.id),
        DotNetMantis: Number(updatedFormData?.DotNetMantis),
        AllowLockUnLock: Number(updatedFormData?.LockUnLock),
        AllowAmountSubmissionCancel: Number(
          updatedFormData?.AllowPaymentCancel
        ),
        AllowQuotaionCreate: Number(updatedFormData?.AllowQuotaionCreate),
        AllowQuotationUpdate: Number(updatedFormData?.AllowQuotationUpdate),
        AllowQuotationApproved: Number(updatedFormData?.AllowQuotationApproved),
        AllowQuotationReject: Number(updatedFormData?.AllowQuotationReject),
        AllowSalesBooking: Number(updatedFormData?.AllowSalesBooking),
        AllowSalesUpdate: Number(updatedFormData?.AllowSalesUpdate),
        AllowSalesReject: Number(updatedFormData?.AllowSalesReject),
        AllowPICreate: Number(updatedFormData?.AllowPICreate),
        AllowDeleteTicket: Number(updatedFormData?.AllowDeleteTicket),
        IsActive: Number(updatedFormData?.IsActive),
        AllowSentCircular: Number(updatedFormData?.AllowSentCircular),
        AllowAddModule: Number(updatedFormData?.AllowAddModule),
        AllowAddPages: Number(updatedFormData?.AllowAddPages),
        AllowDeliveryDateEdit: Number(updatedFormData?.AllowDeliveryDateEdit),
        AllowManHourEdit: Number(updatedFormData?.AllowManHourEdit),
        ShowClientDeliveryDate: Number(updatedFormData?.ShowClientDeliveryDate),
        ShowClientManHour: Number(updatedFormData?.ShowClientManHour),
        AllowExpenseApprove: Number(updatedFormData?.AllowExpenseApprove),
        AllowTicketAssignTo: Number(updatedFormData?.AllowTicketAssignTo),
        AllowAutobackup: Number(updatedFormData?.AllowAutobackup),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getFlagData = () => {
    axiosInstances
      .post(apiUrls?.GetFlag, {
        UserID: Number(ele?.visible?.showData?.id),
      })
      .then((res) => {
        setFlagdata(res?.data?.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    getFlagData();
  }, []);
  return (
    <>
      <div className="row m-2">
        <span style={{ fontWeight: "bold" }}>
          Employee Name: &nbsp; {ele?.visible?.showData?.realname}
        </span>
      </div>
      <div className="row m-2">
        <div
          className="search-col"
          style={{
            marginLeft: "8px",
            display: "flex",
            marginRight: "auto",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((col) => (
            <div
              key={col}
              style={{ display: "flex", flexDirection: "column", flex: 1 }}
            >
              {[
                { name: "DotNetMantis", label: "DotNetMantis" },
                { name: "AllowPaymentCancel", label: "AllowPaymentCancel" },
                { name: "LockUnLock", label: "LockUnLock" },
                { name: "AllowQuotaionCreate", label: "AllowQuotaionCreate" },
                { name: "AllowQuotationUpdate", label: "AllowQuotationUpdate" },
                {
                  name: "AllowQuotationApproved",
                  label: "AllowQuotationApproved",
                },
                { name: "AllowQuotationReject", label: "AllowQuotationReject" },
                { name: "AllowSalesBooking", label: "AllowSalesBooking" },
                { name: "AllowSalesUpdate", label: "AllowSalesUpdate" },
                { name: "AllowSalesReject", label: "AllowSalesReject" },
                { name: "AllowPICreate", label: "AllowPICreate" },
                { name: "AllowDeleteTicket", label: "AllowDeleteTicket" },
                { name: "IsActive", label: "IsActive" },
                { name: "AllowSentCircular", label: "AllowSentCircular" },
                { name: "AllowAddModule", label: "AllowAddModule" },
                { name: "AllowAddPages", label: "AllowAddPages" },
                {
                  name: "AllowDeliveryDateEdit",
                  label: "AllowDeliveryDateEdit",
                },
                { name: "AllowManHourEdit", label: "AllowManHourEdit" },
                {
                  name: "ShowClientDeliveryDate",
                  label: "ShowClientDeliveryDate",
                },
                { name: "ShowClientManHour", label: "ShowClientManHour" },
                { name: "AllowExpenseApprove", label: "AllowExpenseApprove" },
                { name: "AllowTicketAssignTo", label: "AllowTicketAssignTo" },
                { name: "AllowAutobackup", label: "AllowAutobackup" },
              ]
                .slice(col * Math.ceil(11 / 3), (col + 1) * Math.ceil(11 / 3))
                .map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <label className="switch" style={{ marginTop: "7px" }}>
                      <input
                        type="checkbox"
                        name={item.name}
                        checked={formData[item.name] == "1"}
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
                      {item.label}
                    </span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ManageFlagModal;
