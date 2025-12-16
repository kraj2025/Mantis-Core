import React, { useEffect, useState } from "react";
import Heading from "../components/UI/Heading";
import Modal from "../components/modalComponent/Modal";
import RoleMaster from "./CRM/RoleMaster";
import MenuMaster from "./CRM/MenuMaster";
import ReactSelect from "../components/formComponent/ReactSelect";
import NewFileMaster from "./CRM/NewFileMaster";
import { apiUrls } from "../networkServices/apiEndpoints";
import axios from "axios";
import { headers } from "../utils/apitools";
import { toast } from "react-toastify";
import Loading from "../components/loader/Loading";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const AccessRight = (data) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    RoleMaster: {},
    MenuMaster: "",
  });
  const [roleMaster, setRoleMaster] = useState([]);
  const [menuMaster, setMenuMaster] = useState([]);
  const [visible, setVisible] = useState({
    ShowRole: false,
    ShowMenu: false,
    ShowFile: false,
    showData: {},
  });
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name === "RoleMaster") {
      setFormData({
        ...formData,
        [name]: e,
      });
      return;
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const bindMenu = () => {
    axiosInstances
      .post(apiUrls.SearchMenu, {
        MenuName: "",
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.MenuName, value: item?.ID };
        });
        setMenuMaster(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const bindRole = () => {
    axiosInstances
      .post(apiUrls.SearchRole, {
        RoleName: String(""),
      })
      .then((res) => {
        const poc3s = res?.data.data.map((item) => {
          return { label: item?.RoleName, value: item?.ID, ...item };
        });
        setRoleMaster(poc3s);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = () => {
    if (!Object.keys(formData?.RoleMaster)?.length > 0) {
      toast.error("Please Select Role.");
    } else if (formData?.MenuMaster == "") {
      toast.error("Please Select Menu.");
    } else {
      setLoading(true);
      axiosInstances
        .post(apiUrls.AccessRight_Bind, {
          RoleID: Number(formData?.RoleMaster?.value),
          MenuID: Number(formData?.MenuMaster),
        })
        .then((res) => {
          setMappedItems(res?.data?.data?.Available);
          setUnmappedItems(res?.data?.data?.Remaining);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    bindMenu();
    bindRole();
  }, []);

  // Initial Data for Mapped and Unmapped Items
  const [mappedItems, setMappedItems] = useState([]);
  const [unmappedItems, setUnmappedItems] = useState([]);

  const [selectedUnmappedItem, setSelectedUnmappedItem] = useState(null);
  const [selectedMappedItem, setSelectedMappedItem] = useState(null);

  const handleAdd = () => {
    axiosInstances
      .post(apiUrls.AccessRight_Insert, {
        RoleID: Number(formData?.RoleMaster?.value),
        UrlID: Number(unmappedItems[selectedUnmappedItem]?.id),
        ActionType: String("Add"),
      })
      .then((res) => {
        if (res?.data?.success === true) {
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

  const handleSelectMapItem = (index) => {
    setSelectedMappedItem(index);
    setSelectedUnmappedItem(null);
  };
  const hanldeSelectedUnmappedItem = (index) => {
    setSelectedUnmappedItem(index);
    setSelectedMappedItem(null);
  };
  const handleRemove = () => {
    axiosInstances
      .post(apiUrls.AccessRight_Update, {
        RoleID: Number(formData?.RoleMaster?.value),
        UrlID: Number(mappedItems[selectedMappedItem]?.ID),
        ActionType: String("Remove"),
      })
      .then((res) => {
        if (res?.data?.success === true) {
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

  return (
    <>
      {visible?.ShowRole && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Role Master"
        >
          <RoleMaster visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.ShowMenu && (
        <Modal
          modalWidth={"800px"}
          visible={visible}
          setVisible={setVisible}
          Header="Menu Master"
        >
          <MenuMaster visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      {visible?.ShowFile && (
        <Modal
          modalWidth={"700px"}
          visible={visible}
          setVisible={setVisible}
          Header="File Details"
        >
          <NewFileMaster visible={visible} setVisible={setVisible} />
        </Modal>
      )}
      <div className="card">
        <Heading
          title="AccessRight"
          isBreadcrumb={true}
          secondTitle={
            <div className="col d-flex">
              <button
                className="btn btn-sm btn-info ml-2"
                onClick={() => {
                  setVisible({ ShowFile: true, showData: "" });
                }}
              >
                New File
              </button>
              <button
                className="btn btn-sm btn-info ml-2"
                onClick={() => {
                  setVisible({ ShowRole: true, showData: "" });
                }}
              >
                Role Master
              </button>
              <button
                className="btn btn-sm btn-info ml-2"
                onClick={() => {
                  setVisible({ ShowMenu: true, showData: "" });
                }}
              >
                Menu Master
              </button>
            </div>
          }
        />
        <div className="row g-4 m-2">
          <div className="col-2">
            <ReactSelect
              respclass="col-xl-12 col-md-4 col-sm-6 col-12"
              name="RoleMaster"
              placeholderName="Role"
              dynamicOptions={roleMaster}
              handleChange={handleDeliveryChange}
              value={formData.RoleMaster?.value}
              requiredClassName={"required-fields"}
            />
            <div>
              <label>Menu Name: &nbsp; {formData?.RoleMaster?.MenuNames}</label>
            </div>
          </div>

          <div className="col-2">
            <ReactSelect
              respclass="col-xl-12 col-md-4 col-sm-6 col-12"
              name="MenuMaster"
              placeholderName="Menu"
              dynamicOptions={menuMaster}
              handleChange={handleDeliveryChange}
              value={formData.MenuMaster}
              requiredClassName={"required-fields"}
            />
          </div>

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
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px",
          }}
        >
          {/* Mapped Items List */}
          <div
            style={{ width: "40%", border: "1px solid #ccc", padding: "10px" }}
          >
            <h3 style={{ color: "green", fontWeight: "bold" }}>Available</h3>
            {/* <Heading  title={"Available"}/> */}
            <ul style={{ listStyle: "none", padding: 0 }}>
              {mappedItems?.map((item, index) => (
                <li
                  key={item?.ID}
                  style={{
                    cursor: "pointer",
                    color: index === selectedMappedItem ? "blue" : "black",
                  }}
                  onClick={() => handleSelectMapItem(index)}
                >
                  {item?.FileName}
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons to Move Items */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <button
              onClick={handleAdd}
              disabled={selectedUnmappedItem !== null ? false : true}
              className="btn btn-sm "
              style={{ color: "white" }}
            >
              &#8592;&nbsp;Left
            </button>
            <button
              onClick={handleRemove}
              disabled={selectedMappedItem !== null ? false : true}
              // disabled={!selectedMappedItem}
              className="btn btn-sm  mt-2"
              style={{ color: "white" }}
            >
              Right&nbsp;&#8594;
            </button>
          </div>

          {/* Unmapped Items List */}
          <div
            style={{ width: "40%", border: "1px solid #ccc", padding: "10px" }}
          >
            <h3 style={{ color: "blue", fontWeight: "bold" }}>Non-Available</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {unmappedItems?.map((item, index) => (
                <li
                  key={item?.id}
                  style={{
                    cursor: "pointer",
                    color: index === selectedUnmappedItem ? "blue" : "black",
                  }}
                  onClick={() => {
                    hanldeSelectedUnmappedItem(index);
                  }}
                >
                  {item.FileName}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
export default AccessRight;
