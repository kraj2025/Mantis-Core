import React, { useEffect, useState } from "react";
import Input from "../components/formComponent/Input";
import Tables from "../components/UI/customTable";
import {
  querySaveTHEAD,
  searchQueryTHEAD,
} from "../components/modalComponent/Utils/HealperThead";
import { Link } from "react-router-dom";
import Heading from "../components/UI/Heading";
import Modal from "../components/modalComponent/Modal";
import AddResultQueryModal from "../components/UI/customTable/AddResultQueryModal";
import SaveQueryMasterModal from "../components/UI/customTable/SaveQueryMasterModal";
import ReactSelect from "../components/formComponent/ReactSelect";
import { headers } from "../utils/apitools";
import axios from "axios";
import { apiUrls } from "../networkServices/apiEndpoints";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../networkServices/axiosInstance";
const QueryVsResultMaster = () => {
  const [query, setQuery] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [product, setProduct] = useState([]);
  const [modules, setModules] = useState([]);
  const [formData, setFormData] = useState({
    Query: "",
    Product: "",
    Module: "",
  });

  const handleDeliveryChange = (name, e) => {
    const { value } = e;
    if (name == "Product") {
      setFormData({
        ...formData,
        [name]: value,
      });
      getQuery(value, "Product");
    } else if (name == "Module") {
      setFormData({ ...formData, [name]: value });

      getQuery(value, "Module");
    } else if (name == "Query") {
      setFormData({ ...formData, [name]: value });
      getQuery(value, "Query");
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleUpdate = () => {
    alert("update done");
  };

  const getQueryTable = () => { };
  const [visible, setVisible] = useState({
    showVisible: false,
    saveQueryVisible: false,
    showData: {},
  });
  const getProduct = () => {
    let form = new FormData();
    form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
      form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname")),
      axios
        .post(apiUrls?.GetProductVersion, form, { headers })
        .then((res) => {
          const assigntos = res?.data.data.map((item) => {
            return { label: item?.NAME, value: item?.id };
          });
          setProduct(assigntos);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const getModules = () => {
    axiosInstances
      .post(apiUrls.GetClientModuleList, {

      })
      .then((res) => {
        const assigntos = res?.data.data.map((item) => {
          return { label: item?.ModuleName, value: item?.ID };
        });
        setModules(assigntos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getQuery = (value, type) => {
    // let form = new FormData();
    // form.append("ID", useCryptoLocalStorage("user_Data", "get", "ID")),
    //   form.append("LoginName", useCryptoLocalStorage("user_Data", "get", "realname")),
    //   // form.append("IsActive", ""),
    //   form.append("ProductID", type == "Product" ? value : formData?.Product),
    //   form.append("ModuleID", type == "Module" ? value : formData?.Module),
    //   form.append("QueryID", type == "Query" ? value : formData?.Query),
    // form.append("SearchType", "Result_Select"),
    // axiosInstances
    // .post(apiUrls?.QueryVsResult_Select, form, { headers })
    const payload = {
      ProductID: Number(type == "Product" ? value : formData?.Product) || 0,
      ModuleID: Number(type == "Module" ? value : formData?.Module) || 0,
      QueryID: Number(type == "Query" ? value : formData?.Query) || 0,
      SearchType: "Result_Select",
      IsActive: 0, // API expects 0 or 1, not ""

    };

    axiosInstances
      .post(apiUrls.QueryVsResult_Select, payload)
      .then((res) => {
        console.log(res?.data?.data);
        const assigntos = res?.data.data.map((item) => {
          return { label: item?.Query, value: item?.QueryID };
        });
        setQuery(assigntos);

        if (type == "Query") {
          setTableData(res?.data?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getQueryTable();
    getModules();
    getProduct();
  }, []);

  function transformdata(dataArray) {
    const result = [];

    dataArray.forEach((item) => {
      // Split ItemName by comma to handle multiple items
      const itemNames = item.ItemName.split(",");

      itemNames.forEach((testName) => {
        // Trim the testName to remove any extra spaces
        testName = testName.trim();

        // Find or create the Centre
        let centre = result.find((c) => c.Centre === item.Centre);
        if (!centre) {
          centre = {
            Centre: item.Centre,
            Clients: [],
          };
          result.push(centre);
        }

        // Find or create the Client within the Centre
        let client = centre.Clients.find(
          (c) => c.ClientName === item.ClientName
        );
        if (!client) {
          client = {
            ClientName: item.ClientName,
            Patients: [],
          };
          centre.Clients.push(client);
        }

        // Find or create the Patient within the Client
        let patient = client.Patients.find((p) => p.PatientName === item.PName);
        if (!patient) {
          patient = {
            PatientName: item.PName,
            AgeGender: item.Age, // Extracting Age and Gender
            Doctor: item.DoctorName,
            VisitNo: item?.LedgerTransactionNo,
            BillingType: item.BillType || "",
            Items: [],
          };
          client.Patients.push(patient);
        }

        // Add the Test Item to the Patient's Items array
        patient.Items.push({
          TestName: testName,
          NetAmount: item.Amount / itemNames.length,
          BillType: item?.BillType, // Divide the total amount equally among the items
        });
      });
    });
    console.log(result);

    return result;
  }

  return (
    <>
      <Modal
        modalWidth={"800px"}
        visible={visible?.showVisible}
        setVisible={setVisible}
        tableData={formData}
        Header={"Result Master"}
      >
        <AddResultQueryModal
          visible={visible?.showVisible}
          setVisible={setVisible}
          tableData={formData}
        />
      </Modal>
      <Modal
        modalWidth={"800px"}
        visible={visible?.saveQueryVisible}
        setVisible={setVisible}
        tableData={formData}
        Header={"Query Master "}
      >
        <SaveQueryMasterModal
          visible={visible?.saveQueryVisible}
          setVisible={setVisible}
          tableData={formData}
        />
      </Modal>
      <div className="card">
        <Heading title="Search Query Master" isBreadcrumb={true} />
        <div className="row g-4 m-2">
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Product"
            placeholderName="Product"
            dynamicOptions={product}
            value={formData?.Product}
            handleChange={handleDeliveryChange}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Module"
            placeholderName="Module"
            dynamicOptions={modules}
            value={formData?.Module}
            handleChange={handleDeliveryChange}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Query"
            placeholderName="Query"
            dynamicOptions={query}
            className="Query"
            handleChange={handleDeliveryChange}
            value={formData.Query}
          />
          <div className="col-2 d-flex">
            <button
              className="btn btn-sm btn-success"
              onClick={() => {
                setVisible({ saveQueryVisible: true });
              }}
            >
              Add Query
            </button>
            <button
              className="btn btn-sm btn-success ml-3"
              onClick={() => {
                setVisible({ showVisible: true });
              }}
            >
              Add Result
            </button>
          </div>
        </div>
      </div>
      <div className="card mt-2">
        {/* <Tables
          thead={searchQueryTHEAD}
          tbody={tableData?.map((ele, index) => ({
            "S.No.": index + 1,
            SolutionBy: <span>{ele?.ResultCreatedBy}</span>,
            OnDate: ele?.ResultCreatedBy1,
            Solution: ele?.Result,
            View:
              ele?.FileName !== "" ? (
                <i
                  className="fa fa-eye"
                  title="Click To View Docs."
                  style={{ cursor: "pointer" }}
                  // onClick={() =>
                  //   alert(
                  //     `Viewing details for ${
                  //       Array.isArray(ele?.Result)
                  //         ? ele.Result.join(", ")
                  //         : ele?.Result || "No Result"
                  //     }`
                  //   )
                  // }
                  onClick={() => window.open(ele?.FileUrl, "_blank")}
                ></i>
              ) : (
                "No Docs Upload"
              ),
          }))}
          tableHeight={"tableHeight"}
        /> */}
        <table className="content-table">
          <thead>
            <tr>
              <th>Steps</th>
              <th>Comments</th>
              <th>User Info</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="steps-column">
                <p>This worked for me and it's easy..</p>
                <ol>
                  <li>Hover over IIS taskbar icon.</li>
                  <li>Right click on miniature popup.</li>
                  <li>Click on Maximize.</li>
                </ol>
                <p className="edit-info">edited Jan 19, 2016 at 5:22</p>
              </td>

              <td className="comments-column">
                <div className="comments">
                  <p>😟 something so simple took an hour to find people were recommending a Windows reinstall. Thank you!!</p>
                  <p className="comment-info">– dynamiclynk Dec 13, 2023 at 21:31</p>

                  <p>incredible, why was it even like this in the first place lol.</p>
                  <p className="comment-info">– Fuey500 Sept 15, 2024 at 16:31</p>

                  <p>9 years and this isn't fixed...</p>
                  <p className="comment-info">– Abcd Mar 15 at 12:56</p>
                </div>
              </td>
              <td className="user-info-column">
                <div className="user-info">
                  <img src="https://via.placeholder.com/50" alt="User Avatar" className="avatar" />
                  <div>
                    <p className="username">Lotus</p>
                    <p className="details">6,525 ● 6 ● 34 ● 51</p>
                    <p className="date">answered Sept 14, 2024 at 6:57</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
export default QueryVsResultMaster;
