import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./KanBan.css";
import Heading from "../components/UI/Heading";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { headers } from "../utils/apitools";
import { apiUrls } from "../networkServices/apiEndpoints";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import Input from "../components/formComponent/Input";
import Loading from "../components/loader/Loading";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import Modal from "../components/modalComponent/Modal";
import KanbanNewTicketModal from "../components/UI/customTable/KanbanNewTicketModal";
import { axiosInstances } from "../networkServices/axiosInstance";

// Function to transform API response to kanban data structure
const transformApiDataToKanban = (apiData) => {
  const tasks = {};
  const columnOrder = ["todo", "planned-delayed", "inprogress", "done"];

  // Initialize empty arrays if they don't exist
  const allTickets = apiData.allTickets || [];
  const currentWeekTickets = apiData.currentWeekTickets || [];
  const currentWeekTicketsDelayed = apiData.currentWeekTicketsDelayed || [];
  const inProgressTickets = apiData.InProgress || [];
  const doneTickets = apiData.IsResolved || [];

  // Transform all tickets to tasks (todo column) - BLUE
  allTickets.forEach((ticket) => {
    const taskId = `task-${ticket.TicketID}`;
    if (!tasks[taskId]) {
      tasks[taskId] = {
        id: taskId,
        content: ticket.summary,
        color: "blue", // All tickets get blue color
        avatar: getRandomAvatar(),
        originalData: ticket,
      };
    }
  });

  // Transform current week tickets - ORANGE
  currentWeekTickets.forEach((ticket) => {
    const taskId = `task-${ticket.TicketID}`;
    if (!tasks[taskId]) {
      tasks[taskId] = {
        id: taskId,
        content: ticket.summary,
        color: "pink",
        avatar: getRandomAvatar(),
        originalData: ticket,
      };
    }
  });
  currentWeekTicketsDelayed.forEach((ticket) => {
    const taskId = `task-${ticket.TicketID}`;
    if (!tasks[taskId]) {
      tasks[taskId] = {
        id: taskId,
        content: ticket.summary,
        color: "purple",
        avatar: getRandomAvatar(),
        originalData: ticket,
      };
    }
  });

  // Transform in progress tickets - YELLOW
  inProgressTickets.forEach((ticket) => {
    const taskId = `task-${ticket.TicketID}`;
    if (!tasks[taskId]) {
      tasks[taskId] = {
        id: taskId,
        content: ticket.summary,
        color: "yellow", // In progress tickets get yellow color
        avatar: getRandomAvatar(),
        originalData: ticket,
      };
    }
  });

  // Transform done tickets - GREEN
  doneTickets.forEach((ticket) => {
    const taskId = `task-${ticket.TicketID}`;
    if (!tasks[taskId]) {
      tasks[taskId] = {
        id: taskId,
        content: ticket.summary,
        color: "green", // Done tickets get green color
        avatar: getRandomAvatar(),
        section: formatDate(ticket.TicketRaisedDate),
        originalData: ticket,
      };
    }
  });

  const columns = {
    todo: {
      id: "todo",
      title: "Assigned",
      taskIds: allTickets.map((ticket) => `task-${ticket.TicketID}`),
    },
    planned: {
      id: "planned",
      title: "Planned",
      taskIds: currentWeekTickets.map((ticket) => `task-${ticket.TicketID}`),
    },
    delayed: {
      id: "delayed",
      title: "Delayed",
      taskIds: currentWeekTicketsDelayed.map(
        (ticket) => `task-${ticket.TicketID}`
      ),
    },
    inprogress: {
      id: "inprogress",
      title: "In progress",
      taskIds: inProgressTickets.map((ticket) => `task-${ticket.TicketID}`),
    },
    done: {
      id: "done",
      title: "Resolved",
      taskIds: doneTickets.map((ticket) => `task-${ticket.TicketID}`),
    },
  };

  return {
    tasks,
    columns,
    columnOrder,
  };
};

// Helper functions
const getRandomAvatar = () => {
  const avatars = ["👨‍💻"];
  return avatars[Math.floor(Math.random() * avatars.length)];
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  } catch (error) {
    return "";
  }
};

// Format time for display
const formatTime = (timeString) => {
  if (!timeString) return "";
  return timeString.split(":").slice(0, 2).join(":");
};

