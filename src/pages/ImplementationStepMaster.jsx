import React, { useEffect, useState } from "react";
import Input from "../components/formComponent/Input";
import ReactSelect from "../components/formComponent/ReactSelect";
import Heading from "../components/UI/Heading";
import Tables from "../components/UI/customTable";
import { implementTHEAD } from "../components/modalComponent/Utils/HealperThead";
import {
  DeleteImplementaionMaster,
  GetImplementaionMaster,
  SaveImplementaionMaster,
  UpdateImplementation,
} from "../networkServices/opdserviceAPI";
import { toast } from "react-toastify";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";

const ImplementationStepMaster = () => {
  const [group, setGroup] = useState([]);
  const [interdependent, setInterdependent] = useState([]);
  const [productVersion, setProductVersion] = useState([]);
  const [details, setDetails] = useState([]);
  const [formData, setFormData] = useState({
    Group: "",
    Steps: "",
    Responsible: "",
    Type: "",
    RequiredDays: "",
    Interdependent: "",
    ProductVersion: "",
  });
  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name == "ProductVersion") {
      fetchproductdetails(value);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchproductdetails = async (value) => {
    try {
      const detailresponse = await GetImplementaionMaster({
        Type: "Detail",
        ProductID: String(value || ""),
      });

      setDetails(detailresponse?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdate = async () => {
    const getLabel = (id) => {
      let ele = productVersion?.filter((item) => item.value == id);
      return ele[0]?.label;
    };

    if (
      formData?.Group == "" ||
      formData?.Steps == "" ||
      formData?.Responsible == "" ||
      formData?.Type == "" ||
      formData?.RequiredDays == "" ||
      formData?.Interdependent == "" ||
      formData?.ProductVersion == ""
    ) {
      toast.error("All fields are mandatory");
      return;
    }

    try {
      const payload = {
        ID: String(useCryptoLocalStorage("user_Data", "get", "ID") || ""),
        StepID: String(formData?.Id || ""),
        GroupId: String(formData?.Group || ""),
        Steps: String(formData?.Steps || ""),
        ResponsibleID: String(formData?.Responsible || ""),
        ImpleTypeId: String(formData?.Type || ""),
        ReqDays: String(formData?.RequiredDays || ""),
        InterdependentId: String(formData?.Interdependent || ""),
        ProductID: String(formData?.ProductVersion || ""),
        Product: String(getLabel(formData?.ProductVersion) || ""),
      };

      const detailresponse = await UpdateImplementation(payload);

      if (detailresponse?.data?.success === true) {
        toast.success(detailresponse?.data?.message || "Updated successfully");
        fetchproductdetails(formData?.ProductVersion);

        setFormData({
          ProductVersion: formData?.ProductVersion,
          Group: "",
          Steps: "",
          Responsible: "",
          Type: "",
          RequiredDays: "",
          Interdependent: "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    const getLabel = (id) => {
      let ele = productVersion.filter((item) => {
        return item.value == id;
      });
      return ele[0]?.label;
    };

    try {
      if (
        formData?.Group == "" ||
        formData?.Steps == "" ||
        formData?.Responsible == "" ||
        formData?.Type == "" ||
        formData?.RequiredDays == "" ||
        formData?.Interdependent == "" ||
        formData?.ProductVersion == ""
      ) {
        toast.error("All fields are mandatory");
        return;
      }

      const payload = {
        ID: String(useCryptoLocalStorage("user_Data", "get", "ID") || ""),
        GroupId: String(formData?.Group || ""),
        Steps: String(formData?.Steps || ""),
        ResponsibleID: String(formData?.Responsible || ""),
        ImpleTypeId: String(formData?.Type || ""),
        ReqDays: String(formData?.RequiredDays || ""),
        InterdependentId: String(formData?.Interdependent || ""),
        ProductID: String(formData?.ProductVersion || ""),
        Product: String(getLabel(formData?.ProductVersion) || ""),
      };

      const detailresponse = await SaveImplementaionMaster(payload);

      if (detailresponse?.data?.success === true) {
        toast.success(detailresponse?.data?.message);
        fetchproductdetails(formData?.ProductVersion);
        setFormData({
          ...formData,
          Group: "",
          Steps: "",
          Responsible: "",
          Type: "",
          RequiredDays: "",
          Interdependent: "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchdropdowns = async () => {
    try {
      // Build JSON payloads instead of FormData
      const productPayload = {
        Type: "Product",
        ProductID: "",
      };

      const groupPayload = {
        Type: "Group",
        ProductID: "",
      };

      const dependentPayload = {
        Type: "Dependent",
        ProductID: "",
      };

      const productresponse = await GetImplementaionMaster(productPayload);
      const groupresponse = await GetImplementaionMaster(groupPayload);
      const depresponse = await GetImplementaionMaster(dependentPayload);

      setProductVersion(
        productresponse?.data?.data.map((item) => ({
          label: item?.NAME,
          value: item?.id,
        }))
      );

      setGroup(
        groupresponse?.data?.data.map((item) => ({
          label: item?.GroupName,
          value: item?.Groupid,
        }))
      );

      setInterdependent(
        depresponse?.data?.data.map((item) => ({
          label: item?.Steps,
          value: item?.Id,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const removeStep = async (id) => {
    try {
      const payload = {
        ID: String(useCryptoLocalStorage("user_Data", "get", "ID") || ""),
        StepID: String(id || ""),
      };
      const detailresponse = await DeleteImplementaionMaster(payload);

      toast.success(detailresponse?.data?.message);
      fetchproductdetails(formData?.ProductVersion);
    } catch (error) {
      console.error(error);
    }
  };
  const handleEdit = (ele) => {
    setFormData({
      ...formData,
      Group: ele?.GroupId,
      Steps: ele?.Steps,
      Responsible: ele?.ResponsibleId,
      Type: ele?.ImpleTypeId,
      RequiredDays: ele?.ReqDays,
      Interdependent: ele?.InterdependentId,
      Id: ele?.Id,
    });
  };
  useEffect(() => {
    fetchdropdowns();
  }, []);
  return (
    <>
      <div className="card patient_registration border">
        <Heading title={"Implementation Step Master"} isBreadcrumb={true} />
        <div className="row g-4 m-2">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="ProductVersion"
            placeholderName="ProductVersion"
            dynamicOptions={productVersion}
            value={formData?.ProductVersion}
            handleChange={handleDeliveryChange}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Group"
            placeholderName="Group"
            dynamicOptions={group}
            value={formData?.Group}
            handleChange={handleDeliveryChange}
          />
          <textarea
            type="text"
            respclass="col-md-6 col-12 col-sm-12"
            className="form-control textArea"
            placeholder="Steps "
            id={"Steps"}
            name="Steps"
            value={formData?.Steps}
            onChange={handleChange}
            style={{ width: "16%", marginLeft: "7.5px" }}
          ></textarea>
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Responsible"
            placeholderName="Responsible"
            dynamicOptions={[
              { label: "Service Provider", value: 1 },
              {
                label: "Client",
                value: 2,
              },
            ]}
            value={formData?.Responsible}
            handleChange={handleDeliveryChange}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Type"
            placeholderName="Type"
            dynamicOptions={[
              { label: "Online", value: 1 },
              {
                label: "On Center",
                value: 2,
              },
            ]}
            value={formData?.Type}
            handleChange={handleDeliveryChange}
          />

          <Input
            type="number"
            className="form-control"
            id="RequiredDays"
            name="RequiredDays"
            lable="RequiredDays"
            onChange={handleChange}
            value={formData?.RequiredDays}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
            name="Interdependent"
            placeholderName="Interdependent"
            dynamicOptions={interdependent}
            value={formData?.Interdependent}
            handleChange={handleDeliveryChange}
          />

          <div className="col-2 mt-1">
            {formData?.Id ? (
              <button className="btn btn-sm btn-primary" onClick={handleUpdate}>
                Update
              </button>
            ) : (
              <button className="btn btn-sm btn-success" onClick={handleSubmit}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="card">
        <Tables
          thead={implementTHEAD}
          tbody={details?.map((ele, index) => ({
            "S.No.": index + 1,
            "Group Name": ele?.Groupname,
            Steps: (
              <div
                title={ele?.Steps} // Full detail as tooltip
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "150px", // Adjust this width as needed
                  cursor: "pointer",
                }}
              >
                {ele?.Steps}
              </div>
            ),
            Responsible: ele?.Responsible,
            Type: ele?.ImpleType,
            RequiredDays: ele?.ReqDays,
            Interdependent: (
              <div
                title={ele?.Interdependent} // Full detail as tooltip
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "250px", // Adjust this width as needed
                  cursor: "pointer",
                }}
              >
                {ele?.Interdependent}
              </div>
            ),
            Project: ele?.product,
            Action: (
              <i
                className="fa fa-edit"
                style={{ cursor: "pointer", color: "black" }}
                onClick={() => handleEdit(ele)}
              ></i>
            ),
            Remove: (
              <i
                className="fa fa-trash"
                style={{ cursor: "pointer", color: "red" }}
                onClick={() => removeStep(ele?.Id)}
              ></i>
            ),
          }))}
          tableHeight={"tableHeight"}
        />
      </div>
    </>
  );
};

export default ImplementationStepMaster;
