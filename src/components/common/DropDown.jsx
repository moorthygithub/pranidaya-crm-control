import React from "react";
import { Select, Option } from "@material-tailwind/react"; // Adjust the import based on your library

const Dropdown = ({
  label,
  options,
  onChange,
  disabled,
  value,
  labelProps,
  required,
}) => {
  return (
    <div className="w-full">
      <Select
        label={
          <>
            {label}
            {required && <span className="text-red-500 text-sm ml-1">*</span>}
          </>
        }
        onChange={onChange}
        disabled={disabled}
        value={value}
        required={required}
        className="!text-gray-500"
        labelProps={{
          className: `text-gray-500 ${
            disabled ? "text-gray-300" : "text-black"
          }`,
          ...labelProps,
        }}
      >
        {options.map((option, index) => (
          <Option key={index} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default Dropdown;
