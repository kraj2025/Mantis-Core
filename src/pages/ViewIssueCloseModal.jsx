import React, { useEffect, useState } from "react";
import Tables from "../components/UI/customTable";
import { issueHistoryTHEAD } from "../components/modalComponent/Utils/HealperThead";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { headers } from "../utils/apitools";
import Heading from "../components/UI/Heading";
import { axiosInstances } from "../networkServices/axiosInstance";
const ViewIssueCloseModal = ({ visible }) => {
  // console.log("visible", visible);
  const [tableData1, setTableData1] = useState([]);

  const handleSearchHistory = () => {
    axiosInstances
      .post(apiUrls.ViewHistory, {
  "TicketID": visible?.showData?.TicketID
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("TicketID", visible?.showData?.TicketID);
    // axios
    //   .post(apiUrls?.ViewHistory, form, {
    //     headers,
    //   })
      .then((res) => {
        setTableData1(res?.data?.data);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  useEffect(() => {
    handleSearchHistory();
  }, []);
  return (
    <>
      <div className="">
        <div className="">
          {tableData1?.length > 0 ? (
            <>
              <Tables
                thead={issueHistoryTHEAD}
                tbody={tableData1?.map((ele, index) => ({
                  DateModified: ele?.Updatedate,
                  "User Name": ele?.username,
                  Field: ele?.field_name,
                  "Old Value": ele?.leble1,
                  "New Value": ele?.leble2,
                }))}
                tableHeight={"tableHeight"}
              />
            </>
          ) : (
            <span style={{ textAlign: "center" }}>
              There are no notes history of this issue.
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewIssueCloseModal;
