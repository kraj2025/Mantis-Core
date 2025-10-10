import React, { useEffect, useState } from "react";

import Heading from "../../../../components/UI/Heading";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import Input from "../../../../components/formComponent/Input";
import Tables from "../../../../components/UI/customTable";
import { AIClientQuestionMaster, AIClientQuestionMasterInsertUpdateDelete, QuestionAllowPermissionAPI } from "../../chatapi";


const SettingsModal = ({ clientCode, dashboardData, getAPIURL }) => {
  const initialQuestion = { question: "", isUpdate: 0 }
  const [values, setValues] = useState(initialQuestion);
  const [inputs, setInputs] = useState(dashboardData);
  const dynamicOptions = Array.from({ length: 20 }, (_, i) => ({ label: i + 1, value: i + 1 }))
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
  const AddQuestions = async (val, Type) => {
    if (!values?.question && Type !== "Delete") {
      notify("Please Enter Question", "error")
      return
    }
    const payload = {
      "clientCode": clientCode,
      "question": values?.question,
      "isActive": Type === "Delete" ? 0 : 1,
      "isUpdate": Type === "Save" ? 0 : 1,
      "id": Type === "Save" ? 0 : val?.ID
    }
    const apiResp = await AIClientQuestionMasterInsertUpdateDelete(payload)
    if (apiResp?.success) {
      notify(apiResp?.message, "success")
      GetQuestionList()
      setValues(initialQuestion)
    } else {
      notify(apiResp?.message, "error")
    }
  }

  const handleEdit = (value) => {
    setValues((val) => ({ ...val, question: value?.Question, isUpdate: 1, ID: value }))
  }
  async function GetQuestionList() {
    const apiResp = await AIClientQuestionMaster(clientCode)
    if (apiResp?.success) {
      setTableData(apiResp?.data)
    } else {
      setTableData([])
    }
  }
  useEffect(() => {
    GetQuestionList()
  }, [])

  const handleSelect = (name, value) => {
    // debugger
    setInputs((val) => ({ ...val, [name]: value?.value }))
  }

  const QuestionAllowPermission = async () => {
    const payload = {
      "clientCode": clientCode,
      "maximumQuestionAllow": Number(inputs?.MaximumQuestionAllow ? inputs?.MaximumQuestionAllow : "0"),
      "isOpenQuestionAllow": Number(inputs?.IsOpenQuestionAllow ? inputs?.IsOpenQuestionAllow : "0")
    }
    let apiResp = await QuestionAllowPermissionAPI(payload)
    if (apiResp?.success) {
      notify(apiResp?.message, "success")
      getAPIURL()
    } else {
      notify(apiResp?.message, "erorr")
    }
  }


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
          dynamicOptions={[{ label: "Yes", value: "1" }, { label: "No", value: "0" }]}
          handleChange={handleSelect}
          value={`${inputs?.IsOpenQuestionAllow}`}
          removeIsClearable={false}
        />
        <button
          className="btn btn-primary ml-2 mx-3"
          onClick={() => { QuestionAllowPermission() }}
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
          onClick={() => { AddQuestions(values?.ID, `${values?.isUpdate === 1 ? "Edit" : "Save"}`) }}
        >
          {values?.isUpdate === 1 ? "Update Question" : "Save Question"}
        </button>
      </div>
      <Tables thead={THEAD} tbody={tableData?.map((val, index) => ({
        SNO: index + 1,
        Question: val?.Question,
        Action: <><i className="fa fa-edit" onClick={() => handleEdit(val, "Edit")}></i>  <i className="fa fa-trash text-danger ml-2" onClick={() => AddQuestions(val, "Delete")}></i> </>

      }))} />
    </>
  );
};

export default SettingsModal;
