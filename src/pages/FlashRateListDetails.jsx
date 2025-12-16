import React, { useEffect, useState } from "react";
import discountpics from "../../src/assets/image/discountpics10.jpeg"
const FlashRateListDetails = ({ onCloseInnerModal }) => {
  return (
    <>
      <div className="card">
        <div className="row m-2">
          <span style={{ fontWeight: "bold" }}>
            📢 You are eligible for 10% discount.🎉
          </span>
          <div>
            <img src={discountpics} width={"483px"} height={"200px"}/> 
          </div>
        </div>
      </div>
    </>
  );
};
export default FlashRateListDetails;
