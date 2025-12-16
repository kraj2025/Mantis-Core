import React, { useEffect, useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";
import { apiUrls } from "../networkServices/apiEndpoints";
import axios from "axios";
import { toast } from "react-toastify";
import { headers } from "../utils/apitools";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import moment from "moment/moment";
import Loading from "../components/loader/Loading";
import { axiosInstances } from "../networkServices/axiosInstance";

const LeaveRequestModal = ({
  visible,
  setVisible,
  data,
  handleLeaveRequest_BindCalender,
}) => {


  const [loading, setLoading] = useState(false);
  const leaveData = visible?.CalenderDetails?.Table1?.find(
    (val) =>
      String(val?.Day) ===
      moment(visible?.data).format("DD-MMM-YYYY").split("-")[0]
  );

  const [OLTypeWise, setOLTypeWise] = useState([]);
  const [WOTypeWise, setWOTypeWise] = useState([]);
  const [HLTypeWise, setHLTypeWise] = useState([]);
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );
  const [formData, setFormData] = useState({
    LeaveType: leaveData?.Holiday,
    Description: leaveData?.LeaveDescription,
    OptionalType: "",
    OlType: "",
    woType: "",
    hlType: "",
  });

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name == "LeaveType") {
      setFormData({
        ...formData,
        [name]: value,
        OptionalType: "",
        OlType: "",
        woType: "",
        hlType: "",
      });
    } else if (name == "woType") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (name == "OlType") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (name == "hlType") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const getOLTypeWise = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
    axiosInstances
      .post(apiUrls.WOandOLTypeWise, {
        Month: String(currentMonth),
        Year: String(currentYear),
        CrmEmpID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        LeaveType: Number(1),
      })
      .then((res) => {
        const verticals = res?.data?.dtOL?.map((item) => {
          return { label: item?.Day, value: item?.Day };
        });
        setOLTypeWise(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getWOTypeWise = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
    axiosInstances
      .post(apiUrls.WOandOLTypeWise, {
        Month: String(currentMonth),
        Year: String(currentYear),
        CrmEmpID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        LeaveType: Number(2),
      })
      .then((res) => {
        const verticals = res?.data?.dtSunday?.map((item) => {
          return { label: item?.Day, value: item?.Day };
        });
        setWOTypeWise(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getHLTypeWise = () => {
    // let form = new FormData();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
    axiosInstances
      .post(apiUrls.WOandOLTypeWise, {
        Month: String(currentMonth),
        Year: String(currentYear),
        CrmEmpID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        LeaveType: Number(3),
      })
      .then((res) => {
        const verticals = res?.data?.dtHoly?.map((item) => {
          return { label: item?.Day, value: item?.Day };
        });
        setHLTypeWise(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const leaveDataFilter = visible?.CalenderDetails?.Table || [];
  const getLeaveAvailable = (leaveType) => {
    const leave = leaveDataFilter.find((item) => item?.LeaveType === leaveType);
    return leave ? leave.Available : "0";
  };
  const handleLeaveRequest_Save = () => {
    if (!formData?.LeaveType) {
      toast.error("Please Select LeaveTypee.");
      return;
    }
    if (formData?.LeaveType === "COMP-Off" && !formData?.OptionalType) {
      toast.error("Please Select Optional Type.");
      return;
    }
    if (formData?.OptionalType == "1" && !formData?.OlType) {
      toast.error("Please Select OL Type.");
      return;
    }
    if (formData?.OptionalType == "2" && !formData?.woType) {
      toast.error("Please Select Sunday.");
      return;
    }
    if (formData?.OptionalType == "3" && !formData?.hlType) {
      toast.error("Please Select Holiday.");
      return;
    }
    if (!formData?.Description) {
      toast.error("Please Enter Description.");
      return;
    }
    setLoading(true);
    axiosInstances
      .post(apiUrls.LeaveRequest_Save, {
        FromDate: String(moment(visible?.data).format("YYYY-MM-DD")),
        CrmEmpID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        LeaveType: String(formData?.LeaveType),
        Description: String(formData?.Description),
        StatusType: String("Save"),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          setVisible(false);
          handleLeaveRequest_BindCalender();
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleLeaveRequest_Update = () => {
    setLoading(true);
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      form.append(
        "LoginName",
        useCryptoLocalStorage("user_Data", "get", "realname")
      ),
      form.append(
        "CRMEmpID",
        useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
      ),
      form.append("FromDate", moment(visible?.data).format("YYYY-MM-DD")),
      form.append("LeaveType", formData?.LeaveType),
      form.append("OptionalType", formData?.OptionalType || ""),
      form.append("Description", formData?.Description),
      form.append("StatusType", "Update"),
      form.append(
        "LeaveTypeDateValue",
        formData?.woType || formData?.OlType || formData?.hlType
      ),
      axios
        .post(apiUrls?.LeaveRequest_Save, form, { headers })
        .then((res) => {
          if (res?.data?.status === true) {
            toast.success(res?.data?.message);
            setLoading(false);
            setVisible(false);
            handleLeaveRequest_BindCalender();
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
  };

  const handleLeaveRequest_Approve = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.LeaveRequest_Save, {
        FromDate: String(moment(visible?.data).format("YYYY-MM-DD")),
        CrmEmpID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        LeaveType: String(formData?.LeaveType),
        Description: String(formData?.Description),
        StatusType: String("Approve"),
      })

      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          handleLeaveRequest_BindCalender();
          setVisible(false);
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleLeaveRequest_Delete = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.LeaveRequest_Save, {
        FromDate: String(moment(visible?.data).format("YYYY-MM-DD")),
        CrmEmpID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
        LeaveType: String(formData?.LeaveType),
        Description: String(formData?.Description),
        StatusType: String("Delete"),
      })
      .then((res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message);
          setLoading(false);
          handleLeaveRequest_BindCalender();
          setVisible(false);
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getOLTypeWise();
    getWOTypeWise();
    getHLTypeWise();
  }, []);

  const leaveOptions = [
    { label: "CL", value: "CL" },
    { label: "SL", value: "SL" },
    { label: "Week Off", value: "WO" },
    { label: "Comp Off", value: "COMP-Off" },
    // { label: "CL/CIR", value: "CL/CIR" },
    // { label: "SL/CIR", value: "SL/CIR" },
    { label: "Optional Leave", value: "OL" },
    { label: "Leave Without Pay", value: "LWP" },
  ];

  const filteredLeaveOptions = leaveOptions?.filter((opt) => {
    if (["CL", "SL", "OL", "WO"].includes(opt.value)) {
      return getLeaveAvailable(opt.value) > 0;
    }
    // keep all others always
    return true;
  });
  return (
    <>
      <div className="">
        <div className="row m-2 d-flex">
          <div className="col-sm-6">
            <ReactSelect
              name="LeaveType"
              respclass="col-md-12 col-12 col-sm-12"
              placeholderName="Leave Type"
              // dynamicOptions={[
              //   { label: "CL", value: "CL" },
              //   { label: "SL", value: "SL" },
              //   { label: "Week Off", value: "WO" },
              //   { label: "Comp Off", value: "Comp Off" },
              //   { label: "CL/CIR", value: "CL/CIR" },
              //   { label: "SL/CIR", value: "SL/CIR" },
              //   { label: "Optional Leave", value: "OL" },
              //   { label: "Leave Without Pay", value: "LWP" },
              // ]}
              dynamicOptions={filteredLeaveOptions}
              value={formData?.LeaveType}
              handleChange={handleDeliveryChange}
            />

            {formData?.LeaveType == "COMP-Off" && (
              <ReactSelect
                respclass="col-md-12 col-12 col-sm-12 mt-2"
                name="OptionalType"
                placeholderName="Optional Type"
                dynamicOptions={[
                  { label: "Against Optional Leave", value: "1" },
                  { label: "Against Sunday", value: "2" },
                  { label: "Against Holiday", value: "3" },
                ]}
                handleChange={handleDeliveryChange}
                value={formData?.OptionalType}
              />
            )}

            {formData?.OptionalType == "1" && (
              <ReactSelect
                respclass="col-md-12 col-12 col-sm-12 mt-2"
                name="OlType"
                placeholderName="OL Type"
                dynamicOptions={OLTypeWise}
                handleChange={handleDeliveryChange}
                value={formData?.OlType}
              />
            )}

            {formData?.OptionalType == "2" && (
              <ReactSelect
                respclass="col-md-12 col-12 col-sm-12 mt-2"
                name="woType"
                placeholderName="Sunday"
                dynamicOptions={WOTypeWise}
                handleChange={handleDeliveryChange}
                value={formData?.woType}
              />
            )}

            {formData?.OptionalType == "3" && (
              <ReactSelect
                respclass="col-md-12 col-12 col-sm-12 mt-2"
                name="hlType"
                placeholderName="Holiday "
                dynamicOptions={HLTypeWise}
                handleChange={handleDeliveryChange}
                value={formData?.hlType}
              />
            )}

            <textarea
              type="text"
              respclass="col-md-12 col-12 col-sm-12"
              className="mt-2"
              placeholder="Description "
              id={"Description"}
              name="Description"
              value={formData?.Description}
              onChange={handleChange}
              style={{ width: "95%", marginLeft: "7.5px", height: "110px" }}
            ></textarea>
          </div>
          <div className="col-sm-6">
            <div style={{ padding: "10px" }}>
              <ul style={{ listStyleType: "none", padding: "0" }}>
                <li>
                  <strong>Pending CL : {getLeaveAvailable("CL")}</strong>
                </li>
                <li>
                  <strong>Pending SL : {getLeaveAvailable("SL")}</strong>
                </li>
                <li>
                  <strong>Pending OL : {getLeaveAvailable("OL")}</strong>
                </li>
              </ul>
              <p style={{ color: "red", fontWeight: "bold" }}>
                <span>Note:</span> Pending SL will carry forward in next
                financial year
              </p>
              <p style={{ color: "red", fontWeight: "bold" }}>
                <span>Note:</span> Maximum optional leave from January to
                December is 3
              </p>
              <p style={{ color: "red", fontWeight: "bold" }}>
                <span>Note:</span> You are eligible to take only one optional
                leave each month.
              </p>
            </div>
          </div>

          {leaveData?.IsApproved > 0 ? (
            <span
              style={{
                fontWeight: "bold",
                color: "green",
                marginLeft: "10px",
              }}
            >
              Leave Approved
            </span>
          ) : (
            <div className="col-1 d-flex">
              {data ? (
                <>
                  {loading ? (
                    <Loading />
                  ) : (
                    <button
                      className="btn btn-sm mb-2"
                      style={{
                        background: "#0eb342",
                        color: "white",
                        border: "none",
                      }}
                      onClick={handleLeaveRequest_Approve}
                    >
                      Approve
                    </button>
                  )}
                </>
              ) : (
                <>
                  {loading ? (
                    <Loading />
                  ) : (
                    <div>
                      <button
                        className="btn btn-sm mb-2"
                        style={{
                          background: "#0eb342",
                          color: "white",
                          border: "none",
                        }}
                        onClick={handleLeaveRequest_Save}
                        disabled={[
                          "CL",
                          "SL",
                          "Comp Off",
                          "COMP-Off",
                          "WO",
                          "LWP",
                          "OL",
                        ].includes(leaveData?.Holiday)}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {/* {loading ? (
                    <Loading />
                  ) : (
                    <div>
                      <button
                        className="btn btn-sm mb-2 ml-2"
                        style={{
                          background: "#0eb342",
                          color: "white",
                          border: "none",
                        }}
                        onClick={handleLeaveRequest_Update}
                      >
                        Update
                      </button>
                    </div>
                  )} */}
                </>
              )}
              {/* <button
                className="btn btn-sm mb-2 ml-2"
                style={{ background: "red", color: "white", border: "none" }}
                onClick={handleLeaveRequest_Delete}
              >
                Cancel
              </button> */}
            </div>
          )}

          {((leaveData?.IsApproved === 1 && ReportingManager == "1") ||
            leaveData?.IsApproved === 0) && (
            <button
              className="btn btn-sm mb-2 ml-4"
              style={{ background: "red", color: "white", border: "none" }}
              onClick={handleLeaveRequest_Delete}
            >
              Cancel
            </button>
          )}

          {/* <button
            className="btn btn-sm mb-2 ml-2"
            style={{ background: "#fc0366", color: "white", border: "none" }}
            onClick={() => setVisible(false)}
          >
            Close
          </button> */}
        </div>
      </div>
    </>
  );
};
export default LeaveRequestModal;
