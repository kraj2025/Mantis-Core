import React, { useEffect, useState } from "react";
import ReactSelect from "../components/formComponent/ReactSelect";
import { apiUrls } from "../networkServices/apiEndpoints";
import Heading from "../components/UI/Heading";
import Tables from "../components/UI/customTable";
import { toast } from "react-toastify";
import { axiosInstances } from "../networkServices/axiosInstance";
const AddVerticalModal = (ele) => {
  const [tableData, setTableData] = useState([]);
  const [vertical, setVertical] = useState([]);
  const [formData, setFormData] = useState({
    Vertical: "",
  });
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const newRoleTHEAD = ["S.No.", "Vertical Name", "Remove"];

  const getVertical = () => {
    axiosInstances
      .post(apiUrls?.Vertical_Select, {})
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

  const handleSearch = () => {
    axiosInstances
      .post(apiUrls?.UserVsVertical_Select, {
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
    axiosInstances
      .post(apiUrls?.UserVsVerticalMapping, {
        EmployeeId: Number(ele?.visible?.showData?.id),
        Status: String("Add"),
        VerticalID: Number(formData?.Vertical),
      })
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res?.data?.message);
          handleSearch();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleRemove = (item) => {
    axiosInstances
      .post(apiUrls?.UserVsVerticalMapping, {
        EmployeeId: Number(ele?.visible?.showData?.id),
        Status: String("Remove"),
        VerticalID: Number(item?.VerticalID),
      })
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res?.data?.message);
          handleSearch();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getVertical();
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
          name="Vertical"
          placeholderName="Vertical"
          dynamicOptions={vertical}
          handleChange={handleDeliveryChange}
          value={formData.Vertical}
        />
        <div className="col-2">
          <button className="btn btn-sm btn-success" onClick={handleADD}>
            Add Vertical
          </button>
        </div>
      </div>
      <div className="card">
        <Heading title={"Search Details"} />
        <Tables
          thead={newRoleTHEAD}
          tbody={tableData?.map((ele, index) => ({
            "S.No.": index + 1,
            "Vertical Name": ele?.Vertical,
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
export default AddVerticalModal;
