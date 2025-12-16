import { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import { apiUrls } from "../../networkServices/apiEndpoints";
import { useSelector } from "react-redux";
import { axiosInstances } from "../../networkServices/axiosInstance";
const SpeedometerChart = ({ getItem }) => {
  const [performanceValue, setPerformanceValue] = useState([]);
  const [needleColor, setNeedleColor] = useState("steelblue");
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const { memberID } = useSelector((state) => state?.loadingSlice);

  // const handleFirstDashboardCount = () => {
  //   axiosInstances
  //     .post(apiUrls.DevDashboard_Summary, {
  //       title: String("DeveloperPerformance"),
  //       developerID: String(memberID || "0"),
  //     })
  //     .then((res) => {
  //       const performance = Number(res?.data?.Score || 0);
  //       setPerformanceValue(performance);
  //       const minPerf = 0;
  //       const maxPerf = 100;
  //       setMinValue(minPerf);
  //       setMaxValue(maxPerf);
  //       getItem(performance);
  //       let color = "steelblue"; // Default
  //       if (performance <= 20) {
  //         color = "#FF0000"; // Very Poor
  //       } else if (performance <= 40) {
  //         color = "#FF4500"; // Poor
  //       } else if (performance <= 60) {
  //         color = "#FFD700"; // Average
  //       } else if (performance <= 80) {
  //         color = "#ADFF2F"; // Good
  //       } else if (performance <= 100) {
  //         color = "#008000"; // Very Good
  //       }

  //       setNeedleColor(color);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

const handleFirstDashboardCount = () => {
  axiosInstances
    .post(apiUrls.DevDashboard_Summary, {
      Title: String("DeveloperPerformance"),
      DeveloperID: String(memberID || "0"),
    })
    .then((res) => {
      const performance = Number(res?.data?.performance?.Score || 0);
      
      setPerformanceValue(performance);

      const minPerf = 0;
      const maxPerf = 100;
      setMinValue(minPerf);
      setMaxValue(maxPerf);

      getItem(performance);

      let color = "steelblue"; // Default color
      if (performance <= 20) {
        color = "#FF0000"; // Very Poor
      } else if (performance <= 40) {
        color = "#FF4500"; // Poor
      } else if (performance <= 60) {
        color = "#FFD700"; // Average
      } else if (performance <= 80) {
        color = "#ADFF2F"; // Good
      } else if (performance <= 100) {
        color = "#008000"; // Very Good
      }

      setNeedleColor(color);

      // Optionally, you can handle dtCal if needed, e.g.
      const dtCal = res?.data?.performance?.dtCal || [];
      console.log('Performance Breakdown:', dtCal);
    })
    .catch((err) => {
      console.error(err);
    });
};


  useEffect(() => {
    handleFirstDashboardCount(memberID);
  }, [memberID]);
  useEffect(() => {
    handleFirstDashboardCount();
  }, []);

  return (
    <div style={{ width: "230px", height: "115px" }}>
      <ReactSpeedometer
        fluidWidth={true}
        value={performanceValue}
        minValue={minValue}
        maxValue={maxValue}
        customSegmentLabels={[
          { text: "V.Poor", position: "INSIDE", color: "white" }, // 0-20%
          { text: "Poor", position: "INSIDE", color: "white" }, // 21-40%
          {
            text: "Average",
            position: "INSIDE",
            color: "white",
            style: { marginBottom: "40px" },
          }, // 41-60%
          { text: "Good", position: "INSIDE", color: "white" }, // 61-80%
          { text: "V.Good", position: "INSIDE", color: "white" }, // 81-100%
        ]}
        needleColor={needleColor}
      />
    </div>
  );
};

export default SpeedometerChart;
