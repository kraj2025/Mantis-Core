import React, { useEffect, useState } from "react";
import Input from "../../formComponent/Input";
import Whatsapp from "../../../assets/image/whatspp.jpg";
import gmails from "../../../assets/image/gmail.png";
import smss from "../../../assets/image/smss.png";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { headers } from "../../../utils/apitools";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../loader/Loading";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
const BirthdayWishModal = ({ visible, setVisible, tableData }) => {
  // console.log("check wishes", visible, tableData);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    BirthdayMessage: "",
    Email: "",
    Whatsapp: "",
    SMS: "",
    Subject: "",
  });

  const handleHeightOfBirthDaycardApi = () => {
    if (formData?.BirthdayMessage == "") {
      toast.error("Please Enter Message.");
    } else {
      setLoading(true);
      // let form = new FormData();
      // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      //   form.append(
      //     "LoginName",
      //     useCryptoLocalStorage("user_Data", "get", "realname")
      //   ),
      //   form.append("ToEmployeeID", tableData[0]?.Employee_ID),
      //   form.append("ToEmployeeName", tableData[0]?.EmpName),
      //   form.append(
      //     "ToEMailID",
      //     String(tableData[0]?.CompanyEmail).toLowerCase()
      //   ),
      //   form.append("WishesType", tableData[0]?.Type),
      //   form.append(
      //     "Subject",
      //     `Greeting from ${useCryptoLocalStorage("user_Data", "get", "realname")}`
      //   ),
      //   form.append("SearchType", "WishesInsert"),
      //   form.append("dtBirthday", tableData[0]?.dtWish),
      //   form.append("Message", formData?.BirthdayMessage),
      //   axios
      //     .post(apiUrls?.Birthday_Anniversary_Interface_Search, form, {
      //       headers,
      //     })
      axiosInstances
        .post(apiUrls.Birthday_Anniversary_Interface_Search, {
          searchType: String("Search"),
        })
        .then((res) => {
          if (res?.data?.status === true) {
            toast.success(res?.data?.message);
            setVisible(false);
            setLoading(false);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  return (
    <>
      <div className="card">
        <div className="row m-2">
          {/* <Input
            type="text"
            className="form-control"
            id="Email"
            name="Email"
            lable="Email"
            onChange={handleSelectChange}
            value={formData?.Email}
            respclass="col-xl-12 col-md-4 col-12 col-sm-12"
          /> */}
          {/* <Input
            type="text"
            className="form-control"
            id="Subject"
            name="Subject"
            lable="Subject"
            onChange={handleSelectChange}
            value={formData?.Subject}
            respclass="col-xl-12 col-md-4 col-12 col-sm-12"
          /> */}
          <div className="col-sm-12 mt-1">
            <textarea
              type="text"
              className="summaryheightRemark"
              placeholder="Enter Message here.."
              id={"BirthdayMessage"}
              name="BirthdayMessage"
              value={formData?.BirthdayMessage}
              onChange={handleSelectChange}
              style={{ width: "100%", height: "70px" }}
            ></textarea>
          </div>
          {/* <div style={{width:'100%', display: "flex", justifyContent: "center" }}>
            <img
              src={Whatsapp}
              width="20px"
              height="20px"

            ></img>
            <img src={gmails} width="20px" height="20px" className="ml-4"></img>
            <img src={smss} width="20px" height="20px" className="ml-4"></img>
          </div> */}

          {/* <div className="search-col" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="Email"
                  checked={formData?.Email ? 1 : 0}
                  onChange={handleSelectChange}
                />
                <span className="slider"></span>
              </label>
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "5px",
                  fontSize: "12px",
                }}
              >
                Email
              </span>
            </div>
          </div>
          <div className="search-col" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="Whatsapp"
                  checked={formData?.Whatsapp ? 1 : 0}
                  onChange={handleSelectChange}
                />
                <span className="slider"></span>
              </label>
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "5px",
                  fontSize: "12px",
                }}
              >
                Whatsapp
              </span>
            </div>
          </div>
          <div className="search-col" style={{ marginLeft: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="switch" style={{ marginTop: "7px" }}>
                <input
                  type="checkbox"
                  name="SMS"
                  checked={formData?.SMS ? 1 : 0}
                  onChange={handleSelectChange}
                />
                <span className="slider"></span>
              </label>
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "5px",
                  fontSize: "12px",
                }}
              >
                SMS
              </span>
            </div>
          </div> */}

          <div className="col-sm-12" style={{ textAlign: "center" }}>
            {loading ? (
              <Loading />
            ) : (
              <button
                className="btn btn-sm btn-peimary ml-3"
                onClick={handleHeightOfBirthDaycardApi}
              >
                Send
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default BirthdayWishModal;
