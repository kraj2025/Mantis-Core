import React from "react";
import { MultiSelect } from "primereact/multiselect";

const MultiSelectComp = (props) => {
  const {
    respclass,
    dynamicOptions,
    value,
    handleChange,
    name,
    placeholderName,
    lable, // <-- Add this to pass label name like "Status"
  } = props;

  const truncate = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
  };

  const itemTemplate = (option) => {
    return <div>{truncate(option.name, 25)}</div>;
  };

  const styleInline = {
    fontWeight: "500",
    display: "block",
    position: "absolute",
    top: "-5px",
    left: "16px",
    background: "#fff",
    height: "fit-content",
    margin: "0 !important",
    lineHeight: "11px",
  };

  return (
    <div className={respclass}>
      <div className="form-controls mb-2">
        {lable && (
          <label
            htmlFor={name}
            className="form-label"
            style={{ fontWeight: "500", display: "block", ...styleInline }}
          >
            {lable}
          </label>
        )}
        <MultiSelect
          filter
          value={value}
          onChange={(e) => handleChange(name, e.value)}
          options={dynamicOptions}
          optionLabel="name"
          placeholder={placeholderName}
          maxSelectedLabels={3}
          className="multiselect w-100"
          name={name}
          closeIcon
          itemTemplate={itemTemplate}
        />
      </div>
    </div>
  );
};

export default MultiSelectComp;
