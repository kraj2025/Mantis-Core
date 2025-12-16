import React, { useEffect, useState } from "react";

import Heading from "../../../../components/UI/Heading";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import Input from "../../../../components/formComponent/Input";
import Tables from "../../../../components/UI/customTable";
import {
  AIClientQuestionMaster,
  AIClientQuestionMasterInsertUpdateDelete,
  QuestionAllowPermissionAPI,
} from "../../chatapi";
import { apiUrls } from "../../../../networkServices/apiEndpoints";
import { headers } from "../../../../utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";

const SettingsModal = ({ clientCode, dashboardData, handleAiDetails }) => {
  const initialQuestion = { question: "", isUpdate: 0 };
  const [values, setValues] = useState(initialQuestion);
  const [inputs, setInputs] = useState(dashboardData);
  const dynamicOptions = Array.from({ length: 20 }, (_, i) => ({
    label: i + 1,
    value: i + 1,
  }));
  const [tableData, setTableData] = useState([]);
  const THEAD = [
    { name: "S.No.", width: "1%" },
    { name: "Question", width: "30%" },
    { name: "Actions", width: "1%" },
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const AddQuestionsMayank = async (val, Type) => {
    if (!values?.question && Type !== "Delete") {
      notify("Please Enter Question", "error");
      return;
    }
    const payload = {
      clientCode: clientCode,
      question: values?.question,
      isActive: Type === "Delete" ? 0 : 1,
      isUpdate: Type === "Save" ? 0 : 1,
      id: Type === "Save" ? 0 : val?.ID,
    };
    const apiResp = await AIClientQuestionMasterInsertUpdateDelete(payload);
    if (apiResp?.success) {
      notify(apiResp?.message, "success");
      GetQuestionList();
      setValues(initialQuestion);
    } else {
      notify(apiResp?.message, "error");
    }
  };

  const AddQuestions = (val, Type) => {
    let form = new FormData();
    form.append("clientCode", "REACT2025e8d7c6b5a4f3e2d1c0b"),
      form.append("question", values?.question),
      form.append("isActive", Type === "Delete" ? 0 : 1),
      form.append("isUpdate", Type === "Save" ? 0 : 1),
      form.append("id", Type === "Save" ? 0 : val?.ID);
    axios
      .post(apiUrls?.AIClientQuestionMasterInsert, form, {
        headers,
      })
      .then((res) => {
        toast.success(res.data.message);
        setValues(initialQuestion);
        GetQuestionList();
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (value) => {
    setValues((val) => ({
      ...val,
      question: value?.Question,
      isUpdate: 1,
      ID: value,
    }));
  };

  const GetQuestionList = () => {
    let form = new FormData();
    form.append("clientCode", "REACT2025e8d7c6b5a4f3e2d1c0b"),
      axios
        .post(apiUrls?.AIClientQuestionMaster, form, {
          headers,
        })
        .then((res) => {
          setTableData(res.data.data);
          handleAiDetails();
        })
        .catch((err) => console.log(err));
  };
  useEffect(() => {
    GetQuestionList();
  }, []);

  const handleSelect = (name, value) => {
    // debugger
    setInputs((val) => ({ ...val, [name]: value?.value }));
  };

  const QuestionAllowPermission = () => {
    let form = new FormData();
    form.append("clientCode", "REACT2025e8d7c6b5a4f3e2d1c0b"),
      form.append("maximumQuestionAllow", inputs?.MaximumQuestionAllow),
      form.append("isOpenQuestionAllow", inputs?.IsOpenQuestionAllow),
      axios
        .post(apiUrls?.AIClientUpdatePatientAccess, form, {
          headers,
        })
        .then((res) => {
          toast.success(res.data.message);
          GetQuestionList();
        })
        .catch((err) => console.log(err));
  };

  return (
    <>
      <Heading title={"Questions Allow"} />
      <div className="row mb-3 mt-2">
        <ReactSelect
          placeholderName={"Maximum Question Allow"}
          id={"MaximumQuestionAllow"}
          searchable={true}
          name={"MaximumQuestionAllow"}
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          dynamicOptions={dynamicOptions}
          handleChange={handleSelect}
          value={inputs?.MaximumQuestionAllow}
          removeIsClearable={false}
        />
        <ReactSelect
          placeholderName={"Open Question Allow"}
          id={"IsOpenQuestionAllow"}
          searchable={true}
          name={"IsOpenQuestionAllow"}
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          dynamicOptions={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          handleChange={handleSelect}
          value={`${inputs?.IsOpenQuestionAllow}`}
          removeIsClearable={false}
        />
        <button
          className="btn btn-primary ml-2 mx-3"
          onClick={() => {
            QuestionAllowPermission();
          }}
        >
          Update
        </button>
      </div>

      <Heading title={"Add Questions"} />
      <div className="row ml-1 mb-2 mt-2">
        <Input
          type="text"
          className="form-control"
          id="question"
          removeFormGroupClass={false}
          name="question"
          lable={"Question"}
          required={true}
          placeholder={""}
          onChange={handleChange}
          value={values?.question ? values?.question : ""}
          respclass={"w-50"}
        />
        <button
          className="btn btn-primary ml-2 mx-3"
          onClick={() => {
            AddQuestions(
              values?.ID,
              `${values?.isUpdate === 1 ? "Edit" : "Save"}`
            );
          }}
        >
          {values?.isUpdate === 1 ? "Update Question" : "Save Question"}
        </button>
      </div>
      <Tables
        thead={THEAD}
        tbody={tableData?.map((val, index) => ({
          SNO: index + 1,
          Question: val?.Question,
          Action: (
            <>
              <i
                className="fa fa-edit"
                onClick={() => handleEdit(val, "Edit")}
              ></i>{" "}
              <i
                className="fa fa-trash text-danger ml-2"
                onClick={() => AddQuestions(val, "Delete")}
              ></i>{" "}
            </>
          ),
        }))}
      />
    </>
  );
};

export default SettingsModal;
