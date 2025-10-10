import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Heading from '../../UI/Heading';
import Tables from '../../UI/customTable';
import { AIReportsAIClientDetails } from '../../../networkServices/chatAPI';
import Modal from '../../modalComponent/Modal';
import PatientViewAnswer from './PatientViewAnswer';
import moment from 'moment';
import axios from 'axios';

const PatientVisitAI = ({ dashboardDetail }) => {
    const [t] = useTranslation();

    const [tableData, setTableData] = useState(["123123"]);
    const [apiURL, setApiURL] = useState("")
    const [modalData, setModalData] = useState({
        show: false,
        component: null,
        size: null,
        header: null,
        footer: <></>,
    });
    const THEAD = [
        { name: "S.No.", width: "1%" },
        { name: "Patient Name", width: "30%" },
        { name: "Mobile Number", width: "30%" },
        { name: "Age/Gender", width: "30%" },
        { name: "View Question", width: "30%" },
        { name: "Question Count", width: "30%" }
    ]

    const getAPIURL = async (clientCode) => {
        const apiResp = await AIReportsAIClientDetails(clientCode)
        if (apiResp?.success) {
            // debugger
            setApiURL(apiResp?.data[0]?.EndPointURL)
        }
        return apiResp?.data[0]
    }

    useEffect(() => {
        getAPIURL(dashboardDetail?.clientCode)
    }, [])
    useEffect(() => {
        debugger
        async function AIClientDashboardAPI(type, from = fromDate, to = toDate) {
            const payload = {
                "type": type,
                "clientCode": dashboardDetail?.clientCode,
                "requestID": "",
                "patientID": "",
                "fromDate": moment(from).format("YYYY-MM-DD"),
                "toDate": moment(to).format("YYYY-MM-DD"),
                "queryRequest": ""
            }
            const apiResp = await axios.post(`${apiURL}LabReport/AIClientDashboard`, payload)
            return apiResp?.data

        }

        if (apiURL) {
            const apiResp = AIClientDashboardAPI(3, new Date(), new Date())
            if (apiResp?.data?.success) {
                //  isme abhi response change kr rhe hai ek data ayega wahi dikhna h
            }

            // type 2 wala yaha pass kkrk state me rkh lena ab fromdate to date jayegi
        }

    }, [apiURL])

    const handleViewQuestion = (data) => {
        setModalData({
            show: true,
            component: <PatientViewAnswer clientCode={dashboardDetail?.clientCode} />,
            size: "large",
            header: "Yesterday's Patients in AI",
            footer: <></>,
        })
    }

    return (
        <div>
            <Tables thead={THEAD} tbody={tableData?.map((data, idx) => (
                {
                    "S.No.": idx + 1, pName: data?.pName, mobile: data?.mobile, ageGender: data?.ageGender, viewQuestion: (
                        <>
                            <button onClick={() => handleViewQuestion(data)} className='table-btn btn-success btn'>View</button>
                        </>
                    ), questionCount: data?.questionCount
                }
            ))} />
            {
                <Modal
                    visible={modalData?.show}
                    setVisible={() =>
                        setModalData({
                            show: false,
                            component: null,
                            size: null,
                        })
                    }
                    modalWidth={modalData?.size}
                    Header={modalData?.header}
                    buttonName={modalData?.buttonName}
                    modalData={modalData?.modalData}
                    footer={modalData?.footer}
                    handleAPI={modalData?.handleAPI}
                >
                    {modalData?.component}
                </Modal>
            }
        </div>
    )
}

export default PatientVisitAI