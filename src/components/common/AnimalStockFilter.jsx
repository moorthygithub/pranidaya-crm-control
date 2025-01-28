import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";

const AnimalStockFilter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleButtonClick = (path) => {
    navigate(path);
  };
  const buttons = [
    {
      label: "Animal Type",
      path: "/animalStock",
      color: "from-pink-500 to-orange-400",
    },
    {
      label: "Born or Arrival",
      path: "/animal-born-arrival",
      color: "from-orange-500 to-cyan-400",
    },
    {
      label: "Meet",
      path: "/animal-meet",
      color: "from-blue-500 to-cyan-400",
    },
    {
      label: "Death/Given",
      path: "/animal-dead",
      color: "from-blue-500 to-cyan-400",
    },
    {
      label: "Animal Stock",
      path: "/animal-stock",
      color: "from-red-500 to-cyan-400",
    },
  ];
  return (
    // <Layout>
    <div className="flex flex-wrap justify-between mt-6 gap-4">
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
    // </Layout>
  );
};

export default AnimalStockFilter;
