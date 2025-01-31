import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../../layout/Layout";
import Fields from "../../../components/common/TextField/TextField";
import { toast } from "react-toastify";
import { BaseUrl } from "../../../base/BaseUrl";
import {
  inputClass,
  inputClassBack,
} from "../../../components/common/Buttoncss";

// Unit options for dropdown
const AnimalGender = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const CreateAnimal = () => {
  const navigate = useNavigate();

  const [animal, setAnimal] = useState({
    animal_type: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setAnimal({
      ...animal,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      animal_type: animal.animal_type,
    };

    const isValid = document.getElementById("addIndiv").checkValidity();

    if (isValid) {
      setIsButtonDisabled(true);
      axios
        .post(`${BaseUrl}/create-animalType`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.data.code == "200") {
            toast.success("Animal  Created Successfully");
            navigate("/animalStock");
          } else {
            toast.error("Error occurred");
          }
        })
        .catch(() => {
          toast.error("An error occurred, please try again.");
          setIsButtonDisabled(false);
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };

  const handleBackButton = () => {
    navigate("/animalStock");
  };

  return (
    <Layout>
      <div>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <div className="flex mb-4">
            <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
              Create Animal Type
            </h1>
          </div>
          <form id="addIndiv" onSubmit={onSubmit}>
            {/* Purchase Details */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 my-4">
              <div className="mb-4">
                <Fields
                  required
                  type="textField"
                  label="Animal Type"
                  value={animal.animal_type}
                  onChange={onInputChange}
                  name="animal_type"
                />
              </div>
            </div>

            <div className="flex justify-center mt-4 space-x-4">
              <button
                type="submit"
                disabled={isButtonDisabled}
                className={`${inputClass} ${
                  isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isButtonDisabled ? "Submitting..." : "Submit"}
              </button>
              <button className={inputClassBack} onClick={handleBackButton}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateAnimal;
