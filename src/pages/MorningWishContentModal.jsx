import React from "react";

const MorningWishContentModal = (visible, showData) => {
  return (
    <>
      <div className="card">
        <div className="row p-2">
          <span style={{ fontWeight: "bold",marginLeft:"5px" }}>
            {visible?.visible?.showData?.Content}
          </span>
        </div>
      </div>
    </>
  );
};
export default MorningWishContentModal;
