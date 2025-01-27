import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import Layout from "../../../layout/Layout";
import Fields from "../../../components/common/TextField/TextField";
import { toast } from "react-toastify";
import { BaseUrl } from "../../../base/BaseUrl";
import { useQuery } from "@tanstack/react-query";
import Dropdown from "../../../components/common/DropDown";
import { Button } from "@material-tailwind/react";

// Unit options for dropdown
const AnimalStatus = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditAnimal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState({
    animal_type: "",
    animal_type_status: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Fetch data by ID
  const fetchAnimalById = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BaseUrl}/fetch-animalType-by-id/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data?.animalType ?? {};
  };

  const {
    data: fetchedAnimal,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["AnimalListId", id],
    queryFn: fetchAnimalById,
    enabled: !!id, // Ensure the query only runs if id exists
  });

  // Set fetched data to state when available
  useEffect(() => {
    if (fetchedAnimal) {
      setAnimal(fetchedAnimal);
    }
  }, [fetchedAnimal]);

  const onInputChange = (e) => {
    setAnimal({
      ...animal,
      [e.target.name]: e.target.value,
    });
  };
  const onInputChangeN = (name, value) => {
    console.log("Dropdown Change:", name, value); // Debugging dropdown changes
    setAnimal({
      ...animal,
      [name]: value,
    });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const data = {
      animal_type_status: animal.animal_type_status,
    };

    const isValid = document.getElementById("editAnimalForm").checkValidity();

    if (isValid) {
      setIsButtonDisabled(true);
      try {
        const res = await axios.put(
          `${BaseUrl}/update-animalType/${id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.code == "200") {
          toast.success("Animal Updated Successfully");
          navigate("/animalStock");
        } else {
          toast.error("Error occurred");
        }
      } catch (error) {
        toast.error("An error occurred, please try again.");
      } finally {
        setIsButtonDisabled(false);
      }
    }
  };

  const handleBackButton = () => {
    navigate("/animalStock");
  };

  return (
    <Layout>
      <div>
        <div className="flex mb-4 mt-6">
          <MdKeyboardBackspace
            onClick={handleBackButton}
            className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
          />
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
            Edit Animal Stock
          </h1>
        </div>

        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p className="text-red-500">Error loading data.</p>
          ) : (
            <form id="editAnimalForm" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 my-4">
                <div className="mb-4">
                  <Fields
                    required
                    type="textField"
                    label="Animal Type"
                    value={animal.animal_type}
                    onChange={onInputChange}
                    name="animal_type"
                    disabled
                    labelProps={{
                      className: "!text-gray-500",
                    }}
                  />
                </div>
                <div>
                  <Dropdown
                    label="Status"
                    className="required"
                    value={animal.animal_type_status}
                    name="animal_type_status"
                    required={true}
                    options={AnimalStatus}
                    onChange={(value) =>
                      onInputChangeN("animal_type_status", value)
                    }
                  />
                </div>
              </div>

              <div className="flex justify-center mt-4 space-x-4">
                <Button
                  type="submit"
                  disabled={isButtonDisabled}
                  className="mt-4  bg-blue-400"
                >
                  Update
                </Button>
                <Button className="mt-4 bg-red-400" onClick={handleBackButton}>
                  Back
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EditAnimal;
