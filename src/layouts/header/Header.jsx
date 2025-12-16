import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebarMenu } from "@app/store/reducers/ui";
import LanguagesDropdown from "@app/layouts/header/languages-dropdown/LanguagesDropdown";
import Themedropdown from "@app/layouts/header/Theme-dropdown";
import { toggleFullScreen } from "../../utils/helpers";
import SubMenuDropdown from "@app/layouts/header/submenu-dropdown/SubMenuDropdown";
import { useNavigate } from "react-router-dom";
import UserDropdown from "./user-dropdown/UserDropdown";
import ReactSelectHead from "../../components/formComponent/ReactSelectHead";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import {
  GetBindMenu,
  GetRoleListByEmployeeIDAndCentreID,
  ProjectList,
} from "../../store/reducers/common/CommonExportFunction";
import logoitdose from "../../assets/image/logoitdose.png";
import axios from "axios";
import Input from "../../components/formComponent/Input";
import Modal from "../../components/modalComponent/Modal";
import ViewIssueDetailsTableModal from "../../components/UI/customTable/ViewIssueDetailsTableModal";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import { setClientId } from "../../store/reducers/loadingSlice/loadingSlice";
import FirstSlideScreen from "../../pages/FirstSlideScreen";
import SeeMoreSlideScreenEye from "../../components/SearchableTable/SeeMoreSlideScreenEye";
import FirstMoreList from "../../networkServices/FirstMoreList";
import LoginModal from "./LoginModal";
import loginn from "../../assets/image/loginwhitepng.png";
import logoutt from "../../assets/image/logoutpng.png";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import Tooltip from "../../pages/Tooltip";
import LoginDetailModal from "./LoginDetailModal";
import VoiceNavigation from "../../pages/VoiceNavigation";
import HeaderLogoutModal from "../../pages/HeaderLogoutModal";
import { axiosInstances } from "../../networkServices/axiosInstance";

