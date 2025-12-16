import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../components/UI/Heading";
import Input from "../components/formComponent/Input";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../utils/constant";
import ReactSelect from "../components/formComponent/ReactSelect";
import { toast } from "react-toastify";
import NewTicketModal from "../components/UI/customTable/NetTicketModal";
import Modal from "../components/modalComponent/Modal";
import {
  handleReactSelectDropDownOptions,
  inputBoxValidation,
} from "../utils/utils";
import { apiUrls } from "../networkServices/apiEndpoints";
import { Tabfunctionality } from "../utils/helpers";
import PageNameModal from "../components/UI/customTable/PageNameModal";
import Tables from "../components/UI/customTable";
import { useSelector } from "react-redux";
import BrowseInput from "../components/formComponent/BrowseInput";

import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const ReportIssue = ({ visibleTicket }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [t] = useTranslation();
  const [ticketid, setticketid] = useState("");

  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    ProjectID: visibleTicket?.showData?.ProjectID
      ? visibleTicket?.showData?.ProjectID
      : "",
    Category: visibleTicket?.showData?.CategoryID
      ? visibleTicket?.showData?.CategoryID
      : "",
    AssignedTo: "",
    Incharge: "",
    Priority: visibleTicket?.showData?.Priority
      ? visibleTicket?.showData?.Priority
      : "",
    ReportedName: "",
    ReportedMobile: "",
    Description: visibleTicket?.showData?.description
      ? visibleTicket?.showData?.description
      : "",
    Summary: visibleTicket?.showData?.summary
      ? visibleTicket?.showData?.summary
      : "",
    IsActive: "",
    ModuleName: "",
    PageName: "",
    ProductVersion: "",
    OwnerName: "",
    OwnerMobile: "",
    OwnerEmail: "",
    ItPersonName: "",
    ItPersonMobile: "",
    ItPersonEmail: "",
    SPOC_Name: "",
    SPOC_Mobile: "",
    SPOC_EmailID: "",
    DocumentType: "",
    SelectFile: "",
    Document_Base64: "",
    FileExtension: "",
  });
  const [project, setProject] = useState([]);
  const [category, setCategory] = useState([]);
  const [assignto, setAssignedto] = useState([]);
  const [priority, setPriority] = useState([]);
  const [moduleName, setModuleName] = useState([]);
  const [incharge, setIncharge] = useState([]);
  const [productversion, setProductVersion] = useState([]);
  const [pageName, setPageName] = useState([]);
  const [displayModulePage, setDisplayModulePage] = useState([]);

  const handleDeliveryChange = (name, e) => {
    if (name === "ProjectID") {
      setFormData({
        ...formData,
        [name]: e.value, // Project ka value
        Category: "",
        ModuleName: "",
        PageName: "",
        Incharge: "",
        ProductVersion: "",
      });
      getAssignTo(e.value);
      getCategory(e.value);
      // getModule(e.value);
      getPage(e.value);
      getGetProjectInfo(e.value);
      getProductModule(e.value);
    } else if (name === "Category") {
      setFormData({
        ...formData,
        [name]: e,
      });
    } else if (name === "ModuleName") {
      setFormData({
        ...formData,
        [name]: e.value,
        Incharge: "",
      });

      getIncharge(e.value);
    } else {
      setFormData({
        ...formData,
        [name]: e?.value || e,
      });
    }
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  const AllowAddModule = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowAddModule"
  );
  const AllowAddPages = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowAddPages"
  );

  const handleChange1 = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      Summary: "",
      Description: value,
    }));
  };
  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        ProjectID: 0,
        IsMaster: "string",
        VerticalID: 0,
        TeamID: 0,
        WingID: 0,
      })
      .then((res) => {
        const datas = res?.data.data;
        const poc3s = datas.map((item) => {
          return { label: item?.Project, value: item?.ProjectId };
        });
        setProject(poc3s);
        if (datas.length > 0) {
          const singleProject = datas[0]?.ProjectId;
          setFormData((prev) => ({
            ...prev,
            ProjectID: singleProject,
          }));
          getAssignTo(singleProject);
          getCategory(singleProject);
          getPage(singleProject);
          getGetProjectInfo(singleProject);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function removeHtmlTags(text) {
    return text?.replace(/<[^>]*>?/gm, "");
  }

  const getCategory = (proj) => {
    axiosInstances
      .post(apiUrls.Category_Select, {
        RoleID: 0,
        ProjectID: proj,
      })

      .then((res) => {
        handleReactSelectDropDownOptions(res?.data.data, "NAME", "ID");
        // const poc3s = res?.data.data.map((item) => {
        //   return { label: item?.NAME, value: item?.ID };
        // });
        setCategory(
          handleReactSelectDropDownOptions(res?.data.data, "NAME", "ID")
        );
        // setFormData({ ...formData, Category: poc3s[0]?.value,ProjectID:proj });
        setDisplayModulePage(res?.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getIncharge = (value) => {
    axiosInstances
      .post(apiUrls.Reporter_Select_Module_Wise, {
        ID: value || "",
      })
      .then((res) => {
        const options = res?.data?.data?.map((item) => ({
          value: item.ID,
          label: item.NAME,
        }));
        setIncharge(options);
        setFormData((val) => ({
          ...val,
          Incharge: res.data.data[0]?.ID,
        }));
      })
      .catch((err) => console.log(err));
  };
  const getProductModule = (value) => {
    axiosInstances
      .post(apiUrls.Product_Select_Project_Wise, {
        ID: value || "",
      })
      .then((res) => {
        const options = res?.data?.data?.map((item) => ({
          value: item.ID,
          label: item.NAME,
        }));
        setProductVersion(options);
        setFormData((val) => ({
          ...val,
          ProductVersion: res.data.data[0]?.ID,
        }));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getProductModule(formData?.ProjectID);
  }, [formData?.ProjectID]);

  useEffect(() => {
    getModule(formData?.ProductVersion);
  }, [formData?.ProductVersion]);

  const getModule = () => {
    axiosInstances
      .post(apiUrls.Module_Select_Product_Wise, {
        ID: formData?.ProductVersion,
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return {
            label: item?.NAME,
            value: item?.ID,
            inchargeID: item?.InchargeID,
          };
        });
        setModuleName(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getPage = (proj) => {
    axiosInstances
      .post(apiUrls.Pages_Select, {
        RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
        ProjectID: proj,
        IsActive: 1,
        IsMaster: 0,
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.PagesName, value: item?.ID };
        });
        setPageName(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handlerefresh = () => {
    getPage(formData?.ProjectID);
  };

  const getAssignTo = (value) => {
    axiosInstances
      .post(apiUrls.AssignTo_Select, {
        ProjectID: value,
      })
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { label: item?.Name, value: item?.ID };
        });
        setAssignedto(assigntos);
      })
      .catch((err) => {
        console.log(err);
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

  const getPriority = () => {
    axiosInstances
      .post(apiUrls.Priority_Select, {})
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.ID };
        });
        setPriority(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function getlabel(id, dropdownData) {
    const ele = dropdownData?.filter((item) => item?.value === id);
    return ele?.length > 0 ? ele[0].label : undefined;
  }

  const getReportNote = async () => {
    if (!formData?.ProjectID) {
      toast.error("Please Select Project.");
      return;
    }
    if (!formData?.Category) {
      toast.error("Please Select Category.");
      return;
    }
    if (!formData?.Priority) {
      toast.error("Please Select Priority.");
      return;
    }
    if (!formData?.Summary) {
      toast.error("Please Enter Summary.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstances.post(apiUrls.NewTicket, {
        ProjectID: Number(formData.ProjectID || 0),
        CategoryID: Number(formData.Category?.value || 0),
        AssignTo: String(formData.AssignedTo || "0"),
        PriorityID: String(formData.ProjectID || "0"),
        Summary: String(formData.Summary || ""),
        ReporterMobileNo: String(formData.ReportedMobile || ""),
        ReporterName: String(formData.ReportedName || ""),
        Description: String(formData.Description || ""),
        ModuleID: String(formData.ModuleName || "0"),
        ProductVersion: String(formData.ProductVersion),
        ModuleName: String(getlabel(formData?.ModuleName, moduleName) || ""),
        PagesID: String(formData.PageName || "0"),
        PagesName: String(getlabel(formData?.PageName, pageName) || ""),
        ReferenceTicketID: String(visibleTicket?.showData?.TicketID || ""),
        InchargeID: String(formData.Incharge || ""),
        InchargeName: getlabel(formData?.Incharge, incharge) || "",
        ImageDetails: [
          {
            FileExtension: String(formData?.FileExtension || ""),
            Document_Base64: String(formData?.Document_Base64 || ""),
          },
        ],
      });

      toast.success(response?.data?.message);

      if (response?.data?.status) {
        setticketid(response.data.TicketID);
        if (formData?.IsActive === "1") {
          setVisible({ showVisible: true, visible: response.data.data });
        }
      }
    } catch (error) {
      toast.error("An error occurred while submitting the Ticket.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          Summary: "",
          Description: "",
          Document_Base64: "",
          SelectFile: "",
          FileExtension: "",
        }));
      }, 0);
    }
  };

  useEffect(() => {
    getProject();
    getPriority();
  }, []);

  const [visible, setVisible] = useState({
    showVisible: false,
    showModuleVisible: false,
    showPageVisible: false,
    showData: {},
  });

  const ownerTHEAD = [
    { name: t("S.No."), width: "5%" },
    t("Type"),
    t("Name"),
    t("Mobile"),
    t("Email"),
  ];
  const itPersonTHEAD = [
    { name: t("S.No."), width: "5%" },
    t("Type"),
    t("Name"),
    t("Mobile"),
    t("Email"),
  ];

  const [levelData, setLevelData] = useState([]);

  const getGetProjectInfo = (id) => {
    axiosInstances
      .post(apiUrls.GetProjectInfo, {
        ProjectID: id,
      })
      .then((res) => {
        let newData = [];
        ["ItPerson", "SPOC", "Owner"].forEach((type) => {
          let obj = {
            type: type,
            name: res?.data?.data?.[0]?.[`${type}Name`],
            mobile: res?.data?.data?.[0]?.[`${type}Mobile`],
            email: res?.data?.data?.[0]?.[`${type}Email`],
          };
          newData.push(obj);
        });

        let itArr = [];

        ["Level1", "Level2", "Level3"].forEach((type) => {
          let obj = {
            type: type,
            name: res?.data?.data?.[0]?.[`${type}Name`],
            mobile: res?.data?.data?.[0]?.[`${type}Mobile`],
            email: res?.data?.data?.[0]?.[`${type}Email`],
          };
          itArr.push(obj);
        });

        setTableData(newData);
        setLevelData(itArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleImageChange = (e) => {
    const file = e?.target?.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size exceeds 5MB. Please choose a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader?.result.split(",")[1];
        const fileExtension = file?.name.split(".").pop();
        setFormData({
          ...formData,
          SelectFile: file,
          Document_Base64: base64String,
          FileExtension: fileExtension,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Preview NewTicket Details")}
        >
          <NewTicketModal
            visible={visible}
            id={ticketid}
            setVisible={setVisible}
          />
        </Modal>
      )}
      {visible?.showModuleVisible && (
        <Modal
          modalWidth={"500px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Create New Module")}
        >
          <ModuleMaster
            visible={visible}
            id={ticketid}
            setVisible={setVisible}
          />
        </Modal>
      )}
      {visible?.showPageVisible && (
        <Modal
          modalWidth={"500px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Create New Page")}
        >
          <PageNameModal
            visible={visible}
            id={ticketid}
            setVisible={setVisible}
            onCloseInnerModal={handlerefresh}
          />
        </Modal>
      )}
      {visibleTicket?.subTicketVisible === true ? (
        <div className="card">
          <div className="row p-2">
            <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
              Reference Ticket ID : {visibleTicket?.showData?.TicketID}
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="card patient_registration border">
        {visibleTicket?.subTicketVisible === true ? (
          ""
        ) : (
          <Heading title={t("New Ticket")} isBreadcrumb={true} />
        )}
        <div className="row p-2">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="ProjectID"
            placeholderName={t("Project")}
            dynamicOptions={project}
            value={formData?.ProjectID}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
            searchable={true}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="ProductVersion"
            placeholderName="Product Version"
            dynamicOptions={productversion}
            handleChange={handleDeliveryChange}
            value={formData.ProductVersion}
            isDisabled={!!formData?.ProductVersion}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            name="ModuleName"
            placeholderName={t("Module Name")}
            dynamicOptions={moduleName}
            value={formData?.ModuleName}
            handleChange={handleDeliveryChange}
          />

          <ReactSelect
            name="Incharge"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            placeholderName="Incharge"
            dynamicOptions={incharge}
            value={formData.Incharge ? formData?.Incharge : ""}
            handleChange={handleDeliveryChange}
            isDisabled={!!formData?.Incharge}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Category"
            placeholderName={t("Category")}
            dynamicOptions={category}
            value={formData?.Category?.value}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
            searchable={true}
          />
          <div className="col-2 d-flex">
            <ReactSelect
              respclass="width100px"
              name="PageName"
              placeholderName={t("PageName")}
              dynamicOptions={pageName}
              value={formData?.PageName}
              handleChange={handleDeliveryChange}
            />

            {AllowAddPages == "1" && (
              <>
                <i
                  className="fa fa-plus-circle mt-2 ml-1"
                  onClick={() => {
                    setVisible({
                      showPageVisible: true,
                      showData: formData,
                    });
                  }}
                  title="Click to Create New Page"
                  style={{ cursor: "pointer" }}
                ></i>
              </>
            )}
          </div>

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
            name="AssignedTo"
            placeholderName={t("AssignedTo")}
            dynamicOptions={assignto}
            value={formData?.AssignedTo}
            handleChange={handleDeliveryChange}
            searchable={true}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
            name="Priority"
            placeholderName={t("Priority")}
            dynamicOptions={priority}
            value={formData?.Priority}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
            searchable={true}
          />
          <Input
            type="text"
            className="form-control mt-1"
            id="ReportedName"
            name="ReportedName"
            lable={t("Reported By Name")}
            placeholder=" "
            onChange={(e) => {
              const value = e.target.value;
              const nonNumericValue = value.replace(/[0-9]/g, "");
              handleChange({
                target: { name: "ReportedName", value: nonNumericValue },
              });
            }}
            value={formData?.ReportedName}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            tabIndex={"1"}
            onKeyDown={Tabfunctionality}
          />
          <div className="col-3 d-flex">
            <Input
              type="text"
              className="form-control mt-2"
              id="ReportedMobile"
              name="ReportedMobile"
              lable={t("Reported By Mobile")}
              placeholder=""
              onChange={(e) => {
                const value = e.target.value;
                if (MOBILE_NUMBER_VALIDATION_REGX.test(value)) {
                  inputBoxValidation(
                    MOBILE_NUMBER_VALIDATION_REGX,
                    e,
                    handleChange
                  );
                }
              }}
              value={formData?.ReportedMobile}
              tabIndex={"1"}
              onKeyDown={Tabfunctionality}
            />
            <span className="ml-2 mt-2">
              {handleIndicator(formData?.ReportedMobile)}
            </span>
          </div>

          <Input
            type="text"
            respclass="col-md-12 col-12 col-sm-12"
            className="form-control mt-2"
            placeholder=" "
            lable="Description"
            id="Description"
            name="Description"
            value={formData?.Description}
            onChange={handleChange}
          />

          <Input
            type="text"
            respclass="col-md-12 col-12 col-sm-12"
            className="form-control required-fields mt-2"
            placeholder=" "
            lable="Summary"
            id="Summary"
            name="Summary"
            value={formData?.Summary}
            onChange={handleChange}
          />

          <div style={{ marginLeft: "5px", marginTop: "5px" }}>
            <BrowseInput handleImageChange={handleImageChange} />
          </div>
          <div className="search-col mt-2" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="IsActive"
                  checked={formData?.IsActive == "1" ? true : false}
                  onChange={handleChange}
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
                {t("Preview")}
              </span>
            </div>
          </div>
          <div className="col-2 mt-2">
            {visibleTicket?.subTicketVisible === true ? (
              <button
                className="btn btn-sm btn-success"
                onClick={getReportNote}
                disabled={isSubmitting}
              >
                {t("Submit SubTicket")}
              </button>
            ) : (
              <button
                className="btn btn-sm btn-success"
                onClick={getReportNote}
                disabled={isSubmitting}
              >
                {t("Submit")}
              </button>
            )}
          </div>
          {formData?.ProjectID && (
            <>
              {tableData?.length > 0 && (
                <div className="row p-1">
                  <div className="col-6">
                    <div className="card mt-2">
                      <Heading title={t("Client Information Details")} />
                      <Tables
                        thead={ownerTHEAD}
                        tbody={tableData?.map((ele, index) => ({
                          "S.No.": index + 1,
                          Type: ele?.type,
                          Name: ele?.name,
                          Mobile: ele?.mobile,
                          Email: ele?.email,
                        }))}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card mt-2">
                      <Heading title={t("Itdose Team Details")} />
                      <Tables
                        thead={itPersonTHEAD}
                        tbody={levelData?.map((ele, index) => ({
                          "S.No.": index + 1,
                          Type: ele?.type,
                          Name: ele?.name,
                          Mobile: ele?.mobile,
                          Email: ele?.email?.includes("@itdoseinfo.com")
                            ? ele?.email
                            : "",
                        }))}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ReportIssue;
