import axios from "axios";
import React, { useState } from "react";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { headers } from "../../utils/apitools";
import { toast } from "react-toastify";
import { set } from "lodash";
import Loading from "../../components/loader/Loading";
import { useCryptoLocalStorage } from "../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../networkServices/axiosInstance";
const ViewExpenseDelete = ({ visible, setVisible ,handleTableSearch }) => {
  console.log(visible);
  const [loading, setLoading] = useState(false);

  const handleApprove = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.UpdateStatusCopy, {
  "ActionType": "Delete",
  "ExpenseReportID": Number(visible?.showData?.expense_report_ID)
})
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname") ),
    //   form.append("ExpenseReportID", visible?.showData?.expense_report_ID),
    //   form.append("ActionType", "Delete"),
    //   axios
    //     .post(apiUrls?.UpdateStatusCopy, form, { headers })
        .then((res) => {
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setVisible(false);
            handleTableSearch()
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  return (
    <>
      <div className="card p-2">
        <span style={{ fontWeight: "bold" }}>
          Employee Name : {visible?.showData?.EmpName} &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp;Date :{" "}
          {new Date(visible?.showData?.DATE)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, " ")}{" "}
          &nbsp;
        </span>
      </div>
      <div className="card ">
        <div className="row p-2">
          <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
            Do you want to delete this request?
          </span>
          {loading ? (
            <Loading />
          ) : (
            <buton
              className="btn btn-sm btn-success ml-3"
              onClick={handleApprove}
            >
              Yes
            </buton>
          )}
        </div>
      </div>
    </>
  );
};
export default ViewExpenseDelete;
