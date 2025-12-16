import React, { useEffect, useState } from "react";
import Tables from "../../../../components/UI/customTable";
import { headers } from "../../../../utils/apitools";
import { apiUrls } from "../../../../networkServices/apiEndpoints";
import axios from "axios";

const RateCardMasterModal = ({ clientCode }) => {
  const [tableData, setTableData] = useState([]);
  const THEAD = [
    { name: "S.No.", width: "1%" },
    { name: "Number Of Pages From", width: "30%" },
    { name: "Number Of Pages To", width: "30%" },
    { name: "Rate Per Question", width: "1%" },
  ];

  const handleRatecard = () => {
    let form = new FormData();
    form.append("clientCode", "REACT2025e8d7c6b5a4f3e2d1c0b"),
      axios
        .post(apiUrls?.AIRateCardMaster, form, {
          headers,
        })
        .then((res) => {
          setTableData(res.data.data);
        })
        .catch((err) => console.log(err));
  };

  useEffect(() => {
    handleRatecard();
  }, []);

  return (
    <>
      {/* <Heading title={"Add Questions"} /> */}

      <Tables
        thead={THEAD}
        tbody={tableData?.map((val, index) => ({
          SNO: index + 1,
          NoOfPageFrom: val?.NoOfPageFrom,
          NoOfPagesTo: val?.NoOfPagesTo,
          CreditConsumePerQuestion: (
            <span>
              {" "}
              {val?.CreditConsumePerQuestion.toFixed(2)} <span>Credit </span>{" "}
            </span>
          ),
          // Action: <><i className="fa fa-edit" onClick={() => handleEdit(val, "Edit")}></i>  <i className="fa fa-trash text-danger ml-2" onClick={() => AddQuestions(val, "Delete")}></i> </>
        }))}
      />
    </>
  );
};

export default RateCardMasterModal;
