import React, { useEffect, useState } from "react";
import Welcome from "../components/WelComeCard/Welcome";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { useSelector } from "react-redux";
import { apiUrls } from "../networkServices/apiEndpoints";
import axios from "axios";
import { headers } from "../utils/apitools";
import FlashRateListDetails from "./FlashRateListDetails";
import Modal from "../components/modalComponent/Modal";
import { axiosInstances } from "../networkServices/axiosInstance";

const ClientDashboard = () => {
  const { setToggleModal, ToggleModal } = useSelector(
    (state) => state?.loadingSlice
  );
  const [ratelist, setRateList] = useState([]);
  const [project, setProject] = useState([]);

  const shouldShowRateListModal = ratelist?.some((item) => item.isFlash === 0);
  const [visible, setVisible] = useState({
    show1: false,
    show2: false,
    show3: false,
    showData: {},
  });
  const handleRateListModal = () => {
    axiosInstances
      .post(apiUrls.GetConvertedSalesLeadsAlert, {
        ReferProjectID: String(project[0]?.ProjectId),
      })
      .then((res) => {
        const data = res?.data?.data;

        setRateList(res?.data?.data);
        if (data?.some((item) => item.isFlash === 0)) {
          setVisible(true); // Modal khol do
        } else {
          setVisible(false); // Modal band rakho
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProject = () => {
    axiosInstances
      .post(apiUrls.ProjectSelect, {})
      .then((res) => {
        const datas = res?.data.data;
        setProject(datas);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getProject();
  }, []);

  useEffect(() => {
    if (project.length > 0) {
      handleRateListModal();
    }
  }, [project]);
  return (
    <>
      {shouldShowRateListModal && !ToggleModal && (
        <Modal
          modalWidth={"500px"}
          visible={visible}
          setVisible={setVisible}
          Header="Rate Discount Details"
          closable={true}
        >
          <FlashRateListDetails
            visible={visible}
            setVisible={setVisible}
            onCloseInnerModal={handleRateListModal}
          />
        </Modal>
      )}
      <div className="card">
        <div className="row">
          <div className="col-12">
            <Welcome />
          </div>
        </div>
      </div>
    </>
  );
};
export default ClientDashboard;
