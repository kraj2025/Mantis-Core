import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";
import Heading from "../../components/UI/Heading";
import DatePickerMonth from "../../components/formComponent/DatePickerMonth";
import Modal from "../../components/modalComponent/Modal";
import PendingRequestModal from "./PendingRequestModal";
import axios from "axios";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../utils/apitools";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import Loading from "../../components/loader/Loading";
import Tooltip from "../Tooltip";
import Input from "../../components/formComponent/Input";
import { formatProdErrorMessage } from "@reduxjs/toolkit";
import AmountSubmissionSeeMoreList from "../../networkServices/AmountSubmissionSeeMoreList";
import SlideScreen from "../SlideScreen";
import SeeMoreSlideScreen from "../../components/SearchableTable/SeeMoreSlideScreen";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";
// import { drop } from "lodash";

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();

const DeveloperCalendar = () => {
  // TOOLTIP FUNCTION
  const shortenName = (name) => {
    return name.length > 5 ? name.substring(0, 5) + "..." : name;
  };
  const ReportingManager = useCryptoLocalStorage(
    "user_Data",
    "get",
    "IsReportingManager"
  );
  const IsEmployee = useCryptoLocalStorage("user_Data", "get", "realname");
  const [formData, setFormData] = useState({
    Month: new Date(),
    AssignedTo: "",
    Year: "",
    currentMonth,
    currentYear,
  });
  const [newManhour, setNewManhour] = useState([]);
  const [assignedData, setAssignedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [summaryData, setSummaryData] = useState([]);
  const rowsPerPage = 5;
  const [calendarData, setCalendarData] = useState([]);

  const [formattedDate, setFormattedDate] = useState([]);
  const [CalenderDetails, setCalenderDetails] = useState([]);

  const [names, setNames] = useState([]);
  const [namesToIds, setNamesToIds] = useState({});
  const [assignto, setAssignedto] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth - 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [startDayOfWeek, setStartDayOfWeek] = useState(0);
  const [clickedDate, setClickedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState({
    showVisible: false,
    data: {},
  });

  const [listVisible, setListVisible] = useState(false);

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
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = assignedData?.slice(indexOfFirstRow, indexOfLastRow);

  // Total Pages
  const totalPages = Math.ceil(assignedData.length / rowsPerPage);

  // GO TO NEXT PAGE
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // GO TO PREVIOUS PAGE
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const updateManHour = (id, newManhour) => {
    const updatedData = assignedData.map((item) => {
      if (item.id === id) {
        return { ...item, manhour: newManhour };
      }
      return item;
    });
    setAssignedData(updatedData);
  };

  useEffect(() => {
    const generateDummyData = () => {
      const days = new Array(new Date(currentYear, currentMonth, 0).getDate())
        .fill(null)
        .map((_, index) => {
          const ticketCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 tickets
          const ticketIDs = Array.from(
            { length: ticketCount },
            (_, i) => `Ticket-${index + 1}-${i + 1}`
          );
          const ticketColors = Array.from(
            { length: ticketCount },
            () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
          );
          const manHours = 8;
          const completedManHours = Math.floor(Math.random() * manHours);

          return {
            CurrentDay: index + 1,
            TicketIDs: ticketIDs.join(","),
            TicketColors: ticketColors.join(","),
            ManHours: manHours,
            CompletedManHours: completedManHours,
          };
        });
      setCalenderDetails(days);
    };

    generateDummyData();
  }, []);

  function capitalizeFirstLetter(sentence) {
    if (!sentence) return "";
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  const handleRemove = (index) => {
    // console.log("index index ", index);
    setAssignedData((prev) => prev.filter((_, i) => i !== index));
  };

  // useEffect(() => {
  //   fetchCalendarData("Calendar", formData.AssignedTo);
  // }, [selectedMonth, selectedYear, formData.AssignedTo]);

  useEffect(() => {
    const fetchedNames = [
      { name: "John Doe", id: "123" },
      { name: "Jane Smith", id: "456" },
      { name: "Michael Brown", id: "789" },
    ];
    setNames(fetchedNames.map((user) => user.name));
    setNamesToIds(
      fetchedNames.reduce((acc, user) => {
        acc[user.name] = user.id;
        return acc;
      }, {})
    );
  }, []);

  useEffect(() => {
    const getDaysInMonth = (year, month) => {
      return new Array(new Date(year, month, 0).getDate())
        .fill(null)
        .map((_, index) => ({
          date: `${month}/${index + 1}`,
          status: "",
        }));
    };

    const getStartDayOfWeek = (year, month) =>
      new Date(year, month - 1, 1).getDay();

    const updatedDays = getDaysInMonth(selectedYear, selectedMonth + 1);
    const startDay = getStartDayOfWeek(selectedYear, selectedMonth + 1);
    setDaysInMonth(updatedDays);
    setStartDayOfWeek(startDay);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    getAssignTo();
  }, []);

  const handleSearch = () => {
    // if (formData?.AssignedTo == "") {
    //   toast.error("Please Select Employee.");
    // } else
    if (formData?.Date == "") {
      toast.error("Please Select month .");
    } else {
      setLoading(true);
      axiosInstances
        .post(apiUrls.Dev_Caledar, {
          AssignToID:
            formData?.AssignedTo ||
            useCryptoLocalStorage("user_Data", "get", "ID"),
          Date: `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-01`,
          View: "Calender",
        })
        .then((res) => {
          setCalendarData(res?.data?.data?.dtCalender);
          setSummaryData(res?.data?.data?.dtStatusSummary);
          setTotalCount(res?.data?.data?.dtLoginDays[0]);
          const updatedData = res?.data?.data?.dtAssigned?.map((ele, index) => {
            return {
              ...ele,
              isManHour: false,
            };
          });

          setAssignedData(updatedData);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const getFormateDate = (clickedDate) => {
    let newDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${clickedDate}`;
    return newDate;
  };
  const handleDateClick = (clickedDate) => {
    setLoading(true);

    const formattedDate = `${clickedDate.getFullYear()}-${String(clickedDate.getMonth() + 1).padStart(2, "0")}-${String(clickedDate.getDate()).padStart(2, "0")}`;
    // console.log("clclclclcl",formattedDate)
    setFormattedDate(formattedDate);

    axiosInstances
      .post(apiUrls.Dev_Caledar, {
  "AssignToID": formData?.AssignedTo ? Number(formData?.AssignedTo) : 0,
  "Date": formattedDate,
  "View": "Detailed"
})

    // const form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID"));
    // form.append("AssignToID", formData?.AssignedTo);
    // form.append("Date", formattedDate);
    // form.append("View", "Detailed");

    // axios
    //   .post(apiUrls?.Dev_Caledar, form, { headers })
      .then((res) => {
        const filteredData = res?.data?.data?.dtDetailed?.filter(
          (item) => item.CurrentDeliveryDate === formattedDate
        );

        // Update modal visibility and data
        setVisible({
          showVisible: true,
          data: filteredData || [], // Pass empty array if no data found
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching detailed data:", err);
        setLoading(false);
      });
  };

  const handleSelectChange = (e, index) => {
    const { name, value } = e.target;
    const data = JSON.parse(JSON.stringify(assignedData));
    data[index][name] = value;
    setAssignedData(data);
  };

  const handleIconClick = (value, index) => {
    let data = [...assignedData];
    data[index]["isManHour"] = !data[index]["isManHour"];
    setAssignedData(data);
  };

  const handleManHourTable = (details) => {
    axiosInstances
      .post(apiUrls.ApplyAction, {
  "TicketIDs": String(details?.TicketID),
  "ActionText": "ManHours",
  "ActionId": String(details?.ManHour),
  "RCA": "",
  "ReferenceCode": "",
  "ManHour": "",
  "Summary": "",
  "ModuleID": "",
  "ModuleName": "",
  "PagesID": "",
  "PagesName": "",
  "ManHoursClient": "",
  "DeliveryDateClient": "",
  "ReOpenReasonID": "",
  "ReOpenReason": ""
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append(
    //     "LoginName",
    //     useCryptoLocalStorage("user_Data", "get", "realname")
    //   ),
    //   form.append("TicketIDs", details?.TicketID),
    //   form.append("ActionText", "ManHours"),
    //   form.append("ActionId", details?.ManHour),
    //   axios
    //     .post(apiUrls?.ApplyAction, form, { headers })
        .then((res) => {
          if (res?.data?.message === "Record Updated Successfully") {
            toast.success(res?.data?.message);
          } else {
            toast.error(res?.data?.message);
          }
          // handleViewSearch();
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const handleMonthYearChange = (name, e) => {
    const { value } = e.target;
    const date = new Date(value);
    setSelectedMonth(date.getMonth());
    setSelectedYear(date.getFullYear());
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getAssignTo = () => {
    axiosInstances
      .post(apiUrls.AssignTo_Select, {
        ProjectID: 0,
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
  const [totalCount, setTotalCount] = useState([]);
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({ ...formData, [name]: value });
  };

  const RenderDay = ({ day, index }) => {
    const { date } = day;
    const [month, dayOfMonth] = date.split("/").map(Number);
    const dayDate = new Date(selectedYear, month - 1, dayOfMonth);

    const data = calendarData?.find((val) => val?.CurrentDay === dayOfMonth);
    const totalTickets = data?.TotalTicket || 0;
    const manHours = data?.ManHour || 0;

    const TotalManHours = 8;
    const progressPercentage =
      manHours > 0 ? (manHours / TotalManHours) * 100 : 0;

    const isActive = totalTickets > 0;
    const handleMouseEnter = isActive ? () => handleDateClick(dayDate) : null;

    const [{ isOver }, drop] = useDrop({
      accept: "row",
      drop: (item) => {
        // console.log("Dragging Bug>>>trigget", item, dayOfMonth);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });
    const styles = {
      container: {
        cursor: isActive ? "pointer" : "default",
        width: "80px",
        height: "80px",
        padding: "3px",
        position: "relative",
        border: "1px solid #ddd",
        textAlign: "center",
        background: "#fff",
      },
      progressBarWrapper: {
        position: "absolute",
        top: "3px",
        bottom: "3px",
        left: "3px",
        width: "8px",
        backgroundColor: "#f0f0f0",
        borderRadius: "4px",
        overflow: "hidden",
      },
      progressBar: {
        width: "100%",
        height: `${progressPercentage}%`,
        backgroundColor:
          progressPercentage < 40
            ? "rgb(255, 131, 131)"
            : progressPercentage < 60
              ? "yellow"
              : "rgb(167, 241, 106)",
        position: "absolute",
        bottom: "0",
      },
      badge: (isActive, bgColor, textColor) => ({
        marginTop: "5px",
        marginLeft: "15px",
        backgroundColor: bgColor,
        color: textColor,
        fontWeight: "bold",
        fontSize: "10px",
        borderRadius: "12px",
        padding: "4px 8px",
        display: "inline-block",
        textAlign: "center",
      }),
      dateText: {
        fontWeight: "bold",
        marginBottom: "3px",
        fontSize: "10px",
        marginLeft: "15px",
      },
    };

    return (
      <td
        ref={drop}
        key={index}
        className="active-day"
        style={{
          ...styles.container,
          backgroundColor: isOver ? "#f0f0f0" : "#fff", // Change background when dragging over
        }}
        // style={styles.container}
        aria-disabled={!isActive}
      >
        <div style={styles.progressBarWrapper}>
          <div style={styles.progressBar}></div>
        </div>

        <div style={styles.dateText}>{dayOfMonth}</div>

        <div
          style={styles.badge(
            isActive,
            isActive ? "#dfb2f3" : "#ddd",
            isActive ? "#fff" : "#000"
          )}
          onClick={() => handleDateClick(dayDate)}
          // onMouseEnter={handleMouseEnter}
        >
          Tickets: {totalTickets}
        </div>
        {/* ManHours Badge */}
        <div className="manHourBadge">
          <div
            style={styles.badge(
              manHours > 0,
              manHours > 0 ? "#68bbe3" : "#ddd",
              manHours > 0 ? "#fff" : "#000"
            )}
          >
            <FaClock /> : {manHours}
          </div>
          {/* {totalTickets > 0 && (
            <div className="dateBadge">
              <span className="">
                <AmountSubmissionSeeMoreList
                  ModalComponent={ModalComponent}
                  isShowDropDown={false}
                  setSeeMore={setSeeMore}
                  data={{
                    ...calendarData,
                    type: "DeveloperCalendar",
                    PlannedDate: "5",
                    assigntovalue: "AssignCheck",
                    LotusAssign: formData?.AssignedTo,
                    selectCalendarDate: getFormateDate(
                      day?.date?.split("/")[1]
                    ),
                  }}
                  setVisible={() => {
                    setListVisible(false);
                  }}
                  handleBindFrameMenu={[
                    {
                      FileName: "View Issues",
                      URL: "ViewIssues",
                      FrameName: "ViewIssues",
                      Description: "ViewIssues",
                    },
                  ]}
                  isShowPatient={true}
                />
              </span>
            </div>
          )} */}
        </div>
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
      </td>
    );
  };

  const renderCalendarRows = () => {
    const weeks = [];
    let currentWeek = new Array(startDayOfWeek).fill(null);

    daysInMonth.forEach((day) => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    if (currentWeek.length > 0) {
      weeks.push([
        ...currentWeek,
        ...new Array(7 - currentWeek.length).fill(null),
      ]);
    }

    return weeks.map((week, index) => (
      <tr key={index} droppableId={`date-block-${formatProdErrorMessage}`}>
        {week.map((day, i) =>
          // day ?  renderDay(day, i) : <td key={i} className="empty-day"></td>
          day ? (
            <RenderDay day={day} index={i} />
          ) : (
            <td key={i} className="empty-day"></td>
          )
        )}
      </tr>
    ));
  };

  const [currentRow, setCurrentRows] = useState(1);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const destinationId = result.destination.droppableId;
    if (destinationId.startsWith("date-block")) {
      const clickedDate = new Date(destinationId.split("-")[2]);
      setClickedDate(clickedDate);
      setVisible({
        showVisible: true,
        data: [],
      });
    } else {
      // Handle normal row reordering or other behaviors
      const reorderedRows = Array.from(currentRows);
      const [movedRow] = reorderedRows.splice(result.source.index, 1);
      reorderedRows.splice(result.destination.index, 0, movedRow);
      setCurrentRows(reorderedRows);
    }
  };

  const Tr = ({ item, index }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "row",
      item: { item, index },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    useEffect(() => {
      if (isDragging) {
        // console.log("Dragging Bug:", item);
      }
    }, [isDragging, item]);

    return (
      <>
        <tr
          ref={drag}
          key={index}
          style={{
            backgroundColor:
              item.Status === "Completed" ? "#a3ffb3" : "#ffcccc",
          }}
        >
          <td>{item.TicketID}</td>
          <td>
            <Tooltip label={item?.Project}>
              <span>{shortenName(item?.Project)}</span>
            </Tooltip>
          </td>
          <td>{item.Category}</td>
          <td>
            <Tooltip label={item.summary}>
              <span>{shortenName(item.summary)}</span>
            </Tooltip>
          </td>
          <td>
            {!item?.isManHour && <div>{newManhour}</div>}
            <div className="d-flex align-items-center justify-content-between">
              <i
                className="fa fa-clock mr-2"
                style={{ cursor: "pointer" }}
                onClick={() => handleIconClick(item, index)}
              ></i>
              <div>{item?.ManHour}</div>

              {item?.isManHour && (
                <>
                  <Input
                    type="text"
                    className="Dev-form-control"
                    id="ManHour"
                    name="ManHour"
                    onChange={(e) => handleSelectChange(e, index)}
                    value={item?.ManHour}
                  />
                  <button
                    className="btn btn-success ml-2"
                    onClick={() => handleManHourTable(item)}
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </td>
          <td>
            <i
              className="fa fa-trash"
              style={{
                color: "red",
                marginLeft: "23px",
              }}
              onClick={() => handleRemove(index)}
            ></i>
          </td>
        </tr>
      </>
    );
  };

  return (
    <>
      <Modal
        modalWidth="600px"
        visible={visible.showVisible}
        setVisible={setVisible}
        Header={`Selected Date: ${formattedDate}`}
        calendarData={[calendarData]}
        summaryData={[summaryData]}
      >
        <PendingRequestModal
          visible={visible}
          setVisible={setVisible}
          selectedDate={clickedDate}
          calendarData={visible.data}
        />
      </Modal>

      <div className="card">
        <Heading title="Pending Tickets" isBreadcrumb={true} />
        <div className="row g-4 m-2">
          {ReportingManager == 1 ? (
            <ReactSelect
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="AssignedTo"
              placeholderName="Employee"
              dynamicOptions={assignto}
              value={formData?.AssignedTo}
              handleChange={handleDeliveryChange}
            />
          ) : (
            <Input
              type="text"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              className="form-control"
              placeholder=" "
              lable="Employee"
              id="AssignedTo"
              name="AssignedTo"
              value={IsEmployee}
              disabled={true}
            />
          )}
          <DatePickerMonth
            className="custom-calendar"
            id="Month"
            name="Month"
            lable="Month/Year"
            placeholder="MM/YY"
            respclass="col-xl-2 col-md-6 col-sm-6 col-12"
            value={formData.Month}
            handleChange={(e) => handleMonthYearChange("Month", e)}
          />
          {loading ? (
            <Loading />
          ) : (
            <button className="btn btn-sm btn-primary" onClick={handleSearch}>
              Search
            </button>
          )}

          {calendarData?.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
                padding: "20px",
                backgroundColor: "#fff",
              }}
              className="workingDayBlock"
            >
              <div
                style={{
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // flex: "1 1 30%",
                  // gap: "12px",
                  // minWidth: "100px",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Total Working Days : &nbsp; {totalCount?.LoginDays}
                </span>
              </div>

              <div
                style={{
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // flex: "1 1 30%",
                  // gap: "12px",
                  // minWidth: "100px",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Total Man-Hours : &nbsp; {totalCount?.TotalManHour}
                </span>
              </div>
              <div
                style={{
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // flex: "1 1 30%",
                  // gap: "12px",
                  // minWidth: "100px",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Total Man-Minutes : &nbsp; {"00"}
                </span>
              </div>

              <div
                style={{
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // flex: "1 1 30%",
                  // gap: "12px",
                  // minWidth: "100px",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Average Hours/Day : &nbsp; {totalCount?.AvgManHour}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="row d-flex custom-layout">
          <div className="col-sm-8 calendar-container-wrapper">
            <table className="calendar">
              <thead style={{ color: "#0099ff" }}>
                <tr>
                  <th>Sunday</th>
                  <th>Monday</th>
                  <th>Tuesday</th>
                  <th>Wednesday</th>
                  <th>Thursday</th>
                  <th>Friday</th>
                  <th>Saturday</th>
                </tr>
              </thead>
              {/* <tbody ref={drop}>{renderCalendarRows()}</tbody> */}
              <tbody>{renderCalendarRows()}</tbody>
            </table>
          </div>

          <div className="col-sm-4 legend-wrapper">
            {assignedData?.length > 0 && (
              <div className=" dAndD">
                <p
                  className="pendingticketsAssignedtickets"
                  style={{ fontWeight: "bold" }}
                >
                  Assigned Tickets
                </p>
                {/* <DragDropContext>
                  <Droppable droppableId="table" type="row">
                    {(provided) => (
                    )}
                  </Droppable>
                </DragDropContext> */}
                <table
                  // {...provided.droppableProps}
                  // ref={provided.innerRef}
                  className="table table-bordered p-2 table-margin"
                  style={{
                    width: "100%",
                    tableLayout: "fixed",
                    minWidth: "100%",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ minWidth: "30px" }}>Ticket ID</th>
                      <th>Project Name</th>
                      <th>Category</th>
                      <th>Summary</th>
                      <th className="workhours">ManMinutes</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((item, index) => (
                      <Tr item={item} index={index} />
                    ))}
                    {/* {provided.placeholder} */}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    style={{
                      marginRight: "5px",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "none",
                      marginLeft: "5px",
                    }}
                    className="btn btn-sm btn-primary"
                  >
                    Previous
                  </button>
                  <span
                    style={{
                      marginTop: "5px",
                      marginRight: "12px",
                      marginLeft: "12px",
                    }}
                  >
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    style={{
                      marginRight: "5px",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "none",
                      marginLeft: "5px",
                    }}
                    className="btn btn-sm btn-primary"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            <br></br>

            {summaryData?.length > 0 && (
              <>
                <p
                  className="pendingticketsAssignedtickets"
                  style={{ fontWeight: "bold" }}
                >
                  Ticket Status
                </p>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "10px",
                    textAlign: "left",
                    border: "1px solid #444", // Outer border
                    borderRadius: "5px",
                  }}
                  className="table-margin"
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#f4f4f4",
                        borderBottom: "1px solid #444", // Thicker border for header
                      }}
                    >
                      <th
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          borderRight: "1px solid #888",
                          width: "10px",
                        }}
                      >
                        S.No.
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          borderRight: "1px solid #888",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          borderRight: "1px solid #888",
                        }}
                      >
                        Count
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          borderRight: "1px solid #888",
                        }}
                      >
                        ManMinutes
                      </th>
                      <th style={{ padding: "10px", fontWeight: "bold" }}>
                        ManHour
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {console.log("summarydata",summaryData)} */}
                    {summaryData.map((row, index) => (
                      <tr
                        key={row.id + 1}
                        style={{
                          borderBottom: "1px solid #ddd", // Inner row border
                          backgroundColor: row?.rowColor,
                        }}
                      >
                        <td
                          style={{
                            padding: "10px",
                            borderRight: "1px solid #888",
                          }}
                        >
                          {index + 1} {/* Serial Number */}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            fontWeight: "bold",
                            borderRight: "1px solid #888",
                          }}
                        >
                          {capitalizeFirstLetter(row.Status)}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            fontWeight: "bold",
                            borderRight: "1px solid #888",
                          }}
                        >
                          {row?.TicketCount ? row?.TicketCount : 0}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            fontWeight: "bold",
                            borderRight: "1px solid #888",
                          }}
                        >
                          {row?.ManHour}
                        </td>
                        <td style={{ padding: "10px", fontWeight: "bold" }}>
                          {row?.ManMinutes}
                        </td>
                      </tr>
                    ))}

                    {/* New row for total */}
                    <tr
                      style={{
                        backgroundColor: "#f9f9f9",
                        borderTop: "2px solid #444", // Thicker border for separation
                      }}
                    >
                      <td
                        colSpan="2"
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          textAlign: "center",
                          borderRight: "1px solid #888",
                        }}
                      >
                        Total Count
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          borderRight: "1px solid #888",
                        }}
                      >
                        {summaryData.reduce(
                          (total, row) => total + parseFloat(row.TicketCount),
                          0
                        )}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          borderRight: "1px solid #888",
                        }}
                      >
                        {summaryData.reduce(
                          (total, row) => total + parseFloat(row.ManHour),
                          0
                        )}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          borderRight: "1px solid #888",
                        }}
                      >
                        {summaryData.reduce(
                          (total, row) =>
                            total + (parseFloat(row.ManMinutes) || 0),
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeveloperCalendar;
