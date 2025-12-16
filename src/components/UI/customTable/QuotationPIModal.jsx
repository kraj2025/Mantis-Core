import React, { useEffect, useState } from "react";
import Tables from ".";
import Heading from "../Heading";
import axios from "axios";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { headers } from "../../../utils/apitools";
import moment from "moment";
import Tooltip from "../../../pages/Tooltip";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";
const QuotationPIModal = (visible) => {
  const [tableData, setTableData] = useState([]);
  const PI_Load_QuotationID = () => {

    axiosInstances
      .post(apiUrls.PI_Load_QuotationID, {
        QuotationID: String(visible?.visible?.showData?.EncryptID),
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const shortenName = (name) => {
    return name.length > 15 ? name.substring(0, 20) + "..." : name;
  };
  useEffect(() => {
    PI_Load_QuotationID();
  }, []);
  return (
    <>
      <div className="card">
        <div className="d-flex">
          <span style={{ fontWeight: "bold" }}>
            Project Name:- {visible?.visible?.showData?.ProjectName}
          </span>
        </div>{" "}
        <div className="card p-1">
          <Tables
            thead={[
              { name: "S.No.", width: "10%" },
              "PI NO.",
              "Expected Date",
              "Remark",
              "Print",
            ]}
            tbody={tableData.map((ele, index) => ({
              "S.No.": index + 1,
              "PI NO.": ele.PINo,
              "Expected Date": moment(ele?.ExpDate).format("YYYY-MM-DD"),
              Remark: (
                <Tooltip label={ele?.Remark}>
                  <span
                    id={`projectName-${index}`}
                    targrt={`projectName-${index}`}
                    style={{ textAlign: "center" }}
                  >
                    {shortenName(ele?.Remark)}
                  </span>
                </Tooltip>
              ),

              Print: (
                <i
                  className="fa fa-print"
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    color: "black",
                  }}
                  title="Click here to Print."
                  onClick={() => window.open(ele?.PIURL, "_blank")}
                ></i>
              ),
            }))}
          />
        </div>
      </div>
    </>
  );
};
export default QuotationPIModal;
