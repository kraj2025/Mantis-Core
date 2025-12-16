import React, { useEffect, useState } from "react";

import { apiUrls } from "../../../networkServices/apiEndpoints";
import { axiosInstances } from "../../../networkServices/axiosInstance";
const UpdateViewIssueTableModal = ({ visible }) => {
  const [tableData, setTableData] = useState([]);
  const handleUpdateSearch = () => {
    axiosInstances
      .post(apiUrls.UpdateTicket, {
        TicketID: String(""),
      })
      .then((res) => {
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleUpdateSearch();
  });

  return <>hjkhj</>;
};
export default UpdateViewIssueTableModal;
