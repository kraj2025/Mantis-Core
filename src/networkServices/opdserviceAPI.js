import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest, { axiosInstances } from "./axiosInstance";

export const Oldpatientsearch = async (searchKey, Type = 0) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.Oldpatientsearch}?SearchKey=${searchKey}&Type=${Type}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const PatientSearchbyBarcode = async (PatientID, PatientRegStatus) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.PatientSearchbyBarcode}?PatientID=${PatientID}&PatientRegStatus=${PatientRegStatus}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const bindPanelByPatientID = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.bindPanelByPatientID}?PatientId=${id}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const BindPRO = async (referDoctorID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindPRO}?referDoctorID=${referDoctorID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const GetBindDoctorDept = async (Department) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindDoctorDept}?Department=${Department}&CentreID=1`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const GetRoleWiseOPDServiceBookingControls = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.RoleWiseOPDServiceBookingControls}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const GetLoadOPD_All_ItemsLabAutoComplete = async (payload) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.LoadOPD_All_ItemsLabAutoComplete}`,
      {
        method: "post",
        data: payload,
      }
    );

    return data;
  } catch {
    throw error;
  }
};

export const GetPackageExpirayDate = async (PackageID) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.PackageExpirayDate}?PackageID=${PackageID}`,
      {
        method: "get",
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const GetValidateDoctorMap = async (itemID) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.ValidateDoctorMap}?itemID=${itemID}`,
      {
        method: "get",
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const GetValidateDoctorLeave = async (itemID) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.ValidateDoctorLeave}?itemID=${itemID}`,
      {
        method: "get",
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAlreadyPrescribeItem = async (PatientID, ItemID) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.getAlreadyPrescribeItem}?PatientID=${PatientID}&ItemID=${ItemID}`,
      {
        method: "get",
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const GetDiscountWithCoPay = async (
  itemID,
  panelID,
  patientTypeID,
  memberShipCardNo
) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetDiscountWithCoPay}?itemID=${itemID}&panelID=${panelID}&patientTypeID=${patientTypeID}&memberShipCardNo=${memberShipCardNo}`,
      {
        method: "get",
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const GetBindLabInvestigationRate = async (
  panelID,
  itemID,
  TID,
  IPDCaseTypeID,
  panelCurrencyFactor
) => {
  try {
    const data = await makeApiRequest(apiUrls.BindLabInvestigationRate, {
      method: "post",
      data: {
        panelID: panelID,
        itemID: itemID,
        tid: TID,
        ipdCaseTypeID: IPDCaseTypeID,
        panelCurrencyFactor: panelCurrencyFactor,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const GetAuthorization = async (Type) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindLabInvestigationRate}?Type=${Type}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetAppointmentCount = async (doctorID, appointmentDate) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetAppointmentCount}?doctorID=${doctorID}&appointmentDate=${appointmentDate}`,
      {
        method: "get",
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

// export const SearchOPDBillsData = async (params) => {
//   try {
//     const options = {
//       method: "POST",
//       data: params,
//     };
//     const data = await makeApiRequest(`${apiUrls.SearchOPDBills}`, {
//       method: "post",
//       data: params,
//     });
//     console.log("Asdasdas", data);
//     return data;
//   } catch {
//     throw error;
//   }
// };

export const SearchOPDBillsData = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SearchOPDBills}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const GetSwipMachine = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.GetSwipMachine}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log("Error Occure", error);
  }
};

export const ReceiptDetailnew = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetReceiptDetailnew}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log("Error Occure", error);
  }
};

export const GetDoctorAppointmentTimeSlotConsecutive = async (
  doctorID,
  appointmentDate
) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetDoctorAppointmentTimeSlotConsecutive}?DocId=${doctorID}&date=${appointmentDate}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const BindPackageItemDetailsNew = async (PackageID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindPackageItemDetailsNew}?PackageID=${PackageID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const GetInvestigationTimeSlot = async (
  Date,
  CentreID,
  SubCategoryID,
  ModalityID
) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetInvestigationTimeSlot}?Date=${Date}&CentreID=${CentreID}&SubCategoryID=${SubCategoryID}&ModalityID=${ModalityID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const BindModality = async (SubcategoryID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindModality}?SubcategoryID=${SubcategoryID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const HoldTimeSlot = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(apiUrls.HoldTimeSlot, {
      method: "post",
      data: params,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};
export const GetEligiableDiscountPercent = async (employeeID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetEligiableDiscountPercent}?employeeID=${employeeID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const CheckblacklistAPI = async (PackageID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.checkblacklist}?patientID=AM24-04150003&molbileno=2342342344`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};
export const GetDiscReasonList = async (type) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.GetDiscReason}?Type=${type}`, {
      method: "get",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};
export const BindDisApprovalList = async (HOSPITAL, type) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindDisApproval}?approvalType=${HOSPITAL}&type=${type}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const BindInvestigation = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(apiUrls.BindInvestigation, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const GetLastVisitDetail = async (PatientID, DoctorID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetLastVisitDetail}?PatientID=${PatientID}&DoctorID=${DoctorID}  `,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const LastVisitDetails = async (PatientID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.LastVisitDetails}?patientID=${PatientID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};
export const GetImplementaionMaster= async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await axiosInstances(
      `${apiUrls?.GetImplementaiondropdown}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log("Error Occure", error);
  }
};
export const SaveImplementaionMaster= async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await axiosInstances(
      `${apiUrls?.InsertImplementaion}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log("Error Occure", error);
  }
};
export const DeleteImplementaionMaster= async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await axiosInstances(
      `${apiUrls?.DeleteImplementation}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log("Error Occure", error);
  }
};
export const UpdateImplementation= async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await axiosInstances(
      `${apiUrls?.UpdateImplementation}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log("Error Occure", error);
  }
};



