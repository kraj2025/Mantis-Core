import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../components/UI/customTable";
import ViewIssueDetailsTableModal from "../components/UI/customTable/ViewIssueDetailsTableModal";
import Modal from "../components/modalComponent/Modal";
import { apiUrls } from "../networkServices/apiEndpoints";
import ReactSelect from "../components/formComponent/ReactSelect";
import { axiosInstances } from "../networkServices/axiosInstance";

const MyView = () => {
  const [t] = useTranslation();
  const rowConst = {
    show: false,
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    showNewMachine: false,
    showOldMachine: false,
    showPatientCount: false,
    showMachineCount: false,
  };
  const [projectId, setProjectId] = useState("");
  const [rowHandler, setRowHandler] = useState(rowConst);

  const [project, setProject] = useState([]);

  const [formData, setFormData] = useState({
    SearchWise: "",
  });
  const [rowType, setRowType] = useState({
    url: "",
    row: "",
  });

  const handleReactSelect = (name, e) => {
    const { value } = e;
    setProjectId(value);
    if (rowType?.row == "show3") {
      handleSearch("75", value);
    } else if (rowType?.row == "show4") {
      handleSearch("90", value);
    } else getAssignewdToMe(rowType?.url, rowType?.row, value);
  };

  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {})
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.Project, value: item?.ProjectId };
        });
        setProject(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getProject();
  }, []);

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    console.log(name, value);
    if (name == "SearchWise") {
      setFormData({ ...formData, [name]: value });
      // getAssignTo(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const [typeData, setTypeData] = useState({
    type: "assign",
    assign: [],
    type: "unassign",
    unassign: [],
    type: "reportedbyme",
    reportedbyme: [],
    type: "autoquery75days",
    autoquery75days: [],
    type: "autoquery90days",
    autoquery90days: [],
    type: "newMachine",
    newMachine: [],
    type: "patientCount",
    patientCount: [],
    type: "machineCount",
    patientCount: [],
  });

  const handlerow = (row) => {
    let obj;
    if (row == "show") {
      setRowType("assign");
      getAssignewdToMe(apiUrls?.AssingedToMe, "assign");
    }
    if (row == "showNewMachine") {
      setRowType({
        row: "newMachine",
        url: apiUrls?.AssingedToMe,
      });
      getAssignewdToMe(apiUrls?.AssingedToMe, "newMachine");
    }
    if (row == "showPatientCount") {
      setRowType({
        row: "patientCount",
        url: apiUrls?.AssingedToMe,
      });
      getAssignewdToMe(apiUrls?.AssingedToMe, "patientCount");
    }
    if (row == "showMachineCount") {
      setRowType({
        row: "machineCount",
        url: apiUrls?.AssingedToMe,
      });
      getAssignewdToMe(apiUrls?.AssingedToMe, "machineCount");
    }
    if (row == "show1") {
      setRowType({
        row: "unassign",
        url: apiUrls?.UnAssigned,
      });
      getAssignewdToMe(apiUrls?.UnAssigned, "unassign");
    }
    if (row == "show2") {
      setRowType({
        row: "reportedbyme",
        url: apiUrls?.ReportedbyMe,
      });
      getAssignewdToMe(apiUrls?.ReportedbyMe, "reportedbyme");
    }
    if (row == "show3") {
      setRowType({
        row: "show3",
        url: null,
        // url: apiUrls?.AssingedToMe,
      });
      handleSearch("75", projectId);
    }
    if (row == "show4") {
      setRowType({
        row: "show4",
        url: null,
      });
      handleSearch("90", projectId);
    }
    if (!rowHandler[row]) {
      obj = { ...rowHandler, [row]: true };
    } else {
      obj = { ...rowHandler, [row]: false };
    }
    setRowHandler(obj);
  };
  const THEAD = [
    t("Ticket ID"),
    t("Project"),
    t("Summary"),
    t("Edit"),
    t("Priority"),
    t("Submit Date"),
  ];
  const shortenName = (name) => {
    return name.length > 100 ? name.substring(0, 25) + "..." : name;
  };
  const handleSearch = (code, value) => {
    // setLoading(true);
    axiosInstances
      .post(apiUrls.AutobackupSearch, {
        StatusCode: String(code ? code : ""),
        ProjectID: String(value ?? ""),
        VerticalID: String(""),
        TeamID: String(""),
        WingID: String(""),
        POC1: String(""),
        POC2: String(""),
        POC3: String(""),
      })
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "RoleID",
      //     useCryptoLocalStorage("user_Data", "get", "RoleID")
      //   ),
      //   form.append("ProjectID", value ?? ""),
      //   form.append("VerticalID", ""),
      //   form.append("TeamID", ""),
      //   form.append("WingID", ""),
      //   form.append("POC1", ""),
      //   form.append("POC2", ""),
      //   form.append("POC3", ""),
      //   form.append("StatusCode", code ? code : "");
      // axios
      //   .post(apiUrls?.AutobackupSearch, form, { headers })
      .then((res) => {
        let arr = [];
        if (res?.data?.data?.length > 0) {
          if (code == "75")
            setData({ ...data, autoquery75days: res?.data?.data });
          if (code == "90")
            setData({ ...data, autoquery90days: res?.data?.data });
        }
        // setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        // setLoading(false);
      });
  };
  const [data, setData] = useState({
    assignedtome: [],
    unassigned: [],
    reportedbyme: [],
    autoquery75days: [],
    autoquery90days: [],
    newMachine: [],
    patientCount: [],
    machineCount: [],
  });

  const getAssignewdToMe = (url, type, ProjectID) => {
    axiosInstances
      .post(url, {
        // EmployeeID: Number(formData?.AssignedTo),
        // SearchType: String(code ? code : "0"),
        // Date: String(formatDate(formData?.FromDate)),
        // ManagerID: Number(formData?.ReportingTo),
        ProjectID: Number(ProjectID ? ProjectID : "0"),
        // StatusCode: String(code ? code : "0"),
      })
      .then((res) => {
        if (type == "assign") {
          setData({ ...data, assignedtome: res?.data?.data });
          setTypeData((val) => ({ ...val, [type]: res?.data?.data }));
        }
        if (type == "newMachine") {
          setData({ ...data, assignedtome: res?.data?.data });
          setTypeData((val) => ({ ...val, [type]: res?.data?.data }));
        }
        if (type == "patientCount") {
          setData({ ...data, assignedtome: res?.data?.data });
          setTypeData((val) => ({ ...val, [type]: res?.data?.data }));
        }
        if (type == "machineCount") {
          setData({ ...data, assignedtome: res?.data?.data });
          setTypeData((val) => ({ ...val, [type]: res?.data?.data }));
        }
        if (type == "unassign") {
          setData({ ...data, unassigned: res?.data?.data });
          setTypeData((val) => ({ ...val, [type]: res?.data?.data }));
        }
        if (type == "reportedbyme") {
          setData({ ...data, reportedbyme: res?.data?.data });
          setTypeData((val) => ({ ...val, [type]: res?.data?.data }));
        }
        if (type == "autoquery75days") {
          setData({ ...data, autoquery75days: res?.data?.data });
          setTypeData((val) => ({ ...val, [type]: res?.data?.data }));
        }
        if (type == "autoquery90days") {
          setData({ ...data, autoquery90days: res?.data?.data });
          setTypeData((val) => ({ ...val, [type]: res?.data?.data }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAssignewdToMe("", "");
  }, []);

  const [visible, setVisible] = useState({
    showVisible: false,
    showData: {},
    typeData: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.autoquery75days.length / rowsPerPage);
  const currentData = data.autoquery75days.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const [currentPage1, setCurrentPage1] = useState(1);
  const rowsPerPage1 = 10;
  const totalPages1 = Math.ceil(data.assignedtome.length / rowsPerPage1);
  const currentData1 = data.assignedtome.slice(
    (currentPage1 - 1) * rowsPerPage1,
    currentPage1 * rowsPerPage1
  );
  const handlePageChange1 = (newPage1) => {
    if (newPage1 > 0 && newPage1 <= totalPages1) {
      setCurrentPage1(newPage1);
    }
  };
  const [currentPage2, setCurrentPage2] = useState(1);
  const rowsPerPage2 = 10;
  const totalPages2 = Math.ceil(data?.unassigned?.length / rowsPerPage2);
  const currentData2 = data.unassigned.slice(
    (currentPage2 - 1) * rowsPerPage2,
    currentPage2 * rowsPerPage2
  );
  const handlePageChange2 = (newPage2) => {
    if (newPage2 > 0 && newPage2 <= totalPages2) {
      setCurrentPage2(newPage2);
    }
  };

  const [currentPage3, setCurrentPage3] = useState(1);
  const rowsPerPage3 = 10;
  const totalPages3 = Math.ceil(data.reportedbyme.length / rowsPerPage3);
  const currentData3 = data.reportedbyme.slice(
    (currentPage3 - 1) * rowsPerPage3,
    currentPage3 * rowsPerPage3
  );
  const handlePageChange3 = (newPage3) => {
    if (newPage3 > 0 && newPage3 <= totalPages3) {
      setCurrentPage3(newPage3);
    }
  };
  const [currentPage4, setCurrentPage4] = useState(1);
  const rowsPerPage4 = 10;
  const totalPages4 = Math.ceil(data.autoquery90days.length / rowsPerPage4);
  const currentData4 = data.autoquery90days.slice(
    (currentPage4 - 1) * rowsPerPage4,
    currentPage4 * rowsPerPage4
  );
  const handlePageChange4 = (newPage4) => {
    if (newPage4 > 0 && newPage4 <= totalPages4) {
      setCurrentPage4(newPage4);
    }
  };
  const [currentPage5, setCurrentPage5] = useState(1);
  const rowsPerPage5 = 10;
  const totalPages5 = Math.ceil(data.assignedtome.length / rowsPerPage5);
  const currentData5 = data.assignedtome.slice(
    (currentPage5 - 1) * rowsPerPage5,
    currentPage5 * rowsPerPage5
  );
  const handlePageChange5 = (newPage5) => {
    if (newPage5 > 0 && newPage5 <= totalPages5) {
      setCurrentPage5(newPage5);
    }
  };

  const [currentPage6, setCurrentPage6] = useState(1);
  const rowsPerPage6 = 10;
  const totalPages6 = Math.ceil(data.assignedtome.length / rowsPerPage6);
  const currentData6 = data.assignedtome.slice(
    (currentPage6 - 1) * rowsPerPage6,
    currentPage6 * rowsPerPage6
  );
  const handlePageChange6 = (newPage6) => {
    if (newPage6 > 0 && newPage6 <= totalPages6) {
      setCurrentPage6(newPage6);
    }
  };
  const [currentPage7, setCurrentPage7] = useState(1);
  const rowsPerPage7 = 10;
  const totalPages7 = Math.ceil(data.assignedtome.length / rowsPerPage7);
  const currentData7 = data.assignedtome.slice(
    (currentPage7 - 1) * rowsPerPage7,
    currentPage7 * rowsPerPage7
  );
  const handlePageChange7 = (newPage7) => {
    if (newPage7 > 0 && newPage7 <= totalPages7) {
      setCurrentPage7(newPage7);
    }
  };

  const auto75THEAD = [
    t("S.No."),
    t("Vertical"),
    t("Team"),
    t("Wing"),
    t("Project Name"),
    t("Last AB Date"),
    t("Last AB Done By"),
    // t("O_Name"),
    // t("O_Email"),
    // t("O_Mobile"),
    t("SPOC_Name"),
    t("SPOC_Email"),
    t("SPOC_Mobile"),
    // t("Remark"),
    // t("Edit"),
    // t("Show Log"),
    // t("Color code"),
  ];

  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"1000px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("View Issues Detail")}
        >
          <ViewIssueDetailsTableModal
            visible={visible}
            tableData={typeData[visible?.typeData]}
            setVisible={setVisible}
          />
        </Modal>
      )}
      <div className="card ViewIssues border" style={{ marginBottom: "2px" }}>
        <Heading
          title={t("My View")}
          isBreadcrumb={true}
          multiSelectComponent={
            // <select
            //   name="ProjectID"
            //   className="form-control col-sm-12 col-md-12"
            //   value={projectId}
            //   onChange={handleSingleSelectChange}
            // >
            //   <option value="" disabled>
            //     Select Project
            //   </option>
            //   {project.map((item) => (
            //     <option key={item.code} value={item.code}>
            //       {item.name}
            //     </option>
            //   ))}
            // </select>
            <ReactSelect
              placeholderName={t("Select Project")}
              lable=""
              DropdownIndicator={false}
              searchable={true}
              name="ProjectID"
              handleChange={handleReactSelect}
              value={projectId}
              dynamicOptions={[{ label: "Select", value: "" }, ...project]}
            />
          }
        />
      </div>

      <div
        className="card AssignedtoMe(Unresolved)"
        style={{ marginTop: "3px" }}
      >
        <div
          className="accordion"
          id="accordionExample"
          style={{ borderRadius: "3px", background: "white", border: "white" }}
        >
          <div
            className="accordion-item"
            style={{
              justifyContent: "space-between",
              display: "flex",
              cursor: "pointer",
            }}
            onClick={() => {
              handlerow("show");
            }}
            title="Click to View."
          >
            <div>
              <i
                className="fa fa-list-alt"
                style={{
                  fontSize: "15px",
                  marginRight: "6px",
                  marginLeft: "13px",
                }}
              ></i>{" "}
              {t("Assigned to Me (Unresolved)")}
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.show && (
                <span style={{ fontWeight: "bold" }}>
                  {t("Total Count")} : {data?.assignedtome?.length}
                </span>
              )}

              <button
                className={`fa ${rowHandler.show ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("show");
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "white",
                }}
                // style={{
                //   marginTop: "3px",
                //   transition: "transform 0.5s ease-in-out",
                //   transform: `rotate(${rowHandler?.show2 ? "180deg" : "0deg"})`,
                // }}
              ></button>
            </div>
          </div>
          {rowHandler.show && currentData1?.length > 0 && (
            <>
              <Tables
                thead={THEAD}
                tbody={currentData1?.map((ele, index) => ({
                  // "S.No.": index + 1,
                  "Ticket ID": ele?.TicketID,
                  Project: (
                    <span
                      id={`projectName-${index}`}
                      targrt={`projectName-${index}`}
                      title={ele?.ProjectName}
                    >
                      {shortenName(ele?.ProjectName)}
                    </span>
                  ),
                  Summary: (
                    <span
                      id={`Summary-${index}`}
                      targrt={`Summary-${index}`}
                      title={ele?.Summary}
                    >
                      {shortenName(ele?.Summary)}
                    </span>
                  ),
                  Edit: (
                    <i
                      className="fa fa-edit"
                      onClick={() => {
                        setVisible({
                          showVisible: true,
                          showData: ele,
                          typeData: "assign",
                        });
                      }}
                    ></i>
                  ),
                  Priority: ele?.Priority,
                  "Submit Date": ele?.TicketRaisedDate,
                  colorcode: ele?.colorcodenew,
                }))}
                tableHeight={"tableHeight"}
              />
              <div
                className="pagination"
                style={{ marginLeft: "auto", float: "right" }}
              >
                <button
                  onClick={() => handlePageChange1(currentPage1 - 1)}
                  disabled={currentPage1 === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage1} of {totalPages1}
                </span>
                <button
                  onClick={() => handlePageChange1(currentPage1 + 1)}
                  disabled={currentPage1 === totalPages1}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="card Unassigned" style={{ marginTop: "3px" }}>
        <div
          className="accordion"
          id="accordionExample"
          style={{
            borderRadius: "3px",
            background: "white",
            border: "white",
            cursor: "pointer",
          }}
        >
          <div
            className="accordion-item"
            style={{ justifyContent: "space-between", display: "flex" }}
            onClick={() => {
              handlerow("show1");
            }}
            title="Click to View."
          >
            <div>
              <i
                className="fa fa-list-alt"
                style={{
                  fontSize: "15px",
                  marginRight: "6px",
                  marginLeft: "13px",
                }}
              ></i>{" "}
              {t("Unassigned")}
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.show1 && (
                <span style={{ fontWeight: "bold" }}>
                  {t("Total Count")} : {data?.unassigned?.length}
                </span>
              )}
              <button
                className={`fa ${rowHandler.show1 ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("show1");
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "white",
                }}
              ></button>
            </div>
          </div>
          {rowHandler.show1 && currentData2?.length > 0 && (
            <>
              <Tables
                thead={THEAD}
                tbody={currentData2?.map((ele, index) => ({
                  "Ticket ID": ele?.TicketID,
                  Project: (
                    <span
                      id={`ProjectName-${index}`}
                      targrt={`ProjectName-${index}`}
                      title={ele?.ProjectName}
                    >
                      {shortenName(ele?.ProjectName)}
                    </span>
                  ),
                  Summary: (
                    <span
                      id={`Summary-${index}`}
                      targrt={`Summary-${index}`}
                      title={ele?.Summary}
                    >
                      {shortenName(ele?.Summary)}
                    </span>
                  ),
                  Edit: (
                    <i
                      className="fa fa-edit"
                      onClick={() => {
                        setVisible({
                          showVisible: true,
                          showData: ele,
                          typeData: "unassign",
                        });
                      }}
                    ></i>
                  ),
                  Priority: ele?.Priority,
                  "Submit Date": ele?.TicketRaisedDate,
                }))}
                tableHeight={"tableHeight"}
              />
              <div className="pagination" style={{ float: "right" }}>
                <button
                  onClick={() => handlePageChange2(currentPage2 - 1)}
                  disabled={currentPage2 === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage2} of {totalPages2}
                </span>
                <button
                  onClick={() => handlePageChange2(currentPage2 + 1)}
                  disabled={currentPage2 === totalPages2}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="card ReportedbyMe " style={{ marginTop: "3px" }}>
        <div
          className="accordion"
          id="accordionExample"
          style={{
            borderRadius: "3px",
            background: "white",
            border: "white",
            cursor: "pointer",
          }}
        >
          <div
            className="accordion-item"
            style={{ justifyContent: "space-between", display: "flex" }}
            onClick={() => {
              handlerow("show2");
            }}
            title="Click to View."
          >
            <div>
              <i
                className="fa fa-list-alt"
                style={{
                  fontSize: "15px",
                  marginRight: "6px",
                  marginLeft: "13px",
                }}
              ></i>{" "}
              {t("Reported by Me")}
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.show2 && (
                <span style={{ fontWeight: "bold" }}>
                  {t("Total Count")} : {data?.reportedbyme?.length}
                </span>
              )}
              <button
                className={`fa ${rowHandler.show2 ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("show2");
                }}
                // style={{
                //   marginTop: "3px",
                //   transition: "transform 0.5s ease-in-out",
                //   transform: `rotate(${rowHandler?.show2 ? "180deg" : "0deg"})`,
                // }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "white",
                }}
              ></button>
            </div>
          </div>
          {rowHandler.show2 && currentData3?.length > 0 && (
            <>
              <Tables
                thead={THEAD}
                tbody={currentData3?.map((ele, index) => ({
                  "Ticket ID": ele?.TicketID,
                  Project: ele?.ProjectName,
                  Summary: (
                    <span
                      id={`Summary-${index}`}
                      targrt={`Summary-${index}`}
                      title={ele?.Summary}
                    >
                      {shortenName(ele?.Summary)}
                    </span>
                  ),
                  Edit: (
                    <i
                      className="fa fa-edit"
                      onClick={() => {
                        setVisible({
                          showVisible: true,
                          showData: ele,
                          typeData: "reportedbyme",
                        });
                      }}
                    ></i>
                  ),
                  Priority: ele?.Priority,
                  "Submit Date": ele?.TicketRaisedDate,
                }))}
                tableHeight={"tableHeight"}
              />
              <div className="pagination" style={{ float: "right" }}>
                <button
                  onClick={() => handlePageChange3(currentPage3 - 1)}
                  disabled={currentPage3 === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage3} of {totalPages3}
                </span>
                <button
                  onClick={() => handlePageChange3(currentPage3 + 1)}
                  disabled={currentPage3 === totalPages3}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="card AutoQuery75Days" style={{ marginTop: "3px" }}>
        <div
          className="accordion"
          id="accordionExample"
          style={{
            borderRadius: "3px",
            background: "white",
            border: "white",
            cursor: "pointer",
          }}
        >
          <div
            className="accordion-item"
            style={{ justifyContent: "space-between", display: "flex" }}
            onClick={() => {
              handlerow("show3");
            }}
            title="Click to View."
          >
            <div>
              <i
                className="fa fa-list-alt"
                style={{
                  fontSize: "15px",
                  marginRight: "6px",
                  marginLeft: "13px",
                }}
              ></i>{" "}
              {t("AutoQuery 75 Days")}
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.show3 && (
                <span style={{ fontWeight: "bold" }}>
                  {t("Total Count")} : {data?.autoquery75days?.length}
                </span>
              )}
              <button
                className={`fa ${rowHandler.show3 ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("show3");
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "white",
                }}
              ></button>
            </div>
          </div>
          {rowHandler.show3 && currentData?.length > 0 && (
            <>
              <Tables
                thead={auto75THEAD}
                tbody={currentData?.map((ele, index) => ({
                  "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
                  Vertical: ele?.Vertical,
                  Team: ele?.Team,
                  Wing: ele.Wing,
                  "Project Name": (
                    <span
                      id={`projectName-${index}`}
                      targrt={`projectName-${index}`}
                      title={ele?.ProjectName}
                    >
                      {shortenName(ele?.ProjectName)}
                    </span>
                  ),
                  "Last AB Date": ele?.lastdate,
                  "Last AB Done By": ele?.username,
                  SPOC_Name: ele?.spoc_name,
                  SPOC_Email: ele?.SPOC_EmailID,
                  SPOC_Mobile: ele?.spoc_mobile,
                  // Edit: <i className="fa fa-edit"   onClick={() => {
                  //   setVisible({ showVisible: true, showData: ele ,typeData:"autoquery75days"});
                  // }}></i>,
                  // "Show Log": <i className="fa fa-book"></i>,
                  colorcode: ele?.colorcode,
                }))}
                tableHeight={"tableHeight"}
              />
              <div className="pagination" style={{ float: "right" }}>
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
            </>
          )}
        </div>
      </div>

      <div className="card AutoQuery90Days " style={{ marginTop: "3px" }}>
        <div
          className="accordion"
          id="accordionExample"
          style={{
            borderRadius: "3px",
            background: "white",
            border: "white",
            cursor: "pointer",
          }}
        >
          <div
            className="accordion-item"
            style={{ justifyContent: "space-between", display: "flex" }}
            onClick={() => {
              handlerow("show4");
            }}
            title="Click to View."
          >
            <div>
              <i
                className="fa fa-list-alt"
                style={{
                  fontSize: "15px",
                  marginRight: "6px",
                  marginLeft: "13px",
                }}
              ></i>{" "}
              {t("AutoQuery 90 Days")}
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.show4 && (
                <span style={{ fontWeight: "bold" }}>
                  {t("Total Count")} : {data?.autoquery90days?.length}
                </span>
              )}
              <button
                className={`fa ${rowHandler.show4 ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("show4");
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "white",
                }}
              ></button>
            </div>
          </div>
          {rowHandler.show4 && currentData4?.length > 0 && (
            <>
              <Tables
                thead={auto75THEAD}
                tbody={currentData4?.map((ele, index) => ({
                  "S.No.": index + 1,
                  Vertical: ele?.Vertical,
                  Team: ele?.Team,
                  Wing: ele.Wing,
                  "Project Name": (
                    <span
                      id={`projectName-${index}`}
                      targrt={`projectName-${index}`}
                      title={ele?.ProjectName}
                    >
                      {shortenName(ele?.ProjectName)}
                    </span>
                  ),
                  "Last AB Date": ele?.lastdate,
                  "Last AB Done By": ele?.username,
                  SPOC_Name: ele?.spoc_name,
                  SPOC_Email: ele?.SPOC_EmailID,
                  SPOC_Mobile: ele?.spoc_mobile,
                  // Edit: <i className="fa fa-edit"  onClick={() => {
                  //   setVisible({ showVisible: true, showData: ele ,typeData:"autoquery90days"});
                  // }}></i>,
                  // "Show Log": <i className="fa fa-book"></i>,
                  colorcode: ele?.colorcode,
                }))}
                tableHeight={"tableHeight"}
              />
              <div className="pagination" style={{ float: "right" }}>
                <button
                  onClick={() => handlePageChange4(currentPage4 - 1)}
                  disabled={currentPage4 === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage4} of {totalPages4}
                </span>
                <button
                  onClick={() => handlePageChange4(currentPage4 + 1)}
                  disabled={currentPage4 === totalPages4}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* <div className="card NewMachine " style={{ marginTop: "3px" }}>
        <div
          className="accordion"
          id="accordionExample"
          style={{
            borderRadius: "3px",
            background: "white",
            border: "white",
            cursor: "pointer",
          }}
        >
          <div
            className="accordion-item"
            style={{ justifyContent: "space-between", display: "flex" }}
            onClick={() => {
              handlerow("showNewMachine");
            }}
            title="Click to View."
          >
            <div>
              <i
                className="fa fa-list-alt"
                style={{
                  fontSize: "15px",
                  marginRight: "6px",
                  marginLeft: "13px",
                }}
              ></i>{" "}
              New Machine
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.showNewMachine && (
                <span style={{ fontWeight: "bold" }}>
                  Total Count : {data?.assignedtome?.length}
                </span>
              )}
              <button
                className={`fa ${rowHandler.showNewMachine ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("showNewMachine");
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "white",
                }}
              ></button>
            </div>
          </div>
          {rowHandler.showNewMachine && currentData5?.length > 0 && (
            <>
              <Tables
                thead={THEAD}
                tbody={currentData5?.map((ele, index) => ({
                  // "S.No.": index + 1,
                  "Ticket ID": ele?.TicketID,
                  Project: (
                    <span
                      id={`projectName-${index}`}
                      targrt={`projectName-${index}`}
                      title={ele?.ProjectName}
                    >
                      {shortenName(ele?.ProjectName)}
                    </span>
                  ),
                  Summary: (
                    <span
                      id={`Summary-${index}`}
                      targrt={`Summary-${index}`}
                      title={ele?.Summary}
                    >
                      {shortenName(ele?.Summary)}
                    </span>
                  ),
                  Edit: (
                    <i
                      className="fa fa-edit"
                      onClick={() => {
                        setVisible({
                          showVisible: true,
                          showData: ele,
                          typeData: "assign",
                        });
                      }}
                    ></i>
                  ),
                  Priority: ele?.Priority,
                  "Submit Date": ele?.TicketRaisedDate,
                  colorcode: ele?.colorcodenew,
                }))}
                tableHeight={"tableHeight"}
              />
              <div className="pagination" style={{ float: "right" }}>
                <button
                  onClick={() => handlePageChange5(currentPage5 - 1)}
                  disabled={currentPage5 === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage5} of {totalPages5}
                </span>
                <button
                  onClick={() => handlePageChange5(currentPage5 + 1)}
                  disabled={currentPage5 === totalPages5}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div> */}
      {/* <div className="card OldMachine " style={{ marginTop: "3px" }}>
        <div
          className="accordion"
          id="accordionExample"
          style={{
            borderRadius: "3px",
            background: "white",
            border: "white",
            cursor: "pointer",
          }}
        >
          <div
            className="accordion-item"
            style={{ justifyContent: "space-between", display: "flex" }}
            onClick={() => {
              handlerow("showOldMachine");
            }}
            title="Click to View."
          >
            <div>
              <i
                className="fa fa-list-alt"
                style={{
                  fontSize: "15px",
                  marginRight: "6px",
                  marginLeft: "13px",
                }}
              ></i>{" "}
              Old Machine
            </div>
            <div style={{ marginRight: "13px" }}>
            
              <button
                className={`fa ${rowHandler.showOldMachine ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("showOldMachine");
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "white",
                }}
              ></button>
            </div>
          </div>
          {rowHandler.showOldMachine && (
            <>
              <div className="card">
              
                <div className="row m-2">
                  <div className="col-sm-6">
                    <Linechart />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div> */}
      {/* <div className="card SaasPatientCount" style={{ marginTop: "3px" }}>
        <div
          className="accordion"
          id="accordionExample"
          style={{
            borderRadius: "3px",
            background: "white",
            border: "white",
            cursor: "pointer",
          }}
        >
          <div
            className="accordion-item"
            style={{ justifyContent: "space-between", display: "flex" }}
            onClick={() => {
              handlerow("showPatientCount");
            }}
            title="Click to View."
          >
            <div>
              <i
                className="fa fa-list-alt"
                style={{
                  fontSize: "15px",
                  marginRight: "6px",
                  marginLeft: "13px",
                }}
              ></i>{" "}
              Saas Patient Count
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.showPatientCount && (
                <span style={{ fontWeight: "bold" }}>
                  Total Count : {data?.assignedtome?.length}
                </span>
              )}
              <button
                className={`fa ${rowHandler.showPatientCount ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("showPatientCount");
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "white",
                }}
              ></button>
            </div>
          </div>
          {rowHandler.showPatientCount && currentData6?.length > 0 && (
            <>
              <Tables
                thead={THEAD}
                tbody={currentData6?.map((ele, index) => ({
                  // "S.No.": index + 1,
                  "Ticket ID": ele?.TicketID,
                  Project: (
                    <span
                      id={`projectName-${index}`}
                      targrt={`projectName-${index}`}
                      title={ele?.ProjectName}
                    >
                      {shortenName(ele?.ProjectName)}
                    </span>
                  ),
                  Summary: (
                    <span
                      id={`Summary-${index}`}
                      targrt={`Summary-${index}`}
                      title={ele?.Summary}
                    >
                      {shortenName(ele?.Summary)}
                    </span>
                  ),
                  Edit: (
                    <i
                      className="fa fa-edit"
                      onClick={() => {
                        setVisible({
                          showVisible: true,
                          showData: ele,
                          typeData: "assign",
                        });
                      }}
                    ></i>
                  ),
                  Priority: ele?.Priority,
                  "Submit Date": ele?.TicketRaisedDate,
                  colorcode: ele?.colorcodenew,
                }))}
                tableHeight={"tableHeight"}
              />
              <div className="pagination" style={{ float: "right" }}>
                <button
                  onClick={() => handlePageChange6(currentPage6 - 1)}
                  disabled={currentPage6 === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage6} of {totalPages6}
                </span>
                <button
                  onClick={() => handlePageChange6(currentPage6 + 1)}
                  disabled={currentPage6 === totalPages6}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div> */}

      {/* <div className="card SaasMachineCount " style={{ marginTop: "3px" }}>
        <div
          className="accordion"
          id="accordionExample"
          style={{
            borderRadius: "3px",
            background: "white",
            border: "white",
            cursor: "pointer",
          }}
        >
          <div
            className="accordion-item"
            style={{ justifyContent: "space-between", display: "flex" }}
            onClick={() => {
              handlerow("showMachineCount");
            }}
            title="Click to View."
          >
            <div>
              <i
                className="fa fa-list-alt"
                style={{
                  fontSize: "15px",
                  marginRight: "6px",
                  marginLeft: "13px",
                }}
              ></i>{" "}
              Saas Machine Count
            </div>
            <div style={{ marginRight: "13px" }}>
              {rowHandler.showMachineCount && (
                <span style={{ fontWeight: "bold" }}>
                  Total Count : {data?.assignedtome?.length}
                </span>
              )}
              <button
                className={`fa ${rowHandler.showMachineCount ? "fa-arrow-up" : "fa-arrow-down"}`}
                onClick={() => {
                  handlerow("showMachineCount");
                }}
                style={{
                  cursor: "pointer",
                  border: "none",
                  color: "black",
                  borderRadius: "2px",
                  background: "white",
                }}
              ></button>
            </div>
          </div>
          {rowHandler.showMachineCount && currentData7?.length > 0 && (
            <>
              <Tables
                thead={THEAD}
                tbody={currentData7?.map((ele, index) => ({
                  // "S.No.": index + 1,
                  "Ticket ID": ele?.TicketID,
                  Project: (
                    <span
                      id={`projectName-${index}`}
                      targrt={`projectName-${index}`}
                      title={ele?.ProjectName}
                    >
                      {shortenName(ele?.ProjectName)}
                    </span>
                  ),
                  Summary: (
                    <span
                      id={`Summary-${index}`}
                      targrt={`Summary-${index}`}
                      title={ele?.Summary}
                    >
                      {shortenName(ele?.Summary)}
                    </span>
                  ),
                  Edit: (
                    <i
                      className="fa fa-edit"
                      onClick={() => {
                        setVisible({
                          showVisible: true,
                          showData: ele,
                          typeData: "assign",
                        });
                      }}
                    ></i>
                  ),
                  Priority: ele?.Priority,
                  "Submit Date": ele?.TicketRaisedDate,
                  colorcode: ele?.colorcodenew,
                }))}
                tableHeight={"tableHeight"}
              />
              <div className="pagination" style={{ float: "right" }}>
                <button
                  onClick={() => handlePageChange7(currentPage7 - 1)}
                  disabled={currentPage7 === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage7} of {totalPages7}
                </span>
                <button
                  onClick={() => handlePageChange7(currentPage7 + 1)}
                  disabled={currentPage7 === totalPages7}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div> */}
    </>
  );
};
export default MyView;
