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
import ModuleNameModal from "../components/UI/customTable/ModuleNameModal";
import PageNameModal from "../components/UI/customTable/PageNameModal";
import Tables from "../components/UI/customTable";
import { useSelector } from "react-redux";
import BrowseButton from "../components/formComponent/BrowseButton";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";

const NewTicketClient = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [t] = useTranslation();
  const [ticketid, setticketid] = useState("");
  const { clientId } = useSelector((state) => state?.loadingSlice);
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    ProjectID: "",
    Category: "",
    AssignedTo: "",
    Priority: "",
    ReportedName: "",
    ReportedMobile: "",
    Description: "",
    Summary: "",
    IsActive: "",
    ModuleName: "",
    PageName: "",
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
    OtherReferenceNo: "",
  });
  const [project, setProject] = useState([]);
  const [category, setCategory] = useState([]);
  const [assignto, setAssignedto] = useState([]);
  const [priority, setPriority] = useState([]);
  const [moduleName, setModuleName] = useState([]);
  const [pageName, setPageName] = useState([]);

  const AllowAssign = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowTicketAssignTo"
  );
  const AllowAddPages = useCryptoLocalStorage(
    "user_Data",
    "get",
    "AllowAddPages"
  );

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name == "ProjectID") {
      setFormData({
        ...formData,
        [name]: value,
        Category: "",
        ModuleName: "",
        PageName: "",
      });
      getAssignTo(value);
      getCategory(value);
      getModule(value);
      getPage(value);
      getGetProjectInfo(value);
    } else if (name === "Category") {
      setFormData({
        ...formData,
        [name]: e,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
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

  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        ProjectID: 0,
        IsMaster: "0",
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
          getModule(singleProject);
          getPage(singleProject);
          getGetProjectInfo(singleProject);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCategory = (proj) => {
    axiosInstances
      .post(apiUrls.Category_Select, {
        RoleID: 0,
        ProjectID: Number(proj),
      })
      .then((res) => {
        handleReactSelectDropDownOptions(res?.data.data, "NAME", "ID");
        setCategory(
          handleReactSelectDropDownOptions(res?.data.data, "NAME", "ID")
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getModule = (proj) => {
    axiosInstances
      .post(apiUrls.Module_Select, {
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
        ProjectID: Number(proj),
        IsActive: 1,
        IsMaster: 2,
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.ModuleName, value: item?.ModuleID };
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
        RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
        ProjectID: Number(proj),
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
        ProjectID: Number(value),
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
        <span className="text-black">{Number(0 + state?.length)}</span>
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
        ProjectID: Number(formData.ProjectID),
        CategoryID: Number(formData.Category.value),
        AssignTo: formData?.AssignedTo ? String(formData?.AssignedTo) : "0",
        PriorityID: String(formData.Priority),
        Summary: String(formData.Summary),
        ReporterMobileNo: String(formData.ReportedMobile),
        ReporterName: String(formData.ReportedMobile),
        Description: formData.Description ? String(formData.Description) : "",
        ModuleID: "0",
        ModuleName: String(formData.ModuleName),
        PagesID: "0",
        PagesName: String(formData.PageName),
        ImageDetails: [
          {
            Document_Base64: formData?.Document_Base64,
            FileExtension: formData?.FileExtension,
          },
        ],
      });
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }

      if (response?.data?.success) {
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
          OtherReferenceNo: "",
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
        ProjectID: Number(id),
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
          <ModuleNameModal
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
          />
        </Modal>
      )}
      <div className="card patient_registration border">
        <Heading title={t("New Ticket")} isBreadcrumb={true} />
        <div className="row g-4 m-2">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="ProjectID"
            placeholderName={t("Project")}
            dynamicOptions={project}
            value={formData?.ProjectID}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
          />

          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Category"
            placeholderName={t("Category")}
            dynamicOptions={category}
            value={formData?.Category?.value}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
          />
          {clientId !== 7 && (
            <>
              {formData?.Category?.ShowModule_Ticket === 1 && (
                <div className="col-xl-4 col-md-4 col-sm-6 col-12 d-flex">
                  <ReactSelect
                    respclass="col-xl-6 col-md-4 col-sm-6 col-12"
                    name="ModuleName"
                    placeholderName={t("ModuleName")}
                    dynamicOptions={moduleName}
                    value={formData?.ModuleName}
                    handleChange={handleDeliveryChange}
                  />

                  <ReactSelect
                    respclass="col-xl-5 col-md-4 col-sm-6 col-12"
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
              )}
            </>
          )}
          {AllowAssign == 1 && (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="AssignedTo"
              placeholderName={t("AssignedTo")}
              dynamicOptions={assignto}
              value={formData?.AssignedTo}
              handleChange={handleDeliveryChange}
            />
          )}
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Priority"
            placeholderName={t("Priority")}
            dynamicOptions={priority}
            value={formData?.Priority}
            handleChange={handleDeliveryChange}
            requiredClassName={"required-fields"}
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
          <div className="col-2 d-flex">
            <Input
              type="text"
              className="form-control mt-1"
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
          <Input
            type="text"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            className="form-control mt-2"
            placeholder=" "
            lable="Machine Reference No."
            id="OtherReferenceNo"
            name="OtherReferenceNo"
            value={formData?.OtherReferenceNo}
            onChange={handleChange}
          />
          <div style={{ marginLeft: "5px", marginTop: "7px" }}>
            <BrowseButton handleImageChange={handleImageChange} />
          </div>
          <div className="search-col mt-2" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "8px" }}>
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
            <button
              className="btn btn-sm btn-success"
              onClick={getReportNote}
              disabled={isSubmitting}
            >
              {t("Submit")}
            </button>
          </div>
          {formData?.ProjectID && (
            <>
              {tableData?.length > 0 && (
                <div className="row">
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
                          Email: ele?.email,
                        }))}
                        tableHeight={"tableHeight"}
                      />
                    </div>
                  </div>
                </div>
              )}{" "}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NewTicketClient;
