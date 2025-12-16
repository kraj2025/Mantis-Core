import React, { useEffect, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import NoRecordFound from "../components/formComponent/NoRecordFound";
import Tables from "../components/UI/customTable";
import { todaysDeliveryTHEAD } from "../components/modalComponent/Utils/HealperThead";
import { axiosInstances } from "../networkServices/axiosInstance";
const DoneOnUatList = () => {
  const [todaysdeliverylist, settodaysdeliverylist] = useState([]);

  const handleTodaysDeliveryList = () => {
    axiosInstances
      .post(apiUrls.DevDashboard_Detailed, {
        SearchType: String("DoneOnUAT"),
      })
      .then((res) => {
        settodaysdeliverylist(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const shortenName1 = (name) => {
    return name.length > 30 ? name.substring(0, 25) + "..." : name;
  };
  const shortenName = (name) => {
    return name.length > 30 ? name.substring(0, 25) + "..." : name;
  };
  useEffect(() => {
    handleTodaysDeliveryList();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(todaysdeliverylist?.length / rowsPerPage);
  const currentData = todaysdeliverylist?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  return (
    <>
      <div className="card">
        {todaysdeliverylist?.length > 0 ? (
          <>
            <Tables
              thead={todaysDeliveryTHEAD}
              tbody={currentData?.map((ele, index) => ({
                "S.No.": (currentPage - 1) * rowsPerPage + index + 1,
                "Ticket ID": ele?.TicketID,
                "Project Name": (
                  <span
                    id={`ProjectName-${index}`}
                    targrt={`ProjectName-${index}`}
                    title={ele?.Project}
                  >
                    {shortenName(ele?.Project)}
                  </span>
                ),
                "Category Name": ele?.Category,
                "Reporter Name": ele?.Reporter,
                "Assign To": ele?.AssignTo,
                Summary: (
                  <span
                    id={`summary-${index}`}
                    targrt={`summary-${index}`}
                    title={ele?.summary}
                  >
                    {shortenName1(ele?.summary)}
                  </span>
                ),
                Status: ele?.STATUS,
                "Date Submitted": ele?.dtEntry,
                "Delivery Date": ele?.CurrentDeliveryDate,
                ManHour: ele?.ManHour,
                colorcode: ele?.rowColor,
              }))}
              tableHeight={"tableHeight"}
            />
            <div className="pagination ml-auto">
              <div>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <>{todaysdeliverylist?.length <= 0 && <NoRecordFound />}</>
        )}
      </div>
    </>
  );
};
export default DoneOnUatList;
