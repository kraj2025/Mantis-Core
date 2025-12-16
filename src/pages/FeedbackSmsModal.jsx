import React from "react";

const FeedbackSmsModal = (visible, showData) => {
  //  console.log(visible, showData);
  return (
    <>
      <div className="card">
        <div className="row p-2">
          <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
            {visible?.visible?.showData?.FeedbackComment}
          </span>
        </div>
      </div>
    </>
  );
};

export default FeedbackSmsModal;
