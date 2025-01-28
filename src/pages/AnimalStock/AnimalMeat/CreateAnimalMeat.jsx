import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import Layout from "../../../layout/Layout";
import Fields from "../../../components/common/TextField/TextField";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import { BaseUrl } from "../../../base/BaseUrl";
import {
  Button,
  Input,
  Option,
  Select,
  Spinner,
} from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import Dropdown from "../../../components/common/DropDown";
import moment from "moment";

// Unit options for dropdown
const AnimalGender = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const CreateAnimalMeat = () => {
  const navigate = useNavigate();
  const todayDate = moment().format("YYYY-MM-DD");

  const [animalmeet, setAnimalMeet] = useState({
    animal_male_no: "",
    animal_female_no: "",
    animal_meet_date: todayDate,
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const fetchAnimalMeetMaleList = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BaseUrl}/fetch-animalType-by-value/Male`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data?.animalType ?? [];
  };
  const fetchAnimalMeetFemaleList = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BaseUrl}/fetch-animalType-by-value/Female`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data?.animalType ?? [];
  };

  const onInputChange = (e) => {
    setAnimalMeet({
      ...animalmeet,
      [e.target.name]: e.target.value,
    });
  };

  const onInputChangeN = (name, value) => {
    setAnimalMeet({
      ...animalmeet,
      [name]: value,
    });
  };

  const { data: AnimalMeetMaleData } = useQuery({
    queryKey: ["MaleList"],
    queryFn: fetchAnimalMeetMaleList,
  });
  const { data: AnimalMeetFemaleData } = useQuery({
    queryKey: ["FemaleList"],
    queryFn: fetchAnimalMeetFemaleList,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      animal_male_no: animalmeet.animal_male_no,
      animal_female_no: animalmeet.animal_female_no,
      animal_meet_date: animalmeet.animal_meet_date,
      // animal_baby_no: animalmeet.animal_baby_no,
      // animal_baby_date: animalmeet.animal_baby_date,
    };

    const isValid = document.getElementById("addIndiv").checkValidity();

    if (isValid) {
      setIsButtonDisabled(true);
      axios
        .post(`${BaseUrl}/create-animalMeet`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.data.code == "200") {
            toast.success("Animal Meet Created Successfully");
            navigate("/animal-meet");
          } else {
            toast.error("Error occurred");
          }
        })
        .catch(() => {
          toast.error("An error occurred, please try again.");
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };

  const handleBackButton = () => {
    navigate("/animal-meet");
  };

  // if (isLoading)
  //   return (
  //     <Layout>
  //       {" "}
  //       <div className="flex justify-center items-center h-64">
  //         <Spinner className="h-6 w-6" />
  //       </div>
  //     </Layout>
  //   );
  // if (isError) return <Layout>Error loading data.</Layout>;

  return (
    <Layout>
      <div>
        <div className="flex mb-4 mt-6">
          <MdKeyboardBackspace
            onClick={handleBackButton}
            className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
          />
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
            Create Animal Meet 
          </h1>
        </div>

        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form id="addIndiv" onSubmit={onSubmit}>
            {/* Purchase Details */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 my-4">
              <div>
                <Dropdown
                  label="Male Govt Id"
                  className="required"
                  name="animal_male_no"
                  value={animalmeet.animal_male_no}
                  options={
                    AnimalMeetMaleData?.map((animal, index) => ({
                      value: animal.animal_type_no,
                      label: animal.animal_type_no,
                    })) ?? []
                  }
                  onChange={(value) => onInputChangeN("animal_male_no", value)}
                />
              </div>
              <div>
                <Dropdown
                  label="Female Govt Id"
                  className="required"
                  name="animal_female_no"
                  value={animalmeet.animal_female_no}
                  options={
                    AnimalMeetFemaleData?.map((animal, index) => ({
                      value: animal.animal_type_no,
                      label: animal.animal_type_no,
                    })) ?? []
                  }
                  onChange={(value) =>
                    onInputChangeN("animal_female_no", value)
                  }
                />
              </div>

              <div>
                <Input
                  required
                  label="Meet Date"
                  type="date"
                  value={animalmeet.animal_meet_date}
                  onChange={onInputChange}
                  name="animal_meet_date"
                />
              </div>
            </div>

            <div className="flex justify-center mt-4 space-x-4">
              <Button
                type="submit"
                disabled={isButtonDisabled}
                className="mt-4  bg-blue-400"
              >
                Submit
              </Button>
              <Button className="mt-4 bg-red-400" onClick={handleBackButton}>
                Back
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateAnimalMeat;
