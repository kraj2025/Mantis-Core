// const PendingRequestModal = ({
//   visible,
//   selectedDate,
//   summaryData,
//   calendarData,
// }) => {

  
//   console.log(summaryData, calendarData);
//   const filteredData = calendarData[0]?.filter(
//     (item) =>
//       new Date(item.Date).toDateString() ===
//       (selectedDate ? selectedDate.toDateString() : "")
//   );
//   const getColorFromTicketIDs = (ticketIDs) => {
//     const matches = ticketIDs.match(/#([a-fA-F0-9]{6})/); // Regex to match color codes like #d2f5b0
//     return matches ? matches[0] : "#ffffff"; // Default color if none found
//   };
//   return (
//     <div className="card">
//       <div className="row m-2">
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               <th style={{ minWidth: "30px" }}>Ticket ID</th>
//               <th>Project Name</th>
//               <th>Category</th>
//               <th>Summary</th>
//               <th>Man Hours</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {calendarData[0].map((item, index) => (
//                <tr
//                key={index}
//                style={{
//                  backgroundColor: getColorFromTicketIDs(item.TicketIDs),
//                }}
//              >
//                <td
//                  style={{
//                    backgroundColor: getColorFromTicketIDs(item.TicketIDs),
//                    padding: "10px",
//                    textAlign: "center",
//                  }}
//                >
//                   {/* Preprocess TicketIDs to remove color codes */}
//                   {item.TicketIDs.split(",")
//                     .map((ticket) => ticket.split(" ")[0]) // Extract only the ticket number
//                     .join(", ")}
//                 </td>
//                 <td>{item.ProjectName}</td>
//                 <td>{item.Category}</td>
//                 <td>{item.summary}</td>
//                 <td>{item.ManHour}</td>
//                 <td>{item.STATUS}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PendingRequestModal;

const PendingRequestModal = ({ visible, selectedDate, calendarData }) => {
  
  
  return (
    <div className="card">
      <div className="row m-2">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ minWidth: "30px" }}>Ticket ID</th>
              <th>Project Name</th>
              <th>Category</th>
              <th>Summary</th>
              <th>Man Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {calendarData?.map((item, index) => (
              <tr key={index} style={{ backgroundColor: item.rowColor }}>
                <td>{item.TicketID}</td>
                <td>{item.Project}</td>
                <td>{item.Category}</td>
                <td>{item.summary}</td>
                <td>{item.ManHour}</td>
                <td>{item.STATUS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingRequestModal;