// Avatar Tooltip Component - For inprogress and done columns
const AvatarTooltip = ({ task, isVisible, columnId }) => {
  if (!isVisible || !task.originalData) return null;

  const originalData = task.originalData;

  return (
    <div className="avatar-tooltip">
      <div className="tooltip-content">
        <div className="tooltip-row">
          <span className="tooltip-label">Developer: </span>
          <span className="tooltip-value">
            {originalData.DeveloperName || "N/A"}
          </span>
        </div>
        {columnId === "inprogress" && (
          <>
            <div className="tooltip-row">
              <span className="tooltip-label">StartDate: </span>
              <span className="tooltip-value">
                {originalData.Date ? formatDate(originalData.Date) : "N/A"}
              </span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">StartTime: </span>
              <span className="tooltip-value">
                {originalData.Time ? formatTime(originalData.Time) : "N/A"}
              </span>
            </div>
          </>
        )}
        {columnId === "done" && (
          <>
            <div className="tooltip-row">
              <span className="tooltip-label">EndDate: </span>
              <span className="tooltip-value">
                {originalData.Date ? formatDate(originalData.Date) : "N/A"}
              </span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">EndTime: </span>
              <span className="tooltip-value">
                {originalData.Time ? formatTime(originalData.Time) : "N/A"}
              </span>
            </div>
          </>
        )}
      </div>
      <div className="tooltip-arrow"></div>
    </div>
  );
};

// Task Avatar Component with Hover - Shows tooltip for inprogress and done columns
const TaskAvatar = ({ task, columnId }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const showTooltipForColumn = columnId === "inprogress" || columnId === "done";

  return (
    <div
      className="task-avatar-container"
      onMouseEnter={() => showTooltipForColumn && setShowTooltip(true)}
      onMouseLeave={() => showTooltipForColumn && setShowTooltip(false)}
    >
      <div className="task-avatar">{task.avatar}</div>
      {showTooltipForColumn && (
        <AvatarTooltip
          task={task}
          isVisible={showTooltip}
          columnId={columnId}
        />
      )}
    </div>
  );
};

// Component to render task content
const TaskContent = ({ task, columnId }) => {
  return (
    <div className="task-content">
      <div className="task-summary">
        <strong>Developer Name:</strong>
        {task.originalData.DeveloperName}
      </div>
      <div className="task-summary">
        <strong>Summary:</strong>
        {task.content}
      </div>
      <div className="task-summary">
        <strong>TicketID:</strong>
        {task.originalData?.TicketID}
      </div>
      <div className="task-summary">
        <strong>Delivery Date:</strong>
        {task.originalData?.DeliveryDate}
      </div>
      <div className="task-summary">
        <strong>ManMinutes:</strong>
        {task.originalData?.MManHours}
      </div>
    </div>
  );
};

