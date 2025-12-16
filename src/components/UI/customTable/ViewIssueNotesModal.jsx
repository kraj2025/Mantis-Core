import React, { useEffect, useState } from "react";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import Input from "../../formComponent/Input";
import { toast } from "react-toastify";
import Tables from ".";
import Heading from "../Heading";
import NoRecordFound from "../../formComponent/NoRecordFound";
import Loading from "../../loader/Loading";
import { axiosInstances } from "../../../networkServices/axiosInstance";

const ViewIssueNotesModal = ({ visible, setVisible, handleViewSearch }) => {
  const searchHandleChange = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    UserName: "",
    NoteID: "",
    Notes: "",
    DateSubmitted: "",
    TicketNote: "",
  });
  const handleSearchNote = () => {
    axiosInstances
      .post(apiUrls.ViewNote, {
        TicketID: Number(visible?.showData?.TicketID),
      })
      .then((res) => {
        const data = res?.data?.data;
        setTableData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const activityTHEAD = [
    { name: "S.No.", width: "5%" },
    { name: "NoteID", width: "9%" },
    "Notes",
    { name: "UserName", width: "14%" },
    { name: "EntryDate", width: "9%" },
  ];

  const handleAddNote = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls.InsertNoteLog, {
        TicketID: Number(visible?.showData?.TicketID),
        NoteText: String(formData?.TicketNote),
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          handleSearchNote();
          setLoading(false);
          setFormData({
            ...formData,
            TicketNote: "",
          });
          setVisible(false);
          handleViewSearch();
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
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
    handleSearchNote();
  }, []);
  return (
    <>
      <div className="card p-2">
        <span style={{ fontWeight: "bold" }}>
          Project Name:- {visible?.showData?.ProjectName}&nbsp; &nbsp; Ticket
          No.:- {visible?.showData?.TicketID}&nbsp; &nbsp;
          {/* Summary:-{" "}
          {visible?.ele?.summary} */}
        </span>
      </div>
      <div className="card p-2">
        <div className="row">
          <Input
            type="text"
            className="form-control"
            id="TicketNote"
            name="TicketNote"
            respclass="col-xl-10 col-md-4 col-sm-6 col-12"
            lable="Note"
            placeholder=" "
            onChange={searchHandleChange}
            value={formData?.TicketNote}
          />
          {loading ? (
            <Loading />
          ) : (
            <button className="btn btn-sm btn-primary" onClick={handleAddNote}>
              Add Note
            </button>
          )}
        </div>
      </div>
      {tableData?.length > 0 ? (
        <div className="card mt-2">
          <Heading title={"Search Details"} />
          <Tables
            thead={activityTHEAD}
            tbody={tableData?.map((ele, index) => ({
              "S.No.": index + 1,

              NoteID: ele?.NoteId,
              Notes: (
                <textarea
                  type="text"
                  className="summaryheightTicket"
                  id="Note"
                  name="Note"
                  // lable="Note"
                  value={ele?.note}
                  disabled
                ></textarea>
              ),
              UserName: ele?.RealName,
              EntryDate: ele?.dtEntry,
            }))}
            tableHeight={"tableHeight"}
          />
        </div>
      ) : (
        <NoRecordFound />
      )}
    </>
  );
};
export default ViewIssueNotesModal;
