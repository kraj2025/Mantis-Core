import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import ReactSelect from "../components/formComponent/ReactSelect";
import { apiUrls } from "../networkServices/apiEndpoints";
import Input from "../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import DatePicker from "../components/formComponent/DatePicker";
import { inputBoxValidation } from "../utils/utils";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../utils/constant";
import Modal from "../components/modalComponent/Modal";
import LeadConvertModal from "./LeadConvertModal";
import LeadDeadModal from "./LeadDeadModal";
import Tables from "../components/UI/customTable";
import SlideScreen from "./SlideScreen";
import SeeMoreSlideScreen from "../components/SearchableTable/SeeMoreSlideScreen";
import moment from "moment";
import { toast } from "react-toastify";
import SalesLeadLog from "./SalesLeadLog";
import LeadApproveDetail from "./LeadApproveDetail";
import gmaillogo from "../../src/assets/image/Gmail_Logo.png";
import Tooltip from "./Tooltip";
import { axiosInstances } from "../networkServices/axiosInstance";
import Loading from "../components/loader/Loading";
const SalesLead = () => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [listVisible, setListVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [project, setProject] = useState([]);
  const [assignto, setAssignedto] = useState([]);
  const [productversion, setProductVersion] = useState([]);
  const [formData, setFormData] = useState({
    ProjectID: [],
    AssignedTo: [],
    FromDate: new Date(),
    ToDate: new Date(),
    OrganizationName: "",
    Country: "",
    State: "",
    City: "",
    Centre: "",
    SoftwareVertical: "",
    ContactPersonName: "",
    ContactPersonMobile: "",
    Website: "",
    ReferralSource: "",
    ContactPersonEmail: "",
    ContactPersonDesignation: "",
    DateType: "1",
    ProductVersion: "",
    OtherVersion: "",
  });
  const handleDeliveryChange = (name, e) => {
    const { value } = e;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getProject = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   axios
    //     .post(apiUrls?.ProjectSelect, form, { headers })
    axiosInstances
      .post(apiUrls?.ProjectSelect, {})
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { name: item?.Project, code: item?.ProjectId };
        });
        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProduct = (value) => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   axios
    //     .post(apiUrls?.GetProductVersion, form, {
    //       headers,
    //     })
    axiosInstances
      .post(apiUrls?.GetProductVersion, {})
      .then((res) => {
        const states = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.id };
        });
        setProductVersion(states);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAssignTo = () => {
    // let form = new FormData();
    // form.append("ID", "0"),
    //   axios
    //     .post(apiUrls?.AllEmployeeSearch, form, { headers })
    axiosInstances
      .post(apiUrls?.AllEmployeeSearch, {})
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { name: item?.realname, code: item?.id };
        });
        setAssignedto(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: selectedValues,
    }));
  };
  const searchHandleChange = (e, index) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const salesTHEAD = [
    "S.No.",
    "Lead No.",
    "Organization Name",
    "Project Name",
    "Refer Details",
    "Loaction Details",
    "Software Details",
    "SPOC Details",
    // "Website",
    "CreatedBy",
    { name: "Action", width: "5%" },
    "Converted",
    "Email",
    "Edit",
  ];
  const shortenName = (name) => {
    return name.length > 10 ? name.substring(0, 15) + "..." : name;
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(tableData?.length / rowsPerPage);
  const currentData = tableData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleSearch = (code) => {
    setLoading(true);

    const payload = {
      Country: String(formData?.Country),
      City: String(formData?.City),
      OrganizationName: String(formData?.OrganizationName),
      State: String(formData?.State),
      IsUpcomingCentre: Number(formData?.Centre),
      SoftwareVertical: String(formData?.SoftwareVertical),
      SPOC: String(formData?.ContactPersonName),
      SPOC_Mobile: String(formData?.ContactPersonMobile),
      Website: String(formData?.Website),
      ReferralSource: String(formData?.ReferralSource),
      ReferProjectID: String(formData?.ProjectID),
      ReferEmployeeID: String(formData?.AssignedTo),
      FromDate: moment(formData?.FromDate).format("YYYY-MM-DD"),
      ToDate: moment(formData?.ToDate).format("YYYY-MM-DD"),
      DateType: String(formData?.DateType),
      SoftwareVersionID: Number(formData?.ProductVersion),
      RowColor: Number(code ? code : ""),
    };
    axiosInstances
      .post(apiUrls?.SearchSalesLeads, payload)
      .then((res) => {
        const data = res?.data?.data;
        if (res.data.success === true) {
          const updatedData = data?.map((ele, index) => {
            return {
              ...ele,
              index: index,
              IsActive: "0",

              DeadDropDown: "",
              DeadResolve: false,
              DeadDropDownValue: "",

              ConvertDropDown: "",
              ConvertResolve: false,
              ConvertDropDownValue: "",
            };
          });
          setTableData(updatedData);
          setLoading(false);
        } else {
          toast.error("Data Not Found.");
          setTableData([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const [visible, setVisible] = useState({
    ShowConvert: false,
    ShowDead: false,
    ShowLog: false,
    ShowApprove: false,
    showData: {},
  });

  const handleDeliveryChangeValue = (name, value, index, ele) => {
    tableData?.map((val, ind) => {
      if (index !== ind) {
        val["TableStatus"] = null;
      }
      return val;
    });

    const data = [...tableData];
    data[index]["TableStatus"] = value;

    if (value === "Convert") {
      data[index]["ConvertResolve"] = true;
      setTableData(data);
      setVisible({
        ShowConvert: true,
        ShowDead: false,
        showData: data[index],
      });
    } else if (value === "Dead") {
      data[index]["DeadResolve"] = true;
      setTableData(data);
      setVisible({
        ShowConvert: false,
        ShowDead: true,
        showData: data[index],
      });
    } else {
      setTableData(data);
      setVisible({
        ShowConvert: false,
        ShowDead: false,
        showData: {},
      });
    }
  };
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const ModalComponent = (name, component) => {
    setListVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };
  const [seeMore, setSeeMore] = useState([]);

  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };
  useEffect(() => {
    getProject();
    getAssignTo();
    getProduct();
  }, []);

  return (
    <>
      {visible?.ShowConvert && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Sales Lead Convert")}
        >
          <LeadConvertModal
            visible={visible}
            setVisible={setVisible}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      {visible?.ShowDead && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Sales Lead Dead")}
        >
          <LeadDeadModal
            visible={visible}
            setVisible={setVisible}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      {visible?.ShowLog && (
        <Modal
          modalWidth={"700px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Sales Lead Log")}
        >
          <SalesLeadLog
            visible={visible}
            setVisible={setVisible}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      {visible?.ShowApprove && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Approve Details")}
        >
          <LeadApproveDetail
            visible={visible}
            setVisible={setVisible}
            handleSearch={handleSearch}
          />
        </Modal>
      )}
      <div className="card">
        <Heading
          isBreadcrumb={true}
          secondTitle={
            <span style={{ fontWeight: "bold" }}>
              <Link to="/SalesLeadCreate" className="ml-3">
                Create Sales Lead
              </Link>
            </span>
          }
        />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            id="OrganizationName"
            name="OrganizationName"
            lable="Organization Name"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.OrganizationName}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            className="form-control"
            id="Country"
            name="Country"
            lable="Country"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.Country}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="State"
            name="State"
            lable="State"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.State}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="City"
            name="City"
            lable="City"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.City}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="Centre"
            placeholderName="Centre"
            dynamicOptions={[
              { label: "Upcoming", value: 1 },
              { label: "Existing", value: 2 },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.Centre}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-4 col-12 mt-1"
            name="SoftwareVertical"
            placeholderName="Software Vertical"
            dynamicOptions={[
              { label: "LIMS", value: "LIMS" },
              { label: "HIMS", value: "HIMS" },
              { label: "Both", value: "Both" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.SoftwareVertical}
          />
          <Input
            type="text"
            className="form-control mt-1"
            id="ContactPersonName"
            name="ContactPersonName"
            lable="Contact Person Name"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.ContactPersonName}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control mt-1"
            id="ContactPersonMobile"
            name="ContactPersonMobile"
            lable="Contact Person Mobile"
            placeholder=" "
            onChange={(e) => {
              inputBoxValidation(
                MOBILE_NUMBER_VALIDATION_REGX,
                e,
                handleSelectChange
              );
            }}
            value={formData?.ContactPersonMobile}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control mt-1"
            id="Website"
            name="Website"
            lable="Website"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.Website}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control mt-1"
            id="ReferralSource"
            name="ReferralSource"
            lable="Referral Source"
            placeholder=" "
            onChange={handleSelectChange}
            value={formData?.ReferralSource}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
            name="ProjectID"
            placeholderName={t("Project")}
            dynamicOptions={project}
            handleChange={handleMultiSelectChange}
            value={formData?.ProjectID?.map((code) => ({
              code,
              name: project.find((item) => item.code === code)?.name,
            }))}
          />
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
            name="AssignedTo"
            placeholderName={t("Refer Employee")}
            dynamicOptions={assignto}
            handleChange={handleMultiSelectChange}
            value={formData?.AssignedTo?.map((code) => ({
              code,
              name: assignto.find((item) => item.code === code)?.name,
            }))}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="ProductVersion"
            placeholderName="Software Version"
            dynamicOptions={productversion}
            handleChange={handleDeliveryChange}
            value={formData.ProductVersion}
          />

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="DateType"
            placeholderName="DateType"
            dynamicOptions={[
              { label: "Entry Date", value: "1" },
              { label: "Converted Date", value: "2" },
              { label: "Dead Date", value: "3" },
            ]}
            handleChange={handleDeliveryChange}
            value={formData.DateType}
          />
          <DatePicker
            className="custom-calendar"
            id="FromDate"
            name="FromDate"
            lable={t("From Date")}
            placeholder={VITE_DATE_FORMAT}
            value={formData?.FromDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
            // requiredClassName={"required-fields"}
          />
          <DatePicker
            className="custom-calendar"
            id="ToDate"
            name="ToDate"
            lable={t("To Date")}
            placeholder={VITE_DATE_FORMAT}
            value={formData?.ToDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={searchHandleChange}
          />
          {loading ? (
            <Loading />
          ) : (
            <button
              className="btn btn-sm btn-primary ml-2"
              onClick={() => handleSearch("")}
            >
              Search
            </button>
          )}
        </div>
      </div>

      {tableData?.length > 0 && (
        <div className="card mt-2">
          <Heading
            title={<span style={{ fontWeight: "bold" }}>Search Details</span>}
            secondTitle={
              <div className="d-flex flex-wrap align-items-center">
                <div
                  className="d-flex"
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="legend-circle"
                    style={{
                      backgroundColor: "#ffffff",
                      borderColor: "black",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearch("10")}
                  ></div>
                  <span
                    className="legend-label ml-2"
                    style={{
                      width: "90%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Open")} (
                    {tableData[0]?.OpenCount ? tableData[0]?.OpenCount : 0})
                  </span>
                </div>
                <div
                  className="d-flex"
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="legend-circle"
                    style={{
                      backgroundColor: "#95f59f",
                      borderColor: "black",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearch("20")}
                  ></div>
                  <span
                    className="legend-label ml-2"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Convert")} (
                    {tableData[0]?.ConvertedCount
                      ? tableData[0]?.ConvertedCount
                      : 0}
                    )
                  </span>
                </div>

                <div
                  className="d-flex "
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="legend-circle"
                    style={{
                      backgroundColor: "#fc5353",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearch("30")}
                  ></div>
                  <span
                    className="legend-label"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Dead")}(
                    {tableData[0]?.DeadCount ? tableData[0]?.DeadCount : 0})
                  </span>
                </div>

                <span className="mr-1 ml-5" style={{ fontWeight: "bold" }}>
                  Total Record :&nbsp; {tableData?.length}
                </span>
              </div>
            }
          />
          <Tables
            thead={salesTHEAD}
            tbody={currentData?.map((ele, index) => ({
              "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
              "Lead No.": (
                <Tooltip label={ele?.LeadNum}>
                  <span
                    id={`LeadNum-${index}`}
                    targrt={`LeadNum-${index}`}
                    style={{ textAlign: "center" }}
                  >
                    {shortenName(ele?.LeadNum)}
                  </span>
                </Tooltip>
              ),
              "Organization Name": (
                <Tooltip label={ele?.OrganizationName}>
                  <span
                    id={`LeadNum-${index}`}
                    targrt={`LeadNum-${index}`}
                    style={{ textAlign: "center" }}
                  >
                    {shortenName(ele?.OrganizationName)}
                  </span>
                </Tooltip>
              ),
              "Project Name": (
                <Tooltip label={ele?.ReferProject}>
                  <span
                    id={`projectName-${index}`}
                    targrt={`projectName-${index}`}
                    style={{ textAlign: "center" }}
                  >
                    {shortenName(ele?.ReferProject)}
                  </span>
                </Tooltip>
              ),
              "Refer Details": (
                <span>
                  Employee: {ele?.ReferEmployee} <br></br> Source:{" "}
                  {ele?.ReferralSource}
                  <br></br> Website:{" "}
                  <Tooltip label={ele?.Website}>
                    <span
                      id={`Website-${index}`}
                      targrt={`Website-${index}`}
                      style={{ textAlign: "center" }}
                    >
                      {shortenName(ele?.Website)}
                    </span>
                  </Tooltip>
                </span>
              ),
              "Location Details": (
                <span>
                  Country: {ele?.Country} <br></br> State: {ele?.State}{" "}
                  <br></br>City: {ele?.City}
                </span>
              ),

              "Software Details": (
                <span>
                  Vertical: {ele?.SoftwareVertical} <br></br> Version :{" "}
                  {ele?.SoftwareVersionName} <br></br>Centre:{" "}
                  {ele?.IsUpcomingCentre == 1 ? "Upcoming" : "Existing"}
                </span>
              ),
              "SPOC Details": (
                <span>
                  Name: {ele?.SPOC} <br></br> Mobile : {ele?.SPOC_Mobile}{" "}
                  <br></br>Email: {ele?.SPOC_EmailID}
                </span>
              ),

              // Website: (
              //   <Tooltip label={ele?.Website}>
              //     <span
              //       id={`Website-${index}`}
              //       targrt={`Website-${index}`}
              //       style={{ textAlign: "center" }}
              //     >
              //       {shortenName(ele?.Website)}
              //     </span>
              //   </Tooltip>
              // ),

              CreatedBy: (
                <span>
                  Name: {ele?.CreatedBy} <br></br> Date :{" "}
                  {new Date(ele.dtEntry).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                </span>
              ),
              // CreatedDate: new Date(ele.dtEntry).toLocaleDateString("en-GB", {
              //   day: "2-digit",
              //   month: "short",
              //   year: "numeric",
              // }),

              Action: (
                <>
                  <ReactSelect
                    // style={{ width: "50%" }}
                    name="TableStatus"
                    id="TableStatus"
                    respclass="width80px"
                    placeholderName="Status"
                    // dynamicOptions={[
                    //   { label: "Convert", value: "Convert" },
                    //   { label: "Dead", value: "Dead" },
                    // ]}
                    dynamicOptions={[
                      ...(ele?.IsConverted === 0 && ele?.IsDead === 0
                        ? [{ label: "Convert", value: "Convert" }]
                        : []),
                      ...(ele?.IsDead === 0 && ele?.IsConverted === 0
                        ? [{ label: "Dead", value: "Dead" }]
                        : []),
                    ]}
                    value={ele?.TableStatus}
                    handleChange={(name, value) => {
                      const ind = (currentPage - 1) * rowsPerPage + index;
                      handleDeliveryChangeValue(name, value?.value, ind, ele);
                    }}
                  />
                </>
              ),
              // Action: (
              //   <>
              //     <i style={{ cursor: "pointer" }}></i>
              //     <div className="">
              //       <span className="">
              //         <AmountSubmissionSeeMoreList
              //           ModalComponent={ModalComponent}
              //           setSeeMore={setSeeMore}

              //           data={{ ...ele, type: "Lead" }}
              //           setVisible={() => {
              //             setListVisible(false);
              //           }}
              //           handleBindFrameMenu={[
              //             {
              //               FileName: "Sales Lead Convert",
              //               URL: "LeadConvertModal",
              //               FrameName: "LeadConvertModal",
              //               Description: "LeadConvertModal",
              //             },
              //             {
              //               FileName: "Sales Lead Dead",
              //               URL: "LeadDeadModal",
              //               FrameName: "LeadDeadModal",
              //               Description: "LeadDeadModal",
              //             },
              //             {
              //               FileName: "Sales Lead Log",
              //               URL: "SalesLeadLog",
              //               FrameName: "SalesLeadLog",
              //               Description: "SalesLeadLog",
              //             },
              //           ]}
              //           isShowPatient={true}
              //         />
              //       </span>
              //     </div>
              //   </>
              // ),
              Converted: ele?.IsConverted == 1 && (
                <i
                  className="fa fa-eye"
                  onClick={() => {
                    setVisible({
                      ShowApprove: true,
                      showData: ele,
                    });
                  }}
                ></i>
              ),
              Email: (
                <img
                  src={gmaillogo}
                  height={"10px"}
                  onClick={() => {
                    setVisible({
                      ShowLog: true,
                      showData: ele,
                    });
                  }}
                  title="Click to Gmail."
                  style={{ marginLeft: "12px" }}
                ></img>
              ),
              Edit: (
                <Link
                  to="/SalesLeadCreate"
                  state={{ data: ele?.ID, edit: true, givenData: ele }}
                  style={{ cursor: "pointer" }}
                >
                  Edit
                </Link>
              ),
              colorcode: ele?.RowColor,
            }))}
            tableHeight={"tableHeight"}
          />
          <SlideScreen
            visible={listVisible}
            setVisible={() => {
              setListVisible(false);
              setRenderComponent({
                name: null,
                component: null,
              });
            }}
            Header={
              <SeeMoreSlideScreen
                name={renderComponent?.name}
                seeMore={seeMore}
                handleChangeComponent={handleChangeComponent}
              />
            }
          >
            {renderComponent?.component}
          </SlideScreen>
          <div className="pagination ml-auto">
            <div>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SalesLead;
