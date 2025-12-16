import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AutoComplete } from "primereact/autocomplete";
import Input from "../../components/formComponent/Input";
import { useSelector } from "react-redux";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../utils/apitools";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setDeveloperSearchType,
  setLoading,
  setMemberId,
} from "../../store/reducers/loadingSlice/loadingSlice";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";

const DesktopMenuItem = ({ filteredData }) => {
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );
  // console.log("ReportingManager", ReportingManager);

  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const RoleID = useCryptoLocalStorage("user_Data", "get", "RoleID");
  const [assignto, setAssignedto] = useState([]);
  const [activeBar, setActiveBar] = useState(null);
  const [showPrevious, setShowPrevious] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const pageURL = useLocation();
  const [formData, setFormData] = useState({
    AssignedTo: Number(useCryptoLocalStorage("user_Data", "get", "ID"))
      ? Number(useCryptoLocalStorage("user_Data", "get", "ID"))
      : "",
    LevelCheck: "",
  });

  const { GetRoleList } = useSelector((state) => state?.CommonSlice);
  
  const search = (event) => {
    const filteredSuggestions = extractedData
      .flat()
      .filter((suggestion) =>
        suggestion?.childrenName
          ?.toLowerCase()
          .startsWith(event.query?.toLowerCase())
      );
    if (filteredSuggestions.length > 0) {
      setSuggestions(
        filteredSuggestions.map((suggestion) => suggestion.childrenName)
      );
    } else {
      setSuggestions([]);
    }
  };
  const scrollToLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 100; // You can adjust the scroll amount as needed
    }
  };

  const scrollToRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 100; // You can adjust the scroll amount as needed
    }
  };

  const findActiveTab = () => {
    for (let i = 0; i < GetRoleList?.length; i++) {
      for (let j = 0; j < GetRoleList[i]?.Files?.length; j++) {
        if (
          GetRoleList[i]["Files"][j]["URLName"]?.toLowerCase() ===
          location?.pathname.toLowerCase()
        ) {
          setActiveBar(i);
          break;
        }
      }
    }
  };

  // console.log("pageURL", pageURL?.pathname);

  const handleClick = (e) => {
    const url = extractedData.flat();
    const { value } = e;
    const navi = url?.find((ele) =>
      ele?.childrenName?.toLowerCase().startsWith(value.toLowerCase())
    );
    navigate(navi.url, { state: { data: navi?.breadcrumb } });
    setValue("");
  };

  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current) {
        setShowPrevious(containerRef.current.scrollLeft > 0);
        setShowNext(
          containerRef.current.scrollLeft <
            containerRef.current.scrollWidth - containerRef.current.clientWidth
        );
      }
    };

    containerRef.current.addEventListener("scroll", checkScroll);
    // return () => {
    //   containerRef.current.removeEventListener("scroll", checkScroll);
    // };
  }, []);

  const extractedData = (Array.isArray(GetRoleList) ? GetRoleList : [])?.map(
    (menuItem) => {
      const childrenData = menuItem?.Files?.map((child) => ({
        childrenName: child.DispName,
        url: child.URLName,
        breadcrumb: "",
      }));
      return childrenData;
    }
  );

  //previous data function

  // const extractedData =
  //   GetRoleList?.length > 0 &&
  //   GetRoleList?.map((menuItem) => {
  //     const childrenData = menuItem?.Files?.map((child) => ({
  //       childrenName: child.DispName,
  //       url: child.URLName,
  //       breadcrumb: "",
  //     }));
  //     return childrenData;
  //   });

  // useEffect(() => {
  //   findActiveTab();
  // }, [GetRoleList]);

  useEffect(() => {
    findActiveTab();
  }, [GetRoleList, pageURL?.pathname]);

  const handlePageLink = (menuItem) => {
    if (menuItem?.Files?.length) {
      navigate(menuItem?.Files[0].URLName, {
        state: { data: menuItem?.Files?.breadcrumb },
      });
    }
  };

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name == "AssignedTo") {
      dispatch(setMemberId(value));
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (name == "LevelCheck") {
      dispatch(setDeveloperSearchType(value));
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const getAssignTo = () => {
    axiosInstances
      .post(apiUrls.GetTeamMember, {
        ActionType: String("Child"),
        // EmployeeId: Number(useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")),
      })
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { label: item?.NAME, value: item?.MantisEmployee_ID };
        });
        setAssignedto(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -100, // Adjust scroll distance as needed
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 100, // Adjust scroll distance as needed
        behavior: "smooth", // Smooth scrolling
      });
    }
  };
  const handleScrollLeftMenu = () => {
    console.log(menuRef);
    if (menuRef.current) {
      menuRef.current.scrollBy({
        left: -100, // Adjust scroll distance as needed
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  const handleScrollRightMenu = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({
        left: 100, // Adjust scroll distance as needed
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  useEffect(() => {
    getAssignTo();
  }, []);
  return (
    <div className="desktop-sidebar ">
      <div className="bg-color-container">
        <div className="d-flex justify-content-end bindrole container-fluid ">
          <nav style={{ width: "950px" }}>
            <div className="d-flex align-items-center justify-content-end lllotusss">
              {showPrevious && (
                <i
                  className="fa fa-angle-double-left text-white mx-2"
                  aria-hidden="true"
                  onClick={scrollToLeft}
                ></i>
              )}
              <ul className={`nav nav-sidebar`} role="menu" ref={containerRef}>
                {/* /GetRoleList/ */}
                {(Array.isArray(GetRoleList) ? GetRoleList : [])
                  // .filter((menuItem) => ReportingManager == 1
                  // )
                  .map((menuItem, index) => {
                    if (
                      ReportingManager == 0 &&
                      menuItem?.MenuName != "Sales Lead"
                    )
                      return (
                        <li
                          key={menuItem.MenuName}
                          className={`nav-item menu-open ${activeBar === index ? "active-sub-menu-list-style" : ""}`}
                          onClick={() => {
                            setActiveBar(index);
                            handlePageLink(menuItem);
                          }}
                        >
                          <a
                            className="nav-link"
                            role="link"
                            style={{ cursor: "pointer" }}
                          >
                            <i
                              className={`${menuItem.menuIcon} nav-icon mr-2`}
                            />
                            <p>{t(menuItem.MenuName)}</p>
                          </a>
                        </li>
                      );
                    if (ReportingManager == 1)
                      return (
                        <li
                          key={menuItem.MenuName}
                          className={`nav-item menu-open ${activeBar === index ? "active-sub-menu-list-style" : ""}`}
                          onClick={() => {
                            setActiveBar(index);
                            handlePageLink(menuItem);
                          }}
                        >
                          <a
                            className="nav-link"
                            role="link"
                            style={{ cursor: "pointer" }}
                          >
                            <i
                              className={`${menuItem.menuIcon} nav-icon mr-2`}
                            />
                            <p>{t(menuItem.MenuName)}</p>
                          </a>
                        </li>
                      );
                  })}
                {/* {(Array.isArray(GetRoleList) ? GetRoleList : [])?.map(
                  (menuItem, index) => (
                    <li
                      key={menuItem.MenuName}
                      className={`nav-item menu-open ${activeBar === index && "active-sub-menu-list-style"}`}
                      onClick={() => {
                        setActiveBar(index);
                        handlePageLink(menuItem);
                      }}
                    >
                      <a
                        className={`nav-link`}
                        role="link"
                        style={{ cursor: "pointer" }}
                      >
                        <i className={`${menuItem.menuIcon} nav-icon mr-2`} />
                        <p>{t(menuItem.MenuName)}</p>
                      </a>
                    </li>
                  )
                )} */}
              </ul>
              {showNext && (
                <i
                  className="fa fa-angle-double-right text-white mx-2"
                  aria-hidden="true"
                  onClick={scrollToRight}
                ></i>
              )}
            </div>
          </nav>

          <div className="pt-2 mx-2 " style={{ position: "relative" }}>
            <AutoComplete
              value={value}
              suggestions={suggestions}
              completeMethod={search}
              className="w-100 custom-magic-search"
              onSelect={(e) => handleClick(e)}
              id="searchtest"
              onChange={(e) => setValue(e.value)}
              placeholder="Menu Search"
            />
            <i className="fa fa-search search_icon" aria-hidden="true"></i>
          </div>
        </div>
      </div>

      {/* {RoleID == 7 ? (
        <div
          style={{
            backgroundColor: "white",
            boxShadow: "0px 0px 5px grey",
            display: "flex",
            height: "30px",
          }}
          className="w-100"
        >
          <ul
            className={`nav d-flex ${pageURL?.pathname === "/NewTicketClient" && "flex-row-reverse justify-content-end"}`}
            style={{ height: "26px" }}
          >
            {GetRoleList &&
              GetRoleList[activeBar]?.Files &&
              GetRoleList[activeBar]?.Files.map((item) => (
                <li
                  className={`nav-item mx-1 ${location.pathname.toLowerCase() === item.URLName.toLowerCase() ? " active-tab-menu" : "text-black"}`}
                  key={item.DispName}
                  style={{ padding: "3px 15px" }}
                >
                  <NavLink
                    to={`${item.URLName}`}
                    state={{ data: item?.breadcrumb }}
                  >
                    <p style={{ whiteSpace: "nowrap", margin: "0px" }}>
                      <i className={`fas fa-tachometer-alt nav-icon mr-2`} />{" "}
                      {t(item.DispName)}
                    </p>
                  </NavLink>
                </li>
              ))}
          </ul>

        </div>
      ) : ( */}

      <div
        style={{
          backgroundColor: "white",
          boxShadow: "0px 0px 5px grey",
          display: "flex",
          height: "30px",
        }}
        className="w-100"
      >
        <div className="mt-2">
          {/* <i
            className="pi pi-chevron-circle-left px-1 pointer mr-1 text-black leftRightMenu"
            // onClick={handleScrollLeftMenu}
          ></i> */}
        </div>
        <ul
          className={`nav d-flex ${pageURL?.pathname === "/dashboard" && "flex-row-reverse justify-content-end"}`}
          style={{ height: "26px" }}
        >
          {GetRoleList &&
            GetRoleList[activeBar]?.Files &&
            GetRoleList[activeBar]?.Files.map((item) => (
              <li
                className={`nav-item mx-1 ${location.pathname.toLowerCase() === item.URLName.toLowerCase() ? " active-tab-menu" : "text-black"}`}
                key={item.DispName}
                style={{ padding: "3px 15px" }}
              >
                <NavLink
                  to={`${item.URLName}`}
                  state={{ data: item?.breadcrumb }}
                >
                  <p style={{ whiteSpace: "nowrap", margin: "0px" }}>
                    <i className={`fas fa-tachometer-alt nav-icon mr-2`} />{" "}
                    {t(item.DispName)}
                  </p>
                </NavLink>
              </li>
            ))}

          {/* <li style={{justifySelf:"end",textAlign:"end"}}>
              <Input 
              placeholder={"Issue Search"}
              />
            </li> */}
        </ul>
        <div className="mt-2 ml-auto">
          {/* <i
            className="pi pi-chevron-circle-right px-1 pointer mr-1 text-black leftRightMenu"
            // onClick={handleScrollLeftMenu}
          ></i> */}
        </div>
        {(pageURL?.pathname === "/dashboard" ||
          pageURL?.pathname === "/CoordinatorDashboard" ||
          pageURL.pathname === "/ManagerDashboard" ||
          pageURL.pathname === "/HrDashboard" ||
          pageURL.pathname === "/ClientFeedbackFlow") && (
          <ul
            className="ml-auto mr-2"
            style={{ zIndex: "", marginTop: "5px", height: "26px" }}
          >
            {RoleID == 7 ? (
              ""
            ) : (
              <>
                <div className="d-flex" style={{ gap: "10px" }}>
                  {pageURL?.pathname === "/CoordinatorDashboard" && (
                    <div className="jwekuqhwi">
                      <ReactSelect
                        respclass="width100px "
                        name="LevelCheck"
                        placeholderName={t("SearchType")}
                        dynamicOptions={[
                          { label: "Select", value: "" },
                          { label: "Level-I", value: 1 },
                          { label: "Level-II", value: 2 },
                          { label: "Level-III", value: 3 },
                          // { label: "Mapping", value: 4 },
                        ]}
                        value={formData?.LevelCheck}
                        handleChange={handleDeliveryChange}
                      />
                    </div>
                  )}
                  <div className="jwekuqhwi">
                    <ReactSelect
                      respclass="width100px "
                      name="AssignedTo"
                      placeholderName={t("Team Member")}
                      dynamicOptions={[
                        { label: "Select", value: "" },
                        ...assignto,
                      ]}
                      value={formData?.AssignedTo}
                      handleChange={handleDeliveryChange}
                      // value={assignto.find(option => option.value === formData?.AssignedTo)}
                      // handleChange={(e) => handleDeliveryChange("AssignedTo", e)}
                    />
                  </div>
                </div>
              </>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DesktopMenuItem;
