import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { inputBoxValidation, notify } from "../../../utils/utils";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../../../utils/constant";
import defaultimage from "../../../assets/image/default-profile.jpeg";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { toast } from "react-toastify";
import Loading from "../../../components/loader/Loading";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";

// declare const FB;

const UserDropdown = ({
  dropdownOpen,
  setDropdownOpen,
  isMobile,
  setLocalImage,
}) => {
  const [t] = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const GetGmail = useCryptoLocalStorage("user_Data", "get", "EmailId");
  const GetMobile = useCryptoLocalStorage("user_Data", "get", "MobileNo");
  const ProfileImage = useCryptoLocalStorage(
    "user_Data",
    "get",
    "ProfileImage"
  );

  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const [inputs, setInputs] = useState({
    MobileNo: GetMobile,
    EmailId: GetGmail,
    showDropdown: false,
    buttonName: "edit",
    preview: "",
    doctype: "",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlechange = (e) => {
    setIsDropdownOpen(true);
    setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
  };
  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    const disallowedTypes = [
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!file || disallowedTypes.includes(file.type)) {
      toast.error("Please Select only image files (not Excel or PDF).");
      return;
    }

    reader.onloadend = () => {
      setInputs((val) => ({
        ...val,
        showDropdown: !inputs?.showDropdown,
        preview: reader.result.split(",")[1],
        doctype: file?.name.split(".").pop(),
      }));
    };

    reader.readAsDataURL(file);
  };

  const uploadImageFun = () => {
    setInputs((val) => ({ ...val, showDropdown: !inputs?.showDropdown }));
  };

  const handleUpdateProfile = () => {
    if (!inputs?.EmailId) {
      toast.error("Please Enter Valid EmailID.");
      return;
    }
    if (!inputs?.MobileNo) {
      toast.error("Please Enter valid MobileNo.");
      return;
    }
    if (!inputs?.preview) {
      toast.error("Please Select Anathor Image.");
      return;
    }
    setLoading(true);
    axiosInstances
      .post(apiUrls.UpdateProfile, {
        EmailID: String(inputs?.EmailId),
        MobileNo: String(inputs?.MobileNo),
        Image_Base64: String(inputs?.preview),
        FileFormat_Base64: String(inputs?.doctype),
      })
      .then((res) => {
        if (res?.data?.success == true) {
          toast.success(res?.data?.message);
          localStorage.setItem("MobileNo", inputs?.MobileNo);
          localStorage.setItem("EmailId", inputs?.EmailId);
          localStorage.setItem("ProfileImage", inputs?.preview);
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <>
      {!isMobile ? (
        <div>
          <img
            src={ProfileImage ? ProfileImage : `${defaultimage}`}
            // src={`${defaultimage}`}
            alt=""
            width={20}
            height={20}
            className="rounded-circle"
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
            }}
          />
        </div>
      ) : (
        <img
          src={ProfileImage ? ProfileImage : `${defaultimage}`}
          width={20}
          height={20}
        ></img>
      )}
      {/* {console.log(inputs)} */}
      {dropdownOpen ? (
        <div className="manage_usermodel bg-color-container" ref={dropdownRef}>
          <div className="">
            <img
              dynamic
              image
              src={
                inputs?.preview
                  ? `data:image/${inputs?.doctype};base64,${inputs?.preview}`
                  : ProfileImage // fallback to stored image
              }
              alt=""
              style={{
                borderRadius: "50%",
                height: "100px",
                width: "100px",
                marginBottom: "2px",
              }}
              onClick={uploadImageFun}
              title="Click to Upload Image."
            />

            {(inputs?.showDropdown || !ProfileImage) && !inputs?.preview ? (
              <div className="profile-upload-btn" title="Click to Upload File">
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="fileInput"
                  className="text-white profile-upload-file"
                >
                  <p
                    className="buttonclasss m-0 p-1"
                    style={{ cursor: "pointer" }}
                  >
                    Upload Image
                  </p>
                </label>
              </div>
            ) : (
              ""
            )}

            <div className="headerUserDropdownField ">
              <div className="d-flex mb-3 ml-1 mr-1 mt-4">
                <span className="headerUserDropdownLabel">Email</span>
                <input
                  className="form-control headerUserDropdowninput"
                  placeholder="Enter Email Address"
                  type="text"
                  name="EmailId"
                  id="EmailId"
                  value={inputs?.EmailId ? inputs?.EmailId : GetGmail}
                  onChange={handlechange}
                />
              </div>
              <div className="d-flex pb-1 ml-1 mr-1 mt-2">
                <span className="headerUserDropdownLabel">Mobile</span>
                <input
                  className="form-control headerUserDropdowninput"
                  type="text"
                  name="MobileNo"
                  id="MobileNo"
                  value={inputs?.MobileNo ? inputs?.MobileNo : GetMobile}
                  placeholder="Enter Mobile No."
                  onChange={(e) => {
                    inputBoxValidation(
                      MOBILE_NUMBER_VALIDATION_REGX,
                      e,
                      handlechange
                    );
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginLeft: "auto" }}>
            {loading ? (
              <Loading />
            ) : (
              <button
                type="button"
                className="text-black rounded Edit_detail ml-0"
                onClick={handleUpdateProfile}
              >
                {t("Update Details")}
              </button>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default UserDropdown;