// PlannedDelayedColumn Component - Combined vertical layout
// PlannedDelayedColumn Component - Combined vertical layout
const PlannedDelayedColumn = ({
  plannedColumn,
  delayedColumn,
  data,
  tableData,
  isDragAllowed,
  isDraggingDisabled,
  isDropDisabled,
  onEyeIconClick,
}) => {
  const groupTasksBySection = (taskIds, columnId) => {
    if (columnId !== "done") {
      return { "": taskIds };
    }

    const sections = {};
    taskIds.forEach((taskId) => {
      const task = data.tasks[taskId];
      const section = task.section || "";
      if (!sections[section]) {
        sections[section] = [];
      }
      sections[section].push(taskId);
    });

    return sections;
  };

  const plannedSections = groupTasksBySection(
    plannedColumn.taskIds,
    plannedColumn.id
  );
  const delayedSections = groupTasksBySection(
    delayedColumn.taskIds,
    delayedColumn.id
  );

  // Safe access to total man minutes
  const totalManMinutes =
    tableData?.currentWeekTickets?.[0]?.TotalManHours || "0";

  return (
    <div className="column planned-delayed-column">
      <div className="planned-delayed-container">
        {/* Planned Section */}
        <div className="planned-section">
          <div className="column-header">
            <h3 className="column-title">
              {plannedColumn.title}
              <span className="task-count">
                {" "}
                ({plannedColumn.taskIds.length})
              </span>
            </h3>
            <h3 className="">
              <span style={{ fontWeight: "600", color: "black" }}>
                Total Planned ManMinutes :
              </span>
              &nbsp;
              <span style={{ fontWeight: "bolder", color: "grey" }}>
                {totalManMinutes}
              </span>
            </h3>
          </div>

          <Droppable
            droppableId={plannedColumn.id}
            isDropDisabled={isDropDisabled(plannedColumn.id)}
          >
            {(provided, snapshot) => (
              <div
                className={`task-list ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {Object.entries(plannedSections).map(
                  ([sectionName, taskIds]) => (
                    <div key={sectionName} className="section">
                      {sectionName && (
                        <div className="section-header">{sectionName}</div>
                      )}
                      {taskIds.map((taskId, index) => {
                        const task = data.tasks[taskId];
                        if (!task) return null;

                        return (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={plannedColumn.taskIds.indexOf(taskId)}
                            isDragDisabled={isDraggingDisabled(
                              plannedColumn.id
                            )}
                          >
                            {(provided, snapshot) => (
                              <div
                                className={`task-card ${task.color} ${snapshot.isDragging ? "dragging" : ""} ${isDraggingDisabled(plannedColumn.id) ? "drag-disabled" : ""}`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskContent
                                  task={task}
                                  columnId={plannedColumn.id}
                                />
                                <TaskAvatar
                                  task={task}
                                  columnId={plannedColumn.id}
                                />
                                <i
                                  className="fa fa-eye ml-2 mt-1"
                                  onClick={() => onEyeIconClick(task)}
                                  style={{
                                    marginLeft: "10px",
                                    color: "black",
                                    cursor: "pointer",
                                  }}
                                  title="Click to Ticket Details."
                                ></i>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                    </div>
                  )
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Delayed Section */}
        <div className="delayed-section">
          <div className="column-header">
            <h3 className="column-title">
              {delayedColumn.title}
              <span className="task-count">
                {" "}
                ({delayedColumn.taskIds.length})
              </span>
            </h3>
          </div>

          <Droppable
            droppableId={delayedColumn.id}
            isDropDisabled={isDropDisabled(delayedColumn.id)}
          >
            {(provided, snapshot) => (
              <div
                className={`task-list ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {Object.entries(delayedSections).map(
                  ([sectionName, taskIds]) => (
                    <div key={sectionName} className="section">
                      {sectionName && (
                        <div className="section-header">{sectionName}</div>
                      )}
                      {taskIds.map((taskId, index) => {
                        const task = data.tasks[taskId];
                        if (!task) return null;

                        return (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={delayedColumn.taskIds.indexOf(taskId)}
                            isDragDisabled={isDraggingDisabled(
                              delayedColumn.id
                            )}
                          >
                            {(provided, snapshot) => (
                              <div
                                className={`task-card ${task.color} ${snapshot.isDragging ? "dragging" : ""} ${isDraggingDisabled(delayedColumn.id) ? "drag-disabled" : ""}`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskContent
                                  task={task}
                                  columnId={delayedColumn.id}
                                />
                                <TaskAvatar
                                  task={task}
                                  columnId={delayedColumn.id}
                                />
                                <i
                                  className="fa fa-eye ml-2 mt-1"
                                  onClick={() => onEyeIconClick(task)}
                                  style={{
                                    marginLeft: "10px",
                                    color: "black",
                                    cursor: "pointer",
                                  }}
                                  title="Click to Ticket Details."
                                ></i>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                    </div>
                  )
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  const [data, setData] = useState({
    tasks: {},
    columns: {
      todo: { id: "todo", title: "Assigned", taskIds: [] },
      planned: { id: "planned", title: "Planned", taskIds: [] },
      delayed: { id: "delayed", title: "Delayed", taskIds: [] },
      inprogress: { id: "inprogress", title: "In progress", taskIds: [] },
      done: { id: "done", title: "Done", taskIds: [] },
    },
    columnOrder: ["todo", "planned-delayed", "inprogress", "done"],
  });

  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [assignto, setAssignedto] = useState([]);
  const [formData, setFormData] = useState({
    AssignedTo: [Number(useCryptoLocalStorage("user_Data", "get", "ID"))]
      ? [Number(useCryptoLocalStorage("user_Data", "get", "ID"))]
      : [],
  });

  const userData = useCryptoLocalStorage("user_Data", "get");
  const ReportingManager = userData?.IsReportingManager;
  const IsEmployee = userData?.realname;
  const userId = userData?.ID;

  // Function to check if drag and drop is allowed between columns
  const isDragAllowed = (sourceColumnId, destinationColumnId) => {
    if (sourceColumnId === "todo") {
      return false;
    }

    // Allow both planned and delayed to be dragged to inprogress
    if (sourceColumnId === "planned" || sourceColumnId === "delayed") {
      return destinationColumnId === "inprogress";
    }

    if (sourceColumnId === "inprogress") {
      return destinationColumnId === "done";
    }

    if (sourceColumnId === "done") {
      return false;
    }

    return false;
  };

  // Function to disable dragging for specific columns
  const isDraggingDisabled = (columnId) => {
    return columnId === "todo" || columnId === "done";
  };

  // Function to check if a column can accept drops
  const isDropDisabled = (columnId) => {
    return columnId !== "inprogress" && columnId !== "done";
  };

  // Function to handle manhour entry when ticket is moved to In Progress
  const handleCreateManhourEntry = (ticketData) => {
    if (!ticketData || !ticketData.originalData) {
      toast.error("Invalid ticket data");
      return;
    }

    const originalTicket = ticketData.originalData;

    axiosInstances
      .post(apiUrls.CreateManhourEntry, {
        TicketID: originalTicket.TicketID || "",
        EmployeeID: originalTicket?.EmployeeID || "",
        Action: "START",
        Status: "0",
        timeValue: new Date().toTimeString().split(" ")[0],
        Date: new Date().toISOString().split("T")[0],
      })
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res.data.message);
          handleSearchEmployee();
          handleSearchList();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log("Error creating manhour entry:", err);
        toast.error("Failed to create manhour entry");
      });
  };

  // Function to handle manhour entry when ticket is moved to Done
  const handleCreateDone = (ticketData) => {
    if (!ticketData || !ticketData.originalData) {
      toast.error("Invalid ticket data");
      return;
    }

    const originalTicket = ticketData.originalData;

    axiosInstances
      .post(apiUrls.CreateManhourEntry, {
        TicketID: originalTicket.TicketID || "",
        EmployeeID: originalTicket?.EmployeeID || "",
        Action: "STOP",
        Status: "1",
        timeValue: new Date().toTimeString().split(" ")[0],
        Date: new Date().toISOString().split("T")[0],
      })
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res.data.message);
          handleSearchEmployee();
          handleSearchList();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log("Error creating manhour entry:", err);
        toast.error("Failed to create manhour STOP entry");
      });
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (!isDragAllowed(source.droppableId, destination.droppableId)) {
      toast.error("This move is not allowed");
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    const isMovingToInProgress =
      (source.droppableId === "planned" || source.droppableId === "delayed") &&
      destination.droppableId === "inprogress";

    const isMovingToDone =
      source.droppableId === "inprogress" && destination.droppableId === "done";

    const movedTask = data.tasks[draggableId];

    if (start.id === finish.id) {
      if (start.id === "todo" || start.id === "done") {
        toast.error("Reordering within this column is not allowed");
        return;
      }

      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newState);

    if (isMovingToInProgress && movedTask) {
      handleCreateManhourEntry(movedTask);
    }

    if (isMovingToDone && movedTask) {
      handleCreateDone(movedTask);
    }
  };

  const groupTasksBySection = (taskIds, columnId) => {
    if (columnId !== "done") {
      return { "": taskIds };
    }

    const sections = {};
    taskIds.forEach((taskId) => {
      const task = data.tasks[taskId];
      const section = task.section || "";
      if (!sections[section]) {
        sections[section] = [];
      }
      sections[section].push(taskId);
    });

    return sections;
  };

  // Function to handle eye icon click
  const handleEyeIconClick = (task) => {
    setVisible({
      showVisible: true,
      showData: task,
      task,
    });
  };

  const getAssignTo = () => {
    axiosInstances
      .post(apiUrls.AssignTo_Select, {
        ID: userId,
      })
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { name: item?.Name, code: item?.ID };
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
      [name]: selectedValues,
    }));
  };

  const handleSearchList = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.GetKanbanViewList, {
        AssignToID: formData?.AssignedTo ? formData.AssignedTo.join(",") : "0",
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res?.data?.data);
          const kanbanData = transformApiDataToKanban(res?.data?.data);
          setData(kanbanData);
        } else {
          toast.error("No Record Found.");
          setTableData([]);
          setData({
            tasks: {},
            columns: {
              todo: { id: "todo", title: "Assigned", taskIds: [] },
              planned: { id: "planned", title: "Planned", taskIds: [] },
              delayed: { id: "delayed", title: "Delayed", taskIds: [] },
              inprogress: {
                id: "inprogress",
                title: "In progress",
                taskIds: [],
              },
              done: { id: "done", title: "Done", taskIds: [] },
            },
            columnOrder: ["todo", "planned-delayed", "inprogress", "done"],
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSearchEmployee = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.GetKanbanViewList, {
        AssignToID: userId,
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res?.data?.data);
          const kanbanData = transformApiDataToKanban(res?.data?.data);
          setData(kanbanData);
        } else {
          toast.error("No Record Found.");
          setTableData([]);
          setData({
            tasks: {},
            columns: {
              todo: { id: "todo", title: "Assigned", taskIds: [] },
              planned: { id: "planned", title: "Planned", taskIds: [] },
              delayed: { id: "delayed", title: "Delayed", taskIds: [] },
              inprogress: {
                id: "inprogress",
                title: "In progress",
                taskIds: [],
              },
              done: { id: "done", title: "Done", taskIds: [] },
            },
            columnOrder: ["todo", "planned-delayed", "inprogress", "done"],
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAssignTo();
    if (ReportingManager == 1) {
      handleSearchList();
    } else {
      handleSearchEmployee();
    }
  }, []);

  const [visible, setVisible] = useState({
    showVisible: false,
    showData: {},
  });

  return (
    <>
      {visible?.showVisible && (
        <Modal
          modalWidth={"1000px"}
          visible={visible}
          setVisible={setVisible}
          Header={t("Ticket Details")}
        >
          <KanbanNewTicketModal visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          {ReportingManager == 1 ? (
            <MultiSelectComp
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="AssignedTo"
              placeholderName={t("Employee")}
              dynamicOptions={assignto}
              optionLabel="AssignedTo"
              className="AssignedTo"
              handleChange={handleMultiSelectChange}
              value={formData?.AssignedTo?.map((code) => ({
                code,
                name: assignto.find((item) => item.code === code)?.name,
              }))}
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
          {ReportingManager == 1 ? (
            <div>
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={handleSearchList}
                  disabled={loading}
                >
                  Search
                </button>
              )}
            </div>
          ) : (
            <div>
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-info ml-2"
                  onClick={handleSearchEmployee}
                  disabled={loading}
                >
                  Search
                </button>
              )}
            </div>
          )}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-board">
            {data.columnOrder.map((columnId) => {
              if (columnId === "planned-delayed") {
                return (
                  <PlannedDelayedColumn
                    key="planned-delayed"
                    plannedColumn={data.columns.planned}
                    delayedColumn={data.columns.delayed}
                    data={data}
                    tableData={tableData}
                    isDragAllowed={isDragAllowed}
                    isDraggingDisabled={isDraggingDisabled}
                    isDropDisabled={isDropDisabled}
                    onEyeIconClick={handleEyeIconClick} // Pass the eye icon click handler
                  />
                );
              }

              const column = data.columns[columnId];
              const sections = groupTasksBySection(column.taskIds, columnId);

              return (
                <div key={column.id} className="column">
                  <div className="column-header">
                    <h3 className="column-title">
                      {column.title}
                      {column.subtitle && (
                        <span className="column-subtitle">
                          {" "}
                          {column.subtitle}
                        </span>
                      )}
                      <span className="task-count">
                        {" "}
                        ({column.taskIds.length})
                      </span>
                    </h3>
                  </div>

                  <Droppable
                    droppableId={column.id}
                    isDropDisabled={isDropDisabled(columnId)}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`task-list ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {Object.entries(sections).map(
                          ([sectionName, taskIds]) => (
                            <div key={sectionName} className="section">
                              {sectionName && (
                                <div className="section-header">
                                  {sectionName}
                                </div>
                              )}
                              {taskIds.map((taskId, index) => {
                                const task = data.tasks[taskId];
                                if (!task) return null;

                                return (
                                  <Draggable
                                    key={task.id}
                                    draggableId={task.id}
                                    index={column.taskIds.indexOf(taskId)}
                                    isDragDisabled={isDraggingDisabled(
                                      columnId
                                    )}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        className={`task-card ${task.color} ${snapshot.isDragging ? "dragging" : ""} ${isDraggingDisabled(columnId) ? "drag-disabled" : ""}`}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <TaskContent
                                          task={task}
                                          columnId={columnId}
                                        />
                                        <TaskAvatar
                                          task={task}
                                          columnId={columnId}
                                        />
                                        <i
                                          className="fa fa-eye ml-2 mt-1"
                                          onClick={() =>
                                            handleEyeIconClick(task)
                                          }
                                          style={{
                                            marginLeft: "10px",
                                            color: "black",
                                            cursor: "pointer",
                                          }}
                                          title="Click to Ticket Details."
                                        ></i>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                            </div>
                          )
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </>
  );
};

export default KanbanBoard;
