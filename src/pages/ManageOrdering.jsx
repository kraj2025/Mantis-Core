import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import { useTranslation } from "react-i18next";
import MultiSelectComp from "../components/formComponent/MultiSelectComp";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import Tables from "../components/UI/customTable";
import { userVSprojectTHEAD } from "../components/modalComponent/Utils/HealperThead";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import ReactSelect from "../components/formComponent/ReactSelect";
import Loading from "../components/loader/Loading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const ManageOrdering = () => {
  const [t] = useTranslation();

  const [mainData, setMainData] = useState([]);
  const ManageOrderingTable = ({ userVSprojectTHEAD, mainData }) => {
    const [tableData, setTableData] = useState(mainData);

    // Function to handle the drag end
    const onDragEnd = (result) => {
      if (!result.destination) return;
      const updatedData = Array.from(tableData);
      const [movedItem] = updatedData.splice(result.source.index, 1);
      updatedData.splice(result.destination.index, 0, movedItem);
      setTableData(updatedData);
      setMainData(updatedData);
      // handleDragProject(movedItem,result.source.index)
    };
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <table
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ paddingLeft: "0px" }}>
                  {userVSprojectTHEAD.map((header, idx) => (
                    <th
                      key={idx}
                      style={{
                        border: "1px solid #ccc",
                        paddingRight: "100px",
                        textAlign: "left",
                      }}
                      className="userVSprojectTHEAD"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((ele, index) => (
                  <Draggable
                    key={ele.ProjectID.toString()}
                    draggableId={ele.ProjectID.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          border: "1px solid #ccc",
                          padding: "8px",
                        }}
                      >
                        <td>{index + 1}</td>
                        <td>{ele.ProjectID}</td>
                        <td>{ele.ProjectName}</td>
                      </tr>
                    )}
                  </Draggable>
                ))}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    VerticalID: "",
    TeamID: "",
    WingID: "",
  });
  const [vertical, setVertical] = useState([]);
  const [team, setTeam] = useState([]);
  const [wing, setWing] = useState([]);

  const getVertical = () => {
    // let form = new FormData();
    // form.append("Id", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.Vertical_Select, form, { headers })
    axiosInstances
      .post(apiUrls.Vertical_Select, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
      })
      .then((res) => {
        const verticals = res?.data.data.map((item) => {
          return { label: item?.Vertical, value: item?.VerticalID };
        });
        setVertical(verticals);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getTeam = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.Team_Select, form, { headers })
    axiosInstances
      .post(apiUrls.Team_Select, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
      })
      .then((res) => {
        const teams = res?.data.data.map((item) => {
          return { label: item?.Team, value: item?.TeamID };
        });
        setTeam(teams);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getWing = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.Wing_Select, form, { headers })
    axiosInstances
      .post(apiUrls.Wing_Select, {
        Id: useCryptoLocalStorage("user_Data", "get", "ID"),
      })
      .then((res) => {
        const wings = res?.data.data.map((item) => {
          return { label: item?.Wing, value: item?.WingID };
        });
        setWing(wings);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = () => {
    if (formData?.VerticalID == "") {
      toast.error("Please Select Vertical.");
    } else if (formData?.TeamID == "") {
      toast.error("Please Select Team.");
    } else if (formData?.WingID == "") {
      toast.error("Please Select Wing.");
    } else {
      setLoading(true);
      axiosInstances
        .post(apiUrls.SelectProjectOrdering, {
          VerticalID: Number(formData?.VerticalID),
          TeamID: Number(formData?.TeamID),
          WingID: Number(formData?.WingID),
        })
        .then((res) => {
          const data = res?.data?.data;
          setMainData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const handleDragProject = (reorderedData) => {
    let payload = reorderedData?.map((val, index) => ({
      ID: index + 1, // ordering index
      Name: val?.ProjectName,
      ProjectID: val?.ProjectID,
    }));

    setLoading(true);

    axiosInstances
      .post(apiUrls.UpdateProjectOrdering, {
        OrderData: payload, // ✅ send array inside OrderData
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getVertical();
    getTeam();
    getWing();
  }, []);
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <>
      <div className="card">
        <Heading title="Project Ordering" isBreadcrumb={false} />
        <div className="row m-2">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="VerticalID"
            placeholderName="Vertical"
            dynamicOptions={vertical}
            optionLabel="VerticalID"
            handleChange={handleDeliveryChange}
            value={formData.VerticalID}
            requiredClassName={"required-fields"}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="TeamID"
            placeholderName="Team"
            dynamicOptions={team}
            handleChange={handleDeliveryChange}
            value={formData.TeamID}
            requiredClassName={"required-fields"}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="WingID"
            placeholderName="Wing"
            dynamicOptions={wing}
            handleChange={handleDeliveryChange}
            value={formData?.WingID}
            requiredClassName={"required-fields"}
          />
          <div className="col-2">
            {loading ? (
              <Loading />
            ) : (
              <button className="btn btn-sm btn-info" onClick={handleSearch}>
                Search
              </button>
            )}
          </div>
        </div>
      </div>
      {mainData?.length > 0 && (
        <div className="card mt-2">
          <Heading
            title={"Search Details"}
            secondTitle={
              <div>
                <button
                  className="btn btn-sm btn-success"
                  // onClick={handleDragProject}
                  onClick={() => handleDragProject(mainData)}
                >
                  Save
                </button>
              </div>
            }
          />
          <ManageOrderingTable
            userVSprojectTHEAD={userVSprojectTHEAD}
            mainData={mainData}
          />
        </div>
      )}
    </>
  );
};
export default ManageOrdering;
