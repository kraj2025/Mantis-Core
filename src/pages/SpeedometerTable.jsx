import React, { useEffect, useState } from "react";
import Tables from "../components/UI/customTable";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import axios from "axios";
import Loading from "../components/loader/Loading";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import Heading from "../components/UI/Heading";
import excelimg from "../../src/assets/image/excel.png";
import excelimgOrange from "../../src/assets/image/orangeExcel.png";
import { ExportToExcel } from "../networkServices/Tools";
import { axiosInstances } from "../networkServices/axiosInstance";
const SpeedometerTable = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const performanceTHEAD = [
    t("S.No."),
    t("Description"),
    t("Values"),
    t("Parameters"),
    t("Weights"),
    t("Factors"),
    t("Multi"),
    t("Log"),
  ];
  const { memberID } = useSelector((state) => state?.loadingSlice);
  const handleFirstDashboardCount = () => {
    setLoading(true);
    axiosInstances
      .post(apiUrls?.DevDashboard_Summary, {
        Title: String("DeveloperPerformance"),
        DeveloperID: String(memberID || 0),
      })
      .then((res) => {
        setTableData(res?.data?.dtCal);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    handleFirstDashboardCount();
  }, []);
  useEffect(() => {
    handleFirstDashboardCount(memberID);
  }, [memberID]);

  const valueId = tableData?.reduce(
    (acc, ele) => acc + Number(ele?.Multi || 0),
    0
  );
  const TotalRecords = (
    <div style={{ textAlign: "left" }}>{Math.round(valueId / 100)}</div>
  );
  // const TotalLabel = (
  //   <div style={{ textAlign: "end" }}>
  //     <label>
  //       Total Records:
  //       <br /> Performance:
  //     </label>{" "}
  //   </div>
  // );

  return (
    <>
      <div className="card p-1">
        {loading ? (
          <Loading />
        ) : (
          <>
            <Heading
              title={
                <span style={{ fontWeight: "bold" }}>Performance Details</span>
              }
              secondTitle={
                <div>
                  <img
                    src={excelimg}
                    className=" ml-2"
                    style={{
                      width: "20px",
                      height: "15px",
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                    onClick={() => ExportToExcel(tableData)}
                  ></img>

                  <img
                    src={excelimgOrange}
                    className="ml-2"
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                    // onClick={handleViewProjectExcelDelivery}
                    title="Get Delivery Manager Excel Sheet"
                  ></img>
                </div>
              }
            />
            <Tables
              thead={performanceTHEAD}
              tbody={[
                ...tableData?.map((ele, index) => ({
                  "S.No.": index + 1,
                  Description: ele?.Description,
                  Values: ele?.Values,
                  Parameters: ele?.Parameters,
                  Weights: ele?.Weights,
                  Factors: ele?.Factors,
                  Multi: ele?.Multi,
                  Log: (
                    <img
                      src={excelimg}
                      className=" ml-2"
                      style={{
                        width: "20px",
                        height: "15px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                      // onClick={() => ExportToExcel(tableData)}
                    ></img>
                  ),
                })),
                {
                  Modules: "",

                  ee: "",
                  ss: "",
                  dd: "",
                  aa: "",

                  Factors: <strong>{t("Total Records")}</strong>,
                  Modules: "",
                  Amount: <strong>{valueId}</strong>,
                  // Received: tableData?.reduce(
                  //   (acc, ele) => acc + Number(ele?.Amount || 0),
                  //   0
                  // ),
                  gg: "",
                },
                {
                  Modules: "",

                  ee: "",
                  ss: "",
                  dd: "",
                  aa: "",

                  Factors: <strong>{t("Performance")}</strong>,
                  Modules: "",
                  Amount: <strong>{TotalRecords}</strong>,
                  // Received: tableData?.reduce(
                  //   (acc, ele) => acc + Number(ele?.Amount || 0),
                  //   0
                  // ),
                  gg: "",
                },
              ]}
              tableHeight={"tableHeight"}
            />
          </>
        )}
      </div>
    </>
  );
};
export default SpeedometerTable;
