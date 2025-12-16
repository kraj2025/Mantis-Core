import React, { useState } from "react";
const NewsDataDashboardOpen = ({ data }) => {
  const handleDownload = (item) => {
    const link = document.createElement("a");
    link.href = item?.Attachment;
    link.download = item.Subject.substring(0, 8);
    link.click();
  };
  
  return (
    <div>
      <div className="head d-flex align-items-center justify-content-between">
        <div
          style={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Subject : {data?.Subject}
        </div>
        {/* <br></br> */}
        {Boolean(data?.IsCapture) && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleDownload(data)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="blue"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-download"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
        )}
      </div>
      <div style={{ fontWeight: "bold" }}>
        Document No. : {data?.DocumentNo}
      </div>
      <div
        className="body-news"
        dangerouslySetInnerHTML={{ __html: data?.Message }}
      ></div>
    </div>
  );
};

export default NewsDataDashboardOpen;
