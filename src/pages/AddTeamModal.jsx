import React, { useEffect, useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";
import { apiUrls } from "../networkServices/apiEndpoints";
import Heading from "../components/UI/Heading";
import Tables from "../components/UI/customTable";
import Loading from "../components/loader/Loading";
import { axiosInstances } from "../networkServices/axiosInstance";
import { toast } from "react-toastify";
const AddTeamModal = (ele) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState([]);
  const [formData, setFormData] = useState({
    Team: "",
  });
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const newRoleTHEAD = ["S.No.", "Team Name", "Remove"];

  const getTeam = () => {
    axiosInstances
      .post(apiUrls?.Team_Select, {})
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
  const handleSearch = () => {
    axiosInstances
      .post(apiUrls?.UserVsTeam_Select, {
        EmployeeId: Number(ele?.visible?.showData?.id),
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleADD = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls?.UserVsTeamMapping, {
        TeamID: Number(formData?.Team),
        Status: "Add",
        EmployeeId: Number(ele?.visible?.showData?.id),
      })
      .then((res) => {
        toast.success(res?.data?.message);
        handleSearch();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleRemove = (item) => {
    setLoading(true);
    axiosInstances
      .post(apiUrls?.UserVsTeamMapping, {
        TeamID: Number(item?.TeamID),
        Status: "Remove",
        EmployeeId: Number(ele?.visible?.showData?.id),
      })
      .then((res) => {
        toast.success(res?.data?.message);
        handleSearch();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    getTeam();
    handleSearch();
  }, []);
  return (
    <>
      <div className="row ml-2">
        <span style={{ fontWeight: "bold" }}>
          Employee Name: &nbsp; {ele?.visible?.showData?.realname}
        </span>
      </div>
      <div className="row m-2">
        <ReactSelect
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          name="Team"
          placeholderName="Team"
          dynamicOptions={team}
          handleChange={handleDeliveryChange}
          value={formData.Team}
        />
        <div className="col-2">
          {loading ? (
            <Loading />
          ) : (
            <button className="btn btn-sm btn-success" onClick={handleADD}>
              Add Team
            </button>
          )}
        </div>
      </div>
      <div className="card">
        <Heading title={"Search Details"} />
        <Tables
          thead={newRoleTHEAD}
          tbody={tableData?.map((ele, index) => ({
            "S.No.": index + 1,
            "Team Name": ele?.Team,
            Remove: (
              <i
                className="fa fa-remove"
                style={{ color: "red" }}
                onClick={() => {
                  handleRemove(ele);
                }}
              >
                X
              </i>
            ),
          }))}
          tableHeight={"tableHeight"}
        />
        {/* <div className="col-2">
          <button className="btn btn-sm btn-success m-1">Save</button>
        </div> */}
      </div>
    </>
  );
};
export default AddTeamModal;
