import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
const CommonListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleButtonClick = (path) => {
    navigate(path);
  };
  const buttons = [
    {
      label: "Donor",
      path: "/donor-list",
      color: "from-orange-500 to-teal-400",
    },
    {
      label: "Duplicate",
      path: "/duplicate",
      color: "from-pink-500 to-orange-400",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2  gap-4 mt-6">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`w-full md:w-auto flex-1 py-2 px-4 text-white rounded-lg transition-all ${
              location.pathname === button.path
                ? `bg-gradient-to-r ${button.color} shadow-lg transform -translate-y-1`
                : "bg-blue-200"
            }`}
            onClick={() => handleButtonClick(button.path)}
          >
            {button.label}
          </button>
        ))}
      </div>
    </>
  );
};

export default CommonListing;
