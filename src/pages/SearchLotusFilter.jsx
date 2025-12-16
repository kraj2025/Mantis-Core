import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Tooltip from "./Tooltip";
import { useTranslation } from "react-i18next";
import Loading from "../components/loader/Loading";
import { apiUrls } from "../networkServices/apiEndpoints";
import axios from "axios";
import { headers } from "../utils/apitools";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { toast } from "react-toastify";
import { axiosInstances } from "../networkServices/axiosInstance";

const SearchLotusFilter = ({ columnConfig, setColumnConfig, PageName }) => {
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  const [t] = useTranslation();

  const getFilterResultOption = async () => {
    try {
     

      const res = await axiosInstances.post(apiUrls?.GetFilterTableReprintData, {
        PageName: String(PageName),
        CrmEmpID: String(
          useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
        ),
      });
      if (res?.data?.data) {
        setColumnConfig(res.data.data);
      }
    } catch (err) {
      console.error("Fetch filter options error:", err);
    }
  };

  const toggleColumnVisibility = async (column, index) => {
  
    setLoad(true);
    try {
    

      const updatedColumn =
        column?.header === "S.No"
          ? columnConfig.map((ele) => ({
              ...ele,
              visible: !column?.visible,
            }))
          : columnConfig.map((ele, i) =>
              i === index ? { ...ele, visible: !ele.visible } : ele
            );

      const jsonString = JSON.stringify(updatedColumn);
      const res = await axiosInstances.post(
        apiUrls?.SaveFilterTableReprintData,
        {
          CrmEmpID: String(
            useCryptoLocalStorage("user_Data", "get", "CrmEmployeeID")
          ),
          PageName: String(PageName),
          FilterData: String(jsonString),
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setLoad(false);
        await getFilterResultOption();
      } else {
        toast.error(res.data.message || "Something went wrong");
        setLoad(false);
      }
    } catch (err) {
      console.error("Save filter error:", err);
      toast.error("An error occurred while saving filter.");
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderCard = () =>
    show
      ? ReactDOM.createPortal(
          <div
            ref={cardRef}
            className="children-data"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              borderRadius: "5px",
              zIndex: 999,
              border: "1px solid grey",
              padding: "8px",
              maxHeight: "400px",
              overflowY: "auto",
              minWidth: "200px",
            }}
          >
            {columnConfig?.map((column, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <i className="nav-icon" />
                  {column.header === "Actions" || column.header === "S.No"
                    ? t("ToggleAll")
                    : t(column.header)}
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => toggleColumnVisibility(column, index)}
                  />
                  <span className="slider round2"></span>
                </label>
              </div>
            ))}
          </div>,
          document.body
        )
      : null;

  return (
    <div ref={buttonRef} style={{ position: "relative" }}>
      <Tooltip label={t("Click")}>
        <div
          className="header"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setTimeout(() => setShow((prev) => !prev), 0);
          }}
        >
          <div style={{ width: "22px", height: "20px" }}>
            <i className="pi pi-cog mt-1 ml-2 Reprint" />
          </div>
        </div>
      </Tooltip>
      {load ? <Loading /> : renderCard()}
    </div>
  );
};

export default SearchLotusFilter;
