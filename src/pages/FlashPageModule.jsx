import React, { useEffect, useState } from "react";
import { apiUrls } from "../networkServices/apiEndpoints";
import { useTranslation } from "react-i18next";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import Modal from "../components/modalComponent/Modal";
import NewsDataDashboardOpen from "./NewsDataDashboardOpen";
import { axiosInstances } from "../networkServices/axiosInstance";

const FlashPageModule = ({ onCloseInnerModal }) => {
  const [newslist, setNewsList] = useState([]);
  const [t] = useTranslation();

  const handleNews = () => {
    axiosInstances
      .post(apiUrls.Circular_News, {
        // IsFlash: String("0"),
        // RoleID: Number(useCryptoLocalStorage("user_Data", "get", "RoleID")),
      })
      .then((res) => {
        setNewsList(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [registerModal, setRegisterModal] = useState({
    isShow: false,
    App_ID: "",
    ApiData: [],
    Header: "",
    TimeDuration: null,
    component: null,
    modalWidth: null,
  });
  const handleNewsModal = (item) => {
    setRegisterModal((prev) => ({
      ...prev,
      isShow: true,
      Header: <>View Details</>,
      modalWidth: "60vw",
      component: <NewsDataDashboardOpen data={item} closable={false} />,
    }));

    handleCircularRead(item?.CircularUserID);
  };

  const handleCircularRead = (data) => {
    axiosInstances
      .post(apiUrls.Circular_Read, {
        ID: Number(useCryptoLocalStorage("user_Data", "get", "ID")),
        CircularUserID: Number(data),
      })
      .then((res) => {
        console.log(res.data.message);
        handleNews();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleNews();
  }, []);

  return (
    <>
      {registerModal.isShow && (
        <Modal
          visible={registerModal?.isShow}
          setVisible={() => {
            setRegisterModal({
              isShow: false,
              App_ID: "",
              ApiData: [],
              Header: "",
              TimeDuration: null,
              component: null,
            });
            // handleNews();
            if (onCloseInnerModal) {
              onCloseInnerModal(); // call parent's handleNews here
            }
          }}
          modalWidth={registerModal?.modalWidth}
          Header={registerModal?.Header}
          footer={<></>}
        >
          {registerModal?.component}
        </Modal>
      )}

      <div className="card">
        <div className="row m-2">
          <span style={{ fontWeight: "bold" }}>
            📢 We are pleased to announce that these module has been
            successfully deployed to the live Mantis environment.
          </span>
        </div>
      </div>
      <div className="card">
        <div className="row m-2">
          <span style={{ fontWeight: "bold" }}>
            <i className="fa fa-arrow-down"></i> Module Details (
            <span className="redIconblink">
              Click the icon to view or read documents, then exit this page.
            </span>
            )
          </span>
        </div>
      </div>

      {newslist?.length > 0 ? (
        <div className="card">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th
                  style={{
                    width: "50px",
                    textAlign: "center",
                  }}
                  className="font-weight-bold"
                >
                  View
                </th>
                <th style={{ textAlign: "left" }} className="font-weight-bold">
                  Subject & Module Name
                </th>
              </tr>
            </thead>
            <tbody>
              {newslist.map((item, index) => (
                <tr key={item.ID}>
                  {item.IsView === 0 && (
                    <>
                      <td className="text-center" style={{ cursor: "pointer" }}>
                        <i
                          className="fa fa-eye cursor-pointer"
                          style={{
                            color: "black",
                            cursor: "pointer !important",
                          }}
                          key={index}
                          onClick={() => handleNewsModal(item)}
                        ></i>
                      </td>
                      <td className="font-weight-bold">{item.Subject}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <span style={{ fontWeight: "bold", color: "red" }}>
            No records found...
          </span>
        </div>
      )}
    </>
  );
};
export default FlashPageModule;
