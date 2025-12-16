import React, { useEffect, useState } from "react";
import Tables from "../components/UI/customTable";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { apiUrls } from "../networkServices/apiEndpoints";
import { headers } from "../utils/apitools";
import axios from "axios";
import { axiosInstances } from "../networkServices/axiosInstance";

const ManagerAgeingPOC = () => {
  const [tableData, setTableData] = useState([]);
  const handleSearch = () => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   axios
    //     .post(apiUrls?.ManagerDashboard_Ageing_POC, form, { headers })
    axiosInstances
      .post(apiUrls?.ManagerDashboard_Ageing_POC, {
        DeveloperID: String(useCryptoLocalStorage("user_Data", "get", "ID")),
        SearchType: String(""),
      })
      .then((res) => {
        setTableData(res?.data?.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    handleSearch();
  }, []);
  const newFileTHEAD = ["POC", "<30", "30-45", "45-60", ">60"];
  return (
    <>
      <div className="card">
        <Tables
          thead={newFileTHEAD}
          tbody={[
            ...tableData?.map((ele, index) => ({
              POC: ele?.POC,
              "<30": ele?.LessThanThirty,
              "30-45": ele?.ThirtytoFortyFive,
              "45-60": ele?.FortyFiveToSixty,
              ">60": ele?.GreaterThanSixty,
            })),
            {
              POC: (
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Total
                </span>
              ),

              "<30": (
                <span style={{ fontWeight: "bold" }}>
                  {tableData?.reduce(
                    (acc, ele) => acc + Number(ele?.LessThanThirty || 0),
                    0
                  )}
                </span>
              ),

              "30-45": (
                <span style={{ fontWeight: "bold" }}>
                  {tableData?.reduce(
                    (acc, ele) => acc + Number(ele?.ThirtytoFortyFive || 0),
                    0
                  )}
                </span>
              ),

              "45-60": (
                <span style={{ fontWeight: "bold" }}>
                  {tableData?.reduce(
                    (acc, ele) => acc + Number(ele?.FortyFiveToSixty || 0),
                    0
                  )}
                </span>
              ),

              ">60": (
                <span style={{ fontWeight: "bold" }}>
                  {tableData?.reduce(
                    (acc, ele) => acc + Number(ele?.GreaterThanSixty || 0),
                    0
                  )}
                </span>
              ),
            },
          ]}
          tableHeight={"tableHeight"}
        />
      </div>
    </>
  );
};
export default ManagerAgeingPOC;
