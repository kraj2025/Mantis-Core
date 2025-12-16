import React, { useEffect, useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Input from "../../formComponent/Input";
import { DecreaseIngSortSVGIcon, IncreaseIngSortSVGIcon, SortSVGIcon } from "../../../utils/SVGICON";

function Tables({
  thead,
  tbody,
  fs,
  getRowClass,
  style,
  tableHeight,
  scrollView,
  getRowClick,
  WWW,
  handleClassOnRow,
  handleDoubleClick,
  isSearch,
  notSingleClick = true,
}) {
  const [t] = useTranslation();
  const [bodyData, setBodyData] = useState(tbody);
  const [handleLanguageStatus, setHandleLanguageStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [theadData, setTheadData] = useState([]);
  const isMobile = window.innerWidth <= 768;
  const activeRowRef = useRef(null);

  useEffect(() => {
    setBodyData(tbody);
  }, [tbody]);

  useEffect(() => {
    if (tbody?.length > 0) {
      let data = thead?.map((val, index) => {
        if (typeof val === "object") {
          if (typeof Object?.values(tbody[0])[index] === "object") {
            val.type = "";
          } else {
            val.type = "N";
          }
        } else {
          if (typeof Object?.values(tbody[0])[index] === "object") {
            val = { name: val, type: "" };
          } else {
            val = { name: val, type: "N" };
          }
        }
        return val;
      });
      setTheadData(data);
    }
  }, [tbody, handleLanguageStatus]);


  const handleSortTable = (index, type) => {
    let typeName = Object?.keys(bodyData[0])[index];
    let data = [...bodyData];
    if (type === "DESC") {
      data.sort((a, b) => {
        if (new Date(a[typeName]).toString() === "Invalid Date") {
          return b[typeName]?.localeCompare(a[typeName]);
        } else {
          return new Date(b[typeName]) - new Date(a[typeName]);
        }
      });
    } else {
      data.sort((a, b) => {
        if (new Date(a[typeName]).toString() === "Invalid Date") {
          return a[typeName]?.localeCompare(b[typeName]);
        } else {
          return new Date(a[typeName]) - new Date(b[typeName]);
        }
      });
    }
    setBodyData(data);

    if (typeof theadData[index] === "object") {
      let updatedHead = [...theadData]?.map((val, i) => {
        if (index === i) {
          val.type = type;
        } else {
          val.type = val.type === "" ? val.type : "N";
        }
        return val;
      });
      setTheadData(updatedHead);
    }
  };

  // handle Search Item
  const handleItemSearch = (e) => {
    setSearch(e?.target?.value);
    const results = tbody?.filter((obj) =>
      Object.values(obj)?.some(
        (value) =>
          typeof value === "string" &&
          value?.toLowerCase().includes(e?.target?.value.toLowerCase())
      )
    );
    setBodyData(results);
  };

  // Function to handle row click
  const handleRowClick = (rowRef, ele, index) => {
    getRowClick && getRowClick(ele, index);

    if (activeRowRef.current) {
      // Reset the previous active row to its original color
      const originalColor = activeRowRef.current.getAttribute(
        "data-original-color"
      );
      activeRowRef.current.style.backgroundColor = originalColor;
    }

    // Set the new active row style
    if (rowRef) {
      // Store the original color of the new active row
      rowRef.setAttribute("data-original-color", rowRef.style.backgroundColor);
      rowRef.style.backgroundColor = "lightblue";
      activeRowRef.current = rowRef;
    }
  };

  return (
    <>
      {tbody?.length > 0 && isSearch && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: "2px",
          }}
        >
          <Input
            type="text"
            className="table-input my-1"
            respclass={"width-250"}
            removeFormGroupClass={true}
            placeholder={t("Search")}
            onChange={handleItemSearch}
            // placeholderLabel={<i className="fa fa-search search_icon" aria-hidden="true"></i>}
          />
        </div>
      )}
      {(bodyData?.length > 0 || search) && (
        <div
          id="no-more-tables"
          style={style}
          className={`${tableHeight} ${scrollView} custom-scrollbar TabScroll`}
        >
          <div className="row">
            <div className="col-12">
              <Table className="mainTable pt-2  " bordered>
                <thead style={{ zIndex: 1 }}>
                  <tr>
                    {theadData?.map((headData, index) => (
                      <th
                        key={index}
                        style={{
                          width: headData?.width ? headData?.width : "",
                          textAlign: headData?.textAlign
                            ? headData?.textAlign
                            : "",
                          marginLeft: "3px",
                        }}
                        className={`${headData?.className ? headData?.className : ""}`}
                      >
                        {headData?.type === "" && (
                          <> {headData?.name ? headData.name : headData}</>
                        )}
                        {headData?.type === "N" && (
                          <span
                            className="pointer-cursor"
                            onClick={() => {
                              handleSortTable(index, "ASC");
                            }}
                          >
                            {headData?.name ? headData.name : headData}

                            <SortSVGIcon />
                          </span>
                        )}
                        {headData?.type === "ASC" && (
                          <span
                            className="pointer-cursor"
                            onClick={() => {
                              handleSortTable(index, "DESC");
                            }}
                          >
                            {" "}
                            {headData?.name ? headData.name : headData}
                            <IncreaseIngSortSVGIcon />
                          </span>
                        )}
                        {headData?.type === "DESC" && (
                          <span
                            className="pointer-cursor"
                            onClick={() => {
                              handleSortTable(index, "ASC");
                            }}
                          >
                            {" "}
                            {headData?.name ? headData.name : headData}
                            <DecreaseIngSortSVGIcon />
                          </span>
                        )}
                        &nbsp;
                      </th>
                    ))}
                  </tr>
                </thead>
                {bodyData?.length > 0 ? (
                  <tbody style={{ backgroundColor: "white" }}>
                    {bodyData?.map((ele, index) => {
                      const keys = Object.keys(ele).filter(
                        (key) => key !== "colorcode"
                      );
                      const rowColor = ele.colorcode || "";
                      // console.log(rowColor)
                      return (
                        <tr
                          key={index}
                          className={getRowClass ? getRowClass(ele, index) : ""}
                          style={{ backgroundColor: rowColor }}
                          onClick={(e) =>
                            notSingleClick
                              ? handleRowClick(e.currentTarget, ele, index)
                              : undefined
                          }
                          onDoubleClick={(e) =>
                            handleDoubleClick && handleDoubleClick(ele, index)
                          }
                        >
                          {keys?.map((bodyData, inx) => (
                            <td
                              key={inx}
                              data-title={
                                theadData[inx]?.name
                                  ? theadData[inx]?.name
                                  : theadData[inx]
                              }
                              style={{ width: WWW }}
                              className={`
                            ${
                              handleClassOnRow
                                ? handleClassOnRow(
                                    ele,
                                    theadData[inx]?.name
                                      ? theadData[inx]?.name
                                      : theadData[inx]
                                  )
                                : "px-2"
                            }`}
                            >
                              {ele[bodyData]?.label ? (
                                ele[bodyData]?.label
                              ) : ele[bodyData] ? (
                                ele[bodyData]
                              ) : (
                                <>&nbsp;</>
                              )}
                              {isMobile && <>&nbsp;</>}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <td colSpan="200" className="text-center">
                    {" "}
                    {t("No data found")}
                  </td>
                )}
              </Table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Tables;