const Header = React.memo(() => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rolelist, setRoleList] = useState([]);
  const [routeFlag, setRouteFlag] = useState(false);
  const [headerCount, setHeaderCount] = useState([]);
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );
  const IsFeedbackShow = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsFeedbackShow"
  );
  const [notFound, setNotFound] = useState("");
  const localData = useLocalStorage("userData", "get");
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(false);
  // console.log("islogin", isLogin);
  const navbarVariant = useSelector((state) => state.ui.navbarVariant);
  const headerBorder = useSelector((state) => state.ui.headerBorder);
  const screenSize = useSelector((state) => state.ui.screenSize);

  const RoleID = useCryptoLocalStorage("user_Data", "get", "RoleID");
  const [listVisible, setListVisible] = useState(false);

  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const ModalComponent = (name, component) => {
    // console.log("name component", name, component);
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

  const [visible, setVisible] = useState({
    showVisible: false,
    loginVisisble: false,
    detailVisisble: false,
    logoutVisible: false,
    showData: {},
  });
  const Showdashboard = useLocalStorage("userData", "get")?.ShowDashboard;

  const signout = useSelector((state) => state.logoutSlice);

  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  const getContainerClasses = useCallback(() => {
    let classes = `main-header navbar navbar-expand ${navbarVariant}`;
    if (headerBorder) {
      classes = `${classes} border-bottom-0`;
    }
    return classes;
  }, [navbarVariant, headerBorder]);

  const logOut = () => {
    // localStorage.clear();
    // sessionStorage.clear();
    // localStorage.clear();
    setRouteFlag(true);
    navigate("/login");
  };

  const handleDeliveryChange = (val, e) => {
    const { name } = e;
    const { value } = val;
    if (name == "RoleID") {
      setFormData({
        ...formData,
        [name]: value,
      });
      dispatch(setClientId(value));
      useCryptoLocalStorage("user_Data", "set", "RoleID", value);
      // localStorage.setItem("RoleID", value);
      BindRoleWiseMenu(value);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    routeFlag && signout?.success && navigate("/login");
  }, [signout?.success]);

  useEffect(() => {
    const payload = new FormData();
    payload?.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    payload?.append(
      "LoginName",
      useCryptoLocalStorage("user_Data", "get", "realname")
    );
    if (useCryptoLocalStorage("user_Data", "get", "token") !== null) {
      dispatch(ProjectList(payload));
    }
  }, [dispatch]);

  const [formData, setFormData] = useState({
    ProjectID: "",
    issuesearch: "",
    RoleID: useCryptoLocalStorage("user_Data", "get", "RoleID"),
  });

  useEffect(() => {
    let savedPeople = useCryptoLocalStorage("user_Data", "get", "Role");
    setRoleList(savedPeople);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIssueSearch = () => {
   
    axiosInstances
      .post(apiUrls.ViewTicket, {
        TicketID: Number(formData?.issuesearch),
      })
      .then((res) => {
        if (res?.data?.status === true) {
          navigate("/ViewIssues", {
            state: {
              data: res.data.data,
              id: formData?.issuesearch,
            },
          });
          setFormData({ issuesearch: "" });
        } else {
          toast.error("No Ticket Found");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [attCount, setattCount] = useState([]);

  const handleWorkingHour = () => {
    axiosInstances
      .post(apiUrls.GetWorkingHours, {
        crmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
      })
      .then((res) => {
        setattCount(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (formData?.issuesearch.length > 3) handleIssueSearch();
    }
  };

  useEffect(() => {
    dispatch(
      GetRoleListByEmployeeIDAndCentreID({
        roleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
      })
    );
    
  }, []);

  const BindRoleWiseMenu = async (RoleID) => {
    dispatch(GetRoleListByEmployeeIDAndCentreID({ roleID: Number(RoleID) }));
 
    navigate("/dashboard");
  };
  const { memberID } = useSelector((state) => state?.loadingSlice);
  const [project, setProject] = useState([]);



  const handleHeaderCount = () => {
    axiosInstances
      .post(apiUrls.DevDashboard_Summary, {
        title: String("NotAssigned"),
        developerID: String(""),
      })
      .then((res) => {
        setHeaderCount(res?.data?.dtSummary?.[0] || {});
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      });
  };

  const [avgCount, setAvgCount] = useState([]);

  const handleEmployeeAverage = () => {
    axiosInstances
      .post(apiUrls.EmployeeFeedbackAvg, {
        EmployeeID: Number(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
      })
      .then((res) => {
        if (res.data.success === true) {
          setAvgCount(res?.data?.data[0]?.AvgResult);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleHeaderCount(memberID);
  }, [memberID]);

  useEffect(() => {
    handleWorkingHour();
    const interval = setInterval(() => {
      handleWorkingHour();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    handleHeaderCount();
    handleEmployeeAverage();
  }, []);

  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {
        ProjectID: Number("0"),
        IsMaster: String("0"),
        WingID: Number("0"),
        TeamID: Number("0"),
        VerticalID: Number("0"),
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.Project, value: item?.ProjectId };
        });
        setProject(poc3s);
      })
      .catch((err) => {
        // localStorage.clear();
        navigate("/login");
      });
  };

  useEffect(() => {
    getProject();
  }, []);

  const [modalHandlerState, setModalHandlerState] = useState({
    header: null,
    show: false,
    size: null,
    component: null,
    footer: null,
  });

  const handleModalState = () => {
    setModalHandlerState({
      show: true,
      header: "Crm Login",
      size: "20vw",
      component: <LoginModal />,
      footer: <></>,
    });
  };
  const LoginLogoutButton = () => {
    axiosInstances
      .post(apiUrls.Attendence_Select, {
        emailID: String(useCryptoLocalStorage("user_Data", "get", "EmailId")),
        searchType: String("LogInStatus"),
      })
      .then((res) => {
        const data = res?.data?.data?.[0];
        setIsLogin(data);
        setNotFound(res?.data?.message === "No Record Found");
      })
      .catch((err) => {
        console.error("Error fetching login/logout status", err);
      });
  };

  const [tableData, setTableData] = useState([]);

  const handleTableSearch = () => {
    axiosInstances
      .post(apiUrls.Attendence_Search, {
        SearchType: String("0"),
        ManagerID: Number("0"),
        EmployeeID: Number("0"),
        Date: String(new Date().toISOString().split("T")[0]),
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    LoginLogoutButton();
    handleTableSearch();
  }, []);

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"1000px"}
          visible={visible}
          setVisible={setVisible}
          Header="View Issues Detail"
        >
          <ViewIssueDetailsTableModal
            visible={visible}
            setVisible={setVisible}
          />
        </Modal>
      )}
      {visible?.loginVisisble && (
        <Modal
          modalWidth={"700px"}
          visible={visible}
          setVisible={setVisible}
          Header="Attendance"
        >
          <LoginModal
            visible={visible}
            setVisible={setVisible}
            handleTableSearch2={handleTableSearch}
            LoginLogoutButton2={LoginLogoutButton}
            onCloseInnerModal={handleTableSearch}
          />
        </Modal>
      )}
      {visible?.detailVisisble && (
        <Modal
          modalWidth={"600px"}
          visible={visible}
          setVisible={setVisible}
          Header="Search Details"
        >
          <LoginDetailModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.logoutVisible && (
        <Modal
          modalWidth={"400px"}
          visible={visible}
          setVisible={setVisible}
          Header="Logout Confirmation"
        >
          <HeaderLogoutModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      <nav className={getContainerClasses()} style={{ position: "relative" }}>
        <ul className="navbar-nav">
          {["lg", "md", "sm"].includes(screenSize) ? (
            <div
              className="img-conatiner"
              onClick={handleDashboard}
              style={{ cursor: "pointer" }}
            >
              <div style={{ width: "70%", height: "50px" }}>
                <img
                  src={logoitdose}
                  className="img-fluid"
                  style={{ height: "26px" }}
                />
                <br></br>
                <span style={{ fontSize: "8px", fontWeight: "bold" }}>
                  {t("CRM")}
                </span>
              </div>
            </div>
          ) : (
            <li className="nav-item">
              <button
                onClick={handleToggleMenuSidebar}
                type="button"
                className="nav-link mobilerespBars"
              >
                <i className="fas fa-bars" />
              </button>
            </li>
          )}
        </ul>

        <ul className="navbar-nav ml-auto d-md-flex">
          {RoleID == 7 ? (
            ""
          ) : (
            <h6
              style={{ gap: "1rem" }}
              className="blinking-text responsive-text d-none d-md-flex justify-content-center flex-wrap ml-5"
            >
              {IsFeedbackShow == 1 && (
                <div className="d-flex ml-5">
                  {t("Average Rating")}&nbsp;:
                  <span>&nbsp;{avgCount ? avgCount : 0}</span>
                  <FirstMoreList
                    ModalComponent={ModalComponent}
                    isShowDropDown={false}
                    setSeeMore={setSeeMore}
                    data={{
                      type: "AvgRating",
                      Status: "AvgRating",
                      LotusAssign: memberID,
                      assigntovalue: "AvgCheck",
                      PlannedDate: 10,
                    }}
                    setVisible={() => {
                      setListVisible(false);
                    }}
                    handleBindFrameMenu={[
                      {
                        FileName: "EmployeeFeedback",
                        URL: "EmployeeFeedback",
                        FrameName: "EmployeeFeedback",
                        Description: "EmployeeFeedback",
                      },
                    ]}
                    isShowPatient={true}
                  />
                </div>
              )}
              <span className="ml-0 d-none d-md-flex">
                {t("Assign Without Delivery Date")} :&nbsp;
                {headerCount?.AssignWithOutDeliveryDate}
                <FirstMoreList
                  ModalComponent={ModalComponent}
                  isShowDropDown={false}
                  setSeeMore={setSeeMore}
                  data={{
                    type: "AssignWithOutDeliveryDateHeader",
                    Status: "assigned",
                    LotusAssign: memberID,
                    assigntovalue: "AssignCheck",
                    PlannedDate: 9,
                  }}
                  setVisible={() => {
                    setListVisible(false);
                  }}
                  handleBindFrameMenu={[
                    {
                      FileName: "View Issues",
                      URL: "ViewIssues",
                      FrameName: "SearchQuotationBooking",
                      Description: "SearchQuotationBooking",
                    },
                  ]}
                  isShowPatient={true}
                />
              </span>

              <span className="ml-0 d-none d-md-flex">
                {t("Not Assigned")} : {headerCount?.NotAssigned}
                <span style={{ height: "20px" }}>
                  <FirstMoreList
                    ModalComponent={ModalComponent}
                    isShowDropDown={false}
                    setSeeMore={setSeeMore}
                    data={{
                      type: "NotAssignedHeader",
                      Status: "assigned",
                      HideStatus: "N/A",
                      LotusAssign: memberID,
                      assigntovalue: "AssignCheck",
                    }}
                    setVisible={() => {
                      setListVisible(false);
                    }}
                    handleBindFrameMenu={[
                      {
                        FileName: "View Issues",
                        URL: "ViewIssues",
                        FrameName: "SearchQuotationBooking",
                        Description: "SearchQuotationBooking",
                      },
                    ]}
                    isShowPatient={true}
                  />
                </span>
                <FirstSlideScreen
                  visible={listVisible}
                  setVisible={() => {
                    setListVisible(false);
                    setRenderComponent({
                      name: null,
                      component: null,
                    });
                  }}
                  Header={
                    <SeeMoreSlideScreenEye
                      name={renderComponent?.name}
                      seeMore={seeMore}
                      handleChangeComponent={handleChangeComponent}
                    />
                  }
                >
                  {renderComponent?.component}
                </FirstSlideScreen>
              </span>
            </h6>
          )}
        </ul>
        <ul className="navbar-nav ml-auto d-md-flex">
          {["lg", "md", "sm"].includes(screenSize) ? (
            <div type="button" className="mr-2">
              <ReactSelectHead
                name="RoleID"
                placeholderName="Role"
                dynamicOptions={rolelist?.map((ele) => {
                  return {
                    label: ele?.RoleName,
                    value: ele?.RoleID,
                  };
                })}
                searchable={true}
                value={formData?.RoleID}
                handleChange={handleDeliveryChange}
                respclass={
                  ["lg", "md", "sm"].includes(screenSize)
                    ? "width100px"
                    : "width80px"
                }
                plcN="center"
              />
            </div>
          ) : (
            <div type="button" className="mr-0">
              <ReactSelectHead
                name="RoleID"
                placeholderName="Role"
                dynamicOptions={rolelist?.map((ele) => {
                  return {
                    label: ele?.RoleName,
                    value: ele?.RoleID,
                  };
                })}
                searchable={true}
                value={formData?.RoleID}
                handleChange={handleDeliveryChange}
                respclass={
                  ["lg", "md", "sm"].includes(screenSize)
                    ? "width100px"
                    : "width142px"
                }
                plcN="center"
              />
            </div>
          )}
        </ul>
        <ul className="navbar-nav ml-auto d-md-flex">
          <li className="nav-item savetheme d-none">
            <div type="button" className="headerboxsize">
              <Input
                type="text"
                className="form-control issuesearchcss"
                id="issuesearch"
                name="issuesearch"
                lable={t("Search by TicketID")}
                placeholder=" "
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                value={formData?.issuesearch}
                respclass="col-sm-6 col-12 col-md-10"
                style={{ marginLeft: "10px" }}
                isTooltip={false}
              />
            </div>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto d-md-flex">
          {RoleID == 7 ? (
            ""
          ) : (
            <>
              <li className="nav-item d-md-flex px-1">
                {["lg", "md"].includes(screenSize) ? (
                  <div
                    style={{
                      fontWeight: "600",
                      background:
                        attCount?.isonline > 0 ? "#8bf7ad" : "#fa9c93",
                      border: "1px solid white",
                      borderRadius: "5px",
                      display: "flex",
                    }}
                  >
                    <i
                      className="fa fa-eye mr-0 ml-1 mt-1"
                      onClick={() => {
                        setVisible({ detailVisisble: true });
                      }}
                      style={{ cursor: "pointer" }}
                      title="Click to Show Details."
                    ></i>
                    <span className="ml-2">
                      Working Hour:{" "}
                      <span style={{ color: "green" }}>
                        {attCount?.WorkingHours
                          ? attCount?.WorkingHours
                          : "0:00"}
                      </span>
                    </span>
                    <span className="ml-2 mr-2">
                      Break Count:{" "}
                      <span style={{ color: "red" }}>
                        {new Date().getHours() < 21
                          ? attCount?.BreakCount ?? "0"
                          : "0"}
                      </span>
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      fontWeight: "600",
                      background:
                        attCount?.isonline > 0 ? "#8bf7ad" : "#fa9c93",
                      border: "1px solid white",
                      borderRadius: "5px",
                      display: "flex",
                      marginLeft: "0px",
                      width: "78px",
                    }}
                  >
                    <i
                      className="fa fa-eye p-1 "
                      onClick={() => {
                        setVisible({ detailVisisble: true });
                      }}
                      style={{ cursor: "pointer" }}
                      title="Click to Show Details."
                    ></i>
                    <span style={{ color: "green", marginLeft: "5px" }}>
                      {attCount?.WorkingHours ? attCount?.WorkingHours : "0:00"}
                    </span>
                    <span style={{ color: "red", marginLeft: "10px" }}>
                      {new Date().getHours() < 21
                        ? attCount?.BreakCount ?? "0"
                        : "0"}
                    </span>
                  </div>
                )}
              </li>
              {["lg", "md"].includes(screenSize) ? (
                <>
                  {(notFound ||
                    (isLogin?.IsLoggedIn === 1 && isLogin?.IsLogout === 1)) && (
                    <li className="nav-item mr-2 ml-1">
                      <img
                        src={loginn}
                        width="40px"
                        height="17px"
                        onClick={() => {
                          setVisible({ loginVisisble: true });
                        }}
                        style={{ cursor: "pointer" }}
                        alt="login"
                      />
                    </li>
                  )}
                </>
              ) : (
                <div>
                  {(notFound ||
                    (isLogin?.IsLoggedIn === 1 && isLogin?.IsLogout === 1)) && (
                    <li className="nav-item mr-0 ml-2">
                      <img
                        src={loginn}
                        width="30px"
                        height="15px"
                        onClick={() => {
                          setVisible({ loginVisisble: true });
                        }}
                        style={{ cursor: "pointer" }}
                        alt="login"
                      />
                    </li>
                  )}
                </div>
              )}
            </>
          )}

          {RoleID == 7 ? (
            ""
          ) : (
            <>
              {["lg", "md"].includes(screenSize) ? (
                <div>
                  {isLogin?.IsLoggedIn == 1 && isLogin?.IsLogout == 0 && (
                    <li className="nav-item mr-2 ml-1">
                      <img
                        src={logoutt}
                        width={"39px"}
                        height={"13px"}
                        onClick={() => {
                          setVisible({ loginVisisble: true });
                        }}
                        style={{ cursor: "pointer" }}
                        alt="logout"
                      />
                    </li>
                  )}
                </div>
              ) : (
                <div>
                  {" "}
                  {isLogin?.IsLoggedIn == 1 && isLogin?.IsLogout == 0 && (
                    <li className="nav-item  ml-2">
                      <img
                        src={logoutt}
                        width={"30px"}
                        height={"13px"}
                        onClick={() => {
                          setVisible({ loginVisisble: true });
                        }}
                        style={{ cursor: "pointer" }}
                        alt="logout"
                      />
                    </li>
                  )}
                </div>
              )}
            </>
          )}
          {["lg", "md", "sm"].includes(screenSize) && (
            <li className="nav-item d-md-flex px-1">
              <div type="button">
                <Tooltip target=".fa-home" />
                <i
                  className="fa fa-home text-white"
                  aria-hidden="true"
                  data-pr-tooltip="Go To Dashboard"
                  data-pr-position="bottom"
                  onClick={() => {
                    Showdashboard == 1
                      ? navigate("/dashboard")
                      : navigate("/Welcome");
                  }}
                ></i>
              </div>
            </li>
          )}

        
          <li className="nav-item position-relative  d-md-flex mr-1">
            <Themedropdown />
          </li>
          {["lg", "md", "sm"].includes(screenSize) && (
            <li className="nav-item d-none d-md-flex mr-1">
              <VoiceNavigation />
            </li>
          )}
          {["lg", "md", "sm"].includes(screenSize) && (
            <li className="nav-item d-md-flex ml-1">
              <div onClick={toggleFullScreen} style={{ cursor: "pointer" }}>
                <i
                  className="fa fa-arrows-alt text-white"
                  aria-hidden="true"
                ></i>
              </div>
            </li>
          )}

          {["lg", "md", "sm"].includes(screenSize) && (
            <li className="nav-item d-none d-md-flex ">
              <LanguagesDropdown />
            </li>
          )}

          <li className="nav-item  d-md-flex m-0 ml-2">
            <button
              type="button"
              className="nav-link d-flex"
              style={{ cursor: "pointer" }}
            >
              <UserDropdown
                setDropdownOpen={setDropdownOpen}
                dropdownOpen={dropdownOpen}
              />
              <label className="control-label ml-1 d-none d-lg-block text-white">
                {useCryptoLocalStorage("user_Data", "get", "realname")}
              </label>
            </button>
          </li>
          {["lg", "md", "sm"].includes(screenSize) ? (
            <li className="nav-item  d-md-flex ">
              <button
                type="button"
                className="nav-link"
                title="Click to Logout"
                onClick={() => {
                  setVisible({ logoutVisible: true });
                }}
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </li>
          ) : (
            <li className="nav-item  d-md-flex ml-2">
              <button
                type="button"
                className="nav-link"
                title="Click to Logout"
                onClick={() => {
                  setVisible({ logoutVisible: true });
                }}
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </li>
          )}
        </ul>
      </nav>

      {modalHandlerState?.show && (
        <Modal
          visible={modalHandlerState?.show}
          setVisible={() =>
            setModalHandlerState({
              show: false,
              component: null,
              size: null,
            })
          }
          modalWidth={modalHandlerState?.size}
          Header={modalHandlerState?.header}
          footer={modalHandlerState?.footer}
        >
          {modalHandlerState?.component}
        </Modal>
      )}
    </>
  );
});

export default Header;
