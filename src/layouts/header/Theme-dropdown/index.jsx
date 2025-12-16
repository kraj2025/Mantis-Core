import { StyledDropdown } from "@app/styles/common";
import { Fragment, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { addWindowClass, removeWindowClass } from "@app/utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import { useLocalStorage } from "@app/utils/hooks/useLocalStorage";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { headers } from "../../../utils/apitools";
import { toast } from "react-toastify";
import axios from "axios";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { axiosInstances } from "../../../networkServices/axiosInstance";

const themes = [
  // {
  //     theme: 'blue_theme',
  //     icon: 'blue_icon',
  //     label: 'Blue',
  // },
  {
    theme: "default_theme",
    icon: "default_icon",
    label: "Default",
  },
  {
    theme: "peach_theme",
    icon: "peach_icon",
    label: "Peach",
  },
  // {
  //   theme: "pale_pink_theme",
  //   icon: "pale_pink_icon",
  //   label: "Pale Pink",
  // },
  // {
  //   theme: "red_theme",
  //   icon: "red_icon",
  //   label: "Red",
  // },
  {
    theme: "sky_blue_theme",
    icon: "sky_blue_icon",
    label: "Blue",
  },
  {
    theme: "light_blue_theme",
    icon: "light_blue_icon",
    label: "Light Blue",
  },
  {
    theme: "gray_theme",
    icon: "gray_icon",
    label: "Gray",
  },
  {
    theme: "yellow_theme",
    icon: "yellow_icon",
    label: "Olive Green",
  },
  // {
  //   theme: "green_theme",
  //   icon: "green_icon",
  //   label: "Green",
  // },
  {
    theme: "purple_theme",
    icon: "purple_icon",
    label: "Purple",
  },
  {
    theme: "orange_theme",
    icon: "orange_icon",
    label: "Orange",
  },
  // {
  //   theme: "coral_theme",
  //   icon: "coral_icon",
  //   label: "Coral",
  // },
  {
    theme: "darkolivegreen_theme",
    icon: "darkolivegreen_icon",
    label: "Dark Olive Green",
  },
  // {
  //   theme: "pink_theme",
  //   icon: "pink_icon",
  //   label: "Pink",
  // },
  {
    theme: "darkpink_theme",
    icon: "darkpink_icon",
    label: "Pink",
  },
  // {
  //   theme: "teal_theme",
  //   icon: "teal_icon",
  //   label: "Teal",
  // },
  // {
  //   theme: "lightbrown_theme",
  //   icon: "lightbrown_icon",
  //   label: "Light Brown",
  // },
  // {
  //   theme: "grayisholivegreen_theme",
  //   icon: "grayisholivegreen_icon",
  //   label: "Grayish Olive Green",
  // },
  {
    theme: "cyan_theme",
    icon: "cyan_icon",
    label: "Cyan",
  },
  {
    theme: "darkgreen_theme",
    icon: "darkgreen_icon",
    label: "Green",
  },
];

const LanguagesDropdown = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const theme = useCryptoLocalStorage("user_Data", "get", "theme");
  // const theme = useLocalStorage("theme", "get");
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    addWindowClass(theme);
  }, [theme]);

  const handleThemeApi = (item) => {
    axiosInstances
      .post(apiUrls?.UpdateThemeColor, {
        ThemeColor: String(item),
      })
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSelect = (eventKey) => {
    handleThemeApi(eventKey);
    // useLocalStorage("theme", "set", eventKey);
    useCryptoLocalStorage("user_Data", "set", "theme", eventKey);
    addWindowClass(eventKey);
    if (eventKey !== theme) {
      removeWindowClass(theme);
    }

    let selectedTheme = themes?.find((theme) => theme?.theme === eventKey);

    setSelectedValue(selectedTheme);
  };

  function handleClick(event, theme, index) {
    event.preventDefault();
    setActiveIndex(index);
    setSelectedValue(theme);
  }

  return (
    <>
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle
          id="dropdown-basic"
          bsPrefix="custom-toggle"
          className="p-0 mx-1 theme-class"
        >
          <FontAwesomeIcon
            icon={faPalette}
            onClick={() => setActiveIndex(null)}
            // style={{ padding: "10px" }}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {themes?.map((theme, index) => {
            return (
              <Fragment key={index}>
                <Dropdown.Item
                  eventKey={theme?.theme}
                  style={{ position: "relative" }}
                >
                  <span className={theme?.icon}> </span>
                  <span
                    className="ml-1"
                    onContextMenu={(e) => {
                      handleClick(e, theme?.theme, index);
                    }}
                  >
                    {theme?.label}
                  </span>
                  {activeIndex === index && (
                    <div className={`theme-save`}>
                      <button
                        onClick={() => {
                          handleSelect(selectedValue);
                        }}
                        className="text-white rounded"
                      >
                        Save theme
                      </button>
                    </div>
                  )}
                </Dropdown.Item>
              </Fragment>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default LanguagesDropdown;
