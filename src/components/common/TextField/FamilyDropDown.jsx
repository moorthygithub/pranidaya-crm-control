import React from "react";
import { Select, Option } from "@material-tailwind/react"; // Ensure correct import

const FamilyDropDown = ({ label, options, onChange }) => {
  return (
    <div className="w-full">
      <Select label={label} onChange={onChange}>
        {options.map((option, index) => (
          <Option key={index} value={option.family_full_name}>
            {option.family_full_name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default FamilyDropDown;
