import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import Layout from "../../../layout/Layout";
import Fields from "../../../components/common/TextField/TextField";
import { toast } from "react-toastify";
import { Button, IconButton } from "@mui/material";
import { BaseUrl } from "../../../base/BaseUrl";
import { Input, Option, Select, Spinner } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import Dropdown from "../../../components/common/DropDown";
import moment from "moment";

const EditAnimalMeat = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [animalmeet, setAnimalMeet] = useState({
    animal_male_no: "",
    animal_female_no: "",
    animal_meet_date: "",
    animal_baby_no: "",
    animal_baby_date: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const fetchAnimalById = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BaseUrl}/fetch-animalMeet-by-id/${id}`,
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
  useEffect(() => {
    if (fetchedAnimal) {
      setAnimalMeet({
        ...fetchedAnimal,
        animal_meet_date: moment(fetchedAnimal.animal_meet_date).format(
          "YYYY-MM-DD"
        ),
        animal_baby_date: moment(fetchedAnimal.animal_baby_date).format(
          "YYYY-MM-DD"
        ),
      });
    }
  }, [fetchedAnimal]);

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
      animal_baby_no: animalmeet.animal_baby_no,
      animal_baby_date: animalmeet.animal_baby_date,
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
            Edit Animal Meet Stock
          </h1>
        </div>

        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form id="addIndiv" onSubmit={onSubmit}>
            {/* Purchase Details */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 my-4">
              <div>
                <Dropdown
                  label="Male No"
                  className="required"
                  name="animal_male_no"
                  value={animalmeet.animal_male_no}
                  disabled={true}
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
                  label="Female No"
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
                  disabled
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
                  disabled
                  labelProps={{
                    className: "!text-gray-500",
                  }}
                />
              </div>

              <div className="mb-4">
                <Fields
                  required
                  type="textField"
                  label="Animal Baby No"
                  value={animalmeet.animal_baby_no}
                  onChange={onInputChange}
                  name="animal_baby_no"
                />
              </div>
              <div className="mb-4">
                <Input
                  required
                  type="date"
                  label="Animal Date"
                  value={animalmeet.animal_baby_date}
                  onChange={onInputChange}
                  name="animal_baby_date"
                />
              </div>
            </div>

            <div className="flex justify-center mt-4 space-x-4">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isButtonDisabled}
                className="mt-4"
              >
                Submit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className="mt-4"
                onClick={handleBackButton}
              >
                Back
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditAnimalMeat;
