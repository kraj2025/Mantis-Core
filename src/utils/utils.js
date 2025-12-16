import { toast } from "react-toastify";


export const notify = (message, type = "success") => {
  if (type === "success") {
    toast.success(message);
  } else if (type === "warn") {
    toast.warn(message);
  } else if (type === "error") {
    toast.error(message);
  }
};

export const filterByType = (state, type, filterKey, labelKey, valueKey) => {
  if (state?.length) return state
    ?.filter((ele) => ele[filterKey] === type)
    ?.map((ele) => {
      return {
        label: ele?.[labelKey],
        value: ele?.[valueKey],
      };
    });
};

export const filterByTypes = (
  data,
  type,
  filterKeys,
  labelKey,
  valueKey,
  extraColomn
) => {
  // ele[filterKeys[0]] === type[0] && ele[filterKeys[1]] === type[1]
  if (data?.length) return data
    ?.filter((ele) => {
      return filterKeys?.every((key, index) => {
        return typeof type[index] === "object"
          ? type[index].includes(ele[key])
          : ele[key] === type[index];
      });
    })
    ?.map((ele) => {
      return {
        label: ele?.[labelKey],
        value: ele?.[valueKey],
        extraColomn: ele?.[extraColomn],
      };
    });
};

export const BindStateByCountry = (
  state,
  type,
  filterKey,
  labelKey,
  valueKey,
  filterID,
  filterIDKey
) => {
  return state
    ?.filter((ele) => ele[filterKey] === type && ele[filterIDKey] === filterID)
    ?.map((ele) => {
      return {
        label: ele?.[labelKey],
        value: ele?.[valueKey],
      };
    });
};

export const BindDistrictByCountryByState = (
  state,
  type,
  filterKey,
  labelKey,
  valueKey,
  CountryID,
  StateID
) => {
  return state
    ?.filter(
      (ele) =>
        ele[filterKey] === type &&
        ele["StateID"] === parseInt(StateID) &&
        ele["CountryID"] === CountryID
    )
    ?.map((ele) => {
      return {
        label: ele?.[labelKey],
        value: ele?.[valueKey],
      };
    });
};

export const BindCityBystateByDistrict = (
  state,
  type,
  filterKey,
  labelKey,
  valueKey,
  stateID,
  districtID
) => {
  return state
    ?.filter(
      (ele) =>
        ele[filterKey] === type &&
        ele["StateID"] === stateID &&
        ele["DistrictID"] === districtID
    )
    ?.map((ele) => {
      return {
        label: ele?.[labelKey],
        value: ele?.[valueKey],
      };
    });
};

export const handleReactSelectDropDownOptions = (state, labelKey, valueKey) => {
  return state?.map((ele, index) => {
    return {
      ...ele,
      label: ele[labelKey],
      value: ele[valueKey],
    };
  });
};

export const ReactSelectisDefaultValue = (state, keyName) => {
  return state?.find((ele) => ele[keyName] === 1);
};

export const isArrayFunction = (params) => {
  return Array.isArray(params) ? params : [];
};

export function renameKeys(obj, newKeys) {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

export const bindLabelValue = (label, value) => {
  return { label: label ? label : " ", value: value ? value : " " };
};

export const handletab = (formRef) => {
  const handleTabKey = (event) => {
    if (event.key === "Tab") {

      const allFields = Array.from(
        formRef.current.querySelectorAll("input")
      );

      let requiredFields = allFields.filter(el => el.classList.contains('required-fields'));
      let optionalFields = allFields.filter(el => !el.classList.contains('required-fields'));

      requiredFields = requiredFields.filter(el => !el.classList.contains('disable-focus'));
      optionalFields = optionalFields.filter(el => !el.classList.contains('disable-focus'));

      const currentElement = document.activeElement;
      const currentIndex = allFields.indexOf(currentElement);
      if (currentIndex !== -1) {
        event.preventDefault();

        let nextElement;

        if (requiredFields.includes(currentElement)) {
          // Move to the next required field
          let nextIndex = (requiredFields.indexOf(currentElement) + 1) % requiredFields.length;
          nextElement = requiredFields[nextIndex];
        } else {
          // Move to the next optional field
          let nextIndex = (optionalFields.indexOf(currentElement) + 1) % optionalFields.length;
          nextElement = optionalFields[nextIndex];
        }
               if (nextElement) {
          nextElement.focus();
        }
      }
    }
  };

  const form = formRef.current;
  form.addEventListener("keydown", handleTabKey);

  return () => {
    form.removeEventListener("keydown", handleTabKey);
  };
};

export const findSumBillAmount = (data, key) => {
  const value = data?.reduce((acc, current) => acc + Number(current[key]), 0);
  return Number(value);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const parseSubCategoryString = (dataString) => {
  const parts = dataString.replace(/[{}]/g, "").split(", ");
  const dataObject = {};
  parts.forEach((part) => {
    const [key, value] = part.split(" = ");
    if (key && value) {
      dataObject[key.trim()] = value.trim();
    }
  });

  return dataObject;
};

export const reactSelectOptionList = (data, labelKey, valueKey) => {
  return data?.map((ele) => {
    return {
      label: ele?.[labelKey],
      value: ele?.[valueKey],
    };
  });
};

export const removeBase64Data = (base64Img) => {
  const prefixPattern = /^data:image\/[a-zA-Z]+;base64,/;
  return base64Img?.replace(prefixPattern, "");
};

export const inputBoxValidation = (regx, e, handleChange) => {
  const { value } = e.target;
  if (regx?.test(value)) {
    handleChange(e);
  }
};
export const ageValidation = (regx, e, handleChange, AgeType) => {
  const { value } = e.target;
  if (AgeType === "YRS") {
    if (parseInt(value?.split(".")[1]) > 11) return false;
    if (regx?.test(value)) {
      handleChange(e);
    }
  } else if (AgeType === "MONTH(S)") {
    if (parseInt(value?.split(".")[1]) > 30) return false;
    if (parseInt(value) > 11) return false;
    if (regx?.test(value)) {
      handleChange(e);
    }
  } else if (AgeType === "DAYS(S)") {
    if (parseInt(value) > 30) return false;
    if (regx?.test(value)) {
      handleChange(e);
    }
  }
}


export const speakMessage = (message) => {
  const utterance = new SpeechSynthesisUtterance(message);
  const setFemaleVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    // Try to find a female voice based on common name patterns
    let femaleVoice = voices.find(voice =>
      voice.name.toLowerCase().includes("female") ||
      voice.name.toLowerCase().includes("susan") ||
      voice.name.toLowerCase().includes("samantha") ||
      voice.name.toLowerCase().includes("zira") || // Windows
      (voice.gender && voice.gender.toLowerCase() === "female")
    );
    // Fallback to an English voice if no clear female voice is found
    if (!femaleVoice) {
      femaleVoice = voices.find(voice => voice.lang.toLowerCase().includes("en"));
    }
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    window.speechSynthesis.speak(utterance);
  };
  // If voices are not yet loaded, wait for them
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = setFemaleVoice;
  } else {
    setFemaleVoice();
  }
};